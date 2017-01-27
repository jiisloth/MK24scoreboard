/**
 * Created by lapsloth on 25.1.2017.
 */


var maps = ["LuigiCircuit", "PeachBeach", "BabyPark", "DryDryDesert", "MushroomBridge", "MarioCircuit", "DaisyCruiser", "WaluigiStadium", "SherbetLand", "MushroomCity", "YoshiCircuit", "DKMountain", "WarioColosseum", "DinoDinoJungle", "BowserCastle", "RainbowRoad"];

var icons = ["mario", "luigi", "bowser", "peach", "daisy", "yoshi", "toad", "toadette", "donkeykong", "boo", "koopa", "klunk", "chuck", "link", "chiken", "bubble", "mage", "megaman", "pikachu", "samus", "sonic"]

var players = [];
var playerCount = 0;
var iconChoice = "";

var playing = [];
var que = [];

var jonne = "none";

var rounds = 24;

var i;
var lastPlayer = [];


function playerMove(id) {
    if (playing.indexOf(id) != -1){
        players[id][2] += 1;
        var temp = playing[playing.indexOf(id)];
        playing[playing.indexOf(id)] = que[0];
        lastPlayer.push(que[0]);
        que.splice(0,1);
        que.push(temp);
        checkJonne();
        updateQue();
    }
}

function checkJonne() {
    var count = 0;
    for (i = 0; i < playing.length; i++){
        if (players[playing[i]][2] > 0){
            count += 1;
        } else {
            jonne = playing[i];

        }
    }

    if (count >= playing.length){
        var sofa = playing.slice(0);
        for (i = lastPlayer.length-1; i >= 0; i--){
            if (sofa.indexOf(lastPlayer[i]) != -1){
                sofa.splice(sofa.indexOf(lastPlayer[i]), 1);
                if (sofa.length == 1) {
                    jonne = sofa[0];
                }
            }
        }
    }
    if (count < playing.length - 1 && count >= 0){
        jonne = "none"
        $(".playerImage").removeClass("jonne");
    }
    if (jonne != "none"){
        $(".playerImage").removeClass("jonne");
        $("#playerImage"+jonne).addClass("jonne");
    }

}


function undoMove() {
    if (lastPlayer.length > 0) {
        var lastOne = lastPlayer.pop();
        if (typeof lastOne === "string"){
            lastOne = parseInt(lastOne.split(":")[1]);
            var errorOne = que.pop();
            playing[playing.indexOf(lastOne)] = errorOne;
            que.unshift(lastOne);
            lastPlayer.push(errorOne);

        } else {
            var errorOne = que.pop();
            playing[playing.indexOf(lastOne)] = errorOne;
            que.unshift(lastOne);
            players[errorOne][2] -= 1;
            $("#playerImage" + errorOne).css({
                'right': '-' + ($(".numberSlot").width() * (1 + players[errorOne][2]) - 5) + 'px',
                'left': 'auto'
            });
        }
        checkJonne();
        updateQue();
    }
}

function skippy() {
    var lastOne = lastPlayer.pop();
    if (typeof lastOne === "string") {
        lastOne = parseInt(lastOne.split(":")[1]);
    }
    var temp = playing[playing.indexOf(lastOne)];
    playing[playing.indexOf(lastOne)] = que[0];
    lastPlayer.push("<-s:"+que[0]);
    que.splice(0,1);
    que.push(temp);
    checkJonne();
    updateQue();
}

function updateQue(){
    for (i = 0; i < playing.length; i++) {
        var div = $("#player" + (playing[i])+" .name"+" .turnNumber");
       div.html( $("<img src='images/icons/player" + (i + 1) + ".png'>"));
    }
    for (i = 0; i < que.length; i++) {
        var div = $("#player" + (que[i])+" .name"+" .turnNumber");
        div.text((i + 1) +".");
    }


}

function writeCookie() {
   var now = new Date();
   now.setMonth( now.getMonth() + 1 );
   document.cookie = "?players="+ encodeURI(players) + "&rounds="+rounds+";expires=" + now.toUTCString() + ";";
}


function readParameters(){
    var params = window.location.search;
    var paramsFromUrl = "yes";
    if (!params){
        paramsFromUrl = "no";
        params = document.cookie;
        if (!params){
            window.location.href = "index.html";
        }
    }
    params = params.substring(1).split("&");

    rounds = parseInt(params[1].split("=")[1]);
    params = decodeURI(params[0].split("=")[1]).split(",");
    var player = [];
    for (i = 0; i < params.length; i++) {
        player.push(params[i]);
        if (player.length == 3){
            player[2] = parseInt(player[2]);
            players.push(player);
            player = []
        }
    }
    if (paramsFromUrl == "yes") {
        writeCookie();
        window.location.href = "scoreboard.html";
    }

}

function setOrder(){
    for (i = 1; i <= players.length; i++) {
        var div = $("#player" + (i-1)+" .name"+" .turnNumber");
        if (i <= 4){
            $("<img src='images/icons/player" + i + ".png'>").appendTo(div);
            playing.push(i-1);
        } else {
            div.text(i-4 +".");
            que.push(i-1);
        }
    }
}

function animateEngine(){
    for (i = 0; i < playing.length; i++) {
        $("#playerImage" + playing[i]).css({
            'bottom': Math.random() + 'px',
            'top': 'auto'
        });
    }
    setTimeout(animateEngine, 30);
}

function animateDrive(){
    for (i = 0; i < players.length; i++) {
        var offset = parseInt($("#playerImage" + i).css('right'));
        var goal = parseInt($(".numberSlot").width() * (1 + players[i][2]) - 5)*-1;

        if (offset > goal){
            offset -= 2;
            $("#playerImage" + i).css({
                'right':  + offset + 'px',
                'left': 'auto',
                'bottom': Math.random() + 'px',
                'top': 'auto'
            });

        }
    }
    setTimeout(animateDrive, 30);
}

$(document).ready(function () {
    readParameters();
    setOrder();



    for (i = 0; i < maps.length; i++) {
        map = $('<div class="map"><img class="mapImage" src="images/maps/' + maps[i] + '.png"><div class="mapCount">0</div></div>');
        cup = "#cup" + (Math.floor(i / 4) + 1);
        map.appendTo($(cup));
    }
    $("#container").height($(window).height() - ($("#top").height() + $("#bottom").height()));


    for (i = 0; i < players.length; i++) {
        playerslot = $('<div id="player' + i + '" class="playerSlot"><div class="name"><div class="turnNumber"></div>' + players[i][0] + '</div><div id="score' + i + '" class="score"><div class="playerImageHolder"><img id="playerImage' + i + '" class="playerImage" src="images/playerIcons/' + players[i][1] + '.png"></div></div></div>')
        playerslot.appendTo($("#container"));
    }

    $(".playerSlot").height($("#container").height() / (players.length + 1.1));

    for (i = 0; i <= rounds; i++) {
        if (i % 2 == 0) {
            color = "transparent"
        } else {
            color = "rgba(0, 0, 0, 0.44)"
        }
        number = $('<div class=numberSlot style="background-color: ' + color + '; width: ' + 100/(rounds+1) +'%">' + i + '</div>');
        number.appendTo($("#marker"));
    }
    number = $('<div class=numberSlot style="background-color: rgba(199,76,0,0.65); width: ' + 100/(rounds+1) +'%"><img src="images/icons/lastLap.png"></div>');
    number.appendTo($("#marker"));


    $(".numberSlot").css("line-height", $(".playerSlot").height() + "px");
    $(".numberSlot").height($(window).height() - ($("#top").height() + $("#bottom").height()));
    $(".playerImage").css({
        'right':'-' + ($(".numberSlot").width() * 1 - 5) + 'px',
        'left': 'auto'
    });

    updateQue();

    /*
    $(".playerSlot").click( function () {
        var id = parseInt(($(this).attr('id').replace("player", "")));
        if (playing.indexOf(id) != -1){
            players[id][2] += 1;
            $("#playerImage" + id).css({
                'right':'-' + ($(".numberSlot").width() * (1 + players[id][2]) - 5) + 'px',
                'left': 'auto'
            });
            var temp = playing[playing.indexOf(id)];
            playing[playing.indexOf(id)] = que[0];
            lastPlayer.push(que[0]);
            que.splice(0,1);
            que.push(temp);
            updateQue();
        }

    });
    */

    document.addEventListener('keydown', function(event) {
        if( event.keyCode >= 48 && event.keyCode <= 57 ) {
            var id = event.keyCode - 49;
            if (id < 0){ id = 9}
            playerMove(id);
            writeCookie();
        }
        if ( event.keyCode == 8 ){
            undoMove();
            writeCookie();

        }
        if (event.keyCode == 46){
            skippy();
            writeCookie();

        }

    });

    animateEngine();
    animateDrive();

    $(window).resize(function () {
        $("#container").height($(window).height() - ($("#top").height() + $("#bottom").height()));
        $(".numberSlot").css("line-height", $(".playerSlot").height() + "px").height($(window).height() - ($("#top").height() + $("#bottom").height()));
        $(".playerSlot").height($("#container").height() / (players.length + 1.1));
        for (i = 0; i < players.length; i++) {
            $("#playerImage" + i).css({
                'right':'-' + ($(".numberSlot").width() * (1 + players[i][2]) - 5) + 'px',
                'left': 'auto'
            });
        }
    });


});