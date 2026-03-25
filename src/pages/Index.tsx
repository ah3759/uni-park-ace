import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import TimeGuarantee from "@/components/TimeGuarantee";
import Pricing from "@/components/Pricing";
import ParkingForm from "@/components/ParkingForm";

import BusinessBooking from "@/components/BusinessBooking";
import Partnerships from "@/components/Partnerships";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <ParkingForm />
      <Services />
      
      <TimeGuarantee />
      <Pricing />
      <BusinessBooking />
      <Partnerships />
      <Footer />
    </div>
  );
};

export default Index;
