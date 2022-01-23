import { createComment, addCommentComponent } from "./comment.js";
import data from "./data.json" assert { type: "json" };

// push data.json to localStorage
export function pushToLocalStorage() {
  for (let key in data) {
    localStorage.setItem(key, JSON.stringify(data[key]));
  }
}

// get data from localStorage and render comments
export function render() {
  var retrievedData = JSON.parse(localStorage.getItem("comments")); //get comments
  //sort comments according to their score
  retrievedData.sort((a, b) => (a.score < b.score ? 1 : -1));
  //create comments and append them to DOM
  retrievedData.forEach((item) => {
    const el = createComment(item);
    const com = document.createElement("div");
    com.classList.add("commentContainer");
    document.getElementById("content").append(com);
    com.append(el);
    if (item.replies.length) {
      //sort replies according to their scores
      item.replies.sort((a, b) => (a.score < b.score ? 1 : -1));
      item.replies.forEach((rply) => {
        const reply = createComment(rply);
        com.append(reply);
      });
    }
  });
  const comp = addCommentComponent(); // make "add new comment" component and append it
  comp.classList.add(".mainAddComponent");
  document.getElementById("content").append(comp);
}
