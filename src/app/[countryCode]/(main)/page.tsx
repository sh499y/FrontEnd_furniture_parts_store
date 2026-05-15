import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
//import category for section
import { getCategoryByHandle } from "@lib/data/categories"
import { listProducts } from "@lib/data/products"

//Componenty Hero
import Hero from "@modules/home/components/hero"
import Hero_fetures from "@modules/home/components/hero/hero_fetures"
import Hero_categories from "@modules/home/components/hero/hero_categories"
import HeroPopular from "@modules/home/components/hero/hero_popular"
import Hero_about from "@modules/home/components/hero/hero_about"
import Hero_interiors from "@modules/home/components/hero/hero_interiors"

import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import HeroAbout from "@modules/home/components/hero/hero_about"
import Hero_producers from "@modules/home/components/hero/hero_producers"
import Hero_contact from "@modules/home/components/hero/hero_contact"

export const metadata: Metadata = {
  title: "AMMW - Akcesoria Meblowe | Hurtownia w Skórzewie",
  description:
    "Hurtownia akcesoriów meblowych AMMW w Skórzewie. Zawiasy, prowadnice, uchwyty, nóżki i więcej od wiodących europejskich producentów.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  const { response } = await listProducts({
    countryCode,
    queryParams: { limit: 20 },
  })
  if (!collections || !region) {
    return null
  }


  const category = await getCategoryByHandle(["akcesoria-meblowe"])
  const subcategories = category?.category_children ?? []

  return (
    <>
      <Hero />
      <Hero_fetures />
      <Hero_categories categories={subcategories} />
      <HeroPopular products={response.products} />
      <HeroAbout />
      <Hero_interiors />
      <Hero_producers />
      <Hero_contact />
      <div className="w-full bg-black">
        <div className="max-w-6xl mx-auto border-t border-white" />
      </div>
    </>
  )
}
