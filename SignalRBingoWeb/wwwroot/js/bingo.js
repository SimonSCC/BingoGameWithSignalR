"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chathub").build();


connection.start();
OnPageLoad();

window.onbeforeunload = UserLeaves;

var elem = document.getElementById("nextnr");
if (elem != null) {
    elem.addEventListener("click", function (event) {
        document.getElementById("nextnr").innerHTML = "Next Number";
        connection.invoke("NewNumber").catch(function (err) {
            return console.error(err.toString());
        });
        event.preventDefault();
    });
}


//UserFunctions
//____________________________________________________________________
//document.addEventListener("visibilitychange", function () { //Need to implement this instead of UserLeaves and onbeforeunload event since it doesn't work on phones.
//    if (document.visibilityState === 'visible') { }
//    else {



//        var user = document.getElementById("usernameContainer").innerHTML;
//        console.log(user + "Leaves");

//        console.log(window.location.origin)

//        //Removes user from list if refresh
//        connection.invoke("UserLeaves", user).catch(function (err) {
//            return console.error(err.toString());
//        });
//        //Remove from list
//    }
//});

function UserLeaves() {
    var user = document.getElementById("usernameContainer").innerHTML;
    console.log(user + "Leaves");

    console.log(window.location.origin)

    //Removes user from list if refresh
    connection.invoke("UserLeaves", user).catch(function (err) {
        return console.error(err.toString());
    });
    //Remove from list

}

connection.on("RemoveUser", function (user) {
    printUser(user + "Im hereeee ");
    document.getElementById("membersofgame").innerHTML = "";
    connection.invoke("GetConnectedUsers").catch(function (err) {
        return console.error(err.toString());
    });
    //remove from membersofgame
});

connection.on("NewUserAdded", function (user) {
    printUser(user);

});

connection.on("ListUsers", function (list) {
    console.log(list);
    list.forEach(printUser);
});

function printUser(user) {
    var span = document.createElement("span");
    span.textContent = user;
    document.getElementById("membersofgame").appendChild(span);
}



async function OnPageLoad() {
    await sleep(500);
    console.log("OnLoad");
    let username = document.getElementById("usernameContainer").innerHTML;
    //Add your username here?
    connection.invoke("GetConnectedUsers").catch(function (err) {
        return console.error(err.toString());
    });

    connection.invoke("NewUser", username).catch(function (err) {
        return console.error(err.toString());
    });

}



//BingoFunctions
//____________________________________________________________________
connection.on("SentNewNumber", function (number) {
    var msg = number;
    new Audio('sound/bell.wav').play();
    let elem = document.getElementById("number");
    elem.innerHTML = msg;
    elem.classList.remove("run-animation");
    void elem.offsetWidth;
    elem.classList.add("run-animation");


});

function test() {

}


connection.on("IsBingo?", function (bingo, user) { //If Bingo
    var msg;
    console.log("Bingo?" + bingo + user);
    if (bingo) {
        new Audio('sound/win1.wav').play();
        msg = "<span style='color: green'>" + user + " has a bingo!" + "</span>";
        //Display leaderboard
        var li = document.createElement("li");
        li.innerHTML = msg;
        document.getElementById("messagesList").appendChild(li);
    }
    else {
        new Audio('sound/lose.wav').play();
        msg = "<span style='color: red'>" + user + " foolishly thought he/she had a bingo!" + "</span>";
    }
    document.getElementById("didbingo").innerHTML = msg;
});

connection.on("IsRow?", function (nrOfCorrectRows, user) { //If row correct
    var msg;
    console.log("Row correct?" + nrOfCorrectRows + user);
    if (nrOfCorrectRows > 0) {
        new Audio('sound/correctrow.wav').play();
        msg = "<span style='color: green'>" + user + " have " + nrOfCorrectRows + " correct rows!</span>";
        var li = document.createElement("li");
        li.innerHTML = msg;
        document.getElementById("messagesList").appendChild(li);
    }
    else {
        new Audio('sound/lose.wav').play();
        msg = "<span style='color: red'>" + user + " foolishly thought he/she had correct rows!" + "</span>";

    }
    document.getElementById("didbingo").innerHTML = msg;
});



//Called when clicking on your board piece
function MarkAsComplete(btn) {
    if (btn.style.backgroundColor == "") {
        new Audio('sound/check.wav').play();
        btn.style.backgroundColor = "Green";
    }
    else {
        new Audio('sound/pickup.wav').play();
        btn.style.backgroundColor = "";
    }
}

function BingoBtnClicked(col1, col2, col3, col4, col5, user) {
    var attempts = document.getElementById("attempts");
    var nr = parseInt(attempts.innerHTML);
    if (nr == 0) {
        return;
    }
    if (nr == 1) {
        document.getElementById("bingobtn").disabled = true;
        document.getElementById("rowbtn").disabled = true;
    }
    nr -= 1;
    console.log(nr);
    attempts.innerHTML = nr;
    var list = [col1, col2, col3, col4, col5];
    console.log("Im here" + list + user);
    connection.invoke("ControlBingo", list, user).catch(function (err) {
        return console.error(err.toString());
    });


}

function RowClicked(col1, col2, col3, col4, col5, user) {
    var attempts = document.getElementById("attempts");
    var nr = parseInt(attempts.innerHTML);
    if (nr == 0) {
        return;
    }
    var list = [col1, col2, col3, col4, col5];

    connection.invoke("ControlRow", list, user).catch(function (err) {
        return console.error(err.toString());
    });



}


function ResetGame() {
    connection.invoke("Reset").catch(function (err) {
        return console.error(err.toString());
    });
}
connection.on("ResetUser", function () {
    console.log("Home");
    window.location.replace(window.location.origin);
});



//Other
//____________________________________________________________________

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function GoBack() {
    window.location.replace(window.location.origin);

}




//Skal jeg lave en slags ting på forsiden hvor man kan gå rundt med piletasterne?