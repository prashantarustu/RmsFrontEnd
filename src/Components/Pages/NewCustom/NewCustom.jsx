import React from 'react'
import { Link } from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown';
import DataTable from 'react-data-table-component';
import { useState, useEffect } from 'react';
import { Decrypt_Id_Name } from '../../Common/Utility';
import { AddDeleteUpadate, fetch_Post_Data } from '../../hooks/Api';
import { toastifyError, toastifySuccess } from '../../Common/AlertMsg';
import { Filter } from '../../Filter/Filter';

const NewCustom = () => {  

    const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState()

    const [DataList, setDataList] = useState();
    const [filterDataList, setFilterDataList] = useState();
    const [status, setStatus] = useState(false);
    // const [tabstatus, setTabStatus] = useState(false);
    const [pageStatus, setPageStatus] = useState("1")
    const [modal, setModal] = useState(false)
   

    // useEffect(() => {
    //     get_Data_List();
    // }, [])



    const get_Data_List = () => {
        const val = {
            AgencyID: Decrypt_Id_Name(localStorage.getItem('AgencyID'), 'AForAgencyID'),
            IsActive: pageStatus,
            IsSuperadmin: Decrypt_Id_Name(localStorage.getItem('IsSuperadmin'), 'IsForSuperadmin'),
            PINID: Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID')
        }
        fetch_Post_Data('AgeUnit/GetData_AgeUnit', val)
            .then((res) => {
                if (res) {
                    setDataList(res?.Data)
                    setFilterDataList(res?.Data)
                    setEffectiveScreenPermission(res?.Permision)
                }
                else { setDataList(); setFilterDataList(); setEffectiveScreenPermission() }
            })
    }

    const [IsActive, setIsActive] = useState('')
    const [singleTypeId, setSingleTypeId] = useState('')


    const UpdActiveDeactive = () => {
        const value = {
            'IsActive': IsActive,
            'AgeUnitID': singleTypeId,
            'DeletedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
        }
        AddDeleteUpadate('AgeUnit/DeleteAgeUnit', value)
            .then(res => {
                if (res.success) {
                    toastifySuccess(res.Message); get_Data_List();
                } else {
                    toastifyError(res.data.Message)
                }
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }
    
    
    // Table Columns Array
    const columns = [
        {
            name: 'Code',
            selector: (row) => row.AgeUnitCode,
            sortable: true
        },
        {
            name: 'AgencyCode',
            selector: (row) => row.AgencyCode,
            sortable: true
        },
        {
            name: 'Description',
            selector: (row) => row.Description,
            sortable: true
        },
    
     
    ]

 

    return (
        <>
            <div className="row">
                <div className="col-12 col-md-12 col-lg-12 ">
                    <div className="row mt-2">
                        <div className="col-12 ">
                            <div className="bg-green text-white py-1 px-2 d-flex justify-content-between align-items-center">
                                <p className="p-0 m-0">list</p>
                            </div>
                        </div>
                    </div>
                </div>
           
                <div className="table-responsive mt-2">
                    <div className="col-12">
                        <div className="row ">
                            <div className="col-12">
                                <DataTable
                                    columns={columns}
                                    data={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? filterDataList : '' : ''}
                                    // data={BloodTypeData}
                                    dense
                                    paginationPerPage={'10'}
                                    paginationRowsPerPageOptions={[5, 10, 15]}
                                    highlightOnHover
                                    noContextMenu
                                    pagination
                                    responsive
                                    subHeaderAlign="right"
                                    // fixedHeader
                                    subHeaderWrap
                                    noDataComponent={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
         
        </>
    )
}

export default NewCustom