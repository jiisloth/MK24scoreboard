/**
 * Created by lapsloth on 25.1.2017.
 */

var icons = ["mario", "luigi", "bowser", "peach", "daisy", "yoshi", "toad", "toadette", "donkeykong", "boo", "koopa", "klunk", "chuck", "link", "chiken", "bubble", "mage", "megaman", "pikachu", "samus", "sonic"]

var players = [];
var playerCount = 0;
var controllers = 0;
var iconChoice = "";

var betterRandom;

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


function initNextPlayer(){
    $("#nameInput").val("").focus();
    iconChoice = "";
    $(".iconChoice").removeClass("highlight");
}

function nextPlayer() {
    if (iconChoice == "" && $("#nameInput").val() == "jsloth") {
        iconChoice = "misato";
    }

    if (iconChoice != "" && $("#nameInput").val() != "") {
        var player = [$("#nameInput").val(), iconChoice, 0];
        $("#" + iconChoice + "Button").remove();

        players.push(player);
        initNextPlayer();
        if (players.length >= playerCount) {
            players = shuffle(players);
            window.location.href = "scoreboard.html?players=" + encodeURI(players) + "&rounds=" + rounds + "&controllers=" + controllers + "&betterRandom=" + betterRandom + "&seed=" + Math.floor(Math.random() * 100000) + "&mapNumber=" + 0;

        }


    }
}

$(document).ready(function () {
    
    $("#getGameSettings").click( function () {
        rounds = parseInt($("#roundInput").val());
        playerCount = $("#playerInput").val();
        controllers = $("#controllerInput").val();
        betterRandom = $("#betterRandom").is(':checked');
        $("#gameSettings").hide();
        $("#playerSettings").show();
        initNextPlayer()

    });
    
    for (i = 0; i < icons.length; i++){
        iconButton = $('<img id="' + icons[i] + 'Button" class="iconChoice" src="images/playerIcons/'+ icons[i] + '.png">');
        iconButton.appendTo($("#iconHolder"));
    }

    $(".iconChoice").click( function () {
        $("#nameInput").focus();
        $(".iconChoice").addClass("highlight");
        $(this).removeClass("highlight");
        iconChoice = $(this).attr('id').replace("Button", "");
    });

    $("#getPlayerSettings").click( function () {
        nextPlayer()
    });

    document.addEventListener('keydown', function(event) {
        if ( event.keyCode == 13 ) {
            nextPlayer()
        }
    });



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