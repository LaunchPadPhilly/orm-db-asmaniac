'use client'

import { useState } from 'react'

const PREDEFINED_TECHNOLOGIES = [
  'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Express',
  'HTML', 'CSS', 'Tailwind CSS', 'Bootstrap', 'Python', 'Java',
  'PostgreSQL', 'MongoDB', 'MySQL', 'Prisma', 'GraphQL', 'REST API',
  'Git', 'Docker', 'AWS', 'Vercel', 'Figma', 'Photoshop'
]

export default function TechnologyInput({ technologies = [], onChange, error }) {
  const [inputValue, setInputValue] = useState('')

  const handleAdd = (tech) => {
    const techToAdd = typeof tech === 'string' ? tech.trim() : inputValue.trim()
    
    if (!techToAdd) return
    
    if (technologies.includes(techToAdd)) {
      return
    }

    onChange([...technologies, techToAdd])
    setInputValue('')
  }

  const handleRemove = (techToRemove) => {
    onChange(technologies.filter(tech => tech !== techToRemove))
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAdd()
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Technologies *
      </label>
      
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a technology"
          className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        <button
          type="button"
          onClick={() => handleAdd()}
          className="bg-purple-400 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-500 transition-all"
        >
          Add
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {PREDEFINED_TECHNOLOGIES.map((tech) => (
          <button
            key={tech}
            type="button"
            onClick={() => handleAdd(tech)}
            disabled={technologies.includes(tech)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
              technologies.includes(tech)
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
            }`}
          >
            {tech}
          </button>
        ))}
      </div>

      {technologies.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {technologies.map((tech) => (
            <span
              key={tech}
              className="inline-flex items-center gap-2 bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm font-medium"
            >
              {tech}
              <button
                type="button"
                onClick={() => handleRemove(tech)}
                aria-label={`Remove ${tech}`}
                className="text-purple-600 hover:text-purple-800 font-bold"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
