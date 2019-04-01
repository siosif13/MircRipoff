import os
import datetime

from flask import Flask, render_template, redirect, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

channelList = []

@app.route("/")
def index():
    return render_template("index.html", channelList = channelList)


@socketio.on("create channel")
def createChannel(data):
    data["channelNb"] = "ch" + str(len(channelList) + 1)
    data["messages"] = []
    channelList.append(data)
    emit("update client list", channelList, broadcast=True)


@socketio.on("select channel")
def selectChannel(data):
    channelIndex = int(data["channelNb"].replace("ch", "")) - 1
    emit("selected channel", {"channel": channelList[channelIndex], "sender": data["sender"]}, broadcast=True)

@socketio.on("sendMessage")
def sendMessage(data):
    channelIndex = int(data["channelNb"].replace("ch", "")) - 1
    messageData = {"displayName": data["displayName"], "message": data["message"], "timestamp": datetime.datetime.now().strftime("%H:%M %m-%d")}
    if (len(channelList[channelIndex]["messages"]) == 100):
        channelList[channelIndex]["messages"].pop(0)
    channelList[channelIndex]["messages"].append(messageData)
    emit("selected channel", {"channel": channelList[channelIndex]}, broadcast = True)
