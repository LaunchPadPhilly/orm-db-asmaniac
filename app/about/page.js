import ProfileImage from '../components/ProfileImage'

export default function About() {
  return (
    <div className="min-h-screen p-8 py-16 relative">
      <div className="max-w-6xl mx-auto relative z-10">
        <h1 className="text-5xl md:text-6xl font-bold mb-12 text-center text-purple-400 drop-shadow-sm">
          About Me
        </h1>
        
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-pink-100/50 p-8 md:p-12 mb-8 relative overflow-hidden">
          {/* Subtle texture overlay */}
          <div className="absolute inset-0 opacity-[0.02]">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(147, 51, 234, 0.4) 1px, transparent 0)`,
              backgroundSize: '32px 32px'
            }}></div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start md:items-center relative z-10">
            {/* Profile photo - properly sized and optimized */}
            <div className="flex-shrink-0 w-full md:w-auto">
              <ProfileImage />
            </div>
            
            {/* Bio */}
            <div className="flex-grow text-center md:text-left">
              <h2 className="text-3xl font-bold mb-4 text-pink-400">Hello! I'm Asma Drummond</h2>
              <p className="text-lg text-purple-300 leading-relaxed mb-4">
                I'm an aspiring UX designer with a passion for creating beautiful, user-centered digital experiences. 
                I love combining my creative side with technical skills to build interfaces that are both visually 
                appealing and intuitive to use.
              </p>
              <p className="text-lg text-purple-300 leading-relaxed mb-4">
                When I'm not designing, I'm exploring digital art and coding. Digital art allows me to express 
                my creativity and experiment with visual aesthetics, while coding gives me the power to bring 
                my designs to life. I believe the best user experiences come from the perfect blend of art and 
                technology.
              </p>
              <p className="text-lg text-purple-300 leading-relaxed">
                My goal is to continue growing as a UX designer, learning new tools and techniques that help me 
                create meaningful connections between users and the digital products they interact with every day.
              </p>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-100 p-8 md:p-12 mb-8 relative overflow-hidden">
          {/* Decorative corner accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-bl-full"></div>
          
          <h2 className="text-3xl font-bold mb-6 text-purple-400 relative z-10">My Skills</h2>
          <div className="flex flex-wrap gap-3 relative z-10">
            <span className="bg-gradient-to-r from-pink-100 to-pink-50 text-pink-700 px-4 py-2 rounded-full font-semibold shadow-sm hover:shadow-md transition-all hover:scale-105 border border-pink-200/50">
              HTML & CSS
            </span>
            <span className="bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 px-4 py-2 rounded-full font-semibold shadow-sm hover:shadow-md transition-all hover:scale-105 border border-purple-200/50">
              JavaScript
            </span>
            <span className="bg-gradient-to-r from-pink-200 to-pink-100 text-pink-800 px-4 py-2 rounded-full font-semibold shadow-sm hover:shadow-md transition-all hover:scale-105 border border-pink-300/50">
              React
            </span>
            <span className="bg-gradient-to-r from-purple-200 to-purple-100 text-purple-800 px-4 py-2 rounded-full font-semibold shadow-sm hover:shadow-md transition-all hover:scale-105 border border-purple-300/50">
              Next.js
            </span>
            <span className="bg-gradient-to-r from-pink-100 to-pink-50 text-pink-700 px-4 py-2 rounded-full font-semibold shadow-sm hover:shadow-md transition-all hover:scale-105 border border-pink-200/50">
              Tailwind CSS
            </span>
            <span className="bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 px-4 py-2 rounded-full font-semibold shadow-sm hover:shadow-md transition-all hover:scale-105 border border-purple-200/50">
              Git & GitHub
            </span>
            <span className="bg-gradient-to-r from-pink-200 to-pink-100 text-pink-800 px-4 py-2 rounded-full font-semibold shadow-sm hover:shadow-md transition-all hover:scale-105 border border-pink-300/50">
              Node.js
            </span>
            <span className="bg-gradient-to-r from-purple-200 to-purple-100 text-purple-800 px-4 py-2 rounded-full font-semibold shadow-sm hover:shadow-md transition-all hover:scale-105 border border-purple-300/50">
              Responsive Design
            </span>
          </div>
        </div>

        {/* Goals/Interests Section */}
        <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 rounded-2xl shadow-lg border border-pink-100 p-8 md:p-12 relative overflow-hidden">
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-pink-200/20 via-purple-200/20 to-pink-200/20 animate-pulse"></div>
          
          <h2 className="text-3xl font-bold mb-6 text-pink-400 relative z-10">What I'm Learning</h2>
          <div className="grid md:grid-cols-2 gap-6 relative z-10">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md border border-pink-100 hover:shadow-lg transition-all hover:scale-[1.02]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <h3 className="text-xl font-bold text-purple-400">Current Focus</h3>
              </div>
              <ul className="space-y-2 text-purple-300">
                <li className="flex items-start gap-2">
                  <span className="text-pink-400 mt-1">•</span>
                  <span>Advanced React patterns and hooks</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-400 mt-1">•</span>
                  <span>Full-stack development with Next.js</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-400 mt-1">•</span>
                  <span>Database design and optimization</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-400 mt-1">•</span>
                  <span>API development and integration</span>
                </li>
              </ul>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md border border-purple-100 hover:shadow-lg transition-all hover:scale-[1.02]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
                <h3 className="text-xl font-bold text-pink-400">Future Goals</h3>
              </div>
              <ul className="space-y-2 text-pink-300">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Build scalable web applications</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Contribute to open-source projects</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Master cloud deployment and DevOps</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Create impactful digital experiences</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
