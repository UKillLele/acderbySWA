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
                    <p>We do more than just derby! Catch us around town! Upcoming non-derby events will be updated here. Need info on trivia or what parades we're skating? That's here!</p>
                    <p>Want us to come to your event? We'd love to! <a href="mailto:marketing@acderby.com?subject=Event" target="_blank" rel="noreferrer">Let us know</a></p>
                </Col>
            </Row>
            <Row className="m-5">
                <h2 className="fs-1">February</h2>
            </Row>
            <Row className="m-5">
                <Col className="justify-content-center">
                    <a href="https://fb.me/e/49hBRFrEI" target="_blank" rel="noreferrer" className="text-decoration-none text-light text-center">
                        <Image height={300} src="https://acrdphotos.blob.core.windows.net/photos/trivia.png" alt="trivia"></Image>
                    </a>
                </Col>
                <Col className="justify-content-center">
                    <a href="https://fb.me/e/3CCWbIY2M" target="_blank" rel="noreferrer" className="text-decoration-none text-light text-center">
                        <Image height={300} src="https://acrdphotos.blob.core.windows.net/photos/Feb_2024_FB_event.jpg" alt="season opener"></Image>
                    </a>
                </Col>
            </Row>
        </Container>
    )
}

export default Events