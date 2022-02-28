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

interface ServiceAccountProps {
  id: string
}

interface ServiceAccountState {
  serviceAccount?: authn.ServiceAccount
}

// TODO: Need to make this component auto-refresh
class ServiceAccount extends React.Component<ServiceAccountProps, ServiceAccountState> {

  constructor(props: ServiceAccountProps) {
    super(props)
    this.state = {}
  }

  async componentDidMount(): Promise<void> {
    this.setState({
      serviceAccount: await getClient().authn().serviceAccounts().get(this.props.id)
    })
  }

  render(): React.ReactElement {
    const serviceAccount = this.state.serviceAccount
    if (!serviceAccount) {
      return <Spinner/>
    }
    return (
      <div>
        <h1 className="page-heading">{serviceAccount?.metadata.id}</h1>
        <Tabs defaultActiveKey="summary" className="mb-3" mountOnEnter={true}>
          <Tab eventKey="summary" title="Summary">
            <ServiceAccountSummary serviceAccount={serviceAccount}/>
          </Tab>
          <Tab eventKey="system-permissions" title="System Permissions">
            <SystemPermissionsList selector={{principal: {type: authz.PrincipalTypeServiceAccount, id: this.props.id}}}/>
          </Tab>
          <Tab eventKey="project-permissions" title="Project Permissions">
            <ProjectPermissionsList selector={{principal: {type: authz.PrincipalTypeUser, id: this.props.id}}}/>
          </Tab>
        </Tabs>
      </div>
    )
  }

}

export default function RoutedServiceAccount(): React.ReactElement {
  const params: any = useParams()
  return <ServiceAccount id={params.id}/>
}

interface ServiceAccountSummaryProps {
  serviceAccount: authn.ServiceAccount
}

class ServiceAccountSummary extends React.Component<ServiceAccountSummaryProps> {

  render(): React.ReactElement {
    const serviceAccount = this.props.serviceAccount
    return (
      <Card border={serviceAccount.locked ? "danger" : "success"} bg="light">
        <Card.Header>
          <LockIcon locked={serviceAccount.locked ? true : false}/>
          &nbsp;&nbsp;
          {serviceAccount?.metadata.id}
        </Card.Header>
        <Card.Body>
          <Table borderless hover responsive>
            <tbody>
              <tr>
                <th>Description</th>
                <td>{serviceAccount.description}</td>
              </tr>
              <tr>
                <th>Created</th>
                <td>{moment(serviceAccount.metadata.created).format("YYYY-MM-DD HH:mm:ss Z")}</td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    )
  }

}
