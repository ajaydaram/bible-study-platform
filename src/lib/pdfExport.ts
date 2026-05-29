/**
 * PDF Export Utility
 * 
 * Exports journal entries, sermon notes, and other content to PDF format.
 */

import jsPDF from 'jspdf'
import { trackEvent, AnalyticsEvents } from './firebase'

export interface JournalEntry {
  id: string
  title: string
  content: string
  passage?: string
  tags?: string[]
  createdAt: string
  updatedAt?: string
}

export interface ExportOptions {
  includeDate?: boolean
  includeTags?: boolean
  pageSize?: 'a4' | 'letter'
  fontSize?: number
  lineHeight?: number
}

const defaultOptions: Required<ExportOptions> = {
  includeDate: true,
  includeTags: true,
  pageSize: 'a4',
  fontSize: 12,
  lineHeight: 7
}

// Add text with word wrapping
function addWrappedText(
  doc: jsPDF, 
  text: string, 
  x: number, 
  y: number, 
  maxWidth: number, 
  lineHeight: number
): number {
  const lines = doc.splitTextToSize(text, maxWidth)
  lines.forEach((line: string) => {
    if (y > doc.internal.pageSize.height - 20) {
      doc.addPage()
      y = 20
    }
    doc.text(line, x, y)
    y += lineHeight
  })
  return y
}

// Export a single journal entry to PDF
export function exportJournalToPdf(
  entry: JournalEntry, 
  options: ExportOptions = {}
): void {
  const opts = { ...defaultOptions, ...options }
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: opts.pageSize
  })

  const pageWidth = doc.internal.pageSize.width
  const margin = 20
  const contentWidth = pageWidth - margin * 2
  let y = margin

  // Title
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  y = addWrappedText(doc, entry.title, margin, y, contentWidth, 10)
  y += 5

  // Passage reference
  if (entry.passage) {
    doc.setFontSize(12)
    doc.setFont('helvetica', 'italic')
    doc.setTextColor(100, 100, 100)
    y = addWrappedText(doc, entry.passage, margin, y, contentWidth, opts.lineHeight)
    y += 3
  }

  // Date
  if (opts.includeDate) {
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(128, 128, 128)
    const date = new Date(entry.createdAt).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    doc.text(date, margin, y)
    y += 10
  }

  // Content
  doc.setFontSize(opts.fontSize)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(0, 0, 0)
  y = addWrappedText(doc, entry.content, margin, y, contentWidth, opts.lineHeight)
  y += 10

  // Tags
  if (opts.includeTags && entry.tags && entry.tags.length > 0) {
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(100, 100, 100)
    const tagsText = `Tags: ${entry.tags.join(', ')}`
    y = addWrappedText(doc, tagsText, margin, y, contentWidth, 5)
  }

  // Footer
  const pageCount = (doc as unknown as { internal: { pages: unknown[] } }).internal.pages.length - 1
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    )
    doc.text(
      'Scriptorium Bible App',
      pageWidth - margin,
      doc.internal.pageSize.height - 10,
      { align: 'right' }
    )
  }

  // Save the PDF
  const fileName = `${entry.title.replace(/[^a-z0-9]/gi, '_').substring(0, 50)}_${Date.now()}.pdf`
  doc.save(fileName)

  trackEvent(AnalyticsEvents.PDF_EXPORT || 'pdf_export', {
    type: 'journal',
    has_passage: !!entry.passage
  })
}

// Export multiple journal entries to a single PDF
export function exportMultipleJournalsToPdf(
  entries: JournalEntry[],
  title: string = 'Journal Entries',
  options: ExportOptions = {}
): void {
  const opts = { ...defaultOptions, ...options }
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: opts.pageSize
  })

  const pageWidth = doc.internal.pageSize.width
  const margin = 20
  const contentWidth = pageWidth - margin * 2
  let y = margin

  // Cover page title
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text(title, pageWidth / 2, 80, { align: 'center' })
  
  doc.setFontSize(14)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 100, 100)
  doc.text(`${entries.length} entries`, pageWidth / 2, 95, { align: 'center' })
  doc.text(new Date().toLocaleDateString(), pageWidth / 2, 105, { align: 'center' })

  // Table of contents
  doc.addPage()
  y = margin
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(0, 0, 0)
  doc.text('Table of Contents', margin, y)
  y += 15

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  entries.forEach((entry, index) => {
    const entryTitle = entry.title.length > 50 ? entry.title.substring(0, 47) + '...' : entry.title
    doc.text(`${index + 1}. ${entryTitle}`, margin, y)
    y += 8
    if (y > doc.internal.pageSize.height - 30) {
      doc.addPage()
      y = margin
    }
  })

  // Individual entries
  entries.forEach((entry, index) => {
    doc.addPage()
    y = margin

    // Entry number
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(150, 150, 150)
    doc.text(`Entry ${index + 1} of ${entries.length}`, margin, y)
    y += 10

    // Title
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    y = addWrappedText(doc, entry.title, margin, y, contentWidth, 8)
    y += 3

    // Passage
    if (entry.passage) {
      doc.setFontSize(11)
      doc.setFont('helvetica', 'italic')
      doc.setTextColor(100, 100, 100)
      y = addWrappedText(doc, entry.passage, margin, y, contentWidth, 6)
      y += 2
    }

    // Date
    if (opts.includeDate) {
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(128, 128, 128)
      const date = new Date(entry.createdAt).toLocaleDateString()
      doc.text(date, margin, y)
      y += 8
    }

    // Content
    doc.setFontSize(opts.fontSize)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(0, 0, 0)
    y = addWrappedText(doc, entry.content, margin, y, contentWidth, opts.lineHeight)

    // Tags
    if (opts.includeTags && entry.tags && entry.tags.length > 0) {
      y += 5
      doc.setFontSize(9)
      doc.setTextColor(100, 100, 100)
      const tagsText = `Tags: ${entry.tags.join(', ')}`
      addWrappedText(doc, tagsText, margin, y, contentWidth, 5)
    }
  })

  // Page numbers
  const pageCount = (doc as unknown as { internal: { pages: unknown[] } }).internal.pages.length - 1
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    )
  }

  const fileName = `${title.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.pdf`
  doc.save(fileName)

  trackEvent(AnalyticsEvents.PDF_EXPORT || 'pdf_export', {
    type: 'journal_collection',
    count: entries.length
  })
}

// Export sermon notes to PDF
export interface SermonEntry {
  id: string
  title: string
  passage: string
  date: string
  notes: string
  outline?: string[]
  illustrations?: string[]
  applications?: string[]
}

export function exportSermonToPdf(
  sermon: SermonEntry,
  options: ExportOptions = {}
): void {
  const opts = { ...defaultOptions, ...options }
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: opts.pageSize
  })

  const pageWidth = doc.internal.pageSize.width
  const margin = 20
  const contentWidth = pageWidth - margin * 2
  let y = margin

  // Header
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  y = addWrappedText(doc, sermon.title, margin, y, contentWidth, 10)
  y += 5

  // Passage
  doc.setFontSize(14)
  doc.setFont('helvetica', 'italic')
  doc.setTextColor(60, 60, 60)
  y = addWrappedText(doc, sermon.passage, margin, y, contentWidth, 8)
  y += 3

  // Date
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(128, 128, 128)
  doc.text(new Date(sermon.date).toLocaleDateString(), margin, y)
  y += 15

  // Outline
  if (sermon.outline && sermon.outline.length > 0) {
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    doc.text('Outline', margin, y)
    y += 8

    doc.setFontSize(opts.fontSize)
    doc.setFont('helvetica', 'normal')
    sermon.outline.forEach((point, index) => {
      y = addWrappedText(doc, `${index + 1}. ${point}`, margin + 5, y, contentWidth - 5, opts.lineHeight)
      y += 2
    })
    y += 8
  }

  // Notes
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(0, 0, 0)
  doc.text('Notes', margin, y)
  y += 8

  doc.setFontSize(opts.fontSize)
  doc.setFont('helvetica', 'normal')
  y = addWrappedText(doc, sermon.notes, margin, y, contentWidth, opts.lineHeight)
  y += 10

  // Illustrations
  if (sermon.illustrations && sermon.illustrations.length > 0) {
    if (y > doc.internal.pageSize.height - 50) {
      doc.addPage()
      y = margin
    }

    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Illustrations', margin, y)
    y += 8

    doc.setFontSize(opts.fontSize)
    doc.setFont('helvetica', 'normal')
    sermon.illustrations.forEach((illustration, index) => {
      y = addWrappedText(doc, `${index + 1}. ${illustration}`, margin + 5, y, contentWidth - 5, opts.lineHeight)
      y += 3
    })
    y += 10
  }

  // Applications
  if (sermon.applications && sermon.applications.length > 0) {
    if (y > doc.internal.pageSize.height - 50) {
      doc.addPage()
      y = margin
    }

    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Application Points', margin, y)
    y += 8

    doc.setFontSize(opts.fontSize)
    doc.setFont('helvetica', 'normal')
    sermon.applications.forEach((app, index) => {
      y = addWrappedText(doc, `${index + 1}. ${app}`, margin + 5, y, contentWidth - 5, opts.lineHeight)
      y += 3
    })
  }

  // Page numbers
  const pageCount = (doc as unknown as { internal: { pages: unknown[] } }).internal.pages.length - 1
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    )
  }

  const fileName = `Sermon_${sermon.title.replace(/[^a-z0-9]/gi, '_').substring(0, 30)}_${Date.now()}.pdf`
  doc.save(fileName)

  trackEvent(AnalyticsEvents.PDF_EXPORT || 'pdf_export', {
    type: 'sermon'
  })
}
