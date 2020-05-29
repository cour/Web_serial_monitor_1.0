import json
import csv
import time
from flask import Flask, render_template, make_response, request
from threading import Thread, Lock
import serial
import serial.tools.list_ports

app = Flask(__name__)

data_lock = Lock()

class Serie(Thread):

    def __init__(self, COM,Baud):

        Thread.__init__(self)
        self.COM = COM
        self.Baud = Baud
        self.ser = serial.Serial(self.COM, self.Baud)
        self.ser.flushInput()

    def run(self):
        global byte
        global isRecording
        global stop_Recording
        global listByte
        global filename
        global file
        while True:
            with data_lock:
                ser_bytes = self.ser.readline().strip().decode("utf-8", 'ignore').split(',') # Read all sent bytes and store it into a list
                listByte = [] # doit être là
                for i in range(len(ser_bytes)):
                    if ser_bytes[i].isdigit():
                        byte = float(ser_bytes[i]) #every value recieved is forced to the type float
                        listByte.append(byte)

            if isRecording == True & stop_Recording == True: # Stop le thread of the serial connection
                stop_Recording = False
                isRecording = False
                self.ser.close()
                return

@app.route('/')
def main_page():
    return render_template('index.html', data='test')


@app.route('/serial-plotter.html')
def full_graph_page():
    return render_template('serial-plotter.html', data='test')

@app.route('/live-data')
def live_chart():
    global byte
    global listByte
    global save_csv
    global isRecording
    global stop_Recording
    data = []
    data.append(time.time()-startTime)
    for i in range(len(listByte)):
        data.append(listByte[i])
    if save_csv == True:
        writer = csv.writer(file, delimiter=",")
        writer.writerow(data)
    response = make_response(json.dumps(data))
    response.content_type = 'application/json'
    return response


@app.route('/serial_ports')
def listPorts():
    listPorts = []
    list = serial.tools.list_ports.comports(include_links=False)
    for i in range(len(list)):
        listPorts.append(list[i][0])
    response = make_response(json.dumps(listPorts))
    response.content_type = 'application/json'
    return response


@app.route('/serial_start', methods=["POST", "GET"])
def start_recording():
    global save_csv
    save_csv = False
    global Baudrate
    global Comport
    global startTime
    global stop_Recording
    global filename
    stop_Recording = False
    global isRecording
    global file
    global thread_serial
    isRecording = False
    if request.method == "POST":
        Baudrate = request.form["Baudrate"]
        Comport = request.form["Comport"]
        save = request.form["save"]
        if isRecording == False:
            if save == "true":
                filename = time.strftime("%Y%m%d-%H%M%S")
                file = open("recorded/"+filename+".txt", "w")
                save_csv = True
            isRecording = True
            stop_Recording = False
            thread_serial = Serie(Comport, int(Baudrate))
            startTime = time.time()
            thread_serial.start()
            print("Thread serie started")
        return "starting"

@app.route('/serial_stop', methods=["POST", "GET"])
def stop_recording():
    global stop_Recording
    global save_csv
    if request.method == "POST":
        stop = request.form["STOP"]
        if stop == 'STOP':
            stop_Recording = True
            if save_csv == True:
                save_csv = False
                file.close()
            print("stopping thread serie")
        return "stopping"

class server(Thread):
    def run(self):
        app.run(debug=False, host='127.0.0.1', port=6209)

if __name__ == '__main__':
    thread_server = server()
    thread_server.start()

