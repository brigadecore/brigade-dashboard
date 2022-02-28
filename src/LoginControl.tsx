import React from 'react'

import Button from "react-bootstrap/Button"

interface LoginControlProps {
  loggedIn: boolean
  onLogin: () => void
  onLogout: () => void
}

interface LoginControlState {
  loggedIn: boolean
}

export default class LoginControl extends React.Component<LoginControlProps, LoginControlState> {

  constructor(props: LoginControlProps) {
    super(props)
    this.state = {loggedIn: props.loggedIn}
  }

  handleLogin = () => {
    this.setState({loggedIn: true})
    this.props.onLogin()
  }

  handleLogout = () => {
    this.setState({loggedIn: false})
    this.props.onLogout()
  }

  render(): React.ReactElement {
    const loggedIn = this.state.loggedIn
    let button
    if (!loggedIn) {
      button = <Button variant="outline-light" onClick={this.handleLogin}>Login</Button>
    } else {
      button = <Button variant="outline-light" onClick={this.handleLogout}>Logout</Button>
    }
    return <div>{button}</div>
  }

}
