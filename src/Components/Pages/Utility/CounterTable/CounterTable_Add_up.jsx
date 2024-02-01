import React from 'react'
import { useState, useCallback } from 'react'
import { useEffect } from 'react'
import { toastifySuccess } from '../../../Common/AlertMsg'
import { AddDeleteUpadate } from '../../../hooks/Api'
import { RequiredField, RequiredSelectField } from '../Personnel/Validation';
import Select from 'react-select'

const CounterTable_Add_Up = (props) => {

    const { modal, status, EditList, setModal, get_Data_List, updateStatus } = props

    const [value, setValue] = useState({
        'Counter_Format': '', 'Last_Number': '', 'WhenReset': '', 'WhenResetName': '',
        //  'LastResetDate': '',
        'CounterID': '',
    });

    // Initializaation Error Hooks
    const [errors, setErrors] = useState({
        'Counter_FormatError': '', 'Last_NumberError': '', 'When_ResetError': '',
    })


    useEffect(() => {
        if (status) {
            console.log(EditList);
            setValue({
                ...value,
                "Counter_Format": EditList?.Counter_Format,
                "Last_Number": EditList?.Last_Number.toString(),
                'WhenReset': EditList?.WhenReset,
                'CounterID': EditList?.CounterID,
                'WhenResetName': changeArrayFormat_WithFilter([EditList]),
            })
        }
        else {
            setValue({
                ...value,
                'Counter_Format': '',
                'Last_Number': '', 'WhenReset': '', 'WhenResetName': '',
                'CounterID': '',
            })
        }
    }, [EditList, updateStatus])

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


    const reset = () => {
        setValue({
            ...value,
            'Counter_Format': '', 'Last_Number': '', 'WhenReset': '',
            'CounterID': '', 'WhenResetName': '',
        })
        setErrors({
            'Counter_FormatError': '', 'Last_NumberError': '', 'When_ResetError': '',
        })
    }

    const handlChanges = (e) => {
        console.log(e.target.name);
        setValue({
            ...value,
            [e.target.name]: e.target.value
        })
    }

    const update_Type = () => {
        console.log(value);
        AddDeleteUpadate('Counter/UpdateCounter', value).then((res) => {
            // console.log(res);
            toastifySuccess(res.Message);
            get_Data_List();
            setModal(false)
            reset();
        })
    }

    const check_Validation_Error = (e) => {
        e.preventDefault()
        console.log(value);
        if (RequiredField(value.Counter_Format)) {
            setErrors(prevValues => { return { ...prevValues, ['Counter_FormatError']: RequiredField(value.Counter_Format) } })
        }
        if (RequiredField(value.Last_Number)) {
            setErrors(prevValues => { return { ...prevValues, ['Last_NumberError']: RequiredField(value.Last_Number) } })
        }
        console.log(value.WhenReset);
        if (RequiredField(value.WhenReset)) {
            setErrors(prevValues => { return { ...prevValues, ['When_ResetError']: RequiredField(value.WhenReset) } })
        }
    }

    // Check All Field Format is True Then Submit 
    const { Counter_FormatError, Last_NumberError, When_ResetError } = errors

    useEffect(() => {
        if (Counter_FormatError === 'true' && Last_NumberError === 'true' && When_ResetError === 'true') {
            update_Type();
        }
    }, [Counter_FormatError, Last_NumberError, When_ResetError])


    const closeModal = () => {
        reset();
        setModal(false);
    }

    const options = [
        { value: 'Roll', label: 'Roll' },
        { value: 'Year', label: 'Year' },
    ]

    const colourStyles = {
        control: (styles) => ({
            ...styles,
            backgroundColor: "#fce9bf",
            height: 20,
            minHeight: 30,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        })
    } 


    return (
        <>
            {
                modal ?
                    <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="CounterModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="false">
                        <div class="modal-dialog modal-lg modal-dialog-centered rounded" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div className="m-1 mt-3">
                                        <fieldset style={{ border: '1px solid gray' }}>
                                            <legend style={{ fontWeight: 'bold' }}>Counter Modal</legend>
                                            <div className="row">
                                                <div className="col-12 col-md-4 col-lg-4 mt-3">
                                                    <div class="text-field">
                                                        <input type="text" name='Counter_Format' onChange={handlChanges} value={value.Counter_Format} className='requiredColor' />
                                                        <label>Counter_Format</label>
                                                        {errors.Counter_FormatError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.Counter_FormatError}</span>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-4 col-lg-4 mt-3">
                                                    <div class="text-field">
                                                        <input type="text" name='Last_Number' onChange={handlChanges} value={value.Last_Number} className='requiredColor' />
                                                        <label>Last_Number</label>
                                                        {errors.Last_NumberError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.Last_NumberError}</span>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-12 col-lg-4 mt-1">
                                                    {/* <div class="text-field"> */}
                                                        {/*<input type="text" name='WhenReset' onChange={handlChanges} value={value.WhenReset} className='requiredColor' />
                                                            <label>WhenReset</label>
                                                            {errors.When_ResetError !== 'true' ? (
                                                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.When_ResetError}</span>
                                                            ) : null}
                                                        </div> */}
                                                        <label style={{ fontWeight: '650', lineHeight: '5px', fontSize: '12px' }}>When Reset</label>
                                                        {
                                                            value?.WhenResetName ?
                                                                <Select
                                                                    name='WhenReset'
                                                                    isClearable
                                                                    styles={colourStyles}
                                                                    defaultValue={value?.WhenResetName}
                                                                    options={options}
                                                                    onChange={(e) => {
                                                                        if (e) {
                                                                            setValue({ ...value, ['WhenReset']: e.label })
                                                                        } else setValue({ ...value, ['WhenReset']: '' })
                                                                    }}
                                                                    placeholder="When Rest..."
                                                                />
                                                                : <>
                                                                    <Select
                                                                        name='WhenReset'
                                                                        isClearable
                                                                        styles={colourStyles}
                                                                        // options={options}
                                                                        onChange={(e) => {
                                                                            if (e) {
                                                                                setValue({ ...value, ['WhenReset']: e.label })
                                                                            } else setValue({ ...value, ['WhenReset']: '' })
                                                                        }}
                                                                        placeholder="When Rest..."
                                                                    />
                                                                </>
                                                        }
                                                        {errors.When_ResetError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.When_ResetError}</span>
                                                        ) : null}
                                                </div>
                                                {/* <div className="col-12 col-md-4 col-lg-6 mt-2">
                                                    <DatePicker
                                                        dateFormat="MM/dd/yyyy"
                                                        timeInputLabel
                                                        name='LastResetDate'
                                                        isClearable={true}
                                                        onChange={(date)=>{ setValue({ ...value, ['LastResetDate']: getShowingMonthDateYear(date) }) }}
                                                        selected={lastRestDate}
                                                        placeholderText={value.LastResetDate ? value.LastResetDate : 'Select ..'}
                                                    />
                                                    <label>Last Reset Date</label>
                                                </div> */}
                                            </div>
                                        </fieldset>
                                    </div>
                                    <div className="btn-box text-right mt-3 mr-1">
                                        <button type="button" class="btn btn-sm btn-success mr-2" onClick={check_Validation_Error} >Update</button>
                                        {/* <button type="button" class="btn btn-sm btn-success mr-2" onClick={update_Type} >update</button> */}
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

export default CounterTable_Add_Up;

export const changeArrayFormat_WithFilter = (data) => {
    const result = data.map((sponsor) =>
        ({ value: sponsor.WhenReset, label: sponsor.WhenReset })
    )
    return result
}