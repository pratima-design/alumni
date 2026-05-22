import LandingNavbar from "../components/Landing/LandingNavbar";
import HeroSection from "../components/Landing/HeroSection";
import StatisticsSection from "../components/Landing/StatisticsSection";
import ServicesSection from "../components/Landing/ServicesSection";
import CTASection from "../components/Landing/CTASection";
import Footer from "../components/Landing/Footer";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <LandingNavbar />
      <HeroSection />
      <StatisticsSection />
      <ServicesSection />
      <CTASection />
      <Footer />
    </div>
  );
}
