import React from 'react'
import { useState,useCallback } from 'react'
import { useEffect } from 'react'
import Select from 'react-select'
// import { Select } from 'semantic-ui-react'
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg'
import { Decrypt_Id_Name } from '../../../../Common/Utility'
import { AddDeleteUpadate, fetchData, fetchPostData } from '../../../../hooks/Api'
import { RequiredField } from '../Validation';


const EyeColor_Add_Up = (props) => { 

    const { ColorID, status, get_data_Color, EyeColorData, modal, setModal, EyeColorupdStatus } = props
    const [agencyData, setAgencyData] = useState([])
    const [EyeColorEditval, setEyeColorEditval] = useState();
    //  console.log("thi si editval",EyeColorEditval)
    const [value, setValue] = useState({
        'ColorCode': '', 'ColorDescription': '', 'Agencyid:': '', 'Iseditable': '0', 'ColorID:': '', 'CreatedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'), 'ModifiedByUserFK': '', 'IsHair': '', 'IsEye': '', 'AgencyName': '', 'MultiAgency_Name': '','AgencyCode':''
    });

    const reset = () => {
        setModal(false);
        setValue({
            ...value,
            'ColorCode': '',
            'ColorDescription': '',
            'Agencyid:': '',
            'Iseditable': '',
            'ColorID:': '',
            'CreatedByUserFK': '',
            'ModifiedByUserFK': '',
            'IsHair': '',
            'IsEye': '', 'AgencyName':'', 'MultiAgency_Name':'','AgencyCode':''
        })
        setErrors({
            'ColorCodeError': '',
            'ColorDescriptionError': '',
        })
    }

    // Initializaation Error Hooks
    const [errors, setErrors] = useState({
        'ColorCodeError': '',
        'ColorDescriptionError': '',
    })

    useEffect(() => {
        if (ColorID) {
            GetSingleData_Color()
        }
    }, [ColorID, EyeColorupdStatus])

    const GetSingleData_Color = () => {
        const val = { 'ColorID': ColorID }
        fetchPostData('TableManagement/GetSingleData_Color', val)
            .then((res) => {
                console.log('GetSingleData_Color', res);
                if (res) setEyeColorEditval(res)
                else setEyeColorEditval()
            })
    }

    useEffect(() => {
        if (status) {
            console.log(EyeColorEditval[0]?.MultiAgency_Name);
            setValue({
                ...value,
                'Agencyid': EyeColorEditval[0]?.AgencyID,
                'AgencyCode':EyeColorEditval[0]?.AgencyCode,
                "ColorCode": EyeColorEditval[0]?.ColorCode,
                "ColorDescription": EyeColorEditval[0]?.ColorDescription,
                'ColorID': EyeColorEditval[0]?.ColorID,
                'IsHair': EyeColorEditval[0]?.IsHair, 'MultiAgency_Name': EyeColorEditval[0]?.MultiAgency_Name,
                'IsEye': EyeColorEditval[0]?.IsEye, 'AgencyName': EyeColorEditval[0]?.MultipleAgency? changeArrayFormat_WithFilter(EyeColorEditval[0]?.MultipleAgency
                ) : '', 'CreatedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'), 'ModifiedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID')
            })
        }
        else {
            setValue({
                ...value, 'AgencyCode':'',"ColorCode": '', "ColorDescription": '', 'ColorID': '', 'IsHair': '', 'IsEye': '', 'AgencyName': '', 'ModifiedByUserFK': '', 'MultiAgency_Name':''
            })
        }
    }, [EyeColorEditval])

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


    const handlChanges = (e) => {
        if (e.target.name === 'IsEye' || e.target.name === 'IsHair') {
            console.log(e.target.checked + e.target.name);
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
                ['Agencyid']: id.toString(), ['MultiAgency_Name']: name.toString()
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

    const Add_Color = (e) => {
        var result = EyeColorData?.find(item => {
            if (item.ColorCode === value.ColorCode) {
                return true
            } else return false
        }
        );
        var result1 = EyeColorData?.find(item => {
            if (item.ColorDescription === value.ColorDescription) {
                return true
            } else return false
        }
        );
        if (result || result1) {
            if (result) {
                toastifyError(' Code Already Exists')
                setErrors({ ...errors, ['ColorCodeError']: '' })
            }
            if (result1) {
                toastifyError('Description Already Exists')
                setErrors({ ...errors, ['ColorDescriptionError']: '' })
            }
        } else {
            const { ColorCode, ColorDescription, CreatedByUserFK, IsEye, IsHair, Agencyid, MultiAgency_Name } = value;
            AddDeleteUpadate('TableManagement/Insert_Color', value).then((res) => {
                toastifySuccess(res.Message);
                setErrors({ ...errors, ['ColorError']: '' })
                setModal(false)
                get_data_Color();
                reset();
                //   console.log("this is addResponse",res)
            })

        }
    }

    const update_Blood_Type = () => {
        var result = EyeColorData?.find(item => {
            if (item.ColorID != ColorID) {
                if (item.ColorCode === value.ColorCode) {
                    return true
                } else return false
            }
        }
        );
        var result1 = EyeColorData?.find(item => {
            if (item.ColorID != ColorID) {
                if (item.ColorDescription === value.ColorDescription) {
                    return true
                } else return false
            }
        }
        );
        if (result || result1) {
            if (result) {
                toastifyError('Color Code Already Exists')
                setErrors({ ...errors, ['ColorCodeError']: '' })
            }
            if (result1) {
                toastifyError('ColorDescription Already Exists')
                setErrors({ ...errors, ['ColorDescriptionError']: '' })
            }
        } else {
            const { ColorCode, ColorDescription, IsHair, IsEye, Agencyid, MultiAgency_Name } = value;
            AddDeleteUpadate('TableManagement/Update_Color', value).then((res) => {
                toastifySuccess(res.Message);
                get_data_Color();
                setModal(false)
                reset();
            })
        }
    }

    const check_Validation_Error = (e) => {
        e.preventDefault()
        if (RequiredField(value.ColorCode)) {
            console.log(value.ColorCode);
            console.log(RequiredField(value.ColorCode));
            setErrors(prevValues => { return { ...prevValues, ['ColorCodeError']: RequiredField(value.ColorCode) } })
        }
        if (RequiredField(value.ColorDescription)) {
            setErrors(prevValues => { return { ...prevValues, ['ColorDescriptionError']: RequiredField(value.ColorDescription) } })
        }
    }

    // Check All Field Format is True Then Submit 
    const { ColorDescriptionError, ColorCodeError } = errors

    useEffect(() => {
        if (ColorDescriptionError === 'true' && ColorCodeError === 'true') {
            if (status) update_Blood_Type()
            else Add_Color()
        }
    }, [ColorDescriptionError, ColorCodeError])

    return (
        <>
            {
                modal ?
                    <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="EyeColorModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="false">
                        <div class="modal-dialog modal-lg modal-dialog-centered rounded" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div className="m-1 mt-3">
                                        <fieldset style={{ border: '1px solid gray' }}>
                                            <legend style={{ fontWeight: 'bold' }}>Color</legend>
                                            <div className="row ">
                                                <div className="col-12 col-md-2 col-lg-2 mt-2">
                                                    <div class="text-field">
                                                        <input type="text" name='ColorCode' maxLength={10} onChange={handlChanges} value={value.ColorCode} className='requiredColor' />
                                                        <label>Code</label>
                                                        {errors.ColorCodeError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ColorCodeError}</span>
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
                                                        <textarea className='requiredColor' name='ColorDescription' onChange={handlChanges} value={value.ColorDescription} required cols="30" rows="1"></textarea>
                                                        <label>Description</label>
                                                        {errors.ColorDescriptionError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ColorDescriptionError}</span>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <div className="row pt-2">
                                                        <div className="col-12 col-md-12 col-lg-12 dropdown__box">
                                                            {
                                                                value?.AgencyName ?
                                                                    <Select
                                                                        name='Agencyid'
                                                                        isMulti
                                                                        isClearable
                                                                        defaultValue={value?.AgencyName}
                                                                        options={agencyData}
                                                                        onChange={Agencychange}
                                                                        placeholder="Select Agency"
                                                                    /> : <><Select
                                                                        name='Agencyid'
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
                                                        <div className="col-2 mt-3">
                                                            <input type="checkbox" name="IsHair" checked={value.IsHair} value={value.IsHair}
                                                                onChange={handlChanges}
                                                                disabled={''}
                                                                id="IsHair" />
                                                            <label className='ml-2' htmlFor="IsHair">IsHair</label>
                                                        </div>
                                                        <div className="col-2 mt-3">
                                                            <input type="checkbox" name="IsEye" checked={value.IsEye} value={value.IsEye}
                                                                onChange={handlChanges}
                                                                disabled={''}
                                                                id="IsEye" />
                                                            <label className='ml-2' htmlFor="IsEye">IsEye</label>
                                                        </div>
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
                                        <button type="button" class="btn btn-sm btn-success" data-dismiss="modal" onClick={() => reset()}>Close</button>
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

export default EyeColor_Add_Up;

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