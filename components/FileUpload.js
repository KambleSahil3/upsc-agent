import { useState, useRef } from 'react'
import { Upload, FileText, X } from 'lucide-react'
import { Button } from './ui/Button'
import { Card } from './ui/Card'
import { Progress } from './ui/Progress'
import toast from 'react-hot-toast'

export function FileUpload({ onUpload }) {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile)
    } else {
      alert('Please select a PDF file')
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setProgress(0)

    const formData = new FormData()
    formData.append('file', file)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90))
      }, 200)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)
      setProgress(100)

      if (response.ok) {
        const result = await response.json()
        onUpload(result.uploadId)
      } else {
        throw new Error('Whoa! That file is too heavy (max 10MB). Try compressing it or upload a smaller version.')
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(error.message || 'Upload failed. Please try again.', {
        style: {
          background: '#fef2f2',
          color: '#b91c1c',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        },
        icon: '📁',
      })
    } finally {
      setUploading(false)
    }
  }
  

  const removeFile = () => {
    setFile(null)
    setProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="p-8">
        <div className="text-center mb-8">
          <Upload className="h-16 w-16 text-primary-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Upload Your Answer Sheet
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Upload your PDF answer sheet and get detailed UPSC-style feedback
          </p>
        </div>

        {!file ? (
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              size="lg"
              className="mb-4"
            >
              <Upload className="h-5 w-5 mr-2" />
              Choose PDF File
            </Button>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Maximum file size: 10MB
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="h-8 w-8 text-red-500" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {file.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                onClick={removeFile}
                variant="ghost"
                size="sm"
                disabled={uploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {uploading && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                  Uploading... {progress}%
                </p>
              </div>
            )}

            <Button
              onClick={handleUpload}
              disabled={uploading}
              loading={uploading}
              className="w-full"
              size="lg"
            >
              {uploading ? 'Uploading...' : 'Upload & Evaluate'}
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}
