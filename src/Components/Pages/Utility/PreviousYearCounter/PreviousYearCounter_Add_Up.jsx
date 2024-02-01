import React, { useCallback, useEffect, useState } from 'react'
import Select from 'react-select'
import { AddDeleteUpadate, fetchPostData } from '../../../hooks/Api';
import { toastifySuccess } from '../../../Common/AlertMsg';
import { RequiredFieldIncident } from '../Personnel/Validation';

const PreviousYearCounter_Add_Up = (props) => {

  const { preYearCountID, LoginPinID, LoginAgencyID, modal, pageStatus, setModal, get_Data, status } = props

  const [Editval, setEditVal] = useState([]);

  const [value, setValue] = useState({
    Year: "", Code: "", Format: "", AgencyID: "", LastNumber: "", CounterType: "", CounterDesc: "", CounterID: "",
  });

  const [errors, setErrors] = useState({
    'YearError': '', 'LastNumberError': '', 'FormatError': '',
  });

  const check_Validation_Error = (e) => {
    if (RequiredFieldIncident(value.Year)) {
      setErrors(prevValues => { return { ...prevValues, ['YearError']: RequiredFieldIncident(value.Year) } })
    }
    if (RequiredFieldIncident(value.LastNumber)) {
      setErrors(prevValues => { return { ...prevValues, ['LastNumberError']: RequiredFieldIncident(value.LastNumber) } })
    }
    if (RequiredFieldIncident(value.Format)) {
      setErrors(prevValues => { return { ...prevValues, ['FormatError']: RequiredFieldIncident(value.Format) } })
    }
  }

  // Check All Field Format is True Then Submit 
  const { YearError, LastNumberError, FormatError } = errors

  useEffect(() => {
    if (YearError === 'true' && LastNumberError === 'true' && FormatError === 'true') {
      if (status) updatePreviousCounters()
      else insertPreviousCounters()
    }
  }, [YearError, LastNumberError, FormatError])


  useEffect(() => {
    if (LoginAgencyID) {
      setValue({ ...value, AgencyID: LoginAgencyID, })
    }
  }, [LoginAgencyID, pageStatus]);

  useEffect(() => {
    if (preYearCountID) {
      getSingleData(preYearCountID)
    }
  }, [pageStatus, preYearCountID]);

  const getSingleData = (preYearCountID) => {
    fetchPostData('Counter/GetSingleData_CounterForPreviousYear', { CounterID: preYearCountID }).then((res) => {
      if (res) {
        setEditVal(res);
        // console.log(res)
      }
    })
  }

  useEffect(() => {
    if (preYearCountID && Editval?.length > 0) {
      setValue({
        ...value,
        Year: Editval[0]?.Year, Code: Editval[0]?.Code, Format: Editval[0]?.Format, AgencyID: Editval[0]?.AgencyID, LastNumber: Editval[0]?.LastNumber, CounterType: Editval[0]?.CounterType, CounterDesc: Editval[0]?.CounterDesc, CounterID: Editval[0]?.CounterID,
      })
    } else {
      reset();
    }
  }, [Editval, pageStatus]);

  const insertPreviousCounters = () => {
    AddDeleteUpadate('Counter/Insert_CounterForPreviousYear', value).then((res) => {
      if (res.success) {
        // console.log(res)
        setErrors({ ...errors, 'YearError': '', 'LastNumberError': '', 'FormatError': '', })
        toastifySuccess(res?.Message);
        setModal(false); get_Data(LoginAgencyID); reset();
      }
    })
  }

  const updatePreviousCounters = () => {
    AddDeleteUpadate('Counter/Update_CounterForPreviousYear', value).then((res) => {
      if (res.success) {
        toastifySuccess(res?.Message);
        setErrors({ ...errors, 'YearError': '', 'LastNumberError': '', 'FormatError': '', })
        setModal(false); get_Data(LoginAgencyID); reset();
      }
    })
  }

  const reset = () => {
    setValue({ ...value, Year: "", Code: "", Format: "", AgencyID: "", LastNumber: "", CounterType: "", CounterDesc: "", CounterID: "", });
    setErrors({ ...errors, 'YearError': '', 'LastNumberError': '', 'FormatError': '', });
  }

  const handleChange = (e) => {
    if (e) {
      setValue({
        ...value,
        [e.target.name]: e.target.value
      })
    } else {
      setValue({
        ...value,
        [e.target.name]: ""
      })
    }
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

  function OnClose() {
    reset(); setModal(false);
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

  const colourStyles = {
    control: (styles) => ({
      ...styles,
      backgroundColor: "#fce9bf",
      height: 20,
      minHeight: 30,
      fontSize: 14,
      margintop: 2,
      boxShadow: 0,
    })
  }

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
    modal ?
      <>
        <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="PreviousCounterModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="false">
          <div class="modal-dialog modal-lg modal-dialog-centered rounded" role="document">
            <div class="modal-content">
              <div class="modal-body">
                <div className="m-1 mt-1">
                  <fieldset style={{ border: '1px solid gray' }}>
                    <legend style={{ fontWeight: 'bold' }}> Previous Year Counter</legend>
                    <div className="row">
                      <div className="col-12 col-md-12 col-lg-4 mt-1">
                        <div className=" dropdown__box">
                          <Select
                            styles={customStylesWithOutColor}
                            name="CounterID"
                            // value={headOfAgency?.filter((obj) => obj.value === value?.CounterID)}
                            isClearable
                            // options={headOfAgency}
                            onChange={(e) => ChangeDropDown(e, 'CounterID')}
                            placeholder="Select..."
                          />
                          <label className='pl-0'>Application Counter Type</label>
                        </div>
                      </div>
                      <div className="col-12 col-md-4 col-lg-4 " style={{ marginTop: '5px' }}>
                        <div class="text-field">
                          <input type="text" name='CounterDesc' value={value?.CounterDesc} onChange={handleChange} className='readonlyColor' readOnly />
                          <label>Counter Type</label>
                        </div>
                      </div>
                      <div className="col-12 col-md-4 col-lg-4 " style={{ marginTop: '5px' }}>
                        <div class="text-field">
                          <input type="text" name='Code' value={value?.Code} onChange={handleChange} className='readonlyColor' readOnly />
                          <label>Screen Code</label>
                        </div>
                      </div>
                      <div className="col-12 col-md-4 col-lg-4  mt-3" >
                        <div class="text-field">
                          <input type="text" name='Year' value={value?.Year} onChange={handleChange} className='requiredColor' required />
                          <label>Year</label>
                          {errors.YearError !== 'true' ? (
                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.YearError}</span>
                          ) : null}
                        </div>
                      </div>
                      <div className="col-12 col-md-4 col-lg-4  mt-3" >
                        <div class="text-field">
                          <input type="text" name='LastNumber' value={value?.LastNumber} onChange={handleChange} className='requiredColor' required />
                          <label>Last Number</label>
                          {errors.LastNumberError !== 'true' ? (
                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.LastNumberError}</span>
                          ) : null}
                        </div>
                      </div>
                      <div className="col-12 col-md-4 col-lg-4  mt-3" >
                        <div class="text-field">
                          <input type="text" name='Format' value={value?.Format} onChange={handleChange} className='requiredColor' required />
                          <label>Format</label>
                          {errors.FormatError !== 'true' ? (
                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.FormatError}</span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </fieldset>
                </div>
                <div className="btn-box text-right  mr-1">
                  <button type="button" class="btn btn-sm btn-success mr-2" onClick={check_Validation_Error}>{preYearCountID ? "Update" : 'Save'}</button>
                  <button type="button" class="btn btn-sm btn-success" data-dismiss="modal" onClick={OnClose}>Close</button>
                </div>
                <hr />
                <div className="col-12">
                  <div className="row">
                    <div className="col-4">
                      <p className='new-format'>Format Codes: <span># - Any Number</span></p>
                    </div>
                    <div className="col-3">
                      <p className='new-format'>YYYY <span> -Current Year</span></p>
                    </div>
                    <div className="col-5 d-flex">
                      <p className='new-format'>YY <span> -Current Year </span >  </p>
                      <p className='new-format pl-3'>MM <span> -Current Month</span >  </p>
                      <p className='new-format pl-3'>DD <span> -Current Date</span >  </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
      :
      <>
      </>
  )
}

export default PreviousYearCounter_Add_Up