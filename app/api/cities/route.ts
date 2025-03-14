import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { City } from "@/shared/shared.types";

let cachedCities: City[] | null = null;

export async function GET() {
  if (!cachedCities) {
    console.log("📂 Завантаження JSON у кеш...");
    const filePath = path.join(process.cwd(), "shared", "mock", "worldcities.json");
    const fileBuffer = await fs.readFile(filePath, "utf-8");
    const allCities: City[] = JSON.parse(fileBuffer);

    // Список великих країн
    const largestCountries = new Set([
      "China", "India", "United States", "Indonesia", "Pakistan",
      "Brazil", "Nigeria", "Bangladesh", "Mexico", "Japan",
      "Ethiopia", "Philippines", "Egypt", "Vietnam", "Turkey",
      "Iran", "Germany", "France", "United Kingdom", "Italy",
      "South Africa", "Thailand", "South Korea", "Colombia",
      "Argentina", "Algeria", "Ukraine", "Sudan", "Uganda",
      "Iraq", "Canada", "Poland", "Morocco", "Saudi Arabia",
      "Peru", "Malaysia", "Venezuela", "New Zealand", "Ghana",
      "Nepal", "Yemen", "Mozambique", "Ivory Coast", "Madagascar",
      "Australia", "North Korea", "Cameroon",
    ]);

    // Групуємо міста за країнами
    const citiesByCountry = allCities.reduce((acc, city) => {
      if (!acc[city.country]) {
        acc[city.country] = [];
      }
      acc[city.country].push(city);
      return acc;
    }, {} as Record<string, City[]>);

    const filteredCities: City[] = [];

    // Обробляємо кожну країну
    Object.entries(citiesByCountry).forEach(([country, countryCities]) => {
      if (!largestCountries.has(country)) return; // Пропускаємо країни, які не в largestCountries

      // Знаходимо столицю
      const capital = countryCities.find((city) => city.capital === "primary");
      const nonCapitalCities = countryCities.filter((city) => city.capital !== "primary");

      // Сортуємо за населенням (від більшого до меншого)
      const sortedNonCapitals = nonCapitalCities.sort((a, b) => {
        const popA = a.population ?? 0;
        const popB = b.population ?? 0;
        return popB - popA;
      });

      if (country === "China") {
        // Для Китаю: столиця + 1 місто
        if (capital) filteredCities.push(capital);
        if (sortedNonCapitals.length > 0) filteredCities.push(sortedNonCapitals[0]); // Додаємо 1 місто з найбільшим населенням
      } else if (country === "United States") {
        // Для США: столиця + міста з населенням > 3 млн
        if (capital) filteredCities.push(capital);
        const largeUSCities = sortedNonCapitals.filter((city) => (city.population ?? 0) > 3_000_000);
        filteredCities.push(...largeUSCities);
      } else {
        // Для інших великих країн: столиця + міста > 5 млн
        if (capital) filteredCities.push(capital);
        const largeCities = sortedNonCapitals.filter((city) => (city.population ?? 0) > 5_000_000);
        filteredCities.push(...largeCities);
      }
    });

    // Видаляємо дублікати за id
    const uniqueCities: City[] = Array.from(
      new Map(filteredCities.map((city): [number, City] => [city.id, city])).values()
    );

    cachedCities = uniqueCities;
  }

  return NextResponse.json(cachedCities);
}