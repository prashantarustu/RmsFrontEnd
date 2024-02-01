import React, { useCallback, useRef, useState } from 'react'
import Select from "react-select";
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import { fetchData, fetchPostData, AddDeleteUpadate, AddDeleteUpadate_FormData } from '../../../../hooks/Api';
import { Decrypt_Id_Name, EncryptedList } from '../../../../Common/Utility';
import { useEffect } from 'react';
import { Comman_changeArrayFormat } from '../../../../Common/ChangeArrayFormat';
import { useLocation } from 'react-router-dom';
import { RequiredFieldIncident } from '../../../Utility/Personnel/Validation';
import { Carousel } from 'react-responsive-carousel';
import defualtImage from '../../../../../img/uploadImage.png'
import DeletePopUpModal from '../../../../Common/DeleteModal';
import { useContext } from 'react';
import { AgencyContext } from '../../../../../Context/Agency/Index';

const Smt_Add_Up = (props) => {

    const { nameID, MasterNameID, LoginPinID, LoginAgencyID, status, setStatus, setSmtId, smtId, modal, setModal, get_Smt_Data, updateStatus } = props
    const useQuery = () => new URLSearchParams(useLocation().search);
    let openPage = useQuery().get('page');
    const { get_Name_Count } = useContext(AgencyContext)

    const [SMTLocation, setSMTLocation] = useState([]);
    const [SMTType, setSMTType] = useState([]);
    const [Editval, setEditval] = useState();
    const [modalStatus, setModalstatus] = useState(false)

    //---------------------Images------------------------------------------------
    const [arrestMultiImg, setArrestMultiImg] = useState([])
    const [ID, setID] = useState();

    const [value, setValue] = useState({
        'SMTID': '',
        'SMTTypeID': '',
        'SMTLocationID': '',
        'SMT_Description': '',
        'NameID': '',
        'MasterNameID': '',
        'CreatedByUserFK': '',
    })

    const [errors, setErrors] = useState({
        'SMTTypeIDErrors': '', 'SMTLocationIDErrors': '', 'SMT_DescriptionErrors': '',
    })

    useEffect(() => {
        setValue(pre => { return { ...pre, 'CreatedByUserFK': LoginPinID, 'MasterNameID': MasterNameID, 'NameID': nameID } });
    }, [nameID, MasterNameID, updateStatus]);

    useEffect(() => {
        if (smtId && status) {
            GetSingleData()
        }
    }, [smtId])

    const GetSingleData = () => {
        const val = { 'SMTID': smtId }
        fetchPostData('NameSMT/GetSingleData_NameSMT', val)
            .then((res) => {
                if (res) setEditval(res)
                else setEditval()
            })
    }

    useEffect(() => {
        if (smtId) {
            get_Arrest_MultiImage(smtId)
            setValue({
                ...value,
                'SMTID': smtId,
                'SMTTypeID': Editval[0]?.SMTTypeID,
                'SMTLocationID': Editval[0]?.SMTLocationID,
                'SMT_Description': Editval[0]?.SMT_Description,
                'ModifiedByUserFK': LoginPinID,
            })
            get_SMTLocationID(Editval[0]?.SMTTypeID)
        }
        else {
            setValue({
                ...value,
                'SMTTypeID': '', 'SMTLocationID': '', 'SMT_Description': '',
            })
        }
    }, [Editval])

    const check_Validation_Error = (e) => {
        if (RequiredFieldIncident(value.SMTLocationID)) {
            setErrors(prevValues => { return { ...prevValues, ['SMTLocationIDErrors']: RequiredFieldIncident(value.SMTLocationID) } })
        }
        if (RequiredFieldIncident(value.SMTTypeID)) {
            setErrors(prevValues => { return { ...prevValues, ['SMTTypeIDErrors']: RequiredFieldIncident(value.SMTTypeID) } })
        }
        if (RequiredFieldIncident(value.SMT_Description)) {
            setErrors(prevValues => { return { ...prevValues, ['SMT_DescriptionErrors']: RequiredFieldIncident(value.SMT_Description) } })
        }
    }

    // Check All Field Format is True Then Submit 
    const { SMTTypeIDErrors, SMTLocationIDErrors, SMT_DescriptionErrors } = errors

    useEffect(() => {
        if (SMTTypeIDErrors === 'true' && SMTLocationIDErrors === 'true' && SMT_DescriptionErrors === 'true') {
            if (smtId) updateSmt()
            else Add_Type()
        }
    }, [SMTTypeIDErrors, SMTLocationIDErrors, SMT_DescriptionErrors])

    const reset = () => {
        setValue({
            ...value,
            'SMTTypeID': '', 'SMTLocationID': '', 'SMT_Description': '',
        });
        setErrors({
            ...errors,
            'SMTTypeIDErrors': '', 'SMTLocationIDErrors': '', 'SMT_DescriptionErrors': '',
        });
        setArrestMultiImg([]); setSmtId('');
    }

    useEffect(() => {
        // get_SMTLocationID();
        get_SMTTypeID(LoginAgencyID);
    }, [LoginAgencyID])

    const get_SMTLocationID = (id) => {
        const val = {
            AgencyID: LoginAgencyID,
            SMTTypeID: id
        }
        fetchPostData('SMTLocations/GetDataDropDown_SMTLocations', val).then((data) => {
            if (data) {
                setSMTLocation(Comman_changeArrayFormat(data, 'SMTLocationID', 'Description'))
            } else {
                setSMTLocation([]);
            }
        })
    }

    const get_SMTTypeID = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID,
        }
        fetchPostData('SMTTypes/GetDataDropDown_SMTTypes', val).then((data) => {
            if (data) {
                setSMTType(Comman_changeArrayFormat(data, 'SMTTypeID', 'Description'))
            } else {
                setSMTType([]);
            }
        })
    }

    const ChangeDropDown = (e, name) => {
        if (e) {
            if (name === 'SMTTypeID') {
                get_SMTLocationID(e.value)
                setValue({ ...value, ['SMTTypeID']: e.value, ['SMTLocationID']: '' })
            } else {
                setValue({
                    ...value,
                    [name]: e.value
                })
            }
        } else {
            if (name === 'SMTTypeID') {
                setValue({ ...value, ['SMTLocationID']: '', ['SMTTypeID']: '' });
                setSMTLocation([])
            } else {
                setValue({
                    ...value,
                    [name]: null
                })
            }
        }
    }

    const handleChange = (e) => {
        setValue({
            ...value,
            [e.target.name]: e.target.value
        })
    }

    const Add_Type = (e) => {
        AddDeleteUpadate(openPage === 'mastername' ? 'MainMasterNameSMT/Insert_MainMasterNameSMT' : 'NameSMT/Insert_NameSMT', value)
            .then((res) => {
                console.log(res)
                if (res.SMTID) {
                    setSmtId(res.SMTID);
                }
                get_Smt_Data(nameID, MasterNameID);
                get_Name_Count(nameID);
                toastifySuccess(res.Message);
                setErrors({ ...errors, ['SMT_DescriptionErrors']: '' });
                // setModal(false);
                // reset();
                // setSmtId('')
            })
    }

    const updateSmt = () => {
        AddDeleteUpadate('NameSMT/Update_NameSMT', value).then((res) => {
            toastifySuccess(res.Message);
            get_Smt_Data(nameID, MasterNameID);
            setErrors({ ...errors, ['SMT_DescriptionErrors']: '' });
            // setModal(false);
            // setSmtId('');
        })
    }

    const closeModal = () => {
        reset();
        // get_Arrest_MultiImage('')
    }
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
    //---------------------------------------- Image ------------------------------------------------
    const get_Arrest_MultiImage = (smtId) => {
        const val = {
            'SMTID': smtId
        }
        fetchPostData('NameSMT/GetData_NameSMTPhoto', val)
            .then((res) => {
                console.log(res)
                if (res) { setArrestMultiImg(res); }
                else { setArrestMultiImg(); }
            })
    }

    const get_Image_File = (e) => {
        try {
            let currentFileType = e.target.files[0].type;
            let checkPng = currentFileType.indexOf("png");
            let checkJpeg = currentFileType.indexOf("jpeg");
            let checkJpg = currentFileType.indexOf("jpg");
            if (checkPng !== -1 || checkJpeg !== -1 || checkJpg !== -1) {
                // setImage(e.target.files[0]);
                upload_Image_File(e.target.files[0]);
            } else {
                toastifyError("Error: Invalid image file!");
            }
        } catch (error) {
            console.log(error);
        }
    }

    const upload_Image_File = (image) => {
        const val = {
            'SMTID': smtId,
            'CreatedByUserFK': LoginPinID,
        }
        const values = EncryptedList(JSON.stringify(val));
        var formdata = new FormData();
        formdata.append("Photo", image);
        formdata.append("Data", values);
        AddDeleteUpadate_FormData('NameSMT/InsertNameSMT_Photo', formdata)
            .then((res) => {
                console.log(res)
                if (res.success) {
                    get_Arrest_MultiImage(smtId)
                }
            })
            .catch(err => console.log(err))
    }

    const delete_Image_File = (e) => {
        e.preventDefault()
        const value = {
            'ID': ID,
            'DeletedByUserFK': LoginPinID
        }
        AddDeleteUpadate('NameSMT/Delete_NameSMTPhoto', value).then((data) => {
            if (data.success) {
                toastifySuccess(data?.Message);
                // GetSingleData(ID);
                setModalstatus(false)
                get_Arrest_MultiImage(smtId)
            } else {
                toastifyError(data?.Message);
            }
        });
    }

    // Custom Style
    const colourStyles = {
        control: (styles) => ({
            ...styles, backgroundColor: "#fce9bf",
            height: 20,
            minHeight: 30,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };

    // custuom style withoutColor
    const customStylesWithOutColor = {
        control: base => ({
            ...base,
            height: 20,
            minHeight: 30,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),

    };

    return (
        <>
            {
                modal ?
                    <>
                        <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="SMTModal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="false">
                            <div class="modal-dialog modal-dialog-centered modal-lg" role="document" >
                                <div class="modal-content">
                                    <div class="modal-body">
                                        <div className="m-1 mt-3">
                                            <fieldset style={{ border: '1px solid gray' }}>
                                                <legend style={{ fontWeight: 'bold' }}>SMT</legend>
                                                <div className="row">
                                                    <div className="col-12">
                                                        <div className="row">
                                                            <div className="col-12 col-md-12 col-lg-9 pt-2 " >
                                                                <div className="row">
                                                                    <div className="col-12 col-md-12 col-lg-6 ">
                                                                        <div className=" dropdown__box">
                                                                            <Select
                                                                                name='SMTTypeID'
                                                                                styles={colourStyles}
                                                                                value={SMTType?.filter((obj) => obj.value === value?.SMTTypeID)}
                                                                                isClearable
                                                                                options={SMTType}
                                                                                onChange={(e) => ChangeDropDown(e, 'SMTTypeID')}
                                                                                placeholder="Select..."
                                                                            />
                                                                            <label htmlFor="">SMT Type</label>
                                                                            {errors.SMTTypeIDErrors !== 'true' ? (
                                                                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.SMTTypeIDErrors}</span>
                                                                            ) : null}
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-12 col-md-12 col-lg-6 ">
                                                                        <div className=" dropdown__box">
                                                                            <Select
                                                                                name='SMTLocationID'
                                                                                styles={colourStyles}
                                                                                value={SMTLocation?.filter((obj) => obj.value === value?.SMTLocationID)}
                                                                                isClearable
                                                                                options={SMTLocation}
                                                                                onChange={(e) => ChangeDropDown(e, 'SMTLocationID')}
                                                                                placeholder="Select..."
                                                                            />
                                                                            <label htmlFor="">SMT Location</label>
                                                                            {errors.SMTLocationIDErrors !== 'true' ? (
                                                                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.SMTLocationIDErrors}</span>
                                                                            ) : null}
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-12 col-md-12 col-lg-12 mt-3">
                                                                        <div className="text-field">
                                                                            <textarea name="SMT_Description" className='requiredColor' onChange={handleChange} id="SMT_Description" value={value.SMT_Description} cols="30" rows="6" required></textarea>
                                                                            <label>Description</label>
                                                                            {errors.SMT_DescriptionErrors !== 'true' ? (
                                                                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.SMT_DescriptionErrors}</span>
                                                                            ) : null}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-5 col-md-4 col-lg-3 pt-3">
                                                                <div className="img-box" >
                                                                    <Carousel autoPlay={true} className="carousel-style" showArrows={true} showThumbs={false} showStatus={false} >
                                                                        {
                                                                            arrestMultiImg.length > 0 ?
                                                                                arrestMultiImg?.map((item, index) => (
                                                                                    <div key={index}>
                                                                                        <img src={item.Photo} style={{ height: '190px' }} />
                                                                                        <div className='box' style={{ background: 'red' }}>
                                                                                            <a type='button' data-toggle="modal" data-target="#myModal2" className="legend-img " onClick={(e) => { setID(item.ID); setModalstatus(true) }} >
                                                                                                <i className='fa fa-close' ></i>
                                                                                            </a>
                                                                                        </div>
                                                                                    </div>
                                                                                ))
                                                                                :
                                                                                <div key='test'>
                                                                                    <img src={defualtImage} style={{ height: '190px' }} />
                                                                                </div>
                                                                        }
                                                                    </Carousel>
                                                                </div>
                                                                <div className="row">
                                                                    {
                                                                        smtId ?
                                                                            <>
                                                                                <div className="col-md-12 text-center " >
                                                                                    <label className='pers-img mt-1'> <i className='fa fa-upload'></i>
                                                                                        <input type="file" size="60" onChange={get_Image_File} />
                                                                                    </label>
                                                                                </div>
                                                                            </>
                                                                            :
                                                                            <></>
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </fieldset>
                                        </div>
                                    </div>
                                    <div className="btn-box text-right  mr-1 mb-2">
                                        {
                                            smtId ?
                                                <button type="button" onClick={(e) => { check_Validation_Error(); }} className="btn btn-sm btn-success mr-1">Update</button>
                                                :
                                                <button type="button" onClick={(e) => { check_Validation_Error(); }} class="btn btn-sm btn-success mr-1">Save</button>
                                        }
                                        <button type="button" data-dismiss="modal" onClick={() => { closeModal(); setArrestMultiImg([]) }} class="btn btn-sm btn-success mr-1">Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {
                            modalStatus ?
                                <div class="modal" id="myModal2" style={{ background: "rgba(0,0,0, 0.5)", transition: '0.5s' }} data-backdrop="false">
                                    <div class="modal-dialog">
                                        <div class="modal-content">
                                            <div className="box text-center py-5">
                                                <h5 className="modal-title mt-2" id="exampleModalLabel">Do you want to Delete ?</h5>
                                                <div className="btn-box mt-3">
                                                    <button type="button" onClick={delete_Image_File} className="btn btn-sm text-white" style={{ background: "#ef233c" }} >Delete</button>
                                                    <button type="button" onClick={() => { closeModal(); setModalstatus(false); }} className="btn btn-sm btn-secondary ml-2"> Cancel</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                :
                                <></>
                        }
                    </>
                    :
                    <></>
            }
        </>
    )
}

export default Smt_Add_Up