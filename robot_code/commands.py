import time

class Command():
    def __init__(self,command):
        self.command = command
        self.time_issued = time.time() * 1000   #time in milliseconds

    def __repr__(self):
        return "{}, {}".format(self.command,self.time_issued)