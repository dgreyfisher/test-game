//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~HTML Elements~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const logHTML: HTMLElement | any = document.getElementById("log");
const handHTML: HTMLElement | any = document.getElementById("hand");
const decisionHTML: HTMLElement | any = document.getElementById("decision");
const resourcesHTML: HTMLElement | any = document.getElementById("resources");

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Images~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//<img src="img_girl.jpg" alt="Girl in a jacket">

const img_farmer: string = '<img src="assets/img_farmer.jpg" alt="Farmer">';

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Resources~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
class Resource{
	name: string;
	value: number;
	img: string;
	constructor({name = "Unnamed", initialValue = 0, img ="<i class='fi fi-rs-coins'></i>"}){
		this.name = name;
		this.value = initialValue;
		this.img = img;
	}
}



//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Phases~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
enum Phase {
	PreGame,
	Draw,
	TurnStart,
	Decision,
	TurnEnd,
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Cards~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
class Card {
	name: string;
    uniqueID: Number;
	displayZone: HTMLElement|null = null;
	btn: HTMLElement|null =null;
	img: string|null=null; 
	constructor() {
		this.uniqueID = getUniqueID();
		this.name  = "Unnamed";	
	}

	getImage(){
		this.img = `<div class="card">	<input type="image" class="cardimage" src="assets/${this.name}.jpg" id=${this.uniqueID}  onclick="cardClicked(event)" alt="${this.name}" /><p>${this.name}</p>	</div>`
	}
	//Passive Effects
	onDraw() {
		//By Default does nothing
	}
	onTurnStart() {
		//By Default does nothing
	}
	onDecision() {
		//By Default does nothing
	}
	onTurnEnd() {
		//By Default does nothing
	}

	//Active Effects
	onPlay() {
		throw new Error("Method 'Card.onPlay()' must be implemented.");
	}

	displayCard() {
		if(this.displayZone!=null){
			//Create button in HTML strin
			//Append String to appropriate Zone
			this.getImage();
			this.displayZone.innerHTML+=this.img;
		}
	}
}
class Farmer extends Card {
	
	constructor(){
		super();
		this.name = "Farmer";

	}
	onTurnStart() {
		updateLog(this.name+" harvested 1 Food");
		changeResources("Food",1);
	}
	onPlay() {
		
		updateLog("'Oh I sure do love farming!'");

		//Change Resources.
		updateLog(this.name+" harvested 5 Food!");
		changeResources("Food",5);

		//Move to Decision Phase
		hideHand();
		addDecisions(new D_EndTurn());
		decisionPhase();
	}
}
class Soldier extends Card {
	
	constructor(){
		super();
		this.name = "Soldier";
	}
	onTurnStart() {
		updateLog(this.name+" bolstered Defense by 1!");
		changeResources("Defense",1);
	}
	onPlay() {
		hideHand();
		updateLog("'GUARD IT ALL BOLSTER IT UP YES!'");
		updateLog(this.name+" bolstered Defense by 5!");
		changeResources("Defense",5);
		addDecisions(new D_EndTurn());
		decisionPhase();
	}
}
class Priest extends Card {
	
	constructor(){
		super();
		this.name = "Priest";
	}
	onTurnStart() {
		updateLog(this.name+" gained 1 Follower!");
		changeResources("Followers",1);
	}
	onPlay() {
		hideHand();
		updateLog("'I could priest ALL DAY!'");
		updateLog(this.name+" gained 5 Followers!");
		changeResources("Followers",5);
		addDecisions(new D_EndTurn());
		decisionPhase();
	}
}
class Artist extends Card {
	
	constructor(){
		super();
		this.name = "Artist";
	}
	onTurnStart() {
		updateLog(this.name+" crafted 1 Culture!");
		changeResources("Culture",1);
	}
	onPlay() {
		hideHand();
		updateLog("'Churning out them Cultures!'");
		updateLog(this.name+" crafted 5 Culture!");
		changeResources("Culture",5);
		addDecisions(new D_EndTurn());
		decisionPhase();
	}
}
class Lord extends Card {
	
	constructor(){
		super();
		this.name = "Lord";
	}
	onTurnStart() {
		updateLog(this.name+" collected 1 of everything!");
		changeResources("Food",1);
		changeResources("Followers",1);
		changeResources("Culture",1);
		changeResources("Defense",1);
	}
	onPlay() {
		hideHand();
		updateLog("'Lording is the best job there is!'");
		updateLog(this.name+" collected 1 of everything!");
		changeResources("Food",1);
		changeResources("Followers",1);
		changeResources("Culture",1);
		changeResources("Defense",1);
		addDecisions(new D_EndTurn());
		decisionPhase();
	}
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Decisions~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
class D_EndTurn extends Card {
	constructor(){
		super();
		this.displayZone = decisionHTML;
		this.name = "End Turn";
	}
	onPlay() {
		endTurnPhase();
	}
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Zones~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
class Zone {
    name: string;
    cards: Array<Card>;
	constructor(name: string) {
		this.name = name;
        this.cards = new Array<Card>();
	}
}

//~~~~~~~~~~~~~~~~~~~~~~~~~Misc Initializations~~~~~~~~~~~~~~~~~~~~~~~~~~~
let baseHandSize = 3;
let gameStarted = false;
let plusDraw = 0;
let currentTurn = 0;

let resources = new Array<Resource>();
resources.push(new Resource({name:"Health",initialValue:100,img:'<i class="fi fi-rs-heart"></i>'}));
resources.push(new Resource({name:"Energy",initialValue:50,img:'<i class="fi fi-rs-sparkles"></i>'}));
resources.push(new Resource({name:"Food",img:'<i class="fi fi-rs-hand-holding-seeding"></i>'}));
resources.push(new Resource({name:"Defense",img:'<i class="fi fi-rs-shield"></i>'}));
resources.push(new Resource({name:"Followers",img:'<i class="fi fi-rs-users-alt"></i>'}));
resources.push(new Resource({name:"Culture",img:'<i class="fi fi-rs-happy"></i>'}));

let phase = Phase.PreGame;
let deckZone = new Zone("Deck");
let handZone = new Zone("Hand");
let discardZone = new Zone("Discard");
let tableZone = new Zone("Table");
let decisionZone = new Zone("Decision");
startGame();

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~Misc Functions~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function getCardByID(id: number) {
	if (handZone.cards.length > 0)	
		for (let i = handZone.cards.length; i > 0; i--)
			if (handZone.cards[i - 1]['uniqueID'] == id)
				return handZone.cards[i - 1]
	if (decisionZone.cards.length > 0)
		for (let i = decisionZone.cards.length; i > 0; i--)
			if (decisionZone.cards[i - 1]['uniqueID'] == id)
				return decisionZone.cards[i - 1]
	if (tableZone.cards.length > 0)
		for (let i = tableZone.cards.length; i > 0; i--)
			if (tableZone.cards[i - 1]['uniqueID'] == id)
				return tableZone.cards[i - 1]

	throw new Error("Couldn't find the card!");	
}
function getUniqueID() {
    return Math.random();
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Card Effects~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function cardClicked(event:any){
	updateLog("");
	event = event || window.event; // IE
    var target = event.target || event.srcElement; // IE
	getCardByID(target.id).onPlay();
}
function playCard(card: Card) {
	
	if (card == undefined)
		throw new Error("Couldn't find the card!");
	card.onPlay();
	
}
function changeResources(name: string, valueChange:number) {
	let foundResource=false;
	if(resources.length>0){
		for (let i = resources.length; i > 0; i--){
			if(resources[i-1].name==name){
				foundResource=true;
				resources[i-1].value+=valueChange;
			}
		}
	}
	if(!foundResource){
		let r = new Resource({name:name});
		resources.push(r)
		changeResources(name,valueChange);
	}
	updateResources();
}
function addDecisions(card: Card) {
	decisionZone.cards.push(card);
}
function discardHand() {
	while (handZone.cards.length > 0){
        var c = handZone.cards.pop();
        if(c!=undefined)
            discardZone.cards.push(c);}
}
function shuffle(array: any) {
	updateLog("Shuffling.");
	let currentIndex = array.length, randomIndex;

	// While there remain elements to shuffle.
	while (currentIndex != 0) {

		// Pick a remaining element.
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex], array[currentIndex]];
	}

	return array;
}
function applyCardPassiveEffects(card: Card) {
	switch (phase) {
		case Phase.PreGame: break;
		case Phase.Draw: card.onDraw(); break;
		case Phase.TurnStart: card.onTurnStart(); break;
		case Phase.Decision: card.onDecision(); break;
		case Phase.TurnEnd: card.onTurnEnd(); break;
		default: throw new Error("No Effects in this Phase"); break;
	}
}
function applyAllPassiveEffects(){
	if(handZone.cards.length>0)
		handZone.cards.forEach(applyCardPassiveEffects);
	if(tableZone.cards.length>0)
		tableZone.cards.forEach(applyCardPassiveEffects);
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~Update Visuals~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function updateLog(logUpdate: string){
	logHTML.innerHTML+=logUpdate+"<br>";
	scrollToBottom();
}
function clearLog(){
	logHTML.innerHTML="";
}
function hideHand(){
	handHTML.innerHTML="";
}
function refreshHand(){
	handHTML.innerHTML="";
	if(handZone.cards.length>0){
		handZone.cards.forEach(displayCard);
	}
}
function refreshDecisions(){
	decisionHTML.innerHTML="";
	if(decisionZone.cards.length>0){
		decisionZone.cards.forEach(displayCard);
	}
}
function clearDecisions() {
	decisionZone.cards.length = 0;
	refreshDecisions();
}
function displayCard(card : Card){
	card.displayCard();
}
function scrollToBottom(){
	const element = document.getElementById("scrolllog");
	if(element!=null)
  		element.scrollTop = element.scrollHeight;
}
function addResourceDisplay(resource: Resource){
	resourcesHTML.innerHTML+='<p>' + resource.img + ' ' + resource.name + ' ' + resource.value.toString() + '<br></p>';
}
function updateResources(){
	resourcesHTML.innerHTML="<h3>Supply</h3>";
	if(resources.length>0)
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
function drawPhase(){
	phase = Phase.Draw;
	//Calculate total cards to draw
	plusDraw = 0;
	applyAllPassiveEffects();
	let totalDraw = baseHandSize + plusDraw;

	//If totalDraw is greater than remaining cards in deck, shuffle discard and move to bottom of deck.
	if (totalDraw > deckZone.cards.length) {
		shuffle(discardZone.cards);

		while (discardZone.cards.length > 0){
			let c = discardZone.cards.pop();
			if(c!=undefined)
				deckZone.cards.unshift(c);}
	}

	//Draw Hand
	for (let i = totalDraw; i > 0; i--){
		let c = deckZone.cards.pop()
		if(c!=undefined){
			c.displayZone=handHTML;
			handZone.cards.push(c);
		}
	}
	refreshHand();
	turnStartPhase();
}
function turnStartPhase(){
	currentTurn++;
	updateLog("Turn "+currentTurn.toString());
	phase = Phase.TurnStart;
	applyAllPassiveEffects();	
}
function decisionPhase(){
	phase = Phase.Decision;
	refreshDecisions();
}
function endTurnPhase(){
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





