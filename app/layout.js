import './globals.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

export const metadata = {
  title: 'My Portfolio',
  description: 'A Next.js portfolio website showcasing my projects and skills',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen relative" style={{ background: 'linear-gradient(to bottom right, #fdf2f8, #faf5ff, #fdf2f8)' }}>
        {/* Animated bubbles background - applies to all pages */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {/* Bubble 1 */}
          <div className="absolute bottom-0 left-[10%] w-20 h-20 bg-pink-300/70 rounded-full animate-bubble-float shadow-lg"></div>
          {/* Bubble 2 */}
          <div className="absolute bottom-0 left-[25%] w-12 h-12 bg-purple-300/70 rounded-full animate-bubble-float animation-delay-1 shadow-lg"></div>
          {/* Bubble 3 */}
          <div className="absolute bottom-0 left-[40%] w-16 h-16 bg-pink-400/65 rounded-full animate-bubble-float animation-delay-2 shadow-lg"></div>
          {/* Bubble 4 */}
          <div className="absolute bottom-0 left-[55%] w-14 h-14 bg-purple-400/70 rounded-full animate-bubble-float animation-delay-3 shadow-lg"></div>
          {/* Bubble 5 */}
          <div className="absolute bottom-0 left-[70%] w-18 h-18 bg-pink-300/65 rounded-full animate-bubble-float animation-delay-4 shadow-lg"></div>
          {/* Bubble 6 */}
          <div className="absolute bottom-0 left-[85%] w-10 h-10 bg-purple-300/70 rounded-full animate-bubble-float animation-delay-5 shadow-lg"></div>
          {/* Bubble 7 */}
          <div className="absolute bottom-0 left-[5%] w-15 h-15 bg-pink-400/60 rounded-full animate-bubble-float animation-delay-6 shadow-lg"></div>
          {/* Bubble 8 */}
          <div className="absolute bottom-0 left-[50%] w-22 h-22 bg-purple-300/65 rounded-full animate-bubble-float animation-delay-7 shadow-lg"></div>
          {/* Bubble 9 */}
          <div className="absolute bottom-0 left-[30%] w-13 h-13 bg-pink-300/70 rounded-full animate-bubble-float animation-delay-8 shadow-lg"></div>
          {/* Bubble 10 */}
          <div className="absolute bottom-0 left-[75%] w-17 h-17 bg-purple-400/65 rounded-full animate-bubble-float animation-delay-9 shadow-lg"></div>
          {/* Bubble 11 */}
          <div className="absolute bottom-0 left-[15%] w-11 h-11 bg-pink-400/70 rounded-full animate-bubble-float animation-delay-10 shadow-lg"></div>
          {/* Bubble 12 */}
          <div className="absolute bottom-0 left-[60%] w-19 h-19 bg-purple-300/65 rounded-full animate-bubble-float animation-delay-11 shadow-lg"></div>
        </div>
        
        <Navbar />
        
        <main className="flex-grow relative z-10">
          {children}
        </main>
        
        <Footer />
      </body>
    </html>
  )
}
