import React, { useState, useEffect } from 'react';
import GoogleMapReact from 'google-map-react';

import Config from "../config.json";

const MapComponent = ({ text }) => <div>{text}</div>;

//lat and long are examples
const MyMap = () => {
  const defaultCenter = {
      lat: 34.0707583,
      lng: -118.4533039
    };

  const markerPosition = {
        lat: 34.0707583,
        lng: -118.4533039
      };

      const [address, setAddress] = useState("");

      //gets address from coordinates to display
      useEffect(() => {
        const getAddress = async () => {
          try {
            //add api key in url
            const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${markerPosition.lat},${markerPosition.lng}&key=` + Config.googleMapKey);
            const data = await response.json();
            setAddress(data.results[0].formatted_address);
          } catch (error) {
            console.error('Error fetching address:', error);
          }
        };

        getAddress();
      }, [markerPosition]);

        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', width: '80%', margin: '0 auto' }}>
            <GoogleMapReact
              bootstrapURLKeys={{ key: Config.googleMapKey }} // add api key
                defaultCenter={defaultCenter}
                defaultZoom={16}
                style={{ height: '100%', width: '100%' }}

            >
                <MapComponent
                lat={defaultCenter.lat}
                lng={defaultCenter.lng}
                />
                <Marker
                lat={markerPosition.lat}
                lng={markerPosition.lng}
                text={address}
                />
            </GoogleMapReact>
            </div>
        );
};

//adds circle marker to approximate location
const Marker = ({ text }) =>
(
<div style={{ position: 'relative' }}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#000000"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" fill="none" />
    </svg>
    <div style={{ position: 'absolute', top: '-20px', left: '35px', background: 'white', padding: '5px', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>{text}</div>
  </div>
);


export default MyMap;
