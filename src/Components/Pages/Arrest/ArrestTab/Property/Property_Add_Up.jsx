import React, { useCallback, useState } from 'react'
import Select from "react-select";
import { Decrypt_Id_Name } from '../../../../Common/Utility';
import { useEffect } from 'react';
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api';
import { Comman_changeArrayFormat } from '../../../../Common/ChangeArrayFormat';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import { useLocation } from 'react-router-dom';
import { RequiredField } from '../../../Agency/AgencyValidation/validators';
import { useContext } from 'react';
import { AgencyContext } from '../../../../../Context/Agency/Index';

const Property_Add_Up = (props) => {
const{get_Arrest_Count}=useContext(AgencyContext)
    const { modal, setModal, get_Arrest_Propety, arrestPropetyID,arrestDrpData,get_Arrest_Property,LoginPinID, ArrestID, LoginAgencyID,IncidentID,updateStatus } = props
    const useQuery = () => new URLSearchParams(useLocation().search);
    let openPage = useQuery().get('page');
    // const [arrestDrpData, setArrestDrpData] = useState([])

    useEffect(() => {
        if (ArrestID) setValue(pre => { return { ...pre, 'ArrestID': ArrestID, 'CreatedByUserFK': LoginPinID, } })
    }, [ArrestID,updateStatus]);


    const [value, setValue] = useState({
        'ArrestID': '',
        'PropertyID': '',
        'CreatedByUserFK': '',
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
    const escFunction = useCallback((event) => {
        if (event.key === "Escape") {
            reset()
        }
    }, []);

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);
        return () => {
            document.removeEventListener("keydown", escFunction, false);
        };
    }, [escFunction]);
    const Add_Property = (e) => {
        AddDeleteUpadate('ArrestProperty/Insert_ArrestProperty', value)
            .then((res) => {
                toastifySuccess(res.Message);
                get_Arrest_Count(ArrestID);
                setModal(false)
                get_Arrest_Propety(ArrestID);
                get_Arrest_Property(IncidentID);
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
                                                                value={arrestDrpData?.filter((obj) => obj.value === value?.PropertyID)}
                                                                styles={colourStyles}
                                                                isClearable
                                                                options={arrestDrpData}
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