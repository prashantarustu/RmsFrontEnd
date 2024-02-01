import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Location from '../../../../Location/Location'
import { useState } from 'react'
import DataTable from 'react-data-table-component'
import { fetchPostData } from '../../../../hooks/Api'
import { Decrypt_Id_Name, getShowingDateText } from '../../../../Common/Utility'
import { AgencyContext } from '../../../../../Context/Agency/Index'

const LocationHistory = () => {

  const { incidentStatus, showIncPage, setShowIncPage, localStoreArray, setLocalStoreArray, get_LocalStorage, } = useContext(AgencyContext);
  const [LocationData, setLocationData] = useState([]);

  const [MainIncidentID, setMainIncidentID] = useState('');
  const [LoginAgencyID, setLoginAgencyID] = useState('');
  const [LoginPinID, setLoginPinID,] = useState('');

  const localStore = {
    Value: "",
    UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
    Key: JSON.stringify({ AgencyID: "", PINID: "", IncidentID: '' }),
  }

  useEffect(() => {
    if (!localStoreArray.AgencyID || !localStoreArray.PINID) {
      get_LocalStorage(localStore);
    }
  }, []);

  // Onload Function
  useEffect(() => {
    console.log("localStoreArray Location", localStoreArray)
    if (localStoreArray) {
      if (localStoreArray?.AgencyID && localStoreArray?.PINID && localStoreArray?.IncidentID) {
        setLoginAgencyID(localStoreArray?.AgencyID);
        setLoginPinID(localStoreArray?.PINID);
        setMainIncidentID(localStoreArray?.IncidentID);
        get_LocationData(localStoreArray?.IncidentID);
      }
    }
  }, [localStoreArray])

  const get_LocationData = (MainIncidentID) => {
    const val = {
      'IncidentID': MainIncidentID
    }
    fetchPostData('Incident/GetData_IncidentLocation', val).then((res) => {
      if (res?.length > 0) {
        console.log(res)
        setLocationData(res)
      } else {
        setLocationData([]);
      }
    })
  }

  const columns = [
    {
      width:'700px',
      name: 'Address',
      selector: (row) => row.IncidentAddress,
      // selector: (row) => <>{row?.IncidentAddress ? row?.IncidentAddress.substring(0, 80) : ''}{row?.IncidentAddress?.length > 40 ? '  . . .' : null} </>,
      sortable: true
    },
    // {
    //   name: 'Date',
    //   selector: (row) => getShowingDateText(row.LocationDate),
    //   sortable: true
    // },
  ]

  return (
    <>
      <div className="col-md-12 mt-2">
        <div className="row">
          <div className="col-md-12">
            <div className="bg-line text-white py-1 px-2 d-flex justify-content-between align-items-center">
              <p className="p-0 m-0">Location History</p>
              <p className="p-0 m-0">
              </p>
            </div>
            <div className="row ">
              <div className="col-12 ">
                <DataTable
                  dense
                  columns={columns}
                  data={LocationData ? LocationData : []}
                  pagination
                  selectableRowsHighlight
                  highlightOnHover
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default LocationHistory