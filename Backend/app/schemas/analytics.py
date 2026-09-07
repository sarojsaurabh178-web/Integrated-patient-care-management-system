from pydantic import BaseModel
from typing import Dict, List, Any

class OverviewMetrics(BaseModel):
    totalPatients: int
    totalAppointments: int
    completedAppointments: int
    scheduledAppointments: int
    cancelledAppointments: int
    pendingAppointments: int
    totalConsultations: int
    totalPrescriptions: int

class Demographics(BaseModel):
    ageGroups: Dict[str, int]
    gender: Dict[str, int]

class DoctorStat(BaseModel):
    doctor: str
    consultationsCount: int

class VisitTrend(BaseModel):
    day: str
    visits: int

class DashboardMetricsResponse(BaseModel):
    overview: OverviewMetrics
    patientDemographics: Demographics
    doctorConsultationStats: List[DoctorStat]
    visitTrends: List[VisitTrend]
