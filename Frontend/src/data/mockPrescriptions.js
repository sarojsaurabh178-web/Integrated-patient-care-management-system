export const initialPrescriptions = [
  {
    id: "RX001",
    patientId: "PAT001",
    patientName: "Rahul Sharma",
    doctor: "Dr. Priya Sharma",
    medicine: "Paracetamol 500mg",
    dosage: "1 tablet after meals (Twice daily)",
    duration: "5 days",
    date: "2026-08-01",
    notes: "Take with plain water. Avoid cold drinks."
  },
  {
    id: "RX002",
    patientId: "PAT002",
    patientName: "Priya Verma",
    doctor: "Dr. Amit Verma",
    medicine: "Amoxicillin 500mg & Benadryl Syrup",
    dosage: "1 capsule 8-hourly / 10ml syrup at bedtime",
    duration: "7 days",
    date: "2026-08-03",
    notes: "Complete 7-day antibiotic course even if feeling better."
  },
  {
    id: "RX003",
    patientId: "PAT003",
    patientName: "Amit Patel",
    doctor: "Dr. Neha Singh",
    medicine: "Ibuprofen 400mg & Volini Gel",
    dosage: "1 tablet as needed after food / Apply gel 3 times daily",
    duration: "5 days",
    date: "2026-08-05",
    notes: "Do not apply gel on broken skin."
  }
];

/**
 * Helper to generate next unique Prescription ID (e.g., RX004)
 */
export const generateNextPrescriptionId = (prescriptions = []) => {
  let maxNum = 0;
  prescriptions.forEach((p) => {
    if (p.id && p.id.startsWith("RX")) {
      const num = parseInt(p.id.replace("RX", ""), 10);
      if (!isNaN(num) && num > maxNum) maxNum = num;
    }
  });
  return `RX${String(maxNum + 1).padStart(3, "0")}`;
};
