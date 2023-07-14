# Infinite MQTT publisher
import paho.mqtt.client as mqtt
import time

mqttbroker = "broker.hivemq.com"; # Name of MQTT HiveMQ broker server
client = mqtt.Client("Publisher"); # Creates a client and names it
client.connect(mqttbroker); # Connects the new client to the broker

while True:
    data = input(); # Set to user input for testing
    client.publish("Test", data); # Any subcriber to "Test" will get these messages
    print("Just published " + str(data) + " to topic Test");
    time.sleep(1);