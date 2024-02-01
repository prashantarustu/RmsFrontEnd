import React, { useEffect, useState, memo } from 'react'
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import Select from "react-select"
import { useRef } from 'react';
import { Decrypt_Id_Name, getShowingDateText, getShowingWithOutTime } from '../../../../Common/Utility';
import { Comman_changeArrayFormat, threeColArrayWithId } from '../../../../Common/ChangeArrayFormat';
import { AddDeleteUpadate, fetchData, fetchPostData } from '../../../../hooks/Api';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import { RequiredFieldIncident } from '../../../Utility/Personnel/Validation';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import Loader from '../../../../Common/Loader';
import { useContext } from 'react';
import { AgencyContext } from '../../../../../Context/Agency/Index';

const Victim = ({ LoginPinID, LoginAgencyID, offenceID, MainIncidentID }) => {

  const { get_Offence_Count } = useContext(AgencyContext)
  const SelectedValue = useRef();
  //screen permission 
  const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState()
  const [offenseDrp, setOffenseDrp] = useState();
  const [offenseNameData, setOffenseNameData] = useState();
  const [offenseNameID, setOffenseNameId] = useState();
  const [deleteStatus, setDeleteStatus] = useState(false)
  const [loder, setLoder] = useState(false)

  const [value, setValue] = useState({
    'NameID': '',
    'VictimID': '',
    'labal': '',
    'OffenseID': offenceID,
    'CreatedByUserFK': LoginPinID,
  })

  const [filterData, setfilterDta] = useState()

  const [errors, setErrors] = useState({
    'DropError': '',
  })

  const check_Validation_Error = (e) => {
    if (RequiredFieldIncident(value.NameID)) {
      setErrors(prevValues => { return { ...prevValues, ['DropError']: RequiredFieldIncident(value.NameID) } })
    }
  }

  // Check All Field Format is True Then Submit 
  const { DropError } = errors

  useEffect(() => {
    if (DropError === 'true') {
      Add_Victim_Offense();
    }
  }, [DropError])

  const ChangeDropDown = (e, name) => {
    if (e) {
      console.log(e)
      setValue({
        ...value,
        [name]: e.value,
        ['VictimID']: e.id2,
      });
    } else setValue({
      ...value,
      [name]: null,
    })
  }

  useEffect(() => {
    get_Victim_DropDown(offenceID, MainIncidentID);
    get_Victim_Data(offenceID);
  }, [offenceID])

  const get_Victim_Data = (offenceID) => {
    const val = {
      'OffenseID': offenceID,
    }
    fetchPostData('VictimOffense/GetData_NameOffense', val).then((res) => {
      if (res) {
        console.log(res);
        setOffenseNameData(res); setLoder(true)
      } else {
        setOffenseNameData([]); setLoder(true)
      }
    })
  }

  const get_Victim_DropDown = (offenceID, MainIncidentID) => {
    const val = {
      'IncidentID': MainIncidentID,
      'OffenseID': offenceID,
    }
    fetchPostData('Victim/GetData_InsertVictimName', val).then((data) => {
      if (data) {
        console.log(data)
        // setOffenseDrp(Comman_changeArrayFormat(data, 'NameID', 'Name'))
        // setOffenseDrp(threeColArrayWithId(data, 'NameID', 'Name', 'VictimID'))
        setOffenseDrp(data)
        setfilterDta(data)
      } else {
        setOffenseDrp([])
      }
    })
  }

  const Add_Victim_Offense = () => {
    AddDeleteUpadate('VictimOffense/Insert_VictimOffense', value).then((res) => {
      if (res) {
        toastifySuccess(res.Message);
        get_Offence_Count(offenceID)
        get_Victim_DropDown(offenceID, MainIncidentID);
        get_Victim_Data(offenceID);
        onClear(); setErrors({ ...value, ['DropError']: '' })
      }
    })
  }

  const DeleteVictimOffense = () => {
    const val = {
      'VictimOffenseID': offenseNameID,
      'DeletedByUserFK': LoginPinID,
    }
    AddDeleteUpadate('VictimOffense/Delete_VictimOffense', val).then((res) => {
      toastifySuccess(res.Message);
      get_Offence_Count(offenceID)
      setDeleteStatus(false)
      get_Victim_DropDown(offenceID, MainIncidentID);
      get_Victim_Data(offenceID);
    })
  }

  const onClear = () => {
    SelectedValue?.current?.clearValue();
    setValue(pre => { return { ...pre, ['NameID']: '', ['VictimID']: '', ['labal']: '' } });
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
      name: 'Name',
      selector: (row) => row.Name,
      sortable: true
    },
    {
      name: 'Date Of Birth',
      selector: (row) => row.DateOfBirth ? getShowingWithOutTime(row.DateOfBirth) : '',
      sortable: true
    },
    {
      name: 'Gender',
      selector: (row) => row.Gender,
      sortable: true
    },
    {
      name: 'SSN',
      selector: (row) => row.SSN,
      sortable: true
    },
    {
      name: <p className='text-end' style={{ position: 'absolute', top: 8, left: '5px' }}>Delete</p>,
      cell: row => <>
        {
          EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DeleteOK ?
            <Link to={`#`} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" onClick={() => { setDeleteStatus(true); setOffenseNameId(row.VictimOffenseID) }} data-toggle="modal" data-target="#DeleteModal">
              <i className="fa fa-trash"></i>
            </Link>
            : <></>
            : <Link to={`#`} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" onClick={() => { setDeleteStatus(true); setOffenseNameId(row.VictimOffenseID) }} data-toggle="modal" data-target="#DeleteModal">
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
      name: 'Name',
      selector: (row) => row.Name,
      sortable: true
    },
    {
      name: 'SSN',
      selector: (row) => row.SSN,
      sortable: true
    },
    {
      name: 'Date Of Birth',
      // selector: (row) => row.DateOfBirth,
      selector: (row) => row.DateOfBirth ? getShowingWithOutTime(row.DateOfBirth) : '',
      sortable: true
    },
  ]

  const notebookEntryHandler = row => {
    setValue(pre => { return { ...pre, ['NameID']: row.NameID, ['VictimID']: row.VictimID, ['labal']: row.Name } });
    document.getElementById('customSelectBox').style.display = 'none'
  }

  return (
    <>
      <div className="col-12 col-md-12 pt-2 p-0" >
        <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center">
          <p className="p-0 m-0">Victim</p>
        </div>
      </div>
      <div className="col-6 col-md-6 col-lg-4 mt-2" style={{ zIndex: '1', }} >
        <div class="text-field ">
          <input
            type="text"
            name='NoofHoles'
            id='NoofHoles'
            value={value.labal}
            required
            placeholder='Search By Victim .....'
            autoComplete='off'
            onChange={(e) => {
              setValue({ ...value, labal: e.target.value })
              const result = offenseDrp?.filter((item) => {
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
            setValue(pre => { return { ...pre, ['NameID']: '', ['VictimID']: '', ['labal']: '' } });
          }}>
            <span className='select-cancel'>
              <i className='fa fa-times'></i>
            </span>
          </Link>
        </div>
        <div id='customSelectBox' className="col-12 col-md-12 col-lg-12 " style={{ display: 'none', width: '700px' }}>
          <DataTable
            dense
            fixedHeader
            fixedHeaderScrollHeight="250px"
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
      <div className="col-1 col-md-4 col-lg-1  mb-1" style={{ marginTop: '22px' }}>
        <Link to=''>
          <button type="button" className="btn btn-md py-1 btn-success pl-2  text-center" onClick={() => { check_Validation_Error(); }} >Save</button>
        </Link>
      </div>
      <div className="col-1 col-md-4 col-lg-1 mt-3 pt-1">
        <Link to="/nametab?page=Victim" className="btn btn-sm bg-green text-white ">
          <i className="fa fa-plus"></i>
        </Link>
      </div>
      <div className="col-12" >
        <div className="new-offensetable" >
          {
            loder ?
              <DataTable
                columns={columns}
                data={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? offenseNameData : '' : offenseNameData}
                dense
                pagination
                className='new-offensetable'
                selectableRowsHighlight
                highlightOnHover
              // noDataComponent={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
              />
              :
              <Loader />
          }
        </div>
      </div>
      {
        deleteStatus ?
          <DeletePopUpModal func={DeleteVictimOffense} />
          : ''
      }
    </>
  )
}

export default memo(Victim)