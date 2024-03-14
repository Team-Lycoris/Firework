import React, { useState, useEffect } from 'react';
import GoogleMapReact from 'google-map-react';

import { useLocation } from 'react-router-dom';

import Config from "../config.json";

const MapComponent = ({ text }) => <div>{text}</div>;

/*
    creates embedded map from google maps on the page
*/
const MyMap = () => {
      const location = useLocation();
      const { lat, long } = location.state;

      const [address, setAddress] = useState("");

      //gets address from coordinates to display to user
      useEffect(() => {
        const getAddress = async () => {
          try {
            //add api key in url
            const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=` + Config.googleMapKey);
            const data = await response.json();
            setAddress(data.results[0].formatted_address);
          } catch (error) {
            console.error('Error fetching address:', error);
          }
        };

        getAddress();
      }, []);

        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', width: '80%', margin: '0 auto' }}>
            <GoogleMapReact
              bootstrapURLKeys={{ key: Config.googleMapKey }} // add api key
                defaultCenter={{lat: lat, lng: long}}
                defaultZoom={16}
                style={{ height: '100%', width: '100%' }}

            >
                <MapComponent
                lat={lat}
                lng={long}
                />
                <Marker
                lat={lat}
                lng={long}
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
