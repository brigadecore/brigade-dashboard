import React from "react"

import { core } from "@brigadecore/brigade-sdk"

import getClient from "../Client"

import styles from "./LogStreamer.module.scss"

interface LogStreamerProps {
  event: core.Event
  jobName?: string
  containerName?: string
  logKey: string
}

export default class LogStreamer extends React.Component<LogStreamerProps> {

  logStream?: core.LogEntryStream
  logBoxID: string

  constructor(props: LogStreamerProps) {
    super(props)
    this.logBoxID = `${props.logKey}-log-box`
  }

  async componentDidMount(): Promise<void> {
    const logsClient = getClient().core().events().logs()
    const event = this.props.event
    if (event.metadata?.id) {
      this.logStream = logsClient.stream(
        event.metadata?.id, {
          job: this.props.jobName,
          container: this.props.containerName
        },
        {follow: true}
      )
      const logBox = document.getElementById(this.logBoxID)
      if (logBox) {
        this.logStream.onData((logEntry: core.LogEntry) => {  
          logBox.innerHTML += logEntry.message + "<br/>"
        })
      }
    }
  }

  async componentWillUnmount(): Promise<void> {
    if (this.logStream) {
      this.logStream.close()
    }
  }

  render(): React.ReactElement {
    return (
      <pre id={this.logBoxID} className={styles["log-box"]}/>
    )
  }

}
