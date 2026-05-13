import { Suspense } from "react"

import { listRegions } from "@lib/data/regions"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"

const navLinks = [
  { name: "Sklep", href: "/store" },
  { name: "Kategorie", href: "/categories" },
  { name: "O nas", href: "/o-nas" },
  { name: "Kontakt", href: "/kontakt" },
]

export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
  ])

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative h-16 mx-auto border-b duration-200 bg-white border-ui-border-base">
        <nav className="content-container flex items-center justify-between w-full h-full">
          {/* Left - Logo + Mobile Menu */}
          <div className="flex items-center gap-4 flex-1 basis-0">
            <div className="lg:hidden h-full flex items-center">
              <SideMenu regions={regions} locales={locales} currentLocale={currentLocale} />
            </div>
            <LocalizedClientLink
              href="/"
              className="flex items-center gap-2"
              data-testid="nav-store-link"
            >
              <span className="text-xl font-bold tracking-tight text-black">
                AMMW
              </span>
              <span className="hidden sm:inline text-[10px] uppercase tracking-[0.15em] text-[#888] font-medium leading-tight border-l border-[#ddd] pl-2 ml-1">
                Akcesoria<br />Meblowe
              </span>
            </LocalizedClientLink>
          </div>

          {/* Center - Navigation Links */}
          <div className="hidden lg:flex items-center gap-8 h-full">
            {navLinks.map((link) => (
              <LocalizedClientLink
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-[#555] hover:text-black transition-colors relative py-1"
              >
                {link.name}
              </LocalizedClientLink>
            ))}
          </div>

          {/* Right - Actions */}
          <div className="flex items-center gap-5 flex-1 basis-0 justify-end">
            <LocalizedClientLink
              href="/store"
              className="hidden sm:flex text-[#555] hover:text-black transition-colors"
              aria-label="Szukaj"
            >
              <span className="material-icons text-[22px]">search</span>
            </LocalizedClientLink>

            <LocalizedClientLink
              className="hidden sm:flex text-[#555] hover:text-black transition-colors"
              href="/account"
              data-testid="nav-account-link"
              aria-label="Konto"
            >
              <span className="material-icons text-[22px]">person_outline</span>
            </LocalizedClientLink>

            <Suspense
              fallback={
                <LocalizedClientLink
                  className="text-[#555] hover:text-black flex items-center gap-1 transition-colors"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  <span className="material-icons text-[22px]">shopping_bag</span>
                  <span className="text-xs font-medium">0</span>
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}
