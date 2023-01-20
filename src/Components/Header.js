import React, { Component } from "react";
import AudioVisualizer from "./AudioVisualizer";

class Header extends Component {
  constructor() {
    super();
    this.state = {
      imageNumber: Math.floor(Math.random() * 2)
    };
  }

  render() {
    if (!this.props.data) return null;

    //const name = this.props.data.name;
    //const description = this.props.data.description;

    return (
      <header id="home">
        <div className="main-visual-container">
          <AudioVisualizer style={{width: "100%", position: "absolute", zIndex: "0", top: "0px", left: "0px"}} imageNumber={this.state.imageNumber} />
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
