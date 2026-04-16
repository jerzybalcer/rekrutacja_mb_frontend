import type { Job } from "./Job";
import type { JobStatus } from "./JobStatus";

export interface JobResponse {
    status: JobStatus;
    job?: Job;
}