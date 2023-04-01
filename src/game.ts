//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~HTML Elements~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//Used to update the log
const logHTML: HTMLElement | any = document.getElementById("log");
//Used to add Cards to appropriate zones
const handHTML: HTMLElement|null = document.getElementById("hand");
const decisionHTML: HTMLElement | null = document.getElementById("decision");
//Used to Update Resources
const resourcesHTML: HTMLElement | any = document.getElementById("resources");
//Used to update Card Preview Display
const cardImageDisplayHTML: HTMLElement | any = document.getElementById("cardimagedisplay");
const cardDisplayHTML: HTMLElement | any = document.getElementById("carddisplay");
const cardTextBoxHTML: HTMLElement | any = document.getElementById("cardtextbox");

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Card Display~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//const defaultCardDisplay: string = '<img src="assets/Bg_Space1.png" alt="Space">';

function updateCardDisplay(html: HTMLElement){
	let c = getCardByID(Number(html.id));
	let display : string = `<img id ="cardimagedisplay" 
	src="assets/${c.name}.jpg" alt="${c.name}">
	<div id="cardtextbox">	<p>${c.cardText}</p></div>`;

cardDisplayHTML.innerHTML = display;
}
function clearCardDisplay(html: HTMLElement){
	cardDisplayHTML.innerHTML = `<img id ="cardimagedisplay" 
	src="assets/Bg_Space1.png" alt="SpaceBackground">
	<div id="cardtextbox">	<p>Lorem Ipsum Dolor Sit Amet</p></div>`;
}

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
const allCards : Map<string,Card> = new Map<string,Card>();

class Card {
	name: string;
    uniqueID: number;
	displayZone: HTMLElement|null = null;
	btn: HTMLElement|null =null;
	cardImg: HTMLElement|null = null;
	cardText: string|null = "Generic Card Text";
	onPlayAbilities: Array<Ability> = new Array<Ability>();
	onDrawAbilities: Array<Ability> = new Array<Ability>();
	onTurnStartAbilities: Array<Ability> = new Array<Ability>();
	onDecisionAbilities: Array<Ability> = new Array<Ability>();
	onTurnEndAbilities: Array<Ability> = new Array<Ability>();

	constructor(name:string,cardText:string) {
		this.uniqueID = getUniqueID();
		this.name  = name;
		this.cardText = cardText;
	}

	getImage(){
		//Does this need to be run every time? will it get cleaned up if the card is cleared and need to be rerun?
		this.cardImg = document.createElement("card");
		this.cardImg.className="card";
		this.cardImg.id = this.uniqueID.toString();
		this.cardImg.innerHTML+=`<img class="cardimage clickthrough"	src="assets/${this.name}.jpg" alt="${this.name}"/> <p class="clickthrough">${this.name}</p>`;
	}

	displayCard() {
		if(this.displayZone!=null){
			this.getImage();
			this.displayZone.appendChild((<Node>this.cardImg));
		}	
	}
	//Active Effects
	onPlay() {
		updateLog("");
		if(this.onPlayAbilities.length>0)
		this.onPlayAbilities.forEach((obj) => {
			obj.activate();
		});
	}
	//Passive Effects
	onDraw() {
		if(this.onDrawAbilities.length>0)
			this.onDrawAbilities.forEach((obj) => {
				obj.activate();
			});
	}
	onTurnStart() {
		if(this.onTurnStartAbilities.length>0)
		this.onTurnStartAbilities.forEach((obj) => {
			obj.activate();
		});
	}
	onDecision() {
		if(this.onDecisionAbilities.length>0)
		this.onDecisionAbilities.forEach((obj) => {
			obj.activate();
		});
	}
	onTurnEnd() {
		if(this.onTurnEndAbilities.length>0)
		this.onTurnEndAbilities.forEach((obj) => {
			obj.activate();
		});
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

if(handHTML!=null && decisionHTML!=null){
	handHTML.addEventListener("mouseover", (event) => {
		if(event.target){
			if((<HTMLElement>event.target).className==='card') {
			updateCardDisplay((<HTMLElement>event.target));
			}
		}
	})
	handHTML.addEventListener("click", (event) => {
		if(event.target){
			if((<HTMLElement>event.target).className==='card') {
			cardClicked((<HTMLElement>event.target));
			}
		}
	})
	handHTML.addEventListener("mouseout", (event) => {
		if(event.target){
			if((<HTMLElement>event.target).className==='card') {
			clearCardDisplay((<HTMLElement>event.target));
			}
		}
	})
	decisionHTML.addEventListener("mouseover", (event) => {
		if(event.target){
			if((<HTMLElement>event.target).className==='card') {
			updateCardDisplay((<HTMLElement>event.target));
			}
		}
	})
	decisionHTML.addEventListener("click", (event) => {
		if(event.target){
			if((<HTMLElement>event.target).className==='card') {
			cardClicked((<HTMLElement>event.target));
			}
		}
	})
	decisionHTML.addEventListener("mouseout", (event) => {
		if(event.target){
			if((<HTMLElement>event.target).className==='card') {
			clearCardDisplay((<HTMLElement>event.target));
			}
		}
	})
}

class Ability {
	var1 : any;
	var2 : any;
	var3 : any;
	constructor(x:any = null,y:any = null,z:any = null){
		this.var1=x;
		this.var2=y;
		this.var3=z;
	}
	activate(){		
	}
}
class ChangeResources extends Ability{
	activate(): void {
		changeResources(this.var1,this.var2);
	}
}
class UpdateLog extends Ability{
	activate(): void {
		updateLog(this.var1);
	}
}
class AddDecisions extends Ability{
	activate(): void {
		addDecisions(this.var1);
	}
}
class DiscardHand extends Ability{
	activate(): void {
		discardHand();
	}
}
class HideHand extends Ability{
	activate(): void {
		hideHand();
	}
}
class DecisionPhase extends Ability{
	activate(): void {
		decisionPhase();
	}
}
class EndTurnPhase extends Ability{
	activate(): void {
		endTurnPhase();
	}
}

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
function cardClicked(card: HTMLElement){
	getCardByID(Number(card.id)).onPlay();
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
	if(handHTML!=null)
	handHTML.style.display='none';
}
function refreshHand(){
	if(handHTML!=null){
	handHTML.innerHTML="";
	if(handZone.cards.length>0){
		handZone.cards.forEach(displayCard);
	}
	handHTML.style.display='block';}
}
function refreshDecisions(){
	if(decisionHTML)
	decisionHTML.innerHTML="";
	if(decisionZone.cards.length>0){
		decisionZone.cards.forEach(displayCard);
		if(decisionHTML) decisionHTML.style.display='block';
	} else {
		
	}
	
	
}
function clearDecisions() {
	decisionZone.cards.length = 0;
	refreshDecisions();
	if(decisionHTML)
	decisionHTML.style.display='none';
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
	readCardList();
	setUpDeck();
	drawPhase();
}
function readCardList(){
	//Eventually, this function will read from a .txt file to define all the cards that will be used.
	//Foreach card read from the list:

	const endTurn = new Card("End Turn","Ends the current Turn");
	endTurn.displayZone = decisionHTML;
	endTurn.onPlayAbilities.push(new EndTurnPhase());

	const f = new Card("Farmer","I AM the Farm Lord");
	f.onTurnStartAbilities.push(new UpdateLog(f.name+" harvested 1 food!"), new ChangeResources("Food",1));
	f.onPlayAbilities.push(new UpdateLog("'Oh I sure do love farming!'"),new UpdateLog(f.name+" harvested 5 food!"), new ChangeResources("Food",5), new HideHand(), new AddDecisions(endTurn),new DecisionPhase());
	allCards.set(f.name, f);

	const s = new Card("Soldier","Soldier Time");
	s.onTurnStartAbilities.push(new UpdateLog(s.name+" Bolstered Defense by 1!"), new ChangeResources("Defense",1));
	s.onPlayAbilities.push(new UpdateLog("'Bolster it up!'"),new UpdateLog(s.name+" Bolstered Defense by 5!"), new ChangeResources("Defense",5), new HideHand(), new AddDecisions(endTurn),new DecisionPhase());
	allCards.set(s.name, s);

	const p = new Card("Priest","Priest all day, Every Day");
	p.onTurnStartAbilities.push(new UpdateLog(p.name+" Gained 1 Follower!"), new ChangeResources("Followers",1));
	p.onPlayAbilities.push(new UpdateLog("'I could priest all day!'"),new UpdateLog(p.name+" Gained 5 Followers!"),new ChangeResources("Followers",5), new HideHand(), new AddDecisions(endTurn),new DecisionPhase());
	allCards.set(p.name, p);

	const a = new Card("Artist","Generates Culture");
	a.onTurnStartAbilities.push(new UpdateLog(a.name+" Gained 1 Culture!"), new ChangeResources("Culture",1));
	a.onPlayAbilities.push(new UpdateLog("'Churning out them cultures!'"),new UpdateLog(p.name+" Gained 5 Culture!"),new ChangeResources("Culture",5), new HideHand(), new AddDecisions(endTurn),new DecisionPhase());
	allCards.set(a.name, a);

	const l = new Card("Lord","Lord Time, BOOOY");
	l.onTurnStartAbilities.push(new UpdateLog(l.name+" Collected 1 of Everything"), new ChangeResources("Food",1),new ChangeResources("Followers",1),new ChangeResources("Culture",1),	new ChangeResources("Defense",1));
	l.onPlayAbilities.push(new UpdateLog("'Lording is the best job there is!!'"), new UpdateLog(l.name+" Collected 1 of Everything"), new ChangeResources("Food",1),new ChangeResources("Followers",1),new ChangeResources("Culture",1), new ChangeResources("Defense",1), new HideHand(), new AddDecisions(endTurn),new DecisionPhase());
	allCards.set(l.name, l);

}

function setUpDeck() {
	//Create Starting Deck
	const newFarmer: Card = allCards.get("Farmer") as Card;
	const newSoldier: Card = allCards.get("Soldier") as Card;
	const newArtist: Card = allCards.get("Artist") as Card;
	const newPriest: Card = allCards.get("Priest") as Card;
	const newLord: Card = allCards.get("Lord") as Card;
	deckZone.cards.push(newFarmer);
	deckZone.cards.push(newSoldier);
	deckZone.cards.push(newArtist);
	deckZone.cards.push(newPriest);
	deckZone.cards.push(newLord);
	
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
	updateLog("");
	updateLog("<b>Turn "+currentTurn.toString()+"</b>");
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





