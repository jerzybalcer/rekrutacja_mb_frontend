import type { JobCreationResponse } from "../model/JobCreationResponse";
import type { JobResponse } from "../model/JobResponse";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "https://localhost:7227";

export async function createJob(clientId: string): Promise<JobCreationResponse> {

  const res = await fetch(`${BASE_URL}/Job`, {
    method: "POST",
    headers: {
      "X-Client-Id": clientId
    }
  });

  if (!res.ok) throw new Error("Failed to create job");

  const jobCreationResponse = await res.json();

  return jobCreationResponse;
}

export async function getJob(jobId: string): Promise<JobResponse> {
  const res = await fetch(`${BASE_URL}/Job/${jobId}`);

  if (res.status === 202) return { status: "pending", job: null };
  if (res.status === 404) return { status: "notfound", job: null };
  if (!res.ok) return { status: "error", job: null };

  const data = await res.json();
  return { status: "done", job: data };
}