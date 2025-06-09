
import firebase_admin
from firebase_admin import auth, credentials

cred = credentials.Certificate("firebase_config.json")
firebase_admin.initialize_app(cred)

def verify_token(id_token):
    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token['uid']  
    except Exception as e:
        print(f"Invalid token: {e}")
        return None
