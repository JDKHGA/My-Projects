from datetime import datetime, timedelta
import jwt
from quiz import db, login_manager, app
from flask_login import UserMixin


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    image_file = db.Column(db.String(20), nullable=False, default='default.jpg')
    password = db.Column(db.String(60), nullable=False)

    def get_reset_token(self, expires_sec=1800):
        # Set the expiration time for the token (30 minutes by default)
        expires_at = datetime.utcnow() + timedelta(seconds=expires_sec)

        # Create a payload containing the user_id and expiration time
        payload = {
            'user_id': self.id,
            'exp': expires_at
        }

        # Generate the JWT token with the payload and app's secret key
        token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')
        return token

    @staticmethod
    def verify_reset_token(token):
        try:
            # Decode the JWT token using the app's secret key
            payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            user_id = payload['user_id']
        except jwt.ExpiredSignatureError:
            # Token has expired
            return None
        except jwt.InvalidTokenError:
            # Invalid token
            return None

        return User.query.get(user_id)


def __repr__(self):
    return f"User('{self.username}', '{self.email}', '{self.image_file}')"

