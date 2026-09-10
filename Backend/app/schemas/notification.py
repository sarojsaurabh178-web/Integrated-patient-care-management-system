from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, Union
from datetime import datetime


class NotificationCreate(BaseModel):
    recipientId: str = Field(alias="recipient_id")
    recipientName: Optional[str] = Field("Patient", alias="recipient_name")
    type: Optional[str] = "Appointment Reminder"
    channel: Optional[str] = "In-App & SMS"
    message: str

    model_config = ConfigDict(populate_by_name=True)


class NotificationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: str
    recipientId: str = Field(alias="recipient_id")
    recipientName: str = Field(alias="recipient_name")
    type: str
    channel: str
    message: str
    status: str
    createdAt: Optional[Union[datetime, str]] = Field(None, alias="created_at")
