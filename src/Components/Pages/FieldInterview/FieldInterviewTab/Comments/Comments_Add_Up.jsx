import React, { useState } from 'react'
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, ContentState, convertFromHTML } from 'draft-js';
import { convertToHTML } from 'draft-convert';
import Select from "react-select";


const Comments_Add_Up = (props) => {
    const [convertedContent, setConvertedContent] = useState(null);
    const [value, setValue] = useState({
        'CommentsDoc': '',
        'ArrestID': '',
        'Comments': '',
        'CreatedByUserFK': '',
        'ModifiedByUserFK': '',
        'OfficerID': '',
        'AdminOfficer': '',
        'ArrestCommentsID': "",
    })
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
    const [editorState, setEditorState] = useState(
        () => EditorState.createEmpty(),
    );
    const handleEditorChange = (state) => {
        setEditorState(state);
        convertContentToHTML();
    }
    const convertContentToHTML = () => {
        let currentContentAsHTML = convertToHTML(editorState.getCurrentContent());
        setConvertedContent(currentContentAsHTML); setValue({ ...value, 'CommentsDoc': currentContentAsHTML })
    }
    return (
        <>

            <>
                <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="FieldCommentsModal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="false">
                    <div class="modal-dialog modal-dialog-centered modal-xl" role="document">
                        <div class="modal-content">
                            <div class="modal-body">
                                <div className="m-1 mt-3">
                                    <fieldset style={{ border: '1px solid gray' }}>
                                        <div className="row ">
                                            <div className="col-12 col-md-12 col-lg-12 ">
                                                <div className="row ">
                                                    <div className="col-12 col-md-12 col-lg-12">
                                                        <div className="text-field">
                                                            <Editor
                                                                editorState={editorState}
                                                                onEditorStateChange={handleEditorChange}
                                                                wrapperClassName="wrapper-class"
                                                                editorClassName="editor-class"
                                                                toolbarClassName="toolbar-class"
                                                                // onChange={getValueNarrative}
                                                                editorStyle={{ height: '60vh' }}
                                                                toolbar={{
                                                                    options: ['inline', 'blockType', 'fontFamily', 'list', 'history'],
                                                                    inline: {
                                                                        inDropdown: false,
                                                                        className: undefined,
                                                                        component: undefined,
                                                                        dropdownClassName: undefined,
                                                                        options: ['bold', 'italic', 'underline', 'monospace',],
                                                                    },
                                                                }}
                                                            />
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12 col-md-6 col-lg-4 mt-2">
                                                <div className="dropdown__box">
                                                    <Select
                                                        name='OfficerID'
                                                        isClearable
                                                        styles={colourStyles}
                                                        placeholder="Select.."
                                                        menuPlacement="top"
                                                    />
                                                    <label htmlFor="">Reported By</label>

                                                </div>
                                            </div>

                                            <div className="col-12 col-md-6 col-lg-8 text-right mt-4 pt-2">
                                                {/* <button type="button"  className="btn btn-sm btn-success pl-2">Update</button> */}
                                                <button type="button" className="btn btn-sm btn-success pl-2">Save</button>
                                                <button type="button" className="btn btn-sm btn-success ml-2" data-dismiss="modal">Close</button>
                                            </div>
                                        </div>
                                    </fieldset>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            </>
       
        </>
    )
}

export default Comments_Add_Up

