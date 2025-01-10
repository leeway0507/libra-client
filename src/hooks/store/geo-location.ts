import { create } from "zustand";
import { persist } from "zustand/middleware";

export type LibLocation = { latitude: number; longitude: number };

export interface LibState {
	userLocation: LibLocation;
	error: string;
	requestLocation: () => void;
}

const useGeoStore = create<LibState>()(
	persist(
		(set) => ({
			userLocation: { latitude: 0, longitude: 0 },
			error: "",
			requestLocation: () => {
				if (!navigator.geolocation) {
					set(() => ({
						error: "Geolocation is not supported by your browser",
					}));
					return;
				}
				navigator.geolocation.getCurrentPosition(
					(position) => {
						set(() => ({
							userLocation: {
								latitude: position.coords.latitude,
								longitude: position.coords.longitude,
							},
							error: "",
						}));
					},
					(err) => {
						set(() => ({
							error: err.message,
						}));
					}
				);
			},
		}),
		{
			name: "geo",
		}
	)
);

export default useGeoStore;
