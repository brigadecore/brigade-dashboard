import React from "react"

import UserList from "./UserList"

export default class Users extends React.Component {

  render(): React.ReactElement {
    return (
      <div>
        <h1 className="page-heading">Users</h1>
        <UserList/>
      </div>
    )
  }

}
