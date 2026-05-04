import React from "react"

const Hero: React.FC = () => {
  return (
    <section className="min-h-screen bg-[#f0efed] flex items-center justify-center px-6 py-20">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left - Content */}
        <div className="flex flex-col gap-6">
          <span className="inline-block w-fit px-3 py-1.5 border border-black text-[11px] font-semibold tracking-[0.15em] uppercase">
            Premium Akcesoria Meblowe
          </span>

          <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-bold leading-[1.1] tracking-tight text-black">
            Akcesoria meblowe
            <br />
            szerokie zaplecze
            <br />
            produktowe
          </h1>

          <p className="text-[#6b6b6b] text-base leading-relaxed max-w-md">
            Wszystko w jednym miejscu. Hurtownia AMMW w Skórzewie obsługuje
            zarówno firmy, jak i klientów indywidualnych z regionu Poznania.
          </p>

          <a
            href="#oferta"
            className="inline-flex items-center gap-2.5 w-fit px-7 py-3.5 bg-black text-white text-sm font-medium rounded-sm hover:bg-neutral-800 transition-colors"
          >
            Oferta
            <span className="material-icons">arrow_forward</span>
          </a>

          <div className="flex items-center gap-2 mt-2 text-[#888] text-sm">
            <span>5,000+ Produkktów</span>
          </div>
        </div>

        {/* Right - Image */}
        <div className="relative">
          <div className="rounded-xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.12)]">
            <img
              src="/images/hero-kitchen.jpg"
              alt="Nowoczesna kuchnia z akcesoriami meblowymi AMMW"
              className="w-full h-[350px] md:h-[420px] object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero