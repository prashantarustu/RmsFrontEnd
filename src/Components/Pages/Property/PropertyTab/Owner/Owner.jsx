import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import Owner_Add_Up from './Owner_Add_Up'
import { Decrypt_Id_Name, getShowingDateText, getShowingWithOutTime } from '../../../../Common/Utility';
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api';
import { useState } from 'react';
import DataTable from 'react-data-table-component';
import { useEffect } from 'react';
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import { useContext } from 'react';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { RequiredFieldIncident } from '../../../Utility/Personnel/Validation';
import Loader from '../../../../Common/Loader';
import { Comman_changeArrayFormat } from '../../../../Common/ChangeArrayFormat';

const Owner = () => {

  const { get_Property_Count, localStoreArray, setLocalStoreArray, get_LocalStorage, setIncidentStatus } = useContext(AgencyContext);
  const SelectedValue = useRef();

  const [ownerData, setOwnerData] = useState();
  const [status, setStatus] = useState(false);
  const [modal, setModal] = useState(false)
  const [propertyOwnerID, setPropertyOwnerID] = useState(0);
  const [updateStatus, setUpdateStatus] = useState(0)
  //screen permission 
  const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState()
  const [propertyID, setPropertyID] = useState();
  const [OwnerID, setOwnerID] = useState();
  const [filterData, setfilterDta] = useState()
  const [loder, setLoder] = useState(false)
  const [masterPropertyID, setMasterPropertyID] = useState('');
  const [MainIncidentID, setMainIncidentID] = useState('');
  const [LoginAgencyID, setLoginAgencyID] = useState('');
  const [LoginPinID, setLoginPinID,] = useState('');

  const [Editval, setEditval] = useState();
  const [ownerIdDrp, setOwnerIdDrp] = useState([]);
  const [deleteStatus, setDeleteStatus] = useState(false)

  const [value, setValue] = useState({
    'MasterPropertyID': '',
    'PropertyID': '',
    'labal': '',
    'OwnerID': '',
    'IsDefaultOwner': '',
    'PropertyOwnerID': '',
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
        setPropertyID(localStoreArray.PropertyID)
        if (localStoreArray.PropertyID) get_Data_Owner(parseInt(localStoreArray.PropertyID), parseInt(localStoreArray?.IncidentID));

      }
      setIncidentStatus(true);
    }
  }, [localStoreArray])


  useEffect(() => {
    if (!localStoreArray?.AgencyID || !localStoreArray?.PINID || !localStoreArray.IncidentID || !localStoreArray.IncidentStatus) {
      get_LocalStorage();
    }
  }, []);

  useEffect(() => {
    setValue({ ...value, 'PropertyID': propertyID, 'CreatedByUserFK': LoginPinID, })
  }, [propertyID, updateStatus]);

  const check_Validation_Error = (e) => {
    if (RequiredFieldIncident(value.OwnerID)) {
      setErrors(prevValues => { return { ...prevValues, ['OwnerIDError']: RequiredFieldIncident(value.OwnerID) } })
    }
  }

  // Check All Field Format is True Then Submit 
  const { OwnerIDError } = errors

  // useEffect(() => {
  //   get_Data_Owner(propertyID);
  // }, [propertyID])

  useEffect(() => {
    if (propertyID) {
      get_Data_Owner(propertyID,);
    }
  }, [propertyID])

  useEffect(() => {
    if (MainIncidentID) {
      get_OwnerID_Drp(MainIncidentID);
    }
  }, [MainIncidentID])

  // useEffect(() => {
  //   if (OwnerIDError === 'true') {
  //     if (status)
  //       Add_Owner()
  //   }
  // }, [OwnerIDError])

  useEffect(() => {
    if (OwnerIDError === 'true') {
      Add_Owner()
    }
  }, [OwnerIDError])

  const get_Data_Owner = (propertyID) => {
    const val = {
      'PropertyID': propertyID,
    }
    fetchPostData('PropertyOwner/GetData_PropertyOwner', val).then((res) => {
      if (res) {
        console.log(res)
        setOwnerData(res)
      } else {
        setOwnerData([]);
      }
    })
  }

  const get_OwnerID_Drp = (MainIncidentID) => {
    const val = {
      'IncidentID': MainIncidentID,
      'MasterNameID': 0,
    }
    fetchPostData('Arrest/GetDataDropDown_Arrestee', val).then((res) => {
      if (res) {
        console.log(res);
        setfilterDta(res);
        setOwnerIdDrp(Comman_changeArrayFormat(res, 'NameID', 'Arrestee_Name'));
      } else {
        setOwnerIdDrp([]);
      }
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







  // useEffect(() => {
  //   get_OwnerID_Drp(MainIncidentID);
  // }, [MainIncidentID])

  //  useEffect(() => {
  //      if (propertyOwnerID) {
  //          GetSingleData(propertyOwnerID)
  //      }
  //  }, [updateStatus])

  //  const GetSingleData = () => {
  //      const val = { 'PropertyOwnerID': propertyOwnerID }
  //      fetchPostData('PropertyOwner/GetSingleData_PropertyOwner', val)
  //          .then((res) => {
  //              if (res) setEditval(res)
  //              else setEditval()
  //          })
  //  }


  // const Add_Owner = () => {
  //   var result = ownerData?.find(item => {
  //     if (item.OwnerID === value.OwnerID) {
  //       return true
  //     } else return false
  //   });
  //   if (result) {
  //     toastifyError('Owner Already Exists')
  //     setErrors({ ...errors, ['OwnerIDError']: '', })
  //   } else {
  //     AddDeleteUpadate('PropertyOwner/Insert_PropertyOwner', value).then((res) => {
  //       toastifySuccess(res.Message);
  //       get_Property_Count(propertyID);
  //       get_Data_Owner(propertyID);
  //       get_OwnerID_Drp(MainIncidentID);
  //       // setValue({ ...value, 'OwnerID': '', 'IsDefaultOwner': '', })
  //       onClear();
  //       setErrors({ ...errors, ['OwnerIDError']: '', })

  //     })
  //   }
  // }

  const Add_Owner = () => {
    var result = ownerData?.find(item => {
      if (item.OwnerID === value.OwnerID) {
        return true
      } else return false
    });
    if (result) {
      toastifyError('Owner Already Exists')
      setErrors({ ...errors, ['OwnerIDError']: '', })
    } else {
      AddDeleteUpadate('PropertyOwner/Insert_PropertyOwner', value).then((res) => {
        toastifySuccess(res.Message);
        get_Property_Count(propertyID);
        get_Data_Owner(propertyID);
        get_OwnerID_Drp(MainIncidentID);
        // setValue({ ...value, 'OwnerID': '', 'IsDefaultOwner': '', })
        setErrors({ ...errors, ['OwnerIDError']: '', })
        onClear();
      })
    }
  }

  const onClear = () => {
    SelectedValue?.current?.clearValue();
    setValue(pre => { return { ...pre, ['OwnerID']: '', ['PropertyOwnerID']: '', ['labal']: '' } });
  };

  const columns = [
    {
      name: 'Owner Name',
      selector: (row) => row.Owner_Name,
      sortable: true
    },
    // {
    //   width:'140px',
    //   name: 'Address',
    //   selector: (row) => row.Address,
    //   sortable: true
    // },
    // {
    //   width:'150px',
    //   name: 'Phone Number',
    //   selector: (row) => row.Contact,
    //   sortable: true
    // },
    // {
    //   name: 'Reason Code',
    //   // selector: (row) => row.Address,
    //   selector: (row) => <>{row?.ReasonCode ? row?.ReasonCode.substring(0, 50) : ''}{row?.ReasonCode?.length > 40 ? '  . . .' : null} </>,
    //   sortable: true
    // },
    {
      name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 0 }}>Delete</p>,
      cell: row => <>
        <div className="div" style={{ position: 'absolute', top: 4, right: 5 }}>
          {
            EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DeleteOK ?
              <Link to={`#`} onClick={() => { setDeleteStatus(true); setPropertyOwnerID(row.PropertyOwnerID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                <i className="fa fa-trash"></i>
              </Link>
              : <></>
              : <Link to={`#`} onClick={() => { setDeleteStatus(true); setPropertyOwnerID(row.PropertyOwnerID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                <i className="fa fa-trash"></i>
              </Link>

          }
        </div>
      </>
    }
  ]
  const columns1 = [
    {
      name: 'Owner Name',
      selector: (row) => row.Arrestee_Name,
      sortable: true
    },
    {
      name: 'Date Of Birth',
      selector: (row) => row.DateOfBirth ? getShowingWithOutTime(row.DateOfBirth) : '',
      sortable: true
    },
    {
      name: 'Gender',
      selector: (row) => row.Gendre_Description,
      sortable: true
    },
  ]

  // const set_Edit_Value = (e, row) => {
  //   setStatus(true);
  //   setModal(true)
  //   setUpdateStatus(updateStatus + 1);
  //   setPropertyOwnerID(row.PropertyOwnerID)
  // }

  // const setStatusFalse = (e, row) => {
  //   setStatus(false); setModal(true); setPropertyOwnerID(0)
  //   setUpdateStatus(updateStatus + 1);

  // }

  const DeletePin = () => {
    const val = {
      'PropertyOwnerID': propertyOwnerID,
      'DeletedByUserFK': LoginPinID,
    }
    AddDeleteUpadate('PropertyOwner/Delete_PropertyOwner', val).then((res) => {
      if (res) {
        toastifySuccess(res.Message);
        get_Property_Count(propertyID);
        get_Data_Owner(propertyID);
        get_OwnerID_Drp(MainIncidentID);
        setDeleteStatus(false);
        // setPropertyOwnerID(0);
      } else console.log("Somthing Wrong");
    })
  }

  const notebookEntryHandler = row => {
    console.log(row);
    setValue(pre => { return { ...pre, ['OwnerID']: row.NameID, ['PropertyOwnerID']: row?.PropertyOwnerID, ['labal']: row.Arrestee_Name } });
    document.getElementById('customSelectBox').style.display = 'none'
  }

  return (
    <>
      {/* <div className="col-12 col-md-12 pt-2 p-0" >
        <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center ">
          <p className="p-0 m-0">Owner</p>
          <div style={{ marginLeft: 'auto' }}>
            <Link to="" onClick={setStatusFalse} className="btn btn-sm bg-green text-white px-2 py-0" data-toggle="modal" data-target="#OwnerModal">
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
      </div>
      <Owner_Add_Up {...{ masterPropertyID, propertyID, LoginPinID, LoginAgencyID, MainIncidentID, modal, setModal, status, setStatus, updateStatus, setUpdateStatus, propertyOwnerID, get_Data_Owner, ownerData }} />
      <DeletePopUpModal func={DeletePin} /> */}

      <div className="col-12 col-md-12 pt-2 p-0" >
        <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center">
          <p className="p-0 m-0">Owner</p>
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
            setValue(pre => { return { ...pre, ['OwnerID']: '', ['PropertyOwnerID']: '', ['labal']: '' } });
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
      <div className="col-1 col-md-2 col-lg-1  mb-1" style={{ marginTop: '22px' }}>
        <Link to=''>
          <button type="button" className="btn btn-md py-1 btn-success pl-2  text-center" onClick={() => { check_Validation_Error(); }} >Save</button>
        </Link>
      </div>
      <div className="col-1 col-md-1 col-lg-1 mt-3 pt-1">
        <Link to="/nametab?page=clear" className="btn btn-sm bg-green text-white ">
          <i className="fa fa-plus"></i>
        </Link>
      </div>
      <div className="col-12" >
        <div className="new-offensetable" >
          {
            // loder ?
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
            // :
            // <Loader />

          }
        </div>
      </div>
      {
        deleteStatus ?
          <DeletePopUpModal func={DeletePin} />
          : ''
      }
    </>
  )
}

export default Owner