import React from 'react'
import { useState } from 'react';
import Select from "react-select";
import DatePicker from "react-datepicker";
import { Decrypt_Id_Name, EncryptedList, getShowingMonthDateYear } from '../../../../../Common/Utility';
import { Carousel } from 'react-responsive-carousel';
import defualtImage from '../../../../../../img/uploadImage.png'
import { toastifyError, toastifySuccess } from '../../../../../Common/AlertMsg';
import { Link, useLocation } from 'react-router-dom';
import { AddDeleteUpadate, AddDeleteUpadate_FormData, fetchPostData } from '../../../../../hooks/Api';
import { useEffect } from 'react';
import { useContext } from 'react';
import { AgencyContext } from '../../../../../../Context/Agency/Index';
import DeletePopUpModal from '../../../../../Common/DeleteModal';

const MobileInformation = ({ get_Property_Data }) => {

    const useQuery = () => new URLSearchParams(useLocation().search);
    let openPage = useQuery().get('page');

    const { setUpdateCount, updateCount, setChangesStatus } = useContext(AgencyContext)
    const [destoryDate, setdestoryDate] = useState();
    const [multiImage, setMultiImage] = useState([])
    const [imageid, setImageId] = useState('');
    const startRef = React.useRef();
    const [propertyID, setPropertyID] = useState('');
    const [masterPropertyID, setMasterPropertyID] = useState('');
    const [Editval, setEditval] = useState([]);
    const [loder, setLoder] = useState(false);

    const [value, setValue] = useState({
        'PropertyID': ('PropertyID'),
        'DestroyDtTm': '',
        'IsEvidence': '',
        'IsSendToPropertyRoom': '',
        'IsPropertyRecovered': '',
        'PropertyTag': '',
        'NICB': '',
        'Description': '',
    })

    useEffect(() => {
        // if (sessionStorage.getItem('PropertyID')) {
            if (('PropertyID')) {
            GetSingleData();
        } else {
            // Reset();
        }
    }, [updateCount, propertyID])

    const GetSingleData = () => {
        const val = {
            'PropertyID': ('PropertyID') ,
        }
        fetchPostData('Property_FRW/GetSingleData_Property_FRW', val).then((res) => {
            if (res.length > 0) { setEditval(res) }
            else { toastifyError("blank Array"); setEditval([]) }
        })
    }

    useEffect(() => {
        console.log(Editval)
        if (Editval) {
            setValue({
                ...value,
                // checkbox
                'Description': Editval[0]?.Description,
                'IsPropertyRecovered': Editval[0]?.IsPropertyRecovered,
                'IsSendToPropertyRoom': Editval[0]?.IsSendToPropertyRoom,
                'IsEvidence': Editval[0]?.IsEvidence,
                'DestroyDtTm': Editval[0]?.DestroyDtTm,
            })
            get_Name_MultiImage();
        } else {
            // setValue({
            //     ...value,
            //     // checkbox
            //     'Description': '',
            //     'IsPropertyRecovered': '',
            //     'IsSendToPropertyRoom': '',
            //     'IsEvidence': '',
            //     'DestroyDtTm': '',
            // })
        }
    }, [Editval])

    const HandleChanges = (e) => {
        if (e.target.name === 'IsEvidence' || e.target.name === 'IsSendToPropertyRoom' || e.target.name === 'IsPropertyRecovered') {
            setValue({
                ...value,
                [e.target.name]: e.target.checked
            })
        } else {
            setValue({
                ...value,
                [e.target.name]: e.target.value
            })
        }
    }

    const update_Property = () => {
        AddDeleteUpadate('Property_FRW/Update_PropertyMiscellaneousInformation', value).then((res) => {
            if (res.success) {
                toastifySuccess(res.Message)
            }
        })
    }

    //-------------------------Image---------------------------
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
            'PropertyID': ('PropertyID'),
            'CreatedByUserFK': ('PINID'), 
        }
        const values = EncryptedList(JSON.stringify(val));
        var formdata = new FormData();
        formdata.append("PropertyPhoto", image);
        formdata.append("Data", values);
        AddDeleteUpadate_FormData('Property_FRW/Insert_Property_FRWPhoto', formdata)
            .then((res) => {
                if (res.success) {
                    get_Name_MultiImage(propertyID)
                }
            })
            .catch(err => console.log(err))
    }

    const get_Name_MultiImage = () => {
        const val = {
            'PropertyID': ('PropertyID') ,
        }
        fetchPostData('Property_FRW/GetData_Property_FRWPhoto', val)
            .then((res) => {
                if (res) { setMultiImage(res); }
                else { setMultiImage(); }
            })
    }

    const delete_Image_File = (e) => {
        const value = {
            'PhotoID': imageid,
            'DeletedByUserFK': ('PINID'), 
        }
        AddDeleteUpadate('Property_FRW/Delete_Property_FRWPhoto', value).then((data) => {
            if (data.success) {
                get_Name_MultiImage(propertyID);
                GetSingleData();
            } else {
                toastifyError(data?.Message);
            }
        });
    }

    const onKeyDown = (e) => {
        if (e.keyCode === 9 || e.which === 9) {
            startRef.current.setOpen(false);
        }
    };

    return (
        <>
            <div className="col-12 " id='display-not-form '>
                <div className="col-12 col-md-12 mt-2 pt-1 p-0 px-1" >
                    <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center">
                        <p className="p-0 m-0" style={{ fontSize: '18px' }}>Miscellaneous Information</p>
                    </div>
                </div>
                <div className="row px-3">
                    <div className="col-12 col-md-12 col-lg-10  p-0" >
                        <div className="row">
                            <div className="col-3  col-md-3 col-lg-4 mt-2" >
                                <div className="text-mobile">
                                    <input type="text" name='PropertyTag' id='PropertyTag' value={value?.PropertyTag} className='readonlyColor' readOnly required />
                                    <label htmlFor="">Property Tag</label>
                                </div>
                            </div>
                            <div className="col-3  col-md-3 col-lg-4  mt-1 pt-1" >
                                <div className="text-mobile">
                                    <input type="text" name='NICB' id='NICB' value={value?.NICB} className='readonlyColor' readOnly required />
                                    <label htmlFor="">NICB Id</label>
                                </div>
                            </div>
                            <div className="col-6 col-md-6 col-lg-4 mt-1 ">
                                <div className=" text__dropdwon">
                                    <DatePicker
                                        id='DestroyDtTm'
                                        name='DestroyDtTm'
                                        ref={startRef}
                                        onKeyDown={onKeyDown}
                                        className='readonlyColor name-datepicker'
                                        onChange={(date) => { setdestoryDate(date); setValue({ ...value, ['DestroyDtTm']: date ? getShowingMonthDateYear(date) : null }) }}
                                        dateFormat="MM/dd/yyyy HH:mm"
                                        timeInputLabel
                                        isClearable={value?.DestroyDtTm ? true : false}
                                        selected={destoryDate}
                                        placeholderText={value?.DestroyDtTm ? value.DestroyDtTm : 'Select...'}
                                        showTimeSelect
                                        timeIntervals={1}
                                        timeCaption="Time"
                                        readOnly
                                        required
                                        autoComplete="nope"
                                        showYearDropdown
                                        showMonthDropdown
                                        dropdownMode="select"
                                    />
                                    <label htmlFor="" className='pt-1'>Destory Date</label>
                                </div>
                            </div>
                            <div className="col-12  col-md-12 col-lg-8 mt-1" >
                                <div className=" text__dropdwon">
                                    <textarea name='Description' id="Description" value={value?.Description} onChange={HandleChanges} cols="30" rows='1' className="form-control  " >
                                    </textarea>
                                    <label htmlFor="" className='pt-1'>Description</label>
                                </div>
                            </div>
                            <div className="col-2 col-md-3 col-lg-2 mt-4">
                                <div class="form-check " style={{ fontSize: '18px' }}>
                                    <input class="form-check-input" name='IsEvidence' value={value?.IsEvidence} checked={value?.IsEvidence} onChange={HandleChanges} type="checkbox" id="flexCheckDefault" />
                                    <label class="form-check-label" for="flexCheckDefault" >
                                        Evidense
                                    </label>
                                </div>
                            </div>
                            <div className="col-5 col-md-4 col-lg-4  mt-2">
                                <div class="form-check  " style={{ fontSize: '18px' }}>
                                    <input class="form-check-input" name='IsSendToPropertyRoom' value={value?.IsSendToPropertyRoom} checked={value?.IsSendToPropertyRoom} onChange={HandleChanges} type="checkbox" id="flexCheckDefault" />
                                    <label class="form-check-label" for="flexCheckDefault1">
                                        Send To Property Room
                                    </label>
                                </div>
                            </div>
                            <div className="col-5 col-md-4 col-lg-3 mt-2">
                                <div class="form-check " style={{ fontSize: '18px' }}>
                                    <input class="form-check-input" name='IsPropertyRecovered' value={value?.IsPropertyRecovered} checked={value?.IsPropertyRecovered} onChange={HandleChanges} type="checkbox" id="flexCheckDefault" />
                                    <label class="form-check-label" for="flexCheckDefault2">
                                        Property Recovered
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className=" col-4 col-md-4 col-lg-2 pt-1">
                        <div className="img-box" >
                            <Carousel autoPlay={true} className="carousel-style" showArrows={true} showThumbs={false} showStatus={false} >
                                {
                                    multiImage.length > 0 ?
                                        multiImage?.map((item, index) => (
                                            <div key={index}>
                                                <img src={item.Photo} style={{ height: '190px' }} />
                                                <div className='box' style={{ background: 'red' }}>
                                                    <a type='button' data-toggle="modal" data-target="#DeleteModal" className="legend-img " onClick={(e) => { setImageId(item.PhotoID); }} >
                                                        <i className='fa fa-close' ></i>
                                                    </a>
                                                </div>
                                            </div>
                                        ))
                                        :
                                        <div key='test'>
                                            <img src={defualtImage} style={{ height: '200px' }} />
                                        </div>
                                }
                            </Carousel>
                        </div>
                        <div className="row">
                            {
                               ('PropertyID') ?
                                    <>
                                        <div className="col-md-12 text-center " >
                                            <label className='pers-img mt-1'> <i className='fa fa-upload'></i>
                                                <input type="file" size="60" onChange={get_Image_File} />
                                            </label>
                                        </div>
                                    </>
                                    : <></>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12  text-right  p-0 mt-4 mr-3">
                <button type="button" class="btn btn-sm btn-success mr-1 new-button" onClick={() => { update_Property(); }}>Update</button>
                <Link to={"/mobile-property"}>
                    <button type="button" class="btn btn-sm btn-success mr-1 new-button" data-dismiss="modal" > Close </button>
                </Link>
            </div>
            <DeletePopUpModal func={delete_Image_File} />
        </>
    )
}

export default MobileInformation