import React from 'react'
import { Link, useLocation } from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown';
import DataTable from 'react-data-table-component';
import { useState, useEffect } from 'react';
import { AddDeleteUpadate, fetchPostData, fetch_Post_Data, UtilityPersonnelScreenPermision } from '../../../../hooks/Api';
import { Decrypt_Id_Name } from '../../../../Common/Utility';
import { Filter } from '../../../../Filter/Filter';
import ConfirmModal from '../../../../Common/ConfirmModal';
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
// import NameReason_Add_Up from './NameReason_Add_up';
import NameReason_Add_Up from './NameReason_Add_Up';


const NameReason = () => {

  const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState()
  const [NameReasonData, setNameReasonData] = useState();
  const [status, setStatus] = useState(false);
  // const [tabstatus, setTabStatus] = useState(false);
  const [pageStatus, setPageStatus] = useState("1")
  const [modal, setModal] = useState(false)
  // FilterData 
  const [filterNameReasonCode, setfilterNameReasonCode] = useState('Contains');
  const [filterNameReason, setfilterNameReason] = useState('Contains');
  const [NameReasonFilterData, setNameReasonFilterData] = useState();
  const [NameReasonStatus, setNameReasonStatus] = useState(0)
  //filter SearchVal
  const [searchValue1, setSearchValue1] = useState('')
  const [searchValue2, setSearchValue2] = useState('')


  useEffect(() => {
    get_data_NameReason();
  }, [pageStatus])


  const get_data_NameReason = () => {
    const val = {
      AgencyID: Decrypt_Id_Name(localStorage.getItem('AgencyID'), 'AForAgencyID'),
      IsActive: pageStatus,
      IsSuperadmin: Decrypt_Id_Name(localStorage.getItem('IsSuperadmin'), 'IsForSuperadmin'),
      PINID: Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID')
    }
    fetch_Post_Data('NameReasonCode/GetData_NameReasonCode', val)
      .then((res) => {
        if (res) {
          setNameReasonData(res?.Data)
          setNameReasonFilterData(res?.Data);
          setEffectiveScreenPermission(res?.Permision)
        }
        else { setNameReasonData(); setNameReasonFilterData(); setEffectiveScreenPermission() }
      })
  }

  const [IsActive, setIsActive] = useState('')
  const [NameReasonCodeID, setNameReasonCodeID] = useState('')
  const [confirmType, setConfirmType] = useState('')

  const UpdActiveDeactive = () => {
    const value = {
      'IsActive': IsActive,
      'NameReasonCodeID': NameReasonCodeID,
      'DeletedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
    }
    AddDeleteUpadate('NameReasonCode/DeleteNameReasonCode', value)
      .then(res => {
        if (res.success) {
          toastifySuccess(res.Message);
          get_data_NameReason();
        } else {
          toastifyError(res.data.Message)
        }
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }

  // Table Columns Array
  const columns = [
    {
      name: 'Code',
      selector: (row) => row.ReasonCode,
      sortable: true
    },   
    {
      name: 'AgencyCode',
      selector: (row) => row.AgencyCode,
      sortable: true
    },
    {
      name: 'Description',
      selector: (row) => row.Description,
      sortable: true
    },
    {
      name: 'Agency',
      selector: (row) => <>{row?.MultiAgency_Name ? row?.MultiAgency_Name.substring(0, 40) : ''}{row?.MultiAgency_Name?.length > 40 ? '  . . .' : null} </>,
      sortable: true
    },
    {
      name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 60 }}>Action</p>,
      cell: row => <>
        <div style={{ position: 'absolute', top: 0, right: 40 }}>

          {
            pageStatus === "1" ?
              EffectiveScreenPermission ? EffectiveScreenPermission[0]?.ChangeOK ?
                <Link to="/ListManagement?page=Name Reason Code" data-toggle="modal" data-target="#NameReason" onClick={(e) => { setEditValue(e, row) }}
                  className="btn btn-sm bg-green text-white px-1 py-0 mr-2"><i className="fa fa-edit"></i>
                </Link>
                : <></>
                : <></>
              : <></>
          }
          {
            EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DeleteOK ?
              pageStatus === "1" ?
                < Link to="/ListManagement?page=Name Reason Code" data-toggle="modal" data-target="#ConfirmModal" onClick={(e) => { setNameReasonCodeID(row.NameReasonCodeID); setIsActive('0'); setConfirmType("InActive") }}
                  className="btn btn-sm  text-white px-1 py-0 mr-1" style={{ background: "#ddd" }}>
                  <i class="fa fa-toggle-on" style={{ color: "green" }} aria-hidden="true"></i>
                </Link>
                :
                <Link to="/ListManagement?page=Name Reason Code" data-toggle="modal" data-target="#ConfirmModal" onClick={(e) => { setNameReasonCodeID(row.NameReasonCodeID); setIsActive('1'); setConfirmType("Active") }}
                  className="btn btn-sm  text-white px-1 py-0 mr-1" style={{ background: "#ddd" }}>
                  <i class="fa fa-toggle-off" style={{ color: "red" }} aria-hidden="true"></i>
                </Link>
              : <></>
              : <></>
          }

        </div>
      </>
    }
  ]

  // to set Button add or update condition
  const setEditValue = (e, row) => {
    setNameReasonStatus(NameReasonStatus + 1)
    setModal(true); setStatus(true); setNameReasonCodeID(row.NameReasonCodeID)
  }

  const setStatusFalse = (e) => {
    setStatus(false);
    setModal(true)
  }


  return (

    <>
      <div className="row">
        <div className="col-12 col-md-6 col-lg-12 ">
          <ul class="nav nav-tabs" id="myTab" role="tablist">
            <li class="nav-item" role="presentation">
              <a class={`nav-link ${pageStatus === '1' ? 'active' : ''}`} onClick={() => setPageStatus("1")} id="home-tab" data-bs-toggle="tab" data-bs-target="#" type="button" role="tab" aria-controls="home" aria-selected="true">Active</a>
            </li>
            <li class="nav-item" role="presentation">
              <a class={`nav-link ${pageStatus === '0' ? 'active' : ''}`} onClick={() => setPageStatus("0")} id="home-tab" data-bs-toggle="tab" data-bs-target="#" type="button" role="tab" aria-controls="home" aria-selected="true">InActive</a>
            </li>
          </ul>
        </div>
        <div className="col-12 col-md-12 col-lg-12 ">
          <div className="row mt-2">
            <div className="col-12 ">
              <div className="bg-green text-white py-1 px-2 d-flex justify-content-between align-items-center">
                <p className="p-0 m-0">Name Reason Code</p>
                {
                  pageStatus === '1' ?
                    EffectiveScreenPermission ? EffectiveScreenPermission[0]?.AddOK ?
                      <Link to="/ListManagement?page=Name Reason Code" className="text-white" onClick={setStatusFalse}
                        data-toggle="modal" data-target="#NameReason" >
                        <i className="fa fa-plus"></i>
                      </Link>
                      : <></>
                      : <Link to="/ListManagement?page=Name Reason Code" className="text-white" onClick={setStatusFalse}
                        data-toggle="modal" data-target="#NameReason" >
                        <i className="fa fa-plus"></i>
                      </Link>
                    : <></>
                }
                {/* <Link to="/ListManagement?page=Property Description" className="text-white" onClick={setStatusFalse}
                  data-toggle="modal" data-target="#NameReasonCodes" >
                  <i className="fa fa-plus"></i>
                </Link> */}
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 mt-2 ">
          <div className="row">
            <div className="col-5">
              <input type="text" onChange={(e) => {
                setSearchValue1(e.target.value);
                const result = Filter(NameReasonData, e.target.value, searchValue2, filterNameReasonCode, 'ReasonCode', 'Description')
                setNameReasonFilterData(result)
              }}
                className='form-control' placeholder='Search By Code...' />
            </div>
            <div className='col-1 '>
              <Dropdown>
                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                  <i className="fa fa-filter"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setfilterNameReasonCode('Contains')}>Contains</Dropdown.Item>
                  <Dropdown.Item onClick={() => setfilterNameReasonCode('is equal to')}>is equal to</Dropdown.Item>
                  <Dropdown.Item onClick={() => setfilterNameReasonCode('is not equal to')}>is not equal to </Dropdown.Item>
                  <Dropdown.Item onClick={() => setfilterNameReasonCode('Starts With')}>Starts With</Dropdown.Item>
                  <Dropdown.Item onClick={() => setfilterNameReasonCode('End with')}>End with</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className="col-5">
              <input type="text" onChange={(e) => {
                setSearchValue2(e.target.value)
                const result = Filter(NameReasonData, searchValue1, e.target.value, filterNameReason, 'ReasonCode', 'Description')
                setNameReasonFilterData(result)
              }}
                className='form-control' placeholder='Search By Description...' />
            </div>
            <div className='col-1'>
              <Dropdown>
                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                  <i className="fa fa-filter"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setfilterNameReason('Contains')}>Contains</Dropdown.Item>
                  <Dropdown.Item onClick={() => setfilterNameReason('is equal to')}>is equal to</Dropdown.Item>
                  <Dropdown.Item onClick={() => setfilterNameReason('is not equal to')}>is not equal to </Dropdown.Item>
                  <Dropdown.Item onClick={() => setfilterNameReason('Starts With')}>Starts With</Dropdown.Item>
                  <Dropdown.Item onClick={() => setfilterNameReason('End with')}>End with</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </div>
        <div className="table-responsive mt-2">
          <div className="col-12">
            <div className="row ">
              <div className="col-12">
                <DataTable
                  columns={columns}
                  data={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? NameReasonFilterData : '' : NameReasonFilterData}
                  // data={NameReasonData}
                  dense
                  paginationPerPage={'10'}
                  paginationRowsPerPageOptions={[5, 10, 15]}
                  highlightOnHover
                  noContextMenu
                  pagination
                  responsive
                  subHeaderAlign="right"
                  // fixedHeader
                  subHeaderWrap
                  noDataComponent={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <Criminal_Add_Up {...{ NameReasonCodeID, status, get_data_CrimeBias, NameReasonData, modal, setModal, NameReasonStatus }} /> */}
      <NameReason_Add_Up {...{ NameReasonCodeID, status, get_data_NameReason, NameReasonData, modal, setModal, NameReasonStatus }} />
      <ConfirmModal func={UpdActiveDeactive} confirmType={confirmType} />
    </>
  )
}

export default NameReason