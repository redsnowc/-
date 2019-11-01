import sys
import os


# 生成数据库连接 (SQLite)
from model import User


def create_database_uri():
    basedir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
    if sys.platform.startswith("win"):
        return "sqlite:///" + os.path.join(basedir, "data.db")
    return "sqlite:////" + os.path.join(basedir, "data.db")
