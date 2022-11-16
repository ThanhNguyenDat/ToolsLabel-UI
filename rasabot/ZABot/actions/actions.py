# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/custom-actions


# This is a simple example for a custom action which utters "Hello World!"

from typing import Any, Text, Dict, List

from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher


class ActionHandleImage(Action):
    
    def name(self) -> Text:
        return "action_handle_image"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        image_url = ""
        if not image_url.startswith("http"):
            
            return []
        
        # download image from url
        import urllib.request
        import numpy as np
        import cv2
        
        resource = urllib.request.urlopen(image_url)
        image = np.asarray(bytearray(resource.read(), dtype="uint8"))
        frame = cv2.imdecode(image, cv2.IMREAD_COLOR)
        
        # Model predict
        
        # return message
        
        print(tracker.latest_message)
        dispatcher.utter_message(text="Handled image!", image=None)

        return []
