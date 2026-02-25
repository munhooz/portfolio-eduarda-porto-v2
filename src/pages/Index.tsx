import { useState, useEffect } from "react";
import { defaultSiteData, SiteData } from "@/data/siteData";
import { fetchSiteData } from "@/lib/firebase";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  const [data, setData] = useState<SiteData>(defaultSiteData);

  useEffect(() => {
    fetchSiteData().then(setData);
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <Hero data={data} />
        <About data={data} />
        <Skills data={data} />
        <Experience data={data} />
        <Projects data={data} />
        <Contact data={data} />
      </main>
      <Footer data={data} />
    </>
  );
};

export default Index;
