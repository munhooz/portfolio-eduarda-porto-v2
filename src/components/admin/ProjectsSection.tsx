import { useMemo, useState } from "react";
import { DndContext, closestCenter, DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { ChevronDown, ChevronUp, Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import { SiteData } from "@/data/siteData";
import ImageUpload from "./ImageUpload";
import SortableItem from "./SortableItem";
import ConfirmDeleteButton from "./ConfirmDeleteButton";

interface ProjectsSectionProps {
  data: SiteData;
  onChange: (data: SiteData) => void;
}

const inputClass =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary";
const labelClass = "mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground";

const PROTECTED_INTERNAL_LINKS = new Set(["/galeria", "/vitrine"]);
const PROTECTED_PROJECT_TITLES = new Set(["Galeria de Fotos", "Vitrine"]);

const isProtectedProject = (project: SiteData["projects"][number]) =>
  PROTECTED_INTERNAL_LINKS.has(project.link) || PROTECTED_PROJECT_TITLES.has(project.titulo);

const normalizeProjectOrder = (projects: SiteData["projects"]) => {
  const visible = projects.filter((project) => !project.oculto).map((project, index) => ({ ...project, ordem: index + 1 }));
  const hidden = projects.filter((project) => project.oculto).map((project, index) => ({ ...project, ordem: visible.length + index + 1 }));
  return [...visible, ...hidden];
};

const ProjectsSection = ({ data, onChange }: ProjectsSectionProps) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }), useSensor(KeyboardSensor));

  const visibleProjects = useMemo(
    () =>
      data.projects
        .map((project, index) => ({ project, index }))
        .filter(({ project }) => !project.oculto)
        .sort((a, b) => a.project.ordem - b.project.ordem),
    [data.projects],
  );

  const hiddenProjects = useMemo(
    () =>
      data.projects
        .map((project, index) => ({ project, index }))
        .filter(({ project }) => project.oculto)
        .sort((a, b) => a.project.ordem - b.project.ordem),
    [data.projects],
  );

  const updateProjects = (projects: SiteData["projects"]) => {
    onChange({ ...data, projects: normalizeProjectOrder(projects) });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = visibleProjects.findIndex(({ index }) => `proj-${index}` === active.id);
    const newIndex = visibleProjects.findIndex(({ index }) => `proj-${index}` === over.id);

    if (oldIndex < 0 || newIndex < 0) return;

    const reorderedVisible = arrayMove(
      visibleProjects.map(({ project }) => project),
      oldIndex,
      newIndex,
    );

    updateProjects([...reorderedVisible, ...hiddenProjects.map(({ project }) => project)]);
    setExpandedIndex(null);
  };

  const updateProject = (index: number, field: keyof SiteData["projects"][number], value: string | boolean) => {
    const projects = [...data.projects];
    projects[index] = { ...projects[index], [field]: value };
    updateProjects(projects);
  };

  const removeProject = (index: number) => {
    const project = data.projects[index];
    if (isProtectedProject(project)) return;

    const projects = data.projects.filter((_, currentIndex) => currentIndex !== index);
    onChange({ ...data, projects: normalizeProjectOrder(projects) });
    if (expandedIndex === index) setExpandedIndex(null);
  };

  const toggleProjectVisibility = (index: number) => {
    const projects = [...data.projects];
    projects[index] = {
      ...projects[index],
      oculto: !projects[index].oculto,
    };

    updateProjects(projects);
  };

  const addProject = () => {
    const visibleCount = data.projects.filter((project) => !project.oculto).length;
    const newProject: SiteData["projects"][number] = {
      titulo: "",
      descricao: "",
      link: "",
      imageUrl: "",
      categoria: "",
      ordem: visibleCount + 1,
      oculto: false,
    };

    onChange({ ...data, projects: normalizeProjectOrder([...data.projects, newProject]) });
    setExpandedIndex(null);
  };

  const renderProjectCard = (project: SiteData["projects"][number], index: number, sortable: boolean) => {
    const isExpanded = expandedIndex === index;
    const protectedProject = isProtectedProject(project);

    const content = (
      <div className={`overflow-hidden ${project.oculto ? "opacity-75" : ""}`}>
        <div className="flex items-center gap-3 p-4 transition-colors hover:bg-muted/30">
          {project.imageUrl && (
            <img src={project.imageUrl} alt={project.titulo} className="h-12 w-12 flex-shrink-0 rounded-lg border border-border object-cover" />
          )}
          <button
            type="button"
            className="min-w-0 flex-1 text-left"
            onClick={() => setExpandedIndex(isExpanded ? null : index)}
          >
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-medium text-foreground">{project.titulo || "Novo projeto"}</p>
              {project.oculto && (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800">
                  Oculto
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{project.categoria || "Sem categoria"}</p>
          </button>
          <div className="ml-3 flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleProjectVisibility(index);
              }}
              className="rounded-md p-1 text-amber-700 transition-opacity hover:opacity-70"
              aria-label={project.oculto ? "Reativar projeto" : "Ocultar projeto"}
              title={project.oculto ? "Reativar no site" : "Ocultar do site"}
            >
              {project.oculto ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </button>
            {!protectedProject && (
              <ConfirmDeleteButton
                title="Excluir projeto?"
                description="Este projeto será removido do painel e do site."
                onConfirm={() => removeProject(index)}
              >
                <button
                  type="button"
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="rounded-md p-1 text-destructive transition-opacity hover:opacity-70"
                  aria-label="Excluir projeto"
                  title="Excluir projeto"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </ConfirmDeleteButton>
            )}
            <button
              type="button"
              onClick={() => setExpandedIndex(isExpanded ? null : index)}
              className="p-1 text-muted-foreground hover:opacity-70"
              aria-label={isExpanded ? "Recolher projeto" : "Expandir projeto"}
            >
              {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="space-y-3 border-t border-border p-4 pt-3">
            {protectedProject ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                Este projeto é uma página interna do site. Aqui você pode apenas ocultar ou reativar a exibição. A rota também será bloqueada quando ele estiver oculto.
              </div>
            ) : (
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                Você pode ocultar este projeto para tirar do site sem apagar os dados, ou excluir permanentemente se ele não for mais necessário.
              </div>
            )}

            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className={labelClass}>Título</label>
                <input className={inputClass} value={project.titulo} onChange={(e) => updateProject(index, "titulo", e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Categoria</label>
                <input className={inputClass} value={project.categoria} onChange={(e) => updateProject(index, "categoria", e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Link</label>
                <input
                  className={`${inputClass} ${protectedProject ? "cursor-not-allowed opacity-60" : ""}`}
                  value={project.link}
                  onChange={(e) => updateProject(index, "link", e.target.value)}
                  disabled={protectedProject}
                />
              </div>
            </div>
            <ImageUpload label="Imagem do Projeto" value={project.imageUrl} onChange={(url) => updateProject(index, "imageUrl", url)} />
            <div>
              <label className={labelClass}>Descrição</label>
              <textarea className={inputClass} rows={3} value={project.descricao} onChange={(e) => updateProject(index, "descricao", e.target.value)} />
            </div>
          </div>
        )}
      </div>
    );

    if (!sortable) {
      return (
        <div key={`proj-${index}`} className="glass-card">
          {content}
        </div>
      );
    }

    return (
      <SortableItem key={`proj-${index}`} id={`proj-${index}`}>
        <div className="glass-card">{content}</div>
      </SortableItem>
    );
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Arraste apenas os projetos visíveis para reorganizar a ordem de exibição no site. Todos os projetos podem ser ocultados. Galeria e Vitrine não podem ser excluídas.
      </p>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={visibleProjects.map(({ index }) => `proj-${index}`)} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {visibleProjects.map(({ project, index }) => renderProjectCard(project, index, true))}
          </div>
        </SortableContext>
      </DndContext>

      {hiddenProjects.length > 0 && (
        <div className="space-y-3 rounded-2xl border border-border/70 bg-muted/20 p-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Projetos ocultos do site</h3>
            <p className="text-xs text-muted-foreground">Esses itens ficam no final da lista e não participam do drag and drop enquanto estiverem ocultos.</p>
          </div>
          <div className="space-y-4">{hiddenProjects.map(({ project, index }) => renderProjectCard(project, index, false))}</div>
        </div>
      )}

      <div className="flex justify-center py-4">
        <button
          onClick={addProject}
          className="inline-flex items-center gap-2 rounded-lg border border-primary px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          <Plus className="h-4 w-4" /> Adicionar Projeto
        </button>
      </div>
    </div>
  );
};

export default ProjectsSection;
