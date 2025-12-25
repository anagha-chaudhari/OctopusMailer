from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import os

from config import Config

from database import db
from models import Campaign, Recipient

from routes.campaign_routes import campaign_bp
from routes.analytics_routes import analytics_bp
from routes.openai_routes import openai_bp

load_dotenv()

def create_app():
    
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app)
    
    db.init_app(app)
    
    app.register_blueprint(campaign_bp, url_prefix='/api')
    app.register_blueprint(analytics_bp, url_prefix='/api')
    app.register_blueprint(openai_bp, url_prefix='/api')
    
    @app.route('/')
    def index():
        return jsonify({"message": "Welcome to OctopuSends API!"})

    return app

if __name__ == '__main__':
    app = create_app() 
    with app.app_context():
        instance_path = os.path.join(app.root_path, 'instance')
        if not os.path.exists(instance_path):
            os.makedirs(instance_path)

        db.create_all()
    app.run(debug=True)
