import React, { useContext, useEffect, useState } from 'react'
import Select from "react-select";
import DatePicker from "react-datepicker";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Decrypt_Id_Name, EncryptedList, Encrypted_Id_Name, getShowingDateText, getShowingMonthDateYear } from '../../../../Common/Utility';
import { AddDeleteUpadate, AddDeleteUpadate_FormData, fetchPostData } from '../../../../hooks/Api';
import { Comman_changeArrayFormat, changeArray, fourColArray, sixColArray, threeColArray } from '../../../../Common/ChangeArrayFormat';
import { getShowingWithOutTime } from '../../../../Common/Utility';
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { Email_Field_Contact, PhoneFieldNotReq, RequiredField } from '../../../Agency/AgencyValidation/validators';
import { RequiredFieldIncident, Space_Allow_with_Trim } from '../../../Utility/Personnel/Validation';
import SelectBox from '../../../../Common/SelectBox';
import { components } from "react-select";
import makeAnimated from "react-select/animated";
import Location from '../../../../Location/Location';
import { NameListDropDownArray } from '../../../../Utility/ListDropDownArray/ListDropArray';
import FindListDropDown from '../../../../Common/FindListDropDown';
import NameSearchModal from '../../../NameSearch/NameSearchModal';
import { Comparision, HeightComparision, SSN_Field } from '../../../PersonnelCom/Validation/PersonnelValidation';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import { Carousel } from 'react-responsive-carousel';
import defualtImage from '../../../../../img/uploadImage.png';
import VerifyLocation from './VerifyLocation';
import ChangesModal from '../../../../Common/ChangesModal';
import IdentifyFieldColor from '../../../../Common/IdentifyFieldColor';

const Option = props => {
  return (
    <div>
      <components.Option {...props}>
        <input
          type="checkbox"
          checked={props.isSelected}
          onChange={() => null}
        />
        <p className='ml-2 d-inline'>{props.label}</p>
      </components.Option>
    </div>
  );
};

const MultiValue = props => (
  <components.MultiValue {...props}>
    <span>{props.data.label}</span>
  </components.MultiValue>
);

const animatedComponents = makeAnimated()

const Home = ({ setStatus, setShowVictim, setShowOffender, setIsBusinessName }) => {

  const useQuery = () => new URLSearchParams(useLocation().search);
  let openPage = useQuery().get('page');
  const navigate = useNavigate();

  const { get_Incident_Count, get_Name_Count, updateCount, setArresteeDrpData, setUpdateCount, nameSearchStatus, setNameSearchStatus, status, incidentReportedDate, setChangesStatus, changesStatusCount, setNameSingleData, changesStatus, setNameShowPage, localStoreArray, setLocalStoreArray, get_LocalStorage, deleteStoreData, storeData } = useContext(AgencyContext);

  const [Editval, setEditval] = useState([]);
  //Datepicker
  const [DOBDate, setDOBDate] = useState();
  const [yearsVal, setYearsVal] = useState();
  const [juvinile, setJuvinile] = useState()
  // DropDown
  const [ethinicityDrpData, setEthinicityDrpData] = useState([])
  const [ageUnitDrpData, setAgeUnitDrpData] = useState([])
  const [nameTypeIdDrp, setNameTypeIdDrp] = useState([]);
  const [suffixIdDrp, setsuffixIdDrp] = useState([])
  const [verifyIdDrp, setverifyIdDrp] = useState([])
  const [sexIdDrp, setSexIdDrp] = useState([]);
  const [raceIdDrp, setRaceIdDrp] = useState([]);
  const [phoneTypeIdDrp, setPhoneTypeIdDrp] = useState([]);
  const [reasonIdDrp, setReasonIdDrp] = useState([]);
  const [certifiedByIdDrp, setCertifiedIdDrp] = useState([]);
  const [nameTypeCode, setNameTypeCode] = useState()
  const [businessTypeDrp, setBusinessTypeDrp] = useState([])
  const [phoneTypeCode, setPhoneTypeCode] = useState('')
  const [nameSearchValue, setNameSearchValue] = useState([])
  const [isAdult, setIsAdult] = useState(false);
  const [OwnerNameData, setOwnerNameData] = useState([]);

  // Image 
  const [nameMultiImg, setNameMultiImg] = useState([])
  const [imageid, setImageId] = useState('');

  // Verify Location 
  const [modalStatus, setModalStatus] = useState(false);
  const [addVerifySingleData, setVerifySingleData] = useState([]);
  const [locationStatus, setlocationStatus] = useState(false);

  const [AgencyName, setAgencyName] = useState('');
  const [MainIncidentID, setMainIncidentID] = useState('');
  const [LoginAgencyID, setLoginAgencyID] = useState('');
  const [LoginPinID, setLoginPinID,] = useState('');
  const [masterNameID, setMasterNameID] = useState();
  const [nameID, seNameID] = useState();

  const [Selected, setSelected] = useState({
    optionSelected: null
  })

  const [value, setValue] = useState({
    'NameIDNumber': 'Auto Generated',
    // DropDown
    'NameTypeID': '', 'BusinessTypeID': '', 'SuffixID': '', 'VerifyID': '', 'SexID': '',
    'RaceID': '', 'PhoneTypeID': '', 'NameReasonCodeID': '', 'CertifiedByID': '', 'EthnicityID': '', 'AgeUnitID': '',
    // checkbox
    'IsJuvenile': '', 'IsCurrentPh': true,
    'IsVerify': true, 'IsUnListedPhNo': '',
    //textbox
    'LastName': '', 'FirstName': '', 'MiddleName': '', 'SSN': '',
    'WeightFrom': '', 'WeightTo': '', 'HeightFrom': '', 'HeightTo': '',
    'Address': '', 'Contact': '',
    'OwnerNameID': '', 'OwnerPhoneNumber': '', 'OwnerFaxNumber': '',
    //Datepicker
    'DateOfBirth': '', 'CertifiedDtTm': '', 'AgeFrom': '',
    'AgeTo': '', 'Years': '',
    // extra
    'EventType': 'I',
    'ModifiedByUserFK': '',
    'MasterNameID': '',
    'NameID': '',
    'ArrestID': "",
    'WarrantID': "",
    'TicketID': "", 'checkVictem': 0, 'checkOffender': 0, 'checkArrest': 0,
    'CreatedByUserFK': '',
    'AgencyID': '',
    'IncidentID': '',
    // 'IncidentID': openPage === 'mastername' || openPage === 'ArrestSearch' ? '' : Decrypt_Id_Name(sessionStorage.getItem('IncidentId'), 'IForIncidentId'),
    //--------------------verify Location-----------------
    'NameLocationID': '',
  })

  const [errors, setErrors] = useState({
    'NameTypeIDError': '', 'LastNameError': '', 'NameReasonCodeIDError': '', 'CertifiedByIDError': '', 'ContactError': 'true', 'WeightError': 'true', 'AgeError': 'true', 'DateOfBirthError': '', 'RaceIDError': '', 'SexIDError': '', 'AddressError': 'true'
  })

  const localStore = {
    Value: "",
    UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
    Key: JSON.stringify({ AgencyID: '', PINID: '', IncidentID: '', MasterNameID: '', NameID: '', Agency_Name: '', }),
  }

  useEffect(() => {
    if (!localStoreArray.AgencyID || !localStoreArray.PINID || !localStoreArray.IncidentID) {
      get_LocalStorage(localStore);
    }
  }, []);

  useEffect(() => {
    // console.log(localStoreArray)
    if (localStoreArray) {
      if (localStoreArray?.AgencyID && localStoreArray?.PINID) {
        setLoginAgencyID(localStoreArray?.AgencyID);
        setLoginPinID(localStoreArray?.PINID);
        setMainIncidentID(localStoreArray?.IncidentID)
        if (localStoreArray?.MasterNameID || localStoreArray?.NameID) {
          // alert('local arry condition calll')
          setMasterNameID(localStoreArray?.MasterNameID);
          seNameID(localStoreArray?.NameID);
          get_Name_Count(localStoreArray?.NameID)
        } else {
          setMasterNameID(''); GetSingleData(); setNameMultiImg([]); setDOBDate(''); GetNameTypeIdDrp(localStoreArray?.AgencyID);
          seNameID('');
        }
        setAgencyName(localStoreArray?.Agency_Name);
      }
    }
  }, [localStoreArray])

  useEffect(() => {
    setValue({ ...value, 'AgencyID': localStoreArray?.AgencyID, 'IncidentID': localStoreArray?.IncidentID, 'CreatedByUserFK': localStoreArray?.PINID, 'MasterNameID': localStoreArray?.MasterNameID, 'NameID': localStoreArray?.NameID });
  }, [LoginAgencyID]);


  const check_Validation_Error = (e) => {
    if (isAdult) {
      if (Space_Allow_with_Trim(value.Address)) {
        setErrors(prevValues => { return { ...prevValues, ['AddressError']: Space_Allow_with_Trim(value.Address) } })
      }
      if (RequiredField(value.SexID)) {
        setErrors(prevValues => { return { ...prevValues, ['SexIDError']: RequiredField(value.SexID) } })
      }
      if (RequiredField(value.RaceID)) {
        setErrors(prevValues => { return { ...prevValues, ['RaceIDError']: RequiredField(value.RaceID) } })
      }
      if (RequiredField(value.DateOfBirth)) {
        setErrors(prevValues => { return { ...prevValues, ['DateOfBirthError']: RequiredField(value.DateOfBirth) } })
      }
      if (RequiredField(value.LastName)) {
        setErrors(prevValues => { return { ...prevValues, ['LastNameError']: RequiredField(value.LastName) } })
      }
      if (RequiredFieldIncident(value.NameTypeID)) {
        setErrors(prevValues => { return { ...prevValues, ['NameTypeIDError']: RequiredFieldIncident(value.NameTypeID) } })
      }
      if (RequiredFieldIncident(value.CertifiedByID)) {
        setErrors(prevValues => { return { ...prevValues, ['CertifiedByIDError']: RequiredFieldIncident(value.CertifiedByID) } })
      }
      if (RequiredFieldIncident(value.NameReasonCodeID)) {
        setErrors(prevValues => { return { ...prevValues, ['NameReasonCodeIDError']: RequiredFieldIncident(value.NameReasonCodeID) } })
      }
      if (SSN_Field(value.SSN)) {
        setErrors(prevValues => { return { ...prevValues, ['SSN']: SSN_Field(value.SSN) } })
      }
      //Weight Validation
      if (Comparision(value.WeightFrom, value.WeightTo, 'Weight') === 'true') {
        setErrors(prevValues => { return { ...prevValues, ['WeightError']: 'true' } })
      } else {
        setErrors(prevValues => { return { ...prevValues, ['WeightError']: 'error' } })
      }
      // //Age Validation
      if (Comparision(value.AgeFrom, value.AgeTo, 'Age') === 'true') {
        setErrors(prevValues => { return { ...prevValues, ['AgeError']: 'true' } })
      } else {
        setErrors(prevValues => { return { ...prevValues, ['AgeError']: 'error' } })
      }
      // Phone Validation
      if (phoneTypeCode === 'E') {
        if (Email_Field_Contact(value.Contact)) {
          setErrors(prevValues => { return { ...prevValues, ['ContactError']: Email_Field_Contact(value.Contact) } })
        }
      } else if (phoneTypeCode) {
        if (PhoneFieldNotReq(value.Contact)) {
          setErrors(prevValues => { return { ...prevValues, ['ContactError']: PhoneFieldNotReq(value.Contact) } })
        }
      }
    } else {
      if (RequiredField(value.LastName)) {
        setErrors(prevValues => { return { ...prevValues, ['LastNameError']: RequiredField(value.LastName) } })
      }
      if (RequiredFieldIncident(value.NameTypeID)) {
        setErrors(prevValues => { return { ...prevValues, ['NameTypeIDError']: RequiredFieldIncident(value.NameTypeID) } })
      }
      if (RequiredFieldIncident(value.CertifiedByID)) {
        setErrors(prevValues => { return { ...prevValues, ['CertifiedByIDError']: RequiredFieldIncident(value.CertifiedByID) } })
      }
      if (RequiredFieldIncident(value.NameReasonCodeID)) {
        setErrors(prevValues => { return { ...prevValues, ['NameReasonCodeIDError']: RequiredFieldIncident(value.NameReasonCodeID) } })
      }
      if (SSN_Field(value.SSN)) {
        setErrors(prevValues => { return { ...prevValues, ['SSN']: SSN_Field(value.SSN) } })
      }
      // Weight Validation
      if (Comparision(value.WeightFrom, value.WeightTo, 'Weight') === 'true') {
        setErrors(prevValues => { return { ...prevValues, ['WeightError']: 'true' } })
      } else {
        setErrors(prevValues => { return { ...prevValues, ['WeightError']: 'error' } })
      }
      //Age Validation
      if (Comparision(value.AgeFrom, value.AgeTo, 'Age') === 'true') {
        setErrors(prevValues => { return { ...prevValues, ['AgeError']: 'true' } })
      } else {
        setErrors(prevValues => { return { ...prevValues, ['AgeError']: 'error' } })
      }
      // Phone Validation
      if (phoneTypeCode === 'E') {
        if (Email_Field_Contact(value.Contact)) {
          setErrors(prevValues => { return { ...prevValues, ['ContactError']: Email_Field_Contact(value.Contact) } })
        }
      } else if (phoneTypeCode) {
        if (PhoneFieldNotReq(value.Contact)) {
          setErrors(prevValues => { return { ...prevValues, ['ContactError']: PhoneFieldNotReq(value.Contact) } })
        }
      }
    }
  };

  // Check All Field Format is True Then Submit 
  const { LastNameError, NameTypeIDError, CertifiedByIDError, NameReasonCodeIDError, ContactError, SSN, WeightError, AgeError, DateOfBirthError, RaceIDError, SexIDError, AddressError } = errors

  useEffect(() => {
    if (nameTypeCode === 'B') {
      if (LastNameError === 'true' && NameTypeIDError === 'true' && CertifiedByIDError === 'true' && NameReasonCodeIDError === 'true' && ContactError === 'true' && SSN === 'true' && WeightError === 'true' && AgeError === 'true') {
        if (openPage === 'mastername') {
          if (masterNameID) Update_Master_Name();
          else InsertMasterName();
        } else {
          if (nameID) Update_Name();
          else InsertName();
        }
      }
    } else {
      if (isAdult) {
        if (LastNameError === 'true' && NameTypeIDError === 'true' && CertifiedByIDError === 'true' && NameReasonCodeIDError === 'true' && ContactError === 'true' && SSN === 'true' && WeightError === 'true' && AgeError === 'true' && DateOfBirthError === 'true' && RaceIDError === 'true' && SexIDError === 'true' && AddressError === 'true') {
          if (openPage === 'mastername') {
            if (masterNameID) Update_Master_Name();
            else InsertMasterName();
          } else {
            if (nameID) { Update_Name(); }
            else { InsertName(); }
          }
        }
      } else {
        if (LastNameError === 'true' && NameTypeIDError === 'true' && CertifiedByIDError === 'true' && NameReasonCodeIDError === 'true' && ContactError === 'true' && SSN === 'true' && WeightError === 'true' && AgeError === 'true') {
          if (openPage === 'mastername') {
            if (masterNameID) Update_Master_Name();
            else InsertMasterName();
          } else {
            if (nameID) { Update_Name(); }
            else { console.log("dsfsdf"); InsertName(); }
          }
        }
      }
    }
  }, [LastNameError, NameTypeIDError, CertifiedByIDError, NameReasonCodeIDError, ContactError, SSN, WeightError, AgeError, DateOfBirthError, RaceIDError, SexIDError, AddressError])

  useEffect(() => {
    if (LoginAgencyID) {
      if (nameTypeIdDrp.length === 0) { GetNameTypeIdDrp(LoginAgencyID); }
      if (nameTypeIdDrp.length === 0) { get_Arrestee_Drp_Data(MainIncidentID); }
      if (suffixIdDrp?.length === 0) { GetSuffixIDDrp(LoginAgencyID); }
      if (verifyIdDrp?.length === 0) { GetVerifyIDDrp(LoginAgencyID); }
      if (sexIdDrp?.length === 0) { GetSexIDDrp(LoginAgencyID); }
      if (raceIdDrp?.length === 0) { GetRaceIdDrp(LoginAgencyID); }
      if (certifiedByIdDrp?.length === 0) { getcertifiedByIdDrp(LoginAgencyID); }
      if (phoneTypeIdDrp?.length === 0) { GetPhoneTypeIDDrp(LoginAgencyID, '1', '1'); }
      if (businessTypeDrp?.length === 0) { GetBusinessTypeDrp(LoginAgencyID); }
      if (ethinicityDrpData?.length === 0) { getEthinicityDrp(LoginAgencyID); }
      if (ageUnitDrpData?.length === 0) { getAgeUnitDrp(LoginAgencyID); }
    }
  }, [LoginAgencyID])

  const get_Arrestee_Drp_Data = (IncidentID) => {
    const val = {
      'MasterNameID': 0,
      'IncidentID': IncidentID,
    }

    fetchPostData('Arrest/GetDataDropDown_Arrestee', val).then((data) => {
      if (data) {
        setOwnerNameData(sixColArray(data, 'NameID', 'Arrestee_Name', 'LastName', 'DateOfBirth', 'Gendre_Description', 'Race_Description', 'NameID', 'MasterNameID'));
      }
      else {
        setArresteeDrpData([])
      }
    })
  };

  useEffect(() => {
    if (LoginAgencyID && value.NameTypeID) {
      GetReasonIdDrp(LoginAgencyID, value.NameTypeID);
    }
  }, [value.NameTypeID])

  useEffect(() => {
    if (openPage && masterNameID) {
      GetMasterSingleData()
    } else {
      if (nameID) {
        GetSingleData();
      } else {

      }
    }
  }, [nameID, masterNameID]);

  const GetSingleData = () => {
    const val = { 'NameID': nameID, 'MasterNameID': masterNameID }
    fetchPostData('MasterName/GetSingleData_MasterName', val).then((res) => {
      if (res) {
        // console.log("InsideIncident", res)
        setEditval(res); setNameSingleData(res)
      } else { setEditval([]); setNameSingleData([]) }
    })
  }

  const GetMasterSingleData = () => {
    const val = { 'MasterNameID': masterNameID, 'NameID': 0, }
    fetchPostData('MasterName/GetSingleData_MasterName', val)
      .then((res) => {
        if (res) {
          setEditval(res);
        } else { setEditval() }
      })
  }

  useEffect(() => {
    if (nameID || masterNameID) {
      if (Editval.length > 0) {
        // console.log(Editval[0])
        get_Arrestee_Drp_Data(MainIncidentID)
        get_Name_MultiImage(nameID, masterNameID)
        //comment by dev on 18/01/2024
        // setShowOffender(false); setShowVictim(false);
        setValue({
          ...value,
          'MasterNameID': Editval[0]?.MasterNameID,
          'NameID': Editval[0]?.NameID,
          'NameIDNumber': Editval[0]?.NameIDNumber ? Editval[0]?.NameIDNumber : 'Auto Generated',
          'checkVictem': Editval[0]?.NewVictimID ? Editval[0]?.NewVictimID[0]?.NewVictimID : "",
          'checkOffender': Editval[0]?.NewOffenderID ? Editval[0]?.NewOffenderID[0]?.NewOffenderID : "",
          'checkArrest': Editval[0]?.ArrestID ? Editval[0]?.ArrestID[0]?.ArrestID : "",
          // DropDown
          'NameTypeID': Editval[0]?.NameTypeID, 'BusinessTypeID': Editval[0]?.BusinessTypeID, 'SuffixID': Editval[0]?.SuffixID, 'VerifyID': Editval[0]?.VerifyID,
          'SexID': Editval[0]?.SexID, 'RaceID': Editval[0]?.RaceID, 'PhoneTypeID': Editval[0]?.PhoneTypeID, 'EthnicityID': Editval[0]?.EthnicityID, 'AgeUnitID': Editval[0]?.AgeUnitID,
          'NameReasonCodeID': Editval[0]?.ReasonCode ? changeArray(Editval[0]?.ReasonCode, 'NameReasonCodeID') : '', 'CertifiedByID': Editval[0]?.CertifiedByID,
          // checkbox
          'IsJuvenile': Editval[0]?.IsJuvenile,
          'IsVerify': Editval[0]?.IsVerify,
          'IsUnListedPhNo': Editval[0]?.IsUnListedPhNo,
          //textbox
          'OwnerFaxNumber': Editval[0]?.OwnerFaxNumber, 'OwnerPhoneNumber': Editval[0]?.OwnerPhoneNumber, 'OwnerNameID': Editval[0]?.OwnerNameID,
          'LastName': Editval[0]?.LastName, 'FirstName': Editval[0]?.FirstName, 'MiddleName': Editval[0]?.MiddleName,
          'SSN': Editval[0]?.SSN, 'WeightFrom': Editval[0]?.WeightFrom, 'WeightTo': Editval[0]?.WeightTo,
          'HeightFrom': Editval[0]?.HeightFrom, 'HeightTo': Editval[0]?.HeightTo, 'Address': Editval[0]?.Address,
          'Contact': Editval[0]?.Contact, 'AgeFrom': Editval[0]?.AgeFrom ? Editval[0]?.AgeFrom : '', 'AgeTo': Editval[0]?.AgeTo ? Editval[0]?.AgeTo : '',
          //Datepicker
          'DateOfBirth': Editval[0]?.DateOfBirth ? getShowingWithOutTime(Editval[0]?.DateOfBirth) : '',
          'CertifiedDtTm': Editval[0]?.CertifiedDtTm ? getShowingDateText(Editval[0]?.CertifiedDtTm) : null,
          'Years': Editval[0]?.Years,
          'NameLocationID': Editval[0]?.NameLocationID,
          'ModifiedByUserFK': LoginPinID,
        })
        // ---------------------Name_Non_Verify_Add--------------
        // get_Add_Single_Data(Editval[0]?.NameLocationID);
        GetReasonIdDrp(LoginAgencyID, Editval[0]?.NameTypeID);
        setPhoneTypeCode(Get_PhoneType_Code(Editval, phoneTypeIdDrp));
        setDOBDate(Editval[0]?.DateOfBirth ? new Date(Editval[0]?.DateOfBirth) : '');
        setIsAdult(Editval[0]?.ReasonCode?.some(function (item) { return item.ReasonCode_Description === "Adult Arrest" }))

        //--------------get_Non_Verify_Add-------------------
        if (!Editval[0]?.IsVerify && Editval[0]?.NameLocationID) {
          get_Add_Single_Data(Editval[0]?.NameLocationID);
        } else {
          // get_Add_Single_Data(0);
        }
        // NameTypeCode
        setNameTypeCode(Editval[0]?.NameTypeCode);
        // Dev0001 -----------  for tabs 
        setIsBusinessName(Editval[0]?.NameTypeCode === 'B' ? true : false)

        if (Editval[0]?.Years) {
          var Years = Editval[0]?.Years.split(' ');
          // console.log(Years)
          setYearsVal(Years[1])
        }

        setSelected({
          optionSelected: Editval[0]?.ReasonCode ? fourColArray(Editval[0]?.ReasonCode, 'NameReasonCodeID', 'ReasonCode_Description', 'IsVictimName', 'IsOffenderName'
          ) : '',
        });

        setShowOffender(Editval[0]?.ReasonCode?.some(function (item) { return item.ReasonCode_Description === "Offender" }))
        setShowVictim(Editval[0]?.ReasonCode?.some(function (item) { return item.ReasonCode_Description === "Victim" }));

        // old code by praveen sir ----------don't remove it
        // Editval[0]?.ReasonCode?.map(val => {
        //   if (val.IsVictimName) { setShowVictim(true) }
        //   if (val.IsOffenderName) { setShowOffender(true) }
        // })
      }
    } else {
      if (!changesStatus) {
        setShowOffender(false); setShowVictim(false);
        setValue({
          ...value,
          'MasterNameID': '',
          'NameID': '',
          'NameIDNumber': 'Auto Generated',
          // DropDown
          'BusinessTypeID': '', 'SuffixID': '', 'VerifyID': '', 'SexID': '', 'EthnicityID': '',
          'RaceID': '', 'PhoneTypeID': '', 'NameReasonCodeID': '', 'CertifiedByID': '', 'AgeUnitID': '',
          // checkbox
          // 'IsJuvenile': '', 
          'IsVerify': true, 'IsUnListedPhNo': '',
          //textbox
          'LastName': '', 'FirstName': '', 'MiddleName': '', 'SSN': '',
          'WeightFrom': '', 'WeightTo': '', 'HeightFrom': '',
          'HeightTo': '', 'Address': '', 'Contact': '',
          //Datepicker
          'DateOfBirth': '', 'CertifiedDtTm': null,
          'AgeFrom': '', 'AgeTo': '', 'Years': '', 'checkVictem': 0, 'checkOffender': 0, 'checkArrest': 0,
        }); setPhoneTypeCode('')
      }
      const id = nameTypeIdDrp?.filter((val) => { if (val.id === "I") return val })
      if (id.length > 0) {
        setValue(prevValues => { return { ...prevValues, ['NameTypeID']: id[0].value } })
        setNameTypeCode(id[0].NameTypeCode);
        // Dev0001 --------------------------------------- for tabs in BusinessName Type
        setIsBusinessName(false);
      }
      setSelected({ optionSelected: [], });
    }
  }, [Editval])

  const getNameSearch = async (NameTypeID, LastName, FirstName, MiddleName, DateOfBirth, SSN, type) => {
    if (LastName || FirstName || MiddleName || DateOfBirth || SSN) {
      fetchPostData("MasterName/Search_Name", {
        "NameTypeID": NameTypeID, "LastName": LastName, "FirstName": FirstName ? FirstName : null, "MiddleName": MiddleName ? MiddleName : null, "DateOfBirth": DateOfBirth ? DateOfBirth : null, "SSN": SSN ? SSN : null
      }).then((data) => {
        if (data.length > 0) {
          // console.log(data)
          setNameSearchValue(data); setNameSearchStatus(true)
        } else {
          setNameSearchValue([]);
          if (type) toastifyError('No Name Available');
          setNameSearchStatus(false)
        }
      })
    } else {
      setNameSearchStatus(false);
      toastifyError('Empty Feild');
    }
  }

  const getAgeUnitDrp = (LoginAgencyID) => {
    const val = {
      AgencyID: LoginAgencyID
    }
    fetchPostData('/AgeUnit/GetDataDropDown_AgeUnit', val).then((data) => {
      if (data) {
        // if (value.DateOfBirth) {
        //   const id = data?.filter((val) => { if (val.AgeUnitCode === "Y") return val })
        //   if (id.length > 0) {
        //     setValue(prevValues => { return { ...prevValues, ['AgeUnitID']: id[0].AgeUnitID } })
        //   }
        // }
        setAgeUnitDrpData(threeColArray(data, 'AgeUnitID', 'Description', 'AgeUnitCode'));
      }
      else {
        setAgeUnitDrpData([])
      }
    })
  };

  const getEthinicityDrp = (LoginAgencyID) => {
    const val = {
      AgencyID: LoginAgencyID
    }
    fetchPostData('/DropDown/GetDataDropDown_Ethnicity', val).then((data) => {
      if (data) {
        setEthinicityDrpData(Comman_changeArrayFormat(data, 'EthnicityID', 'Description'));
      }
      else {
        setEthinicityDrpData([])
      }
    })
  };

  const getcertifiedByIdDrp = (LoginAgencyID) => {
    const val = {
      AgencyID: LoginAgencyID
    }
    fetchPostData('DropDown/GetData_HeadOfAgency', val).then((data) => {
      if (data) {
        setCertifiedIdDrp(Comman_changeArrayFormat(data, 'PINID', 'HeadOfAgency'));
      }
      else {
        setCertifiedIdDrp([])
      }
    })
  };

  const GetReasonIdDrp = (LoginAgencyID, id) => {
    const val = {
      AgencyID: LoginAgencyID,
      CategoryID: id,
    }
    fetchPostData('NameReasonCode/GetDataDropDown_NameReasonCode', val).then((data) => {
      if (data) {
        setReasonIdDrp(Comman_changeArrayFormat(data, 'NameReasonCodeID', 'Description'))
        if (openPage === 'Victim') {
          const id = data?.filter((val) => { if (val?.ReasonCode === "VIC") return val });

          if (id?.length > 0) {
            setSelected({
              optionSelected: id ? fourColArray(id, 'NameReasonCodeID', 'Description', 'IsVictimName', 'IsOffenderName') : '',
            });

            let finalValueList = id?.map((item) => item?.NameReasonCodeID);

            setValue({ ...value, ['NameReasonCodeID']: finalValueList })
          }
        } else if (openPage === 'Offender') {
          const id = data?.filter((val) => { if (val?.ReasonCode === "OFF") return val });

          if (id?.length > 0) {
            setSelected({
              optionSelected: id ? fourColArray(id, 'NameReasonCodeID', 'Description', 'IsVictimName', 'IsOffenderName') : '',
            });

            let finalValueList = id?.map((item) => item?.NameReasonCodeID);

            setValue({ ...value, ['NameReasonCodeID']: finalValueList })
          }
        }
      } else {
        setReasonIdDrp([]);
      }
    })
  }

  const GetPhoneTypeIDDrp = (LoginAgencyID, IsEMail, IsPhone) => {
    const val = {
      AgencyID: LoginAgencyID,
      IsEMail: IsEMail,
      IsPhone: IsPhone,
    }
    fetchPostData('ContactPhoneType/GetDataDropDown_ContactPhoneType', val).then((data) => {
      if (data) {
        setPhoneTypeIdDrp(threeColArray(data, 'ContactPhoneTypeID', 'Description', 'ContactPhoneTypeCode'))
      } else {
        setPhoneTypeIdDrp([]);
      }
    })
  }

  const GetRaceIdDrp = (LoginAgencyID) => {
    const val = {
      AgencyID: LoginAgencyID,
    }
    fetchPostData('DropDown/GetData_RaceType', val).then((data) => {
      if (data) {
        setRaceIdDrp(Comman_changeArrayFormat(data, 'RaceTypeID', 'Description'))
      } else {
        setRaceIdDrp([]);
      }
    })
  }

  const GetSexIDDrp = (LoginAgencyID) => {
    const val = {
      AgencyID: LoginAgencyID,
    }
    fetchPostData('DropDown/GetData_SexType', val).then((data) => {
      if (data) {
        setSexIdDrp(Comman_changeArrayFormat(data, 'SexCodeID', 'Description'))
      } else {
        setSexIdDrp([]);
      }
    })
  }

  const GetVerifyIDDrp = (LoginAgencyID) => {
    const val = {
      AgencyID: LoginAgencyID,
    }
    fetchPostData('Verify/GetDataDropDown_Verify', val).then((data) => {
      if (data) {
        setverifyIdDrp(Comman_changeArrayFormat(data, 'VerifyID', 'Description'))
      } else {
        setverifyIdDrp([]);
      }
    })
  };

  const GetSuffixIDDrp = (LoginAgencyID) => {
    const val = {
      AgencyID: LoginAgencyID,
    }
    fetchPostData('Suffix/GetDataDropDown_Suffix', val).then((data) => {
      if (data) {
        setsuffixIdDrp(Comman_changeArrayFormat(data, 'SuffixID', 'Description'))
      } else {
        setsuffixIdDrp([]);
      }
    })
  };

  const GetBusinessTypeDrp = (LoginAgencyID) => {
    const val = {
      AgencyID: LoginAgencyID,
    }
    fetchPostData('NameBusinessType/GetDataDropDown_NameBusinessType', val).then((data) => {
      if (data) {
        setBusinessTypeDrp(Comman_changeArrayFormat(data, 'NameBusinessTypeID', 'Description'))
      } else {
        setBusinessTypeDrp([]);
      }
    })
  };

  const GetNameTypeIdDrp = (LoginAgencyID) => {
    const val = {
      AgencyID: LoginAgencyID,
    }
    fetchPostData('NameType/GetDataDropDown_NameType', val).then((data) => {
      if (data) {
        const id = data?.filter((val) => { if (val.NameTypeCode === "I") return val })
        if (id.length > 0 && Editval.length === 0) {
          setValue(prevValues => { return { ...prevValues, ['NameTypeID']: id[0].NameTypeID } })
          setNameTypeCode(id[0].NameTypeCode); setIsBusinessName(false);
        }
        setNameTypeIdDrp(threeColArray(data, 'NameTypeID', 'Description', 'NameTypeCode'))
      } else {
        setNameTypeIdDrp([]);

      }
    })
  };

  const ChangeNameType = (e, name) => {
    if (e) {
      if (name === 'NameTypeID') {
        setValue({
          ...value,
          [name]: e.value,
          'NameIDNumber': '', 'BusinessTypeID': '', 'SuffixID': '', 'VerifyID': '', 'SexID': '', 'RaceID': '', 'PhoneTypeID': '', 'NameReasonCodeID': [], 'CertifiedByID': '', 'AgeUnitID': '',
          'IsVerify': true, 'IsUnListedPhNo': '', 'LastName': '', 'FirstName': '', 'MiddleName': '', 'SSN': '', 'WeightFrom': '', 'WeightTo': '', 'HeightFrom': '', 'HeightTo': '', 'Address': '', 'Contact': '', 'DateOfBirth': '', 'CertifiedDtTm': null, 'AgeFrom': '', 'AgeTo': '', 'Years': '',
        }); setlocationStatus(true);
        setSelected({ optionSelected: [] }); setPhoneTypeCode(''); setNameTypeCode(e.id); setChangesStatus(true);
        console.log(e.id)
        if (e.id === 'B') { setIsBusinessName(true); } else { setIsBusinessName(false); }

      } else {
        setChangesStatus(true)
        setValue({
          ...value,
          [name]: e.value
        })

      }
    } else {
      setChangesStatus(true)
      setValue({
        ...value,
        [name]: null
      }); setNameTypeCode(''); setIsBusinessName(false); setPhoneTypeCode('')
    }
  }

  const ChangePhoneType = (e, name) => {
    if (e) {
      if (name === 'PhoneTypeID') {
        setPhoneTypeCode(e.id)
        setChangesStatus(true)
        setValue({
          ...value,
          [name]: e.value
        })
      }
      setChangesStatus(true)
      setValue({
        ...value,
        [name]: e.value
      })
    } else if (e === null) {
      if (name === 'PhoneTypeID') {
        setChangesStatus(true);
        setValue({ ...value, ['PhoneTypeID']: "", ['Contact']: "", });
        setErrors({ ...errors, ['ContactError']: 'true' });
        setPhoneTypeCode('')
      }
    } else {
      setChangesStatus(true)
      setValue({
        ...value,
        [name]: null
      }); setPhoneTypeCode('')
    }
  }

  const ChangeDropDown = (e, name) => {
    if (e) {
      setChangesStatus(true)
      setValue({
        ...value,
        [name]: e.value
      })
    } else {
      setChangesStatus(true)
      setValue({
        ...value,
        [name]: null
      });
    }
  };

  const HandleChange = (e) => {
    // console.log(e)
    if (e.target.name === 'IsVerify' || e.target.name === 'IsUnListedPhNo' || e.target.name === 'IsUnknown') {
      if (e.target.name === 'IsVerify') {
        // setValue({
        //   ...value,
        //   ['Address']: null,
        //   [e.target.name]: e.target.checked,
        // })
        // setChangesStatus(true)
        // if (e.target.checked) {
        //   setModalStatus(false);
        // } else {
        //   setModalStatus(true);
        // }
        if (e.target.checked && addVerifySingleData.length > 0) {
          setModalStatus(false);
          setlocationStatus(true); setVerifySingleData([]);
          setValue(pre => { return { ...pre, ['Address']: '', [e.target.name]: e.target.checked, } });
        } else {
          setValue(pre => { return { ...pre, [e.target.name]: e.target.checked, } });
          setModalStatus(true);
          setlocationStatus(false);
        }
      } else {
        setChangesStatus(true)
        setValue({ ...value, [e.target.name]: e.target.checked });
      }
    }
    else if (e.target.name === 'Contact') {
      if (phoneTypeCode === 'E') {
        setChangesStatus(true)
        setValue({ ...value, [e.target.name]: e.target.value });
      } else {
        var ele = e.target.value.replace(/\D/g, '');
        if (ele.length === 10) {
          var cleaned = ('' + ele).replace(/\D/g, '');
          var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
          if (match) {
            setChangesStatus(true)
            setValue({
              ...value,
              [e.target.name]: match[1] + '-' + match[2] + '-' + match[3]
            })
          }
        } else {
          ele = e.target.value.split('-').join('').replace(/\D/g, '');
          setChangesStatus(true)
          setValue({
            ...value,
            [e.target.name]: ele
          })
        }
      }
    }
    else if (e.target.name === 'SSN') {
      var ele = e.target.value.replace(/\D/g, '');
      if (ele.length === 9) {
        var cleaned = ('' + ele).replace(/\D/g, '');
        var match = cleaned.match(/^(\d{3})(\d{2})(\d{4})$/);
        if (match) {
          setChangesStatus(true)
          setValue({
            ...value,
            [e.target.name]: match[1] + '-' + match[2] + '-' + match[3]
          })
          getNameSearch(value?.NameTypeID, null, null, null, null, match[1] + '-' + match[2] + '-' + match[3])
        }
      } else {
        ele = e.target.value.split('-').join('').replace(/\D/g, '');
        setChangesStatus(true)
        setValue({
          ...value,
          [e.target.name]: ele
        })
      }
    }
    else if (e.target.name === 'WeightTo' || e.target.name === 'WeightFrom') {
      const checkNumber = e.target.value.replace(/[^0-9\s]/g, "");
      setChangesStatus(true)
      setValue({ ...value, [e.target.name]: checkNumber })
    } else if (e.target.name === 'HeightFrom') {
      var ele = e.target.value
      // console.log(ele.length)
      if (ele.length === 3) {
        var cleaned = ('' + ele).replace(/\D/g, '');
        var match = cleaned.match(/^(\d{1})(\d{2})$/);

        if (parseInt(match[2]) < 12) {
          setValue({
            ...value,
            [e.target.name]: match[1] + "'" + match[2] + "'"
          })
        } else {
          setValue({
            ...value,
            [e.target.name]: match[1] + "'" + "11" + "'"
          })
          setChangesStatus(true)
        }
      } else {
        ele = e.target.value.split("'").join('').replace(/\D/g, '');
        setValue({
          ...value,
          [e.target.name]: ele
        })
      }
    } else if (e.target.name === 'HeightTo') {
      var ele = e.target.value
      if (ele.length === 3) {
        var cleaned = ('' + ele).replace(/\D/g, '');
        var HeightFromVal = value?.HeightFrom.split("'").join('').replace(/\D/g, '');
        var match = cleaned.match(/^(\d{1})(\d{2})$/);
        if (parseInt(HeightFromVal) < parseInt(cleaned)) {
          if (parseInt(match[2]) < 12) {
            setValue({
              ...value,
              [e.target.name]: match[1] + "'" + match[2] + "'"
            })
          } else {
            setValue({
              ...value,
              [e.target.name]: match[1] + "'" + "11" + "'"
            })
          }
        }
      } else {
        ele = e.target.value.split("'").join('').replace(/\D/g, '');
        setValue({
          ...value,
          [e.target.name]: ele
        })
      }
    } else if (e.target.name === 'AgeTo' || e.target.name === 'AgeFrom') {
      const checkNumber = e.target.value.replace(/[^0-9\s]/g, "");
      setDOBDate(''); setValue({ ...value, ['Years']: null, ['DateOfBirth']: null })
      setChangesStatus(true)
      setValue({ ...value, [e.target.name]: checkNumber })
    }
    else setValue({ ...value, [e.target.name]: e.target.value })
  };

  const checkHandlChange = (e) => {
    if (e.target.name === 'HeightTo') {
      var ele = e.target.value
      if (ele.length === 3) {
        var cleaned = ('' + ele).replace(/\D/g, '');
        var HeightFromVal = value?.HeightFrom.split("'").join('').replace(/\D/g, '');
        var match = cleaned.match(/^(\d{1})(\d{2})$/);
        if (parseInt(HeightFromVal) < parseInt(cleaned)) {
          if (parseInt(match[2]) < 12) {
            setValue({
              ...value,
              [e.target.name]: match[1] + "'" + match[2] + "'"
            })
          } else {
            setValue({
              ...value,
              [e.target.name]: match[1] + "'" + "11" + "'"
            })
          }
        }
      } else {
        ele = e.target.value.split("'").join('').replace(/\D/g, '');
        setValue({
          ...value,
          [e.target.name]: ele
        })
      }
    }
  }

  const InsertName = () => {
    // console.log(value)
    AddDeleteUpadate('MasterName/Insert_MasterName', value).then((res) => {
      if (res.success) {
        toastifySuccess(res.Message);
        if (res.NameID && res.MasterNameID) {
          seNameID(res.NameID);
          setMasterNameID(res.MasterNameID);
          // store_NameID(res.NameID, res.MasterNameID, true);
          storeData({ 'NameID': res.NameID, 'MasterNameID': res.MasterNameID, 'NameStatus': true })
        }
        setStatus(true);
        setChangesStatus(false)
        get_Incident_Count(MainIncidentID);
        get_Name_Count(nameID)
        setUpdateCount(updateCount + 1);
        setErrors({ ...errors, ['AddressError']: 'true', ['WeightError']: 'true', ['AgeError']: 'true', ['ContactError']: 'true', ['NameTypeIDError']: '', });
      } else {
        toastifyError(res.Message); setErrors({ ...errors, ['NameTypeIDError']: '', ['ContactError']: '', });
        setChangesStatus(false)
      }
    })
  }

  const Update_Name = () => {
    AddDeleteUpadate('MasterName/Update_MasterName', value).then((res) => {
      if (res.success) {
        setChangesStatus(false)
        get_Name_Count(nameID)
        toastifySuccess(res.Message); GetSingleData()
        setErrors({ ...errors, ['ContactError']: 'true', ['NameTypeIDError']: '', });
      } else {
        toastifyError(res.Message); setErrors({ ...errors, ['NameTypeIDError']: '', });
      }
    })
  }

  const InsertMasterName = () => {
    AddDeleteUpadate('MainMasterName/Insert_MainMasterName', value).then((res) => {
      if (res) {
        if (res.MasterNameID) {
          setMasterNameID(res.MasterNameID);
          storeData({ 'MasterNameID': res.MasterNameID, 'NameStatus': true })
        }
        toastifySuccess(res.Message); setErrors({ ...errors, ['NameTypeIDError']: '', });
        setStatus(true);
        setChangesStatus(false)
        setUpdateCount(updateCount + 1);
        GetMasterSingleData();
      }
    })
  }

  const Update_Master_Name = () => {
    AddDeleteUpadate('MainMasterName/Update_MainMasterName', value).then((res) => {
      toastifySuccess(res.Message);
      setChangesStatus(false)
      GetMasterSingleData();
      setErrors({ ...errors, ['ContactError']: 'true', ['NameTypeIDError']: '', });
    })
  }

  const OnClose = () => {
    if (!changesStatus) {
      if (openPage === 'mastername') {
        navigate('/namesearch'); setPhoneTypeCode('')
        deleteStoreData({ 'NameID': '', 'MasterNameID': '', 'NameStatus': '' });
      } else if (openPage === 'ArrestSearch') {
        navigate('/arresttab?page=ArrestSearch');
      } else if (openPage === 'Victim' || openPage === 'Offender') {
        navigate("/OffenseHome"); setPhoneTypeCode('')
        deleteStoreData({ 'NameID': '', 'MasterNameID': '', 'NameStatus': '' });
      } else {
        deleteStoreData({ 'NameID': '', 'MasterNameID': '', 'NameStatus': '' });
        navigate('/name'); setPhoneTypeCode('')
      }
    }
  };

  const Reset = () => {
    setShowOffender(false); setShowVictim(false); setDOBDate('')
    setValue({
      ...value,
      'NameIDNumber': '',
      // DropDown
      'BusinessTypeID': '', 'SuffixID': '', 'VerifyID': '', 'SexID': '',
      'RaceID': '', 'PhoneTypeID': '', 'NameReasonCodeID': [], 'CertifiedByID': '', 'AgeUnitID': '',
      // checkbox
      // 'IsJuvenile': '',
      'IsVerify': true, 'IsUnListedPhNo': '',
      //textbox
      'LastName': '', 'FirstName': '', 'MiddleName': '', 'SSN': '',
      'WeightFrom': '', 'WeightTo': '', 'HeightFrom': '',
      'HeightTo': '', 'Address': '', 'Contact': '',
      //Datepicker
      'DateOfBirth': '', 'CertifiedDtTm': null,
      'AgeFrom': '', 'AgeTo': '', 'Years': ''
    });
    setSelected({ optionSelected: [] });
  }

  const OnChangeSelectedReason = (data, name) => {
    // <---------------Both function are to resturn true or false ----------------> 
    // var adultArrest = data.filter(function (item) { return (item.label === "Adult Arrest") }).length > 0;
    let adult = data.some(function (item) { return item.label === "Adult Arrest" });
    if (!adult) {
      setErrors({ ...errors, ['DateOfBirthError']: 'true', ['RaceIDError']: 'true', ['SexIDError']: 'true', ['NameTypeIDError']: '', });
    }
    setIsAdult(adult);

    const newArray = [...data]
    if (value.checkOffender === 1 && value.checkVictem === 1) {
      Selected.optionSelected?.map(val => {
        if (val.checkVictem) {
          if (data.length > 0) {
            return data?.filter(item => {
              if (item.value === val.value) return newArray.push(val)
              else newArray.push(val)
            })
          } else return newArray.push(val)
        }
        if (val.checkOff) {
          if (data.length > 0) {
            return data?.filter(item => {
              if (item.value === val.value) return newArray.push(val)
              else newArray.push(val)
            })
          } else return newArray.push(val)
        }
      })
      let finalValueList = newArray.filter((item, index) => newArray.indexOf(item) === index)?.map((item) => item.value);
      setChangesStatus(true);
      setValue({
        ...value,
        [name]: finalValueList
      });
      setSelected({
        optionSelected: newArray.filter((item, index) => newArray.indexOf(item) === index)
      });
    }
    else if (value.checkOffender === 1) {
      Selected.optionSelected?.map(val => {
        if (val.checkOff) {
          if (data.length > 0) {
            return data?.filter(item => {
              if (item.value === val.value) return newArray.push(val)
              else newArray.push(val)
            })
          } else return newArray.push(val)
        }
      })
      let finalValueList = newArray.filter((item, index) => newArray.indexOf(item) === index)?.map((item) => item.value);
      setChangesStatus(true);
      setValue({
        ...value,
        [name]: finalValueList
      })
      setSelected({
        optionSelected: newArray.filter((item, index) => newArray.indexOf(item) === index)
      });
    }
    else if (value.checkVictem === 1) {
      Selected.optionSelected?.map(val => {
        if (val.checkVictem) {
          if (data.length > 0) {
            return data?.filter(item => {
              if (item.value === val.value) return newArray.push(val)
              else newArray.push(val)
            })
          } else return newArray.push(val)
        }
      })
      let finalValueList = newArray.filter((item, index) => newArray.indexOf(item) === index)?.map((item) => item.value);
      setChangesStatus(true);
      setValue({
        ...value,
        [name]: finalValueList
      })
      setSelected({
        optionSelected: newArray.filter((item, index) => newArray.indexOf(item) === index)
      });
    } else {
      let finalValueList = newArray?.map((item) => item.value);
      setChangesStatus(true);
      setValue({
        ...value,
        [name]: finalValueList
      })
      setSelected({
        optionSelected: newArray
      });
    }
  };

  const handleDOBChange = (date, e) => {
    // console.log(!e?.target?.value?.length)
    if (date) {
      setValue(pre => { return { ...pre, ['AgeFrom']: '', ['AgeTo']: '' } })
      setDOBDate(date);
      const res = getShowingWithOutTime(date).split("/")
      let age = calculateAge(`${res[0]} ${res[1]} ${res[2]}`);
      // console.log(age)
      // setValue({ ...value, ['AgeFrom']: age, ['Years']: age, ['DateOfBirth']: date ? getShowingWithOutTime(date) : null })
      setValue({ ...value, ['AgeFrom']: age, ['AgeTo']: age, ['Years']: age, ['DateOfBirth']: date ? getShowingWithOutTime(date) : null })

    } else if (date === null) {
      setDOBDate(''); setValue({ ...value, ['AgeFrom']: '', ['AgeTo']: '', ['DateOfBirth']: null, ['AgeUnitID']: null, });
      calculateAge(null)
    } else {
      setDOBDate(''); setValue({ ...value, ['AgeFrom']: null, ['AgeTo']: '', ['DateOfBirth']: null, ['AgeUnitID']: null, });
      calculateAge(null)
    }

    if (!nameID && !e?.target?.value?.length) {
      getNameSearch(value?.NameTypeID, value.LastName, value.FirstName, value.MiddleName, getShowingWithOutTime(date), value.SSN, false)
    } else if (e?.target?.value?.length) {
      if (e?.target?.value?.length === 10) {
        getNameSearch(value?.NameTypeID, value.LastName, value.FirstName, value.MiddleName, getShowingWithOutTime(date), value.SSN, false)
      }
    }
  };

  function calculateAge(birthday) {
    //milliseconds in a year 1000*24*60*60*365.24 = 31556736000; 

    // console.log( new Date(sessionStorage.getItem('IncidentReportedDate') ? Decrypt_Id_Name(sessionStorage.getItem('IncidentReportedDate'), 'IForIncidentReportedDate') : new Date()))
    let today = openPage === 'mastername' ? new Date() : new Date(sessionStorage.getItem('IncidentReportedDate') ? Decrypt_Id_Name(sessionStorage.getItem('IncidentReportedDate'), 'IForIncidentReportedDate') : new Date()),
      // let today =   new Date(), //incident Reported Date in same format as new Date()
      //birthay has 'Dec 25 1998'
      dob = new Date(birthday),
      //difference in milliseconds
      diff = today.getTime() - dob.getTime(),
      //convert milliseconds into years
      years = Math.floor(diff / 31556736000),
      //1 day has 86400000 milliseconds
      days_diff = Math.floor((diff % 31556736000) / 86400000),
      //1 month has 30.4167 days      
      months = Math.floor(days_diff / 30.4167),
      days = Math.floor(days_diff % 30.4167);

    setYearsVal(years)
    // return `${years} years ${months} months ${days} days`;
    return ` ${years} `;
  };

  useEffect(() => {
    if (yearsVal < 18 || parseInt(value.AgeTo) < 18) {
      setJuvinile(true)
      setValue({
        ...value,
        ['IsJuvenile']: true
      })
    } else {
      setJuvinile(false)
      setValue({
        ...value,
        ['IsJuvenile']: false
      })
    }
    // getAgeUnitDrp(LoginAgencyID);
    if (value.DateOfBirth) {
      const id = ageUnitDrpData?.filter((val) => { if (val.id === "Y") return val })
      if (id.length > 0) {
        setValue(prevValues => { return { ...prevValues, ['AgeUnitID']: id[0].value } })
      }
    }
  }, [value.DateOfBirth, value.AgeTo]);

  //---------------------------------------- Image Insert ------------------------------------------------

  const get_Name_MultiImage = (nameID, masterNameID) => {
    const val = {
      'NameID': nameID,
      'MasterNameID': 0,
    }
    const val1 = {
      'NameID': 0,
      'MasterNameID': masterNameID,
    }
    fetchPostData('MasterName/GetData_MasterNamePhoto', openPage === 'mastername' ? val1 : val)
      .then((res) => {
        if (res) { setNameMultiImg(res); }
        else { setNameMultiImg(); }
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
      // console.log(error);
    }
  }

  const upload_Image_File = (image) => {
    const val = {
      'NameID': nameID,
      'MasterNameID': masterNameID,
      'CreatedByUserFK': LoginPinID,
    }
    const val1 = {
      'NameID': 0,
      'MasterNameID': masterNameID,
      'CreatedByUserFK': LoginPinID,
    }
    const values = EncryptedList(JSON.stringify(openPage === 'mastername' ? val1 : val));
    var formdata = new FormData();
    formdata.append("MasterNamephotopath", image);
    formdata.append("Data", values);
    AddDeleteUpadate_FormData('MasterName/MasterName_Photo', formdata)
      .then((res) => {
        if (res.success) {
          get_Name_MultiImage(nameID, masterNameID)
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
    AddDeleteUpadate('MasterName/Delete_Photo', value).then((data) => {
      if (data.success) {
        toastifySuccess(data?.Message);
        get_Name_MultiImage(nameID, masterNameID);
        if (openPage === 'mastername') { GetMasterSingleData(masterNameID); } else { GetSingleData(nameID, masterNameID); }
      } else {
        toastifyError(data?.Message);
      }
    });
  }

  // <---------------------Verify SingleData ------------------->
  const get_Add_Single_Data = (NameLocationID) => {
    const val = {
      'LocationID': NameLocationID,
    }
    fetchPostData('MasterLocation/GetSingleData_MasterLocation', val).then((res) => {
      // console.log(res)
      if (res.length > 0) {
        setVerifySingleData(res)
      } else {
        setVerifySingleData([])
      }
    })
  }

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

  const colourStylesReason = {
    control: (styles) => ({
      ...styles, backgroundColor: "#fce9bf",
      fontSize: 14,
      // height: 20,
      // minHeight: 30,
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

  const onKeyDown = (e) => {
    if (e.keyCode === 9 || e.which === 9) {
      // startRef.current.setOpen(false);
      startRef1.current.setOpen(false);
    }
  };

  return (
    <>
      <div className="row">
        <div className="col-12 " id='display-not-form'>
          <div className="col-12 col-md-12  p-0 mt-1" >
            <div className="bg-line px-2  d-flex justify-content-between align-items-center">
              <p className="p-0 m-0">
                Name
              </p>
              {/* <span>
                {masterNameID && <Link to={'/name-information'} className="px-2 py-0"  >  <i className="fa fa-file"></i> </Link>}
                <FindListDropDown array={NameListDropDownArray} setShowPage={setNameShowPage} />
              </span> */}
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-md-12 col-lg-12  " >
              <div className="row">
                <div className="col-6 col-md-5 col-lg-3 mt-2">
                  <div className=" dropdown__box">
                    <Select
                      name='NameTypeID'
                      value={nameTypeIdDrp?.filter((obj) => obj.value === value?.NameTypeID)}
                      options={nameTypeIdDrp}
                      onChange={(e) => ChangeNameType(e, 'NameTypeID')}
                      isClearable
                      placeholder="Select..."
                      isDisabled={nameID || masterNameID ? true : false}
                      styles={colourStyles}
                    />
                    <label htmlFor="">Name Type</label>
                    {errors.NameTypeIDError !== 'true' ? (
                      <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.NameTypeIDError}</span>
                    ) : null}
                  </div>
                </div>
                <div className="col-3 col-md-4 col-lg-2 mt-2">
                  <div class="text-field">
                    <input type="text" className='readonlyColor' value={value?.NameIDNumber} name='nameid' required readOnly />
                    <label>Name ID</label>
                  </div>
                </div>
                <div className="col-3 col-md-3 col-lg-2 mt-4 pl-4">
                  <div class="form-check ">
                    {
                      value.DateOfBirth ?
                        <>
                          <input class="form-check-input" type="checkbox" name='IsJuvenile' value={value?.IsJuvenile} checked={juvinile} id="flexCheckDefault" disabled={nameTypeCode === "B" ? true : false} />
                        </>
                        :
                        <input class="form-check-input" type="checkbox" name='IsJuvenile' value={value?.IsJuvenile} checked={''} id="flexCheckDefault" disabled={nameTypeCode === "B" ? true : false} />
                    }
                    <label class="form-check-label" for="flexCheckDefault">
                      Juvenile
                    </label>
                  </div>
                </div>
                <div className="col-12 col-md-12 col-lg-5 mt-2">
                  <div class="text-field">
                    <input type="text" name='AgencyName' className='readonlyColor' value={AgencyName ? AgencyName : 'Agency Name'} required readOnly />
                    <label>Agency Name</label>
                  </div>
                </div>
              </div>
            </div>
            {
              nameTypeCode === "B" ?
                <>
                  <div className="col-12 col-md-12 col-lg-12">
                    <div className="row ">
                      <div className="col-6 col-md-6 col-lg-6 mt-2 pt-1">
                        <div class="text-field">
                          <input type="text" name='LastName' className={'requiredColor'} value={value?.LastName} onChange={HandleChange} required />
                          <label>Business Name</label>
                          {errors.LastNameError !== 'true' && nameTypeCode === 'B' ? (
                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.LastNameError}</span>
                          ) : null}
                        </div>
                      </div>
                      <div className="col-6 col-md-6 col-lg-3 mt-2 pt-1">
                        <div className=" dropdown__box">
                          <Select
                            name='BusinessTypeID'
                            value={businessTypeDrp?.filter((obj) => obj.value === value?.BusinessTypeID)}
                            options={businessTypeDrp}
                            onChange={(e) => ChangeDropDown(e, 'BusinessTypeID')}
                            isClearable
                            placeholder="Select..."
                            styles={customStylesWithOutColor}
                          />
                          <label htmlFor="">Business Type</label>
                        </div>
                      </div>
                      {
                        !nameID &&
                        <div className="col-12 col-md-3 col-lg-1 name-box text-center " style={{ marginTop: '26px' }}>
                          <button type="button" data-toggle="modal" data-target="#SearchModal" className="btn btn-sm btn-success" onClick={() => getNameSearch(value?.NameTypeID, value.LastName, value.FirstName, value.MiddleName, value.DateOfBirth, value.SSN, true)}>Search</button>
                          {/* <Link to={''}  data-toggle="modal" data-target="#SearchModal"   onClick={() => getNameSearch(value.LastName, value.FirstName, value.MiddleName, value.DateOfBirth, value.SSN, true)}>
                            <span className='  col-1 col-md-1 col-lg-1'>
                              <i className='fa fa-search btn btn-sm bg-green text-white px-2 py-1'></i>
                            </span>
                          </Link> */}
                          {/* <button type="button" data-toggle="modal" data-target="#" className="btn btn-sm btn-success" >NCIC</button> */}
                        </div>
                      }
                      <div className="col-4 col-md-3 col-lg-3 mt-1">
                        <div className=" dropdown__box">
                          <Select
                            name='OwnerNameID'
                            styles={customStylesWithOutColor}
                            // styles={customStylesWithOutColor}
                            options={OwnerNameData}
                            value={OwnerNameData?.filter((obj) => obj.value === value?.OwnerNameID)}
                            isClearable={value?.OwnerNameID ? true : false}
                            onChange={(e) => ChangeDropDown(e, 'OwnerNameID')}
                            placeholder="Select..."
                          />
                          <label htmlFor="" className='pl-0'>Owner Name</label>
                        </div>
                      </div>
                      <div className="col-4 col-md-3 col-lg-3 " style={{ marginTop: '5px' }}>
                        <div class="text-field">
                          <input type="text" name='OwnerPhoneNumber' className={''} value={value?.OwnerPhoneNumber} onChange={HandleChange} required />
                          <label >Owner Phone No.</label>
                        </div>
                      </div>
                      <div className="col-4 col-md-3 col-lg-3 " style={{ marginTop: '5px' }}>
                        <div class="text-field">
                          <input type="text" name='OwnerFaxNumber' className={''} value={value?.OwnerFaxNumber} onChange={HandleChange} required />
                          <label >Owner Fax No.</label>
                        </div>
                      </div>
                    </div>
                  </div>

                </>
                :
                <>
                  <div className="col-12 col-md-12 col-lg-12">
                    <div className="row mt-1">
                      <div className="col-6 col-md-6 col-lg-3 mt-2 pt-1">
                        <div class="text-field">
                          <input type="text" name='LastName' className={nameTypeCode === "B" ? 'readonlyColor' : 'requiredColor'} value={value?.LastName} onClick={() => { setChangesStatus(true); }} onChange={HandleChange} required disabled={nameTypeCode === "B" ? true : false} readOnly={nameTypeCode === "B" ? true : false} />
                          <label>Last Name</label>
                          {errors.LastNameError !== 'true' && nameTypeCode !== 'B' ? (
                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.LastNameError}</span>
                          ) : null}
                        </div>
                      </div>
                      <div className="col-6 col-md-6 col-lg-3  mt-2 pt-1">
                        <div class="text-field">
                          <input type="text" name='FirstName' className={nameTypeCode === "B" ? 'readonlyColor' : ''} value={value?.FirstName} onChange={HandleChange} required disabled={nameTypeCode === "B" ? true : false} readOnly={nameTypeCode === "B" ? true : false} onClick={() => { setChangesStatus(true); }} />
                          <label>First Name</label>
                        </div>
                      </div>
                      <div className="col-12 col-md-12 col-lg-3  mt-2 pt-1">
                        <div class="text-field ">
                          <input type="text" name='MiddleName' value={value?.MiddleName} className={nameTypeCode === "B" ? 'readonlyColor' : ''} onChange={HandleChange} required disabled={nameTypeCode === "B" ? true : false} readOnly={nameTypeCode === "B" ? true : false} onClick={() => { setChangesStatus(true); }} />
                          <label>Middle Name</label>
                        </div>
                      </div>
                      <div className="col-6 col-md-6 col-lg-2  pr-3" style={{ marginTop: '10px' }}>
                        <div className=" dropdown__box">
                          <Select
                            name='SuffixID'
                            value={suffixIdDrp?.filter((obj) => obj.value === value?.SuffixID)}
                            options={suffixIdDrp}
                            onChange={(e) => ChangeDropDown(e, 'SuffixID')}
                            isClearable
                            placeholder="Select..."
                            isDisabled={nameTypeCode === "B" ? true : false}
                            styles={customStylesWithOutColor}
                          />
                          <label htmlFor="">Suffix</label>
                        </div>
                      </div>
                      <div className="col-2 col-md-2 col-lg-1 mt-4">
                        <div class="form-check px-0">
                          <input class="form-check-input" type="checkbox" name='IsUnknown' value={value?.IsUnknown} checked={value?.IsUnknown} onChange={HandleChange} id="flexCheckDefault1" disabled={nameTypeCode === "B" ? true : false} readOnly={nameTypeCode === "B" ? true : false} />
                          <label class="form-check-label" for="flexCheckDefault1">
                            Unknown
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
            }
            <div className="col-12 col-md-12 col-lg-12" >
              {
                nameTypeCode === "B" ?
                  <>

                  </>
                  :
                  <>
                    <div className="row mt-1">
                      <div className="col-3 col-md-4 col-lg-2 pt-1">
                        <div className="date__box ">
                          <DatePicker
                            id='DateOfBirth'
                            name='DateOfBirth'
                            ref={startRef}
                            onKeyDown={onKeyDown}
                            onChange={(date, e) => { handleDOBChange(date, e); }}
                            dateFormat="MM/dd/yyyy"
                            isClearable={value.DateOfBirth ? true : false}
                            selected={DOBDate}
                            placeholderText={value.DateOfBirth ? value.DateOfBirth : 'Select...'}
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            autoComplete='Off'
                            maxDate={new Date()}
                            disabled={nameTypeCode === "B" ? true : false}
                            className={isAdult ? 'requiredColor' : ''}
                          // readOnly={value.AgeTo || value.AgeFrom ? true : false}
                          />
                          <label htmlFor="" className='px-0'>DOB</label>
                          {errors.DateOfBirthError !== 'true' ? (
                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DateOfBirthError}</span>
                          ) : null}
                        </div>
                      </div>
                      <div className="col-3 col-md-2 col-lg-1 mt-2" >
                        <div class="text-field">
                          <input type="text" name='AgeFrom' maxLength={3} className={value.DateOfBirth ? 'readonlyColor' : ''} value={value?.AgeFrom} onChange={HandleChange} required disabled={value.DateOfBirth ? true : false} readOnly={value.DateOfBirth ? true : false} placeholder='From' />
                          <label>Age</label>
                        </div>
                      </div>
                      <span className='dash-name' style={{ marginRight: '-10px' }}>__</span>
                      <div className="col-3 col-md-2 col-lg-1 mt-2 px-3" style={{ marginRight: '-10px' }}>
                        <div class="text-field">
                          <input type="text" name='AgeTo' maxLength={3} value={value?.AgeTo} onChange={HandleChange} required className={value.DateOfBirth ? 'readonlyColor' : ''} disabled={value.DateOfBirth ? true : false} readOnly={value.DateOfBirth ? true : false} placeholder='To' />
                          {/* <label>Age To</label> */}
                        </div>
                      </div>

                      {/* <div className="col-3 col-md-4 col-lg-3 mt-2 ">
                        <div class="text-field">
                          <input type="text" name='year' value={value?.Years} required readOnly className='readonlyColor' />
                          <label>Year</label>
                        </div>
                      </div> */}

                      <div className="col-4 col-md-4 col-lg-2 " style={{ marginTop: '7px', }}>
                        <div className=" dropdown__box" >
                          <Select
                            name='AgeUnitID'
                            value={ageUnitDrpData?.filter((obj) => obj.value === value?.AgeUnitID)}
                            options={ageUnitDrpData}
                            onChange={(e) => ChangeDropDown(e, 'AgeUnitID')}
                            isClearable
                            placeholder="Select..."
                            styles={customStylesWithOutColor}
                            isDisabled={value.DateOfBirth ? true : false}
                          />
                          <label htmlFor="">Age Unit</label>
                        </div>
                      </div>
                      <div className="col-4 col-md-4 col-lg-2 mt-1 pt-1">
                        <div className=" dropdown__box">
                          <Select
                            styles={isAdult ? colourStyles : customStylesWithOutColor}
                            name='SexID'
                            value={sexIdDrp?.filter((obj) => obj.value === value?.SexID)}
                            options={sexIdDrp}
                            onChange={(e) => ChangeDropDown(e, 'SexID')}
                            isClearable
                            placeholder="Select..."
                            isDisabled={nameTypeCode === "B" ? true : false}
                          />
                          <label htmlFor="">Gender</label>
                          {errors.SexIDError !== 'true' ? (
                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.SexIDError}</span>
                          ) : null}
                        </div>
                      </div>
                      <div className="col-4 col-md-4 col-lg-2 mt-1 pt-1">
                        <div className=" dropdown__box">
                          <Select
                            name='RaceID'
                            value={raceIdDrp?.filter((obj) => obj.value === value?.RaceID)}
                            options={raceIdDrp}
                            onChange={(e) => ChangeDropDown(e, 'RaceID')}
                            isClearable
                            placeholder="Select..."
                            isDisabled={nameTypeCode === "B" ? true : false}
                            styles={isAdult ? colourStyles : customStylesWithOutColor}
                          />
                          <label htmlFor="">Race</label>
                          {errors.RaceIDError !== 'true' ? (
                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.RaceIDError}</span>
                          ) : null}
                        </div>
                      </div>
                      <div className="col-4 col-md-4 col-lg-2 " style={{ marginTop: '9px' }}>
                        <div class="text-field">
                          <input type="text" maxLength={9} name='SSN' value={value?.SSN} onChange={HandleChange} required />
                          <label>SSN</label>
                        </div>
                        {errors.SSN !== 'true' ? (
                          <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.SSN}</span>
                        ) : null}
                      </div>
                    </div>
                    <div className="row Nb mt-1 ">
                      <div className="col-2 col-md-2 col-lg-1 ml-1 mt-2 ">
                        <div class="text-field ">
                          <input type="text" name='WeightFrom' value={value?.WeightFrom} maxLength={3} onChange={HandleChange} required disabled={nameTypeCode === "B" ? true : false} readOnly={nameTypeCode === "B" ? true : false} className={nameTypeCode === "B" ? 'readonlyColor' : ''} placeholder='From' />
                          <label>Weight</label>
                        </div>
                      </div>
                      <span className='dash-name'>__</span>
                      <div className="col-3 col-md-2 col-lg-1 mt-2 ">
                        <div class="text-field ">
                          <input type="text" name='WeightTo' value={value?.WeightTo} maxLength={3} onChange={HandleChange} required className={nameTypeCode === "B" ? 'readonlyColor' : ''} disabled={nameTypeCode === "B" ? true : false} readOnly={nameTypeCode === "B" ? true : false} placeholder='To' />
                          {/* <label>Weight</label> */}
                        </div>
                      </div>
                      {/* <span class="mt-3 pt-2 ">
                        <label className='text-dark '>LBS.</label>
                      </span> */}
                      <span className='mt-3 mx-2 py-2' style={{ fontWeight: 'bold', fontSize: '12px' }}>LBS.</span>
                      {/* <div className=" col-1">
                      </div> */}
                      <div className="col-2 col-md-2 col-lg-1 mt-2 ml-4">
                        <div class="text-field ">
                          <input type="text" name='HeightFrom' maxLength={3} value={value?.HeightFrom} onChange={HandleChange} required disabled={nameTypeCode === "B" ? true : false} readOnly={nameTypeCode === "B" ? true : false} className={nameTypeCode === "B" ? 'readonlyColor' : ''} placeholder='From' />
                          <label>Height</label>
                        </div>
                      </div>
                      <span className='dash-name'>__</span>
                      <div className="col-2 col-md-2 col-lg-1 mt-2">
                        <div class="text-field ">
                          <input type="text" name='HeightTo' maxLength={3} value={value?.HeightTo} onChange={HandleChange} required className={nameTypeCode === "B" ? 'readonlyColor' : ''} disabled={nameTypeCode === "B" ? true : false} readOnly={nameTypeCode === "B" ? true : false} placeholder='To' />
                          {/* <label>Height</label> */}
                        </div>
                      </div>
                      <span class="mt-3 pt-2">
                        <label className='text-dark px-0'>FT.</label>
                      </span>
                      <div className="col-1"></div>
                      <div className="col-4 col-md-4 col-lg-3 mt-1 mb-1 pt-1 " style={{ marginLeft: '-20px' }}>
                        <div className=" dropdown__box">
                          <Select
                            name='EthnicityID'
                            value={ethinicityDrpData?.filter((obj) => obj.value === value?.EthnicityID)}
                            options={ethinicityDrpData}
                            onChange={(e) => ChangeDropDown(e, 'EthnicityID')}
                            isClearable
                            placeholder="Select..."
                            styles={customStylesWithOutColor}
                          />
                          <label htmlFor="">Ethnicity</label>
                        </div>
                      </div>
                      {
                        !nameID &&
                        <div className="col-3 col-md-2 col-lg-1 name-box text-center mb-2" style={{ marginTop: '23px' }}>
                          <button type="button" data-toggle="modal" data-target="#SearchModal" className="btn btn-sm btn-success" onClick={() => getNameSearch(value?.NameTypeID, value.LastName, value.FirstName, value.MiddleName, value.DateOfBirth, value.SSN, true)}>Search</button>
                          {/* <Link to={''}  data-toggle="modal" data-target="#SearchModal"   onClick={() => getNameSearch(value.LastName, value.FirstName, value.MiddleName, value.DateOfBirth, value.SSN, true)}>
                            <span className='  col-1 col-md-1 col-lg-1'>
                              <i className='fa fa-search btn btn-sm bg-green text-white px-2 py-1'></i>
                            </span>
                          </Link> */}
                          {/* <button type="button" data-toggle="modal" data-target="#" className="btn btn-sm btn-success" >NCIC</button> */}
                        </div>
                      }
                    </div>
                  </>
              }
            </div>
            <div className="col-12 col-md-12 col-lg-10 ">
              <div className="row ">
                <div className="col-4 col-md-4 col-lg-3 mt-1 pt-1">
                  <div className="dropdown__box">
                    <Select
                      name='PhoneTypeID'
                      value={phoneTypeIdDrp?.filter((obj) => obj.value === value?.PhoneTypeID)}
                      options={phoneTypeIdDrp}
                      onChange={(e) => ChangePhoneType(e, 'PhoneTypeID')}
                      isClearable
                      placeholder="Select..."
                      disabled={phoneTypeCode ? false : true}
                      styles={customStylesWithOutColor}
                    />
                    <label htmlFor="">Phone Type</label>
                  </div>
                </div>
                <div className="col-3 col-md-2 col-lg-3 " style={{ marginTop: '9px' }}>
                  <div class="text-field">
                    <input type="text" maxLength={phoneTypeCode !== 'E' ? 10 : ''} name='Contact' value={value?.Contact} onChange={HandleChange} required disabled={phoneTypeCode ? false : true} />
                    <label>Contact</label>
                    {errors.ContactError !== 'true' ? (
                      <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ContactError}</span>
                    ) : null}
                  </div>
                </div>
                <div className="col-2 col-md-2 col-lg-2 mt-4 pt-1 ">
                  <div class="form-check ">
                    <input class="form-check-input" type="checkbox" name='IsUnListedPhNo' value={value?.IsUnListedPhNo} checked={value?.IsUnListedPhNo} onChange={HandleChange} id="flexCheckDefault2" />
                    <label class="form-check-label" for="flexCheckDefault2">
                      Unlisted
                    </label>
                  </div>
                </div>
                <div className="col-3 col-md-4 col-lg-4 mt-1 pt-1">
                  <div className=" dropdown__box">
                    <Select
                      name='VerifyID'
                      value={verifyIdDrp?.filter((obj) => obj.value === value?.VerifyID)}
                      options={verifyIdDrp}
                      onChange={(e) => ChangeDropDown(e, 'VerifyID')}
                      isClearable
                      placeholder="VerifyID"
                      styles={customStylesWithOutColor}
                    />
                    <label htmlFor="">How Verify</label>
                  </div>
                </div>
                <div className="col-9  col-md-10 col-lg-10  mt-2" >
                  <div className="text-field">
                    <Location {...{ value, setValue, locationStatus, setlocationStatus }} col='Address' locationID='NameLocationID' check={isAdult ? true : false} verify={value.IsVerify} page='Name' />
                    <label htmlFor="" >Address</label>
                    {errors.AddressError !== 'true' ? (
                      <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.AddressError}</span>
                    ) : null}
                  </div>
                </div>

                <div className="col-3 col-md-2 col-lg-2 mt-4 pt-1 pl-4">
                  <div class="form-check ">
                    <input class="form-check-input" type="checkbox" name='IsVerify' value={value?.IsVerify} checked={value?.IsVerify || value?.NameLocationID === 0 && true} onChange={HandleChange} data-toggle="modal" data-target="#NameVerifyModal" id="flexCheckDefault3" />
                    {/* <input class="form-check-input" type="checkbox" name='IsVerify' value={value?.IsVerify} checked={value?.IsVerify} onChange={HandleChange} id="flexCheckDefault3" /> */}
                    <label class="form-check-label mr-2" for="flexCheckDefault3">
                      Verify
                    </label>
                    {
                      value?.IsVerify === false && addVerifySingleData.length > 0 ?
                        <>
                          <i className="fa fa-edit " onClick={() => { get_Add_Single_Data(value.NameLocationID); setModalStatus(true); }} data-toggle="modal" data-target="#NameVerifyModal" style={{ cursor: 'pointer', backgroundColor: '' }} > Edit </i>
                        </>
                        :
                        <>
                        </>
                    }
                  </div>
                </div>
                <div className="col-12 px-2">
                  <div className="row">
                    <div className="form-check mt-1 pl-4  col-4   col-md-4 col-lg-2">
                      {
                        value?.AddressFlags === "Permanent" ?
                          <>
                            <input className="form-check-input mt-1" type="radio" onChange={HandleChange} value="Permanent" checked={value.AddressFlags} name="AddressFlags" id="flexRadioDefault2" />
                          </>
                          :
                          <input className="form-check-input mt-1" type="radio" onChange={HandleChange} value="Permanent" name="AddressFlags" id="flexRadioDefault2" />
                      }
                      <label className="form-check-label" htmlFor="flexRadioDefault2">
                        Permanent
                      </label>
                    </div>
                    <div className="form-check mt-1 pl-4 col-3 col-md-4 col-lg-3">
                      {
                        value?.AddressFlags === "Temporary" ?
                          <>
                            <input className="form-check-input mt-1" type="radio" onChange={HandleChange} value="Temporary" checked={value.AddressFlags} name="AddressFlags" id="flexRadioDefault3" />
                          </>
                          :
                          <input className="form-check-input mt-1" type="radio" onChange={HandleChange} value="Temporary" name="AddressFlags" id="flexRadioDefault3" />
                      }
                      {/* <input className="form-check-input" type="radio" name="AddressFlags" id="flexRadioDefault3" /> */}
                      <label className="form-check-label" htmlFor="flexRadioDefault3">
                        Temporary
                      </label>
                    </div>
                    <div className="form-check mt-1 pl-4  col-3 col-md-4 col-lg-3">
                      {
                        value?.AddressFlags === "Frequent" ?
                          <>
                            <input className="form-check-input mt-1" type="radio" onChange={HandleChange} value="Frequent" checked={value.AddressFlags} name="AddressFlags" id="flexRadioDefault4" />
                          </>
                          :
                          <input className="form-check-input mt-1" type="radio" onChange={HandleChange} value="Frequent" name="AddressFlags" id="flexRadioDefault4" />
                      }
                      {/* <input className="form-check-input" type="radio" name="AddressFlags" id="flexRadioDefault4" /> */}
                      <label className="form-check-label" htmlFor="flexRadioDefault4">
                        Frequent
                      </label>
                    </div>
                    <div className="form-check mt-1 pl-4 col-2 col-md-4 col-lg-2">
                      {
                        value?.AddressFlags === "Old" ?
                          <>
                            <input className="form-check-input mt-1" type="radio" onChange={HandleChange} value="Old" checked={value.AddressFlags} name="AddressFlags" id="flexRadioDefault5" />
                          </>
                          :
                          <input className="form-check-input mt-1" type="radio" onChange={HandleChange} value="Old" name="AddressFlags" id="flexRadioDefault5" />
                      }
                      {/* <input className="form-check-input" type="radio" name="AddressFlags" id="flexRadioDefault5" /> */}
                      <label className="form-check-label" htmlFor="flexRadioDefault5">
                        Old
                      </label>
                    </div>
                    <div className="form-check mt-1 pl-4 col-4 col-md-4 col-lg-2">
                      {
                        value?.AddressFlags === "Alternate" ?
                          <>
                            <input className="form-check-input mt-1" type="radio" onChange={HandleChange} value="Alternate" checked={value.AddressFlags} name="AddressFlags" id="flexRadioDefault6" />
                          </>
                          :
                          <input className="form-check-input mt-1" type="radio" onChange={HandleChange} value="Alternate" name="AddressFlags" id="flexRadioDefault6" />
                      }
                      {/* <input className="form-check-input" type="radio" name="AddressFlags" id="flexRadioDefault6" /> */}
                      <label className="form-check-label" htmlFor="flexRadioDefault6">
                        Alternate
                      </label>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-12 col-lg-12 mt-1">
                  <div className="dropdown__box">
                    <SelectBox
                      styles={colourStylesReason}
                      options={reasonIdDrp}
                      menuPlacement="top"
                      isMulti
                      closeMenuOnSelect={false}
                      hideSelectedOptions={false}
                      allowSelectAll={true}
                      value={Selected.optionSelected}
                      components={{ Option, MultiValue, animatedComponents }}
                      onChange={(e) => value.checkVictem === 1 || value.checkVictem === 0 && value.checkOffender === 1 || value.checkOffender === 0 ? OnChangeSelectedReason(e, 'NameReasonCodeID') : ''}
                    />
                    <label htmlFor="">Reason Code</label>
                    {errors.NameReasonCodeIDError !== 'true' ? (
                      <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.NameReasonCodeIDError}</span>
                    ) : null}
                  </div>
                </div>
                <div className="col-6 col-md-6 col-lg-4 mt-2 mb-1">
                  <div className="dropdown__box">
                    <Select
                      name='CertifiedByID'
                      menuPlacement='top'
                      value={certifiedByIdDrp?.filter((obj) => obj.value === value?.CertifiedByID)}
                      options={certifiedByIdDrp}
                      onChange={(e) => ChangeDropDown(e, 'CertifiedByID')}
                      isClearable
                      placeholder="Certified By"
                      styles={colourStyles}
                    />
                    <label htmlFor="">Certified By</label>
                    {errors.CertifiedByIDError !== 'true' ? (
                      <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CertifiedByIDError}</span>
                    ) : null}
                  </div>
                </div>
                <div className="col-6 col-md-6 col-lg-4 pt-1 ">
                  <div className='date__box'>
                    <DatePicker
                      id='CertifiedDtTm'
                      name='CertifiedDtTm'
                      ref={startRef1}
                      onKeyDown={onKeyDown}
                      onChange={(date) => { setChangesStatus(true); setValue({ ...value, ['CertifiedDtTm']: date ? getShowingMonthDateYear(date) : null }) }}
                      selected={value?.CertifiedDtTm && new Date(value?.CertifiedDtTm)}
                      className=''
                      dateFormat="MM/dd/yyyy HH:mm"
                      timeInputLabel
                      autoComplete="nope"
                      showYearDropdown
                      showMonthDropdown
                      dropdownMode="select"
                      isClearable={value?.CertifiedDtTm ? true : false}
                      // selected={CertifiedDate}
                      placeholderText={value?.CertifiedDtTm ? value.CertifiedDtTm : 'Select...'}
                      showTimeSelect
                      timeIntervals={1}
                      timeCaption="Time"
                      maxDate={new Date()}
                    />
                    <label htmlFor="" className='pl-0'>Certified Date/Time</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-4 col-md-4 col-lg-2 pt-1" style={{ marginTop: '5px' }}>
              <div className="img-box">
                <Carousel autoPlay={true} className="carousel-style" showArrows={true} showThumbs={false} showStatus={false} >
                  {
                    nameMultiImg.length > 0 ?
                      nameMultiImg?.map((item, index) => (
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
                  nameID || masterNameID ?
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
          </div>
        </div>
      </div >
      <div className="col-12 text-right  " style={{ marginTop: '-18px' }}>
        {/* <button type="button" className="btn btn-sm btn-success  mr-1" onClick={InsertName}>Save</button> */}
        {
          openPage ?
            masterNameID ?
              <button type="button" className="btn btn-sm btn-success  mr-1" onClick={() => { check_Validation_Error(); }}>Update</button>
              :
              <button type="button" className="btn btn-sm btn-success  mr-1" onClick={() => { check_Validation_Error(); }}>Save</button>
            :
            nameID ?
              <>
                <button type="button" className="btn btn-sm btn-success  mr-1" onClick={() => { check_Validation_Error(); }}>Update</button>
              </>
              :
              <>
                <button type="button" className="btn btn-sm btn-success  mr-1" onClick={() => { check_Validation_Error(); }}>Save</button>
              </>
        }
        <button type="button" className="btn btn-sm btn-success  mr-1" data-dismiss="modal" data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} onClick={() => {
          OnClose();
        }}>Close</button>
        {/* <button type="button" className="btn btn-sm btn-success  mr-1">Search</button>
            <button type="button" className="btn btn-sm btn-success ">NCIC</button> */}
      </div>
      <NameSearchModal {...{ MainIncidentID, nameSearchValue, setValue, value, setDOBDate, get_Name_MultiImage }} />
      <DeletePopUpModal func={delete_Image_File} />
      <ChangesModal func={check_Validation_Error} />
      <VerifyLocation {...{ LoginAgencyID, LoginPinID, AgencyName, modalStatus, setModalStatus, value, setValue, addVerifySingleData, get_Add_Single_Data }} />
      <IdentifyFieldColor />
      {/* <SearchModal /> */}
    </>
  )
}

export default Home;

const Get_PhoneType_Code = (data, dropDownData) => {
  const result = data?.map((sponsor) => (sponsor.PhoneTypeID));
  const result2 = dropDownData?.map((sponsor) => {
    if (sponsor.value === result[0]) {
      return { value: result[0], label: sponsor.label, id: sponsor.id }
    }
  })
  const val = result2.filter(function (element) {
    return element !== undefined;
  });
  return val[0]?.id
};