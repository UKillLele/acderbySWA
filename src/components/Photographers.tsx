import { Col, Container, Row, Image } from "react-bootstrap"


const Photographers = () => {
    return (
        <Container fluid className="content bg-dark text-light">
            <Row className="header-img px-lg-5 mx-0">
                <Row>
                    <Col className="my-auto">
                        <h1 className="xl-title my-5 text-shadow">Photographers</h1>
                    </Col>
                </Row>
                <p className="text-center bg-white rounded text-black p-3">These lovely humans make us look good. Check out their pictures!</p>
            </Row>
            <Row className="justify-content-center px-5">
                <Col xs lg="4" className="text-center mt-5">
                    <a href="https://www.facebook.com/supernikonman/photos_by" target="_blank" rel="noreferrer">
                        <Image className="skater-image" alt="Mark Alonzo Photos" src="https://acrdphotos.blob.core.windows.net/photos/photog.jpg" />
                        <div className="mt-0 border bg-light rounded">
                            <p className="fs-3 m-0"><span className="text-nowrap">Mark Alonzo</span></p>
                        </div>
                    </a>
                </Col>
                <Col xs lg="4" className="text-center mt-5">
                    <a href="https://www.facebook.com/profile.php?id=100063629975353&sk=photos_by" target="_blank" rel="noreferrer">
                        <Image className="skater-image" alt="Revelations Photography" src="https://acrdphotos.blob.core.windows.net/photos/quentin.jpg" />
                        <div className="mt-0 border bg-light rounded">
                            <p className="fs-3 m-0"><span className="text-nowrap">Quentin Campbell</span></p>
                        </div>
                    </a>
                </Col>
                <Col xs lg="4" className="text-center mt-5">
                    <a href="https://www.facebook.com/calesherry/photos_albums" target="_blank" rel="noreferrer">
                        <Image className="skater-image" alt="Cale Sherry Photography" src="https://acrdphotos.blob.core.windows.net/photos/photog-cale.jpg" />
                        <div className="mt-0 border bg-light rounded">
                            <p className="fs-3 m-0"><span className="text-nowrap">Cale Sherry</span></p>
                        </div>
                    </a>
                </Col>
            </Row>
        </Container>
    )
}

export default Photographers