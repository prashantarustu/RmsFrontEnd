import React, { useEffect } from 'react'
import DataTable from 'react-data-table-component'
import { Decrypt_Id_Name, Encrypted_Id_Name, tableCustomStyles } from '../../../Common/Utility'
import MobileTab from '../../MobileUtility/MobileTab'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AddDeleteUpadate, fetchPostData } from '../../../hooks/Api'
import { AgencyContext } from '../../../../Context/Agency/Index'
import { useContext } from 'react'
import { toastifySuccess } from '../../../Common/AlertMsg'
import DeletePopUpModal from '../../../Common/DeleteModal'

const MobileProperty = () => {

  const { updateCount, setUpdateCount, setIncStatus, get_Property_Count, get_Incident_Count } = useContext(AgencyContext)
  const [propertyID, setPropertyID] = useState();
  const [propertyData, setPropertyData] = useState([]);
  const [propertyFilterData, setPropertyFilterData] = useState([]);

  useEffect(() => {
    get_Property_Data();
  }, [])

  const get_Property_Data = () => {
    const val = {
      'IncidentID':'',
      // 'IncidentID': sessionStorage.getItem('IncidentId') ? Decrypt_Id_Name(sessionStorage.getItem('IncidentId'), 'IForIncidentId') : '',
    }
    fetchPostData('Property_FRW/GetData_Property_FRW', val).then((res) => {
      if (res) {
        setPropertyData(res); setPropertyFilterData(res);
      } else {
        setPropertyData([]); setPropertyFilterData([]);
      }
    })
  }

  const columns = [
    {
      name: <p className='text-end' style={{ position: 'absolute', top: '7px',left:10 }}>Action</p>,
      cell: row => <>
      <div className="div"  style={{ position: 'absolute',left:10 }}>

        <Link to={'/mobile-property'} onClick={(e) => { setEditVal(row) }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1 new-button">
          <i className="fa fa-edit"></i>
        </Link>
      </div>
      </>
    },
    {
      name: 'Property Number',
      selector: (row) => row.PropertyNumber,
      sortable: true
    },
    {
      name: 'Officer Name',
      selector: (row) => row.Officer_Name,
      sortable: true
    },
    {
      name: 'Property Type',
      selector: (row) => row.PropertyType_Description,
      sortable: true
    },
    {
      name: <p className='text-end' style={{ position: 'absolute', top: '7px', right: 0}}>Delete</p>,
      cell: row => <>
      <div className="div" style={{ position: 'absolute',right:4 }}>

        <Link to={`#`} onClick={(e) => setPropertyID(row.PropertyID)}  className="btn btn-sm bg-green text-white px-1 py-0 mr-1 new-button" data-toggle="modal"data-target="#DeleteModal">
          <i className="fa fa-trash"></i>
        </Link>
      </div>

      </>
    }
  ]

  const setEditVal = (row) => {
    console.log(row)
    if (row.PropertyID) {
      setPropertyID(row.PropertyID)
      console.log(row.PropertyID)
      // sessionStorage.setItem("PropertyID", Encrypted_Id_Name(row.PropertyID, 'PForPropertyID'));
    }
    setUpdateCount(updateCount + 1)
    setIncStatus(true)
  }

  const Delete_Property = () => {
    const val = {
      'PropertyID': propertyID,
      'DeletedByUserFK': '',
    }
    AddDeleteUpadate('Property_FRW/Delete_Property_FRW', val).then((res) => {
      if (res) {
        toastifySuccess(res.Message);
        get_Property_Data();
      } else console.log("Somthing Wrong");
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
                Property
              </p>
              <Link to={'/mobile-property'} onClick={() => {('PropertyID') }} className="btn btn-sm bg-green text-white px-2 py-0 new-button mr-2">
                <i className="fa fa-plus"></i>
              </Link>
            </div>
            <div className="col-12 mt-2 " >
              <DataTable
                columns={columns}
                data={propertyData}
                dense
                pagination
                paginationPerPage={'5'}
                paginationRowsPerPageOptions={[5]}
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
      <DeletePopUpModal func={Delete_Property} />
    </>
  )
}



export default MobileProperty

