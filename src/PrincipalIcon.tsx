import { faQuestion, faServer, faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import React from "react"

import Spinner from "react-bootstrap/Spinner"

import { authz } from "@brigadecore/brigade-sdk"
import libAuthz from "@brigadecore/brigade-sdk/dist/lib/authz"

interface PrincipalIconProps {
  principalType: libAuthz.PrincipalType
  locked: boolean | null
}

export default class PrincipalIcon extends React.Component<PrincipalIconProps> {

  render(): React.ReactElement {
    if (this.props.locked === null) {
      return <Spinner animation="border" size="sm"/>
    }
    let icon = faQuestion
    const color = this.props.locked ? "firebrick" : "green"
    switch(this.props.principalType) {
    case authz.PrincipalTypeServiceAccount:
      icon = faServer
      break
    case authz.PrincipalTypeUser:
      icon = faUser
      break
    }
    return <FontAwesomeIcon icon={icon} color={color}/>
  }

}
