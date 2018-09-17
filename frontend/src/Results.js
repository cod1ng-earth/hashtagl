import React, { Component } from 'react';
import {Tag, Container, Field, Label, Control, Input} from 'bloomer';
import './all.css'

class Results extends Component {
  
  render() {
    const tags = Object.keys(this.props.tags).map(t => (
      <Tag isColor={this.props.tags[t] ? 'success': 'light' } isSize='large' key={`tag-${t}`} onClick={() => {this.props.onTagToggle(t)} }>
        {t}
      </Tag>
    ) )

    return (
      <div>
        {tags}
      </div>
    );
  }
}

export default Results;
