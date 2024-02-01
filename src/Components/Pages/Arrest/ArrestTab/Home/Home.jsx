
import React from 'react'
import { Link, useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { useState } from 'react';
import { Decrypt_Id_Name, EncryptedList, Encrypted_Id_Name, getShowingDateText, getShowingMonthDateYear } from '../../../../Common/Utility';
import { useEffect } from 'react';
import { AddDeleteUpadate, AddDeleteUpadate_FormData, fetchData, fetchPostData } from '../../../../hooks/Api';
import { Comman_changeArrayFormat, sixColArray, threeColArray } from '../../../../Common/ChangeArrayFormat';
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import { useContext } from 'react';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { RequiredFieldIncident } from '../../../Utility/Personnel/Validation';
import FindListDropDown from '../../../../Common/FindListDropDown';
import { ArrestListDropDownArray } from '../../../../Utility/ListDropDownArray/ListDropArray';
import ConfirmModal from '../../ConfirmModal';
import defualtImage from '../../../../../img/uploadImage.png'
import { Carousel } from 'react-responsive-carousel';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import ChangesModal from '../../../../Common/ChangesModal';
import IdentifyFieldColor from '../../../../Common/IdentifyFieldColor';

const Home = ({ setJuvinile, setPoliceForce }) => {

    const navigate = useNavigate();
    const useQuery = () => new URLSearchParams(useLocation().search);
    let openPage = useQuery().get('page');

    const { get_Arrest_Count, localStoreArray, setIncStatus, get_LocalStorage, setLocalStoreArray, updateCount, setUpdateCount, ArresteName, setArrestName, policeForceDrpData, get_Police_Force, arresteeDrpData, setArresteeDrpData, get_Arrestee_Drp_Data, changesStatusCount, setChangesStatus, changesStatus, get_Incident_Count, deleteStoreData, storeData, arrestStatus, setArrestStatus, } = useContext(AgencyContext);

    const [ArrestDate, setArrestDate] = useState();
    const [arrestingAgencyDrpData, setAgencyNameDrpData] = useState([]);
    const [arrestTypeDrpData, setArrestTypeDrpData] = useState([]);
    const [supervisorDrpData, setSuperVisorDrpData] = useState([]);/// head of Agency Data
    const [rightsDrpData, setRightsDrpData] = useState([]);
    const [JuvenileDispoDrp, setJuvenileDisDrp] = useState([]);
    const [rightGivenCode, setRightGivenCode] = useState('N');
    const [ArrestID, setArrestID] = useState('');
    const [Editval, setEditval] = useState();
    const [show, setShowModal] = useState(false);
    const [arresteeChange, setArresteeChange] = useState();

    //---------------------Images-------------------------------------
    const [arrestMultiImg, setArrestMultiImg] = useState([])
    const [imageid, setImageId] = useState('');

    const [MainIncidentID, setMainIncidentID] = useState('');
    const [MasterNameID, setMasterNameID] = useState('');
    const [LoginAgencyID, setLoginAgencyID] = useState('');
    const [LoginPinID, setLoginPinID,] = useState('');
    const [AgencyName, setAgencyName] = useState('');

    const [value, setValue] = useState({
        'AgencyID': '',
        'ArrestNumber': '',
        'IncidentID': '',
        'CreatedByUserFK': '',
        'IsJuvenileArrest': '',
        'ArrestDtTm': '',
        'ArrestingAgencyID': '',
        'ArrestTypeID': '',
        'SupervisorID': '',
        'PoliceForceID': '',
        'RightsGivenID': '',
        'JuvenileDispositionID': '',
        'PhoneNo': '',
        'GivenByID': '',
        'PrimaryOfficerID': '',
        'ArresteeID': '',
        'ArresteeLable': 0,
        //Remanings
        'ModifiedByUserFK': '',
        'ArrestID': '',
    });

    const [errors, setErrors] = useState({
        'ArresteeIDError': '',
        'PrimaryOfficerIDError': '',
        'ArrestDtTmError': '',
        // 'PhoneNoError': '',
    })

    const localStore = {
        Value: "",
        UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
        Key: JSON.stringify({ AgencyID: "", PINID: "", IncidentID: '', ArrestID: '', }),
    }

    useEffect(() => {
        if (!localStoreArray?.AgencyID || !localStoreArray?.PINID || !localStoreArray?.IncidentID) {
            get_LocalStorage(localStore);
        }
    }, []);

    // Onload Function
    useEffect(() => {
        if (localStoreArray) {
            // console.log(localStoreArray)
            if (localStoreArray?.AgencyID && localStoreArray?.PINID) {
                setLoginAgencyID(localStoreArray?.AgencyID); setAgencyName(localStoreArray?.Agency_Name);
                setLoginPinID(localStoreArray?.PINID);
                setValue({ ...value, 'IncidentID': localStoreArray?.IncidentID, 'CreatedByUserFK': localStoreArray?.PINID, 'AgencyID': localStoreArray?.AgencyID })
                if (localStoreArray.IncidentID) { setMainIncidentID(parseInt(localStoreArray?.IncidentID)); } else { setMainIncidentID(0) }
                if (localStoreArray.ArrestID) {
                    setArrestID(parseInt(localStoreArray?.ArrestID));
                } get_Arrest_Count(localStoreArray?.ArrestID)
            } else {
                setArrestID(''); GetSingleData('');
            }
        }
    }, [localStoreArray])

    useEffect(() => {
        setValue({ ...value, 'IncidentID': MainIncidentID, 'CreatedByUserFK': LoginPinID, 'AgencyID': LoginAgencyID })
    }, [MainIncidentID]);

    useEffect(() => {
        document.addEventListener('load', function () {
            document.getElementById('#myModal').modal('show');
        });
    }, [])

    const check_Validation_Error = (e) => {
        if (RequiredFieldIncident(value.ArresteeID)) {
            setErrors(prevValues => { return { ...prevValues, ['ArresteeIDError']: RequiredFieldIncident(value.ArresteeID) } })
        }
        if (RequiredFieldIncident(value.PrimaryOfficerID)) {
            setErrors(prevValues => { return { ...prevValues, ['PrimaryOfficerIDError']: RequiredFieldIncident(value.PrimaryOfficerID) } })
        }
        if (RequiredFieldIncident(value.ArrestDtTm)) {
            setErrors(prevValues => { return { ...prevValues, ['ArrestDtTmError']: RequiredFieldIncident(value.ArrestDtTm) } })
        }
    }

    // Check All Field Format is True Then Submit 
    const { ArresteeIDError, PrimaryOfficerIDError, ArrestDtTmError } = errors

    useEffect(() => {
        if (PrimaryOfficerIDError === 'true' && ArrestDtTmError === 'true' && ArresteeIDError === 'true' && !show) {
            if (ArrestID) { update_Arrest() }
            else { insert_Arrest_Data() }
        }
    }, [PrimaryOfficerIDError, ArrestDtTmError, ArresteeIDError, show])

    useEffect(() => {
        if (ArrestID) {
            GetSingleData(ArrestID);
        } else {
            reset_Value();
        }
    }, [ArrestID]);

    const GetSingleData = (ArrestID) => {
        const val = { 'ArrestID': ArrestID, }
        fetchPostData('Arrest/GetSingleData_Arrest', val)
            .then((res) => {
                if (res.length > 0) {
                    setEditval(res);
                } else { setEditval([]) }
            })
    }

    useEffect(() => {
        if (ArrestID) {
            get_Arrest_MultiImage(ArrestID)
            get_Arrestee_Drp_Data(openPage, 0, MainIncidentID);
            setValue({
                ...value,
                'ArrestNumber': Editval[0]?.ArrestNumber,
                'IsJuvenileArrest': Editval[0]?.IsJuvenileArrest,
                'ArrestDtTm': Editval[0]?.ArrestDtTm ? getShowingDateText(Editval[0]?.ArrestDtTm) : "",
                'ArrestingAgencyID': Editval[0]?.ArrestingAgencyID,
                'ArrestTypeID': Editval[0]?.ArrestTypeID,
                'SupervisorID': Editval[0]?.SupervisorID,
                'PoliceForceID': Editval[0]?.PoliceForceID,
                'ArresteeID': Editval[0]?.ArresteeID,
                'RightsGivenID': Editval[0]?.RightsGivenID,
                'JuvenileDispositionID': Editval[0]?.JuvenileDispositionID,
                'PhoneNo': Editval[0]?.PhoneNo,
                'GivenByID': Editval[0]?.GivenByID,
                'PrimaryOfficerID': Editval[0]?.PrimaryOfficerID,
                'ArrestID': Editval[0]?.ArrestID,
                'ModifiedByUserFK': LoginPinID,
            });
            storeData({ 'ArrestNumber': Editval[0]?.ArrestNumber, 'ArresteeName': Editval[0]?.Arrestee_Name, 'ArresteeID': Editval[0]?.ArresteeID });
            setArrestName(Editval[0]?.Arrestee_Name ? Editval[0]?.Arrestee_Name : '');
            setArrestDate(Editval[0]?.ArrestDtTm ? new Date(Editval[0]?.ArrestDtTm) : '');
            setRightGivenCode(Get_Given_Code(Editval, policeForceDrpData))

            if (Editval[0]?.IsJuvenileArrest === true || Editval[0]?.IsJuvenileArrest === 'true') {
                setJuvinile(true);
            } else {
                setJuvinile(false);
            }
            //-----------------Don't remove it By Dev Kashyap--------------19/01/2024
            // policeForceDrpData?.filter(val => {
            //     if (val.value === Editval[0]?.PoliceForceID) {
            //         if (val.id === 'Y') {
            //             setPoliceForce(true)
            //         } else {
            //             setPoliceForce(false);
            //         }
            //     }
            // });
        } else {
            setValue({
                ...value,
                'ArrestNumber': '',
                'IsJuvenileArrest': '',
                'ArrestDtTm': '',
                'ArrestingAgencyID': '',
                'ArrestTypeID': '',
                'SupervisorID': '',
                'PoliceForceID': '',
                'RightsGivenID': '',
                'JuvenileDispositionID': '',
                'PhoneNo': '',
                'GivenByID': '',
                'PrimaryOfficerID': '',
                'ModifiedByUserFK': '',
            }); setArrestDate();
        }
    }, [Editval, changesStatusCount])

    useEffect(() => {
        policeForceDrpData?.filter(val => {
            if (val.value === value?.PoliceForceID) {
                if (val.id === 'Y') {
                    setPoliceForce(true)
                } else {
                    setPoliceForce(false);
                }
            }
        });
    }, [value?.PoliceForceID, policeForceDrpData]);

    useEffect(() => {
        get_Arresting_DropDown(LoginAgencyID, LoginPinID); Get_ArrestType_Drp(LoginAgencyID); get_Head_Of_Agency(LoginAgencyID); get_Rights_Given_Drp();
        get_Arrest_juvenile_Drp(LoginAgencyID);

        get_Arrestee_Drp_Data(openPage, 0, MainIncidentID);
        // if (arresteeDrpData?.length === 0) {
        // }
        if (policeForceDrpData?.length === 0) {
            get_Police_Force();
        }
    }, [LoginAgencyID, MainIncidentID])

    const get_Arrest_juvenile_Drp = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID
        }
        fetchPostData('ArrestJuvenileDisposition/GetDataDropDown_ArrestJuvenileDisposition', val).then((data) => {
            if (data) {
                setJuvenileDisDrp(Comman_changeArrayFormat(data, 'ArrestJuvenileDispositionID', 'Description'));
            }
            else {
                setJuvenileDisDrp([])
            }
        })
    };

    const get_Rights_Given_Drp = () => {
        fetchData('DropDown/GetDataDropDown_RightsGiven').then((data) => {
            if (data) {
                setRightsDrpData(threeColArray(data, 'RightGivenID', 'Description', 'Code'));
            }
            else {
                setRightsDrpData([])
            }
        })
    };

    const get_Head_Of_Agency = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID
        }
        fetchPostData('DropDown/GetData_HeadOfAgency', val).then((data) => {
            if (data) {
                setSuperVisorDrpData(Comman_changeArrayFormat(data, 'PINID', 'HeadOfAgency'));
            }
            else {
                setSuperVisorDrpData([])
            }
        })
    };

    const get_Arresting_DropDown = (LoginAgencyID, LoginPinID) => {
        const val = {
            AgencyID: LoginAgencyID,
            PINID: LoginPinID,
        }
        fetchPostData('Agency/GetData_Agency', val).then((data) => {
            if (data) {
                setAgencyNameDrpData(Comman_changeArrayFormat(data, 'AgencyID', 'Agency_Name'))
            } else {
                setAgencyNameDrpData([]);
            }
        })
    }

    const Get_ArrestType_Drp = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID
        }
        fetchPostData('ArrestType/GetDataDropDown_ArrestType', val).then((data) => {
            if (data) {
                setArrestTypeDrpData(Comman_changeArrayFormat(data, 'ArrestTypeID', 'Description'))
            } else {
                setArrestTypeDrpData([]);
            }
        })
    }

    const HandleChange = (e) => {
        if (e.target.name === "IsJuvenileArrest") {
            setChangesStatus(true)
            setValue({
                ...value,
                [e.target.name]: e.target.checked,
            });
        } else if (e.target.name === 'PhoneNo') {
            var ele = e.target.value.replace(/[^0-9\s]/g, "")
            if (ele.length === 10) {
                var cleaned = ('' + ele).replace(/\D/g, '');
                var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
                if (match) {
                    setChangesStatus(true)
                    setValue({
                        ...value,
                        [e.target.name]: match[1] + '-' + match[2] + '-' + match[3]
                    });
                }
            } else {
                ele = e.target.value.split('-').join('').replace(/[^0-9\s]/g, "");
                setChangesStatus(true)
                setValue({
                    ...value,
                    [e.target.name]: ele
                });
            }
        }
        else {
            setChangesStatus(true)
            setValue({
                ...value,
                [e.target.name]: e.target.value,
            });
        }
    };

    useEffect(() => {
        if (rightGivenCode !== "Y") {
            setValue({
                ...value,
                ['GivenByID']: ''
            })
        }
    }, [rightGivenCode])

    useEffect(() => {
        if (value.IsJuvenileArrest === false) {
            setValue({
                ...value,
                ['JuvenileDispositionID']: '',
                ['PhoneNo']: ''
            });
            setJuvinile(false);
        }
        //  else {
        //     setJuvinile(true);
        // }
    }, [value.IsJuvenileArrest])

    const ChangeDropDown = (e, name) => {
        if (e) {
            if (name === 'RightsGivenID') {
                setRightGivenCode(e.id)
                setChangesStatus(true)
                setValue({
                    ...value,
                    [name]: e.value
                })
            } else if (name === 'ArresteeID') {
                // console.log(e.DateOfBirth);
                if (!e.Gendre_Description || !e.Race_Description || !e.DateOfBirth || !e.LastName) {
                    setShowModal(true);
                    setArresteeChange(e);
                }
                var dobYear = new Date().getFullYear() - new Date(e.DateOfBirth).getFullYear();
                if (dobYear >= 18) {
                    setChangesStatus(true)
                    setValue({ ...value, [name]: e.value, ['IsJuvenileArrest']: false });
                    setJuvinile(false);
                } else {
                    setChangesStatus(true); setJuvinile(true);
                    setValue({ ...value, [name]: e.value, ['IsJuvenileArrest']: true });
                    setJuvinile(false);
                }
            } else {
                setChangesStatus(true)
                setValue({ ...value, [name]: e.value });

            }
        } else if (e === null) {
            if (name === 'RightsGivenID') {
                setChangesStatus(true)
                setValue({
                    ...value,
                    [name]: null
                })
                setRightGivenCode('N')
            } else {
                setChangesStatus(true)
                setValue({
                    ...value,
                    [name]: null
                })
            }
        } else {
            setChangesStatus(true)
            setValue({
                ...value,
                [name]: null
            })
        }
    }

    const insert_Arrest_Data = () => {
        AddDeleteUpadate('Arrest/Insert_Arrest', value).then((res) => {
            if (res.success) {
                toastifySuccess(res.Message);
                setChangesStatus(false)
                get_Arrest_Count(ArrestID)
                setArrestStatus(true);
                if (res.ArrestID) {
                    setArrestID(res.ArrestID);
                    storeData({ 'ArrestID': res.ArrestID, 'ArrestStatus': true })
                }
                setUpdateCount(updateCount + 1)
                setErrors({ ['ArresteeIDError']: '' });
                get_Incident_Count(MainIncidentID)
            }
        })
    }

    const update_Arrest = () => {
        AddDeleteUpadate('Arrest/Update_Arrest', value).then((res) => {
            toastifySuccess(res.Message);
            setChangesStatus(false)
            setUpdateCount(updateCount + 1);
            setErrors({
                ...errors,
                ['ArresteeIDError']: ''
            })
        })
    }

    const reset_Value = () => {
        setValue({
            ...value,
            'IsJuvenileArrest': '',
            'ArrestDtTm': '',
            'ArrestingAgencyID': '',
            'ArrestTypeID': '',
            'SupervisorID': '',
            'PoliceForceID': '',
            'ArresteeID': '',
            'RightsGivenID': '',
            'JuvenileDispositionID': '',
            'PhoneNo': '',
            'GivenByID': '',
            'PrimaryOfficerID': '',
            'ModifiedByUserFK': '',
        }); setArrestDate()
    }

    const Onclose = () => {
        if (!changesStatus) {
            if (openPage === 'ArrestSearch') {
                navigate('/arrest-search');
                deleteStoreData({ 'ArrestID': '', 'ArrestStatus': '', 'ArrestStatus': false, 'ArrestNumber': '' });
            } else {
                navigate("/arrest")
                deleteStoreData({ 'ArrestID': '', 'ArrestStatus': '', 'ArrestStatus': false, 'ArrestNumber': '' });
            }
        }
    }

    const startRef = React.useRef();
    const startRef1 = React.useRef();

    const onKeyDown = (e) => {
        if (e.keyCode === 9 || e.which === 9) {
            startRef.current.setOpen(false);
            startRef1.current.setOpen(false);
        }
    };

    // Custom Style
    const colourStyles = {
        control: (styles) => ({
            ...styles, backgroundColor: "#fce9bf",
            height: 20,
            minHeight: 30,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };

    // custuom style withoutColor
    const customStylesWithOutColor = {
        control: base => ({
            ...base,
            height: 20,
            minHeight: 30,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };

    //---------------------------------------- Image ------------------------------------------------
    const get_Arrest_MultiImage = (ArrestID) => {
        const val = {
            'ArrestID': ArrestID,
        }
        const val1 = {
            'ArrestID': 0,
        }
        fetchPostData('Arrest/GetData_ArrestPhoto', openPage === 'ArrestSearch' ? val1 : val)
            .then((res) => {
                if (res) { setArrestMultiImg(res); }
                else { setArrestMultiImg(); }
            })
    }

    const get_Image_File = (e) => {
        try {
            let currentFileType = e.target.files[0].type;
            let checkPng = currentFileType.indexOf("png");
            let checkJpeg = currentFileType.indexOf("jpeg");
            let checkJpg = currentFileType.indexOf("jpg");
            if (checkPng !== -1 || checkJpeg !== -1 || checkJpg !== -1) {
                // setImage(e.target.files[0]);
                upload_Image_File(e.target.files[0]);
            } else {
                toastifyError("Error: Invalid image file!");
            }
        } catch (error) {
            console.log(error);
        }
    }

    const upload_Image_File = (image) => {
        const val = {
            'ArrestID': ArrestID,
            'CreatedByUserFK': LoginPinID,
        }
        const val1 = {
            'ArrestID': 0,
            'CreatedByUserFK': LoginPinID,
        }
        const values = EncryptedList(JSON.stringify(openPage === 'ArrestSearch' ? val1 : val));
        var formdata = new FormData();
        formdata.append("Arrestphotopath", image);
        formdata.append("Data", values);
        AddDeleteUpadate_FormData('Arrest/Insert_ArrestPhoto', formdata)
            .then((res) => {
                if (res.success) {
                    get_Arrest_MultiImage(ArrestID)
                }
            })
            .catch(err => console.log(err))
    }

    const delete_Image_File = (e) => {
        e.preventDefault()
        const value = {
            'PhotoID': imageid,
            'DeletedByUserFK': LoginPinID
        }
        AddDeleteUpadate('Arrest/Delete_ArrestPhoto', value).then((data) => {
            if (data.success) {
                toastifySuccess(data?.Message);
                get_Arrest_MultiImage(ArrestID);
                if (openPage === 'ArrestSearch') {
                    GetSingleData(ArrestID);
                } else {
                    GetSingleData(ArrestID);
                }
            } else {
                toastifyError(data?.Message);
            }
        });
    }

    return (
        <>
            <div className="col-12 " id="display-not-form">
                <div className="col-12 col-md-12 col-lg-12 pt-2 p-0">
                    <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center">
                        <p className="p-0 m-0">Arrest Information</p>
                        <p className="p-0 m-0">
                            <div>
                                {
                                    ArrestID ?
                                        <>
                                            <Link to={"/arrest-charge"} className="px-2 py-0"  >
                                                <i className="fa fa-file"></i>
                                            </Link>
                                            <FindListDropDown
                                                array={ArrestListDropDownArray}
                                            />
                                        </>
                                        :
                                        <></>
                                }
                            </div>
                        </p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-md-12 col-lg-10 pt-2 p-0">
                        <div className="row">
                            <div className="col-12 col-md-12 col-lg-12 mt-2">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" onChange={HandleChange} name='IsJuvenileArrest' value={value?.IsJuvenileArrest} checked={value?.IsJuvenileArrest} id="flexCheckDefault" />
                                    <label class="form-check-label" for="flexCheckDefault">
                                        Juvenile Arrest
                                    </label>
                                </div>
                            </div>
                            <div className="col-6 col-md-4 col-lg-2 mt-1">
                                <div class="text-field">
                                    <input type="text" name='ArrestNumber' value={value?.ArrestNumber} className="readonlyColor" onChange={''} id='ArrestNumber' required readOnly />
                                    <label className="pt-1">Arrest Number</label>
                                </div>
                            </div>
                            <div className="col-6 col-md-8 col-lg-6 mt-1">
                                <div class="text-field">
                                    <input type="text" onChange={''} name='AgencyName' value={AgencyName ? AgencyName : ''}
                                        required
                                        className='readonlyColor'
                                        readOnly
                                    />
                                    <label className="pt-1">Agency</label>
                                </div>
                            </div>
                            <div className="col-6 col-md-4 col-lg-4 mt-1">
                                <div className=" dropdown__box">
                                    <Select
                                        name="ArrestingAgencyID"
                                        value={arrestingAgencyDrpData?.filter((obj) => obj.value === value?.ArrestingAgencyID)}
                                        styles={customStylesWithOutColor}
                                        isClearable
                                        options={arrestingAgencyDrpData}
                                        onChange={(e) => { ChangeDropDown(e, 'ArrestingAgencyID') }}
                                        placeholder="Select..."
                                    />
                                    <label htmlFor="">Arresting Agency</label>
                                </div>
                            </div>
                            <div className="col-6 col-md-4 col-lg-3  ">
                                <div className="dropdown__box">
                                    <DatePicker
                                        id='ArrestDtTm'
                                        name='ArrestDtTm'
                                        ref={startRef1}
                                        onKeyDown={onKeyDown}
                                        onChange={(date) => { setChangesStatus(true); setArrestDate(date); setValue({ ...value, ['ArrestDtTm']: date ? getShowingMonthDateYear(date) : null }) }}
                                        className='requiredColor'
                                        dateFormat="MM/dd/yyyy HH:mm"
                                        timeInputLabel
                                        showYearDropdown
                                        showMonthDropdown
                                        dropdownMode="select"
                                        isClearable={value?.ArrestDtTm ? true : false}
                                        selected={ArrestDate}
                                        placeholderText={value?.ArrestDtTm ? value.ArrestDtTm : 'Select...'}
                                        showTimeSelect
                                        timeIntervals={1}
                                        timeCaption="Time"
                                        autoComplete="Off"
                                        maxDate={new Date()}
                                    />
                                    <label htmlFor="" className='pt-1'>Arrest Date/Time</label>
                                    {errors.ArrestDtTmError !== 'true' ? (
                                        <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ArrestDtTmError}</span>
                                    ) : null}
                                </div>
                            </div>
                            <div className="col-6 col-md-4 col-lg-3 mt-1">
                                <div className="dropdown__box">
                                    <Select
                                        name="ArrestTypeID"
                                        value={arrestTypeDrpData?.filter((obj) => obj.value === value?.ArrestTypeID)}
                                        styles={customStylesWithOutColor}
                                        isClearable
                                        options={arrestTypeDrpData}
                                        onChange={(e) => { ChangeDropDown(e, 'ArrestTypeID') }}
                                        placeholder="Select..."
                                    />
                                    <label htmlFor="">Arrest Type</label>
                                </div>
                            </div>
                            <div className="col-6 col-md-4 col-lg-4 mt-1">
                                <div className=" dropdown__box">
                                    <Select
                                        name='SupervisorID'
                                        styles={customStylesWithOutColor}
                                        value={supervisorDrpData?.filter((obj) => obj.value === value?.SupervisorID)}
                                        isClearable
                                        options={supervisorDrpData}
                                        onChange={(e) => ChangeDropDown(e, 'SupervisorID')}
                                        placeholder="Select..."
                                    />
                                    <label htmlFor="">Supervisior</label>
                                </div>
                            </div>
                            <div className="col-6 col-md-4 col-lg-2 mt-1">
                                <div className=" dropdown__box">
                                    <Select
                                        name='PoliceForceID'
                                        styles={customStylesWithOutColor}
                                        value={policeForceDrpData?.filter((obj) => obj.value === value?.PoliceForceID)}
                                        isClearable
                                        options={policeForceDrpData}
                                        onChange={(e) => ChangeDropDown(e, 'PoliceForceID')}
                                        placeholder="Select..."
                                    />
                                    <label htmlFor="">Police Force</label>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-12 col-lg-12 p-0 pt-1 ">
                            <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                                <p className="p-0 m-0 d-flex align-items-center">
                                    Name Information
                                </p>
                            </div>
                            <div className="row">
                                <div className="col-6 col-md-4 col-lg-4 mt-2">
                                    <div className=" dropdown__box ">
                                        {
                                            openPage ?
                                                <>
                                                    <Select
                                                        name="ArresteeID"
                                                        styles={colourStyles}
                                                        options={arresteeDrpData}
                                                        value={arresteeDrpData?.filter((obj) => obj.value === value?.ArresteeLable)}
                                                        // isClearable
                                                        onChange={(e) => ChangeDropDown(e, 'ArresteeID')}
                                                        placeholder="Select..."
                                                    />
                                                </>
                                                :
                                                <Select
                                                    name="ArresteeID"
                                                    styles={colourStyles}
                                                    options={arresteeDrpData}
                                                    value={arresteeDrpData?.filter((obj) => obj.value === value?.ArresteeID)}
                                                    // isClearable
                                                    isDisabled={ArrestID ? true : false}
                                                    onChange={(e) => ChangeDropDown(e, 'ArresteeID')}
                                                    placeholder="Select..."
                                                />
                                        }
                                        <label htmlFor="">Arrestee</label>
                                        {errors.ArresteeIDError !== 'true' ? (
                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ArresteeIDError}</span>
                                        ) : null}
                                    </div>
                                </div>
                                <div className="col-1 col-md-1 col-lg-1 mt-3 pt-1">
                                    {
                                        openPage === 'ArrestSearch' ?
                                            <>
                                                <Link to="/nametab?page=ArrestSearch" className="btn btn-sm bg-green text-white ">
                                                    <i className="fa fa-plus"></i>
                                                </Link>
                                            </>
                                            :
                                            <>
                                            </>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className=" col-4 col-md-4 col-lg-2 " style={{ marginTop: '10px' }}>
                        <div className="img-box" >
                            <Carousel className="carousel-style" showArrows={true} showThumbs={false} showStatus={false} >
                                {
                                    arrestMultiImg.length > 0 ?
                                        arrestMultiImg?.map((item, index) => (
                                            <div key={index}>
                                                <img src={item.Photo} style={{ height: '170px' }} />
                                                <div className='box' style={{ background: 'red' }}>
                                                    <a type='button' data-toggle="modal" data-target="#DeleteModal" className="legend-img " onClick={(e) => { setImageId(item.PhotoID) }} >
                                                        <i className='fa fa-close' ></i>
                                                    </a>
                                                </div>
                                            </div>
                                        ))
                                        :
                                        <div key='test'>
                                            <img src={defualtImage} style={{ height: '170px' }} />
                                        </div>
                                }
                            </Carousel>
                        </div>
                        <div className="row">
                            {
                                ArrestID ? <> <div className="col-md-12 text-center " ><label className='pers-img mt-1'> <i className='fa fa-upload'></i>
                                    <input type="file" size="60" onChange={get_Image_File} /> </label></div>
                                </> : <></>
                            }
                        </div>
                    </div>

                </div>
                <div className="col-12 col-md-12 col-lg-12  p-0 pt-1">
                    <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                        <p className="p-0 m-0 d-flex align-items-center">
                            Rights Information
                        </p>
                    </div>
                    <div className="row">
                        <div className="col-6 col-md-4 col-lg-4 mt-2">
                            <div className=" dropdown__box">
                                <Select
                                    name='RightsGivenID'
                                    styles={customStylesWithOutColor}
                                    value={policeForceDrpData?.filter((obj) => obj.value === value?.RightsGivenID)}
                                    isClearable
                                    options={policeForceDrpData}
                                    onChange={(e) => ChangeDropDown(e, 'RightsGivenID')}
                                    placeholder="Select..."
                                />
                                <label htmlFor="">Rights Given</label>
                            </div>
                        </div>
                        <div className="col-4 col-md-4 col-lg-4 mt-2">
                            <div className=" dropdown__box">
                                <Select
                                    name='GivenByID'
                                    menuPlacement='top'
                                    styles={customStylesWithOutColor}
                                    value={supervisorDrpData?.filter((obj) => obj.value === value?.GivenByID)}
                                    isClearable
                                    options={supervisorDrpData}
                                    onChange={(e) => ChangeDropDown(e, 'GivenByID')}
                                    placeholder="Select..."
                                    isDisabled={rightGivenCode === 'N' ? true : false}
                                />
                                <label htmlFor="">Given By</label>
                            </div>
                        </div>
                        <div className="col-4 col-md-4 col-lg-4 mt-2">
                            <div className=" dropdown__box">
                                <Select
                                    name='PrimaryOfficerID'
                                    menuPlacement='top'
                                    styles={colourStyles}
                                    value={supervisorDrpData?.filter((obj) => obj.value === value?.PrimaryOfficerID)}
                                    isClearable
                                    options={supervisorDrpData}
                                    onChange={(e) => ChangeDropDown(e, 'PrimaryOfficerID')}
                                    placeholder="Select..."
                                />
                                <label htmlFor="">Primary Officer</label>
                                {errors.PrimaryOfficerIDError !== 'true' ? (
                                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.PrimaryOfficerIDError}</span>
                                ) : null}
                            </div>
                        </div>
                        {/* juvenile */}
                        <div className="col-12 col-md-12 col-lg-12  p-0 pt-1">
                            <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                                <p className="p-0 m-0 d-flex align-items-center">
                                    Juvenile Disposition
                                </p>
                            </div>
                            <div className="row">
                                <div className="col-4 col-md-4 col-lg-4 mt-2">
                                    <div className=" dropdown__box">
                                        <Select
                                            name='JuvenileDispositionID'
                                            menuPlacement='top'
                                            styles={customStylesWithOutColor}
                                            value={JuvenileDispoDrp?.filter((obj) => obj.value === value?.JuvenileDispositionID)}
                                            isClearable
                                            options={JuvenileDispoDrp}
                                            onChange={(e) => ChangeDropDown(e, 'JuvenileDispositionID')}
                                            placeholder="Select..."
                                            isDisabled={value?.IsJuvenileArrest ? false : true}
                                        />
                                        <label htmlFor="">Juvenile Disposition</label>
                                    </div>
                                </div>
                                <div className="col-4 col-md-3 col-lg-3 mt-2 ">
                                    <div class="text-field ">
                                        <input type="text" maxLength={10} name='PhoneNo' id='PhoneNo' className={`${value.IsJuvenileArrest === false ? "readonlyColor" : ''}`} value={value?.PhoneNo} onChange={HandleChange} required disabled={value.IsJuvenileArrest === true ? false : true} />
                                        <label>Phone No:</label>
                                        {/* {errors.PhoneNoError !== 'true' ? (
                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.PhoneNoError}</span>
                                        ) : null} */}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12  text-right p-0">
                {
                    ArrestID ?
                        <>
                            <button type="button" data-toggle="modal" data-target="#myModal" className="btn btn-sm btn-success  mr-1" onClick={() => { check_Validation_Error(); }}>Update</button>
                        </>
                        :
                        <>
                            <button type="button" data-toggle="modal" data-target="#myModal" className="btn btn-sm btn-success  mr-1" onClick={() => { check_Validation_Error(); }}>Save</button>
                        </>
                }
                <button type="button" className="btn btn-sm btn-success  mr-1" data-dismiss="modal" data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} onClick={() => { Onclose(); }}>Close</button>
            </div>
            <ConfirmModal {...{ show, setShowModal, arresteeChange, value, setValue, setErrors }} />
            <DeletePopUpModal func={delete_Image_File} />
            <ChangesModal func={check_Validation_Error} />
            <IdentifyFieldColor />
        </>
    )
}

export default Home

const Get_Code = (data, dropDownData) => {
    const result = data?.map((sponsor) =>
        (sponsor.ArresteeID)
    )
    const result2 = dropDownData?.map((sponsor) => {
        if (sponsor.value === result[0]) {
            return { value: result[0], label: sponsor.label, id: sponsor.id }
        }
    }
    )
    const val = result2.filter(function (element) {
        return element !== undefined;
    });
    return val[0]?.label
}

const Get_Given_Code = (data, dropDownData) => {
    const result = data?.map((sponsor) =>
        (sponsor.RightsGivenID)
    )
    const result2 = dropDownData?.map((sponsor) => {
        if (sponsor.value === result[0]) {
            return { value: result[0], label: sponsor.label, id: sponsor.id }
        }
    }
    )
    const val = result2.filter(function (element) {
        return element !== undefined;
    });
    return val[0]?.id
}