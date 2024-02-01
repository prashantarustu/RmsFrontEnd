import React from 'react'
import { customStylesWithOutColor, getShowingMonthDateYear } from '../../../../../Common/Utility';
import Select from "react-select";
import DatePicker from "react-datepicker";
import { useState } from 'react';
import { Link } from 'react-router-dom';
const Home = () => {
    const [BookingDate, setBookingDate] = useState();
    const [ReleasedReasonDate, setReleasedReasonDate] = useState();
    const [value, setValue] = useState();
    const startRef = React.useRef();
    const startRef1 = React.useRef();

    const onKeyDown = (e) => {
        if (e.keyCode === 9 || e.which === 9) {
            startRef.current.setOpen(false);
            startRef1.current.setOpen(false);
        }
    };
    return (
        <>
            {/* for booking information */}
            <div className="col-12 col-md-12 col-lg-12 ">
                <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                    <p className="p-0 m-0 d-flex align-items-center">Booking Information</p>
                </div>
            </div>
            <div className="col-12 col-md-12 col-lg-12 ">
                <div className="row">
                    <div className="col-6 col-md-4 col-lg-2 mt-1">
                        <div class="text-field">
                            <input type="text" name='BookingNumber' id='BookingNumber' className='readonlyColor' required readOnly />
                            <label className="pt-1">Booking Number</label>
                        </div>
                    </div>

                    <div className="col-6 col-md-4 col-lg-3  ">
                        <div className="dropdown__box">
                            <DatePicker
                                id='BookingDate'
                                name='BookingDate'
                                ref={startRef}
                                onKeyDown={onKeyDown}
                                onChange={(date) => { setBookingDate(date); setValue({ ...value, ['BookingDate']: date ? getShowingMonthDateYear(date) : null }) }}
                                className=''
                                dateFormat="MM/dd/yyyy HH:mm"
                                timeInputLabel
                                autoComplete="nope"
                                showYearDropdown
                                showMonthDropdown
                                dropdownMode="select"
                                isClearable={value?.BookingDate ? true : false}
                                selected={BookingDate}
                                placeholderText={value?.BookingDate ? value.BookingDate : 'Select...'}
                                showTimeSelect
                                timeIntervals={1}
                                timeCaption="Time"
                            />
                            <label htmlFor="" className='pt-1'>Booking Date/Time</label>
                        </div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-4 mt-1">
                        <div className=" dropdown__box">
                            <Select
                                name="BookingName"
                                styles={customStylesWithOutColor}
                                isClearable
                                placeholder="Select..."
                            />
                            <label htmlFor="">Booking Name</label>
                        </div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-3 mt-1">
                        <div className="dropdown__box">
                            <Select
                                name="BookedBy"
                                styles={customStylesWithOutColor}
                                isClearable
                                placeholder="Select..."
                            />
                            <label htmlFor="">Booked By</label>
                        </div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-2 mt-2">
                        <div class="text-field">
                            <input type="text" name='LockerNumber' id='LockerNumber' required />
                            <label className="pt-1">Locker Number</label>
                        </div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-3 mt-2">
                        <div class="text-field">
                            <input type="text" name='JailCellNumber' id='JailCellNumber' required />
                            <label className="pt-1">Jail Cell Number</label>
                        </div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-4 mt-1 pt-1">
                        <div className="dropdown__box">
                            <Select
                                name="SearchType"
                                styles={customStylesWithOutColor}
                                isClearable
                                placeholder="Select..."
                            />
                            <label htmlFor="">Search Type</label>
                        </div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-3 mt-1 pt-1">
                        <div className="dropdown__box">
                            <Select
                                name="SearchBY"
                                styles={customStylesWithOutColor}
                                isClearable
                                placeholder="Select..."
                            />
                            <label htmlFor="">Searched By</label>
                        </div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-3 mt-1 pt-1">
                        <div className="dropdown__box">
                            <Select
                                name="officerinchange"
                                styles={customStylesWithOutColor}
                                isClearable
                                placeholder="Select..."
                            />
                            <label htmlFor="">Officer In Change</label>
                        </div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-3 mt-1 pt-1">
                        <div className="dropdown__box">
                            <Select
                                name="authorizeofficer"
                                styles={customStylesWithOutColor}
                                isClearable
                                placeholder="Select..."
                            />
                            <label htmlFor="">Autorized Officer</label>
                        </div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-3 " style={{ marginTop: '10px' }}>
                        <div class="text-field">
                            <input type="text" name='placedetained' id='placedetained' required />
                            <label >Place Detained</label>
                        </div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-3 mt-1 pt-1">
                        <div className="dropdown__box">
                            <Select
                                name="block"
                                styles={customStylesWithOutColor}
                                isClearable
                                placeholder="Select..."
                            />
                            <label htmlFor="">Block</label>
                        </div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-3 mt-1 pt-1">
                        <div className="dropdown__box">
                            <Select
                                name="cell"
                                styles={customStylesWithOutColor}
                                isClearable
                                placeholder="Select..."
                            />
                            <label htmlFor="">Cell</label>
                        </div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-3 mt-1 pt-1">
                        <div className="dropdown__box">
                            <Select
                                name="bed"
                                styles={customStylesWithOutColor}
                                isClearable
                                placeholder="Select..."
                            />
                            <label htmlFor="">Bed</label>
                        </div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-3 " style={{ marginTop: '10px' }}>
                        <div class="text-field">
                            <input type="text" name='phone' id='phone' required />
                            <label >Phone</label>
                        </div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-3 " style={{ marginTop: '10px' }}>
                        <div class="text-field">
                            <input type="text" name='BehaviourEntered' id='BehaviourEntered' required />
                            <label >Behaviour Entered</label>
                        </div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-3 mt-1 pt-1">
                        <div className="dropdown__box">
                            <Select
                                name="riskfactor"
                                styles={customStylesWithOutColor}
                                isClearable
                                placeholder="Select..."
                            />
                            <label htmlFor="">Risk Factor</label>
                        </div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-3 mt-1 pt-1">
                        <div className="dropdown__box">
                            <Select
                                name="transport"
                                styles={customStylesWithOutColor}
                                isClearable
                                placeholder="Select..."
                            />
                            <label htmlFor="">Transport Officer</label>
                        </div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-3 " style={{ marginTop: '10px' }}>
                        <div class="text-field">
                            <input type="text" name='transportvehicle' id='transportvehicle' required />
                            <label >Transport Vehicle</label>
                        </div>
                    </div>
                </div>
            </div>
            {/* for image box */}
            {/* <div className="col-4 col-md-4 col-lg-2 pt-1">
                <div className="img-box ">
                    <label className="picture picture-name" >
                        <span className="picture__image"></span>
                    </label>
                    <input type="file" name="picture__input" id="picture__input" />
                </div>
                <button type="button" data-toggle="modal" data-target="#" className="btn btn-sm btn-success ml-5 ">Clear</button>
            </div> */}

            {/* for release information */}
            <div className="col-12 col-md-12 col-lg-12  mt-1">
                <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                    <p className="p-0 m-0 d-flex align-items-center">Release Information</p>
                </div>
                <div className="row">
                    <div className="col-6 col-md-4 col-lg-3  ">
                        <div className="dropdown__box">
                            <DatePicker
                                id='ReleasedReasonDate'
                                name='ReleasedReasonDate'
                                ref={startRef1}
                                onKeyDown={onKeyDown}
                                onChange={(date) => { setReleasedReasonDate(date); setValue({ ...value, ['ReleasedReasonDate']: date ? getShowingMonthDateYear(date) : null }) }}
                                className=''
                                dateFormat="MM/dd/yyyy HH:mm"
                                timeInputLabel
                                autoComplete="nope"
                                showYearDropdown
                                showMonthDropdown
                                dropdownMode="select"
                                isClearable={value?.ReleasedReasonDate ? true : false}
                                selected={ReleasedReasonDate}
                                placeholderText={value?.ReleasedReasonDate ? value.ReleasedReasonDate : 'Select...'}
                                showTimeSelect
                                timeIntervals={1}
                                timeCaption="Time"
                            />
                            <label htmlFor="" className='pt-1'>Released Date</label>
                        </div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-5 mt-1">
                        <div className=" dropdown__box">
                            <Select
                                name="releasedreason"
                                styles={customStylesWithOutColor}
                                isClearable
                                placeholder="Select..."
                            />
                            <label htmlFor="">Released Reason</label>
                        </div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-4 mt-1">
                        <div className=" dropdown__box">
                            <Select
                                name="releasedby"
                                styles={customStylesWithOutColor}
                                isClearable
                                placeholder="Select..."
                            />
                            <label htmlFor="">Released By</label>
                        </div>
                    </div>
                </div>
            </div>
            {/* for released to information */}
            <div className="col-12 col-md-12 col-lg-12   mt-1">
                <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                    <p className="p-0 m-0 d-flex align-items-center">Release To Information</p>
                </div>
                <div className="row">
                    <div className="col-6 col-md-6 col-lg-6 " style={{ marginTop: '10px' }}>
                        <div class="text-field">
                            <input type="text" name='releasedto' id='releasedto' required />
                            <label >Released To</label>
                        </div>
                    </div>
                    <div className="col-6 col-md-6 col-lg-6 " style={{ marginTop: '10px' }}>
                        <div class="text-field">
                            <input type="text" name='agencyname' id='agencyname' required />
                            <label >Agency Name</label>
                        </div>
                    </div>
                    <div className="col-4 col-md-4 col-lg-3 mt-2">
                        <div class="form-check ">
                            <input class="form-check-input" type="checkbox" name='phonecallgiven' id="flexCheckDefault" />
                            <label class="form-check-label" for="flexCheckDefault">
                                Phone Call Given
                            </label>
                        </div>
                    </div>
                    <div className="col-4 col-md-4 col-lg-2 mt-2">
                        <div class="form-check ">
                            <input class="form-check-input" type="checkbox" name='dependcare' id="flexCheckDefault1" />
                            <label class="form-check-label" for="flexCheckDefault1">
                                Depend Care
                            </label>
                        </div>
                    </div>
                    <div className="col-4 col-md-4 col-lg-3 mt-2">
                        <div class="form-check ">
                            <input class="form-check-input" type="checkbox" name='onparole' id="flexCheckDefault2" />
                            <label class="form-check-label" for="flexCheckDefault2">
                                On Parole
                            </label>
                        </div>
                    </div>
                    <div className="col-4 col-md-4 col-lg-2 mt-2">
                        <div class="form-check ">
                            <input class="form-check-input" type="checkbox" name='isbrifed' id="flexCheckDefault3" />
                            <label class="form-check-label" for="flexCheckDefault3">
                                Is Briefed
                            </label>
                        </div>
                    </div>
                    <div className="col-4 col-md-4 col-lg-2 mt-2">
                        <div class="form-check ">
                            <input class="form-check-input" type="checkbox" name='fingerprinttaken' id="flexCheckDefault4" />
                            <label class="form-check-label" for="flexCheckDefault4">
                                FingerPrint Taken
                            </label>
                        </div>
                    </div>
                    <div className="col-4 col-md-4 col-lg-3 mt-2">
                        <div class="form-check ">
                            <input class="form-check-input" type="checkbox" name='multiclearance' id="flexCheckDefault5" />
                            <label class="form-check-label" for="flexCheckDefault5">
                                Multi Clearnace
                            </label>
                        </div>
                    </div>
                    <div className="col-4 col-md-4 col-lg-2 mt-2">
                        <div class="form-check ">
                            <input class="form-check-input" type="checkbox" name='videotaken' id="flexCheckDefault6" />
                            <label class="form-check-label" for="flexCheckDefault6">
                                Video Taken
                            </label>
                        </div>
                    </div>
                    <div className="col-4 col-md-4 col-lg-3 mt-2">
                        <div class="form-check ">
                            <input class="form-check-input" type="checkbox" name='stripsearchused' id="flexCheckDefault7" />
                            <label class="form-check-label" for="flexCheckDefault7">
                                Strip Search Used
                            </label>
                        </div>
                    </div>
                    <div className="col-4 col-md-4 col-lg-2 mt-2">
                        <div class="form-check ">
                            <input class="form-check-input" type="checkbox" name='phototaken' id="flexCheckDefault8" />
                            <label class="form-check-label" for="flexCheckDefault8">
                                Photos Taken
                            </label>
                        </div>
                    </div>
                    <div className="col-4 col-md-4 col-lg-2 mt-2">
                        <div class="form-check ">
                            <input class="form-check-input" type="checkbox" name='ncicchecked' id="flexCheckDefault9" />
                            <label class="form-check-label" for="flexCheckDefault9">
                                NCIC Checked
                            </label>
                        </div>
                    </div>
                    <div className="col-4 col-md-4 col-lg-3 mt-2">
                        <div class="form-check ">
                            <input class="form-check-input" type="checkbox" name='matronused' id="flexCheckDefault10" />
                            <label class="form-check-label" for="flexCheckDefault10">
                                Matron Used
                            </label>
                        </div>
                    </div>
                    <div className="col-4 col-md-4 col-lg-3 mt-2">
                        <div class="form-check ">
                            <input class="form-check-input" type="checkbox" name='attorneycalled' id="flexCheckDefault11" />
                            <label class="form-check-label" for="flexCheckDefault11">
                                Attorney Called
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12  text-right mt-3 p-0">
                <button type="button" data-toggle="modal" data-target="#myModal" className="btn btn-sm btn-success  mr-1" >Save</button>
                <Link to={'/arrest'}>
                    <button type="button" className="btn btn-sm btn-success  mr-1" data-dismiss="modal" >Close</button>
                </Link>
            </div>
        </>
    )
}

export default Home