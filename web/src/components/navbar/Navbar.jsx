import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import WalletButton from '../walletButton/WalletButton';
import { NavLink } from 'react-router-dom';

function NavScrollExample() {
    return (
        <Navbar bg="dark" variant="dark" expand="sm">
            <Container fluid>
                <Navbar.Brand href="/">FLONE</Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Nav
                        className="me-auto my-2 my-lg-0"
                        style={{ maxHeight: '100px' }}
                        navbarScroll
                    >
                        <NavLink className={"nav-link"} to="/">Home</NavLink>
                        <NavLink className={"nav-link"} to="/world">World</NavLink>
                        <NavLink className={"nav-link"} to="/admin">Admin</NavLink>
                    </Nav>
                    <div className='d-flex'>
                        <WalletButton variant="dark" />
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavScrollExample;