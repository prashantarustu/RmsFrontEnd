import React, { useState } from 'react'
import Select from "react-select";
import { Decrypt_Id_Name } from '../../../../Common/Utility';
import { useEffect } from 'react';
import { AddDeleteUpadate, } from '../../../../hooks/Api';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import { useLocation } from 'react-router-dom';
import { RequiredField } from '../../../Agency/AgencyValidation/validators';

const Property_Add_Up = (props) => {

    const { modal, setModal, get_Ofference_Propety, arrestPropetyID, offerenceDrpData, get_Arrest_Property } = props
    const useQuery = () => new URLSearchParams(useLocation().search);
    let openPage = useQuery().get('page');
    // const [offerenceDrpData, setOfferenceDrpData] = useState([])

    const [value, setValue] = useState({
        // 'CrimeID': sessionStorage.getItem('OffenseCrimeId') ? Decrypt_Id_Name(sessionStorage.getItem('OffenseCrimeId'), 'OforOffenseCrimeId') : '',
        'OffenseID': sessionStorage.getItem('OffenseCrimeId') ? Decrypt_Id_Name(sessionStorage.getItem('OffenseCrimeId'), 'OforOffenseCrimeId') : '',
        'IncidentId': sessionStorage.getItem('IncidentId') ? Decrypt_Id_Name(sessionStorage.getItem('IncidentId'), 'IForIncidentId') : '',
        'PropertyID': '',
        'CreatedByUserFK': localStorage.getItem('PINID') ? Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID') : '',
    })

    const [errors, setErrors] = useState({
        'PropertyIDError': '',
    })

    const check_Validation_Error = (e) => {
        if (RequiredField(value.PropertyID)) {
            setErrors(prevValues => { return { ...prevValues, ['PropertyIDError']: RequiredField(value.PropertyID) } })
        }
    }

    const { PropertyIDError } = errors

    useEffect(() => {
        if (PropertyIDError === 'true') {
            Add_Property();
        }
    }, [PropertyIDError])

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

    const reset = () => {
        setValue({
            ...value,
            ['PropertyID']: ''
        })
    }

    const Add_Property = (e) => {
        AddDeleteUpadate('PropertyOffense/Insert_PropertyOffense', value)
            .then((res) => {
                toastifySuccess(res.Message);
                setModal(false)
                get_Ofference_Propety();
                get_Arrest_Property('');
                reset();
                setErrors({ ...errors, ['PropertyIDError']: '' });
            })
    }

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

    const colourStyles = {
        control: (styles) => ({
            ...styles,
            backgroundColor: "#fce9bf",
            height: 20,
            minHeight: 30,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    }

    const closeModal = () => {
        setErrors({ ...errors, ['PropertyIDError']: '' });
        reset();
    }

    return (
        <>
            {
                modal ?
                    <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="PropertyModal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="false">
                        <div class="modal-dialog modal-dialog-centered modal-md" role="document" >
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div className="m-1 ">
                                        <fieldset style={{ border: '1px solid gray' }}>
                                            <legend style={{ fontWeight: 'bold' }}>Property</legend>
                                            <div className="row">
                                                <div className="col-12">
                                                    <div className="row">
                                                        <div class="col-12 col-md-12  col-lg-12  dropdown__box">
                                                            <Select
                                                                name='Property'
                                                                value={offerenceDrpData?.filter((obj) => obj.value === value?.PropertyID)}
                                                                styles={colourStyles}
                                                                isClearable
                                                                options={offerenceDrpData}
                                                                onChange={(e) => ChangeDropDown(e, 'PropertyID')}
                                                                placeholder="Select..."

                                                            />
                                                            <label htmlFor='' >Property</label>
                                                            {errors.PropertyIDError !== 'true' ? (
                                                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.PropertyIDError}</span>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>
                                </div>
                                <div className="btn-box text-right mr-1 mb-2">
                                    <button type="button" class="btn btn-sm btn-success mr-1" onClick={() => { check_Validation_Error(); }}>Save</button>
                                    <button type="button" data-dismiss="modal" class="btn btn-sm btn-success mr-1" onClick={closeModal} >Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <></>
            }
        </>
    )
}

export default Property_Add_Up