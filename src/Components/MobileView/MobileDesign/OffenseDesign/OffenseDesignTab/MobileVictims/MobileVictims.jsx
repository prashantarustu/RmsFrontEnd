import React, { useEffect, useRef } from 'react'
import { useState } from 'react'
import DataTable from 'react-data-table-component';
import { Decrypt_Id_Name, getShowingDateText, tableCustomStyles } from '../../../../../Common/Utility';
import { Link } from 'react-router-dom';
import { RequiredFieldIncident } from '../../../../../Pages/Utility/Personnel/Validation';
import { AddDeleteUpadate, fetchPostData } from '../../../../../hooks/Api';
import { toastifySuccess } from '../../../../../Common/AlertMsg';
import DeletePopUpModal from '../../../../../Common/DeleteModal';

const MobileVictims = () => {
  const [offenseDrp, setOffenseDrp] = useState();
  const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState()
  const [offenseNameData, setOffenseNameData] = useState();
  const SelectedValue = useRef();
  const [filterData, setfilterDta] = useState()
  //screen permission 
  const [offenseNameID, setOffenseNameId] = useState();
  const [deleteStatus, setDeleteStatus] = useState(false)
  const [loder, setLoder] = useState(false)

  const [value, setValue] = useState({
    'OffenseID':  '',
    'NameID': '',
    'VictimID': '',
    'labal': '',
    'CreatedByUserFK':  '',
  })

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
    get_Victim_DropDown();
    get_Victim_Data();
  }, [])

  const get_Victim_Data = () => {
    const val = {
      'OffenseID':  '',
    }
    fetchPostData('VictimOffense_FRW/GetData_NameOffense_FRW', val).then((res) => {
      if (res) {
        console.log(res);
        setOffenseNameData(res);
      } else {
        setOffenseNameData([]);
      }
    })
  }

  const get_Victim_DropDown = () => {
    const val = {
      'IncidentID': '',
      'OffenseID':  '',
    }
    fetchPostData('Victim_FRW/GetData_InsertVictimName_FRW', val).then((data) => {
      if (data) {
        setOffenseDrp(data)
        setfilterDta(data)
      } else {
        setOffenseDrp([])
      }
    })
  }

  const Add_Victim_Offense = () => {
    AddDeleteUpadate('VictimOffense_FRW/Insert_VictimOffense_FRW', value).then((res) => {
      if (res) {
        toastifySuccess(res.Message);
        get_Victim_DropDown();
        get_Victim_Data();
        onClear(); setErrors({ ...value, ['DropError']: '' })
      }
    })
  }

  const DeleteVictimOffense = () => {
    const val = {
      'VictimOffenseID': offenseNameID,
      'DeletedByUserFK': ''
    }
    AddDeleteUpadate('VictimOffense_FRW/Delete_VictimOffense_FRW', val).then((res) => {
      toastifySuccess(res.Message);
      setDeleteStatus(false)
      get_Victim_DropDown();
      get_Victim_Data();
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
      name: 'DateOfBirth',
      selector: (row) => row.DateOfBirth ? getShowingDateText(row.DateOfBirth) : '',
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
      name: 'DateOfBirth',
      selector: (row) => row.DateOfBirth,
      sortable: true
    },
  ]

  const notebookEntryHandler = row => {
    setValue(pre => { return { ...pre, ['NameID']: row.NameID, ['VictimID']: row.VictimID, ['labal']: row.Name } });
    document.getElementById('customSelectBox').style.display = 'none'
  }


  return (
    <>
      <div className="col-12 col-md-12  p-0" >
        <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center">
          <p className="p-0 m-0" style={{ fontSize: '18px' }}>Victim</p>
        </div>
      </div>
      <div className="row">
        <div className="col-6 col-md-6 col-lg-4 pt-3" style={{ zIndex: '1', }} >
          <div class="text-mobile ">
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
            <label htmlFor="" className='' >Victim</label>
            <Link to={''} className='offense-select' onClick={() => {
              document.getElementById('customSelectBox').style.display = 'none';
              setValue(pre => { return { ...pre, ['NameID']: '', ['VictimID']: '', ['labal']: '' } });
            }}>
              <span className='select-cancel '>
                <i className='fa fa-times pt-2'></i>
              </span>
            </Link>
          </div>
          <div id='customSelectBox' className="col-12 col-md-12 col-lg-12 " style={{ display: 'none', }}>
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
        {/* </div> */}
        <div className="col-2 col-md-6 col-lg-8 pl-3 mt-4 pt-2" >
          <Link to=''>
            <button type="button" className="btn btn-md py-1 btn-success pl-2 new-button text-center" onClick={() => { check_Validation_Error(); }}  >Save</button>
          </Link>
        </div>
      </div>

      <div className="col-12" >
        <div className="new-offensetable" >
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
        </div>
      </div>
      <DeletePopUpModal func={DeleteVictimOffense} />


    </>
  )
}

export default MobileVictims