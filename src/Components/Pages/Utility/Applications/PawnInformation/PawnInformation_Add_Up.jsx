import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Select from "react-select";
import DatePicker from "react-datepicker";
import { getShowingMonthDateYear } from '../../../../Common/Utility';
import DataTable from 'react-data-table-component';
import SubTab from '../../../../Utility/Tab/SubTab';
import { PawnTabs } from '../../../../Utility/Tab/TabsArray';
import PropertyPawn from '../PawnTabs/PropertyPawn';
import VehiclePawn from '../PawnTabs/VehiclePawn';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api';
import { toastifySuccess } from '../../../../Common/AlertMsg';

const PawnInformation_Add_Up = () => {

    const { localStoreArray, get_LocalStorage, storeData, deleteStoreData } = useContext(AgencyContext);
    const navigate = useNavigate()

    const [showPage, setShowPage] = useState('VehiclePawn');
    const [pawnStatus, setPawnStatus] = useState(false);

    const [LoginAgencyID, setLoginAgencyID] = useState('');
    const [LoginPinID, setLoginPinID] = useState('');
    const [pawnID, setpawnID] = useState('');
    const [EditVal, setEditVal] = useState();

    const [value, setValue] = useState({
        PawnBrokerIssue: '',
        PawnDate: '',
        PawnShopID: '',
        PledgorName: '',
        PledgorID: '',
        BuyerName: '',
        BuyerID: '',
        AgencyID: '',
        CreatedByUserFK: '',
        ModifiedByUserFK: '',
        PawnID: '',
    });

    useEffect(() => {
        if (!localStoreArray.AgencyID || !localStoreArray.PINID) {
            get_LocalStorage();
        }
    }, []);

    // Onload Function
    useEffect(() => {
        console.log(localStoreArray)
        if (localStoreArray) {
            if (localStoreArray.AgencyID && localStoreArray.PINID) {
                setLoginAgencyID(localStoreArray?.AgencyID);
                setLoginPinID(localStoreArray?.PINID);
                if (localStoreArray?.PawnID) {
                    setpawnID(parseFloat(localStoreArray?.PawnID));
                    setPawnStatus(true);
                } else {
                    setPawnStatus(false);
                }
            }
        }
    }, [localStoreArray]);

    useEffect(() => {
        if (LoginAgencyID) { setValue({ ...value, AgencyID: LoginAgencyID, CreatedByUserFK: LoginPinID }) }
    }, [LoginAgencyID]);

    useEffect(() => {
        if (pawnID) {
            getPawn_SingleData(pawnID);
        }
    }, [pawnID]);

    const getPawn_SingleData = (pawnID) => {
        fetchPostData('Pawn/GetSingleData_Pawn', { PawnID: pawnID }).then((data) => {
            console.log("getPawn_SingleData", data);
            // setValue(data[0])
            setEditVal(data)
        }).catch((err) => {
            console.log("Error : " + err.message);
        })
    };

    useEffect(() => {
        // console.log(EditVal)
        if (pawnID && EditVal?.length > 0) {
            setValue({
                ...value,
                PawnBrokerIssue: EditVal[0]?.PawnBrokerIssue,
                PawnDate: EditVal[0]?.PawnDate,
                PawnShopID: EditVal[0]?.PawnShopID,
                PledgorName: EditVal[0]?.PledgorName,
                PledgorID: EditVal[0]?.PledgorID,
                BuyerName: EditVal[0]?.BuyerName,
                BuyerID: EditVal[0]?.BuyerID,
                AgencyID: EditVal[0]?.AgencyID,
                CreatedByUserFK: EditVal[0]?.CreatedByUserFK,
                ModifiedByUserFK: LoginPinID,
                PawnID: EditVal[0]?.PawnID,
            })
        } else {
            reset()
        }
    }, [EditVal]);

    const insertPawnInfo = () => {
        console.log(value)
        AddDeleteUpadate('Pawn/InsertPawn', value).then((res) => {
            if (res?.success) {
                toastifySuccess(res?.Message);
                if (res?.PawnID) {
                    setpawnID(res?.PawnID)
                }
            }
        })
    }

    const updatePawnInfo = () => {
        AddDeleteUpadate('Pawn/UpdatePawn', value).then((res) => {
            if (res?.success) {
                toastifySuccess(res?.Message);
            }
        })
    }

    const reset = () => {
        setValue({
            ...value,
            PawnBrokerIssue: '', PawnDate: '', PawnShopID: '', PledgorName: '', PledgorID: '', BuyerName: '', BuyerID: '',
            // AgencyID: '', CreatedByUserFK: '',  ModifiedByUserFK: '', PawnID: '',
        })
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

    const onClose = () => {
        navigate('/PawnInformation')
        deleteStoreData({ 'PawnID': '', 'PawnStatus': '', });
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
        <div className="section-body view_page_design pt-3">
            <div className="row clearfix">
                <div className="col-12 col-sm-12">
                    <div className="card Agency">
                        <div className="card-body">
                            <div className="bg-green text-white py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                                <p className="p-0 m-0 d-flex align-items-center">
                                    Pawn Information
                                </p>
                                <p className="p-0 m-0">
                                    {/* <Link to="#" className="text-white"
                                        data-toggle="modal" data-target="#" >
                                        <i className="fa fa-plus"></i>
                                    </Link> */}
                                </p>
                            </div>
                            <div className="row mt-2">
                                <div className="col-6 col-md-6 col-lg-4 mt-2">
                                    <div class="text-field">
                                        <input type="text" name='PawnBrokerIssue' value={value?.PawnBrokerIssue} onChange={handleChange} required />
                                        <label>Pawn Broker Issue</label>
                                    </div>
                                </div>
                                <div className="col-6 col-md-6 col-lg-4 mt-3 date__box">
                                    <DatePicker
                                        id='PawnDate'
                                        name='PawnDate'
                                        onChange={(date) => { setValue({ ...value, ['PawnDate']: date ? getShowingMonthDateYear(date) : null }) }}
                                        dateFormat="MM/dd/yyyy"
                                        isClearable={value?.PawnDate ? true : false}
                                        selected={value?.PawnDate && new Date(value?.PawnDate)}
                                        maxDate={new Date()}
                                        placeholderText={'Select...'}
                                        autoComplete="Off"
                                        showDisabledMonthNavigation
                                        showYearDropdown
                                        showMonthDropdown
                                        dropdownMode="select"
                                    />
                                    <label htmlFor="">Pawn Date</label>
                                </div>
                                <div className="col-6 col-md-6 col-lg-4 mt-2">
                                    <div className=" dropdown__box">
                                        <Select
                                            name='PawnShopID'
                                            styles={customStylesWithOutColor}
                                            // value={headOfAgency?.filter((obj) => obj.value === value?.PawnShopID)}
                                            isClearable
                                            // options={headOfAgency}
                                            onChange={(e) => ChangeDropDown(e, 'PawnShopID')}
                                            placeholder="Select..."
                                        />
                                        <label htmlFor="" className='pl-0'>Pawn Shop Name</label>
                                    </div>
                                </div>
                                <div className="col-6 col-md-6 col-lg-4 d-flex mt-2  px-0">
                                    <div className="col-10 col-md-10 col-lg-11  ">
                                        <div class="text-field">
                                            <input type="text" name='PledgorName' value={value?.PledgorName} onChange={handleChange} required />
                                            <label>Pledgor</label>
                                        </div>
                                    </div>
                                    <div className="col-1 col-md-1 col-lg-1 mt-2 pt-1 pl-0">
                                        <Link to="/nametab?page=clear" className="btn btn-sm bg-green text-white ">
                                            <i className="fa fa-plus"></i>
                                        </Link>
                                    </div>
                                </div>
                                <div className="col-6 col-md-6 col-lg-4 d-flex mt-2 ">
                                    <div className="col-10 col-md-10 col-lg-11 ">
                                        <div class="text-field">
                                            <input type="text" name='BuyerName' value={value?.BuyerName} onChange={handleChange} required />
                                            <label>Buyer</label>
                                        </div>
                                    </div>
                                    <div className="col-1 col-md-1 col-lg-1 mt-2 pt-1">
                                        <Link to="/nametab?page=clear" className="btn btn-sm bg-green text-white ">
                                            <i className="fa fa-plus"></i>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="btn-box text-right mt-2 mb-1 mr-1">
                                {
                                    pawnID && EditVal?.length > 0 ?
                                        <button type="button" onClick={updatePawnInfo} class="btn btn-sm btn-success mr-2" >Update</button>
                                        :
                                        <button type="button" onClick={insertPawnInfo} class="btn btn-sm btn-success mr-2" >Save</button>
                                }
                                {/* <Link to={'/PawnInformation'}> */}
                                <button type="button" onClick={onClose} class="btn btn-sm btn-success" data-dismiss="modal" >Close</button>
                                {/* </Link> */}
                            </div>
                            <div className={`col-12 col-md-12`}>
                                <div className="row px-0">
                                    <div className={`col-12 col-md-12`}>
                                        <div className="col-12 mt-3">
                                            <SubTab tabs={PawnTabs} status={pawnStatus} showPage={showPage} setShowPage={setShowPage} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {
                                showPage === 'VehiclePawn' && pawnStatus ?
                                    <VehiclePawn />
                                    :
                                    showPage === 'PropertyPawn' && pawnStatus ?
                                        <PropertyPawn />
                                        :
                                        <></>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PawnInformation_Add_Up