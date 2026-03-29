import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Cpu, Shield, Linkedin, Mail, Github, Smartphone, Play, Upload, Users } from 'lucide-react';

const socials = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/yourprofile', icon: <Linkedin size={16} /> },
  { label: 'GitHub', href: 'https://github.com/yourhandle', icon: <Github size={16} /> }
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

  const [personDetection, setPersonDetection] = useState({
    loading: false,
    count: null,
    image: null,
    originalImage: null,
    error: null
  });

  async function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const maxSizeBytes = 5 * 1024 * 1024; // 5MB max
    if (file.size > maxSizeBytes) {
      setPersonDetection({
        loading: false,
        count: null,
        image: null,
        originalImage: null,
        error: 'Image exceeds 5MB limit. Please choose a smaller file.'
      });
      return;
    }

    // Create preview URL for original image
    const originalImageUrl = URL.createObjectURL(file);

    setPersonDetection({ 
      loading: true, 
      count: null, 
      image: null, 
      originalImage: originalImageUrl,
      error: null 
    });

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('http://localhost:8000/api/detect/', {
        method: 'POST',
        body: formData,
      });

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

      setPersonDetection({
        loading: false,
        count: data?.person_count ?? 0,
        image: data?.annotated_image || null,
        originalImage: originalImageUrl,
        error: null
      });
    } catch (error) {
      setPersonDetection({
        loading: false,
        count: null,
        image: null,
        originalImage: originalImageUrl,
        error: error.toString()
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
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-8 lg:px-0">
          <h1 className="font-bold text-xl sm:text-2xl tracking-tight">{hero.name}</h1>
          <nav className="flex items-center gap-4 text-sm text-slate-300">
            <a href="#about" className="rounded-md px-2 py-1 hover:bg-cyan-500/20 hover:text-cyan-300">About</a>
            <a href="#projects" className="rounded-md px-2 py-1 hover:bg-cyan-500/20 hover:text-cyan-300">Projects</a>
            <a href="#skills" className="rounded-md px-2 py-1 hover:bg-cyan-500/20 hover:text-cyan-300">Skills</a>
            <a href="#contact" className="rounded-md px-2 py-1 hover:bg-cyan-500/20 hover:text-cyan-300">Contact</a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10 sm:px-8 lg:px-0">
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
              <div className="mt-5 flex flex-wrap gap-3">
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
                <p className="text-xs uppercase tracking-wide text-cyan-300">AI Person Counter</p>
                <div className="mt-2 text-sm text-slate-200">
                  Upload a photo to count persons using YOLOv8 AI model.
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
                {personDetection.loading && (
                  <div className="mt-4 text-sm text-cyan-200">Processing image with AI...</div>
                )}
                {personDetection.error && (
                  <div className="mt-4 text-sm text-red-400">Error: {personDetection.error}</div>
                )}
                {personDetection.originalImage && (
                  <div className="mt-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="text-sm text-slate-300 mb-2">Uploaded Photo</p>
                        <img
                          src={personDetection.originalImage}
                          alt="Uploaded"
                          className="max-w-full h-auto rounded-lg border border-slate-600"
                        />
                      </div>
                      {personDetection.count !== null && personDetection.image && (
                        <div>
                          <p className="text-sm text-slate-300 mb-2">
                            Detection Result: {personDetection.count} person{personDetection.count !== 1 ? 's' : ''} detected
                          </p>
                          <img
                            src={personDetection.image}
                            alt="Annotated detection"
                            className="max-w-full h-auto rounded-lg border border-slate-600"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-cyan-500/20 via-indigo-500/10 to-slate-900 p-4">
              <p className="text-sm text-slate-300">Highlights</p>
              <ul className="mt-3 text-slate-100 text-sm space-y-1">
                <li>• 150K+ image inference events</li>
                <li>• 40ms edge detection latency</li>
                <li>• deployed on AWS ECS + Azure</li>
              </ul>
            </div>
          </motion.div>
        </section>

        <section id="projects" className="mb-10">
          <h3 className="text-2xl font-bold mb-6">Featured Projects</h3>
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, idx) => (
              <motion.article
                key={project.title}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.12, duration: 0.45 }}
                className={cardClass}
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
              </motion.article>
            ))}
          </div>
        </section>

        <section id="skills" className="mb-10 rounded-3xl border border-slate-700 bg-slate-900/70 p-8 shadow-2xl shadow-indigo-500/20">
          <h3 className="text-2xl font-bold mb-5">Core Skills</h3>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {specialty.map((skill) => (
              <div key={skill} className="rounded-xl border border-slate-700 bg-slate-800/60 p-4 text-sm text-slate-100">• {skill}</div>
            ))}
          </div>
        </section>

        <section id="contact" className="mt-10 rounded-3xl border border-slate-700 bg-slate-900/70 p-8 shadow-2xl shadow-cyan-500/20">
          <h3 className="text-2xl font-bold mb-3">Contact</h3>
          <p className="mb-4 text-slate-300">Let’s build your next AI-enabled detection product. Reach out below.</p>
          <div className="space-y-2 text-sm text-slate-200">
            <p><span className="font-semibold">Name:</span> AviJep</p>
            <p><span className="font-semibold">Email:</span> <a href="mailto:jepoyinere2003@gmail.com" className="text-cyan-300 hover:underline">jepoyinere2003@gmail.com</a></p>
            <p><span className="font-semibold">LinkedIn:</span> <a href="https://www.linkedin.com/in/yourprofile" target="_blank" rel="noreferrer" className="text-cyan-300 hover:underline">linkedin.com/in/yourprofile</a></p>
            <p><span className="font-semibold">GitHub:</span> <a href="https://github.com/yourhandle" target="_blank" rel="noreferrer" className="text-cyan-300 hover:underline">github.com/yourhandle</a></p>
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
