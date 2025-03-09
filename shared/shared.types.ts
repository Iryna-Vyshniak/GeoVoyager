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
    position: [number, number, number]; // Ensures position is a 3D vector
    place: Place;
    planetRef: React.RefObject<Mesh>;
}

export type SelectedPlaceMarkerProps = {
    selectedPlace: Place;
    isVisible: boolean;
    setOccluded: (occluded: boolean) => void;
}