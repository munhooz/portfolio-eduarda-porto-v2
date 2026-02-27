import { SiteData } from "@/data/siteData";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import SortableItem from "./SortableItem";
import ImageUpload from "./ImageUpload";

interface ProjectsSectionProps {
  data: SiteData;
  onChange: (data: SiteData) => void;
}

const inputClass = "w-full px-3 py-2 rounded-lg bg-background border border-input text-foreground text-sm focus:ring-2 focus:ring-primary outline-none";
const labelClass = "block text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider";

const ProjectsSection = ({ data, onChange }: ProjectsSectionProps) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = data.projects.findIndex((_, i) => `proj-${i}` === active.id);
    const newIndex = data.projects.findIndex((_, i) => `proj-${i}` === over.id);

    const reordered = arrayMove(data.projects, oldIndex, newIndex).map((p, i) => ({ ...p, ordem: i + 1 }));
    onChange({ ...data, projects: reordered });
    setExpandedIndex(null);
  };

  const updateProject = (index: number, field: string, value: string) => {
    const projects = [...data.projects];
    projects[index] = { ...projects[index], [field]: value };
    onChange({ ...data, projects });
  };

  const removeProject = (index: number) => {
    const projects = data.projects.filter((_, i) => i !== index).map((p, i) => ({ ...p, ordem: i + 1 }));
    onChange({ ...data, projects });
    if (expandedIndex === index) setExpandedIndex(null);
  };

  const addProject = () => {
    const newProj = {
      titulo: "",
      descricao: "",
      link: "",
      imageUrl: "",
      categoria: "",
      ordem: data.projects.length + 1,
    };
    onChange({ ...data, projects: [...data.projects, newProj] });
    setExpandedIndex(data.projects.length);
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">Arraste os itens para reorganizar a ordem de exibição no site. Clique para expandir e editar.</p>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={data.projects.map((_, i) => `proj-${i}`)} strategy={verticalListSortingStrategy}>
          {data.projects.map((proj, i) => (
            <SortableItem key={`proj-${i}`} id={`proj-${i}`}>
              <div className="glass-card overflow-hidden">
                <div
                  className="flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
                >
                  {proj.imageUrl && (
                    <img src={proj.imageUrl} alt={proj.titulo} className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-border" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{proj.titulo || "Novo projeto"}</p>
                    <p className="text-xs text-muted-foreground">{proj.categoria}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeProject(i);
                      }}
                      className="p-1 text-destructive hover:opacity-70"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {expandedIndex === i ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {expandedIndex === i && (
                  <div className="p-4 pt-3 space-y-3 border-t border-border">
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <label className={labelClass}>Título</label>
                        <input className={inputClass} value={proj.titulo} onChange={(e) => updateProject(i, "titulo", e.target.value)} />
                      </div>
                      <div>
                        <label className={labelClass}>Categoria</label>
                        <input className={inputClass} value={proj.categoria} onChange={(e) => updateProject(i, "categoria", e.target.value)} />
                      </div>
                      <div>
                        <label className={labelClass}>Link</label>
                        <input className={inputClass} value={proj.link} onChange={(e) => updateProject(i, "link", e.target.value)} />
                      </div>
                    </div>
                    <ImageUpload label="Imagem do Projeto" value={proj.imageUrl} onChange={(url) => updateProject(i, "imageUrl", url)} />
                    <div>
                      <label className={labelClass}>Descrição</label>
                      <textarea className={inputClass} rows={3} value={proj.descricao} onChange={(e) => updateProject(i, "descricao", e.target.value)} />
                    </div>
                  </div>
                )}
              </div>
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>

      <div className="flex justify-center py-4">
        <button
          onClick={addProject}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-primary text-primary text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          <Plus className="w-4 h-4" /> Adicionar Projeto
        </button>
      </div>
    </div>
  );
};

export default ProjectsSection;
