import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import TrackingSystem from "@/components/TrackingSystem";
import TimeGuarantee from "@/components/TimeGuarantee";
import Pricing from "@/components/Pricing";
import Partnerships from "@/components/Partnerships";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Services />
      <TrackingSystem />
      <TimeGuarantee />
      <Pricing />
      <Partnerships />
      <Footer />
    </div>
  );
};

export default Index;
