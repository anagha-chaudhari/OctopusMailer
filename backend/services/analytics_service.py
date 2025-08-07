from models import db, Campaign, Recipient
from sqlalchemy import func

def get_overall_analytics():
    total_emails_sent = db.session.query(func.count(Recipient.id)).scalar()
    opened_count = db.session.query(func.count(Recipient.id)).filter_by(opened=True).scalar()
    clicked_count = db.session.query(func.count(Recipient.id)).filter_by(clicked=True).scalar()
    
    open_rate = (opened_count / total_emails_sent) * 100 if total_emails_sent > 0 else 0
    click_rate = (clicked_count / total_emails_sent) * 100 if total_emails_sent > 0 else 0
    
    # Fetch recent campaigns
    recent_campaigns = Campaign.query.order_by(Campaign.sent_at.desc()).limit(5).all()
    recent_data = []
    for campaign in recent_campaigns:
        campaign_recipients_count = Recipient.query.filter_by(campaign_id=campaign.id).count()
        campaign_opens_count = Recipient.query.filter_by(campaign_id=campaign.id, opened=True).count()
        campaign_clicks_count = Recipient.query.filter_by(campaign_id=campaign.id, clicked=True).count()
        
        campaign_open_rate = (campaign_opens_count / campaign_recipients_count) * 100 if campaign_recipients_count > 0 else 0
        campaign_click_rate = (campaign_clicks_count / campaign_recipients_count) * 100 if campaign_recipients_count > 0 else 0
        
        recent_data.append({
            'name': campaign.name,
            'sent_at': campaign.sent_at.strftime('%Y-%m-%d %H:%M'),
            'open_rate': round(campaign_open_rate, 2),
            'click_rate': round(campaign_click_rate, 2)
        })

    return {
        'total_emails_sent': total_emails_sent,
        'open_rate': round(open_rate, 2),
        'click_rate': round(click_rate, 2),
        'recent_campaigns': recent_data
    }