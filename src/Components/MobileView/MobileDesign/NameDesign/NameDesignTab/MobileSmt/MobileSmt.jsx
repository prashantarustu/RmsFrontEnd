import React, { useState } from 'react'
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import DatePicker from "react-datepicker";
import Select from "react-select";
import { Decrypt_Id_Name, EncryptedList, tableCustomStyles } from '../../../../../Common/Utility';
import { AddDeleteUpadate, AddDeleteUpadate_FormData, fetchPostData } from '../../../../../hooks/Api';
import { Comman_changeArrayFormat } from '../../../../../Common/ChangeArrayFormat';
import { useEffect } from 'react';
import { RequiredFieldIncident } from '../../../../../Pages/Utility/Personnel/Validation';
import { toastifyError, toastifySuccess } from '../../../../../Common/AlertMsg';
import { Carousel } from 'react-responsive-carousel';
import defualtImage from '../../../../../../img/uploadImage.png'
import DeletePopUpModal from '../../../../../Common/DeleteModal';

const MobileSMT = () => {

  const [SMTModal, setSMTModal] = useState(false)
  const [SMTLocation, setSMTLocation] = useState([]);
  const [SMTType, setSMTType] = useState([]);
  const [Editval, setEditval] = useState();
  const [SmtData, setSmtData] = useState();
  const [updateStatus, setUpdateStatus] = useState(0)
  const [smtId, setSmtId] = useState();
  const [modalStatus, setModalstatus] = useState(false)

  //---------------------Images------------------------------------------------
  const [arrestMultiImg, setArrestMultiImg] = useState([])
  const [ID, setID] = useState();

  const [value, setValue] = useState({
    'SMTID': '',
    'SMTTypeID': '',
    'SMTLocationID': '',
    'SMT_Description': '',
    'NameID': '',
    'CreatedByUserFK': '',
  })

  const [errors, setErrors] = useState({
    'SMTTypeIDErrors': '', 'SMTLocationIDErrors': '', 'SMT_DescriptionErrors': '',
  })

  //-----------------------GetData--------------------------------
  useEffect(() => {
    get_Smt_Data();
  }, [])

  const get_Smt_Data = () => {
    const val = {
      'NameID': ('NameID'), 
    }
    fetchPostData('NameSMT_FRW/GetData_NameSMT_FRW', val).then((res) => {
      if (res) {
        console.log(res)
        setSmtData(res)
      } else {
        setSmtData([]);
      }
    })
  }

  //--------------------------SingleData---------------------------------
  useEffect(() => {
    if (smtId) {
      GetSingleData()
    }
  }, [smtId])

  const GetSingleData = () => {
    const val = { 'SMTID': smtId }
    fetchPostData('NameSMT_FRW/GetSingleData_NameSMT_FRW', val)
      .then((res) => {
        if (res) setEditval(res)
        else setEditval()
      })
  }

  useEffect(() => {
    if (Editval) {
      get_Arrest_MultiImage(smtId)
      setValue({
        ...value,
        'SMTID': smtId,
        'SMTTypeID': Editval[0]?.SMTTypeID,
        'SMTLocationID': Editval[0]?.SMTLocationID,
        'SMT_Description': Editval[0]?.SMT_Description,
        'ModifiedByUserFK':('PINID'),
      })
      get_SMTLocationID(Editval[0]?.SMTTypeID)
    }
    else {
      setValue({
        ...value,
        'SMTTypeID': '', 'SMTLocationID': '', 'SMT_Description': '',
      })
    }
  }, [Editval, updateStatus])

  const reset = () => {
    setValue({
      ...value,
      'SMTTypeID': '', 'SMTLocationID': '', 'SMT_Description': '',
    });
    setErrors({
      ...errors,
      'SMTTypeIDErrors': '', 'SMTLocationIDErrors': '', 'SMT_DescriptionErrors': '',
    });
  }

  const check_Validation_Error = (e) => {
    if (RequiredFieldIncident(value.SMTLocationID)) {
      setErrors(prevValues => { return { ...prevValues, ['SMTLocationIDErrors']: RequiredFieldIncident(value.SMTLocationID) } })
    }
    if (RequiredFieldIncident(value.SMTTypeID)) {
      setErrors(prevValues => { return { ...prevValues, ['SMTTypeIDErrors']: RequiredFieldIncident(value.SMTTypeID) } })
    }
    if (RequiredFieldIncident(value.SMT_Description)) {
      setErrors(prevValues => { return { ...prevValues, ['SMT_DescriptionErrors']: RequiredFieldIncident(value.SMT_Description) } })
    }

  }

  // Check All Field Format is True Then Submit 
  const { SMTTypeIDErrors, SMTLocationIDErrors, SMT_DescriptionErrors } = errors

  useEffect(() => {
    if (SMTTypeIDErrors === 'true' && SMTLocationIDErrors === 'true' && SMT_DescriptionErrors === 'true') {
      if (smtId) updateSmt()
      else Add_Type()
    }
  }, [SMTTypeIDErrors, SMTLocationIDErrors, SMT_DescriptionErrors])


  useEffect(() => {
    // get_SMTLocationID();    
    get_SMTTypeID();
  }, [])

  const get_SMTLocationID = (id) => {
    const val = {
      AgencyID: ('AgencyID'), 
      SMTTypeID: id
    }
    fetchPostData('SMTLocations/GetDataDropDown_SMTLocations', val).then((data) => {
      if (data) {
        setSMTLocation(Comman_changeArrayFormat(data, 'SMTLocationID', 'Description'))
      } else {
        setSMTLocation([]);
      }
    })
  }

  const get_SMTTypeID = () => {
    const val = {
      AgencyID: ('AgencyID'), 
    }
    fetchPostData('SMTTypes/GetDataDropDown_SMTTypes', val).then((data) => {
      if (data) {
        setSMTType(Comman_changeArrayFormat(data, 'SMTTypeID', 'Description'))
      } else {
        setSMTType([]);
      }
    })
  }

  const ChangeDropDown = (e, name) => {
    if (e) {
      if (name === 'SMTTypeID') {
        get_SMTLocationID(e.value)
      }
      setValue({
        ...value,
        [name]: e.value
      })
    } else {
      setValue({
        ...value,
        [name]: null
      })
    }
  }

  const handleChange = (e) => {
    setValue({
      ...value,
      [e.target.name]: e.target.value
    })
  }

  const Add_Type = () => {
    AddDeleteUpadate('/NameSMT_FRW/Insert_NameSMT_FRW', value)
      .then((res) => {
        get_Smt_Data();
        setSMTModal(false);
        toastifySuccess(res.Message); setArrestMultiImg([]);
        reset(); setErrors({ ...value['SMT_DescriptionErrors'] })
      })
  }

  const updateSmt = () => {
    AddDeleteUpadate('NameSMT_FRW/Update_NameSMT_FRW', value).then((res) => {
      if (res.success) {
        setSmtId('');
        toastifySuccess(res.Message);
        setSMTModal(false);
        get_Smt_Data();
        reset(); setArrestMultiImg([]);
        setErrors({ ...value['SMT_DescriptionErrors'] })
      }
    })
  }

  const columns = [
    {
      width:'120px',
      name: <p className='text-end' style={{ position: 'absolute', top: '7px' }}>Action</p>,
      cell: row => <>
        <Link to={'#'} onClick={() => { setEditVal(row); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1  new-button">
          <i className="fa fa-edit"></i>
        </Link>
      </>
    },
    {
      width:'270px',
      name: 'SMT Type',
      selector: (row) => <>{row?.SMTType_Description} </>,
      sortable: true
    },
    {
      width:'270px',
      name: 'SMT Location',
      selector: (row) => <>{row?.SMTLocation_Description} </>,
      sortable: true
    },
    {
      name: 'Description',
      selector: (row) => <>{row?.SMT_Description ? row?.SMT_Description.substring(0, 50) : ''}{row?.SMT_Description?.length > 40 ? '  . . .' : null} </>,
      sortable: true
    },
    {
      name: <p className='text-end' style={{ position: 'absolute', top: '7px', right: 0 }}>Delete</p>,
      cell: row => <>
        <div className="div" style={{ position: 'absolute', right: 4 }}>
          <Link to={'#'} onClick={() => { setSmtId(row.SMTID); setModalstatus(true) }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1  new-button" data-toggle="modal" data-target="#myModal2">
            <i className="fa fa-trash"></i>
          </Link>
        </div>
      </>
    }
  ];

  const setEditVal = (row) => {
    setSmtId(row.SMTID);
    setSMTModal(true);
  }

  const CloseModal = () => {
    setModalstatus(false); setSmtId('');
  }

  const DeleteCourtDisposition = () => {
    const val = {
      'SMTID': smtId,
      'DeletedByUserFK': ('PINID'),
    }
    AddDeleteUpadate('NameSMT_FRW/Delete_NameSMT_FRW', val).then((res) => {
      if (res) {
        toastifySuccess(res.Message);
        get_Smt_Data();
        setModalstatus(false)
        // setSmtId('');
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

  ////------------------------images-------------------------------------
  const get_Arrest_MultiImage = (smtId) => {
    const val = {
      'SMTID': smtId
    }
    fetchPostData('NameSMT_FRW/GetData_NameSMT_FRWPhoto', val)
      .then((res) => {
        console.log(res)
        if (res) { setArrestMultiImg(res); }
        else { setArrestMultiImg([]); }
      })
  }

  const get_Image_File = (e) => {
    try {
      let currentFileType = e.target.files[0].type;
      let checkPng = currentFileType.indexOf("png");
      let checkJpeg = currentFileType.indexOf("jpeg");
      let checkJpg = currentFileType.indexOf("jpg");
      if (checkPng !== -1 || checkJpeg !== -1 || checkJpg !== -1) {
        // setImage(e.target.files[0]);
        upload_Image_File(e.target.files[0]);
      } else {
        toastifyError("Error: Invalid image file!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const upload_Image_File = (image) => {
    const val = {
      'SMTID': smtId,
      'CreatedByUserFK':('PINID'),
    }
    const values = EncryptedList(JSON.stringify(val));
    var formdata = new FormData();
    formdata.append("Photo", image);
    formdata.append("Data", values);
    AddDeleteUpadate_FormData('NameSMT_FRW/InsertNameSMTFRW_Photo', formdata)
      .then((res) => {
        console.log(res)
        if (res.success) {
          get_Arrest_MultiImage(smtId)
        }
      })
      .catch(err => console.log(err))
  }

  const delete_Image_File = (e) => {
    const value = {
      'ID': ID,
      'DeletedByUserFK': ('PINID'),
    }
    AddDeleteUpadate('NameSMT_FRW/Delete_NameSMT_FRWPhoto', value).then((data) => {
      if (data.success) {
        toastifySuccess(data?.Message);
        get_Arrest_MultiImage(smtId);
        // setID('');
        setModalstatus(false);
      } else {
        toastifyError(data?.Message);
      }
    });
  }

  //---------------------> Delete Function <---------------------
  const handle_Delete = () => {
    if (ID) {
      console.log("Call")
      delete_Image_File();
    } else {
      DeleteCourtDisposition();
    }
  }

  return (
    <>
      <div className="col-md-12  pt-2">
        <div className="bg-line text-white py-1 px-2 d-flex justify-content-between align-items-center">
          <p className="p-0 m-0 d-flex align-items-center" style={{ fontSize: '18px' }}>
            SMT
          </p>
          {
          ('NameID') ?
              <Link to={'#'} onClick={() => { setSMTModal(true); reset(); setArrestMultiImg([]);setSmtId(''); }} className="btn btn-sm bg-green text-white px-2 py-0  new-button">
                <i className="fa fa-plus"></i>
              </Link>
              :
              <></>
          }
        </div>
      </div>
      {
        SMTModal ?
          <>
            <div className="row px-3">
              <div className="col-12">
                <div className="row">
                  <div className="col-12 col-md-12 col-lg-9 pt-2 " >
                    <div className="row">
                      <div className="col-12 col-md-12 col-lg-6 ">
                        <div className=" text__dropdwon">
                          <Select
                            name='SMTTypeID'
                            styles={colourStyles}
                            value={SMTType?.filter((obj) => obj.value === value?.SMTTypeID)}
                            isClearable
                            options={SMTType}
                            onChange={(e) => ChangeDropDown(e, 'SMTTypeID')}
                            placeholder="Select..."

                          />
                          <label htmlFor="" className='pt-2'>SMT Type</label>
                          {errors.SMTTypeIDErrors !== 'true' ? (
                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.SMTTypeIDErrors}</span>
                          ) : null}
                        </div>
                      </div>
                      <div className="col-12 col-md-12 col-lg-6 ">
                        <div className=" text__dropdwon">
                          <Select
                            name='SMTLocationID'
                            styles={colourStyles}
                            value={SMTLocation?.filter((obj) => obj.value === value?.SMTLocationID)}
                            isClearable
                            options={SMTLocation}
                            onChange={(e) => ChangeDropDown(e, 'SMTLocationID')}
                            placeholder="Select..."
                          />
                          <label htmlFor="" className='pt-2'>SMT Location</label>
                          {errors.SMTLocationIDErrors !== 'true' ? (
                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.SMTLocationIDErrors}</span>
                          ) : null}
                        </div>
                      </div>
                      <div className="col-12 col-md-12 col-lg-12 mt-3">
                        <div className="text-mobile">
                          <textarea name="SMT_Description" className='requiredColor' onChange={handleChange} id="SMT_Description" value={value.SMT_Description} cols="30" rows="4" required></textarea>
                          <label>Description</label>
                          {errors.SMT_DescriptionErrors !== 'true' ? (
                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.SMT_DescriptionErrors}</span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-5 col-md-4 col-lg-3 pt-3">
                    <div className="img-box" >
                      <Carousel autoPlay={true} className="carousel-style" showArrows={true} showThumbs={false} showStatus={false} >
                        {
                          arrestMultiImg.length > 0 ?
                            arrestMultiImg?.map((item, index) => (
                              <div key={index}>
                                <img src={item.Photo} style={{ height: '205px' }} />
                                <div className='box' style={{ background: 'red' }}>
                                  <a type='button' data-toggle="modal" data-target="#myModal2" className="legend-img " onClick={(e) => { setID(item.ID); setModalstatus(true) }} >
                                    <i className='fa fa-close' ></i>
                                  </a>
                                </div>
                              </div>
                            ))
                            :
                            <div key='test'>
                              <img src={defualtImage} style={{ height: '205px' }} />
                            </div>
                        }
                      </Carousel>
                    </div>
                    <div className="row">
                      {
                        smtId ?
                          <>
                            <div className="col-md-12 text-center " >
                              <label className='pers-img mt-1'> <i className='fa fa-upload'></i>
                                <input type="file" size="60" onChange={get_Image_File} />
                              </label>
                            </div>
                          </>
                          :
                          <></>
                      }
                    </div>
                  </div>
                </div>
                <div class="col-12 text-right  mt-2">
                  {
                    smtId ?
                      <button type="button" className="btn btn-lg  btn-success new-button mr-3" onClick={(e) => { check_Validation_Error(); }}>Update</button>
                      :
                      <button type="button" className="btn btn-lg  btn-success new-button mr-3" onClick={(e) => { check_Validation_Error(); }}>Save</button>
                  }
                  <button type="button" onClick={() => { setSMTModal(false); setSmtId(''); reset(); setArrestMultiImg([]); }} className="btn btn-lg  btn-success new-button ">Close</button>
                </div>
              </div>
            </div>
          </>
          :
          <>
            <div className="col-md-12 px-2 pt-2">
              <DataTable
                columns={columns}
                data={SmtData}
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
                    <button type="button" onClick={() => { handle_Delete(); }} className="btn btn-sm text-white" style={{ background: "#ef233c" }} >Delete</button>
                    {/* <button type="button" onClick={() => { DeleteCourtDisposition();  delete_Image_File(); }} className="btn btn-sm text-white" style={{ background: "#ef233c" }} >Delete</button> */}
                    <button type="button" onClick={() => { CloseModal(); }} className="btn btn-sm btn-secondary ml-2">Cancel</button>
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

export default MobileSMT