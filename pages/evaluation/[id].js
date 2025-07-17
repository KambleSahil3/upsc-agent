import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Navbar } from '../../components/Navbar'
import { EvaluationDisplay } from '../../components/EvaluationDisplay'
import { LoadingScreen } from '../../components/LoadingScreen'
import { Card, CardContent } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { AlertCircle } from 'lucide-react'

export default function EvaluationPage() {
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    if (id) {
      fetchEvaluation()
    }
  }, [id])

  const fetchEvaluation = async () => {
    try {
      const response = await fetch(`/api/status?uploadId=${id}`)
      const data = await response.json()

      if (data.status === 'completed' && data.evaluation) {
        setEvaluation(data.evaluation)
      } else if (data.status === 'failed') {
        setError('Evaluation failed. Please try again.')
      } else {
        setError('Evaluation not found or still processing.')
      }
    } catch (err) {
      setError('Failed to fetch evaluation results.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingScreen />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="max-w-md mx-auto">
            <CardContent className="text-center py-8">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Oops! Something went wrong
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {error}
              </p>
              <Button onClick={() => router.push('/upload')}>
                Try Again
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <EvaluationDisplay evaluation={evaluation} />
      </main>
    </div>
  )
}
