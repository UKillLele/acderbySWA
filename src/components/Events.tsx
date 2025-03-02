import { Container, Row, Col, Image } from "react-bootstrap"
import { Link } from "react-router-dom"


const Events = () => {
    return (
        <Container fluid className="content bg-dark text-light">
            <Row className="m-5 align-items-center">
                <Col className="my-auto">
                    <h1 className="xl-title my-5 text-shadow">Events</h1>
                </Col>
            </Row>
            <Row className="m-5">
                <Col>
                    <p>Looking for bout information? Check out our <Link to="/season">season info</Link></p>
                    <p>We do more than just derby! Catch us around town! Upcoming non-derby events will be updated on &nbsp;
                        <a href="https://www.facebook.com/AssassinationCityRollerDerby/" target="_blank" rel="noreferrer">
                            Facebook
                        </a>
                    </p>
                    <p>Want us to come to your event? We'd love to! <a href="mailto:marketing@acderby.com?subject=Event" target="_blank" rel="noreferrer">Let us know</a></p>
                </Col>
            </Row>
        </Container>
    )
}

export default Events