const HeroSection = ({
  title,
  subtitle,
  imageSrc,
  imageAlt,
  imageOnRight,
  ctaText,
  bgClass,
}) => {
  const textBlock = (
    <div
      className={`
        relative z-10 flex flex-col justify-center
        w-full md:w-[45%] shrink-0
        px-10 md:px-16 lg:px-24
        py-14
      `}
    >
      <h2 className="text-4xl lg:text-[2.8rem] font-light text-white leading-tight mb-5">
        {title}
      </h2>
      <p className="text-white/75 text-[0.95rem] lg:text-base leading-relaxed max-w-sm">
        {subtitle}
      </p>
      {ctaText && (
        <button className="mt-7 self-start uppercase bg-[#444] hover:bg-[#333] text-white py-3 px-6 rounded font-bold text-xs tracking-[1.8px] transition-colors">
          {ctaText}
        </button>
      )}
    </div>
  );

  const imageBlock = (
    /* Negative margin pulls the image container beyond the section edge so it bleeds */
    <div
      className={`
        relative flex-1 self-stretch overflow-visible
        ${
          imageOnRight
            ? "-mr-8 md:-mr-16"
            : "-ml-8 md:-ml-16"
        }
      `}
    >
      <img
        src={imageSrc}
        alt={imageAlt}
        className="w-full h-full object-cover object-center"
        style={{ minHeight: "100%" }}
      />
      {/* Gradient fade on the inner edge so image blends into bg */}
      <div
        className={`absolute inset-y-0 w-32 from-current to-transparent ${
          imageOnRight
            ? "left-0 bg-linear-to-r"
            : "right-0 bg-linear-to-l"
        }`}
        style={{ color: bgClass }}
      />
    </div>
  );

  return (
    <section
      className="flex flex-col md:flex-row items-stretch min-h-[72vh] overflow-hidden"
      style={{ backgroundColor: bgClass }}
    >
      {imageOnRight ? (
        <>
          {textBlock}
          {imageBlock}
        </>
      ) : (
        <>
          {imageBlock}
          {textBlock}
        </>
      )}
    </section>
  );
};

export default HeroSection;