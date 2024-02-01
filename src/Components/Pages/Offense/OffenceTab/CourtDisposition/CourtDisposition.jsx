import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { fetchPostData, AddDeleteUpadate, ScreenPermision } from '../../../../hooks/Api';
import { useEffect } from 'react';
import { Decrypt_Id_Name, getShowingDateText, getShowingMonthDateYear } from '../../../../Common/Utility';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import CourtDisposition_Add_Up from './CourtDisposition_Add_Up';
import FindListDropDown from '../../../../Common/FindListDropDown';
import { OffCourtDisListDropDownArray } from '../../../../Utility/ListDropDownArray/ListDropArray';
import Loader from '../../../../Common/Loader';
import { AgencyContext } from '../../../../../Context/Agency/Index';

const CourtDisposition = ({ LoginPinID, LoginAgencyID, offenceID, MainIncidentID }) => {

  const { get_Offence_Count } = useContext(AgencyContext)
  const [courtDispoData, setcourtDispoData] = useState();
  const [status, setStatus] = useState(false);
  const [modal, setModal] = useState(false)
  const [updateStatus, setUpdateStatus] = useState(0)
  const [CourtDispositionId, setCourtDispositionId] = useState();
  const [agencyID, setAgencyID] = useState();
  const [loder, setLoder] = useState(false)
  //screen permission 
  const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState()

  useEffect(() => {
    get_CourtDisposition_Data(offenceID);
    getScreenPermision(LoginAgencyID, LoginPinID);
  }, [offenceID])

  const get_CourtDisposition_Data = (offenceID) => {
    const val = {
      'CrimeID': offenceID,
    }
    fetchPostData('CrimeCourtDiposition/GetData_OffenseCourtDisposition', val).then((res) => {
      if (res) {
        setcourtDispoData(res); setLoder(true)
      } else {
        setcourtDispoData([]); setLoder(true)
      }
    })
  }

  const getScreenPermision = () => {
    ScreenPermision("O041", LoginAgencyID, LoginPinID).then(res => {
      if (res) {
        setEffectiveScreenPermission(res)
      } else {
        setEffectiveScreenPermission([])
      }
    });
  }

  const columns = [
    // {
    //   name: 'Date/Time',
    //   selector: (row) => getShowingDateText(row.DispositionDtTm),
    //   sortable: true
    // },
    {
      width: '120px',
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
      width: '150px',
      name: 'Date/Time',
      selector: (row) => row.DispositionDtTm ? getShowingDateText(row.DispositionDtTm) : " ",
      sortable: true
    },
    {
      width: '250px',
      name: 'Court Disposition Comment',
      selector: (row) => <>{row?.Comments ? row?.Comments.substring(0, 20) : ''}{row?.Comments?.length > 20 ? '  . . .' : null} </>,
      sortable: true
    },
    {
      name: 'Clearance Code',
      selector: (row) => <>{row?.ExceptionalClearance_Description ? row?.ExceptionalClearance_Description.substring(0, 20) : ''}{row?.ExceptionalClearance_Description?.length > 20 ? '  . . .' : null} </>,
      sortable: true
    },
    {
      name: 'Court Disposition',
      selector: (row) => row.CourtDisposition_Description,
      sortable: true
    },
    {
      name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 10 }}>Delete</p>,
      cell: row => <>
        <div className="div" style={{ position: 'absolute', top: 4, right: 10 }}>
          {
            EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DeleteOK ?
              <Link to={`#`} onClick={() => { setCourtDispositionId(row.CourtDispositionID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                <i className="fa fa-trash"></i>
              </Link>
              : <></>
              : <Link to={`#`} onClick={() => { setCourtDispositionId(row.CourtDispositionID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
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
    setCourtDispositionId(row.CourtDispositionID);
  }

  const DeleteCourtDisposition = () => {
    const val = {
      'CourtDispositionID': CourtDispositionId,
      'DeletedByUserFK': LoginPinID,
    }
    AddDeleteUpadate('CrimeCourtDiposition/Delete_OffenseCourtDisposition', val).then((res) => {
      if (res) {
        toastifySuccess(res.Message);
        get_Offence_Count(offenceID)
        get_CourtDisposition_Data(offenceID);
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
          <div style={{ marginLeft: 'auto' }}>
            {
              EffectiveScreenPermission ? EffectiveScreenPermission[0]?.AddOK ?
                <Link to="" className="btn btn-sm bg-green text-white px-2 py-0" onClick={setStatusFalse}
                  data-toggle="modal" data-target="#CourtDispositionModal" style={{ marginTop: '-6px' }}>
                  <i className="fa fa-plus"></i>
                </Link>
                : <></>
                : <Link to="" className="btn btn-sm bg-green text-white px-2 py-0" onClick={setStatusFalse}
                  data-toggle="modal" data-target="#CourtDispositionModal" style={{ marginTop: '-6px' }}>
                  <i className="fa fa-plus"></i>
                </Link>
            }
            <FindListDropDown
              array={OffCourtDisListDropDownArray}
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
      </div >
      <DeletePopUpModal func={DeleteCourtDisposition} />
      <CourtDisposition_Add_Up {...{ LoginPinID, LoginAgencyID, offenceID, MainIncidentID, status, setStatus, CourtDispositionId, modal, setModal, get_CourtDisposition_Data, updateStatus }} />
    </>
  )
}

export default CourtDisposition;



