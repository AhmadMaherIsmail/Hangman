const wordEl = document.getElementById('word');
const wrongLettersEl = document.getElementById('wrong-letters');
const playAgainBtn = document.getElementById('play-button');
const popup = document.getElementById('popup-container');
const notification = document.getElementById('notification-container');
const finalMessage = document.getElementById('final-message');

const figureParts = document.querySelectorAll('.figure-part');


let selectedWord;
const correctLetters = [];
const wrongLetters = [];

async function getRandomWord() {
	const res = await fetch('https://random-word-api.herokuapp.com/word?number=1&swear=0', {
		method: 'GET'
	});

	const words = await res.json();
	return words[0];
}


async function displayWord() {


	selectedWord = selectedWord ? selectedWord : await getRandomWord();

	wordEl.innerHTML = `
		${selectedWord.split('').map(letter => `
			<span class = "letter">
				${correctLetters.includes(letter) ? letter : ''}
			</span>
		`).join('')}
		`;
	const innerWord = wordEl.innerText.replace(/\n/g, '');

	if (innerWord === selectedWord) {
		finalMessage.innerText = 'Congratulations! You Won! 😀'
		popup.style.display = 'flex';
	}
}

// Update the wrong letters
function updateWrongLettersEl() {

	// Display wrong letters
	wrongLettersEl.innerHTML = `
		${wrongLetters.length > 0 ? `<p>Wrong</p>` : ''}
		${wrongLetters.map(letter => `<span>${letter}</span>`)}
	`;

	// Display parts
	figureParts.forEach((part, index) => {
		const errors = wrongLetters.length;

		if (index < errors)
			part.style.display = 'block';
		else
			part.style.display = 'none';
	});

	// Check if lost
	if (wrongLetters.length === figureParts.length) {
		finalMessage.innerHTML = `Unfortunately you lost. 😕<br>
			The word was <span style="color: #fcc203;">${selectedWord}</span>
		`;
		popup.style.display = 'flex';
	}
}

// Show notification
function showNotification() {
	notification.classList.add('show');

	setTimeout(() => { notification.classList.remove('show') }, 2000);
}



// Restart game and play again
playAgainBtn.addEventListener('click', async () => {
	// Empty arrays
	correctLetters.splice(0);
	wrongLetters.splice(0);


	selectedWord = await getRandomWord();
	displayWord();
	updateWrongLettersEl();
	popup.style.display = 'none';

});


setTimeout(() => {
	displayWord();

	// Keydown letter press
	window.addEventListener('keydown', e => {
		if (e.keyCode >= 65 && e.keyCode <= 90) {
			const letter = e.key;

			if (selectedWord.includes(letter)) {
				if (!correctLetters.includes(letter)) {
					correctLetters.push(letter);
					displayWord();
				}
				else
					showNotification();
			}
			else {
				if (!wrongLetters.includes(letter)) {
					wrongLetters.push(letter);
					updateWrongLettersEl();
				}
				else
					showNotification();
			}
		}
	});
});
