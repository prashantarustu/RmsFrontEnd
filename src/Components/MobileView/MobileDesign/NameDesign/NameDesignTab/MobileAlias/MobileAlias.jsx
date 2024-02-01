import React, { useState } from 'react'
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import DatePicker from "react-datepicker";
import Select from "react-select";
import { Decrypt_Id_Name, getShowingDateText, getShowingMonthDateYear, getShowingWithOutTime, tableCustomStyles } from '../../../../../Common/Utility';
import { AddDeleteUpadate, fetchPostData } from '../../../../../hooks/Api';
import { Comman_changeArrayFormat } from '../../../../../Common/ChangeArrayFormat';
import { useEffect } from 'react';
import { useCallback } from 'react';
import { RequiredFieldSpaceNotAllow } from '../../../../../Pages/Agency/AgencyValidation/validators';
import { SSN_Field } from '../../../../../Pages/PersonnelCom/Validation/PersonnelValidation';
import { toastifySuccess } from '../../../../../Common/AlertMsg';
const MobileAlias = () => {

  const [AliasesModal, setAliasesModal] = useState(false)
  const [AliasesTypeCode, setAliasesTypeCode] = useState('')
  const [DOB, setDOB] = useState();
  const [suffixIdDrp, setsuffixIdDrp] = useState([])
  const [AliasesData, setAliasesData] = useState();
  const [NameAliasesID, setNameAliasesID] = useState('');
  const [updateStatus, setUpdateStatus] = useState(0)
  const [Editval, setEditval] = useState();
  const [modalStatus, setModalstatus] = useState(false)

  const [value, setValue] = useState({
    'LastName': '', 'FirstName': '', 'MiddleName': '', 'SuffixID': '', 'AliasSSN': '', 'DOB': '', 'ModifiedDtTm': "",
    'NameID': '',
    'CreatedByUserFK':  '',
    "ModifiedByUserFK": ""
    //  'IsVerify': "",
  })

  const [errors, setErrors] = useState({
    'LastNameErrors': '',
  })

  useEffect(() => {
    get_Aliases_Data();
  }, [])

  const get_Aliases_Data = () => {

    const val = {
      'NameID': ('NameID'), 
    }
    fetchPostData('NameAliases_FRW/GetData_NameAliases_FRW', val).then((res) => {
      if (res) {
        setAliasesData(res)
      } else {
        setAliasesData([]);
      }
    })
  }

  useEffect(() => {
    if (NameAliasesID) {
      GetSingleData(NameAliasesID)
    }
  }, [NameAliasesID, updateStatus])

  const GetSingleData = () => {
    const val = { 'NameAliasesID': NameAliasesID }
    fetchPostData('NameAliases_FRW/GetSingleData_NameAliases_FRW', val)
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
    GetSuffixIDDrp();

  }, [])

  useEffect(() => {
    console.log(Editval)
    if (NameAliasesID) {
      setValue({
        ...value,
        'NameAliasesID': NameAliasesID,
        'DOB': Editval[0]?.DOB ? getShowingDateText(Editval[0]?.DOB) : ' ', "LastName": Editval[0]?.LastName,
        'FirstName': Editval[0]?.FirstName, 'MiddleName': Editval[0]?.MiddleName, 'SuffixID': Editval[0]?.SuffixID,
        // 'IsVerify': Editval[0]?.IsVerify,
        'AliasSSN': Editval[0]?.AliasSSN,
        'ModifiedByUserFK': ('PINID'),
    

      })
    }
    else {
      setValue({
        ...value,
        'LastName': '', 'FirstName': '', 'MiddleName': '', 'DOB': '', 'SuffixID': '', 'AliasSSN': '', 'ModifiedByUserFK': '',
        // 'IsVerify': '',
      })
    }
  }, [Editval, updateStatus])

  const reset = () => {
    setValue({
      ...value,
      'LastName': '', 'FirstName': '', 'MiddleName': '', 'DOB': '', 'SuffixID': '', 'AliasSSN': '',
      //  'IsVerify': '',

    }); setDOB("")
    setErrors({
      'LastNameErrors': '',
    })
  }

  const check_Validation_Error = (e) => {
    if (RequiredFieldSpaceNotAllow(value.LastName)) {
      setErrors(prevValues => { return { ...prevValues, ['LastNameErrors']: RequiredFieldSpaceNotAllow(value.LastName) } })
    }
    if (SSN_Field(value.AliasSSN)) {
      setErrors(prevValues => { return { ...prevValues, ['AliasSSN']: SSN_Field(value.AliasSSN) } })
    }
  }
  const { LastNameErrors, AliasSSN } = errors

  useEffect(() => {
    if (LastNameErrors === 'true' && AliasSSN === 'true') {
      if (NameAliasesID) update_Activity()
      else Add_Type()
    }
  }, [LastNameErrors, AliasSSN])

  const GetSuffixIDDrp = () => {
    const val = {
      AgencyID: ('AgencyID'), 
    }
    fetchPostData('Suffix/GetDataDropDown_Suffix', val).then((data) => {
      if (data) {
        setsuffixIdDrp(Comman_changeArrayFormat(data, 'SuffixID', 'Description'))
      } else {
        setsuffixIdDrp([]);
      }
    })
  }
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
    if (e.target.name === "IsVerify") {
      setValue({
        ...value,
        [e.target.name]: e.target.checked,
      });
    }
    else if (e.target.name === 'AliasSSN') {
      var ele = e.target.value.replace(/\D/g, '');
      if (ele.length === 9) {
        var cleaned = ('' + ele).replace(/\D/g, '');
        var match = cleaned.match(/^(\d{3})(\d{2})(\d{4})$/);
        if (match) {
          setValue({
            ...value,
            [e.target.name]: match[1] + '-' + match[2] + '-' + match[3]
          })
        }
      } else {
        ele = e.target.value.split('-').join('').replace(/\D/g, '');
        setValue({
          ...value,
          [e.target.name]: ele
        })
      }
    } else {
      setValue({
        ...value,
        [e.target.name]: e.target.value,
      });
    }
  };


  const Add_Type = (e) => {
    AddDeleteUpadate('NameAliases_FRW/Insert_NameAliases_FRW', value).then((res) => {
      get_Aliases_Data();
      setAliasesModal(false);
      setNameAliasesID('');
      toastifySuccess(res.Message);
      reset();
    })
  }

  const update_Activity = () => {
    AddDeleteUpadate('NameAliases_FRW/Update_NameAliases_FRW', value).then((res) => {
      if (res.success) {
        setNameAliasesID('');
        toastifySuccess(res.Message);
        setAliasesModal(false);
        get_Aliases_Data()
        reset();
      }
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
      name: 'DOB',
      // selector: (row) => getShowingWithOutTime(row.DOB),
      selector: (row) => row.DOB ? getShowingWithOutTime(row.DOB) : '',
      sortable: true
    },
    {
      name: 'Last Name',
      selector: (row) => row.LastName,
      sortable: true
    },
    {
      name: 'First Name',
      selector: (row) => row.FirstName,
      sortable: true
    },
    {
      name: 'Middle Name',
      selector: (row) => row.MiddleName,
      sortable: true
    },
    {
      name: 'Aliases SSN',
      selector: (row) => row.AliasSSN,
      sortable: true
    },
    {
      name: <p className='text-end' style={{ position: 'absolute', top: '7px', right: 0 }}>Delete</p>,
      cell: row => <>
        <div className="div" style={{ position: 'absolute', right: 4 }}>
          <Link to={'#'} onClick={() => { setNameAliasesID(row.NameAliasesID); setModalstatus(true) }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1 new-button" data-toggle="modal" data-target="#myModal2">
            <i className="fa fa-trash"></i>
          </Link>
        </div>
      </>
    }

  ];
  const setEditVal = (row) => {
    setNameAliasesID(row.NameAliasesID);
    setAliasesModal(true);
  }

  const CloseModal = () => {
    setModalstatus(false)
  }

  const DeleteNameAliases = () => {
    const val = {
      'NameAliasesID': NameAliasesID,
      'DeletedByUserFK': ('PINID'),
    }
    AddDeleteUpadate('NameAliases_FRW/Delete_NameAliases_FRW', val).then((res) => {
      if (res) {
        toastifySuccess(res.Message);
        get_Aliases_Data();
        setModalstatus(false)
        setNameAliasesID('')
      } else console.log("Somthing Wrong");
    })
  }

  // const setStatusFalse = (e) => {
  //   setStatus(false)
  //   setModal(true)
  // }

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
      minHeight: 40,
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
  };

  return (
    <>
      <div className="col-md-12  pt-2">
        <div className="bg-line text-white py-1 px-2 d-flex justify-content-between align-items-center">
          <p className="p-0 m-0 d-flex align-items-center" style={{ fontSize: '18px' }}>
            Aliases
          </p>
          {/* <Link to={'#'} onClick={() => { setAliasesModal(true); }} className="btn btn-sm bg-green text-white px-2 py-0"
            style={{ fontSize: "18px" }} >
            <i className="fa fa-plus"></i>
          </Link> */}
          {
            ('NameID') ?
              <Link to={'#'} onClick={() => { setAliasesModal(true); reset(); setNameAliasesID('') }} className="btn btn-sm bg-green text-white px-2 py-0 new-button">
                <i className="fa fa-plus"></i>
              </Link>
              :
              <></>
          }
        </div>
      </div>
      {
        AliasesModal ?
          <>
            <div className="row px-3">
              <div className="col-12">
                <div className="row">

                  <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1">
                    <div class="text-mobile">
                      <input type="text" className='requiredColor' name='LastName' value={value?.LastName} onChange={handleChange} required />
                      <label>Last Name</label>
                      {errors.LastNameErrors !== 'true' ? (
                        <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.LastNameErrors}</span>
                      ) : null}
                    </div>
                  </div>
                  <div className="col-6 col-md-6 col-lg-4  mt-2 pt-1">
                    <div class="text-mobile">
                      <input type="text" name='FirstName' value={value?.FirstName} onChange={handleChange} required />
                      <label>First Name</label>
                    </div>
                  </div>
                  <div className="col-12 col-md-6 col-lg-4  mt-2 pt-1">
                    <div class="text-mobile">
                      <input type="text" name='MiddleName' value={value?.MiddleName} onChange={handleChange} required />
                      <label>Middle Name</label>
                    </div>
                  </div>
                  <div class="col-6 col-md-6 mt-3 pt-1 col-lg-4 mb-2">
                    <div className="text-mobile">
                      <input type="text" name='AliasSSN' maxLength={9} value={value?.AliasSSN} onChange={handleChange} required />
                      <label className=''>Aliases SSN</label>
                      {errors.AliasSSN !== 'true' ? (
                        <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.AliasSSN}</span>
                      ) : null}
                    </div>
                  </div>
                  <div class="col-6 col-md-6  mt-3 mb-1 col-lg-4 ">
                    <div class="text__dropdwon">
                      <Select
                        name='SuffixID'
                        className='requiredColor'
                        styles={customStylesWithOutColor}
                        value={suffixIdDrp?.filter((obj) => obj.value === value?.SuffixID)}
                        isClearable
                        options={suffixIdDrp}
                        onChange={(e) => ChangeDropDown(e, 'SuffixID')}
                        placeholder="Select..."
                      />
                      <label htmlFor='' className='mt-1'>Suffix</label>
                    </div>
                  </div>
                  <div class="col-6 col-md-6  col-lg-4 mt-3">
                    <div className='text__dropdwon'>
                      <DatePicker
                        id='DOB'
                        name='DOB'
                        className='name-datepicker'
                        ref={startRef}
                        onKeyDown={onKeyDown}
                        onChange={(date) => { setDOB(date); setValue({ ...value, ['DOB']: date ? getShowingMonthDateYear(date) : null }) }}
                        dateFormat="MM/dd/yyyy"
                        isClearable={value?.DOB ? true : false}
                        // selected={DOB}
                        selected={value?.DOB && new Date(value?.DOB)}
                        showDisabledMonthNavigation
                        autoComplete="nope"
                        showYearDropdown
                        showMonthDropdown
                        dropdownMode="select"
                        maxDate={new Date()}
                        placeholderText={value?.DOB ? value.DOB : 'Select...'}
                        popperPlacement='left'
                      />
                      <label htmlFor="" className='pt-1'>DOB</label>
                    </div>
                  </div>
                </div>
                <div class="col-12 text-right  mt-3" >
                  {
                    NameAliasesID ?
                      <button type="button" className="btn btn-lg  btn-success new-button mr-3" onClick={check_Validation_Error}>Update</button>
                      :
                      <button type="button" className="btn btn-lg  btn-success new-button mr-3" onClick={check_Validation_Error} >Save</button>
                  }
                  <button type="button" onClick={() => { setAliasesModal(false); setNameAliasesID(''); reset(); }} className="btn btn-lg  btn-success new-button">Close</button>
                </div>
              </div>
            </div>
          </>
          :
          <>
            <div className="col-md-12 px-2 pt-2">
              <DataTable
                columns={columns}
                data={AliasesData}
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
                    <button type="button" onClick={DeleteNameAliases} className="btn btn-sm text-white" style={{ background: "#ef233c" }} >Delete</button>
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

export default MobileAlias