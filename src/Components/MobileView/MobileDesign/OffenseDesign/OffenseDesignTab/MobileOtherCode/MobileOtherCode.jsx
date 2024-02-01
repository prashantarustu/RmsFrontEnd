import React from 'react'
import DataTable from 'react-data-table-component'
import { Link } from 'react-router-dom'
import { Decrypt_Id_Name } from '../../../../../Common/Utility';
import { useState } from 'react';
import { toastifyError, toastifySuccess } from '../../../../../Common/AlertMsg';
import { AddDeleteUpadate, fetchPostData } from '../../../../../hooks/Api';
import { useEffect } from 'react';
import { RequiredField } from '../../../../../Pages/Utility/Personnel/Validation';


const MobileOtherCode = () => {
  const [modalStatus, setModalstatus] = useState(false)
  const [CrimeOtherCodeID, setCrimeOtherCodeID] = useState();
  const [otherData, setOtherData] = useState();
  const [status, setStatus] = useState(false);
  const [editval, setEditval] = useState();
  const [value, setValue] = useState({
    'Description': '',
    'ModifiedByUserFK': '',
    'CrimeOtherCodeID': '',
    'CreatedByUserFK': '',
    'CrimeID': '',
    'DeletedByUserFK': '',
  })
  const [errors, setErrors] = useState({
    'DescriptionError': '',
  })

  const handlChange = (e) => {
    setValue({
      ...value,
      [e.target.name]: e.target.value
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

  useEffect(() => {
    if (status) {
      setValue({
        ...value,
        'Description': editval?.Description,
        'CrimeOtherCodeID': editval?.CrimeOtherCodeID,
        // 'ModifiedByUserFK': '',
      })
    } else {
      setValue({
        ...value,
        'Description': '',
        'ModifiedByUserFK': '',
        'CrimeOtherCodeID': '',
      })
    }
  }, [status])

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
  //-------------------------------------Get-Data---------------------
  useEffect(() => {
    get_data_otherCode();
  }, []);

  const get_data_otherCode = () => {
    const val = {
      'CrimeID': '',
    }
    fetchPostData('OffenseOtherCode_FRW/GetData_OffenseOtherCode_FRW', val).then((res) => {
      if (res) {
        setOtherData(res);
      } else {
        setOtherData([]);
      }
    })
  }
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
      AddDeleteUpadate('OffenseOtherCode_FRW/Insert_OffenseOtherCode_FRW', value).then((res) => {
        if (res) {
          toastifySuccess(res.Message);
          get_data_otherCode();
          Reset();
          setCrimeOtherCodeID('');
          setErrors({
            ...errors,
            'DescriptionError': '',
          })
        } else {
          console.log("Somthing Wrong");
        }
      })
    }

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
    } else {
      AddDeleteUpadate('OffenseOtherCode_FRW/Update_OffenseOtherCode_FRW', value).then((res) => {
        toastifySuccess(res.Message);
        get_data_otherCode();
        setStatus(false)
        Reset();
        setErrors({
          ...errors,
          'DescriptionError': '',
        })
      })
    }

  }

  const columns = [
    {
      name: 'Description',
      selector: (row) => row.Description,
      sortable: true
    },
    {
      name: <p className='text-end' style={{ position: 'absolute', top: '7px' }}>Action</p>,
      cell: row => <>
        <Link to={'#'} className="btn btn-sm bg-green text-white px-1 py-0 mr-1 new-button" onClick={() => { setEditvalue(row) }}>
          <i className="fa fa-edit"></i>
        </Link>
        <Link to={`#`} className="btn btn-sm bg-green text-white px-1 py-0 mr-1 new-button" onClick={() => { setCrimeOtherCodeID(row.CrimeOtherCodeID); setModalstatus(true); }} data-toggle="modal" data-target="#myModal2">
          <i className="fa fa-trash"></i>
        </Link>

      </>
    }
  ]
  const setEditvalue = (row) => {
    setEditval(row);
    setStatus(true)
  }

  const DeleteotherCode = () => {
    const val = {
      'CrimeOtherCodeID': CrimeOtherCodeID,
      'DeletedByUserFK': '',
    }
    AddDeleteUpadate('OffenseOtherCode_FRW/Delete_OffenseOtherCode_FRW', val).then((res) => {
      if (res) {
        toastifySuccess(res.Message);
        setModalstatus(false)
        get_data_otherCode();
      } else console.log("Somthing Wrong");
    })
  }

  const CancelButton = () => {
    Reset();
    setStatus(false);
  }
  const CloseModal = () => {
    setModalstatus(false)
  }


  return (
    <>

      <div className="col-12 col-md-12 p-0" >
        <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center ">
          <p className="p-0 m-0" style={{ fontSize: '18px' }}>Other Code</p>
        </div>
      </div>
      <div className="row">
        <div className="col-6 col-md-6 col-lg-4 mt-3 ">
          <div class="text-mobile">
            <input type="text" name='Description' className='requiredColor' maxlength="50" onChange={handlChange} value={value?.Description} required />
            <label>Other Code</label>
            {errors.DescriptionError !== 'true' ? (
              <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DescriptionError}</span>
            ) : null}
          </div>
        </div>
        <div className="col-2 col-md-6 col-lg-8  mt-4 pt-2  pl-3" >

          {
            status ?
              <>
                <button type="button" className="btn btn-md py-1 btn-success new-button pl-2 mr-2 text-center" onClick={() => { check_Validation_Error(); }}>Update</button>
              </>
              :
              <>
                <button type="button" className="btn btn-md py-1 btn-success new-button pl-2 mr-2 text-center" onClick={() => { check_Validation_Error(); }}>Save</button>
              </>
          }
          <Link to=''>
            <button type="button" className="btn btn-md py-1 btn-success new-button pl-2  text-center" onClick={() => { CancelButton(); }} >Cancel</button>
          </Link>
        </div>
      </div>
      <div className="col-12">

        <DataTable
          columns={columns}
          data={otherData}
          dense
          pagination
          paginationPerPage={'5'}
          paginationRowsPerPageOptions={[5]}
          highlightOnHover
          responsive
          className='mobile-datatable'
          showPaginationBottom={5}
          subHeaderComponent
        />
      </div>
      {
        modalStatus ?
          <div class="modal" id="myModal2" style={{ background: "rgba(0,0,0, 0.5)", transition: '0.5s' }} data-backdrop="false">
            <div class="modal-dialog">
              <div class="modal-content">
                <div className="box text-center py-5">
                  <h5 className="modal-title mt-2" id="exampleModalLabel">Do you want to Delete ?</h5>
                  <div className="btn-box mt-3">
                    <button type="button" onClick={DeleteotherCode} className="btn btn-sm text-white" style={{ background: "#ef233c" }} >Delete</button>
                    <button type="button" onClick={() => { CloseModal(); }} className="btn btn-sm btn-secondary ml-2 " > Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          :
          <></>
      }
    </>
  )
}

export default MobileOtherCode