import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
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

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}

export { auth, db, isFirebaseConfigured };

export async function fetchSiteData(): Promise<SiteData> {
  if (!isFirebaseConfigured || !db) return defaultSiteData;

  try {
    const docRef = doc(db, "site", "public");
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return defaultSiteData;

    const raw = (docSnap.data() ?? {}) as Partial<SiteData>;

    return {
      ...defaultSiteData,
      ...raw,

      profile: {
        ...defaultSiteData.profile,
        ...(raw.profile ?? {}),
      },

      about: {
        ...defaultSiteData.about,
        ...(raw.about ?? {}),
      },

      skills: Array.isArray(raw.skills) ? raw.skills : defaultSiteData.skills,
      experience: Array.isArray(raw.experience) ? raw.experience : defaultSiteData.experience,
      projects: Array.isArray(raw.projects) ? raw.projects : defaultSiteData.projects,
      projectSubsections: {
        galeria: {
          eventos: Array.isArray(raw.projectSubsections?.galeria?.eventos)
            ? raw.projectSubsections.galeria.eventos.filter((url): url is string => typeof url === "string")
            : defaultSiteData.projectSubsections.galeria.eventos,
          cerimonial: Array.isArray(raw.projectSubsections?.galeria?.cerimonial)
            ? raw.projectSubsections.galeria.cerimonial.filter((url): url is string => typeof url === "string")
            : defaultSiteData.projectSubsections.galeria.cerimonial,
        },
        vitrine: {
          imagens: Array.isArray(raw.projectSubsections?.vitrine?.imagens)
            ? raw.projectSubsections.vitrine.imagens.filter((url): url is string => typeof url === "string")
            : defaultSiteData.projectSubsections.vitrine.imagens,
        },
      },

      contact: {
        ...defaultSiteData.contact,
        ...(raw.contact ?? {}),
        outrosLinks:
          raw.contact?.outrosLinks && typeof raw.contact.outrosLinks === "object"
            ? raw.contact.outrosLinks
            : defaultSiteData.contact.outrosLinks,
      },

      cvUrl: typeof raw.cvUrl === "string" ? raw.cvUrl : defaultSiteData.cvUrl,
    };
  } catch {
    return defaultSiteData;
  }
}

export async function saveSiteData(data: SiteData): Promise<void> {
  if (!db) throw new Error("Firebase not configured");
  const docRef = doc(db, "site", "public");
  await setDoc(docRef, data);
}
