from email.mime.multipart import MIMEMultipart
from tools.mail.mailAssembler import MailAssembler
from tools.mail.mailSender import MailSender

subject = "test report"
from_name = "水云之外"
from_mail = "1967527237@qq.com"
to_mail = ["1967527237@qq.com"]
imgbody = '''
<h3>this is a test</h3>
hello please have a check
'''
# file1 = r"..\test\result.html"
# file2 = r"..\test\result.txt"
# imgfile = r"..\test\result.png"

smtpserver = "smtp.qq.com"
smtpport = 465
password = "clyniqpikscybihe"  # 授权码

msg = MIMEMultipart()
assembler = MailAssembler()
sender = MailSender(smtpserver, smtpport, password, from_mail, to_mail)
assembler.attachAttributes(msg, subject, from_name, from_mail, to_mail)
assembler.attachBody(msg, imgbody, "html")
# assembler.attachAttachment(msg, file1)
# assembler.attachAttachment(msg, file2)
sender.sendMail(msg)

