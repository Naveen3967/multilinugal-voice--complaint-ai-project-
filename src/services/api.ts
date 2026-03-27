/**
 * API Placeholder Service
 * All functions here are stubs that simulate API calls.
 * Replace the BASE_URL and implement real fetch calls to connect to FastAPI backend.
 */

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// ─── Types ──────────────────────────────────────────────────────────

export interface ComplaintFormData {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  incidentType: string;
  dateTime: string;
  description: string;
  amountLost?: string;
  transactionId?: string;
  suspectDetails?: string;
  platform?: string;
  evidenceFiles?: File[];
  idProofFiles?: File[];
  language: string;
}

export interface ComplaintResponse {
  ticketId: string;
  status: "pending" | "reviewing" | "resolved";
  message: string;
}

export interface TrackResponse {
  ticketId: string;
  status: "pending" | "reviewing" | "resolved";
  details: string;
  filedDate: string;
  lastUpdated: string;
}

export interface AdminComplaint {
  id: string;
  ticketId: string;
  fullName: string;
  email: string;
  phone: string;
  incidentType: string;
  description: string;
  status: "pending" | "reviewing" | "resolved";
  filedDate: string;
  language: string;
  amountLost?: string;
  platform?: string;
  evidenceText?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// ─── Placeholder API Functions ──────────────────────────────────────

/** Submit a new complaint. Returns ticket ID. */
export async function submitComplaint(data: ComplaintFormData): Promise<ComplaintResponse> {
  // TODO: Replace with actual API call
  // const res = await fetch(`${BASE_URL}/complaints`, { method: "POST", body: formData });
  console.log("[API Placeholder] submitComplaint", data);
  await delay(1500);
  return {
    ticketId: `CG-${Date.now().toString(36).toUpperCase()}`,
    status: "pending",
    message: "Complaint filed successfully",
  };
}

/** Track complaint by ticket ID */
export async function trackComplaint(ticketId: string): Promise<TrackResponse | null> {
  // TODO: Replace with actual API call
  // const res = await fetch(`${BASE_URL}/complaints/track/${ticketId}`);
  console.log("[API Placeholder] trackComplaint", ticketId);
  await delay(1000);
  if (!ticketId) return null;
  return {
    ticketId,
    status: "reviewing",
    details: "Your complaint is currently under review by the investigation team.",
    filedDate: new Date(Date.now() - 86400000 * 3).toLocaleDateString(),
    lastUpdated: new Date().toLocaleDateString(),
  };
}

/** User login */
export async function loginUser(creds: LoginCredentials): Promise<{ success: boolean; token?: string }> {
  console.log("[API Placeholder] loginUser", creds.email);
  await delay(800);
  return { success: true, token: "placeholder-jwt-token" };
}

/** Admin login */
export async function loginAdmin(creds: LoginCredentials): Promise<{ success: boolean; token?: string }> {
  console.log("[API Placeholder] loginAdmin", creds.email);
  await delay(800);
  // Hardcoded admin check for demo
  if ((creds.email === "admin@gmail.com" || creds.email === "admin@gmail..com") && creds.password === "admin3967") {
    return { success: true, token: "admin-placeholder-jwt-token" };
  }
  return { success: false };
}

/** Get all complaints (admin) */
export async function getAdminComplaints(): Promise<AdminComplaint[]> {
  console.log("[API Placeholder] getAdminComplaints");
  await delay(1000);
  return MOCK_COMPLAINTS;
}

/** Update complaint status (admin) */
export async function updateComplaintStatus(
  ticketId: string,
  status: "pending" | "reviewing" | "resolved"
): Promise<{ success: boolean }> {
  console.log("[API Placeholder] updateComplaintStatus", ticketId, status);
  await delay(600);
  return { success: true };
}

/** Send chat message to AI and get response */
export async function sendChatMessage(
  messages: ChatMessage[],
  language: string
): Promise<string> {
  // TODO: Replace with actual Gemini API call via FastAPI
  // const res = await fetch(`${BASE_URL}/chat`, { method: "POST", body: JSON.stringify({ messages, language }) });
  console.log("[API Placeholder] sendChatMessage", language);
  await delay(1200);
  const lastMsg = messages[messages.length - 1]?.content || "";
  // Simple placeholder responses
  if (lastMsg.toLowerCase().includes("name")) {
    return "Please provide your full name as it appears on your ID card.";
  }
  if (lastMsg.toLowerCase().includes("help") || messages.length <= 1) {
    return "I'll help you file your cyber crime complaint. Let's start — what is your full name?";
  }
  return "Thank you. Please continue providing the details. What type of cyber crime did you experience?";
}

// ─── Helpers ────────────────────────────────────────────────────────

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

const MOCK_COMPLAINTS: AdminComplaint[] = [
  {
    id: "1",
    ticketId: "CG-M3X7K9",
    fullName: "Rajesh Kumar",
    email: "rajesh@example.com",
    phone: "+91 98765 43210",
    incidentType: "UPI / Payment Fraud",
    description: "Received a phishing link via SMS pretending to be from SBI. Lost ₹45,000 through unauthorized UPI transaction.",
    status: "reviewing",
    filedDate: "2025-03-18",
    language: "hi",
    amountLost: "₹45,000",
    platform: "UPI - PhonePe",
    evidenceText: "SMS screenshot showing phishing link from +91-XXXXX-12345",
  },
  {
    id: "2",
    ticketId: "CG-P5N2R8",
    fullName: "Priya Sharma",
    email: "priya.sharma@example.com",
    phone: "+91 87654 32109",
    incidentType: "Social Media Identity Theft",
    description: "Someone created a fake Instagram profile using my photos and name, and is asking my contacts for money.",
    status: "pending",
    filedDate: "2025-03-20",
    language: "en",
    platform: "Instagram",
  },
  {
    id: "3",
    ticketId: "CG-Q9W4T6",
    fullName: "Amit Patel",
    email: "amit.patel@example.com",
    phone: "+91 76543 21098",
    incidentType: "Online Job Fraud",
    description: "Paid ₹15,000 registration fee for a fake work-from-home job. Company website is now down.",
    status: "resolved",
    filedDate: "2025-03-10",
    language: "gu",
    amountLost: "₹15,000",
    platform: "WhatsApp",
    evidenceText: "Payment receipt and WhatsApp conversation screenshots",
  },
];
