import { createContext } from "react";

export const initialViewState = createContext({
  longitude: -74.5,
  latitude: 40,
  zoom: 1.2,
});
