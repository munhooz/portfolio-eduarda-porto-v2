import { SiteData } from "@/data/siteData";
import { Plus, Trash2 } from "lucide-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import SortableItem from "./SortableItem";

interface SkillsSectionProps {
  data: SiteData;
  onChange: (data: SiteData) => void;
}

const inputClass = "w-full px-3 py-2 rounded-lg bg-background border border-input text-foreground text-sm focus:ring-2 focus:ring-primary outline-none";
const labelClass = "block text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider";

const SkillsSection = ({ data, onChange }: SkillsSectionProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = data.skills.findIndex((_, i) => `skill-${i}` === active.id);
    const newIndex = data.skills.findIndex((_, i) => `skill-${i}` === over.id);

    const reordered = arrayMove(data.skills, oldIndex, newIndex).map((s, i) => ({ ...s, ordem: i + 1 }));
    onChange({ ...data, skills: reordered });
  };

  const updateSkill = (index: number, field: string, value: any) => {
    const skills = [...data.skills];
    skills[index] = { ...skills[index], [field]: value };
    onChange({ ...data, skills });
  };

  const removeSkill = (index: number) => {
    const skills = data.skills.filter((_, i) => i !== index).map((s, i) => ({ ...s, ordem: i + 1 }));
    onChange({ ...data, skills });
  };

  const addSkill = () => {
    onChange({
      ...data,
      skills: [...data.skills, { nome: "", nivelPercentual: 50, ordem: data.skills.length + 1 }],
    });
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">Arraste os itens para reorganizar a ordem de exibição no site.</p>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={data.skills.map((_, i) => `skill-${i}`)} strategy={verticalListSortingStrategy}>
          {data.skills.map((skill, i) => (
            <SortableItem key={`skill-${i}`} id={`skill-${i}`}>
              <div className="glass-card p-4 flex items-center gap-4">
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Nome</label>
                    <input className={inputClass} value={skill.nome} onChange={(e) => updateSkill(i, "nome", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Nível (%)</label>
                    <input className={inputClass} type="number" min={0} max={100} value={skill.nivelPercentual} onChange={(e) => updateSkill(i, "nivelPercentual", Number(e.target.value))} />
                  </div>
                </div>
                <button onClick={() => removeSkill(i)} className="text-destructive hover:opacity-70 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>

      <div className="flex justify-center py-4">
        <button
          onClick={addSkill}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-primary text-primary text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          <Plus className="w-4 h-4" /> Adicionar Habilidade
        </button>
      </div>
    </div>
  );
};

export default SkillsSection;
