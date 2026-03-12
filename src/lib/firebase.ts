import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { SiteData, defaultSiteData } from "@/data/siteData";

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Array<infer U>
    ? U[]
    : T[K] extends Record<string, unknown>
      ? DeepPartial<T[K]>
      : T[K];
};

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
      projects: Array.isArray(raw.projects)
        ? raw.projects.map((project) => ({
            titulo: typeof project?.titulo === "string" ? project.titulo : "",
            descricao: typeof project?.descricao === "string" ? project.descricao : "",
            link: typeof project?.link === "string" ? project.link : "",
            imageUrl: typeof project?.imageUrl === "string" ? project.imageUrl : "",
            categoria: typeof project?.categoria === "string" ? project.categoria : "",
            ordem: typeof project?.ordem === "number" ? project.ordem : 0,
            oculto: typeof project?.oculto === "boolean" ? project.oculto : false,
          }))
        : defaultSiteData.projects,
      projectSubsections: {
        galeria: {
          pageTitle:
            typeof raw.projectSubsections?.galeria?.pageTitle === "string"
              ? raw.projectSubsections.galeria.pageTitle
              : defaultSiteData.projectSubsections.galeria.pageTitle,
          pageSubtitle:
            typeof raw.projectSubsections?.galeria?.pageSubtitle === "string"
              ? raw.projectSubsections.galeria.pageSubtitle
              : defaultSiteData.projectSubsections.galeria.pageSubtitle,
          categories: Array.isArray(raw.projectSubsections?.galeria?.categories)
            ? raw.projectSubsections.galeria.categories
                .map((category, index) => ({
                  id: typeof category?.id === "string" && category.id.trim() ? category.id : `cat-${index + 1}`,
                  titulo: typeof category?.titulo === "string" ? category.titulo : `Categoria ${index + 1}`,
                  imagens: Array.isArray(category?.imagens)
                    ? category.imagens.filter((url): url is string => typeof url === "string")
                    : [],
                  ordem: typeof category?.ordem === "number" ? category.ordem : index + 1,
                }))
                .sort((a, b) => a.ordem - b.ordem)
            : [
                {
                  id: "eventos",
                  titulo: "Eventos",
                  imagens: Array.isArray((raw.projectSubsections?.galeria as { eventos?: unknown[] } | undefined)?.eventos)
                    ? ((raw.projectSubsections?.galeria as { eventos?: unknown[] }).eventos ?? []).filter(
                        (url): url is string => typeof url === "string",
                      )
                    : defaultSiteData.projectSubsections.galeria.categories[0].imagens,
                  ordem: 1,
                },
                {
                  id: "cerimonial",
                  titulo: "Cerimonial",
                  imagens: Array.isArray((raw.projectSubsections?.galeria as { cerimonial?: unknown[] } | undefined)?.cerimonial)
                    ? ((raw.projectSubsections?.galeria as { cerimonial?: unknown[] }).cerimonial ?? []).filter(
                        (url): url is string => typeof url === "string",
                      )
                    : defaultSiteData.projectSubsections.galeria.categories[1].imagens,
                  ordem: 2,
                },
              ],
        },
        vitrine: {
          pageTitle:
            typeof raw.projectSubsections?.vitrine?.pageTitle === "string"
              ? raw.projectSubsections.vitrine.pageTitle
              : defaultSiteData.projectSubsections.vitrine.pageTitle,
          pageSubtitle:
            typeof raw.projectSubsections?.vitrine?.pageSubtitle === "string"
              ? raw.projectSubsections.vitrine.pageSubtitle
              : defaultSiteData.projectSubsections.vitrine.pageSubtitle,
          categories: Array.isArray(raw.projectSubsections?.vitrine?.categories)
            ? raw.projectSubsections.vitrine.categories
                .map((category, index) => ({
                  id: typeof category?.id === "string" && category.id.trim() ? category.id : `vitrine-cat-${index + 1}`,
                  titulo: typeof category?.titulo === "string" ? category.titulo : `Categoria ${index + 1}`,
                  imagens: Array.isArray(category?.imagens)
                    ? category.imagens.filter((url): url is string => typeof url === "string")
                    : [],
                  ordem: typeof category?.ordem === "number" ? category.ordem : index + 1,
                }))
                .sort((a, b) => a.ordem - b.ordem)
            : [
                {
                  id: "partage-shopping-betim",
                  titulo: "Partage Shopping Betim",
                  imagens: Array.isArray((raw.projectSubsections?.vitrine as { imagens?: unknown[] } | undefined)?.imagens)
                    ? ((raw.projectSubsections?.vitrine as { imagens?: unknown[] }).imagens ?? []).filter(
                        (url): url is string => typeof url === "string",
                      )
                    : defaultSiteData.projectSubsections.vitrine.categories[0].imagens,
                  ordem: 1,
                },
              ],
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

export async function saveSiteSection(data: DeepPartial<SiteData>): Promise<void> {
  if (!db) throw new Error("Firebase not configured");
  const docRef = doc(db, "site", "public");
  await setDoc(docRef, data, { merge: true });
}
