'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { ContentBlock } from '@/components/content/ContentBlock'
import { Checkpoint } from '@/components/content/Checkpoint'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { PointsToast, usePointsToast } from '@/components/ui/PointsToast'
import { useTimeTracking } from '@/lib/hooks/useTimeTracking'

interface Block {
  id: string
  title: string | null
  body: string
  hasFormula: boolean
  pointsReward: number
  completed: boolean
  checkpoints: Array<{
    id: string
    question: string
    optionA: string
    optionB: string
    optionC: string | null
    optionD: string | null
    correctOption: string
    explanation: string | null
    pointsReward: number
  }>
}

export default function SubjectPage() {
  const params = useParams()
  const code = params.code as string
  const [blocks, setBlocks] = useState<Block[]>([])
  const [loading, setLoading] = useState(true)
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0)
  const [showCheckpoint, setShowCheckpoint] = useState(false)
  const { toast, showToast, hideToast } = usePointsToast()

  useTimeTracking()

  useEffect(() => {
    fetch(`/api/subjects/${code}/blocks`)
      .then((res) => res.json())
      .then((data) => {
        setBlocks(data.blocks || [])
        setLoading(false)
      })
  }, [code])

  if (loading) {
    return <div className="p-8 text-center">Carregando...</div>
  }

  if (!blocks.length) {
    return <div className="p-8 text-center">Nenhum bloco encontrado</div>
  }

  const currentBlock = blocks[currentBlockIndex]
  const completedCount = blocks.filter((b) => b.completed).length

  const handleBlockComplete = () => {
    setBlocks((prev) =>
      prev.map((b, i) => (i === currentBlockIndex ? { ...b, completed: true } : b))
    )
    showToast('Bloco concluído!', currentBlock.pointsReward)
  }

  const handleCheckpointAnswer = (correct: boolean, explanation: string) => {
    if (correct) {
      const checkpoint = currentBlock.checkpoints[0]
      showToast('Resposta correta!', checkpoint?.pointsReward || 20)
    }
    setShowCheckpoint(false)
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-green-800 mb-2">
          {code === 'ICTA13' ? 'ICTA13 — Ecologia' : code}
        </h1>
        <ProgressBar
          current={completedCount}
          total={blocks.length}
          label={`${completedCount} de ${blocks.length} blocos concluídos`}
        />
      </div>

      {currentBlock && (
        <>
          <ContentBlock
            id={currentBlock.id}
            title={currentBlock.title || undefined}
            body={currentBlock.body}
            hasFormula={currentBlock.hasFormula}
            completed={currentBlock.completed}
            onComplete={handleBlockComplete}
            pointsReward={currentBlock.pointsReward}
          />

          {!currentBlock.completed && currentBlock.checkpoints.length > 0 && (
            <div className="mt-4">
              {!showCheckpoint ? (
                <button
                  onClick={() => setShowCheckpoint(true)}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
                >
                  Resolver Checkpoint (+{currentBlock.checkpoints[0]?.pointsReward} pts)
                </button>
              ) : (
                <Checkpoint
                  id={currentBlock.checkpoints[0].id}
                  question={currentBlock.checkpoints[0].question}
                  options={{
                    a: currentBlock.checkpoints[0].optionA,
                    b: currentBlock.checkpoints[0].optionB,
                    c: currentBlock.checkpoints[0].optionC || undefined,
                    d: currentBlock.checkpoints[0].optionD || undefined,
                  }}
                  onAnswer={handleCheckpointAnswer}
                  pointsReward={currentBlock.checkpoints[0].pointsReward}
                />
              )}
            </div>
          )}
        </>
      )}

      <div className="flex justify-between mt-6">
        <button
          onClick={() => setCurrentBlockIndex((i) => Math.max(0, i - 1))}
          disabled={currentBlockIndex === 0}
          className="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50"
        >
          ← Anterior
        </button>
        <span className="text-gray-500">
          Bloco {currentBlockIndex + 1} de {blocks.length}
        </span>
        <button
          onClick={() => setCurrentBlockIndex((i) => Math.min(blocks.length - 1, i + 1))}
          disabled={currentBlockIndex === blocks.length - 1}
          className="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50"
        >
          Próximo →
        </button>
      </div>

      {toast.amount > 0 && (
        <PointsToast message={toast.message} amount={toast.amount} onClose={hideToast} />
      )}
    </div>
  )
}