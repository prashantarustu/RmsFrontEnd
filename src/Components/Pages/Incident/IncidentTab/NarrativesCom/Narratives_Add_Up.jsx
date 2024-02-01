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

const Narrative_Add_Up = ({ incidentReportedDate, userName, LoginPinID, incidentID, LoginAgencyID, upDateCount, narrativeID, status, modal, setModal, NarrativeData, get_NarrativesData }) => {

    const { get_IncidentTab_Count, } = useContext(AgencyContext)

    const [value, setValue] = useState({
        'CommentsDoc': '',
        'IncidentId': '',
        'NarrativeID': '',
        'Comments': '',
        'ReportedByPINActivityID': '',
        'AsOfDate': null,
        'NarrativeTypeID': '',
        // 'AdminOfficer': '',
        'CreatedByUserFK': '',
        'ModifiedByUserFK': '',
    })

    const [errors, setErrors] = useState({
        'ReportedByPinError': '', 'AsOfDateError': '', 'NarrativeIDError': '', 'CommentsError': '',
    })

    const [Editval, setEditval] = useState();
    const [headOfAgency, setHeadOfAgency] = useState([])
    const [narrativeTypeList, setNarrativeTypeList] = useState([])
    const [convertedContent, setConvertedContent] = useState(null);

    const [editorState, setEditorState] = useState(
        () => EditorState.createEmpty(),
    );

    useEffect(() => {
        if (incidentID) {
            setValue({ ...value, 'IncidentId': incidentID, 'CreatedByUserFK': LoginPinID, 'ReportedByPINActivityID': LoginPinID, })
        }
    }, [incidentID, upDateCount]);

    // Get Head of Agency
    useEffect(() => {
        if (LoginAgencyID) {
            Get_Officer_Name(LoginAgencyID);
            get_Narrative_Type(LoginAgencyID);
        }
    }, [LoginAgencyID])

    useEffect(() => {
        if (narrativeID && status) {
            GetSingleData(narrativeID)
        }
    }, [upDateCount, narrativeID])

    const GetSingleData = (NarrativeID) => {
        const val = { 'NarrativeID': NarrativeID }
        fetchPostData('Narrative/GetSingleData_Narrative', val)
            .then((res) => {
                if (res) setEditval(res)
                else setEditval()
            })
    }

    useEffect(() => {
        if (status) {
            setValue({
                ...value,
                'OfficerId': Editval[0].OfficerId,
                // 'AdminOfficer': Editval[0]?.AdminOfficer ? CommanchangeArrayFormat_WithFilter(Editval, 'AdminOfficer', headOfAgency) : '',
                'AsOfDate': Editval[0].AsOfDate ? getShowingDateText(Editval[0].AsOfDate) : null,
                'NarrativeID': Editval[0].NarrativeID,
                'NarrativeTypeID': Editval[0].NarrativeTypeID,
                'ReportedByPINActivityID': Editval[0].ReportedByPINActivityID,
                'Comments': Editval[0].Comments,
                'ModifiedByUserFK': LoginPinID,
                'CommentsDoc': Editval[0].CommentsDoc,
            })
            setEditorState(EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(Editval[0].CommentsDoc))));
            setConvertedContent(Editval[0].CommentsDoc)
        } else {
            setValue({
                ...value,
                'Comments': '', 'CommentsDoc': '', 'ModifiedByUserFK': '', 'NarrativeID': '',
                'NarrativeTypeID': '', 'AsOfDate': null,
            });
            setEditorState(() => EditorState.createEmpty(),);
            setConvertedContent()
        }
    }, [Editval])

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

    const get_Narrative_Type = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID,
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
            ['Comments']: e.blocks[0].text
        });
    }

    const submit = () => {
        var result = NarrativeData?.find(item => {
            if (item.Comments) {
                if (item.Comments.toLowerCase() === value.Comments.toLowerCase()) {
                    return true
                } else return false
            }
        });
        if (result) {
            if (result) {
                toastifyError(' Already Exists');
                setErrors({ ...errors, ['AsOfDateError']: '' })
            }
        } else {
            AddDeleteUpadate('Narrative/Insert_Narrative', value)
                .then((res) => {
                    get_NarrativesData(incidentID);
                    get_IncidentTab_Count(incidentID);
                    toastifySuccess(res.Message);
                    setModal(false);
                    reset();
                    setErrors({ ...errors, ['AsOfDateError']: '', });
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
                toastifyError('Comments Already Exists')
                setErrors({ ...errors, ['AsOfDateError']: '' })
            }
        } else {
            AddDeleteUpadate('Narrative/Update_Narrative', value)
                .then((res) => {
                    toastifySuccess(res.Message)
                    setModal(false)
                    reset();
                    setErrors({ ...errors, ['AsOfDateError']: '', });
                    get_NarrativesData(incidentID);
                })
        }
    }

    const reset = (e) => {
        setValue({
            ...value,
            'NarrativeTypeID': '', 'Comments': '', 'CommentsDoc': '', 'ModifiedByUserFK': '', 'NarrativeID': '', 'AsOfDate': null,
        });
        setErrors({
            ...errors,
            'ReportedByPinError': '', 'AsOfDateError': '', 'NarrativeIDError': '', 'CommentsError': '',
        });
        setEditorState(() => EditorState.createEmpty(),);
        setConvertedContent()
    }

    const check_Validation_Error = (e) => {
        if (RequiredFieldIncident(value.ReportedByPINActivityID)) {
            setErrors(prevValues => { return { ...prevValues, ['ReportedByPinError']: RequiredFieldIncident(value.ReportedByPINActivityID) } })
        }
        if (RequiredFieldIncident(value.AsOfDate)) {
            setErrors(prevValues => { return { ...prevValues, ['AsOfDateError']: RequiredFieldIncident(value.AsOfDate) } })
        }
        if (RequiredFieldIncident(value.NarrativeTypeID)) {
            setErrors(prevValues => { return { ...prevValues, ['NarrativeIDError']: RequiredFieldIncident(value.NarrativeTypeID) } })
        }
        if (Space_Allow_with_Trim(value.Comments)) {
            setErrors(prevValues => { return { ...prevValues, ['CommentsError']: Space_Allow_with_Trim(value.Comments) } })
        }
    }

    // Check All Field Format is True Then Submit 
    const { ReportedByPinError, AsOfDateError, NarrativeIDError, CommentsError, } = errors

    useEffect(() => {
        if (ReportedByPinError === 'true' && AsOfDateError === 'true' && NarrativeIDError === 'true' && CommentsError === 'true') {
            if (status) updateNarrative()
            else submit()
        }
    }, [ReportedByPinError, AsOfDateError, NarrativeIDError, CommentsError,])

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
                                                <div className="row ">
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
                                                                        editorStyle={{ height: '55vh' }}
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
                                                                {errors.CommentsError !== 'true' ? (
                                                                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CommentsError}</span>
                                                                ) : null}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-md-6 col-lg-3 mt-2">
                                                        <div className="dropdown__box">
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
                                                            <label htmlFor="">Officer Name</label>
                                                            {errors.ReportedByPinError !== 'true' ? (
                                                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ReportedByPinError}</span>
                                                            ) : null}
                                                        </div>
                                                        {/* <div class="text-field">
                                                            <input type="text" name='AdminOfficer' value={value?.AdminOfficer} disabled readOnly />
                                                            <label>Officer Name</label>
                                                        </div> */}
                                                    </div>
                                                    <div className="col-12 col-md-6 col-lg-4 mt-3 date__box">
                                                        <div className="">
                                                            <DatePicker
                                                                ref={startRef}
                                                                onKeyDown={onKeyDown}
                                                                dateFormat="MM/dd/yyyy HH:mm"
                                                                timeInputLabel
                                                                isClearable={value?.AsOfDate ? true : false}
                                                                className='requiredColor'
                                                                name='AsOfDate'
                                                                onChange={(date) => { setValue({ ...value, ['AsOfDate']: date ? getShowingMonthDateYear(date) : null }) }}
                                                                selected={value?.AsOfDate && new Date(value?.AsOfDate)}
                                                                placeholderText={'Select...'}
                                                                showTimeSelect
                                                                timeIntervals={1}
                                                                timeCaption="Time"
                                                                popperPlacement="top-end"
                                                                maxDate={new Date()}
                                                                // minDate={new Date(incidentReportedDate)}
                                                                autoComplete="Off"
                                                                showMonthDropdown
                                                                showYearDropdown
                                                                dropdownMode="select"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label htmlFor="">Date/Time</label>
                                                            {errors.AsOfDateError !== 'true' ? (
                                                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.AsOfDateError}</span>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-md-6 col-lg-3 mt-1">
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
                                                            {errors.NarrativeIDError !== 'true' ? (
                                                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.NarrativeIDError}</span>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                    <div className="col-4 col-md-4 col-lg-2 mt-2">
                                                        <div class="text-field">
                                                            <input type="text" className='readonlyColor' name='status' disabled readOnly />
                                                            <label>Status</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-4 col-md-4 col-lg-3 mt-2">
                                                        <div class="text-field">
                                                            <input type="text" className='readonlyColor' name='status' disabled readOnly />
                                                            <label>Approving Supervisior</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-md-12 col-lg-9 text-right mt-3 pt-1 ">
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

