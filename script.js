$(document).ready(function () {
    let settings = read_attributes();
    let states;
    let state;
    let mapstates;
    let currentstate;
    let currentmapstate;
    let hold_button = {};
    if (settings.mode === 'init'){
        state = init_state(settings.players, settings.controllers);
        states = [add_state(state)];
        mapstates = [init_mapstate()];
        settings.mode = 'cookie';
        localStorage.states = JSON.stringify(states);
        localStorage.settings = JSON.stringify(settings);
        localStorage.maps = JSON.stringify(mapstates);
        window.location.href =  "scoreboard.html";
        currentstate = 0;
        currentmapstate = 0;
    } else if (settings.mode === 'cookie'){
        states = JSON.parse(localStorage.states);
        settings = JSON.parse(localStorage.settings);
        mapstates = JSON.parse(localStorage.maps);

        currentstate = states.length-1;
        currentmapstate = mapstates.length-1;
    }

    const maps = [
        ['LuigiCircuit', 'PeachBeach', 'BabyPark', 'DryDryDesert'],
        ['MushroomBridge', 'MarioCircuit', 'DaisyCruiser', 'WaluigiStadium'],
        ['SherbetLand', 'MushroomCity', 'YoshiCircuit', 'DKMountain'],
        ['WarioColosseum', 'DinoDinoJungle', 'BowserCastle', 'RainbowRoad']];
    const mapdict = generate_maps(maps); // Could use this instead of counting..
    generate_rounds(settings.rounds);
    generate_players(settings.players);
    draw_state(states[currentstate], settings.controllers, mapstates[currentmapstate],  maps);

    $(document).keydown(function (e) {
        if (e.keyCode === 8){
            e.preventDefault()
        }
        const pcodes = [49,50,51,52,53,54,55,56,57,48,81,87,69,82,84,89,85,73,79,80];
        const mcodes = [65,83,68,70, 71,72,74,75, 90,88,67,86, 66,78,77,188];
        if (pcodes.indexOf(e.keyCode) < settings.players.length && pcodes.indexOf(e.keyCode) >= 0){
            if (currentstate !== states.length-1) {
                states = states.slice(0, currentstate + 1)
            }
            if (hold_button[46]) {
                states.push(next_round(pcodes.indexOf(e.keyCode), states[currentstate], settings, 'dnf'));
                currentstate = states.length-1;
                localStorage.states = JSON.stringify(states);
            } else if (states[currentstate].line[pcodes.indexOf(e.keyCode)] < settings.controllers){
                if (hold_button[8]){ // backspace
                     states.push(next_round(pcodes.indexOf(e.keyCode), states[currentstate], settings, 'skip'));
                } else if (hold_button[16]){ // shift
                     states.push(next_round(pcodes.indexOf(e.keyCode), states[currentstate], settings, 'spes'));
                } else {
                     states.push(next_round(pcodes.indexOf(e.keyCode), states[currentstate], settings, 'win'));
                }
                currentstate = states.length-1;
                localStorage.states = JSON.stringify(states);
            }
        } else if (e.keyCode === 37) { // LEFT
            if (currentstate > 0){
                currentstate -= 1;
                            }
        }
        else if (e.keyCode === 39) { // RIGHT
            if (currentstate < states.length-1){
                currentstate += 1;
                            }
        }
        else if (mcodes.indexOf(e.keyCode) < mapstates[currentmapstate].length && mcodes.indexOf(e.keyCode) >= 0){
            if (currentmapstate !== mapstates.length-1){
                    mapstates = mapstates.slice(0, currentmapstate+1)
            }
            let new_mapstate = mapstates[currentmapstate].slice();
            new_mapstate[mcodes.indexOf(e.keyCode)] += 1;
            mapstates.push(new_mapstate);
            currentmapstate = mapstates.length -1;
            localStorage.maps = JSON.stringify(mapstates);
        } else if (e.keyCode === 109 || e.keyCode === 189) { // num.minus
            if (currentmapstate > 0){
                currentmapstate -= 1;
            }
        }
        else if (e.keyCode === 107 || e.keyCode === 187) { // num.plus
            if (currentmapstate < mapstates.length-1){
                currentmapstate += 1;
            }
        }
        hold_button[e.keyCode] = true;
        draw_state(states[currentstate], settings.controllers, mapstates[currentmapstate], maps);
    });
    $(document).keyup(function (e) {
        hold_button[e.keyCode] = false;
    });
    $('.map').click(function () {
        for (let c = 0; c < maps.length; c++){
            m = maps[c].indexOf(this.id);
            if (m >= 0){
                let new_mapstate = mapstates[currentmapstate].slice();
                new_mapstate[c * 4 + m] += 1;
                mapstates.push(new_mapstate);
                currentmapstate = mapstates.length -1;
                localStorage.maps = JSON.stringify(mapstates);
            }

        }
        draw_state(states[currentstate], settings.controllers, mapstates[currentmapstate],  maps);
    });
});

function generate_maps(maps) {
    let mapdict = {};
    for (let cup = 0; cup < maps.length; cup++){
        for (let map = 0; map < maps[cup].length; map ++){
            $('#cup_' + (cup + 1)).append('<div id="' + maps[cup][map] + '" class="map">' +
                '<img src="images/maps/' + maps[cup][map] + '.png">' +
                '<div class="mapcount">mapcount</div>' +
                '</div>');
            mapdict[maps[cup][map]] = (cup + 1) * (map + 1);
        }
    }
    return mapdict
}

function generate_rounds(rounds) {
    $('#rounds').html("");
    for (let i = 0; i < rounds + 1; i ++){
        $('#rounds').append('<div class="round">' + i + '</div>')
    }
    $('#rounds').append('<div class="round goal"><img src="images/icons/lastLap.png"></div>')
}

function generate_players(players) {
    $('#players').html("");
    for (let p = 0; p < players.length; p ++){
        $('#players').append('<div id="p' + p +'" class="player">' +
            '<div class="line">' +
            p + '.' +
            '</div>' +
            '<div class="info">' +
            '<div><img class="info_char" src="images/playerIcons/' + players[p][1] + '.png"/></div>' +
            '<div>' +
            '<div class="name">' + players[p][0] + '</div>' +
            '<div class="stats">' +
            '<img src="images/icons/win.png"><div class="wins"></div>' +
            '<img src="images/icons/plays.png"><div class="plays"></div>' +
            '<img class="playslineico" src="images/icons/playsline.png"><div class="playsline playslineico"></div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="character">' +
                '<img src="images/playerIcons/' + players[p][1] + '.png">' +
            '</div>' +
            '</div>')
    }
}

function read_attributes() {
    let attr = decodeURI(window.location.search.substring(1));
    if (attr){
        attr = attr.split('&');
        const load = attr[0].split('=')[1];
        if (load === 'init') {
            const pt = attr[1].split('=')[1].split(',');
            let players = [];
            for (let p = 0; p < pt.length / 2; p++) {
                players.push([pt[p * 2], pt[p * 2 + 1].split("icon_")[1]]);
            }
            const controllers = parseInt(attr[2].split('=')[1]);
            const rounds = parseInt(attr[3].split('=')[1]);
            return {mode: load, players: players, controllers: controllers, rounds: rounds};
        } else {
            return {mode: load};
        }
    } else {
        return {mode: 'cookie'};
    }

}

function init_state(players, controllers) {
    let wins = [];
    let plays = [];
    let playsline = [];
    let line = [];
    let dnf = [];
    let spes = [];
    const consuf = [0,2,1,3,4,6,5,7];
    for (let p = 0; p < players.length; p ++) {
        wins.push(0);
        plays.push(0);
        playsline.push(0);
        if (p < controllers){
            line.push(consuf[p]);
        } else {
            line.push(p)
        }
        spes.push("");
        dnf.push(false)
    }
    return {wins: wins, plays:plays, playsline:playsline, line:line, dnf:dnf, spes:spes}
}

function init_mapstate() {
    return [0,0,0,0, 0,0,0,0, 0,0,0,0 ,0,0,0,0];
}

function add_state(state) {
    return {
        wins: state.wins.slice(),
        plays: state.plays.slice(),
        playsline: state.playsline.slice(),
        line: state.line.slice(),
        spes: state.spes.slice(),
        dnf: state.dnf.slice()
    }
}

function draw_state(state, controllers, mapstate, maplist) {
    const jonne = state.playsline.indexOf(Math.max.apply(Math, state.playsline));
    const width = $('.round').width();
    let jonne_active = 1;
    $('.character > img').removeClass('driving');
    $('.player').removeClass('dnf');
    $('.special').remove();
    for (let i = 0; i < state.wins.length; i ++){
        let left = (195 + (state.wins[i]+1) * width) + "px";
        $('#p' + i +' > .character').css({"-webkit-transform":"translate("+left+",0px)"});
        $('#p' + i +' > div > div > .stats > .wins').html(state.wins[i]);
        $('#p' + i +' > div > div > .stats > .plays').html(state.plays[i]);
        $('#p' + i +' > div > div > .stats > .playsline').html(state.playsline[i]);
        if (state.line[i] < controllers){
            $('#p' + i +' > .character > img').addClass('driving');
            $('#p' + i +' > .character > .driving').css('animation-delay', '-0.' + i +'s');
            $('#p' + i +' > .line').html('<img src="images/icons/player' + (state.line[i] + 1) + '.png"/>');
            $('#p' + i +' > div > div > .stats > .playslineico').show();
            if (i !== jonne && state.wins[i] === 0){
                jonne_active = 0
            }

        } else {
            $('#p' + i +' > .line').html((state.line[i] - controllers + 1) + ".");
            $('#p' + i +' > div > div > .stats > .playslineico').hide()
        }
        if (state.dnf[i]){
            $('#p' +  i).addClass('dnf');
            $('#p' + i +' > .line').html('DNF');
        }
        // spessut
        let spes = state.spes[i].split('-');
        for (let s = 1; s < spes.length; s++){
            console.log(290 + width/2)
            $('#p' + i ).append(
                '<img src="images/icons/special.png" class="special" ' +
                'style="left:' + (280 + parseInt(spes[s]) * width + width/2 -14)  + 'px">').append(
                    '<img src="images/icons/special.png" class="special special2" ' +
                'style="left:' + (280 + spes[s] * width + width/2 -14)  + 'px">')
        }
    }
    for (let m = 0; m < mapstate.length; m ++){
        $('#' + maplist[Math.floor(m/4)][m%4] +' > .mapcount').html(mapstate[m])
    }
    $('.character > img').removeClass('jonne');
    if (jonne_active > 0){
        $('#p' + jonne +' > .character > img').addClass('jonne');
    }
}

function next_round(p, oldstate, s, action) {
    let state = {wins: oldstate.wins.slice(),
        plays: oldstate.plays.slice(),
        playsline: oldstate.playsline.slice(),
        line: oldstate.line.slice(),
        spes: oldstate.spes.slice(),
        dnf: oldstate.dnf.slice()};
    if (action === 'spes') {
        state.spes[p] += '-' + state.wins[p];
    } else {
        if (action === 'win') {
            state.wins[p] += 1;
            for (let i = 0; i < state.plays.length; i++) {
                if (state.line[i] < s.controllers) {
                    state.plays[i] += 1;
                    state.playsline[i] += 1;
                }
            }
        }
        state.playsline[p] = 0;
        if (s.controllers <= state.line.length - 1 - state.dnf.filter(Boolean).length) {
            for (let l = 0; l < state.line.length; l++) {
                if (state.line[l] === s.controllers) {
                    next_con = l
                }
                if (state.line[l] > s.controllers && !state.dnf[l]) {
                    state.line[l] = state.line[l] - 1;
                }
            }
            state.line[next_con] = state.line[p];
            if (action === 'dnf') {
                state.line[p] = state.line.length - 1
            } else {
                state.line[p] = state.line.length - 1 - state.dnf.filter(Boolean).length;
            }
        }
        if (action === 'dnf') {
            state.dnf[p] = true;
        }
    }
    return state
}
