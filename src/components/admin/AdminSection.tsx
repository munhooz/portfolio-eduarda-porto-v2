import { Save } from "lucide-react";

interface AdminSectionProps {
  title: string;
  saving: boolean;
  saved: boolean;
  dirty: boolean;
  onSave: () => void;
  children: React.ReactNode;
}

const AdminSection = ({ title, saving, saved, dirty, onSave, children }: AdminSectionProps) => {
  return (
    <div className="space-y-6 rounded-2xl border border-border/70 bg-background p-4 shadow-sm md:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
          <p className="text-sm text-muted-foreground">
            {"Revise os campos abaixo e salve apenas as altera\u00e7\u00f5es desta se\u00e7\u00e3o."}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {dirty && (
            <div className="pointer-events-none rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 shadow-sm">
              {"Altera\u00e7\u00f5es n\u00e3o salvas"}
            </div>
          )}
          {saved && <span className="text-sm font-medium text-emerald-600">Salvo</span>}
          <button
            onClick={onSave}
            disabled={saving || !dirty}
            className="inline-flex items-center gap-2 rounded-xl bg-[#3c674f] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>

      <div className="space-y-5">{children}</div>
    </div>
  );
};

export default AdminSection;
