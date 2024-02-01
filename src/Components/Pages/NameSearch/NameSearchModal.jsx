import React, { memo, useContext } from 'react'
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import { Decrypt_Id_Name, getShowingDateText, getShowingWithOutTime } from '../../Common/Utility';
import { useState } from 'react';
import { useEffect } from 'react';
import { AgencyContext } from '../../../Context/Agency/Index';
import { fetchPostData } from '../../hooks/Api';
import { toastifyError } from '../../Common/AlertMsg';

const NameSearchModal = ({ MainIncidentID, nameSearchValue, setValue, value, setDOBDate, get_Name_MultiImage }) => {

    const { nameSearchStatus, setNameSearchStatus } = useContext(AgencyContext);
    const [Editval, setEditval] = useState([]);

    useEffect(() => {
        if (Editval) {
            setDOBDate(getShowingWithOutTime(Editval?.DateOfBirth))
            setValue({
                ...value,
                'NameID': Editval?.NameID,
                'MasterNameID': Editval?.MasterNameID, 'EthnicityID': Editval?.EthnicityID,
                'NameIDNumber': Editval?.NameIDNumber ? Editval?.NameIDNumber : 'Auto Generated',
                'checkVictem': Editval?.NewVictimID ? Editval?.NewVictimID?.NewVictimID : "", 'checkOffender': Editval?.NewOffenderID ? Editval?.NewOffenderID?.NewOffenderID : "",
                // DropDown
                'NameTypeID': Editval?.NameTypeID, 'BusinessTypeID': Editval?.BusinessTypeID, 'SuffixID': Editval?.SuffixID, 'VerifyID': Editval?.VerifyID,
                'SexID': Editval?.SexID, 'RaceID': Editval?.RaceID, 'PhoneTypeID': Editval?.PhoneTypeID,
                'NameReasonCodeID': '', 'CertifiedByID': Editval?.CertifiedByID,
                // checkbox
                'IsJuvenile': Editval?.IsJuvenile, 'IsVerify': Editval?.IsVerify, 'IsUnListedPhNo': Editval?.IsUnListedPhNo,
                //textbox
                'LastName': Editval?.LastName, 'FirstName': Editval?.FirstName, 'MiddleName': Editval?.MiddleName,
                'SSN': Editval?.SSN, 'WeightFrom': Editval?.WeightFrom, 'WeightTo': Editval?.WeightTo,
                'HeightFrom': Editval?.HeightFrom, 'HeightTo': Editval?.HeightTo, 'Address': Editval?.Address,
                'Contact': Editval?.Contact, 'AgeFrom': Editval?.AgeFrom ? Editval?.AgeFrom : '', 'AgeTo': Editval?.AgeTo ? Editval?.AgeTo : '',
                //Datepicker
                'DateOfBirth': Editval?.DateOfBirth ? getShowingWithOutTime(Editval?.DateOfBirth) : '',
                'CertifiedDtTm': Editval?.CertifiedDtTm ? getShowingDateText(Editval?.CertifiedDtTm) : '',
                'Years': Editval?.Years, 'checkOffender': 0, 'checkVictem': 0
            })
            setDOBDate(Editval?.DateOfBirth ? new Date(getShowingWithOutTime(Editval?.DateOfBirth)) : '');
            get_Name_MultiImage(0, Editval?.MasterNameID)
        }
    }, [Editval])

    const columns = [
        {
            name: 'NameID',
            selector: (row) => <>{row?.NameIDNumber} </>,
            sortable: true
        },
        {
            name: 'LastName',
            // selector: (row) => row.LastName,
            selector: (row) => <>{row?.LastName ? row?.LastName.substring(0, 10) : ''}{row?.LastName?.length > 20 ? '  . . .' : null} </>,
            sortable: true
        },
        {
            name: 'FirstName',
            // selector: (row) => row.FirstName,
            selector: (row) => <>{row?.FirstName ? row?.FirstName.substring(0, 10) : ''}{row?.FirstName?.length > 20 ? '  . . .' : null} </>,
            sortable: true
        },
        {
            name: 'MiddleName',
            // selector: (row) => row.MiddleName,
            selector: (row) => <>{row?.MiddleName ? row?.MiddleName.substring(0, 10) : ''}{row?.MiddleName?.length > 20 ? '  . . .' : null} </>,
            sortable: true
        },
        {
            name: 'SSN',
            selector: (row) => row.SSN,
            sortable: true
        },
        {
            name: 'DOB',
            selector: (row) => row.DateOfBirth ? getShowingDateText(row.DateOfBirth) : '',
            sortable: true
        },
        {
            name: 'Gender',
            selector: (row) => row.Gender_Description,
            sortable: true
        },
        {
            name: 'Race',
            selector: (row) => row.Race_Description,
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: '7px' }}>Action</p>,
            cell: row => <>
                {
                    <Link to={'#'} onClick={() => setEditValue(row)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
                        <i className="fa fa-edit"></i>
                    </Link>
                }
            </>
        }
    ]

    // http://localhost:26055/api/MasterName/GetData_EventNameExists
    // Data:
    // MasterNameID:
    // IncidentID:

    const setEditValue = (row) => {
        fetchPostData("MasterName/GetData_EventNameExists", {
            "MasterNameID": row.MasterNameID,
            "IncidentID": MainIncidentID ? MainIncidentID : '',
        }).then((data) => {
            if (data) {
                console.log(data[0])
                if (data[0]?.Total === 0) {
                    console.log(row)
                    setEditval(row); setNameSearchStatus(false);
                } else {
                    toastifyError('Name Already Exists'); setNameSearchStatus(true);
                }
            } else {

            }
        })
    }

    // const setEditValue = (row) => {
    //     fetchPostData("MasterName/GetData_NameExist", {
    //         // 'NameID': row.NameID,
    //         "MasterNameID": row.MasterNameID,
    //         "IncidentID": sessionStorage.getItem('IncidentId') ? Decrypt_Id_Name(sessionStorage.getItem('IncidentId'), 'IForIncidentId') : '',
    //     }).then((data) => {
    //         if (data) {
    //             console.log(data[0])
    //             if (data[0]?.Total === 0) {
    //                 setEditval(row); setNameSearchStatus(false);
    //             } else {
    //                 toastifyError('Name Already Exists'); setNameSearchStatus(true);
    //             }
    //         } else {

    //         }
    //     })
    // }

    return (
        <>
            {
                nameSearchStatus &&
                <div class="modal fade " style={{ background: "rgba(0,0,0, 0.5)", display: 'block', opacity: '1' }} id="SearchModal" tabindex="-1" data-backdrop="false" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-xl" role="document">
                        <div className="modal-content">
                            <div class="modal-header px-3 p-2">
                                <h5 class="modal-title">Name List</h5>
                                <button type="button" onClick={() => { setNameSearchStatus(false); setValue(pre => { return { ...pre, ['SSN']: '' } }) }} class="close btn-modal" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true" style={{ color: 'red', fontSize: '20px', }}>&times;</span>
                                </button>
                                {/* <button type="button" onClick={() => { setNameSearchStatus(false);  }} class="close btn-modal" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true" style={{ color: 'red', fontSize: '20px', }}>&times;</span>
                                </button> */}
                            </div>
                            <div className="box text-center px-2">
                                <div className="col-12 ">
                                    <DataTable
                                        dense
                                        columns={columns}
                                        data={nameSearchValue}
                                        pagination
                                        selectableRowsHighlight
                                        highlightOnHover
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default memo(NameSearchModal)