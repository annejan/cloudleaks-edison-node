import time
import pyupm_buzzer as upmBuzzer

buzzer = upmBuzzer.Buzzer(5)

notes = [0,0,0,0,0,0,10,10,30,40,70,100,130,180,220,270,300,310,290,220,130,560,210,500,500,500,500]

print buzzer.name()

for notes_ind in range (0,24):
    print buzzer.playSound(notes[notes_ind], 100000)
#    time.sleep(0.01)
del buzzer

