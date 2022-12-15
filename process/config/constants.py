import datetime

STATUS_SUCCESS = 'success'
STATUS_FAIL = 'fail'

FORMAT = '%(asctime)s - %(levelname)s - %(message)s'
FILENAME_LOG = f'logs/log_{datetime.datetime.now()}.log'
# FILENAME_LOG = f'log_{datetime.date.today()}.log'
