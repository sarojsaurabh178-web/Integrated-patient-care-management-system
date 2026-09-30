from fastapi import APIRouter, Query, HTTPException, status
from typing import Optional, Dict, Any
from app.services.hospital_service import HospitalService

router = APIRouter(prefix="/hospitals", tags=["Nearby Hospitals & Healthcare Locator"])

@router.get("/nearby", summary="Search Nearby Hospitals & Healthcare Facilities")
def get_nearby_hospitals(
    lat: Optional[float] = Query(None, description="User Latitude (from Geolocation API)"),
    lon: Optional[float] = Query(None, description="User Longitude (from Geolocation API)"),
    radius_km: float = Query(10.0, ge=1.0, le=100.0, description="Search radius in kilometers (e.g. 2, 5, 10, 20, 50)"),
    query: Optional[str] = Query(None, description="Manual search query (City, Locality, PIN Code, or Hospital Name)")
) -> Dict[str, Any]:
    """
    Search for verified nearby hospitals, emergency centers, clinics, and ICUs.
    Supports:
    - GPS Geolocation coordinates (lat, lon)
    - Manual location geocoding (City, PIN code, locality, or hospital name)
    - Great-circle Haversine distance calculation and sorting
    - Real-time verified bed telemetry for CareHub network, with clear notice for external unverified facilities
    """
    try:
        return HospitalService.get_nearby_hospitals(
            lat=lat,
            lon=lon,
            radius_km=radius_km,
            query=query
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch nearby hospitals: {str(e)}"
        )

@router.get("/emergency/hotlines", summary="Emergency Healthcare Hotlines & Services")
def get_emergency_hotlines() -> Dict[str, Any]:
    """
    Returns verified national and regional emergency healthcare contact numbers
    (Ambulance, National Health Helpline, Women Helpline, Disaster Management).
    """
    return {
        "emergency_services": [
            {"name": "National Ambulance Service", "number": "108", "type": "Ambulance", "available": "24/7"},
            {"name": "CareHub Emergency Network", "number": "1066", "type": "Emergency Trauma", "available": "24/7"},
            {"name": "National Health Helpline", "number": "1075", "type": "Medical Advice", "available": "24/7"},
            {"name": "Disaster Management & Rescue", "number": "1077", "type": "Disaster / Trauma", "available": "24/7"},
            {"name": "Police / Emergency Response", "number": "112", "type": "Unified Emergency", "available": "24/7"}
        ]
    }

@router.get("/{hospital_id}", summary="Get Detailed Hospital Profile & Bed Telemetry")
def get_hospital_details(hospital_id: str) -> Dict[str, Any]:
    """
    Retrieves detailed hospital profile, contact numbers, services, navigation coordinates,
    and verified bed availability status.
    """
    hospital = HospitalService.get_hospital_by_id(hospital_id)
    if not hospital:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Hospital with ID '{hospital_id}' not found."
        )
    return {
        "status": "success",
        "hospital": hospital
    }
