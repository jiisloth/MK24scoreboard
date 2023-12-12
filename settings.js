$(document).ready(function () {
    // INIT
    $('#start_menu').show();
    $('.is_layout').hide()
    $('.is_cam').hide()

    // Menu actions
    const start_menu = [['new_game'], ['load_cookies'], ['spectate']];
    const game_menu = [['input_rounds'], ['input_players'], ['input_controllers'], ['input_shuffle'], ['game_menu_next', 'game_menu_back']];
    const spectate_menu = [['spectate_menu_next', 'spectate_menu_back']];
    let player_menu = [['input_nick'], ['player_menu_next', 'player_menu_back']];

    const playericons = ['mario', 'luigi', 'peach', 'daisy', 'bowser', 'koopa', 'yoshi', 'donkeykong', 'boo', 'toad',
        'toadette', 'klunk', 'chuck', 'bubble', 'chiken', 'link', 'pikachu', 'sonic', 'samus', 'mage', 'bowsette',
        'bowsette2'];
    const specialicons = ['misato2', 'misato', 'zerotwo', 'zerotwotwo', 'megaman', 'barret', 'kratos', 'hiire', 'Nyan', 'geralt', 'luffy'];

    player_menu = create_icon_buttons(playericons,specialicons, player_menu);

    let current_icon = "";
    let players = [];

    let current_menu = start_menu.slice();
    let current_link_row = 0;
    let current_link_col = 0;
    let button_holder = 0;
    update_menu(current_menu, current_link_row, current_link_col);

    $('#spec_layout').change(function() {
        if(this.checked) {
            $('.is_layout').show()
        } else {
            $('.is_layout').hide()
        }
    });
    $('input[type=radio][name=spec_header]').change(function() {
        if (this.value == 'cam') {
            $('.is_cam').show()
        } else {
            $('.is_cam').hide()

        }
    });

    $('.menu_item').mouseover(function () {
        for (let i = 0; i < current_menu.length; i++) {
            let col = current_menu[i].indexOf(this.id);
            if (col !== -1) {
                current_link_row = i;
                current_link_col = col;
            }
        }
        update_menu(current_menu, current_link_row, current_link_col)
    });
    $(document).keydown(function (e) {
        if (e.keyCode === 38) { // UP
            e.preventDefault();
            button_holder = 0;
            current_link_row--;
            if (current_link_row < 0){
                current_link_row = current_menu.length - 1;
            }
            update_menu(current_menu, current_link_row, current_link_col)
        }
        else if (e.keyCode === 40) { // DOWN
            e.preventDefault();
            button_holder = 0;
            current_link_row++;
            if (current_link_row > current_menu.length -1){
                current_link_row = 0
            }
            update_menu(current_menu, current_link_row, current_link_col)
        }
        else if (e.keyCode === 37) { // LEFT

            button_holder = 0;
            let current = $('#' + current_menu[current_link_row][current_link_col]);
            if (current.attr('type') === 'number'){
                e.preventDefault();
                current.val(current.val() - 1);
                if (current.val() < current.attr('min')){
                    current.val(current.attr('min'))
                }
            } else {
                current_link_col--;
                if (current_link_col < 0) {
                    current_link_col = current_menu[current_link_row].length - 1;
                }
                update_menu(current_menu, current_link_row, current_link_col)
            }
        }
        else if (e.keyCode === 39) { // RIGHT
            button_holder = 0;
            let current = $('#' + current_menu[current_link_row][current_link_col]);
            if (current.attr('type') === 'number'){
                e.preventDefault();
                current.val(parseInt(current.val()) + 1);
                if (current.val() > current.attr('max')){
                    current.val(current.attr('max'))
                }
            } else {
                current_link_col++;
                if (current_link_col > current_menu[current_link_row].length - 1) {
                    current_link_col = 0
                }
                update_menu(current_menu, current_link_row, current_link_col)
            }
        }
        else if (e.keyCode === 8 || e.keyCode === 46) {
            button_holder = 0;
            let current = $('#' + current_menu[current_link_row][current_link_col]);
            if (current.attr('type') === 'number') {
                e.preventDefault();
                current.val('0');
            }

        }
        else if (e.keyCode >= 48 && e.keyCode <= 56 && button_holder === 0){
            button_holder ++;
            let current = $('#' + current_menu[current_link_row][current_link_col]);
            if (current.attr('type') === 'number') {
                current.val('');
            }
        }
    });
    $('#input_nick').change(function () {
       check_player();
       check_player_special();
    });

    $('#new_game').click(function () {
        update_tab($('#game_menu'), game_menu)
    });
    $('#spectate').click(function () {
        update_tab($('#spectate_menu'), spectate_menu)
    });
    $('#load_cookies').click(function () {
        window.location.href = 'scoreboard.html?load=cookie'
    });
    $('#input_shuffle').click(function () {
        let shuffle = $('#input_shuffle');
        if (shuffle.html() === "TRUE"){
            shuffle.html('FALSE')
        } else {
            shuffle.html('TRUE')
        }
    });
    $('#game_menu_next').click(function () {
        update_tab($('#player_menu'), player_menu)
    });
    $('#game_menu_back').click(function () {
        update_tab($('#start_menu'), start_menu)
    });
    $('#spectate_menu_back').click(function () {
        update_tab($('#start_menu'), start_menu)
    });
    $('#spectate_menu_next').click(function () {
        start_spectator_mode()
    });
    $('.icon').click(function () {
        if (!$(this).hasClass('gone') && !$(this).hasClass('mystery')) {
            $('.icon').removeClass('chosen');
            $(this).addClass('chosen');
            current_icon = current_menu[current_link_row][current_link_col];
            check_player();
        }
    });
    $('#player_menu_next').click(function () {
        if (!$(this).hasClass('disabled')){
            add_player()
        }
    });
    $('#player_menu_back').click(function () {
        if (players.length > 0){
            remove_player()
        } else {
            update_tab($('#game_menu'), game_menu)
        }
    });
    $(document).keypress(function (e) {
        if (e.keyCode === 13) {
            let current = current_menu[current_link_row][current_link_col];
            if (current === 'new_game') {
                update_tab($('#game_menu'), game_menu)
            }
            if (current === 'load_cookie') {
                window.location.href = 'scoreboard.html?load=cookie'
            }
            if (current === 'spectate') {
                update_tab($('#spectate_menu'), spectate_menu)
            }
            if (current === 'input_shuffle') {
                let shuffle = $('#input_shuffle');
                if (shuffle.html() === "TRUE"){
                    shuffle.html('FALSE')
                } else {
                    shuffle.html('TRUE')
                }
            }
            else if (current === 'game_menu_next') {
                update_tab($('#player_menu'), player_menu)
            }
            else if (current === 'game_menu_back') {
                update_tab($('#start_menu'), start_menu)
            }
            else if ($('#' + current).hasClass('icon') && !$('#' + current).hasClass('gone') && !$('#' + current).hasClass('mystery')){
                $('.icon').removeClass('chosen');
                $('#' + current).addClass('chosen');
                current_icon = current;
                check_player();
            }
            else if (current === 'player_menu_next'){
                if (!$('#' + current).hasClass('disabled')){
                    add_player()
                }
            }
            else if (current === 'player_menu_back'){
                if (players.length > 0){
                    remove_player()
                } else {
                    update_tab($('#game_menu'), game_menu)
                }
            }

        }
    });
    function remove_player() {
        const player = players.pop();
        const playerdiv = $('#' + player[1]);
        playerdiv.removeClass('gone').children('.icon_text').remove();
        if (playerdiv.hasClass('special')){
            playerdiv.addClass('mystery')
        }
        current_icon = "";
        $('#input_nick').val("");
        check_player();
        update_tab($('#player_menu'), player_menu)
    }

    function add_player() {
        let nick = $('#input_nick');
        players.push([nick.val(), current_icon]);
        if (players.length === parseInt($("#input_players").val())){
            start_scoreboard('init')
        }
        else {
            $('.chosen').addClass('gone').append('<div class="icon_text">' + nick.val() + '</div>');
            $('.icon').removeClass('chosen');
            $('.special:not(.gone)').addClass('mystery').removeClass('selected');
            current_icon = "";
            nick.val("");
            check_player();
            update_tab($('#player_menu'), player_menu)
        }
    }

    function check_player(){
        if (current_icon !== "" && $('#input_nick').val() !== ""){
            $('#player_menu_next').removeClass('disabled')
        } else {
            $('#player_menu_next').addClass('disabled')
        }
    }
    function update_tab(new_menu_obj, new_menu) {
        $('.menu_tab').hide();
        new_menu_obj.show();
        current_menu = new_menu.slice();
        current_link_row = 0;
        current_link_col = 0;
        $('#player_count').html(players.length + 1 + ' / ' + $("#input_players").val());
        update_menu(current_menu, current_link_row, current_link_col)
    }
    function check_player_special() {
        const name = $('#input_nick').val();
        $('.special:not(.gone)').addClass('mystery').removeClass('selected');

        if (name.toLowerCase() === 'jsloth' || name.toLowerCase() === 'slotti'){
            $('#icon_zerotwo').removeClass('mystery')
            $('#icon_zerotwotwo').removeClass('mystery')
            $('#icon_misato').removeClass('mystery')
            $('#icon_misato2').removeClass('mystery')
        } else if (name.toLowerCase() === 'kannadan') {
            $('#icon_kratos').removeClass('mystery')
            $('#icon_hiire').removeClass('mystery')
            $('#icon_luffy').removeClass('mystery')
        } else if (name.toLowerCase() === 'mega_tron' || name.toLowerCase() === 'megatron') {
            $('#icon_megaman').removeClass('mystery')
        } else if (name.toLowerCase() === 'ssarste') {
            $('#icon_barret').removeClass('mystery')
        } else if (name.toLowerCase() === 'muikea') {
            $('#icon_Nyan').removeClass('mystery')
        } else if (name.toLowerCase() === 'veliboi') {
            $('#icon_geralt').removeClass('mystery')
        }
    }
    function start_scoreboard(load) {
        if ($('#input_shuffle').html() === 'TRUE'){
            players = shuffle(players)
        }
        window.location.href = 'scoreboard.html?load=' + load +
            '&players=' + encodeURI(players) +
            '&controllers=' + $('#input_controllers').val() +
            '&rounds=' + $('#input_rounds').val();

    }

    function update_menu(menu, row, col) {
        if (col > menu[row].length - 1){
            col = menu[row].length - 1;
        }
        for (let i = 0; i < menu.length; i++) {
            for (let j = 0; j < menu[i].length; j++) {
                if (i === row && j === col) {
                    $('#' + menu[i][j]).addClass('selected').focus()
                } else {
                    let current = $('#' + menu[i][j]);
                    current.removeClass('selected').blur();
                    if (current.attr('type') === 'number') {
                        if (parseInt(current.val()) < current.attr('min')) {
                            current.val(current.attr('min'))
                        } else if (parseInt(current.val()) > current.attr('max')) {
                            current.val(current.attr('max'))
                        }
                    }
                }
            }
        }
        current_link_col = col
    }
});


function create_icon_buttons(normal, special, menu){
    let hotomolo = '';
    let icons = [];
    let all_icons = [];
    const icons_box = $('#player_icons');
    const items_on_row = Math.floor($('#menu').width()/86);
    for (let i = 0; i < normal.length; i++){
        hotomolo += '<div id="icon_' + normal[i] + '" class="icon menu_item" ><img src="images/playerIcons/' + normal[i] + '.png"></div>'
        icons.push('icon_' + normal[i]);
        if ((i + 1) % items_on_row === 0){
            all_icons.push(icons.slice());
            icons = []
        }
    }
    for (let i = 0; i < special.length; i++){
        hotomolo += '<div id="icon_' + special[i] + '" class="icon menu_item special mystery"><img src="images/playerIcons/' + special[i] + '.png"></div>'
        icons.push('icon_' + special[i]);
        if (items_on_row === icons.length){
            all_icons.push(icons.slice());
            icons = []
        }
    }
    all_icons.push(icons.slice());

    icons_box.html(hotomolo);
    return menu.concat(all_icons)
}


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

function start_spectator_mode(){
    let args = "?"
    args += "code=" + $('#spec_code').val()
    if ($('#spec_layout').is(':checked')){
        args += "&layout=stream";
        if (!$('#spec_bg').is(':checked')){
            args += "&bg=false";
        }
        args += "&ratio=" + $('input[name="spec_ratio"]:checked').val();
        if ($('input[name="spec_header"]:checked').val() !== "no"){
            args += "&header="+ $('input[name="spec_header"]:checked').val()
        }
        if ($('input[name="spec_header"]:checked').val() === "cam"){
            if (!$('#spec_cam_controllers').is(':checked')){
                args += "&controllers=false";
            }
        }
    }
    if ($('input[name="spec_sort"]:checked').val() !== "no"){
        args += "&sort="+ $('input[name="spec_sort"]:checked').val()
    }
    window.location.href = 'spectate.html'+args

}