import React, { Component } from 'react';
import {Section, Container, Field, Label, Control, Input, TextArea} from 'bloomer';

import Results from './Results';

import './all.css'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tag: '',
      tags: {},
      loading: false
    }
    this.submitted = this.submitted.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleTagChange = this.handleTagChange.bind(this);
  }
  
  _fetch(tag) {
    const url = process.env.REACT_APP_API_ENDPOINT + '?tag=' + tag;
    
    this.setState({loading: true})
    fetch(url, {
      method: 'GET',
    }).then(resp => {
      if (!resp.ok) {
        console.log(resp.status);
        this.setState({tags: {}, loading: false })
        return;
      }

      resp.json().then(json => {
        const tags = {}; let i = 0;
        json.tags.forEach(t => tags[t] = i++<21)
        this.setState({tags, loading: false});
      })
    })
  }

  toggle(tag) {
    const tags = this.state.tags
    tags[tag] = !tags[tag]
    this.setState({tags})
  }

  submitted(evt) {
    evt.preventDefault();
    this._fetch(this.state.tag);
    return false;
  }

  handleTagChange(evt) {
    this.setState({tag: evt.target.value});
  }

  render() {
    const texttags = Object.keys(this.state.tags)
          .filter(t => this.state.tags[t])
          .map(t => '#' + t)
          .join(' ');
    const dots = [".\n.\n.\n.\n.\n"]
    return (
      <div>
      <Section isSize="medium">
        <Container>
          <form onSubmit={this.submitted}>
          <Field>
            <Label isSize="large">#Tag</Label>
            <Control className={this.state.loading ? "is-loading" : "has-icons-left"}>
               <span class="icon is-medium is-left"><i class="fas fa-envelope"></i></span>
                <Input type="text" 
                       disabled={this.state.loading}
                       placeholder='one tag only' 
                       className="is-rounded" 
                       isSize="large" 
                       value={this.state.tag} 
                       onChange={this.handleTagChange} 
                      />
                      
            </Control>
          </Field>
          </form>
        </Container>
      </Section>

      <Section>
        <Container>
        <Results tags={this.state.tags} onTagToggle={this.toggle}/>
        <Field>
          <Control>
              <TextArea placeholder="copy this" value={texttags ? dots + texttags : ''} readOnly />
          </Control>
        </Field>
        </Container>
      </Section>
      </div>
    );
  }
}

export default App;
