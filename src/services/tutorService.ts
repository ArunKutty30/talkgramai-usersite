import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { BLOCK_USER_COLLECTION_NAME, TUTOR_COLLECTION_NAME } from '../constants/data';
import { db } from '../utils/firebase';
import { ITutorBlockedUserDoc, ITutorProfileData } from '../constants/types';

export const getTutorDoc = async (id: string) => {
  const docRef = doc(db, TUTOR_COLLECTION_NAME, id);
  const tutorData = (await getDoc(docRef)).data() as Omit<ITutorProfileData, 'id'>;

  return { id: id, ...tutorData };
};

export const getTutorBlockedUsersDoc = async (userId: string) => {
  const colRef = collection(db, BLOCK_USER_COLLECTION_NAME);
  const q = query(colRef, where('blockedUsers', 'array-contains', userId));
  const tutorData = await getDocs(q);

  const data = tutorData.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<ITutorBlockedUserDoc, 'id'>),
  }));

  return data;
};
