import React from 'react'
import DataTable from 'react-data-table-component'

const SearchModal = () => {
    const columns = [
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true

        },
        {
            name: 'Email',
            selector: row => row.email,
            sortable: true

        },
        {
            name: 'Message',
            selector: row => row.message,
            sortable: true

        },

    ];
    const data = [
        {
            id: 1,
            name: 'Beetlejuice',
            email: 'example@.com',
            message: 'provide details',
        },
        {
            id: 2,
            name: 'Ghostbusters',
            email: 'busters@gmail.com',
            message: 'Login',
        },
        {
            id: 3,
            name: 'Ghostbusters',
            email: 'busters@gmail.com',
            message: 'Login',
        },
        {
            id: 4,
            name: 'Ghostbusters',
            email: 'busters@gmail.com',
            message: 'Login',
        },
        {
            id: 5,
            name: 'Ghostbusters',
            email: 'busters@gmail.com',
            message: 'Login',
        },
    ]
    return (
        <>
            <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="SerachModal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="false">
                <div class="modal-dialog modal-dialog-centered modal-xl" role="document" >
                    <div class="modal-content">
                        <div class="modal-body">
                            <div className="m-1 ">
                                <fieldset style={{ border: '1px solid gray' }}>
                                    <legend style={{ fontWeight: 'bold' }}>Name Search</legend>
                                    <div className="col-12">
                                        <DataTable
                                            columns={columns}
                                            // data={data}
                                            pagination
                                            selectableRowsHighlight
                                            highlightOnHover
                                            dense
                                            paginationPerPage={'10'}
                                            paginationRowsPerPageOptions={[10, 15]}
                                            responsive
                                        />
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                        <div className="btn-box text-right  mr-1 mb-2">
                            <button type="button" class="btn btn-sm btn-success mr-1" >Save</button>
                            <button type="button" data-dismiss="modal" class="btn btn-sm btn-success mr-1" >Close</button>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default SearchModal