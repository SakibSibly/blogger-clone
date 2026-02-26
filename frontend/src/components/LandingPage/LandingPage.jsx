import { useEffect, useState } from "react";
import HeroSection from "../HeroSection/HeroSection";
import api from "../../api/api";

const LandingPage = () => {
  const [heroCards, setHeroCards] = useState([]);

  useEffect(() => {
    api.get("/api/v1/hero-cards/")
      .then((res) => setHeroCards(res.data))
      .catch((err) => console.error("Failed to load hero cards:", err));
  }, []);

  return (
    <div>
      {heroCards.map((card, index) => (
        <HeroSection
          key={index}
          title={card.title}
          subtitle={card.subtitle}
          imageSrc={card.image_src}
          imageAlt={card.image_alt}
          imageOnRight={card.image_on_right}
          ctaText={card.cta_text}
          bgClass={card.bg_class}
        />
      ))}
    </div>
  );
};

export default LandingPage;