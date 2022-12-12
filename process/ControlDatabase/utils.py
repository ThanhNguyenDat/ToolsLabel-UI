
def list2str(lst: list) -> str:
    s = ""
    for i in lst:
        s = s + ", " + i
    s = s[2:]
    return s


def check_key(dct, key):
    if key in dct:
        return dct[key]
    return None
