import React, { useEffect } from 'react'
import Select from "react-select";
import DatePicker from "react-datepicker";
import { useState } from 'react';
import { Decrypt_Id_Name, Encrypted_Id_Name, getShowingMonthDateYear, getShowingWithOutTime } from '../../../../Common/Utility';
import MobileTab from '../../../MobileUtility/MobileTab';
import { useContext } from 'react';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { Link, useNavigate } from 'react-router-dom';
import { Comman_changeArrayFormat, threeColArrayWithCode } from '../../../../Common/ChangeArrayFormat';
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api';
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import { RequiredFieldIncident } from '../../../../Pages/Utility/Personnel/Validation';
import MobileFieldColor from '../../../../Common/MobileFieldColor';

const OffenseHome = ({ setStatus, setOffenseID }) => {

  const navigate = useNavigate();
  const { setShowPage, storeData, localStoreArray, get_Incident_Count,get_LocalStorage, setOffenceStatus, updateCount, setUpdateCount, setChangesStatus, get_Offence_Data } = useContext(AgencyContext);

  const [FTADate, setFTADate] = useState('');
  const [nameIdDrp, setNameIdDrp] = useState([]);
  const [lawTitleIdDrp, setLawTitleIdDrp] = useState([]);
  const [nibrsCodeDrp, setNibrsCodeDrp] = useState([]);
  const [offenderLeftSceneDrp, setOffenderLeftSceneDrp] = useState([]);
  const [categoryIdDrp, setCategoryIdDrp] = useState([]);
  const [locationIdDrp, setLocationIdDrp] = useState([]);
  const [Editval, setEditval] = useState();
  const [CrimeId, setCrimeId] = useState('');
  const [forceUsed, setForceUsed] = useState('');

  const [MainIncidentID, setMainIncidentID] = useState('');
  const [LoginAgencyID, setLoginAgencyID] = useState('');
  const [LoginPinID, setLoginPinID,] = useState('');


  const [value, setValue] = useState({
    'NIBRSCodeId': '', 'ChargeCodeID': '', 'OffenseCodeId': '', 'LawTitleId': '', 'OffenderLeftSceneId': '', 'CategoryId': '', 'PrimaryLocationId': '', 'SecondaryLocationId': '',
    // text Box
    'Fine': '', 'CourtCost': '', 'FTAAmt': '', 'LitigationTax': '', 'DamageProperty': '', 'OfRoomsInvolved': '', 'PremisesEntered': '',
    // Checkbox
    'PropertyAbandoned': '', 'IsForceused': '',  'IsIncidentCode': false,
    //Radio Button
    'AttemptComplete': 'C',
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

    if (localStoreArray) {
      if (localStoreArray.OffenceID) {
        console.log(localStoreArray.OffenceID, 'crimeupdatednew')
        setCrimeId(localStoreArray?.OffenceID);
      } else {

        setCrimeId(''); GetSingleData('');

      }
      // if (localStoreArray?.AgencyID && localStoreArray?.PINID && localStoreArray?.IncidentID) {
      //   setLoginAgencyID(localStoreArray?.AgencyID);
      //   setLoginPinID(localStoreArray?.PINID);
      //   setMainIncidentID(localStoreArray?.IncidentID);
      //   console.log(localStoreArray.OffenceID,'offenceid');   

      //   get_Offence_Count(localStoreArray?.OffenceID);
      // }
    }
  }, [localStoreArray])

  console.log(localStoreArray, 'localstoree')
  console.log(CrimeId, 'crimeid')

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
  const { ChargeCodeIDError, LawTitleIdError } = errors

  useEffect(() => {
    if (ChargeCodeIDError === 'true' && LawTitleIdError === 'true') {
      if (CrimeId) Update_Offence()
      else Add_Offense()
    }
    else if (ChargeCodeIDError === 'Required *' || LawTitleIdError === 'Required *') toastifyError('Please Fill All Required Field')
  }, [ChargeCodeIDError, LawTitleIdError])


  //----------------------------------Get_Single_Data-------------------------------------
  // useEffect(() => {
  //   if (('OffenseCrimeId')) {
  //     // setCrimeID(Decrypt_Id_Name(sessionStorage.getItem('OffenseCrimeId'), 'OforOffenseCrimeId'));
  //   } else {
  //     setCrimeID(''); setEditval()
  //   }
  // }, [])


  useEffect(() => {
    if (CrimeId) {
      GetSingleData(CrimeId);

    }
    // else{
    //   reset();
    // }
  }, [CrimeId])


  const GetSingleData = (CrimeId) => {
    console.log('blank')
    const val = { 'CrimeID': CrimeId }
    fetchPostData('Crime_FRW/GetSingleData_Crime_FRW', val)
      .then((res) => {
        console.log(res, 'response')
        if (res) {
          setEditval(res);
        } else { setEditval() }
      })
  }

  useEffect(() => {
    if (CrimeId) {
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
        NameIDDrpDwnVal(Editval[0]?.NIBRSCodeId);
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


  const reset = () => {

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

  }

  //--------------------------------------Drop_Down-List------------------------------------------
  useEffect(() => {
    LawTitleIdDrpDwnVal(); NIBRSCodeDrpDwnVal(); OffenderLeftSceneDrpDwnVal(); CategoryDrpDwnVal(); LocationIdDrpDwnVal();
  }, [])

  const LocationIdDrpDwnVal = () => {
    const val = {
      AgencyID: '',
    }
    fetchPostData('LocationType/GetDataDropDown_LocationType', val).then((data) => {
      if (data) {
        setLocationIdDrp(Comman_changeArrayFormat(data, 'LocationTypeID', 'Description'))
      } else {
        setLocationIdDrp([]);
      }
    })
  }

  const CategoryDrpDwnVal = () => {
    const val = {
      AgencyID: '',
    }
    fetchPostData('ChargeCategory/GetDataDropDown_ChargeCategory', val).then((data) => {
      if (data) {
        setCategoryIdDrp(Comman_changeArrayFormat(data, 'ChargeCategoryID', 'Description'))
      } else {
        setCategoryIdDrp([]);
      }
    })
  }

  const OffenderLeftSceneDrpDwnVal = () => {
    const val = {
      AgencyID: '',
    }
    fetchPostData('CrimeLeftScene/GetDataDropDown_CrimeLeftScene', val).then((data) => {
      if (data) {
        setOffenderLeftSceneDrp(Comman_changeArrayFormat(data, 'LeftSceneId', 'Description'))
      } else {
        setOffenderLeftSceneDrp([]);
      }
    })
  }

  const NIBRSCodeDrpDwnVal = () => {
    const val = {
      AgencyID: '',
    }
    fetchPostData('FBICodes/GetDataDropDown_FBICodes', val).then((data) => {
      if (data) {
        setNibrsCodeDrp(threeColArrayWithCode(data, 'FBIID', 'Description', 'FederalSpecificFBICode'))
      } else {
        setNibrsCodeDrp([]);
      }
    })
  }

  const LawTitleIdDrpDwnVal = () => {
    const val = {
      AgencyID: '',
    }
    fetchPostData('LawTitle/GetDataDropDown_LawTitle', val).then((data) => {
      if (data) {
        setLawTitleIdDrp(Comman_changeArrayFormat(data, 'LawTitleID', 'Description'))
      } else {
        setLawTitleIdDrp([]);
      }
    })
  }

  const NameIDDrpDwnVal = (FBIID) => {
    const val = {
      'FBIID': FBIID,
      'AgencyID': null,
    }
    fetchPostData('ChargeCodes/GetDataDropDown_ChargeCodes', val).then((data) => {
      if (data) {
        setNameIdDrp(Comman_changeArrayFormat(data, 'ChargeCodeID', 'Description'))
      } else {
        setNameIdDrp([]);
      }
    })
  }

  const changeDropDown = (e, name) => {
    if (e) {
      if (name === 'NIBRSCodeId') {
        NameIDDrpDwnVal(e.value);
        setValue({
          ...value,
          [name]: e.value,
          ['ChargeCodeID']: '',
        });
        if (e.id === '120') {
          setForceUsed(e.id);
          setValue({
            ...value,
            [name]: e.value,
          });
        } else {
          setForceUsed('');
        }
      } else {
        setValue({
          ...value,
          [name]: e.value,
        });
      }
    } else if (e === null) {
      if (name === 'NIBRSCodeId') {
        setValue({
          ...value,
          ['NIBRSCodeId']: "",
          ['ChargeCodeID']: "",
        });
        setNameIdDrp([]);
      } else {
        setValue({
          ...value,
          [name]: null
        });
      }
    } else {
      setValue({
        ...value,
        [name]: null
      });
      setForceUsed('');
      setNameIdDrp([]);
    }
  }

  const handleChange = (e) => {
    if (e.target.name === 'PropertyAbandoned' || e.target.name === 'IsForceused') {
      setValue({
        ...value,
        [e.target.name]: e.target.checked
      })
    }
    else if (e.target.name === 'OfRoomsInvolved') {
      const checkNumber = e.target.value.replace(/[^0-9\s]/g, "");
      setValue({
        ...value,
        [e.target.name]: checkNumber
      });
    }
    else if (e.target.name === 'PremisesEntered') {
      const checkNumber = e.target.value.replace(/[^0-9\s]/g, "");
      setValue({
        ...value,
        [e.target.name]: checkNumber
      });
    }
    else if (e.target.name === 'Fine' || e.target.name === 'LitigationTax' || e.target.name === 'FTAAmt' || e.target.name === 'CourtCost' || e.target.name === 'DamageProperty') {
      var ele = e.target.value.replace(/[^0-9\.]/g, "")
      if (ele.includes('.')) {
        if (ele.length === 16) {
          setValue({ ...value, [e.target.name]: ele });
        } else {
          if (ele.substr(ele.indexOf('.') + 1).slice(0, 2)) {
            const checkDot = ele.substr(ele.indexOf('.') + 1).slice(0, 2).match(/\./g)
            console.log(checkDot)
            if (!checkDot) {
              // setChangesStatus(true)
              setValue({ ...value, [e.target.name]: ele.substring(0, ele.indexOf(".")) + '.' + ele.substr(ele.indexOf('.') + 1).slice(0, 2) });
            }
            // setValue({ ...value, [e.target.name]: ele.substring(0, ele.indexOf(".")) + '.' + ele.substr(ele.indexOf('.') + 1).slice(0, 2) });
          } else { setValue({ ...value, [e.target.name]: ele }) }
        }

      } else {
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
      }
    } else {
      setValue({
        ...value,
        [e.target.name]: e.target.value
      })
    }
  }

  //-------------------------------Add-Update-------------------------------------------
  // const Add_Offense = () => {
  //   AddDeleteUpadate('Crime_FRW/Insert_Crime_FRW', value).then((res) => {
  //     toastifySuccess(res.Message);
  //     if (res.CrimeID) {
  //       setCrimeID(res.CrimeID);
  //       // sessionStorage.setItem("OffenseCrimeId", Encrypted_Id_Name(res.CrimeID, 'OforOffenseCrimeId'));
  //     }
  //     setErrors({ ...errors, ['ChargeCodeIDError']: '', });
  //   })
  // }

  // const Update_Offence = () => {
  //   AddDeleteUpadate('Crime_FRW/Update_Crime_FRW', value).then((res) => {
  //     toastifySuccess(res.Message)
  //     setErrors({ ...errors, ['ChargeCodeIDError']: '', });
  //   })
  // }
  const Add_Offense = () => {

    console.log('hello offence')
    AddDeleteUpadate('Crime_FRW/Insert_Crime_FRW', value).then((res) => {
      toastifySuccess(res.Message);
      if (res?.CrimeID) {
        storeData({ 'OffenceID': res.CrimeID, 'OffenceStatus': true });
        setCrimeId(res?.CrimeID); setOffenseID(res?.CrimeID);
        setOffenceStatus(true);
        get_Incident_Count(MainIncidentID)
      }
      setUpdateCount(updateCount + 1)
      setStatus(true)
      setChangesStatus(false)

      reset()
      setErrors({ ...errors, ['ChargeCodeIDError']: '', });
    })
  }

  const Update_Offence = () => {
    console.log('hellooffence')
    AddDeleteUpadate('Crime_FRW/Update_Crime_FRW', value).then((res) => {
      toastifySuccess(res.Message)
      setChangesStatus(false)
      setErrors({
        ...errors,
        ['ChargeCodeIDError']: '',
      })
    })
  }
  const Cancel = () => {
    navigate('/offense-main');
    // sessionStorage.removeItem('OffenseCrimeId');

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

  const startRef = React.useRef();
  const onKeyDown = (e) => {
    if (e.keyCode === 9 || e.which === 9) {
      startRef.current.setOpen(false);
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
          {
          CrimeId &&
            <>
              <Link to='/offense-tabs'>
                <div data-toggle="modal" data-target="#myModal" style={{ fontSize: 18, cursor: 'pointer', fontWeight: 'bold', background: 'cadetblue', position: 'absolute', padding: '7px 10px', right: '0px', color: '#434A54', top: '0px' }} onClick={setShowPage('MobileBasicInformation')}>
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
                  <div className="bg-line  py-1  px-0  d-flex justify-content-between align-items-center " style={{ marginTop: '-15px' }}>
                    <p className="p-0 m-0 pl-3 " style={{ fontSize: '18px' }}>Offense</p>
                  </div>
                  <div className="row">
                    <div className="col-6 col-md-6 col-lg-4 mt-2">
                      <div className=" text__dropdwon">
                        <Select
                          name='NIBRSCodeId'
                          styles={colourStyles}
                          value={nibrsCodeDrp?.filter((obj) => obj.value === value?.NIBRSCodeId)}
                          isClearable
                          options={nibrsCodeDrp}
                          onChange={(e) => changeDropDown(e, 'NIBRSCodeId')}
                          placeholder="Select..."
                        />
                        <label htmlFor="" className='pt-2'>
                          NIBRS Code
                          <span className='text-danger pl-1'>
                            *
                          </span>
                        </label>
                        {/* {errors.LawTitleIdError !== 'true' ? (
                          <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.LawTitleIdError}</span>
                        ) : null} */}
                      </div>
                    </div>
                    <div className="col-6 col-md-6 col-lg-4 mt-2">
                      <div className="text__dropdwon">
                        <Select
                          name='ChargeCodeID'
                          styles={colourStyles}
                          value={nameIdDrp?.filter((obj) => obj.value === value?.ChargeCodeID)}
                          isClearable
                          options={nameIdDrp}
                          onChange={(e) => changeDropDown(e, 'ChargeCodeID')}
                          placeholder="Select..."
                        // isDisabled={true}
                        />
                        <label className='pt-2'> Offense Code/Name
                          <span className='text-danger pl-1'>
                            *
                          </span>
                        </label>
                        {/* {errors.ChargeCodeIDError !== 'true' ? (
                          <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ChargeCodeIDError}</span>
                        ) : null} */}
                      </div>
                    </div>
                    <div className="col-6 col-md-6 col-lg-4 mt-2">
                      <div className=" text__dropdwon">
                        <Select
                          name='LawTitleId'
                          styles={customStylesWithOutColor}
                          value={lawTitleIdDrp?.filter((obj) => obj.value === value?.LawTitleId)}
                          isClearable
                          options={lawTitleIdDrp}
                          onChange={(e) => changeDropDown(e, 'LawTitleId')}
                          placeholder="Select..."
                        />
                        <label htmlFor="" className='pt-2'>Law Title</label>

                      </div>
                    </div>
                    <div className="col-6 col-md-6 col-lg-4 mt-2">
                      <div className=" text__dropdwon">
                        <Select
                          name='PrimaryLocationId'
                          styles={customStylesWithOutColor}
                          value={locationIdDrp?.filter((obj) => obj.value === value?.PrimaryLocationId)}
                          isClearable
                          options={locationIdDrp}
                          onChange={(e) => changeDropDown(e, 'PrimaryLocationId')}
                          placeholder="Select..."
                        />
                        <label htmlFor="" className='pt-2'>Primary Location</label>
                      </div>
                    </div>
                    <div className="col-6 col-md-6 col-lg-4 mt-2">
                      <div className=" text__dropdwon">
                        <Select
                          name='SecondaryLocationId'
                          styles={customStylesWithOutColor}
                          value={locationIdDrp?.filter((obj) => obj.value === value?.SecondaryLocationId)}
                          isClearable
                          options={locationIdDrp}
                          onChange={(e) => changeDropDown(e, 'SecondaryLocationId')}
                          placeholder="Select..."
                        />
                        <label htmlFor="" className='pt-2'>Secondary Location</label>
                      </div>
                    </div>
                    <div className="col-6 col-md-6 col-lg-4 mt-2">
                      <div className=" text__dropdwon">
                        <Select
                          name='OffenderLeftSceneId'
                          styles={customStylesWithOutColor}
                          value={offenderLeftSceneDrp?.filter((obj) => obj.value === value?.OffenderLeftSceneId)}
                          isClearable
                          options={offenderLeftSceneDrp}
                          onChange={(e) => changeDropDown(e, 'OffenderLeftSceneId')}
                          placeholder="Select..."
                        />
                        <label htmlFor="" className='pt-2'>Offender Left Scene</label>
                      </div>
                    </div>
                    <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1">
                      <div class="text-mobile">
                        <input type="text" name='Fine' value={'$' + value?.Fine.replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ',')} onChange={handleChange} maxlength={16} required />
                        <label className='pt-1'>Fine</label>
                      </div>
                    </div>
                    <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1">
                      <div class="text-mobile">
                        <input type="text" maxlength="4" required name='CourtCost' maxLength={20} value={'$' + value?.CourtCost.replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ',')} onChange={handleChange} />
                        <label className='pt-1'>Court Cost</label>
                      </div>
                    </div>
                    <div className="col-6 col-md-6 col-lg-4 pt-2 ">
                      <div className="text__dropdwon ">
                        <DatePicker
                          id='FTADate'
                          name='FTADate'
                          ref={startRef}
                          onKeyDown={onKeyDown}
                          popperPlacement='right'
                          onChange={(date) => { setValue({ ...value, ['FTADate']: date ? getShowingMonthDateYear(date) : null }) }}
                          dateFormat="MM/dd/yyyy"
                          isClearable={value?.FTADate ? true : false}
                          // selected={FTADate}
                          selected={value?.FTADate && new Date(value?.FTADate)}
                          maxDate={new Date()}
                          placeholderText={value?.FTADate ? value.FTADate : 'Select...'}
                          showDisabledMonthNavigation
                          autoComplete="nope"
                          showYearDropdown
                          showMonthDropdown
                          dropdownMode="select"
                          className='name-datepicker'
                        />
                        <label htmlFor="" className='pt-2'>FTA Date</label>
                      </div>
                    </div>
                    {/* <div className="col-6 col-md-6 col-lg-4 pt-2 ">
                      <div className="text__dropdwon ">
                        <DatePicker
                          id='FTADate'
                          name='FTADate'
                          ref={startRef}
                          onKeyDown={onKeyDown}
                          popperPlacement='top'
                          onChange={(date) => { setFTADate(date); setValue({ ...value, ['FTADate']: date ? getShowingMonthDateYear(date) : null }) }}
                          dateFormat="MM/dd/yyyy"
                          isClearable={value?.FTADate ? true : false}
                          selected={FTADate}
                          maxDate={new Date()}
                          placeholderText={value?.FTADate ? value.FTADate : 'Select...'}
                          showDisabledMonthNavigation
                          autoComplete="nope"
                          showYearDropdown
                          showMonthDropdown
                          dropdownMode="select"
                          className='name-datepicker'
                        />
                        <label htmlFor="" className='pt-1'>FTA Date</label>
                      </div>
                    </div> */}
                    <div className="col-6 col-md-6 col-lg-4 mt-1 pt-1">
                      <div class="text-mobile">
                        <input type="text" name='FTAAmt' value={'$' + value?.FTAAmt.replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ',')} onChange={handleChange} maxlength={20} required />
                        <label className='pt-1'>FTA Amt</label>
                      </div>

                    </div>
                    <div className="col-6 col-md-6 col-lg-4 mt-1 pt-1">
                      <div class="text-mobile">
                        <input type="text" name='LitigationTax' value={'$' + value?.LitigationTax.replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ',')} onChange={handleChange} maxlength={20} required />
                        <label className='pt-1'>Litigation Tax</label>
                      </div>
                    </div>
                    <div className="col-6 col-md-6 col-lg-4 mt-1 pt-1">
                      <div class="text-mobile">
                        <input type="text" name='DamageProperty' value={'$' + value?.DamageProperty.replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ',')} onChange={handleChange} maxlength={20} required />
                        <label className='pt-1'>Damage Property</label>
                      </div>
                    </div>
                    <div className="col-6 col-md-6 col-lg-4 pt-2 mt-1 ">
                      <div class="text-mobile">
                        <input type="text" name='OfRoomsInvolved' value={value?.OfRoomsInvolved} onChange={handleChange} maxlength="2" maxLength={4} required />
                        <label className='pt-1'># Of Rooms Involved</label>
                      </div>
                    </div>
                    <div className="col-6 col-md-6 col-lg-4 " style={{ marginTop: '8px' }}>
                      <div className=" text__dropdwon">
                        <Select
                          name='CategoryId'
                          styles={customStylesWithOutColor}
                          value={categoryIdDrp?.filter((obj) => obj.value === value?.CategoryId)}
                          isClearable
                          options={categoryIdDrp}
                          onChange={(e) => changeDropDown(e, 'CategoryId')}
                          placeholder="Select..."
                          menuPlacement='top'
                        />
                        <label htmlFor="" className='pt-2'>Category</label>
                      </div>
                    </div>
                    <div className="col-6 col-md-6 col-lg-4 pt-2 mt-1">
                      <div class="text-mobile">
                        <input type="text" name='PremisesEntered' maxLength={2} value={value?.PremisesEntered} onChange={handleChange} required />
                        <label className='pt-1'>Premises Entered</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="row px-2 " style={{ marginBottom: '-15px' }}>
                        <div className="col-6 col-md-6 col-lg-4 mt-2">
                          <div class="form-check ">
                            <input class="form-check-input" type="checkbox" name='PropertyAbandoned' checked={value?.PropertyAbandoned} value={value?.PropertyAbandoned} onChange={handleChange} id="flexCheckDefault" />
                            <label class="form-check-label" for="flexCheckDefault" style={{ fontSize: '18px' }}>
                              Property Abandoned
                            </label>
                          </div>
                        </div>
                        <div className="col-6 col-md-6 col-lg-2 mt-2">
                          <div class="form-check ">
                            <input class="form-check-input" type="checkbox" name='IsForceused' checked={value?.IsForceused} value={value?.IsForceused} disabled={forceUsed === '120' ? false : true} onChange={handleChange} id="flexCheckDefault3" />
                            <label class="form-check-label" for="flexCheckDefault3" style={{ fontSize: '18px' }}>
                              Force Used
                            </label>
                          </div>
                        </div>
                        {/* -------------radio button---------------*/}
                        <div className="form-check mt-2 px-4 col-6 col-md-6 col-lg-2" >
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
                        <div className="form-check mt-2  " >
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
                    <div className="col-12 text-right " style={{ marginBottom: '-15px' }}>
                      {/* <button type="button" className="btn btn-sm btn-success pl-2 new-button mr-1" onClick={Add_Offense} >Save</button> */}
                      {
                        CrimeId ?
                          <button type="button" onClick={() => check_Validation_Error()} className="btn btn-lg btn-success pl-2 new-button mr-1">Update</button>
                          :
                          <button type="button" onClick={() => check_Validation_Error()} className="btn btn-lg btn-success pl-2 new-button mr-1">Save</button>
                      }
                      <button type="button" className="btn btn-lg  btn-success mx-1 new-button" onClick={() => { Cancel() }} >Close</button>
                    </div>
                    <MobileFieldColor />
                    {/* <IdentifyFieldColor /> */}
                    {/* <ChangesModal func={check_Validation_Error} /> */}
                  </div >
                </div >
              </div >
            </div >

          </div >
        </div >
      </div >
    </>
  )
}

export default OffenseHome

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