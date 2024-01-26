import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';

const Footer = () => {
    const today = new Date();

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