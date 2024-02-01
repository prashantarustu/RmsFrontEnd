import React from 'react'
import Select from "react-select";
import DatePicker from "react-datepicker";
import { useState } from 'react';
import { Decrypt_Id_Name, Encrypted_Id_Name, getShowingMonthDateYear } from '../../../../../../Common/Utility';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import IdentifyFieldColor from '../../../../../../Common/IdentifyFieldColor';
import { useEffect } from 'react';
import { AddDeleteUpadate, fetchPostData } from '../../../../../../hooks/Api';
import { Comman_changeArrayFormat, threeColArrayWithCode } from '../../../../../../Common/ChangeArrayFormat';
import { toastifySuccess } from '../../../../../../Common/AlertMsg';
import { useContext } from 'react';
import { AgencyContext } from '../../../../../../../Context/Agency/Index';
import { RequiredFieldIncident } from '../../../../../Utility/Personnel/Validation';
import FindListDropDown from '../../../../../../Common/FindListDropDown';
import { ArrChargeListDropDownArray } from '../../../../../../Utility/ListDropDownArray/ListDropArray';

const Home = (props) => {

  // const { setChargeID, ChargeID } = props;

  const useQuery = () => new URLSearchParams(useLocation().search);

  const navigate = useNavigate();
  let openPage = useQuery().get('page');

  const { ArresteName, ArrestID, get_ArrestCharge_Count, get_Warrent_Count, WarrantID, setChangesStatus, setIncStatus, incidentNumber, setIncidentNumber, updateCount, setUpdateCount, localStoreArray, setLocalStoreArray, get_LocalStorage, deleteStoreData, storeData } = useContext(AgencyContext);

  const [chargeCodeDrp, setChargeCodeDrp] = useState([]);
  const [nibrsDrpData, setNibrsDrpData] = useState([]);
  const [ucrclearDrp, setUcrClearDrp] = useState([]);
  const [arrestNameID, setArrestNameID] = useState([])
  const [Editval, setEditval] = useState();
  const [warrantNumber, setWarrantNumber] = useState('')
  const [name, setName] = useState('')


  const [ChargeID, setChargeID] = useState();
  const [MainIncidentID, setMainIncidentID] = useState('');
  const [LoginAgencyID, setLoginAgencyID] = useState('');
  const [LoginPinID, setLoginPinID,] = useState('');

  const [value, setValue] = useState({
    'NameID': '',
    // 'WarrantNumber': '',
    'WarrantID': '',
    'IncidentID': '',
    'CreatedByUserFK': '',
    'Count': '',
    'ChargeCodeID': '',
    'NIBRSID': '',
    'UCRClearID': '',
    'ChargeID': '',
    'ModifiedByUserFK': '',
    'Name': '',
  });

  const [errors, setErrors] = useState({
    'NIBRSIDError': '',
    'ChargeCodeIDError': '',
  })

  const localStore = {
    Value: "",
    UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
    Key: JSON.stringify({ AgencyID: "", PINID: "", IncidentID: '', ChargeID: '', }),
  }

  useEffect(() => {
    if (!localStoreArray?.AgencyID || !localStoreArray?.PINID) {
      get_LocalStorage();
    }
  }, []);

  // Onload Function
  useEffect(() => {
    console.log(localStoreArray)
    if (localStoreArray) {
      if (localStoreArray?.AgencyID && localStoreArray?.PINID) {
        setLoginAgencyID(localStoreArray?.AgencyID);
        setLoginPinID(localStoreArray?.PINID);
        setValue({ ...value, 'IncidentID': localStoreArray?.IncidentID, 'IncidentID': localStoreArray?.IncidentID, 'WarrantID': localStoreArray?.WarrantID, 'CreatedByUserFK': localStoreArray?.PINID, 'AgencyID': localStoreArray?.AgencyID, 'Name': localStoreArray?.ArresteeName, 'NameID': localStoreArray?.ArresteeID, }
        )
        if (localStoreArray.WarrantNumber) { setWarrantNumber(localStoreArray.WarrantNumber) } else { setWarrantNumber('') }
        if (localStoreArray.IncidentID) { setMainIncidentID(localStoreArray?.IncidentID); } else { setMainIncidentID('') }
        if (localStoreArray.ChargeID) { setChargeID(localStoreArray?.ChargeID); } else { setChargeID('') }
      } get_ArrestCharge_Count(localStoreArray?.ChargeID)
    }
  }, [localStoreArray])

  const check_Validation_Error = (e) => {
    if (RequiredFieldIncident(value.NIBRSID)) {
      setErrors(prevValues => { return { ...prevValues, ['NIBRSIDError']: RequiredFieldIncident(value.NIBRSID) } })
    }
    if (RequiredFieldIncident(value.ChargeCodeID)) {
      setErrors(prevValues => { return { ...prevValues, ['ChargeCodeIDError']: RequiredFieldIncident(value.ChargeCodeID) } })
    }
  }

  // Check All Field Format is True Then Submit 
  const { ChargeCodeIDError, NIBRSIDError } = errors

  useEffect(() => {
    if (ChargeCodeIDError === 'true' && NIBRSIDError === 'true') {
      if (ChargeID) update_Arrest_Charge()
      else Add_Charge_Data()
    }
  }, [ChargeCodeIDError, NIBRSIDError])

  useEffect(() => {
    if (ChargeID) {
      GetSingleData(ChargeID)
    }
  }, [ChargeID])

  const GetSingleData = (ChargeID) => {
    const val = {
      'ChargeID': ChargeID,
    }
    fetchPostData('ArrestCharge/GetSingleData_ArrestCharge', val)
      .then((res) => {
        if (res) {
          setEditval(res);
        } else { setEditval([]) }
      })
  }

  useEffect(() => {
    if (ChargeID) {
      setValue({
        ...value,
        'WarrantNumber': Editval[0]?.WarrantNumber,
        'Count': Editval[0]?.Count ? Editval[0]?.Count : '',
        'Name': Editval[0]?.Name,
        'ChargeCodeID': Editval[0]?.ChargeCodeID,
        'NIBRSID': Editval[0]?.NIBRSID,
        'UCRClearID': Editval[0]?.UCRClearID,
        'ChargeID': Editval[0]?.ChargeID,
        'ModifiedByUserFK': LoginPinID,
      });
      get_ChargeCode_Drp_Data(Editval[0]?.NIBRSID);
    } else {
      setValue({
        ...value,
        'Count': '',
        'ChargeCodeID': '',
        'NIBRSID': '',
        'UCRClearID': '',
        'ChargeID': '',
      })
    }
  }, [Editval])

  useEffect(() => {
    get_NIBRS_Drp_Data(LoginAgencyID); get_UcrClear_Drp_Data(LoginAgencyID);
    //  get_Arrestee_Drp_Data();
  }, [LoginAgencyID])

  const get_UcrClear_Drp_Data = (LoginAgencyID) => {
    const val = {
      AgencyID: LoginAgencyID,
    }
    fetchPostData('UCRClear/GetDataDropDown_UCRClear', val).then((data) => {
      if (data) {
        setUcrClearDrp(Comman_changeArrayFormat(data, 'UCRClearID', 'Description'));
      }
      else {
        setUcrClearDrp([])
      }
    })
  };

  const get_NIBRS_Drp_Data = (LoginAgencyID) => {
    const val = {
      AgencyID: LoginAgencyID,
    }
    fetchPostData('FBICodes/GetDataDropDown_FBICodes', val).then((data) => {
      if (data) {
        setNibrsDrpData(threeColArrayWithCode(data, 'FBIID', 'Description', 'FederalSpecificFBICode'))
      } else {
        setNibrsDrpData([]);
      }
    })
  };

  const get_ChargeCode_Drp_Data = (FBIID) => {
    const val = {
      FBIID: FBIID
    }
    fetchPostData('ChargeCodes/GetDataDropDown_ChargeCodes', val).then((data) => {
      if (data) {
        setChargeCodeDrp(Comman_changeArrayFormat(data, 'ChargeCodeID', 'Description'))
      } else {
        setChargeCodeDrp([]);
      }
    })
  };

  const get_Arrestee_Drp_Data = () => {
    const val = {
      'IncidentID': MainIncidentID,
    }
    fetchPostData('Arrest/GetDataDropDown_Arrestee', val).then((data) => {
      if (data) {
        setArrestNameID(Comman_changeArrayFormat(data, 'NameID', 'Arrestee_Name'));
      }
      else {
        setArrestNameID([])
      }
    })
  };

  const ChangeDropDown = (e, name) => {
    if (e) {
      if (name === 'NIBRSID') {
        get_ChargeCode_Drp_Data(e.value);
        setValue({
          ...value,
          [name]: e.value,
          ['ChargeCodeID']: '',
        });
      } else {
        setValue({
          ...value,
          [name]: e.value,
        });
      }
    } else if (e === null) {
      if (name === 'NIBRSID') {
        setValue({
          ...value,
          ['NIBRSID']: "",
          ['ChargeCodeID']: "",
        });
        get_ChargeCode_Drp_Data([]);
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
      })
    }
  }

  const HandleChange = (e) => {
    setValue({
      ...value,
      [e.target.name]: e.target.value,
    });
  };

  const Add_Charge_Data = () => {
    AddDeleteUpadate('ArrestCharge/Insert_ArrestCharge', value).then((res) => {
      if (res.success) {
        toastifySuccess(res.Message)
        get_Warrent_Count(WarrantID)
        get_ArrestCharge_Count(ChargeID)
        setChangesStatus(false)
        if (res.ChargeID) {
          setChargeID(res.ChargeID);
          storeData({ 'ChargeID': res.ChargeID, 'ArrestChargeStatus': true });
        }
        setUpdateCount(updateCount + 1)
        setErrors({
          ...errors,
          ['ChargeCodeIDError']: ''
        })
      }
    })
  }

  const update_Arrest_Charge = () => {
    AddDeleteUpadate('ArrestCharge/Update_ArrestCharge', value).then((res) => {
      toastifySuccess(res.Message);
      setErrors({
        ...errors,
        ['ChargeCodeIDError']: ''
      })
    })
  }

  const OnClose = () => {
    navigate('/warrant-tab')
    setChargeID(ChargeID)
    deleteStoreData({ 'ChargeID': '', 'ArrestChargeStatus': '', 'ArrestChargeStatus': '' });
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

  // const startRef = React.useRef();
  // const startRef1 = React.useRef();

  // const onKeyDown = (e) => {
  //   if (e.keyCode === 9 || e.which === 9) {
  //     startRef.current.setOpen(false);
  //     startRef1.current.setOpen(false);
  //   }
  // };

  return (
    <>
      <div className="col-12 col-md-12 pt-2 p-0" >
        <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center ">
          <p className="p-0 m-0">Charge</p>
          <FindListDropDown array={ArrChargeListDropDownArray} />
        </div>
        <div className="row ">
          <div className="col-6  col-md-6 col-lg-6  mt-1 pt-1" >
            <div className="text-field">
              <input type="text" className='readonlyColor' name='Name'value={value?.Name} required readOnly />
              <label htmlFor="">Name</label>
            </div>
          </div>
          <div className="col-3  col-md-3 col-lg-3  mt-1 pt-1" >
            <div className="text-field">
              <input type="text" className='readonlyColor' name='IncidentID' value={incidentNumber ? incidentNumber : ''} required readOnly />
              <label htmlFor="">Incident Number</label>
            </div>
          </div>
          <div className="col-3  col-md-3 col-lg-3  mt-1 pt-1" >
            <div className="text-field">
              <input type="text" className='readonlyColor' name='WarrantNumber'
                value={warrantNumber ? warrantNumber : ''}
                required readOnly />
              <label htmlFor="">Warrant Number</label>
            </div>
          </div>
          <div className="col-6 col-md-4 col-lg-4 mt-2">
            <div className=" dropdown__box">
              <Select
                styles={colourStyles}
                name="NIBRSID"
                value={nibrsDrpData?.filter((obj) => obj.value === value?.NIBRSID)}
                isClearable
                options={nibrsDrpData}
                onChange={(e) => { ChangeDropDown(e, 'NIBRSID') }}
                placeholder="Select..."
              />
              <label>NIBRS Code</label>
              {errors.NIBRSIDError !== 'true' ? (
                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.NIBRSIDError}</span>
              ) : null}
            </div>
          </div>
          <div className="col-6 col-md-4 col-lg-4 mt-2">
            <div className=" dropdown__box">
              <Select
                name="ChargeCodeID"
                value={chargeCodeDrp?.filter((obj) => obj.value === value?.ChargeCodeID)}
                styles={colourStyles}
                isClearable
                options={chargeCodeDrp}
                onChange={(e) => { ChangeDropDown(e, 'ChargeCodeID') }}
                placeholder="Select..."
              />
              <label>Charge Code/Description</label>
              {errors.ChargeCodeIDError !== 'true' ? (
                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ChargeCodeIDError}</span>
              ) : null}
            </div>
          </div>
          <div className="col-6  col-md-4 col-lg-4  mt-1 pt-1" >
            <div className="text-field">
              <input type="text" name='Count' id='Count' onChange={HandleChange} value={value?.Count} className='' />
              <label htmlFor="">Count</label>
            </div>
          </div>
          <div className="col-6 col-md-6 col-lg-3 mt-2">
            <div className=" dropdown__box">
              <Select
                styles={customStylesWithOutColor}
                name="UCRClearID"
                value={ucrclearDrp?.filter((obj) => obj.value === value?.UCRClearID)}
                isClearable
                options={ucrclearDrp}
                onChange={(e) => { ChangeDropDown(e, 'UCRClearID') }}
                placeholder="Select..."
              />
              <label>UCR Clear</label>
            </div>
          </div>
          <div className="col-12 text-right mt-2 p-0">
            {
              ChargeID ?
                <>
                  <button type="button" className="btn btn-sm btn-success  mr-1" onClick={() => { check_Validation_Error(); }}>Update</button>
                </>
                :
                <>
                  <button type="button" className="btn btn-sm btn-success" onClick={() => { check_Validation_Error(); }}>Save</button>
                </>
            }
            <button type="button" className="btn btn-sm btn-success mx-1" onClick={() => { OnClose(); }} >Close</button>
          </div>
          <IdentifyFieldColor />
        </div>
      </div>
    </>
  )
}

export default Home

