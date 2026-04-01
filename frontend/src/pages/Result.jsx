import { useLocation, useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { Download, CheckCircle, AlertTriangle, ArrowLeft, Target, Award, ListChecks, Lightbulb } from 'lucide-react';

const COLORS = ['#4f46e5', '#e5e7eb']; // Indigo and Gray

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;
  const jobDescription = location.state?.jobDescription;

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center flex-grow py-20 px-4 text-center">
        <AlertTriangle className="w-16 h-16 text-yellow-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Analysis Data Found</h2>
        <p className="text-gray-500 mb-6">Return to the analyze page to generate a new report.</p>
        <button onClick={() => navigate('/analyze')} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium">
          Go Back
        </button>
      </div>
    );
  }

  const matchData = [
    { name: 'Match', value: result.match_score },
    { name: 'Missing', value: 100 - result.match_score },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-grow">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 print:hidden">
        <button onClick={() => navigate('/dashboard')} className="flex items-center text-gray-500 hover:text-gray-900 transition font-medium w-fit">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Dashboard
        </button>
        <button onClick={handlePrint} className="flex items-center justify-center bg-white border border-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition shadow-sm">
          <Download className="w-4 h-4 mr-2" />
          Download PDF Report
        </button>
      </div>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Your Compatibility Report</h1>
        <p className="text-gray-500 mt-2 text-lg">Detailed breakdown of how well your resume matches the job description.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Core Score Section - 1/3 width */}
        <div className="col-span-1 flex flex-col gap-6">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center text-center h-full relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-indigo-600"></div>
            <h2 className="text-xl font-bold text-gray-900 mb-6 w-full text-left">ATS Match Score</h2>
            
            <div className="w-full h-64 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={matchData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {matchData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Perfectly Centered Score */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none mt-1">
                <span className="text-4xl font-black text-indigo-600 leading-none">{result.match_score}%</span>
                <span className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mt-1">Match</span>
              </div>
            </div>
            
            <p className="mt-6 text-sm text-gray-600 font-medium bg-indigo-50 text-indigo-800 p-4 rounded-xl w-full">
              {result.match_score >= 80 ? "🔥 Excellent match! You're ready to apply." :
               result.match_score >= 50 ? "👍 Good start, but you can improve your keywords." :
               "⚠️ Critical keyword gaps found. Revision needed."}
            </p>
          </div>
        </div>

        {/* Details Section - 2/3 width */}
        <div className="col-span-1 lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Extracted Skills */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="flex items-center text-lg font-bold text-gray-900 mb-4">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              Detected Skills
            </h3>
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {result.extracted_skills?.length > 0 ? result.extracted_skills.map(skill => (
                <span key={skill} className="px-3 py-1 bg-green-50 border border-green-100 text-green-700 rounded-full text-sm font-medium">
                  {skill}
                </span>
              )) : <p className="text-gray-500 text-sm">No skills found. Make sure you use standard tech terminology.</p>}
            </div>
          </div>

          {/* Missing Skills */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="flex items-center text-lg font-bold text-gray-900 mb-4">
              <Target className="w-5 h-5 text-red-500 mr-2" />
              Missing Skills
            </h3>
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {result.missing_skills?.length > 0 ? result.missing_skills.map(skill => (
                <span key={skill} className="px-3 py-1 bg-red-50 border border-red-100 text-red-700 rounded-full text-sm font-medium border-dashed">
                  {skill}
                </span>
              )) : <p className="text-green-600 font-medium text-sm">You have all the required skills requested!</p>}
            </div>
          </div>

          {/* Strengths & Weaknesses (Full width) */}
          <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="flex items-center text-lg font-bold text-gray-900 mb-3">
                <Award className="w-5 h-5 text-indigo-500 mr-2" />
                Strengths
              </h3>
              <ul className="space-y-2">
                {result.strengths?.length > 0 ? result.strengths.map((str, i) => (
                  <li key={i} className="text-gray-600 text-sm flex items-start">
                    <span className="text-indigo-400 mr-2 mt-0.5">•</span> {str}
                  </li>
                )) : <li className="text-gray-500 text-sm italic">Focus on improving your keyword density structure.</li>}
              </ul>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="flex items-center text-lg font-bold text-gray-900 mb-3">
                <ListChecks className="w-5 h-5 text-orange-500 mr-2" />
                Areas to Improve
              </h3>
              <ul className="space-y-2">
                {result.weaknesses?.length > 0 ? result.weaknesses.map((wk, i) => (
                  <li key={i} className="text-gray-600 text-sm flex items-start font-medium bg-orange-50/50 p-2 rounded-lg">
                    <span className="text-orange-500 mr-2 mt-0.5">→</span> {wk}
                  </li>
                )) : <li className="text-gray-500 text-sm italic">Your resume successfully satisfies the baseline criteria!</li>}
              </ul>
            </div>
          </div>
          
          {/* Action Plan (Full width Redesign) */}
          <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-900 text-white p-8 sm:p-10 rounded-3xl shadow-xl relative overflow-hidden border border-indigo-700/50">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 text-indigo-400/10 pointer-events-none">
              <Lightbulb className="w-80 h-80" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center mb-8">
                <div className="bg-yellow-400/20 p-4 rounded-2xl mr-5 border border-yellow-400/30 shadow-inner">
                  <Lightbulb className="w-8 h-8 text-yellow-300" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tight">Action Plan</h3>
                  <p className="text-indigo-200 font-medium mt-1">Definitive steps to optimize your resume and guarantee an interview.</p>
                </div>
              </div>
              
              <div className="grid gap-4">
                {result.suggestions?.map((sug, i) => (
                  <div key={i} className="flex font-medium text-indigo-50 p-5 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10 hover:bg-white/15 transition duration-300 shadow-inner">
                    <div className="bg-indigo-500 text-white font-bold rounded-xl w-10 h-10 flex items-center justify-center text-sm mr-4 flex-shrink-0 shadow-md border border-indigo-400/30">
                      Step {i+1}
                    </div>
                    <p className="leading-relaxed text-indigo-50 text-base flex-1 pt-2">{sug}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Hide job description when printing for a cleaner report */}
      <div className="mt-12 pt-8 border-t border-gray-200 print:hidden">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Original Job Description Snippet</h3>
        <p className="text-gray-500 text-sm whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto bg-gray-50 p-6 rounded-2xl border border-gray-100 italic">
          "{jobDescription}"
        </p>
      </div>
    </div>
  );
};

export default Result;
