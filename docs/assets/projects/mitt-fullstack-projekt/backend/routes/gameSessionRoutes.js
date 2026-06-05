import express from 'express';
import GameSession from '../models/gameSessionModel.js';

const router = express.Router();

//\_________________________________________________________________
// "router.post('/')" creates a new game session.
// It extracts sessionId and questions from the request body, creates a new 
// GameSession instance with these values, and saves it to the database.
router.post('/', async (req, res) => {
  try {
    const { sessionId, questions } = req.body;
    const gameSession = new GameSession({ sessionId, questions });
    const newGameSession = await gameSession.save();
    console.log('New game session created:', newGameSession); 
    res.status(201).json(newGameSession);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//\_________________________________________________________________
// "router.get('/')" is used to fetch all game sessions.
// It finds all instances of GameSession in the database and sends them back in the response.
router.get('/', async (req, res) => {
  try {
    const gameSessions = await GameSession.find();
    res.json(gameSessions);
    console.log('GET /api/gameSessions', gameSessions); 
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//\_________________________________________________________________
// "router.get('/:sessionId')" is used to fetch a specific game session by its sessionId.
// It uses the findOne method to find the game session and populate method to populate the questions field.
router.get('/:sessionId', async (req, res) => {
  try {
    const session = await GameSession.findOne({ sessionId: req.params.sessionId }).populate('questions');
    if (!session) {
      return res.status(404).send('Spelomgången hittades inte.');
    }
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//\_________________________________________________________________
// "router.post('/:sessionId/results')" saves the results for a specific game session.
// It extracts participantName, score, and answers from the request body and uses participantName as the participant identifier.
// It then finds the game session by sessionId and checks if the participant has already participated.
// If the participant has already participated, it responds with a 400 status code and a message.
// If not, it adds the participant's results to the game session and saves it.
router.post('/:sessionId/results', async (req, res) => {
  const { participantName, score, answers } = req.body;
  const participantIdentifier = participantName; // Use participantName as the participant identifier
  try {
    const session = await GameSession.findOne({ sessionId: req.params.sessionId });

    if (!session) {
      return res.status(404).send('Spelomgången hittades inte.');
    }
    // Check if the participant has already participated
    const hasAlreadyParticipated = session.results.some(result => result.participant === participantIdentifier);
    if (hasAlreadyParticipated) {
      return res.status(400).send('Deltagaren har redan spelat denna omgång.');
    }
    // Add the participant's results to the game session and save it
    session.results.push({ participant: participantIdentifier, score, answers });
    await session.save();

    console.log('Result saved for game session:', session); 
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;