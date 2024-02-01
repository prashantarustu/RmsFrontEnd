import React, { useCallback } from 'react'
import { useState } from 'react';
import Select from "react-select";
import { Decrypt_Id_Name, EncryptedList } from '../../../../Common/Utility';
import { AddDeleteUpadate_FormData, fetchPostData } from '../../../../hooks/Api';
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import { useEffect } from 'react';
import { Comman_changeArrayFormat } from '../../../../Common/ChangeArrayFormat';
import { RequiredField } from '../../../Agency/AgencyValidation/validators';
import { Space_Allow_with_Trim } from '../../../Utility/Personnel/Validation';
import { useContext } from 'react';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { useLocation } from 'react-router-dom';

const Document_Add_Up = (props) => {

  const { masterPropertyID, propertyID,updateStatus, LoginPinID, LoginAgencyID, MainIncidentID, modal, get_Documentdata, setModal, documentdata } = props
  const { get_Property_Count } = useContext(AgencyContext);

  const useQuery = () => new URLSearchParams(useLocation().search);
  let openPage = useQuery().get('page');

  const [documentDrpVal, setDocumentDropVal] = useState([]);
  const [selectedFile, setSelectedFile] = useState([]);
  const [selectedFileName, setSelectedFileName] = useState([]);

  const [value, setValue] = useState({
    'CreatedByUserFK': LoginPinID,
    'MasterPropertyID': masterPropertyID,
    'PropertyID': '',
    'DocName': '',
    'Notes': '',
    'DocTypeID': '',
    'File': '',
  })

  useEffect(() => {
    setValue({ ...value, 'CreatedByUserFK': LoginPinID, 'MasterPropertyID': masterPropertyID, 'PropertyID': propertyID })
  }, [propertyID,LoginPinID,masterPropertyID,updateStatus]);

  const [errors, setErrors] = useState({
    'DocNameError': '', 'NotesError': '', 'DocTypeIDError': '', 'File_Not_Selected': '',
  })

  const check_Validation_Error = (e) => {
    if (RequiredField(value.DocName)) {
      setErrors(prevValues => { return { ...prevValues, ['DocNameError']: RequiredField(value.DocName) } })
    }
    if (Space_Allow_with_Trim(value.Notes)) {
      setErrors(prevValues => { return { ...prevValues, ['NotesError']: Space_Allow_with_Trim(value.Notes) } })
    }
    if (RequiredField(value.DocTypeID)) {
      setErrors(prevValues => { return { ...prevValues, ['DocTypeIDError']: RequiredField(value.DocTypeID) } })
    }
    if (validate_fileupload(selectedFileName)) {
      setErrors(prevValues => { return { ...prevValues, ['File_Not_Selected']: validate_fileupload(selectedFileName) } })
    }
  }

  // Check All Field Format is True Then Submit 
  const { DocNameError, NotesError, DocTypeIDError, File_Not_Selected } = errors

  useEffect(() => {
    if (DocNameError === 'true' && NotesError === 'true' && DocTypeIDError === 'true' && File_Not_Selected === 'true') {
      Add_Document()
    }
  }, [DocNameError, NotesError, DocTypeIDError, File_Not_Selected])

  const reset = () => {
    setValue({
      ...value,
      'DocName': '',
      'Notes': '',
      'DocTypeID': '',
      'File': '',
      'selectedFileName': '',
      'File_Not_Selected': '',
      'fileName':'',
    });
    setErrors({
      ...errors,
      'fileName':'',
      'DocNameError': '', 'NotesError': '', 'DocTypeIDError': '', 'File_Not_Selected': '',
    }); setSelectedFileName('');setModal(false);
  }

  const HandleChanges = (e) => {
    setValue({
      ...value,
      [e.target.name]: e.target.value
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

  useEffect(() => {
    get_DocumentDropDwn(LoginAgencyID);
  }, [LoginAgencyID])

  const get_DocumentDropDwn = (LoginAgencyID) => {
    const val = {
      AgencyID: LoginAgencyID,
    }
    fetchPostData('DocumentType/GetDataDropDown_DocumentType', val).then((data) => {
      if (data) {
        setDocumentDropVal(Comman_changeArrayFormat(data, 'DocumentTypeID', 'Description'));
      }
      else {
        setDocumentDropVal([])
      }
    })
  };

  const changeHandler = (e) => {

    const files = e.target.files
    setSelectedFile(files)
    const nameArray = []
    for (let i = 0; i < files.length; i++) {
      nameArray.push(files[i].name)
    }
    setSelectedFileName(nameArray);

    // single file upload  <----
    // nameArray.push(files[0]?.name)
    // setSelectedFile(e.target.files[0]);
    // setSelectedFileName(nameArray)
  };

  const Add_Document = (id) => {
    var formdata = new FormData();
    // multiple file upload <----
    for (let i = 0; i < selectedFile.length; i++) {
      formdata.append("File", selectedFile[i])
      console.log(selectedFile[i])
    }

    // single file upload <---
    // formdata.append("File", selectedFile);
    const values = EncryptedList(JSON.stringify(value));
    formdata.append("Data", values);
    AddDeleteUpadate_FormData(openPage === 'masterProperty' ? 'MainMasterPropertyDocument/Insert_MainMasterPropertyDocument' : 'PropertyDocument/Insert_PropertyDocument', formdata)
      .then((res) => {
        if (res.success) {
          get_Documentdata(propertyID, masterPropertyID); 
          setErrors({ 'DocNameError': '', })
          setModal(false)
          get_Property_Count(propertyID);
          toastifySuccess(res.Message);
          reset();
          setSelectedFileName([])
          setSelectedFile([])
        } else {
          console.log("something Wrong");
        }
      })
      .catch(err => console.log(err))
  }

  const closeModal = () => {
    reset();
    setModal(false);
    setSelectedFileName([]); setSelectedFile([])
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

  const colourStyles = {
    control: (styles) => ({
      ...styles, backgroundColor: "#fce9bf",
      height: 20,
      minHeight: 30,
      fontSize: 14,
      margintop: 2,
      boxShadow: 0,
    }),
  }

  const customStylesWithOutColor = {
    control: base => ({
      ...base,
      height: 20,
      minHeight: 30,
      fontSize: 14,
      margintop: 2,
      boxShadow: 0,
    }),
  };

  const formatFileNameArray = (index) => {

    const modifieArray = [...selectedFile];

    let val = modifieArray.splice(index, 1);

    setSelectedFile(modifieArray);
    const nameArray = []
    for (let i = 0; i < modifieArray.length; i++) {
      nameArray.push(modifieArray[i].name)
    }
    setSelectedFileName(nameArray);
  }

  return (
    <>
      {
        modal ?
          <>
            <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="DocumentModal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="false">
              <div class="modal-dialog modal-dialog-centered modal-lg" role="document" >
                <div class="modal-content">
                  <div class="modal-body">
                    <div className="m-1 mt-3">
                      <fieldset style={{ border: '1px solid gray' }}>
                        <legend style={{ fontWeight: 'bold' }}>Document</legend>
                        <div className="row">
                          <div className="col-12">
                            <div className="row">
                              <div className="col-6 col-md-6 col-lg-6 ">
                                <div class="text-field">
                                  <input type="text" className="requiredColor" name="DocName" id='DocName' onChange={HandleChanges} required />
                                  <label>Document Name</label>
                                  {errors.DocNameError !== 'true' ? (
                                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DocNameError}</span>
                                  ) : null}
                                </div>
                              </div>
                              <div class="col-6 col-md-6  col-lg-6  dropdown__box">
                                <Select
                                  name='DocTypeID'
                                  styles={colourStyles}
                                  value={documentDrpVal?.filter((obj) => obj.value === value?.DocTypeID)}
                                  isClearable
                                  options={documentDrpVal}
                                  onChange={(e) => ChangeDropDown(e, 'DocTypeID')}
                                  placeholder="Select.."
                                />
                                <label htmlFor='' >Document Type</label>
                                {errors.DocTypeIDError !== 'true' ? (
                                  <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DocTypeIDError}</span>
                                ) : null}
                              </div>
                              {/* <div class="col-12 col-md-12  col-lg-12 ">
                                <div className="text-field col-12 mt-3">
                                  <input type="file" name='File' onChange={changeHandler} multiple required />
                                  <label className='mt-1'>File Attachement</label>
                                </div>
                                <div className=" col-12 mt-3">
                                  {
                                    selectedFileName ?
                                      selectedFileName?.map((data, index) => {
                                        return <>
                                          <span className=' mx-1 text-red px-2' key={index}>{data}</span>
                                        </>
                                      })
                                      :
                                      <><span className='bg-info mx-1 text-white px-2'>Please Select File..</span></>
                                  }
                                </div>
                              </div> */}
                              <div class="col-6 col-md-6  col-lg-12 mt-3">
                                <div className="text-field ">
                                  <input type="file" className='requiredColor' name='DocumentFile' onChange={changeHandler} multiple required />
                                  <label >File Attachement</label>
                                </div>
                                <div className=" col-12 mt-3">
                                  {
                                    selectedFileName ?
                                      selectedFileName?.map((data, index) => {
                                        return <>
                                          <span className='bg-info mx-1 text-white px-2' key={index}>{data}</span>
                                        </>
                                      })
                                      :
                                      <></>
                                      // <><span className='mx-1 text-danger px-2'>Please Select File..</span></>
                                  }
                                </div>
                                {errors.File_Not_Selected !== 'true' ? (
                                  <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.File_Not_Selected}</span>
                                ) : null}
                              </div>
                              <div className="col-12  col-md-12 col-lg-12 mt-1" >
                                <div className="dropdown__box">
                                  <textarea name='Notes' id="Notes" onChange={HandleChanges} cols="30" rows='3' className="form-control pt-2 pb-2  requiredColor" ></textarea>
                                  <label htmlFor="" >Notes</label>
                                  {errors.NotesError !== 'true' ? (
                                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.NotesError}</span>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </fieldset>
                    </div>
                  </div>
                  <div className="btn-box text-right mt-3 mr-1 mb-2">
                    <button type="button" class="btn btn-sm btn-success mr-1" onClick={() => { check_Validation_Error(); }}>Save</button>
                    <button type="button" data-dismiss="modal" class="btn btn-sm btn-success mr-1" onClick={closeModal} >Close</button>
                  </div>
                </div>
              </div>
            </div>
          </>
          :
          <>
          </>
      }
    </>
  )
}

export default Document_Add_Up

function validate_fileupload(fileName) {
  if (fileName.length > 0 && fileName.length < 2) {
    return 'true'; // valid file extension
  } else if (fileName.length > 1) {
    toastifyError("Please Select Single File");
  } else {
    return 'Please Select File..';
  }
  // if (fileName.length > 0 ) {
  //     return 'true'; // valid file extension
  // }
  // return 'Please Select File..';
}