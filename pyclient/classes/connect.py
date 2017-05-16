from socketIO_client import BaseNamespace
import datetime
import json
import os.path


class Status(object):
    RecordData = False
    isConnected = False
    TempTarget = 25
    radiatorFan = 'OFF'
    peltierCheck = 'OFF'
    pumpCheck = 'OFF'
    insideFanCheck = 'OFF'  # <<config
    recordInterval = 1
    recordId = 0

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
        self.emit('recordcheck', 'check')

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
            # Status.RecordData = True
            print('Fetching New Record Data')
            self.emit('recordcheck', 'check')

        else:
            Status.RecordData = False
            Status.recordId = '0'
            Status.recordInterval = 4
            print('Stop Recording Data')

    def on_recordinfo(self, *args):
        print('got recordinfo')
        Status.LoadConfig()
        data = Status.SortData(str(args), '|', '|')
        jsonObject = json.loads(data)
        RecordNow = False

        for key in jsonObject:
            value = jsonObject[key]
            if key == 'recordid':
                Status.recordId = value

            if key == 'interval':
                Status.recordInterval = int(value)

            if key == 'currentrecord':
                if value != 'none':
                    RecordNow = True

            print('RecordInfo: ' + key + 'Value:' + value)

        if RecordNow:
            Status.RecordData = True
        else:
            Status.RecordData = False

    def on_gettemptarget(self, *args):
        Status.LoadConfig()
        data = Status.SortData(str(args), '{', '}')
        if data == 'givemetemp':
            self.emit('targettemp', str(Status.TempTarget))

    def on_changetemp(self, *args):
        data = Status.SortData(str(args), '{', '}')
        Status.TempTarget = float(data)

    def on_picheck(self, *args):
        data = Status.SortData(str(args), '{', '}')
        if data == 'ping':
            self.emit('picheck', 'pong')
            print('Response pong was sent')
