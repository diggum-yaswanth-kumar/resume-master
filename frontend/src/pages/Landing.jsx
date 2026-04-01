import { Link } from 'react-router-dom';
import { FileSearch, Target, TrendingUp, BarChart } from 'lucide-react';

const Landing = () => {
  return (
    <div className="bg-white flex flex-col items-center justify-center flex-grow text-center px-4 sm:px-6 py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-8">
          Match Your Resume <br className="hidden md:block"/>
          <span className="text-indigo-600">To Your Dream Job</span>
        </h1>
        <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto mb-10">
          Upload your resume and the job description. Our AI analyzes your skills, calculates your ATS score, and suggests exactly what you need to improve to win the interview.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/register" className="px-8 py-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all font-sans text-lg">
            Start Analyzing Now
          </Link>
          <Link to="/login" className="px-8 py-4 bg-white text-gray-700 border border-gray-200 font-semibold rounded-lg hover:bg-gray-50 transition-all font-sans text-lg">
            Returning User?
          </Link>
        </div>

        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 text-left">
            <div className="bg-white w-12 h-12 rounded-lg flex items-center justify-center border border-gray-100 mb-4 shadow-sm">
              <FileSearch className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Instant Parsing</h3>
            <p className="text-gray-500">Extracts text and identifies your core technical skills instantly from any standard PDF.</p>
          </div>
          <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 text-left">
            <div className="bg-white w-12 h-12 rounded-lg flex items-center justify-center border border-gray-100 mb-4 shadow-sm">
              <Target className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Precision Matching</h3>
            <p className="text-gray-500">Compares your skills line-by-line against the job description to find critical gaps.</p>
          </div>
          <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 text-left">
            <div className="bg-white w-12 h-12 rounded-lg flex items-center justify-center border border-gray-100 mb-4 shadow-sm">
              <TrendingUp className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Actionable Insights</h3>
            <p className="text-gray-500">Receive precise recommendations on keywords and skills to improve your ATS score.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
