import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Linkedin, Download } from "lucide-react";
import { SiteData } from "@/data/siteData";

interface ContactProps {
  data: SiteData;
}

const Contact = ({ data }: ContactProps) => {
  const items = [
    { icon: MapPin, label: "Localização", value: data.contact.cidade },
    { icon: Mail, label: "Email", value: data.contact.email, href: `mailto:${data.contact.email}` },
    { icon: Phone, label: "Telefone", value: data.contact.telefone, href: `tel:${data.contact.telefone.replace(/\s|\(|\)|-/g, "")}` },
    { icon: Linkedin, label: "LinkedIn", value: "Eduarda Porto", href: data.contact.linkedin },
  ];

  return (
    <section id="contact" className="section-padding section-alt">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-2">Fale comigo</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Meu <span className="gradient-text">Contato</span>
          </h2>
          <p className="text-muted-foreground mb-12 max-w-xl">
            Fique à vontade para me mandar mensagem, respondo assim que possível!
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="glass-card p-6 text-center"
            >
              <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4">
                <item.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <p className="text-xs font-medium tracking-wider uppercase text-muted-foreground mb-2">{item.label}</p>
              {item.href ? (
                <a
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors break-all"
                >
                  {item.value}
                </a>
              ) : (
                <p className="text-sm font-medium text-foreground">{item.value}</p>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          <a
            href={data.cvUrl}
            download
            className="inline-flex items-center gap-3 px-10 py-4 rounded-full gradient-primary text-primary-foreground font-medium text-lg hover:opacity-90 transition-opacity shadow-lg"
          >
            <Download className="w-5 h-5" />
            Baixar Currículo
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
