import moment from "moment"

import React from "react"

import Table from "react-bootstrap/Table"

import { Link } from "react-router-dom"

import { core, meta } from "@brigadecore/brigade-sdk"

import { getClient } from "./Utils"
import withPagingControl from "./components/PagingControl"
import WorkerPhaseIcon from "./WorkerPhaseIcon"

const eventListPageSize = 20

interface EventListItemProps {
  event: core.Event
  suppressProjectColumn?: boolean
}

class EventListItem extends React.Component<EventListItemProps> {
  render(): React.ReactElement {
    const event = this.props.event
    return (
      <tr>
        <td>
          <WorkerPhaseIcon phase={event.worker?.status.phase} />
          &nbsp;&nbsp;
          <Link to={"/events/" + event.metadata?.id}>
            {this.props.event.metadata?.id}
          </Link>
        </td>
        {this.props.suppressProjectColumn ? null : (
          <td>
            <Link to={"/projects/" + event.projectID}>
              {this.props.event.projectID}
            </Link>
          </td>
        )}
        <td>{this.props.event.source}</td>
        <td>{this.props.event.type}</td>
        <td>{moment(this.props.event.metadata?.created).fromNow(true)}</td>
      </tr>
    )
  }
}

interface EventListProps {
  selector?: core.EventsSelector
}

export default withPagingControl(
  (
    props: EventListProps,
    continueVal: string
  ): Promise<meta.List<core.Event>> => {
    return getClient().core().events().list(props.selector, {
      continue: continueVal,
      limit: eventListPageSize
    })
  },
  (events: core.Event[], props: EventListProps): React.ReactElement => {
    const suppressProjectColumn = props.selector?.projectID ? true : false
    return (
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            {suppressProjectColumn ? null : <th>Project</th>}
            <th>Source</th>
            <th>Type</th>
            <th>Age</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event: core.Event) => (
            <EventListItem
              key={event.metadata?.id}
              event={event}
              suppressProjectColumn={suppressProjectColumn}
            />
          ))}
        </tbody>
      </Table>
    )
  }
)
