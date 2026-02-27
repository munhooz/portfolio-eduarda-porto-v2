import { useRef, useState } from "react";
import { Plus, Trash2, Upload, GripVertical } from "lucide-react";
import { DndContext, closestCenter, DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, rectSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ImageWithSkeleton from "@/components/ui/ImageWithSkeleton";
import { uploadImageToCloudinary } from "@/services/cloudinary";

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
  onRemove: () => void;
}

const SortableImageCard = ({ id, url, label, index, onRemove }: SortableImageCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="rounded-lg border border-border bg-background p-2 space-y-2">
      <div className="aspect-[4/3] rounded-md overflow-hidden relative">
        <ImageWithSkeleton
          src={url}
          alt={`${label} ${index + 1}`}
          wrapperClassName="w-full h-full"
          className="object-cover"
          fallback={<div className="w-full h-full bg-muted" />}
        />

        <button
          type="button"
          className="absolute top-1.5 left-1.5 inline-flex items-center justify-center w-6 h-6 rounded-md bg-background/90 border border-border text-muted-foreground cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
          aria-label="Arrastar para reordenar"
        >
          <GripVertical className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onRemove}
          className="inline-flex items-center gap-1 text-xs text-destructive hover:opacity-80"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Remover
        </button>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] text-primary hover:underline"
        >
          Abrir
        </a>
      </div>
    </div>
  );
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
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor),
  );

  const handleFiles = async (files: File[]) => {
    if (!files.length) return;

    const limitedFiles = files.slice(0, maxFilesPerUpload);
    const invalid = limitedFiles.find((file) => !ALLOWED_IMAGE_MIME_TYPES.includes(file.type) || file.size > MAX_IMAGE_SIZE_BYTES);
    if (invalid) {
      alert("Use apenas JPG, JPEG, PNG ou WEBP com ate 5MB por arquivo.");
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

  const removeAt = (index: number) => {
    onChange(urls.filter((_, i) => i !== index));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = Number(String(active.id).replace("img-", ""));
    const newIndex = Number(String(over.id).replace("img-", ""));

    if (Number.isNaN(oldIndex) || Number.isNaN(newIndex)) return;
    onChange(arrayMove(urls, oldIndex, newIndex));
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
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-primary text-primary text-xs font-medium hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50"
          >
            <Upload className="w-3.5 h-3.5" />
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>

      {!urls.length ? (
        <p className="text-xs text-muted-foreground">Nenhuma imagem cadastrada.</p>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={urls.map((_, index) => `img-${index}`)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-3">
              {urls.map((url, index) => (
                <SortableImageCard
                  key={`img-${index}-${url}`}
                  id={`img-${index}`}
                  url={url}
                  label={label}
                  index={index}
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
        <Plus className="w-3.5 h-3.5" />
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
                className="w-full px-3 py-2 rounded-lg bg-background border border-input text-foreground text-xs focus:ring-2 focus:ring-primary outline-none"
              />
            ) : null,
          )}
        </div>
      )}
    </div>
  );
};

export default ImagesListEditor;
