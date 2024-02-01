import React, { memo, useImperativeHandle, useRef,useEffect,useContext } from "react";
import { GoogleMap, useLoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from "@reach/combobox";
import { formatRelative } from "date-fns";

import "@reach/combobox/styles.css";
import { useLocation } from "react-router-dom";
import { SplitAddress, } from "../Common/SplitAddress";
import { AgencyContext } from "../../Context/Agency/Index";
import { AddDeleteUpadate } from "../hooks/Api";
import { toastifyError, toastifySuccess } from "../Common/AlertMsg";
import { useCallback } from "react";
// import mapStyles from "./mapStyles";

const libraries = ["places"];

const mapContainerStyle = {
    height: "100vh",
    width: "100vw"
};

const options = {
    // styles: mapStyles,
    disableDefaultUI: true,
    zoomControl: true
};

const center = {
    lat: 43.6532,
    lng: -79.3832
};

function Location({ setValue, value, col, locationStatus, setlocationStatus, check, ref, locationID, verify }) {

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: "AIzaSyDL9J82iDhcUWdQiuIvBYa0t5asrtz3Swk",
        libraries
    });

    const [markers, setMarkers] = React.useState([]);
    const [selected, setSelected] = React.useState(null);

    const onMapClick = React.useCallback(e => {
        setMarkers(current => [
            // ...current,
            {
                lat: e.latLng.lat(),
                lng: e.latLng.lng(),
                time: new Date()
            }
        ]);
    }, []);

    const mapRef = React.useRef();
    const onMapLoad = React.useCallback(map => {
        mapRef.current = map;
    }, []);

    const panTo = React.useCallback(({ lat, lng }) => {
        mapRef.current.panTo({ lat, lng });
        mapRef.current.setZoom(14);
        setMarkers(current => [
            // ...current,
            {
                lat,
                lng,
                time: new Date()
            }
        ]);
    }, []);

    if (loadError) return "Error";
    if (!isLoaded) return "Loading...";

    return (
        <div>
            {/* <Locate panTo={panTo} /> */}
            <Search panTo={panTo} set={setValue} val={value} col={col} LoStatus={locationStatus} setLoSta={setlocationStatus} check={check} ref={ref} locationID={locationID} verify={verify} />
            <>
                {/* <GoogleMap
        id="map"
        mapContainerStyle={mapContainerStyle}
        zoom={8}
        center={center}
        options={options}
        onClick={onMapClick}
        onLoad={onMapLoad}
      >
        {markers.map(marker => (
          <Marker
            key={`${marker.lat}-${marker.lng}`}
            position={{ lat: marker.lat, lng: marker.lng }}
            onClick={() => {
              setSelected(marker);
            }}
            // icon={{
            //   url: `/bear.svg`,
            //   origin: new window.google.maps.Point(0, 0),
            //   anchor: new window.google.maps.Point(15, 15),
            //   scaledSize: new window.google.maps.Size(30, 30)
            // }}
          />
        ))}

        {selected ? (
          <InfoWindow
            position={{ lat: selected.lat, lng: selected.lng }}
            onCloseClick={() => {
              setSelected(null);
            }}
          >
            <div>
              <h2>
                <span role="img" aria-label="bear">
                  🐻
                </span>{" "}
                Alert
              </h2>
              <p>Spotted {formatRelative(selected.time, new Date())}</p>
            </div>
          </InfoWindow>
        ) : null}
      </GoogleMap> */}
            </>
        </div>
    );
}

export default memo(Location)

function Locate({ panTo }) {
    return (
        <>
        </>
        // <button
        //   className="locate"
        //   onClick={() => {
        //     navigator.geolocation.getCurrentPosition(
        //       position => {
        //         panTo({
        //           lat: position.coords.latitude,
        //           lng: position.coords.longitude
        //         });
        //       },
        //       () => null
        //     );
        //   }}
        // >
        //   <img src="/compass.svg" alt="compass" />
        // </button>
    );
}

function Search({ panTo, set, val, col, LoStatus, setLoSta, check = { check }, ref, locationID, verify }) {

    let storageRef = useRef(verify);

    useEffect(() => {
        if (!storageRef.current || LoStatus) {
            handleInput(null);
            // console.log("Calll Location uef search01")
            // setLoSta(false);
        }
        // return () => { storageRef.current = false; }
    }, [verify, LoStatus])

    const useQuery = () => new URLSearchParams(useLocation().search);
    let openPage = useQuery().get('page');

    const { splitAddress, SplitAddress } = useContext(AgencyContext);

    const defaultBounds = {
        north: center.lat + 0.1,
        south: center.lat - 0.1,
        east: center.lng + 0.1,
        west: center.lng - 0.1,
    };

    const { ready, value, suggestions: { status, data }, setValue, clearSuggestions } = usePlacesAutocomplete({
        requestOptions: {
            location: { lat: () => 43.6532, lng: () => -79.3832 },
            radius: 100 * 1000,
            // bounds: defaultBounds,
            componentRestrictions: { country: "us" },
            // fields: ["address_components", "geometry", "icon", "name"],
            strictBounds: false,
        }
    });

    useEffect(() => {
        // console.log("Calll   Location uef val02")
        // console.log(val[col]);
        if (val[col]) {
            setValue(val[col], false);
        }
        // if (col === 'CrimeLocation' && !val.IsVerify) {
        //     handleInput(null)
        // }
    }, [val])

    // https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#AutocompletionRequest

    const handleInput = e => {
        if (e) {
            setValue(e.target.value);
            // set(pre => { return { ...pre, [col]: e.target.value, [locationID]: '', } })
        }
        else {
            //   alert("not Address");
            setValue('');
            // set({ ...val, [col]: '' })
        }
    };

    useEffect(() => {
        if (openPage === 'clear') setValue('')
    }, [openPage])

    const handleSelect = async (address) => {
        if (!address) {
            // alert("not Address")
        }
        set(pre => { return { ...pre, [col]: address } })
        setValue(address, false);
        clearSuggestions();
        // try {
        //   const results = await getGeocode({ address });
        //   const { lat, lng } = await getLatLng(results[0]);
        //   panTo({ lat, lng });
        // } catch (error) {
        //   console.log("😱 Error: ", error);
        // } 
        saveVerifyLocation({ address, set, val, col, locationID });
    };

    const add = '442Av.Juan Rosado,Arecibo,00612,PuertoRico';
    const key = 'AIzaSyDL9J82iDhcUWdQiuIvBYa0t5asrtz3Swk'
    // AIzaSyBEhZNFF92eTAqWeQ2ZCaITiWeaFrWlf1w

    const key1 = 'AIzaSyBEhZNFF92eTAqWeQ2ZCaITiWeaFrWlf1w'

    // const vali = async (Addresss) => {
    //     // https://content-addressvalidation.googleapis.com/v1:validateAddress?alt=json&key=AIzaSyDL9J82iDhcUWdQiuIvBYa0t5asrtz3Swk
    //     // const address = {
    //     //     "address": {
    //     //       "regionCode": "US",
    //     //       "locality": "Mountain View",
    //     //       "administrativeArea": "CA",
    //     //       "postalCode": "94043",
    //     //       "addressLines": ["1600 Amphitheatre Pkwy"]
    //     //     },
    //     //     "enableUspsCass": true
    //     //   }
    //     // const res = await axios.post(`https://addressvalidation.googleapis.com/v1:validateAddress?key=${key1}`, {
    //     //     "address": {
    //     //       "regionCode": "US",
    //     //       "locality": "Mountain View",
    //     //       "administrativeArea": "CA",
    //     //       "postalCode": "94043",
    //     //       "addressLines": ["1600 Amphitheatre Pkwy"]
    //     //     },
    //     //     "enableUspsCass": true
    //     //   });

    //     var myHeaders = new Headers();
    //     myHeaders.append("Content-Type", "application/json");

    //     var raw = JSON.stringify({
    //         "address": {
    //             "regionCode": "US",
    //             "addressLines": [Addresss]
    //         },
    //         "enableUspsCass": true
    //     });

    //     var requestOptions = {
    //         method: 'POST',
    //         headers: myHeaders,
    //         body: raw,
    //         redirect: 'follow'
    //     };

    //     fetch("https://addressvalidation.googleapis.com/v1:validateAddress?key=AIzaSyBEhZNFF92eTAqWeQ2ZCaITiWeaFrWlf1w", requestOptions)
    //         .then(response => response.json())
    //         .then(result => {
    //             console.log(result.result);
    //             return result.result.address.addressComponents.map((value) => {
    //                 console.log(value.componentType);
    //             })
    //         })
    //         .catch(error => console.log('error', error));
    //     // const res = await axios.post(`https://addressvalidation.googleapis.com/v1:validateAddress?key=${key1}`);
    //     // console.log(res);
    // }

    return (
        <div className="search" style={{ pointerEvents: !verify && 'none' }}>
            <Combobox onSelect={handleSelect}>
                <ComboboxInput style={{ background: check ? '#fce9bf' : '', zIndex: 200 }}
                    value={value}
                    onChange={handleInput}
                    disabled={!ready}
                    placeholder="Search your location"
                />
                <ComboboxPopover >
                    {
                        verify ?
                            <ComboboxList  >
                                {status === "OK" &&
                                    data.map(({ id, description }) => (
                                        <ComboboxOption key={id} value={description} />
                                    ))}
                            </ComboboxList>
                            :
                            <>
                            </>
                    }
                </ComboboxPopover>
            </Combobox>
            {/* <button onClick={() => vali()}>validate</button> */}
        </div >
    );
}

const saveVerifyLocation = async ({ address, set, val, col, locationID }) => {

    let geoApiData = await SplitAddress(address);

    // console.log(geoApiData);

    var Add = geoApiData?.address?.addressComponents ? geoApiData?.address?.addressComponents : [];
    // console.log(geoApiData?.address?.addressComponents);
    var country = Add?.filter((obj) => { if (obj?.componentType === "country") { return obj.componentName } });

    var City = Add?.filter((obj) => { if (obj?.componentType === "locality") { return obj.componentName } });

    var Street = Add?.filter((obj) => { if (obj?.componentType === "route") { return obj.componentName } });

    var street_number = Add?.filter((obj) => { if (obj?.componentType === 'street_number') { return obj.componentName } });

    var sublocality_level_1 = Add?.filter((obj) => { if (obj?.componentType === 'sublocality_level_1') { return obj.componentName } });

    var administrative_area_level_1 = Add?.filter((obj) => { if (obj?.componentType === "administrative_area_level_1") { return obj.componentName } });

    var postal_code = Add?.filter((obj) => { if (obj?.componentType === "postal_code") { return obj.componentName } });

    var point_of_interest = Add?.filter((obj) => { if (obj?.componentType === "point_of_interest") { return obj.componentName } });
    var neighborhood = Add?.filter((obj) => { if (obj?.componentType === "neighborhood") { return obj.componentName } });
    var subpremise = Add?.filter((obj) => { if (obj?.componentType === "subpremise") { return obj.componentName } });
    var premise = Add?.filter((obj) => { if (obj?.componentType === "premise") { return obj.componentName } });

    // const data = {
    //     'IsUsLocation': 'Y',
    //     'Street': Street[0]?.componentName?.text ? Street[0].componentName.text : '',
    //     'City': City[0]?.componentName?.text ? City[0]?.componentName?.text : '',
    //     'Country': country[0]?.componentName?.text ? country[0]?.componentName?.text : '',
    //     'PremiseNo': street_number[0]?.componentName?.text ? street_number[0]?.componentName?.text : '',
    //     'ZipCode': postal_code[0]?.componentName?.text ? postal_code[0]?.componentName?.text : '',
    //     'TypeSufix': sublocality_level_1[0]?.componentName?.text ? sublocality_level_1[0]?.componentName?.text : '',
    //     'DirectionSufix': administrative_area_level_1[0]?.componentName?.text ? administrative_area_level_1[0]?.componentName?.text : '',

    //     'point_of_interest': point_of_interest[0]?.componentName?.text ? point_of_interest[0]?.componentName?.text : '',
    //     'neighborhood': neighborhood[0]?.componentName?.text ? neighborhood[0]?.componentName?.text : '',
    //     "subpremise": subpremise[0]?.componentName?.text ? subpremise[0]?.componentName?.text : '',
    //     "premise": premise[0]?.componentName?.text ? premise[0]?.componentName?.text : '',
    // }

    set(pre => {
        return {
            ...pre,
            'IsUsLocation': 'Y',
            'Street': Street[0]?.componentName?.text ? Street[0].componentName.text : '',
            'City': City[0]?.componentName?.text ? City[0]?.componentName?.text : '',
            'Country': country[0]?.componentName?.text ? country[0]?.componentName?.text : '',
            'PremiseNo': street_number[0]?.componentName?.text ? street_number[0]?.componentName?.text : '',
            'ZipCode': postal_code[0]?.componentName?.text ? postal_code[0]?.componentName?.text : '',
            'TypeSufix': typeof (sublocality_level_1[0]?.componentName?.text) === 'number' ? sublocality_level_1[0]?.componentName?.text : 0,
            'DirectionSufix': administrative_area_level_1[0]?.componentName?.text ? administrative_area_level_1[0]?.componentName?.text : '',
            'point_of_interest': point_of_interest[0]?.componentName?.text ? point_of_interest[0]?.componentName?.text : '',
            'neighborhood': neighborhood[0]?.componentName?.text ? neighborhood[0]?.componentName?.text : '',
            'subpremise': subpremise[0]?.componentName?.text ? subpremise[0]?.componentName?.text : '',
            'premise': premise[0]?.componentName?.text ? premise[0]?.componentName?.text : '',
            'DirectionPrefix': '',
            'State': '',
            'ApartmentNo': '',
            'CommonPlace': '',
            'ApartmentType': '',
            'Street_Parse': '',
            'PremiseNo_Parse': '',
            'DirectionPrefix_Parse': '',
            'TypeSuffix_Parse': '',
            'DirectionSuffix_Parse': '',
            'ZipCodeID': '',
            'CityID': '',
            'CountryID': '',
        }
    })

    // console.log(data)
    // AddDeleteUpadate('MasterLocation/Insert_Location', data).then((res) => {
    //     console.log(res)
    //     if (res.success) {
    //         // toastifySuccess("Location Added");
    //         // console.log(res);
    //         if (res.LocationID) {
    //             set(pre => { return { ...pre, [locationID]: res.LocationID } });
    //         } else {
    //             // set({ ...val, [locationID]: '' });
    //         }
    //     } else {
    //         console.log(res);
    //     }
    // })
}
