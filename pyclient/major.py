# -*- coding: utf-8 -*-
import time
from gpiozero import Button, PWMOutputDevice, LED
import Adafruit_CharLCD as LCD
from classes.tempchecker import Tempchecker
from classes.connect import Namespace
from classes.connect import Status
from socketIO_client import SocketIO
from threading import Thread
from signal import pause
import json
from datetime import datetime
# import logging
# logging.getLogger('requests').setLevel(logging.WARNING)
# logging.basicConfig(level=logging.DEBUG)

# Raspberry Pi pin configuration:
# Note this might need to be changed to 21 for older revision Pi's.
lcd_rs = 21
lcd_en = 20
lcd_d4 = 16
lcd_d5 = 12
lcd_d6 = 25
lcd_d7 = 24


# Define LCD column and row size for 16x2 LCD.lcd_backlight = 4
lcd_columns = 16
lcd_rows = 3

# Initialize the LCD using the pins above.
lcd = LCD.Adafruit_CharLCD(lcd_rs, lcd_en, lcd_d4, lcd_d5, lcd_d6, lcd_d7,
                           lcd_columns, lcd_rows)


# Peltier Pinout signal on pin 5
RadFan = PWMOutputDevice(13, 100)
Pump = LED(19)
Peltier = PWMOutputDevice(26, 100)
HousingFan = PWMOutputDevice(6, 100)
InsideFan = PWMOutputDevice(5, 100)
# Peltier = LED(8)
interval = 1
socketIO = SocketIO('localhost', 3000, Namespace)


tempchk = Tempchecker


def turnup():
    # inside_temp_c, inside_temp_f = Tempchecker.read_inside_temp()
    if (Status.TempTarget == 40):
        Status.TempTarget = 40
        Status.WriteConfig('TempTarget', str(Status.TempTarget))
        print('Turn up to: ' + str(Status.TempTarget))
        lcd.clear()
        lcd.message('Target:' + str(Status.TempTarget) + ' ' + chr(223) + 'C')

        if Status.isConnected is True:
            socketIO.emit('targettemp', str(Status.TempTarget))
    else:
        Status.TempTarget = Status.TempTarget + 0.5
        Status.WriteConfig('TempTarget', str(Status.TempTarget))
        print('Turn up to: ' + str(Status.TempTarget))
        lcd.clear()
        lcd.message('Target:' + str(Status.TempTarget) + ' ' + chr(223) + 'C')

        if Status.isConnected is True:
            socketIO.emit('targettemp', str(Status.TempTarget))


def turndown():
    if (Status.TempTarget == 0):
        Status.TempTarget = 0
        Status.WriteConfig('TempTarget', str(Status.TempTarget))
        print('Turn down to: ' + str(Status.TempTarget))

        lcd.clear()
        lcd.message('Target:' + str(Status.TempTarget) + ' ' + chr(223) + 'C')

        if Status.isConnected is True:
            socketIO.emit('targettemp', str(Status.TempTarget))
    else:
        Status.TempTarget = Status.TempTarget - 0.5
        Status.WriteConfig('TempTarget', str(Status.TempTarget))
        print('Turn down to: ' + str(Status.TempTarget))

        lcd.clear()
        lcd.message('Target:' + str(Status.TempTarget) + ' ' + chr(223) + 'C')

        if Status.isConnected is True:
            socketIO.emit('targettemp', str(Status.TempTarget))


def modechange():
    if Status.mode is 'hipro':
        Status.mode = 'eco'
        lcd.clear()
        lcd.message('Mode: ' + '\n' + 'Eco (Solar Mode)')
        socketIO.emit('changemode', 'eco')
        print('mode changed to eco')
    else:
        Status.mode = 'hipro'
        lcd.clear()
        lcd.message('Mode: ' + '\n' + 'High Performance')
        socketIO.emit('changemode', 'hipro')
        print('mode changed to high hipro')


def buttonwait():
    btnup = Button(23)
    btndown = Button(18)
    btnmode = Button(15)
    btnup.when_pressed = turnup
    btndown.when_pressed = turndown
    btnmode.when_pressed = modechange
    pause()


def getTemps():

    while True:
        inside_temp_c, inside_temp_f = tempchk.read_inside_temp()
        housing_temp_c, housing_temp_f = tempchk.read_housing_temp()
        outside_temp_c, outside_temp_f = tempchk.read_outside_temp()

        print('Inside: ' + str(inside_temp_c) +
              ' Housing: ' + str(housing_temp_c) +
              ' Outisde: ' + str(outside_temp_c) +
              ' Target: ' + str(Status.TempTarget) +
              ' Time: ' + datetime.now().strftime('%I:%M:%S %p'))

        if (housing_temp_c > 70) or (inside_temp_c > 40):
            Peltier.off()
            time.sleep(30000)

        if (Status.mode == 'hipro'):
            HousingFan.value = 0
            Status.voltage = '7.28'
            HousingFan.toggle()
            Status.housingFan = 'ON'
            print('housing fan on high')

            if inside_temp_c > Status.TempTarget:
                if Peltier.is_active is False:
                    Peltier.value = 0
                    Peltier.toggle()
                    Pump.on()
                    Status.pumpCheck = "ON"
                    Status.peltierCheck = "ON"
                    RadFan.value = 0
                    RadFan.toggle()
                    Status.radiatorFan = 'ON'
                    print('Changed to ' + Status.peltierCheck)

                    InsideFan.value = 0
                    InsideFan.toggle()
                    Status.insideFanCheck = 'ON'
                else:
                    print('Peltier is already on')
            else:
                if Peltier.is_active is True:
                    Peltier.off()
                    Status.peltierCheck = "OFF"
                    print('Changed to ' + Status.peltierCheck)
                    InsideFan.off()
                    Status.insideFanCheck = 'OFF'
        else:
            HousingFan.value = 0.5
            HousingFan.toggle()
            print('housing fan on eco')
            Status.housingFan = 'ON'
            Status.voltage = '5.32'
            if inside_temp_c > Status.TempTarget:
                if Peltier.is_active is False:
                    Peltier.value = 0.25
                    Peltier.toggle()
                    Pump.on()
                    Status.pumpCheck = "ON"
                    Status.peltierCheck = "ON"
                    RadFan.value = 0
                    RadFan.toggle()
                    Status.radiatorFan = 'ON'
                    print('Changed to ' + Status.peltierCheck)

                    InsideFan.value = 0.5
                    InsideFan.toggle()
                    Status.insideFanCheck = 'ON'
                else:
                    print('Peltier is already on')
            else:
                if Peltier.is_active is True:
                    Peltier.off()
                    Status.peltierCheck = "OFF"
                    print('Changed to ' + Status.peltierCheck)
                    InsideFan.off()
                    Status.insideFanCheck = 'OFF'

        if Status.isConnected is True:
            socketIO.emit('tempdata', json.dumps(
                {
                    'tempinside': str(inside_temp_c),
                    'temphousing': str(housing_temp_c),
                    'tempoutside': str(outside_temp_c),
                    'radiatorFan': Status.radiatorFan,
                    'peltier': Status.peltierCheck,
                    'pump': Status.pumpCheck,
                    'insideFan': Status.insideFanCheck,
                    'housingFan': Status.housingFan,
                    'time': datetime.now().strftime('%I:%M:%S %p'),
                    'mode': Status.mode,
                    'voltage': Status.voltage
                }, sort_keys=False, indent=4))

        lcd.clear()
        lcd.message('Current:' + str(inside_temp_c)[:4] + ' ' +
                    chr(223) + 'C' + '\n' + ' Target:' +
                    str(Status.TempTarget) + ' ' + chr(223) + 'C')

    time.sleep(interval)


def radiatorsys():
    while True:

        if Status.peltierCheck == 'ON':
            Pump.on()
            Status.pumpCheck == 'ON'
            if RadFan.is_active is False:
                RadFan.value = 0
                RadFan.toggle()
                Status.radiatorFan = 'ON'
            else:
                print('Fan is already on')
        else:
            print('Start Sleeping')
            time.sleep(300)
            print('Finish sleep')
            Pump.off()
            Status.pumpCheck = "ON"
            print('pump off')
            Status.pumpCheck == 'OFF'
            if RadFan.is_active is True:
                RadFan.off()
                Status.radiatorFan = 'OFF'
                print('Fan off')

        time.sleep(1)


def recorder():
    while True:

        if Status.RecordData is True:
            inside_temp_c, inside_temp_f = tempchk.read_inside_temp()
            housing_temp_c, housing_temp_f = tempchk.read_housing_temp()
            outside_temp_c, outside_temp_f = tempchk.read_outside_temp()
            print('Sendind data to server')
            socketIO.emit('tempadd', json.dumps(
                {
                    'recordId': str(Status.recordId),
                    'tempinside': str(inside_temp_c),
                    'temphousing': str(housing_temp_c),
                    'tempoutside': str(outside_temp_c),
                    'time': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                }, sort_keys=False, indent=4))

        time.sleep(Status.recordInterval)


def connector():
    socketIO.wait()


Status.LoadConfig()
r = Thread(target=radiatorsys)
rec = Thread(target=recorder)
b = Thread(target=buttonwait)
g = Thread(target=getTemps)
s = Thread(target=connector)

r.start()
rec.start()
b.start()
g.start()
s.start()
