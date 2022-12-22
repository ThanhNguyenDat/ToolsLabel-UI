if [ -f "venv/bin/activate" ]
then
    echo virtual env already created
else
    python3 -m venv venv
    # virtualenv venv
fi
source venv/bin/activate

# Just install dependencies by default to pick up any changes
pip install -r requirements.txt

#
# run the data server
#
# uvicorn api:app --reload
python3 main_process.py