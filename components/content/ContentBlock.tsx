'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'

interface ContentBlockProps {
  id: string
  title?: string
  body: string
  hasFormula?: boolean
  completed?: boolean
  onComplete: () => void
  pointsReward: number
}

export function ContentBlock({
  id,
  title,
  body,
  completed = false,
  onComplete,
  pointsReward,
}: ContentBlockProps) {
  const [loading, setLoading] = useState(false)

  const handleComplete = async () => {
    if (completed || loading) return
    setLoading(true)
    try {
      await fetch(`/api/blocks/${id}/complete`, { method: 'POST' })
      onComplete()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`bg-white rounded-xl shadow p-6 ${completed ? 'border-2 border-green-500' : ''}`}>
      {title && (
        <h2 className="text-2xl font-bold text-green-800 mb-4">{title}</h2>
      )}

      <div className="prose prose-green max-w-none mb-6">
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
        >
          {body}
        </ReactMarkdown>
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        {completed ? (
          <span className="text-green-600 font-semibold flex items-center gap-2">
            ✓ Concluído
          </span>
        ) : (
          <span className="text-gray-500">{pointsReward} pontos ao completar</span>
        )}
        {!completed && (
          <button
            onClick={handleComplete}
            disabled={loading}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Salvando...' : 'Marcar como Lido'}
          </button>
        )}
      </div>
    </div>
  )
}