import React from 'react'
import { useState, useCallback } from 'react'
import { useEffect } from 'react'
// import { Select } from 'semantic-ui-react'
import Select from 'react-select'
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg'
import { Decrypt_Id_Name } from '../../../../Common/Utility'
import { AddDeleteUpadate, fetchData, fetchPostData } from '../../../../hooks/Api'
import { RequiredField } from '../Validation';
import { components } from "react-select";
import makeAnimated from "react-select/animated";
import SelectBox from '../../../../Common/SelectBox'

const Option = props => {
    return (
        <div>
            <components.Option {...props}>
                    <input
                        type="checkbox"
                        checked={props.isSelected}
                        onChange={() => null}
                    />
                    <p className='ml-2 d-inline'>{props.label}</p>
            </components.Option>
        </div>
    );
};

const MultiValue = props => (
    <components.MultiValue {...props}>
        <span>{props.data.label}</span>
    </components.MultiValue>
);

const animatedComponents = makeAnimated();


const Race_Add_Up = (props) => {

    const { raceTypeId, status, get_data_Race, raceData, modal, setModal, raceUpdStatus } = props
    const [agencyData, setAgencyData] = useState([])
    const [raceEditval, setRaceEditval] = useState();
    const [value, setValue] = useState({
        "RaceCode": '',
        'RaceTypeID': '',
        "Description": '',
        'IsActive': '',
        'CreatedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
        'ModifiedByUserFK': '',
        'DeletedByUserFK': '', 'AgencyId': '', 'AgencyName': '', 'MultiAgency_Name': '','AgencyCode':'',

    })
    const [Selected, setSelected] = useState({
        optionSelected: null
    })

    const handleChangeddd = selected => {
        setSelected({
            optionSelected: selected
        });

        var id = []
        var name = []
        if (selected) {
            selected.map((item, i) => {
                id.push(item.value);
                name.push(item.label)
            })
            setValue({
                ...value,
                ['AgencyId']: id.toString(), ['MultiAgency_Name']: name.toString()
            })
        }
    };

    const reset = () => {
        setValue({
            ...value,
            'RaceCode': '',
            'Description': '',
            'RaceTypeID': '',
            'IsActive': '',
            'CreatedByUserFK': '',
            'ModifiedByUserFK': '',
            'DeletedByUserFK': '',
            'AgencyId': '', 'AgencyName': '','AgencyCode':'',
        })
        setSelected({
            optionSelected: null
        });
        setErrors({
            'RaceCodeError': '',
            'DescriptionError': '',
        })
    }

    // Initializaation Error Hooks
    const [errors, setErrors] = useState({
        'RaceCodeError': '',
        'DescriptionError': '',
    })

    useEffect(() => {
        if (raceTypeId) {
            GetSingleData_Color()
        }
    }, [raceTypeId, raceUpdStatus])

    const GetSingleData_Color = () => {
        const val = { 'RaceTypeID': raceTypeId }
        fetchPostData('TableManagement/GetSingleData_RaceType', val)
            .then((res) => {

                if (res) setRaceEditval(res)
                else setRaceEditval()
            })
    }

    useEffect(() => {
        if (status) {
            setValue({
                ...value,
                "IsActive": raceEditval[0]?.IsActive,
                "RaceCode": raceEditval[0]?.RaceCode,
                'AgencyCode':raceEditval[0]?.AgencyCode,
                "Description": raceEditval[0]?.Description,
                'AgencyId': raceEditval[0]?.AgencyID,
                "RaceTypeID": raceEditval[0]?.RaceTypeID, 'MultiAgency_Name': raceEditval[0]?.MultiAgency_Name,
                'AgencyName': raceEditval[0]?.MultipleAgency ? changeArrayFormat_WithFilter(raceEditval[0]?.MultipleAgency
                ) : '', 'CreatedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'), 'ModifiedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID')
            }); setSelected({
                optionSelected: raceEditval[0]?.MultipleAgency ? changeArrayFormat_WithFilter(raceEditval[0]?.MultipleAgency
                    ) : '',
            });
        }
        else {
            setValue({
                ...value,
                "RaceCode": '',
                "Description": '',
                'AgencyId': '', 'AgencyName': '', 'ModifiedByUserFK': '', 'MultiAgency_Name': '', 'AgencyCode':''
            })
        }
    }, [raceEditval])

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

    const handlChanges = (e) => {
        setValue({
            ...value,
            [e.target.name]: e.target.value
        })
        // console.log("this is value",value)
    }

    const Add_Race = (e) => {
        var result = raceData?.find(item => {
            if (item.RaceCode) {
                if (item.RaceCode.toLowerCase() === value.RaceCode.toLowerCase()) {
                    return true
                } else return false
            }
        }
        );
        var result1 = raceData?.find(item => {
            if (item.Description) {
                if (item.Description.toLowerCase() === value.Description.toLowerCase()) {
                    return true
                } else return false
            }
        }
        );
        if (result || result1) {
            if (result) {
                toastifyError('Race Code Already Exists')
                setErrors({ ...errors, ['RaceCodeError']: '' })
            }
            if (result1) {
                toastifyError('Description Already Exists')
                setErrors({ ...errors, ['DescriptionError']: '' })
            }
        } else {
            console.log("this is value",value)
            AddDeleteUpadate('TableManagement/InsertRaceType', value).then((res) => {
                toastifySuccess(res.Message);
                setErrors({ ...errors, ['RaceError']: '' })
                setModal(false)
                get_data_Race();
                reset();
                //   console.log("this is addResponse",res)
            })

        }
    }

    const update_Race = () => {
        var result = raceData?.find(item => {
            if (item.RaceTypeID != value.RaceTypeID) {
                if (item.RaceCode === value.RaceCode) {
                    return true
                } else return false
            }
        }
        );
        var result1 = raceData?.find(item => {
            if (item.RaceTypeID != value.RaceTypeID) {
                if (item.Description === value.Description) {
                    return true
                } else return false
            }
        }
        );
        if (result || result1) {
            if (result) {
                toastifyError('Code Already Exists')
                setErrors({ ...errors, ['RaceCodeError']: '' })
            }
            if (result1) {
                toastifyError('Description Already Exists')
                setErrors({ ...errors, ['DescriptionError']: '' })
            }
        } else {
            console.log(value);
            AddDeleteUpadate('TableManagement/UpdateRaceType', value).then((res) => {
                toastifySuccess(res.Message); setErrors({ ...errors, ['DescriptionError']: '' })
                get_data_Race();
                setModal(false)
                reset();
            })
        }
    }

    const check_Validation_Error = (e) => {
        e.preventDefault()
        if (RequiredField(value.RaceCode)) {
            // console.log(value.RaceCode);
            console.log(RequiredField(value.RaceCode));
            setErrors(prevValues => { return { ...prevValues, ['RaceCodeError']: RequiredField(value.RaceCode) } })
        }
        if (RequiredField(value.Description)) {
            setErrors(prevValues => { return { ...prevValues, ['DescriptionError']: RequiredField(value.Description) } })
        }
    }

    // Check All Field Format is True Then Submit 
    const { DescriptionError, RaceCodeError } = errors

    useEffect(() => {
        if (DescriptionError === 'true' && RaceCodeError === 'true') {
            if (status) update_Race()
            else Add_Race()
        }
    }, [DescriptionError, RaceCodeError])


    const closeModal = () => {
        reset();
        setModal(false);
    }

    return (
        <>
            {
                modal ?
                    <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="RaceModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="false">
                        <div class="modal-dialog modal-lg modal-dialog-centered rounded" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div className="m-1 mt-3">
                                        <fieldset style={{ border: '1px solid gray' }}>
                                            <legend style={{ fontWeight: 'bold' }}>Race</legend>
                                            <div className="row ">
                                                <div className="col-12 col-md-2 col-lg-2 mt-2">
                                                    <div class="text-field">
                                                        <input type="text" name='RaceCode' maxLength={10} onChange={handlChanges} value={value.RaceCode} className='requiredColor' />
                                                        <label>Code</label>
                                                        {errors.RaceCodeError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.RaceCodeError}</span>
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
                                                        <textarea className='requiredColor' maxLength={250} name='Description' onChange={handlChanges} value={value.Description} required cols="30" rows="1"></textarea>
                                                        <label>Description</label>
                                                        {errors.DescriptionError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DescriptionError}</span>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-12 col-lg-12 dropdown__box">
                                                    <SelectBox
                                                        options={agencyData}
                                                        isMulti
                                                        closeMenuOnSelect={false}
                                                        hideSelectedOptions={false}
                                                        components={{ Option, MultiValue, animatedComponents }}
                                                        onChange={handleChangeddd}
                                                        allowSelectAll={true}
                                                        value={Selected.optionSelected}
                                                    />
                                                    <label>Agency</label>
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

export default Race_Add_Up


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
