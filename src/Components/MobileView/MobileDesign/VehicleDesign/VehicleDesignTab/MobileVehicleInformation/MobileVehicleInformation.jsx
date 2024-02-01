import React, { useEffect } from 'react'
import Select from "react-select";
import DatePicker from "react-datepicker";
import { useState } from 'react';
import { Decrypt_Id_Name, EncryptedList, getShowingDateText, getShowingMonthDateYear } from '../../../../../Common/Utility';
import { Carousel } from 'react-responsive-carousel';
import defualtImage from '../../../../../../img/uploadImage.png'
import { Comman_changeArrayFormat } from '../../../../../Common/ChangeArrayFormat';
import { AddDeleteUpadate, AddDeleteUpadate_FormData, fetchPostData } from '../../../../../hooks/Api';
import { toastifyError, toastifySuccess } from '../../../../../Common/AlertMsg';
import { Link, useLocation } from 'react-router-dom';
import DeletePopUpModal from '../../../../../Common/DeleteModal';

const MobileVehicleInformation = () => {
    const useQuery = () => new URLSearchParams(useLocation().search);
    let openPage = useQuery().get('page');
    const [destoryDate, setdestoryDate] = useState();
    const [PrimaryOfficerID, setprimaryOfficerID] = useState([])
    const [vehicleID, setVehicleID] = useState('')
    const [masterPropertyID, setMasterPropertyID] = useState('');
    const [Editval, setEditval] = useState();
    const [VehicleMultiImg, setVehicleMultiImg] = useState([])
    const [imageid, setImageId] = useState('');

    const [value, setValue] = useState({
        'VehicleID': ('VehicleID'),
        'IsEvidence': '',
        'IsPropertyRecovered': '',
        'IsImmobalizationDevice': '',
        'IsEligibleForImmobalization': '',
        'Description': '',
        'DestroyDtTm': '',
        'PrimaryOfficerID': '', 'TagID': '',
        'NICBID': '',
    })
    useEffect(() => {
        console.log(Editval)
        if (Editval) {
            setValue({
                ...value,
                // checkbox
                'NICBID': Editval[0]?.NICBID,
                'InProfessionOf': Editval[0]?.InProfessionOf,
                'Description': Editval[0]?.Description,
                'TagID': Editval[0]?.TagID,
                'PrimaryOfficerID': Editval[0]?.PrimaryOfficerID,
                'IsEvidence': Editval[0]?.IsEvidence,
                'IsEligibleForImmobalization': Editval[0]?.IsEligibleForImmobalization,
                'IsImmobalizationDevice': Editval[0]?.IsImmobalizationDevice,
                'IsPropertyRecovered': Editval[0]?.IsPropertyRecovered,
                'DestroyDtTm': Editval[0]?.DestroyDtTm,
            })
            get_Vehicle_MultiImage();
            setdestoryDate(Editval[0]?.DestroyDtTm ? new Date(Editval[0]?.DestroyDtTm) : '');
        }
    }, [Editval])

    //-----Gingle-Data-------------------------
    useEffect(() => {
        if (('VehicleID')) {
            GetSingleData();
        }
    }, [vehicleID])

    const GetSingleData = () => {
        const val = {
            'VehicleID': ('VehicleID') ,        
        }
        fetchPostData('PropertyVehicle_FRW/GetSingleData_Vehicle_FRW', val).then((res) => {
            if (res) {
                setEditval(res);
            }
            else { setEditval([]) }
        })
    }
    useEffect(() => {
        get_Head_Of_Agency();
    }, [])
    const get_Head_Of_Agency = () => {
        const val = {
            AgencyID: ('AgencyID'), 
        }
        fetchPostData('DropDown/GetData_HeadOfAgency', val).then((data) => {
            if (data) {
                setprimaryOfficerID(Comman_changeArrayFormat(data, 'PINID', 'HeadOfAgency'));
            }
            else {
                setprimaryOfficerID([])
            }
        })
    };

    const HandleChanges = (e) => {
        if (e.target.name === 'IsEvidence' || e.target.name === 'IsPropertyRecovered' || e.target.name === 'IsImmobalizationDevice' || e.target.name === 'IsEligibleForImmobalization') {
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
    const ChangeDropDown = (e, name) => {
        setValue({
            ...value,
            [name]: e.value
        })
    }

    const Update_Vehicle = () => {
        AddDeleteUpadate('PropertyVehicle_FRW/Update_AdditionalInfo_Vehicle_FRW', value).then((res) => {
            if (res.success) {
                toastifySuccess(res.Message);
            } else {
                toastifyError('Error')
            }
        })
    }

    //---------------------------------------- Image Insert ------------------------------------------------
    const get_Vehicle_MultiImage = (vehicleID) => {
        const val = {
            'VehicleID': ('VehicleID') ,
        }
        fetchPostData('PropertyVehicle_FRW/GetData_VehiclePhoto_FRW', val)
            .then((res) => {
                if (res) { setVehicleMultiImg(res); }
                else { setVehicleMultiImg(); }
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
            'VehicleID': ('VehicleID') ,
            'CreatedByUserFK': ('PINID'),
        }
       
        const values = EncryptedList(JSON.stringify(val));
        var formdata = new FormData();
        formdata.append("Vehiclephotopath", image);
        formdata.append("Data", values);
        AddDeleteUpadate_FormData('PropertyVehicle_FRW/Insert_PropertyVehiclePhotoFRW', formdata)
            .then((res) => {
                if (res.success) {
                    get_Vehicle_MultiImage(vehicleID)
                }
            })
            .catch(err => console.log(err))
    }

    const delete_Image_File = (e) => {
        e.preventDefault()
        const value = {
            'PhotoID': imageid,
            'DeletedByUserFK': ('PINID'),
        }
        AddDeleteUpadate('PropertyVehicle_FRW/Delete_VehiclePhoto_FRW', value).then((data) => {
            if (data.success) {
                toastifySuccess(data?.Message);
                get_Vehicle_MultiImage(vehicleID);
                GetSingleData(vehicleID);
            } else {
                toastifyError(data?.Message);
            }
        });
    }

    const customStylesWithOutColor = {
        control: base => ({
            ...base,
            height: 20,
            minHeight: 36,
            fontSize: 18,
            margintop: 2,
            boxShadow: 0,
        }),
    };

    const startRef = React.useRef();
    const onKeyDown = (e) => {
        if (e.keyCode === 9 || e.which === 9) {
            startRef.current.setOpen(false);
        }
    };

    return (
        <>

            <div className="col-12 col-md-12 col-lg-12 p-0 ">
                <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                    <p className="p-0 m-0 d-flex align-items-center">
                        Additional Information
                    </p>
                </div>
                <div className="row mt-2">
                    <div className="col-lg-10">
                        <div className="row">
                            <div className="col-6 col-md-8 col-lg-6 mt-1">
                                <div className=" text__dropdwon">
                                    <Select
                                        name='PrimaryOfficerID'
                                        value={PrimaryOfficerID?.filter((obj) => obj.value === value?.PrimaryOfficerID)}
                                        styles={customStylesWithOutColor}
                                        options={PrimaryOfficerID}
                                        onChange={(e) => ChangeDropDown(e, 'PrimaryOfficerID')}
                                        isClearable
                                        placeholder="Select..."
                                    />
                                    <label htmlFor="" className='pt-1'> Primary Officer</label>
                                </div>
                            </div>
                            <div className="col-6 col-md-4 col-lg-6  " style={{ marginTop: '8px' }}>
                                <div class="text-mobile">
                                    <input type="text" name='InProfessionOf' id='InProfessionOf' onChange={HandleChanges} value={value?.InProfessionOf} className='readonlyColor' required readOnly />
                                    <label >In Possession Of</label>
                                </div>
                            </div>
                            <div className="col-3  col-md-3 col-lg-2  mt-3" >
                                <div className="text-mobile">
                                    <input type="text" name='TagID' id='TagID' value={value?.TagID} onChange={HandleChanges} className='readonlyColor' required />
                                    <label htmlFor="" className='pt-1'>Tag Id</label>
                                </div>
                            </div>
                            <div className="col-3  col-md-3 col-lg-2  mt-3" >
                                <div className="text-mobile">
                                    <input type="text" name='NICBID' id='NICBID' value={value?.NICBID} onChange={HandleChanges} className='readonlyColor' required />
                                    <label htmlFor="" className='pt-1'>NICB Id</label>
                                </div>
                            </div>
                            <div className="col-6 col-md-6 col-lg-3 " style={{ marginTop: '12px' }}>
                                <div className="text__dropdwon">
                                    <DatePicker
                                        id='DestroyDtTm'
                                        name='DestroyDtTm'
                                        ref={startRef}
                                        onKeyDown={onKeyDown}
                                        onChange={(date) => { setdestoryDate(date); setValue({ ...value, ['DestroyDtTm']: date ? getShowingMonthDateYear(date) : null }) }}
                                        dateFormat="MM/dd/yyyy HH:mm"
                                        timeInputLabel
                                        isClearable={value?.DestroyDtTm ? true : false}
                                        selected={destoryDate}
                                        placeholderText={value?.DestroyDtTm ? value.DestroyDtTm : 'Select...'}
                                        showTimeSelect
                                        timeIntervals={1}
                                        timeCaption="Time"
                                        className='readonlyColor name-datepicker'
                                        autoComplete="nope"
                                        showYearDropdown
                                        showMonthDropdown
                                        dropdownMode="select"
                                    />
                                    <label htmlFor="" className='pt-2'>Destory Date</label>
                                </div>
                            </div>
                            <div className="col-12  col-md-12 col-lg-5 mt-2 pt-1" >
                                <div className=" text__dropdwon">
                                    <textarea name='Description' id="Description" value={value?.Description} onChange={HandleChanges} cols="30" rows='1' className="form-control  " >
                                    </textarea>
                                    <label htmlFor="" className='pt-2'>Description</label>
                                </div>
                            </div>
                            <div className="col-2 col-md-6 col-lg-2 mt-3">
                                <div class="form-check ">
                                    <input class="form-check-input" name='IsEvidence' value={value?.IsEvidence} checked={value?.IsEvidence} onChange={HandleChanges} type="checkbox" id="flexCheckDefault" />
                                    <label class="form-check-label" for="flexCheckDefault">
                                        Evidense
                                    </label>
                                </div>
                            </div>
                            <div className="col-5 col-md-6 col-lg-3  mt-3">
                                <div class="form-check ">
                                    <input class="form-check-input" name='IsPropertyRecovered' value={value?.IsPropertyRecovered} checked={value?.IsPropertyRecovered} onChange={HandleChanges} type="checkbox" id="flexCheckDefault1" />
                                    <label class="form-check-label" for="flexCheckDefault1">
                                        Property Recovered
                                    </label>
                                </div>
                            </div>
                            <div className="col-5 col-md-6 col-lg-3 mt-3">
                                <div class="form-check ">
                                    <input class="form-check-input" name='IsImmobalizationDevice' value={value?.IsImmobalizationDevice} checked={value?.IsImmobalizationDevice} onChange={HandleChanges} type="checkbox" id="flexCheckDefault2" />
                                    <label class="form-check-label" for="flexCheckDefault2">
                                        Immobilization Device
                                    </label>
                                </div>
                            </div>
                            <div className="col-5 col-md-6 col-lg-4 mt-3">
                                <div class="form-check ">
                                    <input class="form-check-input" name='IsEligibleForImmobalization' value={value?.IsEligibleForImmobalization} checked={value?.IsEligibleForImmobalization} onChange={HandleChanges} type="checkbox" id="flexCheckDefault3" />
                                    <label class="form-check-label" for="flexCheckDefault3">
                                        Eligible For Immobilization
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className=" col-4 col-md-4 col-lg-2 pt-1">
                        <div className="img-box" style={{ marginTop: '-13px' }}>
                            <Carousel autoPlay={true} className="carousel-style" showArrows={true} showThumbs={false} showStatus={false} >
                                {
                                    VehicleMultiImg.length > 0 ?
                                        VehicleMultiImg?.map((item, index) => (
                                            <div key={index}>
                                                <img src={item.Photo} style={{ height: '170px' }} />
                                                <div className='box' style={{ background: 'red' }}>
                                                    <a type='button' data-toggle="modal" data-target="#DeleteModal" className="legend-img " onClick={(e) => { setImageId(item.PhotoID) }} >
                                                        <i className='fa fa-close' ></i>
                                                    </a>
                                                </div>
                                            </div>
                                        ))
                                        :
                                        <div key='test'>
                                            <img src={defualtImage} style={{ height: '170px' }} />
                                        </div>
                                }
                            </Carousel>
                            {/* <Carousel autoPlay={true} className="carousel-style" showArrows={true} showThumbs={false} showStatus={false} >
                                {
                                    VehicleMultiImg.length > 0 ?
                                        VehicleMultiImg?.map((item, index) => (
                                            <div key={index}>
                                                <img src={item.Photo} style={{ height: '170px' }} />
                                                <div className='box' style={{ background: 'red' }}>
                                                    <a type='button' data-toggle="modal" data-target="#DeleteModal" className="legend-img " onClick={(e) => { setImageId(item.PhotoID) }} >
                                                        <i className='fa fa-close' ></i>
                                                    </a>
                                                </div>
                                            </div>
                                        ))
                                        :
                                        <div key='test'>
                                            <img src={defualtImage} style={{ height: '170px' }} />
                                        </div>
                                }
                            </Carousel> */}
                        </div>
                        <div className="row">
                            {
                            sessionStorage.getItem('VehicleID') ?
                                    <>
                                        <div className="col-md-12 text-center " >
                                            <label className='pers-img'> <i className='fa fa-upload'></i>
                                                <input type="file" size="60"  onChange={get_Image_File} />
                                            </label>
                                        </div>
                                    </>
                                    : <></>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12  text-right mt-4" style={{ marginBottom: '-10px' }}>
                <button type="button" className="btn btn-sm btn-success  new-button mr-1" onClick={(e) => { Update_Vehicle(); }} >Update</button>
                {/* <button type="button" className="btn btn-sm btn-success  mr-1  new-button" data-dismiss="modal" >Close</button> */}
                <Link to={"/mobile-vehicle"}>
                    <button type="button" class="btn btn-sm btn-success mr-1 new-button" data-dismiss="modal"> Close </button>
                </Link>
            </div>
            <DeletePopUpModal func={delete_Image_File} />
        </>
    )
}

export default MobileVehicleInformation