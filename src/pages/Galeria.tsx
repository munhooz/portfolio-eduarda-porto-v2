import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const eventImages = Array.from({ length: 14 }, (_, i) => ({
  src: `https://eduardaporto.com.br/img_gallery/event${i + 1}.jpg`,
  alt: `Evento ${i + 1}`,
}));

const cerimonialImages = Array.from({ length: 3 }, (_, i) => ({
  src: `https://eduardaporto.com.br/img_gallery/flor${i + 1}.jpg`,
  alt: `Cerimonial ${i + 1}`,
}));

const Galeria = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="section-padding pb-8 pt-12">
        <div className="max-w-7xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao início
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-2">
              Portfólio
            </p>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Galeria de <span className="gradient-text">Fotos</span>
            </h1>
            <p className="text-muted-foreground max-w-xl">
              Cobertura fotográfica de eventos e cerimoniais.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Eventos */}
      <section className="section-padding pt-0">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl font-bold mb-6 text-primary"
          >
            Eventos
          </motion.h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {eventImages.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                className="group relative aspect-[4/3] rounded-xl overflow-hidden glass-card"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cerimonial */}
      <section className="section-padding section-alt">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl font-bold mb-6 text-primary"
          >
            Cerimonial
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cerimonialImages.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="group relative aspect-[4/3] rounded-xl overflow-hidden glass-card"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Galeria;
