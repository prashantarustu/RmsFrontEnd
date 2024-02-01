import React, { useState } from 'react'
import { getShowingMonthDateYear } from '../../../../Common/Utility';
import Select from "react-select";
import DatePicker from "react-datepicker";
import Location from '../../../../Location/Location';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const TowingVehicle = () => {

    const useQuery = () => new URLSearchParams(useLocation().search);
    let openPage = useQuery().get('page');
    const [value, setValue] = useState();
    const [towedDate, setTowedDate] = useState();
    const [releasedDate, setReleasedDate] = useState();
    const [NreleasedDate, setNReleasedDate] = useState();
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
            <div className="col-12 col-md-12 pt-2 p-0" >
                <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center ">
                    <p className="p-0 m-0">Towing Information</p>
                </div>
                <div className="col-12 col-md-12 col-lg-12">
                    <div className="row  px-0">
                        <div className="col-3 col-md-3 col-lg-3 mt-1">
                            <div className=" dropdown__box">
                                <Select
                                    name='autorizedBy'
                                    styles={customStylesWithOutColor}
                                    isClearable
                                    placeholder="Select.."
                                />
                                <label htmlFor="" className='pl-0'>Authorized By</label>
                            </div>
                        </div>
                        <div className="col-3 col-md-3 col-lg-3 mt-1">
                            <div className=" dropdown__box">
                                <Select
                                    name='towingcompany'
                                    styles={customStylesWithOutColor}
                                    isClearable
                                    placeholder="Select.."
                                />
                                <label htmlFor="" className='pl-0'>Towing Company</label>
                            </div>
                        </div>
                        <div className="col-3 col-md-3 col-lg-3  " style={{ marginTop: '5px' }}>
                            <div class="text-field">
                                <input type="text" required name='towingId' />
                                <label >Towing Id</label>
                            </div>
                        </div>
                        <div className="col-3 col-md-3 col-lg-3 mt-1">
                            <div className=" dropdown__box">
                                <Select
                                    name='towingreason'
                                    styles={customStylesWithOutColor}
                                    isClearable
                                    placeholder="Select.."
                                />
                                <label htmlFor="" className='pl-0'>Tow Reason</label>
                            </div>
                        </div>
                        <div className="col-9  col-md-10 col-lg-5  mt-1" >
                            <div className="text-field">
                                <textarea name="" id="" cols="1" rows="1">
                                </textarea>
                                {/* <Location {...{ value, setValue, locationStatus, setlocationStatus }} col='Address'  page='Name' /> */}
                                <label htmlFor="" className='pt-1'>Towing Location</label>
                            </div>
                        </div>
                        <div className="col-3 col-md-2 col-lg-1 mt-3 pt-1 ">
                            <div class="form-check ">
                                <input class="form-check-input" type="checkbox" name='IsVerify' data-toggle="modal" data-target="#" id="flexCheckDefault" />
                                <label class="form-check-label mr-2" for="flexCheckDefault">
                                    Verify
                                </label>
                                {/* {
                                    value?.IsVerify === false && addVerifySingleData.length > 0 ?
                                        <>
                                            <i className="fa fa-edit " onClick={() => { get_Add_Single_Data(value.NameLocationID); setModalStatus(true); }} data-toggle="modal" data-target="#NameVerifyModal" style={{ cursor: 'pointer', backgroundColor: '' }} > Edit </i>
                                        </>
                                        :
                                        <>
                                        </> */}
                            </div>
                        </div>
                        <div className="col-3 col-md-3 col-lg-3 mt-1">
                            <div className=" dropdown__box">
                                <Select
                                    name='maintype'
                                    styles={customStylesWithOutColor}
                                    isClearable
                                    placeholder="Select.."
                                />
                                <label htmlFor="" className='pl-0'>Main Type</label>
                            </div>
                        </div>
                        <div className="col-3 col-md-3 col-lg-3 mt-1">
                            <div className=" dropdown__box">
                                <Select
                                    name='eqipementtype'
                                    styles={customStylesWithOutColor}
                                    isClearable
                                    placeholder="Select.."
                                />
                                <label htmlFor="" className='pl-0'>Equipment Type</label>
                            </div>
                        </div>
                        <div className="col-3 col-md-3 col-lg-3 ">
                            <div className=" dropdown__box">
                                <Select
                                    name='lettersent'
                                    styles={customStylesWithOutColor}
                                    isClearable
                                    placeholder="Select.."
                                />
                                <label htmlFor="" className='pl-0'>Letter Sent</label>
                            </div>
                        </div>
                        <div className="col-3 col-md-3 col-lg-3  " style={{ marginTop: '2px' }}>
                            <div class="text-field">
                                <input type="text" required name='whytowed' />
                                <label >Why Towed</label>
                            </div>
                        </div>
                        <div className="col-3 col-md-3 col-lg-3  " style={{ marginTop: '2px' }}>
                            <div class="text-field">
                                <input type="text" required name='companyCity' />
                                <label >Company City</label>
                            </div>
                        </div>
                        <div className="col-3 col-md-3 col-lg-3 ">
                            <div className=" dropdown__box">
                                <Select
                                    name='towedTo'
                                    styles={customStylesWithOutColor}
                                    isClearable
                                    placeholder="Select.."
                                />
                                <label htmlFor="" className='pl-0'>Towed To</label>
                            </div>
                        </div>
                        <div className="col-3 col-md-3 col-lg-3 ">
                            <div className=" dropdown__box">
                                <DatePicker
                                    id='towedDate'
                                    name='towedDate'
                                    onChange={(date) => { setValue({ ...value, ['towedDate']: date ? getShowingMonthDateYear(date) : null }) }}
                                    dateFormat="MM/dd/yyyy"
                                    isClearable={value?.towedDate ? true : false}
                                    selected={value?.towedDate && new Date(value?.towedDate)}
                                    maxDate={new Date()}
                                    placeholderText={'Select...'}
                                    autoComplete="Off"
                                    showYearDropdown
                                    showMonthDropdown
                                    dropdownMode="select"
                                    showTimeSelect
                                    timeIntervals={1}
                                    timeCaption="Time"
                                />
                                <label htmlFor="" className='pt-1 pl-0'>Date/Time Towed</label>
                            </div>
                        </div>
                        <div className="col-2 col-md-2 col-lg-2 mt-3 pt-2">
                            <div class="form-check ">
                                <input class="form-check-input" type="checkbox" name='NCICCheked' id="flexCheckDefault1" />
                                <label class="form-check-label" for="flexCheckDefault1">
                                    NCIC Checked
                                </label>
                            </div>
                        </div>
                        <div className="col-2 col-md-2 col-lg-2 mt-3 pt-2">
                            <div class="form-check ">
                                <input class="form-check-input" type="checkbox" name='SCICCheked' id="flexCheckDefault2" />
                                <label class="form-check-label" for="flexCheckDefault2">
                                    SCIC Checked
                                </label>
                            </div>
                        </div>
                        <div className="col-2 col-md-3 col-lg-2 mt-3 pt-2">
                            <div class="form-check ">
                                <input class="form-check-input" type="checkbox" name='plateattech' id="flexCheckDefault3" />
                                <label class="form-check-label" for="flexCheckDefault3">
                                    Plates Attached
                                </label>
                            </div>
                        </div>
                        <div className="col-2 col-md-2 col-lg-2 mt-3 pt-2">
                            <div class="form-check ">
                                <input class="form-check-input" type="checkbox" name='SCICENTERED' id="flexCheckDefault4" />
                                <label class="form-check-label" for="flexCheckDefault4">
                                    Entered into SCIC
                                </label>
                            </div>
                        </div>

                    </div>
                </div>
                {/* Hold/Impound Information */}
                <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center mt-1">
                    <p className="p-0 m-0">Hold/Impound Information</p>
                </div>
                <div className="col-12 col-md-12 col-lg-12">
                    <div className="row  px-0 ">
                        <div className="col-12 col-md-12 col-lg-12 ">
                            <div class="form-check ">
                                <input class="form-check-input" type="checkbox" name='impound' id="flexCheckDefault2" />
                                <label class="form-check-label" for="flexCheckDefault2">
                                    Impound
                                </label>
                            </div>
                        </div>
                        <div className="col-3 col-md-3 col-lg-3">
                            <div className=" dropdown__box">
                                <Select
                                    name='holdreason'
                                    styles={customStylesWithOutColor}
                                    isClearable
                                    placeholder="Select.."
                                />
                                <label htmlFor="" className='pl-0'>Hold Reason</label>
                            </div>
                        </div>
                        <div className="col-3 col-md-3 col-lg-3 ">
                            <div className=" dropdown__box">
                                <Select
                                    name='holdok'
                                    styles={customStylesWithOutColor}
                                    isClearable
                                    placeholder="Select.."
                                />
                                <label htmlFor="" className='pl-0'>Hold Ok By</label>
                            </div>
                        </div>
                        <div className="col-3 col-md-3 col-lg-3 ">
                            <div className=" dropdown__box">
                                <Select
                                    name='holdby'
                                    styles={customStylesWithOutColor}
                                    isClearable
                                    placeholder="Select.."
                                />
                                <label htmlFor="" className='pl-0'>Hold By</label>
                            </div>
                        </div>
                        <div className="col-3 col-md-3 col-lg-3 ">
                            <div className=" dropdown__box">
                                <Select
                                    name='holdReleasedby'
                                    styles={customStylesWithOutColor}
                                    isClearable
                                    placeholder="Select.."
                                />
                                <label htmlFor="" className='pl-0'>Hold Released By</label>
                            </div>
                        </div>
                        <div className="col-3 col-md-3 col-lg-3 ">
                            <div className=" dropdown__box">
                                <DatePicker
                                    id='releasedDate'
                                    name='releasedDate'
                                    onChange={(date) => { setValue({ ...value, ['releasedDate']: date ? getShowingMonthDateYear(date) : null }) }}
                                    dateFormat="MM/dd/yyyy"
                                    isClearable={value?.releasedDate ? true : false}
                                    selected={value?.releasedDate && new Date(value?.releasedDate)}
                                    maxDate={new Date()}
                                    placeholderText={'Select...'}
                                    autoComplete="Off"
                                    showYearDropdown
                                    showMonthDropdown
                                    dropdownMode="select"
                                    showTimeSelect
                                    timeIntervals={1}
                                    timeCaption="Time"
                                />
                                <label htmlFor="" className='pt-1 pl-0'>Date/Time Hold Released</label>
                            </div>
                        </div>
                    </div>
                </div>
                {/* ReleaseInformation */}
                <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center mt-1">
                    <p className="p-0 m-0">Notify/Release Information</p>
                </div>
                <div className="col-12 col-md-12 col-lg-12">
                    <div className="row  px-0 ">
                        <div className="col-3 col-md-3 col-lg-3 mt-1">
                            <div className=" dropdown__box">
                                <Select
                                    name='notifyby'
                                    styles={customStylesWithOutColor}
                                    isClearable
                                    placeholder="Select.."
                                />
                                <label htmlFor="" className='pl-0'>Owner Notified By</label>
                            </div>
                        </div>
                        <div className="col-3 col-md-3 col-lg-3 ">
                            <div className=" dropdown__box">
                                <DatePicker
                                    id='notifyDate'
                                    name='notifyDate'
                                    onChange={(date) => { setValue({ ...value, ['notifyDate']: date ? getShowingMonthDateYear(date) : null }) }}
                                    dateFormat="MM/dd/yyyy"
                                    isClearable={value?.notifyDate ? true : false}
                                    selected={value?.notifyDate && new Date(value?.notifyDate)}
                                    maxDate={new Date()}
                                    placeholderText={'Select...'}
                                    autoComplete="Off"
                                    showYearDropdown
                                    showMonthDropdown
                                    dropdownMode="select"
                                    showTimeSelect
                                    timeIntervals={1}
                                    timeCaption="Time"
                                />
                                <label htmlFor="" className='pt-1 pl-0'>Date/Time Notified</label>
                            </div>
                        </div>
                        <div className="col-3 col-md-3 col-lg-3 mt-1">
                            <div className=" dropdown__box">
                                <Select
                                    name='releasedby'
                                    styles={customStylesWithOutColor}
                                    isClearable
                                    placeholder="Select.."
                                />
                                <label htmlFor="" className='pl-0'>Released By</label>
                            </div>
                        </div>
                        <div className="col-3 col-md-3 col-lg-3 ">
                            <div className=" dropdown__box">
                                <DatePicker
                                    id='NreleasedDate'
                                    name='NreleasedDate'
                                    onChange={(date) => { setValue({ ...value, ['NreleasedDate']: date ? getShowingMonthDateYear(date) : null }) }}
                                    dateFormat="MM/dd/yyyy"
                                    isClearable={value?.NreleasedDate ? true : false}
                                    selected={value?.NreleasedDate && new Date(value?.NreleasedDate)}
                                    maxDate={new Date()}
                                    placeholderText={'Select...'}
                                    autoComplete="Off"
                                    showYearDropdown
                                    showMonthDropdown
                                    dropdownMode="select"
                                    showTimeSelect
                                    timeIntervals={1}
                                    timeCaption="Time"
                                />
                                <label htmlFor="" className='pt-1 pl-0'>Date/Time Released</label>
                            </div>
                        </div>
                        <div className="col-3 col-md-3 col-lg-3 mt-1">
                            <div className=" dropdown__box">
                                <Select
                                    name='Releasedto'
                                    styles={customStylesWithOutColor}
                                    isClearable
                                    placeholder="Select.."
                                />
                                <label htmlFor="" className='pl-0'>Released To</label>
                            </div>
                        </div>
                        <div className="col-1 col-md-1 col-lg-1 mt-2 pt-2 pl-0">
                            <Link to="/nametab?page=clear" className="btn btn-sm bg-green text-white ">
                                <i className="fa fa-plus"></i>
                            </Link>
                        </div>
                        <div className="col-8 col-md-8 col-lg-8  " style={{ marginTop: '6px' }}>
                            <div class="text-field">
                                <input type="text" required name='ownerproof' />
                                <label >Owner Proof</label>
                            </div>
                        </div>
                        <div className="col-6  col-md-6 col-lg-6  mt-2" >
                            <div className="text-field">
                                <textarea name="" id="" cols="1" rows="1">
                                </textarea>
                                <label htmlFor="">Release Comments</label>
                            </div>
                        </div>
                        <div className="col-6  col-md-6 col-lg-6  mt-2" >
                            <div className="text-field">
                                <textarea name="" id="" cols="1" rows="1">
                                </textarea>
                                <label htmlFor="">Comments</label>
                            </div>
                        </div>
                    </div>
                    <div className="btn-box text-right ">
                        <button type="button" class="btn btn-sm btn-success" >Update</button>

                    </div>
                </div>
            </div>
        </>
    )
}

export default TowingVehicle