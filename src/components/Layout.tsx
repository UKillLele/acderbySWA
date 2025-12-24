import { Outlet, NavLink, useNavigation } from "react-router-dom";
import { Nav, Navbar, Container, NavDropdown, Spinner } from "react-bootstrap";
import { isEditor, clearStorage } from "./ProtectedRoute";

const Layout = () => {
  const { state } = useNavigation();

  const editor = isEditor();
  return (
    <Container
      fluid
      className="bg-dark text-light page-bg"
      data-bs-theme="dark"
    >
      <Navbar collapseOnSelect={true} expand="lg">
        <Container fluid>
          <Navbar.Brand as={NavLink} to="/" className="d-flex">
            <img
              alt="Assassination City Roller Derby"
              src="/images/logo-black.gif"
              width="80"
              height="80"
              className="d-inline-block align-top my-2"
            />
            <div className="my-auto ms-2 fs-5 text-shadow fw-bold">
              <p className="mb-0">
                ASSASSINATION CITY <br /> ROLLER DERBY
              </p>
            </div>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse>
            <Nav className="text-shadow ms-auto">
              <NavDropdown title="ABOUT" className="my-auto">
                <NavDropdown.Item as={NavLink} to="/league">
                  Our League
                </NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/derby">
                  Roller Derby
                </NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/sponsors">
                  Sponsors
                </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="TEAMS" className="my-auto">
                <NavDropdown.Header>Travel Team</NavDropdown.Header>
                <NavDropdown.Item as={NavLink} to="teams/conspiracy">
                  Conspiracy
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Header>Home Teams</NavDropdown.Header>
                <NavDropdown.Item as={NavLink} to="teams/bombshells">
                  Bombshell Brigade
                </NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="teams/lsa">
                  Lone Star Assassins
                </NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="teams/dk">
                  The Deadly Kennedys
                </NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="teams/la-rev">
                  &iexcl;Viva La Revoluci&oacute;n!
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Header>Volunteers</NavDropdown.Header>
                <NavDropdown.Item as={NavLink} to="teams/officials">
                  The Warren Commission
                </NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/photographers">
                  Photographers
                </NavDropdown.Item>
                {editor && (
                  <>
                    <NavDropdown.Divider />
                    <NavDropdown.Header>Editor</NavDropdown.Header>
                    <NavDropdown.Item as={NavLink} to="/players">
                      Edit People
                    </NavDropdown.Item>
                  </>
                )}
              </NavDropdown>
              <NavDropdown title="EVENTS" className="my-auto">
                <NavDropdown.Item as={NavLink} to="/season">
                  Season Schedule
                </NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/events">
                  Events
                </NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/tickets">
                  Tickets
                </NavDropdown.Item>
              </NavDropdown>
              <Nav.Link as={NavLink} to="/news" className="my-auto">
                NEWS
              </Nav.Link>
              <Nav.Link as={NavLink} to="/contact" className="my-auto">
                CONTACT
              </Nav.Link>
              <Nav.Link as={NavLink} to="/join" className="my-auto">
                JOIN
              </Nav.Link>
              <Nav.Link as={NavLink} to="/shop" className="my-auto">
                STORE
              </Nav.Link>
              <Nav.Link as={NavLink} to="/tickets" className="my-auto">
                TICKETS
              </Nav.Link>
              {editor && (
                <Nav.Link
                  href="/.auth/logout"
                  onClick={() => clearStorage()}
                  className="my-auto"
                >
                  Log out
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {state === "loading" ? (
        <Container fluid className="page-loader">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Container>
      ) : (
        <Outlet />
      )}
    </Container>
  );
};

export default Layout;
