import React, { useEffect, useContext,memo } from 'react'
import { useState } from 'react';
import DataTable from 'react-data-table-component'
import DatePicker from 'react-datepicker';
import { Link } from 'react-router-dom';
import { Decrypt_Id_Name, getShowingDateText, tableCustomStyles } from '../../../../../Common/Utility';
import Select from "react-select";
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, ContentState, convertFromHTML } from 'draft-js';
import { convertToHTML } from 'draft-convert';
import { AddDeleteUpadate, fetchPostData } from '../../../../../hooks/Api';
import { toastifyError, toastifySuccess } from '../../../../../Common/AlertMsg';
import DeletePopUpModal from '../../../../../Common/DeleteModal';
import { RequiredFieldIncident, Space_Allow_with_Trim } from '../../../../../Pages/Utility/Personnel/Validation';
import { AgencyContext } from '../../../../../../Context/Agency/Index';
import {  ScreenPermision } from '../../../../../hooks/Api';


const MobileComments = () => {
    
    const [Editval, setEditval] = useState([]);
    const [CommentsModal, setCommentsModal] = useState(false)
    const [convertedContent, setConvertedContent] = useState(null);
    const [modalStatus, setModalstatus] = useState(false)

    const { get_IncidentTab_Count, localStoreArray, setLocalStoreArray, get_LocalStorage, } = useContext(AgencyContext);

  const [CommentData, setCommentData] = useState([])
  const [CommentID, setCommentID] = useState('')
  const [upDateCount, setUpDateCount] = useState(0)
  const [status, setStatus] = useState(false)
  const [modal, setModal] = useState(false);
  const [loder, setLoder] = useState(false)

  //screen permission 
  const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState();

  const [LoginAgencyID, setLoginAgencyID] = useState('')
  const [incidentID, setIncidentID] = useState('')
  const [LoginPinID, setLoginPinID] = useState('');
  const [userName, setUserName] = useState('')

  const [errors, setErrors] = useState({
    'CommentsError': '',
})

const [editorState, setEditorState] = useState(
    () => EditorState.createEmpty(),
);
const [value, setValue] = useState({
    'IncidentID_FRW':  '',
    // 'RMSIncidentID': RMSIncidentId,
    // 'RMSIncidentID': '',
    'CommentsDoc': '',
    'Comments': '',
    'CommentID': '',
    'Officer_Name': '',
    'PINID': '',
    'OfficerId': '',
    'CreatedByUserFK': '',
});

  const localStore = {
    Value: "",
    UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
    Key: JSON.stringify({ AgencyID: "", PINID: "", IncidentID: '', UserName: '' }),
  }

  useEffect(() => {
    if (!localStoreArray.AgencyID || !localStoreArray.PINID || !localStoreArray?.IncidentID) {
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
        get_Comments_Data(localStoreArray?.IncidentID);
      }
    }
  }, [localStoreArray])

//   const get_CommentsData = (incidentID) => {
//     const val = {
//       IncidentId: incidentID
//     }
//     fetchPostData('IncidentComments/GetData_Comemnts', val).then(res => {
//       if (res) {
//         setCommentData(res); setLoder(true)
//       } else {
//         setCommentData([]); setLoder(true)
//       }
//     })
//   }

  const getScreenPermision = (LoginAgencyID, LoginPinID) => {
    ScreenPermision("I033", LoginAgencyID, LoginPinID).then(res => {
      if (res) {
        setEffectiveScreenPermission(res)
      } else {
        setEffectiveScreenPermission([])
      }
    });
  }

    useEffect(() => {
        if (incidentID) {
            setValue({ ...value, 'OfficerId': LoginPinID, 'IncidentID_FRW': incidentID, 'CreatedByUserFK': LoginPinID, })
        }
    }, [incidentID, upDateCount]);

    useEffect(() => {
        if (CommentID) {
            GetSingleData(CommentID)
        }
    }, [CommentID])

    const GetSingleData = (CommentID) => {
        const val = { 'CommentID': CommentID }
        fetchPostData('IncidentComments_FRW/GetSingleData_IncidentComments_FRW', val)
            .then((res) => {
                if (res) setEditval(res)
                else setEditval()
            })
    }

    useEffect(() => {
        if (Editval.length > 0) {
            setValue({
                ...value,
                'IncidentID_FRW': Editval[0]?.IncidentID_FRW, 'RMSIncidentID': Editval[0]?.RMSIncidentID, 'CommentID': Editval[0].CommentID, 'Comments': Editval[0].Comments,
                'ModifiedByUserFK': LoginPinID, 'CommentsDoc': Editval[0].CommentsDoc,
            })
            setEditorState(EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(Editval[0].CommentsDoc))));
            setConvertedContent(Editval[0].CommentsDoc)
        } else {
            setValue({
                ...value,
                'CommentsDoc': '', 'Comments': '', 'CommentID': '',
            });
            setEditorState(() => EditorState.createEmpty());
            setConvertedContent()
        }
    }, [Editval])

    const reset = () => {
        setValue({
            ...value,
            'CommentsDoc': '', 'Comments': '', 'CommentID': '',
        });
        setErrors({
            'CommentsError': '',
        });
        setEditorState(() => EditorState.createEmpty(),);
        setConvertedContent()
    }

    const check_Validation_Error = (e) => {
        if (Space_Allow_with_Trim(value.Comments)) {
            setErrors(prevValues => { return { ...prevValues, ['CommentsError']: Space_Allow_with_Trim(value.Comments) } })
        }
    }
    // Check All Field Format is True Then Submit 
    const { CommentsError } = errors

    useEffect(() => {
        if (CommentsError === 'true') {
            if (CommentID) updateComment()
            else submit()
        }
    }, [CommentsError])

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

    // <-----------------------------------------getDataList------------------------------------>

    const get_Comments_Data = (incidentID) => {
        const val = {
            'IncidentID_FRW':  incidentID,
        }
        fetchPostData('IncidentComments_FRW/GetData_IncidentComments_FRW', val).then((res) => {
            if (res) {
                setCommentData(res);
            } else {
                setCommentData([]);
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
            name: 'Date',
            selector: (row) => getShowingDateText(row.getShowingDateText),
            sortable: true
        },
        {
            name: 'Comments',
            selector: (row) => <>{row?.Comments ? row?.Comments.substring(0, 20) : ''}{row?.Comments?.length > 40 ? '  . . .' : null} </>,
            sortable: true,
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: '7px', right: 0 }}>Delete</p>,
            cell: row => <>
                <div className="div" style={{ position: 'absolute', right: 4 }}>
                    <Link to={'#'} onClick={() => { setCommentID(row.CommentID); setModalstatus(true) }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1 new-button" data-toggle="modal" data-target="#myModal2">
                        <i className="fa fa-trash"></i>
                    </Link>
                </div>
            </>
        }
    ];

    const setEditVal = (row) => {
        setCommentID(row.CommentID);
        setCommentsModal(true);
    }

    const DeleteComment = () => {
        const val = {
            'CommentID': CommentID,
            'DeletedByUserFK': LoginPinID,
        }
        AddDeleteUpadate('IncidentComments_FRW/Delete_IncidentComments_FRW', val).then((res) => {
            if (res.success) {
                console.log("Calll")
                toastifySuccess(res.Message);
                setModalstatus(false)
                get_Comments_Data(incidentID);
                setCommentID('')
            } else {
                console.log("Somthing Wrong");
            }
        })
    }

    // --------------------Add Del upd----------------------->
    const submit = () => {
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
                toastifyError('Code Already Exists')
            }
        } else {
            AddDeleteUpadate('IncidentComments_FRW/Insert_IncidentComments_FRW', value)
                .then((res) => {
                    toastifySuccess(res.Message);
                    setCommentsModal(false)
                    reset();
                    get_Comments_Data(incidentID);
                    setCommentID('')
                })
        }
    }
    const updateComment = (e) => {
        var result = CommentData?.find(item => {
            if (item.Comments) {
                if (item.CommentID != value.CommentID) {
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

            }
        } else {
            AddDeleteUpadate('IncidentComments_FRW/Update_IncidentComments_FRW', value)
                .then((res) => {
                    toastifySuccess(res.Message);
                    setCommentsModal(false)
                    get_Comments_Data(incidentID);
                    setCommentID('')
                    reset();
                })
        }
    }

    const CloseModal = () => {
        setModalstatus(false)
    }

    return (
        <>
            <div className="col-md-12 px-0 pt-2">
                <div className="bg-line text-white py-1 px-2 d-flex justify-content-between align-items-center">
                    <p className="p-0 m-0 d-flex align-items-center" style={{ fontSize: '18px' }}>
                        Comments
                    </p>
                    {/* {
                        !commentID ?
                            <Link to={'#'} onClick={() => { setCommentsModal(true); reset(); }} className="btn btn-sm bg-green text-white px-2 py-0 new-button ">
                                <i className="fa fa-plus"></i>
                            </Link>
                            :
                            <></>
                    } */}
                    {/* {
                        sessionStorage.getItem('IncidentId') ? */}
                            <Link to={'#'} onClick={() => { setCommentsModal(true); reset(); setCommentID('') }} className="btn btn-sm bg-green text-white px-2 py-0  new-button">
                                <i className="fa fa-plus"></i>
                            </Link>
                            {/* :
                            <></>
                    } */}
                </div>
            </div>
            {
                CommentsModal ?
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
                                        {errors.CommentsError !== 'true' ? (
                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CommentsError}</span>
                                        ) : null}
                                    </div>

                                </div>
                                <div class="col-12 text-right  " style={{ marginTop: '2%' }}>
                                    {
                                        CommentID ?
                                            <button type="button" className="btn btn-lg  btn-success new-button mr-3" onClick={check_Validation_Error}>Update</button>
                                            :
                                            <button type="button" className="btn btn-lg  btn-success new-button mr-3" onClick={check_Validation_Error}>Save</button>
                                    }
                                    <button type="button" onClick={() => { setCommentsModal(false); reset(); setCommentID('') }} className="btn btn-lg  btn-success new-button">Close</button>
                                </div>
                            </div>
                        </div>
                    </>
                    :
                    <>
                        <div className="col-md-12  pt-2">
                            <DataTable
                                columns={columns}
                                data={CommentData}
                                dense
                                pagination
                                paginationPerPage={'5'}
                                paginationRowsPerPageOptions={[5, 15, 20]}
                                highlightOnHover
                                // subHeader
                                responsive
                                customStyles={tableCustomStyles}
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
                                        <button type="button" onClick={DeleteComment} className="btn btn-sm text-white" style={{ background: "#ef233c" }} >Delete</button>
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

export default memo(MobileComments)

