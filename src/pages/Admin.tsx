import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { auth, isFirebaseConfigured, fetchSiteData, saveSiteData } from "@/lib/firebase";
import { SiteData, defaultSiteData } from "@/data/siteData";
import { LogOut, AlertCircle, User, FileText, Briefcase, FolderOpen, Mail, Award, GraduationCap } from "lucide-react";
import AdminSection from "@/components/admin/AdminSection";
import ProfileSection from "@/components/admin/ProfileSection";
import AboutSection from "@/components/admin/AboutSection";
import SkillsSection from "@/components/admin/SkillsSection";
import ExperienceSection from "@/components/admin/ExperienceSection";
import ProjectsSection from "@/components/admin/ProjectsSection";
import ContactSection from "@/components/admin/ContactSection";
import PDFSection from "@/components/admin/PDFSection";

type TabId = "profile" | "about" | "skills" | "experience" | "projects" | "contact" | "pdf";

const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "profile", label: "Início", icon: <User className="w-4 h-4" /> },
  { id: "about", label: "Sobre Mim", icon: <FileText className="w-4 h-4" /> },
  { id: "skills", label: "Habilidades", icon: <Award className="w-4 h-4" /> },
  { id: "experience", label: "Experiência", icon: <Briefcase className="w-4 h-4" /> },
  { id: "projects", label: "Projetos", icon: <FolderOpen className="w-4 h-4" /> },
  { id: "contact", label: "Contato", icon: <Mail className="w-4 h-4" /> },
  { id: "pdf", label: "Currículo", icon: <GraduationCap className="w-4 h-4" /> },
];

const AdminPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState<TabId>("profile");

  // Each tab has its own data snapshot + save state
  const [liveData, setLiveData] = useState<SiteData>(defaultSiteData);
  const [tabSaving, setTabSaving] = useState<Record<TabId, boolean>>({} as any);
  const [tabSaved, setTabSaved] = useState<Record<TabId, boolean>>({} as any);

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
    navigate("/");
  };

  const handleSaveTab = useCallback(async (tabId: TabId) => {
    setTabSaving((prev) => ({ ...prev, [tabId]: true }));
    try {
      await saveSiteData(liveData);
      setTabSaved((prev) => ({ ...prev, [tabId]: true }));
      setTimeout(() => setTabSaved((prev) => ({ ...prev, [tabId]: false })), 2500);
    } catch {
      alert("Erro ao salvar. Verifique a configuração do Firebase.");
    }
    setTabSaving((prev) => ({ ...prev, [tabId]: false }));
  }, [liveData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isFirebaseConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="glass-card p-8 max-w-lg text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4 font-sans">Firebase não configurado</h1>
          <p className="text-muted-foreground mb-4">
            Para usar o painel admin, configure as variáveis de ambiente do Firebase no arquivo <code className="bg-muted px-1.5 py-0.5 rounded text-sm">.env</code>:
          </p>
          <pre className="text-left text-xs bg-muted p-4 rounded-lg overflow-x-auto mb-4">
{`VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...`}
          </pre>
          <a href="/" className="text-primary hover:underline font-medium">← Voltar ao site</a>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="glass-card p-8 w-full max-w-sm">
          <h1 className="text-2xl font-bold mb-6 text-center font-sans">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-background border border-input text-foreground focus:ring-2 focus:ring-primary outline-none"
            />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-background border border-input text-foreground focus:ring-2 focus:ring-primary outline-none"
            />
            {loginError && <p className="text-destructive text-sm">{loginError}</p>}
            <button
              type="submit"
              className="w-full py-3 rounded-lg gradient-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
            >
              Entrar
            </button>
          </form>
          <a href="/" className="block text-center mt-4 text-sm text-muted-foreground hover:text-primary">
            ← Voltar ao site
          </a>
        </div>
      </div>
    );
  }

  const renderTab = () => {
    const props = { data: liveData, onChange: setLiveData };

    switch (activeTab) {
      case "profile":
        return (
          <AdminSection title="Início" saving={!!tabSaving.profile} saved={!!tabSaved.profile} onSave={() => handleSaveTab("profile")}>
            <ProfileSection {...props} />
          </AdminSection>
        );
      case "about":
        return (
          <AdminSection title="Sobre Mim" saving={!!tabSaving.about} saved={!!tabSaved.about} onSave={() => handleSaveTab("about")}>
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
          <AdminSection title="Experiência" saving={!!tabSaving.experience} saved={!!tabSaved.experience} onSave={() => handleSaveTab("experience")}>
            <ExperienceSection {...props} />
          </AdminSection>
        );
      case "projects":
        return (
          <AdminSection title="Projetos" saving={!!tabSaving.projects} saved={!!tabSaved.projects} onSave={() => handleSaveTab("projects")}>
            <ProjectsSection {...props} />
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
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="/" className="text-xl font-bold font-serif gradient-text">EP</a>
          <span className="text-xs text-muted-foreground">Painel Admin</span>
        </div>
        <button onClick={handleLogout} className="inline-flex items-center gap-2 p-2 text-muted-foreground hover:text-destructive transition-colors text-sm">
          <LogOut className="w-4 h-4" /> Sair
        </button>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "gradient-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {renderTab()}
      </div>
    </div>
  );
};

export default AdminPage;
