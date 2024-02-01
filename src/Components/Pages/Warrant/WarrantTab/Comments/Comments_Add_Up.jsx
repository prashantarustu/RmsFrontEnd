import React, { useContext, useState } from 'react'
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Select from "react-select";
import { EditorState, ContentState, convertFromHTML } from 'draft-js';
import { convertToHTML } from 'draft-convert';
import { Decrypt_Id_Name, getShowingMonthDateYear } from '../../../../Common/Utility';
import { useEffect } from 'react';
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api';
import { CommanchangeArrayFormat_WithFilter, Comman_changeArrayFormat } from '../../../../Common/ChangeArrayFormat';
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import { useCallback } from 'react';
// import { RequiredField } from '../../../Utility/Personnel/Validation';
import { RequiredField, RequiredFieldIncident, SpaceCheck, Space_Allow_with_Trim } from '../../../Utility/Personnel/Validation';
import { AgencyContext } from '../../../../../Context/Agency/Index';

const Comments_Add_Up = (props) => {

    const { userName, upDateCount, WarrantCommentsID, status, modal, setModal, get_CommentsData, CommentData, LoginPinID, LoginAgencyID, WarrantID, MainIncidentID } = props

    const { get_Warrent_Count } = useContext(AgencyContext)

    const [value, setValue] = useState({
        'CommentsDoc': '',
        'WarrantID': '',
        'WarrantCommentsID': '',
        'ModifiedByUserFK': '',
        'OfficerName': '',
        'CreatedByUserFK': '',
        'OfficerID': '',
        'AdminOfficer': '',
        // 'OfficerID': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
        // 'AdminOfficer': Decrypt_Id_Name(localStorage.getItem('UserName'), 'UForUserName'),
    })

    useEffect(() => {
        setValue({ ...value, 'WarrantID': WarrantID, 'OfficerName': userName, 'OfficerID': LoginPinID, 'CreatedByUserFK': LoginPinID, })
    }, [WarrantID,upDateCount]);

    const [errors, setErrors] = useState({
        'CommentsError': '',
    })

    const [Editval, setEditval] = useState();
    const [headOfAgency, setHeadOfAgency] = useState([])
    const [convertedContent, setConvertedContent] = useState(null);

    const [editorState, setEditorState] = useState(
        () => EditorState.createEmpty(),
    );

    useEffect(() => {
        Get_Officer_Name(LoginAgencyID);
    }, [LoginAgencyID])

    useEffect(() => {
        if (WarrantCommentsID && status) {
            GetSingleData(WarrantCommentsID)
        }
    }, [upDateCount, WarrantCommentsID])

    const GetSingleData = (WarrantCommentsID) => {
        const val = { 'WarrantCommentsID': WarrantCommentsID }
        fetchPostData('WarrantComments/GetSingleData_WarrantComments', val)
            .then((res) => {
                if (res) setEditval(res)
                else setEditval([])
            })
    }

    useEffect(() => {
        if (status) {
            setValue({
                ...value,
                'OfficerID': Editval[0].OfficerID,
                // 'OfficerName': Editval[0]?.OfficerID ? CommanchangeArrayFormat_WithFilter(Editval, 'OfficerID', headOfAgency) : '',
                'OfficerName': userName,
                'Comments': Editval[0].Comments,
                'ModifiedByUserFK': LoginPinID,
                'CommentsDoc': Editval[0].CommentsDoc,
                'WarrantCommentsID': Editval[0].WarrantCommentsID,
            })
            setEditorState(EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(Editval[0].CommentsDoc))));
            setConvertedContent(Editval[0].CommentsDoc)
        } else {
            setValue({
                ...value,
                'Comments': '', 'CommentsDoc': '', 'ModifiedByUserFK': '', 'WarrantCommentsID': '',
            });
            setEditorState(() => EditorState.createEmpty(),);
            setConvertedContent()
        }
    }, [Editval])

    const reset = (e) => {
        setValue({
            ...value,
            'Comments': '', 'CommentsDoc': '', 'ModifiedByUserFK': '', 'WarrantCommentsID': '',
        });
        setErrors({
            'CommentsError': '',
        });
        setEditorState(() => EditorState.createEmpty(),);
        setConvertedContent()
    }

    // const check_Validation_Error = (e) => {
    //     if (Space_Allow_with_Trim(value.Comments)) {
    //         setErrors(prevValues => { return { ...prevValues, ['CommentsError']: Space_Allow_with_Trim(value.Comments) } })
    //     }
    // }
    const check_Validation_Error = (e) => {
        if (RequiredFieldIncident(value.OfficerID)) {
            setErrors(prevValues => { return { ...prevValues, ['officerIdError']: RequiredFieldIncident(value.OfficerID) } })
        }
        if (Space_Allow_with_Trim(value.Comments)) {
            setErrors(prevValues => { return { ...prevValues, ['CommentsError']: Space_Allow_with_Trim(value.Comments) } })
        }
    }
    // Check All Field Format is True Then Submit 
    const { CommentsError } = errors
    useEffect(() => {
        if (CommentsError === 'true') {
            if (status)
                updateComments()
            else submit()
        }
    }, [CommentsError])

    // Get Head of Agency
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

    const handlChanges_Drop = (e, name) => {
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
                setErrors({ ...errors, ['CommentsError']: '' })
            }
        } else {
            AddDeleteUpadate('WarrantComments/Insert_WarrantComments', value)
                .then((res) => {
                    console.log(res)
                    toastifySuccess(res.Message);
                    get_Warrent_Count(WarrantID);
                    setModal(false)
                    get_CommentsData(WarrantID);
                    setModal(false)
                    reset();
                })
        }
    }

    const updateComments = (e) => {
        var result = CommentData?.find(item => {
            if (item.Comments) {
                if (item.WarrantCommentsID != value.WarrantCommentsID) {
                    if (item.Comments.toLowerCase() === value.Comments.toLowerCase()) {
                        return true
                    } else return false
                }
            }
        });
        if (result) {
            if (result) {
                toastifyError('Code Already Exists')
                setErrors({ ...errors, ['CommentsError']: '' })
            }
        } else {
            AddDeleteUpadate('WarrantComments/Update_WarrantComments', value)
                .then((res) => {
                    toastifySuccess(res.Message)
                    get_CommentsData(WarrantID);
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
                                                            {/* <div className="col-5 col-md-5 col-lg-2 pt-2">
                                                    <div className="img-box" >
                                                        <label className="picture" tabIndex="0">
                                                            <span className="picture__image"></span>
                                                        </label>
                                                        <input type="file" name="picture__input" id="picture__input" />
                                                    </div>
                                                </div> */}
                                                        </div>
                                                    </div>
                                                    {/* <div className="col-12 col-md-6 col-lg-4 pt-2 dropdown__box">
                                                        {
                                                            value?.OfficerName ?
                                                                <Select
                                                                    name='OfficerID'
                                                                    isClearable
                                                                    defaultValue={value?.OfficerName}
                                                                    options={headOfAgency}
                                                                    onChange={(e) => handlChanges_Drop(e, 'OfficerID')}
                                                                    placeholder="Select.."
                                                                />
                                                                :
                                                                <>
                                                                    <Select
                                                                        name='OfficerID'
                                                                        isClearable
                                                                        options={headOfAgency}
                                                                        onChange={(e) => handlChanges_Drop(e, 'OfficerID')}
                                                                        placeholder="Select.."
                                                                    />
                                                                </>
                                                        }
                                                        <label htmlFor="" className='pt-2'>Officer</label>
                                                    </div> */}
                                                    {/* <div className="col-4 col-md-4 col-lg-6 mt-4">
                                                        <div class="text-field">
                                                            <input type="text" name='OfficerName' value={value.OfficerName} disabled readOnly />
                                                            <label>Officer Name</label>
                                                        </div>
                                                    </div> */}
                                                    <div className="col-12 col-md-6 col-lg-3 mt-2 ">
                                                        <div className="dropdown__box">
                                                            <Select
                                                                name='OfficerID'
                                                                styles={colourStyles}
                                                                value={headOfAgency?.filter((obj) => obj.value === value?.OfficerID)}
                                                                options={headOfAgency}
                                                                onChange={(e) => handlChanges_Drop(e, 'OfficerID')}
                                                                placeholder="Select.."
                                                                menuPlacement="top"
                                                                isClearable
                                                            />
                                                            <label htmlFor="">Officer Name</label>
                                                            {errors.officerIdError !== 'true' ? (
                                                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.officerIdError}</span>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-md-6 col-lg-9 text-right mt-4 pt-2">
                                                        {
                                                            status ?
                                                                <button type="button" onClick={() => check_Validation_Error()} className="btn btn-sm btn-success pl-2">Update</button>
                                                                :
                                                                <button type="button" onClick={() => { check_Validation_Error(); }} className="btn btn-sm btn-success pl-2">Save</button>
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

