import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { Tooltip } from "react-bootstrap";


const Home = () => {
    return (
        <Container fluid className="content bg-img" style={{ backgroundImage: 'url("https://acrdphotos.blob.core.windows.net/photos/Season-Background.png")' }}>
            <Container fluid className="page-loader fw-bold">
                <Row className="align-items-center">
                    <Col xs={12} lg={6}>
                        <Row>
                            <Col>
                                <p className="xl-title text-shadow text-center">2025 Season</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="pe-5">
                                <OverlayTrigger
                                    placement="right"
                                    delay={{ show: 250, hide:400}}
                                    overlay={<Tooltip>the DKs vs Bombshells <br/> LSA vs La Rev</Tooltip>}
                                >
                                    <p className="fs-1 text-shadow text-end">Feb 22</p>
                                </OverlayTrigger>
                            </Col>
                            <Col className="ps-5">
                                <OverlayTrigger
                                    placement="left"
                                    delay={{ show: 250, hide:400}}
                                    overlay={<Tooltip>the DKs vs LSA <br/> Bombshells vs La Rev</Tooltip>}
                                >
                                <p className="fs-1 text-shadow">Mar 15</p>
                                </OverlayTrigger>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="pe-5">
                                <OverlayTrigger
                                    placement="right"
                                    delay={{ show: 250, hide:400}}
                                    overlay={<Tooltip>the DKs vs La Rev <br/> Bombshells vs LSA</Tooltip>}
                                >
                                <p className="fs-1 text-shadow text-end">Apr 26</p>
                                </OverlayTrigger>
                            </Col>
                            <Col className="ps-5">
                                <OverlayTrigger
                                    placement="left"
                                    delay={{ show: 250, hide:400}}
                                    overlay={<Tooltip>La Rev vs LSA <br/> Bombshells vs the DKs</Tooltip>}
                                >
                                <p className="fs-1 text-shadow">May 17</p>
                                </OverlayTrigger>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="pe-5">
                                <OverlayTrigger
                                    placement="right"
                                    delay={{ show: 250, hide:400}}
                                    overlay={<Tooltip>La Rev vs Bombshells <br/> LSA vs the DKs</Tooltip>}
                                >
                                <p className="fs-1 text-shadow text-end">Jun 21</p>
                                </OverlayTrigger>
                            </Col>
                            <Col className="ps-5">
                                <OverlayTrigger
                                    placement="left"
                                    delay={{ show: 250, hide:400}}
                                    overlay={<Tooltip>LSA vs Bombshells <br/> La Rev vs the DKs</Tooltip>}
                                >
                                <p className="fs-1 text-shadow">Jul 19</p>
                                </OverlayTrigger>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="pe-5">
                                <OverlayTrigger
                                    placement="right"
                                    delay={{ show: 250, hide:400}}
                                    overlay={<Tooltip>3rd vs 4th <br/> 1st vs 2nd</Tooltip>}
                                >
                                <p className="fs-1 text-shadow text-end">Sep 20</p>
                                </OverlayTrigger>
                            </Col>
                            <Col className="ps-5">
                                <OverlayTrigger
                                    placement="left"
                                    delay={{ show: 250, hide:400}}
                                    overlay={<Tooltip>Mashup</Tooltip>}
                                >
                                <p className="fs-1 text-shadow">Oct 18</p>
                                </OverlayTrigger>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="text-center text-shadow">
                                <p className="m-0">7pm @ Thunderbird Roller Rink</p>
                                <p>3200 Thunderbird Ln, Plano, TX 75075</p>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={12} lg={6}>
                        <Row>
                            <Col>
                                <h2 className="xl-title mb-5 text-shadow">2025 Season Passes on sale now!</h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="auto" className="mx-auto">
                                <Link className="btn btn-primary btn-lg shadow" to="tickets">Buy</Link>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </Container>
    );
}

export default Home;