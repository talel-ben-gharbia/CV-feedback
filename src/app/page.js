import Link from 'next/link';
import Navbar from '../components/Navbar';
import StatsDashboard from '../components/StatsDashboard';

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans">
      <Navbar />
      <main className="flex flex-col items-center justify-center py-20 px-4">
        <div className="max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
            CV Assist — Smart CV Feedback for Real Jobs
          </h1>

          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-10 leading-relaxed">
            CV Assist uses AI to evaluate your CV against a specific job role and gives you
            clear, honest, and actionable feedback — just like a professional recruiter would.
            No generic advice. No guesswork. Only real market-aligned insights.
          </p>

          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
              How It Works
            </h2>

            <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed max-w-2xl mx-auto">
              Upload your CV as a PDF, enter the job title you are targeting, and let our AI
              analyze how well your profile matches the role. You will receive a matching score,
              a clear explanation of your strengths and gaps, and practical suggestions to improve
              your chances of getting shortlisted.
            </p>
          </div>

          <Link
            href="/upload"
            className="inline-block bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-black font-medium py-3 px-8 rounded-lg transition-colors duration-200"
          >
            Analyze My CV
          </Link>
        </div>

        <div className="mt-16 w-full max-w-4xl">
          <StatsDashboard />
        </div>
      </main>
    </div>
  );
}
