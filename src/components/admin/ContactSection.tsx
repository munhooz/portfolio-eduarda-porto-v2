import { SiteData } from "@/data/siteData";

interface ContactSectionProps {
  data: SiteData;
  onChange: (data: SiteData) => void;
}

const inputClass = "w-full px-3 py-2 rounded-lg bg-background border border-input text-foreground text-sm focus:ring-2 focus:ring-primary outline-none";
const labelClass = "block text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider";

const ContactSection = ({ data, onChange }: ContactSectionProps) => {
  const updateContact = (field: keyof SiteData["contact"], value: string) => {
    onChange({ ...data, contact: { ...data.contact, [field]: value } });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className={labelClass}>Email</label>
        <input className={inputClass} value={data.contact.email} onChange={(e) => updateContact("email", e.target.value)} />
        <p className="text-xs text-muted-foreground mt-1">Este email será usado no link mailto: do site.</p>
      </div>
      <div>
        <label className={labelClass}>Telefone</label>
        <input className={inputClass} value={data.contact.telefone} onChange={(e) => updateContact("telefone", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Cidade</label>
        <input className={inputClass} value={data.contact.cidade} onChange={(e) => updateContact("cidade", e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>LinkedIn (URL completa)</label>
        <input className={inputClass} value={data.contact.linkedin} onChange={(e) => updateContact("linkedin", e.target.value)} />
      </div>
    </div>
  );
};

export default ContactSection;
