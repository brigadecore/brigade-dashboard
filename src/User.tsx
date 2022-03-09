import moment from "moment"

import React from "react"

import Card from "react-bootstrap/Card"
import Tab from "react-bootstrap/Tab"
import Table from "react-bootstrap/Table"
import Tabs from "react-bootstrap/Tabs"

import { useParams } from "react-router-dom"

import { authn, authz } from "@brigadecore/brigade-sdk"

import getClient from "./Client"
import LockIcon from "./components/LockIcon"
import ProjectPermissionsList from "./ProjectPermissionsList"
import Spinner from "./components/Spinner"
import SystemPermissionsList from "./SystemPermissionsList"

interface UserProps {
  id: string
}

interface UserState {
  user?: authn.User
}

// TODO: Need to make this component auto-refresh
class User extends React.Component<UserProps, UserState> {

  constructor(props: UserProps) {
    super(props)
    this.state = {}
  }

  async componentDidMount(): Promise<void> {
    this.setState({
      user: await getClient().authn().users().get(this.props.id)
    })
  }

  render(): React.ReactElement {
    const user = this.state.user
    if (!user) {
      return <Spinner/>
    }
    return (
      <div>
        <h1 className="page-heading">{user?.metadata.id}</h1>
        <Tabs defaultActiveKey="summary" className="mb-3" mountOnEnter={true}>
          <Tab eventKey="summary" title="Summary">
            <UserSummary user={user}/>
          </Tab>
          <Tab eventKey="system-permissions" title="System Permissions">
            <SystemPermissionsList selector={{principal: {type: authz.PrincipalTypeUser, id: this.props.id}}}/>
          </Tab>
          <Tab eventKey="project-permissions" title="Project Permissions">
            <ProjectPermissionsList selector={{principal: {type: authz.PrincipalTypeUser, id: this.props.id}}}/>
          </Tab>
        </Tabs>
      </div>
    )
  }

}

export default function RoutedUser(): React.ReactElement {
  const params: any = useParams() // eslint-disable-line @typescript-eslint/no-explicit-any
  return <User id={params.id}/>
}

interface UserSummaryProps {
  user: authn.User
}

class UserSummary extends React.Component<UserSummaryProps> {

  render(): React.ReactElement {
    const user = this.props.user
    return (
      <Card border={user.locked ? "danger" : "success"} bg="light">
        <Card.Header>
          <LockIcon locked={user.locked ? true : false}/>
          &nbsp;&nbsp;
          {user?.metadata.id}
        </Card.Header>
        <Card.Body>
          <Table borderless hover responsive>
            <tbody>
              <tr>
                <th>Name</th>
                <td>{user.name}</td>
              </tr>
              <tr>
                <th>First Login</th>
                <td>{moment(user.metadata.created).format("YYYY-MM-DD HH:mm:ss Z")}</td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    )
  }

}
