import React from 'react'
import Select from "react-select";
import { colourStyles } from '../../../../../Common/Utility';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
const CommentsAddUpdate = () => {
    return (
        <>
            <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="CommentsModal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="false">
                <div class="modal-dialog modal-dialog-centered modal-lg" role="document" >
                    <div class="modal-content">
                        <div class="modal-body">
                            <div className="mt-2">
                                <fieldset style={{ border: '1px solid gray' }}>
                                    <legend style={{ fontWeight: 'bold' }}>Comments</legend>
                                    <div className="row">
                                        <div className="col-12 col-md-12 col-lg-12">
                                            <div className="text-field">
                                                <Editor
                                                    wrapperClassName="wrapper-class"
                                                    editorClassName="editor-class"
                                                    toolbarClassName="toolbar-class"
                                                    editorStyle={{ height: '30vh' }}
                                                    toolbar={{
                                                        options: ['inline', 'blockType', 'fontFamily', 'list', 'remove', 'history'],
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
                                </fieldset>
                            </div>
                        </div>
                        <div className="btn-box text-right mr-2 mb-2 pr-2">
                            <button type="button" className="btn btn-sm btn-success mr-1">Save</button>
                            <button type="button" data-dismiss="modal" class="btn btn-sm btn-success" >Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CommentsAddUpdate