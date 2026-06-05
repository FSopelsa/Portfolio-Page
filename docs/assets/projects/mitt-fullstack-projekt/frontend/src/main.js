import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/global.css' // Import global styles

createApp(App).use(router).mount('#app')