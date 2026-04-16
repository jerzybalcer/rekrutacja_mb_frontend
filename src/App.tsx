import { useEffect, useState } from "react";
import { createJob, getJob } from "./utils/api";
import { getClientId } from "./utils/clientId";
import type { JobResponse } from "./model/JobResponse";

export default function App() {
  const [jobResponse, setJobResponse] = useState<JobResponse>({ status: "idle", job: null });
  const [jobId, setJobId] = useState<string | null>(null);

  const clientId = getClientId();

  // Check if there's a pending request
  useEffect(() => {
    const savedJobId = localStorage.getItem("jobId");

    if (!savedJobId) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setJobId(savedJobId);
    setJobResponse({ status: "pending" });
  }, []);

  // Polling for result
  useEffect(() => {
    if (!jobId) return;

    const interval = setInterval(async () => {
      const res = await getJob(jobId);

      setJobResponse({ ...jobResponse, status: "pending" });

      if (res.status === "done") {
        setJobResponse({ job: res.job, status: "done" });

        localStorage.removeItem("jobId");
        clearInterval(interval);
      }

    }, 5000);

    return () => clearInterval(interval);
  }, [jobId, jobResponse]);

  // Create new job
  const handleStart = async () => {
    setJobResponse({ ...jobResponse, status: "pending" });

    const jobCreationResponse = await createJob(clientId);
    setJobId(jobCreationResponse.jobId);
    localStorage.setItem("jobId", jobCreationResponse.jobId);
  };

  return (
    <div>
      <button onClick={handleStart}>Create Job</button>

      {jobResponse.status === "pending" && <p>Job pending...</p>}
      {jobResponse.status === "done" && <p>{jobResponse.job.data}</p>}
      {jobResponse.status === "notfound" && <p>Job not found</p>}
      {jobResponse.status === "error" && <p>Job error</p>}
    </div>
  );
}