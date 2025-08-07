from flask import Blueprint, jsonify, send_from_directory, request, redirect
from services.analytics_service import get_overall_analytics
from models import db, Recipient
import os

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/analytics', methods=['GET'])
def analytics():
    data = get_overall_analytics()
    return jsonify(data)

@analytics_bp.route('/track_open/<int:campaign_id>/<string:recipient_email>')
def track_open(campaign_id, recipient_email):
    try:
        recipient = Recipient.query.filter_by(
            campaign_id=campaign_id,
            email=recipient_email
        ).first()

        if recipient and not recipient.opened:
            recipient.opened = True
            db.session.commit()
            
    except Exception as e:
        print(f"Error tracking open: {e}")

    return send_from_directory('static', '1x1.gif', mimetype='image/gif')

@analytics_bp.route('/track_click/<int:campaign_id>/<string:recipient_email>')
def track_click(campaign_id, recipient_email):
    url = request.args.get('url')
    try:
        recipient = Recipient.query.filter_by(
            campaign_id=campaign_id,
            email=recipient_email
        ).first()
        if recipient and not recipient.clicked:
            recipient.clicked = True
            db.session.commit()
    except Exception as e:
        print(f"Error tracking click: {e}")
    return redirect(url or '/')