import React from "react"

import Button from "react-bootstrap/Button"

interface LoginControlProps {
  loggedIn: string
  onLogin: () => void
  onLogout: () => void
}

export default class LoginControl extends React.Component<LoginControlProps> {
  render(): React.ReactElement {
    let button
    if (!this.props.loggedIn) {
      button = (
        <Button variant="outline-light" onClick={this.props.onLogin}>
          Login
        </Button>
      )
    } else {
      button = (
        <Button variant="outline-light" onClick={this.props.onLogout}>
          Logout
        </Button>
      )
    }
    return <div>{button}</div>
  }
}
