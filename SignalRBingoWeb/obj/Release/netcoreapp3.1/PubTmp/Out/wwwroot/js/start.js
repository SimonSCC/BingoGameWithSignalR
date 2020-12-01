"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chathub").build();
connection.start();
console.log("Im connected"),
    setTimeout(delayedCall, 2000);
window.onbeforeunload = CatLeaves;

connection.on("TransferPosition", async function () {
    console.log("Log Position");
    let usercat = document.getElementById("usernamehid").innerHTML;

    let cat = document.getElementById(usercat);

    connection.invoke("UploadPos", usercat, cat.style.left, cat.style.top).catch(function (err) {
        return console.error(err.toString());
    });

    //await sleep(2000); //Freeze all cats so sent position doesnt change
});


connection.on("ListConnectedCats", function (catname, posLeft, posTop) {
    console.log("Connected Cat: " + catname + posLeft + posTop);

    let catspace = document.getElementById("catspace");
    //Different types of cats:
    let nyanCat = "<div id=" + catname + " style='position: absolute; left: " + posLeft + "; top: " + posTop + ";'> <p>" + catname + "</p>" + "<img src='/img/nyan.gif' style='height: 50px; width: auto;'/></div>";
    let normalCat = "<div id=" + catname + " style='position: absolute; left: " + posLeft + "; top: " + posTop + ";'> <p>" + catname + "</p>" + "<img src='/img/cat.png'/></div>";
    //Cat types end
    //let toAdd = "<div id=" + catname + " style='position: absolute; left: " + posLeft + "; top: " + posTop + ";'> <p>" + catname + "</p>" + "<img src='/img/cat.png' /></div>";
    if (catname.endsWith("nyan")) {
        catspace.innerHTML += nyanCat;
        console.log("added nyancat");
    }
    if (catname.endsWith("cat")) {
        catspace.innerHTML += normalCat;
        console.log("added normalcat");
    }
    console.log("Added " + username + " at " + posLeft + posTop);
});


connection.on("SpawnCat", function (user) {

    console.log("spawncat " + user);
    addCat(user);
});

function addCat(username) {
    console.log("In addCat method: Adding " + username);
    let catspace = document.getElementById("catspace");

    //let toAdd = "<div id=" + username + " style='position: absolute; left: 0; top: 0;'> <p>" + username + "</p>" + "<img src='/img/cat.png' /></div>";

    //Different types of cats:
    let nyanCat = "<div id=" + username + " style='position: absolute; left: 0; top: 0;'> <p>" + username + "</p>" + "<img src='/img/nyan.gif' style='height: 50px; width: auto;'/></div>";
    let normalCat = "<div id=" + username + " style='position: absolute; left: 0; top: 0;'> <p>" + username + "</p>" + "<img src='/img/cat.png'/></div>";
    //Cat types end

    if (username.endsWith("nyan")) {
        catspace.innerHTML += nyanCat;
    }
    if (username.endsWith("cat")) {
        catspace.innerHTML += normalCat;

    }

    //if (catspace.innerHTML.contains(toAdd)) {
    //    console.log("Already contains cat... Returning..");
    //    return;
    //}

    //catspace.innerHTML += toAdd;

    console.log("Added " + username);
}

async function delayedCall() {

    let usercat = document.getElementById("usernamehid").innerHTML;


    //Ask for other cats' position:
    connection.invoke("UpdatePositions", usercat).catch(function (err) {
        return console.error(err.toString());
    });

    await sleep(1000); //Sleep to ensure that all positions are uploaded

    //Call server and receive list of joined cats
    connection.invoke("CanIHaveListOfConnectedCats", usercat).catch(function (err) {
        return console.error(err.toString());
    });

    //Tell server to tell connected clients that your cat has spawned.
    connection.invoke("SpawnCat", usercat).catch(function (err) {
        return console.error(err.toString());
    });



    //await sleep(3000);
    console.log("cat");
    let cat = document.getElementById(usercat);
    console.log(cat);

    //var rect = cat.getBoundingClientRect();
    //console.log(rect.top, rect.right, rect.bottom, rect.left);


    window.addEventListener("keydown", (e) => {
        switch (e.key) {
            case "ArrowLeft":
                connection.invoke("OtherCatMoves", usercat, "left").catch(function (err) {
                    return console.error(err.toString());
                });
                break;
            case "ArrowRight":
                connection.invoke("OtherCatMoves", usercat, "right").catch(function (err) {
                    return console.error(err.toString());
                });
                //console.log("moving right");
                break;
            case "ArrowUp":
                connection.invoke("OtherCatMoves", usercat, "up").catch(function (err) {
                    return console.error(err.toString());
                });
                //console.log("moving up");
                break;
            case "ArrowDown":
                connection.invoke("OtherCatMoves", usercat, "down").catch(function (err) {
                    return console.error(err.toString());
                });
                //console.log("moving down");
                break;
            case " ":
                console.log("Space");
                connection.invoke("OtherCatMoves", usercat, "poo").catch(function (err) {
                    return console.error(err.toString());
                });


                break;
        }
    });
}

function CatLeaves() {
    let username = document.getElementById("usernamehid").innerHTML;

    connection.invoke("DeleteCat", username).catch(function (err) {
        return console.error(err.toString());
    });
}


connection.on("DeleteCat", function (user) {
    console.log("Deletecat" + user);

    let cat = document.getElementById(user);
    let catspace = document.getElementById("catspace");

    catspace.removeChild(cat);
});







connection.on("OtherCatMovesDirection", function (user, direction) {
    let catWhoMoved = document.getElementById(user);
    let moveBy = 10;

    switch (direction) {
        case "left":
            console.log(user + "Moved left");
            catWhoMoved.style.left = parseInt(catWhoMoved.style.left) - moveBy + "px";
            break;
        case "right":
            console.log(user + "Moved right");
            catWhoMoved.style.left = parseInt(catWhoMoved.style.left) + moveBy + "px";
            break;
        case "up":
            console.log(user + "Moved up");
            catWhoMoved.style.top = parseInt(catWhoMoved.style.top) - moveBy + "px";
            break;
        case "down":
            console.log(user + "Moved down");
            catWhoMoved.style.top = parseInt(catWhoMoved.style.top) + moveBy + "px";
            break;
        case "poo":
            console.log(user + "pooped");
            let catspace = document.getElementById("catspace");
            let cat = document.getElementById(user);

            let topPos = parseInt(cat.style.top) + 80; //80 normal cat
            let leftPos = parseInt(cat.style.left) + 10; //60 normal cat

            if (user.endsWith("cat")) {
                topPos = parseInt(cat.style.top) + 80;
                leftPos = parseInt(cat.style.left) + 60;
            }

            console.log(topPos);
            console.log(leftPos);

            let poo = "<img style='height: 25px; z-index: -1; position: absolute; width: 25px; top: " + topPos + "px;left: " + leftPos + "px' src='/img/poop.png' /></div>";
         

            catspace.innerHTML += poo;
            let nr = Math.floor(Math.random() * 4); 
            if (nr == 1) {
                new Audio('/sound/fart.wav').play();
            }
            else if (nr == 2) {
                new Audio('/sound/fart2.wav').play();
            }
            else if(true) {
                new Audio('/sound/fart3.wav').play();
            }

            break;
    }
});


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


//Make list of cats connected same way as in bingo game

//I could make list of connected cats and store it along with their positions, and update it everytime it moves?
