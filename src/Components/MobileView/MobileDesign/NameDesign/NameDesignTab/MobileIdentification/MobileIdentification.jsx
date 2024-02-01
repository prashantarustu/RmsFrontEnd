import React, { useCallback, useState } from 'react'
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import DatePicker from "react-datepicker";
import Select from "react-select";
import { Decrypt_Id_Name, getShowingWithOutTime, tableCustomStyles } from '../../../../../Common/Utility';
import { useEffect } from 'react';
import { AddDeleteUpadate, fetchData, fetchPostData } from '../../../../../hooks/Api';
import { Comman_changeArrayFormat, Comman_changeArrayFormat_With_Name } from '../../../../../Common/ChangeArrayFormat';
import { toastifySuccess } from '../../../../../Common/AlertMsg';
import { RequiredFieldSpaceNotAllow } from '../../../../../Pages/Agency/AgencyValidation/validators';
import { RequiredFieldIncident } from '../../../../../Pages/Utility/Personnel/Validation';
const MobileIdentification = () => {

  const [identification, setIdentification] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [CountryList, setCountryList] = useState([]);
  const [IdentificationData, setIdentificationData] = useState();
  const [IdentificationModal, setIdentificationModal] = useState(false)
  const [IdentificationDate, setIdentificationDate] = useState('')
  const [updateStatus, setUpdateStatus] = useState(0)
  const [IdentificationNumberID, setIdentificationNumberID] = useState('');
  const [Editval, setEditval] = useState();
  const [modalStatus, setModalstatus] = useState(false)
  const [bICountryIDList, setBICountryIDList] = useState([]);
  const [bIstateList, setBIStateList] = useState([]);
  const [value, setValue] = useState({
    'IdentificationTypeID': '', 'StateID': "", 'CountryID': "", 'IdentificationNumber': '', 'IsCurrent': "", 'ExpiryDate': "", 'IdentificationNumberID': '',
    'NameID': '',
    'CreatedByUserFK': '',
  })

  const [errors, setErrors] = useState({
    'IdentificationTypeIDErrors': '', 'IdentificationNumberErrors': '',
  })

  //------------------------------GetData---------------------------------------------
  useEffect(() => {
    Get_IdentificationData();
  }, [])

  const Get_IdentificationData = () => {
    const val = {
      'NameID': '',
    }
    fetchPostData('NameIdentificationNumber_FRW/GetData_NameIdentificationNumber_FRW', val).then((res) => {
      if (res) {
        setIdentificationData(res)
      } else {
        setIdentificationData([]);
      }
    })
  }

  useEffect(() => {
    if (IdentificationNumberID) {
      GetSingleData(IdentificationNumberID)
    }
  }, [IdentificationNumberID, updateStatus])

  const GetSingleData = () => {
    const val = { 'IdentificationNumberID': IdentificationNumberID }
    fetchPostData('NameIdentificationNumber_FRW/GetSingleData_NameIdentificationNumber_FRW', val)
      .then((res) => {
        if (res) setEditval(res)
        else setEditval()
      }
      )
  }

  const escFunction = useCallback((event) => {
    if (event.key === "Escape") {
      reset()
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);
    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, [escFunction]);

  useEffect(() => {
    if (IdentificationNumberID) {
      setValue({
        ...value,
        'IdentificationTypeID': Editval[0]?.IdentificationTypeID,
        'IdentificationNumberID': Editval[0]?.IdentificationNumberID,
        'IsCurrent': Editval[0]?.IsCurrent,
        'ExpiryDate': Editval[0]?.ExpiryDate ? getShowingWithOutTime(Editval[0]?.ExpiryDate) : '',
        "IdentificationNumber": Editval[0]?.IdentificationNumber,
        'StateID': Editval[0]?.StateID, 'CountryID': Editval[0]?.CountryID,
        'ModifiedByUserFK': '',
      })
    }
    else {
      setValue({
        ...value,
        'IdentificationTypeID': '', 'IdentificationNumber': '', 'IsCurrent': "", 'StateID': "", 'CountryID': "", 'ExpiryDate': "", 'ModifiedByUserFK': '',
      })
    }
  }, [Editval, updateStatus])

  const reset = () => {
    setValue({
      ...value,
      'IdentificationTypeID': '', 'IdentificationNumber': '', 'IsCurrent': "", 'StateID': "", 'CountryID': "", 'ExpiryDate': "",
    });
    setIdentificationDate('')
    setErrors({
      'IdentificationTypeIDErrors': '', 'IdentificationNumberErrors': '',
    })
  }

  const check_Validation_Error = (e) => {
    if (RequiredFieldSpaceNotAllow(value.IdentificationNumber)) {
      setErrors(prevValues => { return { ...prevValues, ['IdentificationNumberErrors']: RequiredFieldSpaceNotAllow(value.IdentificationNumber) } })
    }
    if (RequiredFieldIncident(value.IdentificationTypeID)) {
      setErrors(prevValues => { return { ...prevValues, ['IdentificationTypeIDErrors']: RequiredFieldIncident(value.IdentificationTypeID) } })
    }
  }
  // Check All Field Format is True Then Submit 
  const { IdentificationNumberErrors, IdentificationTypeIDErrors } = errors

  useEffect(() => {
    if (IdentificationNumberErrors === 'true' && IdentificationTypeIDErrors === 'true') {
      if (IdentificationNumberID) update_Identification()
      else Add_Type()
    }
  }, [IdentificationNumberErrors, IdentificationTypeIDErrors])

  //-----------------------------------Drop-Down--------------------------------------
  useEffect(() => {
    get_Identification();
    getCountryID();
    getStateList();

  }, [])

  const get_Identification = () => {
    const val = {
     AgencyID: ('AgencyID'), 
    }
    fetchPostData('IDTypes/GetDataDropDown_IDTypes', val).then((data) => {
      if (data) {
        setIdentification(Comman_changeArrayFormat(data, 'IDTypeID', 'Description'))
      } else {
        setIdentification([]);
      }
    })
  }
  const getStateList = async () => {
    fetchData("State_City_ZipCode/GetData_State").then((data) => {
      if (data) {
        setStateList(Comman_changeArrayFormat_With_Name(data, "StateID", "StateName", "StateID"));
      } else {
        setStateList([]);
      }
    });
  };

  const getCountryID = async () => {
    fetchData("State_City_ZipCode/GetData_Country").then((data) => {
      if (data) {
        setCountryList(Comman_changeArrayFormat_With_Name(data, "CountryID", "CountryName", "CountryID"));
      } else {
        setCountryList([]);
      }
    });
  };


  // const getCountryID = async () => {
  //   fetchData("State_City_ZipCode/GetData_Country").then((data) => {
  //     if (data) {
  //       setBICountryIDList(Comman_changeArrayFormat_With_Name(data, "CountryID", "CountryName", "CountryID"));
  //     } else {
  //       // setCountryList([]);
  //     }
  //   });
  // };

  // const getStateList = async (CountryID) => {
  //   const val = {
  //     CountryID: CountryID,
  //   };
  //   fetchPostData("State_City_ZipCode/GetData_State", val).then((data) => {
  //     if (data) {
  //       setStateList(Comman_changeArrayFormat_With_Name(data, "StateID", "StateName", "StateID"));
  //     } else {
  //       setStateList([]);
  //     }
  //   });
  // };

  const getBIStateList = async (CountryID) => {
    const val = {
      CountryID: CountryID,
    };
    fetchPostData("NameCountry_State_City/GetData_NameState", val).then((data) => {
      if (data) {
        setBIStateList(Comman_changeArrayFormat_With_Name(data, "StateID", "StateName", "StateID"));
      } else {
        setStateList([]);
      }
    });
  };
  // const selectHandleChange = (e) => {
  //   if (e) {
  //     setValue({
  //       ...value,
  //       [e.name]: e.value
  //     })
  //     if (e.name === 'StateID') {
  //     }
  //   } else {
  //     setValue({
  //       ...value,
  //       [e.name]: null
  //     })
  //   }
  // }
  const selectHandleChange = (e, name) => {
    // console.log(e)
    if (e) {
      if (name === 'DLCountryID') {
        getStateList(e.value);
        setValue({
          ...value,
          [name]: e.value
        })
      } else if (name === 'CountryID') {
        getBIStateList(e.value);
        setValue({
          ...value,
          [name]: e.value
        })
      } else if (name === 'StateID') {
        setValue({
          ...value,
          [name]: e.value
        })
      } else {
        setValue({
          ...value,
          [name]: e.value
        })
      }

      } else if (name === 'BICountryID') {
        setValue({
          ...value,
          ['BIStateID']: '',
          ['BICityID']: '',
        })
       setBIStateList([]);
        setValue({
          ...value,
          [name]: '',
        })
      } else if (name === 'BIStateID') {
        setValue({
          ...value,
          ['BICityID']: '',
        })
        setValue({
          ...value,
          [name]: '',
        })
      } else {
        setValue({
          ...value,
          [name]: null,
        })

    }
  }


  const handleChange = (e) => {
    if (e.target.name === "IsCurrent") {
      setValue({
        ...value,
        [e.target.name]: e.target.checked,
      });
    } else {
      setValue({
        ...value,
        [e.target.name]: e.target.value,
      });
    }
  };

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

  //-----------------------------insert-Update--------------------------
  const Add_Type = () => {
    AddDeleteUpadate('NameIdentificationNumber_FRW/Insert_NameIdentificationNumber_FRW', value)
      .then((res) => {
        Get_IdentificationData();
        setIdentificationModal(false);
        setIdentificationNumberID('');
        toastifySuccess(res.Message);
        reset();

      })
  }

  const update_Identification = () => {
    AddDeleteUpadate('NameIdentificationNumber_FRW/Update_NameIdentificationNumber_FRW', value).then((res) => {
      toastifySuccess(res.Message);
      setIdentificationModal(false);
      setIdentificationNumberID('');
      Get_IdentificationData()
      reset();
    })
  }
  const columns = [
    {
      name: <p className='text-end' style={{ position: 'absolute', top: '7px' }}>Action</p>,
      cell: row => <>
        <Link to={'#'} onClick={() => { setEditVal(row); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1 new-button">
          <i className="fa fa-edit"></i>
        </Link>
      </>
    },
    {
      name: 'Identification Type',
      selector: (row) => row.IdType_Description,
      sortable: true
    },
    {
      name: 'ID Number',
      selector: (row) => row.IdentificationNumber,
      sortable: true
    },
    {
      name: <p className='text-end' style={{ position: 'absolute', top: '7px', right: 0 }}>Delete</p>,
      cell: row => <>
        <div className="div" style={{ position: 'absolute',  right: 0 }}>

          <Link to={'#'} onClick={() => { setIdentificationNumberID(row.IdentificationNumberID); setModalstatus(true) }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1 new-button" data-toggle="modal" data-target="#myModal2">
            <i className="fa fa-trash"></i>
          </Link>
        </div>

      </>
    }
  ];
  const setEditVal = (row) => {
    setIdentificationNumberID(row.IdentificationNumberID);
    setIdentificationModal(true);
  }

  const CloseModal = () => {
    setModalstatus(false)
  }

  const DeleteIdentification = () => {
    const val = {
      'IdentificationNumberID': IdentificationNumberID,
      'DeletedByUserFK': '',
    }
    AddDeleteUpadate('NameIdentificationNumber_FRW/Delete_NameIdentificationNumber_FRW', val).then((res) => {
      if (res) {
        toastifySuccess(res.Message);
        Get_IdentificationData();
        setModalstatus(false)
        setIdentificationNumberID('')
      } else console.log("Somthing Wrong");
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

  const customStylesWithOutColor = {
    control: base => ({
      ...base,
      height: 20,
      minHeight: 45,
      fontSize: 18,
      margintop: 2,
      boxShadow: 0,
    }),
  };

  const startRef = React.useRef();
  const onKeyDown = (e) => {
    if (e.keyCode === 9 || e.which === 9) {
      startRef.current.setOpen(false);
    }
  }

  return (
    <>
      <div className="col-md-12 pt-2">
        <div className="bg-line text-white py-1 px-2 d-flex justify-content-between align-items-center">
          <p className="p-0 m-0 d-flex align-items-center" style={{ fontSize: '18px' }}>
            Identification Number
          </p>
          {
            ('NameID') ?
              <Link to={'#'} onClick={() => { setIdentificationModal(true); reset();setIdentificationNumberID('') }} className="btn btn-sm bg-green text-white px-2 py-0 new-button">
                <i className="fa fa-plus"></i>
              </Link>
              :
              <></>
          }
        </div>
      </div>
      {
        IdentificationModal ?
          <>
            <div className="row px-3">
              <div className="col-12">
                <div className="row mt-2">
                  <div class="col-12 col-md-12 col-lg-6 mt-1 ">
                    <div className="text__dropdwon">
                      <Select
                        name='IdentificationTypeID'
                        styles={colourStyles}
                        value={identification?.filter((obj) => obj.value === value?.IdentificationTypeID)}
                        isClearable
                        options={identification}
                        onChange={(e) => ChangeDropDown(e, 'IdentificationTypeID')}
                        placeholder="Select..."
                      />
                      <label htmlFor='' className='pt-1'>Identification Type</label>
                      {errors.IdentificationTypeIDErrors !== 'true' ? (
                        <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.IdentificationTypeIDErrors}</span>
                      ) : null}
                    </div>
                  </div>
                  <div className="col-12 col-md-12 col-lg-6 mt-1 pt-1">
                    <div class="text-mobile">
                      <input type="text" value={value.IdentificationNumber} maxLength={16} onChange={handleChange} className='requiredColor' name='IdentificationNumber' required />
                      <label className='pt-1'>Identification Number</label>
                      {errors.IdentificationNumberErrors !== 'true' ? (
                        <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.IdentificationNumberErrors}</span>
                      ) : null}
                    </div>
                  </div>
                  <div className="col-12 col-md-12 col-lg-4 mt-3 ">
                    <div className="text__dropdwon">
                      <DatePicker
                        ref={startRef}
                        onKeyDown={onKeyDown}
                        id='ExpiryDate'
                        name='ExpiryDate'
                        className='new-datepicker'
                        dateFormat="MM/dd/yyyy"
                        onChange={(date) => { setIdentificationDate(date); setValue({ ...value, ['ExpiryDate']: date ? getShowingWithOutTime(date) : null }) }}
                        showMonthDropdown
                        isClearable={value?.ExpiryDate ? true : false}
                        autoComplete="nope"
                        showDisabledMonthNavigation
                        dropdownMode="select"
                        showYearDropdown
                        placeholderText={value?.ExpiryDate ? value?.ExpiryDate : 'Select...'}
                        selected={IdentificationDate}
                        popperPlacement='right'
                      // minDate={new Date()}
                      />
                      <label htmlFor="" className='pt-1'>ID Expiry</label>
                    </div>
                  </div>
                  <div className="col-12 col-md-12 col-lg-4 mt-3">
                    <div className="text__dropdwon">
                      <Select
                        name="CountryID"
                        value={CountryList?.filter((obj) => obj.value === value?.CountryID)}
                        isClearable
                        options={CountryList}
                        // onChange={selectHandleChange}
                        onChange={(e) => selectHandleChange(e, 'CountryID')}
                        placeholder="Select..."
                        styles={customStylesWithOutColor}
                      />
                      <label htmlFor="" className='pt-1'>Country</label>
                    </div>
                  </div>
                  <div className="col-12 col-md-12 col-lg-4 mt-3">
                    <div className="text__dropdwon">
                      <Select
                        name="StateID"
                        value={stateList?.filter((obj) => obj.value === value?.StateID)}
                        isClearable
                        options={stateList}
                        // onChange={selectHandleChange}
                        onChange={(e) => selectHandleChange(e, 'StateID')}
                        placeholder="Select..."
                        styles={customStylesWithOutColor}
                      />
                      <label htmlFor="" className='pt-1'>State</label>
                    </div>
                  </div>

                  {/* 
                  <div className="col-6 col-md-4 col-lg-4 mt-1">
                    <div className=" dropdown__box">
                      <Select
                        name="BICountryID"
                        styles={customStylesWithOutColor}
                        value={bICountryIDList?.filter((obj) => obj.value === value?.BICountryID)}
                        isClearable
                        options={bICountryIDList}
                        onChange={(e) => selectHandleChange(e, 'BICountryID')}
                        placeholder="Select..."
                      />
                      <label htmlFor="">Country</label>
                    </div>
                  </div>
                  <div className="col-6 col-md-4 col-lg-4 mt-1">
                    <div className=" dropdown__box">
                      <Select
                        name="BIStateID"
                        styles={customStylesWithOutColor}
                        value={bIstateList?.filter((obj) => obj.value === value?.BIStateID)}
                        isClearable
                        options={bIstateList}
                        onChange={(e) => selectHandleChange(e, 'BIStateID')}
                        placeholder="Select..."
                      />
                      <label htmlFor="">State</label>
                    </div>
                  </div> */}
                </div>
                <div class="col-12 text-right mt-3 ">
                  {
                    IdentificationNumberID ?
                      <button type="button" className="btn btn-lg  btn-success new-button mr-3" onClick={check_Validation_Error}>Update</button>
                      :
                      <button type="button" className="btn btn-lg  btn-success new-button mr-3" onClick={check_Validation_Error} >Save</button>
                  }
                  <button type="button" onClick={() => { setIdentificationModal(false); setIdentificationNumberID(''); reset(); }} className="btn btn-lg  btn-success new-button">Close</button>
                </div>
              </div>
            </div>
          </>
          :
          <>
            <div className="col-md-12 px-2 pt-2">
              <DataTable
                columns={columns}
                data={IdentificationData}
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
          </>
      }
      {
        modalStatus ?
          <div class="modal" id="myModal2" style={{ background: "rgba(0,0,0, 0.5)", transition: '0.5s' }} data-backdrop="false">
            <div class="modal-dialog">
              <div class="modal-content">
                <div className="box text-center py-5">
                  <h5 className="modal-title mt-2" id="exampleModalLabel">Do you want to Delete ?</h5>
                  <div className="btn-box mt-3">
                    <button type="button" onClick={DeleteIdentification} className="btn btn-sm text-white" style={{ background: "#ef233c" }} >Delete</button>
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

export default MobileIdentification