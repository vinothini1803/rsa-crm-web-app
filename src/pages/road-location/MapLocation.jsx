import React, { useState, useEffect } from "react";
import GoogleMapReact from "google-map-react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { GoogleMapAPIKey, StartLocation } from "../../utills/imgConstants";
const Marker = ({ lat, lng, icon }) => (
  <div lat={lat} lang={lng}>
    <img src={icon} />
  </div>
);
const MapLocation = ({location}) => {
  
  const [address, setAddress] = useState("");

  useEffect(() => {
    const geocodeLocation = async () => {
      try {
        const results = await getGeocode({ location });
        if (results && results?.length > 0) {
          setAddress(results[0]?.formatted_address);
        } else {
          setAddress("Address not found");
        }
      } catch (error) {
        console.error("Error fetching geocode:", error);
        setAddress("Error fetching address");
      }
    };

    if (location?.lat && location?.lng) {
      geocodeLocation();
    }
  }, [location])


  return (
    <div className="map-wrap">
      <div className="map-view">
        <GoogleMapReact
          defaultCenter={location}
          center={location}
          defaultZoom={11}
          bootstrapURLKeys={{
            key: GoogleMapAPIKey,
          }}
          yesIWantToUseGoogleMapApiInternals
        >
          <Marker
            lat={location?.lat}
            lng={location?.lng}
            icon={StartLocation}
            // key={i}
          />
        </GoogleMapReact>
      </div>
      <div className="color-grey font-md fnt-md mt-2_3">Your current Location</div>
      <div className="font-md fnt-md mt-2_3">{address}</div>
      
    </div>
  );
};

export default MapLocation;
