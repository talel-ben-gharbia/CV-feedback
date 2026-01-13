"use client";
import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [jobTitle, setJobTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const savedHistory = localStorage.getItem('cvAnalysisHistory');
    if (savedHistory) {
      setAnalysisHistory(JSON.parse(savedHistory));
    }
  }, []);


  const saveToHistory = (newAnalysis, title) => {
    const historyItem = {
      id: Date.now(),
      jobTitle: title,
      analysis: newAnalysis,
      date: new Date().toISOString(),
      fileName: file?.name || 'Unknown file'
    };

    const updatedHistory = [historyItem, ...analysisHistory.slice(0, 9)]; 
    setAnalysisHistory(updatedHistory);
    localStorage.setItem('cvAnalysisHistory', JSON.stringify(updatedHistory));
  };

  const exportAnalysis = () => {
    if (!analysis) return;

    const content = `CV Analysis Report\n\nJob Title: ${jobTitle}\nDate: ${new Date().toLocaleDateString()}\n\n${analysis}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cv-analysis-${jobTitle.replace(/\s+/g, '-').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

 
  const deleteHistoryItem = (id) => {
    const updatedHistory = analysisHistory.filter(item => item.id !== id);
    setAnalysisHistory(updatedHistory);
    localStorage.setItem('cvAnalysisHistory', JSON.stringify(updatedHistory));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !jobTitle) {
      setMessage('Please select a PDF file and enter a job title.');
      return;
    }

    setLoading(true);
    setMessage('');
    setAnalysis('');
    setProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('jobTitle', jobTitle);

    try {

      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 15;
        });
      }, 500);

      const response = await fetch('http://localhost:5678/webhook/Assistant', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (response.ok) {
        const data = await response.json();
        const analysisText = data.output || 'Analysis completed successfully.';
        setAnalysis(analysisText);
        setMessage('Analysis Complete!');
        saveToHistory(analysisText, jobTitle);
        setFile(null);
        setJobTitle('');
      } else {
        setMessage('Submission failed. Please try again.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };


  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setMessage('Please select a valid PDF file.');
        setFile(null);
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) { 
        setMessage('File size must be less than 10MB.');
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans">
      <Navbar />

      <div className="max-w-4xl mx-auto p-6">
     
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            Upload Your CV
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Get AI-powered feedback on how well your CV matches your target job role
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
  
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
        
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    CV/Resume PDF
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-lg cursor-pointer hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors"
                    >
                      {file ? (
                        <div className="text-center">
                          <svg className="mx-auto h-8 w-8 text-green-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400">{file.name}</p>
                          <p className="text-xs text-zinc-500 dark:text-zinc-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <svg className="mx-auto h-8 w-8 text-zinc-400 mb-2" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400">Click to upload PDF</p>
                          <p className="text-xs text-zinc-500 dark:text-zinc-500">Max 10MB</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

        
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Target Job Title
                  </label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-zinc-500 focus:border-transparent dark:bg-zinc-800 dark:text-zinc-100 transition-colors"
                    placeholder="e.g., Senior Software Engineer, Product Manager"
                    required
                  />
                </div>

                {loading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-zinc-600 dark:text-zinc-400">
                      <span>Analyzing your CV...</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                      <div
                        className="bg-zinc-600 dark:bg-zinc-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !file || !jobTitle}
                  className="w-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black py-3 px-6 rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Analyzing...' : 'Analyze CV'}
                </button>
              </form>

              {message && (
                <div className={`mt-4 p-4 rounded-lg ${
                  message.includes('Complete') || message.includes('success')
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
                }`}>
                  {message}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-zinc-900 dark:text-zinc-100">Analysis History</span>
                <svg className={`w-5 h-5 text-zinc-500 transition-transform ${showHistory ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {showHistory && (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {analysisHistory.length === 0 ? (
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm text-center py-4">
                    No analysis history yet
                  </p>
                ) : (
                  analysisHistory.map((item) => (
                    <div key={item.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-zinc-900 dark:text-zinc-100 text-sm">{item.jobTitle}</h4>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">{new Date(item.date).toLocaleDateString()}</p>
                        </div>
                        <button
                          onClick={() => deleteHistoryItem(item.id)}
                          className="text-zinc-400 hover:text-red-500 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-3">{item.analysis.substring(0, 100)}...</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

     {analysis && (
          <div className="mt-8 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                AI Analysis Results
              </h2>
              <button
                onClick={exportAnalysis}
                className="inline-flex items-center px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export
              </button>
            </div>

            <div className="prose prose-zinc dark:prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {analysis}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}