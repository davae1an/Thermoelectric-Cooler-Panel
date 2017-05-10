from gpiozero import LED
import time


pintest = LED(18)


while True:
     print('testing pin')
    pintest.on()
    time.sleep(5)
    pintest.off()
    time.sleep(5)
