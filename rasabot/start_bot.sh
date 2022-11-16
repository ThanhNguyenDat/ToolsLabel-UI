if [ -f "venv/bin/activate" ]
then
    echo virtual env already created
else
    python3 -m venv venv
    # virtualenv venv
fi
source venv/bin/activate

# Just install dependencies by default to pick up any changes
# pip install -r requirements.txt

cd ZABot && rasa run --enable-api --port 5055 --cors "*"