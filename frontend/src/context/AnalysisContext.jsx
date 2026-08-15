import React, { createContext, useContext, useState, useEffect } from 'react';
import { getLatestAnalysis } from '../services/analysisService';

const AnalysisContext = createContext(null);

export const AnalysisProvider = ({ children }) => {
  const [analysis, setAnalysis] = useState(() => {
    const saved = localStorage.getItem('active_analysis');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [loading, setLoading] = useState(false);

  const setAnalysisData = (data) => {
    setAnalysis(data);
    if (data) {
      localStorage.setItem('active_analysis', JSON.stringify(data));
    } else {
      localStorage.removeItem('active_analysis');
    }
  };

  const loadLatestAnalysis = async () => {
    setLoading(true);
    try {
      const data = await getLatestAnalysis();
      if (data) {
        setAnalysisData(data);
      }
    } catch (err) {
      console.log("No remote analysis found, using active or fallback analysis");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Resume analysis feature removed; no longer fetching latest analysis on mount.
  }, []);

  return (
    <AnalysisContext.Provider value={{ analysis, setAnalysisData, loadLatestAnalysis, loading }}>
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysis = () => {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
};
