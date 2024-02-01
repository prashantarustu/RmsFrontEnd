import React, { useState,useContext ,useEffect} from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";
import { Decrypt_Id_Name, Encrypted_Id_Name, colourStyles, customStylesWithOutColor, getShowingDateText, getShowingMonthDateYear } from '../../../../../Common/Utility';
import { Link } from 'react-router-dom';
import { AgencyContext } from '../../../../../../Context/Agency/Index';
import MobileTab from '../../../../MobileUtility/MobileTab';
import { AddDeleteUpadate, fetchPostData } from '../../../../../hooks/Api';
import { Comman_changeArrayFormat, threeColArrayWithCode } from '../../../../../Common/ChangeArrayFormat';
import { toastifyError, toastifySuccess } from '../../../../../Common/AlertMsg';
import { RequiredFieldIncident } from '../../../../../Pages/Utility/Personnel/Validation';
import { RequiredField } from '../../../../../Pages/Agency/AgencyValidation/validators';
import Location from '../../../../../Location/Location';
import MobileFieldColor from '../../../../../Common/MobileFieldColor';
import MobileVerifyLocation from '../../MobileVerifyLocation/MobileVerifyLocation';
import {  ScreenPermision } from '../../../../../hooks/Api';

const IncidentDesign = () => {

    // const { incidentStatus, setIncidentStatus, setOccurredToDate, setOccurredFromDate, GetDataExceptionalClearanceID, exceptionalClearID, setEceptionalClearID, getRmsDispositionID, rmsDisposition, setShowPage } = useContext(AgencyContext)
    const { incidentStatus, setIncidentStatus, get_IncidentTab_Count,setExClsDateCode , get_Incident_Count, setIncidentNumber, setOccurredToDate, setOccurredFromDate,setShowPage, setIncidentReportedDate, setIncidentRmsCfs, exceptionalClearID, GetDataExceptionalClearanceID, rmsDisposition, getRmsDispositionID, setChangesStatus, changesStatus, localStoreArray, get_LocalStorage, deleteStoreData, storeData } = useContext(AgencyContext);
    // const [showPage, setShowPage] = useState('Mobilenarrative');
    const [status, setStatus] = useState(false);
    const [fRWIncidentData, setFRWIncidentData] = useState([]);
    const [FBIDrpVal, setFBIDrpVal] = useState([]);
   
    const [ClsDrpCode, setClsDrpCode] = useState();
    const [count, setCount] = useState(0)
    const [OccurredFrom, setOccurredFrom] = useState(new Date());
    const [ReportedDate, setReportedDate] = useState(new Date());
    const [OccurredTo, setOccurredTo] = useState(new Date());
    const [modalStatus, setModalStatus] = useState(false);
    const [addVerifySingleData, setVerifySingleData] = useState([]);
    const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState([]);
    const [LoginAgencyID, setLoginAgencyID] = useState('');
    const [LoginPinID, setLoginPinID,] = useState('');
    const [AgencyName, setAgencyName] = useState('');
    const [incidentID, setIncidentID] = useState();
  
     //DropDown Value
     const [rmsCfsID, setRmsCfsID] = useState([]);
     const [nibrsCodeDrp, setNibrsCodeDrp] = useState([]);
     const [reciveSourceID, setReciveSourceID] = useState([]);
     const [cadCfsCodeID, setCadCfsCodeID] = useState([]);
     const [cadDispositionId, setCadDispositionID] = useState([]);
    const [loder, setLoder] = useState(false);
    const [value, setValue] = useState({
        'RMSIncidentID': '',
        'IncidentID': '',
        'PINID': '',
        'IsIncidentCode': '',
        'MasterIncident_FRWNumber': '',
        //Date
        'ReportedDate': getShowingMonthDateYear(new Date()),
        'OccurredFrom': getShowingMonthDateYear(new Date()),
        'OccurredTo': getShowingMonthDateYear(new Date()),
        'DispositionDate': getShowingMonthDateYear(new Date()),
        'FinishedDate': '',
        'DispatchedDate': '',
        'ArrivedDate': '',
        //Drp
        'FBIID': '',
        'NIBRSClearanceID': '',
        'RMSCFSCodeID': '',
        'RMSDispositionId': '',
        'CrimeLocation': '',
        'CADCFSCodeID': '',
        'ReceiveSourceID': '',
        'DispositionComments': '',
        'CADDispositionId': '',
        'BIBRSDate': '',
        'AgencyID': '',
        'IsVerify': true,
        'crimelocationid': '',
        'NIBRSclearancedate': '',
        'PIN': '',// for -----------showing PIN Number in modal 
        'IncidentNumber': '',// for -----------showing incident Number in modal 
        // 'Officer_Name': localStorage.getItem('UserName') ? Decrypt_Id_Name(localStorage.getItem('UserName'), 'UForUserName') : '',
        'CreatedByUserFK' : ''
        
    });

    const [errors, setErrors] = useState({
        'reportedDateError': '', 'occeredFromDateError': '', 'occeredToDateError': '', 'CrimeLocationError': '', 'FBIIDError': '', 'RMSCFSCodeIDError': '', 'RMSDispositionIdError': '', 'DispositionDateError': '', 'NIBRSClearanceIDError': '',
    })

    useEffect(() => {
        if (!localStoreArray.AgencyID || !localStoreArray.PINID) {
            get_LocalStorage();
        }
    }, []);

    useEffect(() => {
        if (localStoreArray) {
            if (localStoreArray?.AgencyID && localStoreArray?.PINID) {
                if (EffectiveScreenPermission?.length === 0) { getScreenPermision(localStoreArray?.AgencyID, localStoreArray?.PINID); }
                setIncidentStatus(localStoreArray.IncidentStatus === true || localStoreArray.IncidentStatus === "True" ? true : false);
                setLoginAgencyID(localStoreArray?.AgencyID);
                setLoginPinID(localStoreArray?.PINID);
                setAgencyName(localStoreArray?.Agency_Name);
                setValue({ ...value, 'AgencyID': localStoreArray?.AgencyID, 'CreatedByUserFK': localStoreArray?.PINID });
                if (localStoreArray.IncidentID && localStoreArray.IncidentStatus === true || localStoreArray.IncidentStatus === "True") {
                    setIncidentID(parseInt(localStoreArray?.IncidentID));
                } else {
                    setIncidentID(''); setLoder(true)
                }
            }
        }
    }, [localStoreArray])

    useEffect(()=>{
        setValue({ ...value, 'AgencyID': localStoreArray?.AgencyID, 'CreatedByUserFK': localStoreArray?.PINID });  
    },[LoginAgencyID])

  
    
    
    useEffect(() => {
        if (incidentID) { get_Incident_SingleData(incidentID); get_Incident_Count(incidentID); get_IncidentTab_Count(incidentID); }
    }, [incidentID]);

    useEffect(() => {
        if (('IncidentId')) 
        get_Incident_SingleData();
        FBIidDrpVal();
    }, [count]);

    const get_Incident_SingleData = (incidentID) => {
        const val = {
            'IncidentID': incidentID,
        }
        fetchPostData('Incident_FRW/GetSingleData_Incident_FRW', val).then((res) => {
            if (res) {
                console.log(res)
                setFRWIncidentData(res);
            }
            else {
                setFRWIncidentData();
            }
        })
    }

    const getScreenPermision = (LoginAgencyID, PinID) => {
        ScreenPermision("I034", LoginAgencyID, PinID).then(res => {
            if (res) {
                setEffectiveScreenPermission(res)
            } else {
                setEffectiveScreenPermission([])
            }
        });
    }

    const check_Validation_Error = (e) => {
        if (ClsDrpCode === 'EC') {
            if (RequiredFieldIncident(value.ReportedDate)) {
                setErrors(prevValues => { return { ...prevValues, ['reportedDateError']: RequiredFieldIncident(value.ReportedDate) } })
            }
            if (RequiredFieldIncident(value.OccurredFrom)) {
                setErrors(prevValues => { return { ...prevValues, ['occeredFromDateError']: RequiredFieldIncident(value.OccurredFrom) } })
            }
            if (RequiredField(value.CrimeLocation)) {
                setErrors(prevValues => { return { ...prevValues, ['CrimeLocationError']: RequiredField(value.CrimeLocation) } })
            }
            if (RequiredFieldIncident(value.OccurredTo)) {
                setErrors(prevValues => { return { ...prevValues, ['occeredToDateError']: RequiredFieldIncident(value.OccurredTo) } })
            }
            if (RequiredFieldIncident(value.FBIID)) {
                setErrors(prevValues => { return { ...prevValues, ['FBIIDError']: RequiredFieldIncident(value.FBIID) } })
            }
            if (RequiredFieldIncident(value.RMSCFSCodeID)) {
                setErrors(prevValues => { return { ...prevValues, ['RMSCFSCodeIDError']: RequiredFieldIncident(value.RMSCFSCodeID) } })
            }
            if (RequiredFieldIncident(value.RMSDispositionId)) {
                setErrors(prevValues => { return { ...prevValues, ['RMSDispositionIdError']: RequiredFieldIncident(value.RMSDispositionId) } })
            }
            if (RequiredFieldIncident(value.DispositionDate)) {
                setErrors(prevValues => { return { ...prevValues, ['DispositionDateError']: RequiredFieldIncident(value.DispositionDate) } })
            }
            if (RequiredFieldIncident(value.NIBRSClearanceID)) {
                setErrors(prevValues => { return { ...prevValues, ['NIBRSClearanceIDError']: RequiredFieldIncident(value.NIBRSClearanceID) } })
            }
        } else {
            if (RequiredFieldIncident(value.ReportedDate)) {
                setErrors(prevValues => { return { ...prevValues, ['reportedDateError']: RequiredFieldIncident(value.ReportedDate) } })
            }
            if (RequiredFieldIncident(value.OccurredFrom)) {
                setErrors(prevValues => { return { ...prevValues, ['occeredFromDateError']: RequiredFieldIncident(value.OccurredFrom) } })
            }
            if (RequiredField(value.CrimeLocation)) {
                setErrors(prevValues => { return { ...prevValues, ['CrimeLocationError']: RequiredField(value.CrimeLocation) } })
            }
            if (RequiredFieldIncident(value.OccurredTo)) {
                setErrors(prevValues => { return { ...prevValues, ['occeredToDateError']: RequiredFieldIncident(value.OccurredTo) } })
            }
            if (RequiredFieldIncident(value.FBIID)) {
                setErrors(prevValues => { return { ...prevValues, ['FBIIDError']: RequiredFieldIncident(value.FBIID) } })
            }
            if (RequiredFieldIncident(value.RMSCFSCodeID)) {
                setErrors(prevValues => { return { ...prevValues, ['RMSCFSCodeIDError']: RequiredFieldIncident(value.RMSCFSCodeID) } })
            }
            if (RequiredFieldIncident(value.RMSDispositionId)) {
                setErrors(prevValues => { return { ...prevValues, ['RMSDispositionIdError']: RequiredFieldIncident(value.RMSDispositionId) } })
            }
            if (RequiredFieldIncident(value.DispositionDate)) {
                setErrors(prevValues => { return { ...prevValues, ['DispositionDateError']: RequiredFieldIncident(value.DispositionDate) } })
            }
        }
    }

    // Check All Field Format is True Then Submit 
    const { reportedDateError, occeredFromDateError, occeredToDateError, CrimeLocationError, FBIIDError, RMSCFSCodeIDError, RMSDispositionIdError, DispositionDateError, NIBRSClearanceIDError } = errors

    useEffect(() => {
        if (ClsDrpCode === 'EC') {
            if (reportedDateError === 'true' && occeredFromDateError === 'true' && occeredToDateError === 'true' && CrimeLocationError === 'true' && FBIIDError === 'true' && RMSCFSCodeIDError === 'true' && RMSDispositionIdError === 'true' && DispositionDateError == 'true' && NIBRSClearanceIDError === 'true') {
                if (incidentStatus) { Update_FRWIncident(); setErrors({ ...errors, ['OccuredError']: '', }); }
                else { AddIncident(); setErrors({ ...errors, ['OccuredError']: '', }); }
            }
            else if (reportedDateError === 'Required *' || occeredFromDateError === 'Required *' || occeredToDateError === 'Required *' || CrimeLocationError === 'Required *' || FBIIDError === 'Required *' || RMSCFSCodeIDError === 'Required *' || RMSDispositionIdError === 'Required *' || DispositionDateError == 'Required *' || NIBRSClearanceIDError === 'Required *') toastifyError('Please Fill All Required Field')
        } else {
            if (reportedDateError === 'true' && occeredFromDateError === 'true' && occeredToDateError === 'true' && CrimeLocationError === 'true' && FBIIDError === 'true' && RMSCFSCodeIDError === 'true' && RMSDispositionIdError === 'true' && DispositionDateError == 'true') {
                if (incidentStatus) { setErrors({ ...errors, ['OccuredError']: '', }); console.log("callsadfsdfs"); Update_FRWIncident(); }
                else { AddIncident(); setErrors({ ...errors, ['OccuredError']: '', }); }
            }
            else if (reportedDateError === 'Required *' || occeredFromDateError === 'Required *' || occeredToDateError === 'Required *' || CrimeLocationError === 'Required *' || FBIIDError === 'Required *' || RMSCFSCodeIDError === 'Required *' || RMSDispositionIdError === 'Required *' || DispositionDateError == 'Required *' || NIBRSClearanceIDError === 'Required *') toastifyError('Please Fill All Required Field ')
        }
    }, [reportedDateError, occeredFromDateError, occeredToDateError, CrimeLocationError, FBIIDError, RMSCFSCodeIDError, RMSDispositionIdError, DispositionDateError, NIBRSClearanceIDError])

    useEffect(() => {
        if (fRWIncidentData.length > 0) {
            console.log(fRWIncidentData[0])
            setValue({
                ...value,
                //drpdown
                'IncidentID': fRWIncidentData[0]?.IncidentID,
                'AgencyID': fRWIncidentData[0]?.AgencyID,
                'RMSIncidentID': fRWIncidentData[0]?.RMSIncidentID,
                'Officer_Name': fRWIncidentData[0]?.Officer_Name,
                'IncidentNumber': fRWIncidentData[0]?.IncidentNumber,
                'CADDispositionId': fRWIncidentData[0]?.CADDispositionId,
                'RMSCFSCodeID': fRWIncidentData[0]?.RMSCFSCodeID,
                'RMSDispositionId': fRWIncidentData[0]?.RMSDispositionId,
                'NIBRSClearanceID': fRWIncidentData[0]?.NIBRSClearanceID,
                'FBIID': fRWIncidentData[0]?.FBIID,
                'PINID': fRWIncidentData[0]?.PINID,
                'PIN': fRWIncidentData[0]?.PIN,
                'IsVerify': fRWIncidentData[0]?.IsVerify,
                //date fields     
                'ReportedDate': fRWIncidentData[0]?.ReportedDate ? getShowingDateText(fRWIncidentData[0]?.ReportedDate) : '',
                'OccurredFrom': fRWIncidentData[0]?.OccurredFrom ? getShowingDateText(fRWIncidentData[0]?.OccurredFrom) : '',
                'OccurredTo': fRWIncidentData[0]?.OccurredTo ? getShowingDateText(fRWIncidentData[0]?.OccurredTo) : '',
                'DispositionDate': fRWIncidentData[0]?.DispositionDate ? fRWIncidentData[0]?.DispositionDate : '',
                'NIBRSclearancedate': fRWIncidentData[0]?.NIBRSclearancedate ? getShowingDateText(fRWIncidentData[0]?.NIBRSclearancedate) : '',
                //text
                'CrimeLocation': fRWIncidentData[0]?.CrimeLocation,
            });
            setClsDrpCode(Get_Exceptional_Code(fRWIncidentData, rmsDisposition));
            getRmsCfsCodeID(fRWIncidentData[0]?.FBIID);
            setOccurredFrom(fRWIncidentData[0]?.OccurredFrom ? new Date(fRWIncidentData[0]?.OccurredFrom) : '');
            setOccurredTo(fRWIncidentData[0]?.OccurredTo ? new Date(fRWIncidentData[0]?.OccurredTo) : '');
            setIncidentRmsCfs(fRWIncidentData[0]?.RMSCFSCodeID);
            if (!fRWIncidentData[0]?.IsVerify) {
                get_Add_Single_Data(fRWIncidentData[0]?.crimelocationid);
                // console.log(!editval[0]?.IsVerify)
            } else {
                get_Add_Single_Data(0);
            }
        } else {
            setValue({
                ...value,
                'FBIID': '',
                'DispositionDate': '',
                'NIBRSclearancedate': '',
                //text
                'CrimeLocation': '',
                //drpdown
                'RMSCFSCodeID': '',
                'NIBRSClearanceID': '',
                'RMSDispositionId': '',
                'CADDispositionId': '',
            });
        }
    }, [fRWIncidentData])

    const ChangeDropDown = (e, name) => {
        if (e) {
            if (name === "RMSCFSCodeID") {
                setChangesStatus(true)
                setIncidentRmsCfs(e.value);
                setValue({
                    ...value,
                    [name]: e.value
                })
            } else if (name === "RMSDispositionId") {
                setChangesStatus(true)
                setClsDrpCode(e.id);
                setValue({
                    ...value,
                    [name]: e.value,
                    ['DispositionDate']: getShowingMonthDateYear(new Date()),
                    ['NIBRSclearancedate']: '',
                });
                setErrors({ ...errors, ['OccuredError']: '', ['ExceptionalClearaceError']: '', });
            } else if (name === 'FBIID') {
                setChangesStatus(true)
                getRmsCfsCodeID(e.value)
                setValue({
                    ...value,
                    [name]: e.value,
                    ['RMSCFSCodeID']: '',
                });
                setErrors({ ...errors, ['OccuredError']: '', });
            } else if (name === 'NIBRSClearanceID') {
                setChangesStatus(true)
                setExClsDateCode(e.id);
                if (e.id != 'N') {
                    setValue({
                        ...value,
                        [name]: e.value,
                        ['NIBRSclearancedate']: getShowingMonthDateYear(new Date()),
                    });
                    setErrors({ ...errors, ['OccuredError']: '', ['NIBRSclearancedateError']: '', });
                } else {
                    setChangesStatus(true)
                    setValue({
                        ...value,
                        [name]: e.value,
                        ['NIBRSclearancedate']: '',
                    });
                    setErrors({ ...errors, ['OccuredError']: '', ['NIBRSclearancedateError']: '', });
                }
            } else {
                setChangesStatus(true)
                setValue({
                    ...value,
                    [name]: e.value,
                })
            }
        } else if (e === null) {
            setChangesStatus(true)
            if (name === "RMSDispositionId") {
                setValue({
                    ...value,
                    [name]: null,
                    ['NIBRSClearanceID']: null,
                    ['DispositionDate']: '',
                    ['NIBRSclearancedate']: '',
                });
                setClsDrpCode('');
                setExClsDateCode('');
                setErrors({ ...errors, ['OccuredError']: '', ['ExceptionalClearaceError']: '', });
            } else if (name === 'FBIID') {
                setChangesStatus(true)
                setRmsCfsID([]);
                setValue({
                    ...value,
                    ['FBIID']: "",
                    ['RMSCFSCodeID']: "",
                })
            } else if (name === 'NIBRSClearanceID') {
                setChangesStatus(true)
                setValue({
                    ...value,
                    [name]: null,
                    ['NIBRSclearancedate']: "",
                });
            } else {
                setChangesStatus(true)
                setValue({
                    ...value,
                    [name]: null
                });
            }
        } else {
            setChangesStatus(true);
            setValue({
                ...value,
                [name]: null
            });
        }
    }

    useEffect(() => {
        if (ClsDrpCode !== "EC") {
            setValue({
                ...value,
                ['NIBRSClearanceID']: ''
            })
        }
    }, [ClsDrpCode]);

    const handleInputChange = (e) => {
        if (e) {
            setValue({
                ...value,
                [e.target.name]: e.target.value,
            })
        }
    }


    useEffect(() => {
        // console.log("Call Drp useEffect")
        if (exceptionalClearID.length === 0) { GetDataExceptionalClearanceID(LoginAgencyID); }
        if (rmsDisposition.length === 0) { getRmsDispositionID(LoginAgencyID); }
        GetDataReciveSourceID(LoginAgencyID); getCADCFSCodeID(LoginAgencyID); GetCadDispositionId(LoginAgencyID); FBIidDrpVal();
    }, [LoginAgencyID])


    const GetDataReciveSourceID = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID,
        }
        fetchPostData('Incident/GetData_ReceiveSource', val).then((data) => {
            if (data) {
                setReciveSourceID(changeArrayFormat(data, 'ReciveSrcID'))
            } else {
                setReciveSourceID([]);
            }
        })
    }

    const getCADCFSCodeID = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID,
        }
        fetchPostData('Incident/GetData_CADCFSCODE', val).then((data) => {
            if (data) {
                setCadCfsCodeID(Comman_changeArrayFormat(data, 'CADCFSCodeID', 'CADCFSCode'))
            } else {
                setCadCfsCodeID([]);
            }
        })
    }
    const GetCadDispositionId = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID,
        }
        fetchPostData('Incident/GetData_CADDisposition', val).then((data) => {
            if (data) {
                setCadDispositionID(Comman_changeArrayFormat(data, 'CADDispositionId', 'CADDispositionCode'))
            } else {
                setCadDispositionID([]);
            }
        })
    }


    const FBIidDrpVal = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID,
        }
        fetchPostData('FBICodes/GetDataDropDown_FBICodes', val).then((data) => {
            if (data) {
                setFBIDrpVal(threeColArrayWithCode(data, 'FBIID', 'Description', 'FederalSpecificFBICode'))
            } else {
                setFBIDrpVal([]);
            }
        })
    }

    const getRmsCfsCodeID = (FBIID) => {
        const val = {
            'FBIID': FBIID,
            'AgencyID': LoginAgencyID,
        }
        fetchPostData('ChargeCodes/GetDataDropDown_ChargeCodes', val).then((data) => {
            if (data) {
                setRmsCfsID(Comman_changeArrayFormat(data, 'ChargeCodeID', 'Description'))
            } else {
                setRmsCfsID([]);
            }
        })
    }

    const AddIncident = () => {
        console.log(value)
        AddDeleteUpadate('Incident_FRW/InsertNewIncident_FRW', value).then((res) => {
            if (res.success) {
                toastifySuccess(res.Message);
                // console.log(res);
                if (res.IncidentID) {
                    get_IncidentTab_Count(res.IncidentID);
                    setIncidentID(res.IncidentID); setChangesStatus(false);
                    storeData({ 'IncidentID': res?.IncidentID, 'IncidentNumber': res?.IncidentNumber, 'IncidentStatus': true, 'ReportedDate': res?.ReportedDate }); setIncidentNumber(res?.IncidentNumber);
                    setCount(count + 1)
                }
                setIncidentStatus(true)
                setErrors({ ...errors, ['RMSDispositionIdError']: ' ', ['OccuredError']: '', });
            } else {
                toastifyError("Error");
                setErrors({ ...errors, ['RMSDispositionIdError']: ' ', ['OccuredError']: '', });
            }
        })
    }

    const Update_FRWIncident = () => {
        // console.log(value)
        AddDeleteUpadate('Incident_FRW/Incident_FRWUpdate', value).then((res) => {
            toastifySuccess(res.Message);
            setErrors({ ...errors, ['RMSDispositionIdError']: ' ', ['OccuredError']: '', });
        })
    }

    const openNav = () => {
        document.getElementById("mySidenav").style.width = "auto";
        document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
    }

    const closeNav = () => {
        document.getElementById("mySidenav").style.width = "0";
        document.body.style.backgroundColor = "white";
    }

    //--------------Location------------
    const get_Add_Single_Data = (crimelocationid) => {
        const val = {
            'LocationID': crimelocationid,
        }
        fetchPostData('MasterLocation/GetSingleData_MasterLocation', val).then((res) => {
            if (res.length > 0) {
                // console.log(res)
                setVerifySingleData(res)
            } else {
                setVerifySingleData([])
            }
        })
    }
    const HandleChange = (e) => {
        if (e.target.name === 'IsVerify') {
            // setValue({
            //     ...value,
            //     ['CrimeLocation']: '',
            //     [e.target.name]: e.target.checked,
            // })
            setValue(pre => { return { ...pre, ['CrimeLocation']: '', [e.target.name]: e.target.checked, } });
            if (e.target.checked) {
                setModalStatus(false);
            } else {
                setModalStatus(true);
            }
        } else {
            setValue({
                ...value,
                [e.target.name]: e.target.value
            })
        }
    }

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
            minHeight: 45,
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
    const startRef5 = React.useRef();

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
    return (
        <>
            <div>
                <div className="row clearfix" >
                    <div className="col-12 col-sm-12 px-2">
                        <div className="card Agency " style={{ borderRight: 'none', borderLeft: 'none', borderRadius: '0' }}>
                            <div className="card-body ">
                                <div className="row ">
                                    <div className={`col-12 col-md-12`}>
                                        <div className="row">
                                            <div className="col-12  mobile__tabs" style={{ marginTop: '-18px', marginBottom: '-20px' }}>
                                                <MobileTab />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-sm-12 col-lg-12 px-3">
                        <div className="row mt-1 ">
                            <div class="col-6 col-md-6 mt-1  col-lg-3 ">
                                <div className="text-mobile">
                                    <input type="text" name='ResourceNumber' className='readonlyColor' required readOnly />
                                    <label className='pt-1'>CAD Event Id</label>
                                </div>
                            </div>
                            <div class="col-6 col-md-6 mt-1  col-lg-3 ">
                                <div className="text-mobile">
                                    <input type="text" name='IncidentNumber' value={value?.IncidentNumber} placeholder='Auto Generated' className='readonlyColor' required readOnly />
                                    <label className='pt-1'>RMS Case Id</label>
                                </div>
                            </div>
                            <div class="col-6 col-md-6 mt-1  col-lg-3 ">
                                <div className="text-mobile">
                                    <input type="text" name='Officer_Name' value={value?.Officer_Name} className='readonlyColor' required readOnly />
                                    <label className='pt-1'>Officer Name</label>
                                </div>
                            </div>
                            <div class="col-6 col-md-6 mt-1  col-lg-3 ">
                                <div className="text-mobile">
                                    <input type="text" value={value?.PIN} name='PIN' className='readonlyColor' required readOnly />
                                    <label className='pt-1'>PID</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* {sessionStorage.getItem('IncidentId') && <>
                        <Link to='/incident-tabs'>
                            <div data-toggle="modal" data-target="#myModal" style={{ fontSize: 18, cursor: 'pointer', fontWeight: 'bold', background: 'cadetblue', position: 'absolute', padding: '7px 10px', right: '0px', color: '#434A54', top: '0px' }} onClick={setShowPage('Mobilenarrative')}>
                                <i className='fa fa-arrow-left' style={{ fontSize: '18px' }}></i>
                                <span onClick={openNav}>Tabs</span>
                            </div>
                        </Link>
                    </>} */}

                    { incidentID &&
                
                        <Link to='/incident-tabs'>
                            <div data-toggle="modal" data-target="#myModal" style={{ fontSize: 18, cursor: 'pointer', fontWeight: 'bold', background: 'cadetblue', position: 'absolute', padding: '7px 10px', right: '0px', color: '#434A54', top: '0px' }} onClick={setShowPage('Mobilenarrative')}>
                                <i className='fa fa-arrow-left' style={{ fontSize: '18px' }}></i>
                                <span onClick={openNav}>Tabs</span>
                            </div>
                        </Link>
                     }
                    <div className="card Agency mt-1 " style={{ borderRight: 'none', borderLeft: 'none', borderRadius: '0', marginTop: '-10px', }}>
                        <div className="card-body">
                            <div className="row">
                                <div className={`col-12 col-md-12 col-lg-12 px-0`}>
                                    <div className="row">
                                        <div class="col-6 col-md-6 col-lg-4 mt-1">
                                            <div className="text__date">
                                                <DatePicker
                                                    id='ReportedDate'
                                                    name='ReportedDate'
                                                    ref={startRef}
                                                    onKeyDown={onKeyDown}
                                                    className='requiredColor new-datepicker'
                                                    dateFormat="MM/dd/yyyy HH:mm"
                                                    open={false}
                                                    onChange={(date) => { setValue({ ...value, ['ReportedDate']: date ? getShowingMonthDateYear(date) : null }) }}
                                                    timeInputLabel
                                                    isClearable={false}
                                                    placeholderText={value?.ReportedDate ? value?.ReportedDate : 'Select...'}
                                                    selected={value?.ReportedDate && new Date(value?.ReportedDate)}
                                                    showTimeSelect
                                                    timeIntervals={1}
                                                    timeCaption="Time"
                                                    dropdownMode="select"
                                                    autoComplete='Off'
                                                    peekNextMonth
                                                    showMonthDropdown
                                                    showYearDropdown
                                                    // filterTime={filterPassedTime}
                                                    maxDate={new Date()}
                                                />
                                                <label htmlFor="" className='pt-2 '>

                                                    Reported  Date/Time
                                                    <span className='text-danger pl-1'>
                                                        *
                                                    </span>
                                                </label>
                                                {/* {errors.reportedDateError !== 'true' ? (
                                                    <span style={{ color: 'red', fontSize: '10px', margin: '0px', padding: '0px' }}>{errors.reportedDateError}</span>
                                                ) : null} */}
                                            </div>
                                        </div>
                                        <div class="col-6 col-md-6 col-lg-4 mt-1">
                                            <div className="text__date">
                                                <DatePicker
                                                    ref={startRef1}
                                                    name='OccurredFrom'
                                                    id='OccurredFrom'
                                                    onChange={(date) => {
                                                        setValue({ ...value, ['OccurredFrom']: date ? getShowingMonthDateYear(date) : null, })
                                                    }}
                                                    onKeyDown={onKeyDown}
                                                    className='requiredColor new-datepicker'
                                                    dateFormat="MM/dd/yyyy HH:mm"
                                                    timeInputLabel
                                                    isClearable
                                                    placeholderText='Select...'
                                                    peekNextMonth
                                                    dropdownMode="select"
                                                    showMonthDropdown
                                                    showYearDropdown
                                                    selected={value?.OccurredFrom && new Date(value?.OccurredFrom)}
                                                    showTimeSelect
                                                    // filterTime={filterPassedTime}
                                                    timeIntervals={1}
                                                    timeCaption="Time"
                                                    maxDate={new Date()}
                                                />
                                                <label htmlFor="" className='pt-2 '>

                                                    Occurred From Date/Time
                                                    <span className='text-danger pl-1'>
                                                        *
                                                    </span>
                                                </label>
                                                {/* {errors.occeredFromDateError !== 'true' ? (
                                                    <span style={{ color: 'red', fontSize: '10px', margin: '0px', padding: '0px' }}>{errors.occeredFromDateError}</span>
                                                ) : null} */}
                                            </div>
                                        </div>
                                        <div class="col-6 col-md-6 col-lg-4 mt-1">
                                            <div className="text__date">
                                                <DatePicker
                                                    id='OccurredTo'
                                                    name='OccurredTo'
                                                    ref={startRef2}
                                                    onKeyDown={onKeyDown}
                                                    onChange={(date) => {
                                                        setValue({ ...value, ['OccurredTo']: date ? getShowingMonthDateYear(date) : null })
                                                    }}
                                                    className='requiredColor new-datepicker'
                                                    dateFormat="MM/dd/yyyy HH:mm"
                                                    timeInputLabel
                                                    isClearable
                                                    autoComplete="Off"
                                                    selected={value?.OccurredTo && new Date(value?.OccurredTo)}
                                                    placeholderText={value?.OccurredTo ? value.OccurredTo : 'Select...'}
                                                    showMonthDropdown
                                                    showYearDropdown
                                                    dropdownMode="select"
                                                    minDate={new Date(value?.OccurredFrom)}
                                                    maxDate={new Date()}
                                                    showDisabledMonthNavigation
                                                    showTimeSelect
                                                    timeIntervals={1}
                                                    timeCaption="Time"
                                                />
                                                <label htmlFor="" className='pt-2 '>

                                                    Occurred To Date/Time
                                                    <span className='text-danger pl-1'>
                                                        *
                                                    </span>
                                                </label>
                                                {/* {errors.occeredToDateError !== 'true' ? (
                                                
                                                <span style={{ color: 'red', fontSize: '10px', margin: '0px', padding: '0px' }}>{errors.occeredToDateError}</span>
                                                ) : null} */}
                                            </div>
                                        </div>
                                        <div class="col-6 col-md-10  col-lg-11 mt-2 pt-1">
                                            <div className=' text-mobile'>
                                                <Location {...{ value, setValue }} col='CrimeLocation' locationID='crimelocationid' check={true} verify={value.IsVerify} />
                                                <label htmlFor="" className='pl-0 pt-1'>Crime Location
                                                    <span className='text-danger pl-1'>
                                                        *
                                                    </span></label>
                                                {/* {errors.CrimeLocationError !== 'true' ? (
                                                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CrimeLocationError}</span>
                                                ) : null} */}
                                            </div>
                                        </div>
                                        {/* <div className="col-2 col-md-2 col-lg-1 mt-4 pt-3 ">
                                            <div class="form-check ">
                                                <input class="form-check-input" data-toggle="modal" data-target="#VerifyModal" type="checkbox" name='IsVerify'
                                                    checked={value.IsVerify || value.crimelocationid === 0 && true}
                                                    value={value?.IsVerify} onChange={HandleChange} id="flexCheckDefault" style={{ cursor: 'pointer' }} />
                                                <label class="form-check-label" for="flexCheckDefault">
                                                    Verify
                                                </label>
                                            </div>
                                            {
                                                value?.IsVerify === false && addVerifySingleData.length > 0 ?
                                                    <>
                                                        <i className="fa fa-edit " onClick={() => { get_Add_Single_Data(value.crimelocationid); setModalStatus(true); }} data-toggle="modal" data-target="#VerifyModal" style={{ cursor: 'pointer', backgroundColor: '' }} > Edit </i>
                                                    </>
                                                    :
                                                    <>
                                                    </>
                                            }
                                        </div> */}

                                        <div className="col-2 col-md-2 col-lg-1 mt-3 ">
                                            <Link to={'/incident-verifylocation'}>
                                                <div class="form-check ">
                                                    <input class="form-check-input" data-toggle="modal" data-target="#" type="checkbox" name='IsVerify'
                                                        checked={value.IsVerify || value.crimelocationid === 0 && true}
                                                        value={value?.IsVerify} onChange={HandleChange} id="flexCheckDefault" style={{ cursor: 'pointer' }} />
                                                    <label class="form-check-label" for="flexCheckDefault">
                                                        Verify
                                                    </label>
                                                </div>
                                                {
                                                    value?.IsVerify === false && addVerifySingleData.length > 0 ?
                                                        <>
                                                            <i className="fa fa-edit " onClick={() => { get_Add_Single_Data(value.crimelocationid); setModalStatus(true); }} data-toggle="modal" data-target="#" style={{ cursor: 'pointer', backgroundColor: '' }} > Edit </i>
                                                        </>
                                                        :
                                                        <>
                                                        </>
                                                }
                                            </Link>
                                        </div>
                                        <div class="col-6 col-md-6  col-lg-4 mt-2">
                                            <div className="text__dropdwon">
                                                <Select
                                                    name='FBIID'
                                                    menuPlacement='top'
                                                    styles={colourStyles}
                                                    value={FBIDrpVal?.filter((obj) => obj.value === value?.FBIID)}
                                                    isClearable
                                                    options={FBIDrpVal}
                                                    onChange={(e) => ChangeDropDown(e, 'FBIID')}
                                                    placeholder="Select..."
                                                />
                                                <label htmlFor='' className='pt-2'>
                                                    FBI Code
                                                    <span className='text-danger pl-1'>
                                                        *
                                                    </span>
                                                </label>
                                                {/* {errors.FBIIDError !== 'true' ? (
                                                    <span style={{ color: 'red', fontSize: '10px', margin: '0px', padding: '0px' }}>{errors.FBIIDError}</span>
                                                ) : null} */}
                                            </div>
                                        </div>
                                        <div class="col-6 col-md-6  col-lg-7 mt-2">
                                            <div className="text__dropdwon">
                                                <Select
                                                    name='RMSCFSCodeID'
                                                    menuPlacement='top'
                                                    styles={colourStyles}
                                                    value={rmsCfsID?.filter((obj) => obj.value === value?.RMSCFSCodeID)}
                                                    isClearable
                                                    options={rmsCfsID}
                                                    onChange={(e) => ChangeDropDown(e, 'RMSCFSCodeID')}
                                                    placeholder="Select..."
                                                />
                                                <label htmlFor='' className='pt-2'>
                                                    RMS CFS  Code
                                                    <span className='text-danger pl-1'>
                                                        *
                                                    </span>
                                                </label>
                                                {errors.RMSCFSCodeIDError !== 'true' ? (
                                                    <span style={{ color: 'red', fontSize: '10px', margin: '0px', padding: '0px' }}>{errors.RMSCFSCodeIDError}</span>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div class="col-6 col-md-6  col-lg-4 mt-2">
                                            <div className="text__dropdwon">
                                                <Select
                                                    name='RMSDispositionId'
                                                    menuPlacement='top'
                                                    value={rmsDisposition?.filter((obj) => obj.value === value?.RMSDispositionId)}
                                                    isClearable
                                                    options={rmsDisposition}
                                                    onChange={(e) => ChangeDropDown(e, 'RMSDispositionId')}
                                                    placeholder="Select..."
                                                    styles={colourStyles}
                                                />
                                                <label htmlFor='' className='pt-2'>
                                                    RMS Disposition
                                                    <span className='text-danger pl-1'>
                                                        *
                                                    </span>
                                                </label>
                                                {/* {errors.RMSDispositionIdError !== 'true' ? (
                                                    <span style={{ color: 'red', fontSize: '10px', margin: '0px', padding: '0px' }}>{errors.RMSDispositionIdError}</span>
                                                ) : null} */}
                                            </div>
                                        </div>
                                        <div class="col-6 col-md-6 col-lg-4 mt-2 pt-3">
                                            <div className="text__date">
                                                <DatePicker
                                                    id='DispositionDate'
                                                    name='DispositionDate'
                                                    ref={startRef3}
                                                    onKeyDown={onKeyDown}
                                                    popperPlacement='top'
                                                    className='requiredColor new-datepicker'
                                                    dateFormat="MM/dd/yyyy HH:mm"
                                                    onChange={(date) => { setValue({ ...value, ['DispositionDate']: date ? getShowingMonthDateYear(date) : null }) }}
                                                    timeInputLabel
                                                    isClearable={value?.DispositionDate ? true : false}
                                                    placeholderText={value?.DispositionDate ? value?.DispositionDate : 'Select...'}
                                                    selected={value?.DispositionDate && new Date(value?.DispositionDate)}
                                                    showTimeSelect
                                                    timeIntervals={1}
                                                    timeCaption="Time"
                                                    dropdownMode="select"
                                                    peekNextMonth
                                                    showMonthDropdown
                                                    autoComplete='Off'
                                                    showYearDropdown
                                                    // filterTime={filterPassedTime}
                                                    disabled={value?.RMSDispositionId ? false : true}
                                                    maxDate={new Date()}
                                                />
                                                <label htmlFor="" className='pt-2 '>
                                                    Disposition Date/Time
                                                    <span className='text-danger pl-1'>
                                                        *
                                                    </span>
                                                </label>
                                                {/* {errors.DispositionDateError !== 'true' ? (
                                                    <span style={{ color: 'red', fontSize: '10px', margin: '0px', padding: '0px' }}>{errors.DispositionDateError}</span>
                                                ) : null} */}
                                            </div>
                                        </div>
                                        <div class="col-6 col-md-6  col-lg-4 mt-2 ">
                                            <div className="text__dropdwon">
                                                <Select
                                                    name='NIBRSClearanceID'
                                                    menuPlacement='top'
                                                    value={exceptionalClearID?.filter((obj) => obj.value === value?.NIBRSClearanceID)}
                                                    isClearable
                                                    options={exceptionalClearID}
                                                    onChange={(e) => ChangeDropDown(e, 'NIBRSClearanceID')}
                                                    placeholder="Select..."
                                                    styles={ClsDrpCode === 'EC' ? colourStyles : customStylesWithOutColor}
                                                    readOnly={ClsDrpCode === 'EC' ? false : true}
                                                    isDisabled={ClsDrpCode === "EC" ? false : true}
                                                />
                                                <label htmlFor='' className='pt-2'>
                                                    Exceptional Clearance
                                                    {/* <span className='text-danger pl-1'>
                                                        *
                                                    </span> */}
                                                </label>
                                                {/* {errors.NIBRSClearanceIDError !== 'true' ? (
                                                    <span style={{ color: 'red', fontSize: '10px', margin: '0px', padding: '0px' }}>{errors.NIBRSClearanceIDError}</span>
                                                ) : null} */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* <div className="row bt" style={{ marginBottom: '-15px' }}>
                                <div className="col-6  " >
                                    <div className="row">
                                        <div className="box mt-1">
                                            <button type="button" className="btn btn-sm  btn-success new-mobile mr-3" style={{ fontSize: '20px' }}>Arrest</button>
                                        </div>
                                        <div className="box mt-1">
                                            <button type="button" className="btn btn-sm  btn-success new-mobile mr-3" style={{ fontSize: '20px' }}>Narrative</button>
                                        </div>
                                    </div>
                                </div>
                                <hr />
                                <div className="col-6 text-right" style={{ marginTop: '10px' }}>
                                    <button type="button" className="btn btn-lg  btn-success new-button mr-3" onClick={() => { check_Validation_Error(); }}>
                                        {sessionStorage.getItem('IncidentId') ? 'Update' : 'Save'}
                                    </button>
                                    <Link to={'/incident-main'}>
                                        <button type="button" className="btn btn-lg btn-success new-button" >Close</button>
                                    </Link>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
            <div className="row px-1"  style={{marginTop:'-9px'}}>
                {/* <div className="col-6" >
                    <div className="row">
                        <div className="box mt-1 mb-1">
                            <button type="button" className="btn btn-sm  btn-success new-mobile mr-3" style={{ fontSize: '18px' }}>Arrest</button>
                        </div>
                        <div className="box mt-1">
                            <button type="button" className="btn btn-sm  btn-success new-mobile mr-3" style={{ fontSize: '18px' }}>Narrative</button>
                        </div>
                    </div>
                </div>
                <hr /> */}
                <div className="col-12 text-right bb" >
                {
                                        incidentStatus ?
                                            EffectiveScreenPermission ?
                                                EffectiveScreenPermission[0]?.Changeok ?
                                                    <button type="button" className="btn btn-sm btn-success new-button mb-1 px-2 py-1 mr-2" onClick={(e) => { check_Validation_Error(); }}>Update</button>
                                                    : <></>
                                                : <button type="button" className="btn btn-sm btn-success new-button mb-1 px-2 py-1 mr-2" onClick={(e) => { check_Validation_Error(); }}>Update</button>
                                            :
                                            EffectiveScreenPermission ?
                                                EffectiveScreenPermission[0]?.AddOK ?
                                                    <button type="button" className="btn btn-sm btn-success new-button mb-1 px-2 py-1 mr-2" onClick={(e) => { check_Validation_Error(); }}>Save</button>
                                                    : <></>
                                                : <button type="button" className="btn btn-sm btn-success new-button mb-1 px-2 py-1 mr-2" onClick={(e) => { check_Validation_Error(); }}>Save</button>
                                    }
                    <Link to={'/incident-main'}>
                        <button type="button" className="btn btn-md btn-success new-button mb-1" onClick={() => { ('IncidentId'); sessionStorage.removeItem('RMSIncidentId') }} >Close</button>
                    </Link>
                </div>
            </div>
            <MobileFieldColor />
            <MobileVerifyLocation  {...{ LoginAgencyID ,modalStatus, setModalStatus, value, setValue, addVerifySingleData, get_Add_Single_Data }} />
        </>
    )
}

export default IncidentDesign

const Get_Exceptional_Code = (data, dropDownData) => {
    const result = data?.map((sponsor) =>
        (sponsor.RMSDispositionId)
    )
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
export const changeArrayFormat = (data, type) => {
    // state--> city--> zip
    if (type === 'zip') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.zipId, label: sponsor.Zipcode })
        )
        return result
    }
    if (type === 'state') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.StateID, label: sponsor.StateName })
        )
        return result
    }
    if (type === 'city') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.CityID, label: sponsor.CityName })
        );
        return result
    }

    if (type === 'RmsCfsID') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.RMSCFSCodeID, label: sponsor.RMSCFSCode })
        )
        return result
    }
    if (type === 'RmsDisposition') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.IncidentDispositionsID, label: sponsor.RMSDispositionCode })
        )
        return result
    }
    if (type === 'ExceptionClearID') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.ClearanceID, label: sponsor.ClearanceCode })
        )
        return result
    }
    if (type === 'ReciveSrcID') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.ReceiveSourceID, label: sponsor.ReceiveSourceCode })
        )
        return result
    }
}

export const changeArrayFormat_WithFilter = (data, type, DropDownValue) => {
    if (DropDownValue) {
        if (type === 'CADCFSCodeID') {
            const result = data?.map((sponsor) =>
                (sponsor.CADCFSCodeID)
            )
            const result2 = DropDownValue?.map((sponsor) => {
                if (sponsor.value === result[0]) {
                    return { value: result[0], label: sponsor.label }
                }
            }
            )
            const val = result2.filter(function (element) {
                return element !== undefined;
            });
            return val[0]
        }
    }
}