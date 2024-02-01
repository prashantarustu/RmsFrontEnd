import React, { useState } from 'react'
import DatePicker from 'react-datepicker';
import Select from "react-select";
import { Decrypt_Id_Name, getShowingMonthDateYear, getShowingWithOutTime } from '../../../../../Common/Utility';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Comman_changeArrayFormat_With_Name } from '../../../../../Common/ChangeArrayFormat';
import { AddDeleteUpadate, fetchData, fetchPostData } from '../../../../../hooks/Api';
import { toastifySuccess } from '../../../../../Common/AlertMsg';

const MobileAdditional = () => {

  const [BIVerifyIDDrp, setBIVerifyIDDrp] = useState([]);
  const [verifyIdDrp, setverifyIdDrp] = useState([]);
  const [maritalStatusIDDrp, setMaritalStatusIDDrp] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [bICountryIDList, setBICountryIDList] = useState([]);
  const [DLCountryIDList, setDLCountryIDList] = useState([]);
  const [bIstateList, setBIStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [eyeColoIDDrp, setEyeColoIDDrp] = useState([]);
  const [hairColorIDDrp, setHairColorIDDrp] = useState([]);
  const [residentIDDrp, setResidentIDDrp] = useState([]);
  const [Editval, setEditval] = useState();

  const [value, setValue] = useState({
    DLCountryID: '', DLStateID: '', DLNumber: '', DLVerifyID: '', IsUSCitizen: '', BICountryID: '', BIStateID: '', BICityID: '',
    BirthPlace: '', BIVerifyID: '', BINationality: '', EyeColorID: '', HairColorID: '', ResidentID: '', MaritalStatusID: '', DLExpiryDate: '',
    NameID:  '',
    CreatedByUserFK: '',
    ModifiedByUserFK: '',
  });

  useEffect(() => {
    if (value.NameID) {
      get_Single_Data()
    }
  }, [value.NameID])

  const get_Single_Data = () => {
    const val = {
      'NameID': ('NameID'), 
    }
    fetchPostData('Name_FRW/GetSingleData_Name_FRW', val)
      .then((res) => {
        if (res) {
          setEditval(res);
        }
        else setEditval([])
      })
  }

  useEffect(() => {
    if (Editval) {
      console.log(Editval[0])
      setValue({
        ...value,
        // DropDown
        'MaritalStatusID': Editval[0]?.MaritalStatusID, 'HairColorID': Editval[0]?.HairColorID, 'BIVerifyID': Editval[0]?.BIVerifyID,
        'BICountryID': Editval[0]?.BICountryID, 'BIStateID': Editval[0]?.BIStateID, 'BICityID': Editval[0]?.BICityID,
        'DLVerifyID': Editval[0]?.DLVerifyID, "ResidentID": Editval[0]?.ResidentID,
        'EyeColorID': Editval[0]?.EyeColorID, 'DLStateID': Editval[0]?.DLStateID, 'DLCountryID': Editval[0]?.DLCountryID,
        // checkbox
        'IsJuvenile': Editval[0]?.IsJuvenile, 'IsVerify': Editval[0]?.IsVerify, 'IsUnListedPhNo': Editval[0]?.IsUnListedPhNo,
        //textbox
        'BINationality': Editval[0]?.BINationality, 'BirthPlace': Editval[0]?.BirthPlace, 'IsUSCitizen': Editval[0]?.IsUSCitizen,
        'DLNumber': Editval[0]?.DLNumber,
        //Datepicker
        'DLExpiryDate': Editval[0]?.DLExpiryDate ? getShowingWithOutTime(Editval[0]?.DLExpiryDate) : '',
        'ModifiedByUserFK': ('PINID'),
      })
      getStateList(Editval[0]?.BICountryID);
      getBIStateList(Editval[0]?.BICountryID);
      getCity(Editval[0]?.BIStateID);
    } else {
      resetState()
    }
  }, [Editval])

  useEffect(() => {
    GetColoIDDrp(); GetResidentIDDrp(); GetVerifyIDDrp(); GetMaritalStatusIDDrp(); getStateList(); getCountryID(); getBIStateList(); getCity();
  }, []);

  const GetColoIDDrp = () => {
    const val = {
      AgencyID: ('AgencyID'), 
    };
    fetchPostData("DropDown/GetData_DropDown_Color", val).then((data) => {
      if (data) {
        setEyeColoIDDrp(Comman_changeArrayFormat_With_Name(data, "ColorID", "ColorDescription", "EyeColorID"));
        setHairColorIDDrp(Comman_changeArrayFormat_With_Name(data, "ColorID", "ColorDescription", "HairColorID"));
      } else {
        setEyeColoIDDrp([]);
      }
    });
  };

  const GetResidentIDDrp = () => {
    const val = {
      AgencyID: ('AgencyID'), 
    };
    fetchPostData("Resident/GetDataDropDown_Resident", val).then((data) => {
      if (data) {
        setResidentIDDrp(Comman_changeArrayFormat_With_Name(data, "ResidentID", "Description", "ResidentID"));
      } else {
        setResidentIDDrp([]);
      }
    });
  };

  const GetVerifyIDDrp = () => {
    const val = {   AgencyID: ('AgencyID'),  };
    fetchPostData("Verify/GetDataDropDown_Verify", val).then((data) => {
      if (data) {
        setverifyIdDrp(
          Comman_changeArrayFormat_With_Name(data, "VerifyID", "Description", "DLVerifyID")
        );
        setBIVerifyIDDrp(
          Comman_changeArrayFormat_With_Name(data, "VerifyID", "Description", "BIVerifyID")
        );
      } else {
        setverifyIdDrp([]);
      }
    });
  };

  const GetMaritalStatusIDDrp = () => {
    const val = {
      AgencyID: ('AgencyID'), 
    };
    fetchPostData("MaritalStatus/GetDataDropDown_MaritalStatus", val).then(
      (data) => {
        if (data) {
          setMaritalStatusIDDrp(Comman_changeArrayFormat_With_Name(data, "MaritalStatusID", "Description", "MaritalStatusID"));
        } else {
          setMaritalStatusIDDrp([]);
        }
      }
    );
  };

  const getStateList = async (CountryID) => {
    const val = {
      CountryID: CountryID,
    };
    fetchPostData("NameCountry_State_City/GetData_NameState", val).then((data) => {
      if (data) {
        setStateList(Comman_changeArrayFormat_With_Name(data, "StateID", "StateName", "DLStateID"));
      } else {
        setStateList([]);
      }
    });
  };

  const getCountryID = async () => {
    fetchData("State_City_ZipCode/GetData_Country").then((data) => {
      if (data) {
        setDLCountryIDList(Comman_changeArrayFormat_With_Name(data, "CountryID", "CountryName", "DLCountryID"));
        setBICountryIDList(Comman_changeArrayFormat_With_Name(data, "CountryID", "CountryName", "BICountryID"));
      } else {
        setDLCountryIDList([]);
      }
    });
  };

  const getBIStateList = async (CountryID) => {
    const val = {
      CountryID: CountryID,
    };
    fetchPostData("NameCountry_State_City/GetData_NameState", val).then((data) => {
      if (data) {
        setBIStateList(Comman_changeArrayFormat_With_Name(data, "StateID", "StateName", "BIStateID"));
      } else {
        setStateList([]);
      }
    });
  };

  const getCity = async (StateID) => {
    const val = {
      StateID: StateID,
    };
    fetchPostData("State_City_ZipCode/GetData_City", val).then((data) => {
      if (data) {
        setCityList(Comman_changeArrayFormat_With_Name(data, "CityID", "CityName", "BICityID"))
      } else {
        setCityList([]);
      }
    });
  };

  const selectHandleChange = (e, name) => {
    if (e) {
      setValue({
        ...value,
        [e.name]: e.value
      })
      if (e.name === 'DLCountryID') {
        getStateList(e.value)
      }
      if (e.name === 'BICountryID') {
        getBIStateList(e.value)
      }
      if (e.name === 'BIStateID') {
        getCity(e.value)
      }
    } else if (e === null) {
      if (name === 'DLCountryID') {
        setValue({
          ...value,
          ['DLStateID']: null,
        })
        setStateList([])
        setValue({
          ...value,
          [name]: null,
        })
      }
      if (name === 'BICountryID') {
        setValue({
          ...value,
          ['BIStateID']: '',
          ['BICityID']: '',
        })
        setCityList([]); setBIStateList([]);
        setValue({
          ...value,
          [name]: '',
        })
      }
      if (name === 'BIStateID') {
        setValue({
          ...value,
          ['BICityID']: '',
        })
        setCityList([])
        setValue({
          ...value,
          [name]: '',
        })
      }
    }
    else {
      setValue({
        ...value, [name]: '',
      })
    }
  }

  const HandleChange = (e) => {
    if (e.target.name === "IsUSCitizen") {
      setValue({
        ...value,
        [e.target.name]: e.target.checked,
      });
    } else {
      setValue({
        ...value,
        [e.target.name]: e.target.value,
      });
    }
  };

  // --------------------->Add Del Upt ----------------------------->
  const Update_Name = () => {
    console.log(value)
    AddDeleteUpadate('Name_FRW/UpdateBasicInfoName_FRW', value).then((res) => {
      toastifySuccess(res.Message);
    })
  }

  const resetState = () => {
    setValue({
      ...value,
      //-------dropDown------//
      // 'BICountryID': "", 'BIStateID': "", 'BICityID': "",
      'BIVerifyID': "", 'EyeColorID': "", 'HairColorID': "", 'ResidentID': "", 'MaritalStatusID': "",
      //------date--------//
      'DLExpiryDate': "",
      //------text------//
      'DLNumber': "", 'IsUSCitizen': "", 'BirthPlace': "", 'BINationality': "",
      'DLStateID': "", 'DLCountryID': "", 'DLVerifyID': "",
    })
  }

  const colourStyles = {
    control: (styles) => ({
      ...styles, backgroundColor: "#fce9bf",
      height: 20,
      minHeight: 40,
      fontSize: 18,
      margintop: 2,
      boxShadow: 0,
    }),
  }

  const customStylesWithOutColor = {
    control: base => ({
      ...base,
      height: 20,
      minHeight: 40,
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
      <div className="col-md-12 px-3 pt-1">
        <div className="bg-line text-white py-1 px-2 d-flex justify-content-between align-items-center">
          <p className="p-0 m-0 d-flex align-items-center" style={{ fontSize: '18px' }}>
            DL Information
          </p>
        </div>
      </div>
      <div className="row px-3">
        <div className="col-12 col-md-6 col-lg-3 mt-2">
          <div className="text__dropdwon">
            <Select
              name="DLCountryID"
              styles={customStylesWithOutColor}
              value={DLCountryIDList?.filter((obj) => obj.value === value?.DLCountryID)}
              isClearable
              options={DLCountryIDList}
              onChange={(e) => selectHandleChange(e, 'DLCountryID')}
              placeholder="Select..."
            />
            <label htmlFor="" className='pt-1'>Country</label>
          </div>
        </div>
        <div className="col-12 col-md-6 col-lg-2 mt-2">
          <div className="text__dropdwon">
            <Select
              name="DLStateID"
              styles={customStylesWithOutColor}
              value={stateList?.filter((obj) => obj.value === value?.DLStateID)}
              isClearable
              options={stateList}
              onChange={(e) => selectHandleChange(e, 'DLStateID')}
              placeholder="Select..."
            />
            <label htmlFor="" className='pt-1'>License State</label>
          </div>
        </div>
        <div className="col-4 col-md-4 col-lg-2 mt-2 pt-1">
          <div class="text-mobile">
            <input type="text" className="" style={{ textTransform: "uppercase" }} value={value?.DLNumber} maxLength={16} onChange={HandleChange} name="DLNumber" required />
            <label>DL Number</label>
          </div>
        </div>
        <div className="col-12 col-md-6 col-lg-2 mt-2">
          <div class="text__dropdwon ">
            <DatePicker
              id='DLExpiryDate'
              ref={startRef}
              onKeyDown={onKeyDown}
              name='DLExpiryDate'
              className=' pin-datepicker'
              dateFormat="MM/dd/yyyy"
              onChange={(date) => { setValue({ ...value, ['DLExpiryDate']: date ? getShowingMonthDateYear(date) : null }) }}
              timeInputLabel
              isClearable={value?.DLExpiryDate ? true : false}
              placeholderText={value?.DLExpiryDate ? value?.DLExpiryDate : 'Select...'}
              selected={value?.DLExpiryDate && new Date(value?.DLExpiryDate)}
              // showTimeSelect
              timeIntervals={1}
              timeCaption="Time"
              dropdownMode="select"
              // showMonthDropdown
              autoComplete='Off'
              showYearDropdown
              
            />
    
            <label htmlFor="" className='pt-1'>DL Expiry Date</label>
          </div>
        </div>
        <div className="col-12 col-md-6 col-lg-3 mt-2">
          <div className="text__dropdwon">
            <Select
              name="DLVerifyID"
              styles={customStylesWithOutColor}
              value={verifyIdDrp?.filter((obj) => obj.value === value?.DLVerifyID)}
              options={verifyIdDrp}
              onChange={(e) => selectHandleChange(e, 'DLVerifyID')}
              isClearable
              placeholder="Select..."
            />
            <label htmlFor="" className='pt-1'>How Verify</label>
          </div>
        </div>
      </div>
      {/* birth */}
      <div className="col-12 col-md-12 col-lg-12 px-3 p-0  ">
        <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
          <p className="p-0 m-0 d-flex align-items-center" style={{ fontSize: "18px" }}>
            Birth Information
          </p>
        </div>
        <div className="row">
          <div className="col-12 col-md-12 col-lg-12 mt-1 pl-2">
            <div class="form-check ">
              <input class="form-check-input" value={value?.IsUSCitizen} checked={value?.IsUSCitizen} onChange={HandleChange} type="checkbox" name="IsUSCitizen" id="flexCheckDefault" />
              <label class="form-check-label " for="flexCheckDefault" style={{ fontSize: "18px" }}> US Citizen </label>
            </div>
          </div>
          <div className="col-6 col-md-4 col-lg-2 mt-1">
            <div className=" text__dropdwon">
              <Select
                name="BICountryID"
                styles={customStylesWithOutColor}
                value={bICountryIDList?.filter((obj) => obj.value === value?.BICountryID)}
                isClearable
                options={bICountryIDList}
                onChange={(e) => selectHandleChange(e, 'BICountryID')}
                placeholder="Select..."
              />
              <label htmlFor="" className='pt-1'>Country</label>
            </div>
          </div>
          <div className="col-6 col-md-4 col-lg-2 mt-1">
            <div className=" text__dropdwon">
              <Select
                name="BIStateID"
                styles={customStylesWithOutColor}
                value={bIstateList?.filter((obj) => obj.value === value?.BIStateID)}
                isClearable
                options={bIstateList}
                onChange={(e) => selectHandleChange(e, 'BIStateID')}
                placeholder="Select..."
              />
              <label htmlFor="" className='pt-1'>State</label>
            </div>
          </div>
          <div className="col-6 col-md-4 col-lg-2 mt-1">
            <div className=" text__dropdwon">
              <Select
                name="BICityID"
                styles={customStylesWithOutColor}
                value={cityList?.filter((obj) => obj.value === value?.BICityID)}
                isClearable
                options={cityList}
                onChange={(e) => selectHandleChange(e, 'BICityID')}
                placeholder="Select..."
              />
              <label htmlFor="" className='pt-1'>City</label>
            </div>
          </div>
          <div className="col-6 col-md-4 col-lg-2 mt-2">
            <div class="text-mobile">
              <input type="text" className="" value={value?.BirthPlace} onChange={HandleChange} name="BirthPlace" required />
              <label >Place Of Birth</label>
            </div>
          </div>
          <div className="col-6 col-md-4 col-lg-2 mt-2">
            <div class="text-mobile">
              <input type="text" className="" value={value?.BINationality} onChange={HandleChange} name="BINationality" required />
              <label >Nationality</label>
            </div>
          </div>
          <div className="col-6 col-md-4 col-lg-2 mt-1">
            <div className=" text__dropdwon">
              <Select
                name="BIVerifyID"
                styles={customStylesWithOutColor}
                value={BIVerifyIDDrp?.filter((obj) => obj.value === value?.BIVerifyID)}
                options={BIVerifyIDDrp}
                onChange={(e) => selectHandleChange(e, 'BIVerifyID')}
                isClearable
                placeholder="Select..."
              />
              <label htmlFor="" className='pt-1'>How Verify</label>
            </div>
          </div>
        </div>
      </div>
      <div className="col-12 col-md-12 col-lg-12 px-3 p-0 ">
        <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
          <p className="p-0 m-0 d-flex align-items-center" style={{ fontSize: '18px' }}>
            Basic Information
          </p>
        </div>
        <div className="row mt-1">
          <div className="col-6 col-md-6 col-lg-3 mt-1">
            <div className=" text__dropdwon">
              <Select
                name="EyeColorID"
                styles={customStylesWithOutColor}
                value={eyeColoIDDrp?.filter((obj) => obj.value === value?.EyeColorID)}
                options={eyeColoIDDrp}
                onChange={(e) => selectHandleChange(e, 'EyeColorID')}
                isClearable
                placeholder="Select..."
                menuPlacement="top"
              />
              <label htmlFor="" className='pt-1'>Eye Color</label>
            </div>
          </div>
          <div className="col-6 col-md-6 col-lg-3 mt-1">
            <div className=" text__dropdwon">
              <Select
                name="HairColorID"
                styles={customStylesWithOutColor}
                value={hairColorIDDrp?.filter((obj) => obj.value === value?.HairColorID)}
                options={hairColorIDDrp}
                onChange={(e) => selectHandleChange(e, 'HairColorID')}
                isClearable
                placeholder="Select..."
                menuPlacement="top"
              />
              <label htmlFor="" className='pt-1'>Hair Color</label>
            </div>
          </div>
          <div className="col-6 col-md-6 col-lg-3 mt-1">
            <div className=" text__dropdwon">
              <Select
                name="ResidentID"
                styles={customStylesWithOutColor}
                value={residentIDDrp?.filter((obj) => obj.value === value?.ResidentID)}
                options={residentIDDrp}
                onChange={(e) => selectHandleChange(e, 'ResidentID')}
                isClearable
                placeholder="Select..."
                menuPlacement="top"
              />
              <label htmlFor="" className='pt-1'>Resident</label>
            </div>
          </div>
          <div className="col-6 col-md-6 col-lg-3 mt-1">
            <div className=" text__dropdwon">
              <Select
                name="MaritalStatusID"
                styles={customStylesWithOutColor}
                value={maritalStatusIDDrp?.filter((obj) => obj.value === value?.MaritalStatusID)}
                options={maritalStatusIDDrp}
                onChange={(e) => selectHandleChange(e, 'MaritalStatusID')}
                isClearable
                placeholder="Select..."
                menuPlacement="top"
              />
              <label htmlFor="" className='pt-1'>Marital Status</label>
            </div>
          </div>
        </div>
      </div>
      <div className="col-12  text-right mr-3  pt-1" style={{ marginBottom: '-10px' }}>
        <button type="button" className="btn btn-sm btn-success pl-2 new-button" onClick={() => { Update_Name(); }} > Update </button>
        <Link to={"/mobile-name"}>
          <button type="button" className="btn btn-sm btn-success mx-1 new-button" data-dismiss="modal" > Close </button>
        </Link>
      </div>
    </>
  )
}

export default MobileAdditional