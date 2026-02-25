import { SiteData } from "@/data/siteData";

const Footer = ({ data }: { data: SiteData }) => {
  return (
    <footer className="py-8 px-6 border-t border-border text-center">
      <p className="text-sm text-muted-foreground">
        © {new Date().getFullYear()} {data.profile.nome}. Todos os direitos reservados.
      </p>
    </footer>
  );
};

export default Footer;
