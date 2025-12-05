'use client'

import { useState } from 'react'
import TechnologyInput from './TechnologyInput'

export default function ProjectForm({ onSubmit, onCancel, isOpen }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [projectUrl, setProjectUrl] = useState('')
  const [githubUrl, setGithubUrl] = useState('')
  const [technologies, setTechnologies] = useState([])
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) {
    return null
  }

  const validateUrl = (url) => {
    if (!url) return true
    return /^https?:\/\/.+\..+/.test(url)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})

    const newErrors = {}

    if (!title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required'
    }

    if (!technologies || technologies.length === 0) {
      newErrors.technologies = 'At least one technology is required'
    }

    if (imageUrl && !validateUrl(imageUrl)) {
      newErrors.imageUrl = 'Please enter a valid URL'
    }

    if (projectUrl && !validateUrl(projectUrl)) {
      newErrors.projectUrl = 'Please enter a valid URL'
    }

    if (githubUrl && !validateUrl(githubUrl)) {
      newErrors.githubUrl = 'Please enter a valid URL'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        imageUrl: imageUrl.trim() || '',
        projectUrl: projectUrl.trim() || '',
        githubUrl: githubUrl.trim() || '',
        technologies
      })
      
      // Reset form
      setTitle('')
      setDescription('')
      setImageUrl('')
      setProjectUrl('')
      setGithubUrl('')
      setTechnologies([])
      setErrors({})
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-purple-400">Add New Project</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Project Title *
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter project title"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe your project"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                id="imageUrl"
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                  errors.imageUrl ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="https://example.com/image.jpg"
              />
              {errors.imageUrl && (
                <p className="text-red-500 text-sm mt-1">{errors.imageUrl}</p>
              )}
            </div>

            <div>
              <label htmlFor="projectUrl" className="block text-sm font-medium text-gray-700 mb-1">
                Project URL
              </label>
              <input
                id="projectUrl"
                type="text"
                value={projectUrl}
                onChange={(e) => setProjectUrl(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                  errors.projectUrl ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="https://your-project.com"
              />
              {errors.projectUrl && (
                <p className="text-red-500 text-sm mt-1">{errors.projectUrl}</p>
              )}
            </div>

            <div>
              <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-700 mb-1">
                GitHub URL
              </label>
              <input
                id="githubUrl"
                type="text"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                  errors.githubUrl ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="https://github.com/username/repo"
              />
              {errors.githubUrl && (
                <p className="text-red-500 text-sm mt-1">{errors.githubUrl}</p>
              )}
            </div>

            <div>
              <TechnologyInput
                technologies={technologies}
                onChange={setTechnologies}
                error={errors.technologies}
              />
              {errors.technologies && (
                <p className="text-red-500 text-sm mt-1">{errors.technologies}</p>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-purple-400 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating Project...' : 'Create Project'}
              </button>
              <button
                type="button"
                onClick={onCancel}
                disabled={isLoading}
                className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
