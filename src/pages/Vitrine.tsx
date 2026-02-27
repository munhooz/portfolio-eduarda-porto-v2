import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import ImageLightbox from "@/components/ImageLightbox";
import { SiteData, defaultSiteData } from "@/data/siteData";
import { fetchSiteData } from "@/lib/firebase";
import ImageWithSkeleton from "@/components/ui/ImageWithSkeleton";

const Vitrine = () => {
  const [data, setData] = useState<SiteData>(defaultSiteData);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSiteData().then(setData);
  }, []);

  const vitrineImages = useMemo(
    () => data.projectSubsections.vitrine.imagens.map((src, i) => ({ src, alt: `Vitrine edicao ${i + 1}` })),
    [data.projectSubsections.vitrine.imagens],
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="section-padding pb-8 pt-12">
        <div className="max-w-7xl mx-auto">
          <Link
            to="/#projects"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao inicio
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-2">Portfolio</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Vitrine</span>
            </h1>
            <p className="text-muted-foreground max-w-xl">Edicoes do informativo semanal escrito para o publico interno do Partage Shopping Betim.</p>
          </motion.div>
        </div>
      </div>

      <section className="section-padding pt-0">
        <div className="max-w-7xl mx-auto">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-2xl font-bold mb-6 text-primary">
            Partage Shopping Betim
          </motion.h2>

          {!vitrineImages.length ? (
            <p className="text-sm text-muted-foreground">Nenhuma imagem cadastrada na Vitrine.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {vitrineImages.map((img, i) => (
                <motion.div
                  key={img.src + i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="group glass-card rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                  onClick={() => setLightboxIndex(i)}
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <ImageWithSkeleton
                      src={img.src}
                      alt={img.alt}
                      wrapperClassName="w-full h-full"
                      className="object-cover object-top group-hover:scale-[1.02] transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300" />
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-medium text-foreground">{img.alt}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {lightboxIndex !== null && vitrineImages.length > 0 && (
        <ImageLightbox images={vitrineImages} initialIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}
    </div>
  );
};

export default Vitrine;
