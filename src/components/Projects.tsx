import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { SiteData } from "@/data/siteData";

interface ProjectsProps {
  data: SiteData;
}

const Projects = ({ data }: ProjectsProps) => {
  const sorted = [...data.projects].sort((a, b) => a.ordem - b.ordem);

  return (
    <section id="projects" className="section-padding">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-2">Portfólio</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Meus <span className="gradient-text">Projetos</span>
          </h2>
          <p className="text-muted-foreground mb-12 max-w-xl">
            Aqui estão alguns dos meus trabalhos que fiz ao longo da minha carreira!
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((project, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="group glass-card overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={project.imageUrl}
                  alt={project.titulo}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-300" />
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-background/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-background"
                  >
                    <ExternalLink className="w-4 h-4 text-primary" />
                  </a>
                )}
                <span className="absolute bottom-3 left-3 text-xs font-medium tracking-wider uppercase bg-primary text-primary-foreground px-3 py-1 rounded-full">
                  {project.categoria}
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold mb-2 font-sans">{project.titulo}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{project.descricao}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
