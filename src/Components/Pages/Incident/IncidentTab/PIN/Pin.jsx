import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom';
import Pin_Add_Up from './Pin_Add_Up';
import DataTable from 'react-data-table-component';
import { fetchPostData, AddDeleteUpadate, ScreenPermision } from '../../../../hooks/Api';
import { useEffect } from 'react';
import { Decrypt_Id_Name, getShowingDateText, getShowingMonthDateYear } from '../../../../Common/Utility';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import Loader from '../../../../Common/Loader';
import { AgencyContext } from '../../../../../Context/Agency/Index';

const Pin = (props) => {

  const { incidentReportedDate, setIncidentReportedDate } = props
  const { get_IncidentTab_Count, localStoreArray, setLocalStoreArray, get_LocalStorage, } = useContext(AgencyContext);

  const [pindata, setPindata] = useState();
  const [status, setStatus] = useState(false);
  const [modal, setModal] = useState(false)
  const [PinActivityID, setPinActivityID] = useState();
  const [updateStatus, setUpdateStatus] = useState(0)
  const [IncidentPINActivityID, setIncidentPINActivityID] = useState('');
  const [loder, setLoder] = useState(false)
  //screen permission 
  const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState();

  const [LoginAgencyID, setLoginAgencyID] = useState('')
  const [incidentID, setIncidentID] = useState('')
  const [LoginPinID, setLoginPinID] = useState('');

  const localStore = {
    Value: "",
    UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
    Key: JSON.stringify({ AgencyID: "", PINID: "", IncidentID: '' }),
  }

  useEffect(() => {
    if (!localStoreArray.AgencyID || !localStoreArray.PINID || !localStoreArray.IncidentID) {
      get_LocalStorage(localStore);
    }
  }, []);

  // Onload Function
  useEffect(() => {
    // console.log("Calll")
    if (localStoreArray) {
      if (localStoreArray.AgencyID && localStoreArray.PINID) {
        setLoginAgencyID(localStoreArray?.AgencyID);
        setLoginPinID(localStoreArray?.PINID);
        if (localStoreArray.IncidentID) {
          setIncidentID(parseInt(localStoreArray?.IncidentID)); get_Pin_Data(localStoreArray?.IncidentID);
        }
        getScreenPermision(localStoreArray?.AgencyID, localStoreArray?.PINID);
      }
    }
  }, [localStoreArray])

  const get_Pin_Data = (incidentID) => {
    const val = {
      'IncidentId': incidentID,
    }
    fetchPostData('PINActivity/GetData_PinActivity', val).then((res) => {
      if (res) {
        console.log(res)
        setPindata(res); setLoder(true);
      } else {
        setPindata([]); setLoder(true);
      }
    })
  }

  const getScreenPermision = (LoginAgencyID, PinID) => {
    ScreenPermision("I028", LoginAgencyID, PinID).then(res => {
      if (res) {
        setEffectiveScreenPermission(res)
      } else {
        setEffectiveScreenPermission([])
      }
    });
  }

  // Get Effective Screeen Permission
  // const getScreenPermision = () => {
  //   const val = {
  //     PINID: Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
  //     ApplicationID: '1',
  //     Code: 'I028',
  //     AgencyID: Decrypt_Id_Name(localStorage.getItem('AgencyID'), 'AForAgencyID')
  //   }
  //   fetchPostData("EffectivePermission/GetData_EffectiveScreenPermission", val)
  //     .then(res => {
  //       console.log(res);
  //       if (res) { setEffectiveScreenPermission(res); }
  //       else { setEffectiveScreenPermission(); }
  //     })
  //     .catch(error => {
  //       console.error('There was an error!', error);
  //     });
  // }

  const columns = [
    {
      width: '100px',
      name: <p className='text-end' style={{ position: 'absolute', top: 8, }}>Action</p>,
      cell: row => <>
        <div className="div" style={{ position: 'absolute', top: 4, left: 20 }}>
          {
            EffectiveScreenPermission ? EffectiveScreenPermission[0]?.Changeok ?
              <Link to={''} onClick={(e) => { set_Edit_Value(e, row) }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#PinModal" >
                <i className="fa fa-edit"></i>
              </Link>
              : <></>
              : <Link to={''} onClick={(e) => { set_Edit_Value(e, row) }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#PinModal" >
                <i className="fa fa-edit"></i></Link>
          }
        </div>
      </>
    },
    {
      width: '150px',
      name: 'Date/Time',
      selector: (row) => getShowingDateText(row.ActivityDateTime),
      sortable: true
    },
    {
      width: '200px',
      name: 'Activity Details',
      selector: (row) => row.ActivityStatus,
      sortable: true
    },
    {
      name: 'Role',
      selector: (row) => row.ActivityRole,
      sortable: true
    },
    {
      name: 'Officer',
      selector: (row) => row.OfficerName,
      sortable: true
    },
    {
      name: 'Module',
      selector: (row) => row.ResourceNumber,
      sortable: true
    },
    {
      name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 5 }}>Delete</p>,
      cell: row => <>
        <div className="div" style={{ position: 'absolute', top: 4, right: 8 }}>
          {
            EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DeleteOK ?
              <Link to={`#`} onClick={() => { setIncidentPINActivityID(row.IncidentPINActivityID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                <i className="fa fa-trash"></i>
              </Link>
              : <></>
              : <Link to={`#`} onClick={() => { setIncidentPINActivityID(row.IncidentPINActivityID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                <i className="fa fa-trash"></i>
              </Link>
          }
        </div>
      </>
    }
  ]

  const set_Edit_Value = (e, row) => {
    setStatus(true);
    setModal(true)
    setUpdateStatus(updateStatus + 1);
    setPinActivityID(row.IncidentPINActivityID);
  }

  const DeletePin = () => {
    const val = {
      'IncidentPINActivityID': IncidentPINActivityID,
      'DeletedByUserFK': LoginPinID,
    }
    AddDeleteUpadate('PINActivity/DeletePinActivity', val).then((res) => {
      if (res) {
        toastifySuccess(res.Message);
        get_Pin_Data(incidentID);
        get_IncidentTab_Count(incidentID);
      } else console.log("Somthing Wrong");
    })
  }

  const setStatusFalse = (e) => {
    setStatus(false);
    setModal(true);
  }

  return (
    <>
      <div className="col-md-12 mt-2">
        <div className="bg-line text-white py-1 px-2 d-flex justify-content-between align-items-center">
          <p className="p-0 m-0 d-flex align-items-center">
            PIN
          </p>
          <div>
            {
              EffectiveScreenPermission ? EffectiveScreenPermission[0]?.AddOK ?
                <Link to="" className="btn btn-sm bg-green text-white px-2 py-0"
                  onClick={() => { setStatusFalse(); setUpdateStatus(updateStatus + 1); }}
                  data-toggle="modal" data-target="#PinModal" style={{ marginTop: '-6px' }}>
                  <i className="fa fa-plus"></i>
                </Link>
                : <></>
                : <Link to="" className="btn btn-sm bg-green text-white px-2 py-0"
                  onClick={() => { setStatusFalse(); setUpdateStatus(updateStatus + 1); }}
                  data-toggle="modal" data-target="#PinModal" style={{ marginTop: '-6px' }}>
                  <i className="fa fa-plus"></i>
                </Link>
            }
            {/* <FindListDropDown
              array={IncPinListDropDownArray}
            /> */}
          </div>
        </div>
        {
          loder ?
            <DataTable
              dense
              columns={columns}
              data={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? pindata : '' : pindata}
              pagination
              highlightOnHover
              noDataComponent={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
            />
            :
            <Loader />
        }
      </div>
      <DeletePopUpModal func={DeletePin} />
      <Pin_Add_Up {...{incidentReportedDate, get_LocalStorage, LoginPinID, incidentID, LoginAgencyID, status, setStatus, PinActivityID, setPinActivityID, setModal, modal, get_Pin_Data, updateStatus }} />
    </>
  )
}
export default Pin; 