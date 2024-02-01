import React, { useState } from 'react'
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import DatePicker from "react-datepicker";
import Select from "react-select";
import { Decrypt_Id_Name, EncryptedList, tableCustomStyles } from '../../../../../Common/Utility';
import { Comman_changeArrayFormat } from '../../../../../Common/ChangeArrayFormat';
import { useEffect } from 'react';
import { AddDeleteUpadate, AddDeleteUpadate_FormData, fetchPostData } from '../../../../../hooks/Api';
import { toastifyError, toastifySuccess } from '../../../../../Common/AlertMsg';
import { RequiredField, RequiredFieldIncident } from '../../../../../Pages/Utility/Personnel/Validation';
import { RequiredFieldSpaceNotAllow } from '../../../../../Pages/Agency/AgencyValidation/validators';


const MobileDocument = () => {

    const [documentDrpVal, setDocumentDropVal] = useState([]);
    const [DocumentModal, setDocumentModal] = useState(false)
    const [contactTypeCode, setContactTypeCode] = useState('')
    const [DocumentID, setDocumentID] = useState('');
    const [status, setStatus] = useState(false);
    const [updateStatus, setUpdateStatus] = useState(0)
    const [modal, setModal] = useState(false)
    const [documentdata, setDocumentdata] = useState();
    const [selectedFile, setSelectedFile] = useState([]);
    const [selectedFileName, setSelectedFileName] = useState([]);
    const [modalStatus, setModalstatus] = useState(false)

    const [value, setValue] = useState({
        'DocumentNotes': '',
        'DocumentTypeId': '',
        'DocFileName': '',
        'CreatedByUserFK':'',
        // 'MasterNameID': (Decrypt_Id_Name(sessionStorage.getItem('MasterNameID'), 'MForMasterNameID')),
        'NameID': '',
    })
    const [errors, setErrors] = useState({
        'DocFileNameError': '', 'File_Not_Selected': '', 'DocumentTypeIdError': '', 'DocumentNotesError': ''
    })

    const reset = () => {
        setValue({
            ...value,
            'DocFileName': '',
            'DocumentFile': '',
            'DocumentTypeId': '',
            'DocumentNotes': '',
        });
        setErrors({
            'DocFileNameError': '', 'File_Not_Selected': '', 'DocumentTypeIdError': '', 'DocumentNotesError': ''
        }); setSelectedFileName([])
    }


    useEffect(() => {
        if (DocumentID) {
            // GetSingleData(DocumentID)
        }
    }, [DocumentID])

    const GetSingleData = () => {
        // const val = { 'DocumentID': DocumentID }
        // fetchPostData('IncidentDocumentManagement/GetSingleData_IncidentDocManagement', val)
        //     .then((res) => {
        //         if (res) setEditval(res)
        //         else setEditval()
        //     })
    }

    const check_Validation_Error = () => {
        if (RequiredFieldSpaceNotAllow(value.DocFileName)) {
            setErrors(prevValues => { return { ...prevValues, ['DocFileNameError']: RequiredFieldSpaceNotAllow(value.DocFileName) } })
        }
        if (validate_fileupload(selectedFileName)) {
            setErrors(prevValues => { return { ...prevValues, ['File_Not_Selected']: validate_fileupload(selectedFileName) } })
        }
        if (RequiredField(value.DocumentNotes)) {
            setErrors(prevValues => { return { ...prevValues, ['DocumentNotesError']: RequiredField(value.DocumentNotes) } })
        }
        if (RequiredFieldIncident(value.DocumentTypeId)) {
            setErrors(prevValues => { return { ...prevValues, ['DocumentTypeIdError']: RequiredFieldIncident(value.DocumentTypeId) } })
        }
    }

    // Check All Field Format is True Then Submit 
    const { DocFileNameError, File_Not_Selected, DocumentNotesError, DocumentTypeIdError } = errors

    useEffect(() => {
        if (DocFileNameError === 'true' && File_Not_Selected === 'true' && DocumentNotesError === 'true' && DocumentTypeIdError === 'true') {
            console.log("caqladsfdsaf")
            Add_Documents();
        }
    }, [DocFileNameError, File_Not_Selected, DocumentNotesError, DocumentTypeIdError])


    //---------------------------------GetData--------------------------------
    useEffect(() => {
        get_Documentdata();
    }, [])

    const get_Documentdata = () => {
        const val = {
            'NameID': ('NameID'), 
        }
        fetchPostData('NameDocument_FRW/GetData_NameDocument_FRW', val).then((res) => {
            if (res) {
                setDocumentdata(res)
            } else {
                setDocumentdata([]);
            }
        })
    }

    useEffect(() => {
        get_DocumentDropDwn();
    }, [])

    const get_DocumentDropDwn = () => {
        const val = {
            AgencyID: ('AgencyID'), 
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

    const handleChange = (e) => {
        setValue({
            ...value,
            [e.target.name]: e.target.value
        })
    }

    const columns = [
        {
            name: <p className='text-end' style={{ position: 'absolute', top: '7px' }}>Action</p>,
            cell: row => <>
                <Link to={'#'} onClick={() => window.open(row?.FileAttachment)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1  new-button" >
                    <i className="fa fa-eye"></i>
                </Link>
            </>
        },
        {
            name: 'Document Name',
            selector: (row) => row.DocFileName,
            sortable: true
        },
        {
            name: 'Notes',
            selector: (row) => row.DocumentNotes,
            sortable: true
        },
        {
            name: 'Document Type',
            selector: (row) => row.Description,
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: '7px', right: 0 }}>Delete</p>,
            cell: row => <>
                <div className="div" style={{ position: 'absolute',  right: 4 }}>
                    <Link to={'#'} onClick={() => { setDocumentID(row.DocumentID); setModalstatus(true) }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1  new-button" data-toggle="modal" data-target="#myModal2">
                        <i className="fa fa-trash"></i>
                    </Link>
                </div>
            </>
        }

    ];

    const setEditVal = (row) => {
        setDocumentID(row.DocumentID);
        setDocumentModal(true);
    }

    const CloseModal = () => {
        setModalstatus(false)
        setSelectedFileName([]); setSelectedFile([]);
    }

    //------------------------delete Data-----------------------------
    const DeleteDocumentManagement = () => {
        const val = {
            'DocumentID': DocumentID,
            'DeletedByUserFK':('PINID'),
        }
        AddDeleteUpadate('NameDocument_FRW/Delete_NameDocument_FRW', val).then((res) => {
            if (res) {
                toastifySuccess(res.Message);
                get_Documentdata();
                setModalstatus(false)
                setDocumentID('');
            } else console.log("Somthing Wrong");
        })
    }


    //---------------------------------insert Update ------------------------------------------
    const Add_Documents = (id) => {
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
        AddDeleteUpadate_FormData('NameDocument_FRW/Insert_NameDocument_FRW', formdata)
            .then((res) => {
                if (res.success) {
                    get_Documentdata();
                    setDocumentModal(false)
                    setSelectedFileName([])
                    setSelectedFile([])
                    toastifySuccess(res.Message);
                    reset();
                    setErrors({
                        ...errors,
                        ['DocFileNameError']: '',
                    })
                } else {
                    setErrors({
                        ...errors,
                        ['DocFileNameError']: '',
                    })
                    console.log("something Wrong");
                }
            })
            .catch(err => console.log(err))
    }

    const changeHandler = (e) => {
        const files = e.target.files
        console.log(files)
        setSelectedFile(files)
        const nameArray = []
        for (let i = 0; i < files.length; i++) {
            nameArray.push(files[i].name)
            // console.log("File", files[i].name)
        }
        setSelectedFileName(nameArray);

        // single file upload  <----
        // nameArray.push(files[0]?.name)
        // setSelectedFile(e.target.files[0]);
        // setSelectedFileName(nameArray)
    };

    const formatFileNameArray = (index) => {
        console.log(index);
        console.log(selectedFile);

        const modifieArray = [...selectedFile];

        let val = modifieArray.splice(index, 1);
        // console.log(modifieArray);

        setSelectedFile(modifieArray);
        const nameArray = []
        for (let i = 0; i < modifieArray.length; i++) {
            nameArray.push(modifieArray[i].name)
            // console.log("File", modifieArray[i].name)
        }
        setSelectedFileName(nameArray);
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
                        Document
                    </p>
                    {/* <Link to={'#'} onClick={() => { setDocumentModal(true); }} className="btn btn-sm bg-green text-white px-2 py-0"
                        style={{ fontSize: "18px" }} >
                        <i className="fa fa-plus"></i>
                    </Link> */}
                    {
                        ('NameID') ?
                            <Link to={'#'} onClick={() => { setDocumentModal(true); reset(); setDocumentID(''); }} className="btn btn-sm bg-green text-white px-2 py-0  new-button">
                                <i className="fa fa-plus"></i>
                            </Link>
                            :
                            <></>
                    }
                </div>
            </div>
            {
                DocumentModal ?
                    <>
                        <div className="row px-3 mt-3">
                            <div className="col-12">
                                <div className="row">
                                    <div class="col-6 col-md-6  col-lg-6 mt-1">
                                        <div className="text-mobile">
                                            <input type="text" className='requiredColor' name='DocFileName' value={value.DocFileName} onChange={handleChange} required />
                                            <label className=''>Documents Name</label>
                                            {errors.DocFileNameError !== 'true' ? (
                                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DocFileNameError}</span>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div class="col-6 col-md-6  col-lg-6 ">
                                        <div class="text__dropdwon ">
                                            <Select
                                                name='DocumentTypeId'
                                                styles={colourStyles}
                                                value={documentDrpVal?.filter((obj) => obj.value === value?.DocumentTypeId)}
                                                isClearable
                                                options={documentDrpVal}
                                                onChange={(e) => ChangeDropDown(e, 'DocumentTypeId')}
                                                placeholder="Select.."
                                            />
                                            <label htmlFor='' className='pt-1'>Document Type</label>
                                            {errors.DocumentTypeIdError !== 'true' ? (
                                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DocumentTypeIdError}</span>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div class="col-12 col-md-12  col-lg-12 mt-3">
                                        <div className="text-field  ">
                                            <input type="file" className='requiredColor' name='DocumentFile' onChange={changeHandler} multiple required />
                                            {/* <input type="text" name='File' onChange={handleChange} required /> ////*/}
                                            <label className='pl-1'>File Attachement</label>
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
                                                // <><span className='mx-1 text-danger px-2'> Please Select File..</span></>
                                            }
                                        </div>
                                        {errors.File_Not_Selected !== 'true' ? (
                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.File_Not_Selected}</span>
                                        ) : null}

                                    </div>
                                    <div className="col-12  col-md-12 col-lg-12 mt-2 pt-1 ">
                                        <div className="text__dropdwon">
                                            <textarea name='DocumentNotes' onChange={handleChange} id="Comments" value={value.DocumentNotes} cols="30" rows='3' className="form-control pt-2 pb-2 requiredColor" ></textarea>
                                            <label htmlFor="" className='pt-1'>Notes</label>
                                            {errors.DocumentNotesError !== 'true' ? (
                                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DocumentNotesError}</span>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 text-right  mt-2" >
                                    <button type="button" className="btn btn-lg  btn-success new-button mr-3" onClick={check_Validation_Error} >Save</button>
                                    <button type="button" onClick={() => { setDocumentModal(false); setDocumentID('') }} className="btn btn-lg  btn-success new-button">Close</button>
                                </div>
                            </div>
                        </div>
                    </>
                    :
                    <>
                        <div className="col-md-12 px-2 pt-2">
                            <DataTable
                                columns={columns}
                                data={documentdata}
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
                                        <button type="button" onClick={DeleteDocumentManagement} className="btn btn-sm text-white" style={{ background: "#ef233c" }} >Delete</button>
                                        <button type="button" onClick={() => { CloseModal(); }} className="btn btn-sm btn-secondary ml-2 "> Cancel</button>
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

export default MobileDocument

function validate_fileupload(fileName) {
    console.log(fileName);
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
