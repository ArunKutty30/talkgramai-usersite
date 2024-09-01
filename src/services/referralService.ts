import { query, collection, getDocs, where } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { INFLUENCER_COLLECTION_NAME } from '../constants/data';
import { TInfluencerDB } from '../constants/types';

export const getReferralCodeDetails = async (referralCode: string) => {
  const colRef = collection(db, INFLUENCER_COLLECTION_NAME);

  // Create a query to check if the referral code exists
  const q = query(colRef, where('referralCode', '==', referralCode));

  // Get the documents that match the query
  const existingCode = await getDocs(q);

  if (existingCode.empty) return null;

  return existingCode.docs[0].data() as Omit<TInfluencerDB, 'id'>;
};
