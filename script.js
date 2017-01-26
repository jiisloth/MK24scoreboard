/**
 * Created by lapsloth on 25.1.2017.
 */


var maps = ["LuigiCircuit", "PeachBeach", "BabyPark", "DryDryDesert", "MushroomBridge", "MarioCircuit", "DaisyCruiser", "WaluigiStadium", "SherbetLand", "MushroomCity", "YoshiCircuit", "DKMountain", "WarioColosseum", "DinoDinoJungle", "BowserCastle", "RainbowRoad"];

var names = ["AAAAAA", "BBBB", "CCCCCC", "DDDDDD", "EEEEE", "FFFFF", "GGGGG", "HHHHHHH", "IIIIII", "jsloth"]

var rounds = 12;

$(document).ready(function () {


    for (var i = 0; i < maps.length; i++) {
        map = $('<div class="map"><img class="mapImage" src="images/maps/' + maps[i] + '.png"><div class="mapCount">10</div></div>');
        cup = "#cup" + (Math.floor(i / 4) + 1);
        map.appendTo($(cup));
    }
    $("#container").height($(window).height() - ($("#top").height() + $("#bottom").height()));


    for (var i = 0; i < names.length; i++) {
        playerslot = $('<div id="player' + i + '" class="playerSlot"><div class="name">' + names[i] + '</div><div class="score"><div class="playerImageHolder"><img class="playerImage" src="images/playerIcons/mario.png"></div></div></div>')
        playerslot.appendTo($("#container"));
    }

    $(".playerSlot").height($("#container").height() / (names.length + 1.1));

    for (var i = 0; i <= rounds; i++) {
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

    $(window).resize(function () {
        $("#container").height($(window).height() - ($("#top").height() + $("#bottom").height()));
        $(".numberSlot").css("line-height", $(".playerSlot").height() + "px").height($(window).height() - ($("#top").height() + $("#bottom").height()));
        $(".playerSlot").height($("#container").height() / (names.length + 1.1));
        $(".playerImage").css({
            'right':'-' + ($(".numberSlot").width() * 1 - 5) + 'px',
            'left': 'auto'
        });
    });


});