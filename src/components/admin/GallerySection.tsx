import { SiteData } from "@/data/siteData";
import ImagesListEditor from "./ImagesListEditor";

interface GallerySectionProps {
  data: SiteData;
  onChange: (data: SiteData) => void;
}

const GallerySection = ({ data, onChange }: GallerySectionProps) => {
  const updateEventos = (urls: string[]) => {
    onChange({
      ...data,
      projectSubsections: {
        ...data.projectSubsections,
        galeria: { ...data.projectSubsections.galeria, eventos: urls },
      },
    });
  };

  const updateCerimonial = (urls: string[]) => {
    onChange({
      ...data,
      projectSubsections: {
        ...data.projectSubsections,
        galeria: { ...data.projectSubsections.galeria, cerimonial: urls },
      },
    });
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">Cadastre as imagens da página /galeria separando por Eventos e Cerimonial.</p>

      <ImagesListEditor
        label="Galeria - Eventos"
        urls={data.projectSubsections.galeria.eventos}
        onChange={updateEventos}
        folder="eduarda-porto/galeria/eventos"
      />

      <ImagesListEditor
        label="Galeria - Cerimonial"
        urls={data.projectSubsections.galeria.cerimonial}
        onChange={updateCerimonial}
        folder="eduarda-porto/galeria/cerimonial"
      />
    </div>
  );
};

export default GallerySection;
