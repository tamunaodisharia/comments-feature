import {
  currentUserAvatar,
  currentUsername,
  currentUserAvatarWebp,
  setClass,
} from "./utils.js";
// import { editCommentComponent } from "./editComment.js";
import { upvoteComment, downvoteComment } from "./voting.js";
import { deleteComment } from "./deleteComment.js";

let replyToggle = false; // for checking if reply box component is already active
let globalID = 5; //for assigning id

export function addCommentComponent() {
  ////////// create node:  (component for adding new comments)
  // <div class="addComment">
  // <img src="../images/avatars/image-juliusomo.png" class="avatar" />
  // <textarea class="input" type="text" placeholder="Add a commment..." />
  // <button class="send" type="submit">SEND</button>

  // <div class="addComment">
  const addComment = document.createElement("div");
  setClass(addComment, "addComment");
  if (replyToggle) {
    //if the component is for replying to another comment, the style will change a bit
    setClass(addComment, "addReply");
  }

  // <img src="../images/avatars/image-juliusomo.png" class="avatar" />
  const avatar = document.createElement("img");
  setClass(avatar, "avatar");
  avatar.setAttribute("src", currentUserAvatar);
  addComment.append(avatar);

  // <textarea class="input" type="text" placeholder="Add a commment..." />
  const textarea = document.createElement("textarea");
  setClass(textarea, "input");
  textarea.setAttribute("placeholder", "Add a comment...");
  addComment.append(textarea);

  // <button class="send" type="submit">SEND</button>
  const send = document.createElement("button");
  setClass(send, "send");
  send.setAttribute("type", "submit");
  send.innerText = "SEND";
  addComment.append(send);
  send.onclick = function (e) {
    appendNewComment(e.target);
  };
  return addComment;
}

function appendNewComment(node) {
  // appends a new comments
  const parent = node.parentNode; //component from where the onclick function was called
  const comContent = parent.querySelector("textarea").value;
  //if the textarea value is not empty
  if (comContent) {
    //check if the function was called to "reply to a comment" or simply "add a new comment"
    if (parent.classList.contains(".mainAddComponent")) {
      //if adding a new comment

      const replyingToUser = parent.previousSibling; //get the comment we're replying to

      //make a new comment object to add it to localStorage and give to function createFunction
      const newComm = {
        id: globalID++,
        content: comContent,
        createdAt: "1 second ago",
        score: 0,
        user: {
          image: {
            png: currentUserAvatar,
            webp: currentUserAvatarWebp,
          },
          username: currentUsername,
        },
        replies: [],
      };
      //add new comment to localStorage
      updateCommentInLocalStorage(0, newComm);
      //make a container for the new comment
      const com = document.createElement("div");
      com.classList.add("commentContainer");
      com.append(createComment(newComm));
      //insert it after the comment we're replying to
      insertAfter(com, replyingToUser);
      //make the textarea empty again
      parent.querySelector(".input").value = "";
    } else {
      //if we're replying to an existing comment
      const replyingToUser = parent.previousSibling; //get the comment component we're replying to
      const userID = replyingToUser.id; //get the id of that component

      //make a new comment object to add it to localStorage and give to function createFunction
      const newComm = {
        id: globalID++,
        content: comContent,
        createdAt: "1 second ago",
        score: 0,
        replyingTo: replyingToUser,
        user: {
          image: {
            png: currentUserAvatar,
            webp: currentUserAvatarWebp,
          },
          username: currentUsername,
        },
        replies: [],
      };
      parent.remove(); //remove the "add new comment" component
      replyToggle = false;
      updateCommentInLocalStorage(userID, newComm); //add reply to localStorage
      //make a container for the new comment
      const com = document.createElement("div");
      com.classList.add("commentContainer");
      com.append(createComment(newComm));
      //insert it after the comment we're replying to
      insertAfter(com, replyingToUser);
    }
  }
}
function updateCommentInLocalStorage(id, comment) {
  //function gets 2 arguments: id of comment we're replying to; comment object

  //get comments from localStorage
  let comments = JSON.parse(localStorage.getItem("comments"));

  //if id is 0, we're just adding a new comment and not replying to anyone
  if (id == 0) {
    //push comment object to comments array
    comments.push(comment);
    localStorage.setItem("comments", JSON.stringify(comments));
  }
  //if we're replying to another comment, first we have to find that comment in the localStorage (works for 3 levels)
  //and then add the reply to 'replies' array
  comments.forEach((obj) => {
    if (obj.id == id) {
      obj.replies.push(comment);
    } else {
      if (obj.replies.length) {
        obj.replies.forEach((el) => {
          if (el.id == id) {
            el.replies.push(comment);
          } else {
            if (el.replies.length) {
              let returnValue = el.replies.find((element) => element.id == id);
              if (returnValue) {
                returnValue.replies.push(comment);
              }
            }
          }
        });
      }
    }
  });
  localStorage.setItem("comments", JSON.stringify(comments));
}
export function editCommentComponent(content, id) {
  // make a component similar to "add a new comment", but change button to "UPDATE"
  // node:
  // <div class="addComment">
  // <img src="../images/avatars/image-juliusomo.png" class="avatar" />
  // <input class="input" type="text" placeholder="Add a commment..." />
  // input.setAttribute("placeholder", content);
  // <button class="update" type="submit">UPDATE</button>

  // <div class="addComment">
  const addComment = document.createElement("div");
  setClass(addComment, "addComment");
  if (replyToggle) {
    setClass(addComment, "addReply");
  }

  // <img src="../images/avatars/image-juliusomo.png" class="avatar" />
  const avatar = document.createElement("img");
  setClass(avatar, "avatar");
  avatar.setAttribute("src", currentUserAvatar);
  addComment.append(avatar);

  // <input class="input" type="text" placeholder="Add a commment..." />
  const textarea = document.createElement("textarea");
  setClass(textarea, "input");

  // input.setAttribute("placeholder", content);
  textarea.value = content;
  addComment.append(textarea);

  // <button class="update" type="submit">UPDATE</button>
  const update = document.createElement("button");
  setClass(update, "update");
  update.setAttribute("type", "submit");
  update.innerText = "UPDATE";
  addComment.append(update);
  update.onclick = function (e) {
    updateComment(e.target.parentNode, id);
  };
  return addComment;
}
function updateComment(parent, ID) {
  //update existing comment in localStorage
  //functions gets 'parent' which is the component where the event was called and 'id' of the comment which is being edited
  const comContent = parent.querySelector("textarea").value; //get value of the textarea
  let comment;
  //find the comment in localStorage (works for 3 levels) and assign new value of the textarea to comment content
  if (comContent) {
    let comments = JSON.parse(localStorage.getItem("comments"));
    comments.forEach((obj) => {
      if (obj.id == ID) {
        obj.content = comContent;
        comment = obj;
      } else {
        obj.replies.forEach((el) => {
          if (el.id == ID) {
            el.content = comContent;
            comment = el;
          } else {
            if (el.replies.length) {
              comment = el.replies.find((element) => element.id == ID);
              if (comment) {
                comment.content = comContent;
              }
            }
          }
        });
      }
    });
    localStorage.setItem("comments", JSON.stringify(comments));
    parent.replaceWith(createComment(comment)); // add it as a new comment
  }
}
export function createComment(item) {
  //function creates a comment component and takes comment object as an argument
  //comment component:
  // <div class="comment">
  //    <div class="vote">
  //      <button class="upvote">+</button>
  //      <h2 class="voteNumber">12</h2>
  //      <button class="downvote">_</button>
  //    </div>
  //    <div class="header">
  //       <img src="../assets/avatars/image-amyrobson.png" class="avatar" />
  //       <h1>amyrobson</h1>
  //       <h3>1 month ago</h3>
  //       <button class="reply">Reply</button>  (or edit/delete)
  //       <p class="commentText">
  //       </p>
  //    </div>
  // </div>

  // <div class="comment">
  const comment = document.createElement("div");
  setClass(comment, "comment");
  comment.id = item.id;
  if (item.hasOwnProperty("replyingTo")) {
    setClass(comment, "replyComment");
  }
  comment.append(createVote(item.score));
  const header = document.createElement("div");
  setClass(header, "header");
  comment.append(createHeader(item));

  return comment;
}

function createVote(score) {
  // <div class="vote">
  const voting = document.createElement("div");
  setClass(voting, "vote");
  //   <button class="upvote">+</button>
  const plus = document.createElement("button");
  setClass(plus, "upvote");
  plus.innerText = "+";
  voting.append(plus);
  plus.onclick = function (e) {
    upvoteComment(e.target);
  };
  //   <h2 class="voteNumber">12</h2>
  const number = document.createElement("h2");
  setClass(number, "voteNumber");
  number.innerText = score;
  voting.append(number);

  //   <button class="downvote">_</button>
  const minus = document.createElement("button");
  setClass(minus, "downvote");
  minus.innerText = "_";
  voting.append(minus);
  minus.onclick = function (e) {
    downvoteComment(e.target);
  };
  return voting;
}

function createHeader(item) {
  // <div class="header">
  const header = document.createElement("div");
  setClass(header, "header");

  //       <img src="../assets/avatars/image-amyrobson.png" class="avatar" />
  const avatar = document.createElement("img");
  setClass(avatar, "avatar");
  avatar.setAttribute("src", item.user.image.png);
  header.append(avatar);

  //       <h1>amyrobson</h1>
  const usernm = document.createElement("h1");
  usernm.innerText = item.user.username;
  header.append(usernm);

  //       <h3>1 month ago</h3>
  const timeCreated = document.createElement("h3");
  timeCreated.innerText = item.createdAt;
  header.append(timeCreated);

  //if the comment doesn't belong to current user, it will have 'reply' button
  if (item.user.username != currentUsername) {
    //    <button class="reply">Reply</button>
    const reply = document.createElement("button");
    setClass(reply, "reply");
    reply.innerText = "Reply";
    header.append(reply);
    reply.onclick = function (e) {
      if (replyToggle) {
        document.querySelector(".addReply").remove();
      }
      replyToggle = true;
      const parent = e.target.parentNode.parentNode;
      const newReply = addCommentComponent();
      insertAfter(newReply, parent);
    };
  } else {
    //if the comment belongs to current user, instead of 'reply' button create 'edit' and 'delete' buttons

    //       <button class="edit">Edit</button>
    const edit = document.createElement("button");
    setClass(edit, "edit");
    edit.innerText = "Edit";
    header.append(edit);
    edit.onclick = function (e) {
      if (replyToggle) {
        document.querySelector(".addReply").remove();
      }
      const parent = e.target.parentNode;
      const content = parent.querySelector("p").innerText;
      //make a new component where we can edit the comment
      const updatedReply = editCommentComponent(content, parent.parentNode.id);
      parent.parentNode.replaceWith(updatedReply);
    };
    //   <button class="delete">Delete</button>
    const deleteButton = document.createElement("button");
    setClass(deleteButton, "delete");
    deleteButton.innerText = "Delete";
    header.append(deleteButton);
    deleteButton.onclick = function (e) {
      //delete component
      deleteComment(e.target.parentNode.parentNode.id);
      e.target.parentNode.parentNode.remove();
    };
  }
  //       <p class="commentText">
  const commentText = document.createElement("p");
  setClass(commentText, "commentText");
  commentText.innerText = item.content;
  header.append(commentText);
  return header;
}

function insertAfter(newNode, existingNode) {
  existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}
