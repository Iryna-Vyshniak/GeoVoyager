import { Mesh } from "three";

export type Place = {
    location: string;
    name: string;
    coordinates: [number, number]; // Latitude, Longitude
    description: string;
    image: string;
}

export type EarthProps = {
    selectedPlace?: Place | null;
}

export type TouristMarkerProps = {
    position: readonly [number, number, number]; // Ensures position is a 3D vector
    place: Place;
    planetRef: React.RefObject<Mesh>;
}

export type SelectedPlaceMarkerProps = {
    selectedPlace: Place;
    isVisible: boolean;
    setOccluded: (occluded: boolean) => void;
}

export type City = {
    /**
     * Оригінальна назва міста (локальною мовою)
     * Наприклад: "東京" (Tokyo)
     */
    city: string;

    /**
     * Назва міста латинськими літерами (ASCII)
     * Наприклад: "Tokyo", "Kyiv"
     */
    city_ascii: string;

    /**
     * Географічна широта міста (latitude)
     */
    lat: number;

    /**
     * Географічна довгота міста (longitude)
     */
    lng: number;

    /**
     * Назва країни, де знаходиться місто
     * Наприклад: "Ukraine", "Japan", "France"
     */
    country: string;

    /**
     * Двобуквений код країни (ISO 3166-1 alpha-2)
     * Наприклад: "UA" (Україна), "JP" (Японія), "FR" (Франція)
     * Може бути `null`, якщо дані відсутні
     */
    iso2: string | null;

    /**
     * Трибуквений код країни (ISO 3166-1 alpha-3)
     * Наприклад: "UKR" (Україна), "JPN" (Японія), "FRA" (Франція)
     * Може бути `null`, якщо дані відсутні
     */
    iso3: string | null;

    /**
     * Адміністративний регіон, до якого належить місто
     * Наприклад: "Kyiv City" (Київ), "California" (Лос-Анджелес)
     */
    admin_name: string;

    /**
     * Тип статусу міста:
     * - "primary" – головна столиця країни (наприклад, Київ для України)
     * - "admin" – столиця адміністративного регіону (наприклад, Мілан у Ломбардії)
     * - "minor" – менший адміністративний центр
     * - `null` – не має статусу столиці або адміністративного центру
     */
    capital: "primary" | "admin" | "minor" | null;

    /**
     * Населення міста (якщо відоме)
     * Може бути `null`, якщо дані відсутні
     * Наприклад: 37732000 (Токіо), 2888700 (Київ)
     */
    population: number | null;

    /**
     * Унікальний ідентифікатор міста у базі даних
     * Використовується для внутрішніх запитів та API
     */
    id: number;
};

