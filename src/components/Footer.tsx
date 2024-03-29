import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { ReactElement } from 'react';

const Footer = (): ReactElement => {
    const today: Date = new Date();

    return (
        <footer>
            <hr/>
            <Navbar>
                <Container>
                    <Navbar.Text>Skill Hunter - Copyright &copy; {today.getFullYear()}</Navbar.Text>
                </Container>
            </Navbar>
            <p></p>
        </footer>
    )
}

export default Footer;