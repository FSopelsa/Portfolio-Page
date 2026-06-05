<template>
    <div>
        <h1>Welcome to the Quiz Game</h1><br>
        <div>
            <button @click="fetchNewQuiz" id="quizbutton">
                <router-link to="/quiz">Start a new Quiz</router-link>
            </button>
        </div>
        
    </div>
</template>

<script>
export default {
    name: 'HomePage',
    data() {
        return {
            // data for Home component
        };
    },
    methods: {
        // methods for Home component
    },
};
</script>

<style scoped>
/* CSS for Home component */
</style>