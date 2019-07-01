from gpiozero import DistanceSensor
from time import sleep


def print_distance():
    ultrasonic = DistanceSensor(echo = 17,trigger = 4)
    while True:
        print("nearest object is {} cm away".format(ultrasonic.distance * 100))
        sleep(.5)

print_distance()