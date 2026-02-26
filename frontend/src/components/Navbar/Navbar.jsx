import login from '../../assets/Navbar/blogger-logo-transparent.png';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated } = useAuth();

  return (
    <nav className="flex justify-between p-4">
      <div className='flex items-center space-x-2'>
        <img src={login} alt="Blogger Clone" className="w-9" />
        <span className="font-normal text-xl">Blogger</span>
      </div>
      {!isAuthenticated && (
        <div className="flex items-center">
          <ul>
            <li><Link to="/login" className="font-bold uppercase">Sign in</Link></li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;