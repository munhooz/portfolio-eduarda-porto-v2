import { useRef, useState } from "react";
import { Eye, Plus, Trash2, Upload } from "lucide-react";
import { DndContext, closestCenter, DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, rectSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ImageWithSkeleton from "@/components/ui/ImageWithSkeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { uploadImageToCloudinary } from "@/services/cloudinary";
import ConfirmDeleteButton from "./ConfirmDeleteButton";

interface ImagesListEditorProps {
  label: string;
  urls: string[];
  onChange: (urls: string[]) => void;
  folder: string;
  maxFilesPerUpload?: number;
}

const ALLOWED_IMAGE_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

interface SortableImageCardProps {
  id: string;
  url: string;
  label: string;
  index: number;
  selected: boolean;
  onSelectChange: (checked: boolean) => void;
  onRemove: () => void;
}

const SortableImageCard = ({ id, url, label, index, selected, onSelectChange, onRemove }: SortableImageCardProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useSortable({
    id,
    transition: null,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.7 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="space-y-2 rounded-lg border border-border bg-background p-2 active:cursor-grabbing"
    >
      <div
        className="relative aspect-[4/3] cursor-grab overflow-hidden rounded-md active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <div className="absolute left-2 top-2 z-10">
          <Checkbox
            checked={selected}
            onCheckedChange={(checked) => onSelectChange(checked === true)}
            aria-label={`Selecionar ${label} ${index + 1}`}
            onClick={(event) => event.stopPropagation()}
            onPointerDown={(event) => event.stopPropagation()}
            className="h-5 w-5 rounded-full border-white/90 bg-transparent text-white shadow-[0_0_0_1px_rgba(15,23,42,0.28)] backdrop-blur-[1px] data-[state=checked]:border-[#3c674f] data-[state=checked]:bg-[#3c674f]"
          />
        </div>

        <ImageWithSkeleton
          src={url}
          alt={`${label} ${index + 1}`}
          wrapperClassName="h-full w-full"
          className="object-cover"
          fallback={<div className="h-full w-full bg-muted" />}
        />
      </div>

      <div className="flex items-center justify-between px-1 pt-0.5">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(event) => event.stopPropagation()}
          onMouseDown={(event) => event.stopPropagation()}
          onPointerDown={(event) => event.stopPropagation()}
          className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 text-[11px] font-medium text-primary transition-colors hover:bg-primary/10"
          aria-label={`Visualizar ${label} ${index + 1}`}
        >
          <Eye className="h-3.5 w-3.5" />
          Visualizar
        </a>

        <ConfirmDeleteButton
          title="Excluir imagem?"
          description="Esta imagem será removida desta lista."
          onConfirm={onRemove}
        >
          <button
            type="button"
            onClick={(event) => event.stopPropagation()}
            onMouseDown={(event) => event.stopPropagation()}
            onPointerDown={(event) => event.stopPropagation()}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-destructive transition-colors hover:bg-destructive/10"
            aria-label={`Remover ${label} ${index + 1}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </ConfirmDeleteButton>
      </div>
    </div>
  );
};

const remapSelectedIndexesAfterMove = (selectedIndexes: Set<number>, oldIndex: number, newIndex: number) => {
  const next = new Set<number>();

  selectedIndexes.forEach((index) => {
    if (index === oldIndex) {
      next.add(newIndex);
      return;
    }

    if (oldIndex < newIndex && index > oldIndex && index <= newIndex) {
      next.add(index - 1);
      return;
    }

    if (newIndex < oldIndex && index >= newIndex && index < oldIndex) {
      next.add(index + 1);
      return;
    }

    next.add(index);
  });

  return next;
};

const ImagesListEditor = ({
  label,
  urls,
  onChange,
  folder,
  maxFilesPerUpload = 20,
}: ImagesListEditorProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedIndexes, setSelectedIndexes] = useState<Set<number>>(new Set());
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor),
  );

  const handleFiles = async (files: File[]) => {
    if (!files.length) return;

    const limitedFiles = files.slice(0, maxFilesPerUpload);
    const invalid = limitedFiles.find((file) => !ALLOWED_IMAGE_MIME_TYPES.includes(file.type) || file.size > MAX_IMAGE_SIZE_BYTES);
    if (invalid) {
      alert("Use apenas JPG, JPEG, PNG ou WEBP com até 5MB por arquivo.");
      return;
    }

    setUploading(true);
    try {
      const uploadedUrls: string[] = [];
      for (const file of limitedFiles) {
        const { url } = await uploadImageToCloudinary(file, folder);
        uploadedUrls.push(url);
      }
      onChange([...urls, ...uploadedUrls]);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro no upload de imagens.";
      alert(`Erro ao enviar imagens: ${message}`);
    } finally {
      setUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const toggleSelectedIndex = (index: number, checked: boolean) => {
    setSelectedIndexes((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(index);
      } else {
        next.delete(index);
      }
      return next;
    });
  };

  const removeAt = (index: number) => {
    onChange(urls.filter((_, i) => i !== index));
    setSelectedIndexes((prev) => {
      const next = new Set<number>();
      prev.forEach((value) => {
        if (value === index) return;
        next.add(value > index ? value - 1 : value);
      });
      return next;
    });
  };

  const removeSelected = () => {
    if (!selectedIndexes.size) return;
    onChange(urls.filter((_, index) => !selectedIndexes.has(index)));
    setSelectedIndexes(new Set());
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = Number(String(active.id).replace("img-", ""));
    const newIndex = Number(String(over.id).replace("img-", ""));

    if (Number.isNaN(oldIndex) || Number.isNaN(newIndex)) return;

    onChange(arrayMove(urls, oldIndex, newIndex));
    setSelectedIndexes((prev) => remapSelectedIndexesAfterMove(prev, oldIndex, newIndex));
  };

  return (
    <div className="space-y-3 rounded-xl border border-border/70 bg-muted/15 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">{label}</p>
          <p className="text-xs text-muted-foreground">{urls.length} imagem(ns)</p>
        </div>

        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            multiple
            onChange={(e) => handleFiles(Array.from(e.target.files ?? []))}
          />

          {selectedIndexes.size > 0 ? (
            <ConfirmDeleteButton
              title="Excluir imagens selecionadas?"
              description={`As ${selectedIndexes.size} imagem(ns) selecionadas serão removidas desta lista.`}
              onConfirm={removeSelected}
            >
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg border border-destructive/30 px-3 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remover
              </button>
            </ConfirmDeleteButton>
          ) : (
            <button
              type="button"
              disabled
              className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground opacity-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Remover
            </button>
          )}

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 rounded-lg border border-primary px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground disabled:opacity-50"
          >
            <Upload className="h-3.5 w-3.5" />
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>

      {!urls.length ? (
        <p className="text-xs text-muted-foreground">Nenhuma imagem cadastrada.</p>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={urls.map((_, index) => `img-${index}`)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-5">
              {urls.map((url, index) => (
                <SortableImageCard
                  key={`img-${index}-${url}`}
                  id={`img-${index}`}
                  url={url}
                  label={label}
                  index={index}
                  selected={selectedIndexes.has(index)}
                  onSelectChange={(checked) => toggleSelectedIndex(index, checked)}
                  onRemove={() => removeAt(index)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <button
        type="button"
        onClick={() => onChange([...urls, ""])}
        className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
      >
        <Plus className="h-3.5 w-3.5" />
        Adicionar URL manualmente
      </button>

      {urls.some((url) => !url.trim()) && (
        <div className="space-y-2">
          {urls.map((url, index) =>
            !url.trim() ? (
              <input
                key={`manual-${index}`}
                value={url}
                placeholder="https://..."
                onChange={(e) => {
                  const next = [...urls];
                  next[index] = e.target.value;
                  onChange(next);
                }}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs text-foreground outline-none focus:ring-2 focus:ring-primary"
              />
            ) : null,
          )}
        </div>
      )}
    </div>
  );
};

export default ImagesListEditor;
