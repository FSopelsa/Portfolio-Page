Main = {
    init: function() {
    
        document.getElementById("icon-dice").addEventListener("click", function () {
         new DiceApp()});
        document.getElementById("icon-clock").addEventListener("click", function () {
         new Clock()});

    }
}

window.addEventListener("load", Main.init);