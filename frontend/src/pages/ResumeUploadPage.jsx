import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileUp, File, X, Loader2, ChevronRight, ChevronLeft, User, GraduationCap, Sparkles, CheckCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import ProgressBar from '../components/ui/ProgressBar';
import { uploadResume } from '../services/resumeService';
import { analyzeResume } from '../services/analysisService';
import { useToast } from '../context/ToastContext';
import { useAnalysis } from '../context/AnalysisContext';

const INTEREST_OPTIONS = [
  { value: 'Technology', emoji: '💻', desc: 'Software, Data, AI, IT' },
  { value: 'Healthcare', emoji: '🏥', desc: 'Nursing, Medicine, Clinical' },
  { value: 'Finance & Banking', emoji: '💰', desc: 'Investment, Accounting' },
  { value: 'Business & Management', emoji: '📊', desc: 'Operations, Strategy, HR' },
  { value: 'Design & Creative', emoji: '🎨', desc: 'UX, Graphic, Product' },
  { value: 'Education & Teaching', emoji: '🎓', desc: 'Teaching, Curriculum, EdTech' },
  { value: 'Research & Science', emoji: '🔬', desc: 'Lab Science, Academia, R&D' },
  { value: 'Marketing & Media', emoji: '📣', desc: 'Digital, PR, Content' },
  { value: 'Legal & Compliance', emoji: '⚖️', desc: 'Law, Policy, Compliance' },
  { value: 'Engineering', emoji: '⚙️', desc: 'Civil, Mechanical, Electrical' },
  { value: 'Social Work & NGO', emoji: '🤝', desc: 'Non-profit, Social Work' },
  { value: 'Hospitality & Tourism', emoji: '✈️', desc: 'Hotel, Events, Travel' },
];

const WORK_STYLES = [
  { value: 'analytical', label: 'Analytical & Data-Driven', icon: '🧠' },
  { value: 'creative', label: 'Creative & Artistic', icon: '🎨' },
  { value: 'people-facing', label: 'People & Relationships', icon: '🤝' },
  { value: 'hands-on', label: 'Hands-On & Practical', icon: '🔧' },
  { value: 'strategic', label: 'Strategic & Leadership', icon: '🎯' },
  { value: 'research', label: 'Research & Learning', icon: '🔬' },
];

const EDUCATION_LEVELS = [
  'High School / Secondary',
  'Diploma / Certificate',
  "Bachelor's Degree",
  "Master's Degree",
  'PhD / Doctorate',
  'Professional Degree (MD, LLB, MBA)',
  'Self-Taught / Vocational',
];

const EXPERIENCE_LEVELS = [
  { value: '0', label: 'Student / No Experience' },
  { value: '1-2', label: '1–2 Years' },
  { value: '3-5', label: '3–5 Years' },
  { value: '6-10', label: '6–10 Years' },
  { value: '10+', label: '10+ Years' },
];

export default function ResumeUploadPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { setAnalysisData } = useAnalysis();
  const fileInputRef = useRef(null);

  const [step, setStep] = useState(1); // 1, 2, 3
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('Reading your profile...');

  const [profile, setProfile] = useState({
    interests: [],
    work_style: '',
    education_level: '',
    field_of_study: '',
    experience_years: '',
  });

  const analysisMessages = [
    'Reading your career profile...',
    'Detecting your career domain...',
    'Extracting skills & competencies...',
    'Matching career pathways...',
    'Building your personalized roadmap...',
    'Finalizing recommendations...',
  ];

  // ─── Handlers ───────────────────────────────────────────────────────────

  const toggleInterest = (val) => {
    setProfile((p) => ({
      ...p,
      interests: p.interests.includes(val)
        ? p.interests.filter((i) => i !== val)
        : [...p.interests, val],
    }));
  };

  const handleFile = (selectedFile) => {
    const validExts = ['.pdf', '.docx'];
    const name = selectedFile.name.toLowerCase();
    if (validExts.some((e) => name.endsWith(e)) && selectedFile.size <= 10 * 1024 * 1024) {
      setFile(selectedFile);
    } else {
      showToast('Please upload a valid PDF or DOCX file under 10MB.', 'error');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setIsDragging(true);
    else setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handleAnalyze = async () => {
    if (!file) {
      showToast('Please upload your resume or CV before analyzing.', 'error');
      return;
    }
    setIsAnalyzing(true);
    let stepIdx = 0;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return 90;
        if (prev > 0 && prev % 15 === 0 && stepIdx < analysisMessages.length - 1) {
          stepIdx++;
          setStatusMessage(analysisMessages[stepIdx]);
        }
        return prev + 3;
      });
    }, 150);

    try {
      const formData = new FormData();
      formData.append('file', file);
      const uploadRes = await uploadResume(formData);
      if (uploadRes?.id) {
        const analysisRes = await analyzeResume(uploadRes.id);
        if (analysisRes) {
          // Inject user profile context into the analysis
          analysisRes._profile_context = profile;
          setAnalysisData(analysisRes);
        }
      }
    } catch (err) {
      console.warn('Analysis fallback triggered:', err);
    } finally {
      clearInterval(interval);
      setProgress(100);
      setStatusMessage('Analysis complete!');
      setTimeout(() => navigate('/dashboard'), 500);
    }
  };

  // ─── Analyzing screen ────────────────────────────────────────────────────

  if (isAnalyzing) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-indigo-500 rounded-full blur-2xl opacity-20 animate-pulse scale-150" />
          <Loader2 className="w-20 h-20 text-indigo-600 animate-spin relative z-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">{statusMessage}</h2>
        <p className="text-slate-500 mb-8 max-w-md text-sm">
          Our AI is scanning your background across all career domains to find your best-fit paths.
        </p>
        <div className="w-full max-w-sm">
          <ProgressBar value={progress} color="indigo" size="md" showPercentage />
        </div>
      </div>
    );
  }

  // ─── Step indicators ─────────────────────────────────────────────────────

  const StepBar = () => (
    <div className="flex items-center justify-center gap-0 mb-8">
      {[
        { n: 1, icon: User, label: 'Interests' },
        { n: 2, icon: GraduationCap, label: 'Education' },
        { n: 3, icon: FileUp, label: 'Upload CV' },
      ].map((s, idx, arr) => (
        <React.Fragment key={s.n}>
          <div className="flex flex-col items-center gap-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                step > s.n
                  ? 'bg-emerald-500 text-white'
                  : step === s.n
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              {step > s.n ? <CheckCircle className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
            </div>
            <span className={`text-xs font-semibold ${step === s.n ? 'text-indigo-700' : 'text-slate-400'}`}>
              {s.label}
            </span>
          </div>
          {idx < arr.length - 1 && (
            <div className={`h-0.5 w-16 mb-5 mx-1 ${step > s.n ? 'bg-emerald-400' : 'bg-slate-200'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  // ─── Step 1: Interests & Work Style ──────────────────────────────────────

  const Step1 = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-base font-bold text-slate-900 mb-1">Which career domains interest you?</h3>
        <p className="text-xs text-slate-500 mb-4">Select all that apply. This helps us focus your career recommendations.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {INTEREST_OPTIONS.map((opt) => {
            const selected = profile.interests.includes(opt.value);
            return (
              <button
                key={opt.value}
                onClick={() => toggleInterest(opt.value)}
                className={`p-3 rounded-xl border text-left transition-all text-xs ${
                  selected
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-900'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-200'
                }`}
              >
                <span className="text-xl block mb-1">{opt.emoji}</span>
                <span className="font-bold block">{opt.value}</span>
                <span className="text-slate-400 text-[10px]">{opt.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-base font-bold text-slate-900 mb-1">What is your preferred work style?</h3>
        <p className="text-xs text-slate-500 mb-4">Choose the one that best describes how you like to work.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {WORK_STYLES.map((ws) => (
            <button
              key={ws.value}
              onClick={() => setProfile((p) => ({ ...p, work_style: ws.value }))}
              className={`p-3 rounded-xl border text-left text-xs transition-all ${
                profile.work_style === ws.value
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-900'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-200'
              }`}
            >
              <span className="text-xl block mb-1">{ws.icon}</span>
              <span className="font-bold">{ws.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // ─── Step 2: Education & Experience ──────────────────────────────────────

  const Step2 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-bold text-slate-900 mb-2">Highest Education Level</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {EDUCATION_LEVELS.map((level) => (
            <button
              key={level}
              onClick={() => setProfile((p) => ({ ...p, education_level: level }))}
              className={`p-3 rounded-xl border text-left text-xs font-medium transition-all ${
                profile.education_level === level
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-900'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-900 mb-2">Field of Study / Specialization</label>
        <input
          type="text"
          placeholder="e.g. Nursing, Computer Science, MBA Finance, Graphic Design..."
          value={profile.field_of_study}
          onChange={(e) => setProfile((p) => ({ ...p, field_of_study: e.target.value }))}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-900 mb-2">Years of Professional Experience</label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {EXPERIENCE_LEVELS.map((exp) => (
            <button
              key={exp.value}
              onClick={() => setProfile((p) => ({ ...p, experience_years: exp.value }))}
              className={`p-3 rounded-xl border text-center text-xs font-bold transition-all ${
                profile.experience_years === exp.value
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-900'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              {exp.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // ─── Step 3: Upload ───────────────────────────────────────────────────────

  const Step3 = () => (
    <div className="space-y-6">
      {!file ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${
            isDragging ? 'border-indigo-500 bg-indigo-50 scale-[1.01]' : 'border-slate-300 bg-slate-50 hover:border-indigo-300 hover:bg-white'
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-white rounded-full shadow-sm border border-slate-200">
              <FileUp className="w-10 h-10 text-indigo-500" />
            </div>
          </div>
          <h3 className="text-base font-semibold text-slate-900 mb-1">Drag & drop your resume or CV here</h3>
          <p className="text-sm text-slate-500 mb-4">PDF or DOCX — max 10MB</p>
          <Button variant="secondary" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
            Browse Files
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.docx"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-lg border border-emerald-200 text-emerald-600">
              <File className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold text-slate-900 text-sm truncate max-w-xs">{file.name}</p>
              <p className="text-xs text-slate-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB · {file.name.split('.').pop().toUpperCase()}
              </p>
            </div>
          </div>
          <button
            onClick={() => setFile(null)}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Profile summary */}
      {(profile.interests.length > 0 || profile.education_level) && (
        <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-2 text-xs text-slate-700">
          <p className="font-bold text-indigo-800 mb-2">Your Profile Summary</p>
          {profile.interests.length > 0 && (
            <p><span className="font-semibold">Interests:</span> {profile.interests.slice(0, 3).join(', ')}{profile.interests.length > 3 && ` +${profile.interests.length - 3} more`}</p>
          )}
          {profile.education_level && <p><span className="font-semibold">Education:</span> {profile.education_level}{profile.field_of_study && ` in ${profile.field_of_study}`}</p>}
          {profile.experience_years && <p><span className="font-semibold">Experience:</span> {profile.experience_years} years</p>}
          {profile.work_style && <p><span className="font-semibold">Work style:</span> {profile.work_style}</p>}
        </div>
      )}
    </div>
  );

  // ─── Main render ──────────────────────────────────────────────────────────

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5" /> Universal Career Analysis
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Build Your Career Profile</h1>
        <p className="text-slate-500 mt-2 text-sm">
          Tell us about yourself and upload your resume. Our AI will recommend careers across any domain.
        </p>
      </div>

      <Card className="p-8">
        <StepBar />

        {step === 1 && <Step1 />}
        {step === 2 && <Step2 />}
        {step === 3 && <Step3 />}

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
          {step > 1 ? (
            <Button variant="secondary" onClick={() => setStep(step - 1)} icon={ChevronLeft}>
              Back
            </Button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <Button onClick={() => setStep(step + 1)} icon={ChevronRight}>
              Continue
            </Button>
          ) : (
            <Button onClick={handleAnalyze} icon={Sparkles} disabled={!file}>
              Analyze My Profile
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
