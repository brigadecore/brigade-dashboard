import { faChevronRight } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import React from "react"

import Button from "react-bootstrap/Button"

interface NextButtonProps {
  onClick: () => void
}

export default class NextButton extends React.Component<NextButtonProps> {
  render(): React.ReactElement {
    return (
      <Button onClick={this.props.onClick}>
        Next <FontAwesomeIcon icon={faChevronRight} />
      </Button>
    )
  }
}
