import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../utils/firebase";

export const uploadProfileImage = async (id: string, file: File) => {
  const imageref = ref(storage, `Profile/${id}`);
  const uploadTask = uploadBytesResumable(imageref, file);
  await uploadTask;
  const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
  console.log("Download URL:", downloadURL);
  return downloadURL;
};
