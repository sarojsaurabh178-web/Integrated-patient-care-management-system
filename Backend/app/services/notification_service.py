from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.repositories.notification_repository import NotificationRepository
from app.schemas.notification import NotificationCreate
from typing import Optional

class NotificationService:
    @staticmethod
    def get_all_notifications(db: Session, recipient_id: Optional[str] = None):
        return NotificationRepository.get_all(db, recipient_id=recipient_id)

    @staticmethod
    def send_notification(db: Session, data: NotificationCreate):
        return NotificationRepository.create(db, data.model_dump())

    @staticmethod
    def mark_read(db: Session, notif_id: str):
        notif = NotificationRepository.mark_read(db, notif_id)
        if not notif:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Notification {notif_id} not found.")
        return notif
