import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { apiClient } from '../../services/api'
import type { Project, CreateProjectInput, UpdateProjectInput, ProjectStatus } from '../../types/portfolio'
import { LoadingSpinner } from '../atoms'
import { ConfirmDialog } from '../molecules'

type ViewMode = 'list' | 'create' | 'edit'

const PROJECT_STATUSES: ProjectStatus[] = ['Live', 'Demo', 'In Development', 'Archived', 'Prototype']

export const ProjectsManager = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => void
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  })

  // Form state
  const [formData, setFormData] = useState<CreateProjectInput>({
    title: '',
    description: '',
    technologies: [],
    status: 'In Development',
    image: '',
    live_url: '',
    github_url: '',
    demo_url: '',
    featured: false,
    display_order: 0
  })

  // Technology input
  const [techInput, setTechInput] = useState('')

  useEffect(() => {
    if (viewMode === 'list') {
      fetchProjects()
    }
  }, [viewMode])

  const fetchProjects = async () => {
    setLoading(true)
    setError(null)

    try {
      const { data } = await apiClient.get('/projects')

      if (data.success && data.data) {
        setProjects(data.data)
      } else {
        setError(data.error || 'Failed to fetch projects')
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    if (!formData.title || !formData.description || formData.technologies.length === 0 || !formData.image) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)

    try {
      const { data } = await apiClient.post('/projects', formData)

      if (data.success) {
        toast.success('Project created successfully')
        resetForm()
        setViewMode('list')
      } else {
        // Show validation errors if available
        if (data.errors && data.errors.length > 0) {
          data.errors.forEach((err: any) => {
            toast.error(`${err.field}: ${err.message}`)
          })
        } else {
          toast.error(data.error || 'Failed to create project')
        }
      }
    } catch (err: any) {
      // Show validation errors from response
      if (err.response?.data?.errors && err.response.data.errors.length > 0) {
        err.response.data.errors.forEach((error: any) => {
          toast.error(`${error.field}: ${error.message}`)
        })
      } else {
        toast.error(err.response?.data?.error || err.message || 'Unknown error')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (id: string) => {
    if (!formData.title || !formData.description || formData.technologies.length === 0 || !formData.image) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)

    try {
      const updateData: UpdateProjectInput = { ...formData }
      const { data } = await apiClient.put(`/projects/${id}`, updateData)

      if (data.success) {
        toast.success('Project updated successfully')
        resetForm()
        setViewMode('list')
      } else {
        // Show validation errors if available
        if (data.errors && data.errors.length > 0) {
          data.errors.forEach((err: any) => {
            toast.error(`${err.field}: ${err.message}`)
          })
        } else {
          toast.error(data.error || 'Failed to update project')
        }
      }
    } catch (err: any) {
      // Show validation errors from response
      if (err.response?.data?.errors && err.response.data.errors.length > 0) {
        err.response.data.errors.forEach((error: any) => {
          toast.error(`${error.field}: ${error.message}`)
        })
      } else {
        toast.error(err.response?.data?.error || err.message || 'Unknown error')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (id: string, title: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Project',
      message: `Are you sure you want to delete "${title}"? This action cannot be undone.`,
      onConfirm: () => executeDelete(id)
    })
  }

  const executeDelete = async (id: string) => {
    setConfirmDialog({ ...confirmDialog, isOpen: false })
    setLoading(true)

    try {
      const { data } = await apiClient.delete(`/projects/${id}`)

      if (data.success) {
        toast.success('Project deleted successfully')
        // Refetch projects from server to ensure consistency
        await fetchProjects()
      } else {
        toast.error(data.error || 'Failed to delete project')
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.message || 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (project: Project) => {
    setFormData({
      title: project.title,
      description: project.description,
      technologies: project.technologies,
      status: project.status,
      image: project.image || project.images?.thumbnail || '',
      live_url: project.live_url || project.urls?.live || '',
      github_url: project.github_url || project.urls?.github || '',
      demo_url: project.demo_url || project.urls?.demo || '',
      featured: project.featured,
      display_order: project.display_order || project.priority
    })
    setSelectedProject(project)
    setViewMode('edit')
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      technologies: [],
      status: 'In Development',
      image: '',
      live_url: '',
      github_url: '',
      demo_url: '',
      featured: false,
      display_order: 0
    })
    setSelectedProject(null)
    setTechInput('')
  }

  const addTechnology = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, techInput.trim()]
      })
      setTechInput('')
    }
  }

  const removeTechnology = (tech: string) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter(t => t !== tech)
    })
  }

  // LIST VIEW
  if (viewMode === 'list') {
    return (
      <>
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Projects</h2>
            <button
              onClick={() => {
                resetForm()
                setViewMode('create')
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Create New Project
            </button>
          </div>

          {loading && (
            <div className="text-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          )}

          {error && (
            <div className="bg-red-900/20 border border-red-700/40 rounded-lg p-4 text-red-400">
              {error}
            </div>
          )}

          {!loading && !error && (
            <div className="space-y-4">
              {projects.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  No projects found. Create your first project to get started.
                </div>
              ) : (
                projects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-slate-700/40 rounded-lg p-4 border border-slate-600/40 hover:border-slate-500/60 transition-colors"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex gap-4 flex-1">
                        {/* Project Image */}
                        {project.image && (
                          <div className="flex-shrink-0">
                            <img
                              src={project.image}
                              alt={project.title}
                              className="w-20 h-20 rounded-lg object-cover border border-slate-600/40"
                            />
                          </div>
                        )}

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                            {project.featured && (
                              <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded">
                                Featured
                              </span>
                            )}
                            <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded">
                              {project.status}
                            </span>
                          </div>
                          <p className="text-slate-300 mb-3">{project.description}</p>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {project.technologies.map((tech) => (
                              <span
                                key={tech}
                                className="bg-slate-600/40 text-slate-300 text-xs px-2 py-1 rounded"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                          <div className="text-xs text-slate-400 space-y-1">
                            <div>Display Order: {project.display_order || project.priority}</div>
                            <div>Created: {new Date(project.created_at || project.dateCreated).toLocaleDateString()}</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => startEdit(project)}
                          className="bg-slate-600 hover:bg-slate-500 text-white px-3 py-1 rounded transition-colors text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(project.id, project.title)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Confirm Dialog - Always rendered */}
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          title={confirmDialog.title}
          message={confirmDialog.message}
          confirmText="Delete"
          cancelText="Cancel"
          confirmVariant="danger"
          onConfirm={confirmDialog.onConfirm}
          onCancel={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        />
      </>
    )
  }

  // CREATE/EDIT FORM VIEW
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">
          {viewMode === 'create' ? 'Create Project' : 'Edit Project'}
        </h2>
        <button
          onClick={() => {
            resetForm()
            setViewMode('list')
          }}
          className="bg-slate-600 hover:bg-slate-500 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>

      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Title <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-slate-700/40 border border-slate-600/40 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
            placeholder="Project title"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Description <span className="text-red-400">*</span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full bg-slate-700/40 border border-slate-600/40 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
            placeholder="Short description (2-3 sentences)"
          />
        </div>

        {/* Technologies */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Technologies <span className="text-red-400">*</span>
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
              className="flex-1 bg-slate-700/40 border border-slate-600/40 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              placeholder="Add technology (press Enter)"
            />
            <button
              onClick={addTechnology}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.technologies.map((tech) => (
              <span
                key={tech}
                className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-lg flex items-center gap-2"
              >
                {tech}
                <button
                  onClick={() => removeTechnology(tech)}
                  className="text-blue-400 hover:text-blue-200"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Status <span className="text-red-400">*</span>
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as ProjectStatus })}
            className="w-full bg-slate-700/40 border border-slate-600/40 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
          >
            {PROJECT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Image */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Image Path <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            className="w-full bg-slate-700/40 border border-slate-600/40 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
            placeholder="/assets/projects/example.jpg"
          />
        </div>

        {/* URLs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Live URL</label>
            <input
              type="url"
              value={formData.live_url}
              onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
              className="w-full bg-slate-700/40 border border-slate-600/40 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">GitHub URL</label>
            <input
              type="url"
              value={formData.github_url}
              onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
              className="w-full bg-slate-700/40 border border-slate-600/40 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              placeholder="https://github.com/..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Demo URL</label>
            <input
              type="url"
              value={formData.demo_url}
              onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
              className="w-full bg-slate-700/40 border border-slate-600/40 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              placeholder="https://..."
            />
          </div>
        </div>

        {/* Featured & Display Order */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="rounded"
              />
              Featured Project
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Display Order
            </label>
            <input
              type="number"
              value={formData.display_order}
              onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
              className="w-full bg-slate-700/40 border border-slate-600/40 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              placeholder="0"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4 pt-4">
          <button
            onClick={() => (viewMode === 'create' ? handleCreate() : handleUpdate(selectedProject!.id))}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : viewMode === 'create' ? 'Create Project' : 'Update Project'}
          </button>
          <button
            onClick={() => {
              resetForm()
              setViewMode('list')
            }}
            className="bg-slate-600 hover:bg-slate-500 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
