export const doctors = [
  { id: "DOC001", name: "Dr. Ananya Roy", department: "Cardiology", room: "OPD 102", status: "On Duty" },
  { id: "DOC002", name: "Dr. Rajesh Kumar", department: "Orthopedics", room: "OPD 204", status: "On Duty" },
  { id: "DOC003", name: "Dr. Priya Sharma", department: "Pediatrics", room: "OPD 108", status: "On Duty" },
  { id: "DOC004", name: "Dr. Vikram Malhotra", department: "Neurology", room: "OPD 301", status: "In Surgery" },
  { id: "DOC005", name: "Dr. Kavita Desai", department: "General Medicine", room: "OPD 105", status: "On Duty" }
];

export const initialAppointments = [
  {
    id: "APT001",
    patientId: "PAT001",
    patientName: "Rahul Sharma",
    doctorId: "DOC001",
    doctorName: "Dr. Ananya Roy",
    department: "Cardiology",
    date: "2026-08-09",
    time: "10:30 AM",
    type: "General Checkup",
    status: "Scheduled",
    reason: "Routine cardiac screening and blood pressure check."
  },
  {
    id: "APT002",
    patientId: "PAT002",
    patientName: "Priya Verma",
    doctorId: "DOC003",
    doctorName: "Dr. Priya Sharma",
    department: "Pediatrics",
    date: "2026-08-09",
    time: "11:45 AM",
    type: "Consultation",
    status: "Completed",
    reason: "Seasonal allergy evaluation."
  },
  {
    id: "APT003",
    patientId: "PAT003",
    patientName: "Amit Patel",
    doctorId: "DOC002",
    doctorName: "Dr. Rajesh Kumar",
    department: "Orthopedics",
    date: "2026-08-10",
    time: "02:15 PM",
    type: "Follow-up",
    status: "Scheduled",
    reason: "Post-fracture joint mobility checkup."
  },
  {
    id: "APT004",
    patientId: "PAT004",
    patientName: "Sneha Reddy",
    doctorId: "DOC005",
    doctorName: "Dr. Kavita Desai",
    department: "General Medicine",
    date: "2026-08-11",
    time: "04:00 PM",
    type: "Consultation",
    status: "Scheduled",
    reason: "Thyroid blood report review."
  }
];

export const generateNextAppointmentId = (appointments = []) => {
  let maxIdNum = 0;
  appointments.forEach((apt) => {
    if (apt.id && apt.id.startsWith("APT")) {
      const numStr = apt.id.replace("APT", "");
      const num = parseInt(numStr, 10);
      if (!isNaN(num) && num > maxIdNum) {
        maxIdNum = num;
      }
    }
  });
  const nextNum = maxIdNum + 1;
  return `APT${String(nextNum).padStart(3, "0")}`;
};
