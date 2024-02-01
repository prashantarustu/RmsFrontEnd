import React, { useCallback, useContext, useEffect, useState } from 'react'
import Select from "react-select";
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import { Comman_changeArrayFormat } from '../../../../Common/ChangeArrayFormat';
import { Decrypt_Id_Name, EncryptedList } from '../../../../Common/Utility';
import { AddDeleteUpadate, AddDeleteUpadate_FormData, fetchPostData } from '../../../../hooks/Api';
import { RequiredField, RequiredFieldSpaceNotAllow } from '../../../Agency/AgencyValidation/validators';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { Space_Allow_with_Trim } from '../../../Utility/Personnel/Validation';

const Document_Add_Up = (props) => {

    const { get_Warrent_Count } = useContext(AgencyContext)

    const { LoginPinID, WarrantID, LoginAgencyID, updateStatus, get_Documentdata, modal, setModal, status, setStatus, WarrantDocumentID, setWarrantDocumentID, documentdata } = props
    const [documentDrpVal, setDocumentDropVal] = useState([]);
    const [Editval, setEditval] = useState();
    //attach file type
    const [displayFileName, setDisplayFileName] = useState(false);
    const [selectedFile, setSelectedFile] = useState([]);
    const [selectedFileName, setSelectedFileName] = useState([]);

    const [value, setValue] = useState({
        'WarrantDocumentID': '',
        'DocumentName': '',
        'DocumentNotes': '',
        'DocumentFile': '',
        // 'IsActive': '1',
        'DocumentTypeID': '',
        'CreatedByUserFK': '',
        'WarrantID': '',
        'ModifiedByUserFK': '',
    })

    useEffect(() => {
        if (WarrantID) {
            setValue({ ...value, 'WarrantID': WarrantID, 'CreatedByUserFK': LoginPinID, })
        }
    }, [WarrantID, updateStatus]);

    const [errors, setErrors] = useState({
        'DocumentNameError': '', 'DocumentNotesError': '', 'DocumentTypeIDError': '', 'File_Not_Selected': '',
    })

    useEffect(() => {
        if (WarrantDocumentID) {
            GetSingleData(WarrantDocumentID)
        }
    }, [WarrantDocumentID])

    const GetSingleData = (WarrantDocumentID) => {
        const val = { 'WarrantDocumentID': WarrantDocumentID }
        fetchPostData('IncidentDocument/GetSingleData_IncidentDocManagement', val)
            .then((res) => {
                if (res) setEditval(res)
                else setEditval()
            })
    }

    const reset = () => {
        setValue({
            ...value,
            'DocumentName': '', 'DocumentNotes': '', 'DocumentFile': '', 'DocumentTypeID': '', 'DocumentTypeIDName': '',
        });
        setErrors({
            ...errors,
            'DocumentNameError': '', 'DocumentNotesError': '', 'DocumentTypeIDError': '', 'File_Not_Selected': '',
        });setSelectedFileName('');setModal(false);
    }
    

    const check_Validation_Error = (e) => {
        if (RequiredFieldSpaceNotAllow(value.DocumentName)) {
            setErrors(prevValues => { return { ...prevValues, ['DocumentNameError']: RequiredFieldSpaceNotAllow(value.DocumentName) } })
        }
        if (Space_Allow_with_Trim(value.DocumentNotes)) {
            setErrors(prevValues => { return { ...prevValues, ['DocumentNotesError']: Space_Allow_with_Trim(value.DocumentNotes) } })
        }
        if (RequiredField(value.DocumentTypeID)) {
            setErrors(prevValues => { return { ...prevValues, ['DocumentTypeIDError']: RequiredField(value.DocumentTypeID) } })
        }
        if (validate_fileupload(selectedFileName)) {
            setErrors(prevValues => { return { ...prevValues, ['File_Not_Selected']: validate_fileupload(selectedFileName) } })
        }
    }

    // Check All Field Format is True Then Submit 
    const { DocumentNameError, DocumentNotesError, DocumentTypeIDError, File_Not_Selected } = errors

    useEffect(() => {
        if (DocumentNameError === 'true' && DocumentNotesError === 'true' && DocumentTypeIDError === 'true' && File_Not_Selected === 'true') {
            Add_Document();
        }
    }, [DocumentNameError, DocumentNotesError, DocumentTypeIDError, File_Not_Selected])

    const handleChange = (e) => {
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
        if (LoginAgencyID) {
            get_DocumentDropDwn(LoginAgencyID);
        }
    }, [LoginAgencyID])

    const get_DocumentDropDwn = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID
        }
        fetchPostData('DocumentType/GetDataDropDown_DocumentType', val).then((data) => {
            console.log(data)
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
        // console.log(files)
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
        AddDeleteUpadate_FormData('WarrantDocument/Insert_WarrantDocument', formdata)
            .then((res) => {
                if (res.success) {
                    // get_Documentdata();
                    get_Warrent_Count(WarrantID);
                    setModal(false)
                    toastifySuccess(res.Message);
                    setSelectedFileName([])
                    setSelectedFile([])
                    get_Documentdata(WarrantID)
                    reset();
                    setErrors({
                        ...errors,
                        'DocumentNameError': '', 'DocumentNotesError': '', 'DocumentTypeIDError': '', 'File_Not_Selected': '',
                    })
                } else {
                    console.log("something Wrong");
                }
            })
            .catch(err => console.log(err))
    }

    const Update_Document = () => {
        AddDeleteUpadate('IncidentDocument/Update_IncidentDocManagement', value).then((res) => {
            toastifySuccess(res.Message);
            setModal(false);
            get_Documentdata(WarrantID);
            reset();
        })
    }

    const closeModal = () => {
        reset();
        setModal(false);
        setSelectedFileName([]); setSelectedFile([]);
    }

    // for esc 
    const escFunction = useCallback((event) => {
        if (event.key === "Escape") {
            reset()
            setModal(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);
        return () => {
            document.removeEventListener("keydown", escFunction, false);
        };
    }, [escFunction]);

    // Custom Style
    const colourStyles = {
        control: (styles) => ({
            ...styles, backgroundColor: "#fce9bf",
            height: 20,
            minHeight: 33,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),

    };

    const formatFileNameArray = (index) => {
        // console.log(index);
        // console.log(selectedFile);

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
                                                <legend style={{ fontWeight: 'bold' }}>Document </legend>
                                                <div className="row">
                                                    <div className="col-12">
                                                        <div className="row">
                                                            <div class="col-6 col-md-6  col-lg-6 mt-1">
                                                                <div className="text-field">
                                                                    <input type="text" className='requiredColor' name='DocumentName' value={value.DocumentName} onChange={handleChange} required />
                                                                    <label className=''>Document Name</label>
                                                                    {errors.DocumentNameError !== 'true' ? (
                                                                        <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DocumentNameError}</span>
                                                                    ) : null}
                                                                </div>
                                                            </div>
                                                            <div className="col-6 col-md-6 col-lg-6 ">
                                                                <div className=" dropdown__box">
                                                                    <Select
                                                                        name='DocumentTypeID'
                                                                        styles={colourStyles}
                                                                        value={documentDrpVal?.filter((obj) => obj.value === value?.DocumentTypeID)}
                                                                        isClearable
                                                                        options={documentDrpVal}
                                                                        onChange={(e) => ChangeDropDown(e, 'DocumentTypeID')}
                                                                        placeholder="Select.."
                                                                    />
                                                                    <label htmlFor="">Document Type</label>
                                                                    {errors.DocumentTypeIDError !== 'true' ? (
                                                                        <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DocumentTypeIDError}</span>
                                                                    ) : null}
                                                                </div>
                                                            </div>
                                                            <div class="col-6 col-md-6  col-lg-12 mt-3">
                                                                <div className="text-field  ">
                                                                    <input type="file" className='requiredColor' name='DocumentFile' onChange={changeHandler} multiple required />
                                                                    <label >File Attachement</label>
                                                                </div>
                                                                <div className=" col-12 mt-3">
                                                                    {
                                                                        selectedFileName ?
                                                                            selectedFileName?.map((data, index) => {
                                                                                return <>
                                                                                    <span className='bg-info mx-1 text-white px-2' key={index}>{data}&nbsp;</span>
                                                                                    {/* <span className='bg-info mx-1 text-white px-2' key={index}>{data}&nbsp; &nbsp;<span onClick={() => { formatFileNameArray(index); }} style={{ color: 'red', fontSize: '20px', cursor: 'pointer' }}>&times;</span></span> */}
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
                                                            <div className="col-12  col-md-12 col-lg-12 mt-5 pt-1 dropdown__box" style={{ marginTop: '20px' }}>
                                                                <textarea name='DocumentNotes' onChange={handleChange} id="Comments" value={value.DocumentNotes} cols="30" rows='3' className="form-control pt-2 pb-2 requiredColor" ></textarea>
                                                                <label htmlFor="" className='pt-1'>Notes</label>
                                                                {errors.DocumentNotesError !== 'true' ? (
                                                                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DocumentNotesError}</span>
                                                                ) : null}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </fieldset>
                                        </div>
                                    </div>
                                    <div className="btn-box text-right mt-3 mr-1 mb-2">
                                        <button type="button" onClick={(e) => { check_Validation_Error(); }} class="btn btn-sm btn-success mr-1">Save</button>
                                        <button type="button" data-dismiss="modal" onClick={closeModal} class="btn btn-sm btn-success mr-1" >Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                    :
                    <></>
            }
        </>
    )
}

export default Document_Add_Up

// function validate_fileupload(fileName) {
//     console.log(fileName)
//     var nameArray = '';
//     for (let i = 0; i < fileName.length; i++) {
//         nameArray += fileName[i]
//         console.log("File", fileName[i])
//     }
//     var allowed_extensions = new Array("jpg","jpeg","pdf");
//     var file_extension = nameArray.split('.').pop().toLowerCase(); // split function will split the filename by dot(.), and pop function will pop the last element from the array which will give you the extension as well. If there will be no extension then it will return the filename.

//     for (var i = 0; i <= allowed_extensions.length; i++) {
//         if (allowed_extensions[i] == file_extension) {
//             return 'true'; // valid file extension
//         }
//     }
//     return 'Please Select File..';
// }

function validate_fileupload(fileName) {
    // console.log(fileName);
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