from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Assuming you have a file named config.py
from config import Config

# Assuming your database and models are in these files
from database import db
from models import Campaign, Recipient

# Assuming your routes are structured in these files
from routes.campaign_routes import campaign_bp
from routes.analytics_routes import analytics_bp

# Load environment variables from .env file
load_dotenv()

def create_app():
    """
    Creates and configures the Flask application.
    This uses the application factory pattern for better organization.
    """
    app = Flask(__name__)
    
    # Configure the app using the Config class
    app.config.from_object(Config)
    
    # Enable CORS for all routes to allow frontend communication
    CORS(app)
    
    # Initialize SQLAlchemy with the Flask app
    db.init_app(app)
    
    # Register blueprints to include routes
    app.register_blueprint(campaign_bp, url_prefix='/api')
    app.register_blueprint(analytics_bp, url_prefix='/api')
    
    # Optional: Add a simple root route for testing
    @app.route('/')
    def index():
        return jsonify({"message": "Welcome to OctopuSends API!"})

    return app

if __name__ == '__main__':
    # Create the app instance
    app = create_app()
    
    # Push an application context to handle database operations outside of requests
    with app.app_context():
        # Create all database tables based on the models
        # This will create tables for Campaign and Recipient
        instance_path = os.path.join(app.root_path, 'instance')
        if not os.path.exists(instance_path):
            os.makedirs(instance_path)

        db.create_all()
    app.run(debug=True)