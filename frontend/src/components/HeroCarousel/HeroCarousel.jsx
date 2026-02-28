import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./HeroCarousel.css";

const slides = [
  {
    id: 0,
    bg: "#b93028",
    accentBg: "#9e2820",
    previewBg: "#8b1f18",
    previewDotColor: "rgba(255,255,255,0.15)",
    blogTitle: "My cooking blog",
    blogTitleStyle: {
      background: "#7a1a13",
      fontFamily: "serif",
      fontStyle: "italic",
      color: "#fff",
      borderRadius: "4px",
      padding: "8px 20px",
      fontSize: "20px",
      fontWeight: "bold",
      display: "inline-block",
    },
    blogDate: "Thursday, 16 January",
    blogPost: "Delicious dessert recipe",
    blogImgColor: "#6b1510",
    decorations: [
      // Spoon left
      {
        type: "spoon",
        style: { position: "absolute", left: "3%", top: "20%", opacity: 0.35, width: 70, transform: "rotate(-20deg)" },
      },
      // Whisk bottom-left
      {
        type: "whisk",
        style: { position: "absolute", left: "2%", bottom: "10%", opacity: 0.35, width: 90 },
      },
      // Cherries
      {
        type: "cherries",
        style: { position: "absolute", left: "18%", bottom: "8%", opacity: 0.4, width: 60 },
      },
      // Rolling pin right
      {
        type: "rollingpin",
        style: { position: "absolute", right: "2%", top: "18%", opacity: 0.35, width: 100, transform: "rotate(30deg)" },
      },
      // Pot right bottom
      {
        type: "pot",
        style: { position: "absolute", right: "5%", bottom: "12%", opacity: 0.35, width: 80 },
      },
    ],
  },
  {
    id: 1,
    bg: "#1e7a65",
    accentBg: "#176655",
    previewBg: "#155c4d",
    previewDotColor: "rgba(255,255,255,0.12)",
    blogTitle: "– Our Family Adventures –",
    blogTitleStyle: {
      background: "transparent",
      fontFamily: "sans-serif",
      color: "#1e7a65",
      fontSize: "18px",
      fontWeight: "bold",
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
    },
    blogDate: "Sunday, 3 July",
    blogPost: "Family weekend out",
    blogImgColor: "#0e4436",
    decorations: [
      // Coffee cup left
      {
        type: "coffee",
        style: { position: "absolute", left: "4%", top: "25%", opacity: 0.3, width: 90 },
      },
      // Flower
      {
        type: "flower",
        style: { position: "absolute", left: "2%", bottom: "15%", opacity: 0.3, width: 70 },
      },
      // Alphabet blocks right
      {
        type: "blockA",
        style: { position: "absolute", right: "4%", top: "20%", opacity: 0.3, width: 70 },
      },
      {
        type: "blockB",
        style: { position: "absolute", right: "2%", bottom: "15%", opacity: 0.3, width: 70 },
      },
      // Leaf
      {
        type: "leaf",
        style: { position: "absolute", left: "12%", top: "12%", opacity: 0.2, width: 80 },
      },
    ],
  },
];

/* ── Simple SVG decoration shapes ── */
const DecorationShape = ({ type, style }) => {
  const svgProps = { fill: "currentColor", xmlns: "http://www.w3.org/2000/svg" };
  let content = null;

  switch (type) {
    case "spoon":
      content = (
        <svg viewBox="0 0 40 120" style={{ ...style, color: "white" }} {...svgProps}>
          <ellipse cx="20" cy="18" rx="14" ry="18" />
          <rect x="17" y="34" width="6" height="86" rx="3" />
        </svg>
      );
      break;
    case "whisk":
      content = (
        <svg viewBox="0 0 50 130" style={{ ...style, color: "white" }} {...svgProps}>
          <path d="M25 10 Q10 30 15 55 Q20 70 25 75 Q30 70 35 55 Q40 30 25 10Z" />
          <path d="M15 40 Q5 55 18 65" strokeWidth="3" stroke="white" fill="none" />
          <path d="M35 40 Q45 55 32 65" strokeWidth="3" stroke="white" fill="none" />
          <rect x="22" y="74" width="6" height="56" rx="3" />
        </svg>
      );
      break;
    case "cherries":
      content = (
        <svg viewBox="0 0 60 70" style={{ ...style, color: "white" }} {...svgProps}>
          <path d="M30 10 Q20 0 35 0 Q40 15 30 10Z" />
          <path d="M30 10 Q45 5 50 15 Q45 30 35 25 Q30 10 30 10" />
          <circle cx="15" cy="52" r="16" />
          <circle cx="43" cy="52" r="16" />
        </svg>
      );
      break;
    case "rollingpin":
      content = (
        <svg viewBox="0 0 120 40" style={{ ...style, color: "white" }} {...svgProps}>
          <rect x="20" y="14" width="80" height="12" rx="6" />
          <ellipse cx="20" cy="20" rx="12" ry="18" />
          <ellipse cx="100" cy="20" rx="12" ry="18" />
          <line x1="20" y1="2" x2="10" y2="-6" stroke="white" strokeWidth="5" strokeLinecap="round" />
          <line x1="100" y1="2" x2="112" y2="-4" stroke="white" strokeWidth="5" strokeLinecap="round" />
        </svg>
      );
      break;
    case "pot":
      content = (
        <svg viewBox="0 0 80 70" style={{ ...style, color: "white" }} {...svgProps}>
          <rect x="5" y="20" width="70" height="45" rx="8" />
          <rect x="0" y="18" width="80" height="8" rx="4" />
          <rect x="-5" y="22" width="12" height="8" rx="4" />
          <rect x="73" y="22" width="12" height="8" rx="4" />
          <rect x="30" y="5" width="20" height="15" rx="3" />
        </svg>
      );
      break;
    case "coffee":
      content = (
        <svg viewBox="0 0 80 90" style={{ ...style, color: "white" }} {...svgProps}>
          <rect x="5" y="25" width="55" height="55" rx="6" />
          <path d="M60 35 Q75 35 75 48 Q75 60 60 60" strokeWidth="5" stroke="white" fill="none" />
          <ellipse cx="32" cy="90" rx="30" ry="5" opacity="0.4" />
          <path d="M20 10 Q22 5 20 0" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M32 8 Q34 2 32 0" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M44 10 Q46 4 44 0" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
        </svg>
      );
      break;
    case "flower":
      content = (
        <svg viewBox="0 0 70 70" style={{ ...style, color: "white" }} {...svgProps}>
          <circle cx="35" cy="35" r="12" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
            <ellipse
              key={i}
              cx={35 + 20 * Math.cos((deg * Math.PI) / 180)}
              cy={35 + 20 * Math.sin((deg * Math.PI) / 180)}
              rx="8"
              ry="12"
              transform={`rotate(${deg} ${35 + 20 * Math.cos((deg * Math.PI) / 180)} ${35 + 20 * Math.sin((deg * Math.PI) / 180)})`}
              opacity="0.8"
            />
          ))}
        </svg>
      );
      break;
    case "blockA":
      content = (
        <svg viewBox="0 0 60 60" style={{ ...style, color: "white" }} {...svgProps}>
          <rect width="60" height="60" rx="6" opacity="0.7" />
          <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontSize="36" fontWeight="bold" fill="white" fontFamily="serif">A</text>
        </svg>
      );
      break;
    case "blockB":
      content = (
        <svg viewBox="0 0 60 60" style={{ ...style, color: "white" }} {...svgProps}>
          <rect width="60" height="60" rx="6" opacity="0.7" />
          <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontSize="36" fontWeight="bold" fill="white" fontFamily="serif">B</text>
        </svg>
      );
      break;
    case "leaf":
      content = (
        <svg viewBox="0 0 60 80" style={{ ...style, color: "white" }} {...svgProps}>
          <path d="M30 75 Q5 50 10 20 Q20 5 30 5 Q40 5 50 20 Q55 50 30 75Z" opacity="0.6" />
          <line x1="30" y1="75" x2="30" y2="10" stroke="white" strokeWidth="2" opacity="0.4" />
        </svg>
      );
      break;
    default:
      return null;
  }
  return content;
};

/* ── Blog preview mockup ── */
const BlogPreview = ({ slide }) => (
  <div
    style={{
      background: "white",
      borderRadius: "6px 6px 0 0",
      width: "100%",
      overflow: "hidden",
      boxShadow: "0 -8px 40px rgba(0,0,0,0.3)",
    }}
  >
    {/* Polka-dot / dotted header strip */}
    <div
      style={{
        background: slide.accentBg,
        padding: "18px 20px 14px",
        backgroundImage: `radial-gradient(circle, ${slide.previewDotColor} 2px, transparent 2px)`,
        backgroundSize: "14px 14px",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <span style={slide.blogTitleStyle}>
          {slide.id === 1 && <span>&#9733;</span>}
          {slide.blogTitle}
          {slide.id === 1 && <span>&#9733;</span>}
        </span>
      </div>
    </div>
    {/* Blog body */}
    <div style={{ padding: "12px 18px", background: "#fff" }}>
      <p style={{ fontSize: "11px", color: "#888", marginBottom: "4px" }}>{slide.blogDate}</p>
      <p style={{ fontSize: "14px", color: "#333", fontWeight: "500", marginBottom: "8px" }}>{slide.blogPost}</p>
      <div
        style={{
          width: "100%",
          height: "70px",
          background: slide.blogImgColor,
          borderRadius: "3px",
        }}
      />
    </div>
  </div>
);

const INTERVAL_MS = 4000;

const HeroCarousel = ({ ctaText = "Create your blog", ctaLink = "/login" }) => {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(null);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef(null);

  const goToSlide = (next) => {
    if (animating || next === current) return;
    setAnimating(true);
    setPrev(current);
    setCurrent(next);
    setTimeout(() => {
      setPrev(null);
      setAnimating(false);
    }, 800);
  };

  const advance = () => {
    const next = (current + 1) % slides.length;
    goToSlide(next);
  };

  useEffect(() => {
    timerRef.current = setInterval(advance, INTERVAL_MS);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, animating]);

  return (
    <div className="hero-carousel">
      {/* ── Slides ── */}
      {slides.map((slide, i) => {
        let cls = "hero-carousel__slide slide-hidden";
        if (i === current && prev === null) cls = "hero-carousel__slide slide-active";
        else if (i === current && prev !== null) cls = "hero-carousel__slide slide-enter";
        else if (i === prev) cls = "hero-carousel__slide slide-exit";

        return (
          <div
            key={slide.id}
            className={cls}
            style={{ background: slide.bg }}
          >
            <div className="hero-carousel__slide-inner">
              {/* Decorative shapes */}
              {slide.decorations.map((d, di) => (
                <DecorationShape key={di} type={d.type} style={d.style} />
              ))}
              {/* Blog preview at bottom */}
              <div className="hero-carousel__preview">
                <BlogPreview slide={slide} />
              </div>
            </div>
          </div>
        );
      })}

      {/* ── Fixed text overlay (always on top) ── */}
      <div className="hero-carousel__overlay">
        <h1
          style={{
            color: "white",
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: "300",
            textAlign: "center",
            letterSpacing: "-0.5px",
            lineHeight: 1.2,
            margin: "0 20px 14px",
            textShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          Publish your passions, your way
        </h1>
        <p
          style={{
            color: "rgba(255,255,255,0.9)",
            fontSize: "clamp(0.95rem, 2vw, 1.2rem)",
            textAlign: "center",
            marginBottom: "32px",
            textShadow: "0 1px 4px rgba(0,0,0,0.15)",
          }}
        >
          Create a unique and beautiful blog easily.
        </p>
        <Link
          to={ctaLink}
          style={{
            background: "#ff8000",
            color: "white",
            padding: "14px 28px",
            borderRadius: "4px",
            fontWeight: "bold",
            fontSize: "0.85rem",
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            textDecoration: "none",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.target.style.background = "#ff9224")}
          onMouseLeave={(e) => (e.target.style.background = "#ff8000")}
        >
          {ctaText}
        </Link>
      </div>

      {/* ── Dot indicators ── */}
      <div className="hero-carousel__dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`hero-carousel__dot${i === current ? " active" : ""}`}
            onClick={() => goToSlide(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
