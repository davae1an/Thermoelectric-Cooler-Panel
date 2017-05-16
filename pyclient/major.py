# -*- coding: utf-8 -*-
import time
from gpiozero import Button, PWMOutputDevice, LED
# import Adafruit_CharLCD as LCD PWMOutputDevice,
from classes.tempchecker import Tempchecker
from classes.connect import Namespace
from classes.connect import Status
from socketIO_client import SocketIO
from threading import Thread
from signal import pause
import json
# import datetime
import logging
logging.getLogger('requests').setLevel(logging.WARNING)
logging.basicConfig(level=logging.DEBUG)

# Raspberry Pi pin configuration:
# Note this might need to be changed to 21 for older revision Pi's.
# lcd_rs = 21
# lcd_en = 20
# lcd_d4 = 16
# lcd_d5 = 12
# lcd_d6 = 25
# lcd_d7 = 24


# Define LCD column and row size for 16x2 LCD.lcd_backlight = 4
# lcd_columns = 16
# lcd_rows = 3

# Initialize the LCD using the pins above.
# lcd = LCD.Adafruit_CharLCD(lcd_rs, lcd_en, lcd_d4, lcd_d5, lcd_d6, lcd_d7,
#                            lcd_columns, lcd_rows)
# lcd_backlight)


# Peltier Pinout signal on pin 5
RadFan = PWMOutputDevice(16, 100)
Pump = LED(21)
Peltier = PWMOutputDevice(20, 100)

# Peltier = LED(8)
interval = 1
TempTarget = Status.TempTarget
inside_temp_c, inside_temp_f = Tempchecker.read_inside_temp()
Tempinsidez = inside_temp_c
socketIO = SocketIO('localhost', 3000, Namespace)


def turnup():
    global TempTarget, Tempinsidez
    TempTarget = TempTarget + 0.5
    Status.WriteConfig('TempTarget', str(TempTarget))
    print('Turn up to: ' + str(TempTarget))
    # lcd.clear(
    # lcd.message('Current:' + str(Tempinsidez)[:4] + ' ' +
    #             chr(223) + 'C' + '\n' + ' Target:' +
    #             str(TempTarget) + ' ' + chr(223) + 'C')

    if Status.isConnected is True:
        socketIO.emit('targettemp', str(TempTarget))


def turndown():
    global TempTarget, Tempinsidez
    TempTarget = TempTarget - 0.5
    Status.WriteConfig('TempTarget', str(TempTarget))
    print('Turn down to: ' + str(TempTarget))

    # lcd.clear()
    # lcd.message('Current:' + str(Tempinsidez)[:4] + ' ' +
    #             chr(223) + 'C' + '\n' + ' Target:' +
    #             str(TempTarget) + ' ' + chr(223) + 'C')

    if Status.isConnected is True:
        socketIO.emit('targettemp', str(TempTarget))


def buttonwait():
    btnup = Button(23)
    btndown = Button(18)
    btnup.when_pressed = turnup
    btndown.when_pressed = turndown
    pause()


def getTemps():

    while True:
        inside_temp_c, inside_temp_f = Tempchecker.read_inside_temp()
        housing_temp_c, housing_temp_f = Tempchecker.read_housing_temp()
        outside_temp_c, outside_temp_f = Tempchecker.read_outside_temp()

        print('Inside: ' + str(inside_temp_c) +
              ' Housing: ' + str(housing_temp_c) +
              ' Outisde: ' + str(outside_temp_c))

        if Status.isConnected is True:
            socketIO.emit('tempdata', json.dumps(
                {
                    'tempinside': str(inside_temp_c),
                    'temphousing': str(housing_temp_c),
                    'tempoutside': str(outside_temp_c),
                    'radiatorFan': Status.radiatorFan,
                    'peltier': Status.peltierCheck,
                    'pump': Status.pumpCheck,
                    'insideFan': Status.insideFanCheck
                }, sort_keys=False, indent=4))

        # lcd.clear()
        # lcd.message('Current:' + str(inside_temp_c)[:4] + ' ' +
        #             chr(223) + 'C' + '\n' + ' Target:' +
        #            str(TempTarget) + ' ' + chr(223) + 'C')

        if inside_temp_c > TempTarget:
            if Peltier.is_active is False:
                Peltier.value = 0.5
                Peltier.toggle()
                Status.peltierCheck = "ON"
                print('Changed to ' + Status.peltierCheck)
            else:
                print('Peltier is already on')
        else:
            if Peltier.is_active is True:
                Peltier.off()
                Status.peltierCheck = "OFF"
                print('Changed to ' + Status.peltierCheck)

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
            time.sleep(120)
            print('Finish sleep')
            Pump.off()
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
            inside_temp_c, inside_temp_f = Tempchecker.read_inside_temp()
            housing_temp_c, housing_temp_f = Tempchecker.read_housing_temp()
            outside_temp_c, outside_temp_f = Tempchecker.read_outside_temp()
            print('Sendind data to express js')
            socketIO.emit('tempadd', json.dumps(
                {
                    'recordId': str(Status.recordId),
                    'tempinside': str(inside_temp_c),
                    'temphousing': str(housing_temp_c),
                    'tempoutside': str(outside_temp_c)
                }, sort_keys=False, indent=4))

        time.sleep(Status.recordInterval)


def connector():
    socketIO.wait()


Status.LoadConfig()
rec = Thread(target=recorder)
rec.start()
b = Thread(target=buttonwait)
b.start()
g = Thread(target=getTemps)
g.start()
r = Thread(target=radiatorsys)
r.start()
s = Thread(target=connector)
s.start()
