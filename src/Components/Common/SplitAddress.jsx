
// export const SplitAddress = (Add) => {

//     var AddArray = [];

//     var myHeaders = new Headers();
//     myHeaders.append("Content-Type", "application/json");

//     var raw = JSON.stringify({
//         "address": {
//             // "regionCode": "US",
//             "addressLines": [Add]
//         },
//         "enableUspsCass": true
//     });

//     var requestOptions = {
//         method: 'POST',
//         headers: myHeaders,
//         body: raw,
//         redirect: 'follow'
//     };

//     fetch("https://addressvalidation.googleapis.com/v1:validateAddress?key=AIzaSyBEhZNFF92eTAqWeQ2ZCaITiWeaFrWlf1w", requestOptions)
//         .then(response => response.json())
//         .then(result => {
//             console.log('result.result.address.addressComponents', result.result.address.addressComponents);
//             result?.result?.address?.addressComponents.map((value) => {
//                 AddArray.push(value)
//             })
//             // AddArray = result.result.address.addressComponents
//             // AddArray.push(result.result.address.addressComponents)
//         })
//         .catch(error => console.log('error', error));
//     // const res = await axios.post(`https://addressvalidation.googleapis.com/v1:validateAddress?key=${key1}`);
//     // console.log(res);
//     return AddArray

// }

export async function SplitAddress(Add) {
    console.log(Add)
    try {
        var myHeaders = new Headers();

        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "address": {
                "regionCode": "US",
                "addressLines": [Add]
            },
            
            "enableUspsCass": true
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        const res = await fetch("https://addressvalidation.googleapis.com/v1:validateAddress?key=AIzaSyBEhZNFF92eTAqWeQ2ZCaITiWeaFrWlf1w", requestOptions);
        if (!res.ok) {
            throw Error(res.statusText);
        }
        const data = await res.json();
        console.log(data?.result);
        const newData = data?.result
        return newData
    }
    catch {
        //   (error) => {
        //     console.log( error);
        //   }
    }
}