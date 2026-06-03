// Applikationen byggs upp genom att hämta/skapa de tilltänkta elementen med ".getElementById" och ".createElement()".
// Genom att referera till elementens ID får de automatiskt egenskaper från färdiga CSS-dokument.
// Nya element som skapas kopplas ihop med förälder-element genom ".appenChild", och görs därmed även synliga.

function DiceApp() {
    var contentWrapper = document.getElementById('page-content-wrapper');
    this.pointCounter = 0;
    this.dieValues = [];
    this.audio = new Audio('src/wav/add.wav');
    // ______________________________________________________________________________,
  //        Applikationens fönster.
  
    this.window = document.createElement('div');
    this.window.className = 'dice-window-wrapper';
    contentWrapper.appendChild(this.window);

    var windows = [];
    windows.push(this.window);  // Pushar till lista för dragnDrop-funktion senare
    // ______________________________________________________________________________,
  //        Fönstrets meny (stäng-knapp).
  
    this.diceMenubarWrapper = document.createElement('div');
    this.diceMenubarWrapper.className = 'dice-menubar-wrapper';
    this.window.appendChild(this.diceMenubarWrapper);

    var diceMenubarWrapper = [];                                   
    diceMenubarWrapper.push(this.diceMenubarWrapper);    // Pushar till lista för dragnDrop-funktion senare
  
    this.close = document.createElement('div');
    this.close.className = 'close';
    this.diceMenubarWrapper.appendChild(this.close);
    var self = this;
    this.close.addEventListener("click", function() {
        console.log("close");
        self.window.remove();
    });
    // ______________________________________________________________________________,
  //        Fönstrets knappar med händelselyssnare, samt poängräknare.
  
    this.toolbarWrapper = document.createElement('div');
    this.toolbarWrapper.className = 'dice-toolbar-wrapper';
    this.window.appendChild(this.toolbarWrapper);
    this.ul = document.createElement('ul');
    this.toolbarWrapper.appendChild(this.ul);
  
  /*add*/ 
    this.add = document.createElement('li');
    this.add.className = 'add';
    this.ul.appendChild(this.add);
    this.add.addEventListener("click", function() {
        console.log("add");
        self.audio.play();
        self.die = new Die();
        self.dieArray = [];
        self.dieArray.push(self.die);

        self.diceUl.appendChild(self.die.dieElem);

        for (let i = 0; i < self.dieArray.length; i++) {
          self.dieArray[i].dieElem.addEventListener("click", function() {
            self.pointCounter -= self.dieValues.splice(-1, 1);
            self.die = self.die.reRollDie();
            self.pointCounter += self.die.dieNumValue;
            self.dieValues.push(self.die.dieNumValue);
            self.countPoints();
          });}

        self.pointCounter += self.die.dieNumValue;
        self.dieValues.push(self.die.dieNumValue);
        self.countPoints();


    });
  
  /*remove*/
    this.remove = document.createElement('li');
    this.remove.className = 'remove';
    this.ul.appendChild(this.remove);
    this.remove.addEventListener("click", function() {
        console.log("remove");
        self.audio.play();
        self.pointCounter -= self.dieValues.splice(-1, 1);
        self.diceUl.removeChild(self.diceUl.lastChild);
        self.countPoints();
    });
  
  /*rollAll*/ 
    this.roll = document.createElement('li');
    this.roll.className = 'roll';
    this.ul.appendChild(this.roll);
    this.roll.addEventListener("click", function() {
        console.log("roll");
        self.audio.play();
        self.pointCounter = 0;
        for (var i = 0; i < self.dieValues.length; i++) {
          this.newValue  = Math.floor(Math.random() * 6) + 1;
          self.diceUl.children[i].className = "dice dice-side-" + self.spellDigits(this.newValue.toString());
            self.pointCounter += this.newValue;
        }
        self.countPoints();
    });
  
    this.li = document.createElement('li');
    this.ul.appendChild(this.li);
  
    this.counter = document.createElement('ul');
    this.counter.className = 'dice-toolbar-counter-wrapper';
    this.li.appendChild(this.counter);
    this.digi1 = document.createElement('li');
    this.digi2 = document.createElement('li');
    this.digi3 = document.createElement('li');
    this.digi4 = document.createElement('li');
    this.digi5 = document.createElement('li');
    this.counter.appendChild(this.digi1);
    this.counter.appendChild(this.digi2);
    this.counter.appendChild(this.digi3);
    this.counter.appendChild(this.digi4);
    this.counter.appendChild(this.digi5);

//_______________________________________________________________________________,
  //        -Område där tärningar visas.
  
    this.diceContentWrapper = document.createElement('div');
    this.diceContentWrapper.className = 'dice-content-wrapper';
    this.window.appendChild(this.diceContentWrapper);
    this.diceUl = document.createElement('ul');
    this.diceUl.className = 'dice-ul';
    this.diceContentWrapper.appendChild(this.diceUl);
  
//________________________________________________________________________________,
  //        -Drag-drop-funktionalitet.

  console.log(windows, "windows");
    var drag = new DragnDrop();
    for (var i = 0; i < windows.length; i++) {
        drag.add(windows[i], diceMenubarWrapper[i]);
    }
  
  //________________________________________________________________________________,
  //        -Flyttat från egen fil där funktionen inte uppfyllde OOP.
  //  Fungerar här istället som metod till DiceApp då det blev den simplaste lösningen.

  this.spellDigits = function(digit) {
    switch (digit) {
        case "0":
          return("zero");
        case "1":
            return("one");
        case "2":
            return("two");
        case "3":
            return("three");
        case "4":
            return("four");
        case "5":
            return("five");
        case "6":
            return("six");
        case "7":
            return("seven");
        case "8":
            return("eight");
        case "9":
            return("nine");
    }
}

  // ________________________________________________________________________________,
  //        -Funktion som räknar ut poäng.
  //   Det sammanlagda värdet av framtagna tärningar har sparats i variablen pointCounter.
  //   Värdet görs nu om till en sträng, som sedan delas upp mellan varje siffra och sparas i array (splitStr).
  //   for-loopen går igenom splitStr och sparar en sträng-motsvarighet till varje insättning i en ny array (lValue).
  //   Beroende på lValues längd läggs varje insättning in som ny class i motsvarande poäng-räknar-element,
  //   vilket ändrar vilken siffra som visas med hjälp av CSS.
  
    this.countPoints = function() {
        var str = this.pointCounter.toString();
        this.splitStr = str.split('');
        this.lValues = [];
        for (var i = 0; i < this.splitStr.length; i++) {
          switch (this.splitStr[i]) {
              case "0":
                this.lValues.push("zero");
                break;
              case "1":
                this.lValues.push("one");
                break;
              case "2":
                this.lValues.push("two");
                break;
              case "3":
                this.lValues.push("three");
                break;
              case "4":
                this.lValues.push("four");
                break;
              case "5":
                this.lValues.push("five");
                break;
              case "6":
                this.lValues.push("six");
                break;
              case "7":
                this.lValues.push("seven");
                break;
              case "8":
                this.lValues.push("eight");
                break;
              case "9":
                this.lValues.push("nine");
                break;
            }         //Hämta istället detta genom SpellDigits, precis som i clock 
        }             //-för att slippa omvandla igen

            if (this.lValues.length == 5) {
              this.digi1.className = this.lValues[0];
              this.digi2.className = this.lValues[1];
              this.digi3.className = this.lValues[2];
              this.digi4.className = this.lValues[3];
              this.digi5.className = this.lValues[4];
            }
            if (this.lValues.length == 4) {
              this.digi1.className = "zero";
              this.digi2.className = this.lValues[0];
              this.digi3.className = this.lValues[1];
              this.digi4.className = this.lValues[2];
              this.digi5.className = this.lValues[3];
            }
            if (this.lValues.length == 3) {
              this.digi1.className = "zero";
              this.digi2.className = "zero";
              this.digi3.className = this.lValues[0];
              this.digi4.className = this.lValues[1];
              this.digi5.className = this.lValues[2];
            }
            if (this.lValues.length == 2) {
              this.digi1.className = "zero";
              this.digi2.className = "zero";
              this.digi3.className = "zero";
              this.digi4.className = this.lValues[0];
              this.digi5.className = this.lValues[1];
            }
            if (this.lValues.length == 1) {   
              this.digi1.className = "zero";
              this.digi2.className = "zero";
              this.digi3.className = "zero";
              this.digi4.className = "zero";
              this.digi5.className = this.lValues[0];
            }
    }
  }
  
  