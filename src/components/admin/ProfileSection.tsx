import { SiteData } from "@/data/siteData";
import ImageUpload from "./ImageUpload";

interface ProfileSectionProps {
  data: SiteData;
  onChange: (data: SiteData) => void;
}

const inputClass = "w-full px-3 py-2 rounded-lg bg-background border border-input text-foreground text-sm focus:ring-2 focus:ring-primary outline-none";
const labelClass = "block text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider";

const ProfileSection = ({ data, onChange }: ProfileSectionProps) => {
  const update = (field: keyof SiteData["profile"], value: string) => {
    onChange({ ...data, profile: { ...data.profile, [field]: value } });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className={labelClass}>Nome</label>
        <input className={inputClass} value={data.profile.nome} onChange={(e) => update("nome", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Profissão / Título</label>
        <input className={inputClass} value={data.profile.titulo} onChange={(e) => update("titulo", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Descrição do Hero</label>
        <textarea className={inputClass} rows={3} value={data.profile.descricao} onChange={(e) => update("descricao", e.target.value)} />
      </div>
      <ImageUpload
        label="Foto de Perfil"
        value={data.profile.fotoUrl}
        onChange={(url) => update("fotoUrl", url)}
      />
    </div>
  );
};

export default ProfileSection;
