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
import CourtName_Add_Up from './CourtName_Add_Up';
import { useContext } from 'react';
import { AgencyContext } from '../../../../../Context/Agency/Index';


const CourtName = () => {

  const { localStoreArray, setLocalStoreArray, get_LocalStorage, } = useContext(AgencyContext);
  const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState();
  const [CourtNameData, setCourtNameData] = useState();
  const [status, setStatus] = useState(false);
  // const [tabstatus, setTabStatus] = useState(false);
  const [pageStatus, setPageStatus] = useState("1");
  const [modal, setModal] = useState(false)
  // FilterData 
  const [filterCourtNameCode, setfilterCourtNameCode] = useState('Contains');
  const [filterCourtName, setfilterCourtName] = useState('Contains');
  const [CourtNameFilterData, setCourtNameFilterData] = useState();
  const [CourtNameStatus, setCourtNameStatus] = useState(0);
  //filter SearchVal
  const [searchValue1, setSearchValue1] = useState('');
  const [searchValue2, setSearchValue2] = useState('');
  const [cityId, setCityId] = useState('');
  const [stateId, setStateId] = useState('');
  const [cityList, setCityList] = useState([]);
  const [zipList, setZipList] = useState([]);

  const [LoginAgencyID, setLoginAgencyID] = useState('');
  const [LoginPinID, setLoginPinID] = useState('');
  const [IsSuperadmin, setIsSuperadmin] = useState(0);

  const localStore = {
    Value: "",
    UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
    Key: JSON.stringify({ AgencyID: "", PINID: "", IsSuperadmin: '' }),
  }

  useEffect(() => {
    if (!localStoreArray.AgencyID || !localStoreArray.PINID) {
      get_LocalStorage(localStore);
    }
  }, []);

  // Onload Function
  useEffect(() => {
    if (localStoreArray) {
      if (localStoreArray?.AgencyID && localStoreArray?.PINID && localStoreArray?.IsSuperadmin) {
        setLoginAgencyID(localStoreArray?.AgencyID);
        setLoginPinID(localStoreArray?.PINID);
        setIsSuperadmin(localStoreArray?.IsSuperadmin);
        get_data_CourtName(localStoreArray?.AgencyID, localStoreArray?.PINID, localStoreArray?.IsSuperadmin);
      }
    }
  }, [localStoreArray, pageStatus])

  // useEffect(() => {
  //   get_data_CourtName();
  // }, [pageStatus])


  const get_data_CourtName = (LoginAgencyID, LoginPinID, IsSuperadmin) => {
    const val = {
      IsActive: pageStatus,
      AgencyID: LoginAgencyID,
      PINID: LoginPinID,
      IsSuperadmin: IsSuperadmin,
    }
    fetch_Post_Data('CourtName/GetData_CourtName', val)
      .then((res) => {
        if (res) {
          setCourtNameData(res?.Data)
          setCourtNameFilterData(res?.Data);
          setEffectiveScreenPermission(res?.Permision)
        }
        else { setCourtNameData(); setCourtNameFilterData(); setEffectiveScreenPermission() }
      })
  }

  const [IsActive, setIsActive] = useState('')
  const [CourtID, setCourtID] = useState('')
  const [confirmType, setConfirmType] = useState('')

  const UpdActiveDeactive = () => {
    const value = {
      'IsActive': IsActive,
      'CourtID': CourtID,
      'DeletedByUserFK': LoginPinID,
    }
    AddDeleteUpadate('CourtName/DeleteCourtName', value)
      .then(res => {
        if (res.success) {
          toastifySuccess(res.Message);
          get_data_CourtName(LoginAgencyID, LoginPinID, IsSuperadmin);
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
      selector: (row) => row.CourtNameCode,
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
      name: 'IsEditable',
      selector: (row) => <> <input type="checkbox" checked={checkEdittable(row.IsEditable)} disabled /></>,
      sortable: true
    },
    {
      name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 60 }}>Action</p>,
      cell: row => <>
        <div style={{ position: 'absolute', top: 0, right: 40 }}>
          {
            pageStatus === "1" ?
              EffectiveScreenPermission ? EffectiveScreenPermission[0]?.ChangeOK ?
                <Link to="/ListManagement?page=Court Name" data-toggle="modal" data-target="#CourtNameCodes" onClick={(e) => { setEditValue(e, row) }}
                  className="btn btn-sm bg-green text-white px-1 py-0 mr-2"><i className="fa fa-edit"></i>
                </Link>
                : <></>
                : <></>
              : <></>
          }
          {
            EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DeleteOK ?
              pageStatus === "1" ?
                < Link to="/ListManagement?page=Court Name" data-toggle="modal" data-target="#ConfirmModal" onClick={(e) => { setCourtID(row.CourtID); setIsActive('0'); setConfirmType("InActive") }}
                  className="btn btn-sm  text-white px-1 py-0 mr-1" style={{ background: "#ddd" }}>
                  <i class="fa fa-toggle-on" style={{ color: "green" }} aria-hidden="true"></i>
                </Link>
                :
                <Link to="/ListManagement?page=Court Name" data-toggle="modal" data-target="#ConfirmModal" onClick={(e) => { setCourtID(row.CourtID); setIsActive('1'); setConfirmType("Active") }}
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

  const checkEdittable = (val) => { const check = { "1": true, "0": false }; return check[val] }
  // to set Button add or update condition
  const setEditValue = (e, row) => {
    // console.log(row);
    getCity(row?.StateId); getZipCode(row?.CityId)
    setCourtNameStatus(CourtNameStatus + 1); setStateId(row?.StateId); setCityId(row?.CityId)
    setModal(true); setStatus(true); setCourtID(row.CourtID)
  }

  const setStatusFalse = (e) => {
    setStatus(false);
    setModal(true)
  }

  const getCity = async (stateID) => {
    const val = {
      StateID: stateID
    }
    fetchPostData("State_City_ZipCode/GetData_City", val).then((data) => {
      if (data) {
        setCityList(changeArrayFormat(data, 'city'))
      } else {
        setCityList([]);
      }
    })
  }

  const getZipCode = async (cityID) => {
    const val = {
      CityId: cityID
    }
    fetchPostData("State_City_ZipCode/GetData_ZipCode", val).then((data) => {
      if (data) {
        setZipList(changeArrayFormat(data, 'zip'))
      } else {
        setZipList([]);
      }
    })
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
                <p className="p-0 m-0">Court Name</p>
                {
                  pageStatus === '1' ?
                    EffectiveScreenPermission ? EffectiveScreenPermission[0]?.AddOK ?
                      <Link to="/ListManagement?page=Court Name" className="text-white" onClick={setStatusFalse}
                        data-toggle="modal" data-target="#CourtNameCodes" >
                        <i className="fa fa-plus"></i>
                      </Link>
                      : <></>
                      : <Link to="/ListManagement?page=Court Name" className="text-white" onClick={setStatusFalse}
                        data-toggle="modal" data-target="#CourtNameCodes" >
                        <i className="fa fa-plus"></i>
                      </Link>
                    : <></>
                }
                {/* <Link to="/ListManagement?page=Property Description" className="text-white" onClick={setStatusFalse}
                  data-toggle="modal" data-target="#CourtNameCodes" >
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
                const result = Filter(CourtNameData, e.target.value, searchValue2, filterCourtNameCode, 'CourtNameCode', 'Description')
                setCourtNameFilterData(result)
              }}
                className='form-control' placeholder='Search By Code...' />
            </div>
            <div className='col-1 '>
              <Dropdown>
                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                  <i className="fa fa-filter"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setfilterCourtNameCode('Contains')}>Contains</Dropdown.Item>
                  <Dropdown.Item onClick={() => setfilterCourtNameCode('is equal to')}>is equal to</Dropdown.Item>
                  <Dropdown.Item onClick={() => setfilterCourtNameCode('is not equal to')}>is not equal to </Dropdown.Item>
                  <Dropdown.Item onClick={() => setfilterCourtNameCode('Starts With')}>Starts With</Dropdown.Item>
                  <Dropdown.Item onClick={() => setfilterCourtNameCode('End with')}>End with</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className="col-5">
              <input type="text" onChange={(e) => {
                setSearchValue2(e.target.value)
                const result = Filter(CourtNameData, searchValue1, e.target.value, filterCourtName, 'CourtNameCode', 'Description')
                setCourtNameFilterData(result)
              }}
                className='form-control' placeholder='Search By Description...' />
            </div>
            <div className='col-1'>
              <Dropdown>
                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                  <i className="fa fa-filter"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setfilterCourtName('Contains')}>Contains</Dropdown.Item>
                  <Dropdown.Item onClick={() => setfilterCourtName('is equal to')}>is equal to</Dropdown.Item>
                  <Dropdown.Item onClick={() => setfilterCourtName('is not equal to')}>is not equal to </Dropdown.Item>
                  <Dropdown.Item onClick={() => setfilterCourtName('Starts With')}>Starts With</Dropdown.Item>
                  <Dropdown.Item onClick={() => setfilterCourtName('End with')}>End with</Dropdown.Item>
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
                  data={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? CourtNameFilterData : '' : CourtNameFilterData}
                  // data={CourtNameData}
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
      {/* <Criminal_Add_Up {...{ CourtID, status, get_data_CrimeBias, CourtNameData, modal, setModal, CourtNameStatus }} /> */}
      <CourtName_Add_Up {...{ LoginAgencyID, LoginPinID, IsSuperadmin, CourtID, status, get_data_CourtName, CourtNameData, modal, setModal, CourtNameStatus, getZipCode, getCity, zipList, cityList, setZipList, setCityList }} />
      <ConfirmModal func={UpdActiveDeactive} confirmType={confirmType} />
    </>
  )
}

export default CourtName

export const changeArrayFormat = (data, type) => {
  if (type === 'zip') {
    const result = data?.map((sponsor) =>
      ({ value: sponsor.zipId, label: sponsor.Zipcode })
    )
    return result
  }
  if (type === 'state') {
    const result = data?.map((sponsor) =>
      ({ value: sponsor.StateID, label: sponsor.StateName })
    )
    return result
  }
  if (type === 'city') {
    const result = data?.map((sponsor) =>
      ({ value: sponsor.CityID, label: sponsor.CityName })
    );
    return result
  }

}