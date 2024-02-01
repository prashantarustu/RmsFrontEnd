import React, { useContext } from 'react'
import { useState, useEffect } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import DataTable from 'react-data-table-component';
import { Link } from "react-router-dom";
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import ConfirmModal from '../../../../Common/ConfirmModal';
import { Decrypt_Id_Name } from '../../../../Common/Utility';
import { Filter } from '../../../../Filter/Filter';
import { AddDeleteUpadate, fetchPostData, UtilityPersonnelScreenPermision } from '../../../../hooks/Api';
import Relation_Add_Up from './Relation_Add_Up';


const Relation = () => {

  const { utilityTable } = useContext(AgencyContext)
  const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState()

  const [relationData, setRelationData] = useState([]);
  const [relationFilterList, setRelationFilterList] = useState([]);
  const [updateID, setUpdateID] = useState('')
  const [pageStatus, setPageStatus] = useState("1")
  const [modal, setModal] = useState(false)
  const [relationFilterType, setRelationFilterType] = useState('Contains')
  const [relationUpdStatus, setRelationUpdStatus] = useState(0)
  //filter SearchVal
  const [searchValue1, setSearchValue1] = useState('')
  const [searchValue2, setSearchValue2] = useState('')

  useEffect(() => {
    get_data_Relation(); getScreenPermision();
  }, [pageStatus])

  // Screen Permision
  const getScreenPermision = () => {
    UtilityPersonnelScreenPermision(utilityTable.TableCode, utilityTable.TableID).then(res => {
      if (res) setEffectiveScreenPermission(res)
      else setEffectiveScreenPermission()
    });
  }

  const get_data_Relation = () => {
    const val = {
      IsActive: pageStatus,
      IsSuperadmin: Decrypt_Id_Name(localStorage.getItem('IsSuperadmin'), 'IsForSuperadmin'),
    }
    fetchPostData('TableManagement/GetData_RelationType', val)
      .then((res) => {
        if (res) {
          setRelationFilterList(res)
          setRelationData(res)
        } else {
          setRelationFilterList()
          setRelationData()
        }
      })
  }
  const [IsActive, setIsActive] = useState('')
  const [relationTypeId, setRelationTypeId] = useState('')
  const [confirmType, setConfirmType] = useState('')

  const UpdActiveDeactive = () => {
    const value = {
      'IsActive': IsActive,
      'RelationTypeID': relationTypeId,
      'DeletedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
    }
    AddDeleteUpadate('TableManagement/DeleteRelation', value)
      .then(res => {
        if (res.success) {
          toastifySuccess(res.Message);
          get_data_Relation()
        } else {
          toastifyError(res.data.Message)
        }
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }

  const columns = [
    {
      name: 'Code',
      selector: (row) => row.RelationTypeCode,
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
                <Link to="/ListManagement?page=Relation" data-toggle="modal" data-target="#RelationModal" onClick={(e) => { setUpdateID(row.RelationTypeID); setModal(true); setRelationUpdStatus(relationUpdStatus + 1) }}
                  className="btn btn-sm bg-green text-white px-1 py-0 mr-2"><i className="fa fa-edit"></i>
                </Link>
                : <></>
                : <></>
              : <></>
          }

          {
            EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DeleteOK ?
              pageStatus === "1" ?
                < Link to="/ListManagement?page=Relation" data-toggle="modal" data-target="#ConfirmModal" onClick={(e) => { setRelationTypeId(row.RelationTypeID); setIsActive('0'); setConfirmType("InActive") }}
                  className="btn btn-sm  text-white px-1 py-0 mr-1" style={{ background: "#ddd" }}>
                  <i class="fa fa-toggle-on" style={{ color: "green" }} aria-hidden="true"></i>
                </Link>
                :
                <Link to="/ListManagement?page=Relation" data-toggle="modal" data-target="#ConfirmModal" onClick={(e) => { setRelationTypeId(row.RelationTypeID); setIsActive('1'); setConfirmType("Active") }}
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

  return (
    <>
      <div className="row">
        <div className="col-12 col-md-6 col-lg-12 ">
          <ul class="nav nav-tabs" id="myTab" role="tablist">
            <li class="nav-item" role="presentation">
              <a class={`nav-link ${pageStatus === '1' ? 'active' : ''}`} id="home-tab" data-bs-toggle="tab" data-bs-target="#" type="button" role="tab" onClick={() => setPageStatus("1")} aria-controls="home" aria-selected="true">Active</a>
            </li>
            <li class="nav-item" role="presentation">
              <a class={`nav-link ${pageStatus === '0' ? 'active' : ''}`} id="home-tab" data-bs-toggle="tab" data-bs-target="#" type="button" role="tab" onClick={() => setPageStatus("0")} aria-controls="home" aria-selected="true">InActive</a>
            </li>
          </ul>
        </div>
        <div className="col-12 col-md-6 col-lg-12 ">
          <div className="row mt-2">
            <div className="col-12 ">
              <div className="bg-green text-white py-1 px-2 d-flex justify-content-between align-items-center">
                <p className="p-0 m-0">Relation</p>
                {
                  pageStatus === '1' ?
                    EffectiveScreenPermission ? EffectiveScreenPermission[0]?.AddOK ?
                      <Link to="/ListManagement?page=Relation" onClick={() => { setUpdateID(''); setModal(true) }} className="text-white"
                        data-toggle="modal" data-target="#RelationModal" >
                        <i className="fa fa-plus"></i>
                      </Link>
                      : <></>
                      : <Link to="/ListManagement?page=Relation" onClick={() => { setUpdateID(''); setModal(true) }} className="text-white"
                        data-toggle="modal" data-target="#RelationModal" >
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
              <input type="text"
                className='form-control'
                placeholder='Search By Code ...'
                onChange={(e) => {
                  setSearchValue1(e.target.value);
                  const result = Filter(relationData, e.target.value, searchValue2, relationFilterType, 'RelationTypeCode', 'Description')
                  setRelationFilterList(result)
                }}
              />
            </div>
            <div className='col-1'>
              <Dropdown>
                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                  <i className="fa fa-filter"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setRelationFilterType('Contains')}>Contains</Dropdown.Item>
                  <Dropdown.Item onClick={() => setRelationFilterType('is equal to')}>is equal to</Dropdown.Item>
                  <Dropdown.Item onClick={() => setRelationFilterType('is not equal to')}>is not equal to </Dropdown.Item>
                  <Dropdown.Item onClick={() => setRelationFilterType('Starts With')}>Starts With</Dropdown.Item>
                  <Dropdown.Item onClick={() => setRelationFilterType('End with')}>End with</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className="col-5">
              <input type="text"
                className='form-control'
                placeholder='Search By Desc ...'
                onChange={(e) => {
                  setSearchValue2(e.target.value);
                  const result = Filter(relationData, searchValue1, e.target.value, relationFilterType, 'RelationTypeCode', 'Description')
                  setRelationFilterList(result)
                }}
              />
            </div>

            <div className='col-1'>
              <Dropdown>
                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                  <i className="fa fa-filter"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setRelationFilterType('Contains')}>Contains</Dropdown.Item>
                  <Dropdown.Item onClick={() => setRelationFilterType('is equal to')}>is equal to</Dropdown.Item>
                  <Dropdown.Item onClick={() => setRelationFilterType('is not equal to')}>is not equal to </Dropdown.Item>
                  <Dropdown.Item onClick={() => setRelationFilterType('Starts With')}>Starts With</Dropdown.Item>
                  <Dropdown.Item onClick={() => setRelationFilterType('End with')}>End with</Dropdown.Item>
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
                  data={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? relationFilterList : '' : ''}
                  dense
                  paginationPerPage={'10'}
                  paginationRowsPerPageOptions={[5, 10, 15, 20]}
                  highlightOnHover
                  noContextMenu
                  pagination
                  responsive
                  subHeaderAlign="right"
                  // fixedHeader
                  // fixedHeaderScrollHeight='500px'
                  subHeaderWrap
                  noDataComponent={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                />
              </div>
              {/* <table className="table w-100">
                <tr>
                  <th>Relation Type Code</th>
                  <th>Description</th>
                  <th className="text-right">Action</th>
                </tr>
                <tr>

                  <td>A</td>
                  <td>Testing</td>
                  <td className="text-right">
                    <button type='button' data-toggle="modal" data-target="#RelationModal" className="btn btn-sm bg-green text-white px-2 py-0 mr-1"
                    ><i className="fa fa-edit"></i></button>
                    <button className="btn btn-sm bg-green text-white px-2 py-0" data-toggle="modal" data-target="" >
                        <input type="checkbox" />
                    </button>
                  </td>
                </tr>
              </table> */}
            </div>
          </div>
        </div>
      </div>
      <Relation_Add_Up {...{ updateID, get_data_Relation, pageStatus, setModal, modal, relationData, relationUpdStatus }} />
      <ConfirmModal func={UpdActiveDeactive} confirmType={confirmType} />
    </>
  )
}

export default Relation