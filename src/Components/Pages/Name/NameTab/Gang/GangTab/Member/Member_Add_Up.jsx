import React from 'react'
import Select from "react-select";
import DatePicker from "react-datepicker";
import { useState } from 'react';
import { getShowingMonthDateYear } from '../../../../../../Common/Utility';
const Member_Add_Up = () => {
  const [firstknownfdate, setFirstknowndate] = useState();
  const [firstidentifieddate, setFirstidentifiedDate] = useState();
  const [statuslastdate, setStatuslastDate] = useState();
  const [nolongerdate, setLongerDate] = useState();
  const [prisondate, setPrisonDate] = useState();
  const [releaseddate, setReleasedDate] = useState();
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
  const startRef2 = React.useRef();
  const startRef3 = React.useRef();
  const startRef4 = React.useRef();
  const startRef5 = React.useRef();

  const onKeyDown = (e) => {
    if (e.keyCode === 9 || e.which === 9) {
      startRef.current.setOpen(false);
      startRef1.current.setOpen(false);
      startRef2.current.setOpen(false);
      startRef3.current.setOpen(false);
      startRef4.current.setOpen(false);
      startRef5.current.setOpen(false);
    }
  };
  return (
    <>

      <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="MemberModal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="false">
        <div class="modal-dialog modal-dialog-centered modal-lg" role="document" >
          <div class="modal-content">
            <div class="modal-body">
              <div className="m-1">
                <fieldset style={{ border: '1px solid gray' }}>
                  <legend style={{ fontWeight: 'bold' }}>Gang Member</legend>
                  <div className="col-12 col-md-12  p-0" >
                    <div className="row ">
                      <div className="col-6  col-md-6 col-lg-3  mt-1 pt-1" >
                        <div className="text-field">
                          <input type="text" />
                          <label htmlFor="">Member Name</label>
                        </div>
                      </div>
                      <div className="col-6  col-md-6 col-lg-3  mt-1 pt-1" >
                        <div className="text-field">
                          <input type="text" />
                          <label htmlFor="">Name Id</label>
                        </div>
                      </div>
                      <div className="col-6 col-md-6 col-lg-3 mt-3 date__box">
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
                      <div className="col-2 col-md-2 col-lg-1 mt-4 ">
                        <div class="form-check">
                          <input class="form-check-input" type="checkbox" name='IsVerify' id="flexCheckDefault" />
                          <label class="form-check-label" for="flexCheckDefault">
                            Founder 
                          </label>
                        </div>
                      </div>
                      <div className="col-2 col-md-2 col-lg-2 mt-4 pl-5">
                        <div class="form-check">
                          <input class="form-check-input" type="checkbox" name='validate' id="flexCheckDefault1" />
                          <label class="form-check-label" for="flexCheckDefault1">
                            Leader
                          </label>
                        </div>
                      </div>
                      <div className="col-12  col-md-6 col-lg-6  mt-1 pt-1" >
                        <div className="text-field">
                          <input type="text" />
                          <label htmlFor="">Notes</label>
                        </div>
                      </div>
                      <div className="col-12  col-md-6 col-lg-6  mt-1 pt-1" >
                        <div className="text-field">
                          <input type="text" />
                          <label htmlFor="">Characteristics</label>
                        </div>
                      </div>
                      <div className="col-6 col-md-6 col-lg-4 mt-2">
                        <div className=" dropdown__box">
                          <Select
                            name='MemberType'
                            styles={customStylesWithOutColor}
                            isClearable
                            placeholder="Select..."
                          />
                          <label>Member Type</label>
                        </div>
                      </div>
                      <div className="col-6 col-md-6 col-lg-4 mt-2">
                        <div className=" dropdown__box">
                          <Select
                            name='Memberstatus'
                            styles={customStylesWithOutColor}
                            isClearable
                            placeholder="Select..."
                          />
                          <label>Member Status</label>
                        </div>
                      </div>
                      <div className="col-12 col-md-6 col-lg-4 mt-3 date__box">
                        <DatePicker
                          id='firstidentifieddate'
                          name='firstidentifieddate'
                          ref={startRef1}
                          onKeyDown={onKeyDown}
                          onChange={(date) => { setFirstidentifiedDate(date); setValue({ ...value, ['firstidentifieddate']: date ? getShowingMonthDateYear(date) : null }) }}
                          className=''
                          dateFormat="MM/dd/yyyy"
                          isClearable={value?.firstidentifieddate ? true : false}
                          selected={firstidentifieddate}
                          placeholderText={value?.firstidentifieddate ? value.firstidentifieddate : 'Select...'}
                        />
                        <label htmlFor="">First Identified In Gang Date</label>
                      </div>
                      <div className="col-12 col-md-6 col-lg-4 mt-3 date__box">
                        <DatePicker
                          id='statuslastdate'
                          name='statuslastdate'
                          ref={startRef2}
                          onKeyDown={onKeyDown}
                          onChange={(date) => { setStatuslastDate(date); setValue({ ...value, ['statuslastdate']: date ? getShowingMonthDateYear(date) : null }) }}
                          className=''
                          dateFormat="MM/dd/yyyy"
                          isClearable={value?.statuslastdate ? true : false}
                          selected={statuslastdate}
                          placeholderText={value?.statuslastdate ? value.statuslastdate : 'Select...'}
                        />
                        <label htmlFor="">Status Last Review Date</label>
                      </div>
                      <div className="col-12 col-md-6 col-lg-4 mt-2">
                        <div className=" dropdown__box">
                          <Select
                            name='Probation/ParoleStatus'
                            styles={customStylesWithOutColor}
                            isClearable
                            placeholder="Select..."
                          />
                          <label>Probation/Parole Status</label>
                        </div>
                      </div>

                      <div className="col-12 col-md-6 col-lg-4 mt-3 date__box">
                        <DatePicker
                          id='nolongerdate'
                          name='nolongerdate'
                          ref={startRef3}
                          onKeyDown={onKeyDown}
                          onChange={(date) => { setLongerDate(date); setValue({ ...value, ['nolongerdate']: date ? getShowingMonthDateYear(date) : null }) }}
                          className=''
                          dateFormat="MM/dd/yyyy"
                          isClearable={value?.nolongerdate ? true : false}
                          selected={nolongerdate}
                          placeholderText={value?.nolongerdate ? value.nolongerdate : 'Select...'}
                        />
                        <label htmlFor="">No Longer In Gang Date</label>
                      </div>
                      <div className="col-12 col-md-6 col-lg-4 mt-3 date__box">
                        <DatePicker
                          id='prisondate'
                          name='prisondate'
                          ref={startRef4}
                          onKeyDown={onKeyDown}
                          onChange={(date) => { setPrisonDate(date); setValue({ ...value, ['prisondate']: date ? getShowingMonthDateYear(date) : null }) }}
                          className=''
                          dateFormat="MM/dd/yyyy"
                          isClearable={value?.prisondate ? true : false}
                          selected={prisondate}
                          placeholderText={value?.prisondate ? value.prisondate : 'Select...'}
                        />
                        <label htmlFor="">In Prison Date</label>
                      </div>
                      <div className="col-12 col-md-6 col-lg-4 mt-3 date__box">
                        <DatePicker
                          id='releaseddate'
                          name='releaseddate'
                          ref={startRef5}
                          onKeyDown={onKeyDown}
                          onChange={(date) => { setReleasedDate(date); setValue({ ...value, ['releaseddate']: date ? getShowingMonthDateYear(date) : null }) }}
                          className=''
                          dateFormat="MM/dd/yyyy"
                          isClearable={value?.releaseddate ? true : false}
                          selected={releaseddate}
                          placeholderText={value?.releaseddate ? value.releaseddate : 'Select...'}
                        />
                        <label htmlFor="">Last Released From Prison Date</label>
                      </div>
                      <div className="col-12  col-md-6 col-lg-4  mt-1 pt-1" >
                        <div className="text-field">
                          <input type="text" />
                          <label htmlFor="">Jail Prison Location</label>
                        </div>
                      </div>
                      <div className="col-12 col-md-6 col-lg-4 mt-2">
                        <div className=" dropdown__box">
                          <Select
                            name='certified by'
                            styles={customStylesWithOutColor}
                            isClearable
                            placeholder="Select..."
                          />
                          <label>Certified By</label>
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

export default Member_Add_Up