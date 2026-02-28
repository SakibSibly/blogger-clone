import { useEffect, useState } from "react";
import HeroSection from "../HeroSection/HeroSection";
import HeroCarousel from "../HeroCarousel/HeroCarousel";
import api from "../../api/api";

/**
 * Interim color map keyed by serial_number.
 * Remove once the DB bg_class values are updated to the proper rich colors.
 * Suggested DB values:
 *   serial 2 → #f57c00   (orange)
 *   serial 3 → #c0392b   (red)
 *   serial 4 → #2e9e8f   (teal)
 *   serial 5 → #4a7c75   (slate-teal)
 *   serial 6 → #c0392b   (red)
 */
const SERIAL_BG = {
  2: "#f57c00",
  3: "#c0392b",
  4: "#2e9e8f",
  5: "#4a7c75",
  6: "#c0392b",
};

const LandingPage = () => {
  const [heroCards, setHeroCards] = useState([]);

  useEffect(() => {
    api.get("/api/v1/hero-cards/")
      .then((res) => {
        res.data.sort((a, b) => a.serial_number - b.serial_number); // Sort by serial_number
        setHeroCards(res.data);
      })
      .catch((err) => console.error("Failed to load hero cards:", err));
  }, []);

  return (
    <div>
      <HeroCarousel />
      {heroCards.map((card, index) => (
        <HeroSection
          key={index}
          title={card.title}
          subtitle={card.subtitle}
          imageSrc={card.image_src}
          imageAlt={card.image_alt}
          imageOnRight={card.image_on_right}
          bgClass={SERIAL_BG[card.serial_number] ?? card.bg_class}
        />
      ))}
    </div>
  );
};

export default LandingPage;