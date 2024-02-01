import React from 'react'
import { useState, useEffect,useCallback } from 'react';
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import { Decrypt_Id_Name } from '../../../../Common/Utility';
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api';
import Select from 'react-select'
import { ReqTrim } from '../Validation';

const Relation_Add_Up = ({ updateID, get_data_Relation, pageStatus, modal, setModal,relationData ,relationUpdStatus}) => {

    const [updValue, setUpdValue] = useState({})   
    const [value, setValue] = useState({
        'RelationTypeCode': '',  
        'Description': '',
        'IsActive': pageStatus,
        'CreatedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
        'ModifiedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
        'DeletedByUserFK': '','AgencyCode':'',
    });

    const handlChanges = (e) => {
        setValue({
            ...value,
            [e.target.name]: e.target.value
        })
    }

    const reset = () => {
        setValue({
            ...value,
            'RelationTypeCode': '',
            'Description': '',
            'IsActive': '',
            'CreatedByUserFK': '',
            'ModifiedByUserFK': '',
            'DeletedByUserFK': '','AgencyCode':'',
        })
    }

    useEffect(() => {
        if (updateID) {
            setValue({
                ...value,
                'RelationTypeID': updateID,
                'RelationTypeCode': updValue?.RelationTypeCode,
                'AgencyCode':updValue?.AgencyCode,
                'Description': updValue?.Description,
                'IsActive': pageStatus,
                'CreatedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
                'ModifiedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
                'DeletedByUserFK': '',
            });
        } else {
            setValue({
                ...value,
                'RelationTypeCode': '',
                'Description': '',
                'AgencyCode':'',
                'IsActive': pageStatus,
                'CreatedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
                'ModifiedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
                'DeletedByUserFK': '',
            });
        }
    }, [updValue, relationUpdStatus])
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
        if (updateID) {
            get_Singal_Data(updateID)
        }
    }, [updateID])

    const [relationTypeCodeErr, setRelationTypeCodeErr] = useState('')
    const [relationDescErr, setRelationDescErr] = useState('')

    const Add_Relation = (e) => {
        e.preventDefault();
        const { RelationTypeCode, Description, CreatedByUserFK } = value;

        var result = relationData?.find(item => {
            if (item.RelationTypeCode.toLowerCase() === value.RelationTypeCode.toLowerCase()) {
                return true
            } else return false
        }
        );
        var result1 = relationData?.find(item => {
            if (item.Description.toLowerCase() === value.Description.toLowerCase()) {
                return true
            } else return false
        }
        );

        if (!ReqTrim(RelationTypeCode)) {
            setRelationTypeCodeErr("Required *")
        } else if(result){
            setRelationTypeCodeErr("Relation Type Code Already Exists")
        }else {
            setRelationTypeCodeErr(false)
        }

        if (!ReqTrim(Description)) {
            setRelationDescErr("Required *")
        }else if(result1){
            setRelationDescErr("Description Already Exists ")
        } else {
            setRelationDescErr(false)
        }

        if (RelationTypeCode && Description && !result && !result) {
            if (RelationTypeCode.length > 10) {
                setRelationTypeCodeErr("Relation Type Code less then or equal to 10 digits")
            } else {
                const val = {
                    RelationTypeCode: RelationTypeCode,
                    Description: Description,
                    CreatedByUserFK: Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
                    Agencyid:Decrypt_Id_Name(localStorage.getItem('AgencyID'), 'AForAgencyID'),
                }
                AddDeleteUpadate('TableManagement/InsertRelation', val).then((res) => {
                    toastifySuccess(res.Message);
                    reset()
                    setModal(false)
                    get_data_Relation()
                })
            }
        }
    }

    const get_Singal_Data = (updateID) => {
        const val = {
            RelationTypeID: updateID,
            IsActive: pageStatus,
            
        }
        fetchPostData('TableManagement/GetSingleData_Relation', val)
            .then((res) => {
                setUpdValue(res)
            })
    }

    const Update = () => {
        const { RelationTypeCode, Description } = value;

        var result = relationData?.find(item => {
            if (item.RelationTypeID != value.RelationTypeID) {
                if (item.RelationTypeCode.toLowerCase() == value.RelationTypeCode.toLowerCase()) {
                    return true
                } else return false
            }
        }
        );
        var result1 = relationData?.find(item => {
            if (item.RelationTypeID != value.RelationTypeID) {
                if (item.Description.toLowerCase() === value.Description.toLowerCase()) {
                    return true
                } else return false
            }
        }
        );

        if (!ReqTrim(RelationTypeCode)) {
            setRelationTypeCodeErr("Required *")
        }else if(result){
            setRelationTypeCodeErr("Relation Type Code Already Exists")
        } else {
            setRelationTypeCodeErr(false)
        }

        if (!ReqTrim(Description)) {
            setRelationDescErr("Required *")
        }else if(result1){
            setRelationDescErr("Description Already Exists ")
        } else {
            setRelationDescErr(false)
        }

        if (RelationTypeCode && Description && !result && !result1) {
            if (RelationTypeCode.length > 10) {
                setRelationTypeCodeErr("Relation Type Code less then or equal to 10 digits")
            } else {
                AddDeleteUpadate('TableManagement/UpdateRelation', value)
                    .then(res => {
                        if (res.success) {
                            toastifySuccess(res.Message);
                            reset()
                            get_data_Relation()
                            setModal(false)
                        } else {
                            toastifyError(res.data.Message)
                        }
                    })
                    .catch(error => {
                        console.error('There was an error!', error);
                    });
            }
        }
    }

    const closeModal = () => {
         reset(); setModal(false) 
         setRelationDescErr('');
         setRelationTypeCodeErr('')
    }

    return (

        <>
            {
                modal
                    ?
                    <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="RelationModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="false">
                        <div class="modal-dialog modal-lg modal-dialog-centered rounded" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div className="m-1 mt-3">
                                        <fieldset style={{ border: '1px solid gray' }}>
                                            <legend style={{ fontWeight: 'bold' }}>Relation</legend>
                                            <div className="row pt-2">
                                                <div className="col-12 col-md-6 col-lg-6 ">
                                                    <div class="text-field">
                                                        <input type="text" maxLength={10} name='RelationTypeCode' onChange={handlChanges} value={value.RelationTypeCode} className='requiredColor' />
                                                        <label>Code</label>
                                                    </div>
                                                    <span className='err-msg'>{relationTypeCodeErr}</span>
                                                </div>
                                                <div className="col-12 col-md-6 col-lg-6">
                                                    <div class="text-field">
                                                        <textarea className='requiredColor' maxLength={50} name='Description' onChange={handlChanges} value={value.Description} required cols="30" rows="1"></textarea>
                                                        <label>Description</label>
                                                    </div>
                                                    <span className='err-msg'>{relationDescErr}</span>
                                                </div>
                                                <div className="col-12 col-md-4 col-lg-4 dropdown__box">
                                                        <Select 
                                                          id='Agency'
                                                          name='AgencyID'
                                                          placeholder="Select Agency"
                                                        />
                                                        <label>Agency</label>
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>
                                    <div className="btn-box text-right mt-3 mr-1">
                                        {
                                            updateID ?
                                                <button type="button" class="btn btn-sm btn-success mr-2" onClick={Update}>Update</button>
                                                :
                                                <button type="button" class="btn btn-sm btn-success mr-2" onClick={Add_Relation} >Save</button>
                                        }
                                        <button type="button" class="btn btn-sm btn-success" onClick={() => closeModal()}>Close</button>
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

export default Relation_Add_Up