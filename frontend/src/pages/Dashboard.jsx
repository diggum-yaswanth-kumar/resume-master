import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { FileText, Calendar, ArrowRight } from 'lucide-react';

const Dashboard = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/api/history');
        setHistory(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleGoToResult = (report) => {
    navigate('/result', { state: { result: report.analysis, jobDescription: report.job_description } });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-grow">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Dashboard</h1>
        <button
          onClick={() => navigate('/analyze')}
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
        >
          New Analysis
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : history.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-500 shadow-sm">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No past analyses</h3>
          <p className="mb-6">Upload your first resume and job description to get started.</p>
          <button
            onClick={() => navigate('/analyze')}
            className="text-indigo-600 font-medium hover:text-indigo-800"
          >
            Start your first analysis &rarr;
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((report) => (
            <div key={report.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer group" onClick={() => handleGoToResult(report)}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(report.created_at).toLocaleDateString()}
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                  report.analysis.match_score >= 80 ? 'bg-green-100 text-green-700' :
                  report.analysis.match_score >= 50 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {report.analysis.match_score}% Match
                </div>
              </div>
              <h3 className="font-medium text-gray-900 line-clamp-2 mb-2">
                {report.job_description.slice(0, 80)}...
              </h3>
              <div className="mt-4 flex items-center text-indigo-600 font-medium text-sm group-hover:text-indigo-800">
                View Full Report
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
