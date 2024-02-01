import React, { useCallback, useContext, useEffect, useState } from 'react'
import Select from "react-select";
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import { Comman_changeArrayFormat } from '../../../../Common/ChangeArrayFormat';
import { Decrypt_Id_Name, EncryptedList } from '../../../../Common/Utility';
import { AddDeleteUpadate, AddDeleteUpadate_FormData, fetchPostData } from '../../../../hooks/Api';
import { RequiredField, RequiredFieldSpaceNotAllow } from '../../../Agency/AgencyValidation/validators';
import { useLocation } from 'react-router-dom';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { Space_Allow_with_Trim } from '../../../Utility/Personnel/Validation';

const Documents_Add_Up = (props) => {

    const { nameID, MasterNameID, LoginPinID, LoginAgencyID, updateStatus, get_Documentdata, modal, setModal, status, setStatus, DocumentID, setDocumentID, documentdata, MainIncidentID } = props
    const { get_Name_Count } = useContext(AgencyContext)
    const useQuery = () => new URLSearchParams(useLocation().search);

    let openPage = useQuery().get('page');

    const [Editval, setEditval] = useState();
    const [documentDrpVal, setDocumentDropVal] = useState([]);
    //attach file type
    const [selectedFile, setSelectedFile] = useState([]);
    const [selectedFileName, setSelectedFileName] = useState([]);

    const [value, setValue] = useState({
        // 'DocumentID': '',
        'DocumentNotes': '',
        'DocumentTypeId': '',
        'DocFileName': '',
        'CreatedByUserFK': '',
        'MasterNameID': '',
        'NameID': '',
    })


    const [errors, setErrors] = useState({
        'DocFileNameError': '', 'DocumentNotesError': '', 'DocumentTypeIdError': '', 'File_Not_Selected': '',
    })
    // useEffect(() => {
    //     setValue(pre => { return { ...pre, 'CreatedByUserFK': LoginPinID, 'MasterNameID': MasterNameID, 'NameID': nameID } });

    // }, [nameID, MasterNameID , updateStatus]);
    useEffect(() => {
        setValue({ ...value, 'CreatedByUserFK': LoginPinID, 'MasterNameID': MasterNameID, 'NameID': nameID })
    }, [nameID, MasterNameID, updateStatus]);

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


    const reset = () => {
        setValue({
            ...value,
            'DocFileName': '',
            'DocumentFile': '',
            'DocumentTypeId': '',
            'DocumentNotes': '',
            // 'selectedFileName': '',
            // 'File_Not_Selected': '',
            // 'fileName': '',
        });setSelectedFileName('');
        setErrors({
            ...errors,
            'DocFileNameError': '', 'File_Not_Selected': '', 'DocumentTypeIdError': '', 'DocumentNotesError': '',
        });  setModal(false);
    }

    const check_Validation_Error = (e) => {
        if (RequiredFieldSpaceNotAllow(value.DocFileName)) {
            setErrors(prevValues => { return { ...prevValues, ['DocFileNameError']: RequiredFieldSpaceNotAllow(value.DocFileName) } })
        }
        if (RequiredField(value.DocumentTypeId)) {
            setErrors(prevValues => { return { ...prevValues, ['DocumentTypeIdError']: RequiredField(value.DocumentTypeId) } })
        }
        if (validate_fileupload(selectedFileName)) {
            setErrors(prevValues => { return { ...prevValues, ['File_Not_Selected']: validate_fileupload(selectedFileName) } })
        }
        if (Space_Allow_with_Trim(value.DocumentNotes)) {
            setErrors(prevValues => { return { ...prevValues, ['DocumentNotesError']: Space_Allow_with_Trim(value.DocumentNotes) } })
        }
    }

    // Check All Field Format is True Then Submit 
    const { DocFileNameError, DocumentNotesError, DocumentTypeIdError, File_Not_Selected, } = errors

    useEffect(() => {
        if (DocFileNameError === 'true' && DocumentNotesError === 'true' && DocumentTypeIdError === 'true' && File_Not_Selected === 'true') {
            Add_Documents();
        }
    }, [DocFileNameError, DocumentNotesError, DocumentTypeIdError, File_Not_Selected,])

    const handleChange = (e) => {
        setValue({
            ...value,
            [e.target.name]: e.target.value
        })
    }

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
                // console.log(data)
                setDocumentDropVal(Comman_changeArrayFormat(data, 'DocumentTypeID', 'Description'));
            }
            else {
                setDocumentDropVal([])
            }
        })
    };

    const Add_Documents = (id) => {
        var formdata = new FormData();
        // multiple file upload <----
        for (let i = 0; i < selectedFile.length; i++) {
            formdata.append("File", selectedFile[i])
            // console.log(selectedFile[i])
        }
        // single file upload <---
        // formdata.append("File", selectedFile);
        const values = EncryptedList(JSON.stringify(value));
        formdata.append("Data", values);
        AddDeleteUpadate_FormData(openPage === 'mastername' ? 'MainMasterNameDocument/Insert_MainMasterNameDocument' : 'NameDocument/Insert_NameDocument', formdata)
            .then((res) => {
                if (res.success) {
                    get_Documentdata(nameID, MasterNameID);
                    setErrors({
                        'DocFileNameError': '', 'DocumentNotesError': '', 'DocumentTypeIdError': '', 'File_Not_Selected': '',
                    })
                    get_Name_Count(nameID);
                    setModal(false)
                    toastifySuccess(res.Message);
                    reset();
                    setSelectedFileName([])
                    setSelectedFile([])
                } else {
                    // setErrors({
                    //     ...errors,
                    //     ['DocFileNameError']: '',
                    // })
                    console.log("something Wrong");
                }
            })
            .catch(err => console.log(err))
    }

    const Update_Documents = () => {
        AddDeleteUpadate('IncidentDocumentManagement/Update_IncidentDocManagement', value).then((res) => {
            toastifySuccess(res.Message);
            setModal(false);
            get_Documentdata(nameID, MasterNameID);
            reset();
        })
    }

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




    const escFunction = useCallback((event) => {
        if (event.key === "Escape") {
            reset();
        }
    }, []);

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);
        return () => {
            document.removeEventListener("keydown", escFunction, false);
        };
    }, [escFunction]);


    const closeModal = () => {
        reset();
        setModal(false);
        setSelectedFileName([]); setSelectedFile([]);
    }
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
                                                <legend style={{ fontWeight: 'bold' }}>Documents Management</legend>
                                                <div className="row">
                                                    <div className="col-12">
                                                        <div className="row">
                                                            <div class="col-6 col-md-6  col-lg-6 mt-1">
                                                                <div className="text-field">
                                                                    <input type="text" className='requiredColor' name='DocFileName' value={value.DocFileName} onChange={handleChange} required />
                                                                    <label className=''>Documents Name</label>
                                                                    {errors.DocFileNameError !== 'true' ? (
                                                                        <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DocFileNameError}</span>
                                                                    ) : null}
                                                                </div>
                                                            </div>
                                                            <div class="col-6 col-md-6  col-lg-6  dropdown__box">
                                                                <Select
                                                                    name='DocumentTypeId'
                                                                    styles={colourStyles}
                                                                    value={documentDrpVal?.filter((obj) => obj.value === value?.DocumentTypeId)}
                                                                    isClearable
                                                                    options={documentDrpVal}
                                                                    onChange={(e) => ChangeDropDown(e, 'DocumentTypeId')}
                                                                    placeholder="Select.."
                                                                />
                                                                <label htmlFor='' >Document Type</label>
                                                                {errors.DocumentTypeIdError !== 'true' ? (
                                                                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DocumentTypeIdError}</span>
                                                                ) : null}
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
                                    <div className="btn-box text-right mr-1 mb-2">
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

export default Documents_Add_Up

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