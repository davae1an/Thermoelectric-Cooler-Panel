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
# OutSideFan = PWMOutputDevice(22, 100)

# Peltier = LED(8)
interval = 1
socketIO = SocketIO('localhost', 3000, Namespace)

statz = Status()
tempchk = Tempchecker


def turnup():
    # inside_temp_c, inside_temp_f = Tempchecker.read_inside_temp()
    statz.TempTarget = statz.TempTarget + 0.5
    statz.WriteConfig('TempTarget', str(statz.TempTarget))
    print('Turn up to: ' + str(statz.TempTarget))
    lcd.clear()
    lcd.message('Target:' + str(statz.TempTarget) + ' ' + chr(223) + 'C')

    if statz.isConnected is True:
        socketIO.emit('targettemp', str(statz.TempTarget))


def turndown():
    statz.TempTarget = statz.TempTarget - 0.5
    statz.WriteConfig('TempTarget', str(statz.TempTarget))
    print('Turn down to: ' + str(statz.TempTarget))

    lcd.clear()
    lcd.message('Target:' + str(statz.TempTarget) + ' ' + chr(223) + 'C')

    if statz.isConnected is True:
        socketIO.emit('targettemp', str(statz.TempTarget))


def buttonwait():
    btnup = Button(23)
    btndown = Button(18)
    btnup.when_pressed = turnup
    btndown.when_pressed = turndown
    pause()


def getTemps():

    while True:
        inside_temp_c, inside_temp_f = tempchk.read_inside_temp()
        housing_temp_c, housing_temp_f = tempchk.read_housing_temp()
        outside_temp_c, outside_temp_f = tempchk.read_outside_temp()

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

        lcd.clear()
        lcd.message('Current:' + str(inside_temp_c)[:4] + ' ' +
                    chr(223) + 'C' + '\n' + ' Target:' +
                    str(statz.TempTarget) + ' ' + chr(223) + 'C')

        if inside_temp_c > statz.TempTarget:
            if Peltier.is_active is False:
                Peltier.value = 0
                Peltier.toggle()
                Pump.on()
                statz.peltierCheck = "ON"
                RadFan.value = 0
                RadFan.toggle()
                statz.radiatorFan = 'ON'
                print('Changed to ' + statz.peltierCheck)
            else:
                print('Peltier is already on')
        else:
            if Peltier.is_active is True:
                Peltier.off()
                statz.peltierCheck = "OFF"
                print('Changed to ' + statz.peltierCheck)

    time.sleep(interval)


def radiatorsys():
    while True:

        if statz.peltierCheck == 'ON':
            Pump.on()
            statz.pumpCheck == 'ON'
            if RadFan.is_active is False:
                RadFan.value = 0
                RadFan.toggle()
                statz.radiatorFan = 'ON'
            else:
                print('Fan is already on')
        else:
            print('Start Sleeping')
            time.sleep(60)
            print('Finish sleep')
            Pump.off()
            print('pump off')
            statz.pumpCheck == 'OFF'
            if RadFan.is_active is True:
                RadFan.off()
                statz.radiatorFan = 'OFF'
                print('Fan off')

        time.sleep(1)


def recorder():
    while True:

        if statz.RecordData is True:
            inside_temp_c, inside_temp_f = tempchk.read_inside_temp()
            housing_temp_c, housing_temp_f = tempchk.read_housing_temp()
            outside_temp_c, outside_temp_f = tempchk.read_outside_temp()
            print('Sendind data to server')
            socketIO.emit('tempadd', json.dumps(
                {
                    'recordId': str(statz.recordId),
                    'tempinside': str(inside_temp_c),
                    'temphousing': str(housing_temp_c),
                    'tempoutside': str(outside_temp_c)
                }, sort_keys=False, indent=4))

        time.sleep(statz.recordInterval)


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
