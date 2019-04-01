document.addEventListener("DOMContentLoaded", () => {

  // Choose a display name
  if (!localStorage.getItem("displayName")) {
    let displayName = null;

    while (!displayName) {
      displayName = prompt("Please enter a display name", "Display name");
    }
    localStorage.setItem("displayName", displayName);
    alert("Welcome, " + displayName + " !");
  }


  // Establishing socket connection on current url
  var socket = io.connect(location.protocol + "//" + document.domain + ":" + location.port);

  if (localStorage.getItem("selectedChannel")) {
    socket.emit("select channel", {"channelNb": localStorage.getItem("selectedChannel"), "sender": localStorage.displayName});
  }


  // Create channel event listener
  socket.on("connect", () => {
    document.querySelector("#createChannel").onclick = () => {
      let channelName = null;
      while (!channelName) {
        channelName = prompt("Enter a channel name", "Channel name");
      }
      socket.emit("create channel", {"channelName": channelName});
    }
  });


  // Update channel list in the client view
  socket.on("update client list", data => {

    var channelContainer = document.createElement("div");
    channelContainer.className = "channelContainer";

    data.forEach((element) => {

      let title = document.createElement("h5");
      title.innerHTML = `${element.channelName}`;

      let chat_ib = document.createElement("div");
      chat_ib.className = "chat_ib";

      let channel_img = document.createElement("div");
      channel_img.className = "chat_img";

      let img = document.createElement("img");

      img.src = "https://ptetutorials.com/images/user-profile.png";
      let chat_people = document.createElement("div");

      chat_people.className = "chat_people";

      let chat_list = document.createElement("div");
      chat_list.className = "chat_list";
      chat_list.id = `${element.channelNb}`;

      let channel = document.createElement("div");
      channel.className = "channel";

      chat_ib.appendChild(title);
      channel_img.appendChild(img);
      chat_people.appendChild(channel_img);
      chat_people.appendChild(chat_ib);
      chat_list.appendChild(chat_people);
      channel.appendChild(chat_list);
      channelContainer.appendChild(channel);
    })
    document.getElementById("channelContainer").innerHTML = channelContainer.innerHTML;
    add_active_channels();
  });



  // Add active listeners to channels
  function add_active_channels() {
  document.querySelectorAll(".chat_list").forEach( (element) => {
    element.onclick = () => {
      document.querySelectorAll(".chat_list").forEach( (element) => {
        element.className = "chat_list";
      });
      element.className += " active_chat";
      socket.emit("select channel", {"channelNb": element.id, "sender": localStorage.displayName});

    }
  });
}
  add_active_channels();

  socket.on("selected channel", data => {

    if (data.sender == localStorage.displayName){
      localStorage.selectedChannel = data.channel.channelNb;
      console.log(localStorage.selectedChannel);
    }
    if (localStorage.selectedChannel == data.channel.channelNb) {

    let messageContainer = document.createElement("div");
    messageContainer.className = "msg_history";

    data.channel.messages.forEach( (message) => {

      let msgBox = document.createElement("div");
      if (message.displayName == localStorage.displayName) {
        msgBox.className = "outgoing_msg";
        sentMsg = document.createElement("div");
        sentMsg.className = "sent_msg";
        p = document.createElement("p");
        p.innerHTML = message.message;
        time = document.createElement("span");
        time.className = "time_date";
        time.innerHTML = message.timestamp;

        sentMsg.appendChild(p);
        sentMsg.appendChild(time);
        msgBox.appendChild(sentMsg);
      }
      else {
        msgBox.className = "incoming_msg";
        let msgImg = document.createElement("div");
        msgImg.className = "incoming_msg_img";
        let img = document.createElement("img");
        img.src = "https://ptetutorials.com/images/user-profile.png";
        let recMsgW = document.createElement("div");
        recMsgW.className = "received_withd_msg"
        let recMsg = document.createElement("div");
        recMsg.className = "received_msg";
        let pStrong = document.createElement("p");
        pStrong.innerHTML = "<strong>" + message.displayName + " says: </strong>";
        pStrong.style = "color: black";
        let p = document.createElement("p");
        p.innerHTML = message.message;

        let time = document.createElement("span");
        time.className = "time_date";
        time.innerHTML = message.timestamp;

        recMsgW.appendChild(pStrong);
        recMsgW.appendChild(p);
        recMsgW.appendChild(time);
        recMsg.appendChild(recMsgW);
        msgImg.appendChild(img);
        msgBox.appendChild(msgImg);
        msgBox.appendChild(recMsg);
      }

      messageContainer.appendChild(msgBox);
    });

    document.querySelector

    document.querySelector(".msg_history").innerHTML = messageContainer.innerHTML;
    document.querySelector(".msg_history").scrollTop = document.querySelector(".msg_history").scrollHeight;
  }
  });

  document.getElementById("sendMessage").onclick = () => {

    let message = document.querySelector(".write_msg");
    socket.emit("sendMessage", {"message": message.value, "channelNb": localStorage.selectedChannel, "displayName": localStorage.displayName});
    message.value="";
    };


});
