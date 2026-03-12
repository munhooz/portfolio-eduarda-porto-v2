import { useMemo, useState } from "react";
import { Copy } from "lucide-react";
import { SiteData } from "@/data/siteData";
import ImageWithSkeleton from "@/components/ui/ImageWithSkeleton";

interface ImagesGalleryProps {
  data: SiteData;
}

const isNonEmptyString = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;

const ImagesGallery = ({ data }: ImagesGalleryProps) => {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const urls = useMemo(() => {
    const entries = new Set<string>();

    if (isNonEmptyString(data.profile?.fotoUrl)) {
      entries.add(data.profile.fotoUrl.trim());
    }

    data.projects.forEach((project) => {
      if (isNonEmptyString(project.imageUrl)) {
        entries.add(project.imageUrl.trim());
      }
    });

    data.projectSubsections.galeria.categories.forEach((category) => {
      category.imagens.forEach((url) => {
        if (isNonEmptyString(url)) {
          entries.add(url.trim());
        }
      });
    });

    data.projectSubsections.vitrine.categories.forEach((category) => {
      category.imagens.forEach((url) => {
        if (isNonEmptyString(url)) {
          entries.add(url.trim());
        }
      });
    });

    return Array.from(entries);
  }, [data]);

  const handleCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setTimeout(() => {
        setCopiedUrl((current) => (current === url ? null : current));
      }, 1500);
    } catch {
      setCopiedUrl(null);
      alert("Não foi possível copiar a URL.");
    }
  };

  if (!urls.length) {
    return (
      <div className="rounded-2xl border border-border/70 bg-background p-4 md:p-6 shadow-sm">
        <h2 className="text-xl font-semibold tracking-tight">Galeria (imagens usadas)</h2>
        <p className="text-sm text-muted-foreground mt-2">Nenhuma imagem foi adicionada ainda no conteúdo do site.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/70 bg-background p-4 md:p-6 shadow-sm space-y-5">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Galeria (imagens usadas)</h2>
        <p className="text-sm text-muted-foreground mt-1">Lista baseada apenas nas URLs de imagem presentes em site/public.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {urls.map((url) => (
          <div key={url} className="rounded-xl border border-border/70 bg-muted/20 p-3 space-y-3">
            <div className="aspect-[4/3] overflow-hidden rounded-lg border border-border bg-muted/60">
              <ImageWithSkeleton
                src={url}
                alt="Imagem usada no site"
                wrapperClassName="w-full h-full"
                className="object-cover"
                fallback={<div className="w-full h-full bg-muted" />}
              />
            </div>

            <p className="text-xs text-muted-foreground break-all line-clamp-2">{url}</p>

            <button
              onClick={() => handleCopy(url)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-background text-xs font-medium hover:bg-muted transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              {copiedUrl === url ? "Copiado!" : "Copiar URL"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImagesGallery;
