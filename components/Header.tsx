'use client'

import { signOut } from 'next-auth/react'
import Link from 'next/link'

export function Header() {
  return (
    <header className="bg-green-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/dashboard" className="text-xl font-bold">
          Reserva Florestal
        </Link>
        <nav className="flex gap-4 items-center">
          <Link href="/dashboard" className="hover:text-green-200">
            Dashboard
          </Link>
          <Link href="/forest" className="hover:text-green-200">
            Minha Floresta
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="bg-green-700 px-4 py-2 rounded hover:bg-green-600"
          >
            Sair
          </button>
        </nav>
      </div>
    </header>
  )
}