import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { useState } from "react";
import { getShowingMonthDateYear } from "../../../../Common/Utility";
import { Decrypt_Id_Name } from "../../../../Common/Utility";
import { fetchPostData } from "../../../../hooks/Api";
import { Comman_changeArrayFormat_With_Name } from "../../../../Common/ChangeArrayFormat";
import { AddDeleteUpadate } from "../../../../hooks/Api";
import { toastifySuccess } from "../../../../Common/AlertMsg";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchData } from "../../../../hooks/Api";
import { getShowingWithOutTime } from "../../../../Common/Utility";
import { NaGeneralListDropDownArray } from "../../../../Utility/ListDropDownArray/ListDropArray";
import FindListDropDown from "../../../../Common/FindListDropDown";
import { AgencyContext } from "../../../../../Context/Agency/Index";

const General = () => {

  const { localStoreArray, setLocalStoreArray, get_LocalStorage, } = useContext(AgencyContext);
  const useQuery = () => new URLSearchParams(useLocation().search);
  let openPage = useQuery().get('page');

  const [verifyIdDrp, setverifyIdDrp] = useState([]);
  const [BIVerifyIDDrp, setBIVerifyIDDrp] = useState([]);
  const [Editval, setEditval] = useState();
  const [eyeColoIDDrp, setEyeColoIDDrp] = useState([]);
  const [hairColorIDDrp, setHairColorIDDrp] = useState([]);
  const [maritalStatusIDDrp, setMaritalStatusIDDrp] = useState([]);
  const [residentIDDrp, setResidentIDDrp] = useState([]);

  //------country-------//
  const navigate = useNavigate();
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [DLCountryIDList, setDLCountryIDList] = useState([]);
  const [bICountryIDList, setBICountryIDList] = useState([]);
  const [bIstateList, setBIStateList] = useState([]);

  //------------------Ids---------------------
  const [LoginAgencyID, setLoginAgencyID] = useState('');
  const [LoginPinID, setLoginPinID,] = useState('');
  const [MasterNameID, setMasterNameID,] = useState('');
  const [nameID, setNameID] = useState();

  const [value, setValue] = useState({
    //-------dropDown------//
    'DLVerifyID': "", 'BICountryID': "", 'BIStateID': "",
    'BIVerifyID': "", 'EyeColorID': "", 'HairColorID': "", 'ResidentID': "", 'MaritalStatusID': "",
    //------date--------//
    'DLExpiryDate': null,
    //------text------//
    'DLNumber': "", 'IsUSCitizen': "", 'BirthPlace': "", 'BINationality': "",
    'DLStateID': "", 'DLCountryID': "", "BICityID": "",
    'NameID': '',
    'MasterNameID': '',
    'CreatedByUserFK': '',
    'ModifiedByUserFK': '',
  });

  const localStore = {
    Value: "",
    UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
    Key: JSON.stringify({ AgencyID: "", PINID: "", MasterNameID: '', NameID: '', Agency_Name: "", }),
  }

  useEffect(() => {
    if (!localStoreArray.AgencyID || !localStoreArray.PINID) {
      get_LocalStorage(localStore);
    }
  }, []);

  useEffect(() => {
    if (localStoreArray) {
      if (localStoreArray?.AgencyID && localStoreArray?.PINID) {
        setLoginAgencyID(localStoreArray?.AgencyID);
        setLoginPinID(localStoreArray?.PINID);
        setNameID(localStoreArray?.NameID); setMasterNameID(localStoreArray?.MasterNameID)
      }
    }
  }, [localStoreArray])

  useEffect(() => {
    setValue(pre => { return { ...pre, 'CreatedByUserFK': localStoreArray?.PINID, 'MasterNameID': localStoreArray?.MasterNameID, 'NameID': localStoreArray?.NameID } });
  }, [nameID, MasterNameID]);


  useEffect(() => {
    if (openPage === 'mastername') {
    } else if (value.NameID) {
      get_Single_Data(value.NameID);
    }
  }, [value.NameID, value.MasterNameID])

  const get_Single_Data = (nameID, MasterNameID) => {
    const val = {
      NameID: nameID,
      MasterNameID: MasterNameID,
    }
    fetchPostData('MasterName/GetSingleData_MasterName', val)
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
        'MasterNameID': MasterNameID, 'NameID': nameID,
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
        'DLExpiryDate': Editval[0]?.DLExpiryDate ? getShowingWithOutTime(Editval[0]?.DLExpiryDate) : null,
      })
      getStateList(Editval[0]?.BICountryID);
      getBIStateList(Editval[0]?.BICountryID);
      getCity(Editval[0]?.BIStateID);
    } else {
      resetState()
    }
  }, [Editval])

  useEffect(() => {
    GetVerifyIDDrp(LoginAgencyID); GetColoIDDrp(LoginAgencyID); GetMaritalStatusIDDrp(LoginAgencyID); GetResidentIDDrp(LoginAgencyID); getCountryID(); getStateList();
  }, [LoginAgencyID]);

  const GetVerifyIDDrp = (LoginAgencyID) => {
    const val = { AgencyID: LoginAgencyID };
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

  const GetColoIDDrp = (LoginAgencyID) => {
    const val = {
      AgencyID: LoginAgencyID
    };
    fetchPostData("DropDown/GetData_DropDown_Color", val).then((data) => {
      if (data) {
        setEyeColoIDDrp(
          Comman_changeArrayFormat_With_Name(data, "ColorID", "ColorDescription", "EyeColorID")
        );
        setHairColorIDDrp(
          Comman_changeArrayFormat_With_Name(data, "ColorID", "ColorDescription", "HairColorID")
        );
      } else {
        setEyeColoIDDrp([]);
      }
    });
  };

  const GetMaritalStatusIDDrp = (LoginAgencyID) => {
    const val = {
      AgencyID: LoginAgencyID
    };
    fetchPostData("MaritalStatus/GetDataDropDown_MaritalStatus", val).then(
      (data) => {
        if (data) {
          setMaritalStatusIDDrp(
            Comman_changeArrayFormat_With_Name(data, "MaritalStatusID", "Description", "MaritalStatusID")
          );
        } else {
          setMaritalStatusIDDrp([]);
        }
      }
    );
  };

  const GetResidentIDDrp = (LoginAgencyID) => {
    const val = {
      AgencyID: LoginAgencyID
    };
    fetchPostData("Resident/GetDataDropDown_Resident", val).then((data) => {
      if (data) {
        setResidentIDDrp(
          Comman_changeArrayFormat_With_Name(data, "ResidentID", "Description", "ResidentID")
        );
      } else {
        setResidentIDDrp([]);
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

  // handle change state
  const selectHandleChange = (e, name) => {
    // console.log(e)
    if (e) {
      if (name === 'DLCountryID') {
        getStateList(e.value);
        setValue({
          ...value,
          [name]: e.value
        })
      } else if (name === 'BICountryID') {
        getBIStateList(e.value);
        setValue({
          ...value,
          [name]: e.value
        })
      } else if (name === 'BIStateID') {
        getCity(e.value);
        setValue({
          ...value,
          [name]: e.value
        })
      } else {
        setValue({
          ...value,
          [name]: e.value
        })
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
      } else if (name === 'BICountryID') {
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
      } else if (name === 'BIStateID') {
        setValue({
          ...value,
          ['BICityID']: '',
        })
        setCityList([])
        setValue({
          ...value,
          [name]: '',
        })
      } else {
        setValue({
          ...value,
          [name]: null,
        })
      }
    }
    else {
      setValue({
        ...value,
        [name]: '',
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

  const startRef = React.useRef();
  const onKeyDown = (e) => {
    if (e.keyCode === 9 || e.which === 9) {
      startRef.current.setOpen(false);
    }
  };

  const Update_Name = () => {
    // console.log(value)
    AddDeleteUpadate('MasterName/UpdateBasicInfoName', value).then((res) => {
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
      'DLExpiryDate': null,
      //------text------//
      'DLNumber': "", 'IsUSCitizen': "", 'BirthPlace': "", 'BINationality': "",
      'DLStateID': "", 'DLCountryID': "", 'DLVerifyID': "",
    })
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
      <div className="col-12 " id="display-not-form">
        <div className="col-12 col-md-12 col-lg-12 pt-2 p-0">
          <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
            <p className="p-0 m-0 d-flex align-items-center">DL Information</p>
            <FindListDropDown
              array={NaGeneralListDropDownArray}
            />
          </div>
          <div className="row">
            <div className="col-6 col-md-4 col-lg-4 mt-1">
              <div className=" dropdown__box">
                <Select
                  name="DLCountryID"
                  styles={customStylesWithOutColor}
                  value={DLCountryIDList?.filter((obj) => obj.value === value?.DLCountryID)}
                  isClearable
                  options={DLCountryIDList}
                  onChange={(e) => selectHandleChange(e, 'DLCountryID')}
                  placeholder="Select..."
                />
                <label htmlFor="">Country</label>
              </div>
            </div>
            <div className="col-6 col-md-4 col-lg-4 mt-1">
              <div className=" dropdown__box">
                <Select
                  name="DLStateID"
                  styles={customStylesWithOutColor}
                  value={stateList?.filter((obj) => obj.value === value?.DLStateID)}
                  isClearable
                  options={stateList}
                  onChange={(e) => selectHandleChange(e, 'DLStateID')}
                  placeholder="Select..."
                />
                <label htmlFor="">License State</label>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-6 col-md-4 col-lg-2 " style={{ marginTop: '9px' }}>
              <div class="text-field">
                <input type="text" className="" style={{ textTransform: "uppercase" }} value={value?.DLNumber} maxLength={21} onChange={HandleChange} name="DLNumber" required />
                <label >DL Number</label>
              </div>
            </div>
            <div className="col-6 col-md-4 col-lg-2 mt-1">
              <div className="dropdown__box">
                <DatePicker
                  ref={startRef}
                  onKeyDown={onKeyDown}
                  id="DLExpiryDate"
                  name="DLExpiryDate"
                  dateFormat="MM/dd/yyyy"
                  onChange={(date) => { setValue({ ...value, ["DLExpiryDate"]: date ? getShowingWithOutTime(date) : null, }); }}
                  isClearable
                  selected={value?.DLExpiryDate && new Date(value?.DLExpiryDate)}
                  placeholderText={"Select..."}
                  autoComplete="Off"
                  dropdownMode="select"
                  showMonthDropdown
                  showDisabledMonthNavigation
                  showYearDropdown
                />
                <label htmlFor="" className="pt-1">
                  DL Expiry Date
                </label>
              </div>
            </div>
            <div className="col-6 col-md-4 col-lg-4 mt-2">
              <div className=" dropdown__box">
                <Select
                  name="DLVerifyID"
                  styles={customStylesWithOutColor}
                  value={verifyIdDrp?.filter((obj) => obj.value === value?.DLVerifyID)}
                  options={verifyIdDrp}
                  onChange={(e) => selectHandleChange(e, 'DLVerifyID')}
                  isClearable
                  placeholder="Select..."
                />
                <label htmlFor="">How Verify</label>
              </div>
            </div>
          </div>
        </div>
        {/* Birth */}
        <div className="col-12 col-md-12 col-lg-12 p-0 pt-1 ">
          <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
            <p className="p-0 m-0 d-flex align-items-center">
              Birth Information
            </p>
          </div>
          <div className="row">
            <div className="col-12 col-md-12 col-lg-12 mt-1 pl-2">
              <div class="form-check ">
                <input class="form-check-input" value={value?.IsUSCitizen} checked={value?.IsUSCitizen} onChange={HandleChange} type="checkbox" name="IsUSCitizen" id="flexCheckDefault" />
                <label class="form-check-label" for="flexCheckDefault">
                  US Citizen
                </label>
              </div>
            </div>
            <div className="col-6 col-md-4 col-lg-4 mt-1">
              <div className=" dropdown__box">
                <Select
                  name="BICountryID"
                  styles={customStylesWithOutColor}
                  value={bICountryIDList?.filter((obj) => obj.value === value?.BICountryID)}
                  isClearable
                  options={bICountryIDList}
                  onChange={(e) => selectHandleChange(e, 'BICountryID')}
                  placeholder="Select..."
                />
                <label htmlFor="">Country</label>
              </div>
            </div>
            <div className="col-6 col-md-4 col-lg-4 mt-1">
              <div className=" dropdown__box">
                <Select
                  name="BIStateID"
                  styles={customStylesWithOutColor}
                  value={bIstateList?.filter((obj) => obj.value === value?.BIStateID)}
                  isClearable
                  options={bIstateList}
                  onChange={(e) => selectHandleChange(e, 'BIStateID')}
                  placeholder="Select..."
                />
                <label htmlFor="">State</label>
              </div>
            </div>
            <div className="col-6 col-md-4 col-lg-4 mt-1">
              <div className=" dropdown__box">
                <Select
                  name="BICityID"
                  styles={customStylesWithOutColor}
                  value={cityList?.filter((obj) => obj.value === value?.BICityID)}
                  isClearable
                  options={cityList}
                  onChange={(e) => selectHandleChange(e, 'BICityID')}
                  placeholder="Select..."
                />
                <label htmlFor="">City</label>
              </div>
            </div>
            <div className="col-6 col-md-4 col-lg-4 mt-2">
              <div class="text-field">
                <input type="text" className="" value={value?.BirthPlace} onChange={HandleChange} name="BirthPlace" required />
                <label>Place Of Birth</label>
              </div>
            </div>

            <div className="col-6 col-md-4 col-lg-4 mt-2">
              <div class="text-field">
                <input type="text" className="" value={value?.BINationality} onChange={HandleChange} name="BINationality" required />
                <label>Nationality</label>
              </div>
            </div>
            <div className="col-6 col-md-4 col-lg-4 mt-2">
              <div className=" dropdown__box">
                <Select
                  name="BIVerifyID"
                  styles={customStylesWithOutColor}
                  value={BIVerifyIDDrp?.filter((obj) => obj.value === value?.BIVerifyID)}
                  options={BIVerifyIDDrp}
                  onChange={(e) => selectHandleChange(e, 'BIVerifyID')}
                  isClearable
                  placeholder="Select..."
                />
                <label htmlFor="">How Verify</label>
              </div>
            </div>
          </div>
        </div>
        {/* Basic */}
        <div className="col-12 col-md-12 col-lg-12  p-0 pt-1">
          <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
            <p className="p-0 m-0 d-flex align-items-center">
              Basic Information
            </p>
          </div>
          <div className="row">
            <div className="col-6 col-md-6 col-lg-3 mt-1">
              <div className=" dropdown__box">
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
                <label htmlFor="">Eye Color</label>
              </div>
            </div>
            <div className="col-6 col-md-6 col-lg-3 mt-1">
              <div className=" dropdown__box">
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
                <label htmlFor="">Hair Color</label>
              </div>
            </div>
            <div className="col-6 col-md-6 col-lg-3 mt-1">
              <div className=" dropdown__box">
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
                <label htmlFor="">Resident</label>
              </div>
            </div>

            <div className="col-6 col-md-6 col-lg-3 mt-1">
              <div className=" dropdown__box">
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
                <label htmlFor="">Marital Status</label>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12  text-right mt-3 p-0">
          <button type="button" onClick={Update_Name} className="btn btn-sm btn-success pl-2" > Update </button>
          <Link to={"/name"}>
            <button type="button" className="btn btn-sm btn-success mx-1" data-dismiss="modal" > Close </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default General;




