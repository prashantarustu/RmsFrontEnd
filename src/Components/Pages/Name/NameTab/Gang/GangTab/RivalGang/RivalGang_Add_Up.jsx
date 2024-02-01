import React from 'react'
import Select from "react-select";
import DatePicker from "react-datepicker";
import { useState } from 'react';
import { getShowingMonthDateYear } from '../../../../../../Common/Utility';
import { Link } from 'react-router-dom';
const RivalGang_Add_Up = () => {
  const [firstknownfdate, setFirstknowndate] = useState();
  const [lastknownfdate, setLastknowndate] = useState();
  const [value, setValue] = useState();

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
      <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="RivalGangModal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="false">
        <div class="modal-dialog modal-dialog-centered modal-lg" role="document" >
          <div class="modal-content">
            <div class="modal-body">
              <div className="m-1">
                <fieldset style={{ border: '1px solid gray' }}>
                  <legend style={{ fontWeight: 'bold' }}>Rival Gang</legend>
                  <div className="col-12 col-md-12  p-0" >
                    <div className="row ">
                      <div className="col-12 col-md-12 col-lg-6 ">
                        <div className=" dropdown__box">
                          <Select
                            name='gangname'
                            styles={customStylesWithOutColor}
                            isClearable
                            placeholder="Select..."
                          />
                          <label>Gang Name</label>
                        </div>
                      </div>
                      <div className="col-12  col-md-12 col-lg-6 " >
                        <div className=" dropdown__box">
                          <textarea name='Location' id="Location" cols="30" rows='1' className="form-control">
                          </textarea>
                          <label htmlFor="">Location Of Origin</label>
                        </div>
                      </div>
                      <div className="col-2 col-md-2 col-lg-2">
                        <div class="form-check">
                          <input class="form-check-input" type="checkbox" name='IsVerify' id="flexCheckDefault" />
                          <label class="form-check-label" for="flexCheckDefault">
                            Verify
                          </label>
                        </div>
                      </div>
                      <div className="col-10 col-md-10 col-lg-10 ">
                        <div class="form-check">
                          <input class="form-check-input" type="checkbox" name='validate' id="flexCheckDefault1" />
                          <label class="form-check-label" for="flexCheckDefault1">
                            Validate
                          </label>
                        </div>
                      </div>
                      <div className="col-12 col-md-6 col-lg-3 mt-3 date__box">
                        <DatePicker
                          id='firstknownfdate'
                          name='firstknownfdate'
                          ref={startRef}
                          onKeyDown={onKeyDown}
                          onChange={(date) => { setFirstknowndate(date); setValue({ ...value, ['firstknownfdate']: date ? getShowingMonthDateYear(date) : null }) }}
                          className=''
                          dateFormat="MM/dd/yyyy"
                          isClearable={value?.firstknownfdate ? true : false}
                          selected={firstknownfdate}
                          placeholderText={value?.firstknownfdate ? value.firstknownfdate : 'Select...'}
                        />
                        <label htmlFor="">First Known Date</label>
                      </div>
                      <div className="col-12 col-md-6 col-lg-3 mt-3 date__box">
                        <DatePicker
                          id='lastknownfdate'
                          name='lastknownfdate'
                          ref={startRef1}
                          onKeyDown={onKeyDown}
                          onChange={(date) => { setLastknowndate(date); setValue({ ...value, ['lastknownfdate']: date ? getShowingMonthDateYear(date) : null }) }}
                          className=''
                          dateFormat="MM/dd/yyyy"
                          isClearable={value?.lastknownfdate ? true : false}
                          selected={lastknownfdate}
                          placeholderText={value?.lastknownfdate ? value.lastknownfdate : 'Select...'}
                        />
                        <label htmlFor="">Last Active Date</label>
                      </div>
                      <div className="col-12 col-md-6 col-lg-3 mt-2">
                        <div className=" dropdown__box">
                          <Select
                            name='status'
                            styles={customStylesWithOutColor}
                            isClearable
                            placeholder="Select..."
                          />
                          <label>Status</label>
                        </div>
                      </div>
                      <div className="col-12  col-md-6 col-lg-3  mt-1 pt-1" >
                        <div className="text-field">
                          <input type="text" />
                          <label htmlFor="">Area Of Operation</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>
            <div className="btn-box text-right mt-3 mr-1 mb-2">
              <button type="button" class="btn btn-sm btn-success mr-1">Save</button>
              <button type="button" data-dismiss="modal" class="btn btn-sm btn-success mr-1" >Close</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default RivalGang_Add_Up