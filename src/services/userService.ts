import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { BOOKINGS_COLLECTION_NAME, USER_COLLECTION_NAME } from "../constants/data";
import { db } from "../utils/firebase";
import { IUserProfileData } from "../constants/types";
import { startOfMonth } from "date-fns";

export const getUserDoc = async (id: string) => {
  const docRef = doc(db, USER_COLLECTION_NAME, id);
  const tutorData = (await getDoc(docRef)).data() as Omit<IUserProfileData, "id">;

  return { id: id, ...tutorData };
};

export const updateUserDoc = async (id: string, data: DocumentData) => {
  const docRef = doc(db, USER_COLLECTION_NAME, id);
  await updateDoc(docRef, { ...data, updatedAt: Timestamp.now() });
};

export const updateUserFavouriteTutorsDoc = async (id: string, tutorId: string) => {
  const docRef = doc(db, USER_COLLECTION_NAME, id);

  const existingData = (await getDoc(docRef)).data() as Omit<IUserProfileData, "id">;
  const existingTutors = existingData?.favouriteTutors || [];

  if (existingTutors.some((s) => s === tutorId)) {
    await updateDoc(docRef, {
      favouriteTutors: arrayRemove(tutorId),
      updatedAt: Timestamp.now(),
    });
  } else {
    await updateDoc(docRef, {
      favouriteTutors: arrayUnion(tutorId),
      updatedAt: Timestamp.now(),
    });
  }
};

export const getUserCancelledSessionOnCurrentMonth = async (id: string, startDate: Date) => {
  const colRef = collection(db, BOOKINGS_COLLECTION_NAME);
  const q = query(
    colRef,
    where("user", "==", id),
    where("status", "==", "USER_CANCELLED"),
    where("startTime", ">", startDate)
  );

  const data = await getDocs(q);

  console.log(data.size);
  return data.size;
};

export const getCompletedLessonPlan = async (userUid: string) => {
  const finishedTopicsColRef = collection(db, USER_COLLECTION_NAME, userUid, "FinishedTopics");

  const data = await getDocs(finishedTopicsColRef);
  const formattedData: any[] = [];

  data.forEach((doc) => {
    formattedData.push({ id: doc.id, ...doc.data() });
  });

  return formattedData;
};
