from sqlalchemy.orm import Session
from app.models.notification import Notification
from typing import List, Optional

class NotificationRepository:
    @staticmethod
    def get_all(db: Session, recipient_id: Optional[str] = None) -> List[Notification]:
        query = db.query(Notification)
        if recipient_id:
            query = query.filter(Notification.recipient_id == recipient_id)
        return query.order_by(Notification.created_at.desc()).all()

    @staticmethod
    def get_by_id(db: Session, notif_id: str) -> Optional[Notification]:
        return db.query(Notification).filter(Notification.id == notif_id).first()

    @staticmethod
    def create(db: Session, data: dict) -> Notification:
        count = db.query(Notification).count()
        notif_id = data.get("id") or f"NOTIF-{count + 101}"
        db_notif = Notification(
            id=notif_id,
            recipient_id=data.get("recipientId", "P101"),
            recipient_name=data.get("recipientName", "Patient"),
            type=data.get("type", "Appointment Reminder"),
            channel=data.get("channel", "In-App & SMS"),
            message=data["message"],
            status=data.get("status", "Sent")
        )
        db.add(db_notif)
        db.commit()
        db.refresh(db_notif)
        return db_notif

    @staticmethod
    def mark_read(db: Session, notif_id: str) -> Optional[Notification]:
        notif = db.query(Notification).filter(Notification.id == notif_id).first()
        if notif:
            notif.status = "Read"
            db.commit()
            db.refresh(notif)
        return notif
