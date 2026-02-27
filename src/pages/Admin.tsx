import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { auth, isFirebaseConfigured, fetchSiteData, saveSiteData } from "@/lib/firebase";
import { SiteData, defaultSiteData } from "@/data/siteData";
import {
  AlertCircle,
  Award,
  Briefcase,
  FileText,
  FolderOpen,
  GraduationCap,
  Home,
  LayoutDashboard,
  Lightbulb,
  LogOut,
  Mail,
  Images,
  ChevronDown,
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

const mainTabs: { id: TabId; label: string; icon: React.ReactNode; hint: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" />, hint: "Visao geral" },
  { id: "profile", label: "Topo do site", icon: <Home className="w-4 h-4" />, hint: "Nome, texto e foto" },
  { id: "about", label: "Sobre", icon: <FileText className="w-4 h-4" />, hint: "Apresentacao" },
  { id: "skills", label: "Habilidades", icon: <Award className="w-4 h-4" />, hint: "Lista com ordem" },
  { id: "experience", label: "Experiência", icon: <Briefcase className="w-4 h-4" />, hint: "Histórico profissional" },
];

const mainTabsAfterProjects: { id: TabId; label: string; icon: React.ReactNode; hint: string }[] = [
  { id: "contact", label: "Contato", icon: <Mail className="w-4 h-4" />, hint: "Canais públicos" },
  { id: "pdf", label: "Currículo", icon: <GraduationCap className="w-4 h-4" />, hint: "Arquivo PDF" },
  { id: "media", label: "Mídia", icon: <Images className="w-4 h-4" />, hint: "Imagens usadas" },
];

const projectTabs: { id: TabId; label: string; hint: string }[] = [
  { id: "projects", label: "Meus Projetos", hint: "Cards do portfolio" },
  { id: "gallery", label: "Galeria", hint: "Eventos e cerimonial" },
  { id: "vitrine", label: "Vitrine", hint: "Imagens da vitrine" },
];

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
  const [tabSaving, setTabSaving] = useState<Record<TabId, boolean>>({} as Record<TabId, boolean>);
  const [tabSaved, setTabSaved] = useState<Record<TabId, boolean>>({} as Record<TabId, boolean>);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setLoading(false);
      return;
    }

    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      if (u) {
        fetchSiteData().then(setLiveData);
      }
    });

    return unsub;
  }, []);

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
    async (tabId: TabId) => {
      setTabSaving((prev) => ({ ...prev, [tabId]: true }));
      try {
        await saveSiteData(liveData);
        setTabSaved((prev) => ({ ...prev, [tabId]: true }));
        setTimeout(() => setTabSaved((prev) => ({ ...prev, [tabId]: false })), 2500);
      } catch {
        alert("Erro ao salvar. Verifique a configuração do Firebase.");
      }
      setTabSaving((prev) => ({ ...prev, [tabId]: false }));
    },
    [liveData],
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isFirebaseConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
        <div className="w-full max-w-xl rounded-3xl border border-border bg-background p-8 shadow-xl">
          <AlertCircle className="w-10 h-10 text-destructive mb-4" />
          <h1 className="text-2xl font-semibold tracking-tight mb-3">Firebase não configurado</h1>
          <p className="text-sm text-muted-foreground mb-4">
            Configure as variáveis no <code className="bg-muted px-1.5 py-0.5 rounded text-xs">.env</code> para habilitar o painel.
          </p>
          <pre className="text-left text-xs bg-muted p-4 rounded-xl overflow-x-auto mb-4">
{`VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...`}
          </pre>
          <a href="/" className="text-primary hover:underline text-sm font-medium">Voltar ao site</a>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-100 p-6 flex items-center justify-center">
        <div className="w-full max-w-md rounded-3xl border border-border bg-background p-8 shadow-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs mb-4">
            <Settings className="w-3.5 h-3.5" />
            Painel Admin
          </div>
          <h1 className="text-2xl font-semibold tracking-tight mb-6">Entrar</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-background border border-input text-foreground text-sm focus:ring-2 focus:ring-primary outline-none"
            />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-background border border-input text-foreground text-sm focus:ring-2 focus:ring-primary outline-none"
            />
            {loginError && <p className="text-destructive text-sm">{loginError}</p>}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#3c674f] text-white font-medium hover:opacity-90 transition-opacity"
            >
              Entrar no dashboard
            </button>
          </form>
          <a href="/" className="block text-center mt-4 text-sm text-muted-foreground hover:text-foreground">
            Voltar ao site
          </a>
        </div>
      </div>
    );
  }

  const dashboardStats = [
    { label: "Habilidades", value: liveData.skills.length, note: "Itens cadastrados" },
    { label: "Experiências", value: liveData.experience.length, note: "Histórico profissional" },
    { label: "Projetos", value: liveData.projects.length, note: "Portfolio publicado" },
  ];

  const renderTab = () => {
    const props = { data: liveData, onChange: setLiveData };

    switch (activeTab) {
      case "dashboard":
        return (
          <div className="rounded-2xl border border-border/70 bg-background p-4 md:p-6 shadow-sm space-y-5">
            <h2 className="text-xl font-semibold tracking-tight">Visao geral do site</h2>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              {dashboardStats.map((item) => (
                <div key={item.label} className="rounded-xl border border-border/70 bg-muted/25 p-4">
                  <p className="text-xs uppercase tracking-[0.1em] text-muted-foreground">{item.label}</p>
                  <p className="text-2xl font-semibold mt-2">{item.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.note}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Se quiser, no proximo passo eu integro eventos de analytics (ex.: clique em baixar curriculo) para mostrar metricas reais aqui.
            </p>
          </div>
        );
      case "profile":
        return (
          <AdminSection title="Topo do site" saving={!!tabSaving.profile} saved={!!tabSaved.profile} onSave={() => handleSaveTab("profile")}>
            <ProfileSection {...props} />
          </AdminSection>
        );
      case "about":
        return (
          <AdminSection title="Sobre" saving={!!tabSaving.about} saved={!!tabSaved.about} onSave={() => handleSaveTab("about")}>
            <AboutSection {...props} />
          </AdminSection>
        );
      case "skills":
        return (
          <AdminSection title="Habilidades" saving={!!tabSaving.skills} saved={!!tabSaved.skills} onSave={() => handleSaveTab("skills")}>
            <SkillsSection {...props} />
          </AdminSection>
        );
      case "experience":
        return (
          <AdminSection
            title="Experiência"
            saving={!!tabSaving.experience}
            saved={!!tabSaved.experience}
            onSave={() => handleSaveTab("experience")}
          >
            <ExperienceSection {...props} />
          </AdminSection>
        );
      case "projects":
        return (
          <AdminSection title="Meus Projetos" saving={!!tabSaving.projects} saved={!!tabSaved.projects} onSave={() => handleSaveTab("projects")}>
            <ProjectsSection {...props} />
          </AdminSection>
        );
      case "gallery":
        return (
          <AdminSection title="Galeria" saving={!!tabSaving.gallery} saved={!!tabSaved.gallery} onSave={() => handleSaveTab("gallery")}>
            <GallerySection {...props} />
          </AdminSection>
        );
      case "vitrine":
        return (
          <AdminSection title="Vitrine" saving={!!tabSaving.vitrine} saved={!!tabSaved.vitrine} onSave={() => handleSaveTab("vitrine")}>
            <VitrineSection {...props} />
          </AdminSection>
        );
      case "contact":
        return (
          <AdminSection title="Contato" saving={!!tabSaving.contact} saved={!!tabSaved.contact} onSave={() => handleSaveTab("contact")}>
            <ContactSection {...props} />
          </AdminSection>
        );
      case "pdf":
        return (
          <AdminSection title="Currículo (PDF)" saving={!!tabSaving.pdf} saved={!!tabSaved.pdf} onSave={() => handleSaveTab("pdf")}>
            <PDFSection {...props} />
          </AdminSection>
        );
      case "media":
        return <ImagesGallery data={liveData} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#eef1fb] p-4 md:p-8">
      <div className="mx-auto max-w-[1400px] overflow-hidden rounded-[28px] border border-border/70 bg-background shadow-[0_20px_70px_-35px_rgba(16,24,40,0.35)]">
        <div className="grid min-h-[calc(100vh-2rem)] md:grid-cols-[260px_1fr]">
          <aside className="border-b md:border-b-0 md:border-r border-border/70 bg-muted/35 p-4 md:p-5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-[#3c674f] text-white grid place-items-center font-semibold">EP</div>
              <div>
                <p className="text-sm font-semibold leading-tight">Eduarda Admin</p>
                <p className="text-xs text-muted-foreground">Painel de conteudo</p>
              </div>
            </div>

            <div className="rounded-2xl border border-border/70 bg-background/90 p-3 mb-5">
              <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground mb-2">Sessao</p>
              <p className="text-sm font-medium truncate">{user.email || "Usuario autenticado"}</p>
            </div>

            <nav className="space-y-1.5">
              {mainTabs.map((tab) => {
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabSelect(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                      isActive
                        ? "bg-[#3c674f] text-white"
                        : "text-muted-foreground hover:bg-background hover:text-foreground"
                    }`}
                  >
                    {tab.icon}
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{tab.label}</p>
                      <p className={`text-xs truncate ${isActive ? "text-white/70" : "text-muted-foreground"}`}>{tab.hint}</p>
                    </div>
                  </button>
                );
              })}

              <div className="pt-1">
                {(() => {
                  return (
                    <>
                <button
                  onClick={() => setProjectsMenuOpen((prev) => !prev)}
                  className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-left text-muted-foreground hover:bg-background hover:text-foreground transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FolderOpen className="w-4 h-4" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">Projetos</p>
                      <p className="text-xs truncate text-muted-foreground">Conteúdo de projetos</p>
                    </div>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${projectsMenuOpen ? "rotate-180" : "rotate-0"}`} />
                </button>

                {projectsMenuOpen && (
                  <div className="mt-1 ml-3 pl-3 border-l border-border/70 space-y-1">
                    {projectTabs.map((tab) => {
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => handleTabSelect(tab.id)}
                          className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                            isActive ? "bg-[#3c674f] text-white" : "text-muted-foreground hover:bg-background hover:text-foreground"
                          }`}
                        >
                          <p className="text-xs font-semibold">{tab.label}</p>
                          <p className={`text-[11px] ${isActive ? "text-white/70" : "text-muted-foreground"}`}>{tab.hint}</p>
                        </button>
                      );
                    })}
                  </div>
                )}
                    </>
                  );
                })()}
              </div>

              {mainTabsAfterProjects.map((tab) => {
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabSelect(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                      isActive
                        ? "bg-[#3c674f] text-white"
                        : "text-muted-foreground hover:bg-background hover:text-foreground"
                    }`}
                  >
                    {tab.icon}
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{tab.label}</p>
                      <p className={`text-xs truncate ${isActive ? "text-white/70" : "text-muted-foreground"}`}>{tab.hint}</p>
                    </div>
                  </button>
                );
              })}
            </nav>

            <div className="mt-5 rounded-2xl bg-[#3c674f] text-white p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-white/70 mb-1 inline-flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5" />
                Dica
              </p>
              <p className="text-sm leading-relaxed">Depois de editar cada seção, clique em salvar para publicar as mudanças no site.</p>
            </div>
          </aside>

          <main className="min-w-0 flex flex-col">
            <header className="border-b border-border/70 px-4 py-4 md:px-8 md:py-5 bg-background/85 backdrop-blur">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h1 className="text-2xl font-semibold tracking-tight">{tabTitle[activeTab]}</h1>

                <div className="flex items-center gap-2">
                  <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Ver site
                  </a>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#3c674f] text-white text-sm hover:opacity-90 transition-opacity"
                  >
                    <LogOut className="w-4 h-4" />
                    Sair
                  </button>
                </div>
              </div>
            </header>

            <section className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">{renderTab()}</section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
