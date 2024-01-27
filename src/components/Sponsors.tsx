import { Col, Container, Row } from "react-bootstrap"


const Sponsors = () => {
    return (
        <Container fluid className="content bg-dark text-light">
            <Row className="m-5 border-bottom">
                <Col className="my-auto">
                    <h1 className="xl-title my-5 text-shadow">Sponsors</h1>
                    <p>Thanks to all our sponsors, we can bring all the action to the fans all season!</p>
                </Col>
            </Row>
            <Row className="text-center mb-5 pb-3 border-bottom">
                <Col>
                    <p className="fs-1">Jam Line</p>
                    <a href="https://madnessgames.com/" target="_blank" rel="noreferrer">
                        <img src="https://acrdphotos.blob.core.windows.net/photos/Madness%20Gray.jpg" alt="Madness Games & Comics" height={300}/>
                    </a>
                    <p className="pt-4">This wonderful sponsor is a +12 to all athletics checks. They're right down the road from where we skate and have all the games and accessories your nerdy little heart could desire.</p>
                </Col>
            </Row>
            <Row className="text-center mb-5 pb-3 border-bottom">
                <Col>
                    <p className="fs-2">Afterparty</p>
                    <a href="https://www.lionandcrownpub.com/" target="_blank" rel="noreferrer">
                        <img src="https://acrdphotos.blob.core.windows.net/photos/the-lion-and-crown-pub-logo.png" alt="Lion & Crown, Allen" height={250}/>
                    </a>
                <p className="pt-4">Want to hang out with the skaters? Meet us at the Allen location after the bout!</p>
                </Col>
            </Row>
            <Row className="text-center mb-5">
                <Col>
                    <p className="fs-3">Beeramid</p>
                    <a href="https://aceofskatestx.com/" target="_blank" rel="noreferrer">
                        <img src="https://acrdphotos.blob.core.windows.net/photos/Ace%20of%20Skates.png" alt="Ace of Skates" height={200} className="bg-light" />
                    </a>
                    <p className="pt-4">Ace of skates is where we get our gear. If you're thinking about skating, we recommend them!</p>
                </Col>
                <Col>
                    <p className="fs-3">First Whistle</p>
                    <a href="https://cryptidcornerstore.com/" target="_blank" rel="noreferrer">
                        <img src="https://acrdphotos.blob.core.windows.net/photos/cryptid.jpeg" alt="Cryptid Corner Store" height={200}/>
                    </a>
                    <p className="pt-4">Check this sponsor out at our games to get some really unique art and art jewelry!</p>
                </Col>
            </Row>
        </Container>
    )
}

export default Sponsors