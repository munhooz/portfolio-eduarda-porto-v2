import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { SiteData } from "@/data/siteData";
import ImageWithSkeleton from "@/components/ui/ImageWithSkeleton";

interface HeroProps {
  data: SiteData;
}

const Hero = ({ data }: HeroProps) => {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 gradient-primary opacity-[0.03] pointer-events-none" />
      <div className="absolute top-0 right-0 w-1/2 h-full gradient-primary opacity-5 rounded-bl-[200px] pointer-events-none" />

      <div className="section-padding w-full max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="order-2 lg:order-1"
          >
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-sm font-medium tracking-[0.2em] uppercase text-muted-foreground mb-4"
            >
              {"Ol\u00e1, eu sou a"}
            </motion.p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-4">
              <span className="gradient-text">{data.profile.nome}</span>
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-xl md:text-2xl font-light text-muted-foreground mb-6"
            >
              {data.profile.titulo}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="text-base text-muted-foreground max-w-md mb-10 leading-relaxed"
            >
              {data.profile.descricao}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <a
                href="#about"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-medium hover:shadow-lg hover:shadow-primary/30 hover:scale-105 active:scale-95 transition-all duration-200"
              >
                Sobre mim
                <ArrowDown className="w-4 h-4" />
              </a>
            </motion.div>
          </motion.div>

          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="order-1 lg:order-2 flex justify-center"
          >
            <div className="relative">
              <div className="absolute -inset-4 gradient-primary rounded-[2rem] opacity-10 blur-2xl" />
              <div className="relative w-72 h-80 md:w-80 md:h-96 lg:w-96 lg:h-[28rem] rounded-[2rem] overflow-hidden shadow-2xl">
                <ImageWithSkeleton
                  src={data.profile.fotoUrl}
                  alt={data.profile.nome}
                  wrapperClassName="w-full h-full"
                  className="object-cover"
                  fallback={<div className="w-full h-full bg-muted" />}
                />
              </div>
              {/* Decorative dots */}
              <div className="absolute -bottom-6 -left-6 w-24 h-24 grid grid-cols-4 gap-1.5 opacity-20">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-primary" />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-6 h-10 rounded-full border-2 border-primary/30 flex items-start justify-center p-1.5"
        >
          <div className="w-1.5 h-2.5 rounded-full bg-primary/50" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
