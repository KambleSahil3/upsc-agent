import { prisma } from '../../lib/db'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { uploadId } = req.query

    if (!uploadId) {
      return res.status(400).json({ error: 'Upload ID is required' })
    }

    const upload = await prisma.upload.findUnique({
      where: { id: uploadId }
    })

    if (!upload) {
      return res.status(404).json({ error: 'Upload not found' })
    }

    const response = {
      uploadId: upload.id,
      status: upload.status,
      fileName: upload.fileName,
      createdAt: upload.createdAt,
      updatedAt: upload.updatedAt
    }

    if (upload.status === 'completed' && upload.resultJson) {
      response.evaluation = upload.resultJson
    }

    res.status(200).json(response)

  } catch (error) {
    console.error('Status check error:', error)
    res.status(500).json({ error: 'Failed to check status' })
  }
}
