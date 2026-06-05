import express from 'express'; 
import mongoose from 'mongoose';
import dotenv from 'dotenv'; 
import quizRoutes from './routes/quizRoutes.js'; 
import gameSessionRoutes from './routes/gameSessionRoutes.js'; 
import session from 'express-session'; 
import MongoStore from 'connect-mongo'; 
import cors from 'cors'; 
import { TdbQuiz } from './models/quizModel.js';
import {OAuth2Client } from 'google-auth-library';


dotenv.config(); 

// Connecting to MongoDB
mongoose.connect(process.env.MONGODB_URI) 
  .then(() => console.log('Connected to MongoDB...')) 
  .catch(err => console.error('Could not connect to MongoDB...', err));

const app = express();
const client = new OAuth2Client(process.env.CLIENT_ID);

app.use(express.static('../frontend/dist')); // Serving static files from the 'public' directory
app.use(cors());
app.use(express.json());// Parsing JSON request bodies
app.use('/quizzes', quizRoutes);
app.use('/api/gameSessions', gameSessionRoutes);

// Configuration for express-session
app.use(session({
    secret: process.env.MONGODB_SECRET, // Secret key for signing the session ID cookie
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }), // Using MongoDB as the session store
    cookie: { secure: 'auto', maxAge: 1000 * 60 * 60 * 24 } // Example cookie configuration
}));

// Handling the root route
app.get('/', (req, res) => {
    res.status(200).send('Server is running'); // Sending a response with the message 'Server is running' for the root route
});

// Handling the '/quizzes' route
app.get('/quizzes', (req, res) => {
    res.status(200).json({ message: 'Quizzes fetched successfully' }); // Sending a JSON response with the message 'Quizzes fetched successfully' for the '/quizzes' route
    console.log('Quizzes fetched successfully'); 
});

app.get('/quizzes/:gameCode', async (req, res) => {
  try {
    const quiz = await TdbQuiz.findOne({ gameCode: req.params.gameCode });
    if (!quiz) {
      return res.status(404).send('Quiz not found');
    }
    res.send(quiz);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

app.put('/quizzes/:gameCode', async (req, res) => {
  try {
    const quiz = await TdbQuiz.findOne({ gameCode: req.params.gameCode });
    if (!quiz) {
      return res.status(404).send('Quiz not found');
    }
     // Create a new score object
     const newScore = {
      name: req.body.name,
      userId: req.body.googleId,
      score: req.body.score
    };
    // Add the new score to the highScores array
    quiz.highScores.push(newScore);
    
    // Sort the highScores array in descending order
    quiz.highScores.sort((a, b) => b.score - a.score);

    // If there are more than 10 scores, remove the ones beyond the 10th position
    if (quiz.highScores.length > 10) {
      quiz.highScores = quiz.highScores.slice(0, 10);
    }

    await quiz.save();

    res.send(quiz);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

app.post('/login', (req, res) => {
  const token = req.body.token;
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    return payload;
  }

  verify().then(data=> res.send(data)).catch(console.error); 

});

let mainServerInstance;

// Starting the server on the specified port
const startServer = (port) => {
    if (!mainServerInstance) {
      let server = app.listen(port, () => {
        console.log(`Server is running on port ${port}...`); 
      });
      return server;
    } else {
      console.log(`Server is already running on port ${port}...`); 
      return mainServerInstance;
    }
};

mainServerInstance = startServer(process.env.PORT); 

export { app, startServer };
