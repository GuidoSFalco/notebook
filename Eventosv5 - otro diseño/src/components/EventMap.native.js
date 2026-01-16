import React from 'react';
import MapView, { Marker } from 'react-native-maps';

const EventMap = ({
  style,
  initialRegion,
  region,
  markerCoordinate,
  interactive = true,
  googleMapsApiKey,
  onPress,
  draggable = false,
  onMarkerDragEnd,
  onRegionChangeComplete,
}) => {
  return (
    <MapView
      style={style}
      initialRegion={initialRegion}
      region={region}
      scrollEnabled={interactive}
      zoomEnabled={interactive}
      rotateEnabled={interactive}
      pitchEnabled={interactive}
      onPress={interactive ? onPress : undefined}
      pointerEvents={interactive ? 'auto' : 'none'}
      googleMapsApiKey={googleMapsApiKey}
      onRegionChangeComplete={onRegionChangeComplete}
    >
      {markerCoordinate ? (
        <Marker 
          coordinate={markerCoordinate} 
          draggable={draggable}
          onDragEnd={onMarkerDragEnd}
        />
      ) : null}
    </MapView>
  );
};

export default EventMap;
