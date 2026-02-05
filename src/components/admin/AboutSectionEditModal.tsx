import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { apiClient } from '../../services/api'
import { Icon, Button, Input } from '../atoms'
import { MarkdownRenderer } from '../../utils/MarkdownRenderer'

interface AboutSection {
  title: string
  content: string
  order: number
}

interface AboutSectionEditModalProps {
  section: AboutSection | null
  sections: AboutSection[]
  isOpen: boolean
  onClose: () => void
  onSave: () => void
}

export const AboutSectionEditModal = ({ section, sections, isOpen, onClose, onSave }: AboutSectionEditModalProps) => {
  const [title, setTitle] = useState(section?.title || '')
  const [content, setContent] = useState(section?.content || '')
  const [showPreview, setShowPreview] = useState(false)
  const [saving, setSaving] = useState(false)

  // Update local state when section changes
  useEffect(() => {
    if (section) {
      setTitle(section.title)
      setContent(section.content)
    }
  }, [section])

  const handleSave = async () => {
    if (!section) return

    // Validation
    if (!title.trim()) {
      toast.error('Section title cannot be empty')
      return
    }
    if (!content.trim()) {
      toast.error('Section content cannot be empty')
      return
    }

    setSaving(true)

    try {
      // Update the section in the sections array
      const updatedSections = sections.map(s =>
        s.order === section.order
          ? { ...s, title: title.trim(), content: content.trim() }
          : s
      )

      // Save to API
      const { data } = await apiClient.put('/admin/about', { sections: updatedSections })

      if (data.success) {
        toast.success('Section updated successfully')
        onSave()
        onClose()
      } else {
        toast.error(data.error || 'Failed to update section')
      }
    } catch (error: any) {
      console.error('Error updating section:', error)
      toast.error(error.response?.data?.error || 'Failed to update section')
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen || !section) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-600/40 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/40">
          <h2 className="text-xl font-semibold text-white">Edit Section</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/40 rounded transition-colors"
          >
            <Icon name="close" size="sm" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Section title"
              className="w-full"
            />
          </div>

          {/* Order Display */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Order
            </label>
            <div className="text-slate-400 text-sm">
              Position: {section.order} (use move up/down buttons in main list to reorder)
            </div>
          </div>

          {/* Toggle Preview/Markdown */}
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-slate-300">
              Content
            </label>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-slate-700/40 hover:bg-slate-700 text-slate-300 rounded transition-colors"
            >
              <Icon name={showPreview ? 'edit' : 'check'} size="sm" />
              {showPreview ? 'Edit' : 'Preview'}
            </button>
          </div>

          {/* Content Editor or Preview */}
          {showPreview ? (
            <div className="min-h-[400px] p-4 bg-slate-900/50 border border-slate-600/40 rounded-lg">
              <div className="prose prose-invert prose-slate max-w-none text-slate-300">
                <MarkdownRenderer content={content || '*No content*'} />
              </div>
            </div>
          ) : (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Section content (markdown supported)"
              rows={20}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/40 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-mono text-sm"
            />
          )}

          {/* Markdown & JSX Tips */}
          <div className="bg-slate-900/30 border border-slate-700/40 rounded-lg p-4">
            <h3 className="text-sm font-medium text-slate-300 mb-2">Markdown & JSX Tips</h3>
            <div className="text-xs text-slate-400 space-y-1.5">
              <div className="font-medium text-slate-300 mt-2">Markdown:</div>
              <div><code className="bg-slate-800/50 px-1 rounded">**bold**</code> for bold text</div>
              <div><code className="bg-slate-800/50 px-1 rounded">*italic*</code> for italic text</div>
              <div><code className="bg-slate-800/50 px-1 rounded">[link text](url)</code> for links</div>
              <div><code className="bg-slate-800/50 px-1 rounded">- item</code> for bullet lists</div>
              <div className="font-medium text-slate-300 mt-3">JSX Components:</div>
              <div><code className="bg-slate-800/50 px-1 rounded text-xs">&lt;span color="blue"&gt;text&lt;/span&gt;</code> - colored text</div>
              <div><code className="bg-slate-800/50 px-1 rounded text-xs">&lt;span color="white" size="lg"&gt;Heading&lt;/span&gt;</code> - large heading</div>
              <div><code className="bg-slate-800/50 px-1 rounded text-xs">&lt;MDListItem&gt;content&lt;/MDListItem&gt;</code> - bullet list item</div>
              <div><code className="bg-slate-800/50 px-1 rounded text-xs">&lt;UIPanel icon="work" color="blue" title="Title"&gt;...&lt;/UIPanel&gt;</code></div>
              <div><code className="bg-slate-800/50 px-1 rounded text-xs">&lt;UITablePanel columns="2"&gt;...&lt;/UITablePanel&gt;</code></div>
              <div className="text-slate-500">Colors: blue, purple, green, red, yellow, cyan, orange, pink, slate, white</div>
              <div className="text-slate-500">Sizes: lg (heading), xl (large heading)</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-700/40">
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  )
}
