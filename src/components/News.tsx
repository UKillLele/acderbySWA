import { Col, Container, Row, Image } from "react-bootstrap"


const News = () => {
    return (
        <Container fluid className="content bg-dark text-light">
            <Row className="m-5 align-items-center">
                <Col className="my-auto">
                    <h1 className="xl-title my-5 text-shadow">News</h1>
                </Col>
            </Row>
            <Row className="m-5">
                <Col className="justify-content-center">
                    <a href="https://planomagazine.com/assassination-derby-thunderbird/" target="_blank" rel="noreferrer" className="text-decoration-none text-light">
                        <Image height={300} className="mx-auto" src="https://planomagazine.com/wp-content/uploads/2022/06/283769778_5137602346286646_8812393369672361217_n.jpg" alt="Plano Magazine"></Image>
                        <h2 className="fs-3">Assassination City Roller Derby opens new season at Thunderbird Roller Rink</h2>
                        <p className="fst-italic">by Alyssa High</p>
                        <p>Plano Magazine</p>
                    </a>
                </Col>
            </Row>
        </Container>
    )
}

export default News