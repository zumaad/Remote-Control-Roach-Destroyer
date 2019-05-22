
from gpiozero import Servo

#CONSTANTS
PWM_PIN1 = 13
PWM_PIN2 = 18
SLOW_MIN_PULSE = 1.4/1000
SLOW_MAX_PULSE = 1.6/1000

class Robot:

    def __init__(self,servo_pin1 = PWM_PIN1,servo_pin2 = PWM_PIN2, max_pulse = SLOW_MAX_PULSE,min_pulse = SLOW_MIN_PULSE):
        self.left_servo = Servo(13,frame_width =20/1000,max_pulse_width = max_pulse,min_pulse_width = min_pulse)
        self.right_servo = Servo(18,frame_width =20/1000,max_pulse_width = max_pulse,min_pulse_width = min_pulse)
        self.command_history = []
        self.recognized_commands = {}
    
    def move_forward(self):
        pass

    def turn_right(self):
        pass

    def turn_left(self):
        pass
        
    def move_backwards(self):
        pass