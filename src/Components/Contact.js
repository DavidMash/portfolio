import React, { Component } from "react";
import FadeIn from "./FadeIn";
import SlideIn from "./SlideIn";

class Contact extends Component {
  render() {
    if (!this.props.data) return null;

    const message = this.props.data.contactmessage;

    return (
      <section id="contact">
        <FadeIn>
          <div className="row section-head">
            <div className="two columns header-col">
              <h1>
                <span>Get In Touch.</span>
              </h1>
            </div>

            <div className="ten columns">
              <p className="lead">{message}</p>
            </div>
          </div>
        </FadeIn>

        <div className="row">
          <SlideIn>
            <div className="eight columns">
              <form id="contactForm" name="contactForm">
                <fieldset>
                  {/*
                  <div>
                    <label htmlFor="contactName">
                      Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      defaultValue=""
                      size="35"
                      id="contactName"
                      name="contactName"
                      onChange={this.handleChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="contactEmail">
                      Email <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      defaultValue=""
                      size="35"
                      id="contactEmail"
                      name="contactEmail"
                      onChange={this.handleChange}
                    />
                  </div>
                  */}
                  <div>
                    <label htmlFor="contactSubject">Subject</label>
                    <input
                      type="text"
                      defaultValue=""
                      size="35"
                      id="contactSubject"
                      name="contactSubject"
                      onChange={this.handleChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="contactMessage">
                      Message <span className="required">*</span>
                    </label>
                    <textarea
                      cols="50"
                      rows="15"
                      id="contactMessage"
                      name="contactMessage"
                    ></textarea>
                  </div>

                  <div>
                    <button className="submit">Submit</button>
                    <span id="image-loader">
                      <img alt="" src="images/loader.gif" />
                    </span>
                  </div>
                </fieldset>
              </form>

              <div id="message-warning"> An error has occurred. Consider emailing davidmash134@gmail.com from your regular email service.</div>
              <div id="message-success">
                <i className="fa fa-check"></i>Your message was sent, thank you!
                <br />
              </div>
            </div>
          </SlideIn>

          <FadeIn>
            <aside className="four columns footer-widgets">
              <div className="widget widget_tweets">
                <h4 className="widget-title">Contact Me</h4>
                <ul id="twitter">
                  <li>
                    <span>
                      This form will link to your email so you can send me a message and we can connect. If you are a recruiter or a fellow engineer or musician/artist, I want to hear from you! I am open to commisions for projects and websites as well.
                    </span>
                  </li>
                </ul>
              </div>
            </aside>
          </FadeIn>
        </div>
      </section>
    );
  }
}

export default Contact;
