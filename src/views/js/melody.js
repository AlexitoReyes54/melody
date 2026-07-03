import anime from 'https://cdn.jsdelivr.net/npm/animejs@3.2.2/lib/anime.es.js';
const { animate } = anime;
import { globalState } from './state.js';
import { KeyToPitch } from './constants.js';

// UTILS
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

function areArraysEqual(arr1, arr2) {
	if (arr1.length !== arr2.length) return false;
	return arr1.every((element, index) => element === arr2[index]);
}

function playNote(note) {
	const synth = new Tone.Synth().toDestination();
	synth.triggerAttackRelease(note, "8n");
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

const getTimeLinePosition = (timeBetweenKeys, keyIndex) => {
	if (keyIndex === 0) {
		return 'start'
	}
	return timeBetweenKeys * keyIndex;
}

function disableBtns() {
	const allBtns = document.querySelectorAll('#notesGrid .btn');

	allBtns.forEach(btn => {
		btn.disabled = true;
	});
}

function enableBtns() {
	const allBtns = document.querySelectorAll('#notesGrid .btn');

	allBtns.forEach(btn => {
		btn.disabled = false;
	});
}

function checkIfPlayerFailed() {
	let failed = false;
	const playingLoop = globalState.currentLoopToPlay;

	globalState.pressedKeys.forEach((value, index, arr) => {
		if (value !== playingLoop[index]) {
			failed = true;
		}
	})

	return failed
}

async function uploadResultsToRanking() {
	// send streak to the api
	const endpoint = '/rank';

	try {
		const response = await fetch(endpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			// Convert the JavaScript object into a JSON string for the server
			body: JSON.stringify({
				username: globalState.nickName,
				streak: globalState.streak
			})
		});

		// Check if the server responded with a success status (200-299)
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
		console.log('Successfully uploaded to ranking:', data);
		return data;

	} catch (error) {
		console.error('Failed to upload ranking:', error);
	}
}

// events
document.addEventListener("DOMContentLoaded", (event) => {
	globalState.displayWelcomeModala()
});

window.addEventListener("increaseStreak", (event) => {
	//Streak: 0
	console.log('klk manito como estas');
	console.log(event.detail);
	let display = document.getElementById('streak-display');
	display.textContent = 'Streak: ' + globalState.streak;
});

// showEndModal
window.addEventListener("showEndModal", (event) => {

	if (event.detail.showEndModal) {
		return;
	}

	const modalElement = document.getElementById('endModal');
	const myModal = new bootstrap.Modal(modalElement);
	myModal.show();

});


window.addEventListener("showWelcomeModal", (event) => {

	if (!event.detail.showWelcomeModal) {
		return;
	}

	const modalElement = document.getElementById('welcomeModal');
	const myModal = new bootstrap.Modal(modalElement);
	myModal.show();

});

document.getElementById('closeEndModalBtn').addEventListener('click', () => {
	location.reload()
})

document.getElementById('closeWelcomeModalBtn').addEventListener('click', () => {

	let nickInput = document.getElementById('nicknameInput');

	if (nickInput.value === '' || nickInput.value === undefined) {
		nickInput.classList.add('is-invalid');
		nickInput.placeholder = 'Debe agregar un nombre'
		return;
	}

	globalState.setName(nickInput.value)
	nickInput.value = '';

	const modalElement = document.getElementById('welcomeModal');
	const myModal = bootstrap.Modal.getInstance(modalElement);
	myModal.hide();
	gameProcessor();

});

async function startNewLoop() {

	disableBtns();
	await delay(400)
	let choosenIndex = getRandomInt(0, globalState.availableLoops.length - 1);
	let choosenLoop = globalState.availableLoops[choosenIndex];


	globalState.currentLoopToPlay = choosenLoop.loop;
	globalState.availableLoops.slice(choosenIndex, 1)

	globalState.pressedKeys = [];
	enableBtns();
	playLoopUI(choosenLoop.loop);
}

// TODO: add a try catch if error reset the hole game
/*
 * actualiza el estado del juego
  {string | null} keyPressed - note playing
 */
async function gameProcessor(keyPressed) {
	// TODO delete log
	console.log(globalState);

	if (globalState.currentLoopToPlay.length === 0 && keyPressed === undefined) {
		await startNewLoop()
		return;
	}

	if (keyPressed === undefined) {
		// si no se presiona una tecla y se llama 
		// esta funcion entonces hay un error
	}

	globalState.pressedKeys.push(keyPressed)

	if (checkIfPlayerFailed()) {
		await uploadResultsToRanking()
		globalState.displayEndModala()
	}

	const didPlayerCompleteLoop = areArraysEqual(globalState.pressedKeys, globalState.currentLoopToPlay);
	if (didPlayerCompleteLoop) {
		globalState.increaseStreak();
		await startNewLoop()
	}

}

// update the global state while the app is running

const allBtns = document.querySelectorAll('#notesGrid .btn');

allBtns.forEach(btn => {
	btn.addEventListener('click', () => {
		playNote(KeyToPitch[btn.id])

		// animation
		animate(btn, {
			scale: '1.2',
			scale: '1',
			reversed: true,
			//'background-color': '#F9F640',
			backgroundColor: ['#F9F640', 'transparent'], // Turns yellow, then fades to transparent
		})

		gameProcessor(btn.id);
		//console.log(`You clicked: ${btn.id}`);
	});
});

/*
 * reproduce patron en la UI
 * @param {string[]} loop - list of notes
 */
function playLoopUI(loop) {
	// loop looks like: ['do', 're', 'mi']
	const timeBetweenKeys = 200;


	loop.forEach((id, index) => {
		const element = document.getElementById(id);
		const animationTime = 200 * loop.length;

		let time = anime.createTimeline({
			onBegin: () => {
				disableBtns()
				console.log('btns enabled');
			},
			onComplete: () => {
				enableBtns()
				console.log('btns disabled');
			},
			defaults: { duration: animationTime }

		});

		if (element) {
			time.add(element, {
				scale: '1.2',
				reversed: true,
				'background-color': '#F9F640',
			}, getTimeLinePosition(timeBetweenKeys, index))
		}
	});
}

