import React from "react"

const HeroAbout: React.FC = () => {
  return (
    <section className="w-full py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
        {/* Zdjęcie */}
        <div className="w-full md:w-1/2">
          <div className="aspect-[4/3] bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="material-icons text-6xl text-gray-400">
              image
            </span>
          </div>
        </div>

        {/* Tekst */}
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">O nas</h2>

          <p className="text-sm text-black leading-relaxed">
            W naszej ofercie znajdują się fronty meblowe wykonane z różnych
            materiałów, takich jak MDF, akryl czy PCV. Oferujemy szeroki wybór
            kolorów i wykończeń frontów meblowych MDF PCV, co pozwala na
            dopasowanie ich do każdego stylu wnętrza. Nasze fronty
            charakteryzują się wysoką jakością i estetyką, co czyni je idealnym
            rozwiązaniem dla każdego projektu meblowego.
          </p>

          <p className="text-sm text-[#555] leading-relaxed">
            Nasza hurtownia oferuje różnorodne prowadnice do szuflad, w tym
            modele kulkowe i rolkowe, które zapewniają płynne otwieranie i
            zamykanie. Dzięki wysokiej jakości materiałom i solidnej konstrukcji
            nasze prowadnice są trwałe i niezawodne. Idealnie sprawdzają się w
            meblach kuchennych, biurowych oraz innych przestrzeniach.
          </p>

          <p className="text-sm text-[#555] leading-relaxed">
            Oferujemy także kompleksowe rozwiązania w zakresie systemów do drzwi
            przesuwnych. Nasze produkty są łatwe w montażu, a ich nowoczesny
            design sprawia, że doskonale wpasują się w każde wnętrze. Dzięki
            różnorodnym opcjom Klienci mogą wybierać spośród systemów
            dostosowanych do ich indywidualnych potrzeb i preferencji.
          </p>
        </div>
      </div>
    </section>
  )
}

export default HeroAbout