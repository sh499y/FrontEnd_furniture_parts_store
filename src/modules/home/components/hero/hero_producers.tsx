"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

const logos = [
  { src: "/logos/company1.png", alt: "Producent 1" },
  { src: "/logos/company2.png", alt: "Producent 2" },
  { src: "/logos/company3.png", alt: "Producent 3" },
  { src: "/logos/company4.png", alt: "Producent 4" },
  { src: "/logos/company5.png", alt: "Producent 5" },
  { src: "/logos/company6.png", alt: "Producent 6" },
]

export default function Hero_producers() {
  return (
    <section className="w-full py-12 px-6">
      <h2 className="text-2xl font-semibold text-center mb-6">
        Nasi producenci
      </h2>
      <div className="max-w-6xl mx-auto overflow-hidden relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10" />

        {/* Scrolling track */}
        <div className="flex animate-scroll gap-12 items-center w-max hover:[animation-play-state:paused]">
          {[...logos, ...logos].map((logo, i) => (
            <div
              key={i}
              className="flex-shrink-0 h-16 w-32 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          ))}
        </div>
        <div className="text-center mt-8 mb-6">
          <LocalizedClientLink
            href="/producenci"
            className="inline-flex items-center gap-2 px-6 py-2.5 border border-black rounded-full text-sm font-medium text-black hover:bg-black hover:text-white transition-colors duration-200"
          >
            Zobacz wszystkich producentów
            <span className="material-icons text-[16px]">arrow_forward</span>
          </LocalizedClientLink>
        </div>
      </div>
    </section>
  )
}