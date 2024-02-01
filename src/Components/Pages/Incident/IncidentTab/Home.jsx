import React, { useContext, useState } from 'react';
import Select from "react-select";
import DatePicker from "react-datepicker";
import { AgencyContext } from '../../../../Context/Agency/Index';
import { Decrypt_Id_Name, Encrypted_Id_Name, getShowingDateText, getShowingMonthDateYear } from '../../../Common/Utility';
import { useEffect } from 'react';
import { AddDeleteUpadate, ScreenPermision, fetchPostData } from '../../../hooks/Api';
import { toastifyError, toastifySuccess } from '../../../Common/AlertMsg';
import { Link, useNavigate } from 'react-router-dom';
import { RequiredField, RequiredFieldIncident, Space_Allow_with_Trim, checkDateIsAfter } from '../../Utility/Personnel/Validation';
import { Comman_changeArrayFormat, threeColArrayWithCode, } from '../../../Common/ChangeArrayFormat';
import VerifyLocation from './VerifyLocation/VerifyLocation';
import IdentifyFieldColor from '../../../Common/IdentifyFieldColor';
import Location from '../../../Location/Location';
import { ArrChargeListDropDownArray, IncListDropDownArray } from '../../../Utility/ListDropDownArray/ListDropArray';
import FindListDropDown from '../../../Common/FindListDropDown';
import Loader from '../../../Common/Loader';
import ChangesModal from '../../../Common/ChangesModal';
import moment from 'moment';

const Home = (props) => {

    const { incidentReportedDate, setIncidentReportedDate } = props
    const { incidentStatus, setIncidentStatus, get_IncidentTab_Count, get_Incident_Count, setIncidentNumber, setIncidentRmsCfs, exceptionalClearID, GetDataExceptionalClearanceID, rmsDisposition, getRmsDispositionID, setChangesStatus, changesStatus, localStoreArray, get_LocalStorage, deleteStoreData, storeData } = useContext(AgencyContext);

    const [ReportedDate, setReportedDate] = useState(new Date());
    const [BIBRSDate, setBIBRSDate] = useState(new Date());
    const [occurDateIsAfter, setOccurDateIsAfter] = useState(false);

    const [loder, setLoder] = useState(false);
    const [modalStatus, setModalStatus] = useState(false);
    const [addVerifySingleData, setVerifySingleData] = useState([]);

    const [LoginAgencyID, setLoginAgencyID] = useState('');
    const [LoginPinID, setLoginPinID,] = useState('');
    const [AgencyName, setAgencyName] = useState('');
    const [incidentID, setIncidentID] = useState();
    const [locationStatus, setlocationStatus] = useState(false);

    //DropDown Value
    const [rmsCfsID, setRmsCfsID] = useState([]);
    const [nibrsCodeDrp, setNibrsCodeDrp] = useState([]);
    const [reciveSourceID, setReciveSourceID] = useState([]);
    const [cadCfsCodeID, setCadCfsCodeID] = useState([]);
    const [cadDispositionId, setCadDispositionID] = useState([]);
    const [editval, setEditval] = useState();
    const [ClsDrpCode, setClsDrpCode] = useState();
    const [ExClsDateCode, setExClsDateCode] = useState('N');
    const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState([]);

    const [value, setValue] = useState({
        'IncidentID': '',
        'ReportedDate': getShowingMonthDateYear(new Date()),
        'OccurredFrom': '',
        'OccurredTo': '',
        'BIBRSDate': getShowingMonthDateYear(new Date()),
        'FinishedDate': '',

        'DispositionDate': '',
        'NIBRSclearancedate': '',
        //text
        'IncidentNumber': '',
        'CrimeLocation': '',
        'DispositionComments': '',
        'AgencyName': '',
        //drpdown
        'RMSCFSCodeID': '',
        'NIBRSClearanceID': '',
        'RMSDispositionId': '',
        'ReceiveSourceID': '',
        'CADCFSCodeID': '',
        'CADDispositionId': '',
        'AgencyID': '',
        'IsVerify': true,
        'crimelocationid': '',
        'FBIID': '',
        'IsIncidentCode': true,

        //Not Included
        'DispatchedDate': '',
        'ArrivedDate': '',

        // Incident Location Field/
        'DirectionPrefix': '',
        'Street': '',
        'DirectionSufix': '',
        'TypeSufix': '',
        'City': '',
        'State': '',
        'ZipCode': '',
        'PremiseNo': '',
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
        'IsUsLocation': '',
        'CountryID': '',
        'Country': '',
        'point_of_interest': '',
        'neighborhood': '',
        'subpremise': '',
        'premise': '',
        'CreatedByUserFK': '',
        'ModifiedByUserFK': '',
    })

    const [errors, setErrors] = useState({
        'OccuredError': '',
        // 'OccurredFromError': '', 'OccurredToError': '', 
        'CrimeLocationError': '', 'RmsCfsCodeError': '', 'ExceptionalClearaceError': '', 'IsVerify': '',
        'FBIIDError': '', 'NIBRSclearancedateError': '',
    })

    const localStore = {
        Value: "",
        UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
        Key: JSON.stringify({ AgencyID: "", PINID: "", IncidentID: '', Agency_Name: '', IncidentStatus: '' }),
    }

    useEffect(() => {
        if (!localStoreArray.AgencyID || !localStoreArray.PINID) {
            get_LocalStorage();
        }
    }, []);

    // Onload Function
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

    useEffect(() => {
        if (incidentID) { GetEditData(incidentID); get_Incident_Count(incidentID); get_IncidentTab_Count(incidentID); }
    }, [incidentID]);

    const GetEditData = (incidentID) => {
        const val = {
            IncidentID: incidentID
        }
        fetchPostData('Incident/GetSingleData_Incident', val)
            .then((res) => {
                if (res) {
                    setEditval(res); setLoder(true);
                }
                else { setEditval(); setLoder(true) }
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

    useEffect(() => {
        if (incidentID) {
            // console.log('editval', editval);
            setValue({
                ...value,
                //drpdown
                'IncidentID': editval[0]?.IncidentID,
                'AgencyID': editval[0]?.AgencyID,
                'CADDispositionId': editval[0]?.CADDispositionId,
                'CADCFSCodeID': editval[0]?.CADCFSCodeID,
                'RMSCFSCodeID': editval[0]?.RMSCFSCodeID,
                'RMSDispositionId': editval[0]?.RMSDispositionId,
                'NIBRSClearanceID': editval[0]?.NIBRSClearanceID,
                'ReceiveSourceID': editval[0]?.ReceiveSourceID,
                'crimelocationid': editval[0]?.crimelocationid,
                'FBIID': editval[0]?.FBIID,
                //date fields
                'IncidentNumber': editval[0]?.IncidentNumber,
                'ReportedDate': editval[0]?.ReportedDate ? getShowingDateText(editval[0]?.ReportedDate) : '',
                'OccurredFrom': editval[0]?.OccurredFrom ? getShowingDateText(editval[0]?.OccurredFrom) : '',
                'OccurredTo': editval[0]?.OccurredTo ? getShowingDateText(editval[0]?.OccurredTo) : '',
                'BIBRSDate': editval[0]?.BIBRSDate ? getShowingDateText(editval[0]?.BIBRSDate) : '',
                'DispositionDate': editval[0]?.DispositionDate ? editval[0]?.DispositionDate : '',
                'NIBRSclearancedate': editval[0]?.NIBRSclearancedate ? getShowingDateText(editval[0]?.NIBRSclearancedate) : '',
                'IsVerify': editval[0]?.IsVerify,
                //text
                'CrimeLocation': editval[0]?.CrimeLocation,
                'DispositionComments': editval[0]?.DispositionComments,
                // location column
                'DirectionPrefix': editval[0]?.DirectionPrefix,
                'Street': editval[0]?.Street,
                'DirectionSufix': editval[0]?.DirectionSufix,
                'TypeSufix': editval[0]?.TypeSufix,
                'City': editval[0]?.City,
                'State': editval[0]?.State,
                'ZipCode': editval[0]?.ZipCode,
                'PremiseNo': editval[0]?.PremiseNo,
                'ApartmentNo': editval[0]?.ApartmentNo,
                'CommonPlace': editval[0]?.CommonPlace,
                'ApartmentType': editval[0]?.ApartmentType,
                'Street_Parse': editval[0]?.Street_Parse,
                'PremiseNo_Parse': editval[0]?.PremiseNo_Parse,
                'DirectionPrefix_Parse': editval[0]?.DirectionPrefix_Parse,
                'TypeSuffix_Parse': editval[0]?.TypeSuffix_Parse,
                'DirectionSuffix_Parse': editval[0]?.DirectionSuffix_Parse,
                'ZipCodeID': editval[0]?.ZipCodeID,
                'CityID': editval[0]?.CityID,
                'IsUsLocation': editval[0]?.IsUsLocation,
                'CountryID': editval[0]?.CountryID,
                'Country': editval[0]?.Country,
                'point_of_interest': editval[0]?.point_of_interest,
                'neighborhood': editval[0]?.neighborhood,
                'subpremise': editval[0]?.subpremise,
                'premise': editval[0]?.premise,
            });
            setReportedDate(editval[0]?.ReportedDate ? new Date(editval[0]?.ReportedDate) : '');
            setBIBRSDate(editval[0]?.BIBRSDate ? new Date(editval[0]?.BIBRSDate) : '');
            setIncidentReportedDate(editval[0]?.ReportedDate ? new Date(editval[0]?.ReportedDate) : '');
            setClsDrpCode(Get_Exceptional_Code(editval, rmsDisposition));
            setExClsDateCode(Get_ExClsDate_Code(editval, exceptionalClearID));
            setIncidentRmsCfs(editval[0]?.RMSCFSCodeID);
            getRmsCfsCodeID(editval[0]?.FBIID);
            //--------------get_Non_Verify_Add-------------------
            if (!editval[0]?.IsVerify && editval[0]?.crimelocationid) {
                get_Add_Single_Data(editval[0]?.crimelocationid);
                // console.log(!editval[0]?.IsVerify)
            } else {
                // get_Add_Single_Data(0);
            }
        } else {
            setValue({
                ...value,
                'IncidentNumber': '',
                'ReportedDate': getShowingMonthDateYear(new Date()),
                'OccurredFrom': getShowingMonthDateYear(new Date()),
                'OccurredTo': getShowingMonthDateYear(new Date()),
                'BIBRSDate': getShowingMonthDateYear(new Date()),
                'FBIID': '',
                'DispositionDate': '',
                'NIBRSclearancedate': '',
                //text
                'CrimeLocation': '',
                'DispositionComments': '',
                //drpdown
                'RMSCFSCodeID': '',
                'NIBRSClearanceID': '',
                'RMSDispositionId': '',
                'ReceiveSourceID': '',
                'CADCFSCodeID': '',
                'CADDispositionId': '',
            });
            setIncidentReportedDate(getShowingMonthDateYear(new Date()));
        }
    }, [editval])

    const check_Validation_Error = (e) => {
        if (ClsDrpCode === 'EC') {
            if (ExClsDateCode != 'N') {
                if (RequiredField(value.ReportedDate)) {
                    setErrors(prevValues => { return { ...prevValues, ['OccuredError']: RequiredField(value.ReportedDate) } })
                }
                // if (RequiredField(value.OccurredFrom)) {
                //     setErrors(prevValues => { return { ...prevValues, ['OccurredFromError']: RequiredField(value.OccurredFrom) } })
                // }
                // if (RequiredField(value.OccurredTo)) {
                //     setErrors(prevValues => { return { ...prevValues, ['OccurredToError']: RequiredField(value.OccurredTo) } })
                // }
                if (!value.OccurredFrom || !value.OccurredTo) {
                    setOccurDateIsAfter(true);
                } else {
                    if (checkDateIsAfter(value.OccurredFrom, value.OccurredTo)) {
                        setOccurDateIsAfter(checkDateIsAfter(value.OccurredFrom, value.OccurredTo))
                    } else {
                        setOccurDateIsAfter(false);
                    }
                }
                if (Space_Allow_with_Trim(value.CrimeLocation)) {
                    setErrors(prevValues => { return { ...prevValues, ['CrimeLocationError']: Space_Allow_with_Trim(value.CrimeLocation) } })
                }
                if (RequiredFieldIncident(value.RMSCFSCodeID)) {
                    setErrors(prevValues => { return { ...prevValues, ['RmsCfsCodeError']: RequiredFieldIncident(value.RMSCFSCodeID) } })
                }
                if (RequiredFieldIncident(value.NIBRSClearanceID)) {
                    setErrors(prevValues => { return { ...prevValues, ['ExceptionalClearaceError']: RequiredFieldIncident(value.NIBRSClearanceID) } })
                }
                if (RequiredFieldIncident(value.FBIID)) {
                    setErrors(prevValues => { return { ...prevValues, ['FBIIDError']: RequiredFieldIncident(value.FBIID) } })
                }
                if (RequiredField(value.NIBRSclearancedate)) {
                    setErrors(prevValues => { return { ...prevValues, ['NIBRSclearancedateError']: RequiredField(value.NIBRSclearancedate) } })
                }
            } else {
                if (RequiredField(value.ReportedDate)) {
                    setErrors(prevValues => { return { ...prevValues, ['OccuredError']: RequiredField(value.ReportedDate) } })
                }
                // if (RequiredField(value.OccurredFrom)) {
                //     setErrors(prevValues => { return { ...prevValues, ['OccurredFromError']: RequiredField(value.OccurredFrom) } })
                // }
                // if (RequiredField(value.OccurredTo)) {
                //     setErrors(prevValues => { return { ...prevValues, ['OccurredToError']: RequiredField(value.OccurredTo) } })
                // }
                if (!value.OccurredFrom || !value.OccurredTo) {
                    setOccurDateIsAfter(true);
                } else {
                    if (checkDateIsAfter(value.OccurredFrom, value.OccurredTo)) {
                        setOccurDateIsAfter(checkDateIsAfter(value.OccurredFrom, value.OccurredTo))
                    } else {
                        setOccurDateIsAfter(false);
                    }
                }
                if (Space_Allow_with_Trim(value.CrimeLocation)) {
                    setErrors(prevValues => { return { ...prevValues, ['CrimeLocationError']: Space_Allow_with_Trim(value.CrimeLocation) } })
                }
                if (RequiredFieldIncident(value.RMSCFSCodeID)) {
                    setErrors(prevValues => { return { ...prevValues, ['RmsCfsCodeError']: RequiredFieldIncident(value.RMSCFSCodeID) } })
                }
                if (RequiredFieldIncident(value.NIBRSClearanceID)) {
                    setErrors(prevValues => { return { ...prevValues, ['ExceptionalClearaceError']: RequiredFieldIncident(value.NIBRSClearanceID) } })
                }
                if (RequiredFieldIncident(value.FBIID)) {
                    setErrors(prevValues => { return { ...prevValues, ['FBIIDError']: RequiredFieldIncident(value.FBIID) } })
                }
            }
        } else {
            if (RequiredField(value.ReportedDate)) {
                setErrors(prevValues => { return { ...prevValues, ['OccuredError']: RequiredField(value.ReportedDate) } })
            }
            // if (RequiredField(value.OccurredFrom)) {
            //     setErrors(prevValues => { return { ...prevValues, ['OccurredFromError']: RequiredField(value.OccurredFrom) } })
            // }
            // if (RequiredField(value.OccurredTo)) {
            //     setErrors(prevValues => { return { ...prevValues, ['OccurredToError']: RequiredField(value.OccurredTo) } })
            // }
            if (!value.OccurredFrom || !value.OccurredTo) {
                setOccurDateIsAfter(true);
            } else {
                if (checkDateIsAfter(value.OccurredFrom, value.OccurredTo)) {
                    setOccurDateIsAfter(checkDateIsAfter(value.OccurredFrom, value.OccurredTo))
                } else {
                    setOccurDateIsAfter(false);
                }
            }
            if (Space_Allow_with_Trim(value.CrimeLocation)) {
                setErrors(prevValues => { return { ...prevValues, ['CrimeLocationError']: Space_Allow_with_Trim(value.CrimeLocation) } })
            }
            if (RequiredFieldIncident(value.RMSCFSCodeID)) {
                setErrors(prevValues => { return { ...prevValues, ['RmsCfsCodeError']: RequiredFieldIncident(value.RMSCFSCodeID) } })
            }
            if (RequiredFieldIncident(value.FBIID)) {
                setErrors(prevValues => { return { ...prevValues, ['FBIIDError']: RequiredFieldIncident(value.FBIID) } })
            }
        }
    }

    // Check All Field Format is True Then Submit 
    const { OccuredError, CrimeLocationError, RmsCfsCodeError, ExceptionalClearaceError, FBIIDError, NIBRSclearancedateError } = errors

    useEffect(() => {
        if (ClsDrpCode === 'EC') {
            if (ExClsDateCode != 'N') {
                if (OccuredError === 'true' && CrimeLocationError === 'true' && RmsCfsCodeError === 'true' && ExceptionalClearaceError === 'true' && NIBRSclearancedateError === 'true') {
                    if (incidentStatus) { UpdateIncident(); setErrors({ ...errors, ['OccuredError']: '', }); }
                    else { AddIncident(); setErrors({ ...errors, ['OccuredError']: '', }); }
                }
            } else {
                if (OccuredError === 'true' && CrimeLocationError === 'true' && RmsCfsCodeError === 'true' && ExceptionalClearaceError === 'true') {
                    if (incidentStatus) { UpdateIncident(); setErrors({ ...errors, ['OccuredError']: '', }); }
                    else { AddIncident(); setErrors({ ...errors, ['OccuredError']: '', }); }
                }
            }
        } else {
            if (OccuredError === 'true' && CrimeLocationError === 'true' && RmsCfsCodeError === 'true' && FBIIDError === 'true') {
                if (incidentStatus) { UpdateIncident(); setErrors({ ...errors, ['OccuredError']: '', }); }
                else { AddIncident(); setErrors({ ...errors, ['OccuredError']: '', }); }
            }
        }
    }, [OccuredError, CrimeLocationError, RmsCfsCodeError, ExceptionalClearaceError, FBIIDError, NIBRSclearancedateError])

    const Reset = () => {
        setValue({
            ...value,
            'ReportedDate': '',
            'OccurredFrom': '',
            'OccurredTo': '',
            'FinishedDate': '',
            'BIBRSDate': '',
            'DispositionDate': '',
            'FBIID': '',
            'NIBRSclearancedate': '',
            //text
            // 'CrimeLocation': '',
            'DispositionComments': '', 'IncidentNumber': '',
            //drpdown
            'RMSCFSCodeID': '',
            'NIBRSClearanceID': '',
            'RMSDispositionId': '',
            'ReceiveSourceID': '',
            'CADCFSCodeID': '',
        });
        setErrors({
            ...errors,
            'OccuredError': '',
            //  'OccurredFromError': '', 'OccurredToError': '',
            'CrimeLocationError': '', 'RmsCfsCodeError': '', 'FBIIDError': '', 'ExceptionalClearaceError': '', 'NIBRSclearancedateError': '',
        })
    }

    const HandleChange = (e) => {
        if (e.target.name === 'IsVerify') {
            if (e.target.checked && addVerifySingleData.length > 0) {
                setModalStatus(false);
                setlocationStatus(true); setVerifySingleData([]);
                setValue(pre => { return { ...pre, ['CrimeLocation']: '', [e.target.name]: e.target.checked, } });
            } else {
                setValue(pre => { return { ...pre, [e.target.name]: e.target.checked, } });
                setModalStatus(true);
                setlocationStatus(false);
            }
        } else {
            setChangesStatus(true)
            setValue({
                ...value,
                [e.target.name]: e.target.value
            })
        }
    }

    useEffect(() => {
        // console.log("Call Drp useEffect")
        if (exceptionalClearID.length === 0) { GetDataExceptionalClearanceID(LoginAgencyID); }
        if (rmsDisposition.length === 0) { getRmsDispositionID(LoginAgencyID); }
        GetDataReciveSourceID(LoginAgencyID); getCADCFSCodeID(LoginAgencyID); GetCadDispositionId(LoginAgencyID); FBIidDrpVal();
    }, [LoginAgencyID])

    const FBIidDrpVal = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID,
        }
        fetchPostData('FBICodes/GetDataDropDown_FBICodes', val).then((data) => {
            if (data) {
                setNibrsCodeDrp(threeColArrayWithCode(data, 'FBIID', 'Description', 'FederalSpecificFBICode'))
            } else {
                setNibrsCodeDrp([]);
            }
        })
    }

    const getRmsCfsCodeID = (FBIID) => {
        const val = {
            'FBIID': FBIID,
            'AgencyID': null,
        }
        fetchPostData('ChargeCodes/GetDataDropDown_ChargeCodes', val).then((data) => {
            if (data) {
                setRmsCfsID(Comman_changeArrayFormat(data, 'ChargeCodeID', 'Description'))
            } else {
                setRmsCfsID([]);
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

    useEffect(() => {
        if (ClsDrpCode !== "EC") {
            setValue({
                ...value,
                ['NIBRSClearanceID']: ''
            })
        }
    }, [ClsDrpCode]);

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

    const AddIncident = () => {
        if (occurDateIsAfter) {
            AddDeleteUpadate('Incident/IncidentInsert', value).then((res) => {
                if (res.success) {
                    toastifySuccess(res.Message);
                    if (res.IncidentID) {
                        // console.log(res);
                        get_IncidentTab_Count(res.IncidentID);
                        setIncidentID(res.IncidentID); setChangesStatus(false);
                        storeData({ 'IncidentID': res?.IncidentID, 'IncidentNumber': res?.IncidentNumber, 'IncidentStatus': true, 'ReportedDate': res?.ReportedDate }); setIncidentNumber(res?.IncidentNumber);
                    }
                    setIncidentStatus(true)
                    setErrors({ ...errors, ['OccuredError']: '', });
                } else {
                    toastifyError("Error");
                    setErrors({ ...errors, ['OccuredError']: '', });
                }
            })
        } else {
            toastifyError("OccuredTo Date Must be Greater Then OccuredFrom Date")
        }
    }

    const UpdateIncident = () => {
        if (occurDateIsAfter) {
            AddDeleteUpadate('Incident/IncidentUpdate', value).then((res) => {
                toastifySuccess(res.Message);
                setChangesStatus(false);
                GetEditData(incidentID)
                setErrors({
                    ...errors, ['OccuredError']: '', ['ExceptionalClearaceError']: '',
                });
            })
        } else {
            toastifyError("OccuredTo Date Must be Greater Then OccuredFrom Date")
        }
    }

    let navigate = useNavigate();

    const OnClose = () => {
        if (!changesStatus) {
            setChangesStatus(false)
            Reset();
            navigate('/incident');
            setIncidentID('');
            deleteStoreData({ 'IncidentID': '', 'IncidentNumber': '', 'IncidentStatus': '', 'ReportedDate': '' })
        }
    }

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

    const colourStylesEC = {
        control: (styles) => ({
            ...styles, backgroundColor: ExClsDateCode === 'N' || ExClsDateCode === 'A' || ExClsDateCode === 'B' || ExClsDateCode === 'C' || ExClsDateCode === 'D' || ExClsDateCode === 'E' ? "#fce9bf" : "rgb(255 202 194)",
            height: 20,
            minHeight: 30,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };

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

    return (
        loder ?
            <>
                <div className="row">
                    <div className="col-12 " id='display-not-form'>
                        <div className="col-12 col-md-12 pt-2 p-0" >
                            <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center">
                                <p className="p-0 m-0">Incident</p>
                                <div style={{ marginLeft: 'auto' }}>
                                    <div className="icons" style={{ fontSize: '18px' }}>
                                        <Link to={''}>
                                            <i class="fa fa-map-marker mr-2" aria-hidden="true"></i>
                                        </Link>
                                        <Link to={''}>
                                            <i class="fa fa-bell"></i>
                                        </Link>
                                        {/* <Link to={'/incident-Master'} className="px-2 py-0">
                                            <i className="fa fa-file"></i>
                                        </Link> */}
                                    </div>
                                </div>
                                <FindListDropDown array={IncListDropDownArray} />
                            </div>
                        </div>
                        <div id="update_incident_form" className="tab-pane fade in active show">
                            <div className="row">
                                <div className="col-12">
                                    <div className="row bb mt-2 pb-1 " >
                                        <div className="col-6  col-md-4 d-flex col-lg-3">
                                            <p className="txt-black font-weight-bold   py-0 my-0">Incident No:</p>
                                            {/* <p className="txt-black  py-0 my-0 ml-3">{value.IncidentNumber}</p> */}
                                            <input type="text" className='form-control col-7 col-md-7 ml-1 py-1 ' readOnly value={value.IncidentNumber ? value.IncidentNumber : 'Auto Generated'} style={{ marginTop: '-5px' }} />
                                        </div>
                                        <div className="col-5  col-md-2 col-lg-3" >
                                            <p className="txt-black font-weight-bold   py-0 my-0">Master Incident#:</p>
                                        </div>
                                        <div className="col-1  col-lg-1" >
                                            <p className="txt-black  py-0 my-0 "></p>
                                        </div>
                                        <div className="col-2  col-md-2 col-lg-1">
                                            <p className="txt-black font-weight-bold  py-0 my-0">Agency:</p>
                                        </div>
                                        <div className="col-10  col-md-3 col-lg-4">
                                            <p className="txt-black font-weight-bold  py-0 my-0">{AgencyName ? AgencyName : ''}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="row bb">
                                        <div className="col-6 col-md-6 col-lg-3 mt-3 date__box">
                                            <DatePicker
                                                // open={false}
                                                ref={startRef}
                                                onKeyDown={onKeyDown}
                                                id="ReportedDate"
                                                name='ReportedDate'
                                                onChange={(date) => {
                                                    setReportedDate(date); setBIBRSDate(date);
                                                    setValue({
                                                        ...value,
                                                        ['ReportedDate']: date ? getShowingMonthDateYear(date) : null,
                                                        // ['BIBRSDate']: date ? getShowingMonthDateYear(date) : null
                                                    })
                                                }}
                                                className='requiredColor'
                                                dateFormat="MM/dd/yyyy HH:mm"
                                                selected={ReportedDate}
                                                autoComplete='off'
                                                timeInputLabel
                                                isClearable
                                                placeholderText='Select...'
                                                peekNextMonth
                                                dropdownMode="select"
                                                showMonthDropdown
                                                showYearDropdown
                                                timeIntervals={1}
                                                timeCaption="Time"
                                                maxDate={new Date()}
                                            />
                                            <label htmlFor="">Reported Date/Time</label>
                                            {errors.OccuredError !== 'true' ? (
                                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.OccuredError}</span>
                                            ) : null}
                                        </div>
                                        <div className="col-6  col-md-6 col-lg-3 mt-3 date__box">
                                            <DatePicker
                                                ref={startRef1}
                                                name='OccurredFrom'
                                                id='OccurredFrom'
                                                onChange={(date) => {
                                                    setValue({ ...value, ['OccurredFrom']: date ? getShowingMonthDateYear(date) : null, })
                                                }}
                                                onKeyDown={onKeyDown}
                                                // className='requiredColor'
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
                                                showDisabledMonthNavigation

                                                // filterTime={filterPassedTime}
                                                timeIntervals={1}
                                                timeCaption="Time"
                                                maxDate={new Date()}
                                                // minDate={ReportedDate}
                                                autoComplete='Off'
                                            />
                                            <label htmlFor="">Occurred  From Date/Time</label>
                                            {/* {errors.OccurredFromError !== 'true' ? (
                                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.OccurredFromError}</span>
                                            ) : null} */}
                                        </div>
                                        <div className="col-6 col-md-6 col-lg-3 mt-3 date__box">
                                            <DatePicker
                                                ref={startRef2}
                                                onKeyDown={onKeyDown}
                                                id='OccurredTo'
                                                name='OccurredTo'
                                                onChange={(date) => {
                                                    setValue({ ...value, ['OccurredTo']: date ? getShowingMonthDateYear(date) : null })
                                                }}
                                                // className='requiredColor'
                                                dateFormat="MM/dd/yyyy HH:mm"
                                                timeInputLabel
                                                isClearable
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
                                                autoComplete='Off'
                                            />
                                            <label htmlFor="">Occurred  to Date/Time</label>
                                            {/* {errors.OccurredToError !== 'true' ? (
                                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.OccurredToError}</span>
                                            ) : null} */}
                                        </div>
                                        <div className="col-6 col-md-6 col-lg-3 mt-3 date__box">
                                            <DatePicker
                                                name='BIBRSDate'
                                                id='BIBRSDate'
                                                className={`${incidentID ? 'readonlyColor' : "requiredColor"}`}
                                                onChange={(date) => { setBIBRSDate(date); setValue({ ...value, ['BIBRSDate']: date ? getShowingMonthDateYear(date) : null }) }}
                                                ref={startRef3}
                                                onKeyDown={onKeyDown}
                                                dateFormat="MM/dd/yyyy HH:mm"
                                                selected={BIBRSDate}
                                                // open={incidentID ? false : true}
                                                placeholderText={'Select..'}
                                                timeInputLabel
                                                isClearable={false}
                                                disabled={incidentID ? true : false}
                                                peekNextMonth
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                                showTimeSelect
                                                timeIntervals={1}
                                                timeCaption="Time"
                                                minDate={ReportedDate}
                                                maxDate={new Date()}
                                            />
                                            <label htmlFor="">NIBRS Date/Time</label>
                                        </div>
                                        <div className="col-10  col-md-10 col-lg-11 mt-4 mb-1 text-field">
                                            <Location {...{ value, setValue, locationStatus, setlocationStatus }} col='CrimeLocation' locationID='crimelocationid' check={true} verify={value.IsVerify} style={{ resize: 'both' }} />
                                            <label htmlFor="" className='pl-1'>Crime Location</label>
                                            {errors.CrimeLocationError !== 'true' ? (
                                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CrimeLocationError}</span>
                                            ) : null}
                                        </div>
                                        <div className="col-2 col-md-2 col-lg-1 mt-3 ">
                                            <div class="form-check ">
                                                <input class="form-check-input" data-toggle="modal" data-target="#VerifyModal" type="checkbox" name='IsVerify'
                                                    // checked={value.IsVerify || value.crimelocationid === 0 && true}
                                                    checked={value.IsVerify}
                                                    value={value?.IsVerify} onChange={HandleChange} id="flexCheckDefault" style={{ cursor: 'pointer' }} />
                                                <label class="form-check-label" for="flexCheckDefault">
                                                    Verify
                                                </label>
                                            </div>
                                            {
                                                value?.IsVerify === false && addVerifySingleData.length > 0 ?
                                                    <>
                                                        <i className="fa fa-edit " onClick={() => { if (value.crimelocationid) { get_Add_Single_Data(value.crimelocationid); setModalStatus(true); } }} data-toggle="modal" data-target="#VerifyModal" style={{ cursor: 'pointer', backgroundColor: '' }} > Edit </i>
                                                    </>
                                                    :
                                                    <>
                                                    </>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 mt-1 ">
                                    <div className="row mt-2">
                                        <div className="col-6 col-md-6 col-lg-6 mb-2 dropdown__box ">
                                            <Select
                                                name='FBIID'
                                                styles={colourStyles}
                                                value={nibrsCodeDrp?.filter((obj) => obj.value === value?.FBIID)}
                                                isClearable
                                                options={nibrsCodeDrp}
                                                onChange={(e) => ChangeDropDown(e, 'FBIID')}
                                                placeholder="Select..."
                                            />
                                            <label htmlFor="">FBI Code</label>
                                            {errors.FBIIDError !== 'true' ? (
                                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.FBIIDError}</span>
                                            ) : null}
                                        </div>
                                        <div className="col-6 col-md-6 col-lg-6 mb-2 dropdown__box ">
                                            <Select
                                                name='RMSCFSCodeID'
                                                styles={colourStyles}
                                                value={rmsCfsID?.filter((obj) => obj.value === value?.RMSCFSCodeID)}
                                                isClearable
                                                options={rmsCfsID}
                                                onChange={(e) => ChangeDropDown(e, 'RMSCFSCodeID')}
                                                placeholder="Select..."
                                            />
                                            <label htmlFor="">RMS CFS Code/Description</label>
                                            {errors.RmsCfsCodeError !== 'true' ? (
                                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.RmsCfsCodeError}</span>
                                            ) : null}
                                        </div>
                                        <div className="col-3  mt-1 col-md-6 col-lg-3 ">
                                            <div className="dropdown__box">
                                                <Select
                                                    name='RMSDispositionId'
                                                    value={rmsDisposition?.filter((obj) => obj.value === value?.RMSDispositionId)}
                                                    isClearable
                                                    options={rmsDisposition}
                                                    onChange={(e) => ChangeDropDown(e, 'RMSDispositionId')}
                                                    placeholder="Select..."
                                                    styles={customStylesWithOutColor}
                                                />
                                                <label htmlFor="">RMS Disposition</label>
                                            </div>
                                        </div>
                                        <div className="col-3 col-md-6 col-lg-3">
                                            <div className="date__box">
                                                <DatePicker
                                                    name='DispositionDate'
                                                    id='DispositionDate'
                                                    onChange={(date) => { setChangesStatus(true); setValue({ ...value, ['DispositionDate']: date ? date : null }) }}
                                                    selected={value?.DispositionDate && new Date(value?.DispositionDate)}
                                                    ref={startRef}
                                                    onKeyDown={onKeyDown}
                                                    placeholderText={value?.DispositionDate ? value?.DispositionDate : 'Select...'}
                                                    dateFormat="MM/dd/yyyy HH:mm"
                                                    timeInputLabel
                                                    // showTimeInput
                                                    isClearable={value?.DispositionDate ? true : false}
                                                    peekNextMonth
                                                    showMonthDropdown
                                                    showYearDropdown
                                                    autoComplete='Off'
                                                    dropdownMode="select"
                                                    showTimeSelect
                                                    timeIntervals={1}
                                                    timeCaption="Time"
                                                    disabled={value?.RMSDispositionId ? false : true}
                                                    // maxDate={new Date()}
                                                    minDate={ReportedDate}
                                                />
                                                <label htmlFor="">Disposition Date/Time</label>
                                            </div>
                                        </div>
                                        <div className="col-3 col-md-6 col-lg-3 mt-1 ">
                                            <div className="dropdown__box">
                                                <Select
                                                    name='NIBRSClearanceID'
                                                    styles={ClsDrpCode === 'EC' ? colourStylesEC : customStylesWithOutColor}
                                                    value={exceptionalClearID?.filter((obj) => obj.value === value?.NIBRSClearanceID)}
                                                    isClearable
                                                    readOnly={ClsDrpCode === 'EC' ? false : true}
                                                    options={exceptionalClearID}
                                                    onChange={(e) => ChangeDropDown(e, 'NIBRSClearanceID')}
                                                    placeholder="Select..."
                                                    isDisabled={ClsDrpCode === "EC" ? false : true}
                                                />
                                                <label htmlFor="">Exceptional Clearance {ExClsDateCode === 'N' || ExClsDateCode === 'A' || ExClsDateCode === 'B' || ExClsDateCode === 'C' || ExClsDateCode === 'D' || ExClsDateCode === 'E' ? <></> : ExClsDateCode && <span className='hovertext' style={{ marginLeft: '15px' }} data-hover="Valid codes for clearance code are A,B,C,D,E,N" ><i className='fa fa-exclamation-circle'></i></span>} </label>
                                                {errors.ExceptionalClearaceError !== 'true' ? (
                                                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ExceptionalClearaceError}</span>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className='col-3 col-md-6 col-lg-3'>
                                            <div className="date__box">
                                                <DatePicker
                                                    name='NIBRSclearancedate'
                                                    id='NIBRSclearancedate'
                                                    // className='requiredColor'
                                                    className={value?.NIBRSClearanceID && ExClsDateCode !== 'N' ? 'requiredColor' : ''}
                                                    onChange={(date) => { setValue({ ...value, ['NIBRSclearancedate']: date ? getShowingDateText(date) : null }) }}
                                                    ref={startRef4}
                                                    onKeyDown={onKeyDown}
                                                    selected={value?.NIBRSclearancedate && new Date(value?.NIBRSclearancedate)}
                                                    placeholderText={value?.NIBRSclearancedate ? value?.NIBRSclearancedate : 'Select...'}
                                                    dateFormat="MM/dd/yyyy HH:mm"
                                                    timeInputLabel
                                                    isClearable={value?.NIBRSclearancedate ? true : false}
                                                    autoComplete='Off'
                                                    peekNextMonth
                                                    showMonthDropdown
                                                    showYearDropdown
                                                    dropdownMode="select"
                                                    showTimeSelect
                                                    timeIntervals={1}
                                                    disabled={value?.NIBRSClearanceID && ExClsDateCode !== 'N' ? false : true}
                                                    // maxDate={new Date()}
                                                    minDate={ReportedDate}
                                                    maxDate={new Date()}
                                                />
                                                <label htmlFor="" className='pl-0'>Exceptional Clearance Date/Time</label>
                                                {errors.NIBRSclearancedateError !== 'true' ? (
                                                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.NIBRSclearancedateError}</span>
                                                ) : null}
                                            </div>
                                        </div>
                                        {/* <div className="col-8  col-md-8 col-lg-8 mt-4 text-field" >
                                            <textarea name='DispositionComments' value={value.DispositionComments} onChange={HandleChange} id="" cols="30" rows='1'
                                                className="form-control " ></textarea>
                                            <label htmlFor="" className='px-1'>Comments</label>
                                        </div> */}
                                        <div className="col-6 col-md-6 col-lg-6 mt-2">
                                            <div className="dropdown__box ">
                                                <Select
                                                    name='CADCFSCodeID'
                                                    value={cadCfsCodeID?.filter((obj) => obj.value === value?.CADCFSCodeID)}
                                                    isClearable
                                                    menuPlacement='top'
                                                    options={cadCfsCodeID}
                                                    onChange={(e) => ChangeDropDown(e, 'CADCFSCodeID')}
                                                    placeholder="Select..."
                                                    styles={customStylesWithOutColor}
                                                />
                                                <label htmlFor="">CAD CFS Code</label>
                                            </div>
                                        </div>
                                        <div className="col-3  col-md-3 col-lg-3 mt-2 ">
                                            <div className="dropdown__box ">
                                                <Select
                                                    name='CADDispositionId'
                                                    value={cadDispositionId?.filter((obj) => obj.value === value?.CADDispositionId)}
                                                    isClearable
                                                    menuPlacement='top'
                                                    options={cadDispositionId}
                                                    onChange={(e) => ChangeDropDown(e, 'CADDispositionId')}
                                                    placeholder="Select..."
                                                    styles={customStylesWithOutColor}
                                                />
                                                <label htmlFor="">CAD Disposition</label>
                                            </div>
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-3 mt-2 ">
                                            <div className="dropdown__box ">
                                                <Select
                                                    name='ReceiveSourceID'
                                                    value={reciveSourceID?.filter((obj) => obj.value === value?.ReceiveSourceID)}
                                                    isClearable
                                                    options={reciveSourceID}
                                                    menuPlacement='top'
                                                    onChange={(e) => ChangeDropDown(e, 'ReceiveSourceID')}
                                                    placeholder="Select..."
                                                    styles={customStylesWithOutColor}
                                                />
                                                <label htmlFor="ReceiveSourceID" >How Reported</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 d-flex flex-row-reverse text-center mt-2 p-0">
                                    <button type="button" className="btn btn-sm btn-success mx-1" onClick={() => { OnClose() }} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''}>Close</button>
                                    {
                                        incidentStatus ?
                                            EffectiveScreenPermission ?
                                                EffectiveScreenPermission[0]?.Changeok ?
                                                    <button type="button" className="btn btn-sm btn-success" onClick={(e) => { check_Validation_Error(); }}>Update</button>
                                                    : <></>
                                                : <button type="button" className="btn btn-sm btn-success" onClick={(e) => { check_Validation_Error(); }}>Update</button>
                                            :
                                            EffectiveScreenPermission ?
                                                EffectiveScreenPermission[0]?.AddOK ?
                                                    <button type="button" className="btn btn-sm btn-success" onClick={(e) => { check_Validation_Error(); }}>Save</button>
                                                    : <></>
                                                : <button type="button" className="btn btn-sm btn-success" onClick={(e) => { check_Validation_Error(); }}>Save</button>
                                    }
                                    {/* {
                                        sessionStorage.getItem('incidentStatus') === 'true' ?
                                            EffectiveScreenPermission ?
                                                EffectiveScreenPermission[0]?.Changeok ?
                                                    <button type="button" className="btn btn-sm btn-success" onClick={(e) => { check_Validation_Error(); }}>Update</button>
                                                    : <></>
                                                : <button type="button" className="btn btn-sm btn-success" onClick={(e) => { check_Validation_Error(); }}>Update</button>
                                            :
                                            EffectiveScreenPermission ?
                                                EffectiveScreenPermission[0]?.AddOK ?
                                                    <button type="button" className="btn btn-sm btn-success" onClick={(e) => { check_Validation_Error(); }}>Save</button>
                                                    : <></>
                                                : <button type="button" className="btn btn-sm btn-success" onClick={(e) => { check_Validation_Error(); }}>Save</button>
                                    } */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <IdentifyFieldColor />
                <VerifyLocation {...{ LoginAgencyID, modalStatus, setModalStatus, value, setValue, addVerifySingleData, get_Add_Single_Data }} />
                <ChangesModal func={check_Validation_Error} />
            </>
            :
            <Loader />
    )
}

export default Home

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

const Get_ExClsDate_Code = (data, dropDownData) => {
    const result = data?.map((sponsor) =>
        (sponsor.NIBRSClearanceID)
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
