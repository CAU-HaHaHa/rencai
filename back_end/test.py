from datetime import datetime,timedelta
import time
a = datetime(2021, 2, 3)
b= a + timedelta(hours=72)
print(datetime.now()>b)
