import { useState } from 'react'
import { useRouter } from 'next/router'
import { Navbar } from '../components/Navbar'
import { FileUpload } from '../components/FileUpload'
import { LoadingScreen } from '../components/LoadingScreen'
import toast from 'react-hot-toast'

export default function Upload() {
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()

  const handleUpload = async (uploadId) => {
    setIsProcessing(true)
    
    try {
      // Trigger evaluation
      const evalResponse = await fetch('/api/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uploadId }),
      })

      if (!evalResponse.ok) {
        throw new Error('Evaluation failed')
      }

      // Poll for completion
      const pollInterval = setInterval(async () => {
        try {
          const statusResponse = await fetch(`/api/status?uploadId=${uploadId}`)
          const status = await statusResponse.json()

          if (status.status === 'completed') {
            clearInterval(pollInterval)
            router.push(`/evaluation/${uploadId}`)
          } else if (status.status === 'failed') {
            clearInterval(pollInterval)
            toast.error('Evaluation failed. Please try again.')
            setIsProcessing(false)
          }
        } catch (error) {
          console.error('Status check error:', error)
        }
      }, 3000)

      // Timeout after 5 minutes
      setTimeout(() => {
        clearInterval(pollInterval)
        if (isProcessing) {
          toast.error('Evaluation timed out. Please try again.')
          setIsProcessing(false)
        }
      }, 300000)

    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Something went wrong. Please try again.')
      setIsProcessing(false)
    }
  }

  if (isProcessing) {
    return <LoadingScreen />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Hey aspirant! 👋
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Your answer is about to go under the UPSC scanner!
          </p>
        </div>

        <FileUpload onUpload={handleUpload} />

        <div className="mt-12 text-center">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
              💡 Pro Tips for Better Evaluation:
            </h3>
            <ul className="text-yellow-700 dark:text-yellow-300 space-y-1">
              <li>• Ensure your PDF is clear and readable</li>
              <li>• Include proper headings and structure</li>
              <li>• Write legibly if handwritten</li>
              <li>• Keep file size under 10MB</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
