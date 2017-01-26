/**
 * Created by lapsloth on 25.1.2017.
 */


var maps = ["LuigiCircuit", "PeachBeach", "BabyPark", "DryDryDesert", "MushroomBridge", "MarioCircuit", "DaisyCruiser", "WaluigiStadium", "SherbetLand", "MushroomCity", "YoshiCircuit", "DKMountain", "WarioColosseum", "DinoDinoJungle", "BowserCastle", "RainbowRoad"];

var names = ["AAAAAA", "BBBB", "CCCCCC", "DDDDDD", "EEEEE", "FFFFF", "GGGGG", "HHHHHHH", "IIIIII", "jsloth"]

var icons = ["mario", "luigi", "bowser", "peach", "daisy", "yoshi", "toad", "toadette", "donkeykong", "boo", "koopa", "klunk", "chuck", "link", "chiken", "bubble", "mage", "megaman", "pikachu", "samus", "sonic"]

var players = [];
var playerCount = 0;
var iconChoice = "";


var rounds = 24;

var i;

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}



function nextPlayer(){
    $("#nameInput").val("")
    iconChoice = "";
}

function initScoreboard() {
    for (i = 0; i < maps.length; i++) {
        map = $('<div class="map"><img class="mapImage" src="images/maps/' + maps[i] + '.png"><div class="mapCount">0</div></div>');
        cup = "#cup" + (Math.floor(i / 4) + 1);
        map.appendTo($(cup));
    }
    $("#container").height($(window).height() - ($("#top").height() + $("#bottom").height()));


    for (i = 0; i < players.length; i++) {
        playerslot = $('<div id="player' + i + '" class="playerSlot"><div class="name">' + players[i][0] + '</div><div class="score"><div class="playerImageHolder"><img class="playerImage" src="images/playerIcons/' + players[i][1] + '.png"></div></div></div>')
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
}


$(document).ready(function () {
    
    $("#getGameSettings").click( function () {
        rounds = parseInt($("#roundInput").val());
        playerCount = $("#playerInput").val();
        $("#gameSettings").hide();
        $("#playerSettings").show();
        nextPlayer()

    });
    
    for (i = 0; i < icons.length; i++){
        iconButton = $('<img id="' + icons[i] + 'Button" class="iconChoice" src="images/playerIcons/'+ icons[i] + '.png">');
        if (i % 5 == 0){
            $('<br>').appendTo($("#iconHolder"));
        }
        iconButton.appendTo($("#iconHolder"));
    }

    $(".iconChoice").click( function () {
        $(".iconChoice").css('border-width', '0');
        $(this).css('border', '3px solid black');
        iconChoice = $(this).attr('id').replace("Button", "");
    });

    $("#getPlayerSettings").click( function () {
        if (iconChoice == "" && $("#nameInput").val() == "jsloth") {
            iconChoice = "misato";
        }

        if (iconChoice != "" && $("#nameInput").val() != ""){
            var player = [$("#nameInput").val(), iconChoice, 0];
            $("#" + iconChoice + "Button").remove();

            players.push(player);
            nextPlayer();
            if (players.length >= playerCount) {
                players = shuffle(players);
                $("#settings").hide();
                $("#scoreboard").show();
                initScoreboard();

            }


        }
    });


    $(window).resize(function () {
        $("#container").height($(window).height() - ($("#top").height() + $("#bottom").height()));
        $(".numberSlot").css("line-height", $(".playerSlot").height() + "px").height($(window).height() - ($("#top").height() + $("#bottom").height()));
        $(".playerSlot").height($("#container").height() / (players.length + 1.1));
        $(".playerImage").css({
            'right':'-' + ($(".numberSlot").width() * 1 - 5) + 'px',
            'left': 'auto'
        });
    });


});