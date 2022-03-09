import moment from "moment"

import React from "react"

import rssEnhancer, { InjectionRSSProps } from "react-rss"

import Card from "react-bootstrap/Card"

class BlogCard extends React.Component<InjectionRSSProps> {
  render(): React.ReactElement {
    const latest = this.props.rss.items[0]
    const date = moment(Date.parse(latest.pubDate)).format("DD MMM YYYY")
    return (
      <Card bg="light">
        <Card.Header>The latest from our blog...</Card.Header>
        <Card.Body>
          <Card.Title>{latest.title}</Card.Title>
          <Card.Subtitle className="text-muted">{date}</Card.Subtitle>
          <Card.Text dangerouslySetInnerHTML={{ __html: latest.description }} />
          <Card.Link href={latest.link} target="_blank">
            Read more
          </Card.Link>
        </Card.Body>
      </Card>
    )
  }
}

export default rssEnhancer(
  BlogCard,
  "https://blog.brigade.sh/index.xml",
  (url) => ({
    input: url,
    init: { headers: { Origin: window.location.origin } }
  })
)
