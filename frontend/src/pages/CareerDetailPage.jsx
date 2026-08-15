import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AlertTriangle, Heart, ExternalLink, ArrowLeft, Briefcase, GraduationCap, Award, Map, BookmarkPlus, CheckCircle, ChevronRight } from 'lucide-react';
import { careerService } from '../services/careerService';
import { skillsService } from '../services/skillsService';
import { useToast } from '../context/ToastContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function CareerDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [career, setCareer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    const fetchCareerDetails = async () => {
      try {
        setLoading(true);
        const response = await careerService.getCareerDetail(slug);
        // axios interceptor already unwraps response.data
        setCareer(response);
        
        // Check if saved
        try {
          const savedResponse = await skillsService.getSavedCareers();
          const savedList = savedResponse?.careers || [];
          setIsSaved(savedList.some(c => c.career_slug === slug));
        } catch (e) {
          // Ignore if unauthenticated
        }
      } catch (err) {
        console.error('Failed to fetch career details:', err);
        setError('Career not found or failed to load.');
      } finally {
        setLoading(false);
      }
    };
    fetchCareerDetails();
  }, [slug]);

  const toggleSaveCareer = async () => {
    try {
      setSaveLoading(true);
      if (isSaved) {
        await skillsService.unsaveCareer(slug);
        setIsSaved(false);
        if(showToast) showToast('Career removed from saved list', 'success');
      } else {
        await skillsService.saveCareer({ career_name: career.name, career_slug: slug });
        setIsSaved(true);
        if(showToast) showToast('Career saved successfully!', 'success');
      }
    } catch (err) {
      if(showToast) showToast('Failed to update saved career. Please ensure you are logged in.', 'error');
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !career) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Career Not Found</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <Button onClick={() => navigate('/careers')} className="bg-indigo-600 text-white px-4 py-2 rounded-md">
          Back to Careers
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header Banner */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link to="/career-explorer" className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Career Explorer
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                  {career.category}
                </span>
                {career.entry_level && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                    Entry Level Friendly
                  </span>
                )}
              </div>
              <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl tracking-tight mb-4">
                {career.name}
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl leading-relaxed">
                {career.description}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 md:flex-shrink-0">
              <Button 
                onClick={toggleSaveCareer} 
                disabled={saveLoading}
                className={`flex items-center justify-center px-5 py-2.5 rounded-lg font-medium border transition-colors ${
                  isSaved 
                  ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Heart className={`w-5 h-5 mr-2 ${isSaved ? 'fill-current text-rose-500' : 'text-gray-400'}`} />
                {isSaved ? 'Saved' : 'Save Career'}
              </Button>
              <Button 
                onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(career.name + ' jobs')}&ibp=htl;jobs`, '_blank')}
                className="flex items-center justify-center px-5 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                <Briefcase className="w-5 h-5 mr-2" />
                Find Jobs
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Regulated Warning */}
        {career.regulated && (
          <div className="bg-amber-50 border-l-4 border-amber-500 p-5 rounded-r-lg shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-amber-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-amber-800">Regulated Profession</h3>
                <div className="mt-2 text-sm text-amber-700">
                  <p>
                    ⚠️ This is a regulated profession. Actual eligibility requires official qualifications, licensing, and/or examination. 
                    {career.regulated_note && ` ${career.regulated_note}`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Skills Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Award className="w-6 h-6 mr-2 text-indigo-500" /> Key Skills & Tools
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Core Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {(career.core_skills || []).map((skill, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-lg border border-indigo-100">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Supporting Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {(career.supporting_skills || []).map((skill, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-violet-50 text-violet-700 text-sm font-medium rounded-lg border border-violet-100">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Soft Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {(career.soft_skills || []).map((skill, idx) => (
                        <span key={idx} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-lg border border-emerald-100">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Tools & Tech</h3>
                    <div className="flex flex-wrap gap-2">
                      {(career.tools || []).map((tool, idx) => (
                        <span key={idx} className="px-3 py-1.5 bg-amber-50 text-amber-700 text-sm font-medium rounded-lg border border-amber-100">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Responsibilities */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <CheckCircle className="w-6 h-6 mr-2 text-indigo-500" /> What You'll Do
              </h2>
              <ul className="space-y-3">
                {(career.typical_responsibilities || []).map((resp, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-gray-700">{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Learning Roadmap */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Map className="w-6 h-6 mr-2 text-indigo-500" /> Learning Roadmap
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['Beginner', 'Intermediate', 'Advanced'].map((level) => {
                  const items = career.learning_roadmap ? career.learning_roadmap[level.toLowerCase()] : [];
                  return (
                    <div key={level} className="bg-gray-50 rounded-lg p-5 border border-gray-100">
                      <h3 className="font-bold text-gray-900 mb-3 text-lg border-b pb-2">{level}</h3>
                      <ul className="space-y-2">
                        {(items || []).map((item, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-start">
                            <span className="text-indigo-500 mr-2">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 flex justify-center">
                <Button 
                  onClick={() => navigate(`/career-assessment?mode=2&career=${slug}`)}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm flex items-center"
                >
                  Start Building Roadmap <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            
            {/* Education & Certs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <GraduationCap className="w-5 h-5 mr-2 text-indigo-500" /> Requirements
              </h2>
              
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Education</h3>
                <ul className="space-y-2">
                  {(career.education || []).map((edu, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-700 bg-gray-50 p-2 rounded">
                      <BookmarkPlus className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" /> {edu}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Common Certifications</h3>
                <ul className="space-y-2">
                  {(career.certifications || []).map((cert, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-700 bg-gray-50 p-2 rounded">
                      <Award className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" /> {cert}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Industries */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Briefcase className="w-5 h-5 mr-2 text-indigo-500" /> Typical Industries
              </h2>
              <div className="flex flex-wrap gap-2">
                {(career.industries || []).map((industry, idx) => (
                  <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                    {industry}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
