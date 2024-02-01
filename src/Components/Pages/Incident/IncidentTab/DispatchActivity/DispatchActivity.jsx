import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import { Decrypt_Id_Name, getShowingDateText, getShowingMonthDateYear } from '../../../../Common/Utility';
import { AddDeleteUpadate, fetchPostData, ScreenPermision } from '../../../../hooks/Api';
import AddDispatch from './AddDispatch';
import Loader from '../../../../Common/Loader';
import { useContext } from 'react';
import { AgencyContext } from '../../../../../Context/Agency/Index';


const DispatchActivity = () => {

  const { get_IncidentTab_Count, localStoreArray, setLocalStoreArray, get_LocalStorage, } = useContext(AgencyContext);

  const [dispatchData, setDispatchData] = useState();
  const [dispatchEditValue, setdispatchEditValue] = useState();
  const [dispatchID, setDispatchID] = useState();
  const [status, setStatus] = useState(false);
  const [updateStatus, setUpdateStatus] = useState(0)
  const [modal, setModal] = useState(false);
  const [loder, setLoder] = useState(false)
  //screen permission 
  const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState();
  const [LoginAgencyID, setLoginAgencyID] = useState('');
  const [incidentID, setIncidentID] = useState('');
  const [LoginPinID, setLoginPinID] = useState('');
  const [userName, setUserName] = useState('')

  const localStore = {
    Value: "",
    UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
    Key: JSON.stringify({ AgencyID: "", PINID: "", IncidentID: '', UserName: '' }),
  }

  useEffect(() => {
    if (!localStoreArray.AgencyID || !localStoreArray.PINID || !localStoreArray?.IncidentID) {
      get_LocalStorage(localStore);
    }
  }, []);

  // Onload Function
  useEffect(() => {
    if (localStoreArray) {
      if (localStoreArray?.AgencyID && localStoreArray?.PINID) {
        setLoginAgencyID(localStoreArray?.AgencyID);
        setLoginPinID(parseInt(localStoreArray?.PINID));
        setIncidentID(parseInt(localStoreArray?.IncidentID));
        setUserName(localStoreArray?.UserName)
        get_Dispatch_Data(localStoreArray?.IncidentID); getScreenPermision(localStoreArray?.AgencyID, localStoreArray?.PINID);
      }
    }
  }, [localStoreArray])

  // useEffect(() => {
  //   get_Dispatch_Data(); getScreenPermision();
  // }, [])

  const get_Dispatch_Data = (incidentID) => {
    const val = {
      'IncidentId': incidentID,
    }
    fetchPostData('IncidentDispatchComments/GetData_IncidentDispatcherComments', val).then((res) => {
      if (res) {
        console.log(res)
        setDispatchData(res); setLoder(true)
      } else {
        setDispatchData([]); setLoder(true)
      }
    })
  }

  const getScreenPermision = (LoginAgencyID, LoginPinID) => {
    ScreenPermision("I031", LoginAgencyID, LoginPinID).then(res => {
      if (res) {
        setEffectiveScreenPermission(res)
      } else {
        setEffectiveScreenPermission([])
      }
    });
  }

  const columns = [
    // {
    //   name: 'OfficerId',
    //   selector: (row) => row.OfficerId,
    //   sortable: true
    // },
    // {
    //   name: 'OfficerName',
    //   selector: (row) => row.OfficerName,
    //   sortable: true
    // },
    {
      width: '120px',
      name: <p className='text-end' style={{ position: 'absolute', top: '7px', }}>Action</p>,
      cell: row => <>
        <div style={{ position: 'absolute', top: 4, }}>
          {
            EffectiveScreenPermission ? EffectiveScreenPermission[0]?.Changeok ?
              <Link to={`#`} onClick={(e) => { set_Edit_Value(e, row) }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DispatchModal">
                <i className="fa fa-edit"></i>
              </Link>
              : <></>
              : <Link to={`#`} onClick={(e) => { set_Edit_Value(e, row) }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DispatchModal">
                <i className="fa fa-edit"></i>
              </Link>
          }
        </div>
      </>
    },
    {
      name: 'Dispatch Date/Time',
      selector: (row) => getShowingDateText(row.DispatchDate),
      sortable: true
    },
    {
      name: 'Dispatch Activity Comments',
      selector: (row) => <>{row?.Comments ? row?.Comments.substring(0, 60) : ''}{row?.Comments?.length > 100 ? '  . . .' : null} </>,
      sortable: true
    },
    {
      name: <p className='text-end' style={{ position: 'absolute', top: '7px', right: '0' }}>Delete</p>,
      cell: row => <>
        <div style={{ position: 'absolute', top: 4, right: 3 }}>
          {
            EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DeleteOK ?
              <Link to={`#`} onClick={() => { setDispatchID(row.DispatchId) }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                <i className="fa fa-trash"></i>
              </Link>
              : <></>
              : <Link to={`#`} onClick={() => { setDispatchID(row.DispatchId) }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                <i className="fa fa-trash"></i>
              </Link>
          }
        </div>
      </>
    }
  ]

  const set_Edit_Value = (e, row) => {
    setStatus(true);
    setdispatchEditValue(row);
    setUpdateStatus(updateStatus + 1);
    setModal(true)
  }

  const setStatusFalse = (e) => {
    setStatus(false)
    setdispatchEditValue();
    setModal(true);
  }

  const DeleteDispatch = () => {
    const val = {
      'DispatchId': dispatchID,
      'DeletedByUserFK': LoginPinID,
    }
    AddDeleteUpadate('IncidentDispatchComments/Delete_IncidentDispatcherComments', val)
      .then((res) => {
        if (res.success) {
          toastifySuccess(res.Message);
          get_IncidentTab_Count(incidentID);
        } else console.log("Somthing Wrong");
        get_Dispatch_Data(incidentID);
      })
  }

  return (
    <>
      <div className="col-md-12 mt-2">
        <div className="bg-line text-white py-1 px-2  d-flex justify-content-between align-items-center">
          <p className="p-0 m-0 d-flex align-items-center">
            Dispatch Activity
          </p>
          <div>
            {
              EffectiveScreenPermission ? EffectiveScreenPermission[0]?.AddOK ?
                <Link to="" className="btn btn-sm bg-green text-white px-2 py-0"
                  onClick={() => { setStatusFalse(); setUpdateStatus(updateStatus + 1); }}
                  data-toggle="modal" data-target="#DispatchModal" >
                  <i className="fa fa-plus"></i>
                </Link>
                : <></>
                : <Link to="" className="btn btn-sm bg-green text-white px-2 py-0"
                  onClick={() => { setStatusFalse(); setUpdateStatus(updateStatus + 1); }}
                  data-toggle="modal" data-target="#DispatchModal" >
                  <i className="fa fa-plus"></i>
                </Link>
            }
          </div>
        </div>
        <div className="col-12 ">
          {
            loder ?
              <DataTable
                dense
                columns={columns}
                data={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? dispatchData : '' : dispatchData}
                pagination
                selectableRowsHighlight
                highlightOnHover
                noDataComponent={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
              />
              :
              <Loader />
          }
        </div>
      </div>
      <AddDispatch {...{ LoginPinID, incidentID, LoginAgencyID, userName, status, setStatus, dispatchEditValue, setdispatchEditValue, get_Dispatch_Data, updateStatus, modal, setModal }} />
      <DeletePopUpModal func={DeleteDispatch} />
    </>
  )
}

export default DispatchActivity; 