from fastapi import APIRouter, Depends, Query, Response
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.analytics import DashboardMetricsResponse
from app.services.analytics_service import AnalyticsService
from app.middlewares.auth import require_roles
from datetime import datetime

router = APIRouter(prefix="/analytics", tags=["Executive Analytics & Reports"])

@router.get("/dashboard", response_model=DashboardMetricsResponse)
def get_dashboard_metrics(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_roles("Admin", "Doctor"))
):
    return AnalyticsService.get_dashboard_metrics(db)

@router.get("/reports/csv")
def export_csv_report(
    type: str = Query("appointments", pattern="^(appointments|patients)$"),
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_roles("Admin", "Doctor"))
):
    csv_content = AnalyticsService.export_csv(db, type)
    filename = f"meditrack_{type}_report_{int(datetime.now().timestamp())}.csv"
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )

@router.get("/reports/pdf")
def export_html_report(
    type: str = Query("monthly"),
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_roles("Admin", "Doctor"))
):
    html_content = AnalyticsService.export_html(db, type)
    return Response(content=html_content, media_type="text/html")
