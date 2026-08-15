import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Search, ChevronRight, Briefcase, Trash2 } from 'lucide-react';
import { skillsService } from '../services/skillsService';
import { useToast } from '../context/ToastContext';
import Button from '../components/ui/Button';

export default function MyCareersPage() {
  const [savedCareers, setSavedCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSavedCareers();
  }, []);

  const fetchSavedCareers = async () => {
    try {
      setLoading(true);
      const res = await skillsService.getSavedCareers();
      // axios interceptor already unwraps response.data
      setSavedCareers(res?.careers || []);
    } catch (err) {
      if(showToast) showToast('Failed to load saved careers.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (slug) => {
    try {
      await skillsService.unsaveCareer(slug);
      setSavedCareers(savedCareers.filter(c => c.career_slug !== slug));
      if(showToast) showToast('Career removed.', 'success');
    } catch (err) {
      if(showToast) showToast('Failed to remove career.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="text-center md:text-left mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center justify-center md:justify-start">
            <Heart className="w-8 h-8 mr-3 text-rose-500 fill-current" /> My Saved Careers
          </h1>
          <p className="mt-2 text-gray-600">Careers you are tracking and interested in pursuing.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-xl h-48 animate-pulse shadow-sm border border-gray-100"></div>
            ))}
          </div>
        ) : savedCareers.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl shadow-sm border border-gray-200">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No saved careers</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              You haven't saved any careers yet. Explore the career database to find paths that match your interests.
            </p>
            <Button 
              onClick={() => navigate('/career-explorer')}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 flex items-center mx-auto"
            >
              <Search className="w-5 h-5 mr-2" /> Explore Careers
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedCareers.map((career) => (
              <div key={career.career_slug} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200 flex flex-col h-full relative group">
                
                <button 
                  onClick={() => handleRemove(career.career_slug)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-rose-500 transition-colors p-1"
                  title="Remove from saved"
                >
                  <Trash2 className="w-5 h-5" />
                </button>

                <h3 className="text-xl font-bold text-gray-900 mb-2 pr-8">{career.career_name}</h3>
                {career.category && (
                  <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mb-4 w-max">
                    {career.category}
                  </span>
                )}
                
                {career.core_skills && career.core_skills.length > 0 && (
                  <div className="mb-6 flex-grow">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Key Skills</p>
                    <div className="flex flex-wrap gap-1.5">
                      {career.core_skills.slice(0, 3).map((skill, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded border border-gray-200">
                          {skill}
                        </span>
                      ))}
                      {career.core_skills.length > 3 && (
                        <span className="px-2 py-1 bg-gray-50 text-gray-500 text-xs rounded border border-gray-200">
                          +{career.core_skills.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="mt-auto flex flex-col gap-3 pt-4 border-t border-gray-100">
                  <Button 
                    onClick={() => navigate(`/career/${career.career_slug}`)}
                    className="w-full bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg font-medium transition-colors flex justify-center items-center"
                  >
                    View Details
                  </Button>
                  <Button 
                    onClick={() => navigate(`/career-assessment?mode=2&career=${career.career_slug}`)}
                    className="w-full bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-lg font-medium transition-colors flex justify-center items-center"
                  >
                    Build Roadmap <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
