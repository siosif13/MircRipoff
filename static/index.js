document.addEventListener("DOMContentLoaded", () => {

  if (!localStorage.getItem("displayName")) {
    let displayName = null;

    while (!displayName) {
      displayName = prompt("Please enter a display name", "Display name");
    }
    localStorage.setItem("displayName", displayName);
    alert("Welcome, " + displayName + " !");
  }

  // Connecting to the socket according to the url (in this case the current url)
  var socket = io.connect(location.protocol + "//" + document.domain + ":" + location.port);


  // What the socket does when it connects, and sending the data to the server
  socket.on("connect", () => {
    document.querySelectorAll(".btn").forEach(button => {
      button.onclick = () => {
        let channelName = null;

        while (!channelName) {
          channelName = prompt("Enter a channel name", "Channel name");
        }
        socket.emit("create channel", {
          "channelName": channelName
        })

      }
    });
  });

  // What the socket does based on the server response
  socket.on("process channel creation", data => {

    socket.emit("channel was created", {"channelName": title.innerHTML, "description": desc.innerHTML});
  });



});
