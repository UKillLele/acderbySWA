import { Container, Row, Col, Card, Accordion, ListGroup, Spinner, Image } from "react-bootstrap";
import { Bout } from "../models/Bout";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Team } from "../models/Team";
import { Person } from "../models/Person";

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function getDate(date: Date) {
    const d = new Date(date);
    const month = months[d.getMonth()];
    return `${month} ${d.getDate()}`;
}

function checkTix(dates, index) {
    const current = dates[index][0].date;
    const previous = dates[index - 1];
    if (new Date(current) > new Date(Date.now()) && (!previous || new Date(previous[0].date) < new Date(Date.now()))) return true;
    return false;
}

const SeasonSchedule = () => {
    const [bouts, setBouts] = useState<Bout[][]>();
    const [teams, setTeams] = useState<Team[]>();
    const [players, setPlayers] = useState<Person[]>();

    useEffect(() => {
        fetch(`/api/players`).then(resp => resp.json()).then(players => {
            setPlayers(players);
        })
        fetch(`/api/bouts`).then(resp => resp.json()).then((b: Bout[]) => {
            const groupedBouts = b.reduce((r, a) => {
                const date: Date = new Date(a.date);
                const ymd = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
                r[ymd] = r[ymd] || [];
                r[ymd].push(a);
                return r;
            }, {});
            var resultArray: Bout[][] = Object.keys(groupedBouts).map(function(bout){
                return groupedBouts[bout];
            });
            setBouts(resultArray);
        });
        fetch(`/api/teams`).then(resp => resp.json()).then((teams: Team[]) => {
            setTeams(teams);
        });
    }, []);

    function getTeam(id: string) {
        return teams?.find(x => x.id === id);
    }

    function getSkaterImage(skaterId: string) {
        const player = players?.find(x =>  x.id === skaterId);
        return encodeURI(player?.imageUrl ?? "");
    }

    return (
        <Container fluid className="content bg-dark text-light">
            <Row className="m-5 align-items-center">
                <Col className="my-auto">
                    <h1 className="xl-title my-5 text-shadow">2024 Season</h1>
                </Col>
                <Col xs="auto">
                    <Link className="btn btn-primary ms-auto" to="/tickets">Get Season Passes</Link>
                </Col>
            </Row>
            <Row className="mx-5">
                <Col>
                    <Accordion data-bs-theme="light" defaultActiveKey="0">
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Bout Day Info</Accordion.Header>
                            <Accordion.Body>
                                <ListGroup>
                                    <ListGroup.Item>
                                        <p className="fw-bold">WHERE</p>
                                        <p className="m-0">Thunderbird Roller Rink</p>
                                        <p className="m-0">3200 Thunderbird Ln</p>
                                        <p className="m-0">Plano, TX 75075</p>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <p className="fw-bold">WHEN</p>
                                        <p className="m-0">Doors open at 6:30pm</p>
                                        <p className="m-0">First whistle at 7pm</p>
                                        <p className="m-0">Second bout around 8:30pm</p>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <p className="fw-bold">SEATING - BYOChair</p>
                                        <p className="m-0">We ask that all chairs are set up behind the second line of caution tape. If you want to get really close to the action, the area between the two caution tapes is floor seating only. Be aware that the floor area is called "Crash-Zone Seating" for a reason. We like to skate fast, hit hard and sometimes you might unexpectedly end up with a roller girl in your lap sitting in this area.</p>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <p className="fw-bold">REFRESHMENTS</p>
                                        <p className="m-0">All bouts are BYOB - no glass, please. IDs will be checked at the door.</p>
                                        <p className="m-0">Non-Alcoholic drinks & snacks are available at the concession stand.</p>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <p className="fw-bold">KIDS</p>
                                        <p className="m-0">We love having kids at the bouts! Many of our skaters are moms themselves! Children 10 & under are free EXCEPT for special events.</p>
                                        <p className="m-0"><u>Please Note</u> - Roller Derby is a full contact sport & our rink is small. Please help keep your children safe by sitting in the second row of chairs behind the caution tape. No one under the age of 18 is allowed to sit on the floor. We like to skate fast, hit hard & sometimes we end up in the crowd accidentally.</p>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <p className="fw-bold">MEET THE SKATERS</p>
                                        <p className="m-0">We love our fans!! Cheer loud & often! Bring posters, shirts, stickers, pictures! We are happy to take pictures with you & sign autographs!</p>
                                        <p className="m-0">Feel free to ask questions! We love to talk derby! We'll also give you a quick demo jam before the first game. You can also check out our <Link to="/derby">Derby 101</Link> info.</p>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Col>
            </Row>
            {bouts ? bouts.map((date: Bout[], index: number) =>
                <Row className="m-5" key={date[0].date.toString()}>
                    <Col>
                        <Card data-bs-theme="light">
                            <Card.Body>
                                <Card.Title>
                                    <Row className="align-items-center">
                                        {date[0].imageUrl  && 
                                            <Col lg="auto" className="text-center py-2">
                                                <a href={date[0].imageUrl} target="_blank" rel="noreferrer" className="btn btn-primary ms-auto">Program</a>
                                            </Col>
                                        }
                                        <Col xs="12" lg className="text-lg-end fs-1 fw-bold mx-lg-3">
                                            {date[0].name}
                                        </Col>
                                        <Col xs="12" lg className="text-lg-start fs-1 fw-bold mx-lg-3">
                                            {getDate(date[0].date)}
                                        </Col>
                                        <Col lg="auto" className="text-center py-2">
                                            {checkTix(bouts, index) && <Link className="btn btn-primary ms-auto" to="/tickets">Get Tickets</Link>}
                                        </Col>
                                    </Row> 
                                </Card.Title>
                                {date.sort((a, b) => a.date > b.date ? 1 : -1).map((bout, i) => {
                                    const homeTeam = getTeam(bout.homeTeam);
                                    const awayTeam = getTeam(bout.awayTeam);
                                    return (
                                        <Row key={bout.date.toString()} className="align-items-center mb-2 text-light fw-bold text-shadow pb-2 text-center" style={{ borderBottom: i + 1 !== date.length ? '1px solid black' : '' }}>
                                            <Col className="p-0 bout-bg" style={{ backgroundImage: homeTeam && `url(${homeTeam.imageUrl})` }}>
                                                <Row style={{ backgroundColor: homeTeam && homeTeam.color }} className="m-0 h-100 d-flex flex-column justify-content-center fs-1">
                                                    {/* center text */}
                                                    {!bout.homeTeamMVPJammer && <Col></Col>}
                                                    <Col>
                                                        <div>{homeTeam ? homeTeam.name : bout.name === "Champs" ? i === 0 ? 'Team 3' : 'Team 1' : 'TBA'}</div>
                                                        {bout.homeTeamScore && <div className="lg-only-block">{bout.homeTeamScore}</div>}
                                                    </Col>
                                                    <Col className="w-100 lg-only justify-content-evenly">
                                                        {bout.homeTeamMVPJammer && 
                                                            <div style={{backgroundImage: `url(${getSkaterImage(bout.homeTeamMVPJammer)})`,
                                                                backgroundPosition: 'center',
                                                                backgroundSize: 'cover',
                                                                backgroundRepeat: 'no-repeat',
                                                                width: '20%'}}
                                                                className="d-flex flex-column justify-content-end"
                                                            >
                                                                <div className="lh-1 fs-3">MVJ</div>
                                                            </div>
                                                        }
                                                        {bout.homeTeamMVPBlocker && 
                                                            <div style={{backgroundImage: `url(${getSkaterImage(bout.homeTeamMVPBlocker)})`,
                                                                backgroundPosition: 'center',
                                                                backgroundSize: 'cover',
                                                                backgroundRepeat: 'no-repeat',
                                                                width: '20%'}}
                                                                className="d-flex flex-column justify-content-end"
                                                            >
                                                                <div className="lh-1 fs-3">MVB</div>
                                                            </div>
                                                        }
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col lg="auto" className="fw-bold xl-title text-light text-shadow vs">VS</Col>
                                            <Col className="p-0 bout-bg" style={{ backgroundImage: awayTeam && `url(${awayTeam.imageUrl})` }}>
                                                <Row style={{ backgroundColor: awayTeam && awayTeam.color }} className="m-0 h-100 d-flex flex-column justify-content-center fs-1">
                                                    {/* center text */}
                                                    {!bout.awayTeamMVPJammer && <Col></Col>}
                                                    <Col>
                                                        <div>{awayTeam ? awayTeam.name : bout.name === "Champs" ? i === 0 ? 'Team 4' : 'Team 2' : 'TBA'}</div>
                                                        {bout.awayTeamScore && <div className="lg-only-block">{bout.awayTeamScore}</div>}
                                                    </Col>
                                                    <Col className="w-100 lg-only justify-content-evenly">
                                                        {bout.awayTeamMVPJammer && 
                                                            <div style={{backgroundImage: `url(${getSkaterImage(bout.awayTeamMVPJammer)})`,
                                                                backgroundPosition: 'center',
                                                                backgroundSize: 'cover',
                                                                backgroundRepeat: 'no-repeat',
                                                                width: '20%'}}
                                                                className="d-flex flex-column justify-content-end"
                                                            >
                                                                <div className="lh-1 fs-3">MVJ</div>
                                                            </div>
                                                        }
                                                        {bout.awayTeamMVPBlocker && 
                                                            <div style={{backgroundImage: `url(${getSkaterImage(bout.awayTeamMVPBlocker)})`,
                                                                backgroundPosition: 'center',
                                                                backgroundSize: 'cover',
                                                                backgroundRepeat: 'no-repeat',
                                                                width: '20%'}}
                                                                className="d-flex flex-column justify-content-end"
                                                            >
                                                                <div className="lh-1 fs-3">MVB</div>
                                                            </div>
                                                        }
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    )}
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            ) : 
                <Container fluid className="page-loader">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </Container>
            }
        </Container>
    )
}

export default SeasonSchedule