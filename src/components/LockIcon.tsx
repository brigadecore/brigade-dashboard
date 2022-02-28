import { faLock, faUnlockAlt } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import React from "react"

interface LockIconProps {
  locked: boolean
}

export default class LockIcon extends React.Component<LockIconProps> {

  render(): React.ReactElement {
    if (this.props.locked) { 
      return <FontAwesomeIcon icon={faLock} color="firebrick"/>
    }
    return <FontAwesomeIcon icon={faUnlockAlt} color="green"/>
  }

}
