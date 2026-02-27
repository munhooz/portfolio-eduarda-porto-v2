import { Save } from "lucide-react";

interface AdminSectionProps {
  title: string;
  saving: boolean;
  saved: boolean;
  onSave: () => void;
  children: React.ReactNode;
}

const AdminSection = ({ title, saving, saved, onSave, children }: AdminSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold font-sans">{title}</h2>
        <div className="flex items-center gap-3">
          {saved && <span className="text-sm text-primary font-medium">Salvo ✓</span>}
          <button
            onClick={onSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>
      </div>
      {children}
    </div>
  );
};

export default AdminSection;
