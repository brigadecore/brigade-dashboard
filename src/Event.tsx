import moment from "moment"

import React from "react"

import Alert from "react-bootstrap/Alert"
import Card from "react-bootstrap/Card"
import Col from "react-bootstrap/Col"
import Container from "react-bootstrap/Container"
import Nav from "react-bootstrap/Nav"
import Row from "react-bootstrap/Row"
import Tab from "react-bootstrap/Tab"
import Table from "react-bootstrap/Table"
import Tabs from "react-bootstrap/Tabs"

import { Link, useParams } from "react-router-dom"

import { core } from "@brigadecore/brigade-sdk"

import { getClient, getUserID } from "./Utils"
import JobPhaseIcon from "./JobPhaseIcon"
import LogStreamer from "./components/LogStreamer"
import Spinner from "./components/Spinner"
import WorkerPhaseIcon from "./WorkerPhaseIcon"
import YAMLViewer from "./components/YAMLViewer"

interface EventProps {
  id: string
}

interface EventState {
  event?: core.Event,
  grayedOut: boolean
}

// TODO: Need to make this component auto-refresh
class Event extends React.Component<EventProps, EventState> {
  constructor(props: EventProps) {
    super(props)
    this.state = {
      grayedOut: true
    }
  }

  async componentDidMount(): Promise<void> {
    const eventData = await getClient().core().events().get(this.props.id)
    const projectId = eventData.projectID

    this.setState({
      event: eventData
    })

    if(projectId) {
      const authzList = await getClient().core().projects().authz().roleAssignments().list(projectId)
      const userId = await getUserID()

      for(const authzItem of authzList.items) {
        if(authzItem.role === "PROJECT_USER" && authzItem?.principal.id === userId) {
          this.setState({grayedOut: false})
        }
      }
    }
  }

  render(): React.ReactElement {
    const event = this.state.event
    if (!event) {
      return <Spinner />
    }
    return (
      <div>
        <h1 className="page-heading">{event?.metadata?.id}</h1>
        <Tabs defaultActiveKey="summary" className="mb-3" mountOnEnter={true}>
          <Tab eventKey="summary" title="Summary">
            <EventSummary event={event} />
          </Tab>
          <Tab eventKey="yaml" title="YAML">
            <YAMLViewer object={event} />
          </Tab>
          {event.git ? (
            <Tab eventKey="git-initializer-logs" title="Git Initializer Logs" disabled = {this.state.grayedOut}>
              <LogStreamer event={event} containerName="vcs" logKey="vcs" />
            </Tab>
          ) : null}
          <Tab eventKey="worker-logs" title="Worker Logs" disabled = {this.state.grayedOut}>
            <LogStreamer event={event} logKey={event?.metadata?.id || ""} />
          </Tab>
          <Tab eventKey="jobs" title="Jobs" disabled = {this.state.grayedOut}>
            <JobTabs event={event} />
          </Tab>
        </Tabs>
      </div>
    )
  }
}

export default function RoutedEvent(): React.ReactElement {
  const pathParams = useParams()
  return <Event id={pathParams.id || ""} />
}

interface EventSummaryProps {
  event: core.Event
}

class EventSummary extends React.Component<EventSummaryProps> {
  render(): React.ReactElement {
    const event = this.props.event
    let phaseColor = "light"
    switch (event.worker?.status.phase) {
      case core.WorkerPhase.Aborted:
        phaseColor = "danger"
        break
      case core.WorkerPhase.Canceled:
        phaseColor = "danger"
        break
      case core.WorkerPhase.Failed:
        phaseColor = "danger"
        break
      case core.WorkerPhase.Pending:
        phaseColor = "warning"
        break
      case core.WorkerPhase.Running:
        phaseColor = "warning"
        break
      case core.WorkerPhase.SchedulingFailed:
        phaseColor = "danger"
        break
      case core.WorkerPhase.Starting:
        phaseColor = "goldenrod"
        break
      case core.WorkerPhase.Succeeded:
        phaseColor = "success"
        break
      case core.WorkerPhase.TimedOut:
        phaseColor = "danger"
        break
    }
    return (
      <Container>
        <Row>
          <Col>
            <Card bg="light">
              <Card.Header>{event.metadata?.id}</Card.Header>
              <Card.Body>
                <Table borderless hover>
                  <tbody>
                    <tr>
                      <th>Project</th>
                      <td>
                        <Link to={"/projects/" + event.projectID}>
                          {event.projectID}
                        </Link>
                      </td>
                    </tr>
                    <tr>
                      <th>Source</th>
                      <td>{event.source}</td>
                    </tr>
                    <tr>
                      <th>Type</th>
                      <td>{event.type}</td>
                    </tr>
                    {event.qualifiers ? (
                      <tr>
                        <th>Qualifiers</th>
                        <td>
                          <Table borderless hover>
                            <tbody>
                              {Object.entries(event.qualifiers).map(
                                (entry: string[]) => (
                                  <tr>
                                    <th>{entry[0]}</th>
                                    <td>{entry[1]}</td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </Table>
                        </td>
                      </tr>
                    ) : null}
                    {event.labels ? (
                      <tr>
                        <th>Labels</th>
                        <td>
                          <Table borderless hover>
                            <tbody>
                              {Object.entries(event.labels).map(
                                (entry: string[]) => (
                                  <tr>
                                    <th>{entry[0]}</th>
                                    <td>{entry[1]}</td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </Table>
                        </td>
                      </tr>
                    ) : null}
                    {event.git ? (
                      <tr>
                        <th>Git</th>
                        <td>
                          <Table borderless hover>
                            <tbody>
                              {event.git.cloneURL ? (
                                <tr>
                                  <th>Clone URL</th>
                                  <td>
                                    {event.git.cloneURL}
                                    <Link to={event.git.cloneURL}>
                                      {event.git.cloneURL}
                                    </Link>
                                  </td>
                                </tr>
                              ) : null}
                              {event.git.ref ? (
                                <tr>
                                  <th>Ref</th>
                                  <td>{event.git.ref}</td>
                                </tr>
                              ) : null}
                              {event.git.commit ? (
                                <tr>
                                  <th>Commit</th>
                                  <td>{event.git.commit}</td>
                                </tr>
                              ) : null}
                            </tbody>
                          </Table>
                        </td>
                      </tr>
                    ) : null}
                    <tr>
                      <th>Created</th>
                      <td>
                        {moment(event.metadata?.created)
                          .utc()
                          .format("YYYY-MM-DD HH:mm:ss Z")}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card border={phaseColor} bg="light">
              <Card.Header>
                <WorkerPhaseIcon phase={event.worker?.status.phase} />
                &nbsp;&nbsp; Worker
              </Card.Header>
              <Card.Body>
                <Table borderless hover>
                  <tbody>
                    <tr>
                      <th>Image</th>
                      <td>
                        {event.worker?.spec.container?.image || "DEFAULT"}
                      </td>
                    </tr>
                    {event.worker?.status.started ? (
                      <tr>
                        <th>Started</th>
                        <td>
                          {moment(event.worker?.status.started)
                            .utc()
                            .format("YYYY-MM-DD HH:mm:ss Z")}
                        </td>
                      </tr>
                    ) : null}
                    {event.worker?.status.ended ? (
                      <tr>
                        <th>Ended</th>
                        <td>
                          {moment(event.worker?.status.ended)
                            .utc()
                            .format("YYYY-MM-DD HH:mm:ss Z")}
                        </td>
                      </tr>
                    ) : null}
                    {event.worker?.status.ended ? (
                      <tr>
                        <th>Duration</th>
                        <td>
                          {moment
                            .duration(
                              moment(event.worker?.status.ended).diff(
                                moment(event.worker?.status.started)
                              )
                            )
                            .humanize()}
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    )
  }
}

interface JobTabsProps {
  event: core.Event
}

class JobTabs extends React.Component<JobTabsProps> {
  render(): React.ReactElement {
    const event = this.props.event
    const jobs = event.worker?.jobs
    if (!jobs || jobs.length === 0) {
      return (
        <Alert variant="primary">
          There are no jobs associated with this event.
        </Alert>
      )
    }
    const defaultJobName = jobs[0].name
    return (
      <Tab.Container defaultActiveKey={defaultJobName}>
        <Row>
          <Col sm={3}>
            <Nav variant="pills" className="flex-column">
              {jobs.map((job: core.Job) => (
                <Nav.Item>
                  <Nav.Link eventKey={job.name}>
                    <JobPhaseIcon phase={job.status?.phase} />
                    &nbsp;&nbsp;{job.name}
                  </Nav.Link>
                </Nav.Item>
              ))}
            </Nav>
          </Col>
          <Col sm={9}>
            <Tab.Content>
              {jobs.map((job: core.Job) => (
                <Tab.Pane eventKey={job.name} mountOnEnter>
                  <JobTabPane key={job.name} event={event} job={job} />
                </Tab.Pane>
              ))}
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    )
  }
}

interface JobTabPaneProps {
  event: core.Event
  job: core.Job
}

class JobTabPane extends React.Component<JobTabPaneProps> {
  render(): React.ReactElement {
    const event = this.props.event
    const job = this.props.job
    let usesSource = job.spec.primaryContainer.sourceMountPath ? true : false
    if (!usesSource && job.spec.sidecarContainers) {
      Object.keys(job.spec.sidecarContainers).forEach(
        (containerName: string) => {
          if (
            job.spec.sidecarContainers &&
            job.spec.sidecarContainers[containerName] &&
            job.spec.sidecarContainers[containerName].sourceMountPath
          ) {
            usesSource = true
          }
        }
      )
    }
    return (
      <div>
        <Tabs defaultActiveKey="summary" className="mb-3" mountOnEnter={true}>
          <Tab eventKey="summary" title="Summary">
            <JobSummary job={job} />
          </Tab>
          <Tab eventKey="yaml" title="YAML">
            <YAMLViewer object={job} />
          </Tab>
          {usesSource ? (
            <Tab eventKey="git-initializer-logs" title="Git Initializer Logs">
              <LogStreamer
                event={event}
                jobName={job.name}
                containerName="vcs"
                logKey="vcs"
              />
            </Tab>
          ) : null}
          <Tab eventKey={job.name} title={`${job.name} Logs`}>
            <LogStreamer event={event} jobName={job.name} logKey={job.name} />
          </Tab>
          {Object.keys(job.spec.sidecarContainers || {}).map(
            (containerName: string) => (
              <Tab eventKey={containerName} title={`${containerName} Logs`}>
                <LogStreamer
                  event={event}
                  jobName={job.name}
                  containerName={containerName}
                  logKey={`${job.name}-${containerName}`}
                />
              </Tab>
            )
          )}
        </Tabs>
      </div>
    )
  }
}

interface JobSummaryProps {
  job: core.Job
}

class JobSummary extends React.Component<JobSummaryProps> {
  render(): React.ReactElement {
    const job = this.props.job
    let phaseColor = "light"
    switch (job.status?.phase) {
      case core.JobPhase.Aborted:
        phaseColor = "danger"
        break
      case core.JobPhase.Canceled:
        phaseColor = "danger"
        break
      case core.JobPhase.Failed:
        phaseColor = "danger"
        break
      case core.JobPhase.Pending:
        phaseColor = "warning"
        break
      case core.JobPhase.Running:
        phaseColor = "warning"
        break
      case core.JobPhase.SchedulingFailed:
        phaseColor = "danger"
        break
      case core.JobPhase.Starting:
        phaseColor = "goldenrod"
        break
      case core.JobPhase.Succeeded:
        phaseColor = "success"
        break
      case core.JobPhase.TimedOut:
        phaseColor = "danger"
        break
    }
    return (
      <div>
        <Card border={phaseColor} bg="light">
          <Card.Header>
            <JobPhaseIcon phase={job.status?.phase} />
            &nbsp;&nbsp;
            {job.name}
          </Card.Header>
          <Card.Body>
            <Table borderless hover>
              <tbody>
                <tr>
                  <th>Created</th>
                  <td>Placeholder</td>
                </tr>
                {job.status?.started ? (
                  <tr>
                    <th>Started</th>
                    <td>
                      {moment(job.status?.started)
                        .utc()
                        .format("YYYY-MM-DD HH:mm:ss Z")}
                    </td>
                  </tr>
                ) : null}
                {job.status?.ended ? (
                  <tr>
                    <th>Ended</th>
                    <td>
                      {moment(job.status?.started)
                        .utc()
                        .format("YYYY-MM-DD HH:mm:ss Z")}
                    </td>
                  </tr>
                ) : null}
                {job.status?.ended ? (
                  <tr>
                    <th>Duration</th>
                    <td>
                      {moment
                        .duration(
                          moment(job.status?.ended).diff(
                            moment(job.status?.started)
                          )
                        )
                        .humanize()}
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
        <h2 className="section-heading">Containers</h2>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{job.name} (primary container)</td>
              <td>{job.spec.primaryContainer.image}</td>
            </tr>
            {Object.entries(job.spec.sidecarContainers || {}).map(
              (entry: unknown[]) => (
                <tr>
                  <td>{entry[0] as string}</td>
                  <td>{(entry[1] as core.ContainerSpec).image}</td>
                </tr>
              )
            )}
          </tbody>
        </Table>
      </div>
    )
  }
}
