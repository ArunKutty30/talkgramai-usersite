import axios from 'axios';
import dayjs from 'dayjs';
import { Timestamp } from 'firebase/firestore';

import logo from '../assets/logo/logo_short.png';

import { BACKEND_URL } from '../utils/api';
import { config } from '../constants/config';
import { createSubscriptionDocWithOrderId } from './subscriptionService';
import { ICategory } from '../constants/types';
import { User } from 'firebase/auth';
import { updateUserDoc } from './userService';

export const loadScript = (src: string) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

export const invokeRazorpay = async () => {
  const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

  if (!res) {
    alert('Razorpay SDK failed to load. Are you online?');
    return;
  }

  const result = await axios.post('http://localhost:8000/payment/orders');

  if (!result) {
    alert('Server error. Are you online?');
    return;
  }

  const { amount, id: order_id, currency } = result.data;

  const options = {
    key: 'rzp_test_7Kya0fkFuobW4L', // Enter the Key ID generated from the Dashboard
    amount: amount.toString(),
    currency: currency,
    name: 'Talkgram',
    description: 'Test Transaction',
    image: { logo: '' },
    order_id: order_id,
    handler: async function (response: any) {
      const data = {
        orderCreationId: order_id,
        razorpayPaymentId: response.razorpay_payment_id,
        razorpayOrderId: response.razorpay_order_id,
        razorpaySignature: response.razorpay_signature,
      };

      await axios.post('http://localhost:8000/payment/success', data);
    },
    prefill: {
      name: 'arun',
      email: 'example@example.com',
      contact: '9999999999',
    },
    notes: {
      address: 'Talkgram Corporate Office',
    },
    theme: {
      color: '#f7941f',
    },
  };

  const razorpayWindow = window as any;

  const paymentObject = new razorpayWindow.Razorpay(options);
  paymentObject.open();
};

const handleStoreData = async (docId: string, userData: User) => {
  try {
    await updateUserDoc(userData.uid, {
      currentSubscriptionId: docId,
      isNewUser: false,
    });
    console.log('success');
  } catch (error) {
    console.log(error);
  }
};

export const handlePayForDemoClass = async (
  user: User,
  handleConfirmClass: (subscriptionData: any) => void
) => {
  try {
    const REACT_APP_RAZORPAY_KEY = process.env.REACT_APP_RAZORPAY_KEY;
    if (!REACT_APP_RAZORPAY_KEY) return alert('RAZORPAY KEY NOT ADDED');

    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

    if (!res) {
      throw new Error('Razorpay SDK failed to load. Are you online?');
    }

    const result = await axios.post(`${BACKEND_URL}/payment/orders`, {
      amount: config.DEMO_CLASS_FEE * 100, // RS *100 INR
    });

    if (!result) {
      alert('Server error. Are you online?');
      return;
    }

    const { amount, id: order_id, currency } = result.data;
    const endDate = dayjs(new Date()).add(3, 'days').toDate();

    const subscriptionData = {
      user: user.uid,
      type: ICategory.TUTOR_TALK,
      plan: 'Demo Class',
      offer: 0,
      startDate: Timestamp.now(),
      endDate: Timestamp.fromDate(endDate),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      totalPrice: config.DEMO_CLASS_FEE,
      noOfSession: 1,
      completedSession: 0,
      cancelledSession: 0,
      backlogSession: 0,
      bookedSession: 0,
      demoClass: true,
      status: 'PENDING',
      recording: true,
    };

    await createSubscriptionDocWithOrderId(order_id, subscriptionData);

    const options = {
      key: REACT_APP_RAZORPAY_KEY,
      amount: amount.toString(),
      currency: currency,
      name: 'Talkgram',
      description: 'Test Transaction',
      image: { logo },
      order_id: order_id,
      handler: async function (response: any) {
        try {
          console.log(response);
          await handleStoreData(order_id, user);
          handleConfirmClass({ ...subscriptionData, id: order_id });
        } catch (error) {
          console.log(error);
        }
      },
      prefill: {
        name: user.displayName,
        email: user.email,
        contact: user.phoneNumber,
      },
      notes: {
        address: 'Talkgram Corporate Office',
      },
      theme: {
        color: '#f7941f',
      },
    };

    const razorpayWindow = window as any;

    const paymentObject = new razorpayWindow.Razorpay(options);
    paymentObject.open();
  } catch (error) {
    console.log(error);
  }
};
