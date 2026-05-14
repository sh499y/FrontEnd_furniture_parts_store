"use client"

import { useRef } from "react"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { getProductPrice } from "@lib/util/get-product-price"

export default function HeroPopular({
  products,
}: {
  products: HttpTypes.StoreProduct[]
}) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      const scrollAmount = 300

      if (direction === "right" && scrollLeft + clientWidth >= scrollWidth - 10) {
        scrollRef.current.scrollTo({ left: 0, behavior: "smooth" })
      } else if (direction === "left" && scrollLeft <= 10) {
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
    <section className="w-full py-8 px-6 bg-black text-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Popularne produkty
        </h2>
        <div className="relative">
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black text-white shadow-md rounded-full w-10 h-10 flex items-center justify-center hover:bg-neutral-800 transition-colors ml-2"
          >
            <span className="material-icons">chevron_left</span>
          </button>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto no-scrollbar px-12 snap-x snap-mandatory"
          >
            {products.map((product) => (
              <LocalizedClientLink
                key={product.id}
                href={`/products/${product.handle}`}
                className="group flex-shrink-0 w-[calc(50%-8px)] md:w-[200px] snap-start"
              >
                <div className="relative">
                  <Thumbnail
                    thumbnail={product.thumbnail}
                    images={product.images}
                    size="full"
                  />
                  <span className="absolute top-2 right-2 text-[10px] bg-black text-white px-1.5 py-0.5 rounded">
                    Bestseller
                  </span>
                </div>

                <div className="mt-2 text-center">
                  <h3 className="text-sm text-ui-fg-subtle group-hover:underline text-white">
                    {product.title}
                  </h3>
                  {(() => {
                    const { cheapestPrice } = getProductPrice({ product })
                    return cheapestPrice ? (
                      <p className="text-sm font-semibold mt-1 text-white">
                        {cheapestPrice.calculated_price}
                      </p>
                    ) : null
                  })()}
                </div>
              </LocalizedClientLink>
            ))}
          </div>

          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black text-white shadow-md rounded-full w-10 h-10 flex items-center justify-center hover:bg-neutral-800 transition-colors mr-2"
          >
            <span className="material-icons">chevron_right</span>
          </button>
        </div>
      </div>
    </section>
  )
}