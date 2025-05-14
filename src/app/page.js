import HeroSection from "./component/HeroSection";
import NewSection from "./component/NewSection";
import Navbar from "./component/Navbar";
import MainSection from "./component/MainSection";
import Footer from "./component/Footer";
import Allproduct from "./component/Allproduct";

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <NewSection />
      <MainSection />
      <Allproduct />
      <Footer />
    </>
  );
}
