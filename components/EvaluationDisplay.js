import { useState } from 'react'
import { ChevronDown, ChevronUp, Download, Award } from 'lucide-react'
import { Card, CardContent, CardHeader } from './ui/Card'
import { Button } from './ui/Button'
import { formatScore } from '../lib/utils'
import jsPDF from 'jspdf'

export function EvaluationDisplay({ evaluation }) {
  const [expandedSections, setExpandedSections] = useState({})

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const downloadPDF = () => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const margin = 20
    let yPosition = margin

    // Title
    doc.setFontSize(20)
    doc.text('UPSC Answer Evaluation Report', margin, yPosition)
    yPosition += 20

    // Score
    doc.setFontSize(16)
    doc.text(`Overall Score: ${evaluation.overall_score}/250`, margin, yPosition)
    yPosition += 15

    // Sections
    const sections = [
      { key: 'structure', title: 'Structure & Presentation' },
      { key: 'content', title: 'Content Gaps & Coverage' },
      { key: 'language', title: 'Language & Grammar' },
      { key: 'enrichment', title: 'Enrichment Suggestions' },
      { key: 'time_management', title: 'Time Management' }
    ]

    sections.forEach(section => {
      doc.setFontSize(14)
      doc.text(section.title, margin, yPosition)
      yPosition += 10

      doc.setFontSize(10)
      const text = evaluation[section.key] || 'No feedback available'
      const splitText = doc.splitTextToSize(text, pageWidth - 2 * margin)
      doc.text(splitText, margin, yPosition)
      yPosition += splitText.length * 5 + 10

      if (yPosition > 270) {
        doc.addPage()
        yPosition = margin
      }
    })

    doc.save('upsc-evaluation-report.pdf')
  }

  const sections = [
    {
      key: 'structure',
      title: 'Structure & Presentation',
      icon: '📋',
      content: evaluation.structure
    },
    {
      key: 'content',
      title: 'Content Gaps & Coverage',
      icon: '📚',
      content: evaluation.content
    },
    {
      key: 'language',
      title: 'Language & Grammar',
      icon: '✍️',
      content: evaluation.language
    },
    {
      key: 'enrichment',
      title: 'Enrichment Suggestions',
      icon: '💡',
      content: evaluation.enrichment
    },
    {
      key: 'time_management',
      title: 'Time Management',
      icon: '⏱️',
      content: evaluation.time_management
    }
  ]

  const { grade, color } = formatScore(evaluation.overall_score)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-primary-600 p-3 rounded-full">
                <Award className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Evaluation Complete!
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Your answer has been evaluated by our AI examiner
                </p>
              </div>
            </div>
            <Button onClick={downloadPDF} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Score Card */}
      <Card>
        <CardContent className="text-center py-8">
          <div className="mb-4">
            <div className={`text-6xl font-bold ${color} mb-2`}>
              {evaluation.overall_score}
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-lg">
              out of 250
            </div>
            <div className={`text-2xl font-bold ${color} mt-2`}>
              Grade: {grade}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-primary-600 h-3 rounded-full transition-all duration-1000"
              style={{ width: `${(evaluation.overall_score / 250) * 100}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Feedback Sections */}
      <div className="space-y-4">
        {sections.map((section) => (
          <Card key={section.key}>
            <div 
              className="px-6 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              onClick={() => toggleSection(section.key)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{section.icon}</span>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {section.title}
                  </h3>
                </div>
                {expandedSections[section.key] ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </div>
            </div>
            
            {expandedSections[section.key] && (
              <CardContent className="border-t border-gray-200 dark:border-gray-700">
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {section.content || 'No specific feedback available for this section.'}
                  </p>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Motivational Footer */}
      <Card>
        <CardContent className="text-center py-6">
          <p className="text-lg text-gray-700 dark:text-gray-300 italic mb-2">
            "Every expert was once a beginner. Keep practicing! 🚀"
          </p>
          <Button onClick={() => window.location.href = '/upload'} className="mt-4">
            Evaluate Another Answer
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
