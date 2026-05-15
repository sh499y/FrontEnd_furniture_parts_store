"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function SearchBar() {
  const [query, setQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/results/${encodeURIComponent(query.trim())}`)
      setQuery("")
    }
  }

  return (
    <form onSubmit={handleSearch} className="hidden lg:flex items-center relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Szukaj produktów..."
        className="w-[400px] h-9 pl-9 pr-3 text-sm border border-[#ddd] rounded-full bg-[#f9f9f9] text-black placeholder-[#999] focus:outline-none focus:border-black transition-colors"
      />
      <span className="material-icons text-[18px] text-[#999] absolute left-3">
        search
      </span>
    </form>
  )
}