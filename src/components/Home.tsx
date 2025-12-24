import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { Tooltip } from "react-bootstrap";

const Home = () => {
  return (
    <Container
      fluid
      className="content bg-img"
      style={{
        backgroundImage:
          'url("https://acrdphotos.blob.core.windows.net/photos/Season-Background.png")',
      }}
    >
      <Container
        fluid
        className="page-loader px-5 flex-column justify-content-between"
      >
        <Row className="w-100">
          <Col>
            <p className="xl-title fw-bold text-shadow">
              ASSASSINATION
              <br />
              CITY ROLLER
              <br />
              DERBY
            </p>
          </Col>
        </Row>
        <Row className="w-100">
          <Col>
            <Row>
              <Col>
                <h2 className="fs-1 text-shadow fst-italic accent">
                  2026 Season Dates are Here!
                </h2>
              </Col>
            </Row>
            <Row>
              <Col>
                <Link
                  className="btn btn-light btn-lg shadow disabled"
                  to="tickets"
                >
                  Get Tickets Soon
                </Link>
              </Col>
            </Row>
          </Col>
        </Row>
        <Container className="text-shadow mx-5 text-center">
          <Row className="fs-3 fw-bold justify-content-center">
            <Col className="p-0 mx-1" xs={4} sm={1}>
              <OverlayTrigger
                placement="bottom"
                delay={{ show: 250, hide: 400 }}
                overlay={
                  <Tooltip>
                    <br />
                  </Tooltip>
                }
              >
                <p>FEB 21</p>
              </OverlayTrigger>
            </Col>
            <Col className="p-0" xs="auto">
              <p>|</p>
            </Col>
            <Col className="p-0 mx-1" xs={4} sm={1}>
              <OverlayTrigger
                placement="bottom"
                delay={{ show: 250, hide: 400 }}
                overlay={
                  <Tooltip>
                    <br />
                  </Tooltip>
                }
              >
                <p>MAR 28</p>
              </OverlayTrigger>
            </Col>
            <Col className="p-0" xs="auto">
              <p>|</p>
            </Col>
            <Col className="p-0 mx-1" xs={4} sm={1}>
              <OverlayTrigger
                placement="bottom"
                delay={{ show: 250, hide: 400 }}
                overlay={
                  <Tooltip>
                    <br />
                  </Tooltip>
                }
              >
                <p>APR 25</p>
              </OverlayTrigger>
            </Col>
            <Col className="p-0 d-none d-sm-block" sm="auto">
              <p>|</p>
            </Col>
            <Col className="p-0 mx-1" xs={4} sm={1}>
              <OverlayTrigger
                placement="bottom"
                delay={{ show: 250, hide: 400 }}
                overlay={
                  <Tooltip>
                    <br />
                  </Tooltip>
                }
              >
                <p>MAY 16</p>
              </OverlayTrigger>
            </Col>
            <Col className="p-0" xs="auto">
              <p>|</p>
            </Col>
            <Col className="p-0 mx-1" xs={4} sm={1}>
              <OverlayTrigger
                placement="bottom"
                delay={{ show: 250, hide: 400 }}
                overlay={
                  <Tooltip>
                    <br />
                  </Tooltip>
                }
              >
                <p>JUN 20</p>
              </OverlayTrigger>
            </Col>
          </Row>
          <Row className="fs-3 fw-bold justify-content-center">
            <Col className="p-0 mx-1" xs={4} sm={1}>
              <OverlayTrigger
                placement="bottom"
                delay={{ show: 250, hide: 400 }}
                overlay={
                  <Tooltip>
                    <br />
                  </Tooltip>
                }
              >
                <p>JUL 25</p>
              </OverlayTrigger>
            </Col>
            <Col className="p-0 d-none d-sm-block" sm="auto">
              <p>|</p>
            </Col>
            <Col className="p-0 mx-1" xs={4} sm={1}>
              <OverlayTrigger
                placement="bottom"
                delay={{ show: 250, hide: 400 }}
                overlay={
                  <Tooltip>
                    <br />
                  </Tooltip>
                }
              >
                <p>AUG 29</p>
              </OverlayTrigger>
            </Col>
            <Col className="p-0" xs="auto">
              <p>|</p>
            </Col>
            <Col className="p-0 mx-1" xs={4} sm={1}>
              <OverlayTrigger
                placement="bottom"
                delay={{ show: 250, hide: 400 }}
                overlay={
                  <Tooltip>
                    <br />
                  </Tooltip>
                }
              >
                <p>SEP 26</p>
              </OverlayTrigger>
            </Col>
            <Col className="p-0 d-none d-sm-block" sm="auto">
              <p>|</p>
            </Col>
            <Col className="p-0 mx-1" xs={4} sm={1}>
              <OverlayTrigger
                placement="bottom"
                delay={{ show: 250, hide: 400 }}
                overlay={
                  <Tooltip>
                    <br />
                  </Tooltip>
                }
              >
                <p>OCT 24</p>
              </OverlayTrigger>
            </Col>
          </Row>
          <Row>
            <Col className="text-center text-shadow">
              <p className="m-0">7pm @ Thunderbird Roller Rink</p>
              <p>3200 Thunderbird Ln, Plano, TX 75075</p>
            </Col>
          </Row>
        </Container>
      </Container>
    </Container>
  );
};

export default Home;
