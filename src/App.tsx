import React, { Fragment } from "react"

import Alert from "react-bootstrap/Alert"
import Container from "react-bootstrap/Container"
import Nav from "react-bootstrap/Nav"
import Navbar from "react-bootstrap/Navbar"

import { LinkContainer } from "react-router-bootstrap"
import { Outlet } from "react-router-dom"

import { getClient } from "./Utils"
import * as consts from "./Consts"
import Home from "./Home"
import LoginControl from "./LoginControl"

import "./App.scss"
import logoDark from "./images/logo-dark.png"

interface AppState {
  loggedIn: boolean
}

export default class App extends React.Component<unknown, AppState> {
  constructor(props: unknown) {
    super(props)
    this.state = {
      loggedIn: localStorage.getItem(consts.brigadeAPITokenKey) ? true : false
    }
  }

  handleLogin = async () => {
    const sessionsClient = getClient().authn().sessions()
    const thirdPartyAuthDetails = await sessionsClient.createUserSession({
      successURL: window.location.href
    })
    localStorage.setItem(consts.brigadeAPITokenKey, thirdPartyAuthDetails.token)
    window.location.href = thirdPartyAuthDetails.authURL
  }

  handleLogout = () => {
    this.setState({ loggedIn: false })
    localStorage.removeItem(consts.brigadeUserIdKey)
    localStorage.removeItem(consts.brigadeAPITokenKey)
  }

  render(): React.ReactElement {
    const loggedIn = this.state.loggedIn
    return (
      <Fragment>
        <header>
          <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
              <LinkContainer to="/">
                <Navbar.Brand>
                  <img src={logoDark} height="40" />
                </Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                  <LinkContainer to="/projects">
                    <Nav.Link>Projects</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/events">
                    <Nav.Link>Events</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/users">
                    <Nav.Link>Users</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/service-accounts">
                    <Nav.Link>Service Accounts</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/system-permissions">
                    <Nav.Link>System Permissions</Nav.Link>
                  </LinkContainer>
                </Nav>
                <LoginControl
                  loggedIn={loggedIn}
                  onLogin={this.handleLogin}
                  onLogout={this.handleLogout}
                />
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>
        <main>
          <Container>
            {loggedIn ? (
              <Outlet />
            ) : (
              <div>
                <Alert variant="primary">Log in to see this content.</Alert>
                <Home />
              </div>
            )}
          </Container>
        </main>
        <footer>
          <Navbar bg="dark" variant="dark" expand="lg" fixed="bottom">
            <Container>
              <span className="text-muted">
                &copy; 2022 The Brigade Authors
              </span>
            </Container>
          </Navbar>
        </footer>
      </Fragment>
    )
  }
}
