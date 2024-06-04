import axios from 'axios';
import { config } from '../constants/config';

export const sendOtpService = async (uid: string, phoneNumber: string) => {
  await axios.post(`${config.BACKEND_URL}/phone/send-otp`, {
    uid,
    phoneNumber,
  });
};

export const verifyOtpService = async (uid: string, otp: string) => {
  await axios.post(`${config.BACKEND_URL}/phone/verify-otp`, { uid, otp });
};

export const sendMailOtpService = async (uid: string, email: string) => {
  await axios.post(`${config.BACKEND_URL}/mail/send-otp`, {
    uid,
    email,
  });
};

export const verifyMailOtpService = async (uid: string, otp: string) => {
  await axios.post(`${config.BACKEND_URL}/mail/verify-otp`, { uid, otp });
};
