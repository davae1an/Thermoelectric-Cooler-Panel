# -*- coding: utf-8 -*-
import time
from classes.connect import Namespace
from classes.connect import Status
from socketIO_client import SocketIO
from threading import Thread
import json
from datetime import datetime
# import logging
# logging.getLogger('requests').setLevel(logging.WARNING)
# logging.basicConfig(level=logging.DEBUG)

interval = 1
socketIO = SocketIO('localhost', 3000, Namespace)

statz = Status()


def getTemps():
    count = 0
    while True:

        if (count == 0):
            inside_temp_c = 19
            housing_temp_c = 22
            outside_temp_c = 27

        if (count == 1):
            inside_temp_c = 13
            housing_temp_c = 24
            outside_temp_c = 33

        if (count == 2):
            inside_temp_c = 10
            housing_temp_c = 29
            outside_temp_c = 27

        if (count == 3):
            inside_temp_c = 6
            housing_temp_c = 36
            outside_temp_c = 26
            count = 0

        count = count + 1

        print('Inside: ' + str(inside_temp_c) +
              ' Housing: ' + str(housing_temp_c) +
              ' Outisde: ' + str(outside_temp_c) +
              ' Target: ' + str(statz.TempTarget) +
              ' Time: ' + datetime.now().strftime('%I:%M:%S %p'))

        if statz.isConnected is True:
            socketIO.emit('tempdata', json.dumps(
                {
                    'tempinside': str(inside_temp_c),
                    'temphousing': str(housing_temp_c),
                    'tempoutside': str(outside_temp_c),
                    'radiatorFan': statz.radiatorFan,
                    'peltier': statz.peltierCheck,
                    'pump': statz.pumpCheck,
                    'insideFan': statz.insideFanCheck,
                    'time': datetime.now().strftime('%I:%M:%S %p')
                }, sort_keys=False, indent=4))

        if (Status.mode == 'hipro'):
            print('housing fan on high')
        else:
            print('housing fan on eco')

        if inside_temp_c > statz.TempTarget:
            statz.peltierCheck = "ON"
            statz.radiatorFan = 'ON'
        else:
            statz.peltierCheck = "OFF"
            statz.radiatorFan = 'OFF'

        time.sleep(4)


def recorder():
    while True:

        if statz.RecordData is True:
            print('recorddata value true')
            inside_temp_c = 12
            housing_temp_c = 36
            outside_temp_c = 45

            print('Sendind record data to server')
            socketIO.emit('tempadd', json.dumps(
                {
                    'recordId': str(statz.recordId),
                    'tempinside': str(inside_temp_c),
                    'temphousing': str(housing_temp_c),
                    'tempoutside': str(outside_temp_c),
                    'time': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                }, sort_keys=False, indent=4))

        time.sleep(statz.recordInterval)


def connector():
    socketIO.wait()


Status.LoadConfig()
rec = Thread(target=recorder)
g = Thread(target=getTemps)
s = Thread(target=connector)

rec.start()
g.start()
s.start()
