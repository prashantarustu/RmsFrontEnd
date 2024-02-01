import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import MobileTab from '../../../MobileUtility/MobileTab';
import { useState } from 'react';
import Select from "react-select";
import DatePicker from "react-datepicker";
import { Decrypt_Id_Name, Encrypted_Id_Name, getShowingDateText, getShowingMonthDateYear, getShowingWithOutTime, getYearWithOutDateTime } from '../../../../Common/Utility';
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import { AddDeleteUpadate, fetchData, fetchPostData } from '../../../../hooks/Api';
import { useContext } from 'react';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { RequiredField, RequiredFieldIncident } from '../../../../Pages/Utility/Personnel/Validation';
import { useEffect } from 'react';
import { Comman_changeArrayFormat, threeColArray } from '../../../../Common/ChangeArrayFormat';
import DataTable from 'react-data-table-component';
import DeletePopUpModal from '../../../../Common/DeleteModal';

const PropertyHome = ({ setRecovered }) => {

    const navigate = useNavigate();
    const useQuery = () => new URLSearchParams(useLocation().search);
    let openPage = useQuery().get('page');

    const { setShowPage, updateCount, setUpdateCount, propertyTypeData, setPropertyTypeData, propertyLossCodeData, get_PropertyLossCode, setChangesStatus, changesStatusCount, localStoreArray, setLocalStoreArray, get_LocalStorage, propertyStatus, setPropertyStatus, get_Property_Count, deleteStoreData, storeData } = useContext(AgencyContext);
    const [Drugloder, setDrugLoder] = useState(false);
    const [manufactureDate, setManufactureDate] = useState();
    const [weaponfactureDate, setWeaponfactureDate] = useState();

    const [ReportedDtTm, setReportedDtTm] = useState();
    const [destoryDate, setdestoryDate] = useState();
    const [securityDate, setSecurityDate] = useState();
    const [registrationExpDate, setRegistrationExpDate] = useState();
    // const [propertyTypeData, setPropertyTypeData] = useState([]);
    const [propertyCategoryData, setPropertyCategoryData] = useState([]);
    const [propertyClassificationData, setPropertyClassificationData] = useState([]);
    const [propertyColorData, setPropertyColorData] = useState([]);
    // const [propertyLossCodeData, setPropertyLossCodeData] = useState([]);
    const [headOfAgency, setHeadOfAgency] = useState([]);
    const [color, setColor] = useState([]);
    const [registratonStateDrp, setRegistratonStateDrp] = useState([]);
    const [weaponModalDrp, setWeaponModalDrp] = useState([])
    const [materialDrp, setMaterialDrp] = useState([]);
    const [propulusionDrp, setPropulusionDrp] = useState([]);
    const [makeIdDrp, setMakeIdDrp] = useState([]);
    const [weaponMakeDrpData, setWeaponMakeDrpData] = useState([]);
    const [measureTypeDrp, setMeasureTypeDrp] = useState([]);
    const [typeMarijuanaDrp, setTypeMarijuanaDrp] = useState([])
    const [drugManufactured, setDrugManufactured] = useState([]);
    const [drugTypeDrp, setDrugTypeDrp] = useState([]);
    const [Editval, setEditval] = useState([]);
    const [boatModelDrp, setboatModelDrp] = useState();
    const [propertyNumber, setPropertyNumber] = useState('')
    const [PropertyArticle, setPropertyArticle] = useState([])
    const [PropertySecurity, setPropertySecurity] = useState([])
    const [PropertyWeapon, setPropertyWeapon] = useState([])
    const [PropertyDrug, setPropertyDrug] = useState([])
    const [PropertOther, setPropertOther] = useState([])
    const [PropertyBoat, setPropertyBoat] = useState([])
    const [VODIDData, setVODIDData] = useState([])
    const [propertyID, setPropertyID] = useState('');
    const [masterPropertyID, setMasterPropertyID] = useState('');
    //------------DrugDataModal-------------------
    const [drugData, setDrugData] = useState()
    const [propertyDrugID, setPropertyDrugID] = useState()
    const [drugModal, setdrugModal] = useState()
    const [drugEditData, setDrugEditData] = useState([])
    const [propertySourceDrugDrp, setPropertySourceDrugDrp] = useState([]);
    const [drugTypecode, setDrugTypeCode] = useState('')


    const [MainIncidentID, setMainIncidentID] = useState('');
    const [LoginAgencyID, setLoginAgencyID] = useState('');
    const [LoginPinID, setLoginPinID,] = useState('');

    const [value, setValue] = useState({
        'PropertyID': '',
        'IncidentID': '',
        'CreatedByUserFK': '',
        'ReportedDtTm': '',
        // 'IncidentID': sessionStorage.getItem('IncidentId') ? Decrypt_Id_Name(sessionStorage.getItem('IncidentId'), 'IForIncidentId') : '',
        // 'CreatedByUserFK': localStorage.getItem('PINID') ? Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID') : '',
        'PropertyCategoryCode': '',
        'PropertyTypeID': '', 'CategoryID': '', 'ClassificationID': '', 'OAN': "", 'TopColorID': '', 'BottomColorID': '', 'OfficerID': '', 'LossCodeID': '',
        // 'ReportedDtTm': getShowingMonthDateYear(openPage === 'PropertySearch' ? new Date() : sessionStorage.getItem('IncidentReportedDate') ? Decrypt_Id_Name(sessionStorage.getItem('IncidentReportedDate'), 'IForIncidentReportedDate') : new Date()),
        'Value': '0', 'PropertyTag': '', 'NICB': '', 'Description': '', 'ModelID': '',
        'Quantity': '', 'Brand': '', 'HIN': '', 'Length': '', 'RegistrationStateID': '', 'RegistrationNumber': '', 'VODID': '', 'MaterialID': '', 'MakeID': '', 'Comments': '', 'ManufactureYear': '', 'RegistrationExpiryDtTm': '',
        'PropulusionID': '', 'OtherID': '', 'SerialID': '',  'Denomination': '', 'IssuingAgency': '', 'MeasureTypeID': '', 'SecurityDtTm': '', 'Style': '', 'Finish': '', 'Caliber': '', 'Handle': '', 'IsAuto': '', 'BarrelLength': '', 'WeaponModelID': '',
        'PropertyArticleID': '', 'PropertyBoatID': '', 'PropertyDrugID': '', 'PropertyOtherID': '', 'PropertySecurityID': '',
        'BoatIDNumber': '',
        'DestroyDtTm': '',
        // checkbox
        'IsEvidence': null, 'IsSendToPropertyRoom': null, 'IsPropertyRecovered': null,
    });

    const [errors, setErrors] = useState({
        'PropertyTypeIDError': '',
        'CategoryIDError': '',
        'LossCodeIDError': '',
        'ReportedDtTmError': '',
        'OfficerIDError': '',
    })
    const localStore = {
        Value: "",
        UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
        Key: JSON.stringify({ AgencyID: "", PINID: "", IncidentID: '', PropertyID: '', MasterPropertyID: '' }),
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
                // console.log(localStoreArray)
                setLoginAgencyID(localStoreArray?.AgencyID);
                setLoginPinID(localStoreArray?.PINID);
                if (localStoreArray.PropertyID || localStoreArray.MasterPropertyID) {
                    // GetSingleData(localStoreArray.PropertyID, localStoreArray.MasterPropertyID);
                    setPropertyID(localStoreArray?.PropertyID); setMasterPropertyID(localStoreArray?.MasterPropertyID);
                    get_Property_Count(localStoreArray?.PropertyID);
                } else {
                    setPropertyID(""); setMasterPropertyID("");
                    GetSingleData(''); get_Property_Count(''); setPropertyNumber('')
                }
                setMainIncidentID(localStoreArray?.IncidentID);
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
        if (RequiredFieldIncident(value?.PropertyTypeID)) {
            setErrors(prevValues => { return { ...prevValues, ['PropertyTypeIDError']: RequiredFieldIncident(value?.PropertyTypeID) } })
        }
        if (RequiredFieldIncident(value?.CategoryID)) {
            setErrors(prevValues => { return { ...prevValues, ['CategoryIDError']: RequiredFieldIncident(value?.CategoryID) } })
        }
        if (RequiredFieldIncident(value?.LossCodeID)) {
            setErrors(prevValues => { return { ...prevValues, ['LossCodeIDError']: RequiredFieldIncident(value?.LossCodeID) } })
        }
        if (RequiredField(value?.ReportedDtTm)) {
            setErrors(prevValues => { return { ...prevValues, ['ReportedDtTmError']: RequiredField(value?.ReportedDtTm) } })
        }
        // if (RequiredFieldIncident(value?.OfficerID)) {
        //     setErrors(prevValues => { return { ...prevValues, ['OfficerIDError']: RequiredFieldIncident(value?.OfficerID) } })
        // }
    }

    const { PropertyTypeIDError, CategoryIDError, LossCodeIDError, ReportedDtTmError, } = errors

    useEffect(() => {
        if (PropertyTypeIDError === 'true' && CategoryIDError === 'true' && LossCodeIDError === 'true' && ReportedDtTmError === 'true') {
            if (propertyID) {
                update_Property();
            } else {
                Add_Property();
            }
        } else if (PropertyTypeIDError === 'Required *' || CategoryIDError === 'Required *' || LossCodeIDError === 'Required *' || ReportedDtTmError === 'Required *') {
            toastifyError('Please Fill All Required Field');
        }
    }, [PropertyTypeIDError, CategoryIDError, LossCodeIDError, ReportedDtTmError,])


    const Reset = () => {
        setValue({
            ...value,
            'PropertyID': '',
            // 'IncidentID': sessionStorage.getItem('IncidentId') ? Decrypt_Id_Name(sessionStorage.getItem('IncidentId'), 'IForIncidentId') : '',
            // 'CreatedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
            // Dropdown
            'CategoryID': '', 'ClassificationID': '', 'OfficerID': '', 'LossCodeID': '',
            //Datepicker
            // 'ReportedDtTm': '',
            'DestroyDtTm': '', 'Value': '', 'PropertyTag': '', 'NICB': '', 'Description': '',
            // checkbox
            'IsEvidence': null, 'IsSendToPropertyRoom': null, 'IsPropertyRecovered': null,            // Article fields 
            'SerialID': '', 'ModelID': '', 'OAN': '', 'Quantity': '', 'Brand': '', 'TopColorID': '', 'BottomColorID': '',
            // boat Fields 
            'BoatIDNumber': '', 'HIN': '', 'RegistrationNumber': '', 'VODID': '', 'Length': '', 'Comments': '', 'ManufactureYear': '', 'MaterialID': '',
        });
        setSecurityDate('')
    }



    useEffect(() => {
        // if (sessionStorage.getItem('PropertyID')) {
        if (propertyID) {
            GetSingleData(propertyID);
        } else {
            Reset();
        }
    }, [updateCount, propertyID])

    const GetSingleData = (propertyID) => {
        const val = {
            // 'PropertyID': sessionStorage.getItem('PropertyID') ? Decrypt_Id_Name(sessionStorage.getItem('PropertyID'), 'PForPropertyID') : '',
            'PropertyID': propertyID
        }
        fetchPostData('Property_FRW/GetSingleData_Property_FRW', val).then((res) => {
            if (res.length > 0) 
            { setEditval(res) }
            else { setEditval([]) }
        })
    }

    useEffect(() => {
        // if (sessionStorage.getItem('PropertyID')) {
        if (propertyID) {
            sessionStorage.setItem("propertyStolenValue", Encrypted_Id_Name(Editval[0]?.Value, 'SForStolenValue'));
            setPropertyID(Editval[0]?.PropertyID)
            if (Get_Property_Code(Editval, propertyTypeData) === 'A') {
                get_PropertyArticle_Single_Data(Editval[0]?.propertyID, Get_Property_Code(Editval, propertyTypeData))
                setPropertOther([]); setPropertyBoat([]); setPropertyArticle([]); setPropertySecurity([])
            }
            else if (Get_Property_Code(Editval, propertyTypeData) === 'B') {
                get_PropertyBoat_Single_Data(Editval[0]?.propertyID, Get_Property_Code(Editval, propertyTypeData))
                setPropertOther([]); setPropertyArticle([]); setPropertyWeapon([]); setPropertySecurity([]); setPropertyDrug([]);
            }
            else if (Get_Property_Code(Editval, propertyTypeData) === 'O') {
                get_PropertOther_Single_Data(Editval[0]?.propertyID, Get_Property_Code(Editval, propertyTypeData))
                setPropertOther([]); setPropertyBoat([]); setPropertyArticle([]); setPropertySecurity([]); setPropertyDrug([]);
            }
            else if (Get_Property_Code(Editval, propertyTypeData) === 'S') {
                get_PropertySecurity_Single_Data(Editval[0]?.propertyID, Get_Property_Code(Editval, propertyTypeData))
                setPropertOther([]); setPropertyBoat([]); setPropertyArticle([]); setPropertySecurity([]); setPropertyDrug([]);
            }
            else if (Get_Property_Code(Editval, propertyTypeData) === 'G') {
                get_PropertyWeapon_Single_Data(Editval[0]?.propertyID, Get_Property_Code(Editval, propertyTypeData))
                setPropertOther([]); setPropertyBoat([]); setPropertyArticle([]); setPropertySecurity([]); setPropertyDrug([]);
            }
            else if (Get_Property_Code(Editval, propertyTypeData) === 'D') {
                get_PropertyDrug_Single_Data(Editval[0]?.propertyID, Get_Property_Code(Editval, propertyTypeData))
                setPropertOther([]); setPropertyBoat([]); setPropertyArticle([]); setPropertyWeapon([]); setPropertySecurity([])
            }
            
            propertyLossCodeData?.filter(val => {
                if (val.value === Editval[0]?.LossCodeID) {
                    if (val.id === "STOL" || val.id === "RECD") {
                    }
                } 
            });
            setValue({
                ...value,
                'PropertyID': Editval[0]?.PropertyID, 'PropertyTypeID': Editval[0]?.PropertyTypeID,
                'ModifiedByUserFK': LoginPinID, 'CategoryID': Editval[0]?.CategoryID,
                'ClassificationID': Editval[0]?.ClassificationID, 'ReportedDtTm': Editval[0]?.ReportedDtTm ? getShowingDateText(Editval[0]?.ReportedDtTm) : '',
                'Value': Editval[0]?.Value, 'OfficerID': Editval[0]?.OfficerID, 'LossCodeID': Editval[0]?.LossCodeID, 'PropertyTag': Editval[0]?.PropertyTag,
                'NICB': Editval[0]?.NICB, 'Description': Editval[0]?.Description, 'PropertyCategoryCode': Get_Property_Code(Editval, propertyTypeData),
                // -------------------------------------------------Article fields -------------------------
                'PropertyArticleID': Get_Property_Code(Editval, propertyTypeData) === "A" ? Editval[0].Property_FRWArticle[0]?.PropertyArticleID : '',
                //----------------------------------------------------Boat-Fileds----------------------------
                'PropertyBoatID': Get_Property_Code(Editval, propertyTypeData) === "B" ? Editval[0].Property_FRWBoat[0]?.PropertyBoatID : "",
                //----------------------------------------------------Property-Drug----------------------------
                'PropertyOtherID': Get_Property_Code(Editval, propertyTypeData) === "O" ? Editval[0].Property_FRWOther[0]?.PropertyOtherID : '',
                //-----------------------------------------------------PropertySecurity-----------------------------
                'PropertySecurityID': Get_Property_Code(Editval, propertyTypeData) === "S" ? Editval[0].Property_FRWSecurity[0]?.PropertySecurityID : '',
                //------------------------------------------------------propertyWepon--------------------------------
                'PropertyWeaponID': Get_Property_Code(Editval, propertyTypeData) === "G" ? Editval[0].Property_FRWWeapon[0]?.PropertyWeaponID : '',
            })
            // for getPropertyReasonCode Drp
            switch (Get_Property_Code(Editval, propertyTypeData)) {
                case 'A': get_PropertyLossCode('1', '', '', '', '', ''); break;
                case 'B': get_PropertyLossCode('', '1', '', '', '', ''); break;
                case 'S': get_PropertyLossCode('', '', '1', '', '', ''); break;
                case 'O': get_PropertyLossCode('', '', '', '1', '', ''); break;
                case 'D': get_PropertyLossCode('', '', '', '', '1', ''); break;
                case 'G': get_PropertyLossCode('', '', '', '', '', '1'); break;
                default: get_PropertyLossCode('1', '', '', '', '', '');
            }
            setReportedDtTm(Editval[0]?.ReportedDtTm ? new Date(Editval[0]?.ReportedDtTm) : '');
            setdestoryDate(Editval[0]?.DestroyDtTm ? new Date(Editval[0]?.DestroyDtTm) : '');
            PropertyCategory(Editval[0]?.PropertyTypeID);
            PropertyClassification(Editval[0]?.CategoryID);
            setPropertyNumber(Editval[0]?.PropertyNumber);
            if (Get_Property_Code(Editval, propertyTypeData) === 'D') {
                get_Data_Drug_Modal();
            }
        } else {
            setValue({ ...value, 'CategoryID': '', })
        }
    }, [Editval, changesStatusCount])

    useEffect(() => {
        if (PropertyDrug.length > 0) {
            // setValue({
            //   ...value,
            //   'SuspectedDrugTypeID': parseInt(PropertyBoat[0]?.SuspectedDrugTypeID),
            //   'EstimatedDrugQty': PropertyBoat[0]?.EstimatedDrugQty,
            //   'FractionDrugQty': PropertyBoat[0]?.FractionDrugQty,
            //   'MeasurementTypeID': PropertyBoat[0]?.MeasurementTypeID,
            //   'MasterPropertyID': PropertyBoat[0]?.MasterPropertyID,
            // })
        }
    }, [PropertyDrug])

    useEffect(() => {
        if (value.PropertyCategoryCode && Editval.length === 0) ResetFields_On_Change(value.PropertyCategoryCode);
    }, [value.PropertyCategoryCode])

    const ResetFields_On_Change = (Code) => {
        //Boat 
        if (Code !== 'B') {
            setValue({
                ...value,
                'BoatIDNumber': '', 'ManufactureYear': '', 'Length': '', 'RegistrationStateID': '', 'RegistrationNumber': '', 'VODID': '', 'MaterialID': '',
                'MakeID': '', 'ModelID': '', 'Comments': '', 'HIN': '', 'RegistrationExpiryDtTm': '', 'PropulusionID': '', 'BottomColorID': '', 'TopColorID': '',
            })
        }
        //Article
        if (Code !== 'A') {
            setValue({
                ...value,
                'SerialID': '', 'ModelID': '', 'TopColorID': '', 'BottomColorID': '', 'OAN': '', 'Quantity': '', 'Brand': '',
            })
        }
        //Other
        if (Code !== 'O') {
            setValue({
                ...value,
                'OtherID': '', 'Brand': '', 'SerialID': '', 'BottomColorID': '', 'ModelID': '', 'Quantity': '',
            })
        }
        //Security
        if (Code !== 'S') {
            setValue({
                ...value,
                'SecurityIDNumber': '', 'Denomination': '', 'IssuingAgency': '', 'MeasureTypeID': '', 'SecurityDtTm': '', 'SerialID': '',
            })
        }
        //Weapon
        if (Code !== 'G') {
            setValue({
                ...value, 'WeaponIDNumber': '', 'Style': '', 'Finish': '', 'Caliber': '', 'Handle': '', 'SerialID': '', 'MakeID': '', 'WeaponModelID': '', 'IsAuto': '', 'ManufactureYear': '',
                'BarrelLength': '',
            })
        }

    }
    //---------------------------------------------EditValue------------------------------------------
    useEffect(() => {
        if (PropertyArticle.length > 0) {
            setValue({
                ...value,
                'SerialID': PropertyArticle[0]?.SerialID, 'PropertyArticleID': PropertyArticle[0]?.PropertyArticleID, 'ModelID': PropertyArticle[0]?.ModelID, 'TopColorID': PropertyArticle[0]?.TopColorID, 'BottomColorID': PropertyArticle[0]?.BottomColorID, 'OAN': PropertyArticle[0]?.OAN, 'Quantity': PropertyArticle[0]?.Quantity, 'Brand': PropertyArticle[0]?.Brand,
            })
        }
    }, [PropertyArticle])

    useEffect(() => {
        if (PropertyBoat.length > 0) {
            setValue({
                ...value,
                'BoatIDNumber': PropertyBoat[0]?.BoatIDNumber, 'PropertyBoatID': PropertyBoat[0]?.PropertyBoatID, 'ManufactureYear': PropertyBoat[0]?.ManufactureYear, 'Length': PropertyBoat[0]?.Length, 'RegistrationStateID': PropertyBoat[0]?.RegistrationStateID, 'RegistrationNumber': PropertyBoat[0]?.RegistrationNumber, 'VODID': PropertyBoat[0]?.VODID, 'MaterialID': PropertyBoat[0]?.MaterialID,
                'MakeID': PropertyBoat[0]?.MakeID, 'ModelID': PropertyBoat[0]?.ModelID, 'Comments': PropertyBoat[0]?.Comments, 'HIN': PropertyBoat[0]?.HIN, 'RegistrationExpiryDtTm': PropertyBoat[0]?.RegistrationExpiryDtTm ? getShowingWithOutTime(PropertyBoat[0]?.RegistrationExpiryDtTm) : '', 'PropulusionID': PropertyBoat[0]?.PropulusionID, 'BottomColorID': PropertyBoat[0]?.BottomColorID, 'TopColorID': PropertyBoat[0]?.TopColorID,
            })
        }
    }, [PropertyBoat])

    useEffect(() => {
        if (PropertOther.length > 0) {
            setValue({
                ...value,
                'OtherID': PropertOther[0]?.OtherID, 'PropertyOtherID': PropertOther[0]?.PropertyOtherID, 'Brand': PropertOther[0]?.Brand, 'SerialID': PropertOther[0]?.SerialID, 'TopColorID': PropertOther[0]?.TopColorID,
                'BottomColorID': PropertOther[0]?.BottomColorID, 'ModelID': PropertOther[0]?.ModelID, 'Quantity': PropertOther[0]?.Quantity,
            })
        }
    }, [PropertOther])

    useEffect(() => {
        if (PropertySecurity.length > 0) {
            setValue({
                ...value,
                'SecurityIDNumber': PropertySecurity[0]?.SecurityIDNumber, 'PropertySecurityID': PropertySecurity[0]?.PropertySecurityID, 'Denomination': PropertySecurity[0]?.Denomination, 'IssuingAgency': PropertySecurity[0]?.IssuingAgency, 'MeasureTypeID': PropertySecurity[0]?.MeasureTypeID, 'SecurityDtTm': PropertySecurity[0]?.SecurityDtTm, 'SerialID': PropertySecurity[0]?.SerialID,
            })
            setSecurityDate(PropertySecurity[0]?.SecurityDtTm ? new Date(PropertySecurity[0]?.SecurityDtTm) : '');
        }
    }, [PropertySecurity])

    useEffect(() => {
        if (PropertyWeapon.length > 0) {
            setValue({
                ...value,
                'WeaponIDNumber': PropertyWeapon[0]?.WeaponIDNumber, 'PropertyWeaponID': PropertyWeapon[0]?.PropertyWeaponID, 'Style': PropertyWeapon[0]?.Style, 'Finish': PropertyWeapon[0]?.Finish, 'Caliber': PropertyWeapon[0]?.Caliber, 'Handle': PropertyWeapon[0]?.Handle, 'SerialID': PropertyWeapon[0]?.SerialID, 'MakeID': PropertyWeapon[0]?.MakeID, 'WeaponModelID': PropertyWeapon[0]?.WeaponModelID, 'IsAuto': PropertyWeapon[0]?.IsAuto, 'ManufactureYear': PropertyWeapon[0]?.ManufactureYear, 'BarrelLength': PropertyWeapon[0]?.BarrelLength,
            })
        }
    }, [PropertyWeapon])
    //---------------------------Get_Data-Article--------------------------------
    const get_PropertyArticle_Single_Data = (PropertyID, PropertyCategoryCode) => {
        const val = {
            'PropertyID': PropertyID,
            'PropertyCategoryCode': PropertyCategoryCode,
        }
        fetchPostData('Property_FRW/GetData_Property_FRWArticle', val).then((res) => {
            if (res) {
                setPropertyArticle(res);
            }
            else { setPropertyArticle([]) }
        })
    }
    //---------------------------Get_Data-PropertyBoat--------------------------------
    const get_PropertyBoat_Single_Data = (PropertyID, PropertyCategoryCode) => {
        const val = {
            'PropertyID': PropertyID,
            'PropertyCategoryCode': PropertyCategoryCode,
        }
        fetchPostData('Property_FRW/GetData_Property_FRWBoat', val).then((res) => {
            if (res) {
                setPropertyBoat(res);
            }
            else { setPropertyBoat([]) }
        })
    }
    //-----------------Get-Data-PropertOther-----------------
    const get_PropertOther_Single_Data = (PropertyID, PropertyCategoryCode) => {
        const val = {
            // 'PropertyID': sessionStorage.getItem('PropertyID') ? Decrypt_Id_Name(sessionStorage.getItem('PropertyID'), 'PForPropertyID') : '',
            'PropertyID': PropertyID,
            'PropertyCategoryCode': PropertyCategoryCode,
        }
        fetchPostData('Property_FRW/GetData_PropertOther', val).then((res) => {
            if (res) {
                setPropertOther(res);
            }
            else { setPropertOther([]) }
        })
    }

    //----------------------------Get-Data-PropertySecurity----------------------
    const get_PropertySecurity_Single_Data = (PropertyID, PropertyCategoryCode) => {
        const val = {
            'PropertyID': PropertyID,
            'PropertyCategoryCode': PropertyCategoryCode,
        }
        fetchPostData('Property_FRW/GetData_Property_FRWSecurity', val).then((res) => {
            if (res) {
                setPropertySecurity(res);
            }
            else { setPropertySecurity([]) }
        })
    }

    //------------------------------Get_Data-ProertyWepon-----------------------
    const get_PropertyWeapon_Single_Data = (PropertyID, PropertyCategoryCode) => {
        const val = {
            'PropertyID': PropertyID,
            'PropertyCategoryCode': PropertyCategoryCode,
        }
        fetchPostData('Property_FRW/GetData_Property_FRWWeapon', val).then((res) => {
            if (res) {
                setPropertyWeapon(res);
            }
            else { setPropertyWeapon([]) }
        })
    }

    const get_Data_Drug_Modal = (PropertyID) => {
        const val = {
            'PropertyID': PropertyID,
        }
        // console.log(val)
        fetchPostData('PropertyDrug_FRW/GetData_PropertyDrug_FRW', val).then((res) => {
            if (res) {
                setDrugData(res);
            } else {
                setDrugData([]);
            }
        })
    }
    useEffect(() => {
        if (LoginAgencyID) {
            PropertyType(LoginAgencyID); get_Head_Of_Agency(LoginAgencyID);
        }
    }, [LoginAgencyID]);


    useEffect(() => {
        if (value?.PropertyCategoryCode === 'A') {
            if (color?.length === 0) get_Color(LoginAgencyID);
            get_PropertyLossCode(LoginAgencyID, '1', '', '', '', '', '');
        } else if (value?.PropertyCategoryCode === 'B') {
            if (propulusionDrp?.length === 0) get_Propulusion_Drp_Data(LoginAgencyID);
            if (color?.length === 0) get_Color(LoginAgencyID);
            if (registratonStateDrp?.length === 0) getStateList();
            if (materialDrp?.length === 0) get_MaterialDrp(LoginAgencyID);
            if (VODIDData?.length === 0) get_Data_VODID(LoginAgencyID);
            if (makeIdDrp?.length === 0) get_Make_Drp_Data(LoginAgencyID);
            if (boatModelDrp?.length === 0) get_BoatModel_Drp_Data(LoginAgencyID);
        } else if (value.PropertyCategoryCode === 'D') {
            if (drugTypeDrp?.length === 0) get_SuspectedDrug_Drp_Data(LoginAgencyID);
            if (propertySourceDrugDrp?.length === 0) get_PropertySourceDrug(LoginAgencyID);
            if (measureTypeDrp?.length === 0) get_MeasureType_Drp_Data(LoginAgencyID);
            if (typeMarijuanaDrp?.length === 0) get_TypeMarijuana_Drp_Data(LoginAgencyID);
            if (drugManufactured?.length === 0) get_DrugManufactured_Drp_Data(LoginAgencyID);
        } else if (value.PropertyCategoryCode === 'O') {
            if (color?.length === 0) get_Color(LoginAgencyID);
        } else if (value.PropertyCategoryCode === 'S') {
            if (measureTypeDrp?.length === 0) get_MeasureType_Drp_Data(LoginAgencyID);
        } else if (value.PropertyCategoryCode === 'G') {
            if (weaponModalDrp?.length === 0) get_WeaponModel_Drp_Data(LoginAgencyID);
            if (weaponMakeDrpData?.length === 0) get_Weapon_Make_Drp_Data(LoginAgencyID);
        }
    }, [value?.PropertyCategoryCode])

    //-----------------------------Get_Data_PropertyDrug------------------------------
    const get_PropertyDrug_Single_Data = (PropertyID, PropertyCategoryCode) => {
        const val = {
            'PropertyID': PropertyID,
            'PropertyCategoryCode': PropertyCategoryCode,
        }
        fetchPostData('/Property_FRW/GetData_Property_FRWDrug', val).then((res) => {
            if (res) {
                setPropertyDrug(res);
            }
            else { setPropertyDrug([]) }
        })
    }

    const get_PropertySourceDrug = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID,
        }
        fetchPostData('PropertySourceDrugType/GetDataDropDown_PropertySourceDrugType', val).then((res) => {
            if (res) {
                setPropertySourceDrugDrp(Comman_changeArrayFormat(res, 'SourceDrugTypeID', 'Description'));
            } else {
                setPropertySourceDrugDrp([]);
            }
        })
    }

    const check_Drug_Validation_Error = () => {
        if (RequiredFieldIncident(value.SuspectedDrugTypeID)) {
            setDrugErrors(prevValues => { return { ...prevValues, ['SuspectedDrugTypeIDError']: RequiredFieldIncident(value.SuspectedDrugTypeID) } })
        }
    }
    const [drugErrors, setDrugErrors] = useState({
        'SuspectedDrugTypeIDError': '',
    })

    const get_Data_VODID = (LoginAgencyID) => {
        const val = {
            // AgencyID: Decrypt_Id_Name(localStorage.getItem('AgencyID'), 'AForAgencyID')
            AgencyID: LoginAgencyID,
        }
        fetchPostData('PropertyBoatVOD/GetDataDropDown_PropertyBoatVOD', val).then((res) => {
            if (res) {
                setVODIDData(Comman_changeArrayFormat(res, 'PropertyBoatVODID', 'Description'));
            } else {
                setVODIDData([]);
            }
        })
    }

    const get_BoatModel_Drp_Data = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID,
        }
        fetchPostData('PropertyBoatModel/GetDataDropDown_PropertyBoatModel', val).then((data) => {
            if (data) {
                setboatModelDrp(Comman_changeArrayFormat(data, 'PropertyBoatModelID', 'Description'));
            }
            else {
                setboatModelDrp([])
            }
        })
    };

    const get_WeaponModel_Drp_Data = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID,
        }
        fetchPostData('PropertyGunModel/GetDataDropDown_PropertyGunModel', val).then((data) => {
            if (data) {

                setWeaponModalDrp(Comman_changeArrayFormat(data, 'PropertyGunModelID', 'Description'));
            }
            else {
                setWeaponModalDrp()
            }
        })
    };

    const get_SuspectedDrug_Drp_Data = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID,
        }
        fetchPostData('PropertyDrugType/GetDataDropDown_PropertyDrugType', val).then((data) => {
            if (data) {
                setDrugTypeDrp(threeColArray(data, 'DrugTypeID', 'Description', 'DrugTypeCode'));
            }
            else {
                setDrugTypeDrp([])
            }
        })
    };

    const get_MeasureType_Drp_Data = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID,
        }
        fetchPostData('PropertyDrugMeasure/GetDataDropDown_PropertyDrugMeasure', val).then((data) => {
            if (data) {
                setMeasureTypeDrp(Comman_changeArrayFormat(data, 'PropertyDrugMeasureID', 'Description'));
            }
            else {
                setMeasureTypeDrp([])
            }
        })
    };

    const get_TypeMarijuana_Drp_Data = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID,
        }
        fetchPostData('MarijuanaType/GetDataDropDown_MarijuanaType', val).then((data) => {
            if (data) {
                setTypeMarijuanaDrp(Comman_changeArrayFormat(data, 'MarijuanaTypeID', 'Description'));
            }
            else {
                setTypeMarijuanaDrp([])
            }
        })
    };

    const get_DrugManufactured_Drp_Data = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID,
        }
        fetchPostData('DrugManufactured/GetDataDropDown_DrugManufactured', val).then((data) => {
            if (data) {
                setDrugManufactured(Comman_changeArrayFormat(data, 'DrugManufacturedID', 'Description'));
            }
            else {
                setDrugManufactured([])
            }
        })
    };

    const get_Weapon_Make_Drp_Data = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID,
        }
        fetchPostData('PropertyGunMake/GetDataDropDown_PropertyGunMake', val).then((data) => {
            if (data) {
                setWeaponMakeDrpData(Comman_changeArrayFormat(data, 'PropertyGunMakeID', 'Description'));
            }
            else {
                setWeaponMakeDrpData([])
            }
        })
    };

    const get_Propulusion_Drp_Data = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID,
        }
        fetchPostData('PropertyBoatPropulsion/GetDataDropDown_PropertyBoatPropulsion ', val).then((data) => {
            if (data) {
                setPropulusionDrp(Comman_changeArrayFormat(data, 'PropertyBoatPropulsionID', 'Description'));
            }
            else {
                setPropulusionDrp([])
            }
        })
    };

    const get_Make_Drp_Data = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID,
        }
        fetchPostData('PropertyBoatMake/GetDataDropDown_PropertyBoatMake', val).then((data) => {
            if (data) {
                setMakeIdDrp(Comman_changeArrayFormat(data, 'PropertyBoatMakeID', 'Description'));
            }
            else {
                setMakeIdDrp([])
            }
        })
    };

    const get_MaterialDrp = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID,
        }
        fetchPostData('PropertyBoatOHMaterial/GetDataDropDown_PropertyBoatOHMaterial', val).then((data) => {
            if (data) {
                setMaterialDrp(Comman_changeArrayFormat(data, 'PropertyBoatOHMaterialID', 'Description'));
            }
            else {
                setMaterialDrp([])
            }
        })
    };

    const getStateList = async () => {
        fetchData("State_City_ZipCode/GetData_State").then((data) => {
            if (data) {
                setRegistratonStateDrp(Comman_changeArrayFormat(data, 'StateID', 'StateName'));
            } else {
                setRegistratonStateDrp([]);
            }
        });
    };

    const get_Color = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID,
        }
        fetchPostData('Property/GetDataDropDown_PropertyColor', val).then((data) => {
            if (data) {
                setColor(Comman_changeArrayFormat(data, 'ColorID', 'ColorDescription'));
            }
            else {
                setColor([])
            }
        })
    };

    const get_Head_Of_Agency = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID,
        }
        fetchPostData('DropDown/GetData_HeadOfAgency', val).then((data) => {
            if (data) {
                setHeadOfAgency(Comman_changeArrayFormat(data, 'PINID', 'HeadOfAgency'));
            }
            else {
                setHeadOfAgency([])
            }
        })
    };

    const PropertyType = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID,
        }
        fetchPostData('PropertyCategory/GetDataDropDown_PropertyCategory', val).then((data) => {
            if (data) {
                const res = data?.filter((val) => {
                    if (val.PropertyCategoryCode !== "V") return val
                })
                const id = data?.filter((val) => { if (val.PropertyCategoryCode === "A") return val })
                if (id.length > 0) {
                    // setValue({ ...value,['PropertyTypeID']: id[0].PropertyCategoryID, ['PropertyCategoryCode']: id[0].PropertyCategoryCode,});
                    setValue(prevValues => { return { ...prevValues, ['PropertyTypeID']: id[0].PropertyCategoryID, ['PropertyCategoryCode']: id[0].PropertyCategoryCode, } })
                    PropertyCategory(id[0].PropertyCategoryID)
                }
                setPropertyTypeData(threeColArray(res, 'PropertyCategoryID', 'Description', 'PropertyCategoryCode'))
            } else {
                setPropertyTypeData([]);
            }
        })
    }

    const PropertyCategory = (CategoryID) => {
        const val = {
            CategoryID: CategoryID,
        }
        fetchPostData('Property/GetDataDropDown_PropertyType', val).then((data) => {
            if (data) {
                setPropertyCategoryData(threeColArray(data, 'PropertyDescID', 'Description', 'CategoryID'))
            } else {
                setPropertyCategoryData([]);
            }
        })
    }

    const PropertyClassification = (PropertyDescID) => {
        const val = {
            PropertyDescID: PropertyDescID,
        }
        fetchPostData('Property/GetDataDropDown_PropertyClassification', val).then((data) => {
            if (data) {
                setPropertyClassificationData(Comman_changeArrayFormat(data, 'PropertyClassificationID', 'Description'))
            } else {
                setPropertyClassificationData([]);
            }
        })
    }

    const PropertyColor = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID,
        }
        fetchPostData('Property/GetDataDropDown_PropertyColor', val).then((data) => {
            if (data) {
                setPropertyColorData(Comman_changeArrayFormat(data, 'ColorID', 'ColorDescription'))
            } else {
                setPropertyColorData([]);
            }
        })
    }

    const ChangeDropDown = (e, name) => {
        if (e) {
            if (name === 'SuspectedDrugTypeID') {
                setDrugTypeCode(e.id)
                setChangesStatus(true)
                setValue({
                    ...value,
                    [name]: e.value,
                    'PropertySourceDrugTypeID': '', 'TypeMarijuana': '', 'MarijuanaNumber': '', '  ClandistineLabsNumber': '', 'DrugManufactured': '',
                });
                // drug_Reset();
            } else if (name === 'PropertyTypeID') {
                // console.log(e.id)
                switch (e.id) {
                    case 'A': get_PropertyLossCode('1', '', '', '', '', ''); break;
                    case 'B': get_PropertyLossCode('', '1', '', '', '', ''); break;
                    case 'S': get_PropertyLossCode('', '', '1', '', '', ''); break;
                    case 'O': get_PropertyLossCode('', '', '', '1', '', ''); break;
                    case 'D': get_PropertyLossCode('', '', '', '', '1', ''); break;
                    case 'G': get_PropertyLossCode('', '', '', '', '', '1'); break;
                    default: get_PropertyLossCode('1', '', '', '', '', '');
                }
                PropertyCategory(e.value);
                setChangesStatus(true)
                setValue({
                    ...value,
                    ['PropertyCategoryCode']: e.id,
                    ['PropertyTypeID']: e.value
                });
                setDrugLoder(true);
            } else if (name === 'CategoryID') {
                PropertyClassification(e.value);
                setChangesStatus(true)
                setValue({
                    ...value,
                    [name]: e.value
                });
            } else {
                setChangesStatus(true)
                setValue({
                    ...value,
                    [name]: e.value
                });
            }
        } else {
            if (name === 'SuspectedDrugTypeID') {
                setChangesStatus(true)
                setValue({
                    ...value,
                    [name]: null
                });
                setDrugTypeCode('');
            } else {
                setChangesStatus(true)
                setValue({
                    ...value,
                    [name]: null
                });
            }
        }
    }

    const HandleChanges = (e) => {
        if (e.target.name === 'IsAuto') {
            setChangesStatus(true)
            setValue({
                ...value,
                [e.target.name]: e.target.checked
            })
        } else if (e.target.name === 'ManufactureYear' || e.target.name === 'EstimatedDrugQty') {
            var ele = e.target.value.replace(/[^0-9.]/g, "")
            if (ele.length === 10) {
                var cleaned = ('' + ele).replace(/[^0-9.]/g, '');
                setChangesStatus(true)
                setValue({
                    ...value,
                    [e.target.name]: cleaned
                });
            } else {
                ele = e.target.value.split('$').join('').replace(/[^0-9.]/g, "");
                setChangesStatus(true)
                setValue({
                    ...value,
                    [e.target.name]: ele
                });
            }
        } else if (e.target.name === 'Quantity' || e.target.name === 'Length' || e.target.name === 'FractionDrugQty' || e.target.name === 'MarijuanaNumber' || e.target.name === 'ClandistineLabsNumber') {
            const checkNumber = e.target.value.replace(/[^0-9\s]/g, "");
            // /[^a-zA-Z\s]/g
            setChangesStatus(true)
            setValue({
                ...value,
                [e.target.name]: checkNumber
            });
        }
        else if (e.target.name === 'Value') {
            var ele = e.target.value.replace(/[^0-9\.]/g, "")
            if (ele.includes('.')) {
                if (ele.length === 16) {
                    setChangesStatus(true)
                    // if(ele.substr( ele.indexOf('.') + 1 ).slice(0, 2) )      
                    setValue({ ...value, [e.target.name]: ele });
                } else {
                    // ele = e.target.value.split('-').join('').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                    setChangesStatus(true)
                    if (ele.substr(ele.indexOf('.') + 1).slice(0, 2)) {
                        setValue({ ...value, [e.target.name]: ele.substring(0, ele.indexOf(".")) + '.' + ele.substr(ele.indexOf('.') + 1).slice(0, 2) });
                    } else { setValue({ ...value, [e.target.name]: ele }) }
                }
            } else {
                if (ele.length === 16) {
                    setChangesStatus(true)
                    setValue({
                        ...value,
                        [e.target.name]: ele
                    });
                } else {
                    setChangesStatus(true)
                    setValue({
                        ...value,
                        [e.target.name]: ele
                    });
                }
            }
        } else {
            setChangesStatus(true)
            setValue({
                ...value,
                [e.target.name]: e.target.value
            })
        }
    }

    const Add_Property = () => {
        AddDeleteUpadate('Property_FRW/Insert_Property_FRW', value).then((res) => {
            if (res.success) {
                if (res.PropertyID) {
                    console.log(res.PropertyID)
                    GetSingleData(res?.PropertyID,);
                    // sessionStorage.setItem("PropertyID", Encrypted_Id_Name(res.PropertyID, 'PForPropertyID'));
                }
                toastifySuccess(res.Message)
                setChangesStatus(false)
                setUpdateCount(updateCount + 1);
                setErrors({ ...errors, ['PropertyTypeIDError']: '', ['CategoryIDError']: '', });

            }
        })
    }

    const update_Property = () => {
        AddDeleteUpadate('Property_FRW/Update_Property_FRW', value).then((res) => {
            if (res.success) {
                toastifySuccess(res.Message);
                setChangesStatus(false)
                setUpdateCount(updateCount + 1)
                setErrors({ ...errors, ['PropertyTypeIDError']: '', ['CategoryIDError']: '', });
            }
        })
    }

    const propertyClose = () => {
        navigate('/property-main')
    }

    const colourStyles = {
        control: (styles) => ({
            ...styles, backgroundColor: "#fce9bf",
            height: 20,
            minHeight: 36,
            fontSize: 18,
            margintop: 2,
            boxShadow: 0,
        }),
    }

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

    const columns = [
        {
            name: 'Suspected Drug Type ID',
            selector: (row) => row.SuspectedDrugType_Description,
            sortable: true
        },
        {
            name: 'Estimated Drug Qty',
            selector: (row) => row.EstimatedDrugQty,
            sortable: true
        },
        {
            name: 'Fraction Drug Qty',
            selector: (row) => row.FractionDrugQty,
            sortable: true
        },

        {
            name: 'Measurement Type ID',
            selector: (row) => row.PropertyDrugMeasure_Description,
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 60 }}>Action</p>,
            cell: row => <>
                <div className="div" style={{ position: 'absolute', top: 0, right: 48 }}>
                    <button onClick={(e) => { set_Edit_Value(e, row) }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DrugModal" >
                        <i className="fa fa-edit"></i>
                    </button>

                    <button to={`#`} onClick={() => { setPropertyDrugID(row.PropertyDrugID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                        <i className="fa fa-trash"></i>
                    </button>
                </div>
            </>
        }
    ]

    const set_Edit_Value = (e, row) => {
        setPropertyDrugID(row.PropertyDrugID);
        setDrugEditData(row)
        setdrugModal(true)
    }

    const setStatusFalse = (e) => {
        setPropertyDrugID('');
        setdrugModal(true)
        setValue({
            ...value,
            'SuspectedDrugTypeID': '',
            'EstimatedDrugQty': '',
            'FractionDrugQty': '',
            'MeasurementTypeID': '',
            'PropertyDrugID': '',
            'PropertySourceDrugTypeID': '', 'MarijuanaTypeID': '', 'MarijuanaNumber': '', 'DrugManufacturedID': '', '  ClandistineLabsNumber': '',
        })
    }

    // const [drugErrors, setDrugErrors] = useState({
    //     'SuspectedDrugTypeIDError': '',
    // })

    // const check_Drug_Validation_Error = () => {
    //     if (RequiredFieldIncident(value.SuspectedDrugTypeID)) {
    //         setDrugErrors(prevValues => { console.log(prevValues); return { ...prevValues, ['SuspectedDrugTypeIDError']: RequiredFieldIncident(value.SuspectedDrugTypeID) } })
    //     }
    // }

    // Check All Field Format is True Then Submit 
    const { SuspectedDrugTypeIDError } = drugErrors

    useEffect(() => {
        if (SuspectedDrugTypeIDError === 'true') {
            if (propertyDrugID) update_DrugModal();
            else Add_Drug();
        }
    }, [SuspectedDrugTypeIDError])

    useEffect(() => {
        if (propertyDrugID) {
            setValue({
                ...value,
                'SuspectedDrugTypeID': parseInt(drugEditData?.SuspectedDrugTypeID),
                'EstimatedDrugQty': drugEditData?.EstimatedDrugQty,
                'FractionDrugQty': drugEditData?.FractionDrugQty,
                'MeasurementTypeID': drugEditData?.MeasurementTypeID,
                'MasterPropertyID': drugEditData?.MasterPropertyID,
                // 'PropertyID': drugEditData?.PropertyID,
                'PropertyDrugID': drugEditData?.PropertyDrugID,
                'PropertySourceDrugTypeID': drugEditData?.PropertySourceDrugTypeID,
                'MarijuanaTypeID': drugEditData?.MarijuanaTypeID,
                'MarijuanaNumber': drugEditData?.MarijuanaNumber,
                'DrugManufacturedID': drugEditData?.DrugManufacturedID,
                'ClandistineLabsNumber': drugEditData?.ClandistineLabsNumber,
            })
            setDrugTypeCode(Get_Drug_Code(drugEditData, drugTypeDrp));
        } else {
            setValue({
                ...value,
                'SuspectedDrugTypeID': '', 'EstimatedDrugQty': '', 'FractionDrugQty': '', 'MeasurementTypeID': '', 'PropertySourceDrugTypeID': '',
                'MarijuanaTypeID': '', 'MarijuanaNumber': '', 'DrugManufacturedID': '', '  ClandistineLabsNumber': '',
            });
            setDrugErrors({ ...drugErrors, ['SuspectedDrugTypeIDError']: '' })
        }
    }, [drugEditData, updateCount])

    const Add_Drug = () => {
        AddDeleteUpadate('PropertyDrug_FRW/Insert_PropertyDrug_FRW', value).then((res) => {
            if (res.success) {
                toastifySuccess(res.Message);
                get_Data_Drug_Modal();
                setChangesStatus(false)
                setdrugModal(false);
                // get_Property_Data();
                setUpdateCount(updateCount + 1)
                setDrugErrors({ ...drugErrors, ['SuspectedDrugTypeIDError']: '' })
            }
        })
    }

    const update_DrugModal = () => {
        AddDeleteUpadate('PropertyDrug_FRW/Update_PropertyDrug_FRW', value).then((res) => {
            if (res.success) {
                toastifySuccess(res.Message)
                get_Data_Drug_Modal();
                setChangesStatus(false)
                setdrugModal(false);
                // get_Property_Data();
                setDrugErrors({ ...drugErrors, ['SuspectedDrugTypeIDError']: '' })
            }
        })
    }

    const Delete_Property_Drug = () => {
        const val = {
            'PropertyDrugID': propertyDrugID,
            // 'DeletedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
            'DeletedByUserFK': ('PINID'),
        }
        AddDeleteUpadate('PropertyDrug_FRW/Delete_PropertyDrug_FRW', val).then((res) => {
            if (res) {
                toastifySuccess(res.Message);
                get_Data_Drug_Modal();
                setChangesStatus(false)
            } else console.log("Somthing Wrong");
        })
    }

    const onClose = () => {
        setUpdateCount(updateCount + 1)
        setdrugModal(false);
        setValue({
            ...value,
            'SuspectedDrugTypeID': '',
            'EstimatedDrugQty': '',
            'FractionDrugQty': '',
            'MeasurementTypeID': '',
            'PropertySourceDrugTypeID': '', 'MarijuanaTypeID': '', 'MarijuanaNumber': '', 'DrugManufacturedID': '', '  ClandistineLabsNumber': '',
            // 'PropertyDrugID': '',
        })
        setDrugErrors({ ...drugErrors, ['SuspectedDrugTypeIDError']: '' })
    }

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
                    {
                        // sessionStorage.getItem("PropertyID") &&
                        ("PropertyID") &&
                        <>
                            <Link to='/property-tabs'>
                                <div data-toggle="modal" data-target="#myModal" style={{ fontSize: 18, cursor: 'pointer', fontWeight: 'bold', background: 'cadetblue', position: 'absolute', padding: '7px 10px', right: '0px', color: '#434A54', top: '0px' }} onClick={setShowPage('MobileMiscellaneousInformation')}>
                                    <i className='fa fa-arrow-left' style={{ fontSize: '18px' }}></i>
                                    <span >Tabs</span>
                                </div>
                            </Link>
                        </>
                    }
                    <div className="card Agency  " style={{ borderRight: 'none', borderLeft: 'none', borderRadius: '0', marginTop: '-10px', borderTop: 'none' }}>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-12 col-md-12  p-0" >
                                    <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center " style={{ marginTop: '-18px' }}>
                                        <p className="p-0 m-0" style={{ fontSize: '18px' }}>Property</p>
                                        {/* <div>
                                            <Link to={'/mobile-property'} className=" ">
                                                <i className="fa fa-file"></i>
                                            </Link>
                                            <FindListDropDown
                                                array={PropertyListDropDownArray}
                                            />
                                        </div> */}
                                    </div>
                                </div>
                                <div className="col-12 col-md-12 col-lg-12 pt-1 p-0" >
                                    <div className="row ">
                                        <div className="col-3  col-md-3 col-lg-2 pt-1" >
                                            <div className="text-mobile">
                                                <input type="text" className='readonlyColor' value={propertyNumber ? propertyNumber : 'Auto Generated'} required readOnly />
                                                <label htmlFor="">Property Id</label>
                                            </div>
                                        </div>
                                        <div className="col-3  col-md-3 col-lg-2  pt-1" >   
                                            <div className="text-mobile">
                                                <input type="text" className='readonlyColor' required readOnly />
                                                <label htmlFor="">In Possession Of</label>
                                            </div>
                                        </div>
                                        <div className="col-4 col-md-4 col-lg-2">
                                            <div className=" text__dropdwon">
                                                <Select
                                                    styles={colourStyles}
                                                    name='PropertyTypeID'
                                                    value={propertyTypeData?.filter((obj) => obj.value === value?.PropertyTypeID)}
                                                    options={propertyTypeData}
                                                    onChange={(e) => ChangeDropDown(e, 'PropertyTypeID')}
                                                    isClearable
                                                    placeholder="Select..."
                                                    isDisabled={sessionStorage.getItem('PropertyID') || sessionStorage.getItem('MasterPropertyID') ? true : false}
                                                />
                                                <label className='pt-1'>Type
                                                    <span className='text-danger pl-1'>
                                                        *
                                                    </span>
                                                </label>
                                                {/* {errors.PropertyTypeIDError !== 'true' ? (
                                                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.PropertyTypeIDError}</span>
                                                ) : null} */}
                                            </div>
                                        </div>
                                        <div className="col-4 col-md-4 col-lg-3 ">
                                            <div className=" text__dropdwon">
                                                <Select
                                                    name='CategoryID'
                                                    id='CategoryID'
                                                    styles={colourStyles}
                                                    value={propertyCategoryData?.filter((obj) => obj.value === value?.CategoryID)}
                                                    options={propertyCategoryData}
                                                    onChange={(e) => ChangeDropDown(e, 'CategoryID')}
                                                    isClearable
                                                    placeholder="Select..."
                                                />
                                                <label className='pt-1'>Category
                                                    <span className='text-danger pl-1'>
                                                        *
                                                    </span>
                                                </label>
                                                {/* {errors.CategoryIDError !== 'true' ? (
                                                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CategoryIDError}</span>
                                                ) : null} */}

                                            </div>
                                        </div>
                                        <div className="col-4 col-md-4 col-lg-3 mt-1">
                                            <div className=" text__dropdwon">
                                                <Select
                                                    styles={customStylesWithOutColor}
                                                    name='ClassificationID'
                                                    value={propertyClassificationData?.filter((obj) => obj.value === value?.ClassificationID)}
                                                    options={propertyClassificationData}
                                                    onChange={(e) => ChangeDropDown(e, 'ClassificationID')}
                                                    isClearable
                                                    placeholder="Select..."
                                                />
                                                <label className='pt-1'>Classification</label>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-6 col-md-4 col-lg-3 " style={{ marginTop: '7px' }}>
                                            <div className='text__dropdwon'>
                                                <DatePicker
                                                    id='ReportedDtTm'
                                                    name='ReportedDtTm'
                                                    ref={startRef}
                                                    onKeyDown={onKeyDown}
                                                    dateFormat="MM/dd/yyyy HH:mm"
                                                    isClearable={value?.ReportedDtTm ? true : false}
                                                    selected={ReportedDtTm}
                                                    autoComplete="Off"
                                                    className='name-datepicker'
                                                    onChange={(date) => { setReportedDtTm(date); setValue({ ...value, ['ReportedDtTm']: date ? getShowingMonthDateYear(date) : null }) }}
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
                                                <label htmlFor="" className='pt-1'>Reported Date/Time</label>
                                                {errors.ReportedDtTmError !== 'true' ? (
                                                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ReportedDtTmError}</span>
                                                ) : null}
                                            </div>
                                        </div>

                                        <div className="col-6 col-md-3 col-lg-2" style={{ marginTop: '12px' }}>
                                            <div class="text-mobile">
                                                <input type="text" name='Value' id='Value' maxLength={20} value={'$' + value?.Value?.replace(/,/g, "")?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} onChange={HandleChanges} className='' required />
                                                <label >Value</label>
                                            </div>
                                        </div>
                                        <div className="col-6 col-md-5 col-lg-4 mt-2">
                                            <div className=" text__dropdwon">
                                                <Select
                                                    name='OfficerID'
                                                    styles={colourStyles}
                                                    // menuPlacement='top'
                                                    value={headOfAgency?.filter((obj) => obj.value === value?.OfficerID)}
                                                    isClearable
                                                    options={headOfAgency}
                                                    onChange={(e) => ChangeDropDown(e, 'OfficerID')}
                                                    placeholder="Select..."
                                                />
                                                <label className='pt-1'>Primary Officer
                                                    {/* <span className='text-danger pl-1'>
                                                        *
                                                    </span> */}
                                                </label>
                                                {/* {errors.OfficerIDError !== 'true' ? (
                                                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.OfficerIDError}</span>
                                                ) : null} */}
                                            </div>
                                        </div>
                                        <div className="col-6 col-md-6 col-lg-3 mt-2">
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
                                                <label className='pt-1'>Property Reason Code
                                                    <span className='text-danger pl-1'>
                                                        *
                                                        {/* {errors.LossCodeIDError} */}
                                                    </span>
                                                </label>
                                                {/* {errors.LossCodeIDError !== 'true' ? (
                                                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.LossCodeIDError}</span>
                                                ) : null} */}
                                            </div>
                                        </div>
                                    </div>
                                    {/* ARTICLE   */}
                                    {
                                        value.PropertyCategoryCode === 'A' ?
                                            <div className="col-12 col-md-12 col-lg-12 pt-2 p-0" >
                                                <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center">
                                                    <p className="p-0 m-0" style={{ fontSize: '18px' }}>Article</p>
                                                </div>
                                                <div className="row">
                                                    <div className="col-3  col-md-3 col-lg-3  mt-1 pt-1" >
                                                        <div className="text-mobile">
                                                            <input type="text" name='SerialID' id='SerialID' value={value?.SerialID} onChange={HandleChanges} className='' required />
                                                            <label htmlFor="">Serial Id</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-3  col-md-3 col-lg-3  mt-1 pt-1" >
                                                        <div className="text-mobile">
                                                            <input type="text" name='ModelID' id='ModelID' value={value?.ModelID} onChange={HandleChanges} className='' required />
                                                            <label htmlFor="">Model Id</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-3 col-md-6 col-lg-3 mt-1">
                                                        <div className=" text__dropdwon">
                                                            <Select
                                                                name='TopColorID'
                                                                value={color?.filter((obj) => obj.value === value?.TopColorID)}
                                                                options={color}
                                                                styles={customStylesWithOutColor}
                                                                onChange={(e) => ChangeDropDown(e, 'TopColorID')}
                                                                isClearable
                                                                placeholder="Select..."
                                                            />
                                                            <label className='pt-1'>Top Color</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-3 col-md-6 col-lg-3 mt-1">
                                                        <div className=" text__dropdwon">
                                                            <Select
                                                                name='BottomColorID'
                                                                value={color?.filter((obj) => obj.value === value?.BottomColorID)}
                                                                options={color}
                                                                styles={customStylesWithOutColor}
                                                                onChange={(e) => ChangeDropDown(e, 'BottomColorID')}
                                                                isClearable
                                                                placeholder="Select..."
                                                            />
                                                            <label className='pt-1'>Bottom Color</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-3  col-md-6 col-lg-3  mt-1 pt-1" >
                                                        <div className="text-mobile">
                                                            <input type="text" name='OAN' id='OAN' value={value?.OAN} onChange={HandleChanges} className='' required />
                                                            <label htmlFor="">OAN</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-3  col-md-6 col-lg-3  mt-1 pt-1" >
                                                        <div className="text-mobile">
                                                            <input type="text" name='Quantity' id='Quantity' value={value?.Quantity} onChange={HandleChanges} className='' required />
                                                            <label htmlFor="">Quantity</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-3  col-md-6 col-lg-3  mt-1 pt-1" >
                                                        <div className="text-mobile">
                                                            <input type="text" name='Brand' id='Brand' value={value?.Brand} onChange={HandleChanges} className='' required />
                                                            <label htmlFor="">Brand</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            :
                                            <></>
                                    }
                                    {/* Others */}
                                    {
                                        value.PropertyCategoryCode === 'O' ?
                                            <div className="col-12 col-md-12 col-lg-12 pt-2 p-0" >
                                                <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center ">
                                                    <p className="p-0 m-0" style={{ fontSize: '18px' }}>Other</p>
                                                </div>
                                                <div className="row">

                                                    <div className="col-3  col-md-3 col-lg-3  mt-1 pt-1" >
                                                        <div className="text-mobile">
                                                            <input type="text" name='Brand' id='Brand' value={value?.Brand} onChange={HandleChanges} className='' required />
                                                            <label htmlFor="">Brand</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-3  col-md-3 col-lg-3  mt-1 pt-1" >
                                                        <div className="text-mobile">
                                                            <input type="text" name='SerialID' id='SerialID' value={value?.SerialID} onChange={HandleChanges} className='' required />
                                                            <label htmlFor="">Serial Id</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-3 col-md-6 col-lg-3 mt-1">
                                                        <div className=" text__dropdwon">
                                                            <Select
                                                                name='TopColorID'
                                                                value={color?.filter((obj) => obj.value === value?.TopColorID)}
                                                                options={color}
                                                                styles={customStylesWithOutColor}
                                                                onChange={(e) => ChangeDropDown(e, 'TopColorID')}
                                                                isClearable
                                                                placeholder="Select..."
                                                                menuPlacement='top'
                                                            />
                                                            <label className='pt-1'>Top Color</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-3 col-md-6 col-lg-3 mt-1">
                                                        <div className=" text__dropdwon">
                                                            <Select
                                                                name='BottomColorID'
                                                                value={color?.filter((obj) => obj.value === value?.BottomColorID)}
                                                                options={color}
                                                                styles={customStylesWithOutColor}
                                                                onChange={(e) => ChangeDropDown(e, 'BottomColorID')}
                                                                isClearable
                                                                placeholder="Select..."
                                                            />
                                                            <label className='pt-1'>Bottom Color</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-3  col-md-6 col-lg-3  mt-1 pt-1" >
                                                        <div className="text-mobile">
                                                            <input type="text" name='ModelID' id='ModelID' value={value?.ModelID} onChange={HandleChanges} className='' required />
                                                            <label htmlFor="">Model Id</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-3  col-md-6 col-lg-3  mt-1 pt-1" >
                                                        <div className="text-mobile">
                                                            <input type="text" name='Quantity' id='Quantity' value={value?.Quantity} onChange={HandleChanges} className='' required />
                                                            <label htmlFor="">Quantity</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-3 col-md-6 col-lg-3 mt-1">
                                                        <div className=" text__dropdwon">
                                                            <Select
                                                                name='quantityunit'
                                                                // options={color}
                                                                styles={customStylesWithOutColor}
                                                                isClearable
                                                                placeholder="Select..."
                                                            />
                                                            <label className='pt-1'>Quantity Unit</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            :
                                            <></>
                                    }
                                    {/* Security */}
                                    {
                                        value.PropertyCategoryCode === 'S' ?
                                            <div className="col-12 col-md-12 col-lg-12 pt-2 p-0" >
                                                <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center ">
                                                    <p className="p-0 m-0" style={{ fontSize: '18px' }}>Security</p>
                                                </div>
                                                <div className="row">
                                                    <div className="col-4  col-md-3 col-lg-3  mt-1 pt-1" >
                                                        <div className="text-mobile">
                                                            <input type="text" name='Denomination' id='Denomination' value={value?.Denomination} onChange={HandleChanges} className='' required />
                                                            <label htmlFor="">Denomination</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-4  col-md-3 col-lg-3  mt-1 pt-1" >
                                                        <div className="text-mobile">
                                                            <input type="text" name='IssuingAgency' id='IssuingAgency' value={value?.IssuingAgency} onChange={HandleChanges} className='' required />
                                                            <label htmlFor="">Issuing Agency</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-4 col-md-6 col-lg-3 mt-1">
                                                        <div className=" text__dropdwon">
                                                            <Select
                                                                name='MeasureTypeID'
                                                                value={measureTypeDrp?.filter((obj) => obj.value === value?.MeasureTypeID)}
                                                                styles={customStylesWithOutColor}
                                                                options={measureTypeDrp}
                                                                onChange={(e) => ChangeDropDown(e, 'MeasureTypeID')}
                                                                isClearable
                                                                placeholder="Select..."
                                                                isDisabled
                                                            />
                                                            <label className='pt-1'>Measure Type</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-5 col-md-6 col-lg-3 pt-1 ">
                                                        <div className="text__dropdwon">
                                                            <DatePicker
                                                                id='SecurityDtTm'
                                                                name='SecurityDtTm'
                                                                ref={startRef1}
                                                                onKeyDown={onKeyDown}
                                                                onChange={(date) => { setSecurityDate(date); setValue({ ...value, ['SecurityDtTm']: date ? getShowingWithOutTime(date) : null }) }}
                                                                className='name-datepicker'
                                                                dateFormat="MM/dd/yyyy"
                                                                // timeInputLabel
                                                                // showTimeInput
                                                                isClearable={value?.SecurityDtTm ? true : false}
                                                                selected={securityDate}
                                                                placeholderText={value?.SecurityDtTm ? value.SecurityDtTm : 'Select...'}
                                                                // showTimeSelect
                                                                timeIntervals={1}
                                                                // timeCaption="Time"
                                                                autoComplete="Off"
                                                                showYearDropdown
                                                                showMonthDropdown
                                                                dropdownMode="select"
                                                                maxDate={new Date()}
                                                            />
                                                            <label htmlFor="" className='pt-1'>Security Date</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-3 col-md-6 col-lg-3 mt-1">
                                                        <div className="text-mobile">
                                                            <input type="text" name='SerialID' id='SerialID' value={value?.SerialID} onChange={HandleChanges} className='' required />
                                                            <label htmlFor="" className='pt-1'>Serial Id</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            :
                                            <></>
                                    }
                                    {/* Weapon */}
                                    {
                                        value.PropertyCategoryCode === 'G' ?
                                            <div className="col-12 col-md-12 col-lg-12 pt-2 p-0" >
                                                <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center ">
                                                    <p className="p-0 m-0">Weapon</p>
                                                </div>
                                                <div className="row">
                                                    <div className="col-3  col-md-3 col-lg-3  mt-1 pt-1" >
                                                        <div className="text-mobile">
                                                            <input type="text" name='Style' id='Style' value={value?.Style} onChange={HandleChanges} className='' required />
                                                            <label htmlFor="">Style</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-3  col-md-3 col-lg-2  mt-1 pt-1" >
                                                        <div className="text-mobile">
                                                            <input type="text" name='Finish' id='Finish' value={value?.Finish} onChange={HandleChanges} className='' required />
                                                            <label htmlFor="">Finish</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-3  col-md-3 col-lg-2  mt-1 pt-1" >
                                                        <div className="text-mobile">
                                                            <input type="text" name='Caliber' id='Caliber' value={value?.Caliber} onChange={HandleChanges} className='' required />
                                                            <label htmlFor="">Caliber</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-3  col-md-3 col-lg-2  mt-1 pt-1" >
                                                        <div className="text-mobile">
                                                            <input type="text" name='Handle' id='Handle' value={value?.Handle} onChange={HandleChanges} className='' required />
                                                            <label htmlFor="">Handle</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-3  col-md-3 col-lg-3  mt-1 pt-1" >
                                                        <div className="text-mobile">
                                                            <input type="text" name='SerialID' id='SerialID' value={value?.SerialID} onChange={HandleChanges} className='' required />
                                                            <label htmlFor="">Serial Id</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-3 col-md-3 col-lg-3 mt-1">
                                                        <div className=" text__dropdwon">
                                                            <Select
                                                                name='MakeID'
                                                                value={weaponMakeDrpData?.filter((obj) => obj.value === value?.MakeID)}
                                                                styles={customStylesWithOutColor}
                                                                options={weaponMakeDrpData}
                                                                onChange={(e) => ChangeDropDown(e, 'MakeID')}
                                                                isClearable
                                                                placeholder="Select..."
                                                            />
                                                            <label className='pt-1'>Make</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-3 col-md-3 col-lg-3 mt-1">
                                                        <div className=" text__dropdwon">
                                                            <Select
                                                                name='WeaponModelID'
                                                                styles={customStylesWithOutColor}
                                                                value={weaponModalDrp?.filter((obj) => obj.value === value?.WeaponModelID)}
                                                                isClearable
                                                                options={weaponModalDrp}
                                                                onChange={(e) => ChangeDropDown(e, 'WeaponModelID')}
                                                                placeholder="Select..."
                                                            />
                                                            <label className='pt-1'>Model Id</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-2 col-md-2 col-lg-1 mt-4">
                                                        <div class="form-check ">
                                                            <input class="form-check-input" type="checkbox" name='auto' id="flexCheckDefault" />
                                                            <label class="form-check-label" name='IsAuto' id='IsAuto' value={value?.IsAuto} checked={value?.IsAuto} onChange={HandleChanges} for="flexCheckDefault">
                                                                Auto
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="col-4 col-md-4 col-lg-3 mt-1 ">
                                                        <div className="text__dropdwon">
                                                            <DatePicker
                                                                name='ManufactureYear'
                                                                id='ManufactureYear'
                                                                selected={weaponfactureDate}
                                                                onChange={(date) => { setWeaponfactureDate(date); setValue({ ...value, ['ManufactureYear']: date ? getYearWithOutDateTime(date) : null }) }}
                                                                showYearPicker
                                                                dateFormat="yyyy"
                                                                yearItemNumber={9}
                                                                ref={startRef4}
                                                                onKeyDown={onKeyDown}
                                                                autoComplete="nope"
                                                                showYearDropdown
                                                                showMonthDropdown
                                                                dropdownMode="select"
                                                                maxDate={new Date()}
                                                                className='name-datepicker'
                                                            />
                                                            <label htmlFor="" className='pt-1'>Manufacture Year</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-3  col-md-3 col-lg-2  mt-1 pt-1" >
                                                        <div className="text-mobile">
                                                            <input type="text" name='BarrelLength' value={value?.BarrelLength} id='BarrelLength' onChange={HandleChanges} className='' required />
                                                            <label htmlFor="">Barrel Length</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            :
                                            <>
                                            </>
                                    }
                                    {/* Boat */}
                                    {
                                        value.PropertyCategoryCode === 'B' ?
                                            <div className="col-12 col-md-12 col-lg-12 pt-2 p-0" >
                                                <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center ">
                                                    <p className="p-0 m-0" style={{ fontSize: '18px' }}>Boat</p>
                                                </div>
                                                <div className="row mt-1">
                                                    <div className="col-4 col-md-4 col-lg-2 ">
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
                                                    <div className="col-3  col-md-2 col-lg-2  pt-1" >
                                                        <div className="text-mobile">
                                                            <input type="text" name='Length' id='Length' value={value?.Length} onChange={HandleChanges} className='' required />
                                                            <label htmlFor="" className='pt-1'>Length</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-3 col-md-4 col-lg-3">
                                                        <div className=" text__dropdwon">
                                                            <Select
                                                                name='RegistrationStateID'
                                                                styles={customStylesWithOutColor}
                                                                value={registratonStateDrp?.filter((obj) => obj.value === value?.RegistrationStateID)}
                                                                options={registratonStateDrp}
                                                                onChange={(e) => ChangeDropDown(e, 'RegistrationStateID')}
                                                                isClearable
                                                                placeholder="Select..."
                                                                menuPlacement='top'
                                                            />
                                                            <label className='pt-2'>Registration State</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-3  col-md-3 col-lg-2 pt-1" >
                                                        <div className="text-mobile">
                                                            <input type="text" name='RegistrationNumber' id='RegistrationNumber' value={value?.RegistrationNumber} onChange={HandleChanges} className='' required />
                                                            <label htmlFor="">Registration No.</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-3 col-md-4 col-lg-3 ">
                                                        <div className=" text__dropdwon">
                                                            <Select
                                                                name='VODID'
                                                                value={VODIDData?.filter((obj) => obj.value === value?.VODID)}
                                                                styles={customStylesWithOutColor}
                                                                options={VODIDData}
                                                                onChange={(e) => ChangeDropDown(e, 'VODID')}
                                                                isClearable
                                                                placeholder="Select..."
                                                                menuPlacement='top'
                                                            />
                                                            <label className='pt-2'>VOD</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-3 col-md-5 col-lg-3 mt-1">
                                                        <div className=" text__dropdwon">
                                                            <Select
                                                                name='MaterialID'
                                                                value={materialDrp?.filter((obj) => obj.value === value?.MaterialID)}
                                                                options={materialDrp}
                                                                styles={customStylesWithOutColor}
                                                                onChange={(e) => ChangeDropDown(e, 'MaterialID')}
                                                                isClearable
                                                                placeholder="Select..."
                                                                menuPlacement='top'
                                                            />
                                                            <label className='pt-2'>Material</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-3 col-md-6 col-lg-3 mt-1">
                                                        <div className=" text__dropdwon">
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
                                                            <label className='pt-2'>Make</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-3 col-md-6 col-lg-2 mt-1">
                                                        <div className=" text__dropdwon">
                                                            <Select
                                                                name='ModelID'
                                                                value={boatModelDrp?.filter((obj) => obj.value === value?.ModelID)}
                                                                styles={customStylesWithOutColor}
                                                                options={boatModelDrp}
                                                                onChange={(e) => ChangeDropDown(e, 'ModelID')}
                                                                isClearable
                                                                placeholder="Select..."
                                                                menuPlacement='top'
                                                            />
                                                            <label className='pt-2'>Model Id</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-9  col-md-12 col-lg-4 mt-1">
                                                        <div className=" text__dropdwon">
                                                            <textarea name='Comments' id="Comments" value={value?.Comments} onChange={HandleChanges} cols="30" rows='1' className="form-control" >
                                                            </textarea>
                                                            <label htmlFor="" className='pt-1'>Comments</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-3  col-md-6 col-lg-2  mt-1 pt-1" >
                                                        <div className="text-mobile">
                                                            <input type="text" name='HIN' value={value?.HIN} onChange={HandleChanges} className='' required />
                                                            <label htmlFor="" className='pt-1'>HIN</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-5 col-md-6 col-lg-2 pt-1 ">
                                                        <div className="text__dropdwon">
                                                            <DatePicker
                                                                id='RegistrationExpiryDtTm'
                                                                name='RegistrationExpiryDtTm'
                                                                ref={startRef1}
                                                                onKeyDown={onKeyDown}
                                                                onChange={(date) => { setRegistrationExpDate(date); setValue({ ...value, ['RegistrationExpiryDtTm']: date ? getShowingWithOutTime(date) : null }) }}
                                                                className='name-datepicker'
                                                                dateFormat="MM/yyyy"
                                                                timeInputLabel
                                                                // showTimeInput
                                                                isClearable={value?.RegistrationExpiryDtTm ? true : false}
                                                                selected={registrationExpDate}
                                                                placeholderText={value?.RegistrationExpiryDtTm ? value.RegistrationExpiryDtTm : 'Select...'}
                                                                // showTimeSelec
                                                                timeIntervals={1}
                                                                timeCaption="Time"
                                                                autoComplete="Off"
                                                                showYearDropdown
                                                                showMonthDropdown
                                                                showMonthYearPicker
                                                                dropdownMode="select"
                                                            />
                                                            <label htmlFor="" className='pt-1'>Reg. Expiry</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-4 col-md-6 col-lg-3 mt-1">
                                                        <div className=" text__dropdwon">
                                                            <Select
                                                                name='BottomColorID'
                                                                value={color?.filter((obj) => obj.value === value?.BottomColorID)}
                                                                options={color}
                                                                menuPlacement='top'
                                                                styles={customStylesWithOutColor}
                                                                onChange={(e) => ChangeDropDown(e, 'BottomColorID')}
                                                                isClearable
                                                                placeholder="Select..."
                                                            />
                                                            <label className='pt-1'>Bottom Color</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-3 col-md-6 col-lg-2 mt-1">
                                                        <div className=" text__dropdwon">
                                                            <Select
                                                                name='TopColorID'
                                                                value={color?.filter((obj) => obj.value === value?.TopColorID)}
                                                                options={color}
                                                                menuPlacement='top'
                                                                styles={customStylesWithOutColor}
                                                                onChange={(e) => ChangeDropDown(e, 'TopColorID')}
                                                                isClearable
                                                                placeholder="Select..."
                                                            />
                                                            <label className='pt-1'>Top Color</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-5 col-md-6 col-lg-3 mt-1">
                                                        <div className=" text__dropdwon">
                                                            <Select
                                                                name='PropulusionID'
                                                                value={propulusionDrp?.filter((obj) => obj.value === value?.PropulusionID)}
                                                                styles={customStylesWithOutColor}
                                                                options={propulusionDrp}
                                                                onChange={(e) => ChangeDropDown(e, 'PropulusionID')}
                                                                isClearable
                                                                menuPlacement='top'
                                                                placeholder="Select..."
                                                            />
                                                            <label className='pt-1'>Propulsion</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            :
                                            <>
                                            </>
                                    }
                                    {/* drug */}
                                    {
                                        value.PropertyCategoryCode === 'D' ?
                                            <div className="col-12 col-md-12 pt-2 p-0" >
                                                <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center ">
                                                    <p className="p-0 m-0">Drug</p>
                                                    {
                                                        ('PropertyID') ?
                                                            <button to="" className="btn btn-sm bg-green text-white px-2 py-0" onClick={setStatusFalse} data-toggle="modal" data-target="#DrugModal">
                                                                <i className="fa fa-plus"></i>
                                                            </button>
                                                            :
                                                            <>
                                                            </>
                                                    }
                                                </div>
                                                <div className="row ">
                                                    <div className="col-12">
                                                        {
                                                            <DataTable
                                                                dense
                                                                columns={columns}
                                                                data={drugData}
                                                                pagination
                                                                paginationPerPage={'3'}
                                                                paginationRowsPerPageOptions={[5, 10, 15, 20]}
                                                                highlightOnHover
                                                                noDataComponent={'There are no data to display'}
                                                            />
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                            :
                                            <>
                                            </>
                                    }
                                </div>
                                <div className="col-12  text-right  p-0 mt-1" style={{ marginBottom: '-17px' }}>
                                    {
                                        ('PropertyID') ?
                                            <>
                                                <button type="button" class="btn btn-sm new-button btn-success mr-1" onClick={() => { check_Validation_Error(); }}>Update</button>
                                            </>
                                            :
                                            <>
                                                <button type="button" class="btn btn-sm new-button btn-success mr-1" onClick={() => { check_Validation_Error(); }}>Save</button>
                                            </>
                                    }
                                    {/* <button type="button" class="btn btn-sm new-button btn-success mr-1" onClick={() => { Add_Property(); }}>Save</button> */}
                                    <button type="button" className="btn btn-sm btn-success new-button  mx-1" onClick={propertyClose} data-dismiss="modal">Close</button>
                                </div>
                            </div >
                        </div>
                    </div>
                    {/* // DrugModal */}
                    {
                        drugModal ?
                            <>
                                <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="DrugModal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="false">
                                    <div class="modal-dialog modal-dialog-centered modal-lg" role="document" >
                                        <div class="modal-content">
                                            <div class="modal-body">
                                                <div className="m-1 mt-3">
                                                    <fieldset style={{ border: '1px solid gray' }}>
                                                        <legend style={{ fontWeight: 'bold' }}>Drugs</legend>
                                                        <div className="row">
                                                            <div className="col-12">
                                                                <div className="row">
                                                                    <div class="col-12 col-md-6  col-lg-6 mt-1">
                                                                        <div className=" text__dropdwon">
                                                                            <Select
                                                                                name='SuspectedDrugTypeID'
                                                                                styles={colourStyles}
                                                                                // menuPlacement='top'
                                                                                value={drugTypeDrp?.filter((obj) => obj.value === value?.SuspectedDrugTypeID)}
                                                                                isClearable
                                                                                options={drugTypeDrp}
                                                                                onChange={(e) => ChangeDropDown(e, 'SuspectedDrugTypeID')}
                                                                                placeholder="Select..."
                                                                            />
                                                                            <label htmlFor='' >Suspected Drug Type</label>
                                                                            {errors.SuspectedDrugTypeIDError !== 'true' ? (
                                                                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.SuspectedDrugTypeIDError}</span>
                                                                            ) : null}
                                                                        </div>
                                                                    </div>
                                                                    <div class="col-12 col-md-6  col-lg-6 mt-1">
                                                                        <div className=" text__dropdwon">
                                                                            <Select
                                                                                name='PropertySourceDrugTypeID'
                                                                                styles={customStylesWithOutColor}
                                                                                // menuPlacement='top'
                                                                                value={propertySourceDrugDrp?.filter((obj) => obj.value === value?.PropertySourceDrugTypeID)}
                                                                                options={propertySourceDrugDrp}
                                                                                onChange={(e) => ChangeDropDown(e, 'PropertySourceDrugTypeID')}
                                                                                placeholder="Select..."
                                                                                isClearable
                                                                                isDisabled={drugTypecode !== 'E' ? false : true}
                                                                            />
                                                                            <label htmlFor='' >Property Source Drug Type</label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-12 col-md-6 col-lg-3 mt-3">
                                                                        <div className="text-mobile">
                                                                            <input type="text" maxLength={10} name='EstimatedDrugQty' id='EstimatedDrugQty' value={value?.EstimatedDrugQty} onChange={HandleChanges} className='' required />
                                                                            <label htmlFor="" >Estimated Drug Qty</label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-12 col-md-6 col-lg-3 mt-3">
                                                                        <div class="text-mobile">
                                                                            <input type="text" name='FractionDrugQty' id='FractionDrugQty' value={value?.FractionDrugQty} onChange={HandleChanges} className='' required />
                                                                            <label>Fraction Drug Qty</label>
                                                                        </div>
                                                                    </div>
                                                                    <div class="col-12 col-md-6  col-lg-6 " style={{ marginTop: '13px' }}>
                                                                        <div className=" text__dropdwon">
                                                                            <Select
                                                                                name='MeasurementTypeID'
                                                                                value={measureTypeDrp?.filter((obj) => obj.value === value?.MeasurementTypeID)}
                                                                                styles={customStylesWithOutColor}
                                                                                options={measureTypeDrp}
                                                                                onChange={(e) => ChangeDropDown(e, 'MeasurementTypeID')}
                                                                                isClearable
                                                                                placeholder="Select..."
                                                                            />
                                                                            <label htmlFor=''>Measurement Type</label>
                                                                        </div>
                                                                    </div>
                                                                    {
                                                                        drugTypecode === 'E' &&
                                                                        <>
                                                                            <div class="col-12 col-md-6  col-lg-6 " style={{ marginTop: '13px' }}>
                                                                                <div className=" text__dropdwon">
                                                                                    <Select
                                                                                        name='TypeMarijuana'
                                                                                        value={typeMarijuanaDrp?.filter((obj) => obj.value === value?.MarijuanaTypeID)}
                                                                                        styles={customStylesWithOutColor}
                                                                                        options={typeMarijuanaDrp}
                                                                                        onChange={(e) => ChangeDropDown(e, 'MarijuanaTypeID')}
                                                                                        isClearable
                                                                                        placeholder="Select..."
                                                                                    />
                                                                                    <label htmlFor=''>Type Marijuana Fields and Gardens</label>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-12 col-md-6 col-lg-6 mt-3">
                                                                                <div class="text-mobile">
                                                                                    <input type="text" name='MarijuanaNumber' id='MarijuanaNumber' maxLength={1} value={value?.MarijuanaNumber} onChange={HandleChanges} className='' required />
                                                                                    <label>Number Marijuana Fields and Gardens</label>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-12 col-md-6 col-lg-6 mt-3">
                                                                                <div class="text-mobile">
                                                                                    <input type="text" name='ClandistineLabsNumber' maxLength={1} id='ClandistineLabsNumber' className='' value={value?.ClandistineLabsNumber} onChange={HandleChanges} required />
                                                                                    <label>Number of Clandestine Labs Seized</label>
                                                                                </div>
                                                                            </div>
                                                                            <div class="col-12 col-md-6  col-lg-6 " style={{ marginTop: '13px' }}>
                                                                                <div className=" text__dropdwon">
                                                                                    <Select
                                                                                        name='DrugManufactured'
                                                                                        value={drugManufactured?.filter((obj) => obj.value === value?.DrugManufacturedID)}
                                                                                        styles={customStylesWithOutColor}
                                                                                        options={drugManufactured}
                                                                                        onChange={(e) => ChangeDropDown(e, 'DrugManufacturedID')}
                                                                                        isClearable
                                                                                        placeholder="Select..."
                                                                                    />
                                                                                    <label htmlFor=''>Type of Drug Manufactured</label>
                                                                                </div>
                                                                            </div>
                                                                        </>
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </fieldset>
                                                </div>
                                            </div>
                                            <div className="btn-box text-right  mr-1 mb-2">
                                                {
                                                    propertyDrugID ?
                                                        <button type="button" class="btn btn-sm new-button btn-success mr-1" onClick={(e) => { check_Drug_Validation_Error(); }}>Update</button>
                                                        :
                                                        <button type="button" class="btn btn-sm new-button btn-success mr-1" onClick={(e) => { check_Drug_Validation_Error(); }} >Save</button>
                                                }
                                                <button type="button" class="btn btn-sm new-button btn-success mr-1" data-dismiss='modal' onClick={onClose}>Close</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* <IdentifyFieldColor /> */}
                            </>
                            :
                            <></>
                    }
                    <DeletePopUpModal func={Delete_Property_Drug} />
                </div>
            </div>
        </>
    )
}

export default PropertyHome

const Get_Property_Code = (data, dropDownData) => {
    const result = data?.map((sponsor) =>
        (sponsor.PropertyTypeID)
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

const Get_Drug_Code = (data, dropDownData) => {
    const newArr = [];
    newArr.push(data);

    const result = newArr?.map((sponsor) =>
        (sponsor.SuspectedDrugTypeID)
    )
    const result2 = dropDownData?.map((sponsor) => {
        if (sponsor.value === parseInt(result[0])) {
            return { value: result[0], label: sponsor.label, id: sponsor.id }
        }
    })
    const val = result2.filter(function (element) {
        return element !== undefined;
    });
    return val[0]?.id
}