import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/FeatureCards";
import Footer from "../components/Footer";
import FeatureCards from "../components/FeatureCards";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <FeatureCards />
      <Footer />
    </main>
  );
}
