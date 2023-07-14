// Client-side JavaScript
document.getElementById("TestingHTML");

function longPoll() {
  // Fetch data from server side (MQTT message)
  fetch('/api/long-polling')
    .then(response => response.json())
    .then(data => {
      // Received message from server
      updateTime();

      console.log('Received long-polling response:', data);
      let outputObject = document.getElementById("message"); // Textbox tag
      outputObject.value += currentDateAndTime + data + '\n'; // Print MQTT message on webUI in Textbox

      let cancel = false; // Checks if cancel button pressed
      let cancelPressed = false;
      

      // When cancel button pressed, do this
      document.getElementById("cancelButton").addEventListener("click", function() {
        // Prevents event listens from previous requests
        if (cancelPressed || noButtonPressed) {
          return;
        }
        console.log("Message cancelled!");
        sendDataToPython('cancel', data);
        cancelPressed = true;
        cancel = true;
      });

      let noButtonPressed = false;

      // Wait to check if any buttons are pressed, keep data as is if no buttons pressed
      setTimeout(() => {
        if(!cancel) {
          sendDataToPython('', data);
          noButtonPressed = true;
        }
      }, 2000);
      
      longPoll();
    })
    .catch(error => {
      // Received error from server
      updateTime();

      console.error('Long-polling request failed:', error);
      let outputObject = document.getElementById("message");
      outputObject.value += currentDateAndTime + error + '\n'; // Print error message on webUI in Textbox

      longPoll();
    });
}

// Start recursive function
longPoll();

// Updates date object to get exact time message was displayed on webUI
function updateTime() {
  let date = new Date();
  currentDateAndTime = `[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} UTC]`;
}

// Sends data to Python via HTTP POST
function sendDataToPython(buttonPressed, data) {
  var url = 'http://127.0.0.1:3000/process';
  var requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({data, buttonPressed})
  };

  // Fetch data from Python Server
  fetch(url, requestOptions)
    .then(response => response.json())
    .then(dataFromPython => {
      // Response from Python server
      console.log('Response from Python:', dataFromPython);
      // Logic to display Python output in Textbox goes here if needed
    })
    .catch(error => {
      // Error from Python server
      console.error('Error:', error);
      // Logic to display Python output in Textbox goes here if needed
    });
}