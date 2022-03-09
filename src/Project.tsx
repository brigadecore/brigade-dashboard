import moment from "moment"

import React from "react"

import Card from "react-bootstrap/Card"
import Tab from "react-bootstrap/Tab"
import Table from "react-bootstrap/Table"
import Tabs from "react-bootstrap/Tabs"

import { Link, useParams } from "react-router-dom"

import { core } from "@brigadecore/brigade-sdk"

import getClient from "./Client"
import EventList from "./EventList"
import ProjectPermissionsList from "./ProjectPermissionsList"
import SecretsList from "./SecretsList"
import Spinner from "./components/Spinner"
import YAMLViewer from "./components/YAMLViewer"

interface ProjectProps {
  id: string
}

interface ProjectState {
  project?: core.Project
}

// TODO: Need to make this component auto-refresh
class Project extends React.Component<ProjectProps, ProjectState> {
  constructor(props: ProjectProps) {
    super(props)
    this.state = {}
  }

  async componentDidMount(): Promise<void> {
    this.setState({
      project: await getClient().core().projects().get(this.props.id)
    })
  }

  render(): React.ReactElement {
    const project = this.state.project
    if (!project) {
      return <Spinner />
    }
    return (
      <div>
        <h1 className="page-heading">{project?.metadata.id}</h1>
        <Tabs defaultActiveKey="summary" className="mb-3" mountOnEnter={true}>
          <Tab eventKey="summary" title="Summary">
            <ProjectSummary project={project} />
            <h2 className="section-heading">Events</h2>
            <EventList selector={{ projectID: project.metadata.id }} />
          </Tab>
          <Tab eventKey="yaml" title="YAML">
            <YAMLViewer object={project} />
          </Tab>
          <Tab eventKey="secrets" title="Secrets">
            <SecretsList projectID={project.metadata.id} />
          </Tab>
          <Tab eventKey="permissions" title="Permissions">
            <ProjectPermissionsList projectID={project.metadata.id} />
          </Tab>
        </Tabs>
      </div>
    )
  }
}

export default function RoutedProject(): React.ReactElement {
  const pathParams = useParams()
  return <Project id={pathParams.id || ""} />
}

interface ProjectSummaryProps {
  project: core.Project
}

class ProjectSummary extends React.Component<ProjectSummaryProps> {
  render(): React.ReactElement {
    const project = this.props.project
    return (
      <Card bg="light">
        <Card.Header>{project.metadata.id}</Card.Header>
        <Card.Body>
          <Table borderless hover responsive>
            <tbody>
              <tr>
                <th>Description</th>
                <td>{project.description}</td>
              </tr>
              <tr>
                <th>Created</th>
                <td>
                  {moment(project.metadata.created)
                    .utc()
                    .format("YYYY-MM-DD HH:mm:ss Z")}
                </td>
              </tr>
              {project.spec.workerTemplate.container?.image ? (
                <tr>
                  <th>Image</th>
                  <td>{project.spec.workerTemplate.container?.image}</td>
                </tr>
              ) : null}
              {project.spec.workerTemplate.git ? (
                <tr>
                  <th>Git</th>
                  <td>
                    <Table borderless hover>
                      <tbody>
                        {project.spec.workerTemplate.git.cloneURL ? (
                          <tr>
                            <th>Clone URL</th>
                            <td>
                              <Link
                                to={project.spec.workerTemplate.git.cloneURL}
                              >
                                {project.spec.workerTemplate.git.cloneURL}
                              </Link>
                            </td>
                          </tr>
                        ) : null}
                        {project.spec.workerTemplate.git.ref ? (
                          <tr>
                            <th>Ref</th>
                            <td>{project.spec.workerTemplate.git.ref}</td>
                          </tr>
                        ) : null}
                        {project.spec.workerTemplate.git.commit ? (
                          <tr>
                            <th>Commit</th>
                            <td>{project.spec.workerTemplate.git.commit}</td>
                          </tr>
                        ) : null}
                        {project.spec.workerTemplate.git.initSubmodules ? (
                          <tr>
                            <th>Initialize Submodules</th>
                            <td>True</td>
                          </tr>
                        ) : null}
                      </tbody>
                    </Table>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    )
  }
}
