import React, { Component } from "react";
import FadeIn from "./FadeIn";
import AudioVisualizer from "./AudioVisualizer";

class Header extends Component {
  constructor() {
    super();
    this.state = {
      imageNumber: Math.floor(Math.random() * 4)
    };
  }

  render() {
    if (!this.props.data) return null;

    const project = this.props.data.project;
    const github = this.props.data.github;
    const name = this.props.data.name;
    const description = this.props.data.description;

    return (
      <header id="home">
        <div>
          {/* TODO: <image alt={""} src={process.env.PUBLIC_URL + '/images/audio-button.png'} style={{position: "absolute", zIndex: "3", top: "50%", left: "50%"}}/> */}
          <AudioVisualizer style={{width: "100%", position: "absolute", zIndex: "0", top: "0px", left: "0px"}} />
          <img alt={""} src={process.env.PUBLIC_URL + '/images/main_images/' + this.state.imageNumber + '.jpeg'} style={{width: "100%", position: "absolute", zIndex: "-3", top: "0px", left: "0px"}}/>
        </div>

        <nav id="nav-wrap">
          <a className="mobile-btn" href="#nav-wrap" title="Show navigation">
            Show navigation
          </a>
          <a className="mobile-btn" href="#home" title="Hide navigation">
            Hide navigation
          </a>

          <ul id="nav" className="nav">
            <li className="current">
              <a className="smoothscroll" href="#home">
                Home
              </a>
            </li>

            <li>
              <a className="smoothscroll" href="#about">
                About
              </a>
            </li>

            <li>
              <a className="smoothscroll" href="#resume">
                Resume
              </a>
            </li>

            <li>
              <a className="smoothscroll" href="#portfolio">
                Works
              </a>
            </li>

            <li>
              <a className="smoothscroll" href="#contact">
                Contact
              </a>
            </li>
          </ul>
        </nav>

        <div className="row banner">
          <div className="banner-text">
            <FadeIn>
              <h1 className="responsive-headline">{name}</h1>
            </FadeIn>
            <FadeIn>
              <h3>{description}.</h3>
            </FadeIn>
            <hr />
            <FadeIn>
              <ul className="social">
                <a href={project} className="button btn project-btn">
                  <i className="fa fa-book"></i>Project
                </a>
                <a href={github} className="button btn github-btn">
                  <i className="fa fa-github"></i>Github
                </a>
              </ul>
            </FadeIn>
          </div>
        </div>

        <p className="scrolldown">
          <a className="smoothscroll" href="#about">
            <i className="icon-down-circle"></i>
          </a>
        </p>
      </header>
    );
  }
}

export default Header;
