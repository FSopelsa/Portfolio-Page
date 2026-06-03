//        - Tärningsklass._
//   Tärningarna ges ett 'li'-element som appendas till rätt 'ul'-element i html-strukturen.
//   Ett tal mellan 1-6 slumpas fram, sparas i egenskapen dieNumValue och skickas till SpellDigits där det
//   beroende på värde genererar en sträng-motsvarighet, som sätts som ändelse i
//   dieElem's klassnamn. Därmed styr sedan CSS-koden vilken tärningssida som visas då tärningen syns.

function Die() {
    this.dieElem = document.createElement('li');
    this.dieNumValue = Math.floor(Math.random() * 6) + 1;
    this.dieElem.className = "dice dice-side-" + SpellDigits(this.dieNumValue.toString());
    //this.dieElem.addEventListener("click", this.reRollDie(self));
}    

    Die.prototype.reRollDie = function() {
        console.log("this", this);
        this.dieNumValue = Math.floor(Math.random() * 6) + 1;
        this.dieElem.className = "dice dice-side-" + SpellDigits(this.dieNumValue.toString());
        return (this);
    }