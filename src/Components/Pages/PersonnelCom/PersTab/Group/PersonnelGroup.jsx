// Import Component
import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useLocation } from 'react-router-dom';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import { Decrypt_Id_Name } from '../../../../Common/Utility';
import { AddDeleteUpadate, fetchPostData, ScreenPermision } from '../../../../hooks/Api';

const PersonnelGroup = ({ pId, aId, pinId }) => {

	// const useQuery = () => new URLSearchParams(useLocation().search);
	// let aId = useQuery().get('id').split(" ", 3)[0].split("/", 1)[0].substring(10,);
	// let pId = useQuery().get('pd').split(" ", 3)[0].split("/", 1)[0].substring(10,);

	// Hooks Initialization
	const [personalGroupList, setPersonalGroupList] = useState([]);
	const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState()

	// Onload Function
	useEffect(() => {
		get_Group_Personnel(aId, pinId);
		getScreenPermision(aId, pinId)
	}, [aId]);

	const get_Group_Personnel = (aId, pinId) => {
		const val = {
			AgencyID: aId,
			PINID: pId
		};
		fetchPostData('EffectivePermission/GetData_Personal_Group', val)
			.then((res) => {
				console.log('EffectivePermission/GetData_Personal_Group', res);
				if (res) setPersonalGroupList(res);
				else setPersonalGroupList();
			})
			.catch((error) => {
				console.error('There was an error!', error);
			});
	};

	// Table Columns Array
	const columns = [
		{
			name: 'Group IN',
			selector: (row) => <input type="checkbox" checked={row.Status} onClick={(e) => update_Group_Member(e, row)} />,
			sortable: true
		},
		{
			name: 'Group Name',
			selector: (row) => row.GroupName,
			sortable: true
		}
	];

	// Get Effective Screeen Permission
	const getScreenPermision = (aId, pinId) => {
		ScreenPermision("P015", aId, pinId).then(res => {
			if (res) setEffectiveScreenPermission(res)
			else setEffectiveScreenPermission()
		});
	}

	// Update Group 
	const update_Group_Member = (e, id) => {
		e.preventDefault()
		const value = {
			"GroupID": id.GroupID,
			"PINID": pId,
			"ModifiedByUserFK": pinId,
			// "ModifiedByUserFK": Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID')
		}
		AddDeleteUpadate("SecurityGroupUserMembers/UpdateGroupMembers", value).then((data) => {
			if (data) toastifySuccess(data.Message); get_Group_Personnel(aId, pinId)
		})
	}

	return (
		<div className="row px-3">
			<div className="col-12  ">
				<div className="bg-line py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
					<p className="p-0 m-0 d-flex align-items-center">Group</p>
					{/* <i className="fa fa-plus"></i> */}
				</div>
				<DataTable
					columns={columns}
					data={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? personalGroupList : '' : ''}
					dense
					paginationPerPage={'5'}
					paginationRowsPerPageOptions={[5, 10, 15]}
					highlightOnHover
					noContextMenu
					pagination
					responsive
					subHeaderAlign="right"
					fixedHeader
					fixedHeaderScrollHeight="195px"
					subHeaderWrap
					noDataComponent={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
				/>
			</div>
		</div>
	);
};

export default PersonnelGroup;
