import React, { useEffect, memo ,useContext } from 'react'
import { useState } from 'react';
import DataTable from 'react-data-table-component'
import DatePicker from 'react-datepicker';
import { Link } from 'react-router-dom';
import { Decrypt_Id_Name, getShowingDateText, getShowingMonthDateYear, tableCustomStyles } from '../../../../../Common/Utility';
import Select from "react-select";
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, ContentState, convertFromHTML } from 'draft-js';
import { convertToHTML } from 'draft-convert';
import { AddDeleteUpadate, fetchPostData } from '../../../../../hooks/Api';
import { toastifyError, toastifySuccess } from '../../../../../Common/AlertMsg';
import { Comman_changeArrayFormat } from '../../../../../Common/ChangeArrayFormat';
import { RequiredField, RequiredFieldIncident, Space_Allow_with_Trim } from '../../../../../Pages/Utility/Personnel/Validation';
import { AgencyContext } from '../../../../../../Context/Agency/Index';
import { ScreenPermision } from '../../../../../hooks/Api';

const MobileNarrative = () => {


    const { get_IncidentTab_Count, localStoreArray, setLocalStoreArray, get_LocalStorage, } = useContext(AgencyContext);
    const [NarrativeData, setNarrativeData] = useState([])
    const [upDateCount, setUpDateCount] = useState(0)
    const [status, setStatus] = useState(false)
    const [modal, setModal] = useState(false);
   
    const [loder, setLoder] = useState(false)
    const [narrativeID, setNarrativeID] = useState('')
    const [headOfAgency, setHeadOfAgency] = useState([])
   
    const [Editval, setEditval] = useState([]);
    const [NarrativeModal, setNarrativeModal] = useState(false)
    const [convertedContent, setConvertedContent] = useState(null);
    const [narrativeTypeList, setNarrativeTypeList] = useState([])
    const [modalStatus, setModalstatus] = useState(false)

    const [errors, setErrors] = useState({
        NarrativeTypeIDErrors: '', CommentsErrors: '', AsOfDateErrors: '', ReportedByPINActivityIDErrors: '',
    })

    const [editorState, setEditorState] = useState(
        () => EditorState.createEmpty(),
    );

    const [value, setValue] = useState({
        'IncidentID_FRW':  '',
        'Officer_Name':  '',
        'PINID':  '',
        'RMSIncidentID': '',
        'ReportedByPINActivityID': '',
        'NarrativeTypeID': '',
        'CommentsDoc': '',
        'Comments': '',
        'AsOfDate': '',
        'NarrativeID': '',
        'CreatedByUserFK': '',
    });

     //screen permission 
  const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState()
  const [LoginAgencyID, setLoginAgencyID] = useState('')
  const [incidentID, setIncidentID] = useState('')
  const [LoginPinID, setLoginPinID] = useState('');
  const [userName, setUserName] = useState('')

  const localStore = {
    Value: "",
    UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
    Key: JSON.stringify({ AgencyID: "", PINID: "", IncidentID: '', UserName: '' }),
  }

  useEffect(() => {
    if (!localStoreArray.AgencyID || !localStoreArray.PINID || !localStoreArray.UserName) {
      get_LocalStorage(localStore);
    }
  }, []);

  // Onload Function
  useEffect(() => {
    if (localStoreArray) {
      if (localStoreArray?.AgencyID && localStoreArray?.PINID) {
        setLoginAgencyID(localStoreArray?.AgencyID);
        setLoginPinID(parseInt(localStoreArray?.PINID));
        setIncidentID(localStoreArray?.IncidentID);
        setUserName(localStoreArray?.UserName)
        get_Narrative_Data(localStoreArray?.IncidentID); getScreenPermision(localStoreArray?.AgencyID, localStoreArray?.PINID);
      } else {
      }
    }
  }, [localStoreArray])
  
  useEffect(() => {
    if (incidentID) {
        setValue({ ...value, 'IncidentID_FRW': incidentID, 'CreatedByUserFK': LoginPinID, 'ReportedByPINActivityID': LoginPinID, })
    }
}, [incidentID, upDateCount]);

    // useEffect(() => {
    //     get_Narrative_Data();
    // }, []);

    useEffect(() => {
        if (narrativeID) {
            GetSingleData(narrativeID)
        }
    }, [narrativeID])

    const GetSingleData = (NarrativeID) => {
        const val = { 'NarrativeID': NarrativeID }
        fetchPostData('IncidentNarrative_FRW/GetSingleData_IncidentNarrative_FRW', val)
            .then((res) => {
                if (res) setEditval(res)
                else setEditval()
                console.log(res)
            })
    }

    useEffect(() => {
        if (Editval.length > 0) {
            // console.log(Editval)
            setValue({
                ...value,
                'AsOfDate': Editval[0].AsOfDate ? getShowingDateText(Editval[0].AsOfDate) : '',
                'IncidentID_FRW': Editval[0]?.IncidentID_FRW,
                'RMSIncidentID': Editval[0]?.RMSIncidentID,
                'NarrativeID': Editval[0].NarrativeID,
                'NarrativeTypeID': Editval[0].NarrativeTypeID,
                'ReportedByPINActivityID': Editval[0].ReportedByPINActivityID,
                'Comments': Editval[0].Comments,
                'ModifiedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
                'CommentsDoc': Editval[0].CommentsDoc,
            })
            setEditorState(EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(Editval[0].CommentsDoc))));
            setConvertedContent(Editval[0].CommentsDoc)
        } else {
            setValue({
                ...value,
                'ReportedByPINActivityID': '',
                'NarrativeTypeID': '',
                'CommentsDoc': '',
                'Comments': '',
                'AsOfDate': '',
                'NarrativeID': '',
            });
            setEditorState(() => EditorState.createEmpty());
            setConvertedContent()
        }
    }, [Editval])

    const reset = () => {
        setValue({
            ...value,
            'ReportedByPINActivityID': '', 'NarrativeTypeID': '', 'CommentsDoc': '', 'Comments': '', 'AsOfDate': '', 'NarrativeID': '',
        });
        setErrors({
            'NarrativeTypeIDErrors': '', 'CommentsErrors': '', 'AsOfDateErrors': '', 'ReportedByPINActivityIDErrors': '',
        })
        setEditorState(() => EditorState.createEmpty(),);
        setConvertedContent()
    }

    const check_Validation_Error = () => {
        if (RequiredFieldIncident(value.AsOfDate)) {
            setErrors(prevValues => { return { ...prevValues, ['AsOfDateErrors']: RequiredFieldIncident(value.AsOfDate) } })
        }
        if (Space_Allow_with_Trim(value.Comments)) {
            setErrors(prevValues => { return { ...prevValues, ['CommentsErrors']: Space_Allow_with_Trim(value.Comments) } })
        }
        if (RequiredFieldIncident(value.NarrativeTypeID)) {
            setErrors(prevValues => { return { ...prevValues, ['NarrativeTypeIDErrors']: RequiredFieldIncident(value.NarrativeTypeID) } })
        }
        if (RequiredFieldIncident(value.ReportedByPINActivityID)) {
            setErrors(prevValues => { return { ...prevValues, ['ReportedByPINActivityIDErrors']: RequiredFieldIncident(value.ReportedByPINActivityID) } })
        }
    }

    const { AsOfDateErrors, NarrativeTypeIDErrors, CommentsErrors, ReportedByPINActivityIDErrors } = errors

    useEffect(() => {
        if (AsOfDateErrors === 'true' && NarrativeTypeIDErrors === 'true' && CommentsErrors === 'true' && ReportedByPINActivityIDErrors === 'true') {
            if (narrativeID) updateNarrative()
            else submit()
        }
    }, [AsOfDateErrors, NarrativeTypeIDErrors, CommentsErrors, ReportedByPINActivityIDErrors])

    const handleEditorChange = (state) => {
        setEditorState(state);
        convertContentToHTML();
    }

    const convertContentToHTML = () => {
        let currentContentAsHTML = convertToHTML(editorState.getCurrentContent());
        setConvertedContent(currentContentAsHTML); setValue({ ...value, 'CommentsDoc': currentContentAsHTML })
    }

    const getValueNarrative = (e) => {
        console.log(e)
        setValue({
            ...value,
            ['Comments']: e.blocks[0].text
        })
    }

    //----------------------------------Drp Calling-----------------
    useEffect(() => {
        if (LoginAgencyID) {
            Get_Officer_Name(LoginAgencyID);
            get_Narrative_Type(LoginAgencyID);
        }
    }, [LoginAgencyID])

    const get_Narrative_Type = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID
        }
        fetchPostData('NarrativeType/GetDataDropDown_NarrativeType', val)
            .then((res) => {
                if (res) setNarrativeTypeList(Comman_changeArrayFormat(res, 'NarrativeTypeID', 'Description'))
                else setNarrativeTypeList([])
            })
    }

    const Get_Officer_Name = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID,
        }
        fetchPostData('DropDown/GetData_HeadOfAgency', val)
            .then(res => {
                if (res) {
                    setHeadOfAgency(Comman_changeArrayFormat(res, 'PINID', 'HeadOfAgency'))
                } else setHeadOfAgency([])
            })
    };

    //--------------------ONChange ----------------------->
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

    // <-----------------------------------------getDataList------------------------------------>

    const get_Narrative_Data = (incidentID) => {
        const val = {
            'IncidentID_FRW': incidentID,
        }
        fetchPostData('IncidentNarrative_FRW/GetData_IncidentNarrative_FRW', val).then((res) => {
            if (res) {
                // console.log(res)
                setNarrativeData(res);
            } else {
                setNarrativeData([]);
            }
        })
    }
    const getScreenPermision = (LoginAgencyID, LoginPinID) => {
        ScreenPermision("I032", LoginAgencyID, LoginPinID).then(res => {
          if (res) {
            setEffectiveScreenPermission(res)
          } else {
            setEffectiveScreenPermission([])
          }
        });
      }

    const columns = [
        {
            width: '100px',
            name: <p className='text-end' style={{ position: 'absolute', top: '7px' }}>Action</p>,
            cell: row => <>
                <Link to={'#'} onClick={() => { setEditVal(row); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1 new-button">
                    <i className="fa fa-edit"></i>
                </Link>

            </>
        },
        {
            width: '250px',
            name: 'Date/Time',
            selector: (row) => row.AsOfDate ? getShowingDateText(row.AsOfDate) : '',
            sortable: true,
        },
        {
            width: '300px',
            name: 'Narrative',
            selector: (row) => <>{row?.Comments ? row?.Comments.substring(0, 20) : ''}{row?.Comments?.length > 40 ? '  . . .' : null} </>,
            sortable: true,
        },
        {
            name: 'Type',
            selector: (row) => row.Description,
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: '7px', right: 0 }}>Delete</p>,
            cell: row => <>
                <div className="div" style={{ position: 'absolute', right: 4 }}>
                    <Link to={'#'} onClick={() => { setNarrativeID(row.NarrativeID); setModalstatus(true) }} className="btn btn-sm bg-green text-white px-1 new-button py-0 mr-1" data-toggle="modal" data-target="#myModal2">
                        <i className="fa fa-trash"></i>
                    </Link>
                </div>
            </>
        }
    ];

    const setEditVal = (row) => {
        setNarrativeID(row.NarrativeID);
        setNarrativeModal(true);
    }

    const DeleteNarratives = () => {
        const val = {
            'NarrativeID': narrativeID,
            'DeletedByUserFK':LoginPinID,
        }
        AddDeleteUpadate('IncidentNarrative_FRW/Delete_IncidentNarrative_FRW', val).then((res) => {
            if (res.success) {
                console.log("Calll")
                toastifySuccess(res.Message);
                get_Narrative_Data(incidentID);
                setModalstatus(false)
                setNarrativeID('')
            } else {
                console.log("Somthing Wrong");
            }
        })
    }
    // --------------------Add-Del-upd----------------------->
    const submit = () => {
        var result = NarrativeData?.find(item => {
            if (item.Comments) {
                if (item.Comments.toLowerCase() === value.Comments.toLowerCase()) {
                    return true
                } else return false
            }
        }
        );
        if (result) {
            if (result) {
                toastifyError('Already Exists')
                setErrors({ ...errors, ['AsOfDateErrors']: '' })
            }
        } else {
            AddDeleteUpadate('IncidentNarrative_FRW/Insert_Narrative', value)
                .then((res) => {
                    toastifySuccess(res.Message);
                    setNarrativeModal(false)
                    reset();
                    get_Narrative_Data(incidentID);
                    setNarrativeID('')
                    setErrors({
                        ['AsOfDateErrors']: '',
                    })
                })
        }
    }

    const updateNarrative = (e) => {
        var result = NarrativeData?.find(item => {
            if (item.Comments) {
                if (item.NarrativeID != value.NarrativeID) {
                    if (item.Comments.toLowerCase() === value.Comments.toLowerCase()) {
                        return true
                    } else return false
                }
            }
        }
        );
        if (result) {
            if (result) {
                toastifyError('Already Exists')
                setErrors({ ...errors, ['AsOfDateErrors']: '' })
            }
        } else {
            AddDeleteUpadate('IncidentNarrative_FRW/Update_IncidentNarrative_FRW', value)
                .then((res) => {
                    toastifySuccess(res.Message);
                    setNarrativeModal(false)
                    reset();
                    get_Narrative_Data(incidentID);
                    setNarrativeID('')
                    setErrors({ ...errors, ['AsOfDateErrors']: '' })
                })
        }
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

    const CloseModal = () => {
        setModalstatus(false)
    }
    const startRef = React.useRef();
   
    const onKeyDown = (e) => {
        if (e.keyCode === 9 || e.which === 9) {
            startRef.current.setOpen(false);
        }
    };
    return (
        <>
            <div className="col-md-12 px-0 pt-2">
                <div className="bg-line text-white py-1 px-2 d-flex justify-content-between align-items-center">
                    <p className="p-0 m-0 d-flex align-items-center" style={{ fontSize: '18px' }}>
                        Narrative
                    </p>
                    {/* {
                        sessionStorage.getItem('IncidentId') ?
                            <>
                            </>
                            :
                            <Link to={'#'} onClick={() => { setNarrativeModal(true); reset(); }} className="btn btn-sm bg-green text-white px-2 py-0 new-button">
                                <i className="fa fa-plus"></i>
                            </Link>
                    } */}
                    {/* {
                     IncidentId ? */}
                            <Link to={'#'} onClick={() => { setNarrativeModal(true); reset(); setNarrativeID('') }} className="btn btn-sm bg-green text-white px-2 py-0  new-button">
                                <i className="fa fa-plus"></i>
                            </Link>
                            {/* :
                            <></>
                    } */}
                </div>
            </div>
            {
                NarrativeModal ?
                    <>
                        <div className="row px-2">
                            <div className="col-12">
                                <div className="row mt-2">
                                    <div className="col-12 col-md-12 col-lg-12" style={{ marginTop: '-15px' }}>
                                        <div className="text-mobile">
                                            <Editor
                                                editorState={editorState}
                                                onEditorStateChange={handleEditorChange}
                                                wrapperClassName="wrapper-class"
                                                editorClassName="editor-class"
                                                toolbarClassName="toolbar-class"
                                                onChange={getValueNarrative}
                                                editorStyle={{ height: '28vh' }}
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
                                        {errors.CommentsErrors !== 'true' ? (
                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CommentsErrors}</span>
                                        ) : null}
                                    </div>
                                    <div className="col-12 col-md-6 col-lg-4 mt-2">
                                        <div className="text__dropdwon">
                                            <Select
                                                name='ReportedByPINActivityID'
                                                isClearable
                                                styles={colourStyles}
                                                value={headOfAgency?.filter((obj) => obj.value === value?.ReportedByPINActivityID)}
                                                options={headOfAgency}
                                                onChange={(e) => ChangeDropDown(e, 'ReportedByPINActivityID')}
                                                placeholder="Select.."
                                                menuPlacement="top"
                                            />
                                            <label htmlFor="" className='pt-1'>Reported By</label>
                                        </div>
                                        {errors.ReportedByPINActivityIDErrors !== 'true' ? (
                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ReportedByPINActivityIDErrors}</span>
                                        ) : null}
                                    </div>
                                    <div className="col-12 col-md-6 col-lg-4 mt-2">
                                        <div class="text__dropdwon ">
                                            <DatePicker
                                                id='AsOfDate'
                                                name='AsOfDate'
                                                ref={startRef}
                                                onKeyDown={onKeyDown}
                                                className='requiredColor pin-datepicker'
                                                dateFormat="MM/dd/yyyy HH:mm"
                                                onChange={(date) => { setValue({ ...value, ['AsOfDate']: date ? getShowingMonthDateYear(date) : null }) }}
                                                timeInputLabel
                                                isClearable={value?.AsOfDate ? true : false}
                                                placeholderText={value?.AsOfDate ? value?.AsOfDate : 'Select...'}
                                                selected={value?.AsOfDate && new Date(value?.AsOfDate)}
                                                showTimeSelect
                                                autoComplete='Off'
                                                timeIntervals={1}
                                                timeCaption="Time"
                                                dropdownMode="select"
                                                maxDate={new Date()}
                                            />
                                            <label htmlFor="" className='pt-1'>Date/Time</label>
                                        </div>
                                        {errors.AsOfDateErrors !== 'true' ? (
                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.AsOfDateErrors}</span>
                                        ) : null}
                                    </div>
                                    <div className="col-12 col-md-6 col-lg-4 mt-2">
                                        <div className="text__dropdwon">
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
                                            <label htmlFor="" className='pt-1'>Narrative Type/Report Type</label>
                                        </div>
                                        {errors.NarrativeTypeIDErrors !== 'true' ? (
                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.NarrativeTypeIDErrors}</span>
                                        ) : null}
                                    </div>
                                    <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1">
                                        <div class="text-mobile">
                                            <input type="text" className='readonlyColor' name='status' disabled readOnly />
                                            <label>Status</label>
                                        </div>
                                    </div>
                                    <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1">
                                        <div class="text-mobile">
                                            <input type="text" className='readonlyColor' name='status' disabled readOnly />
                                            <label>Approving Supervisior</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 text-right  " style={{ marginTop: '-10px' }}>
                            {
                                narrativeID ?
                                    <button type="button" className="btn btn-lg  btn-success new-button mr-3" onClick={check_Validation_Error}>Update</button>
                                    :
                                    <button type="button" className="btn btn-lg  btn-success new-button mr-3" onClick={check_Validation_Error}>Save</button>
                            }
                            <button type="button" onClick={() => { setNarrativeModal(false); setNarrativeID(''); reset(); }} className="btn btn-lg  btn-success new-button">Close</button>
                        </div>
                    </>
                    :
                    <>
                        <div className="col-md-12  pt-2">
                            <DataTable
                                columns={columns}
                                data={NarrativeData}
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
                        <div class="modal-dialog modal-dialog-centered">
                            <div class="modal-content">
                                <div className="box text-center py-5">
                                    <h5 className="modal-title mt-2" id="exampleModalLabel">Do you want to Delete ?</h5>
                                    <div className="btn-box mt-3">
                                        <button type="button" onClick={DeleteNarratives} className="btn btn-sm text-white" style={{ background: "#ef233c" }} >Delete</button>
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

export default memo(MobileNarrative)
