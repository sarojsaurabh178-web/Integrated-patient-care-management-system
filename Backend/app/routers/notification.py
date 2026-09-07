from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.schemas.notification import NotificationCreate, NotificationResponse
from app.services.notification_service import NotificationService
from app.middlewares.auth import get_current_user, require_roles

router = APIRouter(prefix="/notifications", tags=["Notification Subsystem"])

@router.get("", response_model=List[NotificationResponse])
def get_notifications(
    recipientId: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    return NotificationService.get_all_notifications(db, recipient_id=recipientId)

@router.post("/send", response_model=NotificationResponse, status_code=201)
def send_notification(
    data: NotificationCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_roles("Admin", "Doctor"))
):
    return NotificationService.send_notification(db, data)

@router.put("/{notif_id}/read", response_model=NotificationResponse)
def mark_read(
    notif_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    return NotificationService.mark_read(db, notif_id)
