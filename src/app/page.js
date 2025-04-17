import HeroSection from "./component/HeroSection";
import NewSection from "./component/NewSection";
import Navbar from "./component/Navbar";
import MainSection from "./component/MainSection";
import Footer from "./component/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <NewSection />
      <MainSection />
      <Footer />
    </>
  );
}
