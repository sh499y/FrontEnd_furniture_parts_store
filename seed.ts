import { CreateInventoryLevelInput, ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createWorkflow,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import {
  createApiKeysWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresStep,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows";
import { ApiKey } from "../../.medusa/types/query-entry-points";

const updateStoreCurrencies = createWorkflow(
  "update-store-currencies",
  (input: {
    supported_currencies: { currency_code: string; is_default?: boolean }[];
    store_id: string;
  }) => {
    const normalizedInput = transform({ input }, (data) => {
      return {
        selector: { id: data.input.store_id },
        update: {
          supported_currencies: data.input.supported_currencies.map(
            (currency) => {
              return {
                currency_code: currency.currency_code,
                is_default: currency.is_default ?? false,
              };
            }
          ),
        },
      };
    });

    const stores = updateStoresStep(normalizedInput);

    return new WorkflowResponse(stores);
  }
);

export default async function seedDemoData({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);
  const storeModuleService = container.resolve(Modules.STORE);

  const countries = ["gb", "de", "dk", "se", "fr", "es", "it", "pl"];

  logger.info("Seeding store data...");
  const [store] = await storeModuleService.listStores();
  let defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
    name: "Default Sales Channel",
  });

  if (!defaultSalesChannel.length) {
    // create the default sales channel
    const { result: salesChannelResult } = await createSalesChannelsWorkflow(
      container
    ).run({
      input: {
        salesChannelsData: [
          {
            name: "Default Sales Channel",
          },
        ],
      },
    });
    defaultSalesChannel = salesChannelResult;
  }

  await updateStoreCurrencies(container).run({
    input: {
      store_id: store.id,
      supported_currencies: [
        {
          currency_code: "pln",
          is_default: true,
        },
      ],
    },
  });

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        default_sales_channel_id: defaultSalesChannel[0].id,
      },
    },
  });
  logger.info("Seeding region data...");
  const { result: regionResult } = await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "Europe",
          currency_code: "pln",
          countries,
          payment_providers: ["pp_system_default"],
        },
      ],
    },
  });
  const region = regionResult[0];
  logger.info("Finished seeding regions.");

  logger.info("Seeding tax regions...");
  await createTaxRegionsWorkflow(container).run({
    input: countries.map((country_code) => ({
      country_code,
      provider_id: "tp_system",
    })),
  });
  logger.info("Finished seeding tax regions.");

  logger.info("Seeding stock location data...");
  const { result: stockLocationResult } = await createStockLocationsWorkflow(
    container
  ).run({
    input: {
      locations: [
        {
          name: "European Warehouse",
          address: {
            city: "Copenhagen",
            country_code: "DK",
            address_1: "",
          },
        },
      ],
    },
  });
  const stockLocation = stockLocationResult[0];

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        default_location_id: stockLocation.id,
      },
    },
  });

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_provider_id: "manual_manual",
    },
  });

  logger.info("Seeding fulfillment data...");
  const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({
    type: "default",
  });
  let shippingProfile = shippingProfiles.length ? shippingProfiles[0] : null;

  if (!shippingProfile) {
    const { result: shippingProfileResult } =
      await createShippingProfilesWorkflow(container).run({
        input: {
          data: [
            {
              name: "Default Shipping Profile",
              type: "default",
            },
          ],
        },
      });
    shippingProfile = shippingProfileResult[0];
  }

  const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
    name: "European Warehouse delivery",
    type: "shipping",
    service_zones: [
      {
        name: "Europe",
        geo_zones: [
          {
            country_code: "pl",
            type: "country",
          },
        ],
      },
    ],
  });

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_set_id: fulfillmentSet.id,
    },
  });

  await createShippingOptionsWorkflow(container).run({
    input: [
      {
        name: "Standard Shipping",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Standard",
          description: "Ship in 2-3 days.",
          code: "standard",
        },
        prices: [
          {
            currency_code: "pln",
            amount: 1500,
          },
          {
            region_id: region.id,
            amount: 1500,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
      {
        name: "Express Shipping",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Express",
          description: "Ship in 24 hours.",
          code: "express",
        },
        prices: [
          {
            currency_code: "pln",
            amount: 2500,
          },
          {
            region_id: region.id,
            amount: 2500,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
    ],
  });
  logger.info("Finished seeding fulfillment data.");

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: {
      id: stockLocation.id,
      add: [defaultSalesChannel[0].id],
    },
  });
  logger.info("Finished seeding stock location data.");

  logger.info("Seeding publishable API key data...");
  let publishableApiKey: ApiKey | null = null;
  const { data } = await query.graph({
    entity: "api_key",
    fields: ["id"],
    filters: {
      type: "publishable",
    },
  });

  publishableApiKey = data?.[0];

  if (!publishableApiKey) {
    const {
      result: [publishableApiKeyResult],
    } = await createApiKeysWorkflow(container).run({
      input: {
        api_keys: [
          {
            title: "Webshop",
            type: "publishable",
            created_by: "",
          },
        ],
      },
    });

    publishableApiKey = publishableApiKeyResult as ApiKey;
  }

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: {
      id: publishableApiKey.id,
      add: [defaultSalesChannel[0].id],
    },
  });
  logger.info("Finished seeding publishable API key data.");

  logger.info("Seeding product data...");

  // Tworzenie kategorii nadrzędnej
  const { result: parentCategoryResult } =
    await createProductCategoriesWorkflow(container).run({
      input: {
        product_categories: [
          {
            name: "Akcesoria meblowe",
            is_active: true,
          },
        ],
      },
    });
  const parentCategory = parentCategoryResult[0];

  // Tworzenie podkategorii
  const { result: categoryResult } = await createProductCategoriesWorkflow(
    container
  ).run({
    input: {
      product_categories: [
        {
          name: "Systemy szuflad / prowadnice",
          parent_category_id: parentCategory.id,
          is_active: true,
        },
        {
          name: "Fronty meblowe MDF / PCV",
          parent_category_id: parentCategory.id,
          is_active: true,
        },
        {
          name: "Uchwyty meblowe",
          parent_category_id: parentCategory.id,
          is_active: true,
        },
        {
          name: "Zawiasy meblowe",
          parent_category_id: parentCategory.id,
          is_active: true,
        },
        {
          name: "Podnośniki",
          parent_category_id: parentCategory.id,
          is_active: true,
        },
        {
          name: "Regulatory poziomu",
          parent_category_id: parentCategory.id,
          is_active: true,
        },
        {
          name: "Stopki regulacyjne",
          parent_category_id: parentCategory.id,
          is_active: true,
        },
        {
          name: "Nogi i nóżki",
          parent_category_id: parentCategory.id,
          is_active: true,
        },
        {
          name: "Systemy drzwi przesuwnych",
          parent_category_id: parentCategory.id,
          is_active: true,
        },
      ],
    },
  });

  await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: "Prowadnica kulkowa 45mm / 350mm",
          category_ids: [
            categoryResult.find(
              (cat) => cat.name === "Systemy szuflad / prowadnice"
            )!.id,
          ],
          description:
            "Prowadnica kulkowa pełnego wysuwu 45mm, długość 350mm. Nośność do 45kg.",
          handle: "prowadnica-kulkowa-45-350",
          weight: 500,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          options: [
            {
              title: "Długość",
              values: ["350mm", "400mm", "500mm"],
            },
          ],
          variants: [
            {
              title: "350mm",
              sku: "PROW-45-350",
              options: { "Długość": "350mm" },
              prices: [
                { amount: 2500, currency_code: "pln" },
              ],
            },
            {
              title: "400mm",
              sku: "PROW-45-400",
              options: { "Długość": "400mm" },
              prices: [
                { amount: 2800, currency_code: "pln" },
              ],
            },
            {
              title: "500mm",
              sku: "PROW-45-500",
              options: { "Długość": "500mm" },
              prices: [
                { amount: 3200, currency_code: "pln" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        {
          title: "Front meblowy MDF lakierowany biały",
          category_ids: [
            categoryResult.find(
              (cat) => cat.name === "Fronty meblowe MDF / PCV"
            )!.id,
          ],
          description:
            "Front meblowy z MDF lakierowany na biało mat. Wymiary na zamówienie.",
          handle: "front-mdf-bialy-mat",
          weight: 2000,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          options: [
            {
              title: "Wymiar",
              values: ["60x40cm", "60x60cm", "60x80cm"],
            },
          ],
          variants: [
            {
              title: "60x40cm",
              sku: "FRONT-MDF-B-6040",
              options: { Wymiar: "60x40cm" },
              prices: [
                { amount: 4500, currency_code: "pln" },
              ],
            },
            {
              title: "60x60cm",
              sku: "FRONT-MDF-B-6060",
              options: { Wymiar: "60x60cm" },
              prices: [
                { amount: 5500, currency_code: "pln" },
              ],
            },
            {
              title: "60x80cm",
              sku: "FRONT-MDF-B-6080",
              options: { Wymiar: "60x80cm" },
              prices: [
                { amount: 6500, currency_code: "pln" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        {
          title: "Uchwyt meblowy stalowy 128mm",
          category_ids: [
            categoryResult.find(
              (cat) => cat.name === "Uchwyty meblowe"
            )!.id,
          ],
          description:
            "Uchwyt meblowy ze stali nierdzewnej, rozstaw 128mm. Wykończenie satynowe.",
          handle: "uchwyt-stalowy-128",
          weight: 150,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          options: [
            {
              title: "Rozstaw",
              values: ["96mm", "128mm", "160mm"],
            },
          ],
          variants: [
            {
              title: "96mm",
              sku: "UCHWYT-ST-96",
              options: { Rozstaw: "96mm" },
              prices: [
                { amount: 800, currency_code: "pln" },
              ],
            },
            {
              title: "128mm",
              sku: "UCHWYT-ST-128",
              options: { Rozstaw: "128mm" },
              prices: [
                { amount: 1000, currency_code: "pln" },
              ],
            },
            {
              title: "160mm",
              sku: "UCHWYT-ST-160",
              options: { Rozstaw: "160mm" },
              prices: [
                { amount: 1200, currency_code: "pln" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        {
          title: "Zawias meblowy 35mm z cichym domykiem",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Zawiasy meblowe")!.id,
          ],
          description:
            "Zawias kubełkowy 35mm z wbudowanym cichym domykiem. Nałożeniowy, do drzwi o grubości 16-19mm.",
          handle: "zawias-35mm-cichy-domyk",
          weight: 200,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          options: [
            {
              title: "Kąt otwarcia",
              values: ["110°", "155°", "170°"],
            },
          ],
          variants: [
            {
              title: "110°",
              sku: "ZAWIAS-35-110",
              options: { "Kąt otwarcia": "110°" },
              prices: [{ amount: 1200, currency_code: "pln" }],
            },
            {
              title: "155°",
              sku: "ZAWIAS-35-155",
              options: { "Kąt otwarcia": "155°" },
              prices: [{ amount: 1800, currency_code: "pln" }],
            },
            {
              title: "170°",
              sku: "ZAWIAS-35-170",
              options: { "Kąt otwarcia": "170°" },
              prices: [{ amount: 2400, currency_code: "pln" }],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        {
          title: "Podnośnik gazowy do klapy górnej",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Podnośniki")!.id,
          ],
          description:
            "Podnośnik gazowy do klap otwieranych do góry. Siłownik z regulacją siły.",
          handle: "podnosnik-gazowy-klapa",
          weight: 350,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          options: [
            {
              title: "Siła",
              values: ["80N", "100N", "120N"],
            },
          ],
          variants: [
            {
              title: "80N",
              sku: "PODN-GAZ-80",
              options: { "Siła": "80N" },
              prices: [{ amount: 3500, currency_code: "pln" }],
            },
            {
              title: "100N",
              sku: "PODN-GAZ-100",
              options: { "Siła": "100N" },
              prices: [{ amount: 4200, currency_code: "pln" }],
            },
            {
              title: "120N",
              sku: "PODN-GAZ-120",
              options: { "Siła": "120N" },
              prices: [{ amount: 4800, currency_code: "pln" }],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        {
          title: "Regulator poziomu M8 meblowy",
          category_ids: [
            categoryResult.find(
              (cat) => cat.name === "Regulatory poziomu"
            )!.id,
          ],
          description:
            "Regulator poziomu z gwintem M8. Regulacja wysokości do 20mm. Plastikowa podstawa.",
          handle: "regulator-poziomu-m8",
          weight: 50,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          options: [
            {
              title: "Gwint",
              values: ["M6", "M8", "M10"],
            },
          ],
          variants: [
            {
              title: "M6",
              sku: "REG-POZ-M6",
              options: { Gwint: "M6" },
              prices: [{ amount: 300, currency_code: "pln" }],
            },
            {
              title: "M8",
              sku: "REG-POZ-M8",
              options: { Gwint: "M8" },
              prices: [{ amount: 400, currency_code: "pln" }],
            },
            {
              title: "M10",
              sku: "REG-POZ-M10",
              options: { Gwint: "M10" },
              prices: [{ amount: 500, currency_code: "pln" }],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        {
          title: "Stopka regulacyjna okrągła 40mm",
          category_ids: [
            categoryResult.find(
              (cat) => cat.name === "Stopki regulacyjne"
            )!.id,
          ],
          description:
            "Stopka regulacyjna z gumową podstawą. Średnica 40mm, regulacja wysokości 15mm.",
          handle: "stopka-regulacyjna-okragla-40",
          weight: 30,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          options: [
            {
              title: "Średnica",
              values: ["30mm", "40mm", "50mm"],
            },
          ],
          variants: [
            {
              title: "30mm",
              sku: "STOP-OKR-30",
              options: { "Średnica": "30mm" },
              prices: [{ amount: 200, currency_code: "pln" }],
            },
            {
              title: "40mm",
              sku: "STOP-OKR-40",
              options: { "Średnica": "40mm" },
              prices: [{ amount: 300, currency_code: "pln" }],
            },
            {
              title: "50mm",
              sku: "STOP-OKR-50",
              options: { "Średnica": "50mm" },
              prices: [{ amount: 400, currency_code: "pln" }],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        {
          title: "Nóżka meblowa drewniana stożkowa",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Nogi i nóżki")!.id,
          ],
          description:
            "Nóżka meblowa z drewna bukowego, kształt stożkowy. Lakierowana, z bolcem montażowym M8.",
          handle: "nozka-drewniana-stozek",
          weight: 250,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          options: [
            {
              title: "Wysokość",
              values: ["10cm", "15cm", "20cm"],
            },
          ],
          variants: [
            {
              title: "10cm",
              sku: "NOGA-DREWN-10",
              options: { "Wysokość": "10cm" },
              prices: [{ amount: 1800, currency_code: "pln" }],
            },
            {
              title: "15cm",
              sku: "NOGA-DREWN-15",
              options: { "Wysokość": "15cm" },
              prices: [{ amount: 2200, currency_code: "pln" }],
            },
            {
              title: "20cm",
              sku: "NOGA-DREWN-20",
              options: { "Wysokość": "20cm" },
              prices: [{ amount: 2600, currency_code: "pln" }],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        {
          title: "System drzwi przesuwnych 2m aluminiowy",
          category_ids: [
            categoryResult.find(
              (cat) => cat.name === "Systemy drzwi przesuwnych"
            )!.id,
          ],
          description:
            "Kompletny system drzwi przesuwnych. Szyna aluminiowa z wózkami jezdnymi i prowadnicą dolną.",
          handle: "system-drzwi-przesuwnych-alu",
          weight: 3000,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          options: [
            {
              title: "Długość szyny",
              values: ["150cm", "200cm", "300cm"],
            },
          ],
          variants: [
            {
              title: "150cm",
              sku: "DRZWI-ALU-150",
              options: { "Długość szyny": "150cm" },
              prices: [{ amount: 18900, currency_code: "pln" }],
            },
            {
              title: "200cm",
              sku: "DRZWI-ALU-200",
              options: { "Długość szyny": "200cm" },
              prices: [{ amount: 24900, currency_code: "pln" }],
            },
            {
              title: "300cm",
              sku: "DRZWI-ALU-300",
              options: { "Długość szyny": "300cm" },
              prices: [{ amount: 34900, currency_code: "pln" }],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
      ],
    },
  });
  logger.info("Finished seeding product data.");

  logger.info("Seeding inventory levels.");

  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id"],
  });

  const inventoryLevels: CreateInventoryLevelInput[] = [];
  for (const inventoryItem of inventoryItems) {
    const inventoryLevel = {
      location_id: stockLocation.id,
      stocked_quantity: 1000000,
      inventory_item_id: inventoryItem.id,
    };
    inventoryLevels.push(inventoryLevel);
  }

  await createInventoryLevelsWorkflow(container).run({
    input: {
      inventory_levels: inventoryLevels,
    },
  });

  logger.info("Finished seeding inventory levels data.");
}
