'use client'

import { useState, useEffect, useCallback } from 'react'

interface PointsToastProps {
  message: string
  amount: number
  onClose: () => void
}

export function PointsToast({ message, amount, onClose }: PointsToastProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 300)
    }, 2000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div
      className={`fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold">+{amount} pts</span>
        <span className="text-sm">{message}</span>
      </div>
    </div>
  )
}

let toastState = { message: '', amount: 0 }
let setToastState: ((s: typeof toastState) => void) | null = null

export function usePointsToast() {
  const [toast, setToast] = useState(toastState)

  useEffect(() => {
    setToastState = setToast
    return () => { setToastState = null }
  }, [])

  const showToast = useCallback((message: string, amount: number) => {
    toastState = { message, amount }
    setToastState?.({ message, amount })
  }, [])

  const hideToast = useCallback(() => {
    showToast('', 0)
  }, [showToast])

  return { toast, showToast, hideToast }
}