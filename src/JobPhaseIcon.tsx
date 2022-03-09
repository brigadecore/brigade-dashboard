import {
  faCheck,
  faClock,
  faPlay,
  faQuestion,
  faTimes
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import React from "react"

import { core } from "@brigadecore/brigade-sdk"

interface JobPhaseIconProps {
  phase?: core.JobPhase
}

export default class JobPhaseIcon extends React.Component<JobPhaseIconProps> {
  render(): React.ReactElement {
    let icon = faQuestion
    let color = "dimgray"
    switch (this.props.phase) {
      case core.JobPhase.Aborted:
        icon = faTimes
        color = "firebrick"
        break
      case core.JobPhase.Canceled:
        icon = faTimes
        color = "firebrick"
        break
      case core.JobPhase.Failed:
        icon = faTimes
        color = "firebrick"
        break
      case core.JobPhase.Pending:
        icon = faClock
        color = "goldenrod"
        break
      case core.JobPhase.Running:
        icon = faPlay
        color = "goldenrod"
        break
      case core.JobPhase.SchedulingFailed:
        icon = faTimes
        color = "firebrick"
        break
      case core.JobPhase.Starting:
        icon = faPlay
        color = "goldenrod"
        break
      case core.JobPhase.Succeeded:
        icon = faCheck
        color = "green"
        break
      case core.JobPhase.TimedOut:
        icon = faTimes
        color = "firebrick"
        break
    }
    return <FontAwesomeIcon icon={icon} color={color} />
  }
}
