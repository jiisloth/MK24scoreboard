const golden = ['megaman', 'kratos', 'barret', 'geralt', 'hiire', 'luffy'];

const socket = new WebSocket('wss://mk24.jsloth.fi:443');
let is_online = false
let gamecode = ""
// Connection opened
socket.addEventListener('open', function (event) {
    is_online = true
    socket.send(JSON.stringify({'type': 'host'}));
});

// Listen for messages
socket.addEventListener('message', function (event) {
    let msg = JSON.parse(event.data)
    if (msg.type === "init_lobby"){
        console.log("JOINCODE: " + msg.secret)
        gamecode = msg.secret
    }
    if (msg.type === "get_settings"){
        socket.send(JSON.stringify({'type': 'settings', 'settings': settings_to_send}));
    }
    if (msg.type === "get_state"){
        socket.send(JSON.stringify({'type': 'init_state', 'state': states[currentstate]}));
    }
    if (msg.type === "get_all_states"){
        socket.send(JSON.stringify({'type': 'all_states', 'state': states}));
    }
});

let settings_to_send

function send_data(data) {
    if (is_online){
        socket.send(JSON.stringify(data));
    }
}

let states;
let state;
let mapstates;
let currentstate;
let currentmapstate;

const playernumbers = "1234567890QWERTYUIOP"
const linecolors = ["#ececf1", "#cfd6e0", "#aec1e1", "#95b1e1", "#7ba1e0", "#6291e0", "#4881df", "#3474df",]

$(document).ready(function () {
    let settings = read_attributes();
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
    settings_to_send = settings
    const maps = [
        ['LuigiCircuit', 'PeachBeach', 'BabyPark', 'DryDryDesert'],
        ['MushroomBridge', 'MarioCircuit', 'DaisyCruiser', 'WaluigiStadium'],
        ['SherbetLand', 'MushroomCity', 'YoshiCircuit', 'DKMountain'],
        ['WarioColosseum', 'DinoDinoJungle', 'BowserCastle', 'RainbowRoad']];
    const mapkeys = [
        ['A', 'S', 'D', 'F'],
        ['G', 'H', 'J', 'K'],
        ['Z', 'X', 'C', 'V'],
        ['B', 'N', 'M', ',']];
    const playerkeys = ['1','2','3','4','5','6','7','8','9','0','Q','W','E','R','T','Y','U','I','O','P']
    const mapdict = generate_maps(maps, mapkeys); // Could use this instead of counting..
    generate_rounds(settings.rounds);
    generate_players(settings.players, playerkeys);
    draw_state(states[currentstate], settings.controllers, mapstates[currentmapstate],  maps);

    $(document).keydown(function (e) {
        let do_draw = false
        if (e.keyCode === 8){
            e.preventDefault()
        }
        const pcodes = [49,50,51,52,53,54,55,56,57,48,81,87,69,82,84,89,85,73,79,80];
        const mcodes = [65,83,68,70, 71,72,74,75, 90,88,67,86, 66,78,77,188];
        if (pcodes.indexOf(e.keyCode) < settings.players.length && pcodes.indexOf(e.keyCode) >= 0){
            let state = false
            if (currentstate !== states.length-1) {
                states = states.slice(0, currentstate + 1)
            }
            if (hold_button[46]) {
                state = next_round(pcodes.indexOf(e.keyCode), states[currentstate], settings, 'dnf')
                states.push(state);
                currentstate = states.length-1;
                localStorage.states = JSON.stringify(states);
            } else if (states[currentstate].line[pcodes.indexOf(e.keyCode)] < settings.controllers){
                if (hold_button[8]){ // backspace
                    state = next_round(pcodes.indexOf(e.keyCode), states[currentstate], settings, 'skip')
                    states.push(state);
                } else if (hold_button[16]){ // shift
                    state = next_round(pcodes.indexOf(e.keyCode), states[currentstate], settings, 'spes')
                    states.push(state);
                } else {
                    state = next_round(pcodes.indexOf(e.keyCode), states[currentstate], settings, 'win')
                    states.push(state);
                }
                currentstate = states.length-1;
                localStorage.states = JSON.stringify(states);
            }
            if (state){
                send_data({"type": "state", "state": state})
                do_draw = true
            }
        } else if (e.keyCode === 37) { // LEFT
            if (currentstate > 0){
                currentstate -= 1;
                do_draw = true
                            }
        }
        else if (e.keyCode === 39) { // RIGHT
            if (currentstate < states.length-1){
                currentstate += 1;
                do_draw = true
                            }
        }
        else if (e.keyCode === 9) { // TAB
            e.preventDefault()
            $('#scoreboard').toggleClass("hidehelp")
            do_draw = true

        }
        else if (mcodes.indexOf(e.keyCode) < mapstates[currentmapstate].length && mcodes.indexOf(e.keyCode) >= 0){
            if (currentmapstate !== mapstates.length-1){
                    mapstates = mapstates.slice(0, currentmapstate+1)
            }
            let new_mapstate = mapstates[currentmapstate].slice();
            new_mapstate[mcodes.indexOf(e.keyCode)] += 1;
            mapstates.push(new_mapstate);
            send_data({"type": "mapstate", "mapstate": new_mapstate})
            currentmapstate = mapstates.length -1;
            localStorage.maps = JSON.stringify(mapstates);
            do_draw = true
        } else if (e.keyCode === 109 || e.keyCode === 189) { // num.minus
            if (currentmapstate > 0){
                currentmapstate -= 1;
                do_draw = true
            }
        }
        else if (e.keyCode === 107 || e.keyCode === 187) { // num.plus
            if (currentmapstate < mapstates.length-1){
                currentmapstate += 1;
                do_draw = true
            }
        }
        hold_button[e.keyCode] = true;
        if (do_draw){
            draw_state(states[currentstate], settings.controllers, mapstates[currentmapstate], maps);
        }
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
                send_data({"type": "mapstate", "mapstate": new_mapstate})
                currentmapstate = mapstates.length -1;
                localStorage.maps = JSON.stringify(mapstates);
            }

        }
        draw_state(states[currentstate], settings.controllers, mapstates[currentmapstate],  maps);
    });
    $('#gamecode').click(function () {
        navigator.clipboard.writeText(gamecode);
    });
});





function generate_maps(maps, mapkeys) {
    let mapdict = {};
    for (let cup = 0; cup < maps.length; cup++){
        for (let map = 0; map < maps[cup].length; map ++){
            $('#cup_' + (cup + 1)).append('<div id="' + maps[cup][map] + '" class="map">' +
                '<img src="images/maps/' + maps[cup][map] + '.png">' +
                '<div class="mapcount">mapcount</div>' +
                '<div class="mapkey">' + mapkeys[cup][map] + '</div>' +
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

function generate_players(players, playerkeys) {
    const width = $('.round').width();
    $('#players').html("");
    for (let p = 0; p < players.length; p ++){
        let gold = ""
        if (golden.includes(players[p][1])){
            gold = ' class="winner" '
        }
        $('#players').append('<div id="p' + p +'" class="player">' +
            '<div class="line">' +
            p + '.' +
            '</div>' +
            '<div class="info">' +
            '<div><img class="info_char" src="images/playerIcons/' + players[p][1] + '.png"/>' +

            '</div>' +
            '<div>' +
            '<div class="name">' + players[p][0] + '</div>' +
            '<div class="stats">' +
            '<img src="images/icons/win.png"><div class="wins"></div><div class="winspercent"></div>' +
            '<img src="images/icons/plays.png"><div class="plays"></div>' +
            '<div class="playslinehover">' +
            '<div class="playslineico"><img class="lineimg" src="images/icons/playsline.png"><div class="playsline"></div></div>' +
            '<div class="playslinepbico"><img class="linepbimg" src="images/icons/playsline.png"><div class="playspb"></div></div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="character">' +
                '<div class="fire">' +
                    '<div class="backfire fireani"></div>' +
                    '<div class="frontfire fireani"></div>' +
                '</div>' +
                '<img ' + gold + ' src="images/playerIcons/' + players[p][1] + '.png">' +
            '</div>' +
            '<div class="playerkeyhelp">If win, press:</div>' +
            '<div class="playerkey">'+playerkeys[p]+'</div>' +
            '</div>')
        $('#howtoplayers').append('<span class="howtolistbutton">' + playernumbers[p] + '</span> - ' + players[p][0] + '<br>')
        const helpwidth = $('.playerkeyhelp').width();
        let leftoffset = 294
        const helppos = Math.ceil(helpwidth/width)*width +width + leftoffset + "px";
        const helptextpos = width + (leftoffset) + "px";
        $('#p' + p + ' > .playerkey').css({
            "-webkit-transform": "translate(" + helppos + ",0px)",
            "width": "" + width + "px",
            "opacity": "0.2"
        })
        $('#p' + p + ' > .playerkeyhelp').css({
            "-webkit-transform": "translate(" + helptextpos + ",0px)",
        })
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
    let playspb = [];
    let line = [];
    let fire = [];
    let dnf = [];
    let spes = [];
    const consuf = [0,2,1,3,4,6,5,7];
    for (let p = 0; p < players.length; p ++) {
        wins.push(0);
        plays.push(0);
        playsline.push(0);
        playspb.push(0);
        fire.push(0);
        if (p < controllers){
            line.push(consuf[p]);
        } else {
            line.push(p)
        }
        spes.push("");
        dnf.push(false)
    }
    return {wins: wins, plays:plays, playsline:playsline, playspb:playspb, line:line, fire:fire, dnf:dnf, spes:spes}
}

function init_mapstate() {
    return [0,0,0,0, 0,0,0,0, 0,0,0,0 ,0,0,0,0];
}

function add_state(state) {
    return {
        wins: state.wins.slice(),
        plays: state.plays.slice(),
        playsline: state.playsline.slice(),
        playspb: state.playspb.slice(),
        line: state.line.slice(),
        fire: state.fire.slice(),
        spes: state.spes.slice(),
        dnf: state.dnf.slice()
    }
}

function draw_state(state, controllers, mapstate, maplist) {
    const jonne = state.playsline.indexOf(Math.max.apply(Math, state.playsline));
    const width = $('.round').width();
    const helpwidth = $('.playerkeyhelp').width();
    let leftoffset = 294
    const helppos = Math.ceil(helpwidth/width)*width +width + leftoffset + "px";
    const helptextpos = width + (leftoffset) + "px";
    let jonne_active = 1;
    $('.character > img').removeClass('driving');
    $('.player').removeClass('dnf');
    $('.special').remove();
    for (let i = 0; i < state.wins.length; i ++){
        let left = ((leftoffset-87) + (state.wins[i]+1) * width) + "px";
        $('#p' + i +' > .character').css({"-webkit-transform":"translate("+left+",0px)"});
        let key = $('#p' + i + ' > .playerkey')
        let keyhelp = $('#p' + i + ' > .playerkeyhelp')
        if (state.line[i] < controllers){
            if (state.wins[i] === 0) {
                key.css({
                    "-webkit-transform": "translate(" + helppos + ",0px)",
                    "width": "" + width + "px",
                    "opacity": "0.6"
                });
                keyhelp.css({
                    "-webkit-transform": "translate(" + helptextpos + ",0px)",
                    "opacity": "0.5"
                })
            } else {
                key.css({
                    "-webkit-transform": "translate(" + leftoffset + "px,0px)",
                    "opacity": "0.6"
                });
            }
        } else {
            if (state.wins[i] > 0) {
                key.css({
                    "-webkit-transform": "translate(" + leftoffset + "px,0px)",
                    "opacity": "0.2"
                });
            } else {
                key.css({
                    "opacity": "0"
                });
            }
            keyhelp.css({
                "opacity": "0.0"
            })

        }
        $('#p' + i +' > div > div > .stats > .wins').html(state.wins[i]);

        let fireopacity = Math.min(state.fire[i]/3.0, 1.0)
        let firesize = Math.min(state.fire[i]/5.0, 1.0)
        let firecontrast = state.fire[i]/8.0
        $('#p' + i + ' > .character > .fire > .fireani').css({
                    "-webkit-transform": "scale("+(0.5+firesize/2.0)+") rotate(-25deg)",
                    "-webkit-filter": "contrast("+(0.8+firecontrast)+")",
                    "padding-top": "" + (50-firesize*50) + "px",
                    "opacity": "" + fireopacity,
                });

        if (state.plays[i] > 0) {
            $('#p' + i + ' > div > div > .stats > .winspercent').html(Math.round(state.wins[i] / state.plays[i] * 100)+"%");
        }
        $('#p' + i +' > div > div > .stats > .plays').html(state.plays[i]);
        $('#p' + i +' > div > div > .stats > .playslinehover > .playslineico > .playsline').html(state.playsline[i]);
        $('#p' + i +' > div > div > .stats > .playslinehover > .playslinepbico > .playspb').html(state.playspb[i]);
        if (state.line[i] < controllers){
            $('#p' + i +' > .character > img').addClass('driving');
            $('#p' + i +' > .character > .driving').css('animation-delay', '-0.' + i +'s');
            $('#p' + i +' > .line').html('<img src="images/icons/player' + (state.line[i] + 1) + '.png"/>');

            $('#p' + i +' > div > div > .stats > .playslinehover > .playslineico').show()
            if (i !== jonne && state.wins[i] === 0 ){
                jonne_active = 0
            }
            if (i !== jonne && state.playsline[i] >= state.playsline[jonne]){
                jonne_active = 0
            }

        } else {
            let linecid = Math.min(7, state.line[i] - controllers)
            $('#p' + i +' > .line').html((state.line[i] - controllers + 1) + ".").css({"color": linecolors[linecid]});
            $('#p' + i +' > div > div > .stats > .playslinehover > .playslineico').hide()
        }
        if (state.dnf[i]){
            $('#p' +  i).addClass('dnf');
            $('#p' + i +' > .line').html('DNF');
        }
        // spessut
        let spes = state.spes[i].split('-');
        for (let s = 1; s < spes.length; s++){
            $('#p' + i ).append(
                '<img src="images/icons/special.png" class="special" ' +
                'style="left:' + (leftoffset + parseInt(spes[s]) * width + width/2 -14)  + 'px">').append(
                    '<img src="images/icons/special.png" class="special special2" ' +
                'style="left:' + (leftoffset + spes[s] * width + width/2 -14)  + 'px">')
        }
    }
    for (let m = 0; m < mapstate.length; m ++){
        $('#' + maplist[Math.floor(m/4)][m%4] +' > .mapcount').html(mapstate[m])
    }
    $('.character > img').removeClass('jonne');
    if (jonne_active > 0 && state.playsline[jonne] > 0){
        $('#p' + jonne +' > .character > img').addClass('jonne');
    }
}

function next_round(p, oldstate, s, action) {
    let state = {wins: oldstate.wins.slice(),
        plays: oldstate.plays.slice(),
        playsline: oldstate.playsline.slice(),
        playspb: oldstate.playspb.slice(),
        line: oldstate.line.slice(),
        fire: oldstate.fire.slice(),
        spes: oldstate.spes.slice(),
        dnf: oldstate.dnf.slice()};
    if (action === 'spes') {
        state.spes[p] += '-' + state.wins[p];
    } else {
        if (action === 'win') {
            state.wins[p] += 1;
            if (state.playsline[p] === 0){
                state.fire[p] += 1;
            }
            for (let i = 0; i < state.plays.length; i++) {
                if (state.line[i] < s.controllers) {
                    state.plays[i] += 1;
                    if (state.playspb[i] === state.playsline[i]){
                        state.playspb[i] += 1;
                    }
                    state.playsline[i] += 1;
                    if (i !== p){
                        state.fire[i] = 0;
                    }
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
