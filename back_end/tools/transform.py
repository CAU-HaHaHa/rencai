from datetime import datetime


def idcard2ages(idcard):
    if len(idcard) != 18:
        raise Exception("idcard2ages error: length must be 18")
    try:
        birthday = datetime.strptime(str(idcard[6:14]), '%Y%m%d')
    except:
        raise Exception("idcard2ages error: idcard number is invalid")
    nowtime = datetime.now()
    years = int((nowtime - birthday).days / 365)
    return years
