import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';


const MapComponent = ({listing}) => {

   console.log(listing);
//   const position = [geolocation.lat, geolocation.lnt];
   // Replace with your coordinates

  
//   const position = [props, props.lng];
//   const position = [80.347587, 26.473794];
  //const position = [props.lat,];
  return (
    <MapContainer
    center={[listing.geolocation.lat, listing.geolocation.lng]}
    zoom={13}
    scrollWheelZoom={false}
    style={{ height: "100%", width: "100%" }}
  >
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <Marker
      position={[listing.geolocation.lat, listing.geolocation.lng]}
    >
      <Popup>
        {listing.address}
      </Popup>
    </Marker>
  </MapContainer>
  );
};

export default MapComponent;
