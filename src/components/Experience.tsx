import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";
import { SiteData } from "@/data/siteData";

interface ExperienceProps {
  data: SiteData;
}

const Experience = ({ data }: ExperienceProps) => {
  const sorted = [...data.experience].sort((a, b) => a.ordem - b.ordem);

  return (
    <section id="experience" className="section-padding section-alt">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-2">Trajetória</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-16">
            Minha <span className="gradient-text">Experiência</span>
          </h2>
        </motion.div>

        <div className="relative max-w-3xl">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />

          <div className="space-y-10">
            {sorted.map((exp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative pl-16"
              >
                {/* Timeline dot */}
                <div className="absolute left-3.5 top-1 w-5 h-5 rounded-full gradient-primary flex items-center justify-center">
                  <Briefcase className="w-2.5 h-2.5 text-primary-foreground" />
                </div>

                <span className="text-xs font-medium tracking-wider uppercase text-primary bg-accent px-3 py-1 rounded-full">
                  {exp.periodo}
                </span>
                <h3 className="text-xl font-semibold mt-3 mb-1 font-sans">{exp.cargo}</h3>
                <p className="text-sm font-medium text-primary mb-2">{exp.empresa}</p>
                <p className="text-muted-foreground leading-relaxed">{exp.descricao}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
