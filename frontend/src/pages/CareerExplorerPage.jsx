import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Filter, Briefcase, AlertTriangle, ChevronRight, GraduationCap } from 'lucide-react';
import { careerService } from '../services/careerService';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const CATEGORIES = [
  'All',
  'Technology & Software',
  'Design & Creative',
  'Business & Management',
  'Marketing & Media',
  'Finance & Accounting',
  'Healthcare & Life Sciences',
  'Education & Research',
  'Engineering',
  'Government & Public Sector',
  'Law & Professional Services'
];

export default function CareerExplorerPage() {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showBeginnerFriendly, setShowBeginnerFriendly] = useState(false);
  const [showEntryLevel, setShowEntryLevel] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const response = await careerService.getDatabase();
        // axios interceptor already unwraps response.data
        const data = Array.isArray(response) ? response : (response?.careers || []);
        setCareers(data);
      } catch (err) {
        console.error('Failed to fetch careers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCareers();
  }, []);

  const filteredCareers = careers.filter((career) => {
    const matchesSearch = career.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || career.category === selectedCategory;
    const matchesBeginner = showBeginnerFriendly ? career.beginner_friendly === true : true;
    const matchesEntryLevel = showEntryLevel ? career.entry_level === true : true;
    return matchesSearch && matchesCategory && matchesBeginner && matchesEntryLevel;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
          Explore 120+ Careers
        </h1>
        <p className="mt-4 text-xl text-gray-600">
          Discover your next career path from our comprehensive database of professional roles.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="max-w-7xl mx-auto mb-8 bg-indigo-600 text-white py-3 px-6 rounded-lg shadow-sm flex items-center justify-center space-x-2">
        <Briefcase className="w-5 h-5" />
        <span className="font-medium text-lg">120+ Careers across 10 Categories</span>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        {/* Left Panel: Filters */}
        <div className="w-full md:w-64 flex-shrink-0 space-y-6">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Filter className="w-5 h-5 mr-2 text-indigo-500" />
              Filters
            </h3>
            
            {/* Search */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Careers</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. Software Engineer"
                  className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Toggle Filters */}
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  checked={showBeginnerFriendly}
                  onChange={(e) => setShowBeginnerFriendly(e.target.checked)}
                />
                <span className="text-sm text-gray-700">Beginner-Friendly</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  checked={showEntryLevel}
                  onChange={(e) => setShowEntryLevel(e.target.checked)}
                />
                <span className="text-sm text-gray-700">Entry Level Only</span>
              </label>
            </div>
          </div>
        </div>

        {/* Main Area: Career Cards */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white rounded-xl h-64 animate-pulse shadow-sm border border-gray-100"></div>
              ))}
            </div>
          ) : filteredCareers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCareers.map((career) => (
                <div 
                  key={career.slug} 
                  className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col h-full cursor-pointer group"
                  onClick={() => navigate(`/career/${career.slug}`)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {career.category}
                    </span>
                    {career.regulated && (
                      <AlertTriangle className="w-5 h-5 text-amber-500" title="Regulated Profession" />
                    )}
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {career.name}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">
                    {career.description}
                  </p>
                  
                  <div className="mb-4 flex flex-wrap gap-2">
                    {(career.core_skills || []).slice(0, 3).map((skill, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md border border-gray-200">
                        {skill}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                    {career.entry_level ? (
                      <span className="flex items-center text-xs font-medium text-emerald-600">
                        <GraduationCap className="w-4 h-4 mr-1" /> Entry Level
                      </span>
                    ) : (
                      <span className="text-xs text-transparent">spacer</span>
                    )}
                    <span className="text-sm font-medium text-indigo-600 flex items-center group-hover:underline">
                      View <ChevronRight className="w-4 h-4 ml-1" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-12 text-center border border-gray-100 shadow-sm">
              <Search className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No careers found</h3>
              <p className="text-gray-500">
                We couldn't find any careers matching your filters. Try adjusting your search criteria.
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                  setShowBeginnerFriendly(false);
                  setShowEntryLevel(false);
                }}
                className="mt-6 bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
