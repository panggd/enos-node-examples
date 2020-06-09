import os, sys

sys.path.append('lib')

from lib.enos_subscribe import DataClient
from lib.dotenv import load_dotenv

load_dotenv()

if __name__ == '__main__':
    client = DataClient(host=os.getenv("SUBSCRIPTION_HOST"), 
                        port=os.getenv("SUBSCRIPTION_PORT"), 
                        access_key=os.getenv("APP_ACCESS_KEY"), 
                        access_secret=os.getenv("APP_ACCESS_SECRET"))

    # client.subscribe(sub_id=os.getenv("SUBSCRIPTION_ID"))
    client.subscribe(sub_id='data-subscription-subdevicegin-ts')
 

    for message in client:
        print(message)