import React from "react"

import Card from "react-bootstrap/Card"
import Col from "react-bootstrap/Col"
import Container from "react-bootstrap/Container"
import Image from 'react-bootstrap/Image'
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
            <Image src={logo} fluid/>
          </Col>
        </Row>
        <Row>
          <Col>
            <BlogCard/>
          </Col>
          <Col>
            <ResourcesCard/>
            <ContributeCard/>
          </Col>
        </Row>
      </Container>
    )
  }

}
