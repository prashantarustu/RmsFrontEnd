import React from 'react'
import { useState,useCallback } from 'react'
import { useEffect } from 'react'
import Select from 'react-select'
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg'
import { Decrypt_Id_Name } from '../../../../Common/Utility'
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api'
import { RequiredField } from '../../Personnel/Validation'



const WeaponType_Add_Up = (props) => {

    // WeaponID, status, get_data_WeaponType, WeaponTypeData, modal, setModal, WeaponTypeupdStatus

    const { WeaponID, status, get_data_WeaponType, WeaponTypeData, modal, setModal, WeaponTypeupdStatus } = props

    const [agencyData, setAgencyData] = useState([])
    const [WeaponTypeEditval, setWeaponTypeEditval] = useState();
    const [value, setValue] = useState({
        'WeaponCode': '',
        'Description': '',
        'AgencyID': '',
        'IsWeapon': '',
        'IsFirearm': '',
        'IsChargeWeapon': '',
        'IsAuto': '',
        'IsEditable': '0',
        'IsWeaponTypeFor': '',
        'IsCuttingInstrument': '',
        'IsStrongArm': '',
        'WeaponID': '',
        'IsActive': '1',
        'CreatedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
        'ModifiedByUserFK': '',
        'MultiAgency_Name': '',
        'AgencyName': '',
        'AgencyCode':'',
    });
    
    const reset = () => {
        setValue({
            ...value,
            'ModifiedByUserFK': '',
            'WeaponCode': '',
            'Description': '',
            'IsWeapon': '',
            'AgencyID': '',
            'IsFirearm': '',
            'IsChargeWeapon': '',
            'IsAuto': '',
            'IsEditable': '',
            'IsWeaponTypeFor': '',
            'IsCuttingInstrument': '',
            'IsStrongArm': '',
            'WeaponID': '',
            'AgencyName': '',
            'MultiAgency_Name': '',
            'AgencyCode':'',
        })
        setErrors({
            'WeaponCodeError': '',
            'DescriptionError': '',
        })
    }

    // Initializaation Error Hooks
    const [errors, setErrors] = useState({
        'WeaponCodeError': '',
        'DescriptionError': '',
    })


    useEffect(() => {
        if (WeaponID) {
            GetSingleDataWeapon()
        }
    }, [WeaponID, WeaponTypeupdStatus])

    const GetSingleDataWeapon = () => {
        const val = { 'WeaponID': WeaponID }
        fetchPostData('WeaponType/GetSingleData_WeaponType',val)
            .then((res) => {
                if (res) setWeaponTypeEditval(res)
                else setWeaponTypeEditval()
            })
    }
   

    useEffect(() => {
        if (status) {
            setValue({
                ...value,
                "WeaponCode": WeaponTypeEditval[0]?.WeaponCode,
                'AgencyCode': WeaponTypeEditval[0]?.AgencyCode,
                'AgencyID': WeaponTypeEditval[0]?.AgencyID,
                "Description": WeaponTypeEditval[0]?.Description,
                'WeaponID': WeaponTypeEditval[0]?.WeaponID,
                'IsEditable': WeaponTypeEditval[0]?.IsEditable,
                'IsActive': WeaponTypeEditval[0]?.IsActive,
                'IsWeapon': WeaponTypeEditval[0]?.IsWeapon,
                'IsAuto': WeaponTypeEditval[0]?.IsAuto,
                'IsWeaponTypeFor': WeaponTypeEditval[0]?.IsWeaponTypeFor,
                'IsCuttingInstrument': WeaponTypeEditval[0]?.IsCuttingInstrument,
                'IsStrongArm': WeaponTypeEditval[0]?.IsStrongArm,
                'IsFirearm': WeaponTypeEditval[0]?.IsFirearm,
                'IsChargeWeapon': WeaponTypeEditval[0]?.IsChargeWeapon,
                'MultiAgency_Name': WeaponTypeEditval[0]?.MultiAgency_Name,
                'AgencyName': WeaponTypeEditval[0]?.MultipleAgency ? changeArrayFormat_WithFilter(WeaponTypeEditval[0]?.MultipleAgency) : '',
                'ModifiedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
            })
        }
        else {
            setValue({
                ...value, "WeaponCode": '', 'AgencyCode':'',"Description": '', 'WeaponID': '', 'AgencyName': '', 'IsAuto': '', 'IsWeapon': '', 'IsWeaponTypeFor': '', 'IsCuttingInstrument': '', 'IsStrongArm': '', 'IsFirearm': '', 'IsChargeWeapon': '', 'ModifiedByUserFK': '', 'MultiAgency_Name': ''
            })
        }
    }, [WeaponTypeEditval])

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


    useEffect(() => {
        if(modal) getAgency();
    }, [modal])

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

    const Add_WeaponType = (e) => {
        var result = WeaponTypeData?.find(item => {
            if (item.WeaponCode === value.WeaponCode) {
                return true
            } else return false
        }
        );
        var result1 = WeaponTypeData?.find(item => {
            if (item.Description === value.Description) {
                return true
            } else return false
        }
        );
        if (result || result1) {
            if (result) {
                toastifyError('Code Already Exists')
                setErrors({ ...errors, ['WeaponCodeError']: '' })
            }
            if (result1) {
                toastifyError('Description Already Exists')
                setErrors({ ...errors, ['DescriptionError']: '' })
            }
        } else {

            AddDeleteUpadate('WeaponType/Insert_WeaponType', value).then((res) => {
                toastifySuccess(res.Message);
                setErrors({ ...errors, ['WeaponCodeError']: '' })
                setModal(false)
                get_data_WeaponType();
                reset();
            })

        }
    }
    const handlChanges = (e) => {
        // if (e.target.name === 'IsAuto' || e.target.name === 'IsWeaponTypeFor' || e.target.name === 'IsCuttingInstrument' || e.target.name === 'IsStrongArm' || e.target.name === 'IsFirearm' || e.target.name === 'IsChargeWeapon' || e.target.name === 'IsWeapon') {
            if (e.target.name === 'IsWeaponTypeFor' || e.target.name === 'IsCuttingInstrument' || e.target.name === 'IsStrongArm' || e.target.name === 'IsFirearm' || e.target.name === 'IsChargeWeapon' || e.target.name === 'IsWeapon') {

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
    }


    const Update_WeaponType = () => {
        var result = WeaponTypeData?.find(item => {
            if (item.WeaponID != WeaponID) {
                if (item.WeaponCode === value.WeaponCode) {
                    return true
                } else return false
            }
        }
        
        );
        var result1 = WeaponTypeData?.find(item => {
            if (item.WeaponID != value.WeaponID) {
                if (item.Description === value.Description) {
                    return true
                } else return false
            }
        }
        );
        if (result || result1) {
            if (result) {
                toastifyError('Code Already Exists')
                setErrors({ ...errors, ['WeaponCodeError']: '' })
            }
            if (result1) {
                toastifyError('Description Already Exists')
                setErrors({ ...errors, ['DescriptionError']: '' })
            }
        } else {
            AddDeleteUpadate('WeaponType/Update_WeaponType', value).then((res) => {
                toastifySuccess(res.Message);
                setErrors({ ...errors, ['WeaponCodeError']: '' })
                get_data_WeaponType();
                setModal(false)
                reset();
            })
        }
    }

    const check_Validation_Error = (e) => {
        e.preventDefault()
        if (RequiredField(value.WeaponCode)) {
            setErrors(prevValues => { return { ...prevValues, ['WeaponCodeError']: RequiredField(value.WeaponCode) } })
        }
        if (RequiredField(value.Description)) {
            setErrors(prevValues => { return { ...prevValues, ['DescriptionError']: RequiredField(value.Description) } })
        }
    }

    // Check All Field Format is True Then Submit 
    const { DescriptionError, WeaponCodeError } = errors

    useEffect(() => {
        if (DescriptionError === 'true' && WeaponCodeError === 'true') {
            if (status) Update_WeaponType()
            else Add_WeaponType()
        }
    }, [DescriptionError, WeaponCodeError])

    const closeModal = () => {
        reset();
        setModal(false);
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

    return (
        <>
            {
                modal ?
                    <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="WeaponTypeModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="false">
                        <div class="modal-dialog modal-lg modal-dialog-centered rounded" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div className="m-1 mt-3">
                                        <fieldset style={{ border: '1px solid gray' }}>
                                            <legend style={{ fontWeight: 'bold' }}>Weapon Type</legend>

                                            <div className="row ">
                                                <div className="col-12 col-md-2 col-lg-2 mt-2">
                                                    <div class="text-field">
                                                        <input type="text" maxLength={10} name='WeaponCode' onChange={handlChanges} value={value.WeaponCode} className='requiredColor' />
                                                        <label>Code</label>
                                                        {errors.WeaponCodeError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.WeaponCodeError}</span>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-2 col-lg-2 mt-2">
                                                    <div class="text-field">
                                                        <input type="text"  name='AgencyCode' onChange={handlChanges} value={value.AgencyCode}  />
                                                        <label>Agency Code</label>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-8 col-lg-8 mt-2">
                                                    <div class="text-field">
                                                        <textarea className='requiredColor' name='Description' onChange={handlChanges} value={value.Description} required cols="30" rows="1"></textarea>
                                                        <label>Description</label>
                                                        {errors.DescriptionError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DescriptionError}</span>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <div className="row pt-2">
                                                        <div className="col-12 col-md-12 col-lg-12 dropdown__box">
                                                            {
                                                                value?.AgencyName ?
                                                                    <Select
                                                                        name='AgencyID'
                                                                        isMulti
                                                                        isClearable
                                                                        defaultValue={value?.AgencyName}
                                                                        options={agencyData}
                                                                        onChange={Agencychange}
                                                                        placeholder="Select Agency"
                                                                    /> : <><Select
                                                                        name='AgencyID'
                                                                        isMulti
                                                                        isClearable
                                                                        options={agencyData}
                                                                        onChange={Agencychange}
                                                                        placeholder="Select Agency"
                                                                    />
                                                                    </>
                                                            }
                                                            <label>Agency</label>
                                                        </div>
                                                        {/* <div className="col-6 col-md-6 col-lg-2 mt-3">
                                                            <input type="checkbox" name="IsAuto" checked={value.IsAuto} value={value.IsAuto}
                                                                onChange={handlChanges}
                                                                disabled={''}
                                                                id="IsAuto" />
                                                            <label className='ml-2' htmlFor="IsAuto">IsAuto</label>
                                                        </div>
                                                        <div className="col-6 col-md-6 col-lg-4 mt-3">
                                                            <input type="checkbox" name="IsWeaponTypeFor" checked={value.IsWeaponTypeFor} value={value.IsWeaponTypeFor}
                                                                onChange={handlChanges}
                                                                disabled={''}
                                                                id="IsWeaponTypeFor" />
                                                            <label className='ml-2' htmlFor="IsWeaponTypeFor">IsWeaponTypeFor</label>
                                                        </div>
                                                        <div className="col-6 col-md-6 col-lg-3 mt-3">
                                                            <input type="checkbox" name="IsCuttingInstrument" checked={value.IsCuttingInstrument} value={value.IsCuttingInstrument}
                                                                onChange={handlChanges}
                                                                disabled={''}
                                                                id="IsCuttingInstrument" />
                                                            <label className='ml-2' htmlFor="IsCuttingInstrument">IsCuttingInstrument</label>
                                                        </div>
                                                        <div className="col-6 col-md-6 col-lg-3 mt-3">
                                                            <input type="checkbox" name="IsStrongArm" checked={value.IsStrongArm} value={value.IsStrongArm}
                                                                onChange={handlChanges}
                                                                disabled={''}
                                                                id="IsStrongArm" />
                                                            <label className='ml-2' htmlFor="IsStrongArm">IsStrongArm</label>
                                                        </div>
                                                        <div className="col-6 col-md-6 col-lg-2 mt-3">
                                                            <input type="checkbox" name="IsFirearm" checked={value.IsFirearm} value={value.IsFirearm}
                                                                onChange={handlChanges}
                                                                disabled={''}
                                                                id="IsFirearm" />
                                                            <label className='ml-2' htmlFor="IsFirearm">IsFirearm</label>
                                                        </div>
                                                        <div className="col-6 col-md-6 col-lg-3 mt-3">
                                                            <input type="checkbox" name="IsChargeWeapon" checked={value.IsChargeWeapon} value={value.IsChargeWeapon}
                                                                onChange={handlChanges}
                                                                disabled={''}
                                                                id="IsChargeWeapon" />
                                                            <label className='ml-2' htmlFor="IsChargeWeapon">IsChargeWeapon</label>
                                                        </div>
                                                        <div className="col-6 col-md-6 col-lg-3 mt-3">
                                                            <input type="checkbox" name="IsWeapon" checked={value.IsWeapon} value={value.IsWeapon}
                                                                onChange={handlChanges}
                                                                disabled={''}
                                                                id="IsWeapon" />
                                                            <label className='ml-2' htmlFor="IsWeapon">IsWeapon</label>
                                                        </div> */}
                                                    </div>
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

export default WeaponType_Add_Up;


export const changeArrayFormat = (data) => {
    const result = data?.map((sponsor) =>
        ({ value: sponsor.AgencyID, label: sponsor.Agency_Name })
    )
    return result

}

export const changeArrayFormat_WithFilter = (data) => {
    const result = data?.map((sponsor) =>
        ({ value: sponsor.AgencyId, label: sponsor.Agency_Name })
    )
    return result
}