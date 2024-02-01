import React, { useContext, useEffect } from 'react'
import DatePicker from "react-datepicker";
import Select from "react-select";
import { Link, useLocation } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { Decrypt_Id_Name, Encrypted_Id_Name, colourStyles, getShowingMonthDateYear, getShowingWithOutTime } from '../../../Common/Utility';
import { useState } from 'react';
import { AddDeleteUpadate, fetchPostData } from '../../../hooks/Api';
import { AgencyContext } from '../../../../Context/Agency/Index';
import { Comman_changeArrayFormat } from '../../../Common/ChangeArrayFormat';
import { toastifyError, toastifySuccess } from '../../../Common/AlertMsg';
import DeletePopUpModal from '../../../Common/DeleteModal';

const ArrestSearch = () => {

  const useQuery = () => new URLSearchParams(useLocation().search);
  let openPage = useQuery().get('page');
  const { deleteStoreData, storeData, get_Arrest_Count, updateCount, setUpdateCount, get_Police_Force, arrestSearchData, setArrestSearchData, localStoreArray, setLocalStoreArray, get_LocalStorage, arrestStatus, setArrestStatus, setIncStatus, arrestSearch, setarrestSearch, get_Arrestee_Drp_Data, } = useContext(AgencyContext);

  const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState()
  const [arrestfromdate, setarrestfromDate] = useState();
  const [arresttodate, setarresttoDate] = useState();
  const [arrestData, setArrestData] = useState();
  const [arrestSearchID, setArrestSearchID] = useState();
  const [advancedSearch, setAdvancedSearch] = useState(false);
  //Drp
  const [arrestTypeDrpData, setArrestTypeDrpData] = useState([]);
  const [arrestingAgencyDrpData, setAgencyNameDrpData] = useState([]);
  const [headOfAgency, setHeadOfAgency] = useState([]);
  const [JuvenileDispoDrp, setJuvenileDisDrp] = useState([]);
  const [chargeCodeDrp, setChargeCodeDrp] = useState([]);

  const [MainIncidentID, setMainIncidentID] = useState('');
  const [LoginAgencyID, setLoginAgencyID] = useState('');
  const [LoginPinID, setLoginPinID,] = useState('');
  const [ArrestID, setArrestID,] = useState('');

  const localStore = {
    Value: "",
    UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
    Key: JSON.stringify({ AgencyID: "", PINID: "", IncidentID: "", }),
  }

  useEffect(() => {
    if (!localStoreArray.AgencyID || !localStoreArray.PINID) {
      get_LocalStorage(localStore);
    }
  }, []);

  // Onload Function
  useEffect(() => {
    if (localStoreArray) {
      if (localStoreArray?.AgencyID && localStoreArray?.PINID) {
        setLoginAgencyID(localStoreArray?.AgencyID);
        setLoginPinID(localStoreArray?.PINID);
      }
    }
  }, [localStoreArray])

  const [value, setValue] = useState({
    IncidentID: '', ArrestNumber: "", ArrestNumberTo: "", IncidentNumber: "",
    ArrestDtTm: "", ArrestDtTmTo: "", ArrestTypeID: "", ArrestingAgencyID: "",
    JuvenileDispositionID: "", LastName: "", FirstName: "", MiddleName: "",
    SSN: "", PrimaryOfficerID: "", ChargeCodeID: "", AgencyID: "",
  });

  useEffect(() => {
    setValue({ ...value, 'AgencyID': LoginAgencyID, })
  }, [LoginAgencyID]);


  // useEffect(() => {
  //   get_Police_Force(); Get_ArrestType_Drp(); get_Arresting_DropDown(); get_Arrest_juvenile_Drp(); get_Head_Of_Agency(); get_ChargeCode_Drp_Data();
  // }, [LoginAgencyID])

  useEffect(() => {
    get_Arresting_DropDown(LoginAgencyID, LoginPinID); Get_ArrestType_Drp(LoginAgencyID); get_Head_Of_Agency(LoginAgencyID);
    get_Arrest_juvenile_Drp(LoginAgencyID); get_ChargeCode_Drp_Data(LoginAgencyID);
    get_Police_Force();
  }, [LoginAgencyID])

  const get_ChargeCode_Drp_Data = (LoginAgencyID) => {
    const val = {
      AgencyID: LoginAgencyID,
      'FBIID': null
    }
    fetchPostData('ChargeCodes/GetDataDropDown_ChargeCodes', val).then((data) => {
      if (data) {
        setChargeCodeDrp(Comman_changeArrayFormat(data, 'ChargeCodeID', 'Description'))
      } else {
        setChargeCodeDrp([]);
      }
    })
  }

  const get_Head_Of_Agency = (LoginAgencyID) => {
    const val = {
      AgencyID: LoginAgencyID
    }
    fetchPostData('DropDown/GetData_HeadOfAgency', val).then((data) => {
      if (data) {
        setHeadOfAgency(Comman_changeArrayFormat(data, 'PINID', 'HeadOfAgency'));
      }
      else {
        setHeadOfAgency([]);
      }
    });
  };

  const get_Arrest_juvenile_Drp = (LoginAgencyID) => {
    const val = {
      AgencyID: LoginAgencyID
    }
    fetchPostData('ArrestJuvenileDisposition/GetDataDropDown_ArrestJuvenileDisposition', val).then((data) => {
      if (data) {
        setJuvenileDisDrp(Comman_changeArrayFormat(data, 'ArrestJuvenileDispositionID', 'Description'));
      }
      else {
        setJuvenileDisDrp([])
      }
    })
  };

  const get_Arresting_DropDown = (LoginAgencyID, LoginPinID) => {
    const val = {
      AgencyID: LoginAgencyID,
      PINID: LoginPinID
    }
    fetchPostData('Agency/GetData_Agency', val).then((data) => {
      if (data) {
        setAgencyNameDrpData(Comman_changeArrayFormat(data, 'AgencyID', 'Agency_Name'))
      } else {
        setAgencyNameDrpData([]);
      }
    })
  }

  const Get_ArrestType_Drp = (LoginAgencyID) => {
    const val = {
      AgencyID: LoginAgencyID
    }
    fetchPostData('ArrestType/GetDataDropDown_ArrestType', val).then((data) => {
      if (data) {
        setArrestTypeDrpData(Comman_changeArrayFormat(data, 'ArrestTypeID', 'Description'))
      } else {
        setArrestTypeDrpData([]);
      }
    })
  }

  // Arrest Data
  const get_Data_Arrest = () => {
    fetchPostData('Arrest/Search_Arrest', value).then((res) => {
      if (res.length > 0) {
        setArrestData(res);
      } else {
        setArrestData([]); toastifyError("Data Not Available");
      }
    })
  }
  // const get_Data_Arrest = () => {
  //   fetchPostData('Arrest/Search_Arrest', value).then((res) => {
  //     if (res.length > 0) {
  //       setArrestData(res);
  //       // setAdvancedSearch(false);
  //       // reset();
  //     } else {
  //       toastifyError("Data Not Available");
  //     }
  //   })
  // }
  // const get_Arrest_Advance_Search = () => {
  //   fetchPostData('Arrest/Search_Arrest', value).then((res) => {
  //     if (res.length > 0) {
  //       setArrestData(res);
  //       setAdvancedSearch(false);
  //       reset();
  //     } else {
  //       toastifyError("Data Not Available");
  //     }
  //   })
  // }




  const reset = () => {
    setValue({
      ...value,
      ArrestNumber: '', ArrestNumberTo: '', IncidentNumber: '', ArrestDtTm: '',
      ArrestDtTmTo: '', ArrestTypeID: '', ArrestingAgencyID: '', JuvenileDispositionID: '',
      LastName: '', FirstName: '', MiddleName: '', SSN: '', PrimaryOfficerID: '', ChargeCodeID: '',
    });
    setarresttoDate(null); setarrestfromDate(null);
    setOnAdvanceSearch();
  }

  const setOnAdvanceSearch = () => {
    setValue({
      ...value,
      'ArrestNumber': null, 'ArrestNumberTo': null, 'IncidentNumber': null, 'ArrestDtTm': null,
      'ArrestDtTmTo': null, 'ArrestTypeID': null, 'ArrestingAgencyID': null, 'JuvenileDispositionID': null,
      'LastName': null, 'FirstName': null, 'MiddleName': null, 'SSN': null, 'PrimaryOfficerID': null, 'ChargeCodeID': null,
    });
    setarresttoDate(null);
    setarrestfromDate(null);
  }

  const columns = [
    {
      width: '150px',
      name: <p className='text-end' style={{ position: 'absolute', top: '7px' }}>Action</p>,
      cell: row => <>
        {
          EffectiveScreenPermission ? EffectiveScreenPermission[0]?.Changeok ?
            <Link to={'/arresttab?page=ArrestSearch'} onClick={(e) => set_Edit_Value(e, row)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
              <i className="fa fa-edit"></i>
            </Link>
            : <></>
            : <Link to={'/arresttab?page=ArrestSearch'} onClick={(e) => set_Edit_Value(e, row)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
              <i className="fa fa-edit"></i>
            </Link>
        }

      </>
    },
    {
      name: 'Arrest Number',
      selector: (row) => row.ArrestNumber,
      sortable: true
    },
    {
      name: 'Incident Number',
      selector: (row) => row.IncidentNumber,
      sortable: true
    },
    {
      name: <p className='text-end' style={{ position: 'absolute', top: '7px', right: 5 }}>Delete</p>,
      cell: row => <>
        <div className="div" style={{ position: 'absolute', right: 5 }}>

          {
            EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DeleteOK ?
              <Link to={`#`} onClick={(e) => setArrestSearchID(row.ArrestID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                <i className="fa fa-trash"></i>
              </Link>
              : <></>
              : <Link to={`#`} onClick={(e) => setArrestSearchID(row.ArrestID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                <i className="fa fa-trash"></i>
              </Link>
          }
        </div>

      </>
    },
  ]

  // const set_Edit_Value = (e, row) => {
  //   setArrestSearchID(row.ArrestID);
  //   // sessionStorage.setItem("ArrestID", Encrypted_Id_Name(row.ArrestID, 'AForArrestID'));
  //   // sessionStorage.setItem("ArrestIDNumber", Encrypted_Id_Name(row.ArrestIDNumber, 'AForArrestIDNumber'));
  //   setUpdateCount(updateCount + 1)
  // }

  const set_Edit_Value = (e, row) => {
    // if (row.ArrestID) {
    //   // get_Data_Arrest()
    //   setArrestStatus(true)
    //   store_ArrestID(row.ArrestID, true);
    // }
    if (row.ArrestID) {
      setArrestID(row.ArrestID);
      get_Arrest_Count(row.ArrestID);
      storeData({ 'ArrestID': row.ArrestID, 'ArrestStatus': true })
    }
    setIncStatus(true);
    setUpdateCount(updateCount + 1);
  }

  // const store_ArrestID = (ArrestID, ArrestStatuss) => {
  //   const val = {
  //     Value: "",
  //     UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
  //     Key: JSON.stringify({ 'ArrestID': ArrestID, 'ArrestStatuss': ArrestStatuss }),
  //   }
  //   AddDeleteUpadate('LocalStorage/ObjectInsert_LocalStorage', val).then((res) => {
  //     if (res?.success) {
  //       setLocalStoreArray(pre => { return { ...pre, ['ArrestID']: ArrestID, ['ArrestStatuss']: ArrestStatuss } });
  //     }
  //   })
  // }


  const HandleChange = (e) => {
    setValue({
      ...value,
      [e.target.name]: e.target.value
    });
  }

  const ChangeDropDown = (e, name) => {
    if (e) {
      setValue({
        ...value,
        [name]: e.value,
      })
    } else {
      setValue({
        ...value,
        [name]: null,
      })
    }
  }

  const DeleteArrest = () => {
    const val = {
      'ArrestID': arrestSearchID,
      'DeletedByUserFK': LoginPinID
    }
    AddDeleteUpadate('Arrest/Delete_Arrest', val).then((res) => {
      if (res) {
        toastifySuccess(res.Message);
        get_Data_Arrest(MainIncidentID);
      } else console.log("Somthing Wrong");
    })
  }

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
      <div className="section-body view_page_design pt-3">
        <div className="row clearfix" >
          <div className="col-12 col-sm-12">
            <div className="card Agency">
              <div className="card-body">
                <div className="row ">
                  <div className="col-12 mb-2">
                    <div className="bg-line text-white py-1 px-2 d-flex justify-content-between align-items-center">
                      <p className="p-0 m-0">Arrest Search</p>
                    </div>
                  </div>
                  <div className="col-4 col-md-4 col-lg-3 mt-2">
                    <div className="text-field">
                      <input type="text" id='ArrestNumber' name='ArrestNumber' value={value?.ArrestNumber} onChange={HandleChange} />
                      <label>Arrest Number From</label>
                    </div>
                  </div>
                  <div className="col-4 col-md-4 col-lg-3 mt-2">
                    <div class="text-field">
                      <input type="text" id='ArrestNumberTo' name='ArrestNumberTo' value={value?.ArrestNumberTo} onChange={HandleChange} />
                      <label>Arrest Number To</label>
                    </div>
                  </div>
                  <div className="col-6 col-md-4 col-lg-3 " style={{ marginTop: '2px' }}>
                    <div className="dropdown__box">
                      <DatePicker
                        id='ArrestDtTm'
                        name='ArrestDtTm'
                        ref={startRef}
                        onKeyDown={onKeyDown}
                        onChange={(date) => { setarrestfromDate(date); setValue({ ...value, ['ArrestDtTm']: date ? getShowingWithOutTime(date) : null }) }}
                        className=''
                        dateFormat="MM/dd/yyyy"
                        autoComplete='Off'
                        timeInputLabel
                        maxDate={new Date()}
                        isClearable
                        showYearDropdown
                        dropdownMode="select"
                        selected={arrestfromdate}
                        placeholderText={value?.ArrestDtTm ? value.ArrestDtTm : 'Select...'}
                      />
                      <label htmlFor="" className='pt-1'>Arrest From Date</label>
                    </div>
                  </div>
                  <div className="col-6 col-md-4 col-lg-3 " style={{ marginTop: '2px' }}>
                    <div className="dropdown__box">
                      <DatePicker
                        id='ArrestDtTmTo'
                        name='ArrestDtTmTo'
                        ref={startRef1}
                        onKeyDown={onKeyDown}
                        onChange={(date) => { setarresttoDate(date); setValue({ ...value, ['ArrestDtTmTo']: date ? getShowingWithOutTime(date) : null }) }}
                        className=''
                        dateFormat="MM/dd/yyyy"
                        autoComplete='Off'
                        timeInputLabel
                        minDate={arrestfromdate}
                        maxDate={new Date()}
                        isClearable
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        selected={arresttodate}
                        placeholderText={value?.ArrestDtTmTo ? value.ArrestDtTmTo : 'Select...'}
                      />
                      <label htmlFor="" className='pt-1'>Arrest To Date</label>
                    </div>
                  </div>
                  <div className="col-4 col-md-4 col-lg-3 " style={{ marginTop: '10px' }}>
                    <div class="text-field">
                      <input type="text" id='IncidentNumber' name='IncidentNumber' value={value?.IncidentNumber} onChange={HandleChange} />
                      <label>Incident Number</label>
                    </div>
                  </div>
                  <div className="col-6 col-md-4 col-lg-3 mb-1 mt-2">
                    <div className="dropdown__box">
                      <Select
                        name='PrimaryOfficerID'
                        styles={colourStyles}
                        // menuPlacement='top'
                        value={headOfAgency?.filter((obj) => obj.value === value?.PrimaryOfficerID)}
                        isClearable
                        options={headOfAgency}
                        onChange={(e) => ChangeDropDown(e, 'PrimaryOfficerID')}
                        placeholder="Select..."
                      />
                      <label htmlFor='' className='mt-0'>Arresting Officer</label>
                    </div>
                  </div>
                </div>
                <div className="row  text-right">
                  <div className="col-12 col-md-12 col-lg-12" style={{ marginTop: '2px' }}>
                    <button type="button" className="btn btn-sm btn-success mr-1" onClick={get_Data_Arrest} >Search</button>
                    {/* <button type="button" className="btn btn-sm btn-success mr-1" onClick={() => { sessionStorage.removeItem('ArrestID'); get_Data_Arrest(); }}  >Search</button> */}
                    <Link to={'/dashboard-page'}>
                      <button type="button" className="btn btn-sm btn-success mr-1" data-dismiss="modal"  >Close</button>
                    </Link>
                    <button className="btn btn-sm bg-green text-white px-2 py-1" onClick={() => { setAdvancedSearch(true); reset(); setOnAdvanceSearch(); }} data-toggle="modal" data-target="#ArrestSearchModal">Advance Search</button>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 mt-2">
                    <div className="bg-line text-white py-1 px-2 d-flex justify-content-between align-items-center">
                      <p className="p-0 m-0">Arrest</p>
                      <p className="p-0 m-0">
                        <Link to={'/arresttab?page=ArrestSearch'} onClick={() => {
                          setIncStatus(false);
                          get_Arrest_Count('0');
                          deleteStoreData({ 'ArrestID': '', 'ArrestStatus': '', 'ArrestStatus': '', });
                          // storeData({ 'ArrestStatus': false })
                        }} className="btn btn-sm bg-green text-white px-2 py-0" >
                          <i className="fa fa-plus"></i>
                        </Link>
                      </p>
                      {/* <p className="p-0 m-0">
                        <Link to={'/arresttab?page=ArrestSearch'} onClick={() => { sessionStorage.removeItem('ArrestID'); sessionStorage.removeItem('MasterNameID'); }} className="btn btn-sm bg-green text-white px-2 py-0" >
                          <i className="fa fa-plus"></i>
                        </Link>
                      </p>
                   */}
                    </div>
                  </div>
                  <div className="col-12 ">
                    <DataTable
                      dense
                      columns={columns}
                      data={arrestSearch?.length > 0 ? arrestSearch : arrestData}
                      pagination
                      selectableRowsHighlight
                      highlightOnHover
                      paginationPerPage={'5'}
                      paginationRowsPerPageOptions={[5, 10, 15, 20]}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {
        advancedSearch &&

        <div class="modal top fade " style={{ background: "rgba(0,0,0, 0.5)" }} id="ArrestSearchModal" tabindex="-1" data-backdrop="false" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div className="modal-dialog  modal-xl" role="document">
            <div className="modal-content" style={{ borderRadius: '10px', boxShadow: '0px 0px 3px floralwhite' }}>
              <div class="modal-header px-3 p-2" style={{ backgroundColor: 'aliceblue', boxShadow: '0px 0px 2px dimgray' }}>
                <h5 class="modal-title">Arrest Advance Search</h5>
                <button type="button" class="close btn-modal" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true" style={{ color: 'red', fontSize: '20px', }}>&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <div className="m-1 ">
                  <div className="row">
                    <div className="col-12">
                      <fieldset className='fieldset'>
                        <legend>Arrest Information</legend>
                        <div className="row">
                          <div class="col-6 col-md-3 mt-1">
                            <div className="text-field">
                              <input type="text" id='ArrestNumber' name='ArrestNumber' value={value?.ArrestNumber} onChange={HandleChange} />
                              <label className=''>Arrest Number From</label>
                            </div>
                          </div>
                          <div class="col-6 col-md-3 mt-1">
                            <div className="text-field">
                              <input type="text" id='ArrestNumberTo' name='ArrestNumberTo' value={value?.ArrestNumberTo} onChange={HandleChange} />
                              <label className=''>Arrest Number To</label>
                            </div>
                          </div>
                          <div class="col-6 col-md-3 mb-1">
                            <div className="dropdown__box">
                              <DatePicker
                                id='ArrestDtTm'
                                name='ArrestDtTm'
                                ref={startRef}
                                onKeyDown={onKeyDown}
                                onChange={(date) => { setarrestfromDate(date); setValue({ ...value, ['ArrestDtTm']: date ? getShowingWithOutTime(date) : null }) }}
                                className=''
                                dateFormat="MM/dd/yyyy"
                                autoComplete='Off'
                                timeInputLabel
                                maxDate={new Date()}
                                isClearable
                                showYearDropdown
                                dropdownMode="select"
                                selected={arrestfromdate}
                                placeholderText={value?.ArrestDtTm ? value.ArrestDtTm : 'Select...'}
                              />
                              <label htmlFor="" className='pt-1'>Arrest From Date</label>
                            </div>
                          </div>
                          <div class="col-6 col-md-3 mb-1">
                            <div className="dropdown__box">
                              <DatePicker
                                id='ArrestDtTmTo'
                                name='ArrestDtTmTo'
                                ref={startRef1}
                                onKeyDown={onKeyDown}
                                onChange={(date) => { setarresttoDate(date); setValue({ ...value, ['ArrestDtTmTo']: date ? getShowingWithOutTime(date) : null }) }}
                                className=''
                                dateFormat="MM/dd/yyyy"
                                autoComplete='Off'
                                timeInputLabel
                                minDate={arrestfromdate}
                                maxDate={new Date()}
                                isClearable
                                showYearDropdown
                                dropdownMode="select"
                                selected={arresttodate}
                                placeholderText={value?.ArrestDtTmTo ? value.ArrestDtTmTo : 'Select...'}
                              />
                              <label htmlFor="" className='pt-1'>Arrest To Date</label>
                            </div>
                          </div>
                          <div class="col-6 col-md-4 col-lg-3 mt-2">
                            <div className="text-field">
                              <input type="text" id='IncidentNumber' name='IncidentNumber' value={value?.IncidentNumber} onChange={HandleChange} />
                              <label className=''>Incident</label>
                            </div>
                          </div>
                          <div class="col-6 col-md-4 col-lg-3 mb-1 mt-2">
                            <div className="dropdown__box">
                              <Select
                                name='PrimaryOfficerID'
                                styles={colourStyles}
                                menuPlacement='bottom'
                                value={headOfAgency?.filter((obj) => obj.value === value?.PrimaryOfficerID)}
                                isClearable
                                options={headOfAgency}
                                onChange={(e) => ChangeDropDown(e, 'PrimaryOfficerID')}
                                placeholder="Select..."
                              />
                              <label htmlFor='' className='mt-0'>Arresting Officer</label>
                            </div>
                          </div>
                          <div class="col-6 col-md-4 col-lg-3 mb-1 mt-2">
                            <div className="dropdown__box">
                              <Select
                                name='ChargeCodeID'
                                styles={colourStyles}
                                value={chargeCodeDrp?.filter((obj) => obj.value === value?.ChargeCodeID)}
                                isClearable
                                options={chargeCodeDrp}
                                onChange={(e) => ChangeDropDown(e, 'ChargeCodeID')}
                                placeholder="Select..."
                              />
                              <label htmlFor='' className='mt-0'>Charge Code/Description</label>
                            </div>
                          </div>
                          <div class="col-6 col-md-4 col-lg-3 mb-1 mt-2">
                            <div className="dropdown__box">
                              <Select
                                name='ArrestTypeID'
                                styles={colourStyles}
                                value={arrestTypeDrpData?.filter((obj) => obj.value === value?.ArrestTypeID)}
                                isClearable
                                options={arrestTypeDrpData}
                                onChange={(e) => { ChangeDropDown(e, 'ArrestTypeID') }}
                                placeholder="Select..."
                              />
                              <label htmlFor='' className='mt-0'>Arrest Type</label>
                            </div>
                          </div>
                          <div class="col-6 col-md-4 col-lg-3 mb-1 mt-2">
                            <div className="dropdown__box">
                              <Select
                                name="ArrestingAgencyID"
                                styles={colourStyles}
                                value={arrestingAgencyDrpData?.filter((obj) => obj.value === value?.ArrestingAgencyID)}
                                isClearable
                                options={arrestingAgencyDrpData}
                                onChange={(e) => { ChangeDropDown(e, 'ArrestingAgencyID') }}
                                placeholder="Select..."
                              />
                              <label htmlFor='' className='mt-0'>Arresting Agency</label>
                            </div>
                          </div>
                          <div class="col-6 col-md-4 col-lg-3 mb-1 mt-2">
                            <div className="dropdown__box">
                              <Select
                                name='JuvenileDispositionID'
                                menuPlacement='bottom'
                                styles={colourStyles}
                                value={JuvenileDispoDrp?.filter((obj) => obj.value === value?.JuvenileDispositionID)}
                                isClearable
                                options={JuvenileDispoDrp}
                                onChange={(e) => ChangeDropDown(e, 'JuvenileDispositionID')}
                                placeholder="Select..."
                              />
                              <label htmlFor='' className='mt-0'>Juvenile Disposition</label>
                            </div>
                          </div>
                        </div>
                      </fieldset>
                      <fieldset className='fieldset mt-2'>
                        <legend>Arrestee Information</legend>
                        <div className="row">
                          <div class="col-6 col-md-3 mt-2">
                            <div className="text-field">
                              <input type="text" id='LastName' name='LastName' value={value?.LastName} onChange={HandleChange} />
                              <label className=''>Last Name</label>
                            </div>
                          </div>
                          <div class="col-6 col-md-3 mt-2">
                            <div className="text-field">
                              <input type="text" id='FirstName' name='FirstName' value={value?.FirstName} onChange={HandleChange} />
                              <label className=''>First Name</label>
                            </div>
                          </div>
                          <div class="col-6 col-md-3 mt-2">
                            <div className="text-field">
                              <input type="text" id='MiddleName' name='MiddleName' value={value?.MiddleName} onChange={HandleChange} />
                              <label className=''>Middle Name</label>
                            </div>
                          </div>
                          <div class="col-6 col-md-3 mt-2">
                            <div className="text-field">
                              <input type="text" id='SSN' name='SSN' value={value?.SSN} onChange={HandleChange} />
                              <label className=''>SSN</label>
                            </div>
                          </div>
                        </div>
                      </fieldset>
                      <div className="row mt-1 px-2 text-right">
                        <div className="col-12">
                          {/* <button type="button" className="btn btn-sm btn-success mr-1" onClick={() => { get_Data_Arrest(); }}>Search</button> */}
                          <button type="button" className="btn btn-sm btn-success mr-1" onClick={() => { get_Data_Arrest(); }}>Search</button>
                          <button type="button" data-dismiss="modal" className="btn btn-sm btn-success" >Close</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      {/* <ArrestAdvanceSearch /> */}
      <DeletePopUpModal func={DeleteArrest} />
    </>
  )
}

export default ArrestSearch