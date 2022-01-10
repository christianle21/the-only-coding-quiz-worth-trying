// Initial Variables and the setup array/local storage database

	//1. Setting up the intial required variables.
    document.addEventListener('DOMContentLoaded', (event) => {

	const initialTime = 75;
	let time = 75;
	let score = 0;
	let qCount = 0;
	let timeset;
	let answers = document.querySelectorAll('#quiz button');

	//2. Sets the array then if local storage exists, it populates it into the array of records.
	let recordsArray = [];
	// Retrieves the data if it exists or keep an empty array otherwise.
	(localStorage.getItem('recordsArray')) ? recordsArray = JSON.parse(localStorage.getItem('recordsArray')): recordsArray = [];

	// Functions made to reduce any repeated code.

	// Function to quickly call elements.
	let queryElement = (element) => {
		return document.querySelector(element);
	}

	// Function to hide all sections then shows the one provided by the parameter.
	let onlyDisplaySection = (element) => {
		let sections = document.querySelectorAll("section");
		Array.from(sections).forEach((userItem) => {
			userItem.classList.add('invisible');
		});
		queryElement(element).classList.remove('invisible');
	}

	// Function to reset html display for the score.
	let recordsHtmlReset = () => {
		queryElement('#highScores div').innerHTML = "";
		var i = 1;
		recordsArray.sort((a, b) => b.score - a.score);
		Array.from(recordsArray).forEach(check =>
		{
			var scores = document.createElement("div");
			scores.innerHTML = i + ". " + check.initialRecord + " - " + check.score;
			queryElement('#highScores div').appendChild(scores);
			i = i + 1
		});
		i = 0;
		Array.from(answers).forEach(answer => {
			answer.classList.remove('disable');
		});
	}

	// Function to set the question data in the quiz section.
	let setQuestionData = () => {
		queryElement('#quiz p').innerHTML = questions[qCount].title;
		queryElement('#quiz button:nth-of-type(1)').innerHTML = `1. ${questions[qCount].choices[0]}`;
		queryElement('#quiz button:nth-of-type(2)').innerHTML = `2. ${questions[qCount].choices[1]}`;
		queryElement('#quiz button:nth-of-type(3)').innerHTML = `3. ${questions[qCount].choices[2]}`;
		queryElement('#quiz button:nth-of-type(4)').innerHTML = `4. ${questions[qCount].choices[3]}`;
	}

	//Function that changes the question and has a parameter to control the text to show whether if the answer someone picked is correct or wrong.
	let quizUpdate = (answerCopy) => {
		queryElement('#scoreIndicator p').innerHTML = answerCopy;
		queryElement('#scoreIndicator').classList.remove('invisible', scoreIndicator());
		Array.from(answers).forEach(answer =>
		{
			answer.classList.add('disable');
		});

		// If all the questions have been answered.
		setTimeout(() => {
			if (qCount === questions.length) {
				onlyDisplaySection("#finish");
				time = 0;
				queryElement('#time').innerHTML = time;
			} else {
				// Updates questions with the net array's question text.
				setQuestionData();
				// Removes the disabled status.
				Array.from(answers).forEach(answer => {
					answer.classList.remove('disable');
				});
			}
		}, 1000);
	}

	// Function handles time-related events for the quiz.
	let myTimer = () => {
		if (time > 0) {
			time = time - 1;
			queryElement('#time').innerHTML = time;
		} else {
			clearInterval(clock);
			queryElement('#score').innerHTML = score;
			onlyDisplaySection("#finish");
		}
	}

	// Quiz initialization and timer

	// For the intro button to click start time and start giving questions.
	let clock;
	queryElement("#intro button").addEventListener("click", (e) => {
		// Calls above function to set initial data in quiz section.
		setQuestionData();
		onlyDisplaySection("#quiz");
		clock = setInterval(myTimer, 1000);
	});

	// Clears timeout if next question is answered before current timeout is reached or if form element has a requirement not met.

	let scoreIndicator = () => {
		clearTimeout(timeset);
		timeset = setTimeout(() => {
		    queryElement('#scoreIndicator').classList.add('invisible');
		}, 1000);
	}

	// Quiz Controls

	// Creates an array of selected divs to refer to them with the this keyword and replace their values to then check against the answer property for all questions.
	Array.from(answers).forEach(check => {
		check.addEventListener('click', function (event) {
			// Handles events if a question is answered correctly.
			if (this.innerHTML.substring(3, this.length) === questions[qCount].answer) {
				score = score + 1;
				qCount = qCount + 1;
				quizUpdate("Correct");
			}else{
				// Handles events if they pick the wrong answer.
				time = time - 10;
				qCount = qCount + 1;
				quizUpdate("Wrong");
			}
		});
	});

	// Score Submission

	// Displays error message if initials given do not meet the requirements.
	let errorIndicator = () => {
		clearTimeout(timeset);
		timeset = setTimeout(() => {
			queryElement('#error').classList.add('invisible');
		}, 3000);
	}

	// Function for submitting high scores.
	queryElement("#records button").addEventListener("click", () => {
		let initialsRecord = queryElement('#initials').value;
		if (initialsRecord === ''){
			queryElement('#error p').innerHTML = "You need at least 1 character";
			queryElement('#error').classList.remove('invisible', errorIndicator());
		} else if (initialsRecord.match(/[[A-Za-z]/) === null) {
			queryElement('#error p').innerHTML = "Only letters for initials allowed.";
			queryElement('#error').classList.remove('invisible', errorIndicator());
		} else if (initialsRecord.length > 5) {
			queryElement('#error p').innerHTML = "Maximum of 5 characters allowed.";
			queryElement('#error').classList.remove('invisible', errorIndicator());
		} else {
			// Sends value to current array for use now.
			recordsArray.push({
				"initialRecord": initialsRecord,
				"score": score
			});
			// Sends value to local storage for the record.
			localStorage.setItem('recordsArray', JSON.stringify(recordsArray));
			queryElement('#highScores div').innerHTML = '';
			onlyDisplaySection("#highScores");
			recordsHtmlReset();
			queryElement("#initials").value = '';
		}
	});

	// High score control array/local storage 

	// Clears highscores from the html, array and localstorage.
	queryElement("#clearScores").addEventListener("click", () => {
		recordsArray = [];
		queryElement('#highScores div').innerHTML = "";
		localStorage.removeItem('recordsArray');
	});

	// Resets all quiz settings to the default to replay the quiz.
	queryElement("#reset").addEventListener("click", () => {
		time = initialTime;
		score = 0;
		qCount = 0;
		onlyDisplaySection("#intro");
	});

	// If a player presses the view high scores button in the html view then this abdandons all quiz progress and lets them view the high scores.
	queryElement("#scores").addEventListener("click", (e) => {
		e.preventDefault();
		clearInterval(clock);
		queryElement('#time').innerHTML = 0;
		time = initialTime;
		score = 0;
		qCount = 0;
		onlyDisplaySection("#highScores");
		recordsHtmlReset();
	});

});