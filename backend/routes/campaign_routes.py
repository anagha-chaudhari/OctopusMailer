from flask import Blueprint, request, jsonify
from services.email_service import send_bulk_email, process_csv_recipients
from database import db
from models import Campaign, Recipient
import tempfile
import os

campaign_bp = Blueprint('campaign_bp', __name__)

@campaign_bp.route('/send_campaign', methods=['POST'])
def send_campaign():
    data = request.get_json()
    campaign_name = data.get('campaignName')
    subject_line = data.get('subjectLine')
    email_html = data.get('emailHTML')
    recipients_list = data.get('recipients')

    if not all([campaign_name, subject_line, email_html, recipients_list]):
        return jsonify({"success": False, "message": "Missing required data"}), 400

    # Create a new campaign entry in the database
    new_campaign = Campaign(name=campaign_name, subject=subject_line, html_content=email_html)
    db.session.add(new_campaign)
    db.session.commit()

    # Add recipients to the database
    for email in recipients_list:
        new_recipient = Recipient(email=email, campaign_id=new_campaign.id)
        db.session.add(new_recipient)
    db.session.commit()

    # Send emails in the background (for simplicity, we'll do it synchronously here)
    success, message = send_bulk_email(new_campaign, subject_line, email_html, recipients_list)

    if success:
        return jsonify({"success": True, "message": message}), 200
    else:
        return jsonify({"success": False, "message": message}), 500

@campaign_bp.route('/upload_recipients', methods=['POST'])
def upload_recipients():
    if 'file' not in request.files:
        return jsonify({"success": False, "message": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"success": False, "message": "No selected file"}), 400

    if file and file.filename.endswith('.csv'):
        try:
            # Save the file temporarily
            temp_dir = tempfile.gettempdir()
            file_path = os.path.join(temp_dir, file.filename)
            file.save(file_path)

            # Process the CSV file
            recipients, count = process_csv_recipients(file_path)

            # Clean up the temporary file
            os.remove(file_path)

            if isinstance(recipients, list):
                # Store recipients in a global variable for the current session
                # In a real app, you would handle this more securely
                return jsonify({"success": True, "recipients": recipients, "count": count}), 200
            else:
                return jsonify({"success": False, "message": count}), 400
        except Exception as e:
            return jsonify({"success": False, "message": str(e)}), 500