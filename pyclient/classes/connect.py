from socketIO_client import BaseNamespace
import datetime
import json
import os.path


class Status(object):
    RecordData = True
    isConnected = False
    TempTarget = 25
    radiatorFan = 'OFF'
    peltierCheck = 'OFF'
    pumpCheck = 'OFF'
    insideFanCheck = 'OFF'  # <<config this

    def SortData(data, char1, char2):
        Sorted = data[data.find(char1) + 1: data.find(char2)]
        return Sorted

    def LoadConfig():
        global TempTarget
        PATH = './config.json'
        if os.path.isfile(PATH):
            print('File exists and is readable')
            with open('config.json', 'r') as filez:
                config = json.load(filez)
                Status.TempTarget = float(config['TempTarget'])
                print(str(Status.TempTarget))
        else:
            print('No file creating with default template')
            config = {'TempTarget': '24'}
            with open('config.json', 'w') as filez:
                json.dump(config, filez)

            with open('config.json', 'r') as filez:
                config = json.load(filez)
                Status.TempTarget = float(config['TempTarget'])
                print(str(Status.TempTarget))

    def WriteConfig(field, value):
        with open('config.json', 'r') as filez:
            config = json.load(filez)
            config[field] = value

        with open('config.json', 'w') as f:
            json.dump(config, f)


class Namespace(BaseNamespace):

    def on_connect(self):
        Status.isConnected = True
        Status.RecordData = False
        self.emit('join', 'raspberrypi zero joined at ' +
                  str(datetime.datetime.now()))
        self.emit('targettemp', str(Status.TempTarget))
        self.emit('recordinfo', 'check')

    def on_reconnect(self):
        print('raspberry pi reconnected')
        self.emit('join', 'raspberry pi Zer0 reconnected')
        self.emit('targettemp', str(Status.TempTarget))
        Status.isConnected = True

    def on_disconnect(self):
        Status.isConnected = False
        print('Disconnected from the server trying to reconnect')

    def on_record(self, *args):
        self.emit('join', 'raspberry pi in record mode')
        data = Status.SortData(str(args), '{', '}')
        if data == 'True':
            Status.RecordData = True
            print('Recording Data Now')
        else:
            Status.RecordData = False
            print('Stop Recording Data')

    def on_gettemptarget(self, *args):
        Status.LoadConfig()
        data = Status.SortData(str(args), '{', '}')
        if data == 'givemetemp':
            self.emit('targettemp', str(Status.TempTarget))

    def on_checkrecord(self):
        if Status.RecordData:
            print('checkrecord sending true')
        else:
            print('checkrecord sending false')

    def on_changetemp(self, *args):
        data = Status.SortData(str(args), '{', '}')
        Status.TempTarget = float(data)

    def on_picheck(self, *args):
        data = Status.SortData(str(args), '{', '}')
        if data == 'ping':
            self.emit('picheck', 'pong')
            print('Response pong was sent')
