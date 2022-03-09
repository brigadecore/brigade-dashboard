import { faCheck, faClock, faPlay, faQuestion, faTimes } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import React from "react"

import Spinner from "react-bootstrap/Spinner"

import { core } from "@brigadecore/brigade-sdk"

interface WorkerPhaseIconProps {
  phase?: core.WorkerPhase | null
}

export default class WorkerPhaseIcon extends React.Component<WorkerPhaseIconProps> {

  render(): React.ReactElement {
    if (this.props.phase === undefined) {
      return <Spinner animation="border" size="sm"/>
    }
    let icon = faQuestion
    let color = "dimgray"
    switch(this.props.phase) {
    case core.WorkerPhase.Aborted:
      icon = faTimes
      color = "firebrick"
      break
    case core.WorkerPhase.Canceled:
      icon = faTimes
      color = "firebrick"
      break
    case core.WorkerPhase.Failed:
      icon = faTimes
      color = "firebrick"
      break
    case core.WorkerPhase.Pending:
      icon = faClock
      color = "goldenrod"
      break
    case core.WorkerPhase.Running:
      icon = faPlay
      color = "goldenrod"
      break
    case core.WorkerPhase.SchedulingFailed:
      icon = faTimes
      color = "firebrick"
      break
    case core.WorkerPhase.Starting:
      icon = faPlay
      color = "goldenrod"
      break
    case core.WorkerPhase.Succeeded:
      icon = faCheck
      color = "green"
      break
    case core.WorkerPhase.TimedOut:
      icon = faTimes
      color = "firebrick"
      break
    }
    return <FontAwesomeIcon icon={icon} color={color}/>
  }

}
