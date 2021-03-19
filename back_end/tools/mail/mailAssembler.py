from email.header import Header
from email.mime.base import MIMEBase
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
from email import encoders


class MailAssembler:
    def attachAttributes(self, msg, subject, from_name, from_mail, to_mail, cc_mail=None):
        msg["Subject"] = Header(subject, "utf-8")
        msg["From"] = Header(from_name + " <" + from_mail + ">", "utf-8")
        msg["To"] = Header(to_mail, "utf-8")
        # msg["Cc"] = Header(",".join(cc_mail), "utf-8")

    def attachBody(self, msg, body, type, imgfile=None):
        msgtext = MIMEText(body, type, "utf-8")
        msg.attach(msgtext)

        if imgfile != None:
            try:
                file = open(imgfile, "rb")
                img = MIMEImage(file.read())
                img.add_header("Content-ID", "<image1>")
                msg.attach(img)
            except(Exception) as err:
                print(str(err))
            finally:
                if file in locals():
                    file.close()

    def attachAttachment(self, msg, attfile):
        att = MIMEBase("application", "octet-stream")

        try:
            file = open(attfile, "rb")
            att.set_payload(file.read())
            encoders.encode_base64(att)
        except(Exception) as err:
            print(str(err))
        finally:
            if file in locals():
                file.close()

        if "\\" in attfile:
            list = attfile.split("\\")
            filename = list[len(list) - 1]
        else:
            filename = attfile
        att.add_header("Content-Disposition", "attachment; filename='%s'" % filename)

        msg.attach(att)
