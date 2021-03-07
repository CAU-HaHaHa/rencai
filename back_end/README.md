本项目为毕业实习项目后端程序，用于访问数据库并向前端返回数据，不提供前端功能

本项目需要安装的python第三方库为：
pymysql
flask
flask_script
flask_sqlalchemy

服务器的数据库连接字符串定义在mysql/mysql_config.py中

快速开始对于该项目的应用请看views/demo.py中的对于路由截取的部分，
以及models/demo.py对于数据库数据项内容的部分

运行方式，在项目的目录下使用
    python main.py runserver
命令启动服务器
也可以双击start.bat 启动服务器

注：
自带的flask服务器对于并发处理弱
Linux下可以使用Gunicorn服务器
