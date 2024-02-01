import React from 'react'
import { Link } from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown';
import DataTable from 'react-data-table-component';
import { useState, useEffect } from 'react';
import { AddDeleteUpadate, fetchPostData, fetch_Post_Data, UtilityPersonnelScreenPermision } from '../../../../hooks/Api';
import { Decrypt_Id_Name } from '../../../../Common/Utility';
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import ConfirmModal from '../../../../Common/ConfirmModal';
import { Filter } from '../../../../Filter/Filter';
import BloodType_Add_Up from './BloodType_Add_Up';
import { useContext } from 'react';
import { AgencyContext } from '../../../../../Context/Agency/Index';


const BloodType = () => {

  const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState()

  const [BloodTypeData, setBloodTypeData] = useState();

  const [status, setStatus] = useState(false);
  // const [tabstatus, setTabStatus] = useState(false);
  const [pageStatus, setPageStatus] = useState("1")
  const [modal, setModal] = useState(false)
  // FilterData 
  const [filterBloodTypeIdOption, setfilterBloodTypeIdOption] = useState('Contains');
  const [filterBloodTypeDescOption, setfilterBloodTypeDescOption] = useState('Contains');
  const [BloodTypeFilterData, setBloodTypeFilterData] = useState();
  const [BloodTypeupdStatus, setBloodTypeupdStatus] = useState(0)
  //filter SearchVal
  const [searchValue1, setSearchValue1] = useState('')
  const [searchValue2, setSearchValue2] = useState('')

  useEffect(() => {
    get_data_Blood_Type();
    //  getScreenPermision();
  }, [pageStatus])

  // Screen Permision
  // const getScreenPermision = () => {
  //   UtilityPersonnelScreenPermision("L006", 0).then(res => {
  //     if (res) setEffectiveScreenPermission(res)
  //     else setEffectiveScreenPermission()
  //   });
  // }


  const get_data_Blood_Type = () => {
    const val = {
      AgencyID: Decrypt_Id_Name(localStorage.getItem('AgencyID'), 'AForAgencyID'),
      IsActive: pageStatus,
      IsSuperadmin: Decrypt_Id_Name(localStorage.getItem('IsSuperadmin'), 'IsForSuperadmin'),
      PINID: Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID')
    }
    fetch_Post_Data('TableManagement/GetData_BloodType', val)
      .then((res) => {
        if (res) {
          // console.log(res);   
          setBloodTypeData(res?.Data)
          setBloodTypeFilterData(res?.Data);
          setEffectiveScreenPermission(res?.Permision)
          // console.log(res?.Permision);
        }
        else { setBloodTypeData(); setBloodTypeFilterData(); setEffectiveScreenPermission() }
      })
  }

  const [IsActive, setIsActive] = useState('')
  const [BloodTypeID, setBloodTypeID] = useState('')
  const [confirmType, setConfirmType] = useState('')

  const UpdActiveDeactive = () => {
    const value = {
      'IsActive': IsActive,
      'BloodTypeID': BloodTypeID,
      'DeletedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
    }
    console.log(value);
    AddDeleteUpadate('TableManagement/Delete_BloodType', value)
      .then(res => {
        if (res.success) {
          toastifySuccess(res.Message);
          get_data_Blood_Type();
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
      selector: (row) => row.BloodTypeCode,
      sortable: true
    },
    {
      name: 'AgencyCode',
      selector: (row) => row.AgencyCode,
      sortable: true
    },
    {
      name: 'Description',
      selector: (row) => row.BloodtypeDescription,
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
                <Link to="/ListManagement?page=Blood Type" data-toggle="modal" data-target="#BloodTypeModal" onClick={(e) => { setEditValue(e, row); }}
                  className="btn btn-sm bg-green text-white px-1 py-0 mr-2"><i className="fa fa-edit"></i>
                </Link>
                : <></>
                : <></>
              : <></>
          }

          {
            EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DeleteOK ?
              pageStatus === "1" ?
                < Link to="/ListManagement?page=Blood Type" data-toggle="modal" data-target="#ConfirmModal" onClick={(e) => { setBloodTypeID(row.BloodTypeID); setIsActive('0'); setConfirmType("InActive") }}
                  className="btn btn-sm  text-white px-1 py-0 mr-1" style={{ background: "#ddd" }}>
                  <i class="fa fa-toggle-on" style={{ color: "green" }} aria-hidden="true"></i>
                </Link>
                :
                <Link to="/ListManagement?page=Blood Type" data-toggle="modal" data-target="#ConfirmModal" onClick={(e) => { setBloodTypeID(row.BloodTypeID); setIsActive('1'); setConfirmType("Active") }}
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
    setBloodTypeupdStatus(BloodTypeupdStatus + 1); setBloodTypeID(row.BloodTypeID)
    setModal(true)
    // console.log("this is row",row)
    setStatus(true);
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
                <p className="p-0 m-0">Blood Type</p>
                {
                  pageStatus === '1' ?
                    EffectiveScreenPermission ? EffectiveScreenPermission[0]?.AddOK ?
                      <Link to="/ListManagement?page=Blood Type" className="text-white" onClick={setStatusFalse}
                        data-toggle="modal" data-target="#BloodTypeModal" >
                        <i className="fa fa-plus"></i>
                      </Link>
                      : <></>
                      : <Link to="/ListManagement?page=Blood Type" className="text-white" onClick={setStatusFalse}
                        data-toggle="modal" data-target="#BloodTypeModal" >
                        <i className="fa fa-plus"></i>
                      </Link>
                    : <></>
                }
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 mt-2 ">
          <div className="row">
            <div className="col-5">
              <input type="text" onChange={(e) => {
                setSearchValue1(e.target.value);
                const result = Filter(BloodTypeData, e.target.value, searchValue2, filterBloodTypeIdOption, 'BloodTypeCode', 'BloodtypeDescription')
                setBloodTypeFilterData(result)
              }}
                className='form-control' placeholder='Search By Code...' />
            </div>
            <div className='col-1'>
              <Dropdown>
                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                  <i className="fa fa-filter"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setfilterBloodTypeIdOption('Contains')}>Contains</Dropdown.Item>
                  <Dropdown.Item onClick={() => setfilterBloodTypeIdOption('is equal to')}>is equal to</Dropdown.Item>
                  <Dropdown.Item onClick={() => setfilterBloodTypeIdOption('is not equal to')}>is not equal to </Dropdown.Item>
                  <Dropdown.Item onClick={() => setfilterBloodTypeIdOption('Starts With')}>Starts With</Dropdown.Item>
                  <Dropdown.Item onClick={() => setfilterBloodTypeIdOption('End with')}>End with</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className="col-5">
              <input type="text" onChange={(e) => {
                setSearchValue2(e.target.value)
                const result = Filter(BloodTypeData, searchValue1, e.target.value, filterBloodTypeDescOption, 'BloodTypeCode', 'BloodtypeDescription')
                setBloodTypeFilterData(result)
              }}
                className='form-control' placeholder='Search By Description...' />
            </div>
            <div className='col-1'>
              <Dropdown>
                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                  <i className="fa fa-filter"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setfilterBloodTypeDescOption('Contains')}>Contains</Dropdown.Item>
                  <Dropdown.Item onClick={() => setfilterBloodTypeDescOption('is equal to')}>is equal to</Dropdown.Item>
                  <Dropdown.Item onClick={() => setfilterBloodTypeDescOption('is not equal to')}>is not equal to </Dropdown.Item>
                  <Dropdown.Item onClick={() => setfilterBloodTypeDescOption('Starts With')}>Starts With</Dropdown.Item>
                  <Dropdown.Item onClick={() => setfilterBloodTypeDescOption('End with')}>End with</Dropdown.Item>
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
                  data={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? BloodTypeFilterData : '' : ''}
                  // data={BloodTypeData}
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
      <BloodType_Add_Up {...{ BloodTypeID, status, get_data_Blood_Type, BloodTypeData, modal, setModal, BloodTypeupdStatus }} />
      <ConfirmModal func={UpdActiveDeactive} confirmType={confirmType} />
    </>
  )
}

export default BloodType