export const initialConsultations = [
  {
    id: "CNS001",
    patientId: "PAT001",
    patientName: "Rahul Sharma",
    doctor: "Dr. Priya Sharma",
    symptoms: "High fever (101°F), severe headache, and body aches for past 2 days.",
    diagnosis: "Acute Viral Fever with mild dehydration.",
    treatment: "Oral rehydration, antipyretic medication, and 3 days bed rest.",
    date: "2026-08-01"
  },
  {
    id: "CNS002",
    patientId: "PAT002",
    patientName: "Priya Verma",
    doctor: "Dr. Amit Verma",
    symptoms: "Dry cough, throat irritation, and mild difficulty in swallowing.",
    diagnosis: "Upper Respiratory Tract Infection (URTI).",
    treatment: "Warm saline gargles, cough suppressant syrup, and steam inhalation.",
    date: "2026-08-03"
  },
  {
    id: "CNS003",
    patientId: "PAT003",
    patientName: "Amit Patel",
    doctor: "Dr. Neha Singh",
    symptoms: "Right knee pain following physical exertion and mild swelling.",
    diagnosis: "Ligament strain (Mild right knee effusion).",
    treatment: "RICE protocol (Rest, Ice, Compression, Elevation) and topical analgesic gel.",
    date: "2026-08-05"
  }
];

/**
 * Helper to generate next unique Consultation ID (e.g., CNS004)
 */
export const generateNextConsultationId = (consultations = []) => {
  let maxNum = 0;
  consultations.forEach((c) => {
    if (c.id && c.id.startsWith("CNS")) {
      const num = parseInt(c.id.replace("CNS", ""), 10);
      if (!isNaN(num) && num > maxNum) maxNum = num;
    }
  });
  return `CNS${String(maxNum + 1).padStart(3, "0")}`;
};
