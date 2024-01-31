import { doc, getDoc } from "firebase/firestore";
import { TUTOR_COLLECTION_NAME } from "../constants/data";
import { db } from "../utils/firebase";
import { ITutorProfileData } from "../constants/types";

export const getTutorDoc = async (id: string) => {
  const docRef = doc(db, TUTOR_COLLECTION_NAME, id);
  const tutorData = (await getDoc(docRef)).data() as Omit<ITutorProfileData, "id">;

  return { id: id, ...tutorData };
};
