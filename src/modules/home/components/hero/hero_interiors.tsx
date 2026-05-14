"use client"

import { useState } from "react"

const images = [
  "https://images.unsplash.com/photo-1719368472026-dc26f70a9b76?q=80&h=800&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1649265825072-f7dd6942baed?q=80&h=800&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1555212697-194d092e3b8f?q=80&h=800&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1729086046027-09979ade13fd?q=80&h=800&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1601568494843-772eb04aca5d?q=80&h=800&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1585687501004-615dfdfde7f1?q=80&h=800&w=800&auto=format&fit=crop",
]

export default function Hero_interiors() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  return (
    <section className="w-full py-12 px-6">
      <h2 className="text-2xl font-semibold text-center mb-6">
        Przykładowe projekty wnętrz
      </h2>
      <p className="text-sm text-[#555] leading-relaxed text-center mb-6">
        Nasze części i komponenty znajdują zastosowanie w nowoczesnych
        realizacjach wnętrz. Od mieszkań i domów, po biura oraz lokale użytkowe.
      </p>
      <div className="flex items-center gap-2 h-[400px] w-full max-w-6xl mt-10 mx-auto">
        {images.map((src, i) => (
          <div
            key={i}
            onClick={() => setActiveIndex(activeIndex === i ? null : i)}
            className={`relative group flex-grow rounded-lg overflow-hidden h-[400px] transition-all duration-500 cursor-pointer w-56 md:hover:w-full ${
              activeIndex === i
                ? "!w-full"
                : activeIndex !== null
                ? "!w-10 md:!w-auto"
                : ""
            }`}
          >
            <img
              className="h-full w-full object-cover object-center"
              src={src}
              alt={`Interior ${i + 1}`}
            />
          </div>
        ))}
      </div>
    </section>
  )
}