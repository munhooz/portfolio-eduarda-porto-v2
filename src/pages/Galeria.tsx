import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import ImageLightbox from "@/components/ImageLightbox";
import { SiteData, defaultSiteData } from "@/data/siteData";
import { fetchSiteData } from "@/lib/firebase";
import ImageWithSkeleton from "@/components/ui/ImageWithSkeleton";
import NotFound from "./NotFound";

const Galeria = () => {
  const [data, setData] = useState<SiteData>(defaultSiteData);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSiteData().then((siteData) => {
      setData(siteData);
      setLoading(false);
    });
  }, []);

  const galeriaProject = useMemo(
    () => data.projects.find((project) => project.link === "/galeria"),
    [data.projects],
  );

  const categories = useMemo(
    () =>
      [...data.projectSubsections.galeria.categories]
        .sort((a, b) => a.ordem - b.ordem)
        .map((category) => ({
          ...category,
          imagensFormatadas: category.imagens.map((src, index) => ({
            src,
            alt: `${category.titulo || "Categoria"} ${index + 1}`,
          })),
        })),
    [data.projectSubsections.galeria.categories],
  );

  const allImages = useMemo(
    () => categories.flatMap((category) => category.imagensFormatadas),
    [categories],
  );

  if (loading) {
    return <div className="min-h-screen bg-background" />;
  }

  if (galeriaProject?.oculto) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="section-padding pb-8 pt-12">
        <div className="mx-auto max-w-7xl">
          <Link
            to="/#projects"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao início
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-primary">Portfólio</p>
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">{data.projectSubsections.galeria.pageTitle}</h1>
            <p className="max-w-xl text-muted-foreground">{data.projectSubsections.galeria.pageSubtitle}</p>
          </motion.div>
        </div>
      </div>

      {categories.length === 0 ? (
        <section className="section-padding pt-0">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm text-muted-foreground">Nenhuma categoria cadastrada para a galeria.</p>
          </div>
        </section>
      ) : (
        categories.map((category, categoryIndex) => {
          const sectionStartIndex = categories.slice(0, categoryIndex).reduce((acc, current) => acc + current.imagensFormatadas.length, 0);
          const useAltBackground = categoryIndex % 2 === 1;

          return (
            <section
              key={category.id}
              className={`section-padding ${categoryIndex === 0 ? "pt-0" : ""} ${useAltBackground ? "section-alt" : ""}`}
            >
              <div className="mx-auto max-w-7xl">
                <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-6 text-2xl font-bold text-primary">
                  {category.titulo}
                </motion.h2>

                {!category.imagensFormatadas.length ? (
                  <p className="text-sm text-muted-foreground">Nenhuma imagem cadastrada em {category.titulo}.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
                    {category.imagensFormatadas.map((img, imageIndex) => (
                      <motion.div
                        key={img.src + imageIndex}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-30px" }}
                        transition={{ duration: 0.3, delay: imageIndex * 0.04 }}
                        className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-xl glass-card"
                        onClick={() => setLightboxIndex(sectionStartIndex + imageIndex)}
                      >
                        <ImageWithSkeleton
                          src={img.src}
                          alt={img.alt}
                          wrapperClassName="w-full h-full"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-primary/0 transition-colors duration-300 group-hover:bg-primary/10" />
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          );
        })
      )}

      {lightboxIndex !== null && allImages.length > 0 && (
        <ImageLightbox images={allImages} initialIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}
    </div>
  );
};

export default Galeria;
