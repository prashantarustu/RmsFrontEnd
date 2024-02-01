import React from 'react'
import { useState,useCallback } from 'react'
import { useEffect } from 'react'  
import Select from 'react-select'
// import { Select } from 'semantic-ui-react'
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg'
import { Decrypt_Id_Name } from '../../../../Common/Utility'
import { AddDeleteUpadate, fetchData, fetchPostData } from '../../../../hooks/Api'   
import { RequiredField } from '../../Personnel/Validation'


const LocationType_Add_Up = (props) => {  

    const {LocationTypeID, status, get_data_Location,LocationTypeData, modal, setModal, LocationTypeupdStatus  } = props

    const [agencyData, setAgencyData] = useState([])
    const [LocationTypeEditval, setLocationTypeEditval] = useState();
    const [value, setValue] = useState({
        'LocationTypeCode': '','AgencyCode':'','IsActive':'', 'Description': '', 'AgencyID': '', 'IsEditable':'0', 'LocationTypeID': '', 'CreatedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'), 'ModifiedByUserFK': '', 'IsResidence': '', 'PremisesFlag': '', 'AgencyName': '', 'MultiAgency_Name': ''
    });
   
    const reset = () => {
        // setModal(false);
        setValue({
            ...value,  
            'LocationTypeCode': '',
            'Description': '',
            'AgencyID': '',
            'IsEditable': '',
            'LocationTypeID': '',
            'IsEditable': '',
            'CreatedByUserFK': '',
            'ModifiedByUserFK': '',
            'IsResidence': '',
            'PremisesFlag': '', 'AgencyName':'', 'MultiAgency_Name':'','AgencyCode':'',
        })
        setErrors({
            'LocationTypeCodeError': '',
            'DescriptionError': '',
        })
    }

    // Initializaation Error Hooks
    const [errors, setErrors] = useState({
        'LocationTypeCodeError': '',
        'DescriptionError': '',
    })

    useEffect(() => {
        if (LocationTypeID) {
            GetSingleData_Color()
        }
    }, [LocationTypeID, LocationTypeupdStatus])

    const GetSingleData_Color = () => {
        const val = { 
            'LocationTypeID': LocationTypeID
         }
        fetchPostData('LocationType/GetSingleData_LocationType', val)
            .then((res) => {
                if (res) setLocationTypeEditval(res)
                else setLocationTypeEditval()
            })
    }

    useEffect(() => {
        if (status) {
            setValue({
                ...value,
                'AgencyID': LocationTypeEditval[0]?.AgencyID,
                'AgencyCode': LocationTypeEditval[0]?.AgencyCode,
                'IsActive': LocationTypeEditval[0]?.IsActive,
                "LocationTypeCode": LocationTypeEditval[0]?.LocationTypeCode,
                "Description": LocationTypeEditval[0]?.Description,
                'LocationTypeID': LocationTypeEditval[0]?.LocationTypeID,
                'IsResidence': LocationTypeEditval[0]?.IsResidence, 'MultiAgency_Name': LocationTypeEditval[0]?.MultiAgency_Name,
                'PremisesFlag': LocationTypeEditval[0]?.PremisesFlag, 'AgencyName': LocationTypeEditval[0]?.MultipleAgency? changeArrayFormat_WithFilter(LocationTypeEditval[0]?.MultipleAgency
                ) : '', 'CreatedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'), 'ModifiedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID')
            })
        }
        else {
            setValue({
                ...value, "LocationTypeCode": '', 'AgencyCode':'',"Description": '', 'LocationTypeID': '', 'IsResidence': '', 'PremisesFlag': '', 'AgencyName': '', 'ModifiedByUserFK': '', 'MultiAgency_Name':''
            })
        }
    }, [LocationTypeEditval])

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
        if (e.target.name === 'PremisesFlag' || e.target.name === 'IsResidence') {
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

    const Add_Location_Type = (e) => {
        var result = LocationTypeData?.find(item => {
            if (item.LocationTypeCode === value.LocationTypeCode) {
                return true
            } else return false
        }
        );
        var result1 = LocationTypeData?.find(item => {
            if (item.Description === value.Description) {
                return true
            } else return false
        }
        );
        if (result || result1) {
            if (result) {
                toastifyError('Code Already Exists')
                setErrors({ ...errors, ['LocationTypeCodeError']: '' })
            }
            if (result1) {
                toastifyError('Description Already Exists')
                setErrors({ ...errors, ['DescriptionError']: '' })
            }
        } else {
            AddDeleteUpadate('LocationType/InsertLocationType', value).then((res) => {
                toastifySuccess(res.Message);
                setErrors({ ...errors, ['LocationError']: '' })
                setModal(false)
                get_data_Location();
                reset();
            })

        }
    }

    const update_Location_Type = () => {
        var result = LocationTypeData?.find(item => {
            if (item.LocationTypeID != LocationTypeID) {
                if (item.LocationTypeCode === value.LocationTypeCode) {
                    return true
                } else return false
            }
        }
        );
        var result1 = LocationTypeData?.find(item => {
            if (item.LocationTypeID != LocationTypeID) {
                if (item.Description === value.Description) {
                    return true
                } else return false
            }
        }
        );
        if (result || result1) {
            if (result) {
                toastifyError('Code Already Exists')
                setErrors({ ...errors, ['LocationTypeCodeError']: '' })
            }
            if (result1) {
                toastifyError('Description Already Exists')
                setErrors({ ...errors, ['DescriptionError']: '' })
            }
        } else {
            AddDeleteUpadate('LocationType/UpdateLocationType', value).then((res) => {
                toastifySuccess(res.Message);
                get_data_Location();
                setModal(false)
                reset();
            })
        }
    }

    const check_Validation_Error = (e) => {
        e.preventDefault()
        if (RequiredField(value.LocationTypeCode)) {
            // console.log(value.LocationTypeCode);
            // console.log(RequiredField(value.LocationTypeCode));
            setErrors(prevValues => { return { ...prevValues, ['LocationTypeCodeError']: RequiredField(value.LocationTypeCode) } })
        }
        if (RequiredField(value.Description)) {
            setErrors(prevValues => { return { ...prevValues, ['DescriptionError']: RequiredField(value.Description) } })
        }
    }

    // Check All Field Format is True Then Submit 
    const { DescriptionError, LocationTypeCodeError } = errors

    useEffect(() => {
        if (DescriptionError === 'true' && LocationTypeCodeError === 'true') {
            if (status) update_Location_Type()
            else Add_Location_Type()
        }
    }, [DescriptionError, LocationTypeCodeError])

    return (
        <>
            {
                modal ?
                    <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="LocationTypeModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="false">
                        <div class="modal-dialog modal-lg modal-dialog-centered rounded" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div className="m-1 mt-3">
                                        <fieldset style={{ border: '1px solid gray' }}>
                                            <legend style={{ fontWeight: 'bold' }}>Location Type</legend>

                                            <div className="row ">
                                                <div className="col-12 col-md-2 col-lg-2 mt-2">
                                                    <div class="text-field">
                                                        <input type="text" maxLength={10} name='LocationTypeCode' onChange={handlChanges} value={value.LocationTypeCode} className='requiredColor' />
                                                        <label>Code</label>
                                                        {errors.LocationTypeCodeError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.LocationTypeCodeError}</span>
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
                                                        {/* <div className="col-2 mt-3">
                                                            <input type="checkbox" name="IsResidence" checked={value.IsResidence} value={value.IsResidence}
                                                                onChange={handlChanges}
                                                                // disabled={''}
                                                                id="IsResidence" />
                                                            <label className='ml-2' htmlFor="IsResidence">IsResidence</label>
                                                        </div>
                                                        <div className="col-2 mt-3">
                                                            <input type="checkbox" name="PremisesFlag" checked={value.PremisesFlag} value={value.PremisesFlag}
                                                                onChange={handlChanges}
                                                                // disabled={''}
                                                                id="PremisesFlag" />
                                                            <label className='ml-2' htmlFor="PremisesFlag">PremisesFlag</label>
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

export default LocationType_Add_Up;

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