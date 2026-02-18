import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  AcceptJobModal,
  DeclineJobModal,
  Header,
  JobCard,
  JobDetailsModal,
  Sidebar
} from '../components/workersjobs/Index.ts';
import { declineReasons } from '../constants/DeclineReasons.ts';
import { jobTabs } from '../constants/JobTabs.ts';
import { initialJobs } from '../constants/MockJobs.ts';
import type { Job, JobStatus } from '../types/Job.types.ts';
import { clearWorkerSession, getWorkerSession } from '../utils/workerAuth.ts';

const WORKER_DASHBOARD_ROUTE = '/home-worker';

const WorkersJobs: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const workerSession = getWorkerSession();
  const workerName = workerSession?.worker?.firstName
    ? String(workerSession.worker.firstName)
    : 'Worker';

  const [activeTab, setActiveTab] = useState<JobStatus | 'All'>('Pending');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedDeclineJob, setSelectedDeclineJob] = useState<Job | null>(null);
  const [selectedAcceptJob, setSelectedAcceptJob] = useState<Job | null>(null);
  const [jobs, setJobs] = useState<Job[]>(initialJobs);

  const handleAcceptJob = (jobId: string): void => {
    setJobs((previousJobs) =>
      previousJobs.map((job) => (
        job.id === jobId ? { ...job, status: 'In Progress' as JobStatus } : job
      ))
    );
    setSelectedJob(null);
    setSelectedAcceptJob(null);
    setActiveTab('In Progress');
  };

  const handleDeclineJob = (jobId: string, reason: string): void => {
    setJobs((previousJobs) =>
      previousJobs.map((job) => (
        job.id === jobId
          ? { ...job, status: 'Declined' as JobStatus, declineReason: reason }
          : job
      ))
    );
    setSelectedDeclineJob(null);
    setActiveTab('Declined');
  };

  const handleLogout = (): void => {
    clearWorkerSession();
    navigate('/worker-login', { replace: true });
  };

  const filteredJobs = jobs.filter((job) => {
    if (activeTab === 'All') return true;
    return job.status === activeTab;
  });

  return (
    <div className="min-h-screen bg-[#F9F6F2] font-sans flex flex-col items-center overflow-x-hidden relative text-left">
      <Header onLogoClick={() => navigate(WORKER_DASHBOARD_ROUTE)} />

      <div className="w-full max-w-[1280px] flex gap-6 items-start p-6">
        <Sidebar
          location={location}
          navigate={navigate}
          workerName={workerName}
          onLogout={handleLogout}
        />

        <main className="flex-1">
          <header className="mb-8 px-2">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Jobs</h1>
          </header>

          <section className="mb-6 px-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex p-1">
              {jobTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${
                    activeTab === tab ? 'bg-[#EBF7F3] text-[#00A651]' : 'text-gray-400'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </section>

          <section className="px-2 space-y-4">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onViewDetails={setSelectedJob}
                  onAccept={setSelectedAcceptJob}
                  onDecline={setSelectedDeclineJob}
                />
              ))
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-400 font-bold text-sm uppercase tracking-widest italic">
                  No {activeTab.toLowerCase()} jobs found.
                </p>
              </div>
            )}
          </section>
        </main>
      </div>

      <JobDetailsModal
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
        onAccept={setSelectedAcceptJob}
        onDecline={setSelectedDeclineJob}
      />

      <AcceptJobModal
        job={selectedAcceptJob}
        onConfirm={() => selectedAcceptJob && handleAcceptJob(selectedAcceptJob.id)}
        onCancel={() => setSelectedAcceptJob(null)}
      />

      <DeclineJobModal
        job={selectedDeclineJob}
        declineReasons={declineReasons}
        onDecline={handleDeclineJob}
        onCancel={() => setSelectedDeclineJob(null)}
      />
    </div>
  );
};

export default WorkersJobs;
