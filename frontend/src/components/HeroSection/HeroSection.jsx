const HeroSection = ({
  title,
  subtitle,
  imageSrc,
  imageAlt,
  imageOnRight,
  ctaText,
  bgClass
}) => {
  const textBlock = (
    <div className="flex-1 flex flex-col items-start justify-center max-w-lg">
      <h2 className="text-4xl font-bold mb-4 leading-tight">{title}</h2>
      <p className="text-lg text-gray-600 mb-8">{subtitle}</p>
      {ctaText && (
        <button className="uppercase bg-[#ff8000] hover:bg-[#ff9224] text-white py-4 px-6 rounded font-semibold tracking-wide transition-colors">
          {ctaText}
        </button>
      )}
    </div>
  );

  const imageBlock = (
    <div className="flex-1 flex items-center justify-center">
      <img
        src={imageSrc}
        alt={imageAlt}
        className="w-full max-w-md rounded-2xl shadow-xl object-cover"
      />
    </div>
  );

  return (
    <section
      className="flex flex-col md:flex-row items-center justify-center min-h-screen px-8 py-16 gap-1"
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