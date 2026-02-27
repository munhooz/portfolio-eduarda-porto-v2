import { SiteData } from "@/data/siteData";
import ImagesListEditor from "./ImagesListEditor";

interface VitrineSectionProps {
  data: SiteData;
  onChange: (data: SiteData) => void;
}

const VitrineSection = ({ data, onChange }: VitrineSectionProps) => {
  const updateVitrine = (urls: string[]) => {
    onChange({
      ...data,
      projectSubsections: {
        ...data.projectSubsections,
        vitrine: { ...data.projectSubsections.vitrine, imagens: urls },
      },
    });
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">Cadastre as imagens da página /vitrine.</p>

      <ImagesListEditor
        label="Vitrine"
        urls={data.projectSubsections.vitrine.imagens}
        onChange={updateVitrine}
        folder="eduarda-porto/vitrine"
      />
    </div>
  );
};

export default VitrineSection;
