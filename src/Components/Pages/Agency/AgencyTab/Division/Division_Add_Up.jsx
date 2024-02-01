// Import Component
import React, { useState, useEffect, memo } from "react";
import Select from "react-select";
import { AddDeleteUpadate_FormData, fetchData, fetchPostData, fieldPermision } from "../../../../hooks/Api";
import { Decrypt_Id_Name, EncryptedList } from "../../../../Common/Utility";
import { RequiredField } from "../../AgencyValidation/validators";
import { toastifyError, toastifySuccess } from "../../../../Common/AlertMsg";
import { useContext } from "react";
import { AgencyContext } from "../../../../../Context/Agency/Index";
import { Agency_Field_Permistion_Filter } from "../../../../Filter/AgencyFilter";

const Division_Add_Up = (props) => {

  // Hooks Initialization
  const { aId, pinId, status, divisionEditValue, get_Division, divisionList, modal, setModal, countUpd } = props
  const [headOfAgency, setHeadOfAgency] = useState([])
  const [parentList, setParentList] = useState([])
  const [classificationList, setClassificationList] = useState([])
  const [file, setFile] = useState('')
  const { get_CountList } = useContext(AgencyContext)

  const HeadOfAgency = []

  const [value, setValue] = useState({
    'AgencyId': aId,
    'DivisionCode': '',
    'Name': '',
    'HeadOfAgencyID': '',
    // 'CreatedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
    'CreatedByUserFK': pinId,
    'ModifiedByUserFK': '',
    'DivisionID': '',
    "ParentDivisionId": '',
    "ParentDivisionName": '',
    "HeadOfAgencyName": ''
  })

  const [fieldPermisionAgency, setFieldPermissionAgency] = useState({
    // Divisin Fields
    'DivisionCode': '', 'Name': '', 'HeadOfAgencyID': '', 'ParentDivisionId': ''
  })

  // Initializaation Error Hooks
  const [errors, setErrors] = useState({
    'DivisionCodeError': '',
    'NameError': '',
    'HeadOfAgencyID': ''
  })
  // Set Edit valuse

  useEffect(() => {
    if (divisionEditValue?.DivisionID) {
      get_parent_Division(divisionEditValue?.DivisionID)
      setValue({
        ...value,
        'DivisionCode': divisionEditValue?.DivisionCode,
        'Name': divisionEditValue?.Name,
        'HeadOfAgencyID': divisionEditValue?.PINID,
        'DivisionID': divisionEditValue?.DivisionID,
        "ParentDivisionId": divisionEditValue?.ParentDivisionId,
        'ParentDivisionName': changeArrayFormat_WithFilter([divisionEditValue], 'group'), 'HeadOfAgencyName': changeArrayFormat_WithFilter([divisionEditValue], 'head'),
        // 'ModifiedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
        'ModifiedByUserFK': pinId,
      })
    } else {
      get_parent_Division('')
      setValue({
        ...value,
        'DivisionCode': '',
        'Name': '',
        'HeadOfAgencyID': '',
        'DivisionID': '',
        "ParentDivisionId": '',
        'ModifiedByUserFK': '',
        'ParentDivisionName': '', 'HeadOfAgencyName': ''
      })
    }
  }, [divisionEditValue, countUpd])

  // Onload Call function
  useEffect(() => {
    get_Head_Of_Agency(aId);
    get_Classification();
    get_parent_Division();
  }, [aId]);

  // Get Head of Agency
  const get_Head_Of_Agency = () => {
    const val = {
      AgencyID: aId
    }
    fetchPostData('DropDown/GetData_HeadOfAgency', val)
      .then(res => {
        if (res) {
          setHeadOfAgency(changeArrayFormat(res, 'head'))
        }
      })

  };

  const get_parent_Division = (id) => {
    const val = {
      AgencyID: aId,
      DivisionID: id
    }
    fetchPostData('Division/GetData_ParentDivision', val)
      .then(res => {
        if (res) {
          setParentList(changeArrayFormat(res, 'division'))
        } else setParentList()
      })
  };

  // Get Classification List
  const get_Classification = () => {
    fetchData('DropDown/GetData_Classification')
      .then(res => {
        if (res) {
          setClassificationList(res)
        } else setClassificationList(res)
      })
  }

  useEffect(() => {
    if (aId && pinId) get_Field_Permision_Division(aId, pinId)
  }, [aId])

  // Get Effective Field Permission
  const get_Field_Permision_Division = (aId, pinId) => {
    fieldPermision(aId, 'A004', pinId).then(res => {
      if (res) {
        // Division Field 
        if (Agency_Field_Permistion_Filter(res, "Agency-DivisionCode")) {
          setFieldPermissionAgency(prevValues => { return { ...prevValues, ['DivisionCode']: Agency_Field_Permistion_Filter(res, "Agency-DivisionCode") } })
        }
        if (Agency_Field_Permistion_Filter(res, "Agency-Name")) {
          setFieldPermissionAgency(prevValues => { return { ...prevValues, ['Name']: Agency_Field_Permistion_Filter(res, "Agency-Name") } })
        }
        if (Agency_Field_Permistion_Filter(res, "Agency-HeadOfAgency")) {
          setFieldPermissionAgency(prevValues => { return { ...prevValues, ['HeadOfAgencyID']: Agency_Field_Permistion_Filter(res, "Agency-HeadOfAgency") } })
        }
        if (Agency_Field_Permistion_Filter(res, "Agency-Classification")) {
          setFieldPermissionAgency(prevValues => { return { ...prevValues, ['ClassificationID']: Agency_Field_Permistion_Filter(res, "Agency-Classification") } })
        } 
        if (Agency_Field_Permistion_Filter(res, "Agency-ParentDivisionID")) {
          setFieldPermissionAgency(prevValues => { return { ...prevValues, ['ParentDivisionId']: Agency_Field_Permistion_Filter(res, "Agency-ParentDivisionID") } })
        }
      }
    });
  }

  const head_Of_AgencyChange = (e) => {
    if (e) {
      setValue({
        ...value,
        ['HeadOfAgencyID']: e.value
      })
    } else {
      setValue({
        ...value,
        ['HeadOfAgencyID']: null
      })
    }
  }

  const parentChanges = (e) => {
    if (e) {
      setValue({
        ...value,
        ['ParentDivisionId']: e.value
      })
    } else {
      setValue({
        ...value,
        ['ParentDivisionId']: ''
      })
    }
  }

  const handlChanges = (e) => {
    setValue({
      ...value,
      [e.target.name]: e.target.value
    })
  }

  // Check validation on Field
  const check_Validation_Error = (e) => {
    e.preventDefault()
    if (RequiredField(value.DivisionCode)) {
      setErrors(prevValues => { return { ...prevValues, ['DivisionCodeError']: RequiredField(value.DivisionCode) } })
    }
    if (RequiredField(value.Name)) {
      setErrors(prevValues => { return { ...prevValues, ['NameError']: RequiredField(value.Name) } })
    } 
    if (RequiredField(value.HeadOfAgencyID)) {
      setErrors(prevValues => { return { ...prevValues, ['HeadOfAgencyID']: RequiredField(value.HeadOfAgencyID) } })
    }
  }

  // Check All Field Format is True Then Submit 
  const { NameError, DivisionCodeError, HeadOfAgencyID } = errors

  useEffect(() => {
    if (NameError === 'true' && DivisionCodeError === 'true' && HeadOfAgencyID === 'true') {
      if (status) update_Division()
      else add_Division()
    }
  }, [NameError, DivisionCodeError, HeadOfAgencyID])

  // Reset value 
  const rest_Field_Value = () => {
    setValue({
      ...value, 'DivisionCode': '', 'Name': '', 'HeadOfAgencyID': '', 'ParentDivisionId': '', 'DivisionID': '', 'ModifiedByUserFK': '', 'ParentDivisionName': '', 'HeadOfAgencyName': ''
    })
    setErrors({ ...errors, 'DivisionCodeError': '', 'NameError': '', 'HeadOfAgencyID': '' });
  }

  // Submit Division Data 
  const add_Division = () => {
    var result = divisionList?.find(item => {
      if (item.DivisionCode === value.DivisionCode) {
        return true
      } else return false
    }
    );
    var result1 = divisionList?.find(item => {
      if (item.Name === value.Name) {
        return true
      } else return false
    }
    );
    if (result || result1) {
      if (result) {
        toastifyError('Division Code Already Exists')
        setErrors({ ...errors, ['DivisionCodeError']: '' })
      }
      if (result1) {
        toastifyError('Division Name Already Exists')
        setErrors({ ...errors, ['DivisionCodeError']: '' })
      }
    } else {
      const values = EncryptedList(JSON.stringify(value));
      // console.log(values)
      var formdata = new FormData();
      formdata.append("Data", values);
      AddDeleteUpadate_FormData('Division/DivisionInsert', formdata)
        .then(res => {
          if (res.success) {
            toastifySuccess(res.Message); get_parent_Division()
            setErrors({ ...errors, ['DivisionCodeError']: '' })
            get_Division(aId)
            get_CountList(aId)
            rest_Field_Value()
            setModal(false)
          }
        })
        .catch(err => console.log(err))
    }
  }

  // Update Division List
  const update_Division = () => {
    const values = EncryptedList(JSON.stringify(value));
    var formdata = new FormData();
    formdata.append("Data", values);
    var result = divisionList?.find(item => {
      if (item.DivisionID != value.DivisionID) {
        if (item.DivisionCode === value.DivisionCode) {
          return true
        } else return false
      }
    }
    );

    var result1 = divisionList?.find(item => {
      if (item.DivisionID != value.DivisionID) {
        if (item.Name === value.Name) {
          return true
        } else return false
      }
    }
    );

    if (result || result1) {
      if (result) {
        toastifyError('Division Code Already Exists')
        setErrors({ ...errors, ['DivisionCodeError']: '' })
      }
      if (result1) {
        toastifyError('Division Name Already Exists')
        setErrors({ ...errors, ['DivisionCodeError']: '' })
      }
    } else {
      // console.log(value);
      AddDeleteUpadate_FormData('Division/DivisionUpdate', formdata)
        .then(res => {
          if (res.success) {
            toastifySuccess(res.Message)
            setErrors({ ...errors, ['DivisionCodeError']: '' })
            rest_Field_Value()
            get_Division(aId)
            setModal(false)
          }
        })
        .catch(err => console.log(err))
    }
  }

  // Custom Style
  const colourStyles = {
    control: (styles) => ({
      ...styles, backgroundColor: "#fce9bf",
      height: 20,
      minHeight: 30,
      fontSize: 14,
      margintop: 2,
      boxShadow: 0,
    }),
  };

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
          <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="DivisionModal" tabindex="-1" role="dialog" data-backdrop="false" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
              <div class="modal-content">
                <div class="modal-body">
                  <div className="m-1 mt-3">
                    <fieldset style={{ border: '1px solid gray' }}>
                      <legend style={{ fontWeight: 'bold' }}>Division</legend>

                      <div className="row pt-2">
                        <div className="col-6 ">
                          {/* {
                        status ?
                          <div className="text-field dropdown__box">
                            <input type="text" className='readonlyColor' onChange={handlChanges} name='DivisionCode' value={value.DivisionCode} readOnly />
                            <label>Division Code</label>
                          </div>
                          : */}
                          <div className="text-field">
                            <input type="text" maxLength={10}
                              className={fieldPermisionAgency?.DivisionCode[0] ?
                                fieldPermisionAgency?.DivisionCode[0]?.Changeok === 0 && fieldPermisionAgency?.DivisionCode[0]?.AddOK === 0 && status ? 'readonlyColor' : fieldPermisionAgency?.DivisionCode[0]?.Changeok === 0 && fieldPermisionAgency?.DivisionCode[0]?.AddOK === 1 && divisionEditValue?.DivisionCode === '' && status ? 'requiredColor' : fieldPermisionAgency?.DivisionCode[0]?.AddOK === 1 && !status ? 'requiredColor' : fieldPermisionAgency?.DivisionCode[0]?.Changeok === 1 && status ? 'requiredColor' : 'readonlyColor' : 'requiredColor'
                              }
                              onChange={fieldPermisionAgency?.DivisionCode[0] ?
                                fieldPermisionAgency?.DivisionCode[0]?.Changeok === 0 && fieldPermisionAgency?.DivisionCode[0]?.AddOK === 0 && status ? '' : fieldPermisionAgency?.DivisionCode[0]?.Changeok === 0 && fieldPermisionAgency?.DivisionCode[0]?.AddOK === 1 && divisionEditValue?.DivisionCode === '' && status ? handlChanges : fieldPermisionAgency?.DivisionCode[0]?.AddOK === 1 && !status ? handlChanges : fieldPermisionAgency?.DivisionCode[0]?.Changeok === 1 && status ? handlChanges : '' : handlChanges
                              }
                              name='DivisionCode' value={value.DivisionCode} required />
                            <label>Division Code</label>
                            {errors.DivisionCodeError !== 'true' ? (
                              <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DivisionCodeError}</span>
                            ) : null}
                          </div>
                          {/* } */}
                        </div>
                        <div className="col-6 ">
                          <div className="text-field">
                            <input type="text"
                              className={fieldPermisionAgency?.Name[0] ?
                                fieldPermisionAgency?.Name[0]?.Changeok === 0 && fieldPermisionAgency?.Name[0]?.AddOK === 0 && status ? 'readonlyColor' : fieldPermisionAgency?.Name[0]?.Changeok === 0 && fieldPermisionAgency?.Name[0]?.AddOK === 1 && divisionEditValue?.Name === '' && status ? 'requiredColor' : fieldPermisionAgency?.Name[0]?.AddOK === 1 && !status ? 'requiredColor' : fieldPermisionAgency?.Name[0]?.Changeok === 1 && status ? 'requiredColor' : 'readonlyColor' : 'requiredColor'
                              }
                              onChange={fieldPermisionAgency?.Name[0] ?
                                fieldPermisionAgency?.Name[0]?.Changeok === 0 && fieldPermisionAgency?.Name[0]?.AddOK === 0 && status ? '' : fieldPermisionAgency?.Name[0]?.Changeok === 0 && fieldPermisionAgency?.Name[0]?.AddOK === 1 && divisionEditValue?.Name === '' && status ? handlChanges : fieldPermisionAgency?.Name[0]?.AddOK === 1 && !status ? handlChanges : fieldPermisionAgency?.Name[0]?.Changeok === 1 && status ? handlChanges : '' : handlChanges
                              }
                              name='Name' value={value.Name} required />
                            <label>Name</label>
                            {errors.NameError !== 'true' ? (
                              <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.NameError}</span>
                            ) : null}
                          </div>
                        </div>
                        <div className="col-6 mt-5 pt-2 dropdown__box">
                          {/* {
                            value?.HeadOfAgencyName ?
                              <Select styles={colourStyles}
                                isClearable
                                defaultValue={value?.HeadOfAgencyName}
                                onChange={fieldPermisionAgency?.HeadOfAgencyID[0] ?
                                  fieldPermisionAgency?.HeadOfAgencyID[0]?.Changeok === 0 && fieldPermisionAgency?.HeadOfAgencyID[0]?.AddOK === 0 && status ? '' : fieldPermisionAgency?.HeadOfAgencyID[0]?.Changeok === 0 && fieldPermisionAgency?.HeadOfAgencyID[0]?.AddOK === 1 && divisionEditValue?.HeadOfAgencyID === '' && status ? head_Of_AgencyChange : fieldPermisionAgency?.HeadOfAgencyID[0]?.AddOK === 1 && !status ? head_Of_AgencyChange : fieldPermisionAgency?.HeadOfAgencyID[0]?.Changeok === 1 && status ? head_Of_AgencyChange : '' : head_Of_AgencyChange
                                }
                                isDisabled={fieldPermisionAgency?.HeadOfAgencyID[0] ?
                                  fieldPermisionAgency?.HeadOfAgencyID[0]?.Changeok === 0 && fieldPermisionAgency?.HeadOfAgencyID[0]?.AddOK === 0 && status ? true : fieldPermisionAgency?.HeadOfAgencyID[0]?.Changeok === 0 && fieldPermisionAgency?.HeadOfAgencyID[0]?.AddOK === 1 && divisionEditValue?.HeadOfAgencyID === '' && status ? false : fieldPermisionAgency?.HeadOfAgencyID[0]?.AddOK === 1 && !status ? false : fieldPermisionAgency?.HeadOfAgencyID[0]?.Changeok === 1 && status ? false : true : false
                                }
                                name='HeadOfAgencyID' options={headOfAgency}
                                placeholder={divisionEditValue?.HeadOfAgencyID ? HeadOfAgency : 'Head Of Division'}
                              />
                              :
                              <> */}
                          <Select
                            value={headOfAgency?.filter((obj) => obj.value === value?.HeadOfAgencyID)}
                            styles={colourStyles}
                            isClearable
                            onChange={fieldPermisionAgency?.HeadOfAgencyID[0] ?
                              fieldPermisionAgency?.HeadOfAgencyID[0]?.Changeok === 0 && fieldPermisionAgency?.HeadOfAgencyID[0]?.AddOK === 0 && status ? '' : fieldPermisionAgency?.HeadOfAgencyID[0]?.Changeok === 0 && fieldPermisionAgency?.HeadOfAgencyID[0]?.AddOK === 1 && divisionEditValue?.HeadOfAgencyID === '' && status ? head_Of_AgencyChange : fieldPermisionAgency?.HeadOfAgencyID[0]?.AddOK === 1 && !status ? head_Of_AgencyChange : fieldPermisionAgency?.HeadOfAgencyID[0]?.Changeok === 1 && status ? head_Of_AgencyChange : '' : head_Of_AgencyChange
                            }
                            isDisabled={fieldPermisionAgency?.HeadOfAgencyID[0] ?
                              fieldPermisionAgency?.HeadOfAgencyID[0]?.Changeok === 0 && fieldPermisionAgency?.HeadOfAgencyID[0]?.AddOK === 0 && status ? true : fieldPermisionAgency?.HeadOfAgencyID[0]?.Changeok === 0 && fieldPermisionAgency?.HeadOfAgencyID[0]?.AddOK === 1 && divisionEditValue?.HeadOfAgencyID === '' && status ? false : fieldPermisionAgency?.HeadOfAgencyID[0]?.AddOK === 1 && !status ? false : fieldPermisionAgency?.HeadOfAgencyID[0]?.Changeok === 1 && status ? false : true : false
                            }
                            name='HeadOfAgencyID'
                            options={headOfAgency}
                            placeholder={divisionEditValue?.HeadOfAgencyID ? HeadOfAgency : 'Head Of Division'}
                          />
                          {/* </>
                          } */}
                          <label htmlFor="" className="pt-2">Head Of Division</label>
                          {errors.HeadOfAgencyID !== 'true' ? (
                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.HeadOfAgencyID}</span>
                          ) : null}
                        </div>
                        <div className="col-6 mt-5 pt-2 dropdown__box">
                          {/* {
                            value.ParentDivisionName ?
                              <Select
                                styles={customStylesWithOutColor}
                                className="basic-single"
                                classNamePrefix="select"
                                name="color"
                                defaultValue={value.ParentDivisionName}
                                options={parentList}
                                isClearable
                                onChange={fieldPermisionAgency?.HeadOfAgencyID[0] ?
                                  fieldPermisionAgency?.HeadOfAgencyID[0]?.Changeok === 0 && fieldPermisionAgency?.HeadOfAgencyID[0]?.AddOK === 0 && status ? true : fieldPermisionAgency?.HeadOfAgencyID[0]?.Changeok === 0 && fieldPermisionAgency?.HeadOfAgencyID[0]?.AddOK === 1 && divisionEditValue?.HeadOfAgencyID === '' && status ? parentChanges : fieldPermisionAgency?.HeadOfAgencyID[0]?.AddOK === 1 && !status ? parentChanges : fieldPermisionAgency?.HeadOfAgencyID[0]?.Changeok === 1 && status ? parentChanges : true : parentChanges}
                                isDisabled={fieldPermisionAgency?.HeadOfAgencyID[0] ?
                                  fieldPermisionAgency?.HeadOfAgencyID[0]?.Changeok === 0 && fieldPermisionAgency?.HeadOfAgencyID[0]?.AddOK === 0 && status ? true : fieldPermisionAgency?.HeadOfAgencyID[0]?.Changeok === 0 && fieldPermisionAgency?.HeadOfAgencyID[0]?.AddOK === 1 && divisionEditValue?.HeadOfAgencyID === '' && status ? false : fieldPermisionAgency?.HeadOfAgencyID[0]?.AddOK === 1 && !status ? false : fieldPermisionAgency?.HeadOfAgencyID[0]?.Changeok === 1 && status ? false : true : false
                                }
                              />
                              :
                              <> */}
                          <Select
                            styles={customStylesWithOutColor}
                            className="basic-single"
                            value={parentList?.filter((obj) => obj.value === value?.ParentDivisionId)}
                            classNamePrefix="select"
                            name="ParentDivisionId"
                            options={parentList}
                            isClearable
                            onChange={fieldPermisionAgency?.ParentDivisionId[0] ?
                              fieldPermisionAgency?.ParentDivisionId[0]?.Changeok === 0 && fieldPermisionAgency?.ParentDivisionId[0]?.AddOK === 0 && status ? true : fieldPermisionAgency?.ParentDivisionId[0]?.Changeok === 0 && fieldPermisionAgency?.ParentDivisionId[0]?.AddOK === 1 && divisionEditValue?.ParentDivisionId === '' && status ? parentChanges : fieldPermisionAgency?.ParentDivisionId[0]?.AddOK === 1 && !status ? parentChanges : fieldPermisionAgency?.ParentDivisionId[0]?.Changeok === 1 && status ? parentChanges : true : parentChanges}
                            isDisabled={fieldPermisionAgency?.ParentDivisionId[0] ?
                              fieldPermisionAgency?.ParentDivisionId[0]?.Changeok === 0 && fieldPermisionAgency?.ParentDivisionId[0]?.AddOK === 0 && status ? true : fieldPermisionAgency?.ParentDivisionId[0]?.Changeok === 0 && fieldPermisionAgency?.ParentDivisionId[0]?.AddOK === 1 && divisionEditValue?.ParentDivisionId === '' && status ? false : fieldPermisionAgency?.ParentDivisionId[0]?.AddOK === 1 && !status ? false : fieldPermisionAgency?.ParentDivisionId[0]?.Changeok === 1 && status ? false : true : false
                            }
                          />
                          {/* </>
                          } */}
                          <label htmlFor="" className="pt-2">Parent Division</label>
                        </div>
                      </div>

                    </fieldset>

                  </div>
                  <div className="btn-box text-right mt-3 mr-1">
                    {
                      status ?
                        <button type="button" className="btn btn-sm btn-success mr-1" onClick={check_Validation_Error}>Update</button>
                        :
                        <button type="button" className="btn btn-sm btn-success mr-1" onClick={check_Validation_Error}>Save</button>
                    }
                    <button type="button" className="btn btn-sm btn-success" data-dismiss="modal" onClick={() =>
                      rest_Field_Value()}>Close</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          :
          <> </>
      }
    </>
  );
};

export default memo(Division_Add_Up)



export const changeArrayFormat = (data, type) => {
  if (type === 'division') {
    const result = data?.map((sponsor) =>
      ({ value: sponsor.DivisionID, label: sponsor.DivisionCode, })
    )
    return result
  }

  if (type === 'head') {
    const result = data?.map((sponsor) =>
      ({ value: sponsor.PINID, label: sponsor.HeadOfAgency })
    )
    return result
  }
}

export const changeArrayFormat_WithFilter = (data, type) => {
  if (type === 'group') {
    const result = data.map((sponsor) =>
      ({ value: sponsor.ParentDivisionId, label: sponsor.ParentDivisionname })
    )
    return result[0]
  }
  if (type === 'head') {
    const result = data.map((sponsor) =>
      ({ value: sponsor.PINID, label: sponsor.PINName })
    )
    return result[0]
  }
}
