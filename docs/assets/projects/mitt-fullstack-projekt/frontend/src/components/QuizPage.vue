<template>
  <body>
    <div id="g_id_onload"
        data-client_id="687502014639-9smnn3le2jb20v74a0ev89p7cirn32o8.apps.googleusercontent.com"
        data-context="signin"
        data-ux_mode="popup"
        data-callback="onSignIn"
        data-auto_prompt="false">
    </div>
    <div class="g_id_signin"
        data-type="standard"
        data-shape="rectangular"
        data-theme="outline"
        data-text="signin_with"
        data-size="large"
        data-logo_alignment="left">
    </div>
    <div v-if="loggedInUser.name" style="position: absolute; top: 10; left: 10;">
      <img :src="loggedInUser.picture" alt="User Profile Image">
      <p id="userNamePElem"> Inloggad som: {{ loggedInUser.name }}</p>
    </div>
    <h1>Felix Quiz Game</h1><br>
    <button @click="fetchNewQuiz" id="quizbutton">JavaScript Quiz</button> 
    <button @click="fetchNewTDB" id="TDBbutton">Start a new Quiz</button>
    <div class="input-container" v-if="!gameCodeSubmitted">
      <input type="text" id="gameCode" v-model="gameCode" placeholder="Enter code for a specific quiz">
      <button @click="fetchQuizFromDatabase" class="special-button">Go</button>
    </div>
      <div id="quizArea" ref="quizArea" v-if="showQuizArea">
        <div v-if="generatedGameCode">
          <h2>Quiz code: <br> {{ generatedGameCode }}</h2>
        </div>
         <!-- Current question number and question are displayed -->
        <div v-if="questions.length > 0">
          <h2>Question {{ currentQuestionIndex + 1 }}: {{ decodeHtml(questions[currentQuestionIndex].question) }}</h2>
          <!-- Display the answer options -->
          <div id="alternatives" v-for="(answer, answerIndex) in questions[currentQuestionIndex].answers" :key="`${currentQuestionIndex}-${answerIndex}`">
            <div v-if="answer !== null">  
              <label class="checkbox-label">
                <input id="checkBox" type="radio" :name="'question-' + currentQuestionIndex" :value="answer" @change="selectAnswer($event, answerIndex)">
                <span class="checkbox-custom"></span>
                {{ decodeHtml(answer) }}
              </label>
            </div>
          </div>
          <!-- Button to move to the next question -->
          <button id="nextButton" @click="nextQuestion">Next</button>
        </div>
        <p id="scoreElem">Points: {{ score }}</p>
      </div>
      <div id="highscoreBoard" v-if="showHighscore">
        <h2>High Scores</h2>
        <table>
          <tr>
            <th>Name</th>
            <th>Score</th>
          </tr>
          <tr v-for="highScore in quiz.highScores" :key="highScore.userId">
            <td>{{ highScore.name }}</td>
            <td>{{ highScore.score }}</td>
          </tr>
        </table>
      </div>
      
  </body>
</template>

<script>
export default {
  name: 'QuizPage',
  data() {
    return {
      loggedInUser: {   // Variable to store the logged in user
        name: '',
        picture: '',
        email: '',
        id_token: '',
        googleId: ''
      }, 
      generatedGameCode: '', // Variable to store the generated game code
      gameCodeSubmitted: false, // Variable to track if a game code has been submitted
      showQuizArea: false, // Boolean to show/hide the quiz area
      showHighscore: false, // Boolean to show/hide the highscore area
      gameCode: '', // Variable to store a quiz's game code
      quiz:{
        highScores: [], // Array to store the high scores for the quiz
      },
      questions: [], // Array to store the quiz questions
      userAnswers: null, // Array to store the user's selected answers
      score: 0, // Variable to store the user's score
      currentQuestionIndex: 0, // Index of the current question being displayed
    };
  },
  methods: {
    onSignIn(googleUser) {
      var id_token = googleUser.credential;
      fetch('http://localhost:4000/login', {                    
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: id_token })
      })
      .then(response => response.json())
      .then(data => {
        this.loggedInUser.name = data.name;
        this.loggedInUser.googleId = data.sub;
        this.loggedInUser.email = data.email;
        this.loggedInUser.id_token = id_token;
        if (data.picture) 
          this.loggedInUser.picture = data.picture;
         // After a successful login, hide the button
        document.getElementById('g_id_onload').style.display = 'none';
        document.querySelector('.g_id_signin').style.display = 'none';
        console.log("this.loggedInUsere= ",this.loggedInUser.googleId);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    },
    onFailure(error) {
      console.log(error);
    },
    async fetchQuizFromDatabase() {
      try {
        const response = await fetch(`http://localhost:4000/quizzes/${this.gameCode}`); // Replace with your actual endpoint
        if (!response.ok) {
          throw new Error('An error occurred while fetching the quiz.');
        }
        const DBquiz = await response.json();
        console.log("quiz= ",DBquiz);
        this.questions = DBquiz.questions.map(question => {
          // Create an array of answers and shuffle it
          let answers = [question.correct_answer, ...question.incorrect_answers];
          answers = this.shuffle(answers); 
          return {
            ...question,
            answers: answers,
            correct_answers: [question.correct_answer]
          };  
        });
        this.userAnswers = this.questions.map(() => []);
        this.currentQuestionIndex = 0;
        this.showQuizArea = true;
        this.generatedGameCode = DBquiz.gameCode;
        this.gameCodeSubmitted = true; // Set gameCodeSubmitted to true when a game code is submitted
        this.quiz.highScores = DBquiz.highScores;
        console.log("this.quiz.highScores= ",this.quiz.highScores);
      } catch (error) {
        console.error('Error:', error);
      }
    },
    // Function to fetch a new quiz from the backend
    /*async fetchNewQuiz() {
      try {
        const response = await fetch('http://localhost:4000/quizzes/fetch-quiz');
        if (!response.ok) {
          throw new Error('An error occurred while fetching quiz data.');
        }
        const data = await response.json();
        // Convert answers object to array
        for (let i = 0; i < data.questions.length; i++) {
          data.questions[i].answers = Object.values(data.questions[i].answers);
          // Convert correct_answers object to array
          data.questions[i].correct_answers = Object.entries(data.questions[i].correct_answers)
      .filter(([ value]) => value === 'true')
      .map(() => {});
        }
        this.showQuizArea = true; // Show the quiz area
        this.questions = data.questions;
        this.userAnswers = this.questions.map(() => []);
        this.currentQuestionIndex = 0; // Reset to the first question
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    },*/
    // Function to fetch a new TDB quiz from the backend
    async fetchNewTDB() {
      console.log("loggedInUser=", this.loggedInUser);
      try {
        const TDBresponse = await fetch('http://localhost:4000/quizzes/fetch-quizTDB');
        if (!TDBresponse.ok) {
          throw new Error('An error occurred while fetching quiz data.');
        }
        const TDBdata = await TDBresponse.json();
        this.quiz = TDBdata;
        console.log("this.quiz= ",this.quiz);
        this.currentQuestionIndex = 0;
        this.showQuizArea = true; // Show the quiz area
        this.questions = TDBdata.questions.map(question => { 
          // Create an array of answers and shuffle it
          let answers = [question.correct_answer, ...question.incorrect_answers];
          answers = this.shuffle(answers); 
          return {
            question: this.decodeHtml(question.question),
            answers: answers,
            correct_answers: [question.correct_answer]
          };
        });
        this.userAnswers = this.questions.map(() => []); 
        this.generatedGameCode = TDBdata.gameCode;
        this.gameCode = TDBdata.gameCode;
      } catch (error) {
        console.error(error);
      }
    },

    selectAnswer(event, answerIndex) {
      // Clear all answers for the current question
      this.userAnswers[this.currentQuestionIndex] = [];
      // If the radio button is checked, add the answer to the userAnswers array
      if (event.target.checked) {
        this.userAnswers[this.currentQuestionIndex][answerIndex] = this.questions[this.currentQuestionIndex].answers[answerIndex];
      }
    },
    // Function to decode HTML entities
    decodeHtml(html) {
      var txt = document.createElement("textarea");
      txt.innerHTML = html;
      return txt.value;
    },
    // Shuffle function
    shuffle(array) {
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
    },
    // Helper function to compare arrays
    arraysEqual(a, b) {
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
      }
      return true;
    },
    nextQuestion() {
      // Check if the user's answers are correct
      const currentQuestion = this.questions[this.currentQuestionIndex];
      if ('correct_answers' in currentQuestion) {
        // Compare the user's answer with the correct answer
        if (currentQuestion.correct_answers.some(answer => this.userAnswers[this.currentQuestionIndex].includes(answer))) {
          this.score++;
        }
      }
      // Clear the user's answers for the current question
      let newUserAnswers = [...this.userAnswers];
      newUserAnswers[this.currentQuestionIndex] = [];
      this.userAnswers = newUserAnswers;
      // Move to the next question
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++;
      } else {
        // If it was the last question, hide the quiz area and show highscore
        this.showQuizArea = false;
        this.endQuiz();
        
      }
    },
    endQuiz() {
      this.updateHighScore();
      this.showHighscore = true;
      this.score = 0; // Reset the score
    },
    // Function to update the high score                                   -
    updateHighScore() {
        fetch(`http://localhost:4000/quizzes/${this.gameCode}`, { 
          method: 'PUT',
          headers: {
        'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            score: this.score,
            googleId: this.loggedInUser.googleId,
            name: this.loggedInUser.name
          })
        })
        .then(response => {
          if (!response.ok) {
        throw new Error('An error occurred while saving the quiz.');
          }
          console.log('Quiz saved successfully.');
        })
        .catch(error => {
          console.error('Error saving quiz:', error);
        });
    },    
},
  mounted() {
    window.onSignIn = this.onSignIn;
  },
};
</script>

<style>
.input-container {
  justify-content: center;
  align-items: center;
}

#gameCode {
  margin-bottom: 20px;
  padding: 15px;
  border: 2px solid black;
  border-radius: 10px;
  background-color: #f2f2f2;
  opacity: 0.9;
  width: 15%;
  justify-content: center;
  align-items: center;
}
.special-button {
  background-color: rgb(42, 16, 190);
  color: white;
  justify-content: center;
  align-items: center;
  border-radius: 30%;
  width: 50px;
  height: 50px;
}
#quizArea {
  margin-top: 20px;
  margin-bottom: 20px;
  padding: 20px;
  border: 2px solid black;
  border-radius: 10px;
  background-color: #f2f2f2;
  opacity: 0.9;
  min-width: 40%;
  max-width: 50%;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}
#scoreElem {
  margin-top: 20px;
  font-size: 25px;
}
#userNamePElem {
  font-size: 26px;
  color: white
}
#highscoreBoard {
  margin-top: 20px;
  padding: 20px;
  border: 2px solid black;
  border-radius: 10px;  
  background-color: #f2f2f2;
  opacity: 0.9;
  min-width: 10%;
  max-width: 25%;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
#highscoreBoard tr {
  width: 100%;
  padding: 10px;
}
#highscoreBoard tr td {
  width: 100%;
  padding: 10px;
}
</style>