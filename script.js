/**
 * Created by lapsloth on 25.1.2017.
 */


var maps = ["LuigiCircuit", "PeachBeach", "BabyPark", "DryDryDesert", "MushroomBridge", "MarioCircuit", "DaisyCruiser", "WaluigiStadium", "SherbetLand", "MushroomCity", "YoshiCircuit", "DKMountain", "WarioColosseum", "DinoDinoJungle", "BowserCastle", "RainbowRoad"];
var mapCount = [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0];

var betterRandom;
var seed;
var mapNumber;


var players = [];

var mapList = [];

var playing = [0,1,2,3];
var que = [4,5,6,7,8,9];

var jonne = "none";

var rounds = 24;

var i;
var lastPlayer = [];


function playerMove(id) {
        players[id][2] += 1;
        var temp = playing[playing.indexOf(id)];
        playing[playing.indexOf(id)] = que[0];
        lastPlayer.push(que[0]);
        que.splice(0,1);
        que.push(temp);
        checkJonne();
        updateQue();
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
        var lastPlayerCopy = lastPlayer.slice(0);
        for (i = lastPlayerCopy.length-1; i >= 0; i--){
            if (typeof lastPlayerCopy[i] === "string") {
                lastPlayerCopy[i] = parseInt(lastPlayerCopy[i].split(":")[1]);
            }
        }
        for (i = lastPlayerCopy.length-1; i >= 0; i--){
            if (sofa.indexOf(lastPlayerCopy[i]) != -1){
                sofa.splice(sofa.indexOf(lastPlayerCopy[i]), 1);
                if (sofa.length == 1) {
                    jonne = sofa[0];
                }
            }
        }
    }
    if (count < playing.length - 1 && count >= 0){
        jonne = "none";
        $(".playerImage").removeClass("jonne");
    }
    if (jonne != "none"){
        $(".playerImage").removeClass("jonne");
        $("#playerImage"+jonne).addClass("jonne");
    }

}


function undoMove() {
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


function writeCookie() {
    var now = new Date();
    now.setMonth(now.getMonth() + 1);
    if (lastPlayer.length > 0) {
        document.cookie = "?players=" + encodeURI(players) + "&rounds=" + rounds +  "&betterRandom=" + betterRandom + "&seed=" + seed + "&mapNumber=" + mapNumber + "&lastPlayer=" + lastPlayer + "&playing=" + playing + "&que=" + que + "&mapCount=" + mapCount + ";expires=" + now.toUTCString() + ";";
    } else {
        document.cookie = "?players=" + encodeURI(players) + "&rounds=" + rounds +  "&betterRandom=" + betterRandom + "&seed=" + seed + "&mapNumber=" + mapNumber + ";expires=" + now.toUTCString() + ";";
    }
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

    if (params.length > 5) {
        lastPlayer = params[5].split("=")[1].split(",");
        for (i = 0; i < lastPlayer.length; i++) {
            if (!isNaN(lastPlayer[i])) {
                lastPlayer[i] = parseInt(lastPlayer[i])
            }
        }
        playing = params[6].split("=")[1].split(",");
        for (i = 0; i < playing.length; i++) {
            playing[i] = parseInt(playing[i])
        }
        que = params[7].split("=")[1].split(",");
        for (i = 0; i < que.length; i++) {
            que[i] = parseInt(que[i])
        }
        mapCount = params[8].split("=")[1].split(",");
        for (i = 0; i < mapCount.length; i++) {
            mapCount[i] = parseInt(mapCount[i])
        }
    }
    betterRandom = (params[2].split("=")[1] == "true");
    seed = parseInt(params[3].split("=")[1]);
    mapNumber = parseInt(params[4].split("=")[1]);
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
// ?players=qweqwe,donkeykong,0,qweqwe,daisy,0,qweqw,toadette,0,asds,toad,0,qawewq,peach,0,awdaw,luigi,0,asdsd,yoshi,0,weq,bowser,0,asdad,mario,0,qweq,mage,0&rounds=24


function updateQue(){
    for (i = 0; i < playing.length; i++) {
        var div = $("#player" + (playing[i])+" .name"+" .turnNumber");
        div.html( $("<img src='images/icons/player" + (i + 1) + ".png'>"));
    }
    for (i = 0; i < que.length; i++) {
        div = $("#player" + (que[i])+" .name"+" .turnNumber");
        div.text((i + 1) +".");
    }
}

function random()
{

    m_z = (36969 * (m_z & 65535) + (m_z >> 16)) & mask;
    m_w = (18000 * (m_w & 65535) + (m_w >> 16)) & mask;
    var result = ((m_z << 16) + m_w) & mask;
    result /= 4294967296;
    return result + 0.5;
}

var m_w = 123446366789;
var m_z = 987654321;
var mask = 0xffffffff;

function randomMapList() {
    for (i = 0; i < rounds * players.length; i++) {
        var map = Math.floor(random() * 16);
        if (mapList.length > 0) {
            while (map == mapList[mapList.length - 1]) {
                map = Math.floor(random() * 16);
            }
        }
        mapList.push(map);
    }
}

function flashMap() {
    $("#map"+mapList[mapNumber]).children().first().toggleClass("highlight");
    setTimeout(flashMap, 700)
}

function getMap() {
    $(".mapImage").addClass("highlight");
    $("#map"+mapList[mapNumber]).children().first().removeClass("highlight");
}
function updateMapCount(value) {
    mapCount[mapList[mapNumber]] += value;
    $("#mapCount" + mapList[mapNumber]).text(mapCount[mapList[mapNumber]]);
    writeCookie();

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

function resetSize() {
    $("#container").height($(window).height() - ($("#top").height()*2));
    $(".numberSlot").css("line-height", $(".playerSlot").height() + "px").height($(window).height() - ($("#top").height() *2));
    $(".playerSlot").height($("#container").height() / (players.length + 1.1));
    for (i = 0; i < players.length; i++) {
        $("#playerImage" + i).css({
            'right':'-' + ($(".numberSlot").width() * (1 + players[i][2]) - 5) + 'px',
            'left': 'auto'
        });
    }
}

$(document).ready(function () {
    readParameters();
    m_w = seed;
    randomMapList();



    for (i = 0; i < maps.length; i++) {
        map = $('<div class="map" id="map'+  i + '"><img class="mapImage" src="images/maps/' + maps[i] + '.png"/><div id="mapCount'+  i + '" class="mapCount">' + mapCount[i] + '</div></div>');
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
    number = $('<div class=numberSlot style="background-color: rgba(204,194,0,0.65); width: ' + 100/(rounds+1) +'%"><img src="images/icons/lastLap.png"></div>');
    number.appendTo($("#marker"));


    $(".numberSlot").css("line-height", $(".playerSlot").height() + "px");
    $(".numberSlot").height($(window).height() - ($("#top").height() + $("#bottom").height()));
    $(".playerImage").css({
        'right':'-' + ($(".numberSlot").width() * 1 - 5) + 'px',
        'left': 'auto'
    });

    updateQue();


    $(".map").click( function () {
        if (!betterRandom) {
            var id = parseInt(($(this).attr('id').replace("map", "")));
            mapCount[id] += 1;
            $("#mapCount" + id).text(mapCount[id]);
            writeCookie();
        }
    });


    document.addEventListener('keydown', function(event) {
        if( event.keyCode >= 48 && event.keyCode <= 57 ) {
            var id = event.keyCode - 49;
            if (id < 0){ id = 9}
            if (playing.indexOf(id) != -1) {
                playerMove(id);
                if (betterRandom) {
                    mapNumber += 1;
                    updateMapCount(1);
                    getMap();
                }
                writeCookie();
            }
        }
        if ( event.keyCode == 8 ){
            if (lastPlayer.length > 0) {
                undoMove();
                if (betterRandom) {
                    updateMapCount(-1);
                    mapNumber -= 1;
                    getMap();
                }
                writeCookie();
            }

        }
        if (event.keyCode == 46){
            skippy();
            writeCookie();

        }

    });
    if (betterRandom) {
        getMap();
        flashMap();
    }
    animateEngine();
    animateDrive();
    checkJonne();


    $(window).resize(function () {
        resetSize();
    });

    resetSize();
});