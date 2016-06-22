/*!
{
  "name": "num-event-listeners",
  "property": "event",
  "tags": ["storage"],
  "authors": ["Chethan"]
}
!*/
/* DOC
calculates the number of event listeners the device supports*/
define(['Modernizr', 'addTest', 'test/num-event-listener'], function(Modernizr, addTest) {
    var eventCount = 0;
    var eventArray = [];
    var functionArray = [];
    var maxEventListener = 10;
    var i, ret, myevent;

    //create a custom event to test number of listeners supported
    myevent = document.createEvent('Event');
    myevent.initEvent('testEvent', true, true);

    //create multiple reference to same fucntion to help remove it
    for (i = 0; i < maxEventListener; i++) {
        (function(i) {
            functionArray.push(function() {
                eventArray[i] = 1;
                eventCount++;
                document.body.innerHTML += i;
            });
        })(i);
    }
    for (i = 0; i < maxEventListener; i++) {
        eventArray.push(0);
        ret = document.addEventListener('testEvent', functionArray[i], false);
    }

    //trigger the event after sometime once the event listeners are created
    setTimeout(function() {
        document.dispatchEvent(myevent);
    }, 500);

    //count the number of event triggered due to the event
    setTimeout(function() {
        var count = 0, temp;
        for (temp = 0; temp < maxEventListener; temp++) {
            count = count + eventArray[i];
        }
        addTest('numeventlisteners', count);
    }, 1000);
    //remove all the event listeners after 5 sec
    setTimeout(function() {
        for (i = 0; i < maxEventListener; i++) {
            document.body.innerHTML += 'R';
            try {
                document.removeEventListener('testEvent', functionArray[i], false);
            }
            catch (e) {
                document.body.innerHTML += e;
            }

        }
    }, 5000);
});
