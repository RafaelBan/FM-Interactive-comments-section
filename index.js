if (window.localStorage.getItem("currentUser") === null) {
  fetch(
    "https://raw.githubusercontent.com/RafaelBan/FM-Interactive-comments-section/main/data.json"
  )
    .then((res) => res.json())
    .then((data) => {
      window.localStorage.setItem(
        "currentUser",
        JSON.stringify(data["currentUser"])
      );
      window.localStorage.setItem("comments", JSON.stringify(data["comments"]));
    });
}

let currentUser = JSON.parse(window.localStorage.getItem("currentUser"));
let comments = JSON.parse(window.localStorage.getItem("comments"));
let addComment = document.querySelector("#add-comment");

comments.sort((a, b) => parseFloat(b.score) - parseFloat(a.score));

let currentUserImg = addComment.querySelector("img");
currentUserImg.src = currentUser["image"]["webp"];

for (let comment of comments) {
  let commentContainer = document.createElement("div");
  commentContainer.classList.add("comment-container");
  addComment.before(commentContainer);
  createComment(currentUser["username"], comment, commentContainer);
}

function createComment(currentUserName, comment, commentContainer) {
  let commentCard = document.createElement("div");
  commentCard.classList.add("card");
  commentContainer.appendChild(commentCard);

  let likeContainer = document.createElement("div");
  likeContainer.classList.add("like-container");
  commentCard.appendChild(likeContainer);
  let plusSign = document.createElement("button");
  plusSign.innerHTML = "+";
  likeContainer.appendChild(plusSign);
  let value = document.createElement("span");
  value.classList.add("value-container");
  value.innerHTML = comment["score"];
  likeContainer.appendChild(value);
  let minusSign = document.createElement("button");
  minusSign.innerHTML = "-";
  likeContainer.appendChild(minusSign);

  let userRelated = document.createElement("div");
  userRelated.classList.add("user-related-container");
  commentCard.appendChild(userRelated);

  let userDetails = document.createElement("div");
  userDetails.classList.add("user-details");
  userRelated.appendChild(userDetails);

  let userInfo = document.createElement("div");
  userInfo.classList.add("user-info");
  userDetails.appendChild(userInfo);
  let userIcon = document.createElement("img");
  userIcon.src = comment["user"]["image"]["webp"];
  userInfo.appendChild(userIcon);
  let userName = document.createElement("span");
  userName.innerHTML = comment["user"]["username"];
  userName.classList.add("user-name");
  userInfo.appendChild(userName);
  let buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container");
  userDetails.appendChild(buttonContainer);

  if (comment["user"]["username"] === currentUserName) {
    let youUser = document.createElement("div");
    youUser.classList.add("you-user");
    youUser.innerHTML = "you";
    userName.appendChild(youUser);

    let deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    buttonContainer.appendChild(deleteButton);
    let deleteButtonIcon = document.createElement("img");
    deleteButtonIcon.src = "./images/icon-delete.svg";
    deleteButton.appendChild(deleteButtonIcon);
    let deleteButtonText = document.createElement("span");
    deleteButtonText.innerHTML = "Delete";
    deleteButton.appendChild(deleteButtonText);

    let editButton = document.createElement("button");
    editButton.classList.add("reply-button");
    buttonContainer.appendChild(editButton);
    let editButtonIcon = document.createElement("img");
    editButtonIcon.src = "./images/icon-edit.svg";
    editButton.appendChild(editButtonIcon);
    let editButtonText = document.createElement("span");
    editButtonText.innerHTML = "Edit";
    editButton.appendChild(editButtonText);
  } else {
    let replyButton = document.createElement("button");
    replyButton.classList.add("reply-button");
    buttonContainer.appendChild(replyButton);
    let replyButtonIcon = document.createElement("img");
    replyButtonIcon.src = "./images/icon-reply.svg";
    replyButton.appendChild(replyButtonIcon);
    let replyButtonText = document.createElement("span");
    replyButtonText.innerHTML = "Reply";
    replyButton.appendChild(replyButtonText);
  }
  let commentDate = document.createElement("span");
  commentDate.classList.add("comment-date");
  commentDate.innerHTML = comment["createdAt"];
  userInfo.appendChild(commentDate);

  let commentContent = document.createElement("span");
  if (comment.hasOwnProperty("replyingTo")) {
    let replyTo = document.createElement("span");
    replyTo.innerHTML = "@" + comment["replyingTo"] + " ";
    commentContent.appendChild(replyTo);
  } else {
    if (comment["replies"].length) {
      let repliesContainer = document.createElement("div");
      repliesContainer.classList.add("reply-container");
      commentCard.after(repliesContainer);
      let separatorContainer = document.createElement("div");
      separatorContainer.classList.add("separator-container");
      repliesContainer.appendChild(separatorContainer);
      let separator = document.createElement("div");
      separator.classList.add("separator");
      separatorContainer.appendChild(separator);

      let replies = document.createElement("div");
      replies.classList.add("replies");
      repliesContainer.appendChild(replies);
      for (let reply of comment["replies"]) {
        let replyCard = document.createElement("div");
        replies.appendChild(replyCard);
        createComment(currentUserName, reply, replyCard);
      }
    }
  }
  commentContent.innerHTML = commentContent.innerHTML + comment["content"];
  userRelated.appendChild(commentContent);
}
