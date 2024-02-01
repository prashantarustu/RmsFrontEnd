import React, { useEffect, memo, useContext } from 'react'
import { useState } from 'react';
import DataTable from 'react-data-table-component'
import DatePicker from 'react-datepicker';
import { Link } from 'react-router-dom';
import { Decrypt_Id_Name, tableCustomStyles } from '../../../../../Common/Utility';
import Select from "react-select";
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, ContentState, convertFromHTML } from 'draft-js';
import { convertToHTML } from 'draft-convert';
import { AddDeleteUpadate, fetchPostData } from '../../../../../hooks/Api';
import { toastifyError, toastifySuccess } from '../../../../../Common/AlertMsg';
import DeletePopUpModal from '../../../../../Common/DeleteModal';
import { RequiredFieldIncident } from '../../../../../Pages/Utility/Personnel/Validation';
import { Comman_changeArrayFormat } from '../../../../../Common/ChangeArrayFormat';
import { AgencyContext } from '../../../../../../Context/Agency/Index';

const MobileVehicleNotes = () => {
    const { get_vehicle_Count, localStoreArray, setLocalStoreArray, get_LocalStorage, } = useContext(AgencyContext);

    const [VehicleNotesID, setVehicleNotesID] = useState('')
    const [vehicleNotesData, setvehicleNotesData] = useState([])
    const [Editval, setEditval] = useState([]);
    const [VehicleNotesModal, setVehicleNotesModal] = useState(false)
    const [convertedContent, setConvertedContent] = useState(null);
    const [modalStatus, setModalstatus] = useState(false)
    const [headOfAgency, setHeadOfAgency] = useState([])
    const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState()
    const [LoginAgencyID, setLoginAgencyID] = useState('')
    const [vehicleID, setVehicleID] = useState('')
    const [LoginPinID, setLoginPinID] = useState('');
    const [MainIncidentID, setMainIncidentID] = useState('');


    const localStore = {
        Value: "",
        UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
        Key: JSON.stringify({ AgencyID: "", PINID: "", IncidentID: '', VehicleID: '', }),
    }

    useEffect(() => {
        if (!localStoreArray.AgencyID || !localStoreArray.PINID) {
            get_LocalStorage(localStore);
        }
    }, []);

    // Onload Function
    useEffect(() => {
        if (localStoreArray) {
            if (localStoreArray?.AgencyID && localStoreArray?.PINID) {
                setLoginAgencyID(localStoreArray?.AgencyID);
                setLoginPinID(parseInt(localStoreArray?.PINID));
                setMainIncidentID(parseInt(localStoreArray?.IncidentID));
                if (localStoreArray?.VehicleID) {
                    setVehicleID(localStoreArray?.VehicleID);
                    get_Comments_Data(localStoreArray?.VehicleID);
                } else {
                    setVehicleID('');
                }
            }
        }
    }, [localStoreArray])

    const [errors, setErrors] = useState({
        'NotesError': '', 'OfficerNameIDError': '',
    })

    const [editorState, setEditorState] = useState(
        () => EditorState.createEmpty(),
    );

    const [value, setValue] = useState({
        'VehicleID': '',
        'PropertyID:': '',
        'OfficerNameID': '',
        'Notes': '', 
        'CreatedByUserFK':'',
        'VehicleNotesID': '', 'ModifiedByUserFK': '',
        'CommentsDoc': '',
    });

    useEffect(() => {
        get_Comments_Data(vehicleID); 
    }, [vehicleID]);

    useEffect(() => {
        get_Head_Of_Agency(LoginAgencyID);
    }, [LoginAgencyID])

    useEffect(() => {
        if (VehicleNotesID) {
            GetSingleData(VehicleNotesID)
        }
    }, [VehicleNotesID])

    const GetSingleData = (VehicleNotesID) => {
        const val = { 'VehicleNotesID': VehicleNotesID }
        fetchPostData('VehicleNotes_FRW/GetSingleData_VehicleNotes_FRW', val)
            .then((res) => {
                if (res) setEditval(res)
                else setEditval()
            })
    }


    const get_Head_Of_Agency = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID,
        }
        fetchPostData('DropDown/GetData_HeadOfAgency', val).then((data) => {
            if (data) {
                console.log(data);
                setHeadOfAgency(Comman_changeArrayFormat(data, 'PINID', 'HeadOfAgency'));
            }
            else {
                setHeadOfAgency([])

            }
        })
    };

    useEffect(() => {
        if (Editval.length > 0) {
            setValue({
                ...value,
                'VehicleNotesID': VehicleNotesID, 'OfficerNameID': Editval[0].OfficerNameID, 'Notes': Editval[0].Notes,
                'ModifiedByUserFK': LoginPinID, 'CommentsDoc': Editval[0].CommentsDoc,
            })
            setEditorState(EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(Editval[0].CommentsDoc))));
            setConvertedContent(Editval[0].CommentsDoc)
        } else {
            setValue({
                ...value,
                'OfficerNameID': '', 'CommentsDoc': '', 'ModifiedByUserFK': '', 'VehicleNotesID': '', 'Notes': '',
            });
            setEditorState(() => EditorState.createEmpty());
            setConvertedContent()
        }
    }, [Editval])

    const reset = () => {
        setValue({
            ...value,
            'OfficerNameID': '', 'CommentsDoc': '', 'ModifiedByUserFK': '', 'VehicleNotesID': '', 'Notes': '',
        });
        setErrors({
            'NotesError': '', 'OfficerNameIDError': '',
        });
        setEditorState(() => EditorState.createEmpty(),);
        setConvertedContent()
    }

    const check_Validation_Error = (e) => {
        if (RequiredFieldIncident(value.OfficerNameID)) {
            setErrors(prevValues => { return { ...prevValues, ['OfficerNameIDError']: RequiredFieldIncident(value.OfficerNameID) } })
        }
        if (RequiredFieldIncident(value.Notes)) {
            setErrors(prevValues => { return { ...prevValues, ['NotesError']: RequiredFieldIncident(value.Notes) } })
        }
    }
    // Check All Field Format is True Then Submit 
    const { NotesError, OfficerNameIDError } = errors

    useEffect(() => {
        if (NotesError === 'true' && OfficerNameIDError === 'true') {
            if (VehicleNotesID) updateComment()
            else submit()
        }
    }, [NotesError, OfficerNameIDError])

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
            ['Notes']: e.blocks[0].text
        })
    }

    // <-----------------------------------------getDataList------------------------------------>

    const get_Comments_Data = (vehicleID) => {
        const val = {
            'VehicleID':vehicleID,
        }
        fetchPostData('VehicleNotes_FRW/GetData_VehicleNotes_FRW', val).then((res) => {
            if (res) {
                setvehicleNotesData(res);
            } else {
                setvehicleNotesData([]);
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
            name: 'Notes',
            selector: (row) => <>{row?.Notes ? row?.Notes.substring(0, 60) : ''}{row?.Notes?.length > 40 ? '  . . .' : null} </>,
            sortable: true
        },

        {
            name: <p className='text-end' style={{ position: 'absolute', top: '7px' }}>Action</p>,
            cell: row => <>
                <Link to={'#'} onClick={() => { setVehicleNotesID(row.VehicleNotesID); setModalstatus(true) }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1 new-button" data-toggle="modal" data-target="#myModal2">
                    <i className="fa fa-trash"></i>
                </Link>
            </>
        }
    ];

    const setEditVal = (row) => {
        setVehicleNotesID(row.VehicleNotesID);
        setVehicleNotesModal(true);
    }

    const DeleteComment = () => {
        const val = {
            'VehicleNotesID': VehicleNotesID,
            'DeletedByUserFK': ('PINID'),
        }
        AddDeleteUpadate('VehicleNotes_FRW/Delete_VehicleNotes_FRW', val).then((res) => {
            if (res.success) {
                console.log("Calll")
                toastifySuccess(res.Message);
                setModalstatus(false)
                get_Comments_Data(vehicleID);
                setVehicleNotesID('')
            } else {
                console.log("Somthing Wrong");
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

    // --------------------Add Del upd----------------------->
    const submit = () => {
        var result = vehicleNotesData?.find(item => {
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
            AddDeleteUpadate('VehicleNotes_FRW/Insert_VehicleNotes_FRW', value)
                .then((res) => {
                    toastifySuccess(res.Message);
                    setVehicleNotesModal(false)
                    get_Comments_Data(vehicleID);
                    setVehicleNotesID('')
                    reset();
                })
        }
    }
    const updateComment = (e) => {
        var result = vehicleNotesData?.find(item => {
            if (item.Comments) {
                if (item.VehicleNotesID != value.VehicleNotesID) {
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
            AddDeleteUpadate('VehicleNotes_FRW/Update_VehicleNotes_FRW', value)
                .then((res) => {
                    toastifySuccess(res.Message);
                    setVehicleNotesModal(false)
                    get_Comments_Data(vehicleID);
                    setVehicleNotesID('')
                    reset();
                })
        }
    }

    const CloseModal = () => {
        setModalstatus(false)
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

    return (
        <>
            <div className="col-md-12 px-0 pt-2">
                <div className="bg-line text-white py-1 px-2 d-flex justify-content-between align-items-center">
                    <p className="p-0 m-0 d-flex align-items-center" style={{ fontSize: '18px' }}>
                        Comments
                    </p>
       
                            <Link to={'#'} onClick={() => { setVehicleNotesModal(true); reset(); setVehicleNotesID('') }} className="btn btn-sm bg-green text-white px-2 py-0 new-button ">
                                <i className="fa fa-plus"></i>
                            </Link>
          
                </div>
            </div>
            {
                VehicleNotesModal ?
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
                                        {errors.NotesError !== 'true' ? (
                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.NotesError}</span>
                                        ) : null}
                                    </div>

                                </div>
                                <div className="col-12 col-md-6 col-lg-4 pt-2 ">
                                    <div className="text__dropdwon">
                                        <Select
                                            name='OfficerNameID'
                                            styles={colourStyles}
                                            menuPlacement='top'
                                            value={headOfAgency?.filter((obj) => obj.value === value?.OfficerNameID)}
                                            isClearable
                                            options={headOfAgency}
                                            onChange={(e) => ChangeDropDown(e, 'OfficerNameID')}
                                            placeholder="Select..."
                                        />
                                        <label htmlFor="" className='pt-2'>Officer</label>
                                        {errors.OfficerNameIDError !== 'true' ? (
                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.OfficerNameIDError}</span>
                                        ) : null}
                                    </div>
                                </div>
                                
                                <div class="col-12 text-right  " style={{ marginTop: '2%' }}>
                                    {
                                        VehicleNotesID ?
                                            <button type="button" className="btn btn-lg  btn-success new-button mr-3" onClick={check_Validation_Error}>Update</button>
                                            :
                                            <button type="button" className="btn btn-lg  btn-success new-button mr-3" onClick={check_Validation_Error}>Save</button>
                                    }
                                    <button type="button" onClick={() => { setVehicleNotesModal(false); reset(); setVehicleNotesID('') }} className="btn btn-lg  btn-success new-button">Close</button>
                                </div>
                            </div>
                        </div>
                    </>
                    :
                    <>
                        <div className="col-md-12  pt-2">
                            <DataTable
                                columns={columns}
                                data={vehicleNotesData}
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

export default memo(MobileVehicleNotes)