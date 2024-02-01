import React, { useContext } from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AddDeleteUpadate, ScreenPermision, fetchPostData } from '../../../../hooks/Api';
import { Decrypt_Id_Name } from '../../../../Common/Utility';
import { useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { RequiredField, } from '../../../Utility/Personnel/Validation';
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import Loader from '../../../../Common/Loader';
import { AgencyContext } from '../../../../../Context/Agency/Index';


const OtherCode = ({ LoginPinID, LoginAgencyID, offenceID, MainIncidentID }) => {

  const { get_Offence_Count } = useContext(AgencyContext)

  const [otherCodeId, setOthercodeId] = useState();
  const [otherData, setOtherData] = useState();
  const [status, setStatus] = useState(false);
  const [editval, setEditval] = useState();
  const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState()
  const [loder, setLoder] = useState(false)
  const [count, setCount] = useState(0)

  const [value, setValue] = useState({
    'Description': '',
    'ModifiedByUserFK': '',
    'CrimeOtherCodeID': '',
    'CrimeID': offenceID,
    'DeletedByUserFK': '',
  })

  useEffect(() => {
    if (offenceID) {
      // setValue(pre => { return { ...pre, 'CrimeID': offenceID, } });
      get_data_otherCode(offenceID);
    }
    getScreenPermision(LoginAgencyID, LoginPinID);
  }, [offenceID]);

  const [errors, setErrors] = useState({
    'DescriptionError': '',
  })

  const Reset = () => {
    setValue({
      ...value,
      'Description': '',
    })
    setErrors({
      ...errors,
      'DescriptionError': '',
    })
  }

  const get_data_otherCode = (offenceID) => {
    const val = {
      'CrimeID': offenceID,
    }
    fetchPostData('OffenseOtherCode/GetData_OffenseOtherCode', val).then((res) => {
      if (res) {
        setOtherData(res); setLoder(true)
      } else {
        setOtherData([]); setLoder(true)
      }
    })
  }

  const check_Validation_Error = (e) => {
    if (RequiredField(value.Description)) {
      setErrors(prevValues => { return { ...prevValues, ['DescriptionError']: RequiredField(value.Description) } })
    }
  }

  // Check All Field Format is True Then Submit 
  const { DescriptionError } = errors

  useEffect(() => {
    if (DescriptionError === 'true') {
      if (status) UpdateOtherCode();
      else InsertOtherCode();
    }
  }, [DescriptionError])


  const getScreenPermision = (LoginAgencyID, LoginPinID) => {
    ScreenPermision("O038", LoginAgencyID, LoginPinID).then(res => {
      if (res) {
        setEffectiveScreenPermission(res)
      } else {
        setEffectiveScreenPermission([])
      }
    });
  }


  useEffect(() => {
    if (status) {
      setValue({
        ...value,
        'Description': editval?.Description,
        'CrimeOtherCodeID': editval?.CrimeOtherCodeID,
        'ModifiedByUserFK': LoginPinID,
      })
    } else {
      setValue({
        ...value,
        'Description': '',
        'ModifiedByUserFK': '',
        'CrimeOtherCodeID': '',
      })
    }
  }, [status, count])


  const InsertOtherCode = () => {
    var result = otherData?.find(item => {
      if (item.Description) {
        if (item.Description.toLowerCase().trim() === value.Description.toLowerCase().trim()) {
          return true
        } else return false
      }
    })
    if (result) {
      if (result) {
        toastifyError('Description Already Exists')
        setErrors({ ...errors, ['DescriptionError']: '' })
      }
    } else {
      AddDeleteUpadate('OffenseOtherCode/Insert_OffenseOtherCode', value).then((res) => {
        if (res) {
          toastifySuccess(res.Message);
          get_Offence_Count(offenceID)
          get_data_otherCode(offenceID);
          getScreenPermision(LoginAgencyID, LoginPinID);
          Reset();
          setErrors({
            ...errors,
            'DescriptionError': '',
          })
        } else {
          console.log("Somthing Wrong");
        }
      })
    }
    // AddDeleteUpadate('OffenseOtherCode/Insert_OffenseOtherCode', value).then((res) => {
    //   if (res) {
    //     toastifySuccess(res.Message);
    //     get_data_otherCode();
    //     getScreenPermision();
    //     Reset();
    //     setErrors({
    //       ...errors,
    //       'DescriptionError': '',
    //     })
    //   } else {
    //     console.log("Somthing Wrong");
    //   }
    // })
  }

  const UpdateOtherCode = () => {
    var result = otherData?.find(item => {
      if (item.CrimeOtherCodeID != value.CrimeOtherCodeID) {
        if (item.Description) {
          if (item.Description.toLowerCase() === value.Description.toLowerCase()) {
            return true
          } else return false
        }
      }
    })
    if (result) {
      toastifyError('Description Already Exists')
      setErrors({ ...errors, ['DescriptionError']: '' })
    } else {
      AddDeleteUpadate('OffenseOtherCode/Update_OffenseOtherCode', value).then((res) => {
        toastifySuccess(res.Message);
        get_data_otherCode(offenceID);
        getScreenPermision(LoginAgencyID, LoginPinID);
        setStatus(false)
        Reset();
        setErrors({
          ...errors,
          'DescriptionError': '',
        })
      })
    }
    // AddDeleteUpadate('OffenseOtherCode/Update_OffenseOtherCode', value).then((res) => {
    //   toastifySuccess(res.Message);
    //   get_data_otherCode();
    //   getScreenPermision();
    //   setStatus(false)
    //   Reset();
    //   setErrors({
    //     ...errors,
    //     'DescriptionError': '',
    //   })
    // })
  }

  const handlChange = (e) => {
    setValue({
      ...value,
      [e.target.name]: e.target.value
    })
  }

  const columns = [
    {
      name: <p className='text-end' style={{ position: 'absolute', top: 8, left: '15px' }}>Action</p>,
      cell: row => <>
        <div style={{ position: 'absolute', top: 4, left: 20 }}>
          {
            EffectiveScreenPermission ? EffectiveScreenPermission[0]?.Changeok ?
              <Link to={''} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" onClick={() => { setEditvalue(row) }}>
                <i className="fa fa-edit"></i>
              </Link>
              : <></>
              : <Link to={''} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" onClick={() => { setEditvalue(row) }}>
                <i className="fa fa-edit"></i>
              </Link>
          }
        </div>
      </>
    },
    {
      name: 'Description',
      selector: (row) => row.Description,
      sortable: true
    },
    {
      name: <p className='text-end' style={{ position: 'absolute', top: 8, left: '15px' }}>Delete</p>,
      cell: row => <>
        <div style={{ position: 'absolute', top: 4, left: 20 }}>
          {
            EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DeleteOK ?
              <Link to={`#`} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" onClick={() => { setOthercodeId(row.CrimeOtherCodeID); }} data-toggle="modal" data-target="#DeleteModal">
                <i className="fa fa-trash"></i>
              </Link>
              : <></>
              : <Link to={`#`} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" onClick={() => { setOthercodeId(row.CrimeOtherCodeID); }} data-toggle="modal" data-target="#DeleteModal">
                <i className="fa fa-trash"></i>
              </Link>
          }
        </div>
      </>
    }
  ]

  const setEditvalue = (row) => {
    setEditval(row); setStatus(true); setCount(count + 1);
  }

  const DeleteotherCode = () => {
    const val = {
      'CrimeOtherCodeID': otherCodeId,
      'DeletedByUserFK': LoginPinID,
    }
    AddDeleteUpadate('OffenseOtherCode/Delete_OffenseOtherCode', val).then((res) => {
      if (res) {
        toastifySuccess(res.Message);
        get_Offence_Count(offenceID)
        get_data_otherCode(offenceID);
        getScreenPermision(LoginAgencyID, LoginPinID);
      } else console.log("Somthing Wrong");
    })
  }

  const CancelButton = () => {
    Reset();
    setStatus(false);
  }

  return (
    <>
      <div className="col-12 col-md-12 pt-2 p-0" >
        <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center ">
          <p className="p-0 m-0">Other Code</p>
          <div style={{ marginLeft: 'auto' }}>
            {/* <Link to='' className="btn btn-sm bg-green text-white px-2 py-0">
              <i className="fa fa-plus"></i>
            </Link> */}
          </div>
        </div>
        <div className="row mt-1">
          <div className="col-6 col-md-6 col-lg-4 mt-2">
            <div class="text-field">
              <input type="text" name='Description' className='requiredColor' maxlength="50" onChange={handlChange} value={value?.Description} required />
              <label>Other Code</label>
              {errors.DescriptionError !== 'true' ? (
                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DescriptionError}</span>
              ) : null}
            </div>
          </div>
          <div className="row">
            {
              status ?
                <>
                  <div className="col-6 col-md-6 col-lg-8  mt-3 pt-1 p-0">
                    <button type="button" className="btn btn-sm btn-success mx-1 py-1 text-center" onClick={() => { check_Validation_Error(); }}>Update</button>
                  </div>
                </>
                :
                <>
                  {
                    EffectiveScreenPermission ? EffectiveScreenPermission[0]?.AddOK ?
                      <div className="col-6 col-md-6 col-lg-8  mt-3 pt-1 p-0">
                        <button type="button" className="btn btn-sm btn-success mx-1 py-1 text-center" onClick={() => { check_Validation_Error(); }}>Save</button>
                      </div>
                      : <></>
                      : <div className="col-6 col-md-6 col-lg-8  mt-3 pt-1 p-0">
                        <button type="button" className="btn btn-sm btn-success mx-1 py-1 text-center" onClick={() => { check_Validation_Error(); }}>Save</button>
                      </div>
                  }
                  {/* <div className="col-6 col-md-6 col-lg-8  mt-3 pt-1 p-0">
                    <button type="button" className="btn btn-sm btn-success mx-1 py-1 text-center" onClick={() => { check_Validation_Error(); }}>Save</button>
                  </div> */}
                </>
            }
          </div>
          <div className="col-6 col-md-6 col-lg-4  mt-3 pt-1 p-0">
            <button type="button" className="btn btn-sm btn-success mx-1 py-1 text-center" onClick={() => { CancelButton(); }}>Cancel</button>
          </div>
          <div className="col-12">
            {
              loder ?
                <DataTable
                  columns={columns}
                  data={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? otherData : '' : otherData}
                  dense
                  pagination
                  selectableRowsHighlight
                  highlightOnHover
                  noDataComponent={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                />
                :
                <Loader />
            }
          </div>
        </div>
      </div>
      <DeletePopUpModal func={DeleteotherCode} />
    </>
  )
}

export default OtherCode