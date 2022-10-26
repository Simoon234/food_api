import fetch from "node-fetch";

interface Location {
  city: string;
  address: string;
}

export const locationHandler = async (obj: Location) => {
  try {
    const location = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&city=${
        obj.city
      }&street=${encodeURIComponent(obj.address)}`
    );
    console.log(location);
    const geoData = await location.json();

    const lat: string = geoData[0].lat;
    const lon: string = geoData[0].lon;


    return {
      lat,
      lon
    };
  } catch (e) {
    console.log(e);
  }
};
