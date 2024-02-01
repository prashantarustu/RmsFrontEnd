import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CourtInformation_Add_Up from './CourtInformation_Add_Up'
import { Decrypt_Id_Name, getShowingDateText } from '../../../../Common/Utility'
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api'
import DataTable from 'react-data-table-component'
import { toastifySuccess } from '../../../../Common/AlertMsg'
import DeletePopUpModal from '../../../../Common/DeleteModal'
import FindListDropDown from '../../../../Common/FindListDropDown'
import { ArrCourtListDropDownArray } from '../../../../Utility/ListDropDownArray/ListDropArray'
import Loader from '../../../../Common/Loader'
import { useContext } from 'react'
import { AgencyContext } from '../../../../../Context/Agency/Index'


const CourtInformation = () => {

  const { get_Arrest_Count, localStoreArray, setLocalStoreArray, get_LocalStorage, } = useContext(AgencyContext)
  //screen permission 
  const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState()
  const [courtInfoData, setCourtInfoData] = useState();
  const [status, setStatus] = useState(false);
  const [modal, setModal] = useState(false)
  const [updateStatus, setUpdateStatus] = useState(0)
  const [courtInfoID, setCourtInfoID] = useState();
  const [loder, setLoder] = useState(false)
  const [ArrestID, setArrestID] = useState('');
  const [LoginAgencyID, setLoginAgencyID] = useState('');
  const [LoginPinID, setLoginPinID,] = useState('');

  const localStore = {
    Value: "",
    UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
    Key: JSON.stringify({ AgencyID: "", PINID: "", ArrestID: '', }),
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
        setLoginPinID(parseInt(localStoreArray?.PINID));
        // setIncidentID(localStoreArray?.IncidentID);
        if (localStoreArray.ArrestID) {
          setArrestID(localStoreArray?.ArrestID);
          get_CourtInformation_Data(localStoreArray?.ArrestID)
        }
        else { setArrestID() }
        // getScreenPermision(localStoreArray?.AgencyID, localStoreArray?.PINID);
      }
    }
  }, [localStoreArray])

  // useEffect(() => {
  //   get_CourtInformation_Data(ArrestID);
  // }, [ArrestID])

  const get_CourtInformation_Data = (ArrestID) => {
    const val = {
      'ArrestID': ArrestID
    }
    fetchPostData('ArrsetCourtInformation/GetData_ArrsetCourtInformation', val).then((res) => {
      if (res) {
        setCourtInfoData(res); setLoder(true)
      } else {
        setCourtInfoData([]); setLoder(true)
      }
    })
  }

  const columns = [
    {
      width: '120px',
      name: <p className='text-end' style={{ position: 'absolute', top: 8, }}>Action</p>,
      cell: row => <>
        <div className="div" style={{ position: 'absolute', top: 4, left: 20 }}>
          {
            EffectiveScreenPermission ? EffectiveScreenPermission[0]?.Changeok ?
              <Link to={''} onClick={(e) => { set_Edit_Value(e, row) }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#CourtInformationModal" >
                <i className="fa fa-edit"></i>
              </Link>
              : <></>
              : <Link to={''} onClick={(e) => { set_Edit_Value(e, row) }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#CourtInformationModal" >
                <i className="fa fa-edit"></i></Link>
          }
        </div>
      </>
    },
    {
      name: 'PleaDateTime',
      selector: (row) => row.PleaDateTime ? getShowingDateText(row.PleaDateTime) : " ",
      sortable: true
    },
    // {
    //   name: 'Court Appear Reason',
    //   selector: (row) => row.CourtAppearReasonID,
    //   sortable: true
    // },
    // {
    //   name: 'Court Name',
    //   selector: (row) => row.CourtNameID,
    //   sortable: true
    // },
    // {
    //   name: 'Judge Name',
    //   selector: (row) => row.JudgeNameID,
    //   sortable: true
    // },
    {
      name: 'Name',
      selector: (row) => row.Name,
      sortable: true
    },
    {
      name: 'Prosecutor',
      selector: (row) => row.Prosecutor,
      sortable: true
    },
    {
      name: 'Attorney',
      selector: (row) => row.Attorney,
      sortable: true
    },
    {
      name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 0 }}>Delete</p>,
      cell: row => <>
        <div className="div" style={{ position: 'absolute', top: 4, right: 5 }}>

          {
            EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DeleteOK ?
              <Link to={`#`} onClick={() => { setCourtInfoID(row.ArrsetCourtInformationID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                <i className="fa fa-trash"></i>
              </Link>
              : <></>
              : <Link to={`#`} onClick={() => { setCourtInfoID(row.ArrsetCourtInformationID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                <i className="fa fa-trash"></i>
              </Link>
          }
        </div>
      </>
    }
  ]

  const set_Edit_Value = (e, row) => {
    e.preventDefault();
    setStatus(true)
    setModal(true);
    setUpdateStatus(updateStatus + 1);
    get_Arrest_Count(row.ArrestID)
    setCourtInfoID(row.ArrsetCourtInformationID);
  }

  const setStatusFalse = (e) => {
    setStatus(false)
    setModal(true)
    setUpdateStatus(updateStatus + 1);
    
  }

  const DeleteCourtInFo = () => {
    const val = {
      'ArrsetCourtInformationID': courtInfoID,
      'DeletedByUserFK': LoginPinID
    }
    AddDeleteUpadate('ArrsetCourtInformation/Delete_ArrsetCourtInformation', val).then((res) => {
      if (res) {
        toastifySuccess(res.Message);
        get_Arrest_Count(ArrestID);
        get_CourtInformation_Data(ArrestID);
      } else console.log("Somthing Wrong");
    })
  }


  return (
    <>
      <div className="col-12 col-md-12 pt-2 p-0" >
        <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center ">
          <p className="p-0 m-0">Court Information</p>
          <div style={{ marginLeft: 'auto' }}>
            <Link to={''} onClick={setStatusFalse} className="btn btn-sm bg-green text-white px-2 py-0" data-toggle="modal" data-target="#CourtInformationModal" style={{ marginTop: '-6px' }}>
              <i className="fa fa-plus"></i>
            </Link>
            <FindListDropDown
              array={ArrCourtListDropDownArray}
            />
          </div>
        </div>
        {
          loder ?
            <DataTable
              dense
              columns={columns}
              data={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? courtInfoData : '' : courtInfoData}
              pagination
              highlightOnHover
              noDataComponent={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
            />
            :
            <Loader />
        }
      </div>
      <CourtInformation_Add_Up  {...{ LoginPinID, ArrestID, LoginAgencyID, setModal, modal, get_CourtInformation_Data, updateStatus, status,courtInfoID, setCourtInfoID }} />
      <DeletePopUpModal func={DeleteCourtInFo} />
    </>
  )
}

export default CourtInformation