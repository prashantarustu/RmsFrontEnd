import moment from "moment";

export const ReqTrim = (field) => {
	if (field.trim() === '') {
		return false
	} else {
		return true
	}
}

export const RequiredFieldIncident = (field) => {
	if (!field || field?.length === 0 || field === '' || field === null || field === undefined || field === 0) {
		return 'Required *';
	} else {
		return 'true'
	}
};

export const RequiredFieldOnConditon = (field) => {
	if (field?.length === 0 || field === '' || field === undefined || field === 0) {
		return 'Required *';
	} else {
		return 'true'
	}
};

export const RequiredFieldArrestee = (field) => {
	if (field === '' || field === null || field === undefined) {
		return 'Required *';
	}
	else {
		return 'true'
	}
};

export const RequiredField = (field) => {
	if (!field || field === null || field === "Invalid date") {
		return 'Required *';
	} else if (field.match(/^\S.*[a-zA-Z\s]*$/)) {
		return 'true';
	} else {
		return 'Space Not Allow';
	}
};

export const SpaceCheck = (field) => {
	if (!field || field === null) {
		return 'true';
	} else if (field.match(/^\S.*[a-zA-Z\s]*$/)) {
		return 'true';
	} else {
		return 'Space Not Allow';
	}
};

export const Space_Allow_with_Trim = (field) => {
	// console.log(typeof (field))
	if (!field || field === null || field.trim() === '') {
		return 'Required *';
	}
	else if (field.match(/[a-zA-Z\s]*$/)) {
		return 'true';
	}
	else {
		return 'Space Not Allow';
	}
};

export const checkDateIsAfter = (fromDate, ToDate) => {
	const date1 = moment(fromDate);
	const date2 = moment(ToDate);
	// Check if date1 is after date2
	if (date2.isAfter(date1) || date1.isSame(date2)) {
		// console.log('date2 is after date1');
		return true
	} else {
		return false
	}
}

