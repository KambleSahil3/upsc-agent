import { useState } from 'react'
import { Navbar } from '../components/Navbar'
import { Button } from '../components/ui/Button'
import { Card, CardContent } from '../components/ui/Card'
import { Upload, Zap, Award, Clock } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const [currentQuote, setCurrentQuote] = useState(0)
  
  const quotes = [
    "Success is a series of small wins",
    "Every expert was once a beginner",
    "Consistency beats perfection",
    "Your dedication will pay off"
  ]

  const features = [
    {
      icon: <Zap className="h-8 w-8 text-primary-600" />,
      title: "AI-Powered Evaluation",
      description: "Get detailed feedback using advanced AI that evaluates like a UPSC examiner"
    },
    {
      icon: <Award className="h-8 w-8 text-primary-600" />,
      title: "Comprehensive Scoring",
      description: "Receive scores out of 250 with detailed breakdown across 5 key areas"
    },
    {
      icon: <Clock className="h-8 w-8 text-primary-600" />,
      title: "Quick Results",
      description: "Get your evaluation results in under 2 minutes with actionable insights"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center p-4 bg-primary-600 rounded-full mb-6">
              <span className="text-4xl">📝</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              UPSC Mains AI Evaluator
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Upload your handwritten or typed answers and get UPSC-style feedback in seconds!
            </p>
            
            <div className="mb-8">
              <Link href="/upload">
                <Button size="lg" className="text-lg px-8 py-4">
                  <Upload className="h-5 w-5 mr-2" />
                  Upload Your Answer Sheet (PDF)
                </Button>
              </Link>
            </div>

            <div className="bg-primary-100 dark:bg-primary-900/20 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-primary-700 dark:text-primary-300 italic transition-all duration-500">
                "{quotes[currentQuote]}"
              </p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Why Choose Our AI Evaluator?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Upload", desc: "Upload your PDF answer sheet" },
              { step: "2", title: "Process", desc: "AI analyzes your content" },
              { step: "3", title: "Evaluate", desc: "Get detailed feedback" },
              { step: "4", title: "Improve", desc: "Apply insights to excel" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
          <CardContent className="text-center py-12">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Ace Your UPSC Mains? 🎯
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of aspirants who are improving their answers with AI feedback
            </p>
            <Link href="/upload">
              <Button variant="secondary" size="lg" className="text-lg px-8 py-4">
                Start Your Evaluation Now
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
