import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { uploadImageToCloudinary } from "@/services/cloudinary";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  previewSizeClassName?: string;
}

const ALLOWED_IMAGE_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

const ImageUpload = ({ value, onChange, label = "Imagem", previewSizeClassName = "w-20 h-20" }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.type)) {
      alert("Formato inválido. Use JPG, JPEG, PNG ou WEBP.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      alert("Arquivo muito grande. O tamanho máximo é 5MB.");
      return;
    }

    setUploading(true);

    try {
      const { url } = await uploadImageToCloudinary(file);
      onChange(url);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Falha ao enviar imagem.";
      alert(`Erro ao enviar imagem: ${message}`);
    } finally {
      setUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">{label}</label>
      <div className="flex items-start gap-3">
        {value && (
          <div className={`relative ${previewSizeClassName} rounded-lg overflow-hidden border border-border flex-shrink-0`}>
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute top-0.5 right-0.5 p-0.5 bg-destructive text-destructive-foreground rounded-full"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
        <div className="flex-1 space-y-2">
          <input
            type="text"
            placeholder="URL da imagem ou faca upload"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-background border border-input text-foreground text-sm focus:ring-2 focus:ring-primary outline-none"
          />
          <input
            ref={inputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-primary text-primary text-xs font-medium hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50"
          >
            <Upload className="w-3 h-3" />
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
