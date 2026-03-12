import { useState } from "react";
import { DndContext, closestCenter, DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { SiteData } from "@/data/siteData";
import ImagesListEditor from "./ImagesListEditor";
import SortableItem from "./SortableItem";
import ConfirmDeleteButton from "./ConfirmDeleteButton";

interface GallerySectionProps {
  data: SiteData;
  onChange: (data: SiteData) => void;
}

const inputClass =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary";
const labelClass = "mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground";

const createCategoryId = () => `gallery-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const normalizeCategories = (categories: SiteData["projectSubsections"]["galeria"]["categories"]) =>
  categories.map((category, index) => ({ ...category, ordem: index + 1 }));

const GallerySection = ({ data, onChange }: GallerySectionProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }), useSensor(KeyboardSensor));

  const categories = [...data.projectSubsections.galeria.categories].sort((a, b) => a.ordem - b.ordem);

  const updateGaleria = (nextGaleria: SiteData["projectSubsections"]["galeria"]) => {
    onChange({
      ...data,
      projectSubsections: {
        ...data.projectSubsections,
        galeria: nextGaleria,
      },
    });
  };

  const updateCategory = (
    categoryId: string,
    changes: Partial<SiteData["projectSubsections"]["galeria"]["categories"][number]>,
  ) => {
    updateGaleria({
      ...data.projectSubsections.galeria,
      categories: normalizeCategories(
        categories.map((category) => (category.id === categoryId ? { ...category, ...changes } : category)),
      ),
    });
  };

  const removeCategory = (categoryId: string) => {
    updateGaleria({
      ...data.projectSubsections.galeria,
      categories: normalizeCategories(categories.filter((category) => category.id !== categoryId)),
    });
    if (expandedId === categoryId) setExpandedId(null);
  };

  const addCategory = () => {
    const newCategory: SiteData["projectSubsections"]["galeria"]["categories"][number] = {
      id: createCategoryId(),
      titulo: "",
      imagens: [],
      ordem: categories.length + 1,
    };

    updateGaleria({
      ...data.projectSubsections.galeria,
      categories: normalizeCategories([...categories, newCategory]),
    });
    setExpandedId(newCategory.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = categories.findIndex((category) => category.id === active.id);
    const newIndex = categories.findIndex((category) => category.id === over.id);

    if (oldIndex < 0 || newIndex < 0) return;

    updateGaleria({
      ...data.projectSubsections.galeria,
      categories: normalizeCategories(arrayMove(categories, oldIndex, newIndex)),
    });
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Edite os textos da página /galeria, crie novas categorias e organize a ordem de exibição com drag and drop.
      </p>

      <div className="space-y-4 rounded-xl border border-border/70 bg-muted/15 p-4">
        <div>
          <label className={labelClass}>Título da página</label>
          <input
            className={inputClass}
            value={data.projectSubsections.galeria.pageTitle}
            onChange={(e) =>
              updateGaleria({
                ...data.projectSubsections.galeria,
                pageTitle: e.target.value,
              })
            }
          />
        </div>
        <div>
          <label className={labelClass}>Subtítulo da página</label>
          <textarea
            className={inputClass}
            rows={3}
            value={data.projectSubsections.galeria.pageSubtitle}
            onChange={(e) =>
              updateGaleria({
                ...data.projectSubsections.galeria,
                pageSubtitle: e.target.value,
              })
            }
          />
        </div>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={categories.map((category) => category.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {categories.map((category) => {
              const isExpanded = expandedId === category.id;

              return (
                <SortableItem key={category.id} id={category.id}>
                  <div className="glass-card overflow-hidden">
                    <div className="flex items-center gap-3 p-4 hover:bg-muted/30 transition-colors">
                      <button
                        type="button"
                        className="min-w-0 flex-1 text-left"
                        onClick={() => setExpandedId(isExpanded ? null : category.id)}
                      >
                        <p className="truncate text-sm font-medium text-foreground">{category.titulo || "Nova categoria"}</p>
                        <p className="text-xs text-muted-foreground">{category.imagens.length} imagem(ns)</p>
                      </button>
                      <div className="ml-3 flex items-center gap-2">
                        <ConfirmDeleteButton
                          title="Excluir categoria?"
                          description="A categoria e todas as imagens dentro dela serão removidas da galeria."
                          onConfirm={() => removeCategory(category.id)}
                        >
                          <button
                            type="button"
                            onClick={(e) => e.stopPropagation()}
                            onMouseDown={(e) => e.stopPropagation()}
                            onPointerDown={(e) => e.stopPropagation()}
                            className="rounded-md p-1 text-destructive transition-opacity hover:opacity-70"
                            aria-label="Excluir categoria"
                            title="Excluir categoria"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </ConfirmDeleteButton>
                        <button
                          type="button"
                          onClick={() => setExpandedId(isExpanded ? null : category.id)}
                          className="p-1 text-muted-foreground hover:opacity-70"
                          aria-label={isExpanded ? "Recolher categoria" : "Expandir categoria"}
                        >
                          {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="space-y-3 border-t border-border p-4 pt-3">
                        <div>
                          <label className={labelClass}>Título da categoria</label>
                          <input
                            className={inputClass}
                            value={category.titulo}
                            onChange={(e) => updateCategory(category.id, { titulo: e.target.value })}
                          />
                        </div>

                        <ImagesListEditor
                          label={category.titulo || "Categoria"}
                          urls={category.imagens}
                          onChange={(urls) => updateCategory(category.id, { imagens: urls })}
                          folder={`eduarda-porto/galeria/${category.id}`}
                        />
                      </div>
                    )}
                  </div>
                </SortableItem>
              );
            })}
          </div>
        </SortableContext>
      </DndContext>

      <div className="flex justify-center py-4">
        <button
          type="button"
          onClick={addCategory}
          className="inline-flex items-center gap-2 rounded-lg border border-primary px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          <Plus className="h-4 w-4" />
          Adicionar categoria
        </button>
      </div>
    </div>
  );
};

export default GallerySection;
