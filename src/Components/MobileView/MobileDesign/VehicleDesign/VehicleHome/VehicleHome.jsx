import React, { useEffect } from 'react'
import Select from "react-select";
import DatePicker from "react-datepicker";
import MobileTab from '../../../MobileUtility/MobileTab';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { useState } from 'react';
import { Decrypt_Id_Name, Encrypted_Id_Name, getShowingDateText, getShowingMonthDateYear, getYearWithOutDateTime } from '../../../../Common/Utility';
import { Carousel } from 'react-responsive-carousel';
import defualtImage from '../../../../../img/uploadImage.png'
import { AddDeleteUpadate, fetchData, fetchPostData } from '../../../../hooks/Api';
import { Comman_changeArrayFormat, threeColArray } from '../../../../Common/ChangeArrayFormat';
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import { RequiredFieldIncident } from '../../../../Pages/Utility/Personnel/Validation';
import IdentifyFieldColor from '../../../../Common/IdentifyFieldColor';

const VehicleHome = ({ setStatus }) => {

    const { get_Data_Vehicle, get_vehicle_Count, get_Incident_Count, VehicleData, setVehicleData, updateCount, setUpdateCount, setChangesStatus, changesStatusCount, changesStatus, localStoreArray, setLocalStoreArray, get_LocalStorage, vehicleStatus, setVehicleStatus, deleteStoreData, storeData } = useContext(AgencyContext)

    const navigate = useNavigate();
    const useQuery = () => new URLSearchParams(useLocation().search);
    let openPage = useQuery().get('page');

    const { setShowPage } = useContext(AgencyContext);
    const [reportedDate, setReportedDate] = useState();
    const [destoryDate, setdestoryDate] = useState();
    const [plateExpDate, setPlateExpDate] = useState();
    const [manufactureDate, setManufactureDate] = useState();
    const [inspectionExpDate, setInspectionExpDate] = useState();
    //Ids
    const [vehicleID, setVehicleID] = useState('')
    const [masterPropertyID, setMasterPropertyID] = useState('');
    //img
    const [VehicleMultiImg, setVehicleMultiImg] = useState([])
    const [imageid, setImageId] = useState('');
    //--dropDown
    const [propertyLossCodeData, setPropertyLossCodeData] = useState([]);
    const [categoryIdDrp, setCategoryIdDrp] = useState([])
    const [plateTypeIdDrp, setPlateTypeIdDrp] = useState([]);
    const [classificationId, setClassificationID] = useState([])
    const [styleIdDrp, setStyleIdDrp] = useState([])
    const [makeIdDrp, setMakeIdDrp] = useState([])
    const [modalIdDrp, setModalIdDrp] = useState([])
    const [arresteeDrpData, setArresteeDrpData] = useState([])
    const [PrimaryOfficerID, setprimaryOfficerID] = useState([])
    const [colorDrp, setColorDrp] = useState([])
    const [VODIDData, setVODIDData] = useState([])
    const [stateList, setStateList] = useState([]);
    const [Editval, setEditval] = useState([]);

    const [MainIncidentID, setMainIncidentID] = useState('');
    const [LoginAgencyID, setLoginAgencyID] = useState('');
    const [LoginPinID, setLoginPinID] = useState('');

    const [value, setValue] = useState({
        'IncidentID': '',
        'VehicleID': vehicleID,
        'PropertyID': '',
        'MasterPropertyID': '',
        'CreatedByUserFK': '',
        'VehicleNumber': 'Auto Generated',
        'ReportedDtTm': '',
        'LossCodeID': '',
        'CategoryID': '',
        'PlateID': '',
        'VehicleNo': '',
        'PlateTypeID': '',
        'ClassificationID': '',
        'VIN': '',
        'VODID': '',
        'PlateExpireDtTm': '',
        'OANID': '',
        'StyleID': '',
        'MakeID': '',
        'ModelID': '',
        'ManufactureYear': '',
        'Weight': '',
        'OwnerID': '',
        'PrimaryColorID': '',
        'SecondaryColorID': '',
        'Value': '',
        'Inspection_Sticker': '',
        'InspectionExpiresDtTm': '',
        'PrimaryOfficerID': '',
        'InProfessionOf': '',
        'TagID': '',
        'NICBID': '',
        'DestroyDtTm': '',
        'Description': '',
        'IsEvidence': '',
        'IsPropertyRecovered': '',
        'IsImmobalizationDevice': '',
        'IsEligibleForImmobalization': '',
        'ModifiedByUserFK': "",
        'ArrestID': "",   // not in use  
    })
    const [errors, setErrors] = useState({
        'ReportedDtTmError': '', 'LossCodeIDError': '', 'CategoryIDError': '', 'RecoveryTypeIDError': '', 'PlateTypeIDError': '',
        // 'PlateIDError'
    })

    const localStore = {
        Value: "",
        UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
        Key: JSON.stringify({ AgencyID: "", PINID: "", IncidentID: '', VehicleID: '', MasterPropertyID: '', }),
    }

    useEffect(() => {
        if (!localStoreArray?.AgencyID || !localStoreArray?.PINID) {
            get_LocalStorage();
        }
    }, []);

    // Onload Function
    useEffect(() => {
        // console.log(localStoreArray)
        if (localStoreArray) {
            if (localStoreArray?.AgencyID && localStoreArray?.PINID) {
                setLoginAgencyID(localStoreArray?.AgencyID);
                setLoginPinID(localStoreArray?.PINID);
                if (localStoreArray.VehicleID ) {
                    setVehicleID(localStoreArray?.VehicleID);
                } else {
                    setVehicleID('');
                }
                setMainIncidentID(localStoreArray?.IncidentID);
                get_vehicle_Count(localStoreArray?.VehicleID)
            }
        }
    }, [localStoreArray])

    useEffect(() => {
        setValue({
            ...value,
            'IncidentID': localStoreArray?.IncidentID, 'CreatedByUserFK': localStoreArray?.PINID, 'PropertyID': localStoreArray?.PropertyID, 'MasterPropertyID': localStoreArray?.MasterPropertyID, 'AgencyID': localStoreArray?.AgencyID,
            'ReportedDtTm': getShowingMonthDateYear(openPage === 'masterProperty' ? new Date() : localStoreArray.ReportedDate ? localStoreArray?.ReportedDate : new Date())
        });
    }, [MainIncidentID])

 

    //validaction
    const check_Validation_Error = (e) => {
        if (RequiredFieldIncident(value.LossCodeID)) {
            setErrors(prevValues => { return { ...prevValues, ['LossCodeIDError']: RequiredFieldIncident(value.LossCodeID) } })
        }
        if (RequiredFieldIncident(value.CategoryID)) {
            setErrors(prevValues => { return { ...prevValues, ['CategoryIDError']: RequiredFieldIncident(value.CategoryID) } })
        }
        if (RequiredFieldIncident(value.ReportedDtTm)) {
            setErrors(prevValues => { return { ...prevValues, ['ReportedDtTmError']: RequiredFieldIncident(value.ReportedDtTm) } })
        }
        if (RequiredFieldIncident(value.PlateTypeID)) {
            setErrors(prevValues => { return { ...prevValues, ['PlateTypeIDError']: RequiredFieldIncident(value.PlateTypeID) } })
        }
    }

    // Check All Field Format is True Then Submit 
    const { LossCodeIDError, CategoryIDError, ReportedDtTmError, RecoveryTypeIDError, PlateTypeIDError, } = errors

    // useEffect(() => {
    //     if (LossCodeIDError === 'true' && CategoryIDError === 'true' && ReportedDtTmError === 'true' && PlateTypeIDError === 'true') {
    //         if (vehicleID) { Update_Vehicle(); }
    //         else { Insert_Vehicle() }
    //     }
        
    //     else if (LossCodeIDError === 'Required *' || CategoryIDError === 'Required *' || ReportedDtTmError === 'Required *' || PlateTypeIDError === 'Required *') toastifyError('Please Fill All Required Field')
    // }, [LossCodeIDError, CategoryIDError, ReportedDtTmError, RecoveryTypeIDError, PlateTypeIDError,])

    useEffect(() => {
        if (LossCodeIDError === 'true' && CategoryIDError === 'true' && ReportedDtTmError === 'true' && PlateTypeIDError === 'true' ) {
            if (openPage === 'VehicleSearch') {
                if (masterPropertyID) { Update_Vehicle(); }
                else { Insert_Vehicle(); }
            } else {
                if (vehicleID && masterPropertyID) { Update_Vehicle(); }
                else { Insert_Vehicle() }
            }
        }else if (LossCodeIDError === 'Required *' || CategoryIDError === 'Required *' || ReportedDtTmError === 'Required *' || PlateTypeIDError === 'Required *') toastifyError('Please Fill All Required Field')
    }, [LossCodeIDError, CategoryIDError, ReportedDtTmError, RecoveryTypeIDError, PlateTypeIDError])

   //-------------Get-Single-Data----------------------
   useEffect(() => {
    if (vehicleID) {
        GetSingleData(vehicleID)
    } else {
        reset();
    }
}, [vehicleID, updateCount]);

const GetSingleData = (vehicleID) => {
    const val = {
        'VehicleID': vehicleID,
    }
    fetchPostData('PropertyVehicle_FRW/GetSingleData_Vehicle_FRW', val).then((res) => {
        console.log(res);
        if (res.length > 0) {
            setEditval(res);
        }
        else {
            // toastifyError("blank Array"); 
            setEditval([])
        }
    })
}

    useEffect(() => {
        console.log('Editval', Editval)
        // if (sessionStorage.getItem('vehicleID') && Editval.length > 0) {
        if ((vehicleID) && Editval.length > 0) {
            get_Classification_Drp(Editval[0]?.CategoryID);
            setValue({
                ...value,
                'LossCodeID': Editval[0]?.LossCodeID, 'NICBID': Editval[0]?.NICBID, 'TagID': Editval[0]?.TagID, 'PrimaryOfficerID': Editval[0]?.PrimaryOfficerID, 'SecondaryColorID': Editval[0]?.SecondaryColorID,
                'PrimaryColorID': Editval[0]?.PrimaryColorID, 'OwnerID': Editval[0]?.OwnerID, 'ModelID': Editval[0]?.ModelID, 'MakeID': Editval[0]?.MakeID, 'StyleID': Editval[0]?.StyleID, 'OANID': Editval[0]?.OANID, 'VODID': Editval[0]?.VODID,
                'ClassificationID': Editval[0]?.ClassificationID, 'PlateTypeID': Editval[0]?.PlateTypeID, 'PlateID': Editval[0]?.PlateID, 'CategoryID': Editval[0]?.CategoryID, 'VehicleNumber': Editval[0]?.VehicleNumber,
                'ReportedDtTm': getShowingDateText(Editval[0]?.ReportedDtTm), 'IsEligibleForImmobalization': Editval[0]?.IsEligibleForImmobalization, 'IsImmobalizationDevice': Editval[0]?.IsImmobalizationDevice, 'IsPropertyRecovered': Editval[0]?.IsPropertyRecovered,
                'IsEvidence': Editval[0]?.IsEvidence, 'InProfessionOf': Editval[0]?.InProfessionOf, 'Description': Editval[0]?.Description, 'DestroyDtTm': Editval[0]?.DestroyDtTm, 'InspectionExpiresDtTm': Editval[0]?.InspectionExpiresDtTm,
                'Inspection_Sticker': Editval[0]?.Inspection_Sticker, 'Value': Editval[0]?.Value, 'Weight': Editval[0]?.Weight, 'ManufactureYear': Editval[0]?.ManufactureYear,
                'VIN': Editval[0]?.VIN, 'VehicleNo': Editval[0]?.VehicleNo, 'PlateExpireDtTm': Editval[0]?.PlateExpireDtTm,
                'ModifiedByUserFK':LoginPinID, 'VehicleID': Editval[0]?.VehicleID,
            })
            get_ModalId_Drp(Editval[0]?.MakeID);
            setVehicleID(Editval[0]?.VehicleID);
            setReportedDate(Editval[0]?.ReportedDtTm ? new Date(Editval[0]?.ReportedDtTm) : '');
            setdestoryDate(Editval[0]?.DestroyDtTm ? new Date(Editval[0]?.DestroyDtTm) : '');
            setInspectionExpDate(Editval[0]?.InspectionExpiresDtTm ? new Date(Editval[0]?.InspectionExpiresDtTm) : '');
            setManufactureDate(Editval[0]?.ManufactureYear ? new Date(Editval[0]?.ManufactureYear) : '');
            setPlateExpDate(Editval[0]?.PlateExpireDtTm ? new Date(Editval[0]?.PlateExpireDtTm) : '');
        }
    }, [Editval, updateCount, changesStatusCount])


    //-----Reset
    const reset = () => {
        setValue({
            ...value,
            'VehicleNumber': '', 'LossCodeID': '', 'CategoryID': '', 'PlateID': '', 'VehicleNo': '', 'PlateTypeID': '', 'ClassificationID': '',
            'VIN': '', 'VODID': '', 'PlateExpireDtTm': '', 'OANID': '', 'StyleID': '', 'MakeID': '', 'ModelID': '', 'ManufactureYear': '',
            'Weight': '', 'OwnerID': '', 'PrimaryColorID': '', 'SecondaryColorID': '', 'Value': '', 'Inspection_Sticker': '', 'InspectionExpiresDtTm': '',
            'PrimaryOfficerID': '', 'InProfessionOf': '', 'TagID': '', 'NICBID': '', 'DestroyDtTm': '', 'Description': '',
            'IsEvidence': '', 'IsPropertyRecovered': '', 'IsImmobalizationDevice': '', 'IsEligibleForImmobalization': '',
        })
        setPlateExpDate(); setManufactureDate(); setInspectionExpDate(); setdestoryDate();
    }


    // useEffect(() => {
    //     get_PropertyLoos_Drp(); get_CategoryId_Drp(); get_PlateType_Drp(); get_StyleId_Drp(); get_MakeId_Drp(); get_Arrestee_Drp_Data(); PropertyType()
    //     get_Head_Of_Agency(); get_ColorDrp(); get_Data_VODID();
    //     getCountryID();
        

    //     setValue({
    //         ...value,
    //         'ReportedDtTm': getShowingMonthDateYear ? new Date() : ('IncidentReportedDate') ? ('IncidentReportedDate') : new Date(),
    //     })
    //     setReportedDate(new Date(getShowingMonthDateYear(('IncidentReportedDate') ? ('IncidentReportedDate') : getShowingMonthDateYear(new Date()))));
    // }, [])

    useEffect(() => {
        get_PropertyLoos_Drp(LoginAgencyID); get_CategoryId_Drp(); get_PlateType_Drp(LoginAgencyID); get_StyleId_Drp(LoginAgencyID); get_MakeId_Drp(LoginAgencyID); get_Arrestee_Drp_Data(MainIncidentID); PropertyType(LoginAgencyID)
        get_Head_Of_Agency(LoginAgencyID); get_ColorDrp(LoginAgencyID); get_Data_VODID(LoginAgencyID);
        getCountryID();
    }, [LoginAgencyID])

    const get_Data_VODID = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID,
        }
        fetchPostData('VehicleVOD/GetDataDropDown_VehicleVOD', val).then((res) => {
            if (res) {
                setVODIDData(Comman_changeArrayFormat(res, 'VehicleVODID', 'Description'));
            } else {
                setVODIDData([]);
            }
        })
    }

    const PropertyType = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID,
        }
        fetchPostData('PropertyCategory/GetDataDropDown_PropertyCategory', val).then((data) => {
            if (data) {
                const res = data?.filter((val) => {
                    if (val.PropertyCategoryCode === "V") return val
                })
                if (res.length > 0) {
                    get_CategoryId_Drp(res[0]?.PropertyCategoryID)
                }
            } else {
            }
        })
    }

    const get_ColorDrp = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID,
        }
        fetchPostData('PropertyVehicle/GetDataDropDown_Color', val).then((data) => {
            if (data) {
                setColorDrp(Comman_changeArrayFormat(data, 'ColorID', 'ColorDescription'));
            }
            else {
                setColorDrp([])
            }
        })
    };

    const get_Head_Of_Agency = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID,
        }
        fetchPostData('DropDown/GetData_HeadOfAgency', val).then((data) => {
            if (data) {
                setprimaryOfficerID(Comman_changeArrayFormat(data, 'PINID', 'HeadOfAgency'));
            }
            else {
                setprimaryOfficerID([])
            }
        })
    };

    const get_Arrestee_Drp_Data = (MainIncidentID) => {
        const val = {
            'IncidentID': MainIncidentID
        }
        fetchPostData('Arrest/GetDataDropDown_Arrestee', val).then((data) => {
            if (data) {
                setArresteeDrpData(Comman_changeArrayFormat(data, 'NameID', 'Arrestee_Name'));
            }
            else {
                setArresteeDrpData([])
            }
        })
    };

    const get_ModalId_Drp = (PropertyVehicleMakeID) => {
        const val = {
            AgencyID: LoginAgencyID,
            'PropertyVehicleMakeID': PropertyVehicleMakeID
        }
        fetchPostData('PropertyVehicleModel/GetDataDropDown_PropertyVehicleModel', val).then((data) => {
            if (data) {
                console.log(data)
                setModalIdDrp(Comman_changeArrayFormat(data, 'PropertyVehicleModelID', 'Description'))
            } else {
                setModalIdDrp([]);
            }
        })
    }

    const get_MakeId_Drp = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID,
        }
        fetchPostData('PropertyVehicleMake/GetDataDropDown_PropertyVehicleMake', val).then((data) => {
            if (data) {
                setMakeIdDrp(Comman_changeArrayFormat(data, 'PropertyVehicleMakeID', 'Description'))
            } else {
                setMakeIdDrp([]);
            }
        })
    }

    const get_StyleId_Drp = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID,
        }
        fetchPostData('PropertyVehicleStyle/GetDataDropDown_PropertyVehicleStyle', val).then((data) => {
            if (data) {
                setStyleIdDrp(Comman_changeArrayFormat(data, 'VehicleStyleID', 'Description'))
            } else {
                setStyleIdDrp([]);
            }
        })
    }

    const get_Classification_Drp = (PropertyDescID) => {
        const val = {
            PropertyDescID: PropertyDescID,
        }
        fetchPostData('Property/GetDataDropDown_PropertyClassification', val).then((data) => {
            if (data) {
                setClassificationID(Comman_changeArrayFormat(data, 'PropertyClassificationID', 'Description'))
            } else {
                setClassificationID([]);
            }
        })
    }

    const get_PlateType_Drp = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID,
        }
        fetchPostData('PropertyVehiclePlateType/GetDataDropDown_PropertyVehiclePlateType', val).then((data) => {
            if (data) {
                setPlateTypeIdDrp(Comman_changeArrayFormat(data, 'PlateTypeID', 'Description'))
            } else {
                setPlateTypeIdDrp([]);
            }
        })
    }

    const getCountryID = async () => {
        fetchData("State_City_ZipCode/GetData_State").then((data) => {
            if (data) {
                setStateList(Comman_changeArrayFormat(data, "StateID", "StateName"));
            } else {
                setStateList([]);
            }
        });
    };

    const get_PropertyLoos_Drp = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID,
        }
        fetchPostData('PropertyVehicle/GetDataDropDown_PropertyVehiclePropertyReasonCode', val).then((data) => {
            if (data) {
                console.log(data)
                setPropertyLossCodeData(threeColArray(data, 'PropertyReasonCodeID', 'Description', 'PropertyReasonsCode'))
            } else {
                setPropertyLossCodeData([]);
            }
        })
    }

    const get_CategoryId_Drp = (CategoryID) => {
        const val = {
            CategoryID: CategoryID,
        }
        fetchPostData('Property/GetDataDropDown_PropertyType', val).then((data) => {
            if (data) {
                setCategoryIdDrp(threeColArray(data, 'PropertyDescID', 'Description', 'CategoryID'))
            } else {
                setCategoryIdDrp([]);
            }
        })
    }

    const ChangeDropDown = (e, name) => {
        if (e) {
            if (name === 'MakeID') {
                get_ModalId_Drp(e.value)
                setValue({
                    ...value,
                    ['MakeID']: e.value
                })
            }
            if (name === 'CategoryID') { get_Classification_Drp(e.value) }
            setValue({
                ...value,
                [name]: e.value
            })
        } else if (e === null) {
            if (name === 'CategoryID') {
                setValue({
                    ...value,
                    ['CategoryID']: '',
                    ['ClassificationID']: ''
                })
                setClassificationID([]);
            }
            if (name === 'MakeID') {
                setValue({
                    ...value,
                    ['MakeID']: '',
                    ['ModelID']: ''
                })
                setModalIdDrp([]);
            }
            setValue({
                ...value,
                [name]: null
            })
        } else {
            setValue({
                ...value,
                [name]: null
            })
        }
    }
    const HandleChanges = (e) => {
        if (e.target.name === 'IsEvidence' || e.target.name === 'IsPropertyRecovered' || e.target.name === 'IsImmobalizationDevice' || e.target.name === 'IsEligibleForImmobalization') {
            setValue({
                ...value,
                [e.target.name]: e.target.checked
            })
        }
        else if (e.target.name === 'Value') {
            var ele = e.target.value.replace(/[^0-9\.]/g, "")
            console.log(ele);
            if (ele.length === 16) {
                setValue({
                    ...value,
                    [e.target.name]: ele
                });
            } else {
                setValue({
                    ...value,
                    [e.target.name]: ele
                });
            }
        } else if (e.target.name === 'Weight') {
            const checkNumber = e.target.value.replace(/[^0-9\s]/g, "");
            setValue({ ...value, [e.target.name]: checkNumber })
        }
        else {
            setValue({
                ...value,
                [e.target.name]: e.target.value
            })
        }
    }

    //-------Insert-Update-Delete-----------
    const Insert_Vehicle = () => {
        AddDeleteUpadate('PropertyVehicle_FRW/Insert_Vehicle_FRW', value).then((res) => {
            if (res.success) {
                toastifySuccess(res.Message);
                setErrors({ ...errors, ['LossCodeIDError']: '' })
                if (res.VehicleID) {
                    console.log(res.VehicleID);
                    setChangesStatus(false)
                    setVehicleStatus(true);
                    setVehicleID(res.VehicleID);
                    storeData({ 'VehicleID': res?.VehicleID,'VehicleStatus': true })
                    // sessionStorage.setItem("VehicleID", Encrypted_Id_Name(res.VehicleID, 'VForVehicleID'));
                } 
                setUpdateCount(updateCount + 1)
                setChangesStatus(false)
                setStatus(true)
            } else {
                toastifyError('Error')
            }
        })
    }

    const Update_Vehicle = () => {
        AddDeleteUpadate('PropertyVehicle_FRW/Update_Vehicle_FRW', value).then((res) => {
            if (res.success) {
                toastifySuccess(res.Message);
                setChangesStatus(false)
                setErrors({ ...errors, ['LossCodeIDError']: '' });
                setUpdateCount(updateCount + 1)
            } else {
                toastifyError('Error')
            }
        })
    }
 
    const OnClose = () => {
        navigate('/vehicle-main');
        // sessionStorage.removeItem('VehicleID');
    }

    // Custom Style
    const colourStyles = {
        control: (styles) => ({
            ...styles, backgroundColor: "#fce9bf",
            height: 20,
            minHeight: 36,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };

    const customStylesWithOutColor = {
        control: base => ({
            ...base,
            height: 20,
            minHeight: 36,
            fontSize: 18,
            margintop: 2,
            boxShadow: 0,
        }),
    };

    const startRef = React.useRef();
    const startRef1 = React.useRef();
    const startRef2 = React.useRef();
    const startRef3 = React.useRef();
    const startRef4 = React.useRef();

    const onKeyDown = (e) => {
        if (e.keyCode === 9 || e.which === 9) {
            startRef.current.setOpen(false);
            startRef1.current.setOpen(false);
            startRef2.current.setOpen(false);
            startRef3.current.setOpen(false);
            startRef4.current.setOpen(false);
        }
    };

    return (
        <>

            <div className=" ">
                <div className="row clearfix">
                    <div className="col-12 col-sm-12 px-2">
                        <div className="card Agency " style={{ borderRight: 'none', borderLeft: 'none', borderRadius: '0' }}>
                            <div className="card-body">
                                <div className="row">
                                    <div className={`col-12 col-md-12`}>
                                        <div className="row ">
                                            <div className="col-12  mobile__tabs" style={{ marginTop: '-18px', marginBottom: '-20px' }}>
                                                <MobileTab />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <Link to='/vehicle-tabs'>
                        <div data-toggle="modal" data-target="#myModal" style={{ fontSize: 18, cursor: 'pointer', fontWeight: 'bold', background: 'cadetblue', position: 'absolute', padding: '7px 10px', right: '0px', color: '#434A54', top: '0px' }} onClick={setShowPage('MobileVehicleNotes')}>
                            <i className='fa fa-arrow-left' style={{ fontSize: '18px' }}></i>
                            <span >Tabs</span>
                        </div>
                    </Link> */}
                    {
                        ('VehicleID') &&
                        <>
                            <Link to='/vehicle-tabs'>
                                <div data-toggle="modal" data-target="#myModal" style={{ fontSize: 18, cursor: 'pointer', fontWeight: 'bold', background: 'cadetblue', position: 'absolute', padding: '7px 10px', right: '0px', color: '#434A54', top: '0px' }} onClick={setShowPage('MobileAdditionalInformation')}>
                                    <i className='fa fa-arrow-left' style={{ fontSize: '18px' }}></i>
                                    <span >Tabs</span>
                                </div>
                            </Link>
                        </>
                    }
                    <div className="card Agency  " style={{ borderRight: 'none', borderLeft: 'none', borderRadius: '0', marginTop: '-10px', borderTop: 'none' }}>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-12 col-md-12  p-0 " >
                                    <div className="bg-line  py-1  px-0  d-flex justify-content-between align-items-center " style={{ marginTop: '-12px' }}>
                                        <p className="p-0 m-0 pl-3 py-1" style={{ fontSize: '18px' }}>Vehicle</p>
                                        {/* <Link to={''} className=" ">
                                            <i className="fa fa-file mr-3" style={{ fontSize: '18px' }}></i>
                                        </Link> */}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-4 col-md-4 col-lg-2 " style={{ marginTop: '8px' }}>
                                        <div class="text-mobile">
                                            <input type="text" name='VehicleNumber' id='VehicleNumber' value={value?.VehicleNumber} onChange={HandleChanges} className='readonlyColor' required />
                                            <label style={{ paddingTop: '2px' }}>Vehicle Number</label>
                                        </div>
                                    </div>
                                    <div className="col-4 col-md-4 col-lg-3 pt-1 ">
                                        <div className="text__dropdwon">
                                            <DatePicker
                                                open={false}
                                                id='ReportedDtTm'
                                                name='ReportedDtTm'
                                                ref={startRef}
                                                onKeyDown={onKeyDown}
                                                onChange={(date) => { setReportedDate(date); setValue({ ...value, ['ReportedDtTm']: date ? getShowingMonthDateYear(date) : null }) }}
                                                className='requiredColor name-datepicker'
                                                isClearable
                                                selected={reportedDate}
                                                // placeholderText={value?.ReportedDtTm ? value?.ReportedDtTm : 'Select...'}
                                                dateFormat="MM/dd/yyyy HH:mm"
                                            />
                                            <label htmlFor="" className='pt-2'>Reported Date/Time
                                                <span className='text-danger pl-1'>
                                                    *
                                                </span>
                                            </label>
                                            {/* {errors.ReportedDtTmError !== 'true' ? (
                                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ReportedDtTmError}</span>
                                            ) : null} */}
                                        </div>
                                    </div>
                                    <div className="col-6 col-md-6 col-lg-4 mt-1">
                                        <div className=" text__dropdwon">
                                            <Select
                                                name='CategoryID'
                                                value={categoryIdDrp?.filter((obj) => obj.value === value?.CategoryID)}
                                                styles={colourStyles}
                                                options={categoryIdDrp}
                                                onChange={(e) => ChangeDropDown(e, 'CategoryID')}
                                                isClearable
                                                placeholder="Select..."
                                            />
                                            <label htmlFor="" className='pt-2'>Category
                                                <span className='text-danger pl-1'>
                                                    *
                                                </span>
                                            </label>
                                        </div>
                                        {/* {errors.CategoryIDError !== 'true' ? (
                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CategoryIDError}</span>
                                        ) : null} */}
                                    </div>
                                    <div className="col-4 col-md-4 col-lg-3 mt-1">
                                        <div className=" text__dropdwon">
                                            <Select
                                                name='ClassificationID'
                                                value={classificationId?.filter((obj) => obj.value === value?.ClassificationID)}
                                                styles={customStylesWithOutColor}
                                                options={classificationId}
                                                onChange={(e) => ChangeDropDown(e, 'ClassificationID')}
                                                isClearable
                                                placeholder="Select..."
                                            />
                                            <label htmlFor="" className='pt-2'>Classification</label>
                                        </div>
                                    </div>
                                    <div className="col-6 col-md-6 col-lg-3 mt-1">
                                        <div className=" text__dropdwon">
                                            <Select
                                                name='LossCodeID'
                                                value={propertyLossCodeData?.filter((obj) => obj.value === value?.LossCodeID)}
                                                styles={colourStyles}
                                                options={propertyLossCodeData}
                                                onChange={(e) => ChangeDropDown(e, 'LossCodeID')}
                                                isClearable
                                                placeholder="Select..."
                                            />
                                            <label htmlFor="" className='pt-2'>Loss Code
                                                <span className='text-danger pl-1'>
                                                    *
                                                </span>
                                            </label>
                                        </div>
                                        {/* {errors.LossCodeIDError !== 'true' ? (
                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.LossCodeIDError}</span>
                                        ) : null} */}
                                    </div>
                                    <div className="col-6 col-md-6 col-lg-3 d-flex px-0">
                                        <div className="col-6 col-md-8 col-lg-8 mt-1 ">
                                            <div className=" text__dropdwon">
                                                {/* Required color comment */}
                                                <Select
                                                    name='PlateID'
                                                    value={stateList?.filter((obj) => obj.value === value?.PlateID)}
                                                    styles={customStylesWithOutColor}
                                                    // styles={colourStyles}
                                                    options={stateList}
                                                    onChange={(e) => ChangeDropDown(e, 'PlateID')}
                                                    isClearable
                                                    placeholder="Select..."
                                                />
                                                <label htmlFor="" className='pl-0 pt-2'>Plate Id</label>
                                            </div>
                                            {/* {errors.PlateIDError !== 'true' ? (
                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.PlateIDError}</span>
                            ) : null} */}
                                        </div>
                                        <span className='' style={{ marginLeft: '-10px', marginTop: '4px' }}>
                                            <div className="col-md-12 col-lg-12 pt-1 ">
                                                <div className="text-mobile  ">
                                                    {/* Required color comment */}
                                                    {/* <input type="text" name='' id='' maxLength={8} placeholder='1234' className='requiredColor' required /> */}
                                                    <input type="text" name='' id='' maxLength={8} onChange={HandleChanges} placeholder='1234' className='' required />
                                                </div>
                                            </div>
                                        </span>
                                    </div>
                                    <div className="col-6 col-md-6 col-lg-3 mt-1">
                                        <div className=" text__dropdwon">
                                            <Select
                                                name='PlateTypeID'
                                                value={plateTypeIdDrp?.filter((obj) => obj.value === value?.PlateTypeID)}
                                                styles={colourStyles}
                                                options={plateTypeIdDrp}
                                                onChange={(e) => ChangeDropDown(e, 'PlateTypeID')}
                                                isClearable
                                                placeholder="Select..."
                                            />
                                            <label htmlFor="" className='pt-2'>Plate Type
                                                <span className='text-danger pl-1'>
                                                    *
                                                </span>
                                            </label>
                                        </div>
                                        {/* {errors.PlateTypeIDError !== 'true' ? (
                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.PlateTypeIDError}</span>
                                        ) : null} */}
                                    </div>
                                    <div className="col-4 col-md-4 col-lg-3 mt-1  pt-1 d-flex ">
                                        <div class="text-mobile">
                                            <input type="text" name='VIN' id='VIN' maxLength={17} value={value?.VIN} onChange={HandleChanges} className='' required />
                                            <label className="pt-1">VIN</label>
                                        </div>
                                        <Link to={''} className='mt-2 pt-2'>
                                            <span className='  col-1 col-md-1 col-lg-1'>
                                                <i className='fa fa-search btn btn-sm bg-green text-white px-2 py-2'></i>
                                            </span>
                                        </Link>
                                    </div>
                                    <div className="col-4 col-md-4 col-lg-3 mt-1 pt-1">
                                        <div className=" text__dropdwon">
                                            <Select
                                                name='VODID'
                                                value={VODIDData?.filter((obj) => obj.value === value?.VODID)}
                                                styles={customStylesWithOutColor}
                                                options={VODIDData}
                                                onChange={(e) => ChangeDropDown(e, 'VODID')}
                                                isClearable
                                                placeholder="Select..."
                                            />
                                            <label htmlFor="" className='pt-2'>VOD</label>
                                        </div>
                                    </div>
                                    <div className="col-4 col-md-4 col-lg-3" style={{ marginTop: '8px' }}>
                                        <div className="text__dropdwon">
                                            <DatePicker
                                                id='PlateExpireDtTm'
                                                name='PlateExpireDtTm'
                                                ref={startRef1}
                                                className='name-datepicker'
                                                onKeyDown={onKeyDown}
                                                onChange={(date) => { setPlateExpDate(date); setValue({ ...value, ['PlateExpireDtTm']: date ? getShowingMonthDateYear(date) : null }) }}
                                                dateFormat="MM/dd/yyyy"
                                                isClearable
                                                selected={plateExpDate}
                                                placeholderText={value?.PlateExpireDtTm ? value?.PlateExpireDtTm : 'Select...'}
                                                autoComplete="nope"
                                                showYearDropdown
                                                showMonthDropdown
                                                dropdownMode="select"
                                                popperPlacement='right'
                                            />
                                            <label htmlFor="" className='pt-2'>Plate Expires</label>
                                        </div>
                                    </div>
                                    <div className="col-4 col-md-4 col-lg-3  " style={{ marginTop: '10px' }}>
                                        <div class="text-mobile">
                                            <input type="text" name='OANID' id='OANID' value={value?.OANID} onChange={HandleChanges} className='' required />
                                            <label className='pt-1'>OAN Id</label>
                                        </div>
                                    </div>
                                    <div className="col-4 col-md-4 col-lg-3 pt-1">
                                        <div className=" text__dropdwon">
                                            <Select
                                                name='StyleID'
                                                value={styleIdDrp?.filter((obj) => obj.value === value?.StyleID)}
                                                styles={customStylesWithOutColor}
                                                options={styleIdDrp}
                                                onChange={(e) => ChangeDropDown(e, 'StyleID')}
                                                isClearable
                                                placeholder="Select..."
                                            />
                                            <label htmlFor="" className='pt-2'>Style</label>
                                        </div>
                                    </div>
                                    <div className="col-4 col-md-4 col-lg-3 mt-1">
                                        <div className="text__dropdwon">
                                            <Select
                                                name='MakeID'
                                                value={makeIdDrp?.filter((obj) => obj.value === value?.MakeID)}
                                                styles={customStylesWithOutColor}
                                                options={makeIdDrp}
                                                onChange={(e) => ChangeDropDown(e, 'MakeID')}
                                                isClearable
                                                placeholder="Select..."
                                                menuPlacement='top'
                                            />
                                            <label htmlFor="" className='pt-2'>Make</label>
                                        </div>
                                    </div>
                                    <div className="col-4 col-md-6 col-lg-3 mt-1">
                                        <div className=" text__dropdwon">
                                            <Select
                                                name='ModelID'
                                                value={modalIdDrp?.filter((obj) => obj.value === value?.ModelID)}
                                                styles={customStylesWithOutColor}
                                                options={modalIdDrp}
                                                onChange={(e) => ChangeDropDown(e, 'ModelID')}
                                                isClearable
                                                placeholder="Select..."
                                            />
                                            <label htmlFor="" className='pt-2'>Model</label>
                                        </div>
                                    </div>
                                    <div className="col-4 col-md-4 col-lg-2 pt-1">
                                        <div className="text__dropdwon">
                                            <DatePicker
                                                name='ManufactureYear'
                                                id='ManufactureYear'
                                                selected={manufactureDate}
                                                onChange={(date) => { setManufactureDate(date); setValue({ ...value, ['ManufactureYear']: date ? getYearWithOutDateTime(date) : null }) }}
                                                showYearPicker
                                                dateFormat="yyyy"
                                                yearItemNumber={9}
                                                ref={startRef2}
                                                onKeyDown={onKeyDown}
                                                autoComplete="nope"
                                                showYearDropdown
                                                showMonthDropdown
                                                dropdownMode="select"
                                                maxDate={new Date()}
                                                className='name-datepicker'
                                            />
                                            <label htmlFor="" className='pt-2'>Manufacture Year</label>
                                        </div>
                                    </div>
                                    <div className="col-4 col-md-2 col-lg-1 " style={{ marginTop: '7px' }}>
                                        <div class="text-mobile">
                                            <input type="text" name='Weight' id='Weight' maxLength={4} value={value?.Weight} onChange={HandleChanges} className='' required />
                                            <label className='pt-1'>Weight</label>
                                        </div>
                                    </div>
                                    <div className="col-4 col-md-6 col-lg-3 mt-1">
                                        <div className=" text__dropdwon">
                                            <Select
                                                name='OwnerID'
                                                value={arresteeDrpData?.filter((obj) => obj.value === value?.OwnerID)}
                                                styles={customStylesWithOutColor}
                                                options={arresteeDrpData}
                                                onChange={(e) => ChangeDropDown(e, 'OwnerID')}
                                                isClearable
                                                placeholder="Select..."
                                                menuPlacement='top'
                                            />
                                            <label htmlFor="" className='pt-2'>Owner</label>
                                        </div>
                                    </div>
                                    <div className="col-4 col-md-6 col-lg-3 mt-1 pt-1">
                                        <div className=" text__dropdwon">
                                            <Select
                                                name='PrimaryColorID'
                                                value={colorDrp?.filter((obj) => obj.value === value?.PrimaryColorID)}
                                                styles={customStylesWithOutColor}
                                                options={colorDrp}
                                                onChange={(e) => ChangeDropDown(e, 'PrimaryColorID')}
                                                isClearable
                                                menuPlacement='top'
                                                placeholder="Select..."
                                            />
                                            <label htmlFor="" className='pt-2'>Primary Color</label>
                                        </div>
                                    </div>
                                    <div className="col-4 col-md-4 col-lg-3 mt-1 pt-1">
                                        <div className=" text__dropdwon">
                                            <Select
                                                name='SecondaryColorID'
                                                value={colorDrp?.filter((obj) => obj.value === value?.SecondaryColorID)}
                                                styles={customStylesWithOutColor}
                                                options={colorDrp}
                                                onChange={(e) => ChangeDropDown(e, 'SecondaryColorID')}
                                                isClearable
                                                placeholder="Select..."
                                                menuPlacement='top'
                                            />
                                            <label htmlFor="" className='pt-2'>Secondary Color</label>
                                        </div>
                                    </div>
                                    <div className="col-4 col-md-4 col-lg-2   " style={{ marginTop: '12px' }}>
                                        <div class="text-mobile">
                                            <input type="text" name='Value' id='Value' maxLength={20} value={'$' + value?.Value.replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ',')} onChange={HandleChanges} className='' required />
                                            <label className='pt-1'>Value</label>
                                        </div>
                                    </div>
                                    <div className="col-4 col-md-4 col-lg-4  " style={{ marginTop: '11px' }}>
                                        <div class="text-mobile">
                                            <input type="text" name='Inspection_Sticker' id='Inspection_Sticker' value={value?.Inspection_Sticker} onChange={HandleChanges} className='' required />
                                            <label className='pt-1'>Inspection Sticker</label>
                                        </div>
                                    </div>
                                    <div className="col-4 col-md-5 col-lg-4  mt-1">
                                        <div className="text__dropdwon">
                                            <DatePicker
                                                id='InspectionExpiresDtTm'
                                                name='InspectionExpiresDtTm'
                                                ref={startRef3}
                                                onKeyDown={onKeyDown}
                                                onChange={(date) => { setInspectionExpDate(date); setValue({ ...value, ['InspectionExpiresDtTm']: date ? getShowingMonthDateYear(date) : null }) }}
                                                dateFormat="MM/dd/yyyy"
                                                isClearable
                                                className='name-datepicker'
                                                selected={inspectionExpDate}
                                                placeholderText={value?.InspectionExpiresDtTm ? value?.InspectionExpiresDtTm : 'Select...'}
                                                autoComplete="nope"
                                                showYearDropdown
                                                showMonthDropdown
                                                dropdownMode="select"
                                            />
                                            <label htmlFor="" className='pt-2'>Inspection Expires</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12  text-right " style={{ marginTop: '-25px', marginBottom: '-10px' }}>
                                {
                                    vehicleID ?
                                        <>
                                            <button type="button" className="btn btn-sm btn-success  new-button mr-1" onClick={(e) => { check_Validation_Error(); }}>Update</button>
                                        </>
                                        :
                                        <>
                                            <button type="button" className="btn btn-sm btn-success  new-button  mr-1" onClick={(e) => { check_Validation_Error(); }}>Save</button>
                                        </>
                                }
                                <button type="button" className="btn btn-sm btn-success  new-button mr-1" data-dismiss="modal" onClick={() => { OnClose() }}>Close</button>
                            </div>
                            {/* <div className="col-12 col-md-12 col-lg-12 p-0 ">
                                <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                                    <p className="p-0 m-0 d-flex align-items-center">
                                        Additional Information
                                    </p>
                                </div>
                                <div className="row">
                                    <div className="col-lg-10">
                                        <div className="row">
                                            <div className="col-6 col-md-8 col-lg-6 mt-1">
                                                <div className=" text__dropdwon">
                                                    <Select
                                                        name='PrimaryOfficerID'
                                                        styles={customStylesWithOutColor}
                                                        isClearable
                                                        placeholder="Select..."
                                                    />
                                                    <label htmlFor="">Primary Officer</label>
                                                </div>
                                            </div>
                                            <div className="col-6 col-md-4 col-lg-6  " style={{ marginTop: '7px' }}>
                                                <div class="text-mobile">
                                                    <input type="text" name='InProfessionOf' id='InProfessionOf' value={value?.InProfessionOf} className='readonlyColor' required readOnly />
                                                    <label >In Possession Of</label>
                                                </div>
                                            </div>
                                            <div className="col-3  col-md-3 col-lg-2  mt-1 pt-1" >
                                                <div className="text-mobile">
                                                    <input type="text" name='TagID' id='TagID' value={value?.TagID} className='readonlyColor' required />
                                                    <label htmlFor="">Tag Id</label>
                                                </div>
                                            </div>
                                            <div className="col-3  col-md-3 col-lg-2  mt-1 pt-1" >
                                                <div className="text-mobile">
                                                    <input type="text" name='NICBID' id='NICBID' value={value?.NICBID} className='readonlyColor' required />
                                                    <label htmlFor="">NICB Id</label>
                                                </div>
                                            </div>
                                            <div className="col-6 col-md-6 col-lg-3 mt-3 date__box">
                                                <DatePicker
                                                    id='DestroyDtTm'
                                                    name='DestroyDtTm'
                                                    ref={startRef4}
                                                    onKeyDown={onKeyDown}
                                                    onChange={(date) => { setdestoryDate(date); setValue({ ...value, ['DestroyDtTm']: date ? getShowingMonthDateYear(date) : null }) }}
                                                    dateFormat="MM/dd/yyyy HH:mm"
                                                    timeInputLabel
                                                    isClearable={value?.DestroyDtTm ? true : false}
                                                    selected={destoryDate}
                                                    placeholderText={value?.DestroyDtTm ? value.DestroyDtTm : 'Select...'}
                                                    showTimeSelect
                                                    timeIntervals={1}
                                                    timeCaption="Time"
                                                    className='readonlyColor'
                                                    autoComplete="nope"
                                                    showYearDropdown
                                                    showMonthDropdown
                                                    dropdownMode="select"
                                                />
                                                <label htmlFor="">Destory Date</label>
                                            </div>
                                            <div className="col-12  col-md-12 col-lg-5 mt-1" >
                                                <div className=" text__dropdwon">
                                                    <textarea name='Description' id="Description" value={value?.Description} cols="30" rows='1' className="form-control  " >
                                                    </textarea>
                                                    <label htmlFor="">Description</label>
                                                </div>
                                            </div>
                                            <div className="col-2 col-md-6 col-lg-2 mt-2">
                                                <div class="form-check ">
                                                    <input class="form-check-input" name='IsEvidence' value={value?.IsEvidence} checked={value?.IsEvidence} type="checkbox" id="flexCheckDefault" />
                                                    <label class="form-check-label" for="flexCheckDefault">
                                                        Evidense
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="col-5 col-md-6 col-lg-3  mt-2">
                                                <div class="form-check ">
                                                    <input class="form-check-input" name='IsPropertyRecovered' value={value?.IsPropertyRecovered} checked={value?.IsPropertyRecovered} type="checkbox" id="flexCheckDefault1" />
                                                    <label class="form-check-label" for="flexCheckDefault1">
                                                        Property Recovered
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="col-5 col-md-6 col-lg-3 mt-2">
                                                <div class="form-check ">
                                                    <input class="form-check-input" name='IsImmobalizationDevice' value={value?.IsImmobalizationDevice} checked={value?.IsImmobalizationDevice} type="checkbox" id="flexCheckDefault2" />
                                                    <label class="form-check-label" for="flexCheckDefault2">
                                                        Immobilization Device
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="col-5 col-md-6 col-lg-4 mt-2">
                                                <div class="form-check ">
                                                    <input class="form-check-input" name='IsEligibleForImmobalization' value={value?.IsEligibleForImmobalization} checked={value?.IsEligibleForImmobalization} type="checkbox" id="flexCheckDefault3" />
                                                    <label class="form-check-label" for="flexCheckDefault3">
                                                        Eligible For Immobilization
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className=" col-4 col-md-4 col-lg-2 pt-1">
                                        <div className="img-box" style={{ marginTop: '-18px' }}>
                                            <Carousel autoPlay={true} className="carousel-style" showArrows={true} showThumbs={false} showStatus={false} >
                                                {
                                                    VehicleMultiImg.length > 0 ?
                                                        VehicleMultiImg?.map((item, index) => (
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
                                                vehicleID || masterPropertyID ?
                                                    <>
                                                        <div className="col-md-12 text-center " >
                                                            <label className='pers-img'> <i className='fa fa-upload'></i>
                                                                <input type="file" size="60"  />
                                                            </label>
                                                        </div>
                                                    </>
                                                    : <></>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12  text-right " style={{ marginBottom: '-10px' }}>
                                    {
                                        vehicleID && masterPropertyID || masterPropertyID ?
                                            <>
                                                <button type="button" className="btn btn-sm btn-success  mr-1" >Update</button>
                                            </>
                                            :
                                            <>
                                                <button type="button" className="btn btn-sm btn-success  mr-1" >Save</button>
                                            </>
                                    }
                                    <button type="button" className="btn btn-sm btn-success  mr-1" data-dismiss="modal" >Close</button>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
            <IdentifyFieldColor />

        </>
    )
}

export default VehicleHome