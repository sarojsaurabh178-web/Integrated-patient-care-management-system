export const initialPatients = [
  {
    id: "PAT001",
    name: "Rahul Sharma",
    age: 24,
    gender: "Male",
    dob: "2000-05-14",
    phone: "9876543210",
    email: "rahul.sharma@example.com",
    address: "Flat 302, Green Meadows Apartment, MG Road, Bengaluru, Karnataka",
    status: "Active",
    registeredAt: "2026-08-01"
  },
  {
    id: "PAT002",
    name: "Priya Verma",
    age: 28,
    gender: "Female",
    dob: "1996-11-20",
    phone: "9812345678",
    email: "priya.verma@example.com",
    address: "B-12, Sector 62, Noida, Uttar Pradesh",
    status: "Active",
    registeredAt: "2026-08-03"
  },
  {
    id: "PAT003",
    name: "Amit Patel",
    age: 45,
    gender: "Male",
    dob: "1979-03-08",
    phone: "9711223344",
    email: "amit.patel@example.com",
    address: "45, Sunrise Heights, CG Road, Ahmedabad, Gujarat",
    status: "Active",
    registeredAt: "2026-08-05"
  },
  {
    id: "PAT004",
    name: "Sneha Reddy",
    age: 31,
    gender: "Female",
    dob: "1993-07-29",
    phone: "9944556677",
    email: "sneha.reddy@example.com",
    address: "Plot 88, Jubilee Hills, Hyderabad, Telangana",
    status: "Active",
    registeredAt: "2026-08-08"
  }
];

/**
 * Generates the next sequential unique Patient ID (e.g. PAT005)
 * based on existing patient records.
 */
export const generateNextPatientId = (patients = []) => {
  let maxIdNum = 0;
  patients.forEach((p) => {
    if (p.id && p.id.startsWith("PAT")) {
      const numStr = p.id.replace("PAT", "");
      const num = parseInt(numStr, 10);
      if (!isNaN(num) && num > maxIdNum) {
        maxIdNum = num;
      }
    }
  });
  const nextNum = maxIdNum + 1;
  return `PAT${String(nextNum).padStart(3, "0")}`;
};
