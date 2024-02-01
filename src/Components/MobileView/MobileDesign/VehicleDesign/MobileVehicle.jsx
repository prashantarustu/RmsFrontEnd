import React from 'react'
import DataTable from 'react-data-table-component'
import { Link } from 'react-router-dom'
import MobileTab from '../../MobileUtility/MobileTab'
import { useState } from 'react'
import { Decrypt_Id_Name, Encrypted_Id_Name, tableCustomStyles } from '../../../Common/Utility'
import { useContext } from 'react'
import { AgencyContext } from '../../../../Context/Agency/Index'
import { useEffect } from 'react'
import { AddDeleteUpadate, fetchPostData } from '../../../hooks/Api'
import DeletePopUpModal from '../../../Common/DeleteModal'
import { toastifySuccess } from '../../../Common/AlertMsg'

const MobileVehicle = () => {

  const { get_vehicle_Count, get_Incident_Count, VehicleData, updateCount, setUpdateCount, setIncStatus, VehicleFilterData, setVehicleFilterData, setIncidentStatus, localStoreArray, setLocalStoreArray, get_LocalStorage, vehicleStatus, setVehicleStatus, deleteStoreData, storeData } = useContext(AgencyContext)
  //screen permission 
  const [masterPropertyID, setMasterPropertyID] = useState('');
  const [MainIncidentID, setMainIncidentID] = useState('');
  const [LoginAgencyID, setLoginAgencyID] = useState('');
  const [LoginPinID, setLoginPinID,] = useState('');
  const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState();
  const [vehicleId, setVehicleId] = useState('');
  const [VehicleFrwData, setVehicleFrwData] = useState([]);



  const localStore = {
    Value: "",
    UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
    Key: JSON.stringify({ AgencyID: "", PINID: "", IncidentID: '', IncidentStatus: '', IncidentNumber: '', }),
  }

  useEffect(() => {
    if (!localStoreArray?.AgencyID || !localStoreArray?.PINID || !localStoreArray.IncidentID || !localStoreArray.IncidentStatus) {
      get_LocalStorage(localStore);
    }
  }, []);

  // Onload Function
  useEffect(() => {
    if (localStoreArray) {
      if (localStoreArray?.AgencyID && localStoreArray?.PINID) {
        setLoginAgencyID(localStoreArray?.AgencyID);
        setLoginPinID(localStoreArray?.PINID);
        setMainIncidentID(localStoreArray?.IncidentID);
        if (localStoreArray.IncidentID) {
          get_Incident_Count(localStoreArray?.IncidentID);
          get_Data_Vehicle_Frw(localStoreArray?.IncidentId)
        }
      }
      setIncidentStatus(true);
    }
  }, [localStoreArray])


  useEffect(() => {
    get_Data_Vehicle_Frw(MainIncidentID);
  },[MainIncidentID])


  // useEffect(() => {
  //   if (MainIncidentID) {
  //     get_Data_Vehicle_Frw(MainIncidentID);
  //   }
  // }, [MainIncidentID])

  const get_Data_Vehicle_Frw = (MainIncidentID) => {
    const val = {
      'IncidentID': MainIncidentID,
    }
    fetchPostData('PropertyVehicle_FRW/GetData_Vehicle_FRW', val).then((res) => {
      console.log(res);
      if (res) {
        setVehicleFrwData(res);
      } else {
        setVehicleFrwData([]);
      }
    })
  }

  // const setEditVal = (row) => {
  //     setVehicleId(row.VehicleID); 
  //     sessionStorage.setItem("VehicleID", Encrypted_Id_Name(row.VehicleID, 'VForVehicleID'));
  //     setUpdateCount(updateCount + 1)
  //     setIncStatus(true)
  // }

  // const setEditVal = (row) => {
  //   console.log(row)
  //   if (row.VehicleID) {
  //     setVehicleId(row.VehicleID);
  //     console.log(row.VehicleID)
  //     // sessionStorage.setItem("VehicleID", Encrypted_Id_Name(row.VehicleID, 'VForVehicleID'));
  //   }
  //   setUpdateCount(updateCount + 1)
  //   setIncStatus(true)
  // }


  const columns = [
    {
      name: <p className='text-end' style={{ position: 'absolute', top: '7px' }}>Action</p>,
      cell: row => <>
        {
          EffectiveScreenPermission ? EffectiveScreenPermission[0]?.Changeok ?
            <Link to={'/mobile-vehicle'} onClick={(e) => setEditVal(row)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1 new-button">
              <i className="fa fa-edit"></i>
            </Link>
            : <></>
            : <Link to={'/mobile-vehicle'} onClick={(e) => setEditVal(row)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1 new-button">
              <i className="fa fa-edit"></i>
            </Link>
        }
      </>
    },

    {
      name: 'Vehicle Number',
      selector: (row) => row.VehicleNumber,
      sortable: true
    },
    {
      name: 'Model Description',
      selector: (row) => row.Model_Description,
      sortable: true
    },
    {
      name: 'Manufacture Year',
      selector: (row) => row.ManufactureYear,
      sortable: true
    },
    {
      name: 'Owner Description',
      selector: (row) => row.Owner_Description,
      sortable: true
    },
    {
      name: <p className='text-end' style={{ position: 'absolute', top: '7px' }}>Action</p>,
      cell: row => <>
        {
          EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DeleteOK ?
            <Link to={`#`} onClick={(e) => { setVehicleId(row.VehicleID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1 new-button" data-toggle="modal" data-target="#DeleteModal">
              <i className="fa fa-trash"></i>
            </Link>
            : <></>
            : <Link to={`#`} onClick={(e) => { setVehicleId(row.VehicleID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1 new-button" data-toggle="modal" data-target="#DeleteModal">
              <i className="fa fa-trash"></i>
            </Link>
        }
      </>
    }
  ]
  const setEditVal = (row) => {
    console.log(row);
    setVehicleId(row.VehicleID);
    setUpdateCount(updateCount + 1)
    setIncStatus(true);
    setVehicleStatus(true);
    if (row.VehicleID) {
      storeData({ 'VehicleID': row.VehicleID, 'VehicleStatus': true })
    }
  }
  const Delete_Vehicle = () => {
    const val = {
      'VehicleID': vehicleId,
      'DeletedByUserFK': LoginPinID
    }
    AddDeleteUpadate('PropertyVehicle_FRW/Delete_Vehicle_FRW', val).then((res) => {
      if (res) {
        toastifySuccess(res.Message);
        get_Data_Vehicle_Frw(MainIncidentID);
      } else {
        console.log("Something Wrong");
      }
    })
  }
  return (
    <>
      <div class="section-body view_page_design ">
        <div className="row clearfix">
          <div className="col-12 col-sm-12 px-2">
            <div className="card Agency " style={{ borderRight: 'none', borderLeft: 'none', borderRadius: '0' }}>
              <div className="card-body ">
                <div className="row  ">
                  <div className={`col-12 col-md-12`}>
                    <div className="row">
                      <div className="col-12  mobile__tabs" style={{ marginTop: '-18px', marginBottom: '-20px' }}>
                        <MobileTab />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-12 px-3">
            <div className="bg-line text-white py-1  px-0 d-flex justify-content-between align-items-center" >
              <p className="p-0 m-0 pl-3 py-1 col-4" style={{ fontSize: '18px', }}>
                Vehicle
              </p>
              <div style={{ marginLeft: 'auto' }}>
                <Link to="/mobile-vehicle" onClick={() => {
                  setVehicleStatus(false); setIncStatus(false);
                  deleteStoreData({ 'VehicleID': '', 'VehicleStatus': '' });
                  // storeData({ 'VehicleStatus': false })
                }} className="btn btn-sm bg-green text-white px-2 py-0" data-toggle="modal" data-target="#">
                  <i className="fa fa-plus"></i>
                </Link>
              </div>
              {/* <Link to={'/mobile-vehicle'} onClick={() => { ('VehicleID') }} className="btn btn-sm bg-green text-white px-2 py-0 new-button ">
                <i className="fa fa-plus"></i>
              </Link> */}
            </div>
            <div className="col-12 mt-2 px-3" >
              <DataTable
                columns={columns}
                data={VehicleFrwData}
                dense
                pagination
                paginationPerPage={'5'}
                paginationRowsPerPageOptions={[5, 15, 20]}
                highlightOnHover
                // subHeader
                responsive
                customStyles={tableCustomStyles}
                className='mobile-datatable'
                showPaginationBottom={5}
                subHeaderComponent={''}
                subHeaderAlign='left'
              />
            </div>
          </div>
        </div>
      </div>
      <DeletePopUpModal func={Delete_Vehicle} />

    </>
  )
}

export default MobileVehicle