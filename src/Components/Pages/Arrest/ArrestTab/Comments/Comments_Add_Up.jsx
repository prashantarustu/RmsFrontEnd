import React, { useState } from 'react'
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, ContentState, convertFromHTML } from 'draft-js';
import { convertToHTML } from 'draft-convert';
import { Decrypt_Id_Name } from '../../../../Common/Utility';
import { useEffect } from 'react';
import Select from "react-select";
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api';
import { CommanchangeArrayFormat_WithFilter, Comman_changeArrayFormat } from '../../../../Common/ChangeArrayFormat';
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import { useCallback } from 'react';
import { RequiredFieldSpaceNotAllow } from '../../../Agency/AgencyValidation/validators';
import { RequiredFieldIncident, Space_Allow_with_Trim } from '../../../Utility/Personnel/Validation';
import { useContext } from 'react';
import { AgencyContext } from '../../../../../Context/Agency/Index';

const Comments_Add_Up = (props) => {

    const { upDateCount, ArrestCommentsID, status, modal, setModal, get_CommentsData, CommentData, LoginPinID, ArrestID, LoginAgencyID, } = props
    const { get_Arrest_Count } = useContext(AgencyContext)

    const [Editval, setEditval] = useState();
    const [headOfAgency, setHeadOfAgency] = useState([])
    const [convertedContent, setConvertedContent] = useState(null);
    const [value, setValue] = useState({
        'CommentsDoc': '',
        'ArrestID': '',
        'Comments': '',
        'CreatedByUserFK': '',
        'ModifiedByUserFK': '',
        'OfficerID': '',
        'AdminOfficer': '',
        'ArrestCommentsID': "",
    })

    const [errors, setErrors] = useState({
        'CommentsError': '', 'OfficerIDError': '',
    })

    useEffect(() => {
        if (ArrestID) setValue(pre => { return { ...pre, 'ArrestID': ArrestID, 'CreatedByUserFK': LoginPinID, 'OfficerID': LoginPinID, } })
    }, [ArrestID, upDateCount]);

    const [editorState, setEditorState] = useState(
        () => EditorState.createEmpty(),
    );

    useEffect(() => {
        if (LoginAgencyID) {
            Get_Officer_Name(LoginAgencyID);
        }
    }, [LoginAgencyID])

    useEffect(() => {
        if (ArrestCommentsID && status) {
            GetSingleData(ArrestCommentsID)
        }
    }, [upDateCount, ArrestCommentsID])

    const GetSingleData = (ArrestCommentsID) => {
        const val = { 'ArrestCommentsID': ArrestCommentsID }
        fetchPostData('ArrestComments/GetSingleData_ArrestComments', val)
            .then((res) => {
                if (res) setEditval(res)
                else setEditval([])
            })
    }

    useEffect(() => {
        if (status) {
            setValue({
                ...value,
                'ArrestCommentsID': ArrestCommentsID,
                'OfficerID': Editval[0].OfficerID,
                // 'OfficerName': Editval[0]?.OfficerId ? CommanchangeArrayFormat_WithFilter(Editval, 'OfficerId', headOfAgency) : '',
                'Comments': Editval[0].Comments,
                'ModifiedByUserFK': LoginPinID,
                'CommentsDoc': Editval[0].CommentsDoc,
            })
            setEditorState(EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(Editval[0].CommentsDoc))));
            setConvertedContent(Editval[0].CommentsDoc)
        } else {
            setValue({
                ...value,
                'Comments': '', 'CommentsDoc': '', 'ModifiedByUserFK': '', 'ArrestCommentsID': '',
            });
            setEditorState(() => EditorState.createEmpty(),);
            setConvertedContent()
        }
    }, [Editval])

    const reset = (e) => {
        setValue({
            ...value,
            'Comments': '', 'CommentsDoc': '', 'ModifiedByUserFK': '', 'ArrestCommentsID': '',
        });
        setErrors({
            ...errors,
            'CommentsError': '', 'OfficerIDError': '',
        });
        setEditorState(() => EditorState.createEmpty(),);
        setConvertedContent()
    }

    const check_Validation_Error = (e) => {
        if (Space_Allow_with_Trim(value.Comments)) {
            setErrors(prevValues => { return { ...prevValues, ['CommentsError']: Space_Allow_with_Trim(value.Comments) } })
        }
        if (RequiredFieldIncident(value.OfficerID)) {
            setErrors(prevValues => { return { ...prevValues, ['OfficerIDError']: RequiredFieldIncident(value.OfficerID) } })
        }
    }

    // Check All Field Format is True Then Submit 
    const { CommentsError, OfficerIDError } = errors

    useEffect(() => {
        if (CommentsError === 'true' && OfficerIDError === 'true') {
            if (status) { updateComments() }
            else { submit() }
        }
    }, [CommentsError, OfficerIDError])

    // Get Head of Agency
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
        })
    }

    const submit = (e) => {
        var result = CommentData?.find(item => {
            if (item.Comments) {
                if (item.Comments.toLowerCase() === value.Comments.toLowerCase()) {
                    return true
                } else return false
            }
        }
        );
        if (result) {
            if (result) {
                toastifyError('Comments Already Exists')
                setErrors({ ...errors, ['CommentsError']: '', })
            }
        } else {
            AddDeleteUpadate('ArrestComments/Insert_ArrestComments', value)
                .then((res) => {
                    toastifySuccess(res.Message);
                    get_Arrest_Count(ArrestID);
                    setModal(false)
                    get_CommentsData(ArrestID);
                    reset();
                })
        }
    }

    const updateComments = (e) => {
        var result = CommentData?.find(item => {
            if (item.Comments) {
                if (item.ArrestCommentsID != value.ArrestCommentsID) {
                    if (item.Comments.toLowerCase() === value.Comments.toLowerCase()) {
                        return true
                    } else return false
                }
            }
        });
        if (result) {
            if (result) {
                toastifyError('Code Already Exists')
                setErrors({ ...errors, ['NarrativeCommentsError']: '' })
            }
        } else {
            AddDeleteUpadate('ArrestComments/Update_ArrestComments', value)
                .then((res) => {
                    toastifySuccess(res.Message)
                    get_CommentsData(ArrestID);
                    setModal(false)
                    reset();
                })
        }
    }

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
                        <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="CommentsModal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="false">
                            <div class="modal-dialog modal-dialog-centered modal-xl" role="document">
                                <div class="modal-content">
                                    <div class="modal-body">
                                        <div className="m-1 mt-3">
                                            <fieldset style={{ border: '1px solid gray' }}>
                                                <div className="row ">
                                                    <div className="col-12 col-md-12 col-lg-12 ">
                                                        <div className="row ">
                                                            <div className="col-12 col-md-12 col-lg-12">
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
                                                                {errors.CommentsError !== 'true' ? (
                                                                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CommentsError}</span>
                                                                ) : null}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-md-6 col-lg-4 mt-2">
                                                        <div className="dropdown__box">
                                                            <Select
                                                                name='OfficerID'
                                                                isClearable
                                                                styles={colourStyles}
                                                                value={headOfAgency?.filter((obj) => obj.value === value?.OfficerID)}
                                                                options={headOfAgency}
                                                                onChange={(e) => ChangeDropDown(e, 'OfficerID')}
                                                                placeholder="Select.."
                                                                menuPlacement="top"
                                                            />
                                                            <label htmlFor="">Reported By</label>
                                                            {errors.OfficerIDError !== 'true' ? (
                                                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.OfficerIDError}</span>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                    {/* <div className="col-4 col-md-4 col-lg-6 mt-4">
                                                        <div class="text-field">
                                                            <input type="text" name='AdminOfficer' value={value.AdminOfficer} disabled readOnly />
                                                            <label>Officer Name</label>
                                                        </div>
                                                    </div> */}
                                                    <div className="col-12 col-md-6 col-lg-8 text-right mt-4 pt-2">
                                                        {
                                                            status ?
                                                                <button type="button" onClick={() => check_Validation_Error()} className="btn btn-sm btn-success pl-2">Update</button>
                                                                :
                                                                <button type="button" onClick={(e) => { check_Validation_Error(); }} className="btn btn-sm btn-success pl-2">Save</button>
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

export default Comments_Add_Up

