import { Outlet, NavLink, useNavigation } from "react-router-dom";
import { Nav, Navbar, Container, NavDropdown, Spinner } from "react-bootstrap";
import { isEditor, clearStorage } from "./ProtectedRoute";
import { useEffect, useState } from "react";
import { Team } from "../models/Team";

const Layout = () => {
  const { state } = useNavigation();
  const [teams, setTeams] = useState<Team[][]>();

  useEffect(() => {
    const getTeams = async () => {
      await fetch(`/api/teams`)
        .then((resp) => resp.json())
        .then((teams: Team[]) => {
          const groupedTeams = teams
            .sort((a, b) => (a.name > b.name ? 1 : -1))
            .reduce((r, a) => {
              r[a.type] = r[a.type] || [];
              r[a.type].push(a);
              return r;
            }, {});
          var resultArray: Team[][] = Object.keys(groupedTeams).map(function (
            team
          ) {
            return groupedTeams[team];
          });
          setTeams(resultArray);
        });
    };

    getTeams();
  }, []);

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
                {teams &&
                  teams.map(
                    (group: Team[]) =>
                      group[0].type != "Misc" && (
                        <Container key={group[0].type}>
                          <NavDropdown.Header>
                            {group[0].type} Teams
                          </NavDropdown.Header>
                          {group.map((team: Team) => (
                            <NavDropdown.Item
                              as={NavLink}
                              to={"teams/" + team.slug}
                              key={team.name}
                            >
                              {team.name}
                            </NavDropdown.Item>
                          ))}
                          {teams.indexOf(group) != teams.length - 1 && (
                            <NavDropdown.Divider />
                          )}
                        </Container>
                      )
                  )}
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
