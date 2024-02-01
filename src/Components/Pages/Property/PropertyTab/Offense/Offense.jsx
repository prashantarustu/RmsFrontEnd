import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Decrypt_Id_Name } from '../../../../Common/Utility';
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api';
import { useState } from 'react';
import DataTable from 'react-data-table-component';
import { useEffect } from 'react';
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import Offense_Add_Up from './Offense_Add_Up';
import { useContext } from 'react';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { RequiredFieldIncident } from '../../../Utility/Personnel/Validation';
import Loader from '../../../../Common/Loader';
import { Comman_changeArrayFormat } from '../../../../Common/ChangeArrayFormat';

const Offense = () => {

  const { get_Property_Count, localStoreArray, setLocalStoreArray, get_LocalStorage, setIncidentStatus } = useContext(AgencyContext);
  const SelectedValue = useRef();

  const [ownerData, setOwnerData] = useState();
  const [status, setStatus] = useState(false);
  const [modal, setModal] = useState(false)
  const [propertyOffenseID, setpropertyOffenseID] = useState();
  const [updateStatus, setUpdateStatus] = useState(0)
  //screen permission 
  const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState();
  const [deleteStatus, setDeleteStatus] = useState(false)
  const [Editval, setEditval] = useState();
  const [propertyID, setPropertyID] = useState();
  const [OffenseID, setOffenseID] = useState();
  const [masterPropertyID, setMasterPropertyID] = useState('');
  const [MainIncidentID, setMainIncidentID] = useState('');
  const [LoginAgencyID, setLoginAgencyID] = useState('');
  const [LoginPinID, setLoginPinID,] = useState('');
  const [ownerIdDrp, setOwnerIdDrp] = useState([]);
  const [filterData, setfilterDta] = useState()
  const [loder, setLoder] = useState(false)

  const [value, setValue] = useState({
    'MasterPropertyID': '',
    'PropertyID': '',
    'labal': '',
    'IncidentID': '',
    'OffenseID': '',
    'CreatedByUserFK': '',
  })

  const [errors, setErrors] = useState({
    'OwnerIDError': '',
  })

  // Onload Function
  useEffect(() => {
    if (localStoreArray) {
      if (localStoreArray?.AgencyID && localStoreArray?.PINID) {
        setLoginAgencyID(localStoreArray?.AgencyID);
        setLoginPinID(parseInt(localStoreArray?.PINID));
        setMainIncidentID(parseInt(localStoreArray?.IncidentID));
        setPropertyID(parseInt(localStoreArray.PropertyID))
        if (localStoreArray.PropertyID) get_Data_Owner(parseInt(localStoreArray.PropertyID), parseInt(localStoreArray?.IncidentID));
      }
      setIncidentStatus(true);
    }
  }, [localStoreArray]);

  useEffect(() => {
    if (!localStoreArray?.AgencyID || !localStoreArray?.PINID || !localStoreArray.IncidentID || !localStoreArray.IncidentStatus) {
      get_LocalStorage();
    }
  }, []);

  useEffect(() => {
    setValue({ ...value, 'IncidentID': MainIncidentID, 'PropertyID': propertyID, 'CreatedByUserFK': LoginPinID, 'MasterPropertyID': masterPropertyID, })
  }, [propertyID, updateStatus]);

  const check_Validation_Error = (e) => {
    if (RequiredFieldIncident(value.OffenseID)) {
      setErrors(prevValues => { return { ...prevValues, ['OwnerIDError']: RequiredFieldIncident(value.OffenseID) } })
    }
  }

  // Check All Field Format is True Then Submit 
  const { OwnerIDError } = errors

  useEffect(() => {
    if (propertyID && MainIncidentID) {
      get_Data_Owner(propertyID, MainIncidentID);
    }
  }, [propertyID])

  useEffect(() => {
    if (MainIncidentID) {
      get_OwnerID_Drp(MainIncidentID);
    }
  }, [MainIncidentID])

  useEffect(() => {
    if (OwnerIDError === 'true') {
      Add_Owner()
    }
  }, [OwnerIDError])

  const get_Data_Owner = (propertyID, MainIncidentID) => {
    const val = {
      'PropertyID': propertyID,
      'IncidentID': MainIncidentID,
      'OffenseID': 0,
    }
    fetchPostData('PropertyOffense/GetData_PropertyOffense', val).then((res) => {
      if (res) {
        console.log(res);
        setOwnerData(res);
      } else {
        setOwnerData([]);
      }
    })
  }

  const get_OwnerID_Drp = (MainIncidentID) => {
    const val = {
      'IncidentID': MainIncidentID,
      'OffenseID': 0,
    }
    fetchPostData('PropertyOffense/GetDataDropDown_PropertyOffense', val).then((res) => {
      if (res) {
        console.log(res);
        setfilterDta(res);
        setOwnerIdDrp(Comman_changeArrayFormat(res, 'CrimeID', 'Offense_Description'));

      } else {
        setOwnerIdDrp([]);
      }
    })
  }

  // useEffect(() => {
  //   if (propertyOffenseID && status) {
  //     GetSingleData(propertyOffenseID)
  //   }
  // }, [propertyOffenseID])

  // const GetSingleData = (propertyOffenseID) => {
  //   const val = { 'propertyOffenseID': propertyOffenseID }
  //   fetchPostData('PropertyOffense/GetSingleData_PropertyOffense', val)
  //     .then((res) => {
  //       if (res)
  //         setEditval(res)
  //       else setEditval()
  //     })
  // }
  // useEffect(() => {
  //   if (propertyOffenseID) {
  //     setValue({
  //       ...value,
  //       'PropertyOffenseID': propertyOffenseID,
  //       'OffenseID': Editval[0]?.OffenseID,
  //       'ModifiedByUserFK': LoginPinID,
  //     })
  //   } else {
  //     setValue({
  //       ...value,
  //       'OffenseID': '',
  //     })
  //   }
  // }, [Editval])

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

  const Add_Owner = () => {
    var result = ownerData?.find(item => {
      if (item.OffenseID === value.OffenseID) {
        return true
      } else return false
    });
    if (result) {
      toastifyError('Offence Already Exists');
      setErrors({
        ...errors,
        ['OwnerIDError']: '',
      })
    } else if (value.OffenseID !== '') {
      AddDeleteUpadate('PropertyOffense/Insert_PropertyOffense', value).then((res) => {
        toastifySuccess(res.Message);
        get_Property_Count(propertyID);
        get_Data_Owner(propertyID, MainIncidentID);
        get_OwnerID_Drp(MainIncidentID);
        onClear();
        setErrors({ ...errors, ['OwnerIDError']: '', })
      })
    }
  }

  const onClear = () => {
    SelectedValue?.current?.clearValue();
    setValue(pre => { return { ...pre, ['OffenseID']: '', ['propertyOffenseID']: '', ['labal']: '' } });
  };

  // const Update_Owner = () => {
  //   var result = ownerData?.find(item => {
  //     if (item.OffenseID !== value.OffenseID) {
  //       return false
  //     } else return true
  //   });
  //   if (result) {
  //     toastifyError('Offence Already Exists');
  //     setErrors({
  //       ...errors,
  //       ['OwnerIDError']: '',
  //     })
  //   } else if (value.OffenseID !== '') {
  //     AddDeleteUpadate('PropertyOffense/Update_PropertyOffense', value).then((res) => {
  //       toastifySuccess(res.Message);
  //       get_Data_Owner(propertyID);
  //       get_OwnerID_Drp(MainIncidentID);
  //       // Reset();
  //       setErrors({
  //         ...errors,
  //         ['OwnerIDError']: '',
  //       })
  //       setModal(false);
  //       setStatus(false);
  //     })
  //   } else {
  //     toastifyError('Offence Can`t be empty');
  //     setErrors({
  //       ...errors,
  //       ['OwnerIDError']: '',
  //     })
  //   }
  // }

  const columns = [
    {
      name: 'Offense Name',
      selector: (row) => row.Offense_Description,
      sortable: true
    },
    {
      name: 'Attempt/Complete',
      selector: (row) => row.AttemptComplete,
      sortable: true
    },
    {
      name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 0 }}>Delete</p>,
      cell: row => <>
        <div className="div" style={{ position: 'absolute', top: 4, right: 5 }}>
          {
            EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DeleteOK ?
              <Link to={`#`} onClick={() => { setDeleteStatus(true); setpropertyOffenseID(row.PropertyOffenseID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                <i className="fa fa-trash"></i>
              </Link>
              : <></>
              : <Link to={`#`} onClick={() => { setDeleteStatus(true); setpropertyOffenseID(row.PropertyOffenseID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                <i className="fa fa-trash"></i>
              </Link>
          }
        </div>
      </>
    }
  ]

  // const set_Edit_Value = (e, row) => {
  //   setStatus(true);
  //   setModal(true)
  //   setUpdateStatus(updateStatus + 1);
  //   setpropertyOffenseID(row.PropertyOffenseID)
  // }


  // const setStatusFalse = (e) => {
  //   setStatus(false); setUpdateStatus(updateStatus + 1);
  //   setModal(true); setpropertyOffenseID('')
  // }

  const DeletePin = () => {
    const val = {
      'propertyOffenseID': propertyOffenseID,
      'DeletedByUserFK': LoginPinID,
    }
    AddDeleteUpadate('PropertyOffense/Delete_PropertyOffense', val).then((res) => {
      if (res) {
        toastifySuccess(res.Message);
        get_Property_Count(propertyID);
        setDeleteStatus(false)
        get_OwnerID_Drp(MainIncidentID);
        get_Data_Owner(propertyID, MainIncidentID);
        // get_Data_Owner(propertyID); 
        // setpropertyOffenseID('')
      } else console.log("Somthing Wrong");
    })
  }

  const tableCustomStyles = {
    rows: {
      style: {
        border: '3px solid aliceblue',
      },
    },
    headCells: {
      style: {
        fontWeight: 'bold',
        Color: '#000',
        backgroundColor: 'aliceblue',
      },
    },
  };

  const columns1 = [
    {
      name: 'Offense Name',
      selector: (row) => row.Offense_Description,
      sortable: true
    },
    {
      name: 'Attempt/Complete',
      selector: (row) => row.AttemptComplete,
      sortable: true
    },
  ]

  const notebookEntryHandler = row => {
    setValue(pre => { return { ...pre, ['OffenseID']: row.CrimeID, ['PropertyOffenseID']: row?.propertyOffenseID, ['labal']: row.Offense_Description } });
    document.getElementById('customSelectBox').style.display = 'none'
  }

  return (
    <>

      <div className="col-12 col-md-12 pt-2 p-0" >
        <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center">
          <p className="p-0 m-0">Offense</p>
        </div>
      </div>
      <div className="col-6 col-md-6 col-lg-4 mt-2" style={{ zIndex: '1', }} >
        <div class="text-field ">
          <input
            type="text"
            name='NoofHoles'
            id='NoofHoles'
            value={value.labal}
            required
            placeholder='Search By Offense .....'
            autoComplete='off'
            onChange={(e) => {
              setValue({ ...value, labal: e.target.value })
              const result = ownerIdDrp?.filter((item) => {
                return (item.label.toLowerCase().includes(e.target.value.toLowerCase()))
              })
              setfilterDta(result)
            }
            }
            onClick={() => {
              document.getElementById('customSelectBox').style.display = 'block'
            }}
          />
          {errors.OwnerIDError !== 'true' ? (
            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.OwnerIDError}</span>
          ) : null}
          <Link to={''} className='offense-select' onClick={() => {
            document.getElementById('customSelectBox').style.display = 'none';
            setValue(pre => { return { ...pre, ['OffenseID']: '', ['propertyOffenseID']: '', ['labal']: '' } });
          }}>
            <span className='select-cancel'>
              <i className='fa fa-times'></i>
            </span>
          </Link>
        </div>
        <div id='customSelectBox' className="col-12 col-md-12 col-lg-12 " style={{ display: 'none', width: '700px' }}>
          <DataTable
            dense
            fixedHeader
            fixedHeaderScrollHeight="250px"
            customStyles={tableCustomStyles}
            columns={columns1}
            data={filterData}
            onRowClicked={notebookEntryHandler}
            // pagination
            selectableRowsHighlight
            highlightOnHover
            className='new-table'
          />
        </div>
      </div>
      <div className="col-1 col-md-4 col-lg-1  mb-1" style={{ marginTop: '22px' }}>
        <Link to=''>
          <button type="button" className="btn btn-md py-1 btn-success pl-2  text-center" onClick={() => { check_Validation_Error(); }} >Save</button>
        </Link>
      </div>
      {/* <div className="col-1 col-md-4 col-lg-1 mt-3 pt-1">
        <Link to="/nametab?page=Offender" className="btn btn-sm bg-green text-white ">
          <i className="fa fa-plus"></i>
        </Link>
      </div> */}
      <div className="col-12" >
        <div className="new-offensetable" >
          {
            <DataTable
              columns={columns}
              data={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? ownerData : '' : ownerData}
              dense
              pagination
              className='new-offensetable'
              selectableRowsHighlight
              highlightOnHover
            // noDataComponent={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
            />
          }
        </div>
      </div>
      {
        deleteStatus ?
          <DeletePopUpModal func={DeletePin} />
          : ''
      }
      {/* <div className="col-12 col-md-12 pt-2 p-0" >
        <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center ">
          <p className="p-0 m-0">Offense</p>
          <div style={{ marginLeft: 'auto' }}>
            <Link to="" onClick={() => { setStatusFalse() }} className="btn btn-sm bg-green text-white px-2 py-0" data-toggle="modal" data-target="#OwnerModal">
              <i className="fa fa-plus"></i>
            </Link>
          </div>
        </div>
        <div className=" col-12">
          <DataTable
            dense
            columns={columns}
            data={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? ownerData : '' : ownerData}
            pagination
            highlightOnHover
            noDataComponent={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
          />
        </div>
      </div> */}
      {/* <Offense_Add_Up {...{ masterPropertyID, propertyID, LoginPinID, LoginAgencyID, MainIncidentID, modal, setModal, status, setStatus, updateStatus, setUpdateStatus, propertyOffenseID, get_Data_Owner, ownerData }} />
      <DeletePopUpModal func={DeletePin} /> */}
    </>
  )
}

export default Offense