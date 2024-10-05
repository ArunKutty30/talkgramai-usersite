import React, { useState } from 'react';
import styled from 'styled-components';
import paymentQrcode from '../../assets/images/paymentQr.jpeg';
import Button from '../Button';

const TemporaryPaymentModal = ({ amount }: { amount: string }) => {
  const [copiedText, setCopiedText] = useState('Copy');
  const [textNo, setTextNo] = useState<number | null>(null);

  const handleCopyClick = (textToCopy: string, value: number) => {
    navigator.clipboard.writeText(textToCopy);
    setCopiedText('Copied');
    setTextNo(value);

    setTimeout(() => {
      setCopiedText('Copy');
      setTextNo(null);
    }, 2000); // Reset the text to "Copy" after 2 seconds
  };
  return (
    <TemporaryStyledPayment>
      <p style={{ fontWeight: 600 }} className="mb-10">
        Make the payment and send the screenshot on WhatsApp to{' '}
        <a target="_blank" href=" https://wa.me/918122092030">
          81220 92030
        </a>
        .
      </p>
      <img src={paymentQrcode} alt="" style={{ width: '40%' }} />
      <Button style={{ margin: '1rem 0' }}> Pay Rs {amount}</Button>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0rem 0',
        }}
      >
        <h4>
          <span> UPI ID : arunprogrammer01-1@okhdfcbank</span>
          <Button
            onClick={() => {
              handleCopyClick('arunprogrammer01-1@okhdfcbank', 1);
            }}
            style={{ padding: '0.5rem', margin: '0.5rem 1rem', marginBottom: '0' }}
          >
            {textNo === 1 ? copiedText : 'copy'}
          </Button>
        </h4>
        <h4>
          <span> Bank Account No : 50200058633517</span>
          <Button
            onClick={() => {
              handleCopyClick('50200058633517', 2);
            }}
            style={{ padding: '0.5rem', margin: '0.5rem 1rem', marginBottom: '0' }}
          >
            {textNo === 2 ? copiedText : 'copy'}
          </Button>
        </h4>
        <h4>
          <span> IFSC Code : HDFC0001006</span>
          <Button
            onClick={() => {
              handleCopyClick('HDFC0001006', 3);
            }}
            style={{ padding: '0.5rem', margin: '0.5rem 1rem', marginBottom: '0' }}
          >
            {textNo === 3 ? copiedText : 'copy'}
          </Button>
        </h4>
      </div>
      <p style={{ marginTop: '10px', fontWeight: 600 }}>
        Simple Trade team will verify and get back to you within 30 minutes.
      </p>
    </TemporaryStyledPayment>
  );
};

const TemporaryStyledPayment = styled.div`
  padding: 30px 20px;
  text-align: center;
  border-radius: 1rem;
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 35rem;
  height: 43 rem;

  @media (max-width: 768px) {
    max-width: 90%;
  }

  h4 {
    font-weight: 400;
    font-family: 'Inter';
    display: flex;
    justify-content: space-between;
    align-items: center;

    @media (max-width: 768px) {
      font-size: 14px;
      text-align: left;
    }
  }
`;

export default TemporaryPaymentModal;
