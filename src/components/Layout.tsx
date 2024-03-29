import Header from './Header';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';
import { ReactElement } from 'react';

const Layout = (): ReactElement => {
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