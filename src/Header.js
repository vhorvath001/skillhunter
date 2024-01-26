import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { FaUserNinja } from 'react-icons/fa6';


const Header = () => {
    return (
        <header>
            <Navbar expand='lg' className='bg-body-tertiary shadow-lg'>
                <Container>
                    <Navbar.Brand href='#'>Skill Hunter</Navbar.Brand>
                    <Navbar.Toggle aria-controls='basic-navbar-nav' />
                    <Navbar.Collapse className='ms-5'>
                        <Navbar.Text>
                            <FaUserNinja/>: Ric Flair
                        </Navbar.Text>
                    </Navbar.Collapse>
                    <Navbar.Collapse id='basic-navbar-nav' className='justify-content-end'>
                        <Nav >
                            <NavDropdown title='Administration' id='basic-nav-dropdown' className='me-4'>
                                <NavDropdown.Item href='#action/3.1'>Programming Languages</NavDropdown.Item>
                                <NavDropdown.Item href='#action/3.2'>Repositories</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                        <Nav.Link href='#home' >Dashboard</Nav.Link>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    )
}

export default Header;