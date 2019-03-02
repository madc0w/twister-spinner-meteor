const colors = [ "red", "blue", "yellow", "green" ];
const numbers = {
	1 : "won",
	2 : "too",
	3 : "three",
	4 : "for",
	5 : "five",
	6 : "sicks",
};

var interval = 6;
var intervalId = null;
var timerIntervalId = null;
var startTime = null;
var numPlayers = 1;
var playerNum = 0;

Template.main.helpers({


});

Template.main.events({
	"click #spin-button" : spin,
	
	"change #continuous-checkbox":function(e){
		const isContinuous = $("#continuous-checkbox").is(":checked");
		if (intervalId && !isContinuous) {
			clearInterval(intervalId);
			clearInterval(timerIntervalId);
		}

		const display = isContinuous ? "block" : "none";
		$("#interval-container").css("display", display);
		$("#timer").css("display", display);
	},
});

Template.main.onRendered(function() {
	$("#interval").val(interval);
	const loadTime = new Date();
	setInterval(function() {
		const now = new Date();
		const x = 22 + 3 * Math.cos((now - loadTime) / 200);
		const y = 3 * Math.sin((now - loadTime) / 200);
		$("#color").css("margin-left", x + "px");
		$("#color").css("margin-top", y + "px");
	}, 20);
});


function spin() {
	function f() {
		startTime = new Date();
		const color = colors[Math.floor(Math.random() * colors.length)];
		$("#color").css("background-color", color);
		var text = (Math.random() < 0.5 ? "Left" : "Right") + " " + (Math.random() < 0.5 ? "hand" : "foot");
		var html = text;
		var utterance = text;
		if (numPlayers > 1) {
			const _text = text;
			utterance = "Player " + numbers[playerNum + 1];
			text = "Player " + (playerNum + 1);
			html = text + " : <br/>" + _text;
			utterance += " " + _text;
			playerNum++;
			playerNum %= numPlayers;
		}
		$("#instruction")[0].innerHTML = html;
		utterance += " " + color;
		const msg = new SpeechSynthesisUtterance(utterance);
		setRandomVoice(msg);
		speechSynthesis.speak(msg);
	}

	f();
	if ($("#continuous-checkbox").is(":checked")) {
		const currInterval = interval;
		interval = parseInt($("#interval").val()) || currInterval;
		$("#interval").val(interval);

		clearInterval(intervalId);
		clearInterval(timerIntervalId);

		intervalId = setInterval(f, interval * 1000);
		timerIntervalId = setInterval(function() {
			const now = new Date();
			const width = 100 * (1 - (now - startTime) / (interval * 1000));
			$("#current-time").css("width", width + "%");
		}, 20);
	}
}

function numPlayersChange() {
	numPlayers = parseInt($("#num-players").val());
	spin();
}

function setRandomVoice(msg) {
	var voices = [];
	new SpeechSynthesisUtterance();
	speechSynthesis.getVoices().forEach(function(voice) {
		if (voice.lang.startsWith("en") || voice.lang.startsWith("fr")) {
			//		if (voice.lang.startsWith("fr")) {
			//			console.log("voice", voice);
			voices.push(voice);
		}
	});
	var voice = voices[Math.floor(Math.random() * voices.length)];
	msg.pitch = 1 + ((Math.random() - 0.5) * 0.8);
	msg.voice = voice;
}
