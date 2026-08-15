const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const profileService = {
  // Get User Profile
  getProfile: async () => {
    const res = await fetch('/api/profile/me', { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch profile info.');
    return await res.json();
  },

  // Saved Skills
  getSavedSkills: async () => {
    const res = await fetch('/api/profile/skills', { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch saved skills.');
    return await res.json();
  },

  addSavedSkills: async (skills) => {
    const res = await fetch('/api/profile/skills', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ skills }),
    });
    if (!res.ok) throw new Error('Failed to save skills.');
    return await res.json();
  },

  updateSavedSkills: async (skills) => {
    const res = await fetch('/api/profile/skills', {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ skills }),
    });
    if (!res.ok) throw new Error('Failed to update skills.');
    return await res.json();
  },

  deleteSavedSkill: async (skillName) => {
    const res = await fetch(`/api/profile/skills/${encodeURIComponent(skillName)}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete skill.');
    return await res.json();
  },

  // Saved Careers
  getSavedCareers: async () => {
    const res = await fetch('/api/profile/careers', { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch saved career goals.');
    return await res.json();
  },

  saveCareerGoal: async (careerData) => {
    const res = await fetch('/api/profile/careers', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        career_name: careerData.career_name,
        current_skills: careerData.current_skills || [],
        experience_level: careerData.experience_level || 'Beginner',
        learning_time: careerData.learning_time || '10 hrs/week',
        target_timeline: careerData.target_timeline || '2 months',
        roadmap_data: careerData.roadmap_data || {},
      }),
    });
    if (!res.ok) throw new Error('Failed to save career goal.');
    return await res.json();
  },

  getSavedCareerById: async (careerId) => {
    const res = await fetch(`/api/profile/careers/${careerId}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to load saved career roadmap.');
    return await res.json();
  },

  updateSavedCareer: async (careerId, updateData) => {
    const res = await fetch(`/api/profile/careers/${careerId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updateData),
    });
    if (!res.ok) throw new Error('Failed to update career goal.');
    return await res.json();
  },

  deleteSavedCareer: async (careerId) => {
    const res = await fetch(`/api/profile/careers/${careerId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to remove saved career.');
    return await res.json();
  },
};
