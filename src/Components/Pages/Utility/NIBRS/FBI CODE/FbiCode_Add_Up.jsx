import React from 'react'
import { useState, useCallback } from 'react'
import { useEffect } from 'react'
import Select from 'react-select'
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg'
import { Decrypt_Id_Name } from '../../../../Common/Utility'
import { AddDeleteUpadate, fetchData, fetchPostData } from '../../../../hooks/Api'
import { RequiredField } from '../../Personnel/Validation'


const FbiCode_Add_Up = (props) => {

    const { FBICodeID, status, get_data_FbiCode, FbiCodeData, modal, setModal, updStatus } = props

    const [agencyData, setAgencyData] = useState([])
    const [FBIcodeEditval, setFBIcodeEditval] = useState();
    const [value, setValue] = useState({
        'FBICode': '',
        'IsActive': '',
        'Description': '',
        'AgencyID': '',
        'IsEditable': '0',
        'FBICodeID': '',
        'CreatedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
        'ModifiedByUserFK': '',
        'IsCrimeAgains_Person': '',
        'IsCrimeAgainstProperty': '',
        'IsCrimeAgainstSociety': '',
        'AgencyName': '',
        'MultiAgency_Name': '',
        'FederalSpecificFBICode': '',
        'NIBRSSeq': '',
        'IsCrimeForTicket': '',
        'IsDomesticViolence': '',
        'IsCriminalActivityRequired': '',
        'IsUcrArson': '',
        'IsGangInvolved': '',
        'IsCrimeForSexOffender': '',
    });

    const reset = () => {
        // setModal(false);
        setValue({
            ...value,
            'FBICode': '',
            'Description': '',
            'AgencyID': '',
            'IsEditable': '',
            'FBICodeID': '',
            'CreatedByUserFK': '',
            'ModifiedByUserFK': '',
            'IsCrimeAgains_Person': '',
            'IsCrimeAgainstProperty': '',
            'IsCrimeAgainstSociety': '',
            'AgencyName': '',
            'MultiAgency_Name': '',
            'FederalSpecificFBICode': '',
            'AgencyCode': '',
            'NIBRSSeq': '',
            'IsCrimeForTicket': '',
            'IsDomesticViolence': '',
            'IsCriminalActivityRequired': '',
            'IsUcrArson': '',
            'IsGangInvolved': '',
            'IsCrimeForSexOffender': '',
        })
        setErrors({
            'FBICodeError': '',
            'DescriptionError': '',
            'FederalSpecificFBICodeError': '',
        })
    }

    // Initializaation Error Hooks
    const [errors, setErrors] = useState({
        'FBICodeError': '',
        'DescriptionError': '',
        'FederalSpecificFBICodeError': '',
    })

    useEffect(() => {
        if (FBICodeID) {
            GetSingleData_Color()
        }
    }, [FBICodeID, updStatus])

    const GetSingleData_Color = () => {
        const val = {
            'FBICodeID': FBICodeID
        }
        fetchPostData('FBICodes/GetSingleData_FBICodes', val)
            .then((res) => {
                console.log("this is single data", res);
                if (res) setFBIcodeEditval(res)
                else setFBIcodeEditval()
            })
    }

    useEffect(() => {
        if (status) {
            setValue({
                ...value,
                'AgencyID': FBIcodeEditval[0]?.AgencyID,
                'IsActive': FBIcodeEditval[0]?.IsActive,
                "FBICode": FBIcodeEditval[0]?.FBICode,
                'AgencyCode': FBIcodeEditval[0]?.AgencyCode,
                "FederalSpecificFBICode": FBIcodeEditval[0]?.FederalSpecificFBICode,
                "Description": FBIcodeEditval[0]?.Description,
                'FBICodeID': FBIcodeEditval[0]?.FBICodeID,
                'IsCrimeAgains_Person': FBIcodeEditval[0]?.IsCrimeAgains_Person,
                'IsCrimeAgainstProperty': FBIcodeEditval[0]?.IsCrimeAgainstProperty,
                'IsCrimeAgainstSociety': FBIcodeEditval[0]?.IsCrimeAgainstSociety,
                'NIBRSSeq': FBIcodeEditval[0]?.NIBRSSeq,
                'IsCrimeForTicket': FBIcodeEditval[0]?.IsCrimeForTicket,
                'IsDomesticViolence': FBIcodeEditval[0]?.IsDomesticViolence,
                'IsCriminalActivityRequired': FBIcodeEditval[0]?.IsCriminalActivityRequired,
                'IsUcrArson': FBIcodeEditval[0]?.IsUcrArson,
                'IsGangInvolved': FBIcodeEditval[0]?.IsGangInvolved,
                'IsCrimeForSexOffender': FBIcodeEditval[0]?.IsCrimeForSexOffender,
                'MultiAgency_Name': FBIcodeEditval[0]?.MultiAgency_Name,
                'AgencyName': FBIcodeEditval[0]?.MultipleAgency ? changeArrayFormat_WithFilter(FBIcodeEditval[0]?.MultipleAgency
                ) : '',
                'CreatedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
                'ModifiedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID')
            })
        }
        else {
            setValue({
                ...value, "FBICode": '', 'AgencyCode': '', "Description": '', 'FBICodeID': '', 'IsCrimeAgains_Person': '', 'IsCrimeAgainstProperty': '', 'IsCrimeAgainstSociety': '', 'AgencyName': '', 'ModifiedByUserFK': '', 'MultiAgency_Name': '', 'FederalSpecificFBICode': '',
                'NIBRSSeq': '',
                'IsCrimeForTicket': '',
                'IsDomesticViolence': '',
                'IsCriminalActivityRequired': '',
                'IsUcrArson': '',
                'IsGangInvolved': '',
                'IsCrimeForSexOffender': '',
            })
        }
    }, [FBIcodeEditval])

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
        if (e.target.name === 'IsCrimeAgainstProperty' || e.target.name === 'IsCrimeAgains_Person' || e.target.name === 'IsCrimeAgainstSociety' || e.target.name === 'IsCrimeForTicket' || e.target.name === 'IsDomesticViolence' || e.target.name === 'IsCriminalActivityRequired' || e.target.name === 'IsUcrArson' || e.target.name === 'IsGangInvolved' || e.target.name === 'IsCrimeForSexOffender') {
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
        if (modal) getAgency();
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

    const Add_FBI_code = (e) => {
        var result = FbiCodeData?.find(item => {
            if (item.FBICode === value.FBICode) {
                return true
            } else return false
        }
        );
        var result1 = FbiCodeData?.find(item => {
            if (item.Description === value.Description) {
                return true
            } else return false
        }
        );
        if (result || result1) {
            if (result) {
                toastifyError('Code Already Exists')
                setErrors({ ...errors, ['FBICodeError']: '' })
            }
            if (result1) {
                toastifyError('Description Already Exists')
                setErrors({ ...errors, ['DescriptionError']: '' })
            }
        } else {
            console.log(value);
            AddDeleteUpadate('FBICodes/InsertFBICodes', value).then((res) => {
                toastifySuccess(res.Message);
                setErrors({ ...errors, ['FBICodeError']: '' })
                setModal(false)
                get_data_FbiCode();
                reset();
            })
        }
    }

    const update_FBI_Code = () => {
        var result = FbiCodeData?.find(item => {
            if (item.FBICodeID != FBICodeID) {
                if (item.FBICode === value.FBICode) {
                    return true
                } else return false
            }
        }
        );
        var result1 = FbiCodeData?.find(item => {
            if (item.FBICodeID != FBICodeID) {
                if (item.Description === value.Description) {
                    return true
                } else return false
            }
        }
        );  
        if (result || result1) { 
            if (result) {
                toastifyError('Code Already Exists')
                setErrors({ ...errors, ['FBICodeError']: '' })
            }
            if (result1) {
                toastifyError('Description Already Exists')
                setErrors({ ...errors, ['DescriptionError']: '' })
            }
        } else {
            AddDeleteUpadate('FBICodes/UpdateFBICodes', value).then((res) => {
                toastifySuccess(res.Message);
                get_data_FbiCode();
                setModal(false)
                reset();
            })
        }
    }

    const check_Validation_Error = (e) => {
        e.preventDefault()
        if (RequiredField(value.FBICode)) {
            setErrors(prevValues => { return { ...prevValues, ['FBICodeError']: RequiredField(value.FBICode) } })
        }
        if (RequiredField(value.Description)) {
            setErrors(prevValues => { return { ...prevValues, ['DescriptionError']: RequiredField(value.Description) } })
        }
        if (RequiredField(value.FederalSpecificFBICode)) {
            setErrors(prevValues => { return { ...prevValues, ['FederalSpecificFBICodeError']: RequiredField(value.FederalSpecificFBICode) } })
        }
    }

    // Check All Field Format is True Then Submit 
    const { DescriptionError, FBICodeError, FederalSpecificFBICodeError } = errors

    useEffect(() => {
        if (DescriptionError === 'true' && FBICodeError === 'true' && FederalSpecificFBICodeError === 'true') {
            if (status) update_FBI_Code()
            else Add_FBI_code()
        }
    }, [DescriptionError, FBICodeError, FederalSpecificFBICodeError])

    return (
        <>
            {
                modal ?
                    <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="FBICodeModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="false">
                        <div class="modal-dialog modal-lg modal-dialog-centered rounded" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div className="m-1 mt-3">
                                        <fieldset style={{ border: '1px solid gray' }}>
                                            <legend style={{ fontWeight: 'bold' }}>FBI Code</legend>
                                            <div className="row ">
                                                <div className="col-12 col-md-2 col-lg-2 mt-2">
                                                    <div class="text-field">
                                                        <input type="text" maxLength={10} name='FBICode' onChange={handlChanges} value={value.FBICode} className='requiredColor' />
                                                        <label>Code</label>
                                                        {errors.FBICodeError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.FBICodeError}</span>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-2 col-lg-2 mt-2">
                                                    <div class="text-field">
                                                        <input type="text" name='AgencyCode' onChange={handlChanges} value={value.AgencyCode} />
                                                        <label>Agency Code</label>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-4 col-lg-4 mt-2">
                                                    <div class="text-field">
                                                        <input type="text" name='FederalSpecificFBICode' onChange={handlChanges} value={value.FederalSpecificFBICode} className='requiredColor' />
                                                        <label>Specific FBI Code</label>
                                                        {errors.FederalSpecificFBICodeError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.FederalSpecificFBICodeError}</span>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-4 col-lg- mt-2">
                                                    <div class="text-field">
                                                        <input type="text" name='NIBRSSeq' onChange={handlChanges} value={value.NIBRSSeq} className='requiredColor' />
                                                        <label>NIBRSSeq</label>
                                                        {errors.NIBRSSeqError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.NIBRSSeqError}</span>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-8 col-lg-12 mt-2">
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
                                                        <div className="col-4 mt-3">
                                                            <input type="checkbox" name="IsCrimeAgains_Person" checked={value.IsCrimeAgains_Person} value={value.IsCrimeAgains_Person}
                                                                onChange={handlChanges}
                                                                // disabled={''}
                                                                id="IsCrimeAgains_Person" />
                                                            <label className='ml-2' htmlFor="IsCrimeAgains_Person">Is Crime Agains Person</label>
                                                        </div>
                                                        <div className="col-4 mt-3">
                                                            <input type="checkbox" name="IsCrimeAgainstProperty" checked={value.IsCrimeAgainstProperty} value={value.IsCrimeAgainstProperty}
                                                                onChange={handlChanges}
                                                                // disabled={''}
                                                                id="IsCrimeAgainstProperty" />
                                                            <label className='ml-2' htmlFor="IsCrimeAgainstProperty">Is Crime Against Property</label>
                                                        </div>
                                                        <div className="col-4 mt-3">
                                                            <input type="checkbox" name="IsCrimeAgainstSociety" checked={value.IsCrimeAgainstSociety} value={value.IsCrimeAgainstSociety}
                                                                onChange={handlChanges}
                                                                // disabled={''}
                                                                id="IsCrimeAgainstSociety" />
                                                            <label className='ml-2' htmlFor="IsCrimeAgainstSociety">Is Crime Against Society</label>
                                                        </div>
                                                        <div className="col-4 mt-3">
                                                            <input type="checkbox" name="IsCrimeForTicket" checked={value.IsCrimeForTicket} value={value.IsCrimeForTicket}
                                                                onChange={handlChanges}
                                                                // disabled={''}
                                                                id="IsCrimeForTicket" />
                                                            <label className='ml-2' htmlFor="IsCrimeForTicket">Is Crime For Ticket</label>
                                                        </div>
                                                        <div className="col-4 mt-3">
                                                            <input type="checkbox" name="IsDomesticViolence" checked={value.IsDomesticViolence} value={value.IsDomesticViolence}
                                                                onChange={handlChanges}
                                                                // disabled={''}
                                                                id="IsDomesticViolence" />
                                                            <label className='ml-2' htmlFor="IsDomesticViolence">Is Domestic Violence</label>
                                                        </div>
                                                        <div className="col-4 mt-3">
                                                            <input type="checkbox" name="IsCriminalActivityRequired" checked={value.IsCriminalActivityRequired} value={value.IsDomesticViolence}
                                                                onChange={handlChanges}
                                                                // disabled={''}
                                                                id="IsCriminalActivityRequired" />
                                                            <label className='ml-2' htmlFor="IsCriminalActivityRequired">Is Criminal Activity Required</label>
                                                        </div>
                                                        <div className="col-4 mt-3">
                                                            <input type="checkbox" name="IsUcrArson" checked={value.IsUcrArson} value={value.IsUcrArson}
                                                                onChange={handlChanges}
                                                                // disabled={''}
                                                                id="IsUcrArson" />
                                                            <label className='ml-2' htmlFor="IsUcrArson">Is UcrArson</label>
                                                        </div>
                                                        <div className="col-4 mt-3">
                                                            <input type="checkbox" name="IsGangInvolved" checked={value.IsGangInvolved} value={value.IsGangInvolved}
                                                                onChange={handlChanges}
                                                                // disabled={''}
                                                                id="IsGangInvolved" />
                                                            <label className='ml-2' htmlFor="IsGangInvolved">Is Gang Involved</label>
                                                        </div>
                                                        <div className="col-4 mt-3">
                                                            <input type="checkbox" name="IsCrimeForSexOffender" checked={value.IsCrimeForSexOffender} value={value.IsCrimeForSexOffender}
                                                                onChange={handlChanges}
                                                                // disabled={''}
                                                                id="IsCrimeForSexOffender" />
                                                            <label className='ml-2' htmlFor="IsCrimeForSexOffender">Is Crime For Sex Offender</label>
                                                        </div>

                                                        {/* new checkbox */}
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

export default FbiCode_Add_Up;

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