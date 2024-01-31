import { useLoaderData } from 'react-router-dom'
import { Team } from '../models/Team'
import { Container, Row, Col, Image } from 'react-bootstrap'
import { Person } from '../models/Person'
import { PositionType } from '../models/Position'
import { useEffect, useState } from 'react'

const Teams = () => {
    const team = useLoaderData() as Team;
    const [captain, setCaptain] = useState<Person>();
    const [coCaptain, setCoCaptain] = useState<Person>();
    const [headCoach, setHeadCoach] = useState<Person>();
    const [benchCoach, setBenchCoach] = useState<Person>();
    const [members, setMembers] = useState<Person[]>();

    useEffect(() => {
        fetch(`/api/players/${team.id}`).then(resp => resp.json()).then((players: Person[]) => {
            setCaptain(players.find(x => x.teams.some(y => y.id == team.id && y.positionType == PositionType.captain)));
            setCoCaptain(players.find(x => x.teams.some(y => y.id == team.id && y.positionType == PositionType.coCaptain)));
            setHeadCoach(players.find(x => x.teams.some(y => y.id == team.id && y.positionType == PositionType.headCoach)));
            setBenchCoach(players.find(x => x.teams.some(y => y.id == team.id && y.positionType == PositionType.benchCoach)));
            setMembers(players
                .filter(x => x.teams.some(y => y.id == team.id && y.positionType == PositionType.member))
                .sort((a,b) => {
                    var first = a.number ? a.number.toString() : a.name;
                    var second = b.number ? b.number?.toString() : b.name;
                    return first > second ? 1 : -1}));
        });
    }, [team])

    function getImage(imgUrl: string) {
        if (imgUrl) return imgUrl;
        return team?.defaultSkaterImage;
    }

    return (
        <Container fluid className="content" style={{ background: team?.color }}>
            {team && 
            <Container fluid className="px-0">
                <Row className="header-img px-lg-5 mx-0">
                    <Row>
                        <Col className="my-auto">
                            <h1 className="xl-title my-5 text-shadow">{team.name}</h1>
                        </Col>
                        <Col xs lg="auto">
                            <Image src={team.logoUrl} className="skater-image p-5" />
                        </Col>
                    </Row>
                    {team.description && <p className="text-center bg-white rounded text-black p-3">{team.description}</p>}
                </Row>
                <Row className="justify-content-center px-5">
                    {captain &&
                        <Col xs lg="4" className="text-center mt-5">
                            <Image className="skater-image" src={getImage(captain.imageUrl)} />
                            <div className="mt-0 border bg-dark rounded">
                                <p className={`${captain.number && 'd-flex justify-content-between px-3'} fs-3 m-0`}>{captain.number && <span>#{captain.number}</span>}<span className="text-nowrap">{captain.name}</span></p>
                                <p className="fs-3 m-0">Captain</p>
                            </div>
                        </Col>
                    }
                    {coCaptain &&
                        <Col xs lg="4" className="text-center mt-5">
                            <Image className="skater-image" src={coCaptain.imageUrl?.length > 0 ? coCaptain.imageUrl : team.defaultSkaterImage} />
                            <div className="mt-0 border bg-dark rounded">
                                <p className={`${coCaptain.number && 'd-flex justify-content-between px-3'} fs-3 m-0`}>{coCaptain.number && <span>#{coCaptain.number}</span>}<span className="text-nowrap">{coCaptain.name}</span></p>
                                <p className="fs-3 m-0">Co-Captain</p>
                            </div>
                        </Col>
                    }
                </Row>
                <Row className="justify-content-center px-5">
                    {members && members.map((skater: Person) =>
                        <Col xs lg="6" xl="4" xxl="3" key={skater.id} className="text-center mt-5">
                            <Image className="skater-image" src={skater.imageUrl?.length > 0 ? skater.imageUrl : team.defaultSkaterImage} />
                            <div className="mt-0 border bg-dark rounded">
                                <p className={`${skater.number && 'd-flex justify-content-between px-3'} fs-3 m-0`}>{skater.number && <span>#{skater.number}</span>}<span className="text-nowrap">{skater.name}</span></p>
                            </div>
                        </Col>
                    )}
                </Row>
                <Row className="justify-content-center px-5">
                    {headCoach &&
                        <Col xs lg="4" className="text-center mt-5">
                            <Image className="skater-image" src={headCoach.imageUrl?.length > 0 ? headCoach.imageUrl : team.defaultSkaterImage} />
                            <div className="mt-0 border bg-dark rounded">
                                <p className={`${headCoach.number && 'd-flex justify-content-between px-3'} fs-3 m-0`}>{headCoach.number && <span>#{headCoach.number}</span>}<span className="text-nowrap">{headCoach.name}</span></p>
                                <p className="fs-3 m-0">Head Coach</p>
                            </div>
                        </Col>
                    }
                    {benchCoach &&
                        <Col xs lg="4" className="text-center mt-5">
                            <Image className="skater-image" src={benchCoach.imageUrl?.length > 0 ? benchCoach.imageUrl : team.defaultSkaterImage} />
                            <div className="mt-0 border bg-dark rounded">
                                <p className={`${benchCoach.number && 'd-flex justify-content-between px-3'} fs-3 m-0`}>{benchCoach.number && <span>#{benchCoach.number}</span>}<span className="text-nowrap">{benchCoach.name}</span></p>
                                <p className="fs-3 m-0">Bench Coach</p>
                            </div>
                        </Col>
                    }
                </Row>
            </Container>
            }
        </Container>
    );
}

export default Teams;