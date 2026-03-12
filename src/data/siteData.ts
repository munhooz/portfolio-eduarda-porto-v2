export interface SiteData {
  profile: {
    nome: string;
    titulo: string;
    descricao: string;
    fotoUrl: string;
  };
  about: {
    texto: string;
  };
  skills: Array<{
    nome: string;
    nivelPercentual: number;
    ordem: number;
  }>;
  experience: Array<{
    cargo: string;
    empresa: string;
    periodo: string;
    descricao: string;
    ordem: number;
  }>;
  projects: Array<{
    titulo: string;
    descricao: string;
    link: string;
    imageUrl: string;
    categoria: string;
    ordem: number;
    oculto: boolean;
  }>;
  projectSubsections: {
    galeria: {
      pageTitle: string;
      pageSubtitle: string;
      categories: Array<{
        id: string;
        titulo: string;
        imagens: string[];
        ordem: number;
      }>;
    };
    vitrine: {
      pageTitle: string;
      pageSubtitle: string;
      categories: Array<{
        id: string;
        titulo: string;
        imagens: string[];
        ordem: number;
      }>;
    };
  };
  contact: {
    email: string;
    telefone: string;
    cidade: string;
    linkedin: string;
    outrosLinks: Record<string, string>;
  };
  cvUrl: string;
}

export const defaultSiteData: SiteData = {
  profile: {
    nome: "Eduarda Porto",
    titulo: "Jornalista | Social Media",
    descricao: "Especialista em Social Media, sou apaixonada por criar conteúdos engajadores e analisar tendências nas redes sociais.",
    fotoUrl: "",
  },
  about: {
    texto: "Sou jornalista de formação e apaixonada por contar histórias que conectam pessoas e marcas de forma autêntica. Com uma mente criativa e comunicativa, tenho uma trajetória que mistura estratégia, conteúdo e um olhar atento para as tendências digitais. Transformo ideias em projetos que fazem sentido e trazem resultados, sempre com leveza, alegria e muita dedicação.\n\nSeja planejando campanhas ou criando conteúdo, meu foco é humanizar as marcas e aproximá-las do público. Meu objetivo é construir uma comunicação que inspire e impacte positivamente.",
  },
  skills: [
    { nome: "Escrita", nivelPercentual: 91, ordem: 1 },
    { nome: "Oratória", nivelPercentual: 84, ordem: 2 },
    { nome: "Apuração", nivelPercentual: 86, ordem: 3 },
    { nome: "Fotografia", nivelPercentual: 78, ordem: 4 },
    { nome: "Criatividade", nivelPercentual: 82, ordem: 5 },
    { nome: "Edição de Imagem", nivelPercentual: 76, ordem: 6 },
    { nome: "Edição de Vídeo", nivelPercentual: 80, ordem: 7 },
    { nome: "Gestão de Pessoas", nivelPercentual: 100, ordem: 8 },
  ],
  experience: [
    {
      cargo: "Social Media | Criação de Conteúdo e Gestão de Perfis",
      empresa: "Ostemidia",
      periodo: "Nov/2024 - Atual",
      descricao: "Atuo na gestão completa de redes sociais: crio calendários editoriais, roteiros para vídeos, realizo postagens, alinho demandas com designers, participo de reuniões com clientes e acompanho todas as etapas do processo para garantir entregas estratégicas e coerentes.",
      ordem: 1,
    },
    {
      cargo: "Gerente de Mídias Sociais",
      empresa: "Plante Ideias Agência de Marketing",
      periodo: "Dez/2023 - Out/2024",
      descricao: "Planejamento estratégico de conteúdo e roteiros, acompanhando demandas de clientes da concepção à execução. Liderei a equipe de criação, coordenei gravações de vídeos, revisei peças gráficas e garanti o cumprimento de prazos, sempre atendendo às necessidades dos clientes de forma criativa e eficiente.",
      ordem: 2,
    },
    {
      cargo: "Coordenadora de Mídias Sociais",
      empresa: "K2 Comunicação e Marketing Digital",
      periodo: "Fev/2023 - Dez/2023",
      descricao: "Atendimento publicitário, planejamento estratégico para mídias sociais, auxílio na concepção e implementação de campanhas publicitárias de sucesso para empresas e eficaz gerenciamento da equipe de design.",
      ordem: 3,
    },
    {
      cargo: "Estagiária de Marketing",
      empresa: "Partage Shopping Betim",
      periodo: "Mar/2022 - Fev/2023",
      descricao: "Criação de conteúdo para as redes sociais do Shopping, responsável por responder as redes sociais, SAC e e-mail, organização de eventos do shopping e ações de endomarketing, escrita do informativo semanal sobre ações do shopping.",
      ordem: 4,
    },
    {
      cargo: "Estagiária de Comunicação e Publicidade",
      empresa: "Crea-MG",
      periodo: "Nov/2021 - Mar/2022",
      descricao: "Apuração de temas para o Minuto Crea (programa da Rádio Crea-MG), auxílio no levantamento de possíveis conteúdos para pautas, escrita de matérias para o site do Crea-MG.",
      ordem: 5,
    },
    {
      cargo: "Estagiária de Jornalismo",
      empresa: "TV Horizonte",
      periodo: "Mai/2021 - Jun/2021",
      descricao: "Criação de pautas (desde a escolha do tema, busca por personagens, contato com órgãos públicos e etc), auxílio da apresentadora do programa durante a sua transmissão ao vivo, marcações de entrevistas.",
      ordem: 6,
    },
    {
      cargo: "Cerimonialista de Eventos",
      empresa: "Florence Decor",
      periodo: "2013",
      descricao: "Trabalho informal como cerimonialista de festas de debutante, bodas e casamento.",
      ordem: 7,
    },
  ],
  projects: [
    {
      titulo: "Conecta Reels",
      descricao: "Captação e edição de vídeos curtos para empresas e eventos",
      link: "https://www.instagram.com/conecta_reels/",
      imageUrl: "",
      categoria: "Vídeo",
      ordem: 1,
      oculto: false,
    },
    {
      titulo: "Galeria de Fotos",
      descricao: "Cobertura de eventos e cerimoniais",
      link: "/galeria",
      imageUrl: "",
      categoria: "Fotografia",
      ordem: 2,
      oculto: false,
    },
    {
      titulo: "Vídeo Institucional",
      descricao: "Auxílio na produção do vídeo institucional para o projeto Comida que Abraça",
      link: "https://www.youtube.com/watch?v=44QZilgeDnY",
      imageUrl: "",
      categoria: "Vídeo",
      ordem: 3,
      oculto: false,
    },
    {
      titulo: "Biblioteca Jayme Dicker",
      descricao: "Matéria publicada no site do Crea-MG, para inauguração da biblioteca Jayme Dicker",
      link: "",
      imageUrl: "",
      categoria: "Matéria",
      ordem: 4,
      oculto: false,
    },
    {
      titulo: "História da Engenharia",
      descricao: "Matéria publicada no site do Crea-MG, sobre o evento 'História da Engenharia contada pelos Ex-Alunos'",
      link: "",
      imageUrl: "",
      categoria: "Matéria",
      ordem: 5,
      oculto: false,
    },
    {
      titulo: "Notícias do Confea",
      descricao: "Matéria publicada no site do Crea-MG, sobre o conselheiro de MG representando o plenário Mineiro no CCM",
      link: "",
      imageUrl: "",
      categoria: "Matéria",
      ordem: 6,
      oculto: false,
    },
    {
      titulo: "Associação dos Engenheiros do DER",
      descricao: "Matéria publicada no site do Crea-MG, para a cerimônia de apresentação final dos trabalhos do curso de capacitação em concessões com foco em manutenção",
      link: "",
      imageUrl: "",
      categoria: "Matéria",
      ordem: 7,
      oculto: false,
    },
    {
      titulo: "Futebol Feminino",
      descricao: "Matéria publicada no jornal Marco, sobre a relevância do reconhecimento feminino no futebol, sinônimo de raça e luta - Pág 9",
      link: "https://drive.google.com/file/d/1he4TiXmXD5JtPMtnej4NZGhlWDj2ulHi/view",
      imageUrl: "",
      categoria: "Matéria",
      ordem: 8,
      oculto: false,
    },
    {
      titulo: "Vitrine",
      descricao: "Edições do vitrine semanal escrita para o público interno do Partage Shopping Betim",
      link: "/vitrine",
      imageUrl: "",
      categoria: "Editorial",
      ordem: 9,
      oculto: false,
    },
  ],
  projectSubsections: {
    galeria: {
      pageTitle: "Galeria de Fotos",
      pageSubtitle: "Cobertura fotografica de eventos e cerimoniais.",
      categories: [
        {
          id: "eventos",
          titulo: "Eventos",
          imagens: [],
          ordem: 1,
        },
        {
          id: "cerimonial",
          titulo: "Cerimonial",
          imagens: [],
          ordem: 2,
        },
      ],
    },
    vitrine: {
      pageTitle: "Vitrine",
      pageSubtitle: "Edicoes do informativo semanal escrito para o publico interno do Partage Shopping Betim.",
      categories: [
        {
          id: "partage-shopping-betim",
          titulo: "Partage Shopping Betim",
          imagens: [],
          ordem: 1,
        },
      ],
    },
  },
  contact: {
    email: "portoeduarda276@gmail.com",
    telefone: "+55 (31) 99473-2504",
    cidade: "Betim, Minas Gerais",
    linkedin: "https://www.linkedin.com/in/eduarda-porto-835517319/",
    outrosLinks: {},
  },
  cvUrl: "/pdf/eduarda_porto.pdf",
};
