"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~HTML Elements~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var logHTML = document.getElementById("log");
var handHTML = document.getElementById("hand");
var decisionHTML = document.getElementById("decision");
var resourcesHTML = document.getElementById("resources");
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Images~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//<img src="img_girl.jpg" alt="Girl in a jacket">
var img_farmer = '<img src="assets/img_farmer.jpg" alt="Farmer">';
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Resources~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var Resource = /** @class */ (function () {
    function Resource(_a) {
        var _b = _a.name, name = _b === void 0 ? "Unnamed" : _b, _c = _a.initialValue, initialValue = _c === void 0 ? 0 : _c, _d = _a.img, img = _d === void 0 ? "<i class='fi fi-rs-coins'></i>" : _d;
        this.name = name;
        this.value = initialValue;
        this.img = img;
    }
    return Resource;
}());
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Phases~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var Phase;
(function (Phase) {
    Phase[Phase["PreGame"] = 0] = "PreGame";
    Phase[Phase["Draw"] = 1] = "Draw";
    Phase[Phase["TurnStart"] = 2] = "TurnStart";
    Phase[Phase["Decision"] = 3] = "Decision";
    Phase[Phase["TurnEnd"] = 4] = "TurnEnd";
})(Phase || (Phase = {}));
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Cards~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var Card = /** @class */ (function () {
    function Card() {
        this.displayZone = null;
        this.btn = null;
        this.img = null;
        this.uniqueID = getUniqueID();
        this.name = "Unnamed";
    }
    Card.prototype.getImage = function () {
        this.img = "<div class=\"card\">\t<input type=\"image\" class=\"cardimage\" src=\"assets/".concat(this.name, ".jpg\" id=").concat(this.uniqueID, "  onclick=\"cardClicked(event)\" alt=\"").concat(this.name, "\" /><p>").concat(this.name, "</p>\t</div>");
    };
    //Passive Effects
    Card.prototype.onDraw = function () {
        //By Default does nothing
    };
    Card.prototype.onTurnStart = function () {
        //By Default does nothing
    };
    Card.prototype.onDecision = function () {
        //By Default does nothing
    };
    Card.prototype.onTurnEnd = function () {
        //By Default does nothing
    };
    //Active Effects
    Card.prototype.onPlay = function () {
        throw new Error("Method 'Card.onPlay()' must be implemented.");
    };
    Card.prototype.displayCard = function () {
        if (this.displayZone != null) {
            //Create button in HTML strin
            //Append String to appropriate Zone
            this.getImage();
            this.displayZone.innerHTML += this.img;
        }
    };
    return Card;
}());
var Farmer = /** @class */ (function (_super) {
    __extends(Farmer, _super);
    function Farmer() {
        var _this = _super.call(this) || this;
        _this.name = "Farmer";
        return _this;
    }
    Farmer.prototype.onTurnStart = function () {
        updateLog(this.name + " harvested 1 Food");
        changeResources("Food", 1);
    };
    Farmer.prototype.onPlay = function () {
        updateLog("'Oh I sure do love farming!'");
        //Change Resources.
        updateLog(this.name + " harvested 5 Food!");
        changeResources("Food", 5);
        //Move to Decision Phase
        hideHand();
        addDecisions(new D_EndTurn());
        decisionPhase();
    };
    return Farmer;
}(Card));
var Soldier = /** @class */ (function (_super) {
    __extends(Soldier, _super);
    function Soldier() {
        var _this = _super.call(this) || this;
        _this.name = "Soldier";
        return _this;
    }
    Soldier.prototype.onTurnStart = function () {
        updateLog(this.name + " bolstered Defense by 1!");
        changeResources("Defense", 1);
    };
    Soldier.prototype.onPlay = function () {
        hideHand();
        updateLog("'GUARD IT ALL BOLSTER IT UP YES!'");
        updateLog(this.name + " bolstered Defense by 5!");
        changeResources("Defense", 5);
        addDecisions(new D_EndTurn());
        decisionPhase();
    };
    return Soldier;
}(Card));
var Priest = /** @class */ (function (_super) {
    __extends(Priest, _super);
    function Priest() {
        var _this = _super.call(this) || this;
        _this.name = "Priest";
        return _this;
    }
    Priest.prototype.onTurnStart = function () {
        updateLog(this.name + " gained 1 Follower!");
        changeResources("Followers", 1);
    };
    Priest.prototype.onPlay = function () {
        hideHand();
        updateLog("'I could priest ALL DAY!'");
        updateLog(this.name + " gained 5 Followers!");
        changeResources("Followers", 5);
        addDecisions(new D_EndTurn());
        decisionPhase();
    };
    return Priest;
}(Card));
var Artist = /** @class */ (function (_super) {
    __extends(Artist, _super);
    function Artist() {
        var _this = _super.call(this) || this;
        _this.name = "Artist";
        return _this;
    }
    Artist.prototype.onTurnStart = function () {
        updateLog(this.name + " crafted 1 Culture!");
        changeResources("Culture", 1);
    };
    Artist.prototype.onPlay = function () {
        hideHand();
        updateLog("'Churning out them Cultures!'");
        updateLog(this.name + " crafted 5 Culture!");
        changeResources("Culture", 5);
        addDecisions(new D_EndTurn());
        decisionPhase();
    };
    return Artist;
}(Card));
var Lord = /** @class */ (function (_super) {
    __extends(Lord, _super);
    function Lord() {
        var _this = _super.call(this) || this;
        _this.name = "Lord";
        return _this;
    }
    Lord.prototype.onTurnStart = function () {
        updateLog(this.name + " collected 1 of everything!");
        changeResources("Food", 1);
        changeResources("Followers", 1);
        changeResources("Culture", 1);
        changeResources("Defense", 1);
    };
    Lord.prototype.onPlay = function () {
        hideHand();
        updateLog("'Lording is the best job there is!'");
        updateLog(this.name + " collected 1 of everything!");
        changeResources("Food", 1);
        changeResources("Followers", 1);
        changeResources("Culture", 1);
        changeResources("Defense", 1);
        addDecisions(new D_EndTurn());
        decisionPhase();
    };
    return Lord;
}(Card));
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Decisions~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var D_EndTurn = /** @class */ (function (_super) {
    __extends(D_EndTurn, _super);
    function D_EndTurn() {
        var _this = _super.call(this) || this;
        _this.displayZone = decisionHTML;
        _this.name = "End Turn";
        return _this;
    }
    D_EndTurn.prototype.onPlay = function () {
        endTurnPhase();
    };
    return D_EndTurn;
}(Card));
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Zones~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var Zone = /** @class */ (function () {
    function Zone(name) {
        this.name = name;
        this.cards = new Array();
    }
    return Zone;
}());
//~~~~~~~~~~~~~~~~~~~~~~~~~Misc Initializations~~~~~~~~~~~~~~~~~~~~~~~~~~~
var baseHandSize = 3;
var gameStarted = false;
var plusDraw = 0;
var currentTurn = 0;
var resources = new Array();
resources.push(new Resource({ name: "Health", initialValue: 100, img: '<i class="fi fi-rs-heart"></i>' }));
resources.push(new Resource({ name: "Energy", initialValue: 50, img: '<i class="fi fi-rs-sparkles"></i>' }));
resources.push(new Resource({ name: "Food", img: '<i class="fi fi-rs-hand-holding-seeding"></i>' }));
resources.push(new Resource({ name: "Defense", img: '<i class="fi fi-rs-shield"></i>' }));
resources.push(new Resource({ name: "Followers", img: '<i class="fi fi-rs-users-alt"></i>' }));
resources.push(new Resource({ name: "Culture", img: '<i class="fi fi-rs-happy"></i>' }));
var phase = Phase.PreGame;
var deckZone = new Zone("Deck");
var handZone = new Zone("Hand");
var discardZone = new Zone("Discard");
var tableZone = new Zone("Table");
var decisionZone = new Zone("Decision");
startGame();
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~Misc Functions~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function getCardByID(id) {
    if (handZone.cards.length > 0)
        for (var i = handZone.cards.length; i > 0; i--)
            if (handZone.cards[i - 1]['uniqueID'] == id)
                return handZone.cards[i - 1];
    if (decisionZone.cards.length > 0)
        for (var i = decisionZone.cards.length; i > 0; i--)
            if (decisionZone.cards[i - 1]['uniqueID'] == id)
                return decisionZone.cards[i - 1];
    if (tableZone.cards.length > 0)
        for (var i = tableZone.cards.length; i > 0; i--)
            if (tableZone.cards[i - 1]['uniqueID'] == id)
                return tableZone.cards[i - 1];
    throw new Error("Couldn't find the card!");
}
function getUniqueID() {
    return Math.random();
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Card Effects~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function cardClicked(event) {
    updateLog("");
    event = event || window.event; // IE
    var target = event.target || event.srcElement; // IE
    getCardByID(target.id).onPlay();
}
function playCard(card) {
    if (card == undefined)
        throw new Error("Couldn't find the card!");
    card.onPlay();
}
function changeResources(name, valueChange) {
    var foundResource = false;
    if (resources.length > 0) {
        for (var i = resources.length; i > 0; i--) {
            if (resources[i - 1].name == name) {
                foundResource = true;
                resources[i - 1].value += valueChange;
            }
        }
    }
    if (!foundResource) {
        var r = new Resource({ name: name });
        resources.push(r);
        changeResources(name, valueChange);
    }
    updateResources();
}
function addDecisions(card) {
    decisionZone.cards.push(card);
}
function discardHand() {
    while (handZone.cards.length > 0) {
        var c = handZone.cards.pop();
        if (c != undefined)
            discardZone.cards.push(c);
    }
}
function shuffle(array) {
    var _a;
    updateLog("Shuffling.");
    var currentIndex = array.length, randomIndex;
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        // And swap it with the current element.
        _a = [
            array[randomIndex], array[currentIndex]
        ], array[currentIndex] = _a[0], array[randomIndex] = _a[1];
    }
    return array;
}
function applyCardPassiveEffects(card) {
    switch (phase) {
        case Phase.PreGame: break;
        case Phase.Draw:
            card.onDraw();
            break;
        case Phase.TurnStart:
            card.onTurnStart();
            break;
        case Phase.Decision:
            card.onDecision();
            break;
        case Phase.TurnEnd:
            card.onTurnEnd();
            break;
        default:
            throw new Error("No Effects in this Phase");
            break;
    }
}
function applyAllPassiveEffects() {
    if (handZone.cards.length > 0)
        handZone.cards.forEach(applyCardPassiveEffects);
    if (tableZone.cards.length > 0)
        tableZone.cards.forEach(applyCardPassiveEffects);
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~Update Visuals~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function updateLog(logUpdate) {
    logHTML.innerHTML += logUpdate + "<br>";
    scrollToBottom();
}
function clearLog() {
    logHTML.innerHTML = "";
}
function hideHand() {
    handHTML.innerHTML = "";
}
function refreshHand() {
    handHTML.innerHTML = "";
    if (handZone.cards.length > 0) {
        handZone.cards.forEach(displayCard);
    }
}
function refreshDecisions() {
    decisionHTML.innerHTML = "";
    if (decisionZone.cards.length > 0) {
        decisionZone.cards.forEach(displayCard);
    }
}
function clearDecisions() {
    decisionZone.cards.length = 0;
    refreshDecisions();
}
function displayCard(card) {
    card.displayCard();
}
function scrollToBottom() {
    var element = document.getElementById("scrolllog");
    if (element != null)
        element.scrollTop = element.scrollHeight;
}
function addResourceDisplay(resource) {
    resourcesHTML.innerHTML += '<p>' + resource.img + ' ' + resource.name + ' ' + resource.value.toString() + '<br></p>';
}
function updateResources() {
    resourcesHTML.innerHTML = "<h3>Supply</h3>";
    if (resources.length > 0)
        resources.forEach(addResourceDisplay);
}
//Unimplemented
function updateImage() {
    throw new Error("Function 'updateImage()' must be implemented.");
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Game Loop~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function startGame() {
    //Initialize Variables, Get Player Name, Set Options, Load Saves, Create Deck
    clearLog();
    setUpDeck();
    drawPhase();
}
function setUpDeck() {
    //Create Starting Deck
    deckZone.cards.push(new Farmer());
    deckZone.cards.push(new Soldier());
    deckZone.cards.push(new Priest());
    deckZone.cards.push(new Artist());
    deckZone.cards.push(new Lord());
}
function drawPhase() {
    phase = Phase.Draw;
    //Calculate total cards to draw
    plusDraw = 0;
    applyAllPassiveEffects();
    var totalDraw = baseHandSize + plusDraw;
    //If totalDraw is greater than remaining cards in deck, shuffle discard and move to bottom of deck.
    if (totalDraw > deckZone.cards.length) {
        shuffle(discardZone.cards);
        while (discardZone.cards.length > 0) {
            var c = discardZone.cards.pop();
            if (c != undefined)
                deckZone.cards.unshift(c);
        }
    }
    //Draw Hand
    for (var i = totalDraw; i > 0; i--) {
        var c = deckZone.cards.pop();
        if (c != undefined) {
            c.displayZone = handHTML;
            handZone.cards.push(c);
        }
    }
    refreshHand();
    turnStartPhase();
}
function turnStartPhase() {
    currentTurn++;
    updateLog("Turn " + currentTurn.toString());
    phase = Phase.TurnStart;
    applyAllPassiveEffects();
}
function decisionPhase() {
    phase = Phase.Decision;
    refreshDecisions();
}
function endTurnPhase() {
    phase = Phase.TurnEnd;
    applyAllPassiveEffects();
    discardHand();
    clearDecisions();
    refreshHand();
    refreshDecisions();
    drawPhase();
}
//Unimplemented
function checkForGameOver() {
    throw new Error("Function 'checkForGameOver()' must be implemented.");
}
