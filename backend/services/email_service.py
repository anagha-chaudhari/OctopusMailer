import smtplib
import ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
from flask import current_app, url_for
import re
import pandas as pd
import uuid

def send_bulk_email(campaign, subject, html_content, recipients):
    context = ssl.create_default_context()
    smtp_server = current_app.config['SMTP_SERVER']
    smtp_port = current_app.config['SMTP_PORT']
    smtp_username = current_app.config['SMTP_USERNAME']
    smtp_password = current_app.config['SMTP_PASSWORD']
    sender_email = current_app.config['SENDER_EMAIL']

    try:
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls(context=context)
            server.login(smtp_username, smtp_password)

            for recipient in recipients:
                # Insert tracking elements before sending
                tracked_html = insert_tracking_pixel(html_content, campaign.id, recipient)
                tracked_html = track_links(tracked_html, campaign.id, recipient)

                msg = MIMEMultipart("alternative")
                msg["Subject"] = subject
                msg["From"] = sender_email
                msg["To"] = recipient

                # Attach HTML content
                msg.attach(MIMEText(tracked_html, "html"))


                server.sendmail(sender_email, recipient, msg.as_string())
        return True, "Emails sent successfully."
    except Exception as e:
        current_app.logger.error(f"Error sending email: {e}")
        return False, str(e)

def insert_tracking_pixel(html, campaign_id, recipient_email):
    # Generate the tracking URL for the pixel
    pixel_url = url_for('analytics.track_open', campaign_id=campaign_id, recipient_email=recipient_email, _external=True)
    pixel_html = f'<img src="{pixel_url}" alt="" width="1" height="1" style="display: none;">'

    # Insert the pixel just before the closing body tag
    return html.replace("</body>", f"{pixel_html}</body>")

def track_links(html, campaign_id, recipient_email):
    # Find all href attributes in anchor tags
    def replace_link(match):
        original_url = match.group(1)
        # Encode URL to prevent issues with special characters
        tracked_url = url_for('analytics.track_click', campaign_id=campaign_id, recipient_email=recipient_email, url=original_url, _external=True)
        return f'href="{tracked_url}"'

    return re.sub(r'href="([^"]+)"', replace_link, html)

def process_csv_recipients(file_path):
    try:
        df = pd.read_csv(file_path)
        # Assuming the CSV has a column named 'email'
        recipients = df['email'].tolist()
        return recipients, len(recipients)
    except Exception as e:
        return None, str(e)