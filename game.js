//Game settings

//number and name of players

const no_players_input = document.querySelector("#no_players_input");
const addplayers_div = document.querySelector("#addplayers");

no_players_input.addEventListener('change', addplayers);

let no_players;

function addplayers()
{
    no_players = no_players_input.value;
    let players_array="";

    for (let i=0; i<no_players; i++)
    {
        players_array += `<input id="player${i+1}" type="text" value="Jatekos${i+1}"><br>`;
    }

    addplayers_div.innerHTML = players_array;
}

//Change game modes

const mode_practice_radiobtn = document.querySelector("#practice");
const mode_race_radiobtn = document.querySelector("#race");
const options = document.querySelector("#options");

const isthereset = document.querySelector("#isthereset");
const whereistheset = document.querySelector("#whereistheset");
const extra3cards = document.querySelector("#extra3cards");

const isthereset_checkbox = document.querySelector("#isthereset_checkbox");
const whereistheset_checkbox = document.querySelector("#whereistheset_checkbox");
const extra3cards_checkbox = document.querySelector("#extra3cards_checkbox");

mode_race_radiobtn.addEventListener('click', options_off);
mode_practice_radiobtn.addEventListener('click', options_on);

function options_on()
{
    options.hidden = false;
    timeofgame.hidden = true;
}

function options_off()
{
    options.hidden = true;
    isthereset_checkbox.checked = false;
    whereistheset_checkbox.checked = false;
    extra3cards_checkbox.checked = false;
    timeofgame.hidden = false;
}

//difficulty

let difficulty;

const difficulty_easy_radiobtn = document.querySelector("#easy");
const difficulty_hard_radiobtn = document.querySelector("#hard");

difficulty_easy_radiobtn.addEventListener('click', set_difficulty);
difficulty_hard_radiobtn.addEventListener('click', set_difficulty);

function set_difficulty()
{
    if(difficulty_easy_radiobtn.checked==true)
    {
        difficulty="easy";
    }
    else if (difficulty_hard_radiobtn.checked==true)
    {
        difficulty="hard";
    }
}

//Start a new game

const startgame_btn = document.querySelector("#startgame");
const settings = document.querySelector("#settings");
const backmenu = document.querySelector("#backtomenu");
const backmenu_btn = document.querySelector("#backmenu");

const game = document.querySelector("#game");

const sider = document.querySelector("#sider");

startgame_btn.addEventListener('click', start_game)
backmenu.addEventListener('click', back_to_menu)

let allcards;

function start_game(event)
{
    settings.hidden = true;
    startgame_btn.hidden = true;
    game.hidden = false;
    sider.hidden = false;
    countdown.hidden = true;

    isthereset.hidden = !isthereset_checkbox.checked;
    whereistheset.hidden = !whereistheset_checkbox.checked;
    extra3cards.hidden = !extra3cards_checkbox.checked;

    setornot.innerHTML = "";

    players = [];
    player_names = [];
    player_scores = [];

    counter = 0;
    difficulty = "hard";

    set_difficulty();

    end_of_game = false;

    generate_players_atstart();
    generate_cards();


    countdown.innerHTML = `<h2>10 mp</h2>`;

    clearInterval(gametime);

    time_of_game()

    if(multiplayer())
    {
        countdown.hidden = false;
    }
    else
    {
        if(mode_practice_radiobtn.checked == true)
        {
            timeofgame.hidden = true;
        }
        else
        {
            timeofgame.hidden = false;
        }
    }

    allcards = document.querySelector("#allcards");
    allcards.addEventListener('click', selectcard);

    show_no_cards_deck();

    if(!isthereset_func() && extra3cards.hidden == true)
    {
        extra3cards_func();
    }

}

//show scoreboard

let players = [];
let player_names = [];
let player_scores = [];
let scoreboard_array;

let inactive_players = [];
let allplayers;

const scoreboard = document.querySelector("#scoreboard");

function generate_players_atstart()
{
    scoreboard_array ="";

    player_names = document.querySelectorAll("[id^='player']")
    for (let i=0; i<player_names.length; i++)
    {
        players.push(player_names[i].value);
        player_scores.push(0);
    }

    for (let i=0; i<player_names.length; i++)
    {
            scoreboard_array += `<div id="${i}">${players[i]}: ${player_scores[i]}</div>`;
    }
    scoreboard.innerHTML = scoreboard_array;

    allplayers = document.querySelectorAll("#scoreboard div");

    if (!multiplayer())
    {
    selected_player = scoreboard.firstChild;
    selected_player.classList.add("selected");
    }
}

let count_inactives = 0;

function generate_players()
{
    for (let i=0; i<allplayers.length; i++)
    {
        if ((selected_player != undefined) && (selected_player.classList.contains("inactive")) && (selected_player.getAttribute("id") == i))
        {
            allplayers[i].classList.remove("selected");
            allplayers[i].innerHTML = `${players[i]}: ${player_scores[i]}`;

            count_inactives +=1;
        }
        else
        {
            allplayers[i].classList.remove("selected");
            allplayers[i].innerHTML = `${players[i]}: ${player_scores[i]}`;
        }
    }

    if (!selected_player.classList.contains("inactive") || (count_inactives ==allplayers.length))
    {
        for (let i=0; i<allplayers.length; i++)
        {
            remove_inactive(allplayers[i]);
        }
        count_inactives = 0;
    }

    if(!multiplayer())
    {
        selected_player = scoreboard.firstChild;
        selected_player.classList.add("selected");
        selected_player.classList.remove("inactive");
    }

}

function remove_inactive(element)
{
    if (element.classList.contains("inactive"))
    {
        element.classList.remove("inactive");
    }
}

function multiplayer()
{
    return (player_names.length !=1);
}

//back to main menu

function back_to_menu(event)
{
    settings.hidden = false;
    startgame_btn.hidden = false;
    game.hidden = true;
    sider.hidden = true;

}

//generate and show table of cards

let cards = [];
let counter = 0;

const tableofcards = document.querySelector("#tableofcards")

function generate_cards(event)
{
    cards = [];

    for (let i = 1; i<=3; i++)
    {
        for (let j = 1; j<=3; j++)
        {
            for (let k=1; k<=3; k++)
            {
                if(difficulty=="hard")
                {
                    for (let l=1; l<=3; l++)
                    {
                        cards.push(`${i}${l}${j}${k}`);
                    }
                }
                else if(difficulty=="easy")
                {
                    cards.push(`${i}3${j}${k}`);
                }
            }
        }
    }

   random_cards(cards);

   console.log(cards);
    
//randomise of generated array, show first 12 elements of it

    let card_deck;


    card_deck = '<table id="allcards">';

    for (let i=0; i<3; i++)
    {
            card_deck += "<tr>";
        for (let j=0; j<4; j++)
        {
            card_deck += `<td><img id="${cards[counter]}" src="cards/${cards[counter]}.svg"></td>`;
            counter += 1;
        }
            card_deck += "</tr>";
    }

    card_deck += "</table>"
    tableofcards.innerHTML = card_deck;

}

function random_cards(cards)
{
    for (let i = cards.length-1; i>0; i--)
    {
        let j = Math.floor(Math.random()*(i+1));
        let temp = cards[i];
        cards[i] = cards[j];
        cards[j] = temp;
    }

}

//sign selected cards

let selected_3cards = [];

let is_3cards = false;

let is_set = false;

function selectcard(event)
{
    if(end_of_game)
    {
        return;
    }

    for (let i = 0; i<actual_cards.length; i++)
    {
        if (actual_cards[i].classList.contains('sign_set'))
        {
            actual_cards[i].classList.remove('sign_set');
        }
    }

    if (selected_player == undefined)
    {
        setornot.innerHTML = "<h2>Válaszd ki a játékost!</h2>";
        return;
    }
    else
    {

    if (event.target.matches("img"))
    {
        event.target.classList.toggle("selected");
    }

    selected_3cards = document.querySelectorAll("img.selected");

    if(selected_3cards.length ==3)
    {
        is_3cards = true;
    }
    else
    {
        is_3cards = false;
    }

    if(is_3cards)
    {
        check_ifset();
    }

    }

}

//check if selected 3 cards are SET

const setornot = document.querySelector('#setornot');

function check_ifset_3cards(arrayof3)
{
    let set_counter=0;
    is_set = false;
    for (let i =0; i<4; i++)
    {

        if ((arrayof3[0].substr(`${i}`,1) == arrayof3[1].substr(`${i}`,1)) && (arrayof3[1].substr(`${i}`,1) == arrayof3[2].substr(`${i}`,1)) && (arrayof3[2].substr(`${i}`,1) == arrayof3[0].substr(`${i}`,1)))
        {
            set_counter += 1;
        }

        if (((arrayof3[0].substr(`${i}`,1) != arrayof3[1].substr(`${i}`,1)) && (arrayof3[1].substr(`${i}`,1) != arrayof3[2].substr(`${i}`,1)) && (arrayof3[2].substr(`${i}`,1) != arrayof3[0].substr(`${i}`,1))))
        {
            set_counter += 1;
        }

    }

    if(set_counter == 4)
    {
        is_set = true;
    }

    return is_set;
}


function check_ifset()
{
    let cardall = [];

    actual_cards = document.querySelectorAll("#allcards img");

    for (let i =0; i<3; i++)
    {
        cardall.push(selected_3cards[i].getAttribute("id"));
    }

    is_set = check_ifset_3cards(cardall);

    if (is_set)
    {
        right_set();

        if (counter<cards.length && actual_cards.length==12)
        {
            for (let i=0; i<3; i++)
            {
                selected_3cards[i].setAttribute('src', `cards/${cards[counter]}.svg`);
                selected_3cards[i].setAttribute('id', `${cards[counter]}`);
                counter +=1;
            }
        }
        else
        { 
            for (let i=0; i<3; i++)
            {
                selected_3cards[i].remove();
            }
 

        }

        if(!isthereset_func())
        {
            if(counter<cards.length)
            {
                if(extra3cards.hidden == true)
                {
                    extra3cards_func();
                }
            }
            else
            {
                setornot.innerHTML = "<h2>Nincs több SET! - Vége a játéknak</h2>";
                end_of_game = true;
            }

        }
    }

    else
    {
        bad_set();
    }

    for (let i =0; i<3; i++)
    {
        selected_3cards[i].classList.remove("selected");
    }

    show_no_cards_deck()
    generate_players_atend()

}

function right_set()
{
    player_scores[selected_player.getAttribute("id")] +=1;

    generate_players();

    setornot.innerHTML = "<h2>Ez SET!</h2>";

    if(multiplayer())
    {
        selected_player = undefined;
        clearInterval(x);
    }

}

function bad_set()
{
    player_scores[selected_player.getAttribute("id")] +=-1;
    selected_player.classList.add("inactive");

    generate_players();

    if (timeisup)
    {
        setornot.innerHTML = "<h2>Tipp idő lejárt!</h2>";
    }
    else if(!timeisup)
    {
        setornot.innerHTML = "<h2>Ez NEM SET!</h2>";
    }

    if(multiplayer())
    {  
        selected_player = undefined;
        clearInterval(x);
    }
}


//select player to say SET

scoreboard.addEventListener("click", select_player);

let prev_selected_player = scoreboard.firstChild;
let selected_player;

function select_player(event)
{
    if(end_of_game)
    {
        return;
    }

    let temp_player=event.target;

    if (temp_player.classList.contains("inactive"))
    {
        setornot.innerHTML = `<h2>A körben már nem választható!</h2>`;
        temp_player= undefined;
    }
    else
    {
        selected_player = event.target;
    countback();

    if (prev_selected_player.classList != undefined )
    {
        prev_selected_player.classList.remove("selected");
    }
    selected_player.classList.add("selected");
    prev_selected_player = selected_player;

    }
}

//optional hints/features

const isthereset_btn = document.querySelector("#isthereset_btn");
const whereistheset_btn = document.querySelector("#whereistheset_btn");
const extra3cards_btn = document.querySelector("#extra3cards_btn");

isthereset_btn.addEventListener('click', isthereset_show);
whereistheset_btn.addEventListener('click', whereistheset_func);
extra3cards_btn.addEventListener('click', extra3cards_func);

let actual_cards = [];
let threecards = [];

function isthereset_func(event)
{
    actual_cards = document.querySelectorAll("#allcards img");

    for (let i=0; i<actual_cards.length; i++)
    {

        for (let j =i+1; j<actual_cards.length; j++)
        {
            for (let k = j+1; k<actual_cards.length; k++)
            {
                threecards = [];
                threecards.push(actual_cards[i].getAttribute("id"));
                threecards.push(actual_cards[j].getAttribute("id"));
                threecards.push(actual_cards[k].getAttribute("id"));

                if(check_ifset_3cards(threecards))
                {
                    return true;
                };
            }
        }
    }
    return false;
}

function isthereset_show(event)
{
    if(end_of_game)
    {
        return;
    }
    if(isthereset_func())
    {
        setornot.innerHTML = "<h2>Van SET!</h2>";
    }
    else
    {
        setornot.innerHTML = "<h2>Nincs SET!</h2>";
    }
}

function whereistheset_func(event)
{
    if(end_of_game)
    {
        return;
    }

    if (isthereset_func())
    {
        let number_of_signed=0;
        for (let i =0; i<3; i++)
        {
            for (let j = 0; j<actual_cards.length; j++)
            {
                if (actual_cards[j].getAttribute("id") == threecards[i] && number_of_signed!=3)
                {
                    actual_cards[j].classList.add('sign_set');
                    number_of_signed +=1;
                }
            }
        }
    }
}

function extra3cards_func(event)
{
    if(end_of_game)
    {
        return;
    }

    if(cards.length-counter > 0)
    {
    actual_cards = document.querySelectorAll("#allcards img");

    if(actual_cards.length==0)
    {

    }
    else if(actual_cards.length==21)
    {
        setornot.innerHTML = "<h2>Lapok száma maximális!</h2>";
    }
    else
    {
        for (let i=0; i<allcards.rows.length; i++)
        {
    		let newcard = allcards.rows[i].insertCell(-1);
            newcard.innerHTML = `<td><img id="${cards[counter]}" src="cards/${cards[counter]}.svg"></td>`;
            counter +=1;
	    }
    }

    show_no_cards_deck()
    }
    else
    {
        setornot.innerHTML = "<h2>Elfogyott a pakli!</h2>";
    }
}


//set a timer to count back

const countdown = document.querySelector("#countdown");

let x;
let timeisup=false;

function countback()
{
    if(x != undefined)
    {
        clearInterval(x);
    }
    countdown.innerHTML = `<h2>10 mp</h2>`;

    let countDownDate = new Date().getTime()+10000;

    x = setInterval(function() {

    let now = new Date().getTime()-1000;
    
    let distance = countDownDate - now;
    
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);

    countdown.innerHTML = `<h2>${seconds} mp</h2>`;
    
    if (distance<1000) 
    {
        clearInterval(x);
        countdown.innerHTML = `<h2>Idő vége!</h2>`;
        timeisup = true;
        bad_set();
        timeisup = false;
    }
    }, 1000);

}

//Number of cards in the deck

const no_cards_deck = document.querySelector("#no_cards_deck");

function show_no_cards_deck()
{
    no_cards_deck.innerHTML = `${cards.length-counter} Lap`;
}

//set a timer to measure game time

const timeofgame = document.querySelector("#timeofgame");

let gametime;

let end_of_game=false;



function time_of_game()
{
    timeofgame.innerHTML = `<h2>00:00</h2>`;
    let starting_time = Date.now();

    gametime = setInterval(function() {

    difference_in_seconds = (Date.now()-starting_time)/1000;

    let minutes = Math.floor(difference_in_seconds/60);
    let seconds = Math.floor(difference_in_seconds)%60;

    ss = seconds.toString().padStart(2, "0");
    mm = minutes.toString().padStart(2, "0");

    timeofgame.innerHTML = `<h2>${mm}:${ss}</h2>`;

    if (end_of_game) 
    {
        clearInterval(gametime);
    }

    }, 1000);
}

//show leaderboard at the end of the game

function generate_players_atend()
{
    if (end_of_game)
    {
    scoreboard_array ="<h2>Végeredmény</h2>";

    player_names = document.querySelectorAll("[id^='player']")

    players = [];
   
    for (let i=0; i<player_names.length; i++)
    {
        players.push(player_names[i].value);
    }

    sort_players();

    for (let i=0; i<player_names.length; i++)
    {
            scoreboard_array += `<div id="${i}"><b>${i+1}. </b>${players[i]}: ${player_scores[i]}</div>`;
    }
    setornot.innerHTML += scoreboard_array;
    }
}

function sort_players()
{
    for (let i=0; i<player_names.length; i++)
    {
        for (let j=i+1; j<player_names.length; j++)
        {
            if(player_scores[i]<player_scores[j])
            {
                let temp;
                temp = player_scores[i];
                player_scores[i] = player_scores[j];
                player_scores[j] = temp;

                temp = players[i];
                players[i] = players[j];
                players[j] = temp;
            }
        }
    }
}