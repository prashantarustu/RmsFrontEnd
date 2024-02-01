import React, { useEffect } from 'react'
import Select from "react-select";
import DatePicker from "react-datepicker";
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Decrypt_Id_Name, EncryptedList, Encrypted_Id_Name, getShowingDateText, getShowingMonthDateYear, getShowingWithOutTime, getYearWithOutDateTime } from '../../../../Common/Utility';
import { AddDeleteUpadate, AddDeleteUpadate_FormData, fetchData, fetchPostData } from '../../../../hooks/Api';
import { Comman_changeArrayFormat, threeColArray } from '../../../../Common/ChangeArrayFormat';
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import { useContext } from 'react';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import IdentifyFieldColor from '../../../../Common/IdentifyFieldColor';
import DataTable from 'react-data-table-component';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import { RequiredField, RequiredFieldIncident, RequiredFieldOnConditon } from '../../../Utility/Personnel/Validation';
import { PropertyListDropDownArray } from '../../../../Utility/ListDropDownArray/ListDropArray';
import FindListDropDown from '../../../../Common/FindListDropDown';
import Loader from '../../../../Common/Loader';
import { Carousel } from 'react-responsive-carousel';
import defualtImage from '../../../../../img/uploadImage.png'
import ChangesModal from '../../../../Common/ChangesModal';

const Home = ({ setRecovered }) => {

  const navigate = useNavigate();
  const useQuery = () => new URLSearchParams(useLocation().search);
  let openPage = useQuery().get('page');

  const { incidentReportedDate, get_Incident_Count, get_Data_Property, updateCount, setUpdateCount, propertyTypeData, setPropertyTypeData, propertyLossCodeData, setPropertyLossCodeData, get_PropertyLossCode, setChangesStatus, changesStatusCount, changesStatus, localStoreArray, setLocalStoreArray, get_LocalStorage, propertyStatus, setPropertyStatus, get_Property_Count, deleteStoreData, storeData } = useContext(AgencyContext);

  const [loder, setLoder] = useState(false);
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
  const [weaponModalDrp, setWeaponModalDrp] = useState([]);
  const [materialDrp, setMaterialDrp] = useState([]);
  const [propulusionDrp, setPropulusionDrp] = useState([]);
  const [makeIdDrp, setMakeIdDrp] = useState([]);
  const [weaponMakeDrpData, setWeaponMakeDrpData] = useState([]);
  const [measureTypeDrp, setMeasureTypeDrp] = useState([]);
  const [typeMarijuanaDrp, setTypeMarijuanaDrp] = useState([]);
  const [drugManufactured, setDrugManufactured] = useState([]);
  const [drugTypeDrp, setDrugTypeDrp] = useState([]);
  const [Editval, setEditval] = useState([]);
  const [boatModelDrp, setboatModelDrp] = useState();
  const [propertyNumber, setPropertyNumber] = useState('');
  const [PropertyArticle, setPropertyArticle] = useState([]);
  const [PropertyWeapon, setPropertyWeapon] = useState([]);
  const [PropertySecurity, setPropertySecurity] = useState([]);
  const [PropertOther, setPropertOther] = useState([]);
  const [PropertyDrug, setPropertyDrug] = useState([]);
  const [PropertyBoat, setPropertyBoat] = useState([]);
  const [VODIDData, setVODIDData] = useState([]);
  const [lossCode, setLossCode] = useState('')

  //------------------propertyID, MasterPropertyID------------
  const [propertyID, setPropertyID] = useState('');
  const [masterPropertyID, setMasterPropertyID] = useState('');

  //-------------------image-----------------------
  const [multiImage, setMultiImage] = useState([])
  const [imageid, setImageId] = useState('');

  //------------DrugDataModal-------------------
  const [drugData, setDrugData] = useState();
  const [propertyDrugID, setPropertyDrugID] = useState();
  const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState();
  const [drugModal, setdrugModal] = useState();
  const [drugEditData, setDrugEditData] = useState([]);
  const [propertySourceDrugDrp, setPropertySourceDrugDrp] = useState([]);
  const [drugTypecode, setDrugTypeCode] = useState('');

  const [MainIncidentID, setMainIncidentID] = useState('');
  const [LoginAgencyID, setLoginAgencyID] = useState('');
  const [LoginPinID, setLoginPinID,] = useState('');

  const [value, setValue] = useState({
    'MasterPropertyID': '',
    'PropertyID': '',
    'AgencyID': '',
    'IncidentID': '',
    'CreatedByUserFK': '',
    'PropertyCategoryCode': '',
    // Dropdown
    'PropertyTypeID': '', 'CategoryID': '', 'ClassificationID': '', 'OfficerID': '', 'LossCodeID': '',
    //Datepicker
    'ReportedDtTm': '',
    'DestroyDtTm': '',
    'Value': '',
    'PropertyTag': '', 'NICB': '', 'Description': '',
    // checkbox
    'IsEvidence': '', 'IsSendToPropertyRoom': '', 'IsPropertyRecovered': '',
    // Article fields 
    'PropertyArticleID': '', 'SerialID': '', 'ModelID': '', 'OAN': '', 'Quantity': '', 'Brand': '', 'TopColorID': '', 'BottomColorID': '',
    // boat Fields 
    'PropertyBoatID': '', 'BoatIDNumber': '', 'HIN': '', 'RegistrationNumber': '', 'VODID': '', 'Length': '', 'Comments': '', 'ManufactureYear': '', 'MaterialID': '',
    'MakeID': '', 'RegistrationExpiryDtTm': '', 'PropulusionID': '', 'RegistrationStateID': '',
    // Other Fields
    'OtherID': '', 'PropertyOtherID': '',
    //Security
    'PropertySecurityID': '', 'SecurityIDNumber': '', 'Denomination': '', 'IssuingAgency': '', 'MeasureTypeID': '', 'SecurityDtTm': '',
    //Weapon 
    'PropertyWeaponID': '', 'WeaponIDNumber': '', 'Style': '', 'Finish': '', 'Caliber': '', 'Handle': '', 'IsAuto': '', 'BarrelLength': '', 'WeaponModelID': '', 'PropertyWeaponID': '', 'MasterID': '',
    //DrugFields 
    'SuspectedDrugTypeID': '',
    'EstimatedDrugQty': '',
    'FractionDrugQty': '',
    'MeasurementTypeID': '',
    'ModifiedByUserFK': '',
    'PropertyDrugID': '',
    'PropertySourceDrugTypeID': '',
    'MarijuanaTypeID': '', 'MarijuanaNumber': '', 'DrugManufacturedID': '', '  ClandistineLabsNumber': '',
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
    if (RequiredFieldIncident(value?.OfficerID)) {
      setErrors(prevValues => { return { ...prevValues, ['OfficerIDError']: RequiredFieldIncident(value?.OfficerID) } })
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
  const { PropertyTypeIDError, ContactError, CategoryIDError, LossCodeIDError, ReportedDtTmError, OfficerIDError } = errors

  useEffect(() => {
    if (PropertyTypeIDError === 'true' && ContactError === 'true' && CategoryIDError === 'true' && LossCodeIDError === 'true' && ReportedDtTmError === 'true' && OfficerIDError === 'true') {
      if (openPage) {
        if (masterPropertyID) { update_Property(); setErrors({ ...errors, ['PropertyTypeIDError']: '', }) }
        else { Add_Property(); setErrors({ ...errors, ['PropertyTypeIDError']: '', }); }
      } else {
        if (propertyID && masterPropertyID) { update_Property(); setErrors({ ...errors, ['PropertyTypeIDError']: '', }) }
        else { Add_Property(); setErrors({ ...errors, ['PropertyTypeIDError']: '', }) }
      }
    }
  }, [PropertyTypeIDError, ContactError, CategoryIDError, LossCodeIDError, ReportedDtTmError, OfficerIDError]);

  useEffect(() => {
    // console.log("propertyID", propertyID)
    // console.log("masterPropertyID", masterPropertyID)
    if (propertyID || masterPropertyID) { GetSingleData(propertyID, masterPropertyID); }
  }, [propertyID, masterPropertyID]);

  const GetSingleData = (propertyID, masterPropertyID) => {
    const val = {
      PropertyID: propertyID,
      MasterPropertyID: masterPropertyID,
    }
    const val2 = {
      MasterPropertyID: masterPropertyID,
      PropertyID: 0,
    }
    // setLoder(true);
    fetchPostData('Property/GetSingleData_Property', openPage === 'masterProperty' ? val2 : val).then((res) => {
      if (res) {
        setEditval(res); setLoder(true);
      }
      else { setEditval([]); setLoder(true); }
    })
  }

  const get_PropertyArticle_Single_Data = (MasterPropertyID, PropertyID, PropertyCategoryCode) => {
    const val = {
      'PropertyID': PropertyID, 'PropertyCategoryCode': PropertyCategoryCode, 'MasterPropertyID': 0,
    }

    const val2 = {
      'MasterPropertyID': MasterPropertyID, 'PropertyCategoryCode': PropertyCategoryCode, 'PropertyID': 0,
    }
    fetchPostData('Property/GetData_PropertyArticle', MasterPropertyID ? val2 : val).then((res) => {
      if (res) {
        setPropertyArticle(res);
      }
      else { setPropertyArticle([]) }
    })
  }

  const get_PropertyBoat_Single_Data = (MasterPropertyID, PropertyID, PropertyCategoryCode) => {
    const val = {
      'PropertyID': PropertyID, 'PropertyCategoryCode': PropertyCategoryCode, 'MasterPropertyID': 0,
    }
    const val2 = {
      'MasterPropertyID': MasterPropertyID, 'PropertyCategoryCode': PropertyCategoryCode, 'PropertyID': 0,
    }
    fetchPostData('Property/GetData_PropertyBoat', MasterPropertyID ? val2 : val).then((res) => {
      if (res) {
        setPropertyBoat(res);
      }
      else { setPropertyBoat([]) }
    })
  }

  const get_PropertyDrug_Single_Data = (MasterPropertyID, PropertyID, PropertyCategoryCode) => {
    // const val = {
    //   'PropertyID': PropertyID, 'PropertyCategoryCode': PropertyCategoryCode, 'MasterPropertyID': 0,
    // }
    // const val2 = {
    //   'MasterPropertyID': MasterPropertyID, 'PropertyCategoryCode': PropertyCategoryCode, 'PropertyID': 0,
    // }
    // fetchPostData('/Property/GetData_PropertyDrug', MasterPropertyID ? val2 : val).then((res) => {
    //   if (res) {
    //     setPropertyDrug(res);
    //   }
    //   else { setPropertyDrug([]) }
    // })
  }

  const get_PropertOther_Single_Data = (MasterPropertyID, PropertyID, PropertyCategoryCode) => {
    const val = {
      'PropertyID': PropertyID, 'PropertyCategoryCode': PropertyCategoryCode, 'MasterPropertyID': 0,
    }
    const val2 = {
      'MasterPropertyID': MasterPropertyID, 'PropertyCategoryCode': PropertyCategoryCode, 'PropertyID': 0,
    }
    fetchPostData('Property/GetData_PropertOther', MasterPropertyID ? val2 : val).then((res) => {
      if (res) {
        setPropertOther(res);
      }
      else { setPropertOther([]) }
    })
  }

  const get_PropertySecurity_Single_Data = (MasterPropertyID, PropertyID, PropertyCategoryCode) => {
    const val = {
      'PropertyID': PropertyID, 'PropertyCategoryCode': PropertyCategoryCode, 'MasterPropertyID': 0,
    }
    const val2 = {
      'MasterPropertyID': MasterPropertyID, 'PropertyCategoryCode': PropertyCategoryCode, 'PropertyID': 0,
    }
    if (openPage === 'masterProperty') {
      fetchPostData('Property/GetData_PropertySecurity', val2).then((res) => {
        if (res) {
          setPropertySecurity(res);
        }
        else { setPropertySecurity([]) }
      })
    } else {
      fetchPostData('Property/GetData_PropertySecurity', val).then((res) => {
        if (res) {
          setPropertySecurity(res);
        }
        else { setPropertySecurity([]) }
      })
    }
  }

  const get_PropertyWeapon_Single_Data = (MasterPropertyID, PropertyID, PropertyCategoryCode) => {
    const val = {
      'PropertyID': PropertyID, 'PropertyCategoryCode': PropertyCategoryCode, 'MasterPropertyID': 0,
    }
    const val2 = {
      'MasterPropertyID': MasterPropertyID, 'PropertyCategoryCode': PropertyCategoryCode, 'PropertyID': 0,
    }
    fetchPostData('Property/GetData_PropertyWeapon', MasterPropertyID ? val2 : val).then((res) => {
      if (res) {
        setPropertyWeapon(res);
      }
      else { setPropertyWeapon([]) }
    })
  }

  useEffect(() => {
    if (propertyID || masterPropertyID) {
      // console.log(Editval[0])
      sessionStorage.setItem("propertyStolenValue", Encrypted_Id_Name(Editval[0]?.Value, 'SForStolenValue'));
      setMasterPropertyID(openPage === 'masterProperty' ? Editval[0]?.MasterPropertyID : Editval[0]?.MasterPropertyID);
      setPropertyID(openPage === 'masterProperty' ? '' : Editval[0]?.PropertyID)
      if (Get_Property_Code(Editval, propertyTypeData) === 'A') {
        get_PropertyArticle_Single_Data(Editval[0]?.MasterPropertyID, propertyID, Get_Property_Code(Editval, propertyTypeData))
        setPropertOther([]); setPropertyBoat([]); setPropertyDrug([]); setPropertyWeapon([]); setPropertySecurity([])
        get_PropertyLossCode(LoginAgencyID, '1', '', '', '', '', ''); console.log("Call  Type === A")
      } else if (Get_Property_Code(Editval, propertyTypeData) === 'B') {
        get_PropertyBoat_Single_Data(Editval[0]?.MasterPropertyID, propertyID, Get_Property_Code(Editval, propertyTypeData))
        setPropertOther([]); setPropertyArticle([]); setPropertyDrug([]); setPropertyWeapon([]); setPropertySecurity([])
        get_PropertyLossCode(LoginAgencyID, '', '', '1', '', '', ''); console.log("Call  Type === B")
      } else if (Get_Property_Code(Editval, propertyTypeData) === 'O') {
        get_PropertOther_Single_Data(Editval[0]?.MasterPropertyID, propertyID, Get_Property_Code(Editval, propertyTypeData))
        setPropertyArticle([]); setPropertyBoat([]); setPropertyDrug([]); setPropertyWeapon([]); setPropertySecurity([])
        get_PropertyLossCode(LoginAgencyID, '', '', '', '1', '', ''); console.log("Call  Type === o")
      } else if (Get_Property_Code(Editval, propertyTypeData) === 'S') {
        get_PropertySecurity_Single_Data(Editval[0]?.MasterPropertyID, propertyID, Get_Property_Code(Editval, propertyTypeData))
        setPropertOther([]); setPropertyBoat([]); setPropertyDrug([]); setPropertyWeapon([]); setPropertyArticle([])
        get_PropertyLossCode(LoginAgencyID, '', '', '1', '', '', ''); console.log("Call  Type === s")
      } else if (Get_Property_Code(Editval, propertyTypeData) === 'G') {
        get_PropertyWeapon_Single_Data(Editval[0]?.MasterPropertyID, propertyID, Get_Property_Code(Editval, propertyTypeData))
        setPropertOther([]); setPropertyBoat([]); setPropertyDrug([]); setPropertyArticle([]); setPropertySecurity([])
        get_PropertyLossCode(LoginAgencyID, '', '', '', '', '', '1'); console.log("Call  Type === D")
      } else if (Get_Property_Code(Editval, propertyTypeData) === 'D') {
        // get_PropertyDrug_Single_Data(Editval[0]?.MasterPropertyID, propertyID, Get_Property_Code(Editval, propertyTypeData))
        setPropertOther([]); setPropertyBoat([]); setPropertyArticle([]); setPropertyWeapon([]); setPropertySecurity([]);
        get_Data_Drug_Modal(Editval[0]?.PropertyID, Editval[0]?.MasterPropertyID);
        get_PropertyLossCode(LoginAgencyID, '', '', '', '', '1', ''); console.log("Call  Type === D")
      }
      setLossCode(Get_LossCode(Editval, propertyLossCodeData));
      setValue({
        ...value,
        'PropertyID': openPage === 'masterProperty' ? '' : Editval[0]?.PropertyID,
        'MasterPropertyID': openPage === 'masterProperty' ? Editval[0]?.MasterPropertyID : Editval[0]?.MasterPropertyID,
        'PropertyTypeID': Editval[0]?.PropertyTypeID,
        'ModifiedByUserFK': LoginPinID,
        'CategoryID': Editval[0]?.CategoryID,
        'ClassificationID': Editval[0]?.ClassificationID,
        'ReportedDtTm': Editval[0]?.ReportedDtTm ? getShowingDateText(Editval[0]?.ReportedDtTm) : '',
        'DestroyDtTm': Editval[0]?.DestroyDtTm ? getShowingDateText(Editval[0]?.DestroyDtTm) : '',
        'Value': Editval[0]?.Value ? Editval[0]?.Value : '',
        'OfficerID': Editval[0]?.OfficerID,
        'LossCodeID': Editval[0]?.LossCodeID,
        'PropertyTag': Editval[0]?.PropertyTag,
        'NICB': Editval[0]?.NICB,
        'Description': Editval[0]?.Description,
        // checkbox
        'IsEvidence': Editval[0]?.IsEvidence,
        'IsSendToPropertyRoom': Editval[0]?.IsSendToPropertyRoom,
        'IsPropertyRecovered': Editval[0]?.IsPropertyRecovered,
        'PropertyCategoryCode': Get_Property_Code(Editval, propertyTypeData),

        // -------------------------------------------------Article fields --------
        'PropertyArticleID': Get_Property_Code(Editval, propertyTypeData) === "A" ? Editval[0].PropertyArticle[0]?.PropertyArticleID : '',

        //---------------------------------- boat Fields --------------------------

        'PropertyBoatID': Get_Property_Code(Editval, propertyTypeData) === "B" ? Editval[0].PropertyBoat[0]?.PropertyBoatID : "",

        // ----------------------------Other Fields-----------------------

        'PropertyOtherID': Get_Property_Code(Editval, propertyTypeData) === "O" ? Editval[0].PropertyOther[0]?.PropertyOtherID : '',

        // ----------------------------Security Fields-----------------------

        'PropertySecurityID': Get_Property_Code(Editval, propertyTypeData) === "S" ? Editval[0].PropertySecurity[0]?.PropertySecurityID : '',

        'PropertyWeaponID': Get_Property_Code(Editval, propertyTypeData) === "G" ? Editval[0].PropertyWeapon[0]?.PropertyWeaponID : '',
      })
      setReportedDtTm(Editval[0]?.ReportedDtTm ? new Date(Editval[0]?.ReportedDtTm) : '');
      setdestoryDate(Editval[0]?.DestroyDtTm ? new Date(Editval[0]?.DestroyDtTm) : '');
      // call function
      PropertyCategory(Editval[0]?.PropertyTypeID);
      PropertyClassification(Editval[0]?.CategoryID);
      setPropertyNumber(Editval[0]?.PropertyNumber);

      // if (Get_Property_Code(Editval, propertyTypeData) === 'D') {
      // get_Data_Drug_Modal(Editval[0]?.PropertyID, Editval[0]?.MasterPropertyID);
      // get_PropertyLossCode('', '', '', '', '1', '');
      // }

      //--------------------please Don't Remove this commented code ----------DevKashyap---------------->

      // propertyLossCodeData?.filter(val => {
      //   console.log(val)
      //   if (val.value === Editval[0]?.LossCodeID) {
      //     if (val.id === "STOL" || val.id === "RECD") {
      //       alert("Calll")
      //       setRecovered(true);
      //     } else {
      //       setRecovered(false);
      //     }
      //   }
      // });
      get_Name_MultiImage();
    } else {
      // setValue({
      //   ...value,
      //   'CategoryID': '',
      // });

      Reset();
    }
  }, [Editval])

  useEffect(() => {
    propertyLossCodeData?.filter(val => {
      if (val.value === value?.LossCodeID) {
        if (val.id === "STOL" || val.id === "RECD" || val.id === "BURN") {
          // alert("Calll")
          console.log(value?.LossCodeID)
          setRecovered(true);
        } else {
          setRecovered(false);
        }
      }
    });
  }, [value.LossCodeID, propertyLossCodeData]);

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
    if (PropertOther.length > 0) {
      setValue({
        ...value,
        'OtherID': PropertOther[0]?.OtherID, 'PropertyOtherID': PropertOther[0]?.PropertyOtherID, 'Brand': PropertOther[0]?.Brand,
        'SerialID': PropertOther[0]?.SerialID ? PropertOther[0]?.SerialID : '', 'TopColorID': PropertOther[0]?.TopColorID, 'BottomColorID': PropertOther[0]?.BottomColorID, 'ModelID': PropertOther[0]?.ModelID, 'Quantity': PropertOther[0]?.Quantity,
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

  const Reset = () => {
    setValue({
      ...value,
      'PropertyID': '', 'PropertyTypeID': '',
      // 'PropertyCategoryCode': '',
      // Dropdown
      'CategoryID': '', 'ClassificationID': '', 'OfficerID': '', 'LossCodeID': '',
      //Datepicker
      // 'ReportedDtTm': '',
      'DestroyDtTm': '', 'Value': '', 'PropertyTag': '', 'NICB': '', 'Description': '',
      // checkbox
      'IsEvidence': '', 'IsSendToPropertyRoom': '', 'IsPropertyRecovered': '',
      // Article fields 
      'SerialID': '', 'ModelID': '', 'OAN': '', 'Quantity': '', 'Brand': '', 'TopColorID': '', 'BottomColorID': '',
      // boat Fields 
      'BoatIDNumber': '', 'HIN': '', 'RegistrationNumber': '', 'VODID': '', 'Length': '', 'Comments': '', 'ManufactureYear': '', 'MaterialID': '',
      'MakeID': '', 'RegistrationExpiryDtTm': '', 'PropulusionID': '', 'RegistrationStateID': '',
      // Other Fields
      'OtherID': '', 'TopColorID': '',
      //Security
      'SecurityIDNumber': '', 'Denomination': '', 'IssuingAgency': '', 'MeasureTypeID': '', 'SecurityDtTm': '',
      //Weapon 
      'WeaponIDNumber': '', 'Style': '', 'Finish': '', 'Caliber': '', 'Handle': '', 'IsAuto': '', 'BarrelLength': '', 'WeaponModelID': '', 'PropertyWeaponID': '',
      //drug Fields
      'SuspectedDrugTypeID': '', 'EstimatedDrugQty': '', 'FractionDrugQty': '', 'MarijuanaTypeID': '', 'MarijuanaNumber': '', 'DrugManufacturedID': '', '  ClandistineLabsNumber': '',

      'MasterID': '', 'Clandestine': '',
    });
    setSecurityDate('');
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

  const get_PropertySourceDrug = (LoginAgencyID) => {
    const val = {
      AgencyID: LoginAgencyID
    }
    fetchPostData('PropertySourceDrugType/GetDataDropDown_PropertySourceDrugType', val).then((res) => {
      if (res) {
        setPropertySourceDrugDrp(Comman_changeArrayFormat(res, 'SourceDrugTypeID', 'Description'));
      } else {
        setPropertySourceDrugDrp([]);
      }
    })
  }

  const get_Data_VODID = (LoginAgencyID) => {
    const val = {
      AgencyID: LoginAgencyID
    }
    fetchPostData('PropertyBoatVOD/GetDataDropDown_PropertyBoatVOD', val).then((res) => {
      if (res) {
        setVODIDData(Comman_changeArrayFormat(res, 'PropertyBoatVODID', 'Description'));
      } else {
        setVODIDData([]);
      }
    })
  }

  const get_Data_Drug_Modal = (propertyID, masterPropertyID) => {
    const val = {
      'PropertyID': propertyID
    }
    const val2 = {
      'MasterPropertyID': masterPropertyID
    }
    fetchPostData(openPage === 'masterProperty' ? 'MainMasterPropertyDrug/GetData_MainMasterPropertyDrug' : 'PropertyDrug/GetData_PropertyDrug', openPage === 'masterProperty' ? val2 : val).then((res) => {
      if (res) {
        setDrugData(res); setDrugLoder(true);
      } else {
        setDrugData([]); setDrugLoder(true);
      }
    })
  }

  const get_BoatModel_Drp_Data = (LoginAgencyID) => {
    const val = {
      AgencyID: LoginAgencyID
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
      AgencyID: LoginAgencyID
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
      AgencyID: LoginAgencyID
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
      AgencyID: LoginAgencyID
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
      AgencyID: LoginAgencyID
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
      AgencyID: LoginAgencyID
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
      AgencyID: LoginAgencyID
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
      AgencyID: LoginAgencyID
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
      AgencyID: LoginAgencyID
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
      AgencyID: LoginAgencyID
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
      AgencyID: LoginAgencyID
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
      AgencyID: LoginAgencyID
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
      AgencyID: LoginAgencyID
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
          PropertyCategory(id[0].PropertyCategoryID);
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

  // const PropertyColor = (LoginAgencyID) => {
  //   const val = {
  //     AgencyID: LoginAgencyID
  //   }
  //   fetchPostData('Property/GetDataDropDown_PropertyColor', val).then((data) => {
  //     if (data) {
  //       setPropertyColorData(Comman_changeArrayFormat(data, 'ColorID', 'ColorDescription'))
  //     } else {
  //       setPropertyColorData([]);
  //     }
  //   })
  // }

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
        switch (e.id) {
          case 'A': get_PropertyLossCode(LoginAgencyID, '1', '', '', '', '', ''); break;
          case 'B': get_PropertyLossCode(LoginAgencyID, '', '1', '', '', '', ''); break;
          case 'S': get_PropertyLossCode(LoginAgencyID, '', '', '1', '', '', ''); break;
          case 'O': get_PropertyLossCode(LoginAgencyID, '', '', '', '1', '', ''); break;
          case 'D': get_PropertyLossCode(LoginAgencyID, '', '', '', '', '1', ''); break;
          case 'G': get_PropertyLossCode(LoginAgencyID, '', '', '', '', '', '1'); break;
          default: get_PropertyLossCode(LoginAgencyID, '1', '', '', '', '', '');
        }
        PropertyCategory(e.value);
        setChangesStatus(true);
        setValue({ ...value, ['PropertyCategoryCode']: e.id, ['PropertyTypeID']: e.value, ['ClassificationID']: null, ['LossCodeID']: null, });
        setDrugLoder(true);// for when we add new property and choose for Drug the loader is unStopable .
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
      } else if (name === 'PropertyTypeID') {
        setChangesStatus(true);
        setValue({
          ...value,
          ['PropertyTypeID']: null, ['PropertyCategoryCode']: '', ['CategoryID']: null, ['ClassificationID']: null, ['LossCodeID']: null,
        });
        setPropertyCategoryData([]); setPropertyClassificationData([]); setPropertyLossCodeData([]);
      } else if (name === 'CategoryID') {
        setChangesStatus(true);
        setValue({
          ...value,
          ['CategoryID']: null, ['ClassificationID']: null,
        });
        setPropertyClassificationData([]); setPropertyLossCodeData([]);
      } else {
        setChangesStatus(true);
        setValue({
          ...value,
          [name]: null
        });
      }
    }
  }

  const HandleChanges = (e) => {
    if (e.target.name === 'IsEvidence' || e.target.name === 'IsSendToPropertyRoom' || e.target.name === 'IsPropertyRecovered' || e.target.name === 'IsAuto') {
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
        ...value,
        'WeaponIDNumber': '', 'Style': '', 'Finish': '', 'Caliber': '', 'Handle': '', 'SerialID': '', 'MakeID': '', 'WeaponModelID': '', 'IsAuto': '', 'ManufactureYear': '',
        'BarrelLength': '',
      })
    }
  }

  const Add_Property = () => {
    AddDeleteUpadate(openPage === 'masterProperty' ? 'MainMasterProperty/Insert_MainMasterProperty' : 'Property/Insert_Property', value).then((res) => {
      if (res.success) {
        toastifySuccess(res.Message)
        setErrors({ ...errors, ['PropertyTypeIDError']: '', });
        if (res.PropertyID || res.MasterPropertyID) {
          setPropertyID(res.PropertyID);
          setMasterPropertyID(res.MasterPropertyID);
          setPropertyStatus(true)
          storeData({ 'PropertyID': res?.PropertyID, 'MasterPropertyID': res?.MasterPropertyID, 'propertyStatus': true })
          GetSingleData(res?.PropertyID, res?.MasterPropertyID);
          get_Incident_Count(MainIncidentID);
        }
        get_Data_Property(MainIncidentID);
        setUpdateCount(updateCount + 1);
        setChangesStatus(false);
      }
      else {
        toastifyError('error');
        setErrors({ ...errors, ['PropertyTypeIDError']: '', })
      }
    })
  }

  const update_Property = () => {
    const previousValue = value.Value;
    AddDeleteUpadate(openPage === 'masterProperty' ? 'MainMasterProperty/Update_MainMasterProperty' : 'Property/Update_Property', value).then((res) => {
      if (res?.success) {
        toastifySuccess(res.Message);
        setUpdateCount(updateCount + 1);
        get_Data_Property(MainIncidentID);
        setChangesStatus(false)
        setErrors({ ...errors, ['PropertyTypeIDError']: '', })
        setValue({ ...value, Value: previousValue, });
      } else {
        toastifyError('error');
        setErrors({ ...errors, ['PropertyTypeIDError']: '', })
      }
    })
  }

  const propertyClose = () => {
    if (openPage === 'masterProperty') {
      navigate('/property-search');
      deleteStoreData({ 'PropertyID': '', 'MasterPropertyID': '', 'propertyStatus': '' });
    } else {
      navigate('/property')
      deleteStoreData({ 'PropertyID': '', 'MasterPropertyID': '', 'propertyStatus': '' });
    }
  }

  const colourStyles = {
    control: (styles) => ({
      ...styles, backgroundColor: "#fce9bf",
      height: 20,
      minHeight: 30,
      fontSize: 14,
      margintop: 2,
      boxShadow: 0,
    }),
  }

  const customStylesWithOutColor = {
    control: base => ({
      ...base,
      height: 20,
      minHeight: 32,
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
          {
            EffectiveScreenPermission ? EffectiveScreenPermission[0]?.Changeok ?
              <button onClick={(e) => { set_Edit_Value(e, row) }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DrugModal" >
                <i className="fa fa-edit"></i>
              </button>
              : <></>
              : <button onClick={(e) => { set_Edit_Value(e, row) }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DrugModal" >
                <i className="fa fa-edit"></i></button>
          }
          {
            EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DeleteOK ?
              <button to={`#`} onClick={() => { setPropertyDrugID(row.PropertyDrugID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                <i className="fa fa-trash"></i>
              </button>
              : <></>
              : <button to={`#`} onClick={() => { setPropertyDrugID(row.PropertyDrugID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                <i className="fa fa-trash"></i>
              </button>
          }
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
    setPropertyDrugID(''); setDrugTypeCode('')
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

  const [drugErrors, setDrugErrors] = useState({
    'SuspectedDrugTypeIDError': '',
  })

  const check_Drug_Validation_Error = () => {
    if (RequiredFieldIncident(value.SuspectedDrugTypeID)) {
      setDrugErrors(prevValues => { return { ...prevValues, ['SuspectedDrugTypeIDError']: RequiredFieldIncident(value.SuspectedDrugTypeID) } })
    }
  }

  // Check All Field Format is True Then Submit 
  const { SuspectedDrugTypeIDError } = drugErrors

  useEffect(() => {
    if (SuspectedDrugTypeIDError === 'true') {
      if (propertyDrugID) { update_DrugModal(); }
      else { Add_Drug(); }
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
      // console.log(Get_Drug_Code(drugEditData, drugTypeDrp));
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
    AddDeleteUpadate(openPage === 'masterProperty' ? 'MainMasterPropertyDrug/Insert_MainMasterPropertyDrug' : 'PropertyDrug/Insert_PropertyDrug', value).then((res) => {
      toastifySuccess(res.Message);
      get_Data_Drug_Modal(propertyID, masterPropertyID);
      setChangesStatus(false)
      setdrugModal(false);
      setUpdateCount(updateCount + 1)
      setDrugErrors({ ...drugErrors, 'SuspectedDrugTypeIDError': '' })
    })
  }

  const update_DrugModal = () => {
    AddDeleteUpadate('PropertyDrug/Update_PropertyDrug', value).then((res) => {
      toastifySuccess(res.Message)
      get_Data_Drug_Modal(propertyID, masterPropertyID);
      setChangesStatus(false)
      setdrugModal(false);
      setDrugErrors({ ...drugErrors, 'SuspectedDrugTypeIDError': '' })
      setDrugErrors(...pre => { return { ...pre, ['SuspectedDrugTypeIDError']: '' } });
    })
  }

  const Delete_Prpperty_Drug = () => {
    const val = {
      'PropertyDrugID': propertyDrugID,
      'DeletedByUserFK': LoginPinID
    }
    AddDeleteUpadate('PropertyDrug/Delete_PropertyDrug', val).then((res) => {
      if (res) {
        toastifySuccess(res.Message);
        get_Data_Drug_Modal(propertyID, masterPropertyID);
        setChangesStatus(false)
        get_Data_Property();
        delete_Image_File();
      } else console.log("Somthing Wrong");
    })
  }

  const onClose = () => {
    if (!changesStatus) {
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
  }

  const get_Name_MultiImage = () => {
    const val = {
      'PropertyID': propertyID,
      'MasterPropertyID': masterPropertyID,
    }
    const val1 = {
      'PropertyID': 0,
      'MasterPropertyID': masterPropertyID,
    }
    fetchPostData('Property/GetData_PropertyPhoto', openPage === 'masterProperty' ? val1 : val)
      .then((res) => {
        if (res) { setMultiImage(res); }
        else { setMultiImage(); }
      })
  }

  //-------------------------Image---------------------------
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
      'PropertyID': propertyID,
      'MasterPropertyID': masterPropertyID,
      'CreatedByUserFK': LoginPinID,
    }
    const val1 = {
      'PropertyID': 0,
      'MasterPropertyID': masterPropertyID,
      'CreatedByUserFK': LoginPinID,
    }
    const values = EncryptedList(JSON.stringify(openPage === 'masterProperty' ? val1 : val));
    var formdata = new FormData();
    formdata.append("Propertyphotopath", image);
    formdata.append("Data", values);
    AddDeleteUpadate_FormData('Property/Insert_PropertyPhoto', formdata)
      .then((res) => {
        if (res.success) {
          get_Name_MultiImage(propertyID, masterPropertyID)
        }
      })
      .catch(err => console.log(err))
  }

  const delete_Image_File = (e) => {
    const value = {
      'PhotoID': imageid,
      'DeletedByUserFK': LoginPinID
    }
    AddDeleteUpadate('Property/Delete_PropertyPhoto', value).then((data) => {
      if (data.success) {
        // toastifySuccess(data?.Message);
        get_Name_MultiImage(propertyID, masterPropertyID);
        GetSingleData(propertyID, masterPropertyID);
      } else {
        toastifyError(data?.Message);
      }
    });
  }

  // modification
  const ChangePhoneType = (e, name) => {
    if (e) {
      if (name === 'LossCodeID') {
        setLossCode(e.id);
        setValue({ ...value, [name]: e.value, ['Value']: '', });
        setChangesStatus(true);
      } else {
        setValue({ ...value, [name]: e.value, });
        setChangesStatus(true);
      }
    } else {
      if (name === 'LossCodeID') {
        setLossCode('');
        setValue({ ...value, [name]: null, [' Value']: '', });
        // setChangesStatus(true);
      }
    }
  };

  return (
    loder || !propertyID ?
      <>
        <div className="row">
          <div className="col-12 col-md-12 pt-2 p-0" >
            <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center ">
              <p className="p-0 m-0">Property</p>
              <div>
                {/* <Link to={'/property-vehicle'} className=" ">
                  <i className="fa fa-file"></i>
                </Link> */}
                <FindListDropDown array={PropertyListDropDownArray} />
              </div>
            </div>
          </div>
          <div className="col-12 col-md-12 col-lg-10 pt-1 p-0" >
            <div className="row ">
              <div className="col-3  col-md-3 col-lg-3  mt-1 pt-1" >
                <div className="text-field">
                  <input type="text" className='readonlyColor' value={propertyNumber ? propertyNumber : 'Auto Generated'} required readOnly />
                  <label htmlFor="">Property Number</label>
                </div>
              </div>
              <div className="col-3  col-md-3 col-lg-3  mt-1 pt-1" >
                <div className="text-field">
                  <input type="text" className='readonlyColor' required readOnly />
                  <label htmlFor="">In Possession Of</label>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-4 col-md-4 col-lg-4 mt-1">
                <div className=" dropdown__box">
                  <Select
                    styles={colourStyles}
                    name='PropertyTypeID'
                    value={propertyTypeData?.filter((obj) => obj.value === value?.PropertyTypeID)}
                    options={propertyTypeData}
                    onChange={(e) => ChangeDropDown(e, 'PropertyTypeID')}
                    isClearable
                    placeholder="Select..."
                    isDisabled={propertyID || masterPropertyID ? true : false}
                  />
                  <label>Type</label>
                  {errors.PropertyTypeIDError !== 'true' ? (
                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.PropertyTypeIDError}</span>
                  ) : null}
                </div>
              </div>
              <div className="col-4 col-md-4 col-lg-5 mt-1">
                <div className=" dropdown__box">
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
                  <label>Category</label>
                  {errors.CategoryIDError !== 'true' ? (
                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CategoryIDError}</span>
                  ) : null}
                </div>
              </div>
              <div className="col-4 col-md-4 col-lg-3 mt-1">
                <div className=" dropdown__box">
                  <Select
                    styles={customStylesWithOutColor}
                    name='ClassificationID'
                    value={propertyClassificationData?.filter((obj) => obj.value === value?.ClassificationID)}
                    options={propertyClassificationData}
                    onChange={(e) => ChangeDropDown(e, 'ClassificationID')}
                    isClearable
                    placeholder="Select..."
                  />
                  <label>Classification</label>
                </div>
              </div>
              <div className="col-6 col-md-4 col-lg-3 " style={{ marginTop: '5px' }}>
                <div className='date__box'>
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
                  <label htmlFor="">Reported Date/Time</label>
                  {errors.ReportedDtTmError !== 'true' ? (
                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ReportedDtTmError}</span>
                  ) : null}
                </div>
              </div>
              {/* <div className="col-6 col-md-3 col-lg-2" style={{ marginTop: '10px' }}>
                <div className="text-field">
                <input type="text" name='Value' id='Value' maxLength={20} value={'$' + value?.Value.replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ',')} onChange={HandleChanges} className='' required />
                  <label htmlFor="">Value</label>
                </div>
              </div> */}
              <div className="col-6 col-md-6 col-lg-3 mt-2">
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
                  <label>Property Reason Code</label>
                  {errors.LossCodeIDError !== 'true' ? (
                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.LossCodeIDError}</span>
                  ) : null}
                </div>
              </div>

              <div className="col-6 col-md-5 col-lg-4 mt-2">
                <div className=" dropdown__box">
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
                  <label>Primary Officer</label>
                  {errors.OfficerIDError !== 'true' ? (
                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.OfficerIDError}</span>
                  ) : null}
                </div>
              </div>
              <div className="col-6 col-md-3 col-lg-2" style={{ marginTop: '10px' }}>
                <div class="text-field">
                  <input
                    type="text"
                    name="Value"
                    id="Value"
                    className={lossCode === 'STOL' || lossCode === 'BURN' || lossCode === 'RECD' ? 'requiredColor' : ''}
                    maxLength={20}
                    value={`\$ ${value?.Value}`}
                    onChange={HandleChanges}
                    required
                  />
                  <label >Value</label>
                </div>
                {errors.ContactError !== 'true' ? (
                  <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ContactError}</span>
                ) : null}
              </div>

            </div>
            {/* ARTICLE   */}
            {
              value.PropertyCategoryCode === 'A' ?
                <div className="col-12 col-md-12 col-lg-12 pt-2 p-0" >
                  <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center">
                    <p className="p-0 m-0">Article</p>
                  </div>
                  <div className="row">
                    <div className="col-3  col-md-3 col-lg-3  mt-1 pt-1" >
                      <div className="text-field">
                        <input type="text" name='SerialID' id='SerialID' value={value?.SerialID} onChange={HandleChanges} className='' required />
                        <label htmlFor="">Serial Id</label>
                      </div>
                    </div>
                    <div className="col-3  col-md-3 col-lg-3  mt-1 pt-1" >
                      <div className="text-field">
                        <input type="text" name='ModelID' id='ModelID' value={value?.ModelID} onChange={HandleChanges} className='' required />
                        <label htmlFor="">Model Id</label>
                      </div>
                    </div>
                    <div className="col-3 col-md-6 col-lg-3 mt-1">
                      <div className=" dropdown__box">
                        <Select
                          name='TopColorID'
                          value={color?.filter((obj) => obj.value === value?.TopColorID)}
                          options={color}
                          styles={customStylesWithOutColor}
                          onChange={(e) => ChangeDropDown(e, 'TopColorID')}
                          isClearable
                          placeholder="Select..."
                        />
                        <label>Top Color</label>
                      </div>
                    </div>
                    <div className="col-3 col-md-6 col-lg-3 mt-1">
                      <div className=" dropdown__box">
                        <Select
                          name='BottomColorID'
                          value={color?.filter((obj) => obj.value === value?.BottomColorID)}
                          options={color}
                          styles={customStylesWithOutColor}
                          onChange={(e) => ChangeDropDown(e, 'BottomColorID')}
                          isClearable
                          placeholder="Select..."
                        />
                        <label>Bottom Color</label>
                      </div>
                    </div>
                    <div className="col-3  col-md-6 col-lg-3  mt-1 pt-1" >
                      <div className="text-field">
                        <input type="text" name='OAN' id='OAN' value={value?.OAN} onChange={HandleChanges} className='' required />
                        <label htmlFor="">OAN</label>
                      </div>
                    </div>
                    <div className="col-3  col-md-6 col-lg-3  mt-1 pt-1" >
                      <div className="text-field">
                        <input type="text" name='Quantity' id='Quantity' value={value?.Quantity} onChange={HandleChanges} className='' required />
                        <label htmlFor="">Quantity</label>
                      </div>
                    </div>
                    <div className="col-3  col-md-6 col-lg-3  mt-1 pt-1" >
                      <div className="text-field">
                        <input type="text" name='Brand' id='Brand' value={value?.Brand} onChange={HandleChanges} className='' required />
                        <label htmlFor="">Brand</label>
                      </div>
                    </div>
                  </div>
                  <div className="col-12  col-md-12 col-lg-12 text-right mt-md-1 " style={{ marginTop: '-20px' }}>
                    <button type="button" className="btn btn-sm btn-success" >Search</button>
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
                    <p className="p-0 m-0">Other</p>
                  </div>
                  <div className="row">
                    {/* <div className="col-3  col-md-3 col-lg-3  mt-1 pt-1" >
                  <div className="text-field">
                    <input type="text" id='OtherID' name='OtherID' value={value?.OtherID} onChange={HandleChanges} className='' required />
                    <label htmlFor="">Other Id</label>
                  </div>
                </div> */}
                    <div className="col-3  col-md-3 col-lg-3  mt-1 pt-1" >
                      <div className="text-field">
                        <input type="text" name='Brand' id='Brand' value={value?.Brand} onChange={HandleChanges} className='' required />
                        <label htmlFor="">Brand</label>
                      </div>
                    </div>
                    <div className="col-3  col-md-3 col-lg-3  mt-1 pt-1" >
                      <div className="text-field">
                        <input type="text" name='SerialID' id='SerialID' value={value?.SerialID} onChange={HandleChanges} className='' required />
                        <label htmlFor="">Serial Id</label>
                      </div>
                    </div>
                    <div className="col-3 col-md-6 col-lg-3 mt-1">
                      <div className=" dropdown__box">
                        <Select
                          name='TopColorID'
                          value={color?.filter((obj) => obj.value === value?.TopColorID)}
                          options={color}
                          styles={customStylesWithOutColor}
                          onChange={(e) => ChangeDropDown(e, 'TopColorID')}
                          isClearable
                          placeholder="Select..."
                        />
                        <label>Top Color</label>
                      </div>
                    </div>
                    <div className="col-3 col-md-6 col-lg-3 mt-1">
                      <div className=" dropdown__box">
                        <Select
                          name='BottomColorID'
                          value={color?.filter((obj) => obj.value === value?.BottomColorID)}
                          options={color}
                          styles={customStylesWithOutColor}
                          onChange={(e) => ChangeDropDown(e, 'BottomColorID')}
                          isClearable
                          placeholder="Select..."
                        />
                        <label>Bottom Color</label>
                      </div>
                    </div>
                    <div className="col-3  col-md-6 col-lg-3  mt-1 pt-1" >
                      <div className="text-field">
                        <input type="text" name='ModelID' id='ModelID' value={value?.ModelID} onChange={HandleChanges} className='' required />
                        <label htmlFor="">Model Id</label>
                      </div>
                    </div>
                    <div className="col-3  col-md-6 col-lg-3  mt-1 pt-1" >
                      <div className="text-field">
                        <input type="text" name='Quantity' id='Quantity' value={value?.Quantity} onChange={HandleChanges} className='' required />
                        <label htmlFor="">Quantity</label>
                      </div>
                    </div>
                    <div className="col-3 col-md-6 col-lg-3 mt-1">
                      <div className=" dropdown__box">
                        <Select
                          name='quantityunit'
                          // options={color}
                          styles={customStylesWithOutColor}
                          isClearable
                          placeholder="Select..."
                        />
                        <label>Quantity Unit</label>
                      </div>
                    </div>
                  </div>
                  <div className="col-12  col-md-12 col-lg-12 text-right  mt-md-1" style={{ marginTop: '-15px' }}>
                    <button type="button" className="btn btn-sm btn-success" >Search</button>
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
                    <p className="p-0 m-0">Security</p>
                  </div>
                  <div className="row">
                    {/* <div className="col-3  col-md-3 col-lg-3  mt-1 pt-1" >
                  <div className="text-field">
                    <input type="text" name='SecurityIDNumber' value={value?.SecurityIDNumber} id='SecurityIDNumber' onChange={HandleChanges} className='' required />
                    <label htmlFor="">Security Id</label>
                  </div>
                </div> */}
                    <div className="col-4  col-md-3 col-lg-3  mt-1 pt-1" >
                      <div className="text-field">
                        <input type="text" name='Denomination' id='Denomination' value={value?.Denomination} onChange={HandleChanges} className='' required />
                        <label htmlFor="">Denomination</label>
                      </div>
                    </div>
                    <div className="col-4  col-md-3 col-lg-3  mt-1 pt-1" >
                      <div className="text-field">
                        <input type="text" name='IssuingAgency' id='IssuingAgency' value={value?.IssuingAgency} onChange={HandleChanges} className='' required />
                        <label htmlFor="">Issuing Agency</label>
                      </div>
                    </div>
                    <div className="col-4 col-md-6 col-lg-3 mt-1">
                      <div className=" dropdown__box">
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
                        <label>Measure Type</label>
                      </div>
                    </div>
                    <div className="col-5 col-md-6 col-lg-3 mt-3 date__box">
                      <DatePicker
                        id='SecurityDtTm'
                        name='SecurityDtTm'
                        ref={startRef1}
                        onKeyDown={onKeyDown}
                        onChange={(date) => { setSecurityDate(date); setValue({ ...value, ['SecurityDtTm']: date ? getShowingWithOutTime(date) : null }) }}
                        className=''
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
                      <label htmlFor="">Security Date</label>
                    </div>
                    <div className="col-3 col-md-6 col-lg-3 mt-1">
                      <div className="text-field">
                        <input type="text" name='SerialID' id='SerialID' value={value?.SerialID} onChange={HandleChanges} className='' required />
                        <label htmlFor="" className='pt-1'>Serial Id</label>
                      </div>
                    </div>
                  </div>
                  <div className="col-12  col-md-12 col-lg-12 text-right  mt-md-1" style={{ marginTop: '-15px' }}>
                    <button type="button" className="btn btn-sm btn-success" >Search</button>
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
                    {/* <div className="col-3  col-md-3 col-lg-2  mt-1 pt-1" >
                  <div className="text-field">
                    <input type="text" name='WeaponIDNumber' id='WeaponIDNumber' value={value?.WeaponIDNumber} onChange={HandleChanges} className='' required />
                    <label htmlFor="">Weapon Id</label>
                  </div>
                </div> */}
                    <div className="col-3  col-md-3 col-lg-2  mt-1 pt-1" >
                      <div className="text-field">
                        <input type="text" name='Style' id='Style' value={value?.Style} onChange={HandleChanges} className='' required />
                        <label htmlFor="">Style</label>
                      </div>
                    </div>
                    <div className="col-3  col-md-3 col-lg-2  mt-1 pt-1" >
                      <div className="text-field">
                        <input type="text" name='Finish' id='Finish' value={value?.Finish} onChange={HandleChanges} className='' required />
                        <label htmlFor="">Finish</label>
                      </div>
                    </div>
                    <div className="col-3  col-md-3 col-lg-2  mt-1 pt-1" >
                      <div className="text-field">
                        <input type="text" name='Caliber' id='Caliber' value={value?.Caliber} onChange={HandleChanges} className='' required />
                        <label htmlFor="">Caliber</label>
                      </div>
                    </div>
                    <div className="col-3  col-md-3 col-lg-2  mt-1 pt-1" >
                      <div className="text-field">
                        <input type="text" name='Handle' id='Handle' value={value?.Handle} onChange={HandleChanges} className='' required />
                        <label htmlFor="">Handle</label>
                      </div>
                    </div>
                    <div className="col-3  col-md-3 col-lg-1  mt-1 pt-1" >
                      <div className="text-field">
                        <input type="text" name='SerialID' id='SerialID' value={value?.SerialID} onChange={HandleChanges} className='' required />
                        <label htmlFor="">Serial Id</label>
                      </div>
                    </div>
                    <div className="col-3 col-md-3 col-lg-3 mt-1">
                      <div className=" dropdown__box">
                        <Select
                          name='MakeID'
                          value={weaponMakeDrpData?.filter((obj) => obj.value === value?.MakeID)}
                          styles={customStylesWithOutColor}
                          options={weaponMakeDrpData}
                          onChange={(e) => ChangeDropDown(e, 'MakeID')}
                          isClearable
                          placeholder="Select..."
                        />
                        <label>Make</label>
                      </div>
                    </div>
                    <div className="col-3 col-md-3 col-lg-3 mt-1">
                      <div className=" dropdown__box">
                        <Select
                          name='WeaponModelID'
                          styles={customStylesWithOutColor}
                          value={weaponModalDrp?.filter((obj) => obj.value === value?.WeaponModelID)}
                          isClearable
                          options={weaponModalDrp}
                          onChange={(e) => ChangeDropDown(e, 'WeaponModelID')}
                          placeholder="Select..."
                        />
                        <label>Model Id</label>
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
                    {/* <div className="col-3  col-md-3 col-lg-3  mt-1 pt-1" >
                      <div className="text-field">
                        <input type="text" maxLength={4} name='ManufactureYear' value={value?.ManufactureYear} id='ManufactureYear' onChange={HandleChanges} className='' required />
                        <label htmlFor="">Manufacture Year</label>
                      </div>
                    </div> */}
                    <div className="col-4 col-md-4 col-lg-3 mt-1 ">
                      <div className="dropdown__box">
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
                        />
                        <label htmlFor="" className='pt-1'>Manufacture Year</label>
                      </div>
                    </div>
                    <div className="col-3  col-md-3 col-lg-2  mt-1 pt-1" >
                      <div className="text-field">
                        <input type="text" name='BarrelLength' value={value?.BarrelLength} id='BarrelLength' onChange={HandleChanges} className='' required />
                        <label htmlFor="">Barrel Length</label>
                      </div>
                    </div>
                  </div>
                  <div className="col-12  col-md-12 col-lg-12 text-right  mt-md-1" style={{ marginTop: '-15px' }}>
                    <button type="button" className="btn btn-sm btn-success" >Search</button>
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
                    <p className="p-0 m-0">Boat</p>
                  </div>
                  <div className="row">
                    {/* <div className="col-3  col-md-3 col-lg-2  mt-1 pt-1" >
                  <div className="text-field">
                    <input type="text" name='BoatIDNumber' id='BoatIDNumber' value={value?.BoatIDNumber} onChange={HandleChanges} className='' required />
                    <label htmlFor="">Boat Id</label>
                  </div>
                </div> */}

                    {/* <input type="text" maxLength={4} name='ManufactureYear' value={value?.ManufactureYear} id='ManufactureYear' onChange={HandleChanges} className='' required /> */}
                    <div className="col-4 col-md-4 col-lg-3 " style={{ marginTop: '3px' }}>
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
                    <div className="col-3  col-md-2 col-lg-3  " style={{ marginTop: '7px' }}>
                      <div className="text-field">
                        <input type="text" name='Length' id='Length' value={value?.Length} onChange={HandleChanges} className='' required />
                        <label htmlFor="">Length</label>
                      </div>
                    </div>
                    <div className="col-3 col-md-4 col-lg-3 " style={{ marginTop: '4px' }}>
                      <div className=" dropdown__box">
                        <Select
                          name='RegistrationStateID'
                          styles={customStylesWithOutColor}
                          value={registratonStateDrp?.filter((obj) => obj.value === value?.RegistrationStateID)}
                          options={registratonStateDrp}
                          onChange={(e) => ChangeDropDown(e, 'RegistrationStateID')}
                          isClearable
                          placeholder="Select..."
                        />
                        <label >Registration State</label>
                      </div>
                    </div>
                    <div className="col-3  col-md-3 col-lg-3 " style={{ marginTop: '6px' }}>
                      <div className="text-field">
                        <input type="text" name='RegistrationNumber' id='RegistrationNumber' value={value?.RegistrationNumber} onChange={HandleChanges} className='' required />
                        <label htmlFor="">Registration No.</label>
                      </div>
                    </div>
                    <div className="col-3 col-md-4 col-lg-3 mt-1">
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
                        <label>VOD</label>
                      </div>
                    </div>
                    <div className="col-3 col-md-5 col-lg-3 mt-1">
                      <div className=" dropdown__box">
                        <Select
                          name='MaterialID'
                          value={materialDrp?.filter((obj) => obj.value === value?.MaterialID)}
                          options={materialDrp}
                          styles={customStylesWithOutColor}
                          onChange={(e) => ChangeDropDown(e, 'MaterialID')}
                          isClearable
                          placeholder="Select..."
                        />
                        <label>Material</label>
                      </div>
                    </div>
                    <div className="col-3 col-md-6 col-lg-3 mt-1">
                      <div className=" dropdown__box">
                        <Select
                          name='MakeID'
                          value={makeIdDrp?.filter((obj) => obj.value === value?.MakeID)}
                          styles={customStylesWithOutColor}
                          options={makeIdDrp}
                          onChange={(e) => ChangeDropDown(e, 'MakeID')}
                          isClearable
                          placeholder="Select..."
                        />
                        <label>Make</label>
                      </div>
                    </div>
                    <div className="col-3 col-md-6 col-lg-3 mt-1">
                      <div className=" dropdown__box">
                        <Select
                          name='ModelID'
                          value={boatModelDrp?.filter((obj) => obj.value === value?.ModelID)}
                          styles={customStylesWithOutColor}
                          options={boatModelDrp}
                          onChange={(e) => ChangeDropDown(e, 'ModelID')}
                          isClearable
                          placeholder="Select..."
                        />
                        <label>Model Id</label>
                      </div>
                    </div>
                    <div className="col-9  col-md-12 col-lg-6 mt-1">
                      <div className=" dropdown__box">
                        <textarea name='Comments' id="Comments" value={value?.Comments} onChange={HandleChanges} cols="30" rows='1' className="form-control" >
                        </textarea>
                        <label htmlFor="">Comments</label>
                      </div>
                    </div>
                    <div className="col-3  col-md-6 col-lg-3  mt-1 pt-1" >
                      <div className="text-field">
                        <input type="text" name='HIN' value={value?.HIN} onChange={HandleChanges} className='' required />
                        <label htmlFor="">HIN</label>
                      </div>
                    </div>
                    <div className="col-5 col-md-6 col-lg-3 mt-3 date__box">
                      <DatePicker
                        id='RegistrationExpiryDtTm'
                        name='RegistrationExpiryDtTm'
                        ref={startRef1}
                        onKeyDown={onKeyDown}
                        onChange={(date) => { setRegistrationExpDate(date); setValue({ ...value, ['RegistrationExpiryDtTm']: date ? getShowingWithOutTime(date) : null }) }}
                        className=''
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
                      <label htmlFor="">Reg. Expiry</label>
                    </div>
                    <div className="col-4 col-md-6 col-lg-3 mt-1">
                      <div className=" dropdown__box">
                        <Select
                          name='BottomColorID'
                          value={color?.filter((obj) => obj.value === value?.BottomColorID)}
                          options={color}
                          styles={customStylesWithOutColor}
                          onChange={(e) => ChangeDropDown(e, 'BottomColorID')}
                          isClearable
                          placeholder="Select..."
                          menuPlacement='top'
                        />
                        <label>Bottom Color</label>
                      </div>
                    </div>
                    <div className="col-3 col-md-6 col-lg-3 mt-1">
                      <div className=" dropdown__box">
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
                        <label>Top Color</label>
                      </div>
                    </div>
                    <div className="col-5 col-md-6 col-lg-3 mt-1">
                      <div className=" dropdown__box">
                        <Select
                          name='PropulusionID'
                          value={propulusionDrp?.filter((obj) => obj.value === value?.PropulusionID)}
                          styles={customStylesWithOutColor}
                          options={propulusionDrp}
                          onChange={(e) => ChangeDropDown(e, 'PropulusionID')}
                          isClearable
                          placeholder="Select..."
                          menuPlacement='top'
                        />
                        <label>Propulsion</label>
                      </div>
                    </div>
                  </div>
                  <div className="col-12  col-md-12 col-lg-12 text-right mt-md-1 " style={{ marginTop: '-20px' }}>
                    <button type="button" className="btn btn-sm btn-success" >Search</button>
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
                    <div style={{ marginLeft: 'auto' }}>
                      {
                        propertyID || masterPropertyID ?
                          <button to="" className="btn btn-sm bg-green text-white px-2 py-0" onClick={setStatusFalse} data-toggle="modal" data-target="#DrugModal">
                            <i className="fa fa-plus"></i>
                          </button>
                          :
                          <>
                          </>
                      }
                    </div>
                  </div>
                  <div className="row ">
                    <div className="col-12">
                      {
                        Drugloder ?
                          <DataTable
                            dense
                            columns={columns}
                            data={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? drugData : '' : drugData}
                            pagination
                            paginationPerPage={'5'}
                            paginationRowsPerPageOptions={[5, 10, 15, 20]}
                            highlightOnHover
                            noDataComponent={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                          />
                          :
                          <Loader />
                      }
                    </div>
                  </div>
                </div>
                :
                <>
                </>
            }
          </div>
          <div className=" col-4 col-md-4 col-lg-2 pt-1">
            <div className="img-box" >
              <Carousel autoPlay={true} className="carousel-style" showArrows={true} showThumbs={false} showStatus={false} >
                {
                  multiImage.length > 0 ?
                    multiImage?.map((item, index) => (
                      <div key={index}>
                        <img src={item.Photo} style={{ height: '190px' }} />
                        <div className='box' style={{ background: 'red' }}>
                          <a type='button' data-toggle="modal" data-target="#DeleteModal" className="legend-img " onClick={(e) => { setImageId(item.PhotoID); }} >
                            <i className='fa fa-close' ></i>
                          </a>
                        </div>
                      </div>
                    ))
                    :
                    <div key='test'>
                      <img src={defualtImage} style={{ height: '190px' }} />
                    </div>
                }
              </Carousel>
            </div>
            <div className="row">
              {/* {
                sessionStorage.getItem('PropertyID') || sessionStorage.getItem('MasterPropertyID') ?
                  <div className="col-md-12 text-center " >
                    <label className='pers-img mt-1'> <i className='fa fa-upload'></i>
                      <input type="file" size="60" onChange={get_Image_File} />
                    </label>
                  </div> : <></>
              } */}
              {
                propertyID || masterPropertyID ?
                  <>
                    <div className="col-md-12 text-center " >
                      <label className='pers-img mt-1'> <i className='fa fa-upload'></i>
                        <input type="file" size="60" onChange={get_Image_File} />
                      </label>
                    </div>
                  </>
                  : <></>
              }
            </div>
          </div>
          <div className="col-12 col-md-12 col-lg-12 pt-2 p-0" >
            <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center ">
              <p className="p-0 m-0">Miscellaneous Information</p>
            </div>
          </div>
          <div className="col-12 col-md-12 col-lg-12  p-0" >
            <div className="row">
              <div className="col-3  col-md-3 col-lg-2  mt-1 pt-1" >
                <div className="text-field">
                  <input type="text" name='PropertyTag' id='PropertyTag' value={value?.PropertyTag} onChange={HandleChanges} className='readonlyColor' readOnly required />
                  <label htmlFor="">Property Tag</label>
                </div>
              </div>
              <div className="col-3  col-md-3 col-lg-2  mt-1 pt-1" >
                <div className="text-field">
                  <input type="text" name='NICB' id='NICB' value={value?.NICB} onChange={HandleChanges} className='readonlyColor' readOnly required />
                  <label htmlFor="">NICB Id</label>
                </div>
              </div>
              <div className="col-6 col-md-6 col-lg-3 mt-3 date__box">
                <DatePicker
                  id='DestroyDtTm'
                  name='DestroyDtTm'
                  ref={startRef3}
                  onKeyDown={onKeyDown}
                  className='readonlyColor'
                  onChange={(date) => { setdestoryDate(date); setValue({ ...value, ['DestroyDtTm']: date ? getShowingMonthDateYear(date) : null }) }}
                  dateFormat="MM/dd/yyyy HH:mm"
                  timeInputLabel
                  isClearable={value?.DestroyDtTm ? true : false}
                  selected={destoryDate}
                  placeholderText={value?.DestroyDtTm ? value.DestroyDtTm : 'Select...'}
                  showTimeSelect
                  timeIntervals={1}
                  timeCaption="Time"
                  readOnly
                  required
                  autoComplete="nope"
                  showYearDropdown
                  showMonthDropdown
                  dropdownMode="select"
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
              <div className="col-2 col-md-3 col-lg-2 mt-2">
                <div class="form-check ">
                  <input class="form-check-input" name='IsEvidence' value={value?.IsEvidence} onChange={HandleChanges} checked={value?.IsEvidence} type="checkbox" id="flexCheckDefault" />
                  <label class="form-check-label" for="flexCheckDefault">
                    Evidense
                  </label>
                </div>
              </div>
              <div className="col-5 col-md-4 col-lg-4  mt-2">
                <div class="form-check ">
                  <input class="form-check-input" name='IsSendToPropertyRoom' value={value?.IsSendToPropertyRoom} onChange={HandleChanges} checked={value?.IsSendToPropertyRoom} type="checkbox" id="flexCheckDefault" />
                  <label class="form-check-label" for="flexCheckDefault1">
                    Send To Property Room
                  </label>
                </div>
              </div>
              <div className="col-5 col-md-4 col-lg-3 mt-2">
                <div class="form-check ">
                  <input class="form-check-input" name='IsPropertyRecovered' value={value?.IsPropertyRecovered} onChange={HandleChanges} checked={value?.IsPropertyRecovered} type="checkbox" id="flexCheckDefault" />
                  <label class="form-check-label" for="flexCheckDefault2">
                    Property Recovered
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12  text-right  p-0">
            {
              propertyID || masterPropertyID ?
                <>
                  <button type="button" class="btn btn-sm btn-success mr-1" onClick={(e) => { check_Validation_Error(); }}>Update</button>
                </>
                :
                <>
                  <button type="button" class="btn btn-sm btn-success mr-1" onClick={(e) => { check_Validation_Error(); }}>Save</button>
                </>
            }
            <button type="button" className="btn btn-sm btn-success mx-1" onClick={propertyClose} data-dismiss="modal">Close</button>
          </div>
        </div >
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
                                  <div className=" dropdown__box">
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
                                    {drugErrors.SuspectedDrugTypeIDError !== 'true' ? (
                                      <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{drugErrors.SuspectedDrugTypeIDError}</span>
                                    ) : null}
                                  </div>
                                </div>
                                <div class="col-12 col-md-6  col-lg-6 mt-1">
                                  <div className=" dropdown__box">
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
                                  <div className="text-field">
                                    <input type="text" maxLength={10} name='EstimatedDrugQty' id='EstimatedDrugQty' value={value?.EstimatedDrugQty} onChange={HandleChanges} className='' required />
                                    <label htmlFor="" >Estimated Drug Qty</label>
                                  </div>
                                </div>
                                <div className="col-12 col-md-6 col-lg-3 mt-3">
                                  <div class="text-field">
                                    <input type="text" name='FractionDrugQty' id='FractionDrugQty' value={value?.FractionDrugQty} onChange={HandleChanges} className='' required />
                                    <label>Fraction Drug Qty</label>
                                  </div>
                                </div>
                                <div class="col-12 col-md-6  col-lg-6 " style={{ marginTop: '13px' }}>
                                  <div className=" dropdown__box">
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
                                      <div className=" dropdown__box">
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
                                      <div class="text-field">
                                        <input type="text" name='MarijuanaNumber' id='MarijuanaNumber' maxLength={1} value={value?.MarijuanaNumber} onChange={HandleChanges} className='' required />
                                        <label>Number Marijuana Fields and Gardens</label>
                                      </div>
                                    </div>
                                    <div className="col-12 col-md-6 col-lg-6 mt-3">
                                      <div class="text-field">
                                        <input type="text" name='ClandistineLabsNumber' maxLength={1} id='ClandistineLabsNumber' className='' value={value?.ClandistineLabsNumber} onChange={HandleChanges} required />
                                        <label>Number of Clandestine Labs Seized</label>
                                      </div>
                                    </div>
                                    <div class="col-12 col-md-6  col-lg-6 " style={{ marginTop: '13px' }}>
                                      <div className=" dropdown__box">
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
                      <button type="button" class="btn btn-sm btn-success mr-1" onClick={() => { check_Drug_Validation_Error() }}> {propertyDrugID ? 'Update' : 'Save'}</button>
                      <button type="button" data-dismiss="modal" class="btn btn-sm btn-success mr-1" data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} onClick={onClose}>Close</button>
                    </div>
                  </div>
                </div>
              </div>
            </>
            :
            <></>
        }
        <DeletePopUpModal func={Delete_Prpperty_Drug} />
        <ChangesModal func={check_Validation_Error} />
        <IdentifyFieldColor />
      </>
      :
      <Loader />
  )
}

export default Home

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