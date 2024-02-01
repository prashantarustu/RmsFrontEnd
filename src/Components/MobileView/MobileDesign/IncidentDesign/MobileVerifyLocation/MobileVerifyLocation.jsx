import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import Select from "react-select";
import { Comman_changeArrayFormat, Comman_changeArrayFormat_With_Name, threeColArray } from '../../../../Common/ChangeArrayFormat';
import { AddDeleteUpadate, fetchData, fetchPostData } from '../../../../hooks/Api';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import { Decrypt_Id_Name } from '../../../../Common/Utility';
import { RequiredFieldSpaceNotAllow } from '../../../../Pages/Agency/AgencyValidation/validators';
import { RequiredFieldIncident } from '../../../../Pages/Utility/Personnel/Validation';

const MobileVerifyLocation = (props) => {

    const { modalStatus, setModalStatus, value, setValue, addVerifySingleData, get_Add_Single_Data } = props

    const [CountryIDList, setCountryIDList] = useState([]);
    const [stateList, setStateList] = useState([]);
    const [bIstateList, setBIStateList] = useState([]);
    const [cityList, setCityList] = useState([]);
    const [zipList, setZipList] = useState([]);

    //--------------------------DropDown------------------------------
    const [dirPreFixSufixData, setDirPreFixSufixData] = useState([]);
    const [typeSuffixData, setTypeSuffixData] = useState([]);
    const [apartmentTypeDrp, setApartmentTypeDrp] = useState([]);

    // http://localhost:26055/api/MasterLocation/GetData_Location
    // Data:
    // IsUsLocation:

    const [locationVal, setLocationVal] = useState({
        'AgencyID':  '',
        'AgencyName':  '',
        'LocationID': '',
        'IsActive': '1',

        'PremiseNo': '',//
        'PremiseNo_Parse': '',//
        //---------- 'I_PremiseNo_Parse': '',

        'Street': '',//
        'Street_Parse': '',//
        //----------- 'I_Street_Parse': '',

        'CommonPlace': '',//
        // ---------'Commonplace_Parse': '',

        'ApartmentNo': '',//
        //------- -'ApartmentNo_Parse': '',

        'ApartmentType': '',//
        //--------- 'ApartmentType_Parse': '',

        'CountryID': '',
        'Country': '',
        'State': '',//
        'CityID': '',//
        'City': '',//
        'ZipCodeID': '',//
        'ZipCode': '',//
        'StateFullName': '',

        'DirectionPrefix': '',//
        'DirectionSufix': '',//
        'DirectionPrefix_Parse': '',//
        'DirectionSuffix_Parse': '',//

        'TypeSufix': '',//
        'TypeSuffix_Parse': '',//
        'IsUsLocation': 'Y',//

        // not In use

        // 'TypePrefix': '',

        // 'I_DirectionPrefix_Parse': '',
        // 'I_TypeSuffix_Parse': '',
        // 'I_DirectionSuffix_Parse': '',

        // 'Area': '', 'Latitude': '', 'Longitude': '', 'LocationAlias': '', 'GeoCords': '', 'ORINumber': '',
        // 'LocationType': '', 'RecommandedAddress': '', 'MunicipalityCode': '', 'JurisCode': '', 'ind_col': '',
        // 'PatrolArea': '', 'ZoneCode': '', 'ZoneDesc': '', 'MainX': '', 'MainY': '', 'MainZ': '', 'AlternateX': '',
        // 'AlternateY': '', 'AlternateZ': '', 'MuniCode_Parse': '', 'JurisCode_Parse': '', 'GAPID': '', 'DISTRICT': '',
        // 'GRID': '', 'IsAddressFROMNonUS': '', 'LOCUniqID': '', 'Division': '', 'Field_office': '', 'Direction': '',

        // 'GCModifier': '', 'Location_ID': '', 'KeyMAP': '', 'MP_Number': null, 'MP_Prefix': '', 'Milepost': '',
        // 'MP_Suffix': '', 'NSPDType': '', 'NSPDUniqueID': '', 'SegmentRange': '', 'CrossingsDOTNum': '',
        // 'CrossingsFullName': '', 'NSPDName': '', 'XRMSDisplayText': '',

    });

    const [errors, setErrors] = useState({
        'StreetError': '', 'CountryIDError': '', 'StateError': '', 'CityIDError': '', 'ApartmentTypeError': '',
    })

    const check_Validation_Error = (e) => {
        if (locationVal?.IsUsLocation === 'Y') {
            if (locationVal?.ApartmentNo) {
                if (RequiredFieldSpaceNotAllow(locationVal.Street)) {
                    setErrors(prevValues => { return { ...prevValues, ['StreetError']: RequiredFieldSpaceNotAllow(locationVal.Street) } })
                }
                if (RequiredFieldIncident(locationVal.State)) {
                    setErrors(prevValues => { return { ...prevValues, ['StateError']: RequiredFieldIncident(locationVal.State) } })
                }
                if (RequiredFieldIncident(locationVal.CityID)) {
                    setErrors(prevValues => { return { ...prevValues, ['CityIDError']: RequiredFieldIncident(locationVal.CityID) } })
                }
                if (RequiredFieldIncident(locationVal.ApartmentType)) {
                    setErrors(prevValues => { return { ...prevValues, ['ApartmentTypeError']: RequiredFieldIncident(locationVal.ApartmentType) } })
                }
            } else {
                if (RequiredFieldSpaceNotAllow(locationVal.Street)) {
                    setErrors(prevValues => { return { ...prevValues, ['StreetError']: RequiredFieldSpaceNotAllow(locationVal.Street) } })
                }
                if (RequiredFieldIncident(locationVal.State)) {
                    setErrors(prevValues => { return { ...prevValues, ['StateError']: RequiredFieldIncident(locationVal.State) } })
                }
                if (RequiredFieldIncident(locationVal.CityID)) {
                    setErrors(prevValues => { return { ...prevValues, ['CityIDError']: RequiredFieldIncident(locationVal.CityID) } })
                }
            }
        } else {
            if (RequiredFieldIncident(locationVal.CountryID)) {
                setErrors(prevValues => { return { ...prevValues, ['CountryIDError']: RequiredFieldIncident(locationVal.CountryID) } })
            }
            if (RequiredFieldIncident(locationVal.Statefullname)) {
                setErrors(prevValues => { return { ...prevValues, ['StateError']: RequiredFieldIncident(locationVal.Statefullname) } })
            }
            if (RequiredFieldIncident(locationVal.City)) {
                setErrors(prevValues => { return { ...prevValues, ['CityIDError']: RequiredFieldIncident(locationVal.City) } })
            }
        }
    }

    // Check All Field Format is True Then Submit 
    const { StreetError, CountryIDError, StateError, CityIDError, ApartmentTypeError } = errors

    useEffect(() => {
        if (locationVal?.IsUsLocation === 'Y') {
            if (locationVal?.ApartmentNo) {
                if (StreetError === 'true' && StateError === 'true' && CityIDError === 'true' && ApartmentTypeError === 'true') {
                    saveVerifyLocation();
                }
            } else {
                if (StreetError === 'true' && StateError === 'true' && CityIDError === 'true') {
                    saveVerifyLocation();
                }
            }
        } else {
            if (CountryIDError === 'true' && StateError === 'true' && CityIDError === 'true') {
                saveVerifyLocation();
            }
        }
    }, [StreetError, CountryIDError, StateError, CityIDError, ApartmentTypeError])

    useEffect(() => {
        // console.log(addVerifySingleData)
        if (addVerifySingleData?.length > 0) {
            console.log(addVerifySingleData);
            setLocationVal({
                ...locationVal,
                'PremiseNo': addVerifySingleData[0]?.PremiseNo,//
                'PremiseNo_Parse': addVerifySingleData[0]?.PremiseNo_Parse,//
                // 'I_PremiseNo_Parse': addVerifySingleData[0]?.I_PremiseNo_Parse,

                'Street': addVerifySingleData[0]?.Street,//
                'Street_Parse': addVerifySingleData[0]?.Street_Parse,
                // 'I_Street_Parse': addVerifySingleData[0]?.I_Street_Parse,

                'CommonPlace': addVerifySingleData[0]?.CommonPlace,//
                // 'Commonplace_Parse': addVerifySingleData[0]?.Commonplace_Parse,

                'ApartmentNo': addVerifySingleData[0]?.ApartmentNo,//    
                // 'ApartmentNo_Parse': addVerifySingleData[0]?.ApartmentNo_Parse,

                'ApartmentType': addVerifySingleData[0]?.ApartmentType === 0 ? "" : addVerifySingleData[0]?.ApartmentType,//
                // 'ApartmentType_Parse': addVerifySingleData[0]?.ApartmentType_Parse,

                'CountryID': addVerifySingleData[0]?.CountryID,
                'Country': addVerifySingleData[0]?.Country,
                'State': addVerifySingleData[0]?.State ? parseInt(addVerifySingleData[0]?.State) : 0,
                'StateFullName': addVerifySingleData[0]?.StateFullName,
                'CityID': addVerifySingleData[0]?.CityID,
                'City': addVerifySingleData[0]?.City,
                'ZipCodeID': addVerifySingleData[0]?.ZipCodeID,
                'ZipCode': addVerifySingleData[0]?.ZipCode,

                'IsUsLocation': addVerifySingleData[0]?.IsUsLocation,
                'DirectionPrefix': parseInt(addVerifySingleData[0]?.DirectionPrefix),
                'TypeSufix': parseInt(addVerifySingleData[0]?.TypeSufix),
                'DirectionSufix': parseInt(addVerifySingleData[0]?.DirectionSufix),
                'DirectionPrefix_Parse': parseInt(addVerifySingleData[0]?.DirectionPrefix_Parse),
                'TypeSuffix_Parse': parseInt(addVerifySingleData[0]?.TypeSuffix_Parse),
                'DirectionSuffix_Parse': parseInt(addVerifySingleData[0]?.DirectionSuffix_Parse),
            });
            getBIStateList(addVerifySingleData[0]?.CountryID);
            getStateList();
            getCity(addVerifySingleData[0]?.State ? parseInt(addVerifySingleData[0]?.State) : 0);
            get_City_Zip(addVerifySingleData[0]?.CityID);
        } else {
            setLocationVal({
                ...locationVal,
                ['PremiseNo']: '',
                ['IsUsLocation']: 'Y'
            });
        }
    }, [addVerifySingleData, modalStatus]);

    useEffect(() => {
        getCountryID(); getStateList(); getBIStateList(); get_DirPreFixSufix_Data(); get_Type_Sufix_Data(); get_apartmentTypeDrp_Data();
    }, []);

    const get_Type_Sufix_Data = () => {
        const val = {
            AgencyID: '',
        };
        fetchPostData("TypeSuffix/GetDataDropDown_TypeSuffix", val).then((data) => {
            if (data) {
                setTypeSuffixData(Comman_changeArrayFormat(data, "TypeSuffixID", "Description"));
            } else {
                setTypeSuffixData([]);
            }
        });
    };

    const get_DirPreFixSufix_Data = () => {
        const val = {
            AgencyID: '',
        };
        fetchPostData("DirectionPrefixSuffix/GetDataDropDown_DirectionPrefixSuffix", val).then((data) => {
            if (data) {
                setDirPreFixSufixData(Comman_changeArrayFormat(data, "DirectionPrefixSuffixID", "Description"));
            } else {
                setDirPreFixSufixData([]);
            }
        });
    };

    const getCountryID = async () => {
        fetchData("IncidentCountry_State/GetData_IncidentCountry").then((data) => {
            if (data) {
                // console.log(data)
                setCountryIDList(Comman_changeArrayFormat_With_Name(data, "CountryID", "CountryName", "DLCountryID"));
            } else {
                setCountryIDList([]);
            }
        });
    };

    const getStateList = async () => {
        fetchData("State_City_ZipCode/GetData_State").then((data) => {
            if (data) {
                setStateList(threeColArray(data, "StateID", "StateName", "State"));
            } else {
                setStateList([]);
            }
        });
    };

    const getBIStateList = async (CountryID) => {
        const val = {
            CountryID: CountryID,
        };
        fetchPostData("IncidentCountry_State/GetData_IncidentState", val).then((data) => {
            if (data) {
                // console.log(data);
                setBIStateList(Comman_changeArrayFormat_With_Name(data, "StateID", "StateName", "BIStateID"));
            } else {
                setStateList([]);
            }
        });
    };

    const getCity = async (StateID) => {
        const val = {
            StateID: StateID,
        };
        fetchPostData("State_City_ZipCode/GetData_City", val).then((data) => {
            if (data) {
                setCityList(Comman_changeArrayFormat_With_Name(data, "CityID", "CityName", "BICityID"))
            } else {
                setCityList([]);
            }
        });
    };

    const get_City_Zip = async (CityId) => {
        const val = {
            CityId: CityId,
        }
        fetchPostData("State_City_ZipCode/GetData_ZipCode", val).then((data) => {
            if (data) {
                // console.log(data)
                setZipList(Comman_changeArrayFormat(data, "zipId", "Zipcode"))
            } else {
                setZipList([]);
            }
        });
    };

    const get_apartmentTypeDrp_Data = () => {
        const val = {
            AgencyID: '',
        };
        fetchPostData("AppartmentType/GetDataDropDown_AppartmentType", val).then((data) => {
            if (data) {
                setApartmentTypeDrp(Comman_changeArrayFormat(data, "ApartmentTypeID", "Description"));
            } else {
                setApartmentTypeDrp([]);
            }
        });
    };

    const HandleChange = (e) => {
        if (e.target.name === 'IsUsLocation') {
            setLocationVal({
                ...locationVal,
                [e.target.name]: e.target.value
            });
            setErrors({ ...errors, 'StreetError': '', 'ApartmentTypeError': '', 'CountryIDError': '', 'StateError': '', 'CityIDError': '', 'ZipCodeIDError': '', });
        } else if (e.target.name === 'ApartmentNo') {
            setLocationVal({
                ...locationVal,
                [e.target.name]: e.target.value,
                ['ApartmentType']: '',
            });
            setErrors({ ...errors, 'ApartmentTypeError': '', });
        } else {
            setLocationVal({
                ...locationVal,
                [e.target.name]: e.target.value
            });
        }
    }

    const selectHandleChange = (e, name, nameCode) => {
        if (e) {
            if (name === 'State') {
                getCity(e.value)
                setLocationVal({
                    ...locationVal,
                    [name]: e.value,
                    ['StateFullName']: e.label,
                });
            } else if (name === 'CityID') {
                get_City_Zip(e.value);
                setLocationVal({
                    ...locationVal,
                    [name]: e.value,
                    ['City']: e.label,
                });
            } else if (name === 'ZipCodeID') {
                setLocationVal({
                    ...locationVal,
                    [name]: e.value,
                    ['ZipCode']: e.label,
                });
            } else if (name === 'CountryID') {
                setLocationVal({
                    ...locationVal,
                    [name]: e.value,
                    ['Country']: e.label
                });
                getBIStateList(e.value);
            } else {
                setLocationVal({
                    ...locationVal,
                    [name]: e.value,
                });
            }
        } else if (e === null) {
            if (name === 'CityID') {
                setLocationVal({
                    ...locationVal,
                    [name]: null,
                    ['City']: '',
                    ['ZipCodeID']: '',
                    ['ZipCode']: '',
                });
                setZipList([])
            } else if (name === 'State') {
                setLocationVal({
                    ...locationVal,
                    [name]: null,
                    ['CityID']: '',
                    ['City']: '',
                    ['StateFullName']: '',
                    ['ZipCodeID']: '',
                    ['ZipCode']: '',
                });
                setCityList([]);
                setZipList([]);
            } else if (name === 'CountryID') {
                setLocationVal({
                    ...locationVal,
                    [name]: null,
                    ['Country']: '',
                    ['State']: '',
                    ['StateFullName']: '',
                    ['CityID']: '',
                    ['City']: '',
                    ['ZipCodeID']: '',
                    ['ZipCode']: '',
                });
                setStateList([]); setBIStateList([]); setCityList([]); setZipList([]);
            } else {
                setLocationVal({
                    ...locationVal,
                    [name]: null,
                    [nameCode]: '',
                });
            }
        }
    }

    const Reset = () => {
        setLocationVal({
            ...locationVal,
            'PremiseNo': '',//
            'PremiseNo_Parse': '',//
            'I_PremiseNo_Parse': '',

            'Street': '',//
            'Street_Parse': '',
            'I_Street_Parse': '',

            'CommonPlace': '',//
            'Commonplace_Parse': '',

            'ApartmentNo': '',//    
            'ApartmentNo_Parse': '',

            'ApartmentType': '',//
            'ApartmentType_Parse': '',

            'CountryID': '',
            'Country': '',
            'State': '',
            'StateFullName': '',
            'City': '',
            'CityID': '',
            'ZipCodeID': '',
            'ZipCode': '',

            'Area': '',
            'DirectionPrefix': '',
            'DirectionSufix': '',
            'TypeSufix': '',
            'Latitude': '',
            'Longitude': '',
            'LocationAlias': '',
            'GeoCords': '',
            'ORINumber': '',
            'LocationType': '',
            'RecommandedAddress': '',
            'MunicipalityCode': '',
            'JurisCode': '',
            'ind_col': '',
            'PatrolArea': '',
            'ZoneCode': '',
            'ZoneDesc': '',
            'MainX': '',
            'MainY': '',
            'MainZ': '',
            'AlternateX': '',
            'AlternateY': '',
            'AlternateZ': '',
            'DirectionPrefix_Parse': '',
            'TypeSuffix_Parse': '',
            'DirectionSuffix_Parse': '',
            'I_DirectionPrefix_Parse': '',
            'I_TypeSuffix_Parse': '',
            'I_DirectionSuffix_Parse': '',
            'MuniCode_Parse': '',
            'JurisCode_Parse': '',
            'GAPID': '',
            'DISTRICT': '',
            'GRID': '',
            'IsAddressFROMNonUS': '',
            'LOCUniqID': '',
            'TypePrefix': '',

            'Division': '',
            'Field_office': '',
            'Direction': '',

            'GCModifier': '',
            'Location_ID': '',
            'KeyMAP': '',
            'MP_Number': null,
            'MP_Prefix': '',
            'Milepost': '',
            'MP_Suffix': '',
            'NSPDType': '',
            'NSPDUniqueID': '',
            'SegmentRange': '',
            'CrossingsDOTNum': '',
            'CrossingsFullName': '',
            'NSPDName': '',
            'XRMSDisplayText': '',
        });
        setErrors({
            ...errors,
            'StreetError': '',  'CountryIDError': '', 'StateError': '', 'CityIDError': '', 'ZipCodeIDError': '', 'ApartmentTypeError': '',
        });
    }

    const saveVerifyLocation = () => {
        // console.log(locationVal);
        AddDeleteUpadate('MasterLocation/Insert_Location', locationVal).then((res) => {
            if (res.success) {
                console.log(res)
                toastifySuccess(res.Message);
                setModalStatus(false);
                if (res.LocationID) {
                    setValue({
                        ...value,
                        ['crimelocationid']: res.LocationID,
                        ['CrimeLocation']: res.NonVerifyAddress,
                    });
                    get_Add_Single_Data(res.LocationID);
                }
                setErrors({ ...errors, ['StreetError']: '' });
                Reset();
            } else {
                console.log(res);
            }
        })
    }

    const onCloseLocation = () => {
        setValue(pre => { return { ...pre, ['IsVerify']: pre.IsVerify } });
        Reset();
    }

    // Custom Style
    const colourStyles = {
        control: (styles) => ({
            ...styles, backgroundColor: "#fce9bf",
            height: 20,
            minHeight: 45,
            fontSize: 18,
            margintop: 2,
            boxShadow: 0,
        }),
    }

    const customStylesWithOutColor = {
        control: base => ({
            ...base,
            height: 20,
            minHeight: 42,
            fontSize: 18,
            margintop: 2,
            boxShadow: 0,
        }),
    };
    useEffect(() => {
        if (locationVal?.IsUsLocation) ResetFields_On_Change(locationVal?.IsUsLocation);
    }, [locationVal?.IsUsLocation])

    const ResetFields_On_Change = (Code) => {
        if (Code) {
            setLocationVal({
                ...locationVal,
                'PremiseNo': '',
                'PremiseNo_Parse': '',
                'I_PremiseNo_Parse': '',
                'Street': '',
                'Street_Parse': '',
                'I_Street_Parse': '',
                'CommonPlace': '',
                'Commonplace_Parse': '',
                'ApartmentNo': '',
                'ApartmentNo_Parse': '',
                'ApartmentType': '',
                'ApartmentType_Parse': '',
                'CountryID': '',
                'Country': '',
                'State': '',
                'StateFullName': '',
                'CityID': '',
                'City': '',
                'ZipCodeID': '',
                'ZipCode': '',

                //-------------------DrpData--------------------

                'DirectionPrefix': '',
                'DirectionSufix': '',
                'DirectionPrefix_Parse': '',
                'DirectionSuffix_Parse': '',
                'TypeSufix': '',
                'TypePrefix': '',
                'TypeSuffix_Parse': '',
            });
        }
    }

    return (
        <>
            {
                modalStatus ?
                    <>
                        <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="MobileVerifyModal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="false">
                            <div class="modal-dialog modal-dialog-centered modal-xl " role="document" >
                                <div class="modal-content" >
                                    <div class="modal-body">
                                        <div className="m-1">
                                            <div className="row px-2" >
                                                <div className="form-check">
                                                    {
                                                        locationVal?.IsUsLocation !== 'N' ?
                                                            <>
                                                                <input className="form-check-input" type="radio" onChange={HandleChange} value={'Y'} checked={locationVal.IsUsLocation != 'N' ? true : false} name="IsUsLocation" id="flexRadioDefault1" />
                                                            </>
                                                            :
                                                            <input className="form-check-input" type="radio" onChange={HandleChange} value={'Y'} name="IsUsLocation" id="flexRadioDefault1" />
                                                    }
                                                    <label className="form-check-label" htmlFor="flexRadioDefault1">
                                                        US
                                                    </label>
                                                </div>
                                                <div className="form-check ml-4">
                                                    {
                                                        locationVal.IsUsLocation === 'N' ?
                                                            <>
                                                                <input className="form-check-input" onChange={HandleChange} value={'N'} checked={locationVal.IsUsLocation} type="radio" name="IsUsLocation" id="flexRadioDefault2" />
                                                            </>
                                                            :
                                                            <input className="form-check-input" onChange={HandleChange} value={'N'} type="radio" name="IsUsLocation" id="flexRadioDefault2" />
                                                    }
                                                    <label className="form-check-label" htmlFor="flexRadioDefault2">
                                                        Non-US
                                                    </label>
                                                </div>
                                            </div>
                                            {
                                                locationVal?.IsUsLocation !== 'N' ?
                                                    <>
                                                        <fieldset style={{ border: '1px solid gray' }}>
                                                            <legend style={{ fontWeight: 'bold' }}>Non-Verified Address</legend>
                                                            <div className="row">
                                                                <div className="col-12">
                                                                    <div className="row">
                                                                        <p className='col-12 ' style={{ marginTop: '-10px', marginBottom: '5px', textDecoration: 'underline', fontWeight: 'bold' }}>Real Address</p>
                                                                        <div class="col-6 col-md-6  col-lg-2">
                                                                            <div className="text-mobile">
                                                                                <input type="text" name='PremiseNo' id='PremiseNo' value={locationVal?.PremiseNo} onChange={HandleChange} required />
                                                                                <label className=''>Premise</label>
                                                                            </div>
                                                                        </div>
                                                                        <div class="col-6 col-md-6  col-lg-2" style={{ marginTop: '-5px' }}>
                                                                            <div class=" text__dropdwon">
                                                                                <Select
                                                                                    name="DirectionPrefix"
                                                                                    styles={customStylesWithOutColor}
                                                                                    value={dirPreFixSufixData?.filter((obj) => obj.value === locationVal?.DirectionPrefix)}
                                                                                    isClearable
                                                                                    options={dirPreFixSufixData}
                                                                                    onChange={(e) => selectHandleChange(e, 'DirectionPrefix')}
                                                                                    placeholder="Select..."
                                                                                />
                                                                                <label htmlFor='' className='pt-2'>Dir Pre</label>
                                                                            </div>
                                                                        </div>
                                                                        <div class="col-6 col-md-6  col-lg-4">
                                                                            <div className="text-mobile">
                                                                                <input type="text" name='Street' id='Street' className='requiredColor' value={locationVal?.Street} onChange={HandleChange} required />
                                                                                <label className=''>Street Name</label>
                                                                                {errors.StreetError !== 'true' ? (
                                                                                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.StreetError}</span>
                                                                                ) : null}
                                                                            </div>
                                                                        </div>
                                                                        <div class="col-6 col-md-6  col-lg-2 " style={{ marginTop: '-5px' }}>
                                                                            <div class=" text__dropdwon">

                                                                                <Select
                                                                                    name="TypeSufix"
                                                                                    styles={customStylesWithOutColor}
                                                                                    value={typeSuffixData?.filter((obj) => obj.value === locationVal?.TypeSufix)}
                                                                                    isClearable
                                                                                    options={typeSuffixData}
                                                                                    onChange={(e) => selectHandleChange(e, 'TypeSufix')}
                                                                                    placeholder="Select..."
                                                                                />
                                                                                <label htmlFor='' className='pt-2'>Ty Suf</label>
                                                                            </div>
                                                                        </div>
                                                                        <div class="col-6 col-md-6  col-lg-2 " style={{ marginTop: '-5px' }}>
                                                                            <div class=" text__dropdwon">
                                                                                <Select
                                                                                    name="DirectionSufix"
                                                                                    styles={customStylesWithOutColor}
                                                                                    value={dirPreFixSufixData?.filter((obj) => obj.value === locationVal?.DirectionSufix)}
                                                                                    isClearable
                                                                                    options={dirPreFixSufixData}
                                                                                    onChange={(e) => selectHandleChange(e, 'DirectionSufix')}
                                                                                    placeholder="Select..."
                                                                                />
                                                                                <label htmlFor='' className='pt-2'>Dir Suf</label>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <hr />
                                                                    <div className="row" >
                                                                        <p className='col-12 ' style={{ marginTop: '-10px', marginBottom: '5px', textDecoration: 'underline', fontWeight: 'bold' }}>Intersection</p>
                                                                        <div class="col-6 col-md-6  col-lg-2 ">
                                                                            <div className="text-mobile">
                                                                                <input type="text" name='PremiseNo_Parse' id='PremiseNo_Parse' value={locationVal?.PremiseNo_Parse} onChange={HandleChange} required />
                                                                                <label className=''>Premise</label>
                                                                            </div>
                                                                        </div>
                                                                        <div class="col-6 col-md-6  col-lg-2 " style={{ marginTop: '-5px' }}>
                                                                            <div class=" text__dropdwon">
                                                                                <Select
                                                                                    name="DirectionPrefix_Parse"
                                                                                    styles={customStylesWithOutColor}
                                                                                    value={dirPreFixSufixData?.filter((obj) => obj.value === locationVal?.DirectionPrefix_Parse)}
                                                                                    isClearable
                                                                                    options={dirPreFixSufixData}
                                                                                    onChange={(e) => selectHandleChange(e, 'DirectionPrefix_Parse')}
                                                                                    placeholder="Select..."
                                                                                />
                                                                                <label htmlFor='' className='pt-2'>Dir Pre-P</label>
                                                                            </div>
                                                                        </div>
                                                                        <div class="col-6 col-md-6  col-lg-4">
                                                                            <div className="text-mobile">
                                                                                <input type="text" name='Street_Parse' id='Street_Parse' value={locationVal?.Street_Parse} onChange={HandleChange} required />
                                                                                <label className=''>Street Name</label>
                                                                            </div>
                                                                        </div>
                                                                        <div class="col-6 col-md-6  col-lg-2 " style={{ marginTop: '-5px' }}>
                                                                            <div class=" text__dropdwon">
                                                                                <Select
                                                                                    name="TypeSuffix_Parse"
                                                                                    styles={customStylesWithOutColor}
                                                                                    value={typeSuffixData?.filter((obj) => obj.value === locationVal?.TypeSuffix_Parse)}
                                                                                    isClearable
                                                                                    options={typeSuffixData}
                                                                                    onChange={(e) => selectHandleChange(e, 'TypeSuffix_Parse')}
                                                                                    placeholder="Select..."
                                                                                />
                                                                                <label htmlFor='' className='pt-2'>Ty Suf-P</label>
                                                                            </div>
                                                                        </div>
                                                                        <div class="col-6 col-md-6  col-lg-2 " style={{ marginTop: '-5px' }}>
                                                                            <div class=" text__dropdwon">

                                                                                <Select
                                                                                    name="DirectionSuffix_Parse"
                                                                                    styles={customStylesWithOutColor}
                                                                                    value={dirPreFixSufixData?.filter((obj) => obj.value === locationVal?.DirectionSuffix_Parse)}
                                                                                    isClearable
                                                                                    options={dirPreFixSufixData}
                                                                                    onChange={(e) => selectHandleChange(e, 'DirectionSuffix_Parse')}
                                                                                    placeholder="Select..."
                                                                                />
                                                                                <label htmlFor='' className='pt-2'>Dir Suf-P</label>
                                                                            </div>
                                                                        </div>
                                                                        <div class="col-6 col-md-6  col-lg-6 mt-3">
                                                                            <div className="text-mobile">
                                                                                <input type="text" name='CommonPlace' id='CommonPlace' value={locationVal?.CommonPlace} onChange={HandleChange} required />
                                                                                <label className=''>Common Place</label>
                                                                            </div>
                                                                        </div>
                                                                        <div class="col-6 col-md-6  col-lg-2 mt-3">
                                                                            <div className="text-mobile">
                                                                                <input type="text" name='ApartmentNo' id='ApartmentNo' value={locationVal?.ApartmentNo} onChange={HandleChange} required />
                                                                                <label className=''>Apartment</label>
                                                                            </div>
                                                                        </div>
                                                                        <div class="col-6 col-md-6  col-lg-4 " style={{ marginTop: '10px' }}>
                                                                            <div className="text__dropdwon">
                                                                                <Select
                                                                                    name="ApartmentType"
                                                                                    styles={locationVal?.ApartmentNo ? colourStyles : customStylesWithOutColor}
                                                                                    value={apartmentTypeDrp?.filter((obj) => obj.value === locationVal?.ApartmentType)}
                                                                                    isClearable
                                                                                    options={apartmentTypeDrp}
                                                                                    onChange={(e) => selectHandleChange(e, 'ApartmentType',)}
                                                                                    placeholder="Select..."
                                                                                    isDisabled={locationVal?.ApartmentNo ? false : true}
                                                                                />
                                                                                <label htmlFor="" className='pt-2'>Apartment Type</label>
                                                                                {errors.ApartmentTypeError !== 'true' ? (
                                                                                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ApartmentTypeError}</span>
                                                                                ) : null}
                                                                            </div>
                                                                        </div>
                                                                        <div class="col-6 col-md-6  col-lg-4   pt-2">
                                                                            <div className="text__dropdwon">
                                                                                <Select
                                                                                    name="State"
                                                                                    menuPlacement='top'
                                                                                    styles={colourStyles}
                                                                                    value={stateList?.filter((obj) => obj.value === locationVal?.State)}
                                                                                    isClearable
                                                                                    options={stateList}
                                                                                    onChange={(e) => selectHandleChange(e, 'State', 'StateFullName')}
                                                                                    placeholder="Select..."
                                                                                />
                                                                                <label htmlFor="" className='pt-2'>State</label>
                                                                                {errors.StateError !== 'true' ? (
                                                                                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.StateError}</span>
                                                                                ) : null}
                                                                            </div>
                                                                        </div>
                                                                        <div class="col-6 col-md-6  col-lg-4 mt-2">
                                                                            <div className="text__dropdwon">
                                                                                <Select
                                                                                    name="CityID"
                                                                                    styles={colourStyles}
                                                                                    menuPlacement='top'
                                                                                    value={cityList?.filter((obj) => obj.value === locationVal?.CityID)}
                                                                                    isClearable
                                                                                    options={cityList}
                                                                                    onChange={(e) => selectHandleChange(e, 'CityID', 'City')}
                                                                                    placeholder="Select..."
                                                                                />
                                                                                <label htmlFor="" className='pt-2'>City</label>
                                                                                {errors.CityIDError !== 'true' ? (
                                                                                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CityIDError}</span>
                                                                                ) : null}
                                                                            </div>
                                                                        </div>
                                                                        <div class="col-6 col-md-6  col-lg-4  mt-2">
                                                                            <div className="text__dropdwon">
                                                                                <Select
                                                                                    name="ZipCodeID"
                                                                                    styles={customStylesWithOutColor}
                                                                                    value={zipList?.filter((obj) => obj.value === locationVal?.ZipCodeID)}
                                                                                    isClearable
                                                                                    options={zipList}
                                                                                    onChange={(e) => selectHandleChange(e, 'ZipCodeID', 'ZipCode')}
                                                                                    placeholder="Select..."
                                                                                />
                                                                                <label htmlFor="" className='pt-2'>Zip</label>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </fieldset>
                                                    </>
                                                    :
                                                    <>
                                                        <fieldset style={{ border: '1px solid gray' }}>
                                                            <legend style={{ fontWeight: 'bold' }}>Non-Verified Address</legend>
                                                            <div className="row">
                                                                <div className="col-12">
                                                                    <div className="row">
                                                                        <div className="col-12  col-md-12 col-lg-12 mt-4  text-mobile">
                                                                            <textarea name='Street' id="Street" onChange={HandleChange} value={locationVal?.Street} cols="30" rows='2'
                                                                                className="form-control pt-2 pb-2" ></textarea>
                                                                            <label htmlFor="" className='px-1'>Real Address</label>
                                                                        </div>
                                                                        <div class="col-6 col-md-6  col-lg-3 mt-1">
                                                                            <div class=" text__dropdwon">

                                                                                <Select
                                                                                    name="CountryID"
                                                                                    styles={colourStyles}
                                                                                    value={CountryIDList?.filter((obj) => obj.value === locationVal?.CountryID)}
                                                                                    isClearable
                                                                                    options={CountryIDList}
                                                                                    onChange={(e) => selectHandleChange(e, 'CountryID', 'Country')}
                                                                                    placeholder="Select..."
                                                                                />
                                                                                <label htmlFor='' className='pt-1'>Country</label>
                                                                                {errors.CountryIDError !== 'true' ? (
                                                                                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CountryIDError}</span>
                                                                                ) : null}
                                                                            </div>
                                                                        </div>
                                                                        <div class="col-6 col-md-6  col-lg-3 mt-1">
                                                                            <div class="text-mobile">
                                                                                <input type="text" name='Statefullname' id='Statefullname' className='requiredColor' value={locationVal?.Statefullname} onChange={HandleChange} required />
                                                                                {/* {
                                                                                    locationVal.IsUsLocation === 'Y' ?
                                                                                        <>
                                                                                            <Select
                                                                                                name="State"
                                                                                                styles={colourStyles}
                                                                                                value={stateList?.filter((obj) => obj.value === locationVal?.State)}
                                                                                                isClearable
                                                                                                options={stateList}
                                                                                                onChange={(e) => selectHandleChange(e, 'State', 'StateFullName')}
                                                                                                placeholder="Select..."
                                                                                            />
                                                                                        </>
                                                                                        :
                                                                                        <>
                                                                                            <Select
                                                                                                name="State"
                                                                                                styles={colourStyles}
                                                                                                value={bIstateList?.filter((obj) => obj.value === locationVal?.State)}
                                                                                                isClearable
                                                                                                options={bIstateList}
                                                                                                onChange={(e) => selectHandleChange(e, 'State', 'StateFullName')}
                                                                                                placeholder="Select..."
                                                                                            />
                                                                                        </>
                                                                                } */}
                                                                                <label htmlFor='' className='pt-1'>State</label>
                                                                                {errors.StateError !== 'true' ? (
                                                                                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.StateError}</span>
                                                                                ) : null}
                                                                            </div>
                                                                        </div>
                                                                        <div class="col-6 col-md-6  col-lg-3 mt-1">
                                                                            <div class="text-mobile">
                                                                                <input type="text" name='City' id='City' className='requiredColor' value={locationVal?.City} onChange={HandleChange} required />
                                                                                {/* <Select
                                                                                    name="CityID"
                                                                                    styles={colourStyles}
                                                                                    value={cityList?.filter((obj) => obj.value === locationVal?.CityID)}
                                                                                    isClearable
                                                                                    options={cityList}
                                                                                    onChange={(e) => selectHandleChange(e, 'CityID', 'City')}
                                                                                    placeholder="Select..."
                                                                                /> */}
                                                                                <label htmlFor='' className='pt-1'>City</label>
                                                                                {errors.CityIDError !== 'true' ? (
                                                                                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CityIDError}</span>
                                                                                ) : null}
                                                                            </div>
                                                                        </div>
                                                                        <div class="col-6 col-md-6  col-lg-3 mt-1">
                                                                            <div class="text-mobile">
                                                                                <input type="text" name='ZipCode' id='ZipCode' value={locationVal?.ZipCode} onChange={HandleChange} required />
                                                                                {/* <Select
                                                                                    name="ZipCodeID"
                                                                                    styles={customStylesWithOutColor}
                                                                                    value={zipList?.filter((obj) => obj.value === locationVal?.ZipCodeID)}
                                                                                    isClearable
                                                                                    options={zipList}
                                                                                    onChange={(e) => selectHandleChange(e, 'ZipCodeID', 'ZipCode')}
                                                                                    placeholder="Select..."
                                                                                /> */}
                                                                                <label htmlFor='' className='pt-1'>Zip</label>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </fieldset>
                                                    </>
                                            }
                                        </div>
                                    </div>
                                    <div className="btn-box text-right  mr-1 mb-1" style={{ marginTop: '-10px' }}>
                                        <button type="button" class="btn btn-sm btn-success mr-1  new-button" onClick={() => { check_Validation_Error() }} >Save</button>
                                        {/* <button type="button" class="btn btn-sm btn-success mr-1" onClick={() => { saveVerifyLocation() }} >Save</button> */}
                                        <button type="button" data-dismiss="modal" class="btn btn-sm btn-success mr-1  new-button" onClick={() => { onCloseLocation() }} >Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                    :
                    <> </>
            }
        </>
    )
}

export default MobileVerifyLocation
