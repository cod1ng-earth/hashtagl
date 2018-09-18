import React, { Component } from 'react';
import {Tag, Container, Field, Label, Control, Input} from 'bloomer';
import './all.css'

class Results extends Component {
  
  render() {
    const tags = Object.keys(this.props.tags).map(t => (
      <Tag isColor={this.props.tags[t] ? 'success': 'dark' } isSize='large' key={`tag-${t}`} onClick={() => {this.props.onTagToggle(t)} }>
        {t}
      </Tag>
    ) )

    return (
      <div>
        {tags.length ? <Label isSize="large">tags</Label> : ''}
        {tags}
        
      </div>
    );
  }
}

export default Results;
