import { createApp } from 'vue';
import { shallowMount } from '@vue/test-utils';
import QuizPage from '@/components/QuizPage.vue';

let wrapper;

beforeEach(() => {
  const app = createApp();
  wrapper = shallowMount(QuizPage, {
    global: {
      plugins: [app]
    }
  });
});

describe('QuizPage.vue', () => {
  it('renders correctly', () => {
    const wrapper = shallowMount(QuizPage);
    expect(wrapper.element).toMatchSnapshot();
  });

  it('nextQuestion method works correctly', async () => {
    const wrapper = shallowMount(QuizPage, {
      data() {
        return {
          currentQuestionIndex: 0,
          questions: [
            { question: 'Question 1', answers: ['Answer 1', 'Answer 2'], correct_answers: ['Answer 1'] },
            { question: 'Question 2', answers: ['Answer 3', 'Answer 4'], correct_answers: ['Answer 4'] },
          ],
          userAnswers: [[], []],
          score: 0,
          showQuizArea: true,
        };
      },
    });

    // Select the correct answer for the first question
    wrapper.vm.userAnswers[0] = ['Answer 1'];

    // Call the nextQuestion method
    await wrapper.vm.nextQuestion();

    // Check if the currentQuestionIndex was incremented
    expect(wrapper.vm.currentQuestionIndex).toBe(1);

    // Check if the score was incremented
    expect(wrapper.vm.score).toBe(1);

    // Check if the user's answers for the first question were cleared
    expect(wrapper.vm.userAnswers[0]).toEqual([]);
  });
});



/*This test file contains two tests. The first test checks if the 
QuizPage component renders correctly by taking a snapshot of the 
rendered component and comparing it with a previously saved snapshot. 
The second test checks if the nextQuestion method works correctly by simulating
a user answering a question and then calling the nextQuestion method.*/