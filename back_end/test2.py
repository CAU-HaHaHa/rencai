import smtplib
from email.mime.text import MIMEText
from email.header import Header

mail_host = "smtp.qq.com"  # 设置的邮件服务器host必须是发送邮箱的服务器，与接收邮箱无关。
mail_user = "1967527237"  # qq邮箱登陆名
mail_pass = "clyniqpikscybihe"  # 开启stmp服务的时候并设置的授权码，注意！不是QQ密码。

sender = '1967527237@qq.com'  # 发送方qq邮箱
receivers = ['1967527237@qq.com']  # 接收方qq邮箱

message = MIMEText('测试发送 python 邮件', 'plain', 'utf-8')
message['From'] = Header("zjx", 'utf-8')  # 设置显示在邮件里的发件人
message['To'] = Header("user", 'utf-8')  # 设置显示在邮件里的收件人

subject = 'python smtp email test'
message['Subject'] = Header(subject, 'utf-8')  # 设置主题和格式

try:
    smtpobj = smtplib.SMTP_SSL(mail_host, 465)  # 本地如果有本地服务器，则用localhost ,默认端口２５,腾讯的（端口465或587）
    smtpobj.set_debuglevel(1)
    smtpobj.login(mail_user, mail_pass)  # 登陆QQ邮箱服务器
    smtpobj.sendmail(sender, receivers, message.as_string())  # 发送邮件
    print("邮件发送成功")
    smtpobj.quit()  # 退出
except smtplib.SMTPException as e:
    print("Error:无法发送邮件")
    print(e)