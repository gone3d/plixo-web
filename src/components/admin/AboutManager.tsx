import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { apiClient } from '../../services/api'
import { LoadingSpinner, Button, Icon, IconButton } from '../atoms'
import { ConfirmDialog } from '../molecules'
import { AboutSectionEditModal } from './AboutSectionEditModal'

interface AboutSection {
  title: string
  content: string
  order: number
}

export const AboutManager = () => {
  const [sections, setSections] = useState<AboutSection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingSection, setEditingSection] = useState<AboutSection | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

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

  useEffect(() => {
    fetchAboutContent()
  }, [])

  const fetchAboutContent = async () => {
    setLoading(true)
    setError(null)

    try {
      const { data } = await apiClient.get('/about')

      if (data.success && data.data?.sections) {
        const sortedSections = [...data.data.sections].sort((a, b) => a.order - b.order)
        setSections(sortedSections)
      } else {
        setError(data.error || 'Failed to fetch About content')
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const handleAddSection = async () => {
    const newSection: AboutSection = {
      title: 'New Section',
      content: 'Enter content here using **markdown** formatting...',
      order: sections.length + 1
    }
    const updatedSections = [...sections, newSection]

    try {
      const { data } = await apiClient.put('/admin/about', { sections: updatedSections })

      if (data.success) {
        setSections(updatedSections)
        setEditingSection(newSection)
        setIsModalOpen(true)
        toast.success('Section added - now edit it')
      } else {
        toast.error(data.error || 'Failed to add section')
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to add section')
    }
  }

  const handleEditSection = (section: AboutSection) => {
    setEditingSection(section)
    setIsModalOpen(true)
  }

  const handleDeleteSection = (index: number) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Section',
      message: `Are you sure you want to delete "${sections[index].title}"? This action cannot be undone.`,
      onConfirm: () => executeDelete(index)
    })
  }

  const executeDelete = async (index: number) => {
    const updated = sections.filter((_, i) => i !== index)
    // Renumber order
    updated.forEach((section, i) => {
      section.order = i + 1
    })

    try {
      const { data } = await apiClient.put('/admin/about', { sections: updated })

      if (data.success) {
        setSections(updated)
        setConfirmDialog({ ...confirmDialog, isOpen: false })
        toast.success('Section deleted')
      } else {
        toast.error(data.error || 'Failed to delete section')
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to delete section')
    }
  }

  const handleMoveUp = async (index: number) => {
    if (index === 0) return
    const updated = [...sections]
    const temp = updated[index - 1]
    updated[index - 1] = updated[index]
    updated[index] = temp
    // Renumber order
    updated.forEach((section, i) => {
      section.order = i + 1
    })

    try {
      const { data } = await apiClient.put('/admin/about', { sections: updated })

      if (data.success) {
        setSections(updated)
      } else {
        toast.error(data.error || 'Failed to reorder sections')
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to reorder sections')
    }
  }

  const handleMoveDown = async (index: number) => {
    if (index === sections.length - 1) return
    const updated = [...sections]
    const temp = updated[index + 1]
    updated[index + 1] = updated[index]
    updated[index] = temp
    // Renumber order
    updated.forEach((section, i) => {
      section.order = i + 1
    })

    try {
      const { data } = await apiClient.put('/admin/about', { sections: updated })

      if (data.success) {
        setSections(updated)
      } else {
        toast.error(data.error || 'Failed to reorder sections')
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to reorder sections')
    }
  }

  const handleModalSave = () => {
    fetchAboutContent()
    setIsModalOpen(false)
    setEditingSection(null)
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500/40 rounded-lg p-6 text-center">
        <p className="text-red-300 mb-4">{error}</p>
        <Button onClick={fetchAboutContent} variant="secondary">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-white">About Content</h2>
          <p className="text-sm text-slate-400 mt-1">
            Manage About page sections. Content supports markdown and custom JSX components.
          </p>
        </div>
        <Button onClick={handleAddSection}>
          <Icon name="plus" size="sm" />
          Add Section
        </Button>
      </div>

      {/* Sections List */}
      {sections.length === 0 ? (
        <div className="bg-slate-700/40 rounded-lg p-12 text-center border border-slate-600/40">
          <p className="text-slate-400 mb-4">No sections yet. Add your first section to get started.</p>
          <Button onClick={handleAddSection}>
            <Icon name="plus" size="sm" />
            Add Section
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {sections.map((section, index) => (
            <div
              key={index}
              className="bg-slate-700/40 rounded-lg p-4 border border-slate-600/40"
            >
              <div className="flex gap-4">
                {/* Left side - Move buttons stacked vertically */}
                <div className="flex flex-col pr-4 border-r border-slate-600/40">
                  <IconButton
                    icon="chevronUp"
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    title="Move up"
                  />
                  <IconButton
                    icon="chevronDown"
                    onClick={() => handleMoveDown(index)}
                    disabled={index === sections.length - 1}
                    title="Move down"
                  />
                </div>

                {/* Middle - Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-mono text-slate-500">#{section.order}</span>
                    <h3 className="text-lg font-semibold text-white">{section.title}</h3>
                  </div>
                  <p className="text-sm text-slate-400 line-clamp-1">{section.content}</p>
                </div>

                {/* Right side - Edit/Delete buttons */}
                <div className="flex flex-col">
                  <IconButton
                    icon="edit"
                    onClick={() => handleEditSection(section)}
                    title="Edit"
                    variant="blue"
                  />
                  <IconButton
                    icon="trash"
                    onClick={() => handleDeleteSection(index)}
                    title="Delete"
                    variant="red"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirm Dialog */}
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

      {/* Edit Modal */}
      <AboutSectionEditModal
        section={editingSection}
        sections={sections}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingSection(null)
        }}
        onSave={handleModalSave}
      />
    </div>
  )
}
