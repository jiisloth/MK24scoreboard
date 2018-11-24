/**
 * Created by lapsloth on 25.1.2017.
 */


var maps = ["LuigiCircuit", "PeachBeach", "BabyPark", "DryDryDesert", "MushroomBridge", "MarioCircuit", "DaisyCruiser", "WaluigiStadium", "SherbetLand", "MushroomCity", "YoshiCircuit", "DKMountain", "WarioColosseum", "DinoDinoJungle", "BowserCastle", "RainbowRoad"];
var mapCount = [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0];
var keyCodeIds = {49:0, 50:1, 51:2, 52:3, 53:4, 54:5, 55:6, 56:7, 57:8, 48:9, 81:10, 87:11, 69:12, 82:13, 84:14, 89:15, 85:16, 73:17, 79:18, 80:19};

var betterRandom;
var seed;
var mapNumber;

var controllers = 0;
var players = [];

var mapList = [];

var playing = [];
var que = [];

var jonne = "none";

var rounds = 0;

var i;
var lastPlayer = [];

var shift = false;


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
    var errorOne;
    var lastOne = lastPlayer.pop();
    if (typeof lastOne === "string"){
        if (lastOne.split(":")[0] === "<-ss"){
            lastOne = parseInt(lastOne.split(":")[1]);
            errorOne = que.pop();
            playing[playing.indexOf(lastOne)] = errorOne;
            que.unshift(lastOne);
            // lastPlayer.push(errorOne);
        } else {
            lastOne = parseInt(lastOne.split(":")[1]);
            errorOne = que.pop();
            playing[playing.indexOf(lastOne)] = errorOne;
            que.unshift(lastOne);
            lastPlayer.push(errorOne);
        }

    } else {
        errorOne = que.pop();
        playing[playing.indexOf(lastOne)] = errorOne;
        que.unshift(lastOne);
        players[errorOne][2] -= 1;
        $("#playerImage" + errorOne).css({
            'right': '-' + ($(".numberSlot").width() * (1 + players[errorOne][2]) - 5) + 'px',
            'left': 'auto'
        });
        if (betterRandom) {
            updateMapCount(-1);
            mapNumber -= 1;
            getMap();
        }
    }
    checkJonne();
    updateQue();

}

function superskip() {
    var skip = prompt("Skip controller number:", "");

    if (skip == null || skip == "") {
        return
    } else if (0 < skip && skip <= controllers ){
        lastOne = playing[skip-1];
        var temp = playing[playing.indexOf(lastOne)];
        playing[playing.indexOf(lastOne)] = que[0];
        lastPlayer.push("<-ss:"+que[0]);
        que.splice(0,1);
        que.push(temp);
        checkJonne();
        updateQue();
        return
    }

    superskip()
}


function skippy() {
    var lastOne;
    if (typeof lastPlayer[lastPlayer.length-1] === "string") {
        if (lastPlayer[lastPlayer.length-1].split(":")[0] === "<-ss"){
            superskip();
            return
        }
        lastOne = parseInt(lastPlayer[lastPlayer.length-1].split(":")[1]);
    } else if (typeof lastPlayer[lastPlayer.length-1] === "number"){
        lastOne = lastPlayer.pop();
    } else {
        lastOne = superskip();
        return
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
        document.cookie = "?players=" + encodeURI(players) + "&rounds=" + rounds + "&controllers=" + controllers + "&betterRandom=" + betterRandom + "&seed=" + seed + "&mapNumber=" + mapNumber + "&lastPlayer=" + lastPlayer + "&playing=" + playing + "&que=" + que + "&mapCount=" + mapCount + ";expires=" + now.toUTCString() + ";";
    } else {
        document.cookie = "?players=" + encodeURI(players) + "&rounds=" + rounds + "&controllers=" + controllers + "&betterRandom=" + betterRandom + "&seed=" + seed + "&mapNumber=" + mapNumber + ";expires=" + now.toUTCString() + ";";
    }
}

function readParameters(){
    var params = window.location.search;
    var paramsFromUrl = "yes";
    if (!params){
        paramsFromUrl = "no";
        params = document.cookie;
        if (!params){
            window.location.href = "old_index.html";
        }
    }
    params = params.substring(1).split("&");
    if (params.length > 6) {
        lastPlayer = params[6].split("=")[1].split(",");
        for (i = 0; i < lastPlayer.length; i++) {
            if (!isNaN(lastPlayer[i])) {
                lastPlayer[i] = parseInt(lastPlayer[i])
            }
        }
        playing = params[7].split("=")[1].split(",");
        for (i = 0; i < playing.length; i++) {
            playing[i] = parseInt(playing[i])
        }
        que = params[8].split("=")[1].split(",");
        for (i = 0; i < que.length; i++) {
            que[i] = parseInt(que[i])
        }
        mapCount = params[9].split("=")[1].split(",");
        for (i = 0; i < mapCount.length; i++) {
            mapCount[i] = parseInt(mapCount[i])
        }
    }
    betterRandom = (params[3].split("=")[1] == "true");
    seed = parseInt(params[4].split("=")[1]);
    mapNumber = parseInt(params[5].split("=")[1]);
    controllers = parseInt(params[2].split("=")[1]);
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
        window.location.href = "old_scoreboard.html";
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
    for (i = 0; i < players.length; i++) {
        $("#info-score" + i ).text(players[i][2])
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
    for (i = 0; i < rounds * players.length*2; i++) {
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


function createQue() {
    var i;
    for (i = 0; i < controllers; i ++){
        playing.push(i)
    }
    for (i = controllers; i < players.length; i ++){
        que.push(i)
    }
}


$(document).ready(function () {
    readParameters();
    m_w = seed;
    randomMapList();

    if (playing.length == 0){
        createQue();
    }

    for (i = 0; i < maps.length; i++) {
        map = $('<div class="map" id="map'+  i + '"><img class="mapImage" src="images/maps/' + maps[i] + '.png"/><div id="mapCount'+  i + '" class="mapCount">' + mapCount[i] + '</div></div>');
        cup = "#cup" + (Math.floor(i / 4) + 1);
        map.appendTo($(cup));
    }
    $("#container").height($(window).height() - ($("#top").height() + $("#bottom").height()));


    for (i = 0; i < players.length; i++) {
        playerslot = $('<div id="player' + i + '" class="playerSlot">' +
            '<div class="name">' +
            '<div class="turnNumber"></div>' +
            '<img class="mini-p-img" src="images/playerIcons/' + players[i][1] + '.png">' +
            '<div class="info">' +
            '<div>' + decodeURI(players[i][0]) + '</div>' +
            '<div class="info-score">' +
            '<img src="images/icons/beer.png">' +
            'x<div id="info-score' + i + '" class="info">0</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div id="score' + i + '" class="score"><div class="playerImageHolder"><img id="playerImage' + i + '" class="playerImage" src="images/playerIcons/' + players[i][1] + '.png"></div></div></div>')
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
    number = $('<div class=numberSlot style="background-color: rgba(204,194,0,0.65); width: ' + 100/(rounds+1) +'%"><img class="helpOPEN" src="images/icons/lastLap.png"></div>');
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

    $(".map").contextmenu( function (e) {
        e.preventDefault();
        if (!betterRandom) {
            var id = parseInt(($(this).attr('id').replace("map", "")));
            mapCount[id] -= 1;
            $("#mapCount" + id).text(mapCount[id]);
            writeCookie();
        }
    });

    $(".helpOPEN").click( function () {
        $("#help").show()
    });
    $("#helpOK").click( function () {
        $("#help").hide()
    });

    document.addEventListener('keydown', function(event) {
        $("#help").hide()
        if( keyCodeIds.hasOwnProperty(event.keyCode)) {
            var id = keyCodeIds[event.keyCode];
            if (id < players.length) {
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
        }
        if ( event.keyCode == 8 ){
            if (lastPlayer.length > 0) {
                undoMove();
                writeCookie();
            }

        }
        if (event.keyCode == 16){
            shift = true
        }
        if (event.keyCode == 46){
            if (shift){
                shift = false;
                superskip();
            }
            else {
                skippy();
            }
            writeCookie();

        }

    });
    document.addEventListener('keyup', function(event) {
        if (event.keyCode == 16){
            shift = false
        }
    });

    if (betterRandom) {
        updateMapCount(1);
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
    setTimeout(resetSize, 500)
});