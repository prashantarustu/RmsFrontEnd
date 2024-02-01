import React, { useState } from 'react'
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Select from "react-select";
import { EditorState, ContentState, convertFromHTML } from 'draft-js';
import { convertToHTML } from 'draft-convert';
import { Decrypt_Id_Name, getShowingDateText, getShowingMonthDateYear } from '../../../../Common/Utility';
import { useEffect } from 'react';
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api';
import { CommanchangeArrayFormat_WithFilter, Comman_changeArrayFormat } from '../../../../Common/ChangeArrayFormat';
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import { useCallback } from 'react';
import DatePicker from 'react-datepicker';
import { RequiredField, Space_Allow_with_Trim } from '../../../Utility/Personnel/Validation';
import { RequiredFieldIncident } from '../../../Utility/Personnel/Validation';
import { useContext } from 'react';
import { AgencyContext } from '../../../../../Context/Agency/Index';

const Narrative_Add_Up = (props) => {

  const { LoginPinID, ArrestID, LoginAgencyID, upDateCount, ArrestNarrativeID, status, modal, setModal, NarrativeData, get_NarrativesData } = props
  const { get_Arrest_Count } = useContext(AgencyContext);
  const [Editval, setEditval] = useState();
  const [NarrativeDtTm, setNarrativeDtTm] = useState()
  const [headOfAgency, setHeadOfAgency] = useState([])
  const [narrativeTypeList, setNarrativeTypeList] = useState([])
  const [convertedContent, setConvertedContent] = useState(null);

  const [value, setValue] = useState({
    'CommentsDoc': '',
    'NarrativeComments': '',
    'NarrativeDtTm': '',
    'NarrativeTypeID': '',
    'ReportedByID': '',
    'ModifiedByUserFK': '',
    'CreatedByUserFK': '',
    'ArrestID': '',
    'ArrestNarrativeID': '',
  })
  const [errors, setErrors] = useState({
    'NarrativeDtTmError': '', 'ArrestNarrativeIDError': '', 'NarrativeCommentsError': '', 'ReportedByIDError': '',
  })

  useEffect(() => {
    if (ArrestID) {
      setValue(pre => { return { ...pre, 'ArrestID': ArrestID, 'CreatedByUserFK': LoginPinID, 'ReportedByID': LoginPinID } })
    }
  }, [ArrestID, upDateCount]);

  const [editorState, setEditorState] = useState(
    () => EditorState.createEmpty(),
  );

  useEffect(() => {
    if (ArrestNarrativeID && status) {
      GetSingleData(ArrestNarrativeID)
    }
  }, [upDateCount, ArrestNarrativeID])

  const GetSingleData = (ArrestNarrativeID) => {
    const val = { 'ArrestNarrativeID': ArrestNarrativeID }
    fetchPostData('ArrestNarrative/GetSingleData_ArrestNarrative', val)
      .then((res) => {
        if (res) setEditval(res)
        else setEditval()
      })
  }

  useEffect(() => {
    if (status) {
      setValue({
        ...value,
        "ArrestNarrativeID": ArrestNarrativeID,
        'NarrativeDtTm': Editval[0].NarrativeDtTm ? getShowingDateText(Editval[0].NarrativeDtTm) : '',
        'NarrativeTypeID': Editval[0].NarrativeTypeID,
        'ReportedByID': Editval[0].ReportedByID,
        'NarrativeComments': Editval[0].NarrativeComments,
        'ModifiedByUserFK': LoginPinID,
        'CommentsDoc': Editval[0].CommentsDoc,
      })
      setEditorState(EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(Editval[0].CommentsDoc))));
      setConvertedContent(Editval[0].CommentsDoc)
    } else {
      setValue({
        ...value,
        'NarrativeComments': '', 'CommentsDoc': '', 'ModifiedByUserFK': '', 'ArrestNarrativeID': '',
        'NarrativeDtTm': '', 'NarrativeTypeID': '',
      });
      setEditorState(() => EditorState.createEmpty(),);
      setConvertedContent()
    }
  }, [Editval])

  // Get Head of Agency
  useEffect(() => {
    if (LoginAgencyID) {
      Get_Officer_Name(LoginAgencyID);
      get_Narrative_Type(LoginAgencyID);
    }
  }, [LoginAgencyID])

  const Get_Officer_Name = (LoginAgencyID) => {
    const val = {
      AgencyID: LoginAgencyID
    }
    fetchPostData('DropDown/GetData_HeadOfAgency', val)
      .then(res => {
        if (res) {
          setHeadOfAgency(Comman_changeArrayFormat(res, 'PINID', 'HeadOfAgency'))
        } else setHeadOfAgency([])
      })
  };

  const get_Narrative_Type = () => {
    const val = {
      AgencyID: LoginAgencyID
    }
    fetchPostData('NarrativeType/GetDataDropDown_NarrativeType', val)
      .then((res) => {
        if (res) setNarrativeTypeList(Comman_changeArrayFormat(res, 'NarrativeTypeID', 'Description'))
        else setNarrativeTypeList([])
      })
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

  const ChangeDropDown = (e, name) => {
    if (e) {
      setValue({
        ...value, [name]: e.value
      })
    } else {
      setValue({
        ...value, [name]: null
      })
    }
  }

  const handleEditorChange = (state) => {
    setEditorState(state);
    convertContentToHTML();
  }

  const convertContentToHTML = () => {
    let currentContentAsHTML = convertToHTML(editorState.getCurrentContent());
    setConvertedContent(currentContentAsHTML); setValue({ ...value, 'CommentsDoc': currentContentAsHTML })
  }

  const getValueNarrative = (e) => {
    setValue({
      ...value,
      ['NarrativeComments']: e.blocks[0].text
    })
  }

  const reset = (e) => {
    setValue({
      ...value, 'NarrativeTypeID': '', 'NarrativeComments': '', 'NarrativeDtTm': '', 'CommentsDoc': '', 'ModifiedByUserFK': '', 'ArrestNarrativeID': '',
      'headOfAgencyName': '',
    });
    setErrors({
      ...errors,
      'ReportedByPinError': '', 'NarrativeDtTmError': '', 'ArrestNarrativeIDError': '', 'NarrativeCommentsError': '', 'ReportedByIDError': '',
    });
    setNarrativeDtTm('');
    setEditorState(() => EditorState.createEmpty(),);
    setConvertedContent()
  }

  const check_Validation_Error = (e) => {
    if (RequiredFieldIncident(value.NarrativeDtTm)) {
      setErrors(prevValues => { return { ...prevValues, ['NarrativeDtTmError']: RequiredFieldIncident(value.NarrativeDtTm) } })
    }
    if (RequiredFieldIncident(value.NarrativeTypeID)) {
      setErrors(prevValues => { return { ...prevValues, ['ArrestNarrativeIDError']: RequiredFieldIncident(value.NarrativeTypeID) } })
    }
    if (Space_Allow_with_Trim(value.NarrativeComments)) {
      setErrors(prevValues => { return { ...prevValues, ['NarrativeCommentsError']: Space_Allow_with_Trim(value.NarrativeComments) } })
    }
    if (RequiredFieldIncident(value.ReportedByID)) {
      setErrors(prevValues => { return { ...prevValues, ['ReportedByIDError']: RequiredFieldIncident(value.ReportedByID) } })
    }
  }

  // Check All Field Format is True Then Submit 
  const { NarrativeDtTmError, ArrestNarrativeIDError, NarrativeCommentsError, ReportedByIDError } = errors

  useEffect(() => {
    if (NarrativeDtTmError === 'true' && ArrestNarrativeIDError === 'true' && NarrativeCommentsError === 'true' && ReportedByIDError === 'true') {
      if (status) updateNarrative()
      else submit()
    }
  }, [NarrativeDtTmError, ArrestNarrativeIDError, NarrativeCommentsError, ReportedByIDError])



  const submit = () => {
    var result = NarrativeData?.find(item => {
      if (item.NarrativeComments) {
        if (item.NarrativeComments.toLowerCase() === value.NarrativeComments.toLowerCase()) {
          return true
        } else return false
      }
    }
    );
    if (result) {
      if (result) {
        toastifyError('Comments Already Exists')
        setErrors({ ...errors, ['NarrativeCommentsError']: '' })
      }
    } else {
      AddDeleteUpadate('ArrestNarrative/Insert_Narrative', value)
        .then((res) => {
          toastifySuccess(res.Message);
          get_Arrest_Count(ArrestID)
          setModal(false)
          get_NarrativesData(ArrestID);
          reset();
          setErrors({
            ['NarrativeDtTmError']: '',
          })
        })
    }
  }

  const updateNarrative = (e) => {
    var result = NarrativeData?.find(item => {
      if (item.NarrativeComments) {
        if (item.ArrestNarrativeID != value.ArrestNarrativeID) {
          if (item.NarrativeComments.toLowerCase() === value.NarrativeComments.toLowerCase()) {
            return true
          } else return false
        }
      }
    }
    );
    if (result) {
      if (result) {
        toastifyError('Code Already Exists')
        setErrors({ ...errors, ['NarrativeCommentsError']: '' })
      }
    } else {
      AddDeleteUpadate('ArrestNarrative/Update_ArrestNarrative', value)
        .then((res) => {
          toastifySuccess(res.Message)
          get_NarrativesData(ArrestID);
          setModal(false)
          reset();
          setErrors({
            ['NarrativeDtTmError']: '',
          })
        })
    }
  }

  const startRef = React.useRef();

  const onKeyDown = (e) => {
    if (e.keyCode === 9 || e.which === 9) {
      startRef.current.setOpen(false);
    }
  };

  const closeModal = () => {
    reset();
    setModal(false);
  }

  const colourStyles = {
    control: (styles) => ({
      ...styles,
      backgroundColor: "#fce9bf",
      height: 20,
      minHeight: 30,
      fontSize: 14,
      margintop: 2,
      boxShadow: 0,
    }),
  }

  return (
    <>
      {
        modal ?
          <>
            <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="NarrativeModal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="false">
              <div class="modal-dialog modal-dialog-centered modal-xl" role="document">
                <div class="modal-content">
                  <div class="modal-body">
                    <div className="m-1 ">
                      <fieldset style={{ border: '1px solid gray' }}>
                        <legend style={{ fontWeight: 'bold' }}>Narrative</legend>
                        <div className="row">
                          <div className="col-12 col-md-12 col-lg-12 ">
                            <div className="row ">
                              <div className="col-12 col-md-12 col-lg-12" style={{ marginTop: '-15px' }}>
                                <div className="text-field">
                                  <Editor
                                    editorState={editorState}
                                    onEditorStateChange={handleEditorChange}
                                    wrapperClassName="wrapper-class"
                                    editorClassName="editor-class"
                                    toolbarClassName="toolbar-class"
                                    onChange={getValueNarrative}
                                    editorStyle={{ height: '60vh' }}
                                    toolbar={{
                                      options: ['inline', 'blockType', 'fontFamily', 'list', 'history'],
                                      inline: {
                                        inDropdown: false,
                                        className: undefined,
                                        component: undefined,
                                        dropdownClassName: undefined,
                                        options: ['bold', 'italic', 'underline', 'monospace',],
                                      },
                                    }}
                                  />
                                </div>
                                {errors.NarrativeCommentsError !== 'true' ? (
                                  <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.NarrativeCommentsError}</span>
                                ) : null}
                              </div>
                            </div>
                          </div>
                          <div className="col-12 col-md-6 col-lg-4 mt-2">
                            <div className="dropdown__box">
                              <Select
                                name='ReportedByID'
                                isClearable
                                styles={colourStyles}
                                value={headOfAgency?.filter((obj) => obj.value === value?.ReportedByID)}
                                options={headOfAgency}
                                onChange={(e) => ChangeDropDown(e, 'ReportedByID')}
                                placeholder="Select.."
                                menuPlacement="top"
                              />
                              <label htmlFor="">Reported By</label>
                              {errors.ReportedByIDError !== 'true' ? (
                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ReportedByIDError}</span>
                              ) : null}
                            </div>
                          </div>
                          <div className="col-12 col-md-6 col-lg-4 mt-1">
                            <div className="dropdown__box">
                              <DatePicker
                                ref={startRef}
                                onKeyDown={onKeyDown}
                                dateFormat="MM/dd/yyyy HH:mm"
                                timeInputLabel
                                isClearable={value?.NarrativeDtTm ? true : false}
                                className='requiredColor'
                                name='NarrativeDtTm'
                                onChange={(date) => { setNarrativeDtTm(date); setValue({ ...value, ['NarrativeDtTm']: date ? getShowingMonthDateYear(date) : null }) }}
                                selected={NarrativeDtTm}
                                placeholderText={value.NarrativeDtTm ? value.NarrativeDtTm : 'Select...'}
                                showTimeSelect
                                timeIntervals={1}
                                timeCaption="Time"
                                dropdownMode="select"
                                popperPlacement="top-end"
                                maxDate={new Date()}

                              />
                              <label htmlFor="" className='pt-1'>Date/Time</label>
                              {errors.NarrativeDtTmError !== 'true' ? (
                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.NarrativeDtTmError}</span>
                              ) : null}
                            </div>
                            <div>
                            </div>
                          </div>
                          <div className="col-12 col-md-6 col-lg-4 mt-2">
                            <div className="dropdown__box">
                              <Select
                                name='NarrativeTypeID'
                                isClearable
                                styles={colourStyles}
                                value={narrativeTypeList?.filter((obj) => obj.value === value?.NarrativeTypeID)}
                                options={narrativeTypeList}
                                onChange={(e) => ChangeDropDown(e, 'NarrativeTypeID')}
                                placeholder="Select.."
                                menuPlacement="top"
                              />
                              <label htmlFor="">Narrative Type/Report Type</label>
                              {errors.ArrestNarrativeIDError !== 'true' ? (
                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ArrestNarrativeIDError}</span>
                              ) : null}
                            </div>
                          </div>
                          {/* <div className="col-4 col-md-4 col-lg-2 mt-2">
                                                        <div class="text-field">
                                                            <input type="text" name='status' disabled readOnly />
                                                            <label>Status</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-4 col-md-4 col-lg-3 mt-1">
                                                        <div class="text-field">
                                                            <input type="text" name='status' disabled readOnly />
                                                            <label>Approving Supervisior</label>
                                                        </div>
                                                    </div> */}
                          <div className="col-12 text-right mt-3 ">
                            {
                              status ?
                                <button type="button" onClick={() => check_Validation_Error()} className="btn btn-sm btn-success pl-2">Update</button>
                                :
                                <button type="button" onClick={() => check_Validation_Error()} className="btn btn-sm btn-success pl-2">Save</button>
                            }
                            <button type="button" onClick={() => { closeModal(); }} className="btn btn-sm btn-success ml-2" data-dismiss="modal">Close</button>
                          </div>
                        </div>
                      </fieldset>
                    </div>
                  </div>
                </div>
              </div>
            </div >
          </>
          :
          <>
          </>
      }
    </>
  )
}

export default Narrative_Add_Up

