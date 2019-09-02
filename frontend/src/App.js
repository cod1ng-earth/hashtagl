import React, { Component } from "react";
import {
  Section,
  Container,
  Button,
  Field,
  Label,
  Control,
  Input,
  TextArea,
  Icon,
  Image
} from "bloomer";

import CopyToClipboard from "react-copy-to-clipboard";
import Results from "./Results";
import logo_txb from "./thashb.png";

import "./all.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tag: "",
      tags: {},
      loading: false,
      copied: false
    };
    this.submitted = this.submitted.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleTagChange = this.handleTagChange.bind(this);
  }

  _fetch(tag) {
    const url = process.env.REACT_APP_API_ENDPOINT + "/tags/?tag=" + tag;

    this.setState({ loading: true });
    fetch(url, {
      method: "GET"
    }).then(resp => {
      if (!resp.ok) {
        console.log(resp.status);
        this.setState({ tags: {}, loading: false });
        return;
      }

      resp.json().then(json => {
        const tags = {};
        let i = 0;
        json.tags.forEach(t => (tags[t] = i++ < 21));
        this.setState({ tags, loading: false });
      });
    });
  }

  toggle(tag) {
    const tags = this.state.tags;
    tags[tag] = !tags[tag];
    this.setState({ tags, copied: false });
  }

  submitted(evt) {
    evt.preventDefault();
    this._fetch(this.state.tag);
    return false;
  }

  handleTagChange(evt) {
    this.setState({ tag: evt.target.value, copied: false });
  }

  render() {
    const texttags = Object.keys(this.state.tags)
      .filter(t => this.state.tags[t])
      .map(t => "#" + t)
      .join(" ");
    const dots = [".\n.\n.\n.\n.\n"];
    return (
      <div>
        <Section>
          <Container>
            <Image src={logo_txb} style={{ width: "40vw", margin: "0 auto" }} />
          </Container>
        </Section>
        <Section isSize="medium">
          <Container>
            <form onSubmit={this.submitted}>
              <Field>
                <Label isSize="large">search tags for</Label>
                <Control
                  className={
                    "is-large has-icons-left has-icons-right " +
                    (this.state.loading ? "is-loading" : "")
                  }
                >
                  <Input
                    type="text"
                    disabled={this.state.loading}
                    placeholder="one tag only"
                    className="is-rounded is-large"
                    value={this.state.tag}
                    onChange={this.handleTagChange}
                  />
                  <Icon className="icon is-large is-left">
                    <i className="fa fa-hashtag" />
                  </Icon>
                </Control>
              </Field>
            </form>
          </Container>
        </Section>

        <Section>
          <Container>
            <Results tags={this.state.tags} onTagToggle={this.toggle} />
          </Container>
        </Section>

        {texttags.length > 0 && (
          <Section>
            <Container>
              <Field>
                <Label isSize="large">
                  copy this{" "}
                  <CopyToClipboard
                    text={texttags ? dots + texttags : ""}
                    onCopy={() =>
                      this.setState({
                        copied: true
                      })
                    }
                  >
                    <Button isColor={this.state.copied ? "success" : "dark"}>
                      copy
                    </Button>
                  </CopyToClipboard>
                </Label>

                <Control>
                  <TextArea
                    isSize="large"
                    rows={10}
                    placeholder="copy this"
                    value={texttags ? dots + texttags : ""}
                    readOnly
                  />
                </Control>
              </Field>
            </Container>
          </Section>
        )}
      </div>
    );
  }
}

export default App;
