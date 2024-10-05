import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import dayjs from 'dayjs';
import { Timestamp } from 'firebase/firestore';
import Modal from '@mui/material/Modal';
import { CheckCircleFill } from 'styled-icons/bootstrap';
import { Checkbox, FormControlLabel } from '@mui/material';
import { useDebounce } from 'usehooks-ts';

import Button from './Button';
import logo from '../assets/logo/logo_short.png';
import { ReactComponent as DiscountIcon } from '../assets/icons/noto_confetti.svg';
import { userStore } from '../store/userStore';
import {
  createSubscriptionDocWithOrderId,
  updateSubscriptionDoc,
} from '../services/subscriptionService';
import { loadScript } from '../services/paymentService';
import { formatCurrency } from '../constants/formatter';
import { BACKEND_URL } from '../utils/api';
import { ICategory, ISelectedPlan, TInfluencerDB } from '../constants/types';
import CustomModal from './Modal';
import TemporaryPaymentModal from './Modal/TemporaryPaymentModal';
import { config } from '../constants/config';
import { getReferralCodeDetails } from '../services/referralService';
import { calculateReferralDiscount } from '../utils/helpers';
import toast from 'react-hot-toast';

interface IPaymentDetailsProps {
  selectedPlan: ISelectedPlan;
  setApplyOffer: React.Dispatch<React.SetStateAction<boolean>>;
  applyOffer: boolean;
}

const PaymentDetails: React.FC<IPaymentDetailsProps> = ({
  selectedPlan,
  setApplyOffer,
  applyOffer,
}) => {
  const user = userStore((store) => store.user);
  const profileData = userStore((store) => store.profileData);
  const [loading, setLoading] = useState(false);
  const [onRecordings, setOnRecordings] = useState(false);
  const [payemntModalOpen, setPaymentModalOpen] = useState(false);
  const [referralCodeError, setReferralCodeError] = useState('');
  const [referralCodeDetails, setReferralCodeDetails] = useState<Omit<TInfluencerDB, 'id'> | null>(
    null
  );
  const [referralCode, setReferralCode] = useState('');
  const debouncedReferralCode = useDebounce(referralCode, 500);
  const updateSubscriptionData = userStore((state) => state.updateSubscriptionData);

  useEffect(() => {
    const handleGetReferralDetails = async (code: string) => {
      try {
        setReferralCodeError('');

        const refDetails = await getReferralCodeDetails(code);
        if (!refDetails) {
          setReferralCodeDetails(null);
          setReferralCodeError('Invalid referral code');
          return;
        }

        setReferralCodeDetails(refDetails);
      } catch (error) {}
    };

    if (debouncedReferralCode) {
      handleGetReferralDetails(debouncedReferralCode);
    } else {
      setReferralCodeDetails(null);
    }
  }, [debouncedReferralCode]);

  const handleStoreData = async (docId: string, subscriptionObj: Record<string, any>) => {
    try {
      // await updateUserDoc(userData.uid, { currentSubscriptionId: docId, isNewUser: false });
      await updateSubscriptionDoc(docId, { status: 'SUCCESS', updatedAt: Timestamp.now() });
      updateSubscriptionData(subscriptionObj as any);
      toast.success('payment completed successfully');
      setLoading(false);

      window.location.href = '/book-session';
    } catch (error) {
      console.log(error);
    }
  };

  const priceDistribution = useMemo(() => {
    // Calculate the total and discounts
    const baseTotal = selectedPlan.noOfSessions * selectedPlan.priceForSession;

    const generalDiscountAmount = applyOffer
      ? baseTotal * (50 / 100) // Assuming 50% is the general discount percentage
      : 0;

    const referralDiscountAmount = referralCodeDetails
      ? calculateReferralDiscount(baseTotal - generalDiscountAmount, referralCodeDetails)
      : 0;

    const recordingFee = onRecordings
      ? selectedPlan.noOfSessions * config.PER_SESSION_RECORDING_FEE
      : 0;

    const totalDiscount = generalDiscountAmount + referralDiscountAmount;
    const finalTotal = baseTotal - totalDiscount + recordingFee;

    return {
      baseTotal,
      finalTotal,
      totalDiscount,
      recordingFee,
      referralDiscountAmount,
      generalDiscountAmount,
    };
  }, [applyOffer, onRecordings, selectedPlan, referralCodeDetails]);

  const handlePay = async () => {
    try {
      if (!user) return;

      if (!process.env.REACT_APP_RAZORPAY_KEY) return alert('RAZORPAY KEY NOT ADDED');

      setLoading(true);

      const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

      if (!res) {
        alert('Razorpay SDK failed to load. Are you online?');
        setLoading(false);
        return;
      }

      const result = await axios.post(`${BACKEND_URL}/payment/orders`, {
        amount: priceDistribution.finalTotal * 100,
      });

      if (!result) {
        alert('Server error. Are you online?');
        return;
      }

      const { amount, id: order_id, currency } = result.data;

      const endDate = dayjs(new Date())
        .add(Number(selectedPlan.durationInMonth) * 28, 'day')
        .toDate();

      const subscriptionObj = {
        user: user.uid,
        type: ICategory.TUTOR_TALK,
        plan: selectedPlan.title,
        offer: selectedPlan.offerPrice,
        startDate: Timestamp.now(),
        endDate: Timestamp.fromDate(endDate),
        sessionPerWeek: selectedPlan.sessionPerWeek,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        totalPrice: priceDistribution.finalTotal,
        noOfSession: selectedPlan.noOfSessions,
        completedSession: 0,
        cancelledSession: 0,
        backlogSession: 0,
        bookedSession: 0,
        status: 'PENDING',
        subscriptionStatus: 'SUBSCRIBED',
        recording: onRecordings,
        chargesBreakdown: {
          baseTotal: priceDistribution.baseTotal,
          sessionsFee: selectedPlan.total,
          recordingFee: priceDistribution.recordingFee,
          generalDiscount: {
            applied: applyOffer,
            percentage: 50,
            amount: priceDistribution.generalDiscountAmount,
          },
          referralDiscount: {
            applied: !!referralCodeDetails,
            code: referralCode,
            percentage:
              referralCodeDetails?.offer.type === 'percentage'
                ? referralCodeDetails.offer.value
                : null,
            fixedAmount:
              referralCodeDetails?.offer.type === 'fixed' ? referralCodeDetails.offer.value : null,
            amount: priceDistribution.referralDiscountAmount,
          },
          totalDiscount: priceDistribution.totalDiscount,
          finalTotal: priceDistribution.finalTotal,
        },
      };

      // Store the subscription data
      await createSubscriptionDocWithOrderId(order_id, subscriptionObj);

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY,
        amount: amount.toString(),
        currency: currency,
        name: 'Talkgram',
        description: 'Subscription',
        image: { logo },
        order_id: order_id,
        handler: async function (response: any) {
          try {
            console.log(response);
            handleStoreData(order_id, subscriptionObj);
          } catch (error) {
            console.log(error);
            setLoading(false);
            toast.error('something went wrong');
          }
        },
        prefill: {
          name: user.displayName,
          email: user.email,
          contact: profileData?.phoneNumber,
        },
        notes: {
          address: 'Simple Trade Corporate Office',
        },
        theme: {
          color: '#f7941f',
        },
        modal: {
          ondismiss: function () {
            console.log('Checkout form closed by the user');
            setLoading(false);
            toast.error('payment failed. try again');
          },
        },
      };

      const razorpayWindow = window as any;
      const paymentObject = new razorpayWindow.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <StyledPaymentDetails id="checkout">
      <h4 style={{ textTransform: 'uppercase' }}>Checkout</h4>
      <p className="default">
        Finalising your English learning journey. One last step before we finish{' '}
      </p>
      <StyledSelectedPlan>
        <h5>{selectedPlan.title}</h5>
        <div>
          <div>
            <span>Total Sessions</span>
            <p>{selectedPlan.noOfSessions}</p>
          </div>
          <div>
            <span>Per Session Duration</span>
            <p>30 mins</p>
          </div>
          <div>
            <span>Sessions/Week</span>
            <p>{selectedPlan.sessionPerWeek}</p>
          </div>
        </div>
      </StyledSelectedPlan>
      <div className="coupon flex-between">
        <div className="flex">
          <DiscountIcon />
          <p>
            Beta Launch Promo Coupon <span>(50% off)</span>
          </p>
        </div>
        <button onClick={() => setApplyOffer((a) => !a)}>
          {applyOffer ? (
            <>
              <CheckCircleFill /> Applied
            </>
          ) : (
            'Apply'
          )}
        </button>
      </div>
      <div className="form-input">
        <label htmlFor="coupon">Referral Code</label>
        <input
          id="coupon"
          type="text"
          placeholder="Enter Referral Code"
          value={referralCode}
          onChange={(e) => setReferralCode(e.target.value)}
        />
        {referralCodeError && <span className="error-msg">{referralCodeError}</span>}
      </div>
      <div className="flex-end">
        <FormControlLabel
          control={
            <Checkbox checked={onRecordings} onChange={(e) => setOnRecordings(e.target.checked)} />
          }
          label={`Add Recording (₹${config.PER_SESSION_RECORDING_FEE}/session)`}
        />
      </div>
      <div className="cost-split">
        <div className="flex-between mb-10">
          <p>Plan Price :</p>
          <p>Rs {formatCurrency(priceDistribution.baseTotal)}</p>
        </div>
        {applyOffer && (
          <div className="flex-between mb-10">
            <p>General Discount (50%):</p>
            <p>- Rs {formatCurrency(priceDistribution.generalDiscountAmount)}</p>
          </div>
        )}
        {referralCodeDetails && (
          <div className="flex-between mb-10">
            <p>
              Referral Discount (
              {referralCodeDetails.offer.type === 'percentage'
                ? `${referralCodeDetails.offer.value}%`
                : `₹${referralCodeDetails.offer.value}`}
              ):
            </p>
            <p>- Rs {formatCurrency(priceDistribution.referralDiscountAmount)}</p>
          </div>
        )}
        {onRecordings && (
          <div className="flex-between mb-10">
            <p>Recording Fee:</p>
            <p>Rs {formatCurrency(priceDistribution.recordingFee)}</p>
          </div>
        )}
        <div className="flex-between">
          <p>Grand Total :</p>
          <p>Rs {formatCurrency(priceDistribution.finalTotal)}</p>
        </div>
      </div>
      <Button
        onClick={() => {
          handlePay();
          // setPaymentModalOpen(true);
        }}
      >
        Pay Rs {formatCurrency(priceDistribution.finalTotal)}
      </Button>
      <CustomModal isOpen={loading}>
        <StyledPaymentProcessing>
          <h5>Payment processing please wait...</h5>
        </StyledPaymentProcessing>
      </CustomModal>
      <Modal
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: 'auto',
        }}
        open={payemntModalOpen}
        onClose={() => {
          setPaymentModalOpen(false);
        }}
      >
        <TemporaryPaymentModal
          amount={
            applyOffer
              ? formatCurrency(
                  selectedPlan.noOfSessions * selectedPlan.priceForSession * ((100 - 50) / 100)
                )
              : formatCurrency(
                  selectedPlan.noOfSessions * selectedPlan.priceForSession * ((100 - 0) / 100)
                )
          }
        />
      </Modal>
    </StyledPaymentDetails>
  );
};

const StyledPaymentDetails = styled.div`
  border-radius: 8px;
  background: #fcf4eb;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-width: 700px;
  width: 100%;
  justify-self: flex-end;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.04);
  background: rgba(255, 255, 255, 0.11);
  height: fit-content;

  @media (max-width: 1080px) {
    margin: 0 auto;
  }

  p {
    color: #646464;
    font-family: Inter;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }

  .cost-split {
    border-top: 1px solid var(--text-primary);
    border-bottom: 1px solid var(--text-primary);
    padding: 30px 0;
  }

  .coupon {
    border-radius: 9px;
    border: 1px solid rgba(227, 227, 227, 0.5);
    background: #fff;
    box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.02);
    padding: 18px;
    gap: 20px;
    position: relative;
    overflow: hidden;
    background: linear-gradient(358deg, rgba(247, 148, 31, 0.15) 1.6%, rgba(247, 148, 31, 0) 98.47%),
      rgba(255, 255, 255, 0.2);
    z-index: 1;

    &::before {
      content: '';
      position: absolute;
      width: 50px;
      height: 100%;
      background: linear-gradient(
          358deg,
          rgba(247, 148, 31, 0.15) 1.6%,
          rgba(247, 148, 31, 0.01) 98.47%
        ),
        rgba(255, 255, 255, 0.2);
      top: 0;
      left: -100px;
      transform: skewX(132deg);
      animation: shine 1s infinite linear;
      z-index: -1;

      @keyframes shine {
        0% {
          left: -100px;
        }
        // 20% {
        //   left: 100%;
        // }
        100% {
          left: calc(100% + 20px);
        }
      }
    }

    > p {
      border-radius: 6px;
      border: 1px solid #ffc38c;
      background: rgba(255, 186, 52, 0.14);
      color: #f87420;
      font-family: Inter;
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      padding: 3.5px 6px;
    }

    button {
      border-radius: 6px;
      border: 1px solid #ffc38c;
      background: rgba(255, 186, 52, 0.14);
      color: #f87420;
      font-family: Inter;
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      padding: 3.5px 6px;
      outline: none;
      display: flex;
      align-items: center;
      cursor: pointer;
      text-transform: uppercase;
      font-weight: 500;

      svg {
        width: 18px;
        height: 18px;
        margin-right: 5px;
      }
    }

    .flex {
      display: flex;
      align-items: center;
      gap: 10px;

      > svg {
        width: 32px;
        height: 32px;
      }

      span {
        color: var(--primary);
      }
    }
  }

  .addons {
    border-radius: 9px;
    border: 1px solid rgba(227, 227, 227, 0.5);
    background: #fff;
    box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.02);
    padding: 18px;
    align-items: flex-start;
    gap: 20px;

    h5 {
      color: var(--text-primary);
      font-family: Inter;
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
      margin-bottom: 10px;
    }
  }

  .form-input {
    display: flex;
    flex-direction: column;
    gap: 8px;

    > input {
      border-radius: 10px;
      border: 1px solid #ccc;
      background: var(--white, #fff);
      color: #000;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      width: 100%;
      padding: 8px 15px;
      border-radius: 9px;
      border: 1px solid rgba(227, 227, 227, 0.54);
      background: rgba(3, 0, 36, 0.03);
      box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.02);

      &:focus {
        outline-color: var(--primary);
      }

      &::placehoder {
        color: var(--text-primary);
        font-size: 14px;
      }
    }
  }
`;

const StyledPaymentProcessing = styled.div`
  padding: 20px;
  text-align: center;
`;

const StyledSelectedPlan = styled.div`
  border-radius: 9px;
  border: 1px solid rgba(227, 227, 227, 0.5);
  background: #fff;
  box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.02);
  padding: 18px;

  h5 {
    color: #f7941f;
    font-family: Inter;
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: 135.523%;
    margin-bottom: 18px;
    text-transform: uppercase;
  }

  > div {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-radius: 7px;
    border: 0.8px solid rgba(0, 0, 0, 0.03);
    background: #fafafa;
    padding: 7px 16px;

    > div {
      text-align: center;

      span {
        color: #646464;
        font-family: Inter;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
      }

      p {
        color: var(--text-primary);
        font-family: Inter;
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        margin-top: 6px;
      }
    }
  }
`;

export default PaymentDetails;
