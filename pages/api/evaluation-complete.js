import { prisma } from '../../lib/db'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { uploadId, evaluation, success } = req.body

    if (!uploadId) {
      return res.status(400).json({ error: 'Upload ID is required' })
    }

    if (success && evaluation) {
      // Update upload with evaluation results
      await prisma.upload.update({
        where: { id: uploadId },
        data: {
          status: 'completed',
          resultJson: evaluation
        }
      })
    } else {
      // Mark as failed
      await prisma.upload.update({
        where: { id: uploadId },
        data: {
          status: 'failed'
        }
      })
    }

    res.status(200).json({ success: true, message: 'Status updated' })

  } catch (error) {
    console.error('Evaluation completion error:', error)
    res.status(500).json({ error: 'Failed to update evaluation status' })
  }
}
