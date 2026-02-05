import React, { ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import { Icon } from '../components/atoms'
import { UIPanel, UITablePanel, MDListItem, ExternalLinkPanel } from '../components/molecules'

interface MarkdownRendererProps {
  content: string
  components?: any
  onLinkClick?: (href: string, text: string) => void
}

// Color mapping for span tags
const colorClassMap: Record<string, string> = {
  blue: 'text-blue-400',
  purple: 'text-purple-400',
  green: 'text-green-400',
  red: 'text-red-400',
  yellow: 'text-yellow-400',
  cyan: 'text-cyan-400',
  orange: 'text-orange-400',
  pink: 'text-pink-400',
  slate: 'text-slate-300',
  white: 'text-white'
}

/**
 * Parses markdown content with JSX-like components and renders them
 * Supports <UIPanel>, <UITablePanel>, and <span color="..."> custom components
 */
export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  components = {},
  onLinkClick
}) => {
  // Parse and render custom JSX-like components
  const renderContent = () => {
    const parts: ReactNode[] = []
    let remainingContent = content
    let key = 0

    // Regex to match <UITablePanel> ... </UITablePanel>
    const tablePanelRegex = /<UITablePanel(\s+[^>]*)?>[\s\S]*?<\/UITablePanel>/g
    // Regex to match <UIPanel ... > ... </UIPanel>
    const panelRegex = /<UIPanel(\s+[^>]*)?>[\s\S]*?<\/UIPanel>/g
    // Regex to match <MDListItem> ... </MDListItem>
    const listItemRegex = /<MDListItem>[\s\S]*?<\/MDListItem>/g

    // Process UITablePanel blocks
    while (remainingContent.length > 0) {
      const tablePanelMatch = tablePanelRegex.exec(remainingContent)

      if (!tablePanelMatch) {
        // No more custom components, process remaining content (may contain MDListItem)
        if (remainingContent.trim()) {
          parts.push(
            <div key={key++}>
              {preprocessSpans(remainingContent)}
            </div>
          )
        }
        break
      }

      // Add content before this component (may contain MDListItem)
      const beforeContent = remainingContent.substring(0, tablePanelMatch.index)
      if (beforeContent.trim()) {
        parts.push(
          <div key={key++}>
            {preprocessSpans(beforeContent)}
          </div>
        )
      }

      // Parse UITablePanel
      const tablePanelContent = tablePanelMatch[0]
      const propsMatch = tablePanelContent.match(/<UITablePanel(\s+[^>]*)?>/)?.[1] || ''
      const columns = parseAttribute(propsMatch, 'columns') || '2'

      // Extract UIPanel children
      const panelsContent = tablePanelContent.match(/<UITablePanel[^>]*>([\s\S]*?)<\/UITablePanel>/)?.[1] || ''
      const panels: ReactNode[] = []
      let panelKey = 0

      // Find all UIPanels within this UITablePanel
      let panelMatch: RegExpExecArray | null
      panelRegex.lastIndex = 0
      while ((panelMatch = panelRegex.exec(panelsContent)) !== null) {
        const panelFull = panelMatch[0]
        const panelProps = panelMatch[1] || ''
        const panelContent = panelFull.match(/<UIPanel[^>]*>([\s\S]*?)<\/UIPanel>/)?.[1] || ''

        const icon = parseAttribute(panelProps, 'icon') || 'work'
        const color = parseAttribute(panelProps, 'color') || 'blue'
        const title = parseAttribute(panelProps, 'title') || 'Panel'

        // Preprocess panel content to convert custom spans
        const processedPanelContent = preprocessSpans(panelContent.trim())

        // Render panel content as markdown
        panels.push(
          <UIPanel key={panelKey++} icon={icon as any} color={color as any} title={title}>
            {processedPanelContent}
          </UIPanel>
        )
      }

      parts.push(
        <UITablePanel key={key++} columns={parseInt(columns) as 1 | 2 | 3}>
          {panels}
        </UITablePanel>
      )

      // Update remaining content
      remainingContent = remainingContent.substring(tablePanelMatch.index + tablePanelMatch[0].length)
      tablePanelRegex.lastIndex = 0
    }

    return parts.length > 0 ? parts : preprocessSpans(content)
  }

  return <>{renderContent()}</>
}

// Helper to parse attribute values from props string
function parseAttribute(propsStr: string, attrName: string): string | null {
  const regex = new RegExp(`${attrName}=["']([^"']*)["']`)
  const match = propsStr.match(regex)
  return match ? match[1] : null
}

// Preprocess panel content to handle colored spans, MDListItem, ExternalLinkPanel, and markdown
function preprocessSpans(content: string): ReactNode {
  // First, extract all MDListItem components
  const listItemRegex = /<MDListItem>([\s\S]*?)<\/MDListItem>/g
  const listItems: { start: number; end: number; content: string }[] = []
  let listItemMatch: RegExpExecArray | null

  listItemRegex.lastIndex = 0
  while ((listItemMatch = listItemRegex.exec(content)) !== null) {
    listItems.push({
      start: listItemMatch.index,
      end: listItemMatch.index + listItemMatch[0].length,
      content: listItemMatch[1]
    })
  }

  // Extract ExternalLinkPanel components (self-closing)
  const linkPanelRegex = /<ExternalLinkPanel\s+([^>]+)\/>/g
  const linkPanels: { start: number; end: number; attrs: string }[] = []
  let linkPanelMatch: RegExpExecArray | null

  linkPanelRegex.lastIndex = 0
  while ((linkPanelMatch = linkPanelRegex.exec(content)) !== null) {
    linkPanels.push({
      start: linkPanelMatch.index,
      end: linkPanelMatch.index + linkPanelMatch[0].length,
      attrs: linkPanelMatch[1]
    })
  }

  // Now process colored spans (with optional size attribute)
  const spanRegex = /<span\s+([^>]+)>([^<]+)<\/span>/g
  const parts: ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  let key = 0

  // Process list items, link panels, and spans in order
  const allComponents = [
    ...listItems.map(item => ({ type: 'listItem', ...item })),
    ...linkPanels.map(panel => ({ type: 'linkPanel', ...panel })),
  ].sort((a, b) => a.start - b.start)

  spanRegex.lastIndex = 0
  while ((match = spanRegex.exec(content)) !== null) {
    // Skip spans that are inside MDListItem components
    const isInsideListItem = listItems.some(item =>
      match.index >= item.start && match.index < item.end
    )

    if (!isInsideListItem) {
      const attrs = match[1]
      const color = parseAttribute(attrs, 'color') || 'slate'
      const size = parseAttribute(attrs, 'size')

      allComponents.push({
        type: 'span',
        start: match.index,
        end: match.index + match[0].length,
        content: match[2],
        color: color,
        size: size
      })
    }
  }

  allComponents.sort((a, b) => a.start - b.start)

  // First, remove all MDListItem, ExternalLinkPanel and span tags from content for markdown processing
  let cleanContent = content
  // Remove all MDListItem tags
  cleanContent = cleanContent.replace(/<MDListItem>[\s\S]*?<\/MDListItem>/g, '')
  // Remove all ExternalLinkPanel tags
  cleanContent = cleanContent.replace(/<ExternalLinkPanel\s+[^>]+\/>/g, '')
  // Remove all span tags (with any attributes)
  cleanContent = cleanContent.replace(/<span\s+[^>]+>[^<]+<\/span>/g, '')

  for (const component of allComponents) {
    if (component.type === 'listItem') {
      // Process MDListItem content (which may contain colored spans)
      const itemContent = processListItemContent(component.content, key++)
      parts.push(
        <MDListItem key={`list-${key++}`}>
          {itemContent}
        </MDListItem>
      )
    } else if (component.type === 'linkPanel') {
      // Add ExternalLinkPanel
      const comp = component as any
      const icon = parseAttribute(comp.attrs, 'icon') || 'github'
      const title = parseAttribute(comp.attrs, 'title') || ''
      const description = parseAttribute(comp.attrs, 'description') || ''
      const href = parseAttribute(comp.attrs, 'href') || ''

      parts.push(
        <ExternalLinkPanel
          key={`link-${key++}`}
          icon={icon as any}
          title={title}
          description={description}
          href={href}
        />
      )
    } else if (component.type === 'span') {
      // Add the colored span with optional size
      const comp = component as any
      const colorClass = colorClassMap[comp.color] || 'text-slate-300'
      const sizeClass = comp.size === 'lg' ? 'text-sm font-semibold mb-2 mt-4' :
                        comp.size === 'xl' ? 'text-base font-bold mb-3 mt-4' :
                        'text-xs mb-2'

      parts.push(
        <span key={`span-${key++}`} className={`${colorClass} block ${sizeClass}`}>
          {comp.content}
        </span>
      )
    }
  }

  // Add the cleaned content as markdown (with all custom tags removed)
  if (cleanContent.trim()) {
    parts.push(
      <ReactMarkdown
        key={`md-${key++}`}
        components={{
          p: ({ node, ...props }: any) => <p {...props} className="text-base mb-3 leading-relaxed" />,
          strong: ({ node, ...props }: any) => <strong {...props} className="font-semibold text-white" />,
          em: ({ node, ...props }: any) => <em {...props} className="italic" />,
          h3: ({ node, ...props }: any) => <h3 {...props} className="text-lg font-semibold text-white mt-4 mb-2" />
        }}
      >
        {cleanContent}
      </ReactMarkdown>
    )
  }

  return parts.length > 0 ? <div className="space-y-1">{parts}</div> : (
    <ReactMarkdown
      components={{
        p: ({ node, ...props }: any) => <p {...props} className="text-base mb-3 leading-relaxed" />,
        strong: ({ node, ...props }: any) => <strong {...props} className="font-semibold text-white" />,
        em: ({ node, ...props }: any) => <em {...props} className="italic" />
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

// Helper to process MDListItem content (handles colored spans within list items)
function processListItemContent(content: string, baseKey: number): ReactNode {
  const spanRegex = /<span\s+([^>]+)>([^<]+)<\/span>/g
  const parts: ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  let spanKey = 0

  spanRegex.lastIndex = 0

  while ((match = spanRegex.exec(content)) !== null) {
    // Add text before the span (only if not just whitespace)
    if (match.index > lastIndex) {
      const beforeText = content.substring(lastIndex, match.index)
      if (beforeText.trim()) {
        parts.push(beforeText)
      }
    }

    // Parse attributes
    const attrs = match[1]
    const spanText = match[2]
    const color = parseAttribute(attrs, 'color') || 'slate'
    const size = parseAttribute(attrs, 'size')

    const colorClass = colorClassMap[color] || 'text-slate-300'

    parts.push(
      <span key={`span-${baseKey}-${spanKey++}`} className={colorClass}>
        {spanText}
      </span>
    )

    lastIndex = match.index + match[0].length
  }

  // Add remaining text (only if not just whitespace)
  if (lastIndex < content.length) {
    const remainingText = content.substring(lastIndex)
    if (remainingText.trim()) {
      parts.push(remainingText)
    }
  }

  return parts.length > 0 ? <>{parts}</> : content
}

// Helper to process inline colored spans in text
function processInlineSpans(children: React.ReactNode): React.ReactNode {
  // If it's not a string or array, return as-is
  if (typeof children !== 'string' && !Array.isArray(children)) {
    return children
  }

  // If it's an array, process each element separately and preserve React elements
  if (Array.isArray(children)) {
    return children.map((child, idx) => {
      if (typeof child === 'string') {
        // Process string content for colored spans
        return processStringForSpans(child, idx)
      } else {
        // Preserve React elements (like <em>, <strong>, etc.)
        return <React.Fragment key={idx}>{child}</React.Fragment>
      }
    })
  }

  // Single string - process it
  return processStringForSpans(children, 0)
}

// Helper to process a single string for colored spans
function processStringForSpans(text: string, baseKey: number): React.ReactNode {
  const spanRegex = /<span\s+color=["']([^"']+)["']>([^<]+)<\/span>/g
  const parts: React.ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  let spanKey = 0

  while ((match = spanRegex.exec(text)) !== null) {
    // Add text before the span
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index))
    }

    // Add the colored span
    const color = match[1]
    const spanText = match[2]
    const colorClass = colorClassMap[color] || 'text-slate-300'

    parts.push(
      <span key={`span-${baseKey}-${spanKey++}`} className={colorClass}>
        {spanText}
      </span>
    )

    lastIndex = match.index + match[0].length
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex))
  }

  return parts.length > 0 ? <React.Fragment key={baseKey}>{parts}</React.Fragment> : text
}

// Standard markdown component overrides
function getMarkdownComponents(
  onLinkClick?: (href: string, text: string) => void,
  customComponents: any = {}
) {
  return {
    a: ({ node, ...props }: any) => (
      <a
        {...props}
        onClick={(e) => {
          e.preventDefault()
          if (props.href && onLinkClick) {
            onLinkClick(props.href, props.children?.toString() || '')
            window.open(props.href, '_blank', 'noopener,noreferrer')
          } else if (props.href) {
            window.open(props.href, '_blank', 'noopener,noreferrer')
          }
        }}
        className="text-blue-400 hover:text-blue-300 underline cursor-pointer"
        target="_blank"
        rel="noopener noreferrer"
      />
    ),
    p: ({ node, children, ...props }: any) => (
      <p {...props} className="mb-4 leading-relaxed">
        {processInlineSpans(children)}
      </p>
    ),
    ul: ({ node, ...props }: any) => (
      <ul {...props} className="list-disc list-inside space-y-2 mb-4" />
    ),
    ol: ({ node, ...props }: any) => (
      <ol {...props} className="list-decimal list-inside space-y-2 mb-4" />
    ),
    li: ({ node, children, ...props }: any) => (
      <li {...props} className="leading-relaxed">
        {processInlineSpans(children)}
      </li>
    ),
    strong: ({ node, children, ...props }: any) => (
      <strong {...props} className="font-semibold text-white">
        {processInlineSpans(children)}
      </strong>
    ),
    em: ({ node, children, ...props }: any) => (
      <em {...props} className="italic">
        {processInlineSpans(children)}
      </em>
    ),
    code: ({ node, ...props }: any) => (
      <code {...props} className="bg-slate-800/50 px-1.5 py-0.5 rounded text-sm font-mono text-blue-300" />
    ),
    ...customComponents
  }
}
