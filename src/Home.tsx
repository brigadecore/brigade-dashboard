import React from "react"

import Col from "react-bootstrap/Col"
import Container from "react-bootstrap/Container"
import Image from "react-bootstrap/Image"
import Row from "react-bootstrap/Row"

import BlogCard from "./home/BlogCard"
import ContributeCard from "./home/ContributeCard"
import ResourcesCard from "./home/ResourcesCard"

import logo from "./images/logo.png"
import styles from "./Home.module.scss"

export default class Home extends React.Component {
  render(): React.ReactElement {
    return (
      <Container>
        <Row>
          <Col className={styles.splash}>
            <Image src={logo} fluid />
          </Col>
        </Row>
        <Row xs={1} sm={1} md={1} lg={2} xl={2} xxl={2}>
          <Col>
            <BlogCard />
          </Col>
          <Col>
            <ResourcesCard />
            <ContributeCard />
          </Col>
        </Row>
      </Container>
    )
  }
}
