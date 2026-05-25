import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Cpu, Shield, Linkedin, Mail, Github, Smartphone, Play, Upload, Users, Eye, Database, Zap, Award, Briefcase } from 'lucide-react';

// ============================================================================
// PERFORMANCE METRICS VISUALIZATION
// ============================================================================
const PerformanceBar = ({ label, value, color = 'cyan' }) => {
  const colorMap = {
    cyan: 'bg-cyan-500',
    emerald: 'bg-emerald-500',
    indigo: 'bg-indigo-500',
    amber: 'bg-amber-500'
  };
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-slate-300">{label}</span>
        <span className="text-sm font-semibold text-cyan-400">{value}%</span>
      </div>
      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className={`h-full ${colorMap[color]} rounded-full`}
        />
      </div>
    </div>
  );
};

// ============================================================================
// INTERACTIVE PROJECT CARD WITH TABS
// ============================================================================
const InteractiveProjectCard = ({ project, idx }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const modelMetrics = {
    'Avicast': { precision: 92, recall: 88, mAP: 89, fps: 45 },
    'ELUPD Inventory Management': { precision: 95, recall: 93, mAP: 94, fps: 60 },
    'Mobile Field App (Flutter)': { precision: 87, recall: 85, mAP: 86, fps: 30 },
    'Attendance Check (Ongoing)': { precision: 96, recall: 94, mAP: 95, fps: 24 }
  };

  const metrics = modelMetrics[project.title] || { precision: 0, recall: 0, mAP: 0, fps: 0 };

  return (
    <motion.article
      key={project.title}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.12, duration: 0.45 }}
      className="border border-slate-700 bg-slate-900/70 rounded-2xl shadow-lg shadow-cyan-500/20 overflow-hidden hover:shadow-cyan-500/40 transition-all duration-300"
    >
      <div className="flex border-b border-slate-700 bg-slate-800/50">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-all ${
            activeTab === 'overview'
              ? 'text-cyan-400 border-b-2 border-cyan-500 bg-slate-700/50'
              : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('metrics')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-all ${
            activeTab === 'metrics'
              ? 'text-cyan-400 border-b-2 border-cyan-500 bg-slate-700/50'
              : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          Model Metrics
        </button>
      </div>

      <div className="p-5">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' ? (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-3 flex items-center gap-2 text-cyan-300 text-sm uppercase tracking-widest">
                {project.category === 'Computer Vision' ? <Camera size={16} /> : project.category === 'Enterprise' ? <Cpu size={16} /> : <Smartphone size={16} />}
                <span>{project.category}</span>
              </div>
              <h4 className="text-xl font-semibold leading-snug">{project.title}</h4>
              <p className="mt-2 text-slate-300">{project.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.skills.map((skill) => (
                  <span key={skill} className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-medium text-cyan-200">
                    {skill}
                  </span>
                ))}
              </div>
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-block text-cyan-300 hover:text-cyan-200 text-sm font-medium"
              >
                View case study →
              </a>
            </motion.div>
          ) : (
            <motion.div
              key="metrics"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-1 mb-4">
                <PerformanceBar label="Precision" value={metrics.precision} color="cyan" />
                <PerformanceBar label="Recall" value={metrics.recall} color="emerald" />
                <PerformanceBar label="mAP@0.5" value={metrics.mAP} color="indigo" />
              </div>
              <div className="mt-4 pt-4 border-t border-slate-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Inference Speed</span>
                  <span className="text-sm font-semibold text-amber-400">{metrics.fps} FPS</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  );
};

// ============================================================================
// LIVE PREVIEW SIMULATOR
// ============================================================================
const LivePreviewSimulator = ({ imageSrc, detections: externalDetections }) => {
  const [isRunning, setIsRunning] = useState(true);
  const [detections, setDetections] = useState([
    { id: 1, x: 15, y: 20, w: 30, h: 35, label: 'Bird', confidence: 94.6 },
    { id: 2, x: 55, y: 35, w: 28, h: 32, label: 'Bird', confidence: 89.2 },
    { id: 3, x: 70, y: 10, w: 22, h: 25, label: 'Bird', confidence: 91.8 }
  ]);

  useEffect(() => {
    if (!isRunning || imageSrc) return;
    const interval = setInterval(() => {
      setDetections(prev => prev.map(d => ({
        ...d,
        x: (d.x + (Math.random() - 0.5) * 5 + 100) % 100,
        y: (d.y + (Math.random() - 0.5) * 5 + 100) % 100,
        confidence: Math.min(99, Math.max(70, d.confidence + (Math.random() - 0.5) * 3))
      })));
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, imageSrc]);

  const renderDetections = imageSrc && externalDetections?.length ? externalDetections : detections;
  const detectedCount = renderDetections.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-10 rounded-3xl border border-slate-700 bg-slate-900/70 p-6 shadow-2xl shadow-emerald-500/20"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <h3 className="text-2xl font-bold">Live CV Inference Simulator</h3>
          <p className="text-sm text-slate-400 mt-1">Preview the uploaded photo with sample bird detections overlaid in real time.</p>
        </div>
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="px-4 py-2 bg-emerald-500/20 text-emerald-300 rounded-lg hover:bg-emerald-500/30 transition-all text-sm font-medium"
        >
          {isRunning ? 'Pause' : 'Resume'}
        </button>
      </div>
      
      <div className="relative w-full bg-slate-950 rounded-2xl overflow-hidden border border-slate-700" style={{ paddingBottom: '56.25%' }}>
        {imageSrc ? (
          <div className="absolute inset-0">
            <img src={imageSrc} alt="Uploaded input" className="w-full h-full object-cover opacity-90" />
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
              {renderDetections.map((det) => (
                <g key={det.id}>
                  <rect x={det.x} y={det.y} width={det.w} height={det.h} fill="none" stroke="#3b82f6" strokeWidth="1.3" />
                  <rect x={det.x} y={det.y - 4} width={det.w} height="4" fill="#3b82f6" opacity="0.85" />
                  <text x={det.x + 0.8} y={det.y - 1} fontSize="2.5" fill="#ffffff" fontWeight="bold" fontFamily="monospace">
                    {det.label} {det.confidence.toFixed(1)}%
                  </text>
                </g>
              ))}
            </svg>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-slate-800 to-slate-950">
            <svg viewBox="0 0 100 100" className="w-full h-full absolute inset-0">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#334155" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" opacity="0.3" />
              {renderDetections.map((det) => (
                <g key={det.id}>
                  <rect x={det.x} y={det.y} width={det.w} height={det.h} fill="none" stroke="#06b6d4" strokeWidth="0.8" />
                  <rect x={det.x} y={det.y - 3} width={det.w} height="3.5" fill="#06b6d4" opacity="0.8" />
                  <text x={det.x + 0.5} y={det.y - 0.5} fontSize="2" fill="white" fontWeight="bold" fontFamily="monospace">
                    {det.label} {det.confidence.toFixed(1)}%
                  </text>
                </g>
              ))}
              <text x="2" y="5" fontSize="2.5" fill="#06b6d4" fontWeight="bold" fontFamily="monospace">FPS: 45</text>
              <text x="2" y="10" fontSize="1.8" fill="#0ea5e9" fontFamily="monospace" opacity="0.7">Detections: {detectedCount}</text>
            </svg>
          </div>
        )}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg bg-slate-800/50 p-4">
          <p className="text-xs text-slate-400 uppercase tracking-wide">Model</p>
          <p className="text-lg font-bold text-cyan-400 mt-1">YOLOv11n</p>
        </div>
        <div className="rounded-lg bg-slate-800/50 p-4">
          <p className="text-xs text-slate-400 uppercase tracking-wide">Latency</p>
          <p className="text-lg font-bold text-emerald-400 mt-1">22ms</p>
        </div>
        <div className="rounded-lg bg-slate-800/50 p-4">
          <p className="text-xs text-slate-400 uppercase tracking-wide">Birds</p>
          <p className="text-lg font-bold text-indigo-400 mt-1">{detectedCount}</p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-700 bg-slate-900/80 p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm uppercase tracking-wide text-slate-400">Detection Summary</p>
          <p className="text-sm text-cyan-300">Overlay sample</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {renderDetections.map((det) => (
            <div key={det.id} className="rounded-lg border border-slate-700 bg-slate-950/80 p-3 text-sm text-slate-300">
              <p className="font-semibold text-cyan-300">{det.label}</p>
              <p>Confidence: {det.confidence.toFixed(1)}%</p>
              <p>Box: {Math.round(det.w)}x{Math.round(det.h)} at ({Math.round(det.x)},{Math.round(det.y)})</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// ============================================================================
// SKILL CATEGORY
// ============================================================================
const SkillCategory = ({ title, icon: Icon, skills, color }) => {
  const colorMap = {
    cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30' },
    emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
    indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/30' },
    amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' }
  };
  const colors = colorMap[color];
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className={`rounded-2xl border ${colors.border} ${colors.bg} backdrop-blur-sm p-6 hover:shadow-lg transition-all duration-300`}>
      <div className="flex items-center gap-3 mb-4">
        <Icon className={colors.text} size={24} />
        <h4 className="text-lg font-bold">{title}</h4>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, i) => (
          <motion.span key={skill} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05, duration: 0.3 }} className={`rounded-full ${colors.bg} border ${colors.border} ${colors.text} px-3 py-1 text-sm font-medium hover:scale-110 transition-transform`}>
            {skill}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
};

// ============================================================================
// TIMELINE
// ============================================================================
const TimelineItem = ({ year, title, role, description, isLeading }) => {
  return (
    <motion.div initial={{ opacity: 0, x: isLeading ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className={`flex gap-6 mb-8 ${isLeading ? 'flex-row-reverse' : ''}`}>
      <div className="flex flex-col items-center">
        <div className="w-4 h-4 rounded-full bg-cyan-500 border-2 border-cyan-400 shadow-lg shadow-cyan-500/50"></div>
        <div className="w-1 h-16 bg-gradient-to-b from-cyan-500/50 to-transparent"></div>
      </div>
      <div className="flex-1 rounded-2xl border border-slate-700 bg-slate-900/70 p-6 hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300">
        <div className="text-sm font-bold text-cyan-400 uppercase tracking-wide">{year}</div>
        <h4 className="text-xl font-bold mt-2">{title}</h4>
        <p className="text-sm text-emerald-400 font-semibold mt-1">{role}</p>
        <p className="text-slate-300 mt-3 text-sm">{description}</p>
      </div>
    </motion.div>
  );
};

// Computer Vision Logo Component
const ComputerVisionLogo = ({ size = 32 }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className="text-cyan-400">
    {/* Background circle */}
    <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
    
    {/* Eye outer circle */}
    <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="2" />
    
    {/* Inner iris */}
    <circle cx="50" cy="50" r="18" fill="none" stroke="currentColor" strokeWidth="1.5" />
    
    {/* Pupil with gradient effect */}
    <circle cx="50" cy="50" r="10" fill="currentColor" />
    
    {/* Detection boxes - top right */}
    <rect x="60" y="25" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <rect x="75" y="20" width="8" height="8" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6" />
    
    {/* Detection boxes - bottom left */}
    <rect x="18" y="63" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <rect x="12" y="75" width="9" height="9" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6" />
    
    {/* Scan lines */}
    <line x1="35" y1="48" x2="65" y2="48" stroke="currentColor" strokeWidth="1" opacity="0.4" />
    <line x1="30" y1="55" x2="70" y2="55" stroke="currentColor" strokeWidth="1" opacity="0.4" />
    
    {/* Corner markers */}
    <line x1="20" y1="20" x2="30" y2="20" stroke="currentColor" strokeWidth="1" opacity="0.5" />
    <line x1="20" y1="20" x2="20" y2="30" stroke="currentColor" strokeWidth="1" opacity="0.5" />
    
    <line x1="80" y1="20" x2="70" y2="20" stroke="currentColor" strokeWidth="1" opacity="0.5" />
    <line x1="80" y1="20" x2="80" y2="30" stroke="currentColor" strokeWidth="1" opacity="0.5" />
  </svg>
);

const socials = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/jefferson-inere', icon: <Linkedin size={16} /> },
  { label: 'GitHub', href: 'https://github.com/jepooyyy', icon: <Github size={16} /> }
];

const projects = [
  {
    title: 'Avicast',
    category: 'Computer Vision',
    summary: 'Bird flock detection and census using real-time image processing, counting, and clustering.' ,
    skills: ['OpenCV', 'Python', 'TensorFlow', 'Vue.js'],
    link: '#'
  },
  {
    title: 'ELUPD Inventory Management',
    category: 'Enterprise',
    summary: 'Full inventory management with product tracking, stock replenishment, and reporting dashboards.',
    skills: ['React', 'Node.js', 'PostgreSQL', 'Express'],
    link: '#'
  },
  {
    title: 'Mobile Field App (Flutter)',
    category: 'Mobile',
    summary: 'Field tech mobile app for on-site data capture, offline sync, and location-enabled workflow.',
    skills: ['Flutter', 'Dart', 'Firebase', 'REST API'],
    link: '#'
  },
  {
    title: 'Attendance Check (Ongoing)',
    category: 'AI Mobile',
    summary: 'AI-powered attendance checking on mobile with face recognition and business analytics.',
    skills: ['React Native', 'PyTorch', 'Mobile ML', 'Azure Media Services'],
    link: '#'
  }
];

const cardClass = 'border border-slate-700 bg-slate-900/70 p-5 rounded-2xl shadow-lg shadow-cyan-500/20 transition transform hover:-translate-y-1 hover:scale-[1.02]';

function App() {
  const hero = useMemo(
    () => ({
      role: 'Full Stack + AI Engineer',
      name: 'AviJep',
      description:
        'I build modern web and mobile products, annotate images for computer vision, and train AI models for realistic image processing deployment.'
    }),
    []
  );

  const specialty = [
    'Web Development',
    'Mobile Development',
    'Image Annotation for Computer Vision',
    'Machine Learning & AI Training',
    'Full Stack Development',
    'AI Engineering'
  ];

  const [showPortfolio, setShowPortfolio] = useState(false);

  const [birdDetection, setBirdDetection] = useState({
    loading: false,
    count: null,
    image: null,
    originalImage: null,
    error: null,
    sampleDetections: []
  });

  async function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const maxSizeBytes = 5 * 1024 * 1024; // 5MB max
    if (file.size > maxSizeBytes) {
      setBirdDetection({
        loading: false,
        count: null,
        image: null,
        originalImage: null,
        error: 'Image exceeds 5MB limit. Please choose a smaller file.',
        sampleDetections: []
      });
      return;
    }

    // Create preview URL for original image
    const originalImageUrl = URL.createObjectURL(file);

    const sampleDetections = [
      { id: 1, x: 12, y: 18, w: 28, h: 22, label: 'Bird', confidence: 94.6 },
      { id: 2, x: 54, y: 32, w: 24, h: 26, label: 'Bird', confidence: 89.2 },
      { id: 3, x: 72, y: 16, w: 18, h: 20, label: 'Bird', confidence: 91.8 }
    ];

    setBirdDetection({ 
      loading: true, 
      count: null, 
      image: null, 
      originalImage: originalImageUrl,
      error: null,
      sampleDetections
    });

    const formData = new FormData();
    formData.append('image', file);

    try {
      // Try to connect to the backend with a timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
      
      // Use environment variable for API URL, fallback to localhost
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

      const response = await fetch(`${apiUrl}/api/detect/`, {
        method: 'POST',
        body: formData,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch {
        data = null;
      }

      if (!response.ok) {
        const serverError = data?.error || response.statusText || 'Detection failed';
        throw new Error(serverError + (data?.traceback ? `: ${data.traceback}` : ''));
      }

      setBirdDetection({
        loading: false,
        count: data?.bird_count ?? sampleDetections.length,
        image: data?.annotated_image || null,
        originalImage: originalImageUrl,
        error: null,
        sampleDetections: data?.detections || sampleDetections
      });
    } catch (error) {
      let errorMessage = error.toString();
      
      // Provide more helpful error messages
      if (error.name === 'AbortError') {
        errorMessage = 'Backend server is not responding. Make sure the Django server is running on http://localhost:8000';
      } else if (errorMessage.includes('Failed to fetch')) {
        errorMessage = 'Cannot connect to backend server. Make sure the Django server is running on http://localhost:8000 with CORS enabled.';
      }

      setBirdDetection({
        loading: false,
        count: null,
        image: null,
        originalImage: originalImageUrl,
        error: errorMessage,
        sampleDetections
      });
    }
  }

  return (
    <AnimatePresence mode="wait">
      {!showPortfolio ? (
        <motion.div
          key="intro"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8 }}
          className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_20%_20%,#334155,transparent_35%),radial-gradient(circle_at_80%_10%,#0f172a,transparent_40%),linear-gradient(to_bottom,#060b14,#02060c)] text-slate-100"
        >
          <div className="text-center px-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <h1 className="text-5xl sm:text-7xl font-extrabold mb-4 bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                AviJep
              </h1>
              <p className="text-xl sm:text-2xl text-slate-300 mb-8">
                Full Stack + AI Engineer
              </p>
            </motion.div>
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.4 }}
              onClick={() => setShowPortfolio(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-8 py-4 text-lg font-semibold text-slate-950 transition hover:bg-cyan-400 hover:scale-105"
            >
              <Play size={20} />
              Enter Portfolio
            </motion.button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="portfolio"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="min-h-screen bg-[radial-gradient(circle_at_20%_20%,#334155,transparent_35%),radial-gradient(circle_at_80%_10%,#0f172a,transparent_40%),linear-gradient(to_bottom,#060b14,#02060c)] text-slate-100 scroll-smooth"
        >
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex flex-wrap items-center justify-between gap-3 max-w-6xl px-4 py-4 sm:px-8 lg:px-0">
          <div className="flex items-center gap-3">
            <ComputerVisionLogo size={32} />
            <h1 className="font-bold text-xl sm:text-2xl tracking-tight">{hero.name}</h1>
          </div>
          <nav className="flex flex-wrap items-center justify-end gap-3 text-sm text-slate-300">
            <a href="#about" className="rounded-md px-2 py-1 hover:bg-cyan-500/20 hover:text-cyan-300 transition-all">About</a>
            <a href="#projects" className="rounded-md px-2 py-1 hover:bg-cyan-500/20 hover:text-cyan-300 transition-all">Projects</a>
            <a href="#simulator" className="rounded-md px-2 py-1 hover:bg-cyan-500/20 hover:text-cyan-300 transition-all">Live Demo</a>
            <a href="#skills" className="rounded-md px-2 py-1 hover:bg-cyan-500/20 hover:text-cyan-300 transition-all">Skills</a>
            <a href="#timeline" className="rounded-md px-2 py-1 hover:bg-cyan-500/20 hover:text-cyan-300 transition-all">Leadership</a>
            <a href="#contact" className="rounded-md px-2 py-1 hover:bg-cyan-500/20 hover:text-cyan-300 transition-all">Contact</a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-8 lg:px-0">
        <section id="about" className="mb-12 rounded-3xl border border-slate-700 bg-slate-900/70 p-8 shadow-2xl shadow-cyan-500/20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <p className="text-cyan-300 uppercase tracking-wide text-xs">AI + Full Stack Portfolio</p>
              <h2 className="text-4xl font-extrabold leading-tight sm:text-5xl">{hero.role}</h2>
              <p className="mt-4 max-w-2xl text-slate-200">{hero.description}</p>
              <div className="mt-5 flex flex-wrap justify-center gap-3 text-center md:justify-start md:text-left">
                <a
                  href="mailto:jepoyinere2003@gmail.com"
                  className="inline-flex items-center gap-2 rounded-lg bg-cyan-500/20 px-4 py-2 text-sm text-cyan-100 transition hover:bg-cyan-500/30"
                >
                  <Mail size={16} />
                  jepoyinere2003@gmail.com
                </a>
                {socials.map(({ label, href, icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-200 transition hover:bg-cyan-500/30"
                  >
                    {icon}
                    {label}
                  </a>
                ))}
              </div>

              <div className="mt-6 rounded-xl border border-cyan-500/30 bg-slate-900/70 p-4">
                <p className="text-xs uppercase tracking-wide text-cyan-300">AI Bird Detection</p>
                <div className="mt-2 text-sm text-slate-200">
                  Upload a photo to detect birds and preview sample detections in the live simulator.
                </div>
                <div className="mt-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 cursor-pointer"
                  >
                    <Upload size={16} />
                    Upload Image
                  </label>
                </div>
                {birdDetection.loading && (
                  <div className="mt-4 text-sm text-cyan-200">Processing bird image with AI...</div>
                )}
                {birdDetection.error && (
                  <div className="mt-4 text-sm text-red-400">Error: {birdDetection.error}</div>
                )}
                {birdDetection.originalImage && (
                  <div className="mt-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="text-sm text-slate-300 mb-2">Uploaded Photo</p>
                        <img
                          src={birdDetection.originalImage}
                          alt="Uploaded"
                          className="max-w-full h-auto rounded-lg border border-slate-600"
                        />
                      </div>
                      <div>
                        <p className="text-sm text-slate-300 mb-2">Live Simulator Output</p>
                        <div className="rounded-xl border border-slate-700 bg-slate-950/80 p-4">
                          <p className="text-sm text-slate-300">Birds detected: {birdDetection.count !== null ? birdDetection.count : birdDetection.sampleDetections.length}</p>
                          <ul className="mt-3 space-y-2 text-slate-300 text-sm">
                            {birdDetection.sampleDetections.map((det) => (
                              <li key={det.id}>
                                {det.label} — {det.confidence.toFixed(1)}% confidence
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="w-full rounded-2xl bg-gradient-to-br from-cyan-500/20 via-indigo-500/10 to-slate-900 p-4 md:w-[360px]">
              <p className="text-sm text-slate-300">Highlights</p>
              <ul className="mt-3 text-slate-100 text-sm space-y-1">
                <li>• 150K+ image inference events</li>
                <li>• 40ms edge detection latency</li>
                <li>• deployed on AWS ECS + Azure</li>
              </ul>
            </div>
          </motion.div>
        </section>

        {/* LIVE PREVIEW SIMULATOR SECTION */}
        <section id="simulator" className="mb-12">
          <LivePreviewSimulator imageSrc={birdDetection.originalImage} detections={birdDetection.sampleDetections} />
        </section>

        {/* INTERACTIVE PROJECTS SECTION */}
        <section id="projects" className="mb-10">
          <h3 className="text-2xl font-bold mb-6">Featured Projects with Model Metrics</h3>
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, idx) => (
              <InteractiveProjectCard key={project.title} project={project} idx={idx} />
            ))}
          </div>
        </section>

        {/* COMPREHENSIVE SKILLS SECTION */}
        <section id="skills" className="mb-12">
          <h3 className="text-2xl font-bold mb-8">Technical Expertise</h3>
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <SkillCategory
              title="Computer Vision"
              icon={Camera}
              skills={['YOLO', 'OpenCV', 'TensorFlow', 'PyTorch', 'Image Processing', 'Object Detection']}
              color="cyan"
            />
            <SkillCategory
              title="Full-Stack Integration"
              icon={Database}
              skills={['Django', 'REST APIs', 'PostgreSQL', 'Node.js', 'Vue.js', 'React']}
              color="emerald"
            />
            <SkillCategory
              title="Core Engineering"
              icon={Cpu}
              skills={['Python', 'C++', 'TypeScript', 'JavaScript', 'Git', 'Docker']}
              color="indigo"
            />
            <SkillCategory
              title="AI & ML"
              icon={Zap}
              skills={['Deep Learning', 'Model Training', 'Data Annotation', 'Azure AI', 'AWS ML', 'Edge Inference']}
              color="amber"
            />
            <SkillCategory
              title="Mobile Development"
              icon={Smartphone}
              skills={['React Native', 'Flutter', 'Firebase', 'Dart', 'Cross-platform']}
              color="cyan"
            />
            <SkillCategory
              title="Leadership & Advocacy"
              icon={Award}
              skills={['Team Leadership', 'Mentorship', 'Public Speaking', 'Community Engagement']}
              color="emerald"
            />
          </div>
        </section>

        {/* AMBASSADORSHIP & TIMELINE SECTION */}
        <section id="timeline" className="mb-12">
          <h3 className="text-2xl font-bold mb-8">Leadership & Ambassadorship Timeline</h3>
          <div className="max-w-3xl mx-auto">
            <TimelineItem
              year="2025"
              title="Student Ambassador"
              role="AI & Computer Vision Advocate"
              description="Leading initiatives to promote AI literacy and computer vision applications in educational communities. Organizing workshops and mentoring junior developers."
              isLeading={false}
            />
            <TimelineItem
              year="2024"
              title="Provincial Scholar"
              role="Academic Excellence Recognition"
              description="Recognized for outstanding contributions to computer science and AI research. Actively involved in knowledge dissemination and technical mentorship programs."
              isLeading={true}
            />
            <TimelineItem
              year="2024"
              title="Sustainable Tourism Tech Lead"
              role="Innovation & Technology Advocate"
              description="Spearheading technology integration for sustainable tourism initiatives. Leveraging computer vision and data analytics to optimize environmental impact."
              isLeading={false}
            />
            <TimelineItem
              year="2023"
              title="Research Contributor"
              role="AI Model Development"
              description="Contributing to cutting-edge research in migratory bird detection and environmental monitoring using advanced computer vision techniques."
              isLeading={true}
            />
          </div>
        </section>

        <section id="contact" className="mt-10 rounded-3xl border border-slate-700 bg-slate-900/70 p-6 sm:p-8 shadow-2xl shadow-cyan-500/20">
          <h3 className="text-2xl font-bold mb-3">Contact</h3>
          <p className="mb-4 text-slate-300">Let’s build your next AI-enabled detection product. Reach out below.</p>
          <div className="space-y-2 text-sm text-slate-200">
            <p><span className="font-semibold">Name:</span> AviJep</p>
            <p><span className="font-semibold">Email:</span> <a href="mailto:jepoyinere2003@gmail.com" className="text-cyan-300 hover:underline">jepoyinere2003@gmail.com</a></p>
            <p><span className="font-semibold">LinkedIn:</span> <a href="https://www.linkedin.com/in/jefferson-inere" target="_blank" rel="noreferrer" className="text-cyan-300 hover:underline">linkedin.com/in/jefferson-inere</a></p>
            <p><span className="font-semibold">GitHub:</span> <a href="https://github.com/jepooyyy" target="_blank" rel="noreferrer" className="text-cyan-300 hover:underline">github.com/jepooyyy</a></p>
          </div>
        </section>
      </main>

      <footer className="text-center text-xs text-slate-500 py-6 border-t border-slate-800">
        © {new Date().getFullYear()} AviJep • <a href="#about" className="text-cyan-300 hover:underline">Back to top</a>
      </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <article className="rounded-2xl border border-slate-700 bg-slate-800/70 p-5 transition hover:shadow-lg hover:shadow-cyan-500/30">
      <div className="mb-3 text-cyan-300">{icon}</div>
      <h4 className="mb-2 text-lg font-semibold">{title}</h4>
      <p className="text-sm text-slate-300">{desc}</p>
    </article>
  );
}

export default App;
