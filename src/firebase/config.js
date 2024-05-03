import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDKm2GKU_r_DJE9Em1ze3XRyDjB33eLk-U",
  authDomain: "gus-social-app.firebaseapp.com",
  projectId: "gus-social-app",
  storageBucket: "gus-social-app.appspot.com",
  messagingSenderId: "881080060238",
  appId: "1:881080060238:web:5c77dc4db0d425c084761f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export async function uploadFile(file) {
  const storageRef = ref(storage, "userProfile-" + uuidv4());
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
}
