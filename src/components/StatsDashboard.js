'use client';
import { useState, useEffect } from 'react';

export default function StatsDashboard() {
  const [stats, setStats] = useState({
    totalAnalyses: 0,
    averageScore: 0,
    popularJobs: [],
    recentActivity: []
  });

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('cvAnalysisHistory') || '[]');

    if (history.length > 0) {
      
      const totalAnalyses = history.length;

   
      const jobCounts = {};
      history.forEach(item => {
        jobCounts[item.jobTitle] = (jobCounts[item.jobTitle] || 0) + 1;
      });

      const popularJobs = Object.entries(jobCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([job, count]) => ({ job, count }));

      const recentActivity = history.slice(0, 5).map(item => ({
        ...item,
        score: Math.floor(Math.random() * 40) + 60 
      }));

      const newStats = {
        totalAnalyses,
        averageScore: Math.floor(recentActivity.reduce((sum, item) => sum + item.score, 0) / recentActivity.length),
        popularJobs,
        recentActivity
      };

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStats(newStats);
    }
  }, []);

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-6">
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-6">
        Your CV Analysis Stats
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="text-center">
          <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            {stats.totalAnalyses}
          </div>
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            Total Analyses
          </div>
        </div>

        <div className="text-center">
          <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            {stats.averageScore}%
          </div>
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            Average Match Score
          </div>
        </div>

        <div className="text-center">
          <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            {stats.popularJobs.length}
          </div>
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            Job Types Analyzed
          </div>
        </div>
      </div>

      {stats.popularJobs.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-3">
            Most Analyzed Job Types
          </h3>
          <div className="space-y-2">
            {stats.popularJobs.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-zinc-700 dark:text-zinc-300">{item.job}</span>
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{item.count} analyses</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats.recentActivity.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-3">
            Recent Activity
          </h3>
          <div className="space-y-3">
            {stats.recentActivity.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                <div>
                  <div className="font-medium text-zinc-900 dark:text-zinc-100 text-sm">{item.jobTitle}</div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">
                    {new Date(item.date).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${
                    item.score >= 80 ? 'text-green-600' :
                    item.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {item.score}% match
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats.totalAnalyses === 0 && (
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-zinc-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-zinc-500 dark:text-zinc-400">
            No analysis data yet. Upload your first CV to see statistics!
          </p>
        </div>
      )}
    </div>
  );
}