


export type Place = {
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
}

export type SelectedPlaceMarkerProps = {
    selectedPlace: Place;
    isVisible: boolean;
    setOccluded: (occluded: boolean) => void;
}