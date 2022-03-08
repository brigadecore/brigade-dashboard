import { faSlack, faTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons"
import { faBlog, faBook } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import React from "react"

import Card from "react-bootstrap/Card"

import styles from "./ResourcesCard.module.scss"

export default class ResourcesCard extends React.Component {

  render(): React.ReactElement {
    return (
      <Card bg="light">
        <Card.Header>
          Resources
        </Card.Header>
        <Card.Body>
          <ul className={styles.links}>
            <li>
              <FontAwesomeIcon icon={faBook}/>
              &nbsp;&nbsp;
              <a href="https://docs.brigade.sh/" target="_blank" rel="noreferrer">Documentation</a>
              <ul>
                <li>
                  <a href="https://quickstart.brigade.sh/" target="_blank" rel="noreferrer">QuickStart</a>
                </li>
              </ul>
            </li>
            <li>
              <FontAwesomeIcon icon={faBlog}/>
              &nbsp;&nbsp;
              <a href="https://blog.brigade.sh/" target="_blank" rel="noreferrer">Blog</a>
            </li>
            <li>
              <FontAwesomeIcon icon={faYoutube}/>
              &nbsp;&nbsp;
              <a href="https://youtube.brigade.sh/" target="_blank" rel="noreferrer">YouTube Channel</a>
              <ul>
                <li>
                  <a href="https://www.youtube.com/watch?v=VFyvYOjm6zc" target="_blank" rel="noreferrer">Video QuickStart</a>
                </li>
                <li>
                  <a href="https://www.youtube.com/playlist?list=PLUfRhEZrmeaSWQCvOSs3bbq1NpbSVCW6v" target="_blank" rel="noreferrer">Brigade in 5 Minutes Series</a>
                </li>
              </ul>
            </li>
            <li>
              <FontAwesomeIcon icon={faSlack}/>
              &nbsp;&nbsp;
              <a href="https://slack.brigade.sh/" target="_blank" rel="noreferrer">Slack Channel</a>
            </li>
            <li>
              <FontAwesomeIcon icon={faTwitter}/>
              &nbsp;&nbsp;
              <a href="https://twitter.com/brigadecore/" target="_blank" rel="noreferrer">Twitter Channel</a>
            </li>
          </ul>
        </Card.Body>
      </Card>
    )
  }

}
