from email.mime.multipart import MIMEMultipart
from tools.mail.mailAssembler import MailAssembler
from tools.mail.mailSender import MailSender

import string
import random


class Sendcheck:
    def __init__(self, config):
        self.subject = "验证您的邮箱"
        self.from_name = "哈哈哈的研究小组"
        self.from_mail = config["from_mail"]
        self.to_mail = config["to_mail"]
        self.imgbody = '''
        <h2>验证您的邮箱</h2>
        感谢您注册员工信息管理系统，请点击下面的链接以激活邮箱
        '''
        str_list = [random.choice(string.digits + string.ascii_letters) for i in range(230)]
        random_str = ''.join(str_list)
        link = config["host_ip"] + ":" + config["host_port"] + "/check/personemail?valid=" + random_str
        self.imgbody = self.imgbody + link
        self.smtpserver = "smtp.qq.com"
        self.smtpport = 465
        self.password = config["mail_password"]  # 授权码
        self.random_str = random_str

    def send(self):
        msg = MIMEMultipart()
        assembler = MailAssembler()
        sender = MailSender(self.smtpserver, self.smtpport, self.password, self.from_mail, self.to_mail)
        assembler.attachAttributes(msg, self.subject, self.from_name, self.from_mail, self.to_mail)
        assembler.attachBody(msg, self.imgbody, "html")
        sender.sendMail(msg)
        return self.random_str
