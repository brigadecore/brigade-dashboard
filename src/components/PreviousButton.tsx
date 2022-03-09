import { faChevronLeft } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import React from "react"

import Button from "react-bootstrap/Button"

interface PreviousButtonProps {
  onClick: () => void
}

export default class PreviousButton extends React.Component<PreviousButtonProps> {

  render(): React.ReactElement {
    return <Button onClick={this.props.onClick}><FontAwesomeIcon icon={faChevronLeft}/> Previous</Button>
  }

}
