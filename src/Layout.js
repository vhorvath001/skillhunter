import Header from './Header';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div className='body'>
            <Header />
            <div className='main'>
                <Outlet />
            </div>
            <Footer />
        </div>
    )
}

export default Layout;