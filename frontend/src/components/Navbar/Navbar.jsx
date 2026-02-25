import login from '../../assets/Navbar/blogger-logo-transparent.png';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="flex justify-between p-4">
      <div className='flex items-center space-x-2'>
        <img src={login} alt="Blogger Clone" className="w-9" />
        <span className="font-normal text-xl">Blogger</span>
      </div>
      <div>
        <ul className="flex space-x-4">
          <li><Link to="/login" className="font-bold uppercase">Sign in</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;