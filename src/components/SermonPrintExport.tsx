import { useState } from 'react'
import { jsPDF } from 'jspdf'
import { 
  Printer, 
  Download, 
  Check
} from 'lucide-react'
import type { Sermon } from '../types'

interface SermonPrintExportProps {
  sermon: Partial<Sermon>
}

export default function SermonPrintExport({ sermon }: SermonPrintExportProps) {
  const [downloading, setDownloading] = useState(false)
  const [downloadSuccess, setDownloadSuccess] = useState(false)

  const generatePDF = (type: 'brief' | 'bulletin') => {
    setDownloading(true)
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      const title = sermon.title || 'Expository Sermon Brief'
      const passage = sermon.passage || 'Scripture Passage'
      const dateStr = sermon.date ? new Date(sermon.date).toLocaleDateString() : new Date().toLocaleDateString()

      if (type === 'brief') {
        // Exegetical Sermon Brief
        doc.setFillColor(30, 27, 75) // Dark Indigo
        doc.rect(0, 0, 210, 25, 'F')
        
        doc.setTextColor(255, 255, 255)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(16)
        doc.text('SCRIPTORIUM EXPOSITORY BRIEF', 14, 15)

        doc.setFontSize(9)
        doc.setFont('helvetica', 'normal')
        doc.text(`Generated: ${dateStr}`, 160, 15)

        doc.setTextColor(20, 20, 20)
        doc.setFontSize(18)
        doc.setFont('helvetica', 'bold')
        doc.text(title, 14, 38)

        doc.setFontSize(12)
        doc.setTextColor(79, 70, 229)
        doc.text(`Text: ${passage}`, 14, 46)

        // Horizontal Line
        doc.setDrawColor(220, 220, 220)
        doc.line(14, 50, 196, 50)

        let yPos = 58

        // Central Proposition
        const prop = sermon.exegesis?.centralProposition || sermon.homiletics?.homilетicalProposition || 'Expository proposition grounded in the indicative redemption of Christ.'
        doc.setFontSize(11)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(30, 30, 30)
        doc.text('CENTRAL HOMILETICAL PROPOSITION:', 14, yPos)
        yPos += 6

        doc.setFont('helvetica', 'italic')
        doc.setFontSize(10)
        doc.setTextColor(60, 60, 60)
        const splitProp = doc.splitTextToSize(`"${prop}"`, 180)
        doc.text(splitProp, 14, yPos)
        yPos += splitProp.length * 6 + 6

        // Movements / Points
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(11)
        doc.setTextColor(30, 30, 30)
        doc.text('SERMON MOVEMENTS & EXPOSITION:', 14, yPos)
        yPos += 6

        if (sermon.homiletics?.movements && sermon.homiletics.movements.length > 0) {
          sermon.homiletics.movements.forEach((m, idx) => {
            if (yPos > 260) {
              doc.addPage()
              yPos = 20
            }
            doc.setFont('helvetica', 'bold')
            doc.setFontSize(10)
            doc.setTextColor(79, 70, 229)
            doc.text(`Point ${idx + 1}: ${m.title || 'Movement Point'}`, 14, yPos)
            yPos += 5

            if (m.content) {
              doc.setFont('helvetica', 'normal')
              doc.setFontSize(9)
              doc.setTextColor(50, 50, 50)
              const splitContent = doc.splitTextToSize(m.content, 175)
              doc.text(splitContent, 18, yPos)
              yPos += splitContent.length * 5 + 3
            }

            if (m.application) {
              doc.setFont('helvetica', 'italic')
              doc.setFontSize(9)
              doc.setTextColor(80, 80, 80)
              const splitApp = doc.splitTextToSize(`Application: ${m.application}`, 175)
              doc.text(splitApp, 18, yPos)
              yPos += splitApp.length * 5 + 5
            }
          })
        } else {
          doc.setFont('helvetica', 'normal')
          doc.setFontSize(9)
          doc.setTextColor(90, 90, 90)
          doc.text('1. Historical Ground & Text Context', 18, yPos)
          yPos += 6
          doc.text('2. Christological Redemption & The Gospel Indicative', 18, yPos)
          yPos += 6
          doc.text('3. Faithful Response & Faith In Action', 18, yPos)
          yPos += 10
        }

        // Footer
        doc.setFontSize(8)
        doc.setTextColor(150, 150, 150)
        doc.text('Scriptorium Expository Prep Suite • Soli Deo Gloria', 14, 285)

        doc.save(`${title.replace(/[^a-zA-Z0-9]/g, '_')}_Expository_Brief.pdf`)
      } else {
        // Church Bulletin Listening Guide
        doc.setFillColor(245, 247, 250)
        doc.rect(0, 0, 210, 297, 'F')

        doc.setDrawColor(79, 70, 229)
        doc.setLineWidth(0.8)
        doc.rect(8, 8, 194, 281)

        doc.setTextColor(30, 27, 75)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(16)
        doc.text('SERMON LISTENING & STUDY GUIDE', 105, 22, { align: 'center' })

        doc.setFontSize(13)
        doc.setTextColor(79, 70, 229)
        doc.text(title, 105, 30, { align: 'center' })

        doc.setFontSize(10)
        doc.setTextColor(80, 80, 80)
        doc.text(`Passage: ${passage}  •  ${dateStr}`, 105, 37, { align: 'center' })

        let yPos = 50

        // Scripture Focus
        doc.setFillColor(255, 255, 255)
        doc.roundedRect(14, yPos, 182, 32, 2, 2, 'F')
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(9)
        doc.setTextColor(79, 70, 229)
        doc.text('SCRIPTURE PASSAGE FOCUS:', 18, yPos + 7)

        doc.setFont('helvetica', 'italic')
        doc.setFontSize(9)
        doc.setTextColor(60, 60, 60)
        doc.text(`"${passage}"`, 18, yPos + 14)
        doc.text('Key Verse / Truth: _________________________________________________________________', 18, yPos + 24)

        yPos += 42

        // Main Points (Fill in the blanks)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(10)
        doc.setTextColor(30, 30, 30)
        doc.text('SERMON OUTLINE & NOTES:', 14, yPos)
        yPos += 8

        const points = sermon.homiletics?.movements && sermon.homiletics.movements.length > 0 
          ? sermon.homiletics.movements 
          : [{ title: 'The Problem: Our Fallen Condition', content: '', id: '1' }, { title: 'The Provision: Christ’s Indicative Grace', content: '', id: '2' }, { title: 'The Power: Living by Faith', content: '', id: '3' }]

        points.forEach((pt, idx) => {
          doc.setFont('helvetica', 'bold')
          doc.setFontSize(9)
          doc.setTextColor(79, 70, 229)
          doc.text(`${idx + 1}. ${pt.title || 'Outline Point'}`, 18, yPos)
          yPos += 6

          doc.setDrawColor(200, 200, 200)
          doc.line(18, yPos + 3, 190, yPos + 3)
          doc.line(18, yPos + 10, 190, yPos + 10)
          yPos += 18
        })

        // Discussion / Reflection
        yPos += 4
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(10)
        doc.setTextColor(30, 30, 30)
        doc.text('COMMUNITY GROUP / PERSONAL REFLECTION:', 14, yPos)
        yPos += 7

        doc.setFont('helvetica', 'normal')
        doc.setFontSize(9)
        doc.setTextColor(60, 60, 60)
        doc.text('1. How does this passage reveal the holiness of God and our need for grace?', 18, yPos)
        yPos += 6
        doc.text('2. Where is Christ and His gospel triumph centered in this text?', 18, yPos)
        yPos += 6
        doc.text('3. What specific faith-step or prayer response is the Holy Spirit leading you to take?', 18, yPos)

        // Footer
        doc.setFontSize(8)
        doc.setTextColor(150, 150, 150)
        doc.text('Scriptorium • Scripture Study & Expository Preparation', 105, 282, { align: 'center' })

        doc.save(`${title.replace(/[^a-zA-Z0-9]/g, '_')}_Bulletin_Guide.pdf`)
      }

      setDownloadSuccess(true)
      setTimeout(() => setDownloadSuccess(false), 3000)
    } catch (err) {
      console.error('PDF Generation Error:', err)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={() => generatePDF('brief')}
        disabled={downloading}
        className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
      >
        {downloadSuccess ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Download className="w-3.5 h-3.5" />}
        <span>Export Exegetical Brief (PDF)</span>
      </button>

      <button
        onClick={() => generatePDF('bulletin')}
        disabled={downloading}
        className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
      >
        <Printer className="w-3.5 h-3.5" />
        <span>Print Bulletin Insert (PDF)</span>
      </button>
    </div>
  )
}
