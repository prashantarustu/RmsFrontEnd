import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api'
import { Decrypt_Id_Name, getShowingDateText } from '../../../../Common/Utility'
import { useEffect } from 'react'
import { toastifySuccess } from '../../../../Common/AlertMsg'
import DeletePopUpModal from '../../../../Common/DeleteModal'
import DataTable from 'react-data-table-component'
import { Comman_changeArrayFormat } from '../../../../Common/ChangeArrayFormat'
import Loader from '../../../../Common/Loader'
import Select from "react-select";
import { RequiredFieldIncident } from '../../../Utility/Personnel/Validation'
import { useContext } from 'react'
import { AgencyContext } from '../../../../../Context/Agency/Index'

const Property = ({ LoginPinID, LoginAgencyID, offenceID, MainIncidentID }) => {

  const { get_Offence_Count } = useContext(AgencyContext)
  const SelectedValue = useRef();
  //screen permission 
  const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState()
  const [PropertyDrp, setPropertyDrp] = useState();
  const [PropertyData, setPropertyData] = useState();
  const [PropertyOffenseID, setPropertyOffenseID] = useState();
  const [deleteStatus, setDeleteStatus] = useState(false)
  const [loder, setLoder] = useState(false)
  const [filterData, setfilterDta] = useState()

  const [value, setValue] = useState({
    'PropertyID': '',
    'labal': '',
    'OffenseID': offenceID,
    'IncidentId': MainIncidentID,
    'CreatedByUserFK': LoginPinID,
  })

  const [errors, setErrors] = useState({
    'DropError': '',
  })

  const Reset = () => {
    setValue({
      ...value,
      'PropertyID': '',
    })
    setErrors({
      ...errors,
      'DropError': '',
    });
  }

  const check_Validation_Error = (e) => {
    if (RequiredFieldIncident(value.PropertyID)) {
      setErrors(prevValues => { return { ...prevValues, ['DropError']: RequiredFieldIncident(value.PropertyID) } })
    }
  }

  // Check All Field Format is True Then Submit 
  const { DropError } = errors

  useEffect(() => {
    if (DropError === 'true') {
      Add_Offender();
    }
  }, [DropError])

  const ChangeDropDown = (e, name) => {
    if (e) {
      setValue({
        ...value,
        [name]: e.value
      })
    } else setValue({
      ...value,
      [name]: null
    })
  }

  useEffect(() => {
    get_Property_DropDown(offenceID, MainIncidentID);
    get_Property_Data(offenceID, MainIncidentID);
  }, [offenceID, MainIncidentID])

  const get_Property_Data = (offenceID, MainIncidentID) => {
    const val = {
      'OffenseID': offenceID,
      'IncidentId': MainIncidentID,
    }
    fetchPostData('PropertyOffense/GetData_PropertyOffense', val).then((res) => {
      if (res) {
        console.log(res);
        setPropertyData(res); setLoder(true)
      } else {
        setPropertyData([]); setLoder(true)
      }
    })
  }

  const get_Property_DropDown = (offenceID, MainIncidentID) => {
    const val = {
      'OffenseID': offenceID,
      'IncidentId': MainIncidentID,
    }
    fetchPostData('PropertyOffense/GetDataDropDown_PropertyOffense', val).then((data) => {
      if (data) {
        console.log(data)
        setfilterDta(data)
        setPropertyDrp(Comman_changeArrayFormat(data, 'PropertyID', 'PropertyNumber'))
      } else {
        setPropertyDrp([])
      }
    })
  }

  const Add_Offender = () => {
    AddDeleteUpadate('PropertyOffense/Insert_PropertyOffense', value).then((res) => {
      if (res) {
        toastifySuccess(res.Message);
        get_Offence_Count(offenceID)
        get_Property_DropDown(offenceID, MainIncidentID);
        get_Property_Data(offenceID, MainIncidentID);
        Reset();
        onClear(); setErrors({ ...value['DropError'] })
      }
    })
  }

  const DeleteOffender = () => {
    const val = {
      'PropertyOffenseID': PropertyOffenseID,
      'DeletedByUserFK': LoginPinID
    }
    AddDeleteUpadate('PropertyOffense/Delete_PropertyOffense', val).then((res) => {
      console.log(res)
      toastifySuccess(res.Message);
      get_Offence_Count(offenceID)
      setDeleteStatus(false)
      get_Property_DropDown(offenceID, MainIncidentID);
      get_Property_Data(offenceID, MainIncidentID);
    })
  }

  const onClear = () => {
    SelectedValue?.current?.clearValue();
    setValue(pre => { return { ...pre, ['PropertyID']: '', ['PropertyOffenseID']: '', ['labal']: '' } });
  };

  const colourStyles = {
    control: (styles) => ({
      ...styles, backgroundColor: "#fce9bf",
      height: 20,
      minHeight: 30,
      fontSize: 14,
      margintop: 2,
      boxShadow: 0,
    }),
  };

  const columns = [
    {
      name: 'Property Number',
      selector: (row) => row.PropertyNumber,
      sortable: true
    },
    {
      name: 'Type',
      selector: (row) => row.PropertyType_Description,
      sortable: true
    },
    {
      name: 'Property Reason',
      selector: (row) => row.PropertyLossCode_Description,
      sortable: true
    },
    {
      name: 'Reported Date/Time',
      selector: (row) =>  row.ReportedDtTm ? getShowingDateText(row.ReportedDtTm) : " ",
      sortable: true
    },
    {
      name: 'Property Value',
      // selector: (row) => row.Value,
      selector: (row) => row.Value,
      sortable: true
    },
    {
      name: <p className='text-end' style={{ position: 'absolute', top: 8, left: '15px' }}>Delete</p>,
      cell: row => <>
        {/* {
          EffectiveScreenPermission ? EffectiveScreenPermission[0]?.Changeok ?
             <Link to={''} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" onClick={() => { setEditVal(row) }}>
              <i className="fa fa-edit"></i>
            </Link> 
            : <></>
            : <></>
        } */}
        {
          EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DeleteOK ?
            <Link to={`#`} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" onClick={() => { setDeleteStatus(true); setPropertyOffenseID(row.PropertyOffenseID) }} data-toggle="modal" data-target="#DeleteModal">
              <i className="fa fa-trash"></i>
            </Link>
            : <></>
            : <Link to={`#`} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" onClick={() => { setDeleteStatus(true); setPropertyOffenseID(row.PropertyOffenseID) }} data-toggle="modal" data-target="#DeleteModal">
              <i className="fa fa-trash"></i>
            </Link>
        }
      </>
    }
  ]

  const tableCustomStyles = {
    rows: {
      style: {
        border: '3px solid aliceblue',
      },
    },
    headCells: {
      style: {
        fontWeight: 'bold',
        Color: '#000',
        backgroundColor: 'aliceblue',
      },
    },
  };


  const columns1 = [
    {
      name: 'Property Number',
      selector: (row) => row.PropertyNumber,
      sortable: true
    },
    {
      name: 'Type',
      selector: (row) => row.PropertyType_Description,
      sortable: true
    },
    {
      name: 'Reported Date/Time',
      selector: (row) =>  row.ReportedDtTm ? getShowingDateText(row.ReportedDtTm) : " ",
      sortable: true
    },
    {
      name: 'Property Value',
      // selector: (row) => row.Value,
      selector: (row) => row.Value,
      sortable: true
    },

  ]

  const notebookEntryHandler = row => {
    setValue(pre => { return { ...pre, ['PropertyID']: row.PropertyID, ['PropertyOffenseID']: row.PropertyOffenseID, ['labal']: row.PropertyNumber } });
    document.getElementById('customSelectBox').style.display = 'none'
  }

  return (
    <>
      <div className="col-12 col-md-12 pt-2 p-0" >
        <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center">
          <p className="p-0 m-0">Property</p>
        </div>
      </div>
      {/* <div className="col-6 col-md-6 col-lg-4 mt-2">
        <div className='dropdown__box'>
          <Select
            name='PropertyID'
            styles={colourStyles}
            isClearable
            options={PropertyDrp}
            onChange={(e) => { ChangeDropDown(e, 'PropertyID'); }}
            placeholder="Select.."
            ref={SelectedValue}
          />
          <label htmlFor="">Property</label>
          {errors.DropError !== 'true' ? (
            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DropError}</span>
          ) : null}
        </div>
      </div> */}
      <div className="col-6 col-md-6 col-lg-4 mt-2" style={{ zIndex: '1', }} >
        <div class="text-field ">
          <input
            type="text"
            name='NoofHoles'
            id='NoofHoles'
            value={value.labal}
            required
            placeholder='Search By Property .....'
            autoComplete='off'
            onChange={(e) => {
              setValue({ ...value, labal: e.target.value })
              const result = PropertyDrp?.filter((item) => {
                return (item.label.toLowerCase().includes(e.target.value.toLowerCase()))
              })
              setfilterDta(result)
            }
            }
            onClick={() => {
              document.getElementById('customSelectBox').style.display = 'block'
            }}
          />
          {errors.DropError !== 'true' ? (
            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DropError}</span>
          ) : null}
          <Link to={''} className='offense-select' onClick={() => {
            document.getElementById('customSelectBox').style.display = 'none';
            setValue(pre => { return { ...pre, ['PropertyID']: '', ['PropertyOffenseID']: '', ['labal']: '' } });
          }}>
            <span className='select-cancel'>
              <i className='fa fa-times'></i>
            </span>
          </Link>
        </div>
        <div id='customSelectBox' className="col-12 col-md-12 col-lg-12 " style={{ display: 'none', width: '700px',}}>
          <DataTable
            dense
            fixedHeader
            // fixedHeaderScrollHeight="250px"
            customStyles={tableCustomStyles}
            columns={columns1}
            data={filterData}
            onRowClicked={notebookEntryHandler}
            // pagination
            selectableRowsHighlight
            highlightOnHover
            className='new-table'
          />
        </div>
      </div>
      <div className="col-2 col-md-6 col-lg-8    pl-3" style={{ marginTop: '22px' }}>
        <Link to=''>
          <button type="button" className="btn btn-md py-1 btn-success pl-2  text-center" onClick={() => { check_Validation_Error(); }} >Save</button>
        </Link>
      </div>
      <div className="col-12">
        {
          loder ?
            <DataTable
              columns={columns}
              data={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? PropertyData : '' : PropertyData}
              dense
              pagination
              selectableRowsHighlight
              highlightOnHover
            // noDataComponent={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
            />
            :
            <Loader />
        }
      </div>
      {
        deleteStatus ?
          <DeletePopUpModal func={DeleteOffender} />

          : ''
      }
    </>
  )
}

export default Property