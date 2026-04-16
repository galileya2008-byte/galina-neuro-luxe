import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import PiskarevSection from "@/components/PiskarevSection";
import ServicesSection from "@/components/ServicesSection";
import GallerySection from "@/components/GallerySection";
import ArticlesSection from "@/components/ArticlesSection";
import ContactForm from "@/components/ContactForm";
import NeuroLotosSection from "@/components/NeuroLotosSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <AboutSection />
      <PiskarevSection />
      <ServicesSection />
      <GallerySection />
      <NeuroLotosSection />
      <ArticlesSection />
      <ContactForm />
      <Footer />
    </div>
  );
};

export default Index;
