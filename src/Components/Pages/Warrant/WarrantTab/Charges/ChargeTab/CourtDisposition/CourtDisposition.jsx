import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { fetchPostData, AddDeleteUpadate } from './../../../../../../hooks/Api.js'
import { useEffect } from 'react';
import { Decrypt_Id_Name, getShowingDateText, getShowingMonthDateYear } from './../../../../../../Common/Utility';
import { toastifySuccess } from './../../../../../../Common/AlertMsg';
import DeletePopUpModal from './../../../../../../Common/DeleteModal';
import CourtDisposition_Add_Up from './CourtDisposition_Add_Up'
import { ArrChargeCourtListDropDownArray } from '../../../../../../Utility/ListDropDownArray/ListDropArray.js';
import FindListDropDown from '../../../../../../Common/FindListDropDown.jsx';
import Loader from '../../../../../../Common/Loader.jsx';
import { AgencyContext } from '../../../../../../../Context/Agency/Index.js';

const CourtDisposition = ({ LoginPinID, LoginAgencyID, ChargeID, MainIncidentID }) => {

  const { get_vehicle_Count, get_ArrestCharge_Count,localStoreArray, setLocalStoreArray, get_LocalStorage, } = useContext(AgencyContext);

  const [courtDispoData, setcourtDispoData] = useState();
  const [status, setStatus] = useState(false);
  const [modal, setModal] = useState(false)
  const [updateStatus, setUpdateStatus] = useState(0)
  const [ChargeCourtDispositionID, setChargeCourtDispositionID] = useState();
  const [agencyID, setAgencyID] = useState();
  const [loder, setLoder] = useState(false)
  //screen permission 
  const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState()

  useEffect(() => {
    get_CourtDisposition_Data(ChargeID);
    getScreenPermision();
  }, [ChargeID])

  const get_CourtDisposition_Data = (ChargeID) => {
    const val = {
      'ChargeID': ChargeID,
    }
    fetchPostData('ChargeCourtDisposition/GetData_ChargeCourtDisposition', val).then((res) => {
      if (res) {
        setcourtDispoData(res); setLoder(true)
      } else {
        setcourtDispoData([]); setLoder(true)
      }
    })
  }

  const getScreenPermision = () => {
    // ScreenPermision("O041", Decrypt_Id_Name(localStorage.getItem('AgencyID'), 'AForAgencyID')).then(res => {
    //   if (res) {
    //     setEffectiveScreenPermission(res)
    //   } else {
    //     setEffectiveScreenPermission()
    //   }
    // });
  }

  const columns = [
    {
      name: <p className='text-end' style={{ position: 'absolute', top: 8, }}>Action</p>,
      cell: row => <>
        <div className="div" style={{ position: 'absolute', top: 4, left: 20 }}>
          {
            EffectiveScreenPermission ? EffectiveScreenPermission[0]?.Changeok ?
              <Link to={''} onClick={(e) => { set_Edit_Value(e, row) }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#CourtDispositionModal" >
                <i className="fa fa-edit"></i>
              </Link>
              : <></>
              : <Link to={''} onClick={(e) => { set_Edit_Value(e, row) }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#CourtDispositionModal" >
                <i className="fa fa-edit"></i></Link>
          }
        </div>
      </>
    },
    {
      name: 'Date/Time',
      selector: (row) => getShowingDateText(row.DispositionDtTm),
      sortable: true
    },
    {
      name: 'Comment',
      selector: (row) => row.Comments,
      sortable: true
    },
    // {
    //   name: 'Clearance Code',
    //   selector: (row) => row.ExceptionalClearance_Description,
    //   sortable: true
    // },
    // {
    //   name: 'Court Disposition',
    //   selector: (row) => row.CourtDisposition_Description,
    //   sortable: true
    // },
    {
      name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 60 }}>Delete</p>,
      cell: row => <>
        <div className="div" style={{ position: 'absolute', top: 4, right: 65 }}>
          {
            EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DeleteOK ?
              <Link to={`#`} onClick={() => { setChargeCourtDispositionID(row.ChargeCourtDispositionID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                <i className="fa fa-trash"></i>
              </Link>
              : <></>
              : <Link to={`#`} onClick={() => { setChargeCourtDispositionID(row.ChargeCourtDispositionID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                <i className="fa fa-trash"></i>
              </Link>
          }
        </div>
      </>
    }
  ]

  const set_Edit_Value = (e, row) => {
    get_ArrestCharge_Count(row.ChargeID)
    setStatus(true);
    setModal(true)
    setUpdateStatus(updateStatus + 1);
    setChargeCourtDispositionID(row.ChargeCourtDispositionID);
  }

  const DeleteCourtDisposition = () => {
    const val = {
      'ChargeCourtDispositionID': ChargeCourtDispositionID,
      'DeletedByUserFK': LoginPinID
    }
    AddDeleteUpadate('ChargeCourtDisposition/Delete_ChargeCourtDisposition', val).then((res) => {
      if (res) {
        toastifySuccess(res.Message);
        get_CourtDisposition_Data(ChargeID)
        get_ArrestCharge_Count(ChargeID);
      } else console.log("Somthing Wrong");
    })
  }

  const setStatusFalse = (e) => {
    setStatus(false)
    setModal(true)
  }

  return (
    <>
      <div className="col-md-12 mt-2">
        <div className="bg-line text-white py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
          <p className="p-0 m-0 d-flex align-items-center">
            Court Disposition
          </p>
          <div>
            {
              EffectiveScreenPermission ? EffectiveScreenPermission[0]?.AddOK ?
                <Link to="" className="btn btn-sm bg-green text-white px-2 py-0" onClick={setStatusFalse}
                  data-toggle="modal" data-target="#CourtDispositionModal" >
                  <i className="fa fa-plus"></i>
                </Link>
                : <></>
                : <Link to="" className="btn btn-sm bg-green text-white px-2 py-0" onClick={setStatusFalse}
                  data-toggle="modal" data-target="#CourtDispositionModal" >
                  <i className="fa fa-plus"></i>
                </Link>
            }
            <FindListDropDown
              array={ArrChargeCourtListDropDownArray}
            />
          </div>
        </div>
        {
          loder ?
            <DataTable
              dense
              columns={columns}
              data={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? courtDispoData : '' : courtDispoData}
              pagination
              highlightOnHover
              noDataComponent={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
            />
            :
            <Loader />
        }
      </div>
      <DeletePopUpModal func={DeleteCourtDisposition} />
      <CourtDisposition_Add_Up {...{ ChargeID, LoginPinID, LoginAgencyID, status, setStatus, ChargeCourtDispositionID, modal, setModal, get_CourtDisposition_Data, updateStatus }} />
    </>
  )
}

export default CourtDisposition;



