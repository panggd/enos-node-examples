import os, sys

sys.path.append('lib')

from lib.poseidon import poseidon
from lib.dotenv import load_dotenv

load_dotenv()

if __name__ == '__main__':
    appkey = os.getenv('APP_ACCESS_KEY')
    appsecret = os.getenv('APP_ACCESS_SECRET')

    url = 'https://' + os.getenv('API_GATEWAY_URL') + '/connect-service/v2.1/commands?action=invokeService?'
    url += 'orgId=' + os.getenv('OU') + '&'
    url += 'assetId=' + os.getenv('ASSET_ID') + '&'
    url += 'serviceId=' + os.getenv('SERVICE_ID')
    
    header = None
    
    data = {
        'inputData': {
            'deviceStatus': 0
        }
    }

    res = poseidon.urlopen(appkey, appsecret, url, data)
    print(res)