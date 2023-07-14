# Python server for receiving button presses
from flask import Flask, request, jsonify
from flask_cors import CORS
import time

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

def cancelButtonLogic(data, buttonPressed):
    print(f"{buttonPressed} was pressed and contains: {data}");
    # Implement logic for canceling data

@app.route('/process', methods=['POST'])
def process_request():
    dataFromJavaScript = request.get_json();
    data = dataFromJavaScript.get('data');
    buttonPressed = dataFromJavaScript.get('buttonPressed');
    # Create logic for data
    if buttonPressed == 'cancel':
        cancelButtonLogic(data, buttonPressed);
    else:
        print(f"Message sent: {data}");
        # Implement logic for data that does not need to be modified
    return jsonify(data); # Returns data to be fetched by JavaScript

if __name__ == '__main__':
    app.run(port = 3000)