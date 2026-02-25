import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

const Layout = () => {
    return (
        <div  style={{fontFamily: 'Arial'}}>
            <Navbar />
                <main>
                    <Outlet />
                </main>
            <Footer />
        </div>
    );
};

export default Layout;