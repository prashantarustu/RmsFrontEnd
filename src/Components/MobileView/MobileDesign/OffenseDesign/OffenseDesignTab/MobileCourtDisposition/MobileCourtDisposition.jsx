import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import { Decrypt_Id_Name, getShowingDateText, getShowingMonthDateYear, tableCustomStyles } from '../../../../../Common/Utility';
import DatePicker from "react-datepicker";
import Select from "react-select";
import { Comman_changeArrayFormat } from '../../../../../Common/ChangeArrayFormat';
import { AddDeleteUpadate, fetchPostData } from '../../../../../hooks/Api';
import { toastifySuccess } from '../../../../../Common/AlertMsg';
import { RequiredFieldIncident, Space_Allow_with_Trim } from '../../../../../Pages/Utility/Personnel/Validation';
import { RequiredField } from '../../../../../Pages/Agency/AgencyValidation/validators';
const MobileCourtDisposition = () => {

  const [ClearanceID, setClearanceID] = useState([]);
  const [CourtDispositionID, setCourtDispositionID] = useState([]);
  const [courtDispoData, setcourtDispoData] = useState();
  const [CourtDispositionId, setCourtDispositionId] = useState();
  const [modal, setModal] = useState(false)
  const [status, setStatus] = useState(false);
  const [updateStatus, setUpdateStatus] = useState(0)
  const [courtDispositionDate, setCourtDispositionDate] = useState();
  const [CourtModal, setCourtModal] = useState(false)
  const [modalStatus, setModalstatus] = useState(false)
  const [Editval, setEditval] = useState();

  const [value, setValue] = useState({
    'DispositionDtTm': '',
    'CrimeCourtDispositionID': '',
    'Comments': '',
    'ExceptionClearanceID': '',
    'CourtDispositionID': '',
    'CrimeID': '',
    'CreatedByUserFK': '',
  })
  const [errors, setErrors] = useState({
    'DispositionDtTmErrors': '', 'CrimeCourtDispositionIDErrors': '', 'CommentsErrors': '',
    // 'ExceptionClearanceIDErrors': '',
  })


  useEffect(() => {
    if (CourtDispositionId) {
      GetSingleData();
    }
  }, [CourtDispositionId, updateStatus])

  const GetSingleData = () => {
    const val = {
      'CourtDispositionID': CourtDispositionId
    }
    fetchPostData('OffenseCourtDisposition_FRW/GetSingleData_OffenseCourtDisposition_FRW', val)
      .then((res) => {
        if (res) { setEditval(res); }
        else setEditval()
      })
  }

  useEffect(() => {
    console.log(Editval)
    if (CourtDispositionId) {
      setValue({
        ...value,
        'CourtDispositionID': Editval[0]?.CourtDispositionID,
        'DispositionDtTm': Editval[0]?.DispositionDtTm ? getShowingDateText(Editval[0]?.DispositionDtTm) : ' ',
        'Comments': Editval[0]?.Comments,
        'CrimeCourtDispositionID': Editval[0]?.CrimeCourtDispositionID,
        'ExceptionClearanceID': Editval[0]?.ExceptionClearanceID,
        'ModifiedByUserFK': '',
      })
      setCourtDispositionDate(Editval[0]?.DispositionDtTm ? new Date(Editval[0]?.DispositionDtTm) : '');
    }
    else {
      setValue({
        ...value,
        'DispositionDtTm': '', 'CrimeCourtDispositionID': '', 'Comments': '',
        'ExceptionClearanceID': '',
      })
    }
  }, [Editval])
  const reset = () => {
    setValue({
      ...value,
      'DispositionDtTm': '', 'CrimeCourtDispositionID': '', 'Comments': '',
      'ExceptionClearanceID': '',

    }); setCourtDispositionDate('')
    setErrors({
      'DispositionDtTmError': '', 'CrimeCourtDispositionIDError': '', 'CommentsError': '',
      // 'ExceptionClearanceIDError': '',
    });
  }

  //--------------------------------------Get-Data-----------------------------------
  useEffect(() => {
    get_CourtDisposition_Data();
  }, [])

  const get_CourtDisposition_Data = () => {
    const val = {
      'CrimeID':'',
    }
    fetchPostData('OffenseCourtDisposition_FRW/GetData_OffenseCourtDisposition_FRW', val).then((res) => {
      if (res) {
        setcourtDispoData(res);
      } else {
        setcourtDispoData([]);
      }
    })
  }
  useEffect(() => {
    Get_DataExceptionalClearanceID();
    Get_CrimeCourtDispositionID()
  }, [])


  const Get_DataExceptionalClearanceID = () => {
    const val = {
      AgencyID: '',
    }
    fetchPostData('ExceptionalClearance/GetDataDropDown_ExceptionalClearance', val).then((data) => {
      if (data) {
        setClearanceID(Comman_changeArrayFormat(data, 'ClearanceID', 'Description'))
      } else {
        setClearanceID([]);
      }
    })
  }

  const Get_CrimeCourtDispositionID = () => {
    const val = {
      AgencyID: '',
    }
    fetchPostData('CourtDispositions/GetDataDropDown_CourtDispositions', val).then((data) => {
      if (data) {
        setCourtDispositionID(Comman_changeArrayFormat(data, 'CourtDispositionID', 'Description'))
      } else {
        setCourtDispositionID([]);
      }
    })
  }

  const check_Validation_Error = (e) => {
    if (RequiredFieldIncident(value.DispositionDtTm)) {
      setErrors(prevValues => { return { ...prevValues, ['DispositionDtTmErrors']: RequiredFieldIncident(value.DispositionDtTm) } })
    }
    if (RequiredFieldIncident(value.CrimeCourtDispositionID)) {
      setErrors(prevValues => { return { ...prevValues, ['CrimeCourtDispositionIDError']: RequiredFieldIncident(value.CrimeCourtDispositionID) } })
    }
    if (Space_Allow_with_Trim(value.Comments)) {
      setErrors(prevValues => { return { ...prevValues, ['CommentsError']: Space_Allow_with_Trim(value.Comments) } })
    }
  }

  // Check All Field Format is True Then Submit 
  const { DispositionDtTmErrors, CrimeCourtDispositionIDError, CommentsError, } = errors

  useEffect(() => {
    if (DispositionDtTmErrors === 'true' && CrimeCourtDispositionIDError === 'true' && CommentsError === 'true') {
      if (CourtDispositionId) update_Activity()
      else Add_Type()
    }
  }, [DispositionDtTmErrors, CrimeCourtDispositionIDError, CommentsError,])

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
  const handleChange = (e) => {
    setValue({
      ...value,
      [e.target.name]: e.target.value
    })
  }
  //---------------------------------------Add-update---------------------------------
  const Add_Type = (e) => {
    AddDeleteUpadate('OffenseCourtDisposition_FRW/Insert_OffenseCourtDisposition_FRW', value)
      .then((res) => {
        get_CourtDisposition_Data();
        setCourtModal(false);
        setCourtDispositionId('');
        // setModal(false)
        reset();
        toastifySuccess(res.Message);
        setErrors({
          ['CrimeCourtDispositionIDError']: '',
        });
      })
  }
  const update_Activity = () => {
    AddDeleteUpadate('OffenseCourtDisposition_FRW/Update_OffenseCourtDisposition_FRW', value).then((res) => {
      toastifySuccess(res.Message);
      get_CourtDisposition_Data()
      setCourtModal(false);
      setCourtDispositionId('');
      reset();
      setErrors({
        ['CrimeCourtDispositionIDError']: '',
      });
    })
  }
  const colourStyles = {
    control: (styles) => ({
      ...styles, backgroundColor: "#fce9bf",
      height: 20,
      minHeight: 40,
      fontSize: 18,
      margintop: 2,
      boxShadow: 0,
    }),
  }

  const startRef = React.useRef();
  const onKeyDown = (e) => {
    if (e.keyCode === 9 || e.which === 9) {
      startRef.current.setOpen(false);
    }
  }
  const customStylesWithOutColor = {
    control: base => ({
      ...base,
      height: 20,
      minHeight: 40,
      fontSize: 18,
      margintop: 2,
      boxShadow: 0,
    }),
  };

  const columns = [
    // {
    //   name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 60 }}>Action</p>,
    //   cell: row => <>
    //     <div className="div" style={{ position: 'absolute', top: 0, right: 48 }}>
    //       <Link to={''} onClick={(e) => { get_Editval(row); setCourtModal(true); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1 new-button" data-toggle="modal" data-target="#CourtDispositionModal" >
    //         <i className="fa fa-edit"></i>
    //       </Link>

    //     </div>
    //   </>
    // },
    {
      width:'100px',
      name: <p className='text-end' style={{ position: 'absolute', top: '7px' }}>Action</p>,
      cell: row => <>
        <Link to={'#'} onClick={() => { get_Editval(row);  }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1  new-button">
          <i className="fa fa-edit"></i>
        </Link>
      </>
    },
    {
      name: 'Date/Time',
      selector: (row) => row.DispositionDtTm ? getShowingDateText(row.DispositionDtTm) : " ",
      sortable: true
    },
    {
      name: 'Comment',
      selector: (row) => <>{row?.Comments ? row?.Comments.substring(0, 20) : ''}{row?.Comments?.length > 40 ? '  . . .' : null} </>,
      sortable: true
    },
    {
      name: 'Clearance Code',
      selector: (row) => row.ExceptionalClearance_Description,
      sortable: true
    },
    {
      width:'190px',
      name: 'Court Disposition',
      // selector: (row) => row.CourtDisposition_Description,
      selector: (row) => <>{row?.CourtDisposition_Description ? row?.CourtDisposition_Description.substring(0, 20) : ''}{row?.CourtDisposition_Description?.length > 40 ? '  . . .' : null} </>,
      sortable: true
    },
    {
      name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 0 }}>Delete</p>,
      cell: row => <>
        <div className="div" style={{ position: 'absolute', top: 0, right: 0 }}>
          <Link to={`#`} onClick={() => { setCourtDispositionId(row.CourtDispositionID); setModalstatus(true); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1 new-button" data-toggle="modal" data-target="#myModal2">
            <i className="fa fa-trash"></i>
          </Link>
        </div>
      </>
    }
  ]
  const get_Editval = (row) => {
    setCourtDispositionId(row.CourtDispositionID);
    setCourtModal(true);
  }
  const DeleteCourtDisposition = () => {
    const val = {
      'CourtDispositionID': CourtDispositionId,
      'DeletedByUserFK': '',
    }
    AddDeleteUpadate('OffenseCourtDisposition_FRW/Delete_OffenseCourtDisposition_FRW', val).then((res) => {
      if (res) {
        toastifySuccess(res.Message);
        get_CourtDisposition_Data();
        setModalstatus(false)
      } else console.log("Somthing Wrong");
    })
  }

  const CloseModel = () => {
    setModalstatus(false); 
  }

  return (
    <>
      <div className="col-md-12 px-0">
        <div className="bg-line text-white py-1 px-2 d-flex justify-content-between align-items-center">
          <p className="p-0 m-0 d-flex align-items-center" style={{ fontSize: '18px' }}>
            Court Disposition
          </p>
          {/* <Link to={'#'} onClick={() => { setCourtModal(true);  reset();}} className="btn btn-sm bg-green text-white px-2 py-0 new-button">
            <i className="fa fa-plus"></i>
          </Link> */}
          {
           ('OffenseCrimeId')?
              <Link to={'#'} onClick={() => { setCourtModal(true); reset(); }} className="btn btn-sm bg-green text-white px-2 py-0 new-button ">
                <i className="fa fa-plus"></i>
              </Link>
              :
              <></>
          }
        </div>
      </div>
      {
        CourtModal ?
          <>
            <div className="row mt-2">
              <div className="col-12">
                <div className="row">
                  <div class="col-6 col-md-6 col-lg-6 ">
                    <div class="text__dropdwon ">
                      <DatePicker
                        ref={startRef}
                        onKeyDown={onKeyDown}
                        id='DispositionDtTm'
                        name='DispositionDtTm'
                        className='requiredColor name-datepicker'
                        dateFormat="MM/dd/yyyy HH:mm"
                        onChange={(date) => { setCourtDispositionDate(date); setValue({ ...value, ['DispositionDtTm']: date ? getShowingMonthDateYear(date) : null }) }}
                        selected={courtDispositionDate}
                        timeInputLabel
                        isClearable={value?.DispositionDtTm ? true : false}
                        // placeholderText={value?.DispositionDtTm ? value?.DispositionDtTm : 'Select...'}
                        showTimeSelect
                        timeIntervals={1}
                        timeCaption="Time"
                        maxDate={new Date()}
                      />
                      <label htmlFor="" className='pt-1'>Disposition Date/Time</label>
                      {errors.DispositionDtTmErrors !== 'true' ? (
                        <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DispositionDtTmErrors}</span>
                      ) : null}
                    </div>
                  </div>
                  <div class="col-6 col-md-6  col-lg-6  ">
                    <div class="text__dropdwon ">
                      <Select
                        name='CrimeCourtDispositionID'
                        styles={colourStyles}
                        value={CourtDispositionID?.filter((obj) => obj.value === value?.CrimeCourtDispositionID)}
                        isClearable
                        options={CourtDispositionID}
                        onChange={(e) => ChangeDropDown(e, 'CrimeCourtDispositionID')}
                        placeholder="Select..."
                      />
                      <label htmlFor='' className='mt-1'> Court Disposition </label>
                      {errors.CrimeCourtDispositionIDError !== 'true' ? (
                        <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CrimeCourtDispositionIDError}</span>
                      ) : null}
                    </div>
                  </div>
                  <div className="col-6 col-md-6 col-lg-12 mt-2">
                    <div class="text__dropdwon ">
                      <Select
                        name='NIBRSClearanceID'
                        value={ClearanceID?.filter((obj) => obj.value === value?.ExceptionClearanceID)}
                        isClearable
                        options={ClearanceID}
                        onChange={(e) => ChangeDropDown(e, 'ExceptionClearanceID')}
                        placeholder="Select..."
                        styles={customStylesWithOutColor}
                      />
                      <label htmlFor="" className='mt-1'>Exceptional Clearance</label>
                    </div>
                  </div>
                  <div className="col-12  col-md-12 col-lg-12 mt-2 " >
                    <div className="text__dropdwon" >
                      <textarea name='Comments' onChange={handleChange} id="Comments" value={value.Comments} cols="30" rows='3' className="form-control pt-2 pb-2 requiredColor" ></textarea>
                      <label htmlFor="Comments" className='pt-1'>Comments</label>
                      {errors.CommentsError !== 'true' ? (
                        <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CommentsError}</span>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-12 text-right mt-3 " >
              {
                CourtDispositionId ?
                  <button type="button" className="btn btn-lg  btn-success new-button mr-3" onClick={check_Validation_Error}>Update</button>
                  :
                  <button type="button" className="btn btn-lg  btn-success new-button mr-3" onClick={check_Validation_Error} >Save</button>
              }
              {/* <button type="button" onClick={() => { CloseModel(); }} className="btn btn-lg  btn-success new-button">Close</button> */}
              <button type="button" onClick={() => { setCourtModal(false); setCourtDispositionId(''); reset(); }} className="btn btn-lg  btn-success new-button">Close</button>
            </div>
          </>
          :
          <>
            <div className="col-md-12  pt-2">
              <DataTable
                columns={columns}
                data={courtDispoData}
                dense
                pagination
                paginationPerPage={'5'}
                paginationRowsPerPageOptions={[5, 15, 20]}
                highlightOnHover
                customStyles={tableCustomStyles}
                // subHeader
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
                          <button type="button" onClick={DeleteCourtDisposition} className="btn btn-sm text-white" style={{ background: "#ef233c" }} >Delete</button>
                          {/* <button type="button" onClick={() => { setModalstatus(false); setCourtDispositionId(''); reset(); }} className="btn btn-sm btn-secondary ml-2 " > Cancel</button> */}
                          <button type="button" onClick={() => { CloseModel(); }} className="btn btn-sm btn-secondary ml-2 " > Cancel</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                :
                <></>
            }
          </>
      }
    </>
  )
}

export default MobileCourtDisposition