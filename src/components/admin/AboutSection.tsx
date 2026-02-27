import { SiteData } from "@/data/siteData";

interface AboutSectionProps {
  data: SiteData;
  onChange: (data: SiteData) => void;
}

const inputClass = "w-full px-3 py-2 rounded-lg bg-background border border-input text-foreground text-sm focus:ring-2 focus:ring-primary outline-none";
const labelClass = "block text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider";

const AboutSection = ({ data, onChange }: AboutSectionProps) => {
  return (
    <div>
      <label className={labelClass}>Texto Sobre Mim</label>
      <textarea
        className={inputClass}
        rows={10}
        value={data.about.texto}
        onChange={(e) => onChange({ ...data, about: { ...data.about, texto: e.target.value } })}
      />
      <p className="text-xs text-muted-foreground mt-2">Use duas quebras de linha para separar parágrafos.</p>
    </div>
  );
};

export default AboutSection;
