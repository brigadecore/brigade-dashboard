import moment from "moment"

import React from "react"

import Table from "react-bootstrap/Table"

import { Link } from "react-router-dom"

import { authn, meta } from "@brigadecore/brigade-sdk"

import getClient from "./Client"
import LockIcon from "./components/LockIcon"
import withPagingControl from "./components/PagingControl"

const serviceAccountListPageSize = 20

interface ServiceAccountListItemProps {
  serviceAccount: authn.ServiceAccount
}

class ServiceAccountListItem extends React.Component<ServiceAccountListItemProps> {
  refresh = async () => {
    this.setState({
      locked: (
        await getClient()
          .authn()
          .serviceAccounts()
          .get(this.props.serviceAccount.metadata.id)
      ).locked
        ? true
        : false
    })
  }

  componentDidMount(): void {
    this.refresh()
  }

  render(): React.ReactElement {
    const serviceAccount = this.props.serviceAccount
    const linkTo = "/service-accounts/" + serviceAccount.metadata.id
    return (
      <tr>
        <td>
          <LockIcon locked={serviceAccount.locked ? true : false} />
          &nbsp;&nbsp;
          <Link to={linkTo}>{this.props.serviceAccount.metadata.id}</Link>
        </td>
        <td>{this.props.serviceAccount.description}</td>
        <td>
          {moment(this.props.serviceAccount.metadata.created).fromNow(true)}
        </td>
      </tr>
    )
  }
}

export default withPagingControl(
  (
    props: unknown,
    continueVal: string
  ): Promise<meta.List<authn.ServiceAccount>> => {
    return getClient().authn().serviceAccounts().list(
      {},
      {
        continue: continueVal,
        limit: serviceAccountListPageSize
      }
    )
  },
  (serviceAccounts: authn.ServiceAccount[]): React.ReactElement => {
    return (
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Username</th>
            <th>Name</th>
            <th>Age</th>
          </tr>
        </thead>
        <tbody>
          {serviceAccounts.map((serviceAccount: authn.ServiceAccount) => (
            <ServiceAccountListItem
              key={serviceAccount.metadata.id}
              serviceAccount={serviceAccount}
            />
          ))}
        </tbody>
      </Table>
    )
  }
)
