import React from "react"

const Features: React.FC = () => {
  return (
    <section className="w-full border-y py-6 px-6">


      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-stretch justify-between gap-6 md:gap-8 pt-5">
        <div className="flex max-w-xs  items-start gap-3">
          <span className="material-icons text-2xl text-black mt-0.5">
            local_shipping
          </span>
          <div>
            <h3 className="text-sm font-semibold text-black">Szybka Dostawa</h3>
            <p className="text-xs text-[#888] leading-relaxed mt-0.5 max-w-[180px]">
              Zamówienia wysyłane w ciągu 24 godzin.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <span className="material-icons text-2xl text-black mt-0.5">
            verified
          </span>
          <div>
            <h3 className="text-sm font-semibold text-black">
              Jakość Gwarantowana
            </h3>
            <p className="text-xs text-[#888] leading-relaxed mt-0.5 max-w-[180px]">
              Wszystkie produkty pochodzą od wiodących europejskich producentów.
            </p>
          </div>
        </div>

        <div className="flex max-w-xs items-start gap-3">
          <span className="material-icons text-2xl text-black mt-0.5">
            support_agent
          </span>
          <div>
            <h3 className="text-sm font-semibold text-black">
              Profesjonalne doradztwo
            </h3>
            <p className="text-xs text-[#888] leading-relaxed mt-0.5 max-w-[180px]">
              Nasi specjaliści pomogą Państwu w doborze odpowiednich
              komponentów.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Features
