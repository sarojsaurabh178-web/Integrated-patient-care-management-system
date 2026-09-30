from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
from pydantic import BaseModel, ConfigDict, Field
from app.database import get_db
from app.models.hospital_bed import Hospital, HospitalBed

router = APIRouter(prefix="/hospital-management", tags=["Hospital Information & Bed Telemetry"])

class HospitalInfoUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    contactNumber: Optional[str] = Field(None, alias="contact_number")
    emergencyNumber: Optional[str] = Field(None, alias="emergency_number")
    email: Optional[str] = None
    website: Optional[str] = None
    operatingHours: Optional[str] = Field(None, alias="operating_hours")
    description: Optional[str] = None

    model_config = ConfigDict(populate_by_name=True)

class BedCreate(BaseModel):
    bedNumber: str = Field(alias="bed_number")
    ward: str
    type: str # ICU | General Ward | Emergency | Pediatric
    floor: Optional[str] = "Ground Floor"
    status: Optional[str] = "Available" # Available | Occupied | Reserved | Under Maintenance
    patientId: Optional[str] = Field(None, alias="patient_id")
    patientName: Optional[str] = Field(None, alias="patient_name")
    notes: Optional[str] = None

    model_config = ConfigDict(populate_by_name=True)

class BedUpdate(BaseModel):
    bedNumber: Optional[str] = Field(None, alias="bed_number")
    ward: Optional[str] = None
    type: Optional[str] = None
    floor: Optional[str] = None
    status: Optional[str] = None # Available | Occupied | Reserved | Under Maintenance
    patientId: Optional[str] = Field(None, alias="patient_id")
    patientName: Optional[str] = Field(None, alias="patient_name")
    notes: Optional[str] = None

    model_config = ConfigDict(populate_by_name=True)

def bed_to_dict(bed: HospitalBed) -> Dict[str, Any]:
    return {
        "id": bed.id,
        "bedNumber": bed.bed_number,
        "ward": bed.ward,
        "type": bed.type,
        "floor": bed.floor,
        "status": bed.status,
        "patientId": bed.patient_id,
        "patientName": bed.patient_name,
        "notes": bed.notes,
        "updatedAt": bed.updated_at.isoformat() if bed.updated_at else None
    }

@router.get("/info", summary="Get Hospital Information & Real-time Bed Availability Statistics")
def get_hospital_info(db: Session = Depends(get_db)):
    hospital = db.query(Hospital).first()
    if not hospital:
        # Default initialize if table empty
        hospital = Hospital(
            id="HOSP-01",
            name="CareHub Regional Medical Center & Institute",
            address="Connaught Place Health Zone, New Delhi, Delhi 110001",
            contact_number="+91 11 4123 9000",
            emergency_number="1066",
            email="carehub.delhi@meditrack.org",
            website="https://carehub-meditrack.org",
            operating_hours="24 Hours Open (Emergency & Trauma Active)",
            description="Premier tertiary-care teaching hospital and research institute with accredited trauma and ICU centers."
        )
        db.add(hospital)
        db.commit()
        db.refresh(hospital)

    # Calculate real bed capacity & occupancy from PostgreSQL database records
    all_beds = db.query(HospitalBed).all()
    total_beds = len(all_beds)
    occupied_beds = len([b for b in all_beds if b.status == "Occupied"])
    available_beds = len([b for b in all_beds if b.status == "Available"])
    reserved_beds = len([b for b in all_beds if b.status == "Reserved"])
    maintenance_beds = len([b for b in all_beds if b.status == "Under Maintenance"])

    # Breakdown by Ward Type
    def ward_stats(bed_type: str):
        type_beds = [b for b in all_beds if b.type.lower() == bed_type.lower() or bed_type.lower() in b.type.lower()]
        total = len(type_beds)
        avail = len([b for b in type_beds if b.status == "Available"])
        occ = len([b for b in type_beds if b.status == "Occupied"])
        return {
            "total": total,
            "available": avail,
            "occupied": occ,
            "occupancyRate": round((occ / total * 100), 1) if total > 0 else 0
        }

    icu_stats = ward_stats("ICU")
    general_stats = ward_stats("General Ward")
    emergency_stats = ward_stats("Emergency")
    pediatric_stats = ward_stats("Pediatric")

    overall_occupancy = round((occupied_beds / total_beds * 100), 1) if total_beds > 0 else 0

    return {
        "status": "success",
        "hospital": {
            "id": hospital.id,
            "name": hospital.name,
            "address": hospital.address,
            "contactNumber": hospital.contact_number,
            "emergencyNumber": hospital.emergency_number,
            "email": hospital.email,
            "website": hospital.website,
            "operatingHours": hospital.operating_hours,
            "description": hospital.description,
            "updatedAt": hospital.updated_at.isoformat() if hospital.updated_at else None
        },
        "bedTelemetry": {
            "isVerified": True,
            "source": "CareHub Integrated Bed Registry (PostgreSQL Engine)",
            "lastCalculated": datetime.now(timezone.utc).isoformat(),
            "metrics": {
                "totalBeds": total_beds,
                "occupiedBeds": occupied_beds,
                "availableBeds": available_beds,
                "reservedBeds": reserved_beds,
                "maintenanceBeds": maintenance_beds,
                "occupancyRatePercent": overall_occupancy,
                "hasAvailableBeds": available_beds > 0
            },
            "breakdown": {
                "icu": icu_stats,
                "generalWard": general_stats,
                "emergency": emergency_stats,
                "pediatric": pediatric_stats
            }
        }
    }

@router.put("/info", summary="Update Hospital Information (Admin Only)")
def update_hospital_info(payload: HospitalInfoUpdate, db: Session = Depends(get_db)):
    hospital = db.query(Hospital).first()
    if not hospital:
        hospital = Hospital(id="HOSP-01", name="CareHub Regional Medical Center & Institute", address="", contact_number="")
        db.add(hospital)

    update_data = payload.model_dump(exclude_unset=True)
    mapping = {
        "name": "name",
        "address": "address",
        "contactNumber": "contact_number",
        "emergencyNumber": "emergency_number",
        "email": "email",
        "website": "website",
        "operatingHours": "operating_hours",
        "description": "description"
    }
    for k, v in update_data.items():
        if v is not None and k in mapping:
            setattr(hospital, mapping[k], v)

    hospital.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(hospital)

    return {
        "status": "success",
        "message": "Hospital profile updated successfully.",
        "hospital": {
            "id": hospital.id,
            "name": hospital.name,
            "address": hospital.address,
            "contactNumber": hospital.contact_number,
            "emergencyNumber": hospital.emergency_number,
            "email": hospital.email,
            "website": hospital.website,
            "operatingHours": hospital.operating_hours,
            "description": hospital.description
        }
    }

@router.get("/beds", summary="List Hospital Beds with Ward, Type & Status Filters")
def get_all_beds(
    ward: Optional[str] = Query(None),
    bed_type: Optional[str] = Query(None, alias="type"),
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(HospitalBed)
    if ward and ward != "All":
        query = query.filter(HospitalBed.ward.ilike(f"%{ward}%"))
    if bed_type and bed_type != "All":
        query = query.filter(HospitalBed.type.ilike(f"%{bed_type}%"))
    if status and status != "All":
        query = query.filter(HospitalBed.status.ilike(status))
    if search:
        s = f"%{search}%"
        query = query.filter(
            (HospitalBed.bed_number.ilike(s)) |
            (HospitalBed.ward.ilike(s)) |
            (HospitalBed.patient_name.ilike(s))
        )
    beds = query.order_by(HospitalBed.ward, HospitalBed.bed_number).all()
    return [bed_to_dict(b) for b in beds]

@router.post("/beds", status_code=201, summary="Register a New Hospital Bed")
def create_bed(payload: BedCreate, db: Session = Depends(get_db)):
    # Validate unique bed number to prevent duplicates
    existing = db.query(HospitalBed).filter(HospitalBed.bed_number == payload.bedNumber.strip()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Bed number '{payload.bedNumber}' already exists in ward '{existing.ward}'."
        )

    count = db.query(HospitalBed).count()
    bed_id = f"BED-{payload.type[:3].upper()}-{count + 1:03d}"

    new_bed = HospitalBed(
        id=bed_id,
        bed_number=payload.bedNumber.strip(),
        ward=payload.ward.strip(),
        type=payload.type.strip(),
        floor=payload.floor or "Ground Floor",
        status=payload.status or "Available",
        patient_id=payload.patientId,
        patient_name=payload.patientName,
        notes=payload.notes
    )
    db.add(new_bed)
    db.commit()
    db.refresh(new_bed)
    return {
        "status": "success",
        "message": f"Bed {new_bed.bed_number} created in {new_bed.ward}.",
        "bed": bed_to_dict(new_bed)
    }

@router.put("/beds/{bed_id}", summary="Update Bed Status, Ward or Patient Assignment")
def update_bed(bed_id: str, payload: BedUpdate, db: Session = Depends(get_db)):
    bed = db.query(HospitalBed).filter((HospitalBed.id == bed_id) | (HospitalBed.bed_number == bed_id)).first()
    if not bed:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Bed with ID or Number '{bed_id}' not found."
        )

    update_data = payload.model_dump(exclude_unset=True)
    if "bedNumber" in update_data and update_data["bedNumber"] != bed.bed_number:
        # Check uniqueness if bed number is modified
        dup = db.query(HospitalBed).filter(HospitalBed.bed_number == update_data["bedNumber"], HospitalBed.id != bed.id).first()
        if dup:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Bed number '{update_data['bedNumber']}' is already assigned."
            )
        bed.bed_number = update_data["bedNumber"]

    if "ward" in update_data and update_data["ward"]: bed.ward = update_data["ward"]
    if "type" in update_data and update_data["type"]: bed.type = update_data["type"]
    if "floor" in update_data and update_data["floor"]: bed.floor = update_data["floor"]
    if "status" in update_data and update_data["status"]:
        bed.status = update_data["status"]
        # If status set to Available or Maintenance, clear patient assignment unless explicitly provided
        if bed.status in ["Available", "Under Maintenance"] and "patientName" not in update_data:
            bed.patient_id = None
            bed.patient_name = None
    if "patientId" in update_data: bed.patient_id = update_data["patientId"]
    if "patientName" in update_data: bed.patient_name = update_data["patientName"]
    if "notes" in update_data: bed.notes = update_data["notes"]

    bed.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(bed)

    return {
        "status": "success",
        "message": f"Bed {bed.bed_number} updated to status '{bed.status}'.",
        "bed": bed_to_dict(bed)
    }

@router.delete("/beds/{bed_id}", summary="Delete Bed Record (Admin Only)")
def delete_bed(bed_id: str, db: Session = Depends(get_db)):
    bed = db.query(HospitalBed).filter((HospitalBed.id == bed_id) | (HospitalBed.bed_number == bed_id)).first()
    if not bed:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Bed '{bed_id}' not found."
        )
    bed_num = bed.bed_number
    db.delete(bed)
    db.commit()
    return {
        "status": "success",
        "message": f"Bed record '{bed_num}' deleted successfully."
    }
