import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import DatePicker from "react-datepicker";
import Select from "react-select";
import { Decrypt_Id_Name, getShowingDateText, tableCustomStyles } from '../../../../../Common/Utility';
import { AddDeleteUpadate, fetchPostData } from '../../../../../hooks/Api';
import { Comman_changeArrayFormat, threeColArray } from '../../../../../Common/ChangeArrayFormat';
import { toastifySuccess } from '../../../../../Common/AlertMsg';
import { RequiredFieldIncident } from '../../../../../Pages/Utility/Personnel/Validation';
import { Email_Field_Contact, PhoneFieldNotReq } from '../../../../../Pages/Agency/AgencyValidation/validators';

const MobileContact = () => {

  const [Editval, setEditval] = useState();
  const [ContactType, setContactType] = useState([]);
  const [verifyIdDrp, setverifyIdDrp] = useState([])
  const [ContactModal, setContactModal] = useState(false)
  const [contactTypeCode, setContactTypeCode] = useState('')
  const [ContactDetailsData, setContactDetailsData] = useState([]);
  const [contactNameId, setContactNameId] = useState();
  const [updateStatus, setUpdateStatus] = useState(0)
  const [modal, setModal] = useState(false)
  const [modalStatus, setModalstatus] = useState(false)

  const [value, setValue] = useState({
    'NameID': '',
    'ContactTypeID': '',
    'VerifyID': '',
    'Phone_Email': '',
    'IsInListedPh': "",
    "IsCurrentPh": '',
    'CreatedByUserFK':'',
  })

  const [errors, setErrors] = useState({
    'ContactTypeIDErrors': "", 'Phone_EmailErrors': ""
  })

  //----------------------------------Get_singleData-------------------------------

  useEffect(() => {
    Get_ContactDetailsData();
  }, [])

  const Get_ContactDetailsData = () => {
    console.log(value)
    const val = {
      'NameID': ('NameID'), 
    }
    fetchPostData('NameContactDetails_FRW/GetData_NameContactDetails_FRW', val).then((res) => {
      if (res) {
        setContactDetailsData(res)
      } else {
        setContactDetailsData();
      }
    })
  }

  useEffect(() => {
    if (contactNameId) {
      GetSingleData(contactNameId)
    }
  }, [contactNameId])

  const GetSingleData = (contactNameId) => {
    const val = { 'NameContactID': contactNameId }
    fetchPostData('NameContactDetails_FRW/GetSingleData_NameContactDetails_FRW', val)
      .then((res) => {
        if (res) setEditval(res)
        else setEditval()
      })
  }

  useEffect(() => {
    if (Editval) {
      setValue({
        ...value,
        'NameContactID': contactNameId,
        'ContactTypeID': Editval[0]?.ContactTypeID,
        'VerifyID': Editval[0]?.VerifyID,
        'Phone_Email': Editval[0]?.Phone_Email,
        'ModifiedByUserFK':('PINID'),
        'IsInListedPh': Editval[0]?.IsInListedPh,
        "IsCurrentPh": Editval[0]?.IsCurrentPh,
      })
      setContactTypeCode(Get_Property_Code(Editval, ContactType))
    } else {
      setValue({
        ...value,
        'ContactTypeID': '',
        'VerifyID': '',
        'Phone_Email': '',
        'IsInListedPh': '',
        "IsCurrentPh": '',
      })
      setContactTypeCode('')
    }
  }, [Editval, updateStatus])

  const reset = () => {
    setValue({
      ...value,
      'ContactTypeID': '', 'VerifyID': '', 'Phone_Email': '', 'IsInListedPh': "", "IsCurrentPh": '',
    });
    setErrors({
      'Phone_EmailErrors': '', 'ContactTypeIDErrors': '', 'CommentsError': '',

    });
  }

  const check_Validation_Error = (e) => {
    if (RequiredFieldIncident(value.ContactTypeID)) {
      setErrors(prevValues => { return { ...prevValues, ['ContactTypeIDErrors']: RequiredFieldIncident(value.ContactTypeID) } })
    }
    if (contactTypeCode === "E") {
      if (Email_Field_Contact(value.Phone_Email)) {
        setErrors(prevValues => { return { ...prevValues, ['Phone_EmailErrors']: Email_Field_Contact(value.Phone_Email) } })
      }
    } else {
      if (PhoneFieldNotReq(value.Phone_Email)) {
        setErrors(prevValues => { return { ...prevValues, ['Phone_EmailErrors']: PhoneFieldNotReq(value.Phone_Email) } })
      }
    }
  }

  const { ContactTypeIDErrors, Phone_EmailErrors, } = errors

  useEffect(() => {
    if (ContactTypeIDErrors === 'true' && Phone_EmailErrors === 'true') {
      if (contactNameId) update_Activity()
      else Add_Type()
    }
  }, [ContactTypeIDErrors, Phone_EmailErrors])

  const handleChange = (e) => {
    if (e.target.name === 'IsInListedPh' || e.target.name === 'IsCurrentPh') {
      setValue({
        ...value,
        [e.target.name]: e.target.checked
      })
    }
    else if (e.target.name === 'Phone_Email') {
      if (contactTypeCode !== "E") {
        var ele = e.target.value.replace(/\D/g, '');
        if (ele.length === 10) {
          var cleaned = ('' + ele).replace(/\D/g, '');
          var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
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
          [e.target.name]: e.target.value
        })
      }
    }
  }

  const ChangeDropDown = (e, name) => {
    if (e) {
      if (name === 'ContactTypeID') {
        setContactTypeCode(e.id)
        setValue({
          ...value,
          ['ContactTypeID']: e.value
        })
      }
      setValue({
        ...value,
        [name]: e.value
      })
    } else {
      setValue({
        ...value,
        [name]: null
      }); setContactTypeCode('')
    }
  }

  useEffect(() => {
    get_ContactType('1', '1');
    GetVerifyIDDrp();
  }, [])

  const get_ContactType = (IsEMail, IsPhone) => {
    const val = {
      AgencyID: '',
      IsEMail: IsEMail,
      IsPhone: IsPhone,
    }
    fetchPostData('ContactPhoneType/GetDataDropDown_ContactPhoneType', val).then((data) => {
      if (data) {
        // setContactType(Comman_changeArrayFormat(data, 'ContactTypeID', 'Description'))
        setContactType(threeColArray(data, 'ContactPhoneTypeID', 'Description', 'ContactPhoneTypeCode'))
      } else {
        setContactType([]);
      }
    })
  }
  const GetVerifyIDDrp = () => {
    const val = {
      AgencyID: ('AgencyID'), 
    }
    fetchPostData('Verify/GetDataDropDown_Verify', val).then((data) => {
      if (data) {
        setverifyIdDrp(Comman_changeArrayFormat(data, 'VerifyID', 'Description'))
      } else {
        setverifyIdDrp([]);
      }
    })
  }
  //---------------------Insert Data-------------------------
  const Add_Type = (e) => {
    console.log(value)
    AddDeleteUpadate('NameContactDetails_FRW/Insert_NameContactDetails_FRW', value)
      .then((res) => {
        toastifySuccess(res.Message);
        setContactModal(false)
        reset();
        setContactTypeCode('')
        Get_ContactDetailsData();

      })
  }
  const update_Activity = () => {
    AddDeleteUpadate('NameContactDetails_FRW/Update_NameContactDetails_FRW', value).then((res) => {
      if (res.success) {
        setContactNameId('');
        toastifySuccess(res.Message);
        Get_ContactDetailsData();
        setContactModal(false)
        reset();
        setErrors({ ...errors, ['Phone_EmailErrors']: '', });
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
      name: 'Phone/Email',
      selector: (row) => row.Phone_Email,
      sortable: true
    },
    {
      name: 'Verify',
      selector: (row) => row.Verify_Description,
      sortable: true
    },
    {
      name: 'Contact Type',
      selector: (row) => row.ContactType_Description,
      sortable: true
    },
    {
      name: 'Unlisted Phone',
      selector: (row) => <><input type="checkbox" name="" id="" checked={row.IsInListedPh} /></>,
      sortable: true
    },
    {
      name: <p className='text-end' style={{ position: 'absolute', top: '7px', right: 0 }}>Delete</p>,
      cell: row => <>
        <div className="div" style={{ position: 'absolute', right: 4}}>
          <Link to={'#'} onClick={() => { setContactNameId(row.NameContactID); setModalstatus(true) }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1 new-button" data-toggle="modal" data-target="#myModal2">
            <i className="fa fa-trash"></i>
          </Link>
        </div>
      </>
    }
  ];
  const setEditVal = (row) => {
    setContactNameId(row.NameContactID);
    setContactModal(true);
  }

  const CloseModal = () => {
    setModalstatus(false)
  }

  //------------------------delete Data-----------------------------
  const DeleteContactDetail = () => {
    console.log(value)
    const val = {
      'NameContactID': contactNameId,
      'DeletedByUserFK':('PINID'),
    }
    AddDeleteUpadate('NameContactDetails_FRW/Delete_NameContactDetails_FRW', val).then((res) => {
      if (res) {
        toastifySuccess(res.Message);
        Get_ContactDetailsData();
        setModalstatus(false)
        setContactNameId('');
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
      minHeight: 40,
      fontSize: 18,
      margintop: 2,
      boxShadow: 0,
    }),
  };

  return (
    <>
      <div className="col-md-12  pt-2">
        <div className="bg-line text-white py-1 px-2 d-flex justify-content-between align-items-center">
          <p className="p-0 m-0 d-flex align-items-center" style={{ fontSize: '18px' }}>
            Contact
          </p>
          {/* <Link to={'#'} onClick={() => { setContactModal(true); }} className="btn btn-sm bg-green text-white px-2 py-0"
            style={{ fontSize: "18px" }}>
            <i className="fa fa-plus"></i>
          </Link> */}
          {
            ('NameID') ?
              <Link to={'#'} onClick={() => { setContactModal(true); reset();setContactNameId('')}} className="btn btn-sm bg-green text-white px-2 py-0 new-button">
                <i className="fa fa-plus"></i>
              </Link>
              :
              <></>
          }
        </div>
      </div>
      {
        ContactModal ?
          <>
            <div className="row px-3">
              <div className="col-12">
                <div className="row mt-2">
                  <div class="col-6 col-md-6 pt-1 mb-1 col-lg-4  ">
                    <div class="text__dropdwon ">
                      <Select
                        name='ContactTypeID'
                        styles={colourStyles}
                        value={ContactType?.filter((obj) => obj.value === value?.ContactTypeID)}
                        isClearable
                        options={ContactType}
                        onChange={(e) => ChangeDropDown(e, 'ContactTypeID')}
                        placeholder="Select..."
                      />
                      <label htmlFor='' className='mt-1'>Contact Type</label>
                      {errors.ContactTypeIDErrors !== 'true' ? (
                        <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ContactTypeIDErrors}</span>
                      ) : null}
                    </div>
                  </div>
                  <div className="col-6 col-md-6 col-lg-4 mt-1 pt-1">
                    <div className="text-mobile">
                      {
                        contactTypeCode === "E" ?
                          <input type="text" className='requiredColor' name='Phone_Email' value={value.Phone_Email} onChange={handleChange} required />
                          :
                          <>
                            <input type="text" className='requiredColor' maxLength={10} name='Phone_Email' value={value.Phone_Email} onChange={handleChange} required />
                          </>
                      }
                      <label className=''>Phone/Email</label>
                      {errors.Phone_EmailErrors !== 'true' ? (
                        <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.Phone_EmailErrors}</span>
                      ) : null}
                    </div>
                  </div>
                  <div className="col-12 col-md-12 col-lg-4 pt-1  ">
                    <div class="text__dropdwon ">
                      <Select
                        name='VerifyID'
                        // styles={colourStyles}
                        isClearable
                        value={verifyIdDrp?.filter((obj) => obj.value === value?.VerifyID)}
                        options={verifyIdDrp}
                        onChange={(e) => ChangeDropDown(e, 'VerifyID')}
                        placeholder="Select.."
                      />
                      <label htmlFor="" className='pt-1'>How Verify</label>
                    </div>
                  </div>
                  <div className="col-12">
                    {
                      contactTypeCode === "E" ?
                        <>

                        </>
                        :
                        <div className="row ">

                          <div className="col-6 col-md-4 col-lg-3 mt-2" >
                            <div class="form-check px-1" >
                              <input type="checkbox" name="IsInListedPh" checked={value.IsInListedPh} value={value.IsInListedPh}
                                onChange={handleChange}
                                // disabled={''}
                                id="IsInListedPh" />
                              <label className='ml-2' htmlFor="IsInListedPh" style={{ fontSize: '18px', color: '#000', }}>Unlisted Phone</label>
                            </div>
                          </div>
                        </div>
                    }
                  </div>
                </div>
                <div class="col-12 text-right  " >
                  {
                    contactNameId ?
                      <button type="button" className="btn btn-lg  btn-success new-button mr-3" onClick={check_Validation_Error}>Update</button>
                      :
                      <button type="button" className="btn btn-lg  btn-success new-button mr-3" onClick={check_Validation_Error} >Save</button>
                  }
                  <button type="button" onClick={() => { setContactModal(false); setContactNameId(''); reset(); }} className="btn btn-lg  btn-success new-button">Close</button>
                </div>
              </div>
            </div>
          </>
          :
          <>
            <div className="col-md-12 px-2 pt-2">
              <DataTable
                columns={columns}
                data={ContactDetailsData}
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
                    <button type="button" onClick={DeleteContactDetail} className="btn btn-sm text-white" style={{ background: "#ef233c" }} >Delete</button>
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

export default MobileContact

const Get_Property_Code = (data, dropDownData) => {

  const result = data?.map((sponsor) => (sponsor.ContactTypeID))

  const result2 = dropDownData?.map((sponsor) => {
    if (sponsor.value === result[0]) {
      return { value: result[0], label: sponsor.label, id: sponsor.id }
    }
  }
  )
  const val = result2.filter(function (element) {
    return element !== undefined;
  });
  return val[0]?.id
}