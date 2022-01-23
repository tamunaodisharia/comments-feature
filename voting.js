export function upvoteComment(node) {
  //get comments from localStorage
  let comments = JSON.parse(localStorage.getItem("comments"));
  const parent = node.parentNode; // div where score number is placed
  const commentNode = parent.parentNode; // comment whose score will be changed
  const id = commentNode.id; //id of the comment
  let num = Number(parent.querySelector("h2").innerText) + 1; //increase number
  parent.querySelector("h2").innerText = num; //assign new number to the score
  //find the comment in localStorage to update it (works for 3 levels)
  comments.forEach((obj) => {
    if (obj.id == id) {
      obj.score = num;
    } else {
      if (obj.replies.length) {
        obj.replies.forEach((el) => {
          if (el.id == id) {
            el.score = num;
          } else {
            let comment;
            if (el.replies.length) {
              comment = el.replies.find((element) => element.id == id);
            }
            if (comment) {
              comment.score = num;
            }
          }
        });
      }
    }
  });
  localStorage.setItem("comments", JSON.stringify(comments));
}
export function downvoteComment(node) {
  //get comments from localStorage
  let comments = JSON.parse(localStorage.getItem("comments"));
  const parent = node.parentNode; // div where score number is placed
  const commentNode = parent.parentNode; // comment whose score will be changed
  const id = commentNode.id; //id of the comment
  let num = Number(parent.querySelector("h2").innerText) - 1; // decrease number
  parent.querySelector("h2").innerText = num; //assign new number to the score
  //find the comment in localStorage to update it (works for 3 levels)
  comments.forEach((obj) => {
    if (obj.id == id) {
      obj.score = num;
    } else {
      if (obj.replies.length) {
        obj.replies.forEach((el) => {
          if (el.id == id) {
            el.score = num;
          } else {
            let comment;
            if (el.replies.length) {
              comment = el.replies.find((element) => element.id == id);
            }
            if (comment) {
              comment.score = num;
            }
          }
        });
      }
    }
  });
  localStorage.setItem("comments", JSON.stringify(comments));
}
