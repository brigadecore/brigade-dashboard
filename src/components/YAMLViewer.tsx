import yaml from "js-yaml"

import React from "react"

import { Light as SyntaxHighlighter } from "react-syntax-highlighter"
import yamlSyntax from "react-syntax-highlighter/dist/esm/languages/hljs/yaml"
import style from "react-syntax-highlighter/dist/esm/styles/hljs/sunburst"

SyntaxHighlighter.registerLanguage('yaml', yamlSyntax)

interface YAMLViewerProps<T> {
  object: T
}

export default class YAMLViewer<T> extends React.Component<YAMLViewerProps<T>> {

  render(): React.ReactElement {
    return (
      <SyntaxHighlighter language="yaml" style={style}>
        {yaml.dump(this.props.object)}
      </SyntaxHighlighter>
    )
  }

}
