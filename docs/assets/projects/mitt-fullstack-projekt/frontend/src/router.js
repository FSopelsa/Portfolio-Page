import { createRouter, createWebHistory } from 'vue-router'
import QuizPage from './components/QuizPage.vue'
import ResultsPage from './components/ResultsPage.vue'

const routes = [
  { path: '/', component: QuizPage },
  { path: '/quiz', component: QuizPage },
  { path: '/results', component: ResultsPage }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router