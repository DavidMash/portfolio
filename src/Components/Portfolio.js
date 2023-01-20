import React, { Component } from "react";
import FadeIn from "./FadeIn";

let id = 0;
class Portfolio extends Component {
  render() {
    if (!this.props.data) return null;

    const projects = this.props.data.projects.map(function (project) {
      let projectImage = "images/portfolio/" + project.image;

      return (
        <button key={id++} className="columns portfolio-item">
          <div className="item-wrap">
            <a href={project.link} target="_blank" rel="noopener noreferrer">
              <img className={"project-link-image"} alt={project.title} src={projectImage} />
              <h5 style={{ textAlign: "center" }}>{project.title}</h5>
              <div style={{ textAlign: "center" }}>{project.description}</div>
            </a>
          </div>
        </button>
      );
    });

    return (
      <section id="portfolio">
        <FadeIn>
          <div className="row">
            <div className="twelve columns collapsed">
              <h1>Here is some things I have worked on.</h1>

              <div
                id="portfolio-wrapper"
                className="bgrid-quarters s-bgrid-thirds cf"
              >
                {projects}
              </div>
            </div>
          </div>
        </FadeIn>
      </section>
    );
  }
}

export default Portfolio;
