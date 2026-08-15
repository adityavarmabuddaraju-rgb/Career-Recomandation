import React, { useState, useEffect } from 'react';
import { careerService } from '../services/careerService';
import { GitCompare, AlertTriangle, Check, Minus, Search } from 'lucide-react';
import Button from '../components/ui/Button';

export default function CompareCareerPage() {
  const [careersDatabase, setCareersDatabase] = useState([]);
  const [selectedCareers, setSelectedCareers] = useState(['', '', '']);
  const [comparisonResult, setComparisonResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingDb, setFetchingDb] = useState(true);

  useEffect(() => {
    const fetchDb = async () => {
      try {
        const res = await careerService.getDatabase();
        // axios interceptor already unwraps response.data
        const data = Array.isArray(res) ? res : (res?.careers || []);
        setCareersDatabase(data);
      } catch (err) {
        console.error('Failed to load careers for comparison:', err);
      } finally {
        setFetchingDb(false);
      }
    };
    fetchDb();
  }, []);

  const handleSelectCareer = (index, slug) => {
    const newSelected = [...selectedCareers];
    newSelected[index] = slug;
    setSelectedCareers(newSelected);
  };

  const handleCompare = async () => {
    const slugsToCompare = selectedCareers.filter(Boolean);
    if (slugsToCompare.length < 2) {
      alert('Please select at least 2 careers to compare.');
      return;
    }
    
    try {
      setLoading(true);
      // Wait for multiple detailed fetches or use a specialized endpoint if available
      // The instructions mention: POST /api/career/compare with selected slugs
      const res = await careerService.compareCareers(slugsToCompare);
      // axios interceptor already unwraps response.data
      const data = res?.comparisons || res?.careers || (Array.isArray(res) ? res : null);
      if (!Array.isArray(data) || data.length === 0) {
        // Fallback: fetch individually
        const details = await Promise.all(slugsToCompare.map(slug => careerService.getCareerDetail(slug)));
        setComparisonResult(details);
      } else {
        setComparisonResult(data);
      }
    } catch (err) {
      console.error('Comparison failed:', err);
      alert('Failed to perform comparison.');
    } finally {
      setLoading(false);
    }
  };

  const renderChips = (items, bgColor, textColor) => {
    if (!items || items.length === 0) return <span className="text-gray-400 italic text-sm">None</span>;
    return (
      <div className="flex flex-wrap gap-1.5">
        {items.map((item, i) => (
          <span key={i} className={`px-2 py-1 ${bgColor} ${textColor} text-xs font-medium rounded-md`}>
            {item}
          </span>
        ))}
      </div>
    );
  };

  const renderCheckmark = (bool) => (
    bool ? <Check className="w-5 h-5 text-emerald-500 mx-auto" /> : <Minus className="w-5 h-5 text-gray-300 mx-auto" />
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-10">
          <GitCompare className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Compare Careers</h1>
          <p className="text-xl text-gray-600">Side-by-side comparison of skills, requirements, and roadmaps.</p>
        </div>

        {/* Selection Area */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {[0, 1, 2].map(index => (
              <div key={index} className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Career {index + 1} {index === 2 && '(Optional)'}
                </label>
                <select
                  className="w-full rounded-md border border-gray-300 py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm"
                  value={selectedCareers[index]}
                  onChange={(e) => handleSelectCareer(index, e.target.value)}
                  disabled={fetchingDb}
                >
                  <option value="">-- Select a career --</option>
                  {careersDatabase.map(c => (
                    <option key={c.slug} value={c.slug} disabled={selectedCareers.includes(c.slug) && selectedCareers[index] !== c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {selectedCareers[index] && (
                  <button 
                    onClick={() => handleSelectCareer(index, '')}
                    className="mt-2 text-sm text-red-600 hover:text-red-800 text-left"
                  >
                    Clear
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <Button 
              onClick={handleCompare} 
              disabled={loading || selectedCareers.filter(Boolean).length < 2}
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700 shadow-md transition-all disabled:opacity-50"
            >
              {loading ? 'Comparing...' : 'Compare Now'}
            </Button>
          </div>
        </div>

        {/* Comparison Table */}
        {comparisonResult && comparisonResult.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-48">
                    Feature
                  </th>
                  {comparisonResult.map((c, i) => (
                    <th key={i} className="px-6 py-4 text-left text-lg font-bold text-gray-900 bg-white border-l border-gray-200 w-1/3 align-top">
                      {c.name}
                      <span className="block mt-1 text-xs font-normal text-gray-500">{c.category}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                
                {/* Core Skills */}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">Core Skills</td>
                  {comparisonResult.map((c, i) => (
                    <td key={i} className="px-6 py-4 border-l border-gray-200 align-top">
                      {renderChips(c.core_skills, 'bg-indigo-50', 'text-indigo-700')}
                    </td>
                  ))}
                </tr>
                
                {/* Tools */}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">Tools</td>
                  {comparisonResult.map((c, i) => (
                    <td key={i} className="px-6 py-4 border-l border-gray-200 align-top">
                      {renderChips(c.tools, 'bg-amber-50', 'text-amber-700')}
                    </td>
                  ))}
                </tr>

                {/* Education */}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">Education</td>
                  {comparisonResult.map((c, i) => (
                    <td key={i} className="px-6 py-4 border-l border-gray-200 align-top">
                      <ul className="list-disc pl-4 text-sm text-gray-700 space-y-1">
                        {(c.education || []).map((e, idx) => <li key={idx}>{e}</li>)}
                      </ul>
                    </td>
                  ))}
                </tr>

                {/* Certifications */}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">Certifications</td>
                  {comparisonResult.map((c, i) => (
                    <td key={i} className="px-6 py-4 border-l border-gray-200 align-top">
                      <ul className="list-disc pl-4 text-sm text-gray-700 space-y-1">
                        {(c.certifications || []).map((e, idx) => <li key={idx}>{e}</li>)}
                      </ul>
                    </td>
                  ))}
                </tr>

                {/* Entry Level */}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">Entry Level</td>
                  {comparisonResult.map((c, i) => (
                    <td key={i} className="px-6 py-4 border-l border-gray-200 text-center">
                      {renderCheckmark(c.entry_level)}
                    </td>
                  ))}
                </tr>

                {/* Regulated */}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">Regulated</td>
                  {comparisonResult.map((c, i) => (
                    <td key={i} className="px-6 py-4 border-l border-gray-200 text-center">
                      {c.regulated ? (
                        <div className="flex flex-col items-center">
                          <AlertTriangle className="w-5 h-5 text-amber-500 mb-1" />
                          <span className="text-xs text-amber-700 font-medium">Yes</span>
                        </div>
                      ) : (
                        <Minus className="w-5 h-5 text-gray-300 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>

                {/* Industries */}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">Industries</td>
                  {comparisonResult.map((c, i) => (
                    <td key={i} className="px-6 py-4 border-l border-gray-200 align-top">
                      {renderChips(c.industries, 'bg-gray-100', 'text-gray-700')}
                    </td>
                  ))}
                </tr>

              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}
