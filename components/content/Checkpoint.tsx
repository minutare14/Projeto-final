'use client'

import { useState } from 'react'

interface CheckpointProps {
  id: string
  question: string
  options: { a: string; b: string; c?: string; d?: string }
  onAnswer: (correct: boolean, explanation: string) => void
  pointsReward: number
}

export function Checkpoint({ id, question, options, onAnswer, pointsReward }: CheckpointProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [result, setResult] = useState<{ correct: boolean; explanation: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [alreadyAnswered, setAlreadyAnswered] = useState(false)

  const handleSubmit = async () => {
    if (!selected || loading) return
    setLoading(true)

    try {
      const res = await fetch(`/api/checkpoints/${id}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ option: selected }),
      })
      const data = await res.json()
      setResult({ correct: data.correct, explanation: data.explanation || '' })
      if (data.alreadyAnswered) setAlreadyAnswered(true)
      onAnswer(data.correct, data.explanation)
    } finally {
      setLoading(false)
    }
  }

  const optionEntries = Object.entries(options).filter(([, v]) => v)

  return (
    <div className="bg-white rounded-xl shadow p-6 mt-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{question}</h3>

      <div className="space-y-3 mb-4">
        {optionEntries.map(([key, value]) => (
          <button
            key={key}
            onClick={() => !result && setSelected(key)}
            disabled={!!result}
            className={`w-full text-left p-3 rounded-lg border-2 transition ${
              selected === key
                ? result
                  ? result.correct && key === selected
                    ? 'border-green-500 bg-green-50'
                    : !result.correct && key === selected
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300'
                  : 'border-green-500 bg-green-50'
                : result?.correct && key === selected
                ? 'border-green-500 bg-green-50'
                : 'border-gray-300 hover:border-green-300'
            }`}
          >
            <span className="font-bold mr-2">{key.toUpperCase()}.</span>
            {value}
          </button>
        ))}
      </div>

      {!result ? (
        <button
          onClick={handleSubmit}
          disabled={!selected || loading}
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Verificando...' : `Responder (+${pointsReward} pts)`}
        </button>
      ) : (
        <div
          className={`p-4 rounded-lg ${
            result.correct ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
          }`}
        >
          <p className={`font-semibold ${result.correct ? 'text-green-700' : 'text-gray-700'}`}>
            {result.correct ? '✓ Correto!' : 'Não foi dessa vez'}
          </p>
          {result.explanation && (
            <p className="text-gray-600 mt-2 text-sm">{result.explanation}</p>
          )}
        </div>
      )}
    </div>
  )
}