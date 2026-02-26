import { Col, Container, Row, Image } from "react-bootstrap";

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
          <p>
            Thanks to all our sponsors, we can bring all the action to the fans
            all season!
          </p>
          <p className="d-inline me-4">Want to become a sponsor?</p>
          <a
            href="https://acrdphotos.blob.core.windows.net/photos/2026%20Full%20Sponsor%20Packet.pdf"
            className="btn btn-primary"
            download
          >
            Check out our sponsorship brochure
          </a>
        </div>
      </Row>
      <Row className="justify-content-center px-5">
        <Col xs lg="4" className="text-center mt-5">
          <a
            href="https://madnessgames.com/"
            target="_blank"
            rel="noreferrer"
            className="text-decoration-none"
          >
            <Image
              className="skater-image"
              alt="Madness Games & Comics"
              src="https://acrdphotos.blob.core.windows.net/photos/Madness%20Gray.jpg"
            />
            <div className="mt-0 border bg-light rounded p-3">
              <p className="fs-3 m-0">
                <span className="text-nowrap">Madness Games & Comics</span>
              </p>
              <p className="fs-3 m-0 text-dark">VIP Sponsor</p>
              <p className="pt-4 text-dark">
                This wonderful sponsor is a +12 to all athletics checks. They're
                right down the road from where we skate and have all the games
                and accessories your nerdy little heart could desire.
              </p>
            </div>
          </a>
        </Col>
        <Col xs lg="4" className="text-center mt-5">
          <a
            href="https://urcomped.com/"
            target="_blank"
            rel="noreferrer"
            className="text-decoration-none"
          >
            <Image
              className="skater-image bg-white"
              alt="URComped"
              src="https://acrdphotos.blob.core.windows.net/photos/URComped_Logo.png"
            />
            <div className="mt-0 border bg-light rounded p-3">
              <p className="fs-3 m-0">
                <span className="text-nowrap">URComped</span>
              </p>
              <p className="fs-3 m-0 text-dark">Marketing Whiz Sponsor</p>
              <p className="pt-4 text-dark">
                Don't gamble on casino perks; trust URComped to get you the best
                casino and cruise offers!
              </p>
            </div>
          </a>
        </Col>
        <Col xs lg="4" className="text-center mt-5">
          <a
            href="https://cryptidcornerstore.com/"
            target="_blank"
            rel="noreferrer"
            className="text-decoration-none"
          >
            <Image
              className="skater-image"
              alt="Cryptid Corner Store"
              src="https://acrdphotos.blob.core.windows.net/photos/cryptid.jpeg"
            />
            <div className="mt-0 border bg-light rounded p-3">
              <p className="fs-3 m-0">
                <span className="text-nowrap">Cryptid Corner Store</span>
              </p>
              <p className="fs-3 m-0 text-dark">Promote Sponsor</p>
              <p className="pt-4 text-dark">
                Check this sponsor out at our games to get some really unique
                art and art jewelry!
              </p>
            </div>
          </a>
        </Col>
        <Col xs lg="4" className="text-center mt-5">
          <a
            href="https://www.assembly-icehouse.com/"
            target="_blank"
            rel="noreferrer"
            className="text-decoration-none"
          >
            <Image
              className="skater-image h-100 bg-white"
              alt="Assembly Ice House"
              src="https://acrdphotos.blob.core.windows.net/photos/Assembly_Ice_House.png"
            />
            <div className="mt-0 border bg-light rounded p-3">
              <p className="fs-3 m-0">
                <span className="text-nowrap">Assembly Ice House</span>
              </p>
              <p className="fs-3 m-0 text-dark">Afterparty Sponsor</p>
              <p className="pt-4 text-dark">
                Want to hang out with the skaters? Meet us here after the bout!
              </p>
            </div>
          </a>
        </Col>
        <Col xs lg="4" className="text-center mt-5">
          <a
            href="https://www.elevationsportsmed.com/"
            target="_blank"
            rel="noreferrer"
            className="text-decoration-none"
          >
            <Image
              className="skater-image bg-light"
              alt="Elevation Spine and Sports Medecine"
              src="https://acrdphotos.blob.core.windows.net/photos/Elevation%20Spine%20and%20Sports%20Medicine%20Logo.jpg"
            />
            <div className="mt-0 border bg-light rounded p-3">
              <p className="fs-3 m-0">
                <span className="text-nowrap">
                  Elevation Spine and Sports Medecine
                </span>
              </p>
              <p className="fs-3 m-0 text-dark">Promote Sponsor</p>
              <p className="pt-4 text-dark">
                Elevation Spine and Sports Medicine has our back! Stop by their
                table to let them get yours at our next bout!
              </p>
            </div>
          </a>
        </Col>
        <Col xs lg="4" className="text-center mt-5">
          <a
            href="https://www.precisionrepro.net/"
            target="_blank"
            rel="noreferrer"
            className="text-decoration-none"
          >
            <Image
              className="skater-image bg-light h-100"
              alt="Precision Reprographics"
              src="https://acrdphotos.blob.core.windows.net/photos/Precision%20Reprographics.png"
            />
            <div className="mt-0 border bg-light rounded p-3">
              <p className="fs-3 m-0">
                <span className="text-nowrap">Precision Reprographics</span>
              </p>
              <p className="fs-3 m-0 text-dark">Print Sponsor</p>
              <p className="pt-4 text-dark">
                Wonder who makes us look so good on our posters and programs?
                These folks!
              </p>
            </div>
          </a>
        </Col>
      </Row>
    </Container>
  );
};

export default Sponsors;
