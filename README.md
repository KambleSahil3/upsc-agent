# UPSC Mains AI Evaluator

A comprehensive Next.js application for evaluating UPSC Mains answers using AI, built with Next.js 14+, Tailwind CSS, PostgreSQL, and n8n workflow automation.

## Features

- 📝 PDF Upload with progress tracking
- 🤖 AI-powered evaluation with detailed feedback
- 📊 Comprehensive scoring system (out of 250)
- 🎯 5-section detailed analysis
- 📱 Responsive design with dark/light mode
- 🔄 Real-time processing status
- 📄 PDF report generation
- 🎨 Clean, motivational UI

## Tech Stack

- **Frontend**: Next.js 14+ with Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Backend**: n8n workflow automation
- **File Storage**: Local file system (configurable)
- **UI Components**: Custom components with Lucide React icons

## Quick Start

### 1. Prerequisites
- Node.js 18+
- PostgreSQL database
- n8n instance (optional for development)

### 2. Installation

```bash
# Clone the repository
git clone <repository-url>
cd upsc-evaluator

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your database and n8n configuration

# Set up database
npx prisma generate
npx prisma db push

# Create uploads directory
mkdir uploads

# Start development server
npm run dev
```

### 3. Database Setup

```sql
-- Create PostgreSQL database
CREATE DATABASE upsc_evaluator;

-- The Prisma schema will handle table creation
```

### 4. n8n Webhook Configuration

Create an n8n workflow with:
1. Webhook trigger
2. PDF text extraction
3. OpenAI evaluation
4. Callback to `/api/evaluation-complete`

Example n8n workflow structure:
```
Webhook → PDF Parser → OpenAI → HTTP Request (callback)
```

## Project Structure

```
upsc-evaluator/
├── components/          # React components
│   ├── ui/             # UI components
│   ├── EvaluationDisplay.js
│   ├── FileUpload.js
│   └── LoadingScreen.js
├── pages/              # Next.js pages
│   ├── api/            # API routes
│   ├── evaluation/     # Dynamic evaluation pages
│   └── upload.js       # Upload page
├── lib/                # Utilities
├── prisma/             # Database schema
├── styles/             # CSS styles
└── uploads/            # File uploads (create manually)
```

## API Endpoints

- `POST /api/upload` - Handle file uploads
- `POST /api/evaluate` - Trigger evaluation process
- `GET /api/status` - Check evaluation status
- `POST /api/evaluation-complete` - n8n callback endpoint

## Environment Variables

```env
DATABASE_URL="postgresql://username:password@localhost:5432/upsc_evaluator"
N8N_WEBHOOK_URL="https://your-n8n-instance.com/webhook/upsc-evaluation"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Development

```bash
# Run development server
npm run dev

# Database operations
npm run db:push    # Push schema changes
npm run db:studio  # Open Prisma Studio

# Build for production
npm run build
npm run start
```

## Docker Setup (Optional)

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/upsc_evaluator
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=upsc_evaluator
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```


## 👨‍💻 **Author**

**Sahil Kamble**  

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/sahil-kamble-40898b208/)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-black?style=for-the-badge&logo=github)](https://github.com/KambleSahil3)

---
