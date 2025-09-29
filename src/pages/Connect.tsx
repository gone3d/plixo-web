import { useState } from 'react'
import { Button, Input, Icon, BackgroundSlideshow } from '../components/atoms'

const backgroundImages = [
  { filename: 'astronomyBG1.jpg' },
  { filename: 'astronomyBG2.jpg' }
]

const Connect = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    // Reset form or show success message
    alert('Message sent! I\'ll get back to you soon.')
    setFormData({ name: '', email: '', company: '', message: '' })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="relative h-full text-white overflow-y-auto">
      <BackgroundSlideshow
        images={backgroundImages}
        transitionTime={16000}
        showOverlay={true}
        displayMode="slide"
      />
      <div className="relative z-10 max-w-4xl mx-auto py-20 px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Let's Connect
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Looking for a Staff/Principal Engineer who combines deep technical expertise
            with leadership experience? Let's discuss how I can help your team succeed.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-slate-800/30 rounded-xl p-8">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Icon name="contact" className="text-blue-400" />
              Send a Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                required
              />

              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@company.com"
                required
              />

              <Input
                label="Company (Optional)"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Your company or organization"
              />

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project, team, or opportunity..."
                  rows={5}
                  required
                  className="block w-full bg-slate-800 border border-slate-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 focus:border-blue-500 placeholder:text-slate-400"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-slate-800/50 rounded-lg">
              <div className="flex items-start gap-2">
                <Icon name="warning" size="sm" className="text-yellow-400 mt-0.5" />
                <p className="text-sm text-slate-400">
                  <strong>Note:</strong> Please only include information suitable for unclassified discussion.
                  I'll respond within 24-48 hours during business days.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Info & Status */}
          <div className="space-y-8">
            {/* Availability Status */}
            <div className="bg-slate-800/30 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Icon name="check" className="text-green-400" />
                Current Status
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Availability</span>
                  <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-sm">
                    Open to Opportunities
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Response Time</span>
                  <span className="text-slate-300">24-48 hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Location</span>
                  <span className="text-slate-300">Remote / Hybrid</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Focus</span>
                  <span className="text-slate-300">Staff/Principal Engineer roles</span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-slate-800/30 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">Find Me Online</h3>
              <div className="space-y-3">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors"
                >
                  <Icon name="github" className="text-slate-300" />
                  <span>GitHub</span>
                  <Icon name="external" size="sm" className="text-slate-400 ml-auto" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors"
                >
                  <Icon name="linkedin" className="text-slate-300" />
                  <span>LinkedIn</span>
                  <Icon name="external" size="sm" className="text-slate-400 ml-auto" />
                </a>
              </div>
            </div>

            {/* What I'm Looking For */}
            <div className="bg-slate-800/30 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">What I'm Looking For</h3>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-start gap-2">
                  <Icon name="check" size="sm" className="text-green-400 mt-0.5" />
                  <span>Staff/Principal Engineer positions</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="check" size="sm" className="text-green-400 mt-0.5" />
                  <span>Technical leadership opportunities</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="check" size="sm" className="text-green-400 mt-0.5" />
                  <span>Architecture and system design roles</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="check" size="sm" className="text-green-400 mt-0.5" />
                  <span>Mentorship and team development</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="check" size="sm" className="text-green-400 mt-0.5" />
                  <span>Modern tech stack environments</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Connect