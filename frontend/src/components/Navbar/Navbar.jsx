import { useState, useEffect } from 'react';
import login from '../../assets/Navbar/blogger-logo-transparent.png';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-5 py-3">
      {/* White background curtain — slides down from top like a shade */}
      <div
        className="absolute inset-0 bg-white shadow-sm origin-top transition-transform duration-500 ease-in-out"
        style={{ transform: scrolled ? 'scaleY(1)' : 'scaleY(0)' }}
      />

      {/* Content sits above the curtain */}
      <div className="relative flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img src={login} alt="Blogger Clone" className="w-9" />
          <span
            className={`font-normal text-xl transition-colors duration-300 ${
              scrolled ? 'text-gray-800' : 'text-white'
            }`}
          >
            Blogger
          </span>
        </Link>

        {/* Right side */}
        {!isAuthenticated && (
          <div className="flex items-center gap-4">
            {/* Sign in — always visible, shifts left when CTA appears */}
            <Link
              to="/login"
              className={`font-bold uppercase text-sm tracking-wide transition-colors duration-300 ${
                scrolled ? 'text-gray-800' : 'text-white'
              }`}
            >
              Sign in
            </Link>

            {/* CTA — expands in from zero width on scroll */}
            <Link
              to="#"
              className={`uppercase font-bold text-sm tracking-[1.5px] whitespace-nowrap rounded bg-[#ff8000] text-white hover:bg-[#ff9224] overflow-hidden transition-all duration-500 ease-in-out ${
                scrolled
                  ? 'max-w-50 opacity-100 px-4 py-3 pointer-events-auto'
                  : 'max-w-0 opacity-0 px-0 py-3 pointer-events-none'
              }`}
            >
              Create your blog
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;