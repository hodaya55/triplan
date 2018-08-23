import React from 'react';
import { StandaloneSearchBox } from 'react-google-maps/lib/components/places/StandaloneSearchBox';
import { compose, withProps, lifecycle, withStateHandlers } from 'recompose';
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from 'react-google-maps';

const MapComponent = compose(
  withStateHandlers(() =>
    ({
      isOpen: false,
      infoIndex: null
    }),
  {
    showInfo: ({ isOpen, infoIndex }) => (index) => ({
      isOpen: infoIndex !== index || !isOpen,
      infoIndex: index
    })
  }
  ),
  withProps({
    googleMapURL: 'https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&language=en&key=AIzaSyDuKj7l762Y5ulcwj_EyANIvHx6rfffceY',
    loadingElement: <div style={{ height: '100%' }} />,
    containerElement: <div style={{ height: '100%' }} />,
    mapElement: <div style={{ height: '100%' }} />,
    zoom: 15,
  }),
  lifecycle({
    componentWillMount() {
      const refs = {};
      this.setState({
        onSearchBoxMounted: ref => {
          refs.searchBox = ref;
        },
        onPlacesChanged: () => {
          const place = refs.searchBox.getPlaces();
          let lat = place[0].geometry.location.lat();
          let lng = place[0].geometry.location.lng();
          this.props.updateAddress({ lat: lat, lng: lng });
        },
        addPlace: (marker) => {
          // console.log(marker);
          let id = marker.id;
          let name = marker.name;
          //! todo: check if the item not exist in the placesarray already
          this.props.addPlace({ name: name, id: id });
        },
      });
    }, // end componentWillMount
  }),
  withScriptjs,
  withGoogleMap
)((props) => {
  return <div>
    <StandaloneSearchBox
      ref={props.onSearchBoxMounted}
      bounds={props.bounds}
      onPlacesChanged={props.onPlacesChanged}>
      <input placeholder="Search Address" className="autocomplete" />
    </StandaloneSearchBox>

    <GoogleMap
      defaultZoom={15}
      zoom={15}
      center={{ lat: props.address.lat, lng: props.address.lng }}
      defaultCenter={{ lat: props.address.lat, lng: props.address.lng }}
      defaultOptions={{ mapTypeControl: false, rotateControl: false, scrollwheel: false }}>

      <Marker position={{ lat: props.address.lat, lng: props.address.lng }}
        icon={{
          url: require('./../../../../markersIcons/home.png')
        }}
      // onClick={props.onMarkerClick}
      />

      {props.markers.map((marker) =>
        <Marker onClick={() => props.showInfo(marker.id)} key={marker.id} position={{ lat: marker.position.lat, lng: marker.position.lng }}
          icon={{
            url: require(`../../../../markersIcons/${marker.icon}`)
          }}
        >
          {(props.isOpen && props.infoIndex === marker.id) &&
              <InfoWindow onCloseClick={props.showInfo}>
                <div>
                  <p><b>{marker.name}</b></p>
                  <p>Rating: {marker.rating ? marker.rating : '---'}</p>
                  <p>{marker.openNow ? 'Open Now' : 'Close Now'}</p>
                  {/* todo: fix the website link , add the photo */}
                  <a href={marker.website} target="_blank">Website</a>
                  <button onClick={() => props.addPlace(marker)}>Add</button>
                </div>
              </InfoWindow>}
        </Marker>)
      }
    </GoogleMap>
  </div>;
});

export default MapComponent;
