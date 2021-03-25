import React, { Component } from "react";
import styles from "./NewIssue.module.css";
import marked from "marked";

export default class NewIssue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      body: "",
      preview: false,
    };
  }

  handleChange = (event) => {
    this.setState({ title: event.target.value });
  };
  handleChangeBody = (event) => {
    this.setState({ body: event.target.value });
  };
  handleSubmit = async (event) => {
    event.preventDefault();
    const { title, body } = this.state;
    console.log(title, body);
    const issue = {
      owner: "ravikrishnudu",
      repo: "git",
      title: title,
      body: body,
    };

    fetch("https://api.github.com/repos/ravikrishnudu/git/issues", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.REACT_APP_TOKEN}`,
      },
      body: JSON.stringify(issue),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  handlePreview = () => {
    this.setState({ preview: true });
  };

  handleWrite = () => {
    this.setState({ preview: false });
  };
  render() {
    const { title, body, preview } = this.state;
    // console.log(title, "title", body);
    return (
      <>
        <form onSubmit={this.handleSubmit}>
          <div className={styles.commentWrapper}>
            <div>
              <img
                className={styles.avatarUrl}
                alt="profile -img"
                src="https://avatars.githubusercontent.com/u/52109411?s=80&v=4"
              />
            </div>
            <div className={styles.leftArrow}>
              <div className={styles.commentBox}>
                <div className={styles.inputSurrounding}>
                  <input
                    className={styles.titleInput}
                    placeholder="Title"
                    value={title}
                    onChange={(event) => this.handleChange(event)}
                  />
                </div>
                <div className={styles.tabContainer}>
                  <div className={styles.commentTabNav}>
                    <div className={styles.TabNavTabs}>
                      <button
                        type="button"
                        className={styles.writeButton}
                        onClick={this.handleWrite}
                      >
                        Write
                      </button>
                      <button
                        type="button"
                        className={styles.prevButton}
                        onClick={this.handlePreview}
                      >
                        Preview
                      </button>
                    </div>
                  </div>
                  <div className={styles.writeContent}>
                    {preview ? (
                      <div
                        className={styles.commentTextarea}
                        // style={{ background: "red" }}
                      >
                        {body}
                      </div>
                    ) : (
                      <textarea
                        placeholder="Leave a comment"
                        className={styles.commentTextarea}
                        value={body}
                        onChange={(event) => this.handleChangeBody(event)}
                      />
                    )}

                    <div className={styles.dragAndDropText}>
                      <span className={styles.dragText}>
                        Attach files by draging & dropping, selecting or pasting
                        them.
                      </span>
                    </div>
                  </div>
                  <div className={styles.markdownButton}>
                    <span className={styles.markdownText}>
                      Styling with Markdown is supported
                    </span>

                    <button
                      // className={styles.newIssuebtn}
                      className={
                        title ? styles.disabledButton : styles.newIssuebtn
                      }
                      type="submit"
                    >
                      Submit new issue
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </>
    );
  }
}
