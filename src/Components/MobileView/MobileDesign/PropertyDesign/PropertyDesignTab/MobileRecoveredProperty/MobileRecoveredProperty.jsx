import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import Select from "react-select";
import { Decrypt_Id_Name, getShowingMonthDateYear, tableCustomStyles } from '../../../../../Common/Utility';
import DatePicker from "react-datepicker";
import { AddDeleteUpadate, fetchPostData } from '../../../../../hooks/Api';
import { toastifyError, toastifySuccess } from '../../../../../Common/AlertMsg';
import { Comman_changeArrayFormat, threeColArray } from '../../../../../Common/ChangeArrayFormat';
import { RequiredFieldIncident } from '../../../../../Pages/Utility/Personnel/Validation';
import { RequiredFieldSpaceNotAllow } from '../../../../../Pages/Agency/AgencyValidation/validators';

const MobileRecoveredProperty = () => {

    const [VehicleRecovered, setVehicleRecovered] = useState(false)
    const [modalStatus, setModalstatus] = useState(false)
    const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState()
    const [RecoveredPropertyID, setRecoveredPropertyID] = useState()
    const [vehicleData, setvehicleData] = useState([]);
    const [headOfAgency, setHeadOfAgency] = useState([]);
    const [RecoveryTypeDrpData, setRecoveryTypeDrpData] = useState([]);
    const [UCRRecoveredDrpData, setUCRRecoveredDrpData] = useState([]);
    const [DispositionsDrpData, setDispositionsDrpData] = useState([]);
    const [remainBalance, setRemainBalance] = useState(0)
    const [recoverTypeCode, setRecoverTypeCode] = useState('')
    const [updateStatus, setUpdateStatus] = useState(0);
    const [Editval, setEditval] = useState();
    const [recoverDate, setDecoverDate] = useState();

    const [value, setValue] = useState({
        'PropertyID':('PropertyID'), 
        'CreatedByUserFK': ('PINID'),
        'PropertyID:': '',
        'RecoveredPropertyID': '',
        'RecoveredIDNumber': '',
        'RecoveredDateTime': '',
        'OfficerPFID': '',
        'RecoveryTypeID': '',
        'RecoveredValue': '',
        'Comments': '',
        'Balance': 0,
        'DispositionID': '',
        'UCRRecoveredID': '',
        'ModifiedByUserFK': '',
    });
 
    const [errors, setErrors] = useState({
        'DispositionIDError': '', 'OfficerPFIDError': '', 'RecoveryTypeIDError': '', 'Comments': '',
    })

    useEffect(() => {
        get_property_Data();
    }, [])

    const get_property_Data = () => {
        const val = {
            'PropertyID': ('PropertyID'), 
        }
        fetchPostData('RecoveredProperty_FRW/GetData_RecoveredProperty_FRW', val).then((res) => {
            if (res) {
                setvehicleData(res);
            } else {
                setvehicleData();
            }
        })
    }

    useEffect(() => {
        if (sessionStorage.getItem('vehicleStolenValue')) {
            if (vehicleData) {
                var remainBal = Decrypt_Id_Name(sessionStorage.getItem('vehicleStolenValue'), 'VForVehicleStolenValue');
                var newArr = vehicleData.map((val) => { return val.RecoveredValue });
                for (var i = 0; i < newArr.length; i++) {
                    remainBal = parseFloat(remainBal) - parseFloat(newArr[i]);
                }
                setRemainBalance(remainBal);
                setValue({ ...value, ['Balance']: remainBal })
            } else {
                setValue({ ...value, ['Balance']: parseFloat(Decrypt_Id_Name(sessionStorage.getItem('vehicleStolenValue'), 'VForVehicleStolenValue')) })
            }
        } else {
            setRemainBalance();
        }
    }, [updateStatus])

    useEffect(() => {
        if (RecoveredPropertyID) {
            GetSingleData(RecoveredPropertyID)
        }
    }, [RecoveredPropertyID, updateStatus])

    const GetSingleData = () => {
        const val = { 'RecoveredPropertyID': RecoveredPropertyID }
        fetchPostData('/RecoveredProperty_FRW/GetSingleData_RecoveredProperty_FRW', val)
            .then((res) => {
                if (res) setEditval(res)
                else setEditval()
            })
    }

    useEffect(() => {
        if (RecoveredPropertyID) {
            setValue({
                ...value,
                'DispositionID': Editval[0]?.DispositionID, 'UCRRecoveredID': Editval[0]?.UCRRecoveredID,
                'RecoveredPropertyID': Editval[0]?.RecoveredPropertyID, 'RecoveredIDNumber': Editval[0]?.RecoveredIDNumber, 'RecoveredDateTime': Editval[0]?.RecoveredDateTime,
                'OfficerPFID': Editval[0]?.OfficerPFID, 'RecoveredValue': Editval[0]?.RecoveredValue, 'RecoveryTypeID': Editval[0]?.RecoveryTypeID, 'Comments': Editval[0]?.Comments,
                'Balance': Editval[0]?.Balance, 'ModifiedByUserFK':('PINID'),
            })
            setDecoverDate(Editval[0]?.RecoveredDateTime ? new Date(Editval[0]?.RecoveredDateTime) : '');
            setRecoverTypeCode(Get_Property_Code(Editval, RecoveryTypeDrpData));
        }
    }, [Editval])

    const check_Validation_Error = (e) => {
        if (RequiredFieldIncident(value.DispositionID)) {
            setErrors(prevValues => { return { ...prevValues, ['DispositionIDError']: RequiredFieldIncident(value.DispositionID) } })
        }
        if (RequiredFieldIncident(value.OfficerPFID)) {
            setErrors(prevValues => { return { ...prevValues, ['OfficerPFIDError']: RequiredFieldIncident(value.OfficerPFID) } })
        }
        if (RequiredFieldIncident(value.RecoveryTypeID)) {
            setErrors(prevValues => { return { ...prevValues, ['RecoveryTypeIDError']: RequiredFieldIncident(value.RecoveryTypeID) } })
        }
        if (RequiredFieldSpaceNotAllow(value.Comments)) {
            setErrors(prevValues => { return { ...prevValues, ['Comments']: RequiredFieldSpaceNotAllow(value.Comments) } })
        }
    }

    // Check All Field Format is True Then Submit 
    const { DispositionIDError, OfficerPFIDError, RecoveryTypeIDError, Comments } = errors

    useEffect(() => {
        if (DispositionIDError === 'true' && OfficerPFIDError === 'true' && RecoveryTypeIDError === 'true' && Comments === 'true') {
            if (RecoveredPropertyID) Update_RecoveredProperty()
            else Add_RecoveredProperty()
        }
    }, [DispositionIDError, OfficerPFIDError, RecoveryTypeIDError, Comments])

    useEffect(() => {
        get_Head_Of_Agency(); get_RecoveryType(); get_UCRRecovered(); get_Dispositions();
    }, [])

    const get_Head_Of_Agency = () => {
        const val = {
            AgencyID: ('AgencyID'), 
        }
        fetchPostData('DropDown/GetData_HeadOfAgency', val).then((data) => {
            if (data) {
                setHeadOfAgency(Comman_changeArrayFormat(data, 'PINID', 'HeadOfAgency'));
            }
            else {
                setHeadOfAgency([])
            }
        })
    };

    const get_RecoveryType = () => {
        const val = {
            AgencyID: ('AgencyID'), 
        }
        fetchPostData('RecoveryType/GetDataDropDown_RecoveryType', val).then((data) => {
            if (data) {
                setRecoveryTypeDrpData(threeColArray(data, 'RecoveryTypeID', 'Description', 'RecoveryTypeCode'));
            }
            else {
                setRecoveryTypeDrpData([])
            }
        })
    };

    const get_UCRRecovered = () => {
        const val = {
            AgencyID: ('AgencyID'), 
        }
        fetchPostData('UCRRecovered/GetDataDropDown_UCRRecovered', val).then((data) => {
            if (data) {
                setUCRRecoveredDrpData(Comman_changeArrayFormat(data, 'UCRRecoveredID', 'Description'));
            }
            else {
                setUCRRecoveredDrpData([])
            }
        })
    };

    const get_Dispositions = () => {
        const val = {
            AgencyID: ('AgencyID'), 
        }
        fetchPostData('PropertyDispositions/GetDataDropDown_PropertyDispositions', val).then((data) => {
            if (data) {
                setDispositionsDrpData(Comman_changeArrayFormat(data, 'PropertyDispositionsID', 'Description'));
            }
            else {
                setDispositionsDrpData([])
            }
        })
    };

    const HandleChanges = (e) => {
        if (e.target.name === 'RecoveredValue') {

            // <----------------------------------old without dot------------------------->

            // var ele = e.target.value.replace(/[^0-9.]/g, "")
            // if (ele.length === 10) {
            //     var cleaned = ('' + ele).replace(/[^0-9.]/g, '');
            //     setValue(pre => { return { ...pre, ['Balance']: parseFloat(remainBalance) - parseFloat(e.target.value), [e.target.name]: cleaned } });
            // } else {
            //     ele = e.target.value.split('$').join('').replace(/[^0-9.]/g, "");
            //     setValue(pre => { return { ...pre, ['Balance']: parseFloat(remainBalance) - parseFloat(e.target.value), [e.target.name]: ele } });
            // }

            // <----------------------------------New with dot------------------------->

            var ele = e.target.value.replace(/[^0-9\.]/g, "")
            if (ele.includes('.')) {
                if (ele.length === 16) {
                    // setValue({ ...value, [e.target.name]: ele });
                    setValue(pre => { return { ...pre, ['Balance']: parseFloat(remainBalance) - parseFloat(e.target.value), [e.target.name]: ele } });
                } else {
                    if (ele.substr(ele.indexOf('.') + 1).slice(0, 2)) {
                        // setValue({ ...value, [e.target.name]: ele.substring(0, ele.indexOf(".")) + '.' + ele.substr(ele.indexOf('.') + 1).slice(0, 2) });
                        setValue(pre => { return { ...pre, ['Balance']: parseFloat(remainBalance) - parseFloat(e.target.value), [e.target.name]: ele.substring(0, ele.indexOf(".")) + '.' + ele.substr(ele.indexOf('.') + 1).slice(0, 2) } });
                    } else {
                        setValue(pre => { return { ...pre, ['Balance']: parseFloat(remainBalance) - parseFloat(e.target.value), [e.target.name]: ele } });
                    }
                }
            } else {
                if (ele.length === 16) {
                    setValue(pre => { return { ...pre, ['Balance']: parseFloat(remainBalance) - parseFloat(e.target.value), [e.target.name]: ele } });
                } else {
                    setValue(pre => { return { ...pre, ['Balance']: parseFloat(remainBalance) - parseFloat(e.target.value), [e.target.name]: ele } });
                }
            }
        } else {
            setValue({
                ...value,
                [e.target.name]: e.target.value
            })
        }
    }

    const ChangeDropDown = (e, name) => {
        if (e) {
            if (name === 'RecoveryTypeID') {
                setValue({
                    ...value,
                    ['RecoveryTypeID']: e.value
                })
                setRecoverTypeCode(e.id)
                if (e.id === 'FU' || e.id === 'F') {
                    if (vehicleData) {
                        setValue(pre => { return { ...pre, ['RecoveredValue']: remainBalance } })
                    } else {
                        setValue(pre => { return { ...pre, ['RecoveredValue']: Decrypt_Id_Name(sessionStorage.getItem('vehicleStolenValue'), 'VForVehicleStolenValue'), } })
                    }
                } else if (e.id === 'P') {
                    setValue(pre => { return { ...pre, ['RecoveredValue']: '' } })
                }
            } else {
                setValue({
                    ...value,
                    [name]: e.value
                });
            }
        } else {
            setValue({
                ...value,
                [name]: null
            });
        }
    }

    const Add_RecoveredProperty = (e) => {
        AddDeleteUpadate('RecoveredProperty_FRW/Insert_RecoveredProperty_FRW', value)
            .then((res) => {
                toastifySuccess(res.Message);
                get_property_Data();
                // setModal(false);
                reset();
                setErrors({ ...errors, 'DispositionIDError': '', });
            });
    }
    //   if (value.RecoveredValue != 0) {
    //     if (parseFloat(value.RecoveredValue) <= parseFloat(remainBalance)) {
    //       if (remainBalance !== 0) {
    //         AddDeleteUpadate('VehicleRecovered_FRW/Insert_VehicleRecovered_FRW', value)
    //           .then((res) => {
    //             toastifySuccess(res.Message);
    //             get_property_Data();
    //             // setModal(false);
    //             reset();
    //             setErrors({ ...errors, 'DispositionIDError': '', });
    //           });
    //       } else {
    //         toastifyError("Remaining Balance is Zero");
    //         setErrors({ ...errors, 'DispositionIDError': '', });
    //       }
    //     } else {
    //       toastifyError("Recovered value should not be greater than Remaining Value");
    //       setErrors({ ...errors, 'DispositionIDError': '', });
    //     }
    //   } else {
    //     toastifyError("Recovered value is must be Greater than Zero");
    //     setErrors({ ...errors, 'DispositionIDError': '', });
    //   }
    // }

    const Update_RecoveredProperty = () => {
        AddDeleteUpadate('RecoveredProperty_FRW/Update_RecoveredProperty_FRW', value).then((res) => {
            toastifySuccess(res.Message);
            setRecoveredPropertyID('');
            reset();
            setVehicleRecovered(false);
            get_property_Data(); setErrors({ ...errors, 'DispositionIDError': '', });
        })
    }

    const OnClose = () => {
        // setModal(false)
        reset();
        setRecoveredPropertyID(); setRecoverTypeCode()
    }
    const reset = () => {
        setValue(pre => {
            return {
                ...pre,
                'RecoveredIDNumber': '', 'RecoveredDateTime': '', 'OfficerPFID': '', 'RecoveryTypeID': '', 'RecoveredValue': '', 'Comments': '', 'DispositionID': '', 'UCRRecoveredID': '',
            }
        }); setDecoverDate("")
        setErrors({
            ...errors,
            'DispositionIDError': '', 'OfficerPFIDError': '', 'RecoveredDateTimeError': '', 'RecoveryTypeIDError': '', 'Comments': '',
        });
    }

    const columns = [
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, }}>Action</p>,
            cell: row => <>
                <div className="div" style={{ position: 'absolute', top: 4, left: 20 }}>
                    {
                        EffectiveScreenPermission ? EffectiveScreenPermission[0]?.Changeok ?
                            <Link to={''} onClick={() => { setEditVal(row); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#RecoveredPropertyModal" >
                                <i className="fa fa-edit"></i>
                            </Link>
                            : <></>
                            : <Link to={''} onClick={() => { setEditVal(row); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#RecoveredPropertyModal" >
                                <i className="fa fa-edit"></i></Link>
                    }

                </div>
            </>
        },
        {
            name: 'RecoveredID Number',
            selector: (row) => row.RecoveredIDNumber,
            sortable: true
        },
        {
            name: 'Comments',
            selector: (row) => row.Comments,
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 60 }}>Delete</p>,
            cell: row => <>
                <div className="div" style={{ position: 'absolute', top: 4, right: 65 }}>
                    {
                        EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DeleteOK ?
                            <Link to={`#`} onClick={() => { setRecoveredPropertyID(row.RecoveredPropertyID); setModalstatus(true) }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#myModal2">
                                <i className="fa fa-trash"></i>
                            </Link>
                            : <></>
                            : <Link to={`#`} onClick={() => { setRecoveredPropertyID(row.RecoveredPropertyID); setModalstatus(true) }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#myModal2">
                                <i className="fa fa-trash"></i>
                            </Link>
                    }
                </div>
            </>
        }
    ]

    const setEditVal = (row) => {
        setRecoveredPropertyID(row.RecoveredPropertyID);
        setVehicleRecovered(true);
    }
    const Delete_RecoveredProperty = () => {
        const val = {
            'RecoveredPropertyID': RecoveredPropertyID,
            'DeletedByUserFK': ('PINID'),
        }
        AddDeleteUpadate('RecoveredProperty_FRW/Delete_RecoveredProperty_FRW', val).then((res) => {
            if (res) {
                toastifySuccess(res.Message);
                get_property_Data(); setModalstatus(false); setRecoveredPropertyID('');
            } else console.log("Somthing Wrong");
        })
    }

    const CloseModel = () => {
        setVehicleRecovered(false); setModalstatus(false); setRecoveredPropertyID(''); reset();
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
    const startRef1 = React.useRef();
    const startRef2 = React.useRef();
    const startRef3 = React.useRef();
    const startRef4 = React.useRef();

    const onKeyDown = (e) => {
        if (e.keyCode === 9 || e.which === 9) {
            startRef.current.setOpen(false);
            startRef1.current.setOpen(false);
            startRef2.current.setOpen(false);
            startRef3.current.setOpen(false);
            startRef4.current.setOpen(false);
        }
    };

    return (
        <>

            <div className="col-md-12  pt-2">
                <div className="bg-line text-white py-1 px-2 d-flex justify-content-between align-items-center">
                    <p className="p-0 m-0 d-flex align-items-center" style={{ fontSize: '18px' }}>
                        Vehicle Recovered
                    </p>
                    {/* {
            <Link to={''} onClick={() => { setVehicleRecovered(true); }} className="btn btn-sm bg-green text-white px-2 py-0  new-button">
              <i className="fa fa-plus"></i>
            </Link>
          } */}
                    {
                       ('PropertyID') ?
                            <Link to={'#'} onClick={() => { setVehicleRecovered(true); reset(); }} className="btn btn-sm bg-green text-white px-2 py-0 new-button ">
                                <i className="fa fa-plus"></i>
                            </Link>
                            :
                            <></>
                    }
                </div>
            </div>
            {
                VehicleRecovered ?
                    <>
                        <div className="row mt-2">
                            <div className="col-12">
                                <div className="row bb">
                                    <div className="col-6 col-md-6 col-lg-4 mt-1">
                                        <div class="text-mobile">
                                            <input type="text" className="readonlyColor" name="recoverid" value={value?.RecoveredIDNumber} required readOnly />
                                            <label>Recovered Id</label>
                                        </div>
                                    </div>
                                    <div class="col-6 col-md-6  col-lg-4 ">
                                        <div class="text__dropdwon">
                                            <Select
                                                name='OfficerPFID'
                                                id='OfficerPFID'
                                                value={headOfAgency?.filter((obj) => obj.value === value?.OfficerPFID)}
                                                options={headOfAgency}
                                                onChange={(e) => ChangeDropDown(e, 'OfficerPFID')}
                                                styles={colourStyles}
                                                isClearable
                                                placeholder="Select..."
                                            />
                                            <label htmlFor='' className='pt-1'>Officer Pf</label>
                                            {errors.OfficerPFIDError !== 'true' ? (
                                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.OfficerPFIDError}</span>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="col-6 col-md-6 col-lg-4">
                                        <div className="text__dropdwon ">
                                            <DatePicker
                                                id='RecoveredDateTime'
                                                name='RecoveredDateTime'
                                                ref={startRef}
                                                onKeyDown={onKeyDown}
                                                onChange={(date) => { setDecoverDate(date); setValue({ ...value, ['RecoveredDateTime']: date ? getShowingMonthDateYear(date) : null }) }}
                                                dateFormat="MM/dd/yyyy HH:mm"
                                                timeInputLabel
                                                isClearable={value?.RecoveredDateTime ? true : false}
                                                selected={recoverDate}
                                                placeholderText={value?.RecoveredDateTime ? value.RecoveredDateTime : 'Select...'}
                                                showTimeSelect
                                                timeIntervals={1}
                                                timeCaption="Time"
                                                autoComplete='Off'
                                                className='readonlyColor name-datepicker'
                                                showMonthDropdown
                                                showYearDropdown
                                                peekNextMonth
                                                dropdownMode="select"
                                                maxDate={new Date(sessionStorage.getItem('OccurredFromDate') ? Decrypt_Id_Name(sessionStorage.getItem('OccurredFromDate'), 'OForOccurredFromDate') : null)}
                                            />
                                            <label htmlFor="" className='pt-1'>Recovered Date/Time</label>

                                        </div>
                                    </div>
                                    <div class="col-6 col-md-6  col-lg-4  mt-2">
                                        <div class="text__dropdwon">
                                            <Select
                                                name='RecoveryTypeID'
                                                value={RecoveryTypeDrpData?.filter((obj) => obj.value === value?.RecoveryTypeID)}
                                                options={RecoveryTypeDrpData}
                                                onChange={(e) => ChangeDropDown(e, 'RecoveryTypeID')}
                                                styles={colourStyles}
                                                isClearable
                                                placeholder="Select..."
                                            />
                                            <label htmlFor='' className='pt-2'>Recovery Type</label>
                                            {errors.RecoveryTypeIDError !== 'true' ? (
                                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.RecoveryTypeIDError}</span>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="col-6 col-md-6 col-lg-4 mt-1 pt-2">
                                        <div class="text-mobile">
                                            <input type="text" maxLength={19} name="RecoveredValue" value={value?.RecoveredValue} onChange={HandleChanges} className={`${recoverTypeCode === 'P' ? " " : "readonlyColor"} requiredColor`} required readOnly={recoverTypeCode === 'P' ? false : true} />
                                            <label className='pt-1'>Recovered Value</label>
                                        </div>
                                    </div>
                                    <div className="col-12  col-md-12 col-lg-12 mt-2 mb-2" >
                                        <div className="text__dropdwon">
                                            <textarea name='Comments' value={value?.Comments} onChange={HandleChanges} id="Comments" cols="30" rows='2' className="form-control  requiredColor" ></textarea>
                                            <label htmlFor="" className='pt-1'>Comments</label>
                                            {errors.Comments !== 'true' ? (
                                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.Comments}</span>
                                            ) : null}
                                        </div>

                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-6 col-md-6 col-lg-6 mt- pt-1">
                                        <div class="text-mobile">
                                            <input type="text" name="Balance" value={value?.Balance > 0 ? value?.Balance : remainBalance} onChange={HandleChanges} className="readonlyColor" required readOnly />
                                            <label className='pt-1'>Balance</label>

                                        </div>
                                    </div>
                                    <div class="col-6 col-md-6  col-lg-6 ">
                                        <div class="text__dropdwon ">
                                            <Select
                                                name='DispositionID'
                                                value={DispositionsDrpData?.filter((obj) => obj.value === value?.DispositionID)}
                                                options={DispositionsDrpData}
                                                onChange={(e) => ChangeDropDown(e, 'DispositionID')}
                                                styles={colourStyles}
                                                isClearable
                                                placeholder="Select..."
                                            />
                                            <label htmlFor='' className='pt-1'>Disposition</label>
                                            {errors.DispositionIDError !== 'true' ? (
                                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DispositionIDError}</span>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 text-right  mt-3" >
                            {
                                RecoveredPropertyID ?
                                    <button type="button" className="btn btn-lg  btn-success new-button mr-3" onClick={() => { check_Validation_Error(); }} >Update</button>
                                    :
                                    <button type="button" className="btn btn-lg  btn-success new-button mr-3" onClick={() => { check_Validation_Error(); }}>Save</button>
                            }
                            <button type="button" onClick={CloseModel} className="btn btn-lg  btn-success new-button">Close</button>
                        </div>
                    </>
                    :
                    <>
                        <div className="col-md-12 px-4 pt-2">
                            <DataTable
                                columns={columns}
                                data={vehicleData}
                                dense
                                pagination
                                paginationPerPage={'5'}
                                paginationRowsPerPageOptions={[5, 15, 20]}
                                highlightOnHover
                                customStyles={tableCustomStyles}
                                // subHeader
                                responsive
                                className='mobile-datatable'
                                showPaginationBottom={5}
                                subHeaderComponent
                            />
                        </div>
                        {
                            modalStatus ?
                                <div class="modal" id="myModal2" style={{ background: "rgba(0,0,0, 0.5)", transition: '0.5s' }} data-backdrop="false">
                                    <div class="modal-dialog">
                                        <div class="modal-content">
                                            <div className="box text-center py-5">
                                                <h5 className="modal-title mt-2" id="exampleModalLabel">Do you want to Delete ?</h5>
                                                <div className="btn-box mt-3">
                                                    <button type="button" onClick={Delete_RecoveredProperty} className="btn btn-sm text-white" style={{ background: "#ef233c" }} >Delete</button>
                                                    <button type="button" onClick={() => { setModalstatus(false); setRecoveredPropertyID(''); }} className="btn btn-sm btn-secondary ml-2 " > Cancel</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                :
                                <></>
                        }
                    </>
            }
        </>
    )
}

export default MobileRecoveredProperty
const Get_Property_Code = (data, dropDownData) => {
    // console.log(data)
    const result = data?.map((sponsor) => (sponsor.RecoveryTypeID))

    const result2 = dropDownData?.map((sponsor) => {
        if (sponsor.value === result[0]) {
            return { value: result[0], label: sponsor.label, id: sponsor.id }
        }
    }
    )
    const val = result2.filter(function (element) {
        return element !== undefined;
    });
    return val[0]?.id
}