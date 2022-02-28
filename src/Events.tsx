import React from "react"

import EventList from "./EventList"

export default class Events extends React.Component {

  render(): React.ReactElement {
    return (
      <div>
        <h1 className="page-heading">All Events</h1>
        <EventList/>
      </div>
    )
  }

}
