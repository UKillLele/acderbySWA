import { Outlet, NavLink, useNavigation, Link } from 'react-router-dom'
import { Nav, Navbar, Container, NavDropdown, Spinner, Col } from 'react-bootstrap'
import { isEditor, clearStorage } from './ProtectedRoute';


const Layout = () => {
    const { state } = useNavigation();

    const editor = isEditor();
    return (
        <Container fluid className="bg-dark text-light page-bg" data-bs-theme="dark">
            <Navbar expand="lg">
                <Container className="fs-4">
                    <Navbar.Brand as={NavLink} to="/" className="d-lg-none">
                        <img alt="Assassination City Roller Derby"
                            src="/images/logo-black.gif"
                            width="120"
                            height="120"
                            className="d-inline-block align-top"
                        />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse className="justify-content-center">
                        <Nav className="text-shadow">
                            <Nav.Link as={NavLink} to="/" className="my-auto">Home</Nav.Link>
                            <NavDropdown title="Events" className="my-auto">
                                <NavDropdown.Item as={NavLink} to="/season">2025 Season</NavDropdown.Item>
                                <NavDropdown.Item as={NavLink} to="/events">Events</NavDropdown.Item>
                                <NavDropdown.Item as={NavLink} to="/tickets">Tickets</NavDropdown.Item>
                            </NavDropdown>
                            <NavDropdown title="About" className="my-auto">
                                <NavDropdown.Item as={NavLink} to="/league">Our League</NavDropdown.Item>
                                <NavDropdown.Item as={NavLink} to="/derby">Roller Derby</NavDropdown.Item>
                                <NavDropdown.Item as={NavLink} to="/sponsors">Sponsors</NavDropdown.Item>
                            </NavDropdown>
                            <NavDropdown title="Teams" className="my-auto">
                                <NavDropdown.Header>Travel Team</NavDropdown.Header>
                                <NavDropdown.Item as={NavLink} to="teams/conspiracy">Conspiracy</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Header>Home Teams</NavDropdown.Header>
                                <NavDropdown.Item as={NavLink} to="teams/bombshells">Bombshell Brigade</NavDropdown.Item>
                                <NavDropdown.Item as={NavLink} to="teams/lsa">Lone Star Assassins</NavDropdown.Item>
                                <NavDropdown.Item as={NavLink} to="teams/dk">The Deadly Kennedys</NavDropdown.Item>
                                <NavDropdown.Item as={NavLink} to="teams/la-rev">&iexcl;Viva La Revoluci&oacute;n!</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Header>Volunteers</NavDropdown.Header>
                                <NavDropdown.Item as={NavLink} to="teams/officials">The Warren Commission</NavDropdown.Item>
                                <NavDropdown.Item as={NavLink} to="/photographers">Photographers</NavDropdown.Item>
                                {editor && 
                                    <>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Header>Editor</NavDropdown.Header>
                                        <NavDropdown.Item as={NavLink} to="/players">Edit People</NavDropdown.Item>
                                    </>
                                }
                            </NavDropdown>
                            <Navbar.Brand as={NavLink} to="/" className="d-none d-lg-block mx-5">
                                <img alt="Assassination City Roller Derby"
                                    src="/images/logo-black.gif"
                                    width="120"
                                    height="120"
                                    className="d-inline-block align-top"
                                />
                            </Navbar.Brand>
                            <Nav.Link as={NavLink} to="/shop" className="my-auto">Shop</Nav.Link>
                            <Nav.Link as={NavLink} to="/join" className="my-auto">Join</Nav.Link>
                            <Nav.Link as={NavLink} to="/news" className="my-auto">News</Nav.Link>
                            <Nav.Link as={NavLink} to="/contact" className="my-auto">Contact</Nav.Link>
                            <Col className="d-flex align-items-center">
                                <Link className="btn btn-primary btn-lg shadow" to="tickets">Tickets</Link>
                            </Col>
                            {editor && 
                                <Nav.Link href="/.auth/logout" onClick={() => clearStorage()} className="my-auto">Log out</Nav.Link>
                            }
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            {state === 'loading' 
            ?
                <Container fluid className="page-loader">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </Container>
            :
                <Outlet />
            }
        </Container>
    )
}

export default Layout;