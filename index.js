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

comments.sort((a, b) => parseFloat(b.score) - parseFloat(a.score));

let main = document.querySelector("main div");
let addComment = createAddComment(main, currentUser);

for (let comment of comments) {
  let commentContainer = document.createElement("div");
  commentContainer.classList.add("comment-container");
  commentContainer.id = comment["id"];
  addComment.before(commentContainer);
  createComment(currentUser, comment, commentContainer);
}

function createComment(currentUser, comment, commentContainer) {
  commentContainer.classList.add("comment-container");
  commentContainer.id = comment["id"];

  let commentCard = document.createElement("div");
  commentCard.classList.add("card");
  commentContainer.appendChild(commentCard);

  commentCard.appendChild(buildLikeFeature(comment));
  commentCard.appendChild(
    buildCommentContent(commentCard, currentUser, comment)
  );

  if (comment.hasOwnProperty("replies") && comment["replies"].length) {
    commentContainer.appendChild(buildCommentResponse(currentUser, comment));
  }
}

function buildLikeFeature(comment) {
  let likeContainer = document.createElement("div");
  likeContainer.classList.add("like-container");
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

  return likeContainer;
}

function buildCommentContent(commentCard, currentUser, comment) {
  let userRelated = document.createElement("div");
  userRelated.classList.add("user-related-container");
  userRelated.appendChild(buildUserDetails(commentCard, currentUser, comment));
  userRelated.appendChild(buildComment(comment));

  return userRelated;
}

function buildUserDetails(commentCard, currentUser, comment) {
  let userDetails = document.createElement("div");
  userDetails.classList.add("user-details");
  userDetails.appendChild(buildUserAndCommentSpecific(currentUser, comment));
  userDetails.appendChild(buildUserButtons(commentCard, currentUser, comment));

  return userDetails;
}

function buildUserAndCommentSpecific(currentUser, comment) {
  let userInfo = document.createElement("div");
  userInfo.classList.add("user-info");
  let userIcon = document.createElement("img");
  userIcon.src = comment["user"]["image"]["webp"];
  userInfo.appendChild(userIcon);
  let userName = document.createElement("span");
  userName.innerHTML = comment["user"]["username"];
  userName.classList.add("user-name");
  if (comment["user"]["username"] === currentUser["username"]) {
    let youUser = document.createElement("div");
    youUser.classList.add("you-user");
    youUser.innerHTML = "you";
    userName.appendChild(youUser);
  }
  userInfo.appendChild(userName);

  let commentDate = document.createElement("span");
  commentDate.classList.add("comment-date");
  commentDate.innerHTML = comment["createdAt"];
  userInfo.appendChild(commentDate);

  return userInfo;
}

function buildUserButtons(commentCard, currentUser, comment) {
  let buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container");

  if (comment["user"]["username"] === currentUser["username"]) {
    let deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.addEventListener("click", showDeleteOverlay, false);
    buttonContainer.appendChild(deleteButton);
    let deleteButtonIcon = document.createElement("img");
    deleteButtonIcon.src = "./images/icon-delete.svg";
    deleteButton.appendChild(deleteButtonIcon);
    let deleteButtonText = document.createElement("span");
    deleteButtonText.innerHTML = "Delete";
    deleteButton.appendChild(deleteButtonText);

    let editButton = document.createElement("button");
    editButton.classList.add("reply-button");
    editButton.addEventListener("click", showEditView, false);
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
    replyButton.addEventListener(
      "click",
      createAddComment.bind(null, commentCard, currentUser),
      false
    );
    buttonContainer.appendChild(replyButton);
    let replyButtonIcon = document.createElement("img");
    replyButtonIcon.src = "./images/icon-reply.svg";
    replyButton.appendChild(replyButtonIcon);
    let replyButtonText = document.createElement("span");
    replyButtonText.innerHTML = "Reply";
    replyButton.appendChild(replyButtonText);
  }

  return buttonContainer;
}

function buildComment(comment) {
  let commentContent = document.createElement("span");
  if (comment.hasOwnProperty("replyingTo")) {
    let replyTo = document.createElement("span");
    replyTo.innerHTML = "@" + comment["replyingTo"] + " ";
    commentContent.appendChild(replyTo);
  }
  commentContent.innerHTML = commentContent.innerHTML + comment["content"];
  return commentContent;
}

function buildCommentResponse(currentUser, comment) {
  let repliesContainer = document.createElement("div");
  repliesContainer.classList.add("reply-container");
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
    createComment(currentUser, reply, replyCard);
  }

  return repliesContainer;
}

function addNewComment(addComment, commentField, ev) {
  let currentUser = JSON.parse(window.localStorage.getItem("currentUser"));
  let comments = JSON.parse(window.localStorage.getItem("comments"));
  if (commentField && commentField.value != "") {
    let newComment = {
      id: getNewIndex(comments),
      content: commentField.value,
      createdAt: "now",
      replies: [],
      score: 0,
      user: currentUser,
    };
    commentField.value = "";
    comments.push(newComment);
    window.localStorage.setItem("comments", JSON.stringify(comments));
    let commentContainer = document.createElement("div");
    addComment.before(commentContainer);
    createComment(currentUser["username"], newComment, commentContainer);
  }
}

function showDeleteOverlay() {
  let main = document.querySelector("main");
  let dialogOverlay = document.createElement("div");
  dialogOverlay.classList.add("dialog-overlay");
  main.before(dialogOverlay);
  let dialogCard = document.createElement("div");
  dialogCard.classList.add("dialog-card");
  dialogOverlay.appendChild(dialogCard);
  let dialogTitle = document.createElement("span");
  dialogTitle.innerHTML = "Delete comment";
  dialogTitle.classList.add("dialog-title");
  dialogCard.appendChild(dialogTitle);
  let dialogMessage = document.createElement("span");
  dialogMessage.innerHTML =
    "Are you sure you want to delete this comment? This will remove the comment and can't be undone.";
  dialogMessage.classList.add("dialog-message");
  dialogCard.appendChild(dialogMessage);
  let dialogButtonContainer = document.createElement("div");
  dialogButtonContainer.classList.add("dialog-buttons-container");
  dialogCard.appendChild(dialogButtonContainer);
  let noButton = document.createElement("button");
  noButton.classList.add("no-button");
  noButton.addEventListener("click", removeDeleteOverlay, false);
  let noButtonSpan = document.createElement("span");
  noButtonSpan.innerHTML = "NO, CANCEL";
  noButton.appendChild(noButtonSpan);
  dialogButtonContainer.appendChild(noButton);
  let yesButton = document.createElement("button");
  yesButton.classList.add("yes-button");
  let yesButtonSpan = document.createElement("span");
  yesButtonSpan.innerHTML = "YES, DELETE";
  yesButton.appendChild(yesButtonSpan);
  let commentContainer = this.closest(".comment-container");
  yesButton.addEventListener(
    "click",
    deleteComment.bind(null, commentContainer),
    false
  );
  dialogButtonContainer.appendChild(yesButton);
}

function removeDeleteOverlay() {
  let body = document.querySelector("body");
  body.querySelector("div").remove();
}

function showEditView() {
  let commentContainer = this.closest(".comment-container");
  let userRelated = commentContainer.querySelector(".user-related-container");
  if (userRelated.children[1].tagName === "SPAN") {
    let textArea = document.createElement("textarea");
    textArea.value = userRelated.children[1].innerHTML;
    userRelated.children[1].remove();
    userRelated.appendChild(textArea);
    let updateButtonContainer = document.createElement("div");
    updateButtonContainer.classList.add("update-button-container");
    userRelated.appendChild(updateButtonContainer);
    let updateButton = document.createElement("button");
    updateButton.innerHTML = "UPDATE";
    updateButton.addEventListener(
      "click",
      updateFromEdit.bind(null, commentContainer, textArea),
      false
    );
    updateButtonContainer.appendChild(updateButton);
  }
}

function updateFromEdit(commentContainer, commentContent, ev) {
  let comments = JSON.parse(window.localStorage.getItem("comments"));
  let id = Number(commentContainer.id);
  for (let i = 0; i < comments.length; i++) {
    if (comments[i]["id"] === id) {
      comments[i]["content"] = commentContent.value;
      window.localStorage.setItem("comments", JSON.stringify(comments));
      let userRelated = commentContainer.querySelector(
        ".user-related-container"
      );
      if (userRelated.children[1].tagName === "TEXTAREA") {
        userRelated.children[1].remove();
        userRelated.children[1].remove();
        userRelated.appendChild(buildComment(comments[i]));
      }
      return;
    }
    for (let j = 0; j < comments[i]["replies"].length; j++) {
      if (comments[i]["replies"][j]["id"] === id) {
        comments[i]["replies"][j]["content"] = commentContent.value;
        window.localStorage.setItem("comments", JSON.stringify(comments));
        return;
      }
    }
  }
}

function deleteComment(commentContainer, ev) {
  let comments = JSON.parse(window.localStorage.getItem("comments"));
  let id = Number(commentContainer.id);
  let commentIndex = 0;
  for (let comment of comments) {
    if (comment["id"] === id) {
      comments.splice(commentIndex, 1);
      window.localStorage.setItem("comments", JSON.stringify(comments));
      commentContainer.remove();
      removeDeleteOverlay();
      return;
    }
    let replyIndex = 0;
    for (let reply of comment["replies"]) {
      if (reply["id"] === id) {
        comment["replies"].splice(replyIndex, 1);
        window.localStorage.setItem("comments", JSON.stringify(comments));
        commentContainer.remove();
        removeDeleteOverlay();
        return;
      }
      replyIndex += 1;
    }
    commentIndex += 1;
  }
}

function getNewIndex(comments) {
  let lastIndex = 0;
  for (let comment of comments) {
    if (comment["id"] > lastIndex) {
      lastIndex = comment["id"];
    }
    if (comment["replies"].length) {
      for (let reply of comment["replies"]) {
        if (reply["id"] > lastIndex) {
          lastIndex = reply["id"];
        }
      }
    }
  }
  return lastIndex + 1;
}

function createAddComment(commentContainer, currentUser) {
  let card = document.createElement("div");
  card.classList.add("card");
  commentContainer.after(card);

  let img = document.createElement("img");
  img.src = currentUser["image"]["webp"];
  card.appendChild(img);

  let textArea = document.createElement("textarea");
  textArea.placeholder = "Add a comment...";
  card.appendChild(textArea);

  let button = document.createElement("button");
  button.innerHTML = "SEND";
  button.addEventListener(
    "click",
    addNewComment.bind(null, card, textArea),
    false
  );
  card.appendChild(button);

  return card;
}
