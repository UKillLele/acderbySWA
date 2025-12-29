import {
  Container,
  Row,
  Col,
  Card,
  Accordion,
  ListGroup,
  Spinner,
  Form,
  Button,
  Dropdown,
  Modal,
} from "react-bootstrap";
import { Bout } from "../models/Bout";
import { Link } from "react-router-dom";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Team } from "../models/Team";
import { Person } from "../models/Person";
import { isEditor } from "./ProtectedRoute";
import { Position } from "../models/Position";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function getDate(date: string) {
  const d = new Date(date);
  const month = months[d.getMonth()];
  return `${month} ${d.getDate()}`;
}

function checkTix(dates, index) {
  const current = dates[index][0].date;
  const previous = dates[index - 1];
  if (
    new Date(current) > new Date(Date.now()) &&
    (!previous || new Date(previous[0].date) < new Date(Date.now()))
  )
    return true;
  return false;
}

const SeasonSchedule = () => {
  const [bouts, setBouts] = useState<Bout[][]>();
  const [error, setError] = useState<boolean>();
  const [teams, setTeams] = useState<Partial<Record<string, Team[]>>>();
  const [players, setPlayers] = useState<Person[]>();
  const [years, setYears] = useState<string[]>();

  const editor = isEditor();

  const [updatingId, setUpdatingId] = useState("");
  const [updatingName, setUpdatingName] = useState("");
  const [updatingDate, setUpdatingDate] = useState("");
  const [updatingHomeTeam, setUpdatingHomeTeam] = useState("");
  const [updatingHomeTeamScore, setUpdatingHomeTeamScore] = useState("");
  const [updatingHomeTeamMVPJammer, setUpdatingHomeTeamMVPJammer] =
    useState("");
  const [updatingHomeTeamMVPBlocker, setUpdatingHomeTeamMVPBlocker] =
    useState("");
  const [updatingAwayTeam, setUpdatingAwayTeam] = useState("");
  const [updatingAwayTeamScore, setUpdatingAwayTeamScore] = useState("");
  const [updatingAwayTeamMVPJammer, setUpdatingAwayTeamMVPJammer] =
    useState("");
  const [updatingAwayTeamMVPBlocker, setUpdatingAwayTeamMVPBlocker] =
    useState("");
  const [updateLoading, setUpdateLoading] = useState<boolean>(false);
  const [currentYear, setCurrentYear] = useState<string>(
    new Date().getFullYear().toString()
  );
  const [showSeasonPass, setShowSeasonPass] = useState<boolean>(false);
  const [showAddDates, setShowAddDates] = useState<boolean>(false);
  const [tempDate, setTempDate] = useState<string>("");
  const [tempName, setTempName] = useState<string>("Season Opener");
  const [newSeasonDates, setNewSeasonDates] = useState<Bout[]>([]);
  const [deleteDate, setDeleteDate] = useState<Bout[]>([]);
  const [editDate, setEditDate] = useState<Bout[]>([]);
  const [tempTeam, setTempTeam] = useState<Team | null>(null);
  const [updatingImageFile, setUpdatingImageFile] = useState<File>();
  const [teamType, setTeamType] = useState<string>();

  function onDeleteNewDate(date: string) {
    setNewSeasonDates(newSeasonDates.filter((x) => x.date.toString() != date));
  }

  function onAddDatesDate() {
    const date = new Date(tempDate);
    if (!isNaN(date.getTime())) {
      const bout: Bout = {
        id: "",
        name: tempName,
        date: tempDate,
        homeTeam: "",
        homeTeamScore: "",
        homeTeamMVPJammer: "",
        homeTeamMVPBlocker: "",
        awayTeam: "",
        awayTeamScore: "",
        awayTeamMVPJammer: "",
        awayTeamMVPBlocker: "",
        imageUrl: "",
      };
      setNewSeasonDates([...newSeasonDates, bout]);
      const newDate = new Date(tempDate);
      newDate.setDate(newDate.getDate() + 28);
      setTempDate(newDate.toISOString().split("T")[0]);
      setTempName(`Bout ${newSeasonDates.length + 2}`);
    }
  }

  function onAddDates(event: FormEvent) {
    event.preventDefault();
    if (newSeasonDates.length > 0) {
      setUpdateLoading(true);
      const formData = new FormData();
      formData.append("bouts", JSON.stringify(newSeasonDates));
      return fetch("api/add-dates", {
        method: "POST",
        body: formData,
      }).then(
        (resp) => {
          if (resp.status === 200) {
            refreshBouts(currentYear);
            setUpdateLoading(false);
            setShowAddDates(false);
            setNewSeasonDates([]);
          } else console.log(resp.statusText);
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  function onEditDate(event: FormEvent) {
    event?.preventDefault();
    if (updatingName && updatingDate && editDate.length > 0) {
      setUpdateLoading(true);
      editDate.forEach((bout: Bout) => {
        bout.name = updatingName;
      });
      const formData = new FormData();
      formData.append("bouts", JSON.stringify(editDate));
      return fetch("api/update-bouts", {
        method: "POST",
        body: formData,
      }).then(
        (resp) => {
          if (resp.status === 200) {
            setUpdateLoading(false);
            setEditDate([]);
          } else console.log(resp.statusText);
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  function onDeleteDate(event: FormEvent) {
    event.preventDefault();
    if (deleteDate) {
      setUpdateLoading(true);
      const formData = new FormData();
      formData.append("bouts", JSON.stringify(deleteDate));
      return fetch("api/delete-date", {
        method: "DELETE",
        body: formData,
      }).then(
        (resp) => {
          if (resp.status === 200) {
            window.location.reload();
          } else console.log(resp.statusText);
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  function onBoutClick(bout: Bout) {
    setUpdatingId(bout.id);
    setUpdatingName(bout.name);
    setUpdatingDate(bout.date);
    setUpdatingHomeTeam(bout.homeTeam);
    setUpdatingHomeTeamScore(bout.homeTeamScore?.toString());
    setUpdatingHomeTeamMVPJammer(bout.homeTeamMVPJammer);
    setUpdatingHomeTeamMVPBlocker(bout.homeTeamMVPBlocker);
    setUpdatingAwayTeam(bout.awayTeam);
    setUpdatingAwayTeamScore(bout.awayTeamScore?.toString());
    setUpdatingAwayTeamMVPJammer(bout.awayTeamMVPJammer);
    setUpdatingAwayTeamMVPBlocker(bout.awayTeamMVPBlocker);
  }

  function onUpdatingHomeTeamSelect(event: ChangeEvent) {
    const target = event.target as HTMLSelectElement;
    const { options } = target;
    const selectedOption = options[options.selectedIndex].value;
    setUpdatingHomeTeam(selectedOption);
    if (selectedOption === "addTeam") {
      setTempTeam({} as Team);
      setTeamType("home");
    }
  }

  function onUpdatingAwayTeamSelect(event: ChangeEvent) {
    const target = event.target as HTMLSelectElement;
    const { options } = target;
    const selectedOption = options[options.selectedIndex].value;
    setUpdatingAwayTeam(selectedOption);
    if (selectedOption === "addTeam") {
      setTempTeam({} as Team);
      setTeamType("away");
    }
  }

  function onUpdatingHomeTeamMVPJammerSelect(event: ChangeEvent) {
    const target = event.target as HTMLSelectElement;
    const { options } = target;
    setUpdatingHomeTeamMVPJammer(options[options.selectedIndex].value);
  }

  function onUpdatingHomeTeamMVPBlockerSelect(event: ChangeEvent) {
    const target = event.target as HTMLSelectElement;
    const { options } = target;
    setUpdatingHomeTeamMVPBlocker(options[options.selectedIndex].value);
  }

  function onUpdatingAwayTeamMVPJammerSelect(event: ChangeEvent) {
    const target = event.target as HTMLSelectElement;
    const { options } = target;
    setUpdatingAwayTeamMVPJammer(options[options.selectedIndex].value);
  }

  function onUpdatingAwayTeamMVPBlockerSelect(event: ChangeEvent) {
    const target = event.target as HTMLSelectElement;
    const { options } = target;
    setUpdatingAwayTeamMVPBlocker(options[options.selectedIndex].value);
  }

  function onBoutUpdate(event: FormEvent) {
    event.preventDefault();
    setUpdateLoading(true);
    const formData = new FormData();
    const bout: Bout = {
      id: updatingId,
      name: updatingName,
      date: updatingDate,
      homeTeam: updatingHomeTeam,
      homeTeamScore: updatingHomeTeamScore,
      homeTeamMVPJammer: updatingHomeTeamMVPJammer,
      homeTeamMVPBlocker: updatingHomeTeamMVPBlocker,
      awayTeam: updatingAwayTeam,
      awayTeamScore: updatingAwayTeamScore,
      awayTeamMVPJammer: updatingAwayTeamMVPJammer,
      awayTeamMVPBlocker: updatingAwayTeamMVPBlocker,
      imageUrl: "",
    };

    formData.append("bouts", JSON.stringify([bout]));

    return fetch("api/update-bouts", {
      method: "POST",
      body: formData,
    }).then(
      (resp) => {
        if (resp.status === 200) {
          clearUpdating();
        } else console.log(resp.statusText);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  function clearUpdating() {
    setUpdatingId("");
    setUpdatingDate("");
    setUpdatingHomeTeam("");
    setUpdatingHomeTeamScore("");
    setUpdatingHomeTeamMVPJammer("");
    setUpdatingHomeTeamMVPBlocker("");
    setUpdatingAwayTeam("");
    setUpdatingAwayTeamScore("");
    setUpdatingAwayTeamMVPJammer("");
    setUpdatingAwayTeamMVPBlocker("");
    setUpdateLoading(false);
    refreshBouts(currentYear);
  }

  function setEdit(date: Bout[]) {
    setEditDate(date);
    setUpdatingName(date[0].name);
    setUpdatingDate(new Date(date[0].date).toISOString().split("T")[0]);
  }

  function clearEditDate() {
    setEditDate([]);
    setUpdatingName("");
    setUpdatingDate("");
  }

  function onAddUpdatingImage(event: ChangeEvent) {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files) {
      setUpdatingImageFile(files[0]);
    }
  }

  function setTempTeamName(event: ChangeEvent) {
    tempTeam!.name = (event.target as HTMLInputElement).value;
    setTempTeam(tempTeam);
  }

  function setTempTeamColor(event: ChangeEvent) {
    tempTeam!.color = (event.target as HTMLInputElement).value;
    setTempTeam(tempTeam);
  }

  function onAddTeam(event: FormEvent) {
    event.preventDefault();
    console.log(tempTeam);
    if (tempTeam?.name) {
      const formData = new FormData();
      tempTeam!.color = hexToRGBA(tempTeam.color);
      formData.append("team", JSON.stringify(tempTeam));
      formData.append("logo", updatingImageFile ?? "");
      return fetch("api/teams/add", {
        method: "POST",
        body: formData,
      }).then(
        async (resp) => {
          if (resp.status === 200) {
            setTempTeam(null);
            await refreshTeams();
            if (teamType === "home") {
              setUpdatingHomeTeam(await resp.text());
              setUpdatingImageFile(undefined);
            }
            if (teamType === "away") {
              setUpdatingAwayTeam(await resp.text());
              setUpdatingImageFile(undefined);
            }
          } else console.log(resp.statusText);
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  const hexToRGBA = (hex: string): string => {
    let r = 0,
      g = 0,
      b = 0;

    // Remove the hash if it exists
    hex = hex.replace(/^#/, "");

    // Handle 3-digit hex (#RGB)
    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
    }
    // Handle 6-digit hex (#RRGGBB)
    else if (hex.length === 6) {
      r = parseInt(hex.substring(0, 2), 16);
      g = parseInt(hex.substring(2, 4), 16);
      b = parseInt(hex.substring(4, 6), 16);
    } else {
      throw new Error("Invalid hex color format. Use 3 or 6 characters.");
    }

    return `rgba(${r}, ${g}, ${b}, .8)`;
  };

  async function refreshBouts(year?: string | null) {
    try {
      setCurrentYear(year ?? new Date().getFullYear().toString());
      const resp = await fetch(`/api/bouts/${year ?? currentYear}`);
      const b = await resp.json();
      const groupedBouts = b.reduce((r, a) => {
        const date: Date = new Date(a.date);
        const ymd = `${date.getFullYear()}-${
          date.getMonth() + 1
        }-${date.getDate()}`;
        r[ymd] = r[ymd] || [];
        r[ymd].push(a);
        return r;
      }, {});
      var resultArray: Bout[][] = Object.keys(groupedBouts).map(function (
        bout
      ) {
        return groupedBouts[bout];
      });
      setBouts(resultArray);
      setShowSeasonPass(
        new Date() < (resultArray?.at(-1)?.at(-1)?.date ?? new Date())
      );
    } catch (_) {
      setError(true);
    }
  }

  async function refreshTeams() {
    await fetch(`/api/teams`)
      .then((resp) => resp.json())
      .then((teams: Team[]) => {
        teams.sort((a, b) => (a.name > b.name ? 1 : -1));
        const groupedTeams = Object.groupBy(teams, ({ type }) => type);
        setTeams(groupedTeams);
      });
  }

  useEffect(() => {
    const fetchData = async () => {
      await fetch(`/api/players`)
        .then((resp) => resp.json())
        .then((players) => {
          setPlayers(
            players.sort((a: Person, b: Person) => {
              return a.name > b.name ? 1 : -1;
            })
          );
        });
      await refreshBouts();
      await refreshTeams();
      await fetch(`/api/years`)
        .then((resp) => resp.json())
        .then((years: string[]) => {
          setYears(years);
        });
      setShowSeasonPass(
        new Date().toISOString() < (bouts?.at(-1)?.at(-1) as Bout)?.date
      );
    };

    fetchData();
  }, []);

  function getTeam(id: string) {
    if (teams) {
      return Object.values(teams as Record<string, Team[]>)
        ?.flat()
        ?.find((x: Team) => x.id === id);
    }
  }

  function getSkaterImage(skaterId: string, teamId: string) {
    if (teams) {
      const player = players?.find((x) => x.id === skaterId);
      const team = Object.values(teams as Record<string, Team[]>)
        ?.flat()
        ?.find((x: Team) => x.id === teamId);
      const imageUrl =
        player?.imageUrl !== "" ? player?.imageUrl : team?.defaultSkaterImage;
      return encodeURI(imageUrl ?? "");
    }
  }

  return (
    <Container fluid className="content bg-dark text-light">
      <Row className="m-5 align-items-center">
        <Col className="my-auto">
          <h1 className="xl-title my-5 text-shadow">{currentYear} Season</h1>
        </Col>
        {showSeasonPass && (
          <Col xs="auto">
            <Link className="btn btn-primary ms-auto" to="/tickets">
              Get Season Passes
            </Link>
          </Col>
        )}
        {editor && (
          <Col xs="auto">
            <Button onClick={() => setShowAddDates(true)}>Add Dates</Button>
          </Col>
        )}
        <Col xs="auto">
          <Dropdown onSelect={refreshBouts}>
            <Dropdown.Toggle>Select Season </Dropdown.Toggle>
            <Dropdown.Menu>
              {years?.map((year: string) => (
                <Dropdown.Item key={year} eventKey={year}>
                  {year}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>
      <Row className="mx-5">
        <Col>
          <Accordion data-bs-theme="light">
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
                    <p className="m-0">
                      We ask that all chairs are set up behind the second line
                      of caution tape. If you want to get really close to the
                      action, the area between the two caution tapes is floor
                      seating only. Be aware that the floor area is called
                      "Crash-Zone Seating" for a reason. We like to skate fast,
                      hit hard and sometimes you might unexpectedly end up with
                      a roller girl in your lap sitting in this area.
                    </p>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <p className="fw-bold">REFRESHMENTS</p>
                    <p className="m-0">
                      All bouts are BYOB - no glass, please. IDs will be checked
                      at the door.
                    </p>
                    <p className="m-0">No outside food is permitted.</p>
                    <p className="m-0">
                      Non-Alcoholic drinks & snacks are available at the
                      concession stand.
                    </p>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <p className="fw-bold">KIDS</p>
                    <p className="m-0">
                      We love having kids at the bouts! Many of our skaters are
                      moms themselves! Children 10 & under are free EXCEPT for
                      special events.
                    </p>
                    <p className="m-0">
                      <u>Please Note</u> - Roller Derby is a full contact sport
                      & our rink is small. Please help keep your children safe
                      by sitting in the second row of chairs behind the caution
                      tape. No one under the age of 18 is allowed to sit on the
                      floor. We like to skate fast, hit hard & sometimes we end
                      up in the crowd accidentally.
                    </p>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <p className="fw-bold">MEET THE SKATERS</p>
                    <p className="m-0">
                      We love our fans!! Cheer loud & often! Bring posters,
                      shirts, stickers, pictures! We are happy to take pictures
                      with you & sign autographs!
                    </p>
                    <p className="m-0">
                      Feel free to ask questions! We love to talk derby! We'll
                      also give you a quick demo jam before the first game. You
                      can also check out our <Link to="/derby">Derby 101</Link>{" "}
                      info.
                    </p>
                  </ListGroup.Item>
                </ListGroup>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>
      </Row>
      {bouts ? (
        bouts.map((date: Bout[], index: number) => (
          <Row className="m-5" key={date[0].date.toString()}>
            <Col>
              <Card data-bs-theme="light">
                <Card.Body>
                  <Card.Title>
                    <Row className="align-items-center">
                      {date[0].imageUrl && (
                        <Col lg="auto" className="text-center py-2">
                          <a
                            href={date[0].imageUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-primary ms-auto"
                          >
                            Program
                          </a>
                        </Col>
                      )}
                      {editor && date === editDate ? (
                        <Form onSubmit={onEditDate}>
                          <Row className="py-2">
                            <Col
                              xs="12"
                              lg
                              className="text-lg-end fs-1 fw-bold mx-lg-3"
                            >
                              <Form.Group controlId="updateName">
                                <Form.Control
                                  name="updateName"
                                  value={updatingName}
                                  onChange={(event) =>
                                    setUpdatingName(event.target.value)
                                  }
                                  type="string"
                                />
                              </Form.Group>
                            </Col>
                            <Col
                              xs="12"
                              lg
                              className="text-lg-start fs-1 fw-bold mx-lg-3"
                            >
                              {getDate(date[0].date)}
                            </Col>
                            <Col lg="auto">
                              <Button
                                className="btn btn-success ms-auto"
                                type="submit"
                              >
                                Update
                              </Button>
                            </Col>
                            <Col lg="auto">
                              <Button
                                className="btn btn-warning ms-auto"
                                onClick={clearEditDate}
                              >
                                Cancel
                              </Button>
                            </Col>
                          </Row>
                        </Form>
                      ) : (
                        <>
                          <Col
                            xs="12"
                            lg
                            className="text-lg-end fs-1 fw-bold mx-lg-3"
                          >
                            {date[0].name}
                          </Col>
                          <Col
                            xs="12"
                            lg
                            className="text-lg-start fs-1 fw-bold mx-lg-3"
                          >
                            {getDate(date[0].date)}
                          </Col>
                        </>
                      )}
                      {editDate !== date && (
                        <Col lg="auto" className="text-center py-2">
                          {checkTix(bouts, index) && (
                            <Link
                              className="btn btn-primary ms-auto"
                              to="/tickets"
                            >
                              Get Tickets
                            </Link>
                          )}
                        </Col>
                      )}
                      {editor && editDate !== date && (
                        <>
                          <Col lg="auto" className="text-center py-2">
                            <Button
                              className="btn btn-warning ms-auto"
                              onClick={() => setEdit(date)}
                            >
                              Edit
                            </Button>
                          </Col>
                          <Col lg="auto" className="text-center py-2">
                            <Button
                              className="btn btn-danger ms-auto"
                              onClick={() => setDeleteDate(date)}
                            >
                              Delete
                            </Button>
                          </Col>
                        </>
                      )}
                    </Row>
                  </Card.Title>
                  {date
                    .sort((a, b) => (a.date > b.date ? 1 : -1))
                    .map((bout, i) => {
                      const homeTeam = getTeam(bout.homeTeam);
                      const awayTeam = getTeam(bout.awayTeam);
                      return updatingId !== bout.id ? (
                        <Row
                          key={bout.id}
                          className="align-items-center mb-2 text-light fw-bold text-shadow pb-2 text-center"
                          style={{
                            borderBottom:
                              i + 1 !== date.length ? "1px solid black" : "",
                          }}
                          onClick={() => editor && onBoutClick(bout)}
                        >
                          <Col
                            className="p-0 bout-bg"
                            style={{
                              backgroundImage:
                                homeTeam && `url(${homeTeam.imageUrl})`,
                            }}
                          >
                            <Row
                              style={{
                                backgroundColor: homeTeam && homeTeam.color,
                              }}
                              className="m-0 h-100 d-flex flex-column justify-content-center fs-1"
                            >
                              {/* center text */}
                              {!bout.homeTeamMVPJammer && <Col></Col>}
                              <Col>
                                <div>
                                  {homeTeam
                                    ? homeTeam.name
                                    : bout.name === "Champs"
                                    ? i === 0
                                      ? "Team 3"
                                      : "Team 1"
                                    : "TBA"}
                                </div>
                                {bout.homeTeamScore && (
                                  <div className="lg-only-block">
                                    {bout.homeTeamScore}
                                  </div>
                                )}
                              </Col>
                              <Col className="w-100 lg-only justify-content-evenly">
                                {bout.homeTeamMVPJammer && (
                                  <div
                                    style={{
                                      backgroundImage: `url(${getSkaterImage(
                                        bout.homeTeamMVPJammer,
                                        bout.homeTeam
                                      )})`,
                                      backgroundPosition: "center",
                                      backgroundSize: "cover",
                                      backgroundRepeat: "no-repeat",
                                      width: "20%",
                                    }}
                                    className="d-flex flex-column justify-content-end"
                                  >
                                    <div className="lh-1 fs-3">MVJ</div>
                                  </div>
                                )}
                                {bout.homeTeamMVPBlocker && (
                                  <div
                                    style={{
                                      backgroundImage: `url(${getSkaterImage(
                                        bout.homeTeamMVPBlocker,
                                        bout.homeTeam
                                      )})`,
                                      backgroundPosition: "center",
                                      backgroundSize: "cover",
                                      backgroundRepeat: "no-repeat",
                                      width: "20%",
                                    }}
                                    className="d-flex flex-column justify-content-end"
                                  >
                                    <div className="lh-1 fs-3">MVB</div>
                                  </div>
                                )}
                              </Col>
                            </Row>
                          </Col>
                          <Col
                            lg="auto"
                            className="fw-bold xl-title text-light text-shadow vs"
                          >
                            VS
                          </Col>
                          <Col
                            className="p-0 bout-bg"
                            style={{
                              backgroundImage:
                                awayTeam && `url(${awayTeam.imageUrl})`,
                            }}
                          >
                            <Row
                              style={{
                                backgroundColor: awayTeam && awayTeam.color,
                              }}
                              className="m-0 h-100 d-flex flex-column justify-content-center fs-1"
                            >
                              {/* center text */}
                              {!bout.awayTeamMVPJammer && <Col></Col>}
                              <Col>
                                <div>
                                  {awayTeam
                                    ? awayTeam.name
                                    : bout.name === "Champs"
                                    ? i === 0
                                      ? "Team 4"
                                      : "Team 2"
                                    : "TBA"}
                                </div>
                                {bout.awayTeamScore && (
                                  <div className="lg-only-block">
                                    {bout.awayTeamScore}
                                  </div>
                                )}
                              </Col>
                              <Col className="w-100 lg-only justify-content-evenly">
                                {bout.awayTeamMVPJammer && (
                                  <div
                                    style={{
                                      backgroundImage: `url(${getSkaterImage(
                                        bout.awayTeamMVPJammer,
                                        bout.awayTeam
                                      )})`,
                                      backgroundPosition: "center",
                                      backgroundSize: "cover",
                                      backgroundRepeat: "no-repeat",
                                      width: "20%",
                                    }}
                                    className="d-flex flex-column justify-content-end"
                                  >
                                    <div className="lh-1 fs-3">MVJ</div>
                                  </div>
                                )}
                                {bout.awayTeamMVPBlocker && (
                                  <div
                                    style={{
                                      backgroundImage: `url(${getSkaterImage(
                                        bout.awayTeamMVPBlocker,
                                        bout.awayTeam
                                      )})`,
                                      backgroundPosition: "center",
                                      backgroundSize: "cover",
                                      backgroundRepeat: "no-repeat",
                                      width: "20%",
                                    }}
                                    className="d-flex flex-column justify-content-end"
                                  >
                                    <div className="lh-1 fs-3">MVB</div>
                                  </div>
                                )}
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      ) : (
                        <Form onSubmit={onBoutUpdate} key={bout.id + "edit"}>
                          <Row
                            className="align-items-center mb-2 text-light fw-bold text-shadow pb-2 text-center"
                            style={{
                              borderBottom:
                                i + 1 !== date.length ? "1px solid black" : "",
                            }}
                          >
                            <Col
                              className="p-0 bout-bg"
                              style={{
                                backgroundImage: `url(${
                                  Object.values(teams as Record<string, Team[]>)
                                    ?.flat()
                                    ?.find(
                                      (x: Team) => x.id === updatingHomeTeam
                                    )?.imageUrl
                                })`,
                              }}
                            >
                              <Row
                                style={{
                                  backgroundColor: Object.values(
                                    teams as Record<string, Team[]>
                                  )
                                    ?.flat()
                                    ?.find(
                                      (x: Team) => x.id === updatingHomeTeam
                                    )?.color,
                                }}
                                className="m-0 h-100 d-flex flex-column justify-content-center fs-1"
                              >
                                <Col>
                                  <div className="">
                                    <Form.Select
                                      name="updateHomeTeam"
                                      value={updatingHomeTeam}
                                      onChange={onUpdatingHomeTeamSelect}
                                    >
                                      <option>Team</option>
                                      {Object.entries(
                                        teams as Record<string, Team[]>
                                      )?.map(([category, items]) => (
                                        <optgroup
                                          key={category + "Home"}
                                          label={category}
                                        >
                                          {items?.map((team: Team) => (
                                            <option
                                              key={team.id + "Home"}
                                              value={team.id}
                                            >
                                              {team.name}
                                            </option>
                                          ))}
                                        </optgroup>
                                      ))}
                                      <option value="addTeam">Add Team</option>
                                    </Form.Select>
                                  </div>
                                  <div className="lg-only-block">
                                    <Form.Group controlId="updateHomeTeamScore">
                                      <Form.Control
                                        name="updateHomeTeamScore"
                                        value={updatingHomeTeamScore ?? ""}
                                        onChange={(event) =>
                                          setUpdatingHomeTeamScore(
                                            event.target.value
                                          )
                                        }
                                        type="string"
                                        placeholder="#"
                                      />
                                    </Form.Group>
                                  </div>
                                </Col>
                                <Col className="w-100 lg-only justify-content-evenly">
                                  <div
                                    style={{
                                      backgroundImage: `url(${getSkaterImage(
                                        updatingHomeTeamMVPJammer,
                                        updatingHomeTeam
                                      )})`,
                                      backgroundPosition: "center",
                                      backgroundSize: "cover",
                                      backgroundRepeat: "no-repeat",
                                      width: "20%",
                                    }}
                                    className="d-flex flex-column justify-content-end"
                                  >
                                    <div className="lh-1 fs-3">MVJ</div>
                                    <Form.Select
                                      name="updateHomeTeamMVPJammer"
                                      value={updatingHomeTeamMVPJammer}
                                      onChange={
                                        onUpdatingHomeTeamMVPJammerSelect
                                      }
                                    >
                                      <option>Skater</option>
                                      {players!
                                        .filter((player: Person) => {
                                          return (
                                            player.teams.some(
                                              (position: Position) =>
                                                position.id === updatingHomeTeam
                                            ) ||
                                            player.id ===
                                              updatingHomeTeamMVPJammer
                                          );
                                        })
                                        .map((player: Person) => (
                                          <option
                                            key={player.id + "homeJ"}
                                            value={player.id}
                                          >
                                            {player.name}
                                          </option>
                                        ))}
                                    </Form.Select>
                                  </div>
                                  <div
                                    style={{
                                      backgroundImage: `url(${getSkaterImage(
                                        updatingHomeTeamMVPBlocker,
                                        updatingHomeTeam
                                      )})`,
                                      backgroundPosition: "center",
                                      backgroundSize: "cover",
                                      backgroundRepeat: "no-repeat",
                                      width: "20%",
                                    }}
                                    className="d-flex flex-column justify-content-end"
                                  >
                                    <div className="lh-1 fs-3">MVB</div>
                                    <Form.Select
                                      name="updateHomeTeamMVPBlocker"
                                      value={updatingHomeTeamMVPBlocker}
                                      onChange={
                                        onUpdatingHomeTeamMVPBlockerSelect
                                      }
                                    >
                                      <option>Skater</option>
                                      {players!
                                        .filter((player: Person) => {
                                          return (
                                            player.teams.some(
                                              (position: Position) =>
                                                position.id === updatingHomeTeam
                                            ) ||
                                            player.id ===
                                              updatingHomeTeamMVPBlocker
                                          );
                                        })
                                        .map((player: Person) => (
                                          <option
                                            key={player.id + "homeB"}
                                            value={player.id}
                                          >
                                            {player.name}
                                          </option>
                                        ))}
                                    </Form.Select>
                                  </div>
                                </Col>
                              </Row>
                            </Col>
                            <Col
                              lg="auto"
                              className="fw-bold xl-title text-light text-shadow vs"
                            >
                              <Row>
                                <Col>
                                  <Button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => clearUpdating()}
                                  >
                                    Cancel
                                  </Button>
                                </Col>
                              </Row>
                              <Row>
                                <Col>VS</Col>
                              </Row>
                              <Row>
                                <Col>
                                  <Button type="submit">
                                    {!updateLoading ? (
                                      "Update"
                                    ) : (
                                      <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                      />
                                    )}
                                  </Button>
                                </Col>
                              </Row>
                            </Col>
                            <Col
                              className="p-0 bout-bg"
                              style={{
                                backgroundImage: `url(${
                                  Object.values(teams as Record<string, Team[]>)
                                    ?.flat()
                                    ?.find(
                                      (x: Team) => x.id === updatingAwayTeam
                                    )?.imageUrl
                                })`,
                              }}
                            >
                              <Row
                                style={{
                                  backgroundColor: Object.values(
                                    teams as Record<string, Team[]>
                                  )
                                    ?.flat()
                                    ?.find(
                                      (x: Team) => x.id === updatingAwayTeam
                                    )?.color,
                                }}
                                className="m-0 h-100 d-flex flex-column justify-content-center fs-1"
                              >
                                <Col>
                                  <div>
                                    <Form.Select
                                      name="updateAwayTeam"
                                      value={updatingAwayTeam}
                                      onChange={onUpdatingAwayTeamSelect}
                                    >
                                      <option>Team</option>
                                      {Object.entries(
                                        teams as Record<string, Team[]>
                                      )?.map(([category, items]) => (
                                        <optgroup
                                          key={category + "Away"}
                                          label={category}
                                        >
                                          {items?.map((team: Team) => (
                                            <option
                                              key={team.id + "Away"}
                                              value={team.id}
                                            >
                                              {team.name}
                                            </option>
                                          ))}
                                        </optgroup>
                                      ))}
                                      <option value="addTeam">Add Team</option>
                                    </Form.Select>
                                  </div>
                                  <div className="lg-only-block">
                                    <Form.Group controlId="updateAwayTeamScore">
                                      <Form.Control
                                        name="updateAwayTeamScore"
                                        value={updatingAwayTeamScore ?? ""}
                                        onChange={(event) =>
                                          setUpdatingAwayTeamScore(
                                            event.target.value
                                          )
                                        }
                                        type="string"
                                        placeholder="#"
                                      />
                                    </Form.Group>
                                  </div>
                                </Col>
                                <Col className="w-100 lg-only justify-content-evenly">
                                  <div
                                    style={{
                                      backgroundImage: `url(${getSkaterImage(
                                        updatingAwayTeamMVPJammer,
                                        updatingAwayTeam
                                      )})`,
                                      backgroundPosition: "center",
                                      backgroundSize: "cover",
                                      backgroundRepeat: "no-repeat",
                                      width: "20%",
                                    }}
                                    className="d-flex flex-column justify-content-end"
                                  >
                                    <div className="lh-1 fs-3">MVJ</div>
                                    <Form.Select
                                      name="updateAwayTeamMVPJammer"
                                      value={updatingAwayTeamMVPJammer}
                                      onChange={
                                        onUpdatingAwayTeamMVPJammerSelect
                                      }
                                    >
                                      <option>Skater</option>
                                      {players!
                                        .filter((player: Person) => {
                                          return (
                                            player.teams.some(
                                              (position: Position) =>
                                                position.id === updatingAwayTeam
                                            ) ||
                                            player.id ===
                                              updatingAwayTeamMVPJammer
                                          );
                                        })
                                        .map((player: Person) => (
                                          <option
                                            key={player.id + "awayJ"}
                                            value={player.id}
                                          >
                                            {player.name}
                                          </option>
                                        ))}
                                    </Form.Select>
                                  </div>
                                  <div
                                    style={{
                                      backgroundImage: `url(${getSkaterImage(
                                        updatingAwayTeamMVPBlocker,
                                        updatingAwayTeam
                                      )})`,
                                      backgroundPosition: "center",
                                      backgroundSize: "cover",
                                      backgroundRepeat: "no-repeat",
                                      width: "20%",
                                    }}
                                    className="d-flex flex-column justify-content-end"
                                  >
                                    <div className="lh-1 fs-3">MVB</div>
                                    <Form.Select
                                      name="updateAwayTeamMVPBlocker"
                                      value={updatingAwayTeamMVPBlocker}
                                      onChange={
                                        onUpdatingAwayTeamMVPBlockerSelect
                                      }
                                    >
                                      <option>Skater</option>
                                      {players!
                                        .filter((player: Person) => {
                                          return (
                                            player.teams.some(
                                              (position: Position) =>
                                                position.id === updatingAwayTeam
                                            ) ||
                                            player.id ===
                                              updatingAwayTeamMVPBlocker
                                          );
                                        })
                                        .map((player: Person) => (
                                          <option
                                            key={player.id + "awayB"}
                                            value={player.id}
                                          >
                                            {player.name}
                                          </option>
                                        ))}
                                    </Form.Select>
                                  </div>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </Form>
                      );
                    })}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        ))
      ) : error ? (
        <Container>
          <Col>
            <Row>
              <p className="pt-5 h1">Season Info Coming Soon!</p>
            </Row>
          </Col>
        </Container>
      ) : (
        <Container fluid className="page-loader">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Container>
      )}

      <Modal show={showAddDates} onHide={() => setShowAddDates(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Dates</Modal.Title>
        </Modal.Header>
        <Form onSubmit={onAddDates}>
          <Modal.Body>
            {newSeasonDates &&
              newSeasonDates.map((bout) => (
                <Row key={bout.date + "-add"} className="pb-2">
                  <Col className="my-auto">{`${bout.name} - ${bout.date}`}</Col>
                  <Col xs="auto">
                    <Button
                      type="button"
                      variant="danger"
                      onClick={() => onDeleteNewDate(bout.date.toString())}
                    >
                      &times;
                    </Button>
                  </Col>
                </Row>
              ))}
            <Row>
              <Col>
                <Form.Control
                  name="tempName"
                  value={tempName}
                  onChange={(event) => setTempName(event.target?.value)}
                  placeholder="Bout Name"
                ></Form.Control>
              </Col>
              <Col>
                <Form.Control
                  name="tempDate"
                  value={tempDate}
                  onChange={(event) => setTempDate(event.target?.value)}
                  type="date"
                  placeholder="Bout Date"
                ></Form.Control>
              </Col>
              <Col xs="auto">
                <Button type="button" onClick={onAddDatesDate}>
                  +
                </Button>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={() => setShowAddDates(false)}>
              Cancel
            </Button>
            <Button type="submit">Add</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal
        show={(deleteDate?.length ?? 0) > 0}
        onHide={() => setDeleteDate([])}
      >
        <Form onSubmit={onDeleteDate}>
          <Modal.Header closeButton>
            <Modal.Title>
              Delete{" "}
              {getDate(
                deleteDate?.map((x) => x.date)[0] ?? new Date().toDateString()
              )}
              ?
            </Modal.Title>
          </Modal.Header>
          <Modal.Footer>
            <Button variant="danger" onClick={() => setDeleteDate([])}>
              Cancel
            </Button>
            <Button type="submit">Confirm</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={tempTeam != null} onHide={() => setTempTeam(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Team</Modal.Title>
        </Modal.Header>
        <Form onSubmit={onAddTeam}>
          <Modal.Body>
            <Row>
              <Col>
                <Form.Control
                  name="teamName"
                  value={tempTeam?.name}
                  placeholder="Team Name"
                  onChange={setTempTeamName}
                ></Form.Control>
              </Col>
              <Col>
                <Form.Control
                  name="teamColor"
                  value={tempTeam?.color}
                  placeholder="#00ff00"
                  onChange={setTempTeamColor}
                ></Form.Control>
              </Col>
              <Col>
                <Form.Control
                  name="teamLogo"
                  onChange={onAddUpdatingImage}
                  type="file"
                  accept=".png,.jpg,.jpeg"
                />
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={() => setTempTeam(null)}>
              Cancel
            </Button>
            <Button type="submit">Add</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default SeasonSchedule;
