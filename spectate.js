const golden = ['megaman', 'kratos', 'barret', 'geralt', 'hiire'];


const socket = new WebSocket('wss://mk24.hellokopter.com:443');

let secret
let layout = "normal"
let header = false
let show_controllers = true
let sort = false
let bg = true
read_attributes()

let win_width = 0
let win_height = 0

let inited = false

console.log(secret)
// Connection opened
socket.addEventListener('open', function (event) {
    socket.send(JSON.stringify({'type': 'join', "secret": secret}));
});

// Listen for messages
socket.addEventListener('message', function (event) {
    let msg = JSON.parse(event.data)
    if (msg.type === "joined"){
        console.log("JOINED")
        socket.send(JSON.stringify({'type': 'get_settings'}));
    }
    if (msg.type === "settings"){
        console.log("got settings")
        if (settings === false) {
            settings = msg.settings
            start()
            socket.send(JSON.stringify({'type': 'get_state'}));
        }
    }
    if (msg.type === "init_state"){
        console.log("got init")
        if (inited === false){
            inited = true
            states.push(msg.state)
            if (currentstate === states.length-2) {
                currentstate += 1
            }
            draw_state(states[currentstate], settings.controllers, mapstates[currentmapstate], maps);
        }
    }
    if (msg.type === "state"){
        console.log("got state")
        states.push(msg.state)
        if (currentstate === states.length-2) {
            currentstate += 1
        }
        draw_state(states[currentstate], settings.controllers, mapstates[currentmapstate], maps);
    }
    if (msg.type === "mapstate"){
        console.log("got mapstate")
        mapstates.push(msg.mapstate)
        if (currentmapstate === mapstates.length-2) {
            currentmapstate += 1
        }
        draw_state(states[currentstate], settings.controllers, mapstates[currentmapstate], maps);
    }
});

let states;
let mapstates;
let currentstate;
let currentmapstate;
let settings = false

const maps = [
    ['LuigiCircuit', 'PeachBeach', 'BabyPark', 'DryDryDesert'],
    ['MushroomBridge', 'MarioCircuit', 'DaisyCruiser', 'WaluigiStadium'],
    ['SherbetLand', 'MushroomCity', 'YoshiCircuit', 'DKMountain'],
    ['WarioColosseum', 'DinoDinoJungle', 'BowserCastle', 'RainbowRoad']];


$(window).on('resize', function(){
    var win = $(this); //this = window
    win_width = win.width
    win_height = win.height
    console.log("aaa")
});

function start() {
    win_width = $(window).width()
    win_height = $(window).height()
    set_layout()
    let hold_button = {};

    let state = init_state(settings.players, settings.controllers);
    states = [add_state(state)];
    mapstates = [init_mapstate()];
    currentstate = 0;
    currentmapstate = 0;

    $('#cam > .cam_header > .name').html("Mario Kart " + settings.rounds);
    $('#textheader > div > .name').html("Mario Kart " + settings.rounds);

    const mapdict = generate_maps(maps); // Could use this instead of counting..
    generate_rounds(settings.rounds);
    generate_players(settings.players);
    draw_state(states[currentstate], settings.controllers, mapstates[currentmapstate],  maps);

    set_layout()
    $(document).keydown(function (e) {
        if (e.keyCode === 8){
            e.preventDefault()
        }
        if (e.keyCode === 37) { // LEFT
            if (currentstate > 0){
                currentstate -= 1;
                            }
            draw_state(states[currentstate], settings.controllers, mapstates[currentmapstate], maps);
        } else if (e.keyCode === 39) { // RIGHT
            if (currentstate < states.length-1){
                currentstate += 1;
                            }
            draw_state(states[currentstate], settings.controllers, mapstates[currentmapstate], maps);
        } else if (e.keyCode === 109 || e.keyCode === 189) { // num.minus
            if (currentmapstate > 0){
                currentmapstate -= 1;
            }
            draw_state(states[currentstate], settings.controllers, mapstates[currentmapstate], maps);
        }
        else if (e.keyCode === 107 || e.keyCode === 187) { // num.plus
            if (currentmapstate < mapstates.length-1){
                currentmapstate += 1;
            }
            draw_state(states[currentstate], settings.controllers, mapstates[currentmapstate], maps);
        }

        hold_button[e.keyCode] = true;

    });
    $(document).keyup(function (e) {
        hold_button[e.keyCode] = false;
    });

};


function set_layout(){
    $('#textheader').hide()
    $('.gamearea').hide()
    if (layout === "stream"){
        $('body').css('background', 'transparent');
        $('html').css('background', 'transparent');
        $('.cup_holder').hide();
        $('.gamearea').show()
        $('#container').css('margin', '0');
        //$('.round:nth-child(odd)').css('background', 'transparent');
        //$('.goal').css('background', 'transparent');
        $('#players').css('padding-top', "0")
        let gamewidth = (win_height-48)/3 * 4
        $('.gamearea').css('height', (win_height-48)+"px")
        $('.gamearea').css('width', (gamewidth)+"px")
        $('#players').css('background', '#483ece url("images/misc/background4.png")');

        $('#players').css('width', win_width - gamewidth + "px");
        $('#cam').css('width', win_width - gamewidth + "px");
        $('#textheader').css('width', win_width - gamewidth + "px");
        $('#players').css('height', (win_height-48) +"px");
        $('#rounds').css('padding-left', 0)
        $('#rounds').css('position', "absolute")
        $('#rounds').css('height', "48px")
        $('#rounds').css('bottom', "0px")
        $('#rounds').css('background', '#3831b1');
        $('.labeltxt').css('display', "inline-block")
        $('.round').css('padding-top', "4px")
        $('.character').css('bottom', "-54px")
        $('.special').css('bottom', "-54px")
        $('.info_char').css('width', "96px")
        $('.info_char').css('height', "72px")

    }
    if (header === "empty-big") {
        $('#players').css('height', (win_height-48-240) +"px");
        $('#players').css('top', "240px");

    }
    if (header === "empty-small") {
        $('#players').css('height', (win_height-48-64) +"px");
        $('#players').css('top', "64px");

    }
    if (header === "cam") {
        $('#players').css('height', (win_height-48-240) +"px");
        $('#players').css('top', "240px");
        $('#cam').show()
    }
    if (show_controllers === false) {
        $('.controller_holder').hide()
    }
    if (header === "text") {
        $('#players').css('height', (win_height-48-64) +"px");
        $('#players').css('top', "64px");
        $('#textheader').show()
    }
    if (bg === false){
        $('body').css('background', 'transparent');
        $('html').css('background', 'transparent');
        $('#players').css('background', 'transparent');
        $('#rounds').css('background', 'transparent');
        $('.cam_header').css('background', 'transparent');
        $('#textheader').css('background', 'transparent');
    }
}


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
        let gold = ""
        if (golden.includes(players[p][1])){
            gold = ' class="winner" '
        }
        $('#players').append('<div id="p' + p +'" class="player">' +
            '<div class="line">' +
            p + '.' +
            '</div>' +
            '<div class="info">' +
            '<div><img class="info_char" src="images/playerIcons/' + players[p][1] + '.png"/></div>' +
            '<div>' +
            '<div><div class="name">' + players[p][0] + '</div><div class="special_holder"></div></div>' +
            '<div class="stats">' +
            '<img src="images/icons/win.png"><div class="labeltxt">Voitot: </div><div class="wins"></div>' +
            '<img src="images/icons/plays.png"><div class="labeltxt">Pelit: </div><div class="plays"></div>' +
            '<div class="playslineico"><img src="images/icons/playsline.png"><div class="labeltxt">Sohvalla: </div><div class="playsline"></div></div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="character">' +
                '<img ' + gold + ' src="images/playerIcons/' + players[p][1] + '.png">' +
            '</div>' +
            '</div>')
    }
}

function read_attributes() {
    let attr = window.location.search.substring(1)
    if (attr){
        attr = attr.split('&');
        for (let a = 0; a < attr.length; a++) {
            let pair = attr[a].split('=')
            if (pair.length === 2) {
                if (pair[0] === "code") {
                    secret = pair[1]
                } else if (pair[0] === "layout") {
                    layout = pair[1]
                } else if (pair[0] === "sort") {
                    sort = pair[1]
                } else if (pair[0] === "header") {
                    header = pair[1]
                } else if (pair[0] === "bg") {
                    if (pair[1] === "false")
                    bg = false
                } else if (pair[0] === "controllers") {
                    if (pair[1] === "false")
                    show_controllers = false
                }
            }
        }
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
function get_order(state) {
    let players = []
    for (let i = 0; i < state.wins.length; i ++){
        let dict = {
            "id": i,
            "wins": state.wins[i],
            "line": Math.max(state.line[i]-3,0),
            "controller": state.line[i],
            "plays": state.plays[i],
        }
        players.push(dict)
    }
    if (sort === "wins"){
        players.sort(function(first, second) {
            if (first.wins === second.wins) {
                if (first.line === second.line) {
                    return first.plays - second.plays
                }
                return first.line - second.line
            }
            return second.wins - first.wins;
        });
    } else if (sort === "que"){
        players.sort(function(first, second) {
            return first.controller - second.controller;
        });
    }
    let order = []
    for (let i = 0; i < players.length; i ++) {
        order.push(players[i].id)
    }
    return order
}

function sort_board(order){
    for (let i = 0; i < order.length; i ++){
        $("#players").append($('#p' + order[i] ))
    }

}


function get_played(){
    let last_state = states[states.length -1]
    let total = 0
    for (let i = 0; i < last_state.wins.length; i ++){
        total += last_state.wins[i]
    }
    return total
}

function draw_state(state, controllers, mapstate, maplist) {
    let played = get_played()
    $('#cam > .cam_header > .played').html("Pelattu: " + played + " kierrosta.");
    $('#textheader > div > .played').html("Pelattu: " + played + " kierrosta.");
    const jonne = state.playsline.indexOf(Math.max.apply(Math, state.playsline));
    const width = $('.round').width();
    let order = get_order(state)
    let leftoffset = 280
    if (layout === "stream") {
        leftoffset = 0
    }
    if (sort){
        sort_board(order);
    }
    let jonne_active = 1;
    $('.character > img').removeClass('driving');
    $('.player').removeClass('dnf');
    $('.special').remove();
    for (let i = 0; i < state.wins.length; i ++){
        let left = ((leftoffset-95) + (state.wins[i]+1) * width) + "px";
        $('#p' + i +' > .character').css({"-webkit-transform":"translate("+left+",0px)"});
        if (layout === "stream") {
            $('#p' + i + ' > .character').css("z-index", 50 - order.indexOf(i));
        }
        $('#p' + i +' > div > div > .stats > .wins').html(state.wins[i]);
        $('#p' + i +' > div > div > .stats > .plays').html(state.plays[i]);
        $('#p' + i +' > div > div > .stats > .playslineico > .playsline').html(state.playsline[i]);
        if (state.line[i] < controllers){
            $('#p' + i +' > .character > img').addClass('driving');
            $('#p' + i +' > .character > .driving').css('animation-delay', '-0.' + i +'s');
            $('#p' + i +' > .line').html('<img src="images/icons/player' + (state.line[i] + 1) + '.png"/>');
            $('#p' + i +' > div > div > .stats > .playslineico').show();
            if (i !== jonne && state.wins[i] === 0 ){
                jonne_active = 0
            }
            if (i !== jonne && state.playsline[i] >= state.playsline[jonne]){
                jonne_active = 0
            }
            console.log(settings.players[i][0])
            console.log(state.line[i]+1)
            $('#playername' + (state.line[i]+1) +' > .name').html(settings.players[i][0]);
        } else {
            $('#p' + i +' > .line').html((state.line[i] - controllers + 1) + ".");
            $('#p' + i +' > div > div > .stats > .playslineico').hide()
        }
        if (state.dnf[i]){
            $('#p' +  i).addClass('dnf');
            $('#p' + i +' > .line').html('DNF');
        }
        // spessut

        $('#p' + i +' > div > div > div > .special_holder').html("")
        let spes = state.spes[i].split('-');
        for (let s = 1; s < spes.length; s++){
            $('#p' + i ).append(
                '<img src="images/icons/special.png" class="special" ' +
                'style="left:' + (leftoffset + parseInt(spes[s]) * width + width/2 -30)  + 'px">').append(
                    '<img src="images/icons/special.png" class="special special2" ' +
                'style="left:' + (leftoffset + spes[s] * width + width/2 -30)  + 'px">')
            if (layout === "stream") {
                $('.special').css('bottom', "-20px")
                $('#p' + i +' > div > div > div > .special_holder').append('<div class="name_special">' + spes[s] + '</div>');

            }
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
