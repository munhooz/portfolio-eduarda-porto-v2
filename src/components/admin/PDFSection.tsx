import { useRef, useState } from "react";
import { FileText, Upload, X } from "lucide-react";
import { SiteData } from "@/data/siteData";
import { uploadFileToCloudinary } from "@/services/cloudinary";

interface PDFSectionProps {
  data: SiteData;
  onChange: (data: SiteData) => void;
}

const inputClass =
  "w-full px-3 py-2 rounded-lg bg-background border border-input text-foreground text-sm focus:ring-2 focus:ring-primary outline-none";
const labelClass = "block text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider";

const PDFSection = ({ data, onChange }: PDFSectionProps) => {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (file.type !== "application/pdf") {
      alert("Formato inválido. Envie apenas PDF.");
      return;
    }

    setUploading(true);
    try {
      const { url } = await uploadFileToCloudinary(file, "eduarda-porto/pdfs");
      onChange({ ...data, cvUrl: url });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Falha ao enviar PDF.";
      alert(`Erro ao enviar PDF: ${message}`);
    } finally {
      setUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className={labelClass}>URL do Currículo (PDF)</label>
        <input
          className={inputClass}
          value={data.cvUrl}
          onChange={(e) => onChange({ ...data, cvUrl: e.target.value })}
          placeholder="URL do arquivo PDF"
        />
      </div>

      {data.cvUrl && (
        <div className="flex items-center gap-3 p-3 glass-card">
          <FileText className="w-8 h-8 text-primary flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">Currículo anexado</p>
            <a href={data.cvUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline truncate block">
              {data.cvUrl}
            </a>
          </div>
          <button
            onClick={() => onChange({ ...data, cvUrl: "" })}
            className="p-1 text-destructive hover:opacity-70"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,application/pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-primary text-primary text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50"
        >
          <Upload className="w-4 h-4" />
          {uploading ? "Uploading..." : "Upload de PDF"}
        </button>
      </div>
    </div>
  );
};

export default PDFSection;
