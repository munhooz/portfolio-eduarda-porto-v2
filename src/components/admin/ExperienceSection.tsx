import { SiteData } from "@/data/siteData";
import { Plus, Trash2, Pencil, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface ExperienceSectionProps {
  data: SiteData;
  onChange: (data: SiteData) => void;
}

const inputClass = "w-full px-3 py-2 rounded-lg bg-background border border-input text-foreground text-sm focus:ring-2 focus:ring-primary outline-none";
const labelClass = "block text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider";

const ExperienceSection = ({ data, onChange }: ExperienceSectionProps) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const sortedExperience = [...data.experience].sort((a, b) => a.ordem - b.ordem);

  const updateExp = (index: number, field: string, value: string) => {
    const experience = [...data.experience];
    const realIndex = data.experience.indexOf(sortedExperience[index]);
    experience[realIndex] = { ...experience[realIndex], [field]: value };
    onChange({ ...data, experience });
  };

  const removeExp = (index: number) => {
    const item = sortedExperience[index];
    const experience = data.experience
      .filter((e) => e !== item)
      .map((e, i) => ({ ...e, ordem: i + 1 }));
    onChange({ ...data, experience });
    if (expandedIndex === index) setExpandedIndex(null);
  };

  const addExp = () => {
    const newExp = {
      cargo: "",
      empresa: "",
      periodo: "",
      descricao: "",
      ordem: data.experience.length + 1,
    };
    onChange({ ...data, experience: [...data.experience, newExp] });
    setExpandedIndex(sortedExperience.length);
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">As experiências são ordenadas pela ordem cadastrada (mais recentes no topo). Adicione novas ou edite clicando no item.</p>

      {sortedExperience.map((exp, i) => (
        <div key={i} className="glass-card overflow-hidden">
          <div
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-colors"
            onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{exp.cargo || "Nova experiência"}</p>
              <p className="text-xs text-muted-foreground">{exp.empresa} {exp.periodo && `• ${exp.periodo}`}</p>
            </div>
            <div className="flex items-center gap-2 ml-3">
              <button
                onClick={(e) => { e.stopPropagation(); removeExp(i); }}
                className="p-1 text-destructive hover:opacity-70"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              {expandedIndex === i ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
            </div>
          </div>

          {expandedIndex === i && (
            <div className="p-4 pt-0 space-y-3 border-t border-border">
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Cargo / Função</label>
                  <input className={inputClass} value={exp.cargo} onChange={(e) => updateExp(i, "cargo", e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Empresa</label>
                  <input className={inputClass} value={exp.empresa} onChange={(e) => updateExp(i, "empresa", e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Período (ex: Nov/2024 - Atual)</label>
                  <input className={inputClass} value={exp.periodo} onChange={(e) => updateExp(i, "periodo", e.target.value)} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Descrição das atividades</label>
                <textarea className={inputClass} rows={4} value={exp.descricao} onChange={(e) => updateExp(i, "descricao", e.target.value)} />
              </div>
            </div>
          )}
        </div>
      ))}

      <button
        onClick={addExp}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-primary text-primary text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
      >
        <Plus className="w-4 h-4" /> Adicionar Experiência
      </button>
    </div>
  );
};

export default ExperienceSection;
