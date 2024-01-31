import {
  addDoc,
  collection,
  doc,
  DocumentData,
  getDoc,
  increment,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { SUBSCRIPTION_COLLECTION_NAME } from "../constants/data";
import { ISubscriptionDB } from "../constants/types";
import { db } from "../utils/firebase";

export const createSubscriptionDoc = async (data: DocumentData) => {
  const colRef = collection(db, SUBSCRIPTION_COLLECTION_NAME);
  return await addDoc(colRef, data);
};

export const createSubscriptionDocWithOrderId = async (orderId: string, data: DocumentData) => {
  const docRef = doc(db, SUBSCRIPTION_COLLECTION_NAME, orderId);
  return await setDoc(docRef, data);
};

export const getSubscriptionDoc = async (docId: string) => {
  const docRef = doc(db, SUBSCRIPTION_COLLECTION_NAME, docId);
  const docResult = await getDoc(docRef);
  const docData = docResult.data() as Omit<ISubscriptionDB, "id">;

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
