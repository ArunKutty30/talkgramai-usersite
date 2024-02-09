import axios from "axios";
import { config } from "../constants/config";

interface ISendBookingConfirmationMail {
  userId: string;
  tutorId: string;
  date: string;
  time: string;
}

export const sendBookingConfirmationMail = async ({
  userId,
  tutorId,
  date,
  time,
}: ISendBookingConfirmationMail) => {
  await axios.post(`${config.BACKEND_URL}/mail/booking-confirmation`, {
    userId,
    tutorId,
    date,
    time,
  });
};

export const sendBookingCancellationMail = async ({
  userId,
  tutorId,
  date,
  time,
}: ISendBookingConfirmationMail) => {
  await axios.post(`${config.BACKEND_URL}/mail/session-cancellation`, {
    userId,
    tutorId,
    date,
    time,
  });
};
