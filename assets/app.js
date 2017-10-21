function thisMoment() {
  var currentDate = moment().format('MMMM Do YYYY, h:mm:ss a');
  $("#dateTime").append('<p>' + currentDate + '</p>');
  }
  thisMoment();

// Initialize Firebase
var config = {
	apiKey: "AIzaSyB8g0XHryb23475ciGra1XBQqn4kuGAKKQ",
	authDomain: "train-scheduler-ea4d8.firebaseapp.com",
	databaseURL: "https://train-scheduler-ea4d8.firebaseio.com",
	projectId: "train-scheduler-ea4d8",
	storageBucket: "train-scheduler-ea4d8.appspot.com",
	messagingSenderId: "1068732262085"
};
firebase.initializeApp(config);

  var database = firebase.database();

  var dataRef = firebase.database();

    // Original Values
    var name = "";
    var destination = "";
    var trainTime = "";
    var frequency = "";
    var nextTrainArrival = "";
    var minutesAway = "";

    // Capture Click Event
    $("#click-button").on("click", function(event) {
      event.preventDefault();

      // Grab values
      name = $("#name-input").val().trim();
      destination = $("#destination-input").val().trim();
      trainTime = $("#time-input").val().trim();
      frequency = $("#freq-input").val().trim();
      var nextTrain = myFunction(trainTime, frequency);
      nextTrainArrival = nextTrain;
      minutesAway = minutesAway;
      console.log("next train arrival " + nextTrainArrival);
      $("input[type='text']").val("");
      $("input[type='number']").val("");
      $("input[data-date-format='HH:mm']").val("");



      // Push event
      database.ref().push({
        name: name,
        destination: destination,
        frequency: frequency,
        trainTime: trainTime,
        nextTrainArrival: nextTrain,
        minutesAway: minutesAway,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
      });

    });


    function myFunction(tt, fr){

      var firstTimeConverted = moment(tt, "hh:mm").subtract(1, "years");
      console.log(firstTimeConverted);

      // Current time
      var currentTime = moment();
      console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

      // Time difference
      var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
      console.log("DIFFERENCE IN TIME: " + diffTime);

      // Remainder
      var tRemainder = diffTime % fr;
      console.log(tRemainder);

      // Time until next train
      var tMinutesTillTrain = fr - tRemainder;
      console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
      minutesAway = tMinutesTillTrain;

      // Next train
      var nextTrain = moment().add(tMinutesTillTrain, "minutes");
      console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

      return (moment(nextTrain).format("hh:mm"));

    }

    myFunction();

      dataRef.ref().on("child_added", function(childSnapshot) {

      $("#trainSchedule").append("<tr><td span id='name'> " + childSnapshot.val().name + "</td>" +
        " </span><td span id='destination'> " + childSnapshot.val().destination + "</td>" +
        " </span><td span id='frequency'> " + childSnapshot.val().frequency + "</td>" +
        " </span><td span id='next'> " + childSnapshot.val().nextTrainArrival + "</td>" +
        " </span><td span id='minAway'> " + childSnapshot.val().minutesAway + "</td>" + " </span></div>");

      // Error handling
    }, function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
    });

    dataRef.ref().on("child_added", function(childSnapshot) {
      console.log(childSnapshot.val().name);
      console.log(childSnapshot.val().destination);
      console.log(childSnapshot.val().trainTime);
      console.log(childSnapshot.val().frequency);
      console.log(childSnapshot.val().dateAdded);

    });

    dataRef.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(childSnapshot) {

  });
