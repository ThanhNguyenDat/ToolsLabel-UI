import numpy as np
from sklearn.metrics import classification_report, confusion_matrix


def calculate_score(label, predict):
    assert len(label) == len(predict), "len(label) == len(predict)"
    r = classification_report(label, predict, output_dict=True)
    c = confusion_matrix(label, predict)
    return {
        'confusion_matrix': c,
        'classification_report': r
    }


# a = np.random.randint(4, size=10)
# b = np.random.randint(4, size=10)
# r = calculate_score(a, b)
# print(r)
