from gpiozero import Servo,DistanceSensor,AngularServo
import datetime
import asyncio
from time import sleep
from itertools import chain
import json


#CONSTANTS
PWM_PIN1 = 13
PWM_PIN2 = 18
DEFAULT_MIN_PULSE = 1.01/1000
DEFAULT_MAX_PULSE = 1.99/1000



class Robot:

    def __init__(self,websocket,servo_pin1 = PWM_PIN1,servo_pin2 = PWM_PIN2, max_pulse = DEFAULT_MAX_PULSE,min_pulse = DEFAULT_MIN_PULSE):
        self.init_at = datetime.datetime.now().time()
        self.left_servo = Servo(PWM_PIN1,frame_width =20/1000,max_pulse_width = max_pulse,min_pulse_width = min_pulse)
        self.right_servo = Servo(servo_pin2,frame_width =20/1000,max_pulse_width = max_pulse,min_pulse_width = min_pulse)
        self.command_type_to_method = {'movement':self.execute_movement,'playback':self.return_playback_task,'reverse':self.return_reverse_task,'upload':self.save_command_sets}
        self.movement_commands = {'ArrowUp':self.move_forward,'ArrowRight':self.turn_right,'ArrowLeft':self.turn_left,'ArrowDown':self.move_backwards,'stop':self.stop}
        self.command_database_url = ""
        self.database_path = ""
        self.websocket = websocket
        self.sonic_sensor = DistanceSensor(echo = 17,trigger = 4)
        self.angular_servo = AngularServo(21,max_pulse_width = 2/1000,min_pulse_width = 1/10000)
        self.couroutines_on_init = [self.transmit_sonar_data]
        self.run_scheduled_coroutines()
        

    def run_scheduled_coroutines(self):
        for coro in self.couroutines_on_init:
            asyncio.ensure_future(coro())
            

    async def transmit_sonar_data(self):
        self.angular_servo.min()
        await asyncio.sleep(1)
        while True:
            for i in chain(range(-90,90),range(90,-90,-1)):
                self.angular_servo.angle = i
                await asyncio.sleep(.004)
                angle_and_distance = json.dumps((i,round(self.sonic_sensor.distance * 100,2)))
                await self.websocket.send(angle_and_distance)
            
        
    def move_forward(self):
        self.left_servo.max()
        self.right_servo.min()
        

    def turn_right(self):
        self.right_servo.min()
        self.left_servo.min()

    def turn_left(self):
        self.left_servo.max()
        self.right_servo.max()

    def move_backwards(self):
        self.left_servo.min()
        self.right_servo.max()
    
    def stop(self):
        self.left_servo.mid()
        self.right_servo.mid()

    def return_reverse_task(self,command_set):
        task = asyncio.ensure_future(self.execute_reverse(command_set))
        return task
    
    async def execute_reverse(self,command_set):
        reversed_directions = {'ArrowUp':'ArrowDown','ArrowDown':'ArrowUp','ArrowRight':'ArrowLeft','ArrowLeft':'ArrowRight'}
        direction_duration_tups = RobotUtils.process_command_set(command_set)  #[('ArrowRight',3411),('ArrowDown',5000)]
        direction_duration_tups.reverse()
        for direction,duration in direction_duration_tups:
            direction = reversed_directions[direction]
            print("Executing {} for {} ms".format(direction,duration))
            self.execute_movement(direction)
            await asyncio.sleep(duration/1000)
            self.stop()


    def return_playback_task(self,command_set):
        task = asyncio.ensure_future(self.execute_playback(command_set))
        return task
    
    async def execute_playback(self,command_set):
        direction_duration_tups = RobotUtils.process_command_set(command_set)  #[('ArrowRight',3411),('ArrowDown',5000)]
        for direction,duration in direction_duration_tups:
            print("Executing {} for {} ms".format(direction,duration))
            self.execute_movement(direction)
            await asyncio.sleep(duration/1000)
            self.stop()
    
    def execute_movement(self,direction):
        correct_method = self.movement_commands[direction]
        correct_method()

    def save_command_sets(self,command_set):
        with open(self.database_path,'w') as database:
            database.write(command_set)
    
    def send_command_sets(self):
        with open(self.database_path) as database:
            return database.read()

    def process_message(self,message):
        message_type,message_data = message['type'],message['data']
        correct_method = self.command_type_to_method[message_type] #returns a method
        return correct_method(message_data)  #this can potentially return a coroutine which can be cancelled in the main loop
        
class RobotUtils:

  @staticmethod
  def process_command_set(command_set):
    return [(command_set[i]["command"],command_set[i+1]["time"] - command_set[i]["time"]) for i in range(0,len(command_set),2)]





    
