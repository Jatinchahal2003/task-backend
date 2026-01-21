from flask import Flask
from extensions import db, jwt
from tasks import tasks_bp
from flask_cors import CORS
app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = "super-secret-key"

CORS(app)

db.init_app(app)
jwt.init_app(app)

from models import User, Task
from auth import auth_bp

app.register_blueprint(auth_bp)
app.register_blueprint(tasks_bp)

@app.route("/")
def home():
    return {"message": "Backend is running"}

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(host="0.0.0.0", port=5000)