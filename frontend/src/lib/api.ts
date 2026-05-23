const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8002";

export interface Incident {
  id: number;
  created_at: string;
  updated_at: string;
  operator: string;
  engineer: string;
  shift: string;
  robot_type: string;
  controller: string;
  cell: string;
  line: string;
  error_code: string;
  category: string;
  priority: string;
  status: string;
  title: string;
  description: string;
  symptoms: string | null;
  solution: string | null;
  steps: string | null;
  downtime_min: number | null;
  result: string | null;
  notes: string | null;
  images: string | null;
}

export interface Stats {
  total: number;
  open: number;
  closed: number;
  in_progress: number;
  avg_downtime: number;
  top_errors: { error_code: string; count: number }[];
  top_robots: { robot_type: string; count: number }[];
  by_category: { category: string; count: number }[];
  by_week: { week: string; count: number }[];
  by_priority: { priority: string; count: number }[];
  by_controller: { controller: string; count: number }[];
  recent: {
    id: number;
    title: string;
    error_code: string;
    robot_type: string;
    priority: string;
    status: string;
    created_at: string;
    downtime_min: number | null;
  }[];
}

export async function fetchStats(): Promise<Stats> {
  const res = await fetch(`${API_BASE}/api/stats`, { cache: "no-store" });
  return res.json();
}

export async function fetchIncidents(params?: Record<string, string>): Promise<Incident[]> {
  const query = params ? "?" + new URLSearchParams(params).toString() : "";
  const res = await fetch(`${API_BASE}/api/incidents${query}`, { cache: "no-store" });
  return res.json();
}

export async function fetchIncident(id: number): Promise<Incident> {
  const res = await fetch(`${API_BASE}/api/incidents/${id}`, { cache: "no-store" });
  return res.json();
}

export async function createIncident(data: Omit<Incident, "id" | "created_at" | "updated_at">): Promise<Incident> {
  const res = await fetch(`${API_BASE}/api/incidents`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateIncident(id: number, data: Omit<Incident, "id" | "created_at" | "updated_at">): Promise<Incident> {
  const res = await fetch(`${API_BASE}/api/incidents/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function seedData(): Promise<void> {
  await fetch(`${API_BASE}/api/seed`, { method: "POST" });
}
