import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { Tooltip } from "react-bootstrap";


const Home = () => {
    return (
        <Container fluid className="content bg-img" style={{ backgroundImage: 'url("https://acrdphotos.blob.core.windows.net/photos/Season-Background.png")' }}>
            <Container fluid className="page-loader fw-bold">
                <Row className="align-items-center">
                    <Col>
                        <Row>
                            <Col>
                                <h2 className="xl-title mb-5 text-shadow">2024 Champs tickets on sale now!</h2>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="auto" className="mx-auto">
                                <Link className="btn btn-primary btn-lg shadow" to="tickets">Buy</Link>
                            </Col>
                        </Row>
                    </Col>
                    <Col>
                        <Row>
                            <Col>
                                <p className="xl-title text-shadow text-center">2024 Season</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="pe-5">
                                <OverlayTrigger
                                    placement="right"
                                    delay={{ show: 250, hide:400}}
                                    overlay={<Tooltip>LSA vs La Rev <br/> DK vs Bombshells</Tooltip>}
                                >
                                    <p className="fs-1 text-shadow text-end">Feb 17</p>
                                </OverlayTrigger>
                            </Col>
                            <Col className="ps-5">
                                <OverlayTrigger
                                    placement="left"
                                    delay={{ show: 250, hide:400}}
                                    overlay={<Tooltip>LSA vs DK <br/> La Rev vs Bombshells</Tooltip>}
                                >
                                <p className="fs-1 text-shadow">Mar 16</p>
                                </OverlayTrigger>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="pe-5">
                                <OverlayTrigger
                                    placement="right"
                                    delay={{ show: 250, hide:400}}
                                    overlay={<Tooltip>LSA vs Bombshells <br/> La Rev vs DK</Tooltip>}
                                >
                                <p className="fs-1 text-shadow text-end">Apr 20</p>
                                </OverlayTrigger>
                            </Col>
                            <Col className="ps-5">
                                <OverlayTrigger
                                    placement="left"
                                    delay={{ show: 250, hide:400}}
                                    overlay={<Tooltip>Bombshells vs DK <br/> La Rev vs LSA</Tooltip>}
                                >
                                <p className="fs-1 text-shadow">May 18</p>
                                </OverlayTrigger>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="pe-5">
                                <OverlayTrigger
                                    placement="right"
                                    delay={{ show: 250, hide:400}}
                                    overlay={<Tooltip>Bombshells vs La Rev <br/> DK vs LSA</Tooltip>}
                                >
                                <p className="fs-1 text-shadow text-end">Jun 15</p>
                                </OverlayTrigger>
                            </Col>
                            <Col className="ps-5">
                                <OverlayTrigger
                                    placement="left"
                                    delay={{ show: 250, hide:400}}
                                    overlay={<Tooltip>DK vs La Rev <br/> Bombshells vs LSA</Tooltip>}
                                >
                                <p className="fs-1 text-shadow">Jul 20</p>
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
                                <p className="fs-1 text-shadow text-end">Aug 17</p>
                                </OverlayTrigger>
                            </Col>
                            <Col className="ps-5">
                                <OverlayTrigger
                                    placement="left"
                                    delay={{ show: 250, hide:400}}
                                    overlay={<Tooltip>Co-Conspiracy <br/> Mashup</Tooltip>}
                                >
                                <p className="fs-1 text-shadow">Oct 12</p>
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
                </Row>
            </Container>
        </Container>
    );
}

export default Home;