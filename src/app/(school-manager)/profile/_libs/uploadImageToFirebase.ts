import { storage } from "@/utils/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const uploadImageToFirebase = async (file: File): Promise<string> => {
  try {
    const storageRef = ref(storage, `avatars/${file.name}-${Date.now()}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL; // Link ảnh trên Firebase
  } catch (error) {
    console.error("Error uploading image to Firebase:", error);
    throw new Error("Upload failed");
  }
};
