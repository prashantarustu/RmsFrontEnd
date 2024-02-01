import React, { useContext, useEffect } from 'react';
import Select from "react-select";
import DatePicker from "react-datepicker";
import { Decrypt_Id_Name, EncryptedList, Encrypted_Id_Name, getShowingDateText, getShowingMonthDateYear, getYearWithOutDateTime } from '../../../../Common/Utility';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AddDeleteUpadate, AddDeleteUpadate_FormData, fetchPostData } from '../../../../hooks/Api';
import { Comman_changeArrayFormat, threeColArray } from '../../../../Common/ChangeArrayFormat';
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import FindListDropDown from '../../../../Common/FindListDropDown';
import { VehicleListDropDownArray } from '../../../../Utility/ListDropDownArray/ListDropArray';
import { RequiredFieldIncident, RequiredFieldOnConditon } from '../../../Utility/Personnel/Validation';
import { fetchData } from "../../../../hooks/Api";
import { Carousel } from 'react-responsive-carousel';
import defualtImage from '../../../../../img/uploadImage.png';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import ChangesModal from '../../../../Common/ChangesModal';
import IdentifyFieldColor from '../../../../Common/IdentifyFieldColor';

const Home = ({ setStatus, setVehicleRecovered }) => {

    const useQuery = () => new URLSearchParams(useLocation().search);
    let openPage = useQuery().get('page');

    const { get_Data_Vehicle, get_vehicle_Count, get_Incident_Count, VehicleData, setVehicleData, updateCount, setUpdateCount, setChangesStatus, changesStatusCount, changesStatus, localStoreArray, setLocalStoreArray, get_LocalStorage, vehicleStatus, setVehicleStatus, deleteStoreData, storeData } = useContext(AgencyContext)

    const navigate = useNavigate();

    const [ReportedDtTm, setReportedDtTm] = useState();
    const [destoryDate, setdestoryDate] = useState();
    const [plateExpDate, setPlateExpDate] = useState();
    const [manufactureDate, setManufactureDate] = useState();
    const [inspectionExpDate, setInspectionExpDate] = useState();
    //Dropdown
    const [propertyLossCodeData, setPropertyLossCodeData] = useState([]);
    const [categoryIdDrp, setCategoryIdDrp] = useState([]);
    const [plateTypeIdDrp, setPlateTypeIdDrp] = useState([]);
    const [classificationId, setClassificationID] = useState([]);
    const [styleIdDrp, setStyleIdDrp] = useState([]);
    const [makeIdDrp, setMakeIdDrp] = useState([]);
    const [modalIdDrp, setModalIdDrp] = useState([]);
    const [arresteeDrpData, setArresteeDrpData] = useState([]);
    const [PrimaryOfficerID, setprimaryOfficerID] = useState([]);
    const [colorDrp, setColorDrp] = useState([]);
    const [VODIDData, setVODIDData] = useState([]);
    const [stateList, setStateList] = useState([]);
    const [lossCode, setLossCode] = useState('');

    //Ids
    // const [vehicleID, setVehicleID] = useState('')
    const [masterPropertyID, setMasterPropertyID] = useState('');

    const [Editval, setEditval] = useState();
    // ---------------------Image ------------------
    const [VehicleMultiImg, setVehicleMultiImg] = useState([])
    const [imageid, setImageId] = useState('');

    const [MainIncidentID, setMainIncidentID] = useState('');
    const [vehicleID, setVehicleID] = useState('')
    const [LoginAgencyID, setLoginAgencyID] = useState('');
    const [LoginPinID, setLoginPinID] = useState('');

    const [value, setValue] = useState({
        'IncidentID': '',
        'VehicleID': vehicleID,
        'PropertyID': '',
        'MasterPropertyID': masterPropertyID,
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
                if (localStoreArray.VehicleID || localStoreArray.MasterPropertyID) {
                    setVehicleID(localStoreArray?.VehicleID);
                    setMasterPropertyID(localStoreArray?.MasterPropertyID);
                } else {
                    setVehicleID('');
                    setMasterPropertyID('');
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
    }, [MainIncidentID]);

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
        if (lossCode === 'STOL' || lossCode === 'BURN' || lossCode === 'RECD') {
            if (RequiredFieldOnConditon(value.Value)) {
                setErrors(prevValues => ({ ...prevValues, ['ContactError']: RequiredFieldOnConditon(value.Value) }));
            }
        } else {
            setErrors(prevValues => ({ ...prevValues, ['ContactError']: RequiredFieldOnConditon(null) }));
        }
    }

    // Check All Field Format is True Then Submit 
    const { LossCodeIDError, CategoryIDError, ReportedDtTmError, RecoveryTypeIDError, PlateTypeIDError, ContactError } = errors

    useEffect(() => {
        if (LossCodeIDError === 'true' && CategoryIDError === 'true' && ReportedDtTmError === 'true' && PlateTypeIDError === 'true' && ContactError === 'true') {
            if (openPage === 'VehicleSearch') {
                if (masterPropertyID) { Update_Vehicle(); }
                else { Insert_Vehicle(); }
            } else {
                if (vehicleID && masterPropertyID) { Update_Vehicle(); }
                else { Insert_Vehicle() }
            }
        }
    }, [LossCodeIDError, CategoryIDError, ReportedDtTmError, RecoveryTypeIDError, PlateTypeIDError, ContactError])

    useEffect(() => {
        if (vehicleID || masterPropertyID) {
            GetSingleData(vehicleID, masterPropertyID)
        } else {
            reset();
        }
    }, [vehicleID, masterPropertyID, updateCount]);

    const GetSingleData = (vehicleID, masterPropertyID) => {
        const val = {
            'VehicleID': vehicleID,
            'MasterPropertyID': masterPropertyID,
        }
        const val2 = {
            'MasterPropertyID': masterPropertyID,
        }
        fetchPostData(openPage === 'VehicleSearch' ? 'MainMasterVehicle/GetSingleData_MainMasterVehicle' : 'PropertyVehicle/GetSingleData_PropertyVehicle', openPage === 'VehicleSearch' ? val2 : val).then((res) => {
            if (res.length > 0) {
                setEditval(res);
            } else { setEditval([]) }
        })
    }

    useEffect(() => {
        get_Vehicle_MultiImage(vehicleID, masterPropertyID);
        if (Editval) {
            get_Classification_Drp(Editval[0]?.CategoryID);
            sessionStorage.setItem("vehicleStolenValue", Encrypted_Id_Name(Editval[0]?.Value, 'VForVehicleStolenValue'));
            setValue({
                ...value,
                'LossCodeID': Editval[0]?.LossCodeID, 'NICBID': Editval[0]?.NICBID, 'TagID': Editval[0]?.TagID, 'PrimaryOfficerID': Editval[0]?.PrimaryOfficerID, 'SecondaryColorID': Editval[0]?.SecondaryColorID,
                'PrimaryColorID': Editval[0]?.PrimaryColorID, 'OwnerID': Editval[0]?.OwnerID, 'ModelID': Editval[0]?.ModelID, 'MakeID': Editval[0]?.MakeID, 'StyleID': Editval[0]?.StyleID, 'OANID': Editval[0]?.OANID, 'VODID': Editval[0]?.VODID,
                'ClassificationID': Editval[0]?.ClassificationID, 'PlateTypeID': Editval[0]?.PlateTypeID, 'PlateID': Editval[0]?.PlateID, 'CategoryID': Editval[0]?.CategoryID, 'VehicleNumber': Editval[0]?.VehicleNumber,
                'ReportedDtTm': Editval[0]?.ReportedDtTm ? getShowingDateText(Editval[0]?.ReportedDtTm) : '',
                'IsEligibleForImmobalization': Editval[0]?.IsEligibleForImmobalization, 'IsImmobalizationDevice': Editval[0]?.IsImmobalizationDevice, 'IsPropertyRecovered': Editval[0]?.IsPropertyRecovered,
                'IsEvidence': Editval[0]?.IsEvidence, 'InProfessionOf': Editval[0]?.InProfessionOf, 'Description': Editval[0]?.Description, 'DestroyDtTm': Editval[0]?.DestroyDtTm, 'InspectionExpiresDtTm': Editval[0]?.InspectionExpiresDtTm,
                'Inspection_Sticker': Editval[0]?.Inspection_Sticker, 'Value': Editval[0]?.Value, 'Weight': Editval[0]?.Weight, 'ManufactureYear': Editval[0]?.ManufactureYear,
                'VIN': Editval[0]?.VIN, 'VehicleNo': Editval[0]?.VehicleNo, 'PlateExpireDtTm': Editval[0]?.PlateExpireDtTm,
                'ModifiedByUserFK': LoginPinID, 'VehicleID': Editval[0]?.VehicleID, 'MasterPropertyID': Editval[0]?.MasterPropertyID,

                'Value': Editval[0]?.Value ? Editval[0]?.Value : "",
            })
            setLossCode(Get_LossCode(Editval, propertyLossCodeData))
            // propertyLossCodeData?.filter(val => {
            //     if (val.value === Editval[0]?.LossCodeID) {
            //         if (val.id === "STOL" || val.id === "RECD" || val.id === "BURN") {
            //             setVehicleRecovered(true);
            //         } else {
            //             setVehicleRecovered(false);
            //         }
            //     }
            // });
            get_ModalId_Drp(Editval[0]?.MakeID);
            setVehicleID(Editval[0]?.VehicleID);
            setReportedDtTm(Editval[0]?.ReportedDtTm ? new Date(Editval[0]?.ReportedDtTm) : '');
            setMasterPropertyID(Editval[0]?.MasterPropertyID);
            setdestoryDate(Editval[0]?.DestroyDtTm ? new Date(Editval[0]?.DestroyDtTm) : '');
            setInspectionExpDate(Editval[0]?.InspectionExpiresDtTm ? new Date(Editval[0]?.InspectionExpiresDtTm) : '');
            setManufactureDate(Editval[0]?.ManufactureYear ? new Date(Editval[0]?.ManufactureYear) : '');
            setPlateExpDate(Editval[0]?.PlateExpireDtTm ? new Date(Editval[0]?.PlateExpireDtTm) : '');
        } else {
            setValue({
                ...value,
                'VehicleNumber': '', 'VehicleNo': '', 'PlateID': '', 'OANID': '', 'Inspection_Sticker': '',
                'LossCodeID': '', 'CategoryID': '', 'PlateTypeID': '', 'ClassificationID': '',
                'VIN': '', 'VODID': '', 'PlateExpireDtTm': '', 'StyleID': '', 'MakeID': '', 'ModelID': '', 'ManufactureYear': '',
                'Weight': '', 'OwnerID': '', 'PrimaryColorID': '', 'SecondaryColorID': '', 'Value': '', 'InspectionExpiresDtTm': '',
                'PrimaryOfficerID': '', 'InProfessionOf': '', 'TagID': '', 'NICBID': '', 'DestroyDtTm': '', 'Description': '',
                'IsEvidence': '', 'IsPropertyRecovered': '', 'IsImmobalizationDevice': '', 'IsEligibleForImmobalization': '',
            })
        }
    }, [Editval])

    useEffect(() => {
        // console.log(lossCode)
        if (lossCode === 'STOL' || lossCode === 'BURN' || lossCode === 'RECD') {
            setVehicleRecovered(true);
        } else {
            setVehicleRecovered(false);
        }
    }, [lossCode]);

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
            'IncidentID': MainIncidentID,
            'MasterNameID': '0',
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
                // console.log(data)
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
                if (openPage === 'VehiclePawn') {
                    const id = data.filter((val) => { if (val?.PropertyReasonsCode === "PAWN") return val })
                    // console.log(id);
                    if (id?.length > 0) { setValue({ ...value, ['LossCodeID']: id[0]?.PropertyReasonCodeID }) }
                } else {

                }
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
                }); setChangesStatus(true)
            }
            if (name === 'CategoryID') { get_Classification_Drp(e.value) }
            setValue({
                ...value,
                [name]: e.value
            }); setChangesStatus(true)
        } else if (e === null) {
            if (name === 'CategoryID') {
                setValue({
                    ...value,
                    ['CategoryID']: '',
                    ['ClassificationID']: ''
                }); setChangesStatus(true)
                setClassificationID([]);
            }
            if (name === 'MakeID') {
                setValue({
                    ...value,
                    ['MakeID']: '',
                    ['ModelID']: ''
                }); setChangesStatus(true)

                setModalIdDrp([]);
            }
            setValue({
                ...value,
                [name]: null
            }); setChangesStatus(true)
        } else {

            setValue({
                ...value,
                [name]: null
            }); setChangesStatus(true)

        }
    }

    const HandleChanges = (e) => {
        if (e.target.name === 'IsEvidence' || e.target.name === 'IsPropertyRecovered' || e.target.name === 'IsImmobalizationDevice' || e.target.name === 'IsEligibleForImmobalization') {
            setValue({
                ...value,
                [e.target.name]: e.target.checked
            }); setChangesStatus(true)
        }
        else if (e.target.name === 'Value') {
            var ele = e.target.value.replace(/[^0-9\.]/g, "")
            console.log(ele);
            if (ele.length === 16) {
                setValue({
                    ...value,
                    [e.target.name]: ele
                }); setChangesStatus(true)
            } else {
                setValue({
                    ...value,
                    [e.target.name]: ele
                }); setChangesStatus(true)
            }
        } else if (e.target.name === 'Weight') {
            const checkNumber = e.target.value.replace(/[^0-9\s]/g, "");
            setChangesStatus(true)
            setValue({ ...value, [e.target.name]: checkNumber })
        }
        else {
            setValue({
                ...value,
                [e.target.name]: e.target.value
            }); setChangesStatus(true)
        }
    }

    const Insert_Vehicle = () => {
        AddDeleteUpadate(openPage === 'VehicleSearch' ? 'MainMasterVehicle/Insert_MainMasterVehicle' : 'PropertyVehicle/Insert_PropertyVehicle', value).then((res) => {
            if (res.success) {
                get_Incident_Count(MainIncidentID);
                toastifySuccess(res.Message);
                setErrors({ ...errors, ['LossCodeIDError']: '' })
                if (res.VehicleID && res.MasterPropertyID || res.MasterPropertyID) {
                    setChangesStatus(false)
                    setVehicleStatus(true);
                    setVehicleID(res.VehicleID);
                    setMasterPropertyID(res.MasterPropertyID);
                    storeData({ 'VehicleID': res?.VehicleID, 'MasterPropertyID': res?.MasterPropertyID, 'VehicleStatus': true })
                }
                setUpdateCount(updateCount + 1)
                setChangesStatus(false)
                setStatus(true)
                // reset();
            } else {
                toastifyError('Error')
            }
        })
    }

    const Update_Vehicle = () => {
        AddDeleteUpadate(openPage === 'VehicleSearch' ? 'MainMasterVehicle/Update_MainMasterVehicle' : 'PropertyVehicle/Update_PropertyVehicle', value).then((res) => {
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

    const OnClose = () => {
        if (!changesStatus) {
            if (openPage === 'VehicleSearch') {
                navigate('/vehicle-search');
                deleteStoreData({ 'VehicleID': '', 'MasterPropertyID': '', 'VehicleStatus': '' });
            } else if (openPage === 'VehiclePawn') {
                navigate('/PawnInformation-details');
                deleteStoreData({ 'VehicleID': '', 'MasterPropertyID': '', 'VehicleStatus': '' });
            } else {
                navigate('/vehicle');;
                deleteStoreData({ 'VehicleID': '', 'MasterPropertyID': '', 'VehicleStatus': '' });
            }
        }
    }

    // Custom Style
    const colourStyles = {
        control: (styles) => ({
            ...styles, backgroundColor: "#fce9bf",
            height: 20,
            minHeight: 31,
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

    const startRef = React.useRef();
    const startRef1 = React.useRef();
    const startRef2 = React.useRef();
    const startRef3 = React.useRef();
    const startRef4 = React.useRef();

    // const onKeyDown = (e) => {
    //     if (e.keyCode === 9 || e.which === 9) {
    //         startRef.current.setOpen(false);
    //         startRef1.current.setOpen(false);
    //         startRef2.current.setOpen(false);
    //         startRef3.current.setOpen(false);
    //         startRef4.current.setOpen(false);
    //     }
    // };

    const onKeyDown = (e) => {
        if (e.target.id === 'ReportedDate') {
            e.preventDefault();
        } else {
            if (e.keyCode === 9 || e.which === 9) {
                startRef.current.setOpen(false);
                startRef1.current.setOpen(false);
                startRef2.current.setOpen(false);
                startRef3.current.setOpen(false);
                startRef4.current.setOpen(false);
            }
        }
    };

    //---------------------------------------- Image Insert ------------------------------------------------
    const get_Vehicle_MultiImage = (vehicleID, masterPropertyID) => {
        const val = {
            'VehicleID': vehicleID,
            'MasterPropertyID': 0,
        }
        const val1 = {
            'VehicleID': 0,
            'MasterPropertyID': masterPropertyID,
        }
        fetchPostData('PropertyVehicle/GetData_PropertyVehiclePhoto', openPage === 'VehicleSearch' ? val1 : val)
            .then((res) => {
                if (res) { setVehicleMultiImg(res); }
                else { setVehicleMultiImg(); }
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
            'VehicleID': vehicleID,
            'MasterPropertyID': masterPropertyID,
            'CreatedByUserFK': LoginPinID,
        }
        const val1 = {
            'VehicleID': 0,
            'MasterPropertyID': masterPropertyID,
            'CreatedByUserFK': LoginPinID,
        }
        const values = EncryptedList(JSON.stringify(openPage === 'VehicleSearch' ? val1 : val));
        var formdata = new FormData();
        formdata.append("Vehiclephotopath", image);
        formdata.append("Data", values);
        AddDeleteUpadate_FormData('PropertyVehicle/Insert_PropertyVehiclePhoto', formdata)
            .then((res) => {
                if (res.success) {
                    get_Vehicle_MultiImage(vehicleID, masterPropertyID)
                }
            })
            .catch(err => console.log(err))
    }

    // const delete_Image_File = (e) => {
    //     e.preventDefault()
    //     const value = {
    //         'PhotoID': imageid,
    //         'DeletedByUserFK': LoginPinID,
    //     }
    //     AddDeleteUpadate('PropertyVehicle/Delete_PropertyVehiclePhoto', value).then((data) => {
    //         if (data.success) {
    //             toastifySuccess(data?.Message);
    //             get_Vehicle_MultiImage(vehicleID, masterPropertyID);
    //             if (openPage === 'VehicleSearch') {
    //                 GetSingleData();
    //             } else {
    //                 GetSingleData();
    //             }
    //         } else {
    //             toastifyError(data?.Message);
    //         }
    //     });
    // }

    const delete_Image_File = (e) => {
        const value = {
            'PhotoID': imageid,
            'DeletedByUserFK': LoginPinID
        }
        AddDeleteUpadate('PropertyVehicle/Delete_PropertyVehiclePhoto', value).then((data) => {
            if (data.success) {
                // toastifySuccess(data?.Message);
                get_Vehicle_MultiImage(vehicleID, masterPropertyID);
                GetSingleData(vehicleID, masterPropertyID);
            } else {
                toastifyError(data?.Message);
            }
        });
    }

    const ChangePhoneType = (e, name) => {
        if (e) {
            if (name === 'LossCodeID') {
                setLossCode(e.id);
                setChangesStatus(true);
                setValue({ ...value, [name]: e.value, Value: '', });
            } else {
                setChangesStatus(true);
                setValue({ ...value, [name]: e.value, });
            }
        } else if (e === null) {
            if (name === 'LossCodeID') {
                setChangesStatus(true);
                setLossCode('');
                setValue({ ...value, [name]: null, Value: '', });
            }
        }
    };

    const handleChanges = (e, name) => {
        if (e.target.name === 'Value') {
            var ele = e.target.value.replace(/[^0-9\.]/g, "")
            if (ele.includes('.')) {
                if (ele.length === 16) {
                    // setChangesStatus(true)    
                    setValue({ ...value, [e.target.name]: ele });
                } else {
                    // setChangesStatus(true)
                    if (ele.substr(ele.indexOf('.') + 1).slice(0, 2)) {
                        setValue({ ...value, [e.target.name]: ele.substring(0, ele.indexOf(".")) + '.' + ele.substr(ele.indexOf('.') + 1).slice(0, 2) });
                    } else { setValue({ ...value, [e.target.name]: ele }) }
                }
            } else {
                if (ele.length === 16) {
                    // setChangesStatus(true)
                    setValue({
                        ...value,
                        [e.target.name]: ele
                    });
                } else {
                    // setChangesStatus(true)
                    setValue({
                        ...value,
                        [e.target.name]: ele
                    });
                }
            }
        }
        else {
            setChangesStatus(true);
            setValue({
                ...value,
                [e.target.name]: e.target.value,
            });
        }
    }

    return (
        <>
            <div className="col-12 col-md-12 col-lg-12 p-0">
                <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                    <p className="p-0 m-0 d-flex align-items-center">Vehicle Information</p>
                    <FindListDropDown
                        array={VehicleListDropDownArray}
                    />
                </div>
                <div className="row">
                    <div className="col-4 col-md-4 col-lg-2 " style={{ marginTop: '6px' }}>
                        <div class="text-field">
                            <input type="text" name='VehicleNumber' id='VehicleNumber' value={value?.VehicleNumber} onChange={HandleChanges} className='readonlyColor' required />
                            <label style={{ paddingTop: '1px' }}>Vehicle Number</label>
                        </div>
                    </div>
                    <div className="col-4 col-md-4 col-lg-3  ">
                        <div className="dropdown__box">
                            {
                                openPage === 'masterProperty' ?
                                    <>
                                        <DatePicker
                                            id='ReportedDtTm'
                                            name='ReportedDtTm'
                                            ref={startRef}
                                            onKeyDown={onKeyDown}
                                            dateFormat="MM/dd/yyyy"
                                            isClearable={false}
                                            selected={ReportedDtTm}
                                            autoComplete="Off"
                                            className='requiredColor'
                                            // onChange={(date) => { setReportedDtTm(date); setValue({ ...value, ['ReportedDtTm']: date ? getShowingMonthDateYear(date) : null }) }}
                                            // disabled={true}
                                            timeInputLabel
                                            placeholderText={'Select...'}
                                            showTimeSelect
                                            timeIntervals={1}
                                            timeCaption="Time"
                                            showYearDropdown
                                            showMonthDropdown
                                            dropdownMode="select"
                                            maxDate={new Date()}
                                        />
                                    </>
                                    :
                                    <>
                                        <DatePicker
                                            id='ReportedDtTm'
                                            name='ReportedDtTm'
                                            ref={startRef}
                                            onKeyDown={onKeyDown}
                                            open={false}
                                            dateFormat="MM/dd/yyyy HH:mm"
                                            isClearable={false}
                                            // selected={ReportedDtTm}
                                            selected={value?.ReportedDtTm && new Date(value?.ReportedDtTm)}
                                            autoComplete="Off"
                                            className='readonlyColor'
                                            disabled={true}
                                        // onChange={(date) => { setReportedDtTm(date); setValue({ ...value, ['ReportedDtTm']: date ? getShowingMonthDateYear(date) : null }) }}
                                        // timeInputLabel
                                        // placeholderText={'Select...'}
                                        // showTimeSelect
                                        // timeIntervals={1}
                                        // timeCaption="Time"
                                        // showYearDropdown
                                        // showMonthDropdown
                                        // dropdownMode="select"
                                        // maxDate={new Date()}
                                        />
                                    </>
                            }
                            <label htmlFor="" className='pt-1'>Reported Date/Time</label>
                            {errors.ReportedDtTmError !== 'true' ? (
                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ReportedDtTmError}</span>
                            ) : null}
                        </div>
                    </div>
                    <div className="col-6 col-md-6 col-lg-4 mt-1">
                        <div className=" dropdown__box">
                            <Select
                                name='CategoryID'
                                value={categoryIdDrp?.filter((obj) => obj.value === value?.CategoryID)}
                                styles={colourStyles}
                                options={categoryIdDrp}
                                onChange={(e) => ChangeDropDown(e, 'CategoryID')}
                                isClearable
                                placeholder="Select..."
                            />
                            <label htmlFor="">Category</label>
                        </div>
                        {errors.CategoryIDError !== 'true' ? (
                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CategoryIDError}</span>
                        ) : null}
                    </div>
                    <div className="col-4 col-md-4 col-lg-3 mt-1">
                        <div className=" dropdown__box">
                            <Select
                                name='ClassificationID'
                                value={classificationId?.filter((obj) => obj.value === value?.ClassificationID)}
                                styles={customStylesWithOutColor}
                                options={classificationId}
                                onChange={(e) => ChangeDropDown(e, 'ClassificationID')}
                                isClearable
                                placeholder="Select..."
                            />
                            <label htmlFor="">Classification</label>
                        </div>
                    </div>
                    <div className="col-6 col-md-6 col-lg-3 mt-1">
                        <div className=" dropdown__box">
                            <Select
                                name='LossCodeID'
                                value={propertyLossCodeData?.filter((obj) => obj.value === value?.LossCodeID)}
                                styles={colourStyles}
                                options={propertyLossCodeData}
                                onChange={(e) => ChangePhoneType(e, 'LossCodeID')}
                                isClearable
                                placeholder="Select..."
                            />
                            <label htmlFor="">Loss Code</label>
                        </div>
                        {errors.LossCodeIDError !== 'true' ? (
                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.LossCodeIDError}</span>
                        ) : null}
                    </div>
                    <div className="col-6 col-md-6 col-lg-3 d-flex px-0">
                        <div className="col-6 col-md-8 col-lg-8 mt-1 ">
                            <div className=" dropdown__box">
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
                                <label htmlFor="" className='pl-0'>Plate Id</label>
                            </div>
                            {/* {errors.PlateIDError !== 'true' ? (
                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.PlateIDError}</span>
                            ) : null} */}
                        </div>
                        <span className='' style={{ marginLeft: '-10px', marginTop: '2px' }}>
                            <div className="text-field col-md-12 col-lg-12 pt-1 ">
                                {/* Required color comment */}
                                {/* <input type="text" name='' id='' maxLength={8} onChange={HandleChanges} placeholder='1234' className='requiredColor' required /> */}
                                <input type="text" name='VehicleNo' id='VehicleNo' maxLength={8} value={value?.VehicleNo} onChange={HandleChanges} className='' required />
                            </div>
                        </span>
                    </div>
                    <div className="col-6 col-md-6 col-lg-3 mt-1">
                        <div className=" dropdown__box">
                            <Select
                                name='PlateTypeID'
                                value={plateTypeIdDrp?.filter((obj) => obj.value === value?.PlateTypeID)}
                                styles={colourStyles}
                                options={plateTypeIdDrp}
                                onChange={(e) => ChangeDropDown(e, 'PlateTypeID')}
                                isClearable
                                placeholder="Select..."
                            />
                            <label htmlFor="">Plate Type</label>
                        </div>
                        {errors.PlateTypeIDError !== 'true' ? (
                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.PlateTypeIDError}</span>
                        ) : null}
                    </div>
                    <div className="col-4 col-md-4 col-lg-3 mt-1 d-flex">
                        <div class="text-field">
                            <input type="text" name='VIN' id='VIN' maxLength={17} value={value?.VIN} onChange={HandleChanges} className='' required />
                            <label className="pt-1">VIN</label>
                        </div>
                        <Link to={''} className='mt-2 pt-1'>
                            <span className='  col-1 col-md-1 col-lg-1'>
                                <i className='fa fa-search btn btn-sm bg-green text-white px-2 py-1'></i>
                            </span>
                        </Link>
                    </div>
                    <div className="col-4 col-md-4 col-lg-3 mt-1 pt-1">
                        <div className=" dropdown__box">
                            <Select
                                name='VODID'
                                value={VODIDData?.filter((obj) => obj.value === value?.VODID)}
                                styles={customStylesWithOutColor}
                                options={VODIDData}
                                onChange={(e) => ChangeDropDown(e, 'VODID')}
                                isClearable
                                placeholder="Select..."
                            />
                            <label htmlFor="">VOD</label>
                        </div>
                    </div>
                    <div className="col-4 col-md-4 col-lg-3" style={{ marginTop: '3px' }}>
                        <div className="dropdown__box">
                            <DatePicker
                                id='PlateExpireDtTm'
                                name='PlateExpireDtTm'
                                ref={startRef1}
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
                            />
                            <label htmlFor="" className='pt-1'>Plate Expires</label>
                        </div>
                    </div>
                    <div className="col-4 col-md-4 col-lg-3  " style={{ marginTop: '7px' }}>
                        <div class="text-field">
                            <input type="text" name='OANID' id='OANID' value={value?.OANID} onChange={HandleChanges} className='' required />
                            <label >OAN Id</label>
                        </div>
                    </div>
                    <div className="col-4 col-md-4 col-lg-3 pt-1">
                        <div className=" dropdown__box">
                            <Select
                                name='StyleID'
                                value={styleIdDrp?.filter((obj) => obj.value === value?.StyleID)}
                                styles={customStylesWithOutColor}
                                options={styleIdDrp}
                                onChange={(e) => ChangeDropDown(e, 'StyleID')}
                                isClearable
                                placeholder="Select..."
                            />
                            <label htmlFor="">Style</label>
                        </div>
                    </div>
                    <div className="col-4 col-md-6 col-lg-3 d-flex mt-1 px-0">
                        <div className="col-4 col-md-6 col-lg-10 ">
                            <div className=" dropdown__box">
                                <Select
                                    name='OwnerID'
                                    value={arresteeDrpData?.filter((obj) => obj.value === value?.OwnerID)}
                                    styles={customStylesWithOutColor}
                                    options={arresteeDrpData}
                                    onChange={(e) => ChangeDropDown(e, 'OwnerID')}
                                    isClearable
                                    placeholder="Select..."
                                />
                                <label htmlFor="">Owner</label>
                            </div>
                        </div>
                        <div className="col-1   px-0" style={{ marginTop: '13px' }}>
                            <Link to="" className="btn btn-sm bg-green text-white " data-toggle="modal" data-target="#AddMasterModal"
                            >
                                <i className="fa fa-plus"></i>
                            </Link>
                        </div>
                    </div>
                    <div className="col-4 col-md-4 col-lg-3 mt-1">
                        <div className="dropdown__box">
                            <Select
                                name='MakeID'
                                value={makeIdDrp?.filter((obj) => obj.value === value?.MakeID)}
                                styles={customStylesWithOutColor}
                                options={makeIdDrp}
                                onChange={(e) => ChangeDropDown(e, 'MakeID')}
                                isClearable
                                placeholder="Select..."
                            />
                            <label htmlFor="">Make</label>
                        </div>
                    </div>
                    <div className="col-4 col-md-6 col-lg-3 mt-1">
                        <div className=" dropdown__box">
                            <Select
                                name='ModelID'
                                value={modalIdDrp?.filter((obj) => obj.value === value?.ModelID)}
                                styles={customStylesWithOutColor}
                                options={modalIdDrp}
                                onChange={(e) => ChangeDropDown(e, 'ModelID')}
                                isClearable
                                placeholder="Select..."
                            />
                            <label htmlFor="">Model</label>
                        </div>
                    </div>
                    <div className="col-4 col-md-4 col-lg-2 ">
                        <div className="dropdown__box">
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
                            />
                            <label htmlFor="" className='pt-1'>Manufacture Year</label>
                        </div>
                    </div>
                    <div className="col-4 col-md-2 col-lg-1 " style={{ marginTop: '6px' }}>
                        <div class="text-field">
                            <input type="text" name='Weight' id='Weight' maxLength={4} value={value?.Weight} onChange={HandleChanges} className='' required />
                            <label >Weight</label>
                        </div>
                    </div>
                    <div className="col-4 col-md-6 col-lg-3 mt-1 pt-1">
                        <div className=" dropdown__box">
                            <Select
                                name='PrimaryColorID'
                                value={colorDrp?.filter((obj) => obj.value === value?.PrimaryColorID)}
                                styles={customStylesWithOutColor}
                                options={colorDrp}
                                onChange={(e) => ChangeDropDown(e, 'PrimaryColorID')}
                                isClearable
                                placeholder="Select..."
                            />
                            <label htmlFor="">Primary Color</label>
                        </div>
                    </div>
                    <div className="col-4 col-md-4 col-lg-3 mt-1 pt-1">
                        <div className=" dropdown__box">
                            <Select
                                name='SecondaryColorID'
                                value={colorDrp?.filter((obj) => obj.value === value?.SecondaryColorID)}
                                styles={customStylesWithOutColor}
                                options={colorDrp}
                                onChange={(e) => ChangeDropDown(e, 'SecondaryColorID')}
                                isClearable
                                placeholder="Select..."
                            />
                            <label htmlFor="">Secondary Color</label>
                        </div>
                    </div>
                    <div className="col-4 col-md-4 col-lg-2   " style={{ marginTop: '9px' }}>
                        <div class="text-field">
                            <input
                                type="text"
                                name="Value"
                                id="Value"
                                className={lossCode === 'STOL' || lossCode === 'BURN' || lossCode === 'RECD' ? 'requiredColor' : ''}
                                maxLength={20}
                                value={`\$ ${value?.Value}`}
                                onChange={handleChanges}
                                required
                            />
                            <label >Value</label>
                            {errors.ContactError !== 'true' ? (
                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ContactError}</span>
                            ) : null}
                        </div>
                    </div>
                    <div className="col-4 col-md-4 col-lg-2  " style={{ marginTop: '9px' }}>
                        <div class="text-field">
                            <input type="text" name='Inspection_Sticker' id='Inspection_Sticker' value={value?.Inspection_Sticker} onChange={HandleChanges} className='' required />
                            <label >Inspection Sticker</label>
                        </div>
                    </div>
                    <div className="col-4 col-md-5 col-lg-2  mt-1">
                        <div className="dropdown__box">
                            <DatePicker
                                id='InspectionExpiresDtTm'
                                name='InspectionExpiresDtTm'
                                ref={startRef3}
                                onKeyDown={onKeyDown}
                                onChange={(date) => { setInspectionExpDate(date); setValue({ ...value, ['InspectionExpiresDtTm']: date ? getShowingMonthDateYear(date) : null }) }}
                                dateFormat="MM/dd/yyyy"
                                isClearable
                                selected={inspectionExpDate}
                                placeholderText={value?.InspectionExpiresDtTm ? value?.InspectionExpiresDtTm : 'Select...'}
                                autoComplete="nope"
                                showYearDropdown
                                showMonthDropdown
                                dropdownMode="select"
                            />
                            <label htmlFor="" className='pt-1'>Inspection Expires</label>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12 col-md-12 col-lg-12 p-0 ">
                <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                    <p className="p-0 m-0 d-flex align-items-center">
                        Additional Information
                    </p>
                </div>
                <div className="row">
                    <div className="col-lg-10">
                        <div className="row">
                            <div className="col-6 col-md-8 col-lg-6 mt-1">
                                <div className=" dropdown__box">
                                    <Select
                                        name='PrimaryOfficerID'
                                        value={PrimaryOfficerID?.filter((obj) => obj.value === value?.PrimaryOfficerID)}
                                        styles={customStylesWithOutColor}
                                        options={PrimaryOfficerID}
                                        onChange={(e) => ChangeDropDown(e, 'PrimaryOfficerID')}
                                        isClearable
                                        placeholder="Select..."
                                    />
                                    <label htmlFor="">Primary Officer</label>
                                </div>
                            </div>
                            <div className="col-4 col-md-6 col-lg-6 d-flex  px-0">
                                <div className="col-6 col-md-4 col-lg-11 " style={{ marginTop: '5px' }}>
                                    <div class="text-field">
                                        <input type="text" name='InProfessionOf' id='InProfessionOf' onChange={HandleChanges} value={value?.InProfessionOf} className='readonlyColor' required readOnly />
                                        <label >In Possession Of Name</label>
                                    </div>
                                </div>
                                <div className="col-1   px-0" style={{ marginTop: '16px' }}>
                                    <Link to="" className="btn btn-sm bg-green text-white " data-toggle="modal" data-target="#AddMasterModal"
                                    >
                                        <i className="fa fa-plus"></i>
                                    </Link>
                                </div>
                            </div>
                            <div className="col-3  col-md-3 col-lg-2  mt-1 pt-1" >
                                <div className="text-field">
                                    <input type="text" name='TagID' id='TagID' value={value?.TagID} onChange={HandleChanges} className='readonlyColor' required readOnly />
                                    <label htmlFor="">Tag Id</label>
                                </div>
                            </div>
                            <div className="col-3  col-md-3 col-lg-2  mt-1 pt-1" >
                                <div className="text-field">
                                    <input type="text" name='NICBID' id='NICBID' value={value?.NICBID} onChange={HandleChanges} className='readonlyColor' required readOnly />
                                    <label htmlFor="">NIC Id</label>
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
                                    readOnly
                                />
                                <label htmlFor="">Destory Date</label>
                            </div>
                            <div className="col-12  col-md-12 col-lg-5 mt-1" >
                                <div className=" dropdown__box">
                                    <textarea name='Description' id="Description" value={value?.Description} onChange={HandleChanges} cols="30" rows='1' className="form-control  " >
                                    </textarea>
                                    <label htmlFor="">Description</label>
                                </div>
                            </div>
                            <div className="col-2 col-md-6 col-lg-2 mt-2">
                                <div class="form-check ">
                                    <input class="form-check-input" name='IsEvidence' value={value?.IsEvidence} checked={value?.IsEvidence} onChange={HandleChanges} type="checkbox" id="flexCheckDefault" />
                                    <label class="form-check-label" for="flexCheckDefault">
                                        Evidense
                                    </label>
                                </div>
                            </div>
                            <div className="col-5 col-md-6 col-lg-3  mt-2">
                                <div class="form-check ">
                                    <input class="form-check-input" name='IsPropertyRecovered' value={value?.IsPropertyRecovered} checked={value?.IsPropertyRecovered} onChange={HandleChanges} type="checkbox" id="flexCheckDefault1" />
                                    <label class="form-check-label" for="flexCheckDefault1">
                                        Property Recovered
                                    </label>
                                </div>
                            </div>
                            <div className="col-5 col-md-6 col-lg-3 mt-2">
                                <div class="form-check ">
                                    <input class="form-check-input" name='IsImmobalizationDevice' value={value?.IsImmobalizationDevice} checked={value?.IsImmobalizationDevice} onChange={HandleChanges} type="checkbox" id="flexCheckDefault2" />
                                    <label class="form-check-label" for="flexCheckDefault2">
                                        Immobilization Device
                                    </label>
                                </div>
                            </div>
                            <div className="col-5 col-md-6 col-lg-4 mt-2">
                                <div class="form-check ">
                                    <input class="form-check-input" name='IsEligibleForImmobalization' value={value?.IsEligibleForImmobalization} checked={value?.IsEligibleForImmobalization} onChange={HandleChanges} type="checkbox" id="flexCheckDefault3" />
                                    <label class="form-check-label" for="flexCheckDefault3">
                                        Eligible For Immobilization
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className=" col-4 col-md-4 col-lg-2 pt-1 mt-3">
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
                        <div className="row" style={{ marginBottom: '-15px' }}>
                            {
                                vehicleID || masterPropertyID ?
                                    <>
                                        <div className="col-md-12 text-center " >
                                            <label className='pers-img'> <i className='fa fa-upload'></i>
                                                <input type="file" size="60" onChange={get_Image_File} />
                                            </label>
                                        </div>
                                    </>
                                    : <></>
                            }
                        </div>
                    </div>
                </div>
                <div className="col-12  text-right mt-3" >
                    {
                        vehicleID && masterPropertyID || masterPropertyID ?
                            <>
                                <button type="button" className="btn btn-sm btn-success  mr-1" onClick={(e) => { check_Validation_Error(); }}>Update</button>
                            </>
                            :
                            <>
                                <button type="button" className="btn btn-sm btn-success  mr-1" onClick={(e) => { check_Validation_Error(); }}>Save</button>
                            </>
                    }
                    <button type="button" className="btn btn-sm btn-success  mr-1" data-dismiss="modal" data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} onClick={() => { OnClose() }}>Close</button>
                </div>
            </div>
            <IdentifyFieldColor />
            <DeletePopUpModal func={delete_Image_File} />
            <ChangesModal func={check_Validation_Error} />

        </>
    )
}

export default Home

const Get_LossCode = (data, dropDownData) => {
    // console.log(data)
    const result = data?.map((sponsor) => (sponsor.LossCodeID))

    const result2 = dropDownData?.map((sponsor) => {
        if (sponsor.value === result[0]) {
            return { value: result[0], label: sponsor.label, id: sponsor.id }
        }
    })
    const val = result2.filter(function (element) {
        return element !== undefined;
    });
    return val[0]?.id
}