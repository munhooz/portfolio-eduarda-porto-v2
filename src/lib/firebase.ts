import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { SiteData, defaultSiteData } from "@/data/siteData";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
};

const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

let app: ReturnType<typeof initializeApp> | null = null;
let auth: ReturnType<typeof getAuth> | null = null;
let db: ReturnType<typeof getFirestore> | null = null;
let storage: ReturnType<typeof getStorage> | null = null;

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
}

export { auth, db, storage, isFirebaseConfigured };

export async function fetchSiteData(): Promise<SiteData> {
  if (!isFirebaseConfigured || !db) {
    return defaultSiteData;
  }
  try {
    const docRef = doc(db, "site", "public");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as SiteData;
    }
    return defaultSiteData;
  } catch {
    return defaultSiteData;
  }
}

export async function saveSiteData(data: SiteData): Promise<void> {
  if (!db) throw new Error("Firebase not configured");
  const docRef = doc(db, "site", "public");
  await setDoc(docRef, data);
}

export async function uploadFile(file: File, path: string): Promise<string> {
  if (!storage) throw new Error("Firebase Storage not configured");
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

export async function uploadImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `images/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
  return uploadFile(file, path);
}

export async function uploadPDF(file: File): Promise<string> {
  const path = `pdfs/${Date.now()}_${file.name}`;
  return uploadFile(file, path);
}
