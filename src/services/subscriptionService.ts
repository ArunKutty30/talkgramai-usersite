import {
  addDoc,
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import dayjs from 'dayjs';
import { v4 } from 'uuid';

import { SUBSCRIPTION_COLLECTION_NAME } from '../constants/data';
import { ICategory, ISubscriptionDB } from '../constants/types';
import { db } from '../utils/firebase';

export const createSubscriptionDoc = async (data: DocumentData) => {
  const colRef = collection(db, SUBSCRIPTION_COLLECTION_NAME);
  return await addDoc(colRef, data);
};

export const createSubscriptionDocWithOrderId = async (orderId: string, data: DocumentData) => {
  const docRef = doc(db, SUBSCRIPTION_COLLECTION_NAME, orderId);
  return await setDoc(docRef, data);
};

export const getUserSubscriptionDoc = async (userId: string) => {
  const colRef = collection(db, SUBSCRIPTION_COLLECTION_NAME);
  const q = query(
    colRef,
    where('user', '==', userId),
    where('status', 'in', ['COMPLETED', 'SUCCESS']),
    where('subscriptionStatus', '==', 'SUBSCRIBED'),
    orderBy('createdAt', 'desc'),
    limit(1)
  );
  const queryResult = await getDocs(q);

  if (!queryResult.docs.length) return null;

  return {
    id: queryResult.docs[0].id,
    ...(queryResult.docs[0].data() as Omit<ISubscriptionDB, 'id'>),
  };
};

export const getSubscriptionDoc = async (docId: string) => {
  const docRef = doc(db, SUBSCRIPTION_COLLECTION_NAME, docId);
  const docResult = await getDoc(docRef);
  const docData = docResult.data() as Omit<ISubscriptionDB, 'id'>;

  if (!docData) return null;

  return { id: docResult.id, ...docData };
};

export const updateSubscriptionDoc = async (docId: string, data: DocumentData) => {
  const docRef = doc(db, SUBSCRIPTION_COLLECTION_NAME, docId);

  await updateDoc(docRef, data);
};

export const updateMissedSessionSubscriptionDoc = async (docId: string, missedSessions: number) => {
  const docRef = doc(db, SUBSCRIPTION_COLLECTION_NAME, docId);

  await updateDoc(docRef, { missedClass: increment(missedSessions) });
};

export const createDemoClassSubscriptionService = async (uid: string) => {
  const endDate = dayjs(new Date()).add(3, 'days').toDate();
  const subscriptionId = v4();

  const subscriptionData = {
    user: uid,
    type: ICategory.TUTOR_TALK,
    plan: 'Demo Class',
    offer: 0,
    startDate: Timestamp.now(),
    endDate: Timestamp.fromDate(endDate),
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    totalPrice: 0,
    noOfSession: 1,
    completedSession: 0,
    cancelledSession: 0,
    backlogSession: 0,
    bookedSession: 0,
    demoClass: true,
    status: 'SUCCESS',
    recording: true,
    subscriptionStatus: 'SUBSCRIBED',
  };

  await createSubscriptionDocWithOrderId(subscriptionId, subscriptionData);

  return subscriptionId;
};
