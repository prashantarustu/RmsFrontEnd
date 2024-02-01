
export const Comman_changeArrayFormatBasicInfo = (data, Id, Code, type, col3, col4) => {
    if (type === 'PretendToBeID') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor[Id], label: sponsor[col4] + '-' + sponsor[Code], id: sponsor[col3], code: sponsor[col4] })
        )
        return result
    } else {
        const result = data?.map((sponsor) =>
            ({ value: sponsor[Id], label: sponsor[col4] + '-' + sponsor[Code], code: sponsor[col4] })
        )
        return result
    }
}

export const Comman_changeArrayFormat = (data, Id, Code, type, col3, col4) => {
    if (type === 'PretendToBeID') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor[Id], label: sponsor[col4] + '-' + sponsor[Code], id: sponsor[col3] })
        )
        return result
    } else {
        const result = data?.map((sponsor) =>
            ({ value: sponsor[Id], label: sponsor[Code] })
        )
        return result
    }
}

export const threeColArray = (data, Id, Code, col3) => {
    const result = data?.map((sponsor) =>
        ({ value: sponsor[Id], label: sponsor[Code], id: sponsor[col3] })
    )
    return result
}

export const threeColArrayWithCode = (data, Id, Code, col3) => {
    const result = data?.map((sponsor) =>
        ({ value: sponsor[Id], label: sponsor[col3] + ' - ' + sponsor[Code], id: sponsor[col3] })
    )
    return result
}

export const threeColArrayWithId = (data, Id, Code, Id2) => {
    const result = data?.map((sponsor) =>
        ({ value: sponsor[Id], label: sponsor[Code], id2: sponsor[Id2] })
    )
    return result
}

export const fourColArray = (data, Id, Code, col3, col4) => {
    const result = data?.map((sponsor) =>
        ({ value: sponsor[Id], label: sponsor[Code], checkVictem: sponsor[col3], checkOff: sponsor[col4] })
    )
    return result
}

export const sixColArray = (data, Id, Code, col1, col2, col3, col4, col5, col6) => {
    const result = data?.map((sponsor) =>
        ({ value: sponsor[Id], label: sponsor[Code], LastName: sponsor[col1], DateOfBirth: sponsor[col2], Gendre_Description: sponsor[col3], Race_Description: sponsor[col4], NameID: sponsor[col5], MasterNameID: sponsor[col6] })
    )
    return result
}

export const CommanchangeArrayFormat_WithFilter = (data, Id, DropDownValue) => {
    if (DropDownValue) {
        const result = data?.map((sponsor) =>
            (sponsor[Id])
        )
        const result2 = DropDownValue?.map((sponsor) => {
            if (sponsor.value === result[0]) {
                return { value: result[0], label: sponsor.label }
            }
        })
        const val = result2.filter(function (element) {
            return element !== undefined;
        });
        console.log(val[0])
        return val[0]
    }
}

export const CommanGetIdDescription = (data, Id, DropDownValue) => {
    if (DropDownValue) {
        const result = data?.map((sponsor) =>
            (sponsor[Id])
        )
        const result2 = DropDownValue?.map((sponsor) => {
            if (sponsor.value === result[0]) {
                return { value: result[0], label: sponsor.label }
            }
        })
        const val = result2.filter(function (element) {
            return element !== undefined;
        });
        console.log(val[0])
        return val[0]?.label
    }
}

export const Comman_changeArrayFormat_With_Name = (data, Id, Code, name) => {
    const result = data?.map((sponsor) =>
        ({ value: sponsor[Id], label: sponsor[Code], name: name })
    )
    return result
}

export const changeArray = (data, Id) => {
    const arr = []
    const result = data?.map((sponsor) =>
        (arr.push(sponsor[Id]))
    )
    return arr
}

export const findCode_WithId = (data, Id) => {
    console.log(data);
    console.log(Id);
    if (data) {
        const result = data?.map((sponsor) => {
            if (sponsor.value === Id) {
                return sponsor.id
            }
        })
        const val = result.filter(function (element) {
            return element !== undefined;
        });
        return val[0]
    }
};

export const Get_DropDown_Code = (data, dropDownData, IdName) => {
    const result = data?.map((sponsor) =>
        (sponsor[IdName])
    )
    const result2 = dropDownData?.map((sponsor) => {
        if (sponsor.value === result[0]) {
            return { value: result[0], label: sponsor.label, id: sponsor.id }
        }
    })
    const val = result2.filter(function (element) {
        return element !== undefined;
    });
    return val[0]?.id
}