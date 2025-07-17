import { prisma } from '../../lib/db'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { uploadId } = req.body

    if (!uploadId) {
      return res.status(400).json({ error: 'Upload ID is required' })
    }

    // Find the upload
    const upload = await prisma.upload.findUnique({
      where: { id: uploadId }
    })

    if (!upload) {
      return res.status(404).json({ error: 'Upload not found' })
    }

    // Update status to processing
    await prisma.upload.update({
      where: { id: uploadId },
      data: { status: 'processing' }
    })

    // Call n8n webhook (replace with your actual n8n webhook URL)
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || 'https://your-n8n-instance.com/webhook/upsc-evaluation'
    
    const webhookPayload = {
      uploadId: upload.id,
      fileName: upload.fileName,
      filePath: upload.filePath,
      callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/evaluation-complete`
    }

    // In production, this would call your n8n webhook
    // For demo purposes, we'll simulate the process
    try {
      const response = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookPayload)
      })

      if (!response.ok) {
        throw new Error('n8n webhook failed')
      }

      res.status(200).json({ 
        success: true, 
        message: 'Evaluation started',
        uploadId 
      })

    } catch (webhookError) {
      console.log('n8n webhook not available, using mock evaluation...')
      
      // Simulate processing time and generate mock evaluation
      setTimeout(async () => {
        const mockEvaluation = {
          overall_score: Math.floor(Math.random() * 100) + 150, // 150-250 range
          structure: "Your answer demonstrates a clear understanding of the topic with proper introduction and conclusion. However, the body paragraphs could be better organized with clearer transitions between ideas. Consider using bullet points or numbered lists for complex information to improve readability.",
          content: "The content shows good factual knowledge but lacks depth in critical analysis. You've covered the basic points but missed some important contemporary examples and case studies. Include more recent data, statistics, and real-world applications to strengthen your arguments.",
          language: "Your language is generally clear and appropriate for the UPSC level. Grammar and vocabulary are mostly correct, but there are a few instances of awkward phrasing. Work on sentence variety and avoid repetition of phrases. The tone is appropriately formal and objective.",
          enrichment: "To enhance your answer, consider adding: 1) More recent examples and case studies, 2) Statistical data to support your arguments, 3) Multiple perspectives on the issue, 4) Linkages to government schemes and policies, 5) Comparative analysis with other countries or states where relevant.",
          time_management: "Based on the length and depth of your answer, it appears you managed your time reasonably well. However, some sections could be more concise to allow for better coverage of all aspects of the question. Practice writing more structured and time-efficient responses."
        }

        await prisma.upload.update({
          where: { id: uploadId },
          data: { 
            status: 'completed',
            resultJson: mockEvaluation
          }
        })
      }, 15000) // 15 second delay to simulate processing

      res.status(200).json({ 
        success: true, 
        message: 'Evaluation started (mock mode)',
        uploadId 
      })
    }

  } catch (error) {
    console.error('Evaluation error:', error)
    
    // Update upload status to failed
    if (req.body.uploadId) {
      await prisma.upload.update({
        where: { id: req.body.uploadId },
        data: { status: 'failed' }
      })
    }

    res.status(500).json({ error: 'Evaluation failed' })
  }
}
