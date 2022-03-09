import React from "react"

import BootstrapSpinner from "react-bootstrap/Spinner"

import styles from "./Spinner.module.scss"

export default class Spinner extends React.Component {
  render(): React.ReactElement {
    return (
      <div className={styles["spinner-wrapper"]}>
        <BootstrapSpinner animation="border" variant="primary" />
      </div>
    )
  }
}
