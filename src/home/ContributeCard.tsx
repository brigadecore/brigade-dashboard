import { faGithub } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import React from "react"

import Card from "react-bootstrap/Card"

export default class ContributeCard extends React.Component {

  render(): React.ReactElement {
    return (
      <Card bg="light">
        <Card.Header>
          Contribute
        </Card.Header>
        <Card.Body>
          <ul className="links">
            <li>
              <FontAwesomeIcon icon={faGithub}/>
              &nbsp;&nbsp;
              <a href="https://github.com/brigadecore" target="_blank">Check us out on GitHub!</a>
            </li>
          </ul>
        </Card.Body>
      </Card>
    )
  }

}
