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
    <div className="rounded-2xl border border-border/70 bg-background p-4 md:p-6 shadow-sm space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
          <p className="text-sm text-muted-foreground">Revise os campos abaixo e salve as alterações desta seção.</p>
        </div>

        <div className="flex items-center gap-2">
          {saved && <span className="text-sm text-emerald-600 font-medium">Salvo</span>}
          <button
            onClick={onSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#3c674f] text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>

      <div className="space-y-5">{children}</div>
    </div>
  );
};

export default AdminSection;
