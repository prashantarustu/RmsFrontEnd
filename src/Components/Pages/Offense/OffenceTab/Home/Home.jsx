import React, { useEffect, useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Select from "react-select";
import DatePicker from "react-datepicker";
import IdentifyFieldColor from '../../../../Common/IdentifyFieldColor';
import { Decrypt_Id_Name, Encrypted_Id_Name, getShowingMonthDateYear, getShowingWithOutTime } from '../../../../Common/Utility';
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api';
import { Comman_changeArrayFormat, threeColArray, threeColArrayWithCode } from '../../../../Common/ChangeArrayFormat';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { RequiredFieldIncident } from '../../../Utility/Personnel/Validation';
import FindListDropDown from '../../../../Common/FindListDropDown';
import { OffenceListDropDownArray } from '../../../../Utility/ListDropDownArray/ListDropArray';
import ChangesModal from '../../../../Common/ChangesModal';
import { ErrorShow, ErrorStyleLocation, ErrorStyleNIBRS, ErrorTooltip, LocationError } from '../ErrorNibrs';

const Home = ({ setStatus, setOffenseID }) => {

  const { get_Offence_Count, setShowPage, updateCount, setUpdateCount, changesStatusCount, setChangesStatus, offenceData, get_Offence_Data, changesStatus, get_Incident_Count, localStoreArray, setLocalStoreArray, get_LocalStorage, deleteStoreData, storeData, setIncidentStatus, setOffenceStatus } = useContext(AgencyContext);

  const navigate = useNavigate();
  const [ChargeCodeDrp, setChargeCodeDrp] = useState([]);
  const [lawTitleIdDrp, setLawTitleIdDrp] = useState([]);
  // const [offenceCodeDrp, setOffenceCodeDrp] = useState([]);
  const [nibrsCodeDrp, setNibrsCodeDrp] = useState([]);
  const [offenderLeftSceneDrp, setOffenderLeftSceneDrp] = useState([]);
  const [categoryIdDrp, setCategoryIdDrp] = useState([]);
  const [locationIdDrp, setLocationIdDrp] = useState([]);
  const [Editval, setEditval] = useState();
  const [forceUsed, setForceUsed] = useState('');
  const [loder, setLoder] = useState(false);
  const [CrimeId, setCrimeId] = useState('');

  const [MainIncidentID, setMainIncidentID] = useState('');
  const [LoginAgencyID, setLoginAgencyID] = useState('');
  const [LoginPinID, setLoginPinID,] = useState('');

  const [value, setValue] = useState({
    'NIBRSCodeId': '',
    'ChargeCodeID': '',
    'OffenseCodeId': '',
    'LawTitleId': '',
    'OffenderLeftSceneId': '',
    'CategoryId': '',
    'PrimaryLocationId': '',
    'SecondaryLocationId': '',
    // text Box
    'Fine': '', 'CourtCost': '', 'FTAAmt': '', 'LitigationTax': '', 'DamageProperty': '', 'OfRoomsInvolved': '', 'PremisesEntered': '',
    // Checkbox
    'PropertyAbandoned': '',
    'IsForceused': '',
    'PremisesEntered': '',
    'IsIncidentCode': false,
    //Radio Button
    'AttemptComplete': '',
    //Date picker
    'FTADate': '',
    // other
    'CrimeID': '',
    'IncidentID': '',
    'CreatedByUserFK': '',
    'ModifiedByUserFK': '',
  });

  const [errors, setErrors] = useState({
    'ChargeCodeIDError': '',
    'LawTitleIdError': '',
  });

  const localStore = {
    Value: "",
    UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
    Key: JSON.stringify({ AgencyID: "", PINID: "", IncidentID: '', OffenceID: '', IncidentStatus: '', }),
  }

  useEffect(() => {
    if (!localStoreArray.AgencyID || !localStoreArray.PINID) {
      get_LocalStorage();
    }
  }, []);

  console.log("offense home", localStoreArray);

  // Onload Function
  useEffect(() => {
    // console.log("offense home", localStoreArray);
    if (localStoreArray) {
      if (localStoreArray?.AgencyID && localStoreArray?.PINID && localStoreArray?.IncidentID) {
        setLoginAgencyID(localStoreArray?.AgencyID);
        setLoginPinID(localStoreArray?.PINID);
        setMainIncidentID(localStoreArray?.IncidentID);

        if (localStoreArray.OffenceID) {
          setCrimeId(localStoreArray?.OffenceID); setOffenseID(localStoreArray?.OffenceID)
        } else {
          // setCrimeId(''); setOffenseID(''); GetSingleData('')
        }
        get_Offence_Count(localStoreArray?.OffenceID);
      }
    }
  }, [localStoreArray])

  

  console.log(localStoreArray ,'localarray')

  useEffect(() => {
    if (MainIncidentID) {
      setValue(pre => { return { ...pre, 'IncidentID': MainIncidentID, 'CreatedByUserFK': LoginPinID, } })
      // get_Offence_Count(MainIncidentID);
      get_Offence_Data(MainIncidentID);
    }
  }, [MainIncidentID]);

  const check_Validation_Error = (e) => {
    if (RequiredFieldIncident(value.NIBRSCodeId)) {
      setErrors(prevValues => { return { ...prevValues, ['LawTitleIdError']: RequiredFieldIncident(value.NIBRSCodeId) } })
    }
    if (RequiredFieldIncident(value.ChargeCodeID)) {
      setErrors(prevValues => { return { ...prevValues, ['ChargeCodeIDError']: RequiredFieldIncident(value.ChargeCodeID) } })
    }
  }

  // Check All Field Format is True Then Submit 
  const { ChargeCodeIDError, LawTitleIdError } = errors

  useEffect(() => {
    if (ChargeCodeIDError === 'true' && LawTitleIdError === 'true') {
      if (CrimeId) { Update_Offence() }
      else { Add_Offense() }
    }
  }, [ChargeCodeIDError, LawTitleIdError])

  useEffect(() => {
    if (CrimeId) {
      GetSingleData(CrimeId)
    }
  }, [CrimeId,])

  const GetSingleData = (CrimeId) => {
    const val = { 'CrimeID': CrimeId }
    fetchPostData('Crime/GetSingleData_Offense', val)
      .then((res) => {
        if (res) {
          setEditval(res);
        } else { setEditval() }
      })
  }

  useEffect(() => {
    if (CrimeId) {
      // console.log(Editval)
      if (Editval?.length > 0) {
        setValue({
          ...value,
          'CrimeID': Editval[0]?.CrimeID,
          'NIBRSCodeId': Editval[0]?.NIBRSCodeId,
          'ChargeCodeID': Editval[0]?.ChargeCodeID,
          'LawTitleId': Editval[0]?.LawTitleId,
          'OffenseCodeId': Editval[0]?.OffenseCodeId,
          'PrimaryLocationId': Editval[0]?.PrimaryLocationId,
          'SecondaryLocationId': Editval[0]?.SecondaryLocationId,
          'OffenderLeftSceneId': Editval[0]?.OffenderLeftSceneId,
          'CategoryId': Editval[0]?.CategoryId,
          // text Box
          'Fine': Editval[0]?.Fine ? Editval[0]?.Fine : '', 'CourtCost': Editval[0]?.CourtCost ? Editval[0]?.CourtCost : '', 'FTAAmt': Editval[0]?.FTAAmt ? Editval[0]?.FTAAmt : "",
          'LitigationTax': Editval[0]?.LitigationTax ? Editval[0]?.LitigationTax : "", 'DamageProperty': Editval[0]?.DamageProperty ? Editval[0]?.DamageProperty : '', 'OfRoomsInvolved': Editval[0]?.OfRoomsInvolved,
          'PremisesEntered': Editval[0]?.PremisesEntered,
          // Checkbox
          'PropertyAbandoned': Editval[0]?.PropertyAbandoned,
          'IsForceused': Editval[0]?.IsForceused === 'N' || Editval[0]?.IsForceused === null || Editval[0]?.IsForceused === '' ? false : true,
          'IsIncidentCode': Editval[0]?.IsIncidentCode,// for Auto Create Offense
          //Radio Button
          'AttemptComplete': Editval[0]?.AttemptComplete,
          //Date picker
          'FTADate': Editval[0]?.FTADate ? getShowingWithOutTime(Editval[0]?.FTADate) : '',
          // other
          'ModifiedByUserFK': LoginPinID,
        })
        setForceUsed(Get_Nibrs_Code(Editval, nibrsCodeDrp));
        getChargeCodeIDDrp(Editval[0]?.NIBRSCodeId);
        LawTitleIdDrpDwnVal(Editval[0]?.ChargeCodeID, LoginAgencyID);
      }
    } else {
      setValue({
        ...value,
        'ChargeCodeID': '',
        'LawTitleId': '',
        'OffenseCodeId': '',
        'NIBRSCodeId': '',
        'OffenderLeftSceneId': '',
        'CategoryId': '',
        'PrimaryLocationId': '',
        'SecondaryLocationId': '',
        // text Box
        'Fine': '', 'CourtCost': '', 'FTAAmt': '', 'LitigationTax': '', 'DamageProperty': '', 'OfRoomsInvolved': '', 'PremisesEntered': '',
        // Checkbox
        'PropertyAbandoned': '',
        'IsForceused': '',
        //Radio Button
        'AttemptComplete': '',
        //Date picker
        'FTADate': '',
        // other
        'CreatedByUserFK': '',
      });
    }
  }, [Editval])

  const Reset = () => {
    setValue({
      ...value,
      'ChargeCodeID': '',
      'LawTitleId': '',
      'OffenseCodeId': '',
      'NIBRSCodeId': '',
      'OffenderLeftSceneId': '',
      'CategoryId': '',
      'PrimaryLocationId': '',
      'SecondaryLocationId': '',
      //text box
      'Fine': '', 'CourtCost': '', 'FTAAmt': '', 'LitigationTax': '', 'DamageProperty': '', 'OfRoomsInvolved': '', 'PremisesEntered': '',
      //checkbox
      'PropertyAbandoned': '',
      'IsForceused': '',
      //radio button
      'AttemptComplete': '',
      //Date picker
      'FTADate': '',
    })
    setErrors({
      ...errors,
      'ChargeCodeIDError': '', 'LawTitleIdError': '',
    })
  }

  const [nibrsCode, setNibrsCode] = useState('');
  const [primaryLocationCode, setprimaryLocationCode] = useState('');

  const changeDropDown = (e, name) => {
    if (e) {
      if (name === 'NIBRSCodeId') {
        setChangesStatus(true)
        setValue({ ...value, ['NIBRSCodeId']: e.value, ['ChargeCodeID']: null, ['LawTitleId']: null, }); getChargeCodeIDDrp(e.value); setNibrsCode(e.id);
        if (e.id === '120') {
          setForceUsed(e.id); setValue(pre => { return { ...pre, [name]: e.value } });
        } else {
          setForceUsed(''); setValue(pre => { return { ...pre, ['IsForceused']: false } })
        }
      } else if (name === 'ChargeCodeID') {
        setValue({ ...value, ['ChargeCodeID']: e.value, ['LawTitleId']: null, }); LawTitleIdDrpDwnVal(e.value, LoginAgencyID);
      }
      else if (name === 'PrimaryLocationId') {
        setprimaryLocationCode(e.id); setValue({ ...value, [name]: e.value });
      }
      else {
        setChangesStatus(true)
        setValue({ ...value, [name]: e.value });
      }
    }
    else if (e === null) {
      setChangesStatus(true)
      if (name === 'NIBRSCodeId') {
        setNibrsCode('');
        setChangesStatus(true)
        setValue({
          ...value, ['NIBRSCodeId']: "", ['ChargeCodeID']: "", ['LawTitleId']: null, ['IsForceused']: false,
        });
        setLawTitleIdDrp([])
        setForceUsed('');
        setChargeCodeDrp([]);
      } else if (name === 'ChargeCodeID') {
        setValue({
          ...value, ['ChargeCodeID']: "", ['LawTitleId']: "",
        });
        setLawTitleIdDrp([])
      } else if (name === 'PrimaryLocationId') {
        // setValue(pre => console.log('pre5', pre))
        setprimaryLocationCode('');
        setChangesStatus(true)
        setValue({ ...value, [name]: null });
      }
      else {
        setChangesStatus(true)
        setValue({ ...value, [name]: null });
        // setValue(pre => console.log('pre6', pre))
      }
    } else {
      setChangesStatus(true);
      setChangesStatus(true)
      setValue({ ...value, [name]: null }); setForceUsed(''); setChargeCodeDrp([]);
    }
  }

  const handleChange = (e) => {
    if (e.target.name === 'PropertyAbandoned' || e.target.name === 'IsForceused') {
      setChangesStatus(true)
      setValue({
        ...value,
        [e.target.name]: e.target.checked
      })
    }

    else if (e.target.name === 'OfRoomsInvolved') {
      const checkNumber = e.target.value.replace(/[^0-9\s]/g, "");
      // /[^a-zA-Z\s]/g
      setChangesStatus(true)
      setValue({
        ...value,
        [e.target.name]: checkNumber
      });
    }
    else if (e.target.name === 'PremisesEntered') {
      const checkNumber = e.target.value.replace(/[^0-9\s]/g, "");
      // /[^a-zA-Z\s]/g
      setChangesStatus(true)
      setValue({
        ...value,
        [e.target.name]: checkNumber
      });
    }
    else if (e.target.name === 'Fine' || e.target.name === 'LitigationTax' || e.target.name === 'FTAAmt' || e.target.name === 'CourtCost' || e.target.name === 'DamageProperty') {
      //------------------>DKashyap-------------------------->
      var ele = e.target.value.replace(/[^0-9\.]/g, "")
      if (ele.includes('.')) {
        if (ele.length === 16) {
          setChangesStatus(true)
          setValue({ ...value, [e.target.name]: ele });
        } else {
          setChangesStatus(true)
          if (ele.substr(ele.indexOf('.') + 1).slice(0, 2)) {
            const checkDot = ele.substr(ele.indexOf('.') + 1).slice(0, 2).match(/\./g)
            if (!checkDot) {
              setValue({ ...value, [e.target.name]: ele.substring(0, ele.indexOf(".")) + '.' + ele.substr(ele.indexOf('.') + 1).slice(0, 2) });
            } else {
              console.log("Calll")
            }
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

  useEffect(() => {
    if (LoginAgencyID) {
      NIBRSCodeDrpDwnVal(LoginAgencyID); OffenderLeftSceneDrpDwnVal(LoginAgencyID); CategoryDrpDwnVal(LoginAgencyID); LocationIdDrpDwnVal(LoginAgencyID);
    }
  }, [LoginAgencyID])

  const LocationIdDrpDwnVal = (LoginAgencyID) => {
    const val = {
      AgencyID: LoginAgencyID,
    }
    fetchPostData('LocationType/GetDataDropDown_LocationType', val).then((data) => {
      if (data) {
        setLocationIdDrp(threeColArray(data, 'LocationTypeID', 'Description', 'LocationTypeCode'))
      } else {
        setLocationIdDrp([]);
      }
    })
  }

  const CategoryDrpDwnVal = (LoginAgencyID) => {
    const val = {
      AgencyID: LoginAgencyID,
    }
    fetchPostData('ChargeCategory/GetDataDropDown_ChargeCategory', val).then((data) => {
      if (data) {
        setCategoryIdDrp(Comman_changeArrayFormat(data, 'ChargeCategoryID', 'Description'))
      } else {
        setCategoryIdDrp([]);
      }
    })
  }

  const OffenderLeftSceneDrpDwnVal = (LoginAgencyID) => {
    const val = {
      AgencyID: LoginAgencyID,
    }
    fetchPostData('CrimeLeftScene/GetDataDropDown_CrimeLeftScene', val).then((data) => {
      if (data) {
        setOffenderLeftSceneDrp(Comman_changeArrayFormat(data, 'LeftSceneId', 'Description'))
      } else {
        setOffenderLeftSceneDrp([]);
      }
    })
  }

  const NIBRSCodeDrpDwnVal = (LoginAgencyID) => {
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

  const LawTitleIdDrpDwnVal = (ChargeID, LoginAgencyID) => {
    const val = {
      ChargeCodeID: ChargeID,
      AgencyID: LoginAgencyID,
    }
    fetchPostData('LawTitle/GetDataDropDown_LawTitle', val).then((data) => {
      if (data) {
        setLawTitleIdDrp(Comman_changeArrayFormat(data, 'LawTitleID', 'Description'))
      } else {
        setLawTitleIdDrp([]);
      }
    })
  }

  // offence code  === charge code 
  const getChargeCodeIDDrp = (FBIID) => {
    const val = {
      'FBIID': FBIID,
      'AgencyID': null,
    }
    fetchPostData('ChargeCodes/GetDataDropDown_ChargeCodes', val).then((data) => {
      if (data) {
        setChargeCodeDrp(Comman_changeArrayFormat(data, 'ChargeCodeID', 'Description'))
      } else {
        setChargeCodeDrp([]);
      }
    })
  }

  useEffect(() => {
    if (!setStatus) {
    } else {
      setValue({
        ...value,
        ['FTADate']: '',
      });
    }
  }, [])

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
      minHeight: 32,
      fontSize: 14,
      margintop: 2,
      boxShadow: 0,
    }),
  };

  const Add_Offense = () => {
    AddDeleteUpadate('Crime/Insert_Offense', value).then((res) => {
      if (res.success) {
        toastifySuccess(res.Message);
        if (res.CrimeID) {
          setCrimeId(res?.CrimeID); setOffenseID(res?.CrimeID);
          storeData({ 'OffenceID': res.CrimeID, 'OffenceStatus': true });
          setOffenceStatus(true);
          get_Incident_Count(MainIncidentID)
        }
        setUpdateCount(updateCount + 1)
        setStatus(true)
        setChangesStatus(false)
        Reset();
        setErrors({
          ...errors,
          ['ChargeCodeIDError']: '',
        })
      }
    })
  }

  const Update_Offence = () => {
    // console.log(value);
    AddDeleteUpadate('Crime/Update_Offense', value).then((res) => {
      toastifySuccess(res.Message)
      setChangesStatus(false)
      setErrors({
        ...errors,
        ['ChargeCodeIDError']: '',
      })
    })
  }

  const startRef = React.useRef();

  const onKeyDown = (e) => {
    if (e.keyCode === 9 || e.which === 9) {
      startRef.current.setOpen(false);
    }
  };

  const Cancel = () => {
    if (!changesStatus) {
      navigate('/offensetab');
      deleteStoreData({ 'OffenceID': '', 'OffenceStatus': '' });
      setIncidentStatus(true);
    }
  }

  return (
    <>
      {/* // offense tabs */}
      <div className="col-12 col-md-12 pt-2 p-0" >
        <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center ">
          <p className="p-0 m-0">Offense</p>
          <FindListDropDown
            array={OffenceListDropDownArray}
            setShowPage={setShowPage}
          />
        </div>
        <div className="row">
          <div className="col-6 col-md-6 col-lg-4 mt-2">
            <div className=" dropdown__box">
              <Select
                name='NIBRSCodeId'
                // styles={ErrorStyleNIBRS(nibrsCode)}
                styles={colourStyles}
                value={nibrsCodeDrp?.filter((obj) => obj.value === value?.NIBRSCodeId)}
                isClearable
                options={nibrsCodeDrp}
                onChange={(e) => changeDropDown(e, 'NIBRSCodeId')}
                placeholder="Select..."
              />
              <label htmlFor="">NIBRS Code {nibrsCode === '09C' && offenceData?.length > 0 ? <ErrorTooltip Error='No other offense can be submitted with an 09C offense' /> : <></>}</label>
              {errors.LawTitleIdError !== 'true' && <ErrorShow Error={errors?.LawTitleIdError} />}
            </div>
          </div>
          <div className="col-6 col-md-6 col-lg-4 mt-2">
            <div className="dropdown__box">
              <Select
                name='ChargeCodeID'
                styles={colourStyles}
                value={ChargeCodeDrp?.filter((obj) => obj.value === value?.ChargeCodeID)}
                isClearable
                options={ChargeCodeDrp}
                onChange={(e) => changeDropDown(e, 'ChargeCodeID')}
                placeholder="Select..."
              // isDisabled={true}
              />
              <label>Offense Code/Name</label>
              {errors.ChargeCodeIDError !== 'true' ? (
                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ChargeCodeIDError}</span>
              ) : null}
            </div>
          </div>
          <div className="col-6 col-md-6 col-lg-4 mt-2">
            <div className=" dropdown__box">
              <Select
                name='LawTitleId'
                styles={customStylesWithOutColor}
                value={lawTitleIdDrp?.filter((obj) => obj.value === value?.LawTitleId)}
                isClearable
                options={lawTitleIdDrp}
                onChange={(e) => changeDropDown(e, 'LawTitleId')}
                placeholder="Select..."
              />
              <label htmlFor="">Law Title</label>
              {/* {errors.LawTitleIdError !== 'true' ? (
                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.LawTitleIdError}</span>
              ) : null} */}
            </div>
          </div>
          <div className="col-6 col-md-6 col-lg-4 mt-2">
            <div className=" dropdown__box">
              <Select
                name='PrimaryLocationId'
                styles={ErrorStyleLocation(primaryLocationCode, nibrsCode, value?.PremisesEntered)}
                value={locationIdDrp?.filter((obj) => obj.value === value?.PrimaryLocationId)}
                isClearable
                options={locationIdDrp}
                onChange={(e) => changeDropDown(e, 'PrimaryLocationId')}
                placeholder="Select..."
              />
              <label htmlFor="">Primary Location {(primaryLocationCode === '14' || primaryLocationCode === '19') && nibrsCode === '220' && value?.PremisesEntered == '0' ? <ErrorTooltip Error={LocationError} /> : <></>}</label>
            </div>
          </div>
          <div className="col-6 col-md-6 col-lg-4 mt-2">
            <div className=" dropdown__box">
              <Select
                name='SecondaryLocationId'
                styles={customStylesWithOutColor}
                value={locationIdDrp?.filter((obj) => obj.value === value?.SecondaryLocationId)}
                isClearable
                options={locationIdDrp}
                onChange={(e) => changeDropDown(e, 'SecondaryLocationId')}
                placeholder="Select..."
              />
              <label htmlFor="">Secondary Location</label>
            </div>
          </div>
          <div className="col-6 col-md-6 col-lg-4 mt-2">
            <div className=" dropdown__box">
              <Select
                name='OffenderLeftSceneId'
                styles={customStylesWithOutColor}
                value={offenderLeftSceneDrp?.filter((obj) => obj.value === value?.OffenderLeftSceneId)}
                isClearable
                options={offenderLeftSceneDrp}
                onChange={(e) => changeDropDown(e, 'OffenderLeftSceneId')}
                placeholder="Select..."
              />
              <label htmlFor="">Offender Left Scene</label>
            </div>
          </div>
          <div className="col-6 col-md-6 col-lg-4 mt-2">
            <div class="text-field">
              <input type="text" name='Fine' value={'$' + value?.Fine} onChange={handleChange} maxlength={16} required />
              <label>Fine</label>
            </div>
          </div>
          <div className="col-6 col-md-6 col-lg-4 mt-2">
            <div class="text-field">
              <input type="text" maxlength="4" required name='CourtCost' maxLength={19} value={'$' + value?.CourtCost} onChange={handleChange} />
              <label>Court Cost</label>
            </div>
          </div>
          <div className="col-6 col-md-6 col-lg-4 mt-3 date__box">
            <DatePicker
              id='FTADate'
              name='FTADate'
              ref={startRef}
              onKeyDown={onKeyDown}
              onChange={(date) => { setValue({ ...value, ['FTADate']: date ? getShowingMonthDateYear(date) : null }) }}
              dateFormat="MM/dd/yyyy"
              isClearable={value?.FTADate ? true : false}
              selected={value?.FTADate && new Date(value?.FTADate)}
              maxDate={new Date()}
              placeholderText={'Select...'}
              autoComplete="Off"
              showDisabledMonthNavigation
              showYearDropdown
              showMonthDropdown
              dropdownMode="select"
            />
            <label htmlFor="">FTA Date</label>
          </div>
          <div className="col-6 col-md-6 col-lg-4 mt-2">
            <div class="text-field">
              <input type="text" name='FTAAmt' value={'$' + value?.FTAAmt} onChange={handleChange} maxlength={16} required />
              <label>FTA Amt</label>
            </div>
          </div>
          <div className="col-6 col-md-6 col-lg-4 mt-2">
            <div class="text-field">
              <input type="text" name='LitigationTax' value={'$' + value?.LitigationTax} onChange={handleChange} maxlength={16} required />
              <label>Litigation Tax</label>
            </div>
          </div>
          <div className="col-6 col-md-6 col-lg-4 mt-2 ">
            <div class="text-field">
              <input type="text" name='DamageProperty' value={'$' + value?.DamageProperty} onChange={handleChange} maxlength={16} required />
              <label>Damage Property</label>
            </div>
          </div>
          <div className="col-6 col-md-6 col-lg-4 pt-2 ">
            <div class="text-field">
              <input type="text" name='OfRoomsInvolved' value={value?.OfRoomsInvolved} onChange={handleChange} maxlength="2" maxLength={4} required />
              <label># Of Rooms Involved</label>
            </div>
          </div>
          <div className="col-6 col-md-6 col-lg-4 " style={{ marginTop: '6px' }}>
            <div className=" dropdown__box">
              <Select
                name='CategoryId'
                styles={customStylesWithOutColor}
                value={categoryIdDrp?.filter((obj) => obj.value === value?.CategoryId)}
                isClearable
                options={categoryIdDrp}
                onChange={(e) => changeDropDown(e, 'CategoryId')}
                placeholder="Select..."
              />
              <label htmlFor="">Category</label>
              {/* {errors.CategoryIdError !== 'true' ? (
                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CategoryIdError}</span>
              ) : null} */}
            </div>
          </div>
          <div className="col-6 col-md-6 col-lg-4 pt-2 ">
            <div class="text-field">
              <input type="text" name='PremisesEntered' maxLength={2} value={value?.PremisesEntered} onChange={handleChange} required />
              <label>Premises Entered</label>
            </div>
          </div>
          <div className="col-12">
            <div className="row px-2 mt-2">
              <div className="col-6 col-md-6 col-lg-4 mt-2">
                <div class="form-check ">
                  <input class="form-check-input" type="checkbox" name='PropertyAbandoned' checked={value?.PropertyAbandoned} value={value?.PropertyAbandoned} onChange={handleChange} id="flexCheckDefault" />
                  <label class="form-check-label" for="flexCheckDefault">
                    Property Abandoned
                  </label>
                </div>
              </div>
              <div className="col-6 col-md-6 col-lg-2 mt-2">
                <div class="form-check ">
                  <input class="form-check-input" type="checkbox" name='IsForceused' checked={value?.IsForceused} value={value?.IsForceused} disabled={forceUsed === '120' ? false : true} onChange={handleChange} id="flexCheckDefault3" />
                  <label class="form-check-label" for="flexCheckDefault3">
                    Force Used
                  </label>
                </div>
              </div>
              {/* -------------radio button---------------*/}
              <div className="form-check mt-2 px-4 col-6 col-md-6 col-lg-2">
                {
                  value?.AttemptComplete === "A" ?
                    <>
                      <input className="form-check-input mt-1" type="radio" onChange={handleChange} value="Attempted" checked={value.AttemptComplete} name="AttemptComplete" id="flexRadioDefault1" />
                    </>
                    :
                    <input className="form-check-input mt-1" type="radio" onChange={handleChange} value="Attempted" name="AttemptComplete" id="flexRadioDefault1" />
                }
                <label className="form-check-label" htmlFor="flexRadioDefault1" >
                  Attempted
                </label>
              </div>
              <div className="form-check mt-2  ">
                {
                  value?.AttemptComplete === "C" ?
                    <>
                      <input className="form-check-input " type="radio" onChange={handleChange} value="Completed" checked={value.AttemptComplete} name="AttemptComplete" id="flexRadioDefault2" />
                    </>
                    :
                    <input className="form-check-input" type="radio" onChange={handleChange} value="Completed" name="AttemptComplete" id="flexRadioDefault2" />
                }
                <label className="form-check-label" htmlFor="flexRadioDefault2">
                  Completed
                </label>
              </div>
            </div>
          </div>
          <div className="col-12 d-flex flex-row-reverse text-center mt-3 p-0">
            <button type="button" className="btn btn-sm btn-success mx-1" onClick={() => { Cancel() }} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} data-dismiss="modal">Close</button>
            {
              CrimeId ?
                <button type="button" onClick={() => check_Validation_Error()} className="btn btn-sm btn-success pl-2">Update</button>
                :
                <button type="button" onClick={() => check_Validation_Error()} className="btn btn-sm btn-success pl-2">Save</button>
            }
          </div>
          <IdentifyFieldColor />
          <ChangesModal func={check_Validation_Error} />
        </div>
      </div>
    </>
  )
}

export default Home

const Get_Nibrs_Code = (data, dropDownData) => {
  const result = data?.map((sponsor) =>
    (sponsor.NIBRSCodeId)
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