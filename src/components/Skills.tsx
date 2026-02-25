import { motion } from "framer-motion";
import { SiteData } from "@/data/siteData";

interface SkillsProps {
  data: SiteData;
}

const Skills = ({ data }: SkillsProps) => {
  return (
    <section id="skills" className="section-padding">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-2">Competências</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-12">
            Minhas <span className="gradient-text">Habilidades</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-x-12 gap-y-6 max-w-4xl">
          {data.skills.map((skill, i) => (
            <motion.div
              key={skill.nome}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <div className="flex justify-between mb-2">
                <span className="font-medium text-foreground">{skill.nome}</span>
                <span className="text-sm text-muted-foreground">{skill.nivelPercentual}%</span>
              </div>
              <div className="h-2 rounded-full bg-accent overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.nivelPercentual}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: i * 0.08 + 0.3, ease: "easeOut" }}
                  className="h-full rounded-full gradient-primary"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
