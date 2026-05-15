import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Producenci | AMMW",
  description: "Nasi producenci akcesoriów meblowych",
}

const producers = [
  { name: "Producent 1", logo: "/logos/company1.png" },
  { name: "Producent 2", logo: "/logos/company2.png" },
  { name: "Producent 3", logo: "/logos/company3.png" },
  { name: "Producent 4", logo: "/logos/company4.png" },
  { name: "Producent 5", logo: "/logos/company5.png" },
  { name: "Producent 6", logo: "/logos/company6.png" },
]

export default function ProducenciPage() {
  return (
    <div className="content-container py-12">
      <h1 className="text-2xl font-semibold text-center mb-8">
        Nasi producenci
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {producers.map((p) => (
          <div
            key={p.name}
            className="border rounded-lg p-6 flex flex-col items-center gap-4 hover:shadow-md transition-shadow"
          >
            <div className="h-20 w-full flex items-center justify-center">
              <img
                src={p.logo}
                alt={p.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <h3 className="text-sm font-semibold text-center">{p.name}</h3>
          </div>
        ))}
      </div>
    </div>
  )
}
