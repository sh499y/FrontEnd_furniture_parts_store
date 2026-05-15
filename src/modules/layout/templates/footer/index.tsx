import { listCategories } from "@lib/data/categories"
import { Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default async function Footer() {
  const productCategories = await listCategories()

  return (
    <footer className="bg-black text-white w-full">
      <div className="content-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo + opis */}
          <div className="flex flex-col gap-4">
            <LocalizedClientLink href="/" className="flex items-center gap-2">
              <img
                src="/AMMV_logo.svg"
                alt="AMMW Logo"
                className="h-[40px] w-auto brightness-0 invert"
              />
              <span className="text-[10px] uppercase tracking-[0.15em] text-[#888] font-medium leading-tight border-l border-[#555] pl-2 ml-1">
                Akcesoria
                <br />
                Meblowe
              </span>
            </LocalizedClientLink>
            <p className="text-sm text-[#aaa] leading-relaxed mt-2">
              Hurtownia akcesoriów meblowych w Skórzewie. Obsługujemy firmy i
              klientów indywidualnych z regionu Poznania.
            </p>
          </div>

          {/* Kategorie */}
          {productCategories && productCategories.length > 0 && (
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide">
                Kategorie
              </h3>
              <ul className="flex flex-col gap-2">
                {productCategories.slice(0, 6).map((c) => {
                  if (c.parent_category) return null
                  return (
                    <li key={c.id}>
                      <LocalizedClientLink
                        href={`/categories/${c.handle}`}
                        className="text-sm text-[#aaa] hover:text-white transition-colors"
                      >
                        {c.name}
                      </LocalizedClientLink>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

          {/* Nawigacja */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide">
              Nawigacja
            </h3>
            <ul className="flex flex-col gap-2">
              <li>
                <LocalizedClientLink
                  href="/store"
                  className="text-sm text-[#aaa] hover:text-white transition-colors"
                >
                  Sklep
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  href="/producenci"
                  className="text-sm text-[#aaa] hover:text-white transition-colors"
                >
                  Producenci
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  href="/o-nas"
                  className="text-sm text-[#aaa] hover:text-white transition-colors"
                >
                  O nas
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  href="/kontakt"
                  className="text-sm text-[#aaa] hover:text-white transition-colors"
                >
                  Kontakt
                </LocalizedClientLink>
              </li>
            </ul>
          </div>

          {/* Kontakt */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide">
              Kontakt
            </h3>
            <ul className="flex flex-col gap-2 text-sm text-[#aaa]">
              <li className="flex items-center gap-2">
                <span className="material-icons text-[16px]">location_on</span>
                Kolejowa 24a, 60-185 Skórzewo
              </li>
              <li>
                <a
                  href="tel:+48696355257"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <span className="material-icons text-[16px]">phone</span>
                  696 355 257
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-icons text-[16px]">schedule</span>
                Pn–Pt: 08:00–16:00
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#333] mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <Text className="text-xs text-white">
            © {new Date().getFullYear()} AMMW. Wszelkie prawa zastrzeżone.
          </Text>
          <Text className="text-xs text-white">
            Hurtownia okuć meblowych AMMW Mariusz Woźniak
          </Text>
        </div>
      </div>
    </footer>
  )
}