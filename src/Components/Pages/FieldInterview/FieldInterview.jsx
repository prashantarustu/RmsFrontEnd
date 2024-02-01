import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom';
import DatePicker from "react-datepicker";
import Select from "react-select";
import Tab from '../../Utility/Tab/Tab';
import DataTable from 'react-data-table-component';
import Loader from '../../Common/Loader';
import { AgencyContext } from '../../../Context/Agency/Index';

const FieldInterview = () => {

    const { propertyData, get_Data_Property, updateCount, setUpdateCount, setIncStatus, loder, propertyFilterData, setPropertyFilterData, get_Property_Count, setIncidentStatus, get_Incident_Count, localStoreArray, get_LocalStorage, propertyStatus, setPropertyStatus, deleteStoreData, storeData } = useContext(AgencyContext);
    const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState();
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
                                <div className="row  ">
                                    <div className={`col-12 col-md-12`}>
                                        <div className="row">
                                            <div className="col-12 pl-3  inc__tabs">
                                                <Tab />
                                            </div>
                                            <div className="col-12  mt-2">
                                                <div className="bg-line text-white py-1 px-2 d-flex justify-content-between align-items-center">
                                                    <p className="p-0 m-0">Field Interview</p>
                                                    <p className="p-0 m-0">
                                                        <Link to={'/field-interviewtab'} className="btn btn-sm bg-green text-white px-2 py-0" >
                                                            <i className="fa fa-plus"></i>
                                                        </Link>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 ">
                           
                                            <DataTable
                                                dense
                                                // columns={columns}
                                                // data={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? propertyFilterData : '' : propertyFilterData}
                                                pagination
                                                selectableRowsHighlight
                                                highlightOnHover
                                                noDataComponent={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                                                subHeader
                                                responsive
                                                showPaginationBottom={10}
                                            />
                           
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default FieldInterview