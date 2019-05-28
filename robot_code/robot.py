
from gpiozero import Servo
import datetime
from robot_code import commands

#CONSTANTS
PWM_PIN1 = 13
PWM_PIN2 = 18
DEFAULT_MIN_PULSE = 1.4/1000
DEFAULT_MAX_PULSE = 1.99/1000

class Robot:

    def __init__(self,servo_pin1 = PWM_PIN1,servo_pin2 = PWM_PIN2, max_pulse = DEFAULT_MAX_PULSE,min_pulse = DEFAULT_MIN_PULSE):
        self.init_at = datetime.datetime.now().time()
        self.left_servo = Servo(PWM_PIN1,frame_width =20/1000,max_pulse_width = max_pulse,min_pulse_width = min_pulse)
        self.right_servo = Servo(servo_pin2,frame_width =20/1000,max_pulse_width = max_pulse,min_pulse_width = min_pulse)
        self.command_history = []
        self.recognized_commands = {'ArrowUp':self.move_forward,'ArrowRight':self.turn_right,'ArrowLeft':self.turn_left,'ArrowDown':self.move_backwards,'stop':self.stop,'flush':self.flush_temporary_history}
        self.history_on = False
        self.command_database_url = ""
    
    def move_forward(self):
        self.left_servo.max()
        self.right_servo.max()
        

    def turn_right(self):
        self.right_servo.max()
        self.left_servo.mid()

    def turn_left(self):
        self.left_servo.max()
        self.right_servo.mid()

    def move_backwards(self):
        self.left_servo.min()
        self.right_servo.min()
    
    def stop(self):
        self.left_servo.mid()
        self.right_servo.mid()

    def store_command_temporarily(self,command):
        command = commands.Command(command)
        if self.history_on:
            self.command_history.append(command)

    def flush_temporary_history(self):
        self.command_history = []
    
    def store_history_permanently(self):
        with open(self.command_database_url,"a") as database:
            for command in self.command_history:
                database.write(command.__repr__() + '\n')
            database.write("END--------------------------------")

    def execute_command(self,command):
        self.store_command_temporarily(command)
        correct_method = self.recognized_commands[command]
        correct_method()