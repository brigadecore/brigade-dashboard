import React from "react"

import Table from "react-bootstrap/Table"

import { Link } from "react-router-dom"

import libAuthz from "@brigadecore/brigade-sdk/dist/lib/authz"

import PrincipalIcon from "./PrincipalIcon"
import { authz, meta } from "@brigadecore/brigade-sdk"

import { getClient } from "./Utils"
import withPagingControl from "./components/PagingControl"

const permissionsListPageSize = 20

interface SystemPermissionsListItemProps {
  roleAssignment: libAuthz.RoleAssignment
  suppressPrincipalColumn?: boolean
}

interface SystemPermissionsListItemState {
  locked: boolean | null
}

class SystemPermissionsListItem extends React.Component<
  SystemPermissionsListItemProps,
  SystemPermissionsListItemState
> {
  constructor(props: SystemPermissionsListItemProps) {
    super(props)
    this.state = {
      locked: null
    }
  }

  async componentDidMount(): Promise<void> {
    if (!this.props.suppressPrincipalColumn) {
      let locked: boolean | null = null
      switch (this.props.roleAssignment.principal.type) {
        case authz.PrincipalTypeServiceAccount:
          locked = (
            await getClient()
              .authn()
              .serviceAccounts()
              .get(this.props.roleAssignment.principal.id)
          ).locked
            ? true
            : false
          break
        case authz.PrincipalTypeUser:
          locked = (
            await getClient()
              .authn()
              .users()
              .get(this.props.roleAssignment.principal.id)
          ).locked
            ? true
            : false
          break
      }
      this.setState({
        locked: locked
      })
    }
  }

  render(): React.ReactElement {
    const linkTo =
      this.props.roleAssignment.principal.type ===
      authz.PrincipalTypeServiceAccount
        ? "/service-accounts/" + this.props.roleAssignment.principal.id
        : "/users/" + this.props.roleAssignment.principal.id
    return (
      <tr>
        {this.props.suppressPrincipalColumn ? null : (
          <td>
            <PrincipalIcon
              principalType={this.props.roleAssignment.principal.type}
              locked={this.state.locked}
            />
            &nbsp;&nbsp;
            <Link to={linkTo}>{this.props.roleAssignment.principal.id}</Link>
          </td>
        )}
        <td>{this.props.roleAssignment.role}</td>
        <td>{this.props.roleAssignment.scope}</td>
      </tr>
    )
  }
}

interface SystemPermissionsListProps {
  selector?: authz.RoleAssignmentsSelector
}

export default withPagingControl(
  (
    props: SystemPermissionsListProps,
    continueVal: string
  ): Promise<meta.List<libAuthz.RoleAssignment>> => {
    return getClient().authz().roleAssignments().list(props.selector, {
      continue: continueVal,
      limit: permissionsListPageSize
    })
  },
  (
    roleAssignments: libAuthz.RoleAssignment[],
    props: SystemPermissionsListProps
  ): React.ReactElement => {
    const suppressPrincipalColumn = props.selector?.principal ? true : false
    return (
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            {suppressPrincipalColumn ? null : <th>Principal</th>}
            <th>Role</th>
            <th>Scope</th>
          </tr>
        </thead>
        <tbody>
          {roleAssignments.map((roleAssignment: libAuthz.RoleAssignment) => (
            <SystemPermissionsListItem
              key={
                roleAssignment.principal.type +
                ":" +
                roleAssignment.principal.id +
                ":" +
                roleAssignment.role
              }
              roleAssignment={roleAssignment}
              suppressPrincipalColumn={suppressPrincipalColumn}
            />
          ))}
        </tbody>
      </Table>
    )
  }
)
