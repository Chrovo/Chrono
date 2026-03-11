import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Benefits from "../components/Benefits";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div className="min-h-screen bg-[#0a0f1e] overflow-hidden">
      <Navbar />

      <div className="pt-40 pb-24">
        <Hero />
      </div>

      <div className="py-24">
        <Benefits />
      </div>

      <Footer />
    </div>
  );
};

export default Home;