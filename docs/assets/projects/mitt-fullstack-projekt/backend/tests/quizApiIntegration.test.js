import request from 'supertest';
import { app, startServer } from '../index.js';
import { Quiz } from '../models/quizModel.js';
import { fetchQuestionsFromQuizApi } from '../integrations/quizApiIntegration.js';
import fs from 'fs';
import { expect } from '@jest/globals';

describe('Quiz API Integration', () => {
        let serverInstance;
        beforeAll(() => {
            serverInstance = startServer(process.env.TESTPORT2); // 5000
        });
        afterAll(done => {
            serverInstance.close(done);
        });

    it('should fetch data from Quiz API and save it to the database', async () => {
        // Fetch data from Quiz API
        let data = await fetchQuestionsFromQuizApi();

        // Transform the tags field from an array of objects to an array of strings
        data.questions.forEach(question => {
                question.tags = question.tags.map(tag => tag.name);
        });

        // Send a POST request to your app with the fetched data
        const response = await request(app)
            .post('/quizzes')
            .send([data]);

        // Save the response to a file for testing
        await new Promise((resolve, reject) => {
                fs.writeFile('response.json', JSON.stringify(response, null, 2), (err) => {
                if (err) reject(err);
                console.log('The file has been saved!');
                resolve();
                });
        });

        // Check that the response status is 200
        expect(response.status).toBe(200);

        // Check that the data was saved to the database
        const savedQuiz = await Quiz.findOne({ _id: response.body[0]._id });
        expect(savedQuiz).toBeTruthy();
        expect(JSON.stringify(savedQuiz.questions.id)).toEqual(JSON.stringify(data.questions.id));
    });
});