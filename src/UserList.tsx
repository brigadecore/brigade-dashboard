import moment from "moment"

import React from "react"

import Table from "react-bootstrap/Table"

import { Link } from "react-router-dom"

import { authn, meta } from "@brigadecore/brigade-sdk"

import getClient from "./Client"
import LockIcon from "./components/LockIcon"
import withPagingControl from "./components/PagingControl"

const userListPageSize = 20

interface UserListItemProps {
  user: authn.User
}

class UserListItem extends React.Component<UserListItemProps> {
  render(): React.ReactElement {
    const user = this.props.user
    const linkTo = "/users/" + this.props.user.metadata.id
    return (
      <tr>
        <td>
          <LockIcon locked={user.locked ? true : false} />
          &nbsp;&nbsp;
          <Link to={linkTo}>{this.props.user.metadata.id}</Link>
        </td>
        <td>{this.props.user.name}</td>
        <td>{moment(this.props.user.metadata.created).fromNow()}</td>
      </tr>
    )
  }
}

export default withPagingControl(
  (props: unknown, continueVal: string): Promise<meta.List<authn.User>> => {
    return getClient().authn().users().list(
      {},
      {
        continue: continueVal,
        limit: userListPageSize
      }
    )
  },
  (users: authn.User[]): React.ReactElement => {
    return (
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Username</th>
            <th>Name</th>
            <th>First Seen</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: authn.User) => (
            <UserListItem key={user.metadata.id} user={user} />
          ))}
        </tbody>
      </Table>
    )
  }
)
