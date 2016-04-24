
import pyupm_i2clcd as lcd
import mraa
import time
import sys
import math
import colorsys
import pyupm_buzzer as upmBuzzer


# analog input - pot
potPin = 0
pot = mraa.Aio(potPin)
potVal = 0
potGrnVal=0
potBluVal=0
blue = 0
red = 0
green = 0

lightPin=1
lum = mraa.Aio(lightPin)
lumVal = 0

tmpPin=2
tmp = mraa.Aio(tmpPin)
tmpVal = 0

# digital output - led
ledPin = mraa.Gpio(4)
ledPin.dir(mraa.DIR_OUT)
ledPin.write(0)

# digital output - buzzer
#buzPin = mraa.Gpio(8)
#buzPin.dir(mraa.DIR_OUT)
#buzPin.write(0)

# digital input - touch
touchPin = mraa.Gpio(3)
touchPin.dir(mraa.DIR_IN)

# display - lcd
lcdDisplay = lcd.Jhd1313m1(0, 0x3E, 0x62)
buzzer = upmBuzzer.Buzzer(5)

sample_size = 10

while 1:

    blue = 0
    red = 255
    green = 0
    red_totaal = 0
    
    for red_ind in range(0,sample_size):
        lcdDisplay.setColor(red,green,blue)
        red_sample = float(lum.read())
        red_totaal += red_sample
        time.sleep(0.1)


    red_avg = red_totaal/sample_size
#    print "red: "+str(red)+"blu: "+str(blue)+"grn: "+str(green)+"lum: "+str(red_avg)

    blue = 0
    red = 0
    green = 255
    green_totaal = 0

    for green_ind in range(0,sample_size):
        lcdDisplay.setColor(red,green,blue)
        green_sample = float(lum.read())
        green_totaal += green_sample
        time.sleep(0.1)


    green_avg = green_totaal/sample_size
#    print "red: "+str(red)+"blu: "+str(blue)+"grn: "+str(green)+"lum: "+str(green_avg)

    blue = 255
    red = 0
    green = 0
    blue_totaal = 0

    for blue_ind in range(0,sample_size):
        lcdDisplay.setColor(red,green,blue)
        blue_sample = float(lum.read())
        blue_totaal += blue_sample
        time.sleep(0.1)

    blue_avg = blue_totaal/sample_size
#    print "red: "+str(red)+"blu: "+str(blue)+"grn: "+str(green)+"lum: "+str(blue_avg)


    print "red: "+str(red_avg-66)+"blu: "+str(blue_avg-56)+"grn: "+str(green_avg-58)

    print colorsys.rgb_to_hsv(red_avg,green_avg, blue_avg)

    notes = [0,0,0,0,0,0,10,10,30,40,70,100,130,180,220,270,300,310,290,220,130,560,210,500,500,500,500]

#print buzzer.name()

    for notes_ind in range (0,24):
        buzzer.playSound(notes[notes_ind], 100000)
#    time.sleep(0.01)

del buzzer

