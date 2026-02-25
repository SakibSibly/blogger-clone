const HeroSection = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center pt-5">
        <h2 className="text-5xl mb-4 mt-3">Publish your passions, your way</h2>
        <p className="text-lg text-gray-600 mb-9">Create a unique and beautiful blog easily.</p>
        <button className="uppercase bg-[#ff8000] hover:bg-[#ff9022] text-white py-4 px-4 rounded">
          Create Your Blog
        </button>
    </div>
  );
};

export default HeroSection;