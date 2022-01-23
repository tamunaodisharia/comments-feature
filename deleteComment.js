export function deleteComment(id) {
  let comments = JSON.parse(localStorage.getItem("comments")); //get comments from localStorage
  let index;
  let comment;
  let save;
  //find the comment in localStorage and delete it
  comments.forEach((obj) => {
    if (obj.id == id) {
      comment = obj;
    } else {
      if (obj.replies.length) {
        obj.replies.forEach((el) => {
          if (el.id == id) {
            save = obj; //save the object where the comment is located
            comment = el;
          } else {
            comment = el.replies.find((element) => element.id == id);
            if (comment) {
              //if the comment is located on the 3rd level, get the index from the array and remove it
              index = el.replies.indexOf(comment);
              el.replies.splice(index, 1);
              localStorage.setItem("comments", JSON.stringify(comments));
            }
          }
        });
      }
    }
  });
  //if the comment wasn't on the 3rd level we can find it in the comments array (1st level)
  //or in the replies of the saved object (from 2nd level)
  if (index < 0 || index == undefined) {
    index = comments.indexOf(comment);
    if (index == -1) {
      let i = comments.indexOf(save);
      comments[i].replies.indexOf(comment);
      comments[i].replies.splice(index, 1);
      localStorage.setItem("comments", JSON.stringify(comments));
      return;
    }
    comments.splice(index, 1);
  }
  localStorage.setItem("comments", JSON.stringify(comments));
}
