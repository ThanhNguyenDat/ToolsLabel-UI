from fastapi import FastAPI, requests
import simplejson

from lib.upload_file import UploadFile

app = FastAPI()

ALLOWED_EXTENSIONS = set(['csv'])


def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route("/upload", methods=["POST"])
def upload():
    file = requests.Request['file']

    if file:
        result = UploadFile(name='', size=0, not_allowed_msg='')
        pass

    return simplejson.dumps({"files": file})
