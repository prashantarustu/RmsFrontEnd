import { clearConfig } from 'dompurify'
import React from 'react'
import { useState, useCallback } from 'react'
import { useEffect } from 'react'
import Select from 'react-select'
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg'
import { Decrypt_Id_Name } from '../../../../Common/Utility'
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api'
import { RequiredField } from '../../Personnel/Validation';


const PropertyVehicleStyle_Add_Up = (props) => {
    const { singleTypeId, status, get_Data_List, DataList, modal, setModal, updateStatus } = props
    const [agencyData, setAgencyData] = useState([])
    const [PropertyDescType, setPropertyDescType] = useState('')

    const [Editval, setEditval] = useState();

    const [value, setValue] = useState({
        'VehicleStyleCode': '', 'AgencyCode': '', 'PropertyDescID': '', 'Description': '', 'AgencyID': '', 'MultiAgency_Name': '', 'IsEditable': 0, 'CreatedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'), 'ModifiedByUserFK': '', 'AgencyName': '', 'IsActive': '1', 'VehicleStyleID': '',
        'PropertyDesc': ''
    });

    // Initializaation Error Hooks
    const [errors, setErrors] = useState({
        'CodeError': '',
        'DescriptionError': '',
    })

    useEffect(() => {
        if (singleTypeId) {
            GetSingleData()
        }
    }, [singleTypeId, updateStatus])

    const GetSingleData = () => {
        const val = { 'VehicleStyleID': singleTypeId }
        fetchPostData('PropertyVehicleStyle/GetSingleData_PropertyVehicleStyle', val)
            .then((res) => {
                if (res) setEditval(res)
                else setEditval()
            })
    }

    useEffect(() => {
        if (status) {
            setValue({
                ...value,
                "VehicleStyleCode": Editval[0]?.VehicleStyleCode, 'IsActive': Editval[0]?.IsActive,
                "Description": Editval[0]?.Description,
                'AgencyCode': Editval[0]?.AgencyCode,
                "PropertyDescID": Editval[0]?.PropertyDescID,
                'VehicleStyleID': Editval[0]?.VehicleStyleID, 'MultiAgency_Name': Editval[0]?.MultiAgency_Name,
                'AgencyID': Editval[0]?.AgencyID, 'ModifiedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
                'AgencyName': Editval[0]?.MultipleAgency ? changeArrayFormat_WithFilter(Editval[0]?.MultipleAgency) : '',
                'ModifiedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
                'PropertyDesc': Editval[0]?.PropertyDesc ? changeArrayFormat_WithFilter(Editval, 'SMTLocation', PropertyDescType) : ''
            })
        }
        else {
            setValue({
                ...value,
                'VehicleStyleCode': '', 'AgencyCode': '', 'Description': '', 'AgencyID': '', 'MultiAgency_Name': '', 'ModifiedByUserFK': '', 'AgencyName': '', 'IsActive': '1',
                'VehicleStyleID': '', 'PropertyDescID': '', 'PropertyDesc': ''
            })
        }
    }, [Editval])



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


    useEffect(() => {
        if (modal) { getAgency(); get_SMT_Location(); }
    }, [modal])

    const reset = () => {
        setValue({
            ...value,
            'VehicleStyleCode': '', 'Description': '', 'AgencyCode': '', 'AgencyID': '', 'MultiAgency_Name': '', 'IsEditable': 0, 'ModifiedByUserFK': '', 'AgencyName': '', 'PropertyDescID': '', 'PropertyDesc': ''
        })
        setErrors({
            'CodeError': '',
            'DescriptionError': '',
        })
    }

    const handlChanges = (e) => {
        setValue({
            ...value,
            [e.target.name]: e.target.value
        })
    }

    const SMTTypeChanges = (e) => {
        if (e) {
            setValue({
                ...value,
                ['PropertyDescID']: e.value
            })
        } else setValue({
            ...value,
            ['PropertyDescID']: null
        })
    }

    const Agencychange = (e) => {
        var id = []
        var name = []
        if (e) {
            e.map((item, i) => {
                id.push(item.value);
                name.push(item.label)
            })
            setValue({
                ...value,
                ['AgencyID']: id.toString(), ['MultiAgency_Name']: name.toString()
            })
        }
    }

    const get_SMT_Location = async () => {
        const value = {
            AgencyID: Decrypt_Id_Name(localStorage.getItem('AgencyID'), 'AForAgencyID'),
        }
        fetchPostData("PropertyDescriptionCodes/GetDataDropDown_PropertyDescriptionCodes", value).then((data) => {
            if (data) {
                setPropertyDescType(changeArrayFormat(data, 'SMTLocation'))
            } else {
                setPropertyDescType();
            }
        })
    }

    const getAgency = async () => {
        const value = {
            AgencyID: Decrypt_Id_Name(localStorage.getItem('AgencyID'), 'AForAgencyID'),
            PINID: Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID')
        }
        fetchPostData("Agency/GetData_Agency", value).then((data) => {
            if (data) {
                setAgencyData(changeArrayFormat(data))
            } else {
                setAgencyData();
            }
        })
    }

    const Add_Type = (e) => {
        var result = DataList?.find(item => {
            if (item.VehicleStyleCode === value.VehicleStyleCode) {
                return true
            } else return false
        }
        );
        var result1 = DataList?.find(item => {
            if (item.Description === value.Description) {
                return true
            } else return false
        }
        );
        if (result || result1) {
            if (result) {
                toastifyError('Code Already Exists')
                setErrors({ ...errors, ['CodeError']: '' })
            }
            if (result1) {
                toastifyError('Description Already Exists')
                setErrors({ ...errors, ['DescriptionError']: '' })
            }
        } else {
            AddDeleteUpadate('PropertyVehicleStyle/InsertPropertyVehicleStyle', value).then((res) => {
                toastifySuccess(res.Message);
                setErrors({ ...errors, ['CodeError']: '' })
                setModal(false)
                get_Data_List();
                reset();
            })
        }
    }

    const update_Type = () => {
        var result = DataList?.find(item => {
            if (item.VehicleStyleID != singleTypeId) {
                if (item.VehicleStyleCode === value.VehicleStyleCode) {
                    return true
                } else return false
            }
        }
        );
        var result1 = DataList?.find(item => {
            if (item.VehicleStyleID != singleTypeId) {
                if (item.Description === value.Description) {
                    return true
                } else return false
            }
        }
        );
        if (result || result1) {
            if (result) {
                toastifyError('Code Already Exists')
                setErrors({ ...errors, ['CodeError']: '' })
            }
            if (result1) {
                toastifyError('Description Already Exists')
                setErrors({ ...errors, ['DescriptionError']: '' })
            }
        } else {
            AddDeleteUpadate('PropertyVehicleStyle/UpdatePropertyVehicleStyle', value).then((res) => {
                toastifySuccess(res.Message); setErrors({ ...errors, ['DescriptionError']: '' })
                get_Data_List();
                setModal(false)
                reset();
            })
        }
    }

    const check_Validation_Error = (e) => {
        e.preventDefault()
        if (RequiredField(value.VehicleStyleCode)) {
            setErrors(prevValues => { return { ...prevValues, ['CodeError']: RequiredField(value.VehicleStyleCode) } })
        }
        if (RequiredField(value.Description)) {
            setErrors(prevValues => { return { ...prevValues, ['DescriptionError']: RequiredField(value.Description) } })
        }
    }

    // Check All Field Format is True Then Submit 
    const { CodeError, DescriptionError } = errors

    useEffect(() => {
        if (DescriptionError === 'true' && CodeError === 'true') {
            if (status) update_Type()
            else Add_Type()
        }
    }, [CodeError, DescriptionError])

    const closeModal = () => {
        reset();
        setModal(false);
    }


    return (
        <>
            {
                modal ?
                    <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="BloodTypeModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="false">
                        <div class="modal-dialog modal-lg modal-dialog-centered rounded" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div className="m-1 mt-3">
                                        <fieldset style={{ border: '1px solid gray' }}>
                                            <legend style={{ fontWeight: 'bold' }}>Property Vehicle Style</legend>
                                            <div className="row">
                                                <div className="col-12 col-md-2 col-lg-2 mt-2">
                                                    <div class="text-field">
                                                        <input type="text" maxLength={10} name='VehicleStyleCode' onChange={handlChanges} value={value.VehicleStyleCode} className='requiredColor' />
                                                        <label>Code</label>
                                                        {errors.CodeError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CodeError}</span>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-3 col-lg-2 mt-2">
                                                    <div class="text-field">
                                                        <input type="text" name='AgencyCode' onChange={handlChanges} value={value.AgencyCode} />
                                                        <label>Agency Code</label>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-7 col-lg-8 mt-2">
                                                    <div class="text-field">
                                                        <textarea className='requiredColor' name='Description' onChange={handlChanges} value={value.Description} required cols="30" rows="1"></textarea>
                                                        <label>Description</label>
                                                        {errors.DescriptionError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DescriptionError}</span>
                                                        ) : null}
                                                    </div>
                                                </div>

                                                <div className=" mt-4 col-12 col-md-12 col-lg-12 dropdown__box ">
                                                    {
                                                        value?.AgencyName ?
                                                            <Select
                                                                isMulti
                                                                name='AgencyID'
                                                                isClearable
                                                                defaultValue={value.AgencyName}
                                                                options={agencyData}
                                                                onChange={Agencychange}
                                                                placeholder="Select Agency"
                                                            /> : <><Select
                                                                isMulti
                                                                name='AgencyID'
                                                                isClearable
                                                                options={agencyData}
                                                                onChange={Agencychange}
                                                                placeholder="Select Agency"
                                                            />
                                                            </>
                                                    }
                                                    <label>Agency</label>
                                                </div>

                                                <div className="pt-2 col-12 col-md-6 col-lg-6 dropdown__box  ">
                                                    {
                                                        value?.PropertyDesc ?
                                                            <Select
                                                                name='PropertyDescID'
                                                                isClearable
                                                                defaultValue={value.PropertyDesc}
                                                                options={PropertyDescType}
                                                                onChange={SMTTypeChanges}
                                                                placeholder="Property Description"
                                                            />
                                                            : <>
                                                                <Select
                                                                    name='PropertyDescID'
                                                                    isClearable
                                                                    options={PropertyDescType}
                                                                    onChange={SMTTypeChanges}
                                                                    placeholder="Property Description"

                                                                />
                                                            </>
                                                    }
                                                    <label className='pt-2'>Property Description</label>
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>
                                    <div className="btn-box text-right mt-3 mr-1">
                                        {
                                            status ?
                                                <button type="button" class="btn btn-sm btn-success mr-2" onClick={check_Validation_Error} >update</button>
                                                :
                                                <button type="button" class="btn btn-sm btn-success mr-2" onClick={check_Validation_Error} >Save</button>
                                        }
                                        <button type="button" class="btn btn-sm btn-success" data-dismiss="modal" onClick={() => closeModal()}>Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <> </>
            }
        </>
    )
}

export default PropertyVehicleStyle_Add_Up;

export const changeArrayFormat = (data, type) => {
    if (type === 'SMTLocation') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.PropertyDescID, label: sponsor.Description })
        )
        return result
    }
    else {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.AgencyID, label: sponsor.Agency_Name })
        )
        return result
    }
}

export const changeArrayFormat_WithFilter = (data, type, PropertyDescType) => {
    if (type === 'SMTLocation') {
        const result = data?.map((sponsor) =>
            (sponsor.PropertyDescID)
        )
        const result2 = PropertyDescType?.map((sponsor) => {
            if (sponsor.value === result[0]) {
                return { value: result[0], label: sponsor.label }
            }
        }
        )
        const val = result2.filter(function (element) {
            return element !== undefined;
        });
        return val[0]
    }
    else {
        const result = data.map((sponsor) =>
            ({ value: sponsor.AgencyId, label: sponsor.Agency_Name })
        )
        return result
    }

}