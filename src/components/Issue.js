import React, { Component } from "react";
import { formatDistance, parseISO } from "date-fns";

import Labels from "./Labels";
import CommentContainer from "./CommentContainer";
import {
  Listbox,
  ListboxInput,
  ListboxButton,
  ListboxPopover,
  ListboxList,
  ListboxOption,
} from "@reach/listbox";
import "@reach/listbox/styles.css";
// import Markdown from "./Markdown";
// import { LabelText } from "./Text";
import styles from "./Issue.module.css";
import newCommentstyles from "./NewIssue.module.css";

async function getIssue(issueNumber) {
  return fetch(
    `https://api.github.com/repos/ravikrishnudu/git/issues/${issueNumber}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_TOKEN}`,
      },
    }
  ).then((res) => res.json());
}

async function getComments(issueNumber) {
  return fetch(
    `https://api.github.com/repos/ravikrishnudu/git/issues/${issueNumber}/comments`,
    {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_TOKEN}`,
      },
    }
  ).then((res) => res.json());
}

async function getLabels() {
  return fetch(`https://api.github.com/repos/ravikrishnudu/git/labels`, {
    headers: {
      Authorization: `Bearer ${process.env.REACT_APP_TOKEN}`,
    },
  }).then((res) => res.json());
}
function IssueDetails({
  issue: { title, number, user, updated_at, comments },
}) {
  return (
    <div className={styles.issueDetails}>
      <div className={styles.titleBody}>
        <div className={styles.titleNameNumber}>
          <span className={styles.title}>{title} </span>
          <span className={styles.issueNumber}>#{number}</span>
        </div>
        <button className={styles.issueButton}>New issue</button>
      </div>
      <div className={styles.issueTitleDetails}>
        <button className={styles.openButton}>Open</button>
        <div className={styles.userDetails}>
          <span className={styles.userLogin}>{user.login}</span>
          <span>
            opened this issue {formatDistance(Date.now(), parseISO(updated_at))}{" "}
            ago
          </span>
          <span> {comments} comments</span>
        </div>
      </div>
    </div>
  );
}
class ListLabels extends Component {
  render() {
    const { label } = this.props;
    // console.log(label);
    return (
      <div>
        {/* <input type="checkbox" /> */}
        <div>
          <span style={{ backgroundColor: `#${label.color}` }}> {" .. "} </span>
          <span to={`/labels/${label.color}`}>{label.name}</span>
          <span>x</span>
        </div>
        <div>{label.description}</div>
        {/* <Listbox >
          <ListboxOption value="bojangles">{label.name}</ListboxOption>
          <ListboxOption value="churchs">{label.description}s</ListboxOption>
        </Listbox> */}
      </div>
    );
  }
}

class DiscussionSideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      labels: null,
    };
  }
  componentDidMount() {
    getLabels().then((labels) => {
      this.setState({ labels });
    });
  }
  render() {
    const { issue } = this.props;
    const { labels } = this.state;
    if (!labels) {
      return <div>Loading......</div>;
    }
    console.log(labels);
    return (
      <div className={styles.rightContainer}>
        <div className={styles.elementContainer}>
          <div className={styles.elementTitle}>Assignees</div>
          <div>
            {issue.assignees.length !== 0
              ? issue.assignees.map((assignee) => (
                  <div className={styles.dataCard}>
                    <img
                      className={styles.avataruserImage}
                      src={assignee.avatar_url}
                      alt="user profile logo"
                    />
                    <div>{assignee.login}</div>
                  </div>
                ))
              : "No one assigned"}
          </div>
        </div>
        <div className={styles.elementContainer}>
          <div className={styles.elementTitle}>Labels</div>

          <div>
            {labels.map((label) => (
              <ListLabels key={label.id} label={label} />
            ))}
          </div>
          <div className={styles.label}>
            <Labels labels={issue.labels} />
          </div>
        </div>
        <div className={styles.elementContainer}>
          <div className={styles.elementTitle}>Projects</div>
          <span className={styles.elementChild}>None yet</span>
        </div>
        <div className={styles.elementContainer}>
          <div className={styles.elementTitle}>Milestone</div>
          <span className={styles.elementChild}>None Milestone</span>
        </div>
        <div className={styles.elementContainer}>
          <div className={styles.elementTitle}>Linked pull requests</div>
          <p className={styles.elementChild}>
            Sucessfully merging a pull request may close this issue
          </p>
          <span className={styles.elementChild}>None yet</span>
        </div>
        <div className={styles.elementContainer}>
          <div className={styles.childElements}>
            <span className={styles.elementTitle}> Notifications</span>
            <span className={styles.elementChild}>Customize</span>
          </div>
          <button className={styles.subButton}>Subscribe</button>
          <p className={styles.elementChild}>
            You’re not receiving notifications from this thread.
          </p>
        </div>
        {/* </div> */}
      </div>
    );
  }
}

class NewComment extends Component {
  render() {
    const { body, handleChangeBody, handleSubmit } = this.props;
    return (
      <div>
        {" "}
        <form onSubmit={handleSubmit}>
          <div className={newCommentstyles.commentWrapper}>
            <div>
              <img
                className={newCommentstyles.avatarUrl}
                alt="profile -img"
                src="https://avatars.githubusercontent.com/u/52109411?s=80&v=4"
              />
            </div>
            <div className={newCommentstyles.leftArrow}>
              <div className={newCommentstyles.commentBox}>
                <div className={newCommentstyles.tabContainer}>
                  <div className={newCommentstyles.commentTabNav}>
                    <div className={newCommentstyles.TabNavTabs}>
                      <button
                        type="button"
                        className={newCommentstyles.writeButton}
                      >
                        Write
                      </button>
                      <button
                        type="button"
                        className={newCommentstyles.prevButton}
                      >
                        Preview
                      </button>
                    </div>
                  </div>
                  <div className={newCommentstyles.writeContent}>
                    <textarea
                      placeholder="Leave a comment"
                      className={newCommentstyles.commentTextarea}
                      value={body}
                      onChange={(event) => handleChangeBody(event)}
                    />

                    <div className={newCommentstyles.dragAndDropText}>
                      <span className={newCommentstyles.dragText}>
                        Attach files by draging & dropping, selecting or pasting
                        them.
                      </span>
                    </div>
                  </div>
                  <div className={styles.markDownButton}>
                    <button className={styles.closeButton}>Close issue</button>
                    <button
                      className={styles.commentButton}
                      // disabled={body.length !== 0 ? false : true}
                      type="submit"
                    >
                      Comment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

class Issue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      issue: null,
      comments: [],
      body: "",
    };
  }
  componentDidMount() {
    const number = this.props.match.params.number;
    getIssue(number).then((issue) => {
      this.setState({ issue });
    });

    getComments(number).then((comments) => {
      this.setState({ comments });
    });
  }

  handleChangeBody = (event) => {
    this.setState({ body: event.target.value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    const { body, issue } = this.state;
    const comment = {
      owner: "ravikrishnudu",
      repo: "git",
      issue_number: issue.number,
      body: body,
    };

    fetch(
      `https://api.github.com/repos/ravikrishnudu/git/issues/${issue.number}/comments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_TOKEN}`,
        },
        body: JSON.stringify(comment),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);

        getComments(issue.number).then((comments) => {
          this.setState({ comments, body: " " });
        });
      })

      .catch((error) => {
        console.error("Error:", error);
      });
  };

  render() {
    const { issue, comments, body } = this.state;
    if (!issue) {
      return <div>Loading....</div>;
    }
    console.log(issue);
    return (
      <div className={styles.mainContainer}>
        <IssueDetails issue={issue} />
        <div className={styles.bodyContainer}>
          <div>
            <CommentContainer {...issue} />

            <div className={styles.comments}>
              {comments.map((comment) => (
                <CommentContainer {...comment} key={comment.id} />
              ))}
            </div>
            <div className={styles.newComment}>
              <NewComment
                body={body}
                handleChangeBody={this.handleChangeBody}
                handleSubmit={this.handleSubmit}
              />
            </div>
          </div>
          <DiscussionSideBar issue={issue} />
        </div>
      </div>
    );
  }
}

export default Issue;
