import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Fetch questions from "Quiz API"
export const fetchQuestionsFromQuizApi = async () => {
  try {
    // Make a GET request to the Quiz API
    const response = await axios.get("https://quizapi.io/api/v1/questions", {
      params: {
        apiKey: process.env.QUIZ_API_KEY,
        tags: 'JavaScript',
        difficulty: 'easy',
        limit: '2'
      },

    }).finally(() => axios.defaults.httpAgent.destroy());

    // Transform the data to match Quiz schema
    const data = {
      questions: response.data.map(question => ({
        ...question,
        tags: question.tags.map(tag => tag.name),
      })),
    };
    console.log('response:', response.data);
    return data;

  } catch (error) {
    console.error('Error fetching questions from QuizAPI:', error);
    throw error;
  }
};

// Fetch questions from Quiz TDB (The Open Trivia Database)
export const fetchQuestionsFromQuizTDB = async () => {
  try {
    // Make a GET request to the Open Trivia Database API
    const TDBresponse = await axios.get("https://opentdb.com/api.php?amount=10");

    // Transform the data to match Quiz schema
    const data = {
      questions: TDBresponse.data.results.map(question => ({
        ...question,
        // Add any necessary transformations here
      })),
    };
    //console.log('data:', data);
    return data;

  } catch (error) {
    console.error('Error fetching questions from QuizAPI:', error);
    throw error;
  }
};
