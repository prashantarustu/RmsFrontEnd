import React from 'react'
import Select from "react-select";
import DatePicker from "react-datepicker";
import { useState } from 'react';
import { getShowingMonthDateYear } from '../../../../Common/Utility';

const CertifiedBy_Add_Up = () => {

    const startRef = React.useRef();
    const [CertifiedDate, setcCertifiedDate] = useState();
    const [value, setValue] = useState();

    const onKeyDown = (e) => {
        if (e.keyCode === 9 || e.which === 9) {
            startRef.current.setOpen(false);
        }
    };

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
            <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="CertifiedModal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="false">
                <div class="modal-dialog modal-dialog-centered modal-lg" role="document" >
                    <div class="modal-content">
                        <div class="modal-body">
                            <div className="m-1 mt-3">
                                <fieldset style={{ border: '1px solid gray' }}>
                                    <legend style={{ fontWeight: 'bold' }}>Certified By</legend>
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="row">
                                                <div className="col-6 col-md-6 col-lg-6 mt-2">
                                                    <div className=" dropdown__box">
                                                        <Select
                                                            name='suffix'
                                                            styles={customStylesWithOutColor}
                                                            isClearable
                                                            options=''
                                                            placeholder="Select"
                                                        />
                                                        <label htmlFor="">Suffix</label>
                                                    </div>
                                                </div>
                                                <div className="col-6 col-md-6 col-lg-6 mt-1 ">
                                                    <div className="date__box">
                                                        <DatePicker
                                                            id='CertifiedDate'
                                                            name='CertifiedDate'
                                                            ref={startRef}
                                                            onKeyDown={onKeyDown}
                                                            onChange={(date) => { setcCertifiedDate(date); setValue({ ...value, ['DOBDate']: date ? getShowingMonthDateYear(date) : null }) }}
                                                            className=''
                                                            dateFormat="MM/dd/yyyy HH:mm"
                                                            timeInputLabel
                                                            showTimeInput
                                                            isClearable={value?.CertifiedDate ? true : false}
                                                            selected={CertifiedDate}
                                                            placeholderText={value?.CertifiedDate ? value.CertifiedDate : 'Select...'}
                                                        />
                                                        <label htmlFor="">DOB</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                        <div className="btn-box text-right  mr-1 mb-2">
                            <button type="button" class="btn btn-sm btn-success mr-1" >Save</button>
                            <button type="button" data-dismiss="modal" class="btn btn-sm btn-success mr-1" >Close</button>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default CertifiedBy_Add_Up