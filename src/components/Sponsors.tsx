import { Col, Container, Row, Image } from "react-bootstrap"


const Sponsors = () => {
    return (
        <Container fluid className="content bg-dark text-light">
            <Row className="header-img px-lg-5 mx-0">
                <Row>
                    <Col className="my-auto">
                        <h1 className="xl-title my-5 text-shadow">Sponsors</h1>
                    </Col>
                </Row>
                <div className="text-center bg-white rounded text-black p-3">
                    <p>Thanks to all our sponsors, we can bring all the action to the fans all season!</p>
                    <p className="d-inline me-4">Want to become a sponsor?</p>
                    <a href="https://acrdphotos.blob.core.windows.net/photos/Sponsorship%20vertical.pdf" className="btn btn-primary vertical" download>Check out our sponsorship brochure</a>
                    <a href="https://acrdphotos.blob.core.windows.net/photos/Sponsorship.pdf" className="btn btn-primary horizontal" download>Check out our sponsorship brochure</a>
                </div>
            </Row>
            <Row className="justify-content-center px-5">
                <Col xs lg="4" className="text-center mt-5">
                    <a href="https://madnessgames.com/" target="_blank" rel="noreferrer" className="text-decoration-none">
                        <Image className="skater-image" alt="Madness Games & Comics" src="https://acrdphotos.blob.core.windows.net/photos/Madness%20Gray.jpg" />
                        <div className="mt-0 border bg-light rounded p-3">
                            <p className="fs-3 m-0"><span className="text-nowrap">Madness Games & Comics</span></p>
                            <p className="fs-3 m-0 text-dark">Jam Line Sponsor</p>
                            <p className="pt-4 text-dark">This wonderful sponsor is a +12 to all athletics checks. They're right down the road from where we skate and have all the games and accessories your nerdy little heart could desire.</p>
                        </div>
                    </a>
                </Col>
                <Col xs lg="4" className="text-center mt-5">
                    <a href="https://www.bulletgraphics.com/" target="_blank" rel="noreferrer" className="text-decoration-none">
                        <Image className="skater-image bg-light" alt="Bullet Graphics" src="https://acrdphotos.blob.core.windows.net/photos/BulletGraphicsLogo.png" />
                        <div className="mt-0 border bg-light rounded p-3">
                            <p className="fs-3 m-0"><span className="text-nowrap">Bullet Graphics</span></p>
                            <p className="fs-3 m-0 text-dark">Lead Jammer Sponsor</p>
                            <p className="pt-4 text-dark">Need something on paper? Give Bullet Graphics a shot. From business cards to banners, they hit the mark on all your print needs (and ours!)</p>
                        </div>
                    </a>
                </Col>
                <Col xs lg="4" className="text-center mt-5">
                    <a href="https://www.lionandcrownpub.com/" target="_blank" rel="noreferrer" className="text-decoration-none">
                        <Image className="skater-image" alt="Lion & Crown, Allen" src="https://acrdphotos.blob.core.windows.net/photos/the-lion-and-crown-pub-logo.png" />
                        <div className="mt-0 border bg-light rounded p-3">
                            <p className="fs-3 m-0"><span className="text-nowrap">Madness Games & Comics</span></p>
                            <p className="fs-3 m-0 text-dark">Afterparty Sponsor</p>
                            <p className="pt-4 text-dark">Want to hang out with the skaters? Meet us at the Allen location after the bout!</p>
                        </div>
                    </a>
                </Col>
                <Col xs lg="4" className="text-center mt-5">
                    <a href="https://aceofskatestx.com/" target="_blank" rel="noreferrer" className="text-decoration-none">
                        <Image className="skater-image bg-light" alt="Ace of Skates" src="https://acrdphotos.blob.core.windows.net/photos/Ace%20of%20Skates.png" />
                        <div className="mt-0 border bg-light rounded p-3">
                            <p className="fs-3 m-0"><span className="text-nowrap">Ace of Skates</span></p>
                            <p className="fs-3 m-0 text-dark">Beeramid Sponsor</p>
                            <p className="pt-4 text-dark">Ace of skates is where we get our gear. If you're thinking about skating, we recommend them!</p>
                        </div>
                    </a>
                </Col>
                <Col xs lg="4" className="text-center mt-5">
                    <a href="https://cryptidcornerstore.com/" target="_blank" rel="noreferrer" className="text-decoration-none">
                        <Image className="skater-image" alt="Cryptid Corner Store" src="https://acrdphotos.blob.core.windows.net/photos/cryptid.jpeg" />
                        <div className="mt-0 border bg-light rounded p-3">
                            <p className="fs-3 m-0"><span className="text-nowrap">Cryptid Corner Store</span></p>
                            <p className="fs-3 m-0 text-dark">First Whistle Sponsor</p>
                            <p className="pt-4 text-dark">Check this sponsor out at our games to get some really unique art and art jewelry!</p>
                        </div>
                    </a>
                </Col>
            </Row>
        </Container>
    )
}

export default Sponsors