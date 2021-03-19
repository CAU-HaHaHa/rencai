本项目为毕业实习项目后端程序，用于访问数据库并向前端返回数据，不提供前端功能

本项目需要安装的python第三方库为：
pymysql          # 连接mysql数据库
flask            # flask服务器
flask_script     # 用于命令行启动服务器
flask_sqlalchemy # flask服务器对接mysql数据库
flask_cors       # 配置跨域

服务器的数据库连接字符串定义在mysql/mysql_config.py中

快速开始对于该项目的应用请看views/demo.py中的对于路由截取的部分，
以及models/demo.py对于数据库数据项内容的部分

Windows下运行，在项目的目录下使用
    python main.py runserver
命令启动服务器
也可以双击start.bat 启动服务器

linux下运行，在项目的目录下使用
python3 main.py runserver
或者 sh start.sh 启动服务器
