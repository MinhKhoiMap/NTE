import { createContext } from "react";

export const initialViewState = createContext({
  lng: -74.5,
  lat: 40,
  zoom: 1.2,
});
