import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, fetchSiteData, isFirebaseConfigured, saveSiteSection } from "@/lib/firebase";
import { SiteData, defaultSiteData } from "@/data/siteData";
import {
  AlertCircle,
  Award,
  Briefcase,
  ChevronDown,
  FileText,
  FolderOpen,
  GraduationCap,
  Home,
  Images,
  LayoutDashboard,
  Lightbulb,
  LogOut,
  Mail,
  Settings,
  User,
} from "lucide-react";
import AdminSection from "@/components/admin/AdminSection";
import ProfileSection from "@/components/admin/ProfileSection";
import AboutSection from "@/components/admin/AboutSection";
import SkillsSection from "@/components/admin/SkillsSection";
import ExperienceSection from "@/components/admin/ExperienceSection";
import ProjectsSection from "@/components/admin/ProjectsSection";
import GallerySection from "@/components/admin/GallerySection";
import VitrineSection from "@/components/admin/VitrineSection";
import ContactSection from "@/components/admin/ContactSection";
import PDFSection from "@/components/admin/PDFSection";
import ImagesGallery from "@/components/admin/ImagesGallery";
import ImageWithSkeleton from "@/components/ui/ImageWithSkeleton";

type TabId =
  | "dashboard"
  | "profile"
  | "about"
  | "skills"
  | "experience"
  | "projects"
  | "gallery"
  | "vitrine"
  | "contact"
  | "pdf"
  | "media";

type EditableTabId = Exclude<TabId, "dashboard" | "media">;
type SiteDataPatch = {
  [K in keyof SiteData]?: SiteData[K] extends Array<infer U>
  ? U[]
  : SiteData[K] extends Record<string, unknown>
  ? SiteDataPatchValue<SiteData[K]>
  : SiteData[K];
};

type SiteDataPatchValue<T> = {
  [K in keyof T]?: T[K] extends Array<infer U>
  ? U[]
  : T[K] extends Record<string, unknown>
  ? SiteDataPatchValue<T[K]>
  : T[K];
};

const mainTabs: { id: TabId; label: string; icon: React.ReactNode; hint: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" />, hint: "Visão geral" },
  { id: "profile", label: "Topo do site", icon: <Home className="h-4 w-4" />, hint: "Nome, texto e foto" },
  { id: "about", label: "Sobre", icon: <FileText className="h-4 w-4" />, hint: "Apresentação" },
  { id: "skills", label: "Habilidades", icon: <Award className="h-4 w-4" />, hint: "Lista com ordem" },
  { id: "experience", label: "Experiência", icon: <Briefcase className="h-4 w-4" />, hint: "Histórico profissional" },
];

const mainTabsAfterProjects: { id: TabId; label: string; icon: React.ReactNode; hint: string }[] = [
  { id: "contact", label: "Contato", icon: <Mail className="h-4 w-4" />, hint: "Canais públicos" },
  { id: "pdf", label: "Currículo", icon: <GraduationCap className="h-4 w-4" />, hint: "Arquivo PDF" },
  { id: "media", label: "Mídia", icon: <Images className="h-4 w-4" />, hint: "Imagens usadas" },
];

const projectTabs: { id: EditableTabId; label: string; hint: string }[] = [
  { id: "projects", label: "Meus Projetos", hint: "Cards do portfólio" },
  { id: "gallery", label: "Galeria", hint: "Imagens da galeria" },
  { id: "vitrine", label: "Vitrine", hint: "Imagens da vitrine" },
];

const editableTabs: EditableTabId[] = ["profile", "about", "skills", "experience", "projects", "gallery", "vitrine", "contact", "pdf"];

const isProjectTab = (tabId: TabId) => tabId === "projects" || tabId === "gallery" || tabId === "vitrine";

const tabTitle: Record<TabId, string> = {
  dashboard: "Dashboard",
  profile: "Editar topo do site",
  about: "Editar sobre",
  skills: "Editar habilidades",
  experience: "Editar experiência",
  projects: "Editar meus projetos",
  gallery: "Editar galeria",
  vitrine: "Editar vitrine",
  contact: "Editar contato",
  pdf: "Editar currículo",
  media: "Galeria de imagens",
};

const getSectionSnapshot = (data: SiteData, tabId: EditableTabId) => {
  switch (tabId) {
    case "profile":
      return data.profile;
    case "about":
      return data.about;
    case "skills":
      return data.skills;
    case "experience":
      return data.experience;
    case "projects":
      return data.projects;
    case "gallery":
      return data.projectSubsections.galeria;
    case "vitrine":
      return data.projectSubsections.vitrine;
    case "contact":
      return data.contact;
    case "pdf":
      return data.cvUrl;
  }
};

const getSectionPayload = (data: SiteData, tabId: EditableTabId): SiteDataPatch => {
  switch (tabId) {
    case "profile":
      return { profile: data.profile };
    case "about":
      return { about: data.about };
    case "skills":
      return { skills: data.skills };
    case "experience":
      return { experience: data.experience };
    case "projects":
      return { projects: data.projects };
    case "gallery":
      return {
        projectSubsections: {
          galeria: data.projectSubsections.galeria,
        },
      };
    case "vitrine":
      return {
        projectSubsections: {
          vitrine: data.projectSubsections.vitrine,
        },
      };
    case "contact":
      return { contact: data.contact };
    case "pdf":
      return { cvUrl: data.cvUrl };
  }
};

const mergeSavedSection = (base: SiteData, next: SiteData, tabId: EditableTabId): SiteData => {
  switch (tabId) {
    case "profile":
      return { ...base, profile: next.profile };
    case "about":
      return { ...base, about: next.about };
    case "skills":
      return { ...base, skills: next.skills };
    case "experience":
      return { ...base, experience: next.experience };
    case "projects":
      return { ...base, projects: next.projects };
    case "gallery":
      return {
        ...base,
        projectSubsections: {
          ...base.projectSubsections,
          galeria: next.projectSubsections.galeria,
        },
      };
    case "vitrine":
      return {
        ...base,
        projectSubsections: {
          ...base.projectSubsections,
          vitrine: next.projectSubsections.vitrine,
        },
      };
    case "contact":
      return { ...base, contact: next.contact };
    case "pdf":
      return { ...base, cvUrl: next.cvUrl };
  }
};

const AdminPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [projectsMenuOpen, setProjectsMenuOpen] = useState(false);
  const [liveData, setLiveData] = useState<SiteData>(defaultSiteData);
  const [savedData, setSavedData] = useState<SiteData>(defaultSiteData);
  const [tabSaving, setTabSaving] = useState<Record<EditableTabId, boolean>>({} as Record<EditableTabId, boolean>);
  const [tabSaved, setTabSaved] = useState<Record<EditableTabId, boolean>>({} as Record<EditableTabId, boolean>);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setLoading(false);
      return;
    }

    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (!currentUser) {
        return;
      }

      fetchSiteData().then((data) => {
        setLiveData(data);
        setSavedData(data);
      });
    });

    return unsub;
  }, []);

  const dirtyMap = useMemo(() => {
    return editableTabs.reduce(
      (acc, tabId) => {
        acc[tabId] = JSON.stringify(getSectionSnapshot(liveData, tabId)) !== JSON.stringify(getSectionSnapshot(savedData, tabId));
        return acc;
      },
      {} as Record<EditableTabId, boolean>,
    );
  }, [liveData, savedData]);

  const pendingTabs = editableTabs.filter((tabId) => dirtyMap[tabId]);
  const hasPendingProjectTabs = projectTabs.some((tab) => dirtyMap[tab.id]);
  const hasPendingChanges = pendingTabs.length > 0;
  const userEmail = user?.email || "usuario@admin.com";
  const fallbackUserName = userEmail
    .split("@")[0]
    .split(/[.\-_]/)
    .filter(Boolean)
    .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
  const userName = liveData.profile.nome?.trim() || fallbackUserName;
  const userInitials = userName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part: string) => part.charAt(0).toUpperCase())
    .join("");

  useEffect(() => {
    if (!hasPendingChanges) {
      return;
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasPendingChanges]);

  useEffect(() => {
    if (!hasPendingChanges) {
      return;
    }

    const currentUrl = window.location.href;
    window.history.pushState({ adminGuard: true }, "", currentUrl);

    const handlePopState = () => {
      const shouldLeave = window.confirm("Há alterações não salvas no painel. Deseja sair mesmo assim?");

      if (shouldLeave) {
        window.removeEventListener("popstate", handlePopState);
        window.history.back();
        return;
      }

      window.history.pushState({ adminGuard: true }, "", currentUrl);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [hasPendingChanges]);

  const confirmDiscardPendingChanges = () => {
    if (!hasPendingChanges) {
      return true;
    }

    return window.confirm("Há alterações não salvas no painel. Deseja sair mesmo assim?");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;

    try {
      setLoginError("");
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setLoginError("Email ou senha inválidos.");
    }
  };

  const handleLogout = async () => {
    if (!confirmDiscardPendingChanges()) {
      return;
    }

    if (auth) await signOut(auth);
    navigate("/admin");
  };

  const handleTabSelect = (tabId: TabId) => {
    setActiveTab(tabId);
    if (!isProjectTab(tabId)) {
      setProjectsMenuOpen(false);
    }
  };

  const handleSaveTab = useCallback(
    async (tabId: EditableTabId) => {
      setTabSaving((prev) => ({ ...prev, [tabId]: true }));

      try {
        await saveSiteSection(getSectionPayload(liveData, tabId));
        setSavedData((prev) => mergeSavedSection(prev, liveData, tabId));
        setTabSaved((prev) => ({ ...prev, [tabId]: true }));
        window.setTimeout(() => {
          setTabSaved((prev) => ({ ...prev, [tabId]: false }));
        }, 2500);
      } catch {
        window.alert("Erro ao salvar esta seção. Verifique a configuração do Firebase e tente novamente.");
      } finally {
        setTabSaving((prev) => ({ ...prev, [tabId]: false }));
      }
    },
    [liveData],
  );

  const renderTab = () => {
    const props = { data: liveData, onChange: setLiveData };

    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-5 rounded-2xl border border-border/70 bg-background p-4 shadow-sm md:p-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold tracking-tight">Visão geral do site</h2>
              <p className="text-sm text-muted-foreground">
                Acompanhe o volume de conteúdo cadastrado e os itens que ainda estão pendentes de salvar.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-xl border border-border/70 bg-muted/25 p-4">
                <p className="text-xs uppercase tracking-[0.1em] text-muted-foreground">Habilidades</p>
                <p className="mt-2 text-2xl font-semibold">{liveData.skills.length}</p>
                <p className="mt-1 text-xs text-muted-foreground">Itens cadastrados</p>
              </div>
              <div className="rounded-xl border border-border/70 bg-muted/25 p-4">
                <p className="text-xs uppercase tracking-[0.1em] text-muted-foreground">Experiências</p>
                <p className="mt-2 text-2xl font-semibold">{liveData.experience.length}</p>
                <p className="mt-1 text-xs text-muted-foreground">Histórico profissional</p>
              </div>
              <div className="rounded-xl border border-border/70 bg-muted/25 p-4">
                <p className="text-xs uppercase tracking-[0.1em] text-muted-foreground">Projetos</p>
                <p className="mt-2 text-2xl font-semibold">{liveData.projects.length}</p>
                <p className="mt-1 text-xs text-muted-foreground">Portfólio publicado</p>
              </div>
              <div className="rounded-xl border border-border/70 bg-muted/25 p-4">
                <p className="text-xs uppercase tracking-[0.1em] text-muted-foreground">Pendências</p>
                <p className="mt-2 text-2xl font-semibold">{pendingTabs.length}</p>
                <p className="mt-1 text-xs text-muted-foreground">Seções editadas e ainda não salvas</p>
              </div>
            </div>

            {pendingTabs.length > 0 ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                Você tem alterações pendentes em {pendingTabs.length} seção(ões). Os itens marcados no menu lateral precisam ser salvos.
              </div>
            ) : (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                Nenhuma pendência no momento. Todas as seções estão sincronizadas com o conteúdo salvo.
              </div>
            )}
          </div>
        );
      case "profile":
        return (
          <AdminSection
            title="Topo do site"
            saving={!!tabSaving.profile}
            saved={!!tabSaved.profile}
            dirty={dirtyMap.profile}
            onSave={() => handleSaveTab("profile")}
          >
            <ProfileSection {...props} />
          </AdminSection>
        );
      case "about":
        return (
          <AdminSection
            title="Sobre"
            saving={!!tabSaving.about}
            saved={!!tabSaved.about}
            dirty={dirtyMap.about}
            onSave={() => handleSaveTab("about")}
          >
            <AboutSection {...props} />
          </AdminSection>
        );
      case "skills":
        return (
          <AdminSection
            title="Habilidades"
            saving={!!tabSaving.skills}
            saved={!!tabSaved.skills}
            dirty={dirtyMap.skills}
            onSave={() => handleSaveTab("skills")}
          >
            <SkillsSection {...props} />
          </AdminSection>
        );
      case "experience":
        return (
          <AdminSection
            title="Experiência"
            saving={!!tabSaving.experience}
            saved={!!tabSaved.experience}
            dirty={dirtyMap.experience}
            onSave={() => handleSaveTab("experience")}
          >
            <ExperienceSection {...props} />
          </AdminSection>
        );
      case "projects":
        return (
          <AdminSection
            title="Meus Projetos"
            saving={!!tabSaving.projects}
            saved={!!tabSaved.projects}
            dirty={dirtyMap.projects}
            onSave={() => handleSaveTab("projects")}
          >
            <ProjectsSection {...props} />
          </AdminSection>
        );
      case "gallery":
        return (
          <AdminSection
            title="Galeria"
            saving={!!tabSaving.gallery}
            saved={!!tabSaved.gallery}
            dirty={dirtyMap.gallery}
            onSave={() => handleSaveTab("gallery")}
          >
            <GallerySection {...props} />
          </AdminSection>
        );
      case "vitrine":
        return (
          <AdminSection
            title="Vitrine"
            saving={!!tabSaving.vitrine}
            saved={!!tabSaved.vitrine}
            dirty={dirtyMap.vitrine}
            onSave={() => handleSaveTab("vitrine")}
          >
            <VitrineSection {...props} />
          </AdminSection>
        );
      case "contact":
        return (
          <AdminSection
            title="Contato"
            saving={!!tabSaving.contact}
            saved={!!tabSaved.contact}
            dirty={dirtyMap.contact}
            onSave={() => handleSaveTab("contact")}
          >
            <ContactSection {...props} />
          </AdminSection>
        );
      case "pdf":
        return (
          <AdminSection
            title="Currículo (PDF)"
            saving={!!tabSaving.pdf}
            saved={!!tabSaved.pdf}
            dirty={dirtyMap.pdf}
            onSave={() => handleSaveTab("pdf")}
          >
            <PDFSection {...props} />
          </AdminSection>
        );
      case "media":
        return <ImagesGallery data={liveData} />;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isFirebaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
        <div className="w-full max-w-xl rounded-3xl border border-border bg-background p-8 shadow-xl">
          <AlertCircle className="mb-4 h-10 w-10 text-destructive" />
          <h1 className="mb-3 text-2xl font-semibold tracking-tight">Firebase não configurado</h1>
          <p className="mb-4 text-sm text-muted-foreground">
            Configure as variáveis no <code className="rounded bg-muted px-1.5 py-0.5 text-xs">.env</code> para habilitar o painel.
          </p>
          <pre className="mb-4 overflow-x-auto rounded-xl bg-muted p-4 text-left text-xs">
            {`VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...`}
          </pre>
          <a href="/" className="text-sm font-medium text-primary hover:underline">
            Voltar ao site
          </a>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
        <div className="w-full max-w-md rounded-3xl border border-border bg-background p-8 shadow-xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
            <Settings className="h-3.5 w-3.5" />
            Painel Admin
          </div>
          <h1 className="mb-6 text-2xl font-semibold tracking-tight">Entrar</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
            />
            {loginError && <p className="text-sm text-destructive">{loginError}</p>}
            <button
              type="submit"
              className="w-full rounded-xl bg-[#3c674f] py-3 font-medium text-white transition-opacity hover:opacity-90"
            >
              Entrar no dashboard
            </button>
          </form>
          <a href="/" className="mt-4 block text-center text-sm text-muted-foreground hover:text-foreground">
            Voltar ao site
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eef1fb] p-4 md:p-8">
      <div className="mx-auto max-w-[1400px] overflow-hidden rounded-[28px] border border-border/70 bg-background shadow-[0_20px_70px_-35px_rgba(16,24,40,0.35)]">
        <div className="grid min-h-[calc(100vh-2rem)] md:grid-cols-[260px_1fr]">
          <aside className="flex h-full flex-col border-b border-border/70 bg-muted/35 p-4 md:border-b-0 md:border-r md:p-5">
            <div className="mb-6 flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#3c674f] font-semibold text-white">EP</div>
              <div>
                <p className="text-sm font-semibold leading-tight">Eduarda Admin</p>
                <p className="text-xs text-muted-foreground">Painel de conteúdo</p>
              </div>
            </div>

            <nav className="space-y-1.5">
              {mainTabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const isDirty = tab.id !== "dashboard" && tab.id !== "media" ? dirtyMap[tab.id] : false;

                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabSelect(tab.id)}
                    className={`w-full rounded-xl px-3 py-2.5 text-left transition-colors ${isActive ? "bg-[#3c674f] text-white" : "text-muted-foreground hover:bg-background hover:text-foreground"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      {tab.icon}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-medium">{tab.label}</p>
                          {isDirty && (
                            <span className={`inline-flex h-2.5 w-2.5 rounded-full ${isActive ? "bg-amber-200" : "bg-amber-500"}`} />
                          )}
                        </div>
                        <p className={`truncate text-xs ${isActive ? "text-white/70" : "text-muted-foreground"}`}>{tab.hint}</p>
                      </div>
                    </div>
                  </button>
                );
              })}

              <div className="pt-1">
                <button
                  onClick={() => setProjectsMenuOpen((prev) => !prev)}
                  className="w-full rounded-xl px-3 py-2.5 text-left text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <FolderOpen className="h-4 w-4" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-medium">Projetos</p>
                          {hasPendingProjectTabs && <span className="inline-flex h-2.5 w-2.5 rounded-full bg-amber-500" />}
                        </div>
                        <p className="truncate text-xs text-muted-foreground">Conteúdo de projetos</p>
                      </div>
                    </div>
                    <ChevronDown className={`h-4 w-4 transition-transform ${projectsMenuOpen ? "rotate-180" : "rotate-0"}`} />
                  </div>
                </button>

                {projectsMenuOpen && (
                  <div className="ml-3 mt-1 space-y-1 border-l border-border/70 pl-3">
                    {projectTabs.map((tab) => {
                      const isActive = activeTab === tab.id;
                      const isDirty = dirtyMap[tab.id];

                      return (
                        <button
                          key={tab.id}
                          onClick={() => handleTabSelect(tab.id)}
                          className={`w-full rounded-lg px-3 py-2 text-left transition-colors ${isActive ? "bg-[#3c674f] text-white" : "text-muted-foreground hover:bg-background hover:text-foreground"
                            }`}
                        >
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-semibold">{tab.label}</p>
                            {isDirty && (
                              <span className={`inline-flex h-2.5 w-2.5 rounded-full ${isActive ? "bg-amber-200" : "bg-amber-500"}`} />
                            )}
                          </div>
                          <p className={`text-[11px] ${isActive ? "text-white/70" : "text-muted-foreground"}`}>{tab.hint}</p>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {mainTabsAfterProjects.map((tab) => {
                const isActive = activeTab === tab.id;
                const isDirty = tab.id !== "media" ? dirtyMap[tab.id as EditableTabId] : false;

                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabSelect(tab.id)}
                    className={`w-full rounded-xl px-3 py-2.5 text-left transition-colors ${isActive ? "bg-[#3c674f] text-white" : "text-muted-foreground hover:bg-background hover:text-foreground"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      {tab.icon}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-medium">{tab.label}</p>
                          {isDirty && (
                            <span className={`inline-flex h-2.5 w-2.5 rounded-full ${isActive ? "bg-amber-200" : "bg-amber-500"}`} />
                          )}
                        </div>
                        <p className={`truncate text-xs ${isActive ? "text-white/70" : "text-muted-foreground"}`}>{tab.hint}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </nav>

            <div className="mt-5 rounded-2xl bg-[#3c674f] p-4 text-white">
              <p className="mb-1 inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.12em] text-white/70">
                <Lightbulb className="h-3.5 w-3.5" />
                Dica
              </p>
              <p className="text-sm leading-relaxed">
                Cada botão de salvar publica apenas a seção aberta no momento. Se um item ficar com ponto amarelo no menu, ele ainda tem alterações pendentes.
              </p>
            </div>

            <div className="mt-auto pt-5">
              <div className="flex items-center gap-3 rounded-[20px] border border-border/70 bg-background/95 p-3 shadow-sm">
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted">
                  <ImageWithSkeleton
                    src={liveData.profile.fotoUrl}
                    alt={userName || "Usuário"}
                    wrapperClassName="h-full w-full"
                    className="object-cover"
                    fallback={
                      <div className="grid h-full w-full place-items-center bg-muted text-xs font-semibold text-foreground">
                        {userInitials || "EA"}
                      </div>
                    }
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold leading-tight">{userName || "Usuário"}</p>
                  <p className="truncate pt-0.5 text-xs text-muted-foreground">{userEmail}</p>
                </div>
              </div>
            </div>
          </aside>

          <main className="flex min-w-0 flex-col">
            <header className="border-b border-border/70 bg-background/85 px-4 py-4 backdrop-blur md:px-8 md:py-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                  <h1 className="text-2xl font-semibold tracking-tight">
                    <span>{tabTitle[activeTab]}</span>
                    {activeTab !== "dashboard" && activeTab !== "media" && dirtyMap[activeTab] && (
                      <span className="ml-2 inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 align-middle text-xs font-medium text-amber-700">
                        Alterações não salvas nesta seção.
                      </span>
                    )}
                  </h1>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-border px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <User className="h-4 w-4" />
                    Ver site
                  </a>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#3c674f] px-3.5 py-2 text-sm text-white transition-opacity hover:opacity-90"
                  >
                    <LogOut className="h-4 w-4" />
                    Sair
                  </button>
                </div>
              </div>
            </header>

            <section className="flex-1 space-y-6 overflow-y-auto p-4 md:p-8">{renderTab()}</section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;





