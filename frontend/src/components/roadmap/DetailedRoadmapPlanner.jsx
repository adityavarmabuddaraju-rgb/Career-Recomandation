import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Circle, ChevronDown, ChevronRight, Clock, 
  Layers, Code, HelpCircle, GraduationCap, ArrowRight, PlayCircle
} from 'lucide-react';
import Card from '../ui/Card';

export default function DetailedRoadmapPlanner({ data }) {
  if (!data || !data.roadmap_levels) return null;

  const [expandedLevels, setExpandedLevels] = useState({});
  const [expandedWeeks, setExpandedWeeks] = useState({});
  const [expandedSkills, setExpandedSkills] = useState({});
  const [completedTopics, setCompletedTopics] = useState(new Set());

  // Automatically expand the first level and week on load
  useEffect(() => {
    if (data.roadmap_levels.length > 0) {
      setExpandedLevels({ 0: true });
      if (data.roadmap_levels[0].weeks?.length > 0) {
        setExpandedWeeks({ '0-0': true });
      }
    }
  }, [data]);

  const toggleLevel = (i) => setExpandedLevels(prev => ({ ...prev, [i]: !prev[i] }));
  const toggleWeek = (key) => setExpandedWeeks(prev => ({ ...prev, [key]: !prev[key] }));
  const toggleSkill = (key) => setExpandedSkills(prev => ({ ...prev, [key]: !prev[key] }));

  const toggleTopic = (topicKey) => {
    setCompletedTopics(prev => {
      const next = new Set(prev);
      if (next.has(topicKey)) next.delete(topicKey);
      else next.add(topicKey);
      return next;
    });
  };

  // Calculate Progress
  let totalTopics = 0;
  data.roadmap_levels.forEach(lvl => {
    lvl.weeks?.forEach(week => {
      week.skills?.forEach(skill => {
        skill.topics?.forEach(() => {
          totalTopics++;
        });
      });
    });
  });

  const progressPercent = totalTopics === 0 ? 0 : Math.round((completedTopics.size / totalTopics) * 100);

  return (
    <div className="space-y-6">
      {/* ── PROGRESS BAR ── */}
      <Card className="p-6 bg-slate-900 text-white shadow-xl border-0 overflow-hidden relative">
        <div className="absolute top-0 left-0 h-1 bg-white/10 w-full" />
        <div 
          className="absolute top-0 left-0 h-1 bg-emerald-500 transition-all duration-1000 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
        
        <div className="flex flex-col sm:flex-row items-center gap-6 justify-between relative z-10">
          <div>
            <h3 className="text-2xl font-extrabold flex items-center gap-2">
              <GraduationCap className="text-emerald-400" size={24} /> Learning Planner
            </h3>
            <p className="text-slate-400 text-xs mt-1">
              Mark topics complete as you learn. Progress is saved locally in this session.
            </p>
          </div>
          
          <div className="text-center sm:text-right shrink-0">
            <div className="text-4xl font-extrabold text-emerald-400 tracking-tighter">
              {progressPercent}%
            </div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Roadmap Completed
            </div>
          </div>
        </div>
      </Card>

      {/* ── ROADMAP LEVELS ── */}
      <div className="space-y-4">
        {data.roadmap_levels.map((level, lIdx) => {
          const isLvlOpen = expandedLevels[lIdx];
          
          return (
            <div key={lIdx} className="border border-slate-200 rounded-2xl bg-white shadow-sm overflow-hidden transition-all duration-300">
              
              {/* Level Header */}
              <button 
                onClick={() => toggleLevel(lIdx)}
                className={`w-full px-5 py-4 flex items-center justify-between text-left transition-colors ${
                  isLvlOpen ? 'bg-indigo-50/50' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-sm ${
                    isLvlOpen ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {lIdx + 1}
                  </div>
                  <div>
                    <h3 className={`text-base font-extrabold ${isLvlOpen ? 'text-indigo-900' : 'text-slate-800'}`}>
                      {level.level_name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">{level.level_description}</p>
                  </div>
                </div>
                {isLvlOpen ? <ChevronDown className="text-indigo-400" /> : <ChevronRight className="text-slate-400" />}
              </button>

              {/* Level Content (Weeks) */}
              {isLvlOpen && level.weeks?.length > 0 && (
                <div className="p-4 sm:p-6 pt-2 bg-indigo-50/10 space-y-4">
                  {level.weeks.map((week, wIdx) => {
                    const weekKey = `${lIdx}-${wIdx}`;
                    const isWeekOpen = expandedWeeks[weekKey];

                    return (
                      <div key={wIdx} className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm">
                        
                        {/* Week Header */}
                        <button 
                          onClick={() => toggleWeek(weekKey)}
                          className={`w-full px-4 py-3 flex items-center justify-between text-left border-b border-transparent transition-colors ${
                            isWeekOpen ? 'bg-slate-50 border-slate-200' : 'hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-1 rounded">
                              {week.week_name}
                            </span>
                            <span className="text-sm font-bold text-slate-700">
                              {week.skills?.length} Skill{week.skills?.length !== 1 ? 's' : ''} to learn
                            </span>
                          </div>
                          {isWeekOpen ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-300" />}
                        </button>

                        {/* Week Content (Skills) */}
                        {isWeekOpen && week.skills?.length > 0 && (
                          <div className="p-4 space-y-4 bg-slate-50/50">
                            {week.skills.map((skill, sIdx) => {
                              const skillKey = `${lIdx}-${wIdx}-${sIdx}`;
                              const isSkillOpen = expandedSkills[skillKey];

                              // Calculate skill progress
                              let skillTopics = 0;
                              let skillCompleted = 0;
                              skill.topics?.forEach((t, tIdx) => {
                                skillTopics++;
                                if (completedTopics.has(`${skillKey}-${tIdx}`)) skillCompleted++;
                              });
                              const skillDone = skillTopics > 0 && skillCompleted === skillTopics;

                              return (
                                <div key={sIdx} className={`border rounded-xl bg-white overflow-hidden transition-all duration-300 ${
                                  skillDone ? 'border-emerald-200 ring-1 ring-emerald-100' : 'border-slate-200 shadow-sm'
                                }`}>
                                  
                                  {/* Skill Header */}
                                  <div className="p-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                                    <div className="flex items-start gap-3">
                                      <div className={`mt-0.5 shrink-0 transition-colors ${skillDone ? 'text-emerald-500' : 'text-slate-300'}`}>
                                        {skillDone ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                                      </div>
                                      <div>
                                        <h4 className="text-base font-extrabold text-slate-900">{skill.skill_name}</h4>
                                        <p className="text-xs text-slate-500 leading-relaxed max-w-xl mt-1">{skill.why_needed}</p>
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3 shrink-0 ml-8 sm:ml-0">
                                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded flex items-center gap-1">
                                        <Clock size={12} /> {skill.estimated_time || 'Variable'}
                                      </span>
                                      <button 
                                        onClick={() => toggleSkill(skillKey)}
                                        className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                                      >
                                        {isSkillOpen ? 'Hide Topics' : 'Start Learning'} {isSkillOpen ? <ChevronDown size={14}/> : <PlayCircle size={14}/>}
                                      </button>
                                    </div>
                                  </div>

                                  {/* Skill Content (Topics & Details) */}
                                  {isSkillOpen && (
                                    <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/50">
                                      
                                      {/* Prerequisites & Next */}
                                      <div className="flex flex-wrap gap-4 mb-6">
                                        {skill.prerequisites?.length > 0 && skill.prerequisites[0] !== 'None' && (
                                          <div className="text-xs">
                                            <span className="font-bold text-slate-500 block mb-1">Prerequisites:</span>
                                            <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2 py-1 rounded-md font-medium">
                                              {skill.prerequisites.join(', ')}
                                            </span>
                                          </div>
                                        )}
                                      </div>

                                      {/* Topics Checklists */}
                                      <div className="space-y-4 mb-6">
                                        <h5 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Topics to Master</h5>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                          {skill.topics?.map((topic, tIdx) => {
                                            const topicKey = `${skillKey}-${tIdx}`;
                                            const isDone = completedTopics.has(topicKey);

                                            return (
                                              <div 
                                                key={tIdx} 
                                                onClick={() => toggleTopic(topicKey)}
                                                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                                                  isDone 
                                                    ? 'bg-emerald-50/50 border-emerald-200' 
                                                    : 'bg-white border-slate-200 hover:border-indigo-300 shadow-sm hover:shadow'
                                                }`}
                                              >
                                                <div className="flex items-start gap-3">
                                                  <div className={`mt-0.5 shrink-0 ${isDone ? 'text-emerald-500' : 'text-slate-300'}`}>
                                                    {isDone ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                                                  </div>
                                                  <div>
                                                    <span className={`font-bold text-sm block mb-1.5 ${isDone ? 'text-emerald-900' : 'text-slate-800'}`}>
                                                      {topic.topic_name}
                                                    </span>
                                                    {topic.subtopics?.length > 0 && (
                                                      <ul className="space-y-1">
                                                        {topic.subtopics.map((sub, sidx) => (
                                                          <li key={sidx} className={`text-xs flex items-center gap-1.5 ${isDone ? 'text-emerald-700' : 'text-slate-500'}`}>
                                                            <span className={isDone ? 'text-emerald-400' : 'text-slate-300'}>▪</span> {sub}
                                                          </li>
                                                        ))}
                                                      </ul>
                                                    )}
                                                  </div>
                                                </div>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>

                                      {/* Practice & Mini Task */}
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                        {skill.practice && (
                                          <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                                            <h5 className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-500 mb-1">Practice</h5>
                                            <p className="text-xs font-medium text-indigo-900">{skill.practice}</p>
                                          </div>
                                        )}
                                        {skill.mini_task && (
                                          <div className="p-4 bg-violet-50 border border-violet-100 rounded-xl">
                                            <h5 className="text-[10px] font-extrabold uppercase tracking-wider text-violet-500 mb-1">Mini Task</h5>
                                            <p className="text-xs font-medium text-violet-900">{skill.mini_task}</p>
                                          </div>
                                        )}
                                      </div>

                                      {/* Next Skill flow */}
                                      {skill.next_skill && (
                                        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                                          <div className="text-xs">
                                            <span className="text-slate-500">When finished, move to: </span>
                                            <span className="font-bold text-slate-800">{skill.next_skill}</span>
                                          </div>
                                        </div>
                                      )}

                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          );
        })}
      </div>
    </div>
  );
}
