'use client'

interface CO2CounterProps {
  value: number
}

export function CO2Counter({ value }: CO2CounterProps) {
  return (
    <div className="bg-white/90 rounded-lg p-4 shadow" title="Estimativa simbólica baseada na absorção média de cada espécie">
      <p className="text-sm text-gray-600">🌿 Pegada de CO₂</p>
      <p className="text-2xl font-bold text-green-700">{value.toFixed(1)} kg/ano</p>
    </div>
  )
}