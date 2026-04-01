import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, File, X, Sparkles, Loader2 } from 'lucide-react';
import api from '../services/api';

const Analyze = () => {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const loadDemoResume = async () => {
    try {
      const response = await fetch('/dummy.pdf');
      const blob = await response.blob();
      const mockFile = new File([blob], "dummy.pdf", { type: "application/pdf" });
      setFile(mockFile);
    } catch (e) {
      setError("Failed to load demo resume");
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
  });

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please upload a resume PDF');
      return;
    }
    if (!jobDescription.trim()) {
      setError('Please paste the job description');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('job_description', jobDescription);

    try {
      const response = await api.post('/api/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate('/result', { state: { result: response.data.analysis, jobDescription } });
    } catch (err) {
      setError(err.response?.data?.detail || 'Analysis failed. Make sure you are logged in.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 w-full flex-grow flex flex-col items-center">
      <div className="text-center mb-10 w-full">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Ready for your next role?
        </h1>
        <p className="text-lg text-gray-500">
          Drop your resume and paste the job description below. We'll handle the rest.
        </p>
      </div>

      <div className="w-full bg-white p-8 rounded-3xl shadow-lg border border-gray-100 flex flex-col gap-8">
        
        {/* Upload Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900">1. Upload Resume (PDF)</h2>
            <button 
              onClick={loadDemoResume}
              className="text-sm px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition font-medium"
            >
              Load Demo Resume
            </button>
          </div>
          {!file ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                isDragActive ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-indigo-400 hover:bg-gray-50'
              }`}
            >
              <input {...getInputProps()} />
              <UploadCloud className={`w-12 h-12 mb-4 ${isDragActive ? 'text-indigo-600' : 'text-gray-400'}`} />
              <p className="text-gray-600 font-medium">
                {isDragActive ? 'Drop PDF here...' : 'Drag & drop a PDF, or click to select'}
              </p>
              <p className="text-xs text-gray-400 mt-2">Max 5MB</p>
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
              <div className="flex items-center space-x-3">
                <File className="w-6 h-6 text-indigo-600" />
                <span className="font-medium text-gray-900">{file.name}</span>
                <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
              </div>
              <button
                onClick={() => setFile(null)}
                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                title="Remove file"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Job Description Section */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">2. Paste Job Description</h2>
          <textarea
            className="w-full h-48 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 placeholder-gray-400 resize-none transition-shadow"
            placeholder="Paste the requirements, responsibilities, and qualifications..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 text-sm font-medium">
            {error}
          </div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-xl text-lg hover:from-indigo-700 hover:to-violet-700 shadow-md shadow-indigo-600/20 transition-all flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed group"
        >
          {loading ? (
            <>
              <Loader2 className="w-6 h-6 mr-3 animate-spin" />
              Analyzing with AI...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
              Analyze Resume Match
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Analyze;
