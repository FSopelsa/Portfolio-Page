import mongoose from 'mongoose';

// Define the game session schema
const gameSessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true }, // Unique identifier for the game session
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }], // Array of question references
  participants: [{ type: mongoose.Schema.Types.Mixed }], // Array of participants (mixed data type)
  results: [{ 
    participant: mongoose.Schema.Types.Mixed, // Participant information (mixed data type)
    score: Number, // Score achieved by the participant
    answers: [mongoose.Schema.Types.Mixed] // Array of participant's answers (mixed data type)
  }],
  createdAt: { type: Date, default: Date.now } // Timestamp for when the game session was created
});

export default mongoose.model('GameSession', gameSessionSchema);
