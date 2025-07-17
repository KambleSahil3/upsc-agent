import { NextApiRequest, NextApiResponse } from 'next'
import multer from 'multer'
import { v4 as uuidv4 } from 'uuid'
import { prisma } from '../../lib/db'
import path from 'path'
import fs from 'fs'

// Configure multer for file upload
const upload = multer({
  storage: multer.diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      const uniqueName = `${uuidv4()}-${file.originalname}`
      cb(null, uniqueName)
    }
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true)
    } else {
      cb(new Error('Only PDF files are allowed'), false)
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
})

const uploadMiddleware = upload.single('file')

// Ensure uploads directory exists
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads')
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // try {
  //   await new Promise((resolve, reject) => {
  //     uploadMiddleware(req, res, (err) => {
  //       if (err) reject(err)
  //       else resolve()
  //     })
  //   })
  try {
    await new Promise((resolve, reject) => {
      uploadMiddleware(req, res, (err) => {
        if (err) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return reject(new Error('📁 Whoa! That file is too heavy (max 10MB). Try compressing it or upload a smaller version.'))
          }
          reject(err)
        } else {
          resolve()
        }
      })
    })

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    // Generate device fingerprint (in production, get from client)
    const deviceFingerprint = req.headers['x-device-fingerprint'] || `anonymous-${Date.now()}`

    // Create or find user
    let user = await prisma.user.findUnique({
      where: { deviceFingerprint }
    })

    if (!user) {
      user = await prisma.user.create({
        data: { deviceFingerprint }
      })
    }

    // Create upload record
    const upload = await prisma.upload.create({
      data: {
        fileName: req.file.originalname,
        filePath: req.file.path,
        userId: user.id,
        status: 'processing'
      }
    })

    res.status(200).json({
      success: true,
      uploadId: upload.id,
      message: 'File uploaded successfully'
    })
  }catch (error) {
    res.status(500).json({ 
      error: error.message // This will send our friendly message
    })
  }
}

  // } catch (error) {
  //   console.error('Upload error:', error)
  //   res.status(500).json({ error: 'Upload failed' })
  // }

export const config = {
  api: {
    bodyParser: false,
  },
}
