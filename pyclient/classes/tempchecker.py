import os
# import glob
import time


class Tempchecker(object):
    """docstring for ClassName"""
    os.system('modprobe w1-gpio')
    os.system('modprobe w1-therm')

    base_dir = '/sys/bus/w1/devices/'
    # device_folder = glob.glob(base_dir + '28*')[0]
    insideSensor = base_dir + '28-011620f114ee' + '/w1_slave'
    housingSensor = base_dir + '28-011613215fee' + '/w1_slave'
    outsideSensor = base_dir + '28-02161814e0ee' + '/w1_slave'
    # device_file = device_folder + '/w1_slave'

    def __init__(self, arg):
        super(Tempchecker, self).__init__()
        self.arg = arg

    def read_inside_temp_raw():
        insideTemp = open(Tempchecker.insideSensor, 'r')
        rawInside = insideTemp.readlines()
        insideTemp.close()

        return rawInside

        # f = open(Tempchecker.device_file, 'r')
        # lines = f.readlines()
        # f.close()
        # return lines

    def read_housing_temp_raw():
        housingTemp = open(Tempchecker.housingSensor, 'r')
        rawHousing = housingTemp.readlines()
        housingTemp.close()

        return rawHousing

    def read_outside_temp_raw():
        outsideTemp = open(Tempchecker.outsideSensor, 'r')
        rawOutside = outsideTemp.readlines()
        outsideTemp.close()

        return rawOutside

    def read_inside_temp():
        lines = Tempchecker.read_inside_temp_raw()
        while lines[0].strip()[-3:] != 'YES':
            time.sleep(0.2)
            lines = Tempchecker.read_inside_temp_raw()
        equals_pos = lines[1].find('t=')
        if equals_pos != -1:
            temp_string = lines[1][equals_pos + 2:]
            inside_temp_c = float(temp_string) / 1000.0
            inside_temp_f = inside_temp_c * 9.0 / 5.0 + 32.0
            return inside_temp_c, inside_temp_f

    def read_housing_temp():
        lines = Tempchecker.read_housing_temp_raw()
        while lines[0].strip()[-3:] != 'YES':
            time.sleep(0.2)
            lines = Tempchecker.read_housing_temp_raw()
        equals_pos = lines[1].find('t=')
        if equals_pos != -1:
            temp_string = lines[1][equals_pos + 2:]
            housing_temp_c = float(temp_string) / 1000.0
            housing_temp_f = housing_temp_c * 9.0 / 5.0 + 32.0
            return housing_temp_c, housing_temp_f

    def read_outside_temp():
        lines = Tempchecker.read_outside_temp_raw()
        while lines[0].strip()[-3:] != 'YES':
            time.sleep(0.2)
            lines = Tempchecker.read_outside_temp_raw()
        equals_pos = lines[1].find('t=')
        if equals_pos != -1:
            temp_string = lines[1][equals_pos + 2:]
            outside_temp_c = float(temp_string) / 1000.0
            outside_temp_f = outside_temp_c * 9.0 / 5.0 + 32.0
            return outside_temp_c, outside_temp_f

    # def read_temp():
    #     lines = Tempchecker.read_temp_raw()
    #     while lines[0].strip()[-3:] != 'YES':
    #         time.sleep(0.2)
    #         lines = Tempchecker.read_temp_raw()
    #     equals_pos = lines[1].find('t=')
    #     if equals_pos != -1:
    #         temp_string = lines[1][equals_pos + 2:]
    #         temp_c = float(temp_string) / 1000.0
    #         temp_f = temp_c * 9.0 / 5.0 + 32.0
    #         return temp_c, temp_f
