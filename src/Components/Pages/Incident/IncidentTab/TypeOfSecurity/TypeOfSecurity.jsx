import React, { useRef } from 'react'
import { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import Select from "react-select";
import { toastifySuccess } from '../../../../Common/AlertMsg';
import { CommanchangeArrayFormat_WithFilter, Comman_changeArrayFormat } from '../../../../Common/ChangeArrayFormat';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import { Decrypt_Id_Name } from '../../../../Common/Utility';
import { fetchPostData, fetchData, AddDeleteUpadate, ScreenPermision } from '../../../../hooks/Api';
import { RequiredField, RequiredFieldIncident } from '../../../Utility/Personnel/Validation';
import FindListDropDown from '../../../../Common/FindListDropDown';
import { IncTypeListDropDownArray } from '../../../../Utility/ListDropDownArray/ListDropArray';
import Loader from '../../../../Common/Loader';
import { useContext } from 'react';
import { AgencyContext } from '../../../../../Context/Agency/Index';

const TypeOfSecurity = () => {

  const SelectedValue = useRef();
  const { get_IncidentTab_Count, localStoreArray, setLocalStoreArray, get_LocalStorage, } = useContext(AgencyContext);

  const [TypeOfSecurityData, setTypeOfSecurityData] = useState();
  const [TypeOfSecurityList, setTypeOfSecurityList] = useState([]);
  const [SecurityId, setSecurityId] = useState();
  const [editData, setEditData] = useState();
  const [status, setStatus] = useState(false);
  const [loder, setLoder] = useState(false);

  const [LoginAgencyID, setLoginAgencyID] = useState('');
  const [incidentID, setIncidentID] = useState('');
  const [LoginPinID, setLoginPinID] = useState('');
  //screen permission 
  const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState();

  const [value, setValue] = useState({
    'SecurityId': '', 'SecurityIdName': '',
    'IncidentSecurityID': '',
    'ModifiedByUserFK': '',
    'IncidentId': '',
    'CreatedByUserFK': '',
  })

  const localStore = {
    Value: "",
    UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
    Key: JSON.stringify({ AgencyID: "", PINID: "", IncidentID: '' }),
  }

  useEffect(() => {
    if (!localStoreArray.AgencyID || !localStoreArray.PINID) {
      get_LocalStorage(localStore);
    }
  }, []);

  // Onload Function
  useEffect(() => {
    if (localStoreArray) {
      if (localStoreArray?.AgencyID && localStoreArray?.PINID) {
        setLoginAgencyID(localStoreArray?.AgencyID);
        setLoginPinID(localStoreArray?.PINID);
        setIncidentID(localStoreArray?.IncidentID);
        get_Security_DropDown(localStoreArray?.IncidentID); get_Security_Data(localStoreArray?.IncidentID);
        getScreenPermision(localStoreArray?.AgencyID, localStoreArray?.PINID);
      }
    }
  }, [localStoreArray])

  useEffect(() => {
    if (incidentID) setValue(pre => { return { ...pre, 'IncidentId': incidentID, 'CreatedByUserFK': LoginPinID } })
  }, [incidentID]);

  const [errors, setErrors] = useState({
    'TypeOfSecError': '',
  })

  useEffect(() => {
    if (editData) {
      setValue({
        ...value,
        // 'SecurityId':editData?.SecurityId,'SecurityIdName':editData?.SecurityId ? CommanchangeArrayFormat_WithFilter([editData], 'SecurityId', TypeOfSecurityList ) :'',
        // 'IncidentSecurityID':editData?.IncidentSecurityID,
      })
    } else {
      setValue({
        ...value,
        'SecurityId': '', 'SecurityIdName': '', 'IncidentSecurityID': '',
      })
    }
  }, [editData])

  const check_Validation_Error = (e) => {
    if (RequiredFieldIncident(value.SecurityId)) {
      setErrors(prevValues => { return { ...prevValues, ['TypeOfSecError']: RequiredFieldIncident(value.SecurityId) } })
    }
  }

  // Check All Field Format is True Then Submit 
  const { TypeOfSecError } = errors

  useEffect(() => {
    if (TypeOfSecError === 'true') {
      if (status) UpdateTypeOfSecurity();
      else AddTypeOfSecurity();
    }
  }, [TypeOfSecError])

  const getScreenPermision = (LoginAgencyID, LoginPinID) => {
    ScreenPermision("I030", LoginAgencyID, LoginPinID).then(res => {
      if (res) {
        setEffectiveScreenPermission(res)
      } else {
        setEffectiveScreenPermission([])
      }
    });
  }

  const get_Security_Data = (incidentID) => {
    const val = {
      'IncidentId': incidentID,
    }
    fetchPostData('TypeOfSecurity/GetDataTypeOfSecurity', val).then((res) => {
      if (res) {
        setTypeOfSecurityData(res); setLoder(true)
      } else {
        setTypeOfSecurityData([]); setLoder(true)
      }
    })
  }

  //--------Security_fetchData----------//
  const get_Security_DropDown = (incidentID) => {
    const val = {
      'IncidentId': incidentID,
    }
    fetchPostData('TypeOfSecurity/GetData_InsertTypeOfSceurity', val).then((data) => {
      if (data) {
        setTypeOfSecurityList(Comman_changeArrayFormat(data, 'SecurityId', 'Description'));
      }
      else {
        setTypeOfSecurityList([])
      }
    })
  }

  const ChangeDropDown = (e, name) => {
    if (e) {
      setValue({
        ...value,
        [name]: e.value
      })
    } else setValue({
      ...value,
      [name]: null
    })
  }

  const columns = [
    {
      name: 'Description',
      selector: (row) => row.Security_Description,
      sortable: true
    },
    {
      name: <p className='text-end' style={{ position: 'absolute', top: 8, left: '15px' }}>Delete</p>,
      cell: row => <>
        <div style={{ position: 'absolute', top: 4, }}>

          {/* {
          EffectiveScreenPermission ? EffectiveScreenPermission[0]?.Changeok ?
          <Link to={''} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" onClick={() => { setEditVal(row) }}>
            <i className="fa fa-edit"></i>
          </Link>
            : <></>
            : <Link to={''} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" onClick={() => { setEditVal(row) }}>
            <i className="fa fa-edit"></i>
          </Link>
        } */}
          {
            EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DeleteOK ?
              <Link to={`#`} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" onClick={() => { setSecurityId(row.IncidentSecurityID) }} data-toggle="modal" data-target="#DeleteModal">
                <i className="fa fa-trash"></i>
              </Link>
              : <></>
              : <Link to={`#`} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" onClick={() => { setSecurityId(row.IncidentSecurityID) }} data-toggle="modal" data-target="#DeleteModal">
                <i className="fa fa-trash"></i>
              </Link>
          }
        </div>
      </>
    }
  ]

  const setEditVal = (row) => {
    setEditData(row)
    setSecurityId(row.IncidentSecurityId)
    setStatus(true)
  }

  const onClear = () => {
    SelectedValue?.current?.clearValue();
  };

  const AddTypeOfSecurity = () => {
    AddDeleteUpadate('TypeOfSecurity/InsertTypeOfSecurity', value).then((res) => {
      if (res.success) {
        toastifySuccess(res.Message);
        get_Security_DropDown(incidentID);
        get_IncidentTab_Count(incidentID);
        get_Security_Data(incidentID);
        onClear();
        setErrors({
          ['TypeOfSecError']: '',
        })
      } else console.log("Somthing Wrong");
    })
  }

  const UpdateTypeOfSecurity = () => {
    AddDeleteUpadate('TypeOfSecurity/UpdateTypeOfSecurity', value).then((res) => {
      if (res.success) {
        toastifySuccess(res.Message);
        get_Security_DropDown(incidentID);
        get_Security_Data(incidentID);
        setErrors({
          ['TypeOfSecError']: '',
        })
      } else console.log("Somthing Wrong");
    })
  }

  const DeleteTypeOfSecurity = () => {
    const val = {
      'IncidentSecurityID': SecurityId,
      'DeletedByUserFK': LoginPinID,
    }
    AddDeleteUpadate('TypeOfSecurity/DeleteTypeOfSecurity', val).then((res) => {
      if (res.success) {
        toastifySuccess(res.Message);
        get_IncidentTab_Count(incidentID);
        get_Security_DropDown(incidentID);
        get_Security_Data(incidentID);
      } else console.log("Somthing Wrong");
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

  return (
    <>
      <div className="col-md-12 mt-2">
        <div className="bg-line text-white py-1 px-2  d-flex justify-content-between align-items-center">
          <p className="p-0 m-0 d-flex align-items-center">
            Type Of Security
          </p>
          <FindListDropDown
            array={IncTypeListDropDownArray}
          />
        </div>
        <div className="row px-1">
          <div className="col-12 col-md-6 col-lg-4 mt-5 pt-1  dropdown__box">
            {
              value?.SecurityIdName ?
                <Select
                  name='SecurityId'
                  styles={colourStyles}
                  isClearable
                  defaultValue={value?.SecurityIdName}
                  options={TypeOfSecurityList}
                  onChange={(e) => ChangeDropDown(e, 'SecurityId')}
                  placeholder="Select.."
                />
                :
                <>
                  <Select
                    name='SecurityId'
                    styles={colourStyles}
                    isClearable
                    options={TypeOfSecurityList}
                    onChange={(e) => ChangeDropDown(e, 'SecurityId')}
                    placeholder="Select.."
                    ref={SelectedValue}
                  />
                </>
            }
            <label htmlFor="" className='pt-1'>Type Of Security</label>
            {errors.TypeOfSecError !== 'true' ? (
              <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.TypeOfSecError}</span>
            ) : null}
          </div>
          {/* <div className="col-6 col-md-6 col-lg-8 p-0" style={{ marginTop: '3px' }}>
            {
              status ?
                <>
                  <Link to=''>
                    <button type="button" onClick={() => { check_Validation_Error() }} className="btn btn-md btn-success pl-2 text-center">Update</button>
                  </Link>
                </>
                :
                <>
                  {
                    EffectiveScreenPermission ? EffectiveScreenPermission[0]?.AddOK ?
                      <Link to=''>
                        <button type="button" className="btn btn-sm btn-success pl-2 text-center" onClick={() => { check_Validation_Error(); }}>Save</button>
                      </Link>
                      : <></>
                      : <Link to=''>
                        <button type="button" className="btn btn-sm btn-success pl-2 text-center" onClick={() => { check_Validation_Error(); }}>Save</button>
                      </Link>
                  }
                </>
            }
          </div> */}
          <div className="col-6 col-md-6 col-lg-8 p-0">
            {
              EffectiveScreenPermission ? EffectiveScreenPermission[0]?.AddOK ?
                <div className="col-6 col-md-6 col-lg-8 mt-3 pt-1 p-0">
                  <button type="button" className="btn btn-sm btn-success mx-1 py-1 text-center" onClick={() => { check_Validation_Error(); }}>Save</button>
                </div>
                : <></>
                : <div className="col-6 col-md-6 col-lg-8 mt-3 pt-1 p-0">
                  <button type="button" className="btn btn-sm btn-success mx-1 py-1 text-center" onClick={() => { check_Validation_Error(); }}>Save</button>
                </div>
            }
            {/* <div className="col-6 col-md-6 col-lg-8 mt-3 pt-1 p-0">
            <button type="button" className="btn btn-sm btn-success mx-1 py-1 text-center" onClick={() => { check_Validation_Error(); }}>Save</button>
          </div> */}
          </div>
        </div>
      </div>
      <div className="col-12 ">
        {
          loder ?
            <DataTable
              columns={columns}
              data={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? TypeOfSecurityData : '' : TypeOfSecurityData}
              pagination
              dense
              selectableRowsHighlight
              highlightOnHover
              noDataComponent={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
            />
            :
            <Loader />
        }
      </div>
      <DeletePopUpModal func={DeleteTypeOfSecurity} />
    </>
  )
}

export default TypeOfSecurity

