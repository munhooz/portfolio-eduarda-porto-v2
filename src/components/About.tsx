import { motion } from "framer-motion";
import { SiteData } from "@/data/siteData";

interface AboutProps {
  data: SiteData;
}

const About = ({ data }: AboutProps) => {
  return (
    <section id="about" className="section-padding section-alt">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-2">Quem sou eu</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-12">
            Sobre <span className="gradient-text">mim</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl"
        >
          {data.about.texto.split("\n").map((paragraph, i) => (
            <p key={i} className="text-lg text-muted-foreground leading-relaxed mb-6">
              {paragraph}
            </p>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default About;
