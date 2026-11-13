import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import Treatments from "@/components/Treatments";
import Method from "@/components/Method";
import Testimonials from "@/components/Testimonials";
import Faq from "@/components/Faq";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import QuickActions from "@/components/QuickActions";
import ChatWidget from "@/components/ChatWidget";

export default function Home() {
  return (
    <>
      <Header />
      <main className="pb-20 sm:pb-0">
        <Hero />
        <TrustBar />
        <Treatments />
        <Method />
        <Testimonials />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <QuickActions />
      <ChatWidget />
    </>
  );
}
