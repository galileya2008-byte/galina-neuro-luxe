import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import AboutSection from "@/components/AboutSection";
import NeuroLotosSection from "@/components/NeuroLotosSection";
import PiskarevSection from "@/components/PiskarevSection";
import WhyNeurographicsSection from "@/components/WhyNeurographicsSection";
import ServicesSection from "@/components/ServicesSection";
import GallerySection from "@/components/GallerySection";
import NewsSection from "@/components/NewsSection";
import ArticlesSection from "@/components/ArticlesSection";
import ContactForm from "@/components/ContactForm";
import SocialsSection from "@/components/SocialsSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      {/* Цифры / преимущества */}
      <StatsSection />
      {/* Обо мне */}
      <AboutSection />
      {/* О методе (включает интерактив НейроЛотос) */}
      <NeuroLotosSection />
      {/* Об авторе метода */}
      <PiskarevSection />
      {/* Почему Нейрографика */}
      <WhyNeurographicsSection />
      {/* Курсы и Мастер-классы */}
      <ServicesSection />
      {/* Галерея работ */}
      <GallerySection />
      {/* Моя жизнь с НейроГрафикой — анонсы и статьи */}
      <NewsSection />
      <ArticlesSection />
      {/* Контакты */}
      <ContactForm />
      {/* Мои соцсети */}
      <SocialsSection />
      <Footer />
    </div>
  );
};

export default Index;
