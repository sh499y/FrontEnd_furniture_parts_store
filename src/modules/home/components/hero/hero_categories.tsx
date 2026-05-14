"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { useRef } from "react"

export default function HeroCategories({
  categories,
}: {
  categories: HttpTypes.StoreProductCategory[]
}) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      const scrollAmount = 300


      //Prawa Granica
      if (
        direction === "right" &&
        scrollLeft + clientWidth >= scrollWidth - 10
      ) {
        // Koniec → wróć na początek
        scrollRef.current.scrollTo({ left: 0, behavior: "smooth" })
      } else if (direction === "left" && scrollLeft <= 10) {
        // Początek → skocz na koniec
        scrollRef.current.scrollTo({ left: scrollWidth, behavior: "smooth" })
      } else {
        scrollRef.current.scrollBy({
          left: direction === "left" ? -scrollAmount : scrollAmount,
          behavior: "smooth",
        })
      }
    }
  }

  return (
    <section className="w-full py-8 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold text-center mb-6">Kategorie</h2>
        <div className="relative">
          {/* Strzałka lewa */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black text-white col-w shadow-md rounded-full w-10 h-10 flex items-center justify-center hover:bg-neutral-800 transition-colors"
          >
            <span className="material-icons">chevron_left</span>
          </button>

          {/* Karuzela */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto no-scrollbar px-12 snap-x snap-mandatory"
          >
            {categories.map((c) => (
              <LocalizedClientLink
                key={c.id}
                href={`/categories/${c.handle}`}
                className="group flex-shrink-0 w-[200px] border rounded-lg overflow-hidden hover:shadow-md transition-shadow snap-start"
              >
                <div className="aspect-square bg-gray-100 flex items-center justify-center relative">
                  <span className="absolute top-2 right-2 text-[10px] bg-black text-white px-1.5 py-0.5 rounded">
                    {c.products?.length ?? 0} produkty
                  </span>
                  <span className="material-icons text-4xl text-gray-400">
                    category
                  </span>
                </div>
                <div className="p-3 text-center">
                  <h3 className="text-sm font-semibold text-black group-hover:underline">
                    {c.name}
                  </h3>
                </div>
              </LocalizedClientLink>
            ))}
          </div>

          {/* Strzałka prawa */}
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black text-white shadow-md rounded-full w-10 h-10 flex items-center justify-center hover:bg-neutral-800 transition-colors"
          >
            <span className="material-icons">chevron_right</span>
          </button>
        </div>
      </div>
    </section>
  )
}