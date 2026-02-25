import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { auth, isFirebaseConfigured, fetchSiteData, saveSiteData } from "@/lib/firebase";
import { SiteData, defaultSiteData } from "@/data/siteData";
import { Save, LogOut, Plus, Trash2, ArrowUp, ArrowDown, AlertCircle } from "lucide-react";

const AdminPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [data, setData] = useState<SiteData>(defaultSiteData);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      if (u) {
        fetchSiteData().then(setData);
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
    } catch (err: any) {
      setLoginError("Email ou senha inválidos.");
    }
  };

  const handleLogout = async () => {
    if (auth) await signOut(auth);
    navigate("/");
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveSiteData(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      alert("Erro ao salvar. Verifique a configuração do Firebase.");
    }
    setSaving(false);
  };

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

  const tabs = [
    { id: "profile", label: "Perfil" },
    { id: "about", label: "Sobre" },
    { id: "skills", label: "Habilidades" },
    { id: "experience", label: "Experiência" },
    { id: "projects", label: "Projetos" },
    { id: "contact", label: "Contato" },
  ];

  const updateField = (path: string, value: any) => {
    setData((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      const keys = path.split(".");
      let obj = copy;
      for (let i = 0; i < keys.length - 1; i++) {
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return copy;
    });
  };

  const moveItem = (arr: any[], index: number, direction: -1 | 1) => {
    const newArr = [...arr];
    const target = index + direction;
    if (target < 0 || target >= newArr.length) return arr;
    [newArr[index], newArr[target]] = [newArr[target], newArr[index]];
    return newArr.map((item, i) => ({ ...item, ordem: i + 1 }));
  };

  const inputClass = "w-full px-3 py-2 rounded-lg bg-background border border-input text-foreground text-sm focus:ring-2 focus:ring-primary outline-none";
  const labelClass = "block text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider";

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="/" className="text-xl font-bold font-serif gradient-text">EP</a>
          <span className="text-xs text-muted-foreground">Painel Admin</span>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="text-sm text-primary font-medium">Salvo ✓</span>}
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? "Salvando..." : "Salvar"}
          </button>
          <button onClick={handleLogout} className="p-2 text-muted-foreground hover:text-destructive transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "gradient-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Profile */}
        {activeTab === "profile" && (
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Nome</label>
              <input className={inputClass} value={data.profile.nome} onChange={(e) => updateField("profile.nome", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Título</label>
              <input className={inputClass} value={data.profile.titulo} onChange={(e) => updateField("profile.titulo", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Descrição</label>
              <textarea className={inputClass} rows={3} value={data.profile.descricao} onChange={(e) => updateField("profile.descricao", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>URL da Foto</label>
              <input className={inputClass} value={data.profile.fotoUrl} onChange={(e) => updateField("profile.fotoUrl", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>URL do Currículo (PDF)</label>
              <input className={inputClass} value={data.cvUrl} onChange={(e) => updateField("cvUrl", e.target.value)} />
            </div>
          </div>
        )}

        {/* About */}
        {activeTab === "about" && (
          <div>
            <label className={labelClass}>Texto Sobre</label>
            <textarea className={inputClass} rows={8} value={data.about.texto} onChange={(e) => updateField("about.texto", e.target.value)} />
          </div>
        )}

        {/* Skills */}
        {activeTab === "skills" && (
          <div className="space-y-4">
            {data.skills.map((skill, i) => (
              <div key={i} className="glass-card p-4 flex items-center gap-4">
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Nome</label>
                    <input className={inputClass} value={skill.nome} onChange={(e) => {
                      const skills = [...data.skills];
                      skills[i] = { ...skills[i], nome: e.target.value };
                      updateField("skills", skills);
                    }} />
                  </div>
                  <div>
                    <label className={labelClass}>Nível (%)</label>
                    <input className={inputClass} type="number" min={0} max={100} value={skill.nivelPercentual} onChange={(e) => {
                      const skills = [...data.skills];
                      skills[i] = { ...skills[i], nivelPercentual: Number(e.target.value) };
                      updateField("skills", skills);
                    }} />
                  </div>
                </div>
                <button onClick={() => updateField("skills", data.skills.filter((_, idx) => idx !== i))} className="text-destructive hover:opacity-70">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={() => updateField("skills", [...data.skills, { nome: "", nivelPercentual: 50 }])}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-primary text-primary text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <Plus className="w-4 h-4" /> Adicionar
            </button>
          </div>
        )}

        {/* Experience */}
        {activeTab === "experience" && (
          <div className="space-y-4">
            {data.experience.map((exp, i) => (
              <div key={i} className="glass-card p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">#{i + 1}</span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => updateField("experience", moveItem(data.experience, i, -1))} className="p-1 text-muted-foreground hover:text-foreground"><ArrowUp className="w-4 h-4" /></button>
                    <button onClick={() => updateField("experience", moveItem(data.experience, i, 1))} className="p-1 text-muted-foreground hover:text-foreground"><ArrowDown className="w-4 h-4" /></button>
                    <button onClick={() => updateField("experience", data.experience.filter((_, idx) => idx !== i))} className="p-1 text-destructive hover:opacity-70"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  <div><label className={labelClass}>Cargo</label><input className={inputClass} value={exp.cargo} onChange={(e) => { const arr = [...data.experience]; arr[i] = { ...arr[i], cargo: e.target.value }; updateField("experience", arr); }} /></div>
                  <div><label className={labelClass}>Empresa</label><input className={inputClass} value={exp.empresa} onChange={(e) => { const arr = [...data.experience]; arr[i] = { ...arr[i], empresa: e.target.value }; updateField("experience", arr); }} /></div>
                  <div><label className={labelClass}>Período</label><input className={inputClass} value={exp.periodo} onChange={(e) => { const arr = [...data.experience]; arr[i] = { ...arr[i], periodo: e.target.value }; updateField("experience", arr); }} /></div>
                </div>
                <div><label className={labelClass}>Descrição</label><textarea className={inputClass} rows={3} value={exp.descricao} onChange={(e) => { const arr = [...data.experience]; arr[i] = { ...arr[i], descricao: e.target.value }; updateField("experience", arr); }} /></div>
              </div>
            ))}
            <button
              onClick={() => updateField("experience", [...data.experience, { cargo: "", empresa: "", periodo: "", descricao: "", ordem: data.experience.length + 1 }])}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-primary text-primary text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <Plus className="w-4 h-4" /> Adicionar
            </button>
          </div>
        )}

        {/* Projects */}
        {activeTab === "projects" && (
          <div className="space-y-4">
            {data.projects.map((proj, i) => (
              <div key={i} className="glass-card p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">#{i + 1}</span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => updateField("projects", moveItem(data.projects, i, -1))} className="p-1 text-muted-foreground hover:text-foreground"><ArrowUp className="w-4 h-4" /></button>
                    <button onClick={() => updateField("projects", moveItem(data.projects, i, 1))} className="p-1 text-muted-foreground hover:text-foreground"><ArrowDown className="w-4 h-4" /></button>
                    <button onClick={() => updateField("projects", data.projects.filter((_, idx) => idx !== i))} className="p-1 text-destructive hover:opacity-70"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  <div><label className={labelClass}>Título</label><input className={inputClass} value={proj.titulo} onChange={(e) => { const arr = [...data.projects]; arr[i] = { ...arr[i], titulo: e.target.value }; updateField("projects", arr); }} /></div>
                  <div><label className={labelClass}>Categoria</label><input className={inputClass} value={proj.categoria} onChange={(e) => { const arr = [...data.projects]; arr[i] = { ...arr[i], categoria: e.target.value }; updateField("projects", arr); }} /></div>
                  <div><label className={labelClass}>Link</label><input className={inputClass} value={proj.link} onChange={(e) => { const arr = [...data.projects]; arr[i] = { ...arr[i], link: e.target.value }; updateField("projects", arr); }} /></div>
                  <div><label className={labelClass}>URL da Imagem</label><input className={inputClass} value={proj.imageUrl} onChange={(e) => { const arr = [...data.projects]; arr[i] = { ...arr[i], imageUrl: e.target.value }; updateField("projects", arr); }} /></div>
                </div>
                <div><label className={labelClass}>Descrição</label><textarea className={inputClass} rows={2} value={proj.descricao} onChange={(e) => { const arr = [...data.projects]; arr[i] = { ...arr[i], descricao: e.target.value }; updateField("projects", arr); }} /></div>
              </div>
            ))}
            <button
              onClick={() => updateField("projects", [...data.projects, { titulo: "", descricao: "", link: "", imageUrl: "", categoria: "", ordem: data.projects.length + 1 }])}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-primary text-primary text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <Plus className="w-4 h-4" /> Adicionar
            </button>
          </div>
        )}

        {/* Contact */}
        {activeTab === "contact" && (
          <div className="space-y-4">
            <div><label className={labelClass}>Email</label><input className={inputClass} value={data.contact.email} onChange={(e) => updateField("contact.email", e.target.value)} /></div>
            <div><label className={labelClass}>Telefone</label><input className={inputClass} value={data.contact.telefone} onChange={(e) => updateField("contact.telefone", e.target.value)} /></div>
            <div><label className={labelClass}>Cidade</label><input className={inputClass} value={data.contact.cidade} onChange={(e) => updateField("contact.cidade", e.target.value)} /></div>
            <div><label className={labelClass}>LinkedIn</label><input className={inputClass} value={data.contact.linkedin} onChange={(e) => updateField("contact.linkedin", e.target.value)} /></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
