import { ILocation } from "../modules/driver/driver.interface";

const toRad = (value: number) => (value * Math.PI) / 180;

const calculateDistanceKm = (start: ILocation, end: ILocation): number => {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(end.lat - start.lat);
  const dLon = toRad(end.lang - start.lang);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(start.lat)) *
      Math.cos(toRad(end.lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // distance in km
};

//! 1 Km -> 15 Min
//! 1 Km -> 20 Taka

export const calculateRideDetails = (start: ILocation, end: ILocation) => {
  const distance = calculateDistanceKm(start, end);
  const duration = distance * 15; // minutes
  const fare = distance * 20; // Taka
  return { distance, duration, fare };
};
