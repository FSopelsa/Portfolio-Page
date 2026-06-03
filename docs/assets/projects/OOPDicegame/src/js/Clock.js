function Clock() {
    this.createClockWindow();
    this.updateTime();
    setInterval(function() { this.updateTime(); }.bind(this), 1000); // Bind 'this' till Clock-instance
}

// ______________________________________________________________________________,
  //        Applikationens fönster.

Clock.prototype.createClockWindow = function() {
    // Skapa Clock window och dess element
    this.clockWindow = document.createElement('div');
    this.clockWindow.className = 'clock-window-wrapper';

    var menubar = document.createElement('div');
    menubar.className = 'clock-menubar-wrapper';

    var closeButton = document.createElement('button');
    closeButton.className = 'close';
    closeButton.addEventListener('click', this.closeClock.bind(this));
    menubar.appendChild(closeButton);

    var content = document.createElement('div');    
    content.className = 'clock-content-wrapper';

    // Skapa digit wrappers för timmar, minuter, och sekunder
    this.hoursElem = this.createDigitWrapper('hour');
    this.minutesElem = this.createDigitWrapper('minute');
    this.secondsElem = this.createDigitWrapper('second');

    content.appendChild(this.hoursElem);
    content.appendChild(this.minutesElem);
    content.appendChild(this.secondsElem);

    this.clockWindow.appendChild(menubar);
    this.clockWindow.appendChild(content);
    document.body.appendChild(this.clockWindow);

    var drag = new DragnDrop();
    drag.add(this.clockWindow, menubar)
};

// ______________________________________________________________________________,
  //        Wrapper för klockans siffror

Clock.prototype.createDigitWrapper = function(timePart) {
  
    var wrapper = document.createElement('ul');
    wrapper.className = 'clock-digit-wrapper ' + timePart;
    console.log(wrapper.className);
    for (var i = 0; i < 2; i++) { // Två siffror för varje del av tiden (H,M,S) 
        var li = document.createElement('li');
        wrapper.appendChild(li);
    }
    return wrapper;
};

// ______________________________________________________________________________,
  //        Funktion som uppdaterar klockan

Clock.prototype.updateTime = function() {
    var now = new Date();
    this.setDigits(this.hoursElem, now.getHours());
    this.setDigits(this.minutesElem, now.getMinutes());
    this.setDigits(this.secondsElem, now.getSeconds());
};

// ______________________________________________________________________________,
  //        Funktion som sätter klockans siffor då den uppdateras

Clock.prototype.setDigits = function(wrapper, value) {
    if (value < 10) { 
        value = '0' + value.toString();
    } else {
        value = value.toString();
    }
    var digits = value.split('');
    var lis = wrapper.getElementsByTagName('li');
    for (var i = 0; i < digits.length; i++) {
      lis[i].className = 'clock-digit-' + SpellDigits(digits[i]);
    }
};

// ______________________________________________________________________________,
  //       Stäng-knappens funktionalitet

Clock.prototype.closeClock = function() {
    this.clockWindow.remove();
};