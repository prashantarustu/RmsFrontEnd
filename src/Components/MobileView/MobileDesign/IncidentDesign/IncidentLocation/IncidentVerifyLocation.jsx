import React, { useState } from 'react'
import { Decrypt_Id_Name } from '../../../../Common/Utility';
import Select from "react-select";
import { Comman_changeArrayFormat, Comman_changeArrayFormat_With_Name } from '../../../../Common/ChangeArrayFormat';
import { fetchPostData } from '../../../../hooks/Api';
import { RequiredFieldIncident } from '../../../../Pages/Utility/Personnel/Validation';
import { RequiredFieldSpaceNotAllow } from '../../../../Pages/Agency/AgencyValidation/validators';
import { Link } from 'react-router-dom';

const IncidentVerifyLocation = (props) => {
    const { modalStatus, setModalStatus, value, setValue, addVerifySingleData, get_Add_Single_Data } = props
    //--------------------------DropDown------------------------------
    const [dirPreFixSufixData, setDirPreFixSufixData] = useState([]);
    const [typeSuffixData, setTypeSuffixData] = useState([]);
    const [apartmentTypeDrp, setApartmentTypeDrp] = useState([]);
    const [CountryIDList, setCountryIDList] = useState([]);
    const [stateList, setStateList] = useState([]);
    const [bIstateList, setBIStateList] = useState([]);
    const [cityList, setCityList] = useState([]);
    const [zipList, setZipList] = useState([]);
    const [locationVal, setLocationVal] = useState({
        'AgencyID': localStorage.getItem("AgencyID") ? Decrypt_Id_Name(localStorage.getItem("AgencyID"), "AForAgencyID") : '',
        'AgencyName': localStorage.getItem('Agency_Name') ? Decrypt_Id_Name(sessionStorage.getItem('Agency_Name'), 'ANForAgencyName') : '',
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



    });
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
    const [errors, setErrors] = useState({
        'StreetError': '', 'CountryIDError': '', 'StateError': '', 'CityIDError': '', 'ApartmentTypeError': '',
    })
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

    const onCloseLocation = () => {
        setValue(pre => { return { ...pre, ['IsVerify']: pre.IsVerify } });
        Reset();
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
    return (
        <>

            <div className="section-body view_page_design " style={{ background: "rgba(0,0,0, 0.5)", padding: '10px 10px' }}>
                <div className="row clearfix" >
                    <div className="col-12 col-sm-12">
                        <div className="card Agency  " >
                            <div className="card-body">
                                <div className="row">
                                    <div className={`col-12 col-md-12 col-lg-12 px-0`}>

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
                                                                            <label className=''>Street Name
                                                                                <span className='text-danger pl-1'>
                                                                                    {errors.StreetError !== 'true' ? (
                                                                                        <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.StreetError}</span>
                                                                                    ) : null}
                                                                                </span>
                                                                            </label>
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
                                                                            <label htmlFor="" className='pt-2'>State
                                                                                <span className='text-danger pl-1'>

                                                                                    {errors.StateError !== 'true' ? (
                                                                                        <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.StateError}</span>
                                                                                    ) : null}
                                                                                </span>

                                                                            </label>
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
                                                                            <label htmlFor="" className='pt-2'>City
                                                                                <span className='text-danger pl-1'>

                                                                                    {errors.CityIDError !== 'true' ? (
                                                                                        <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CityIDError}</span>
                                                                                    ) : null}
                                                                                </span>
                                                                            </label>
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
                                                                    <div class="col-6 col-md-6  col-lg-3 mt-1 pt-1">
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
                                                                            <label htmlFor='' className='pt-2'>Country
                                                                                <span className='text-danger pl-1'>
                                                                                    {errors.CountryIDError !== 'true' ? (
                                                                                        <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CountryIDError}</span>
                                                                                    ) : null}

                                                                                </span>
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div class="col-6 col-md-6  col-lg-3 mt-2 pt-2">
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
                                                                            <label htmlFor=''>State

                                                                                <span className='text-danger pl-1'>

                                                                                    {errors.StateError !== 'true' ? (
                                                                                        <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.StateError}</span>
                                                                                    ) : null}
                                                                                </span>
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div class="col-6 col-md-6  col-lg-3 mt-2 pt-2">
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
                                                                            <label htmlFor=''>City
                                                                                <span className='text-danger pl-1'>

                                                                                    {errors.CityIDError !== 'true' ? (
                                                                                        <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CityIDError}</span>
                                                                                    ) : null}
                                                                                </span>

                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div class="col-6 col-md-6  col-lg-3 mt-2 pt-2">
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
                                                                            <label htmlFor=''>Zip</label>
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
                            </div>
                        <div className="btn-box text-right col-12  mr-1 mb-1" >
                            <button type="button" class="btn btn-sm btn-success mr-1  new-button" onClick={() => { check_Validation_Error() }} >Save</button>
                            <Link to={'/mobile-incident'}>
                                <button type="button" data-dismiss="modal" class="btn btn-sm btn-success mr-1  new-button" onClick={() => { onCloseLocation() }} >Close</button>
                            </Link>
                        </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default IncidentVerifyLocation