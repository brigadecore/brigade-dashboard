import React from "react"

import Table from "react-bootstrap/Table"

import { core, meta } from "@brigadecore/brigade-sdk"

import getClient from "./Client"
import withPagingControl from "./components/PagingControl"

const secretListPageSize = 20

interface SecretListItemProps {
  secret: core.Secret
}

class SecretListItem extends React.Component<SecretListItemProps> {

  render(): React.ReactElement {
    return (
      <tr>
        <td>{this.props.secret.key}</td>
        <td>*** REDACTED ***</td>
      </tr>
    )
  }

}

interface SecretListProps {
  projectID: string
}

export default withPagingControl(
  (props: SecretListProps, continueVal: string): Promise<meta.List<core.Secret>>  => {
    return getClient().core().projects().secrets().list(props.projectID, {
      continue: continueVal,
      limit: secretListPageSize
    })
  },
  (secrets: core.Secret[]): React.ReactElement => {
    return (
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Key</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {
            secrets.map((secret: core.Secret) => (
              <SecretListItem key={secret.key} secret={secret}/>
            ))
          }
        </tbody>
      </Table>
    )
  }
)
