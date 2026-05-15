import React from "react"

const Hero_contact: React.FC = () => {
  return (
    <section className="w-full bg-black text-white py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <span className="inline-block w-fit px-3 py-1.5 border border-white text-[11px] font-semibold tracking-[0.15em] uppercase mb-6">
          Kontakt
        </span>

        <h2 className="text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight mb-12">
          Odwiedź nas
          <br />
          w Skórzewie
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Lewa - Mapa */}
          <div className="rounded-xl overflow-hidden shadow-[0_8px_40px_rgba(255,255,255,0.06)]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2435.0767349869443!2d16.793568076905515!3d52.38715924605584!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4704450692095611%3A0x55966cfa379145e4!2sHurtownia%20oku%C4%87%20meblowych%20AMMW%20Mariusz%20Wo%C5%BAniak!5e0!3m2!1spl!2spl!4v1778842903311!5m2!1spl!2spl"
              width="100%"
              height="420"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Prawa - Dane kontaktowe */}
          <div className="flex flex-col gap-8">
            {/* Adres */}
            <div className="flex items-start gap-4">
              <span className="material-icons text-2xl mt-0.5">location_on</span>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide mb-1">
                  Adres
                </h3>
                <p className="text-[#aaa] text-sm leading-relaxed">
                  Kolejowa 24a, 60-185 Skórzewo
                </p>
              </div>
            </div>

            {/* Telefon */}
            <div className="flex items-start gap-4">
              <span className="material-icons text-2xl mt-0.5">phone</span>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide mb-1">
                  Telefon
                </h3>
                <a
                  href="tel:+48696355257"
                  className="text-[#aaa] text-sm hover:text-white transition-colors"
                >
                  696 355 257
                </a>
              </div>
            </div>

            {/* Godziny otwarcia */}
            <div className="flex items-start gap-4">
              <span className="material-icons text-2xl mt-0.5">schedule</span>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide mb-3">
                  Godziny otwarcia
                </h3>
                <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 text-sm">
                  <span className="text-white">Poniedziałek</span>
                  <span className="text-[#aaa]">08:00–16:00</span>
                  <span className="text-white">Wtorek</span>
                  <span className="text-[#aaa]">08:00–16:00</span>
                  <span className="text-white">Środa</span>
                  <span className="text-[#aaa]">08:00–16:00</span>
                  <span className="text-white">Czwartek</span>
                  <span className="text-[#aaa]">08:00–16:00</span>
                  <span className="text-white">Piątek</span>
                  <span className="text-[#aaa]">08:00–16:00</span>
                  <span className="text-white">Sobota</span>
                  <span className="text-[#aaa]">Zamknięte</span>
                  <span className="text-white">Niedziela</span>
                  <span className="text-[#aaa]">Zamknięte</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero_contact