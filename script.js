/**
 * Created by lapsloth on 25.1.2017.
 */


var maps = ["LuigiCircuit", "PeachBeach", "BabyPark", "DryDryDesert", "MushroomBridge", "MarioCircuit", "DaisyCruiser", "WaluigiStadium", "SherbertLand", "MushroomCity", "YoshiCircuit", "DKMountain", "WarioColosseum", "DinoDinoJungle", "BowserCastle", "RainbowRoad"];



$(document).ready(function() {
    for (var i = 0; i < maps.length; i++){
        map =  $('<div class="map"><img class="mapImage" src="images/maps/' + maps[i] + '.png"><div class="mapCount">10</div></div>');
        map.appendTo($(".cup1"));
    }
});