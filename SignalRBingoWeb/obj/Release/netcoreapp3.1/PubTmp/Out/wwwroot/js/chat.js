"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chathub").build();

var myRandColor = randcolor();

//Disable send button until connection is established
document.getElementById("sendButton").disabled = true;

connection.on("ReceiveMessage", function (user, message) {
    var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    var encodedMsg = user + msg;

    var li = document.createElement("li");
    li.innerHTML = encodedMsg;
    document.getElementById("messagesList").appendChild(li);
});

connection.start().then(function () {
    document.getElementById("sendButton").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});

document.getElementById("sendButton").addEventListener("click", function (e) {
    SendMessage();
});
    


function SendMessage() {
    var user = document.getElementById("usernameContainer").innerHTML;
    var message = document.getElementById("messageInput").value;

    if (message == "") {
        return;
    }

    user = "<span style='" + "color:" + myRandColor + "'>" + user + "</span>" + ": ";

    connection.invoke("SendMessage", user, message).catch(function (err) {
        return console.error(err.toString());
    });
    //event.preventDefault();

    document.getElementById("messageInput").value = "";
}



document.getElementById("messageInput").addEventListener("keydown", function (e) {
    if (!e) { var e = window.event }
    //e.preventDefault();
    if (e.keyCode == 13) { SendMessage(); }

}, false);

//Creates and starts a connection.
//Adds to the submit button a handler that sends messages to the hub.
//Adds to the connection object a handler that receives messages from the hub and adds them to the list.


//Random color
function randcolor() {
    let randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return "#" + randomColor;
}
