let provider = false
const result = document.querySelector('#result')

if (ethereum) {
    provider = new ethers.providers.Web3Provider(ethereum);
}

async function checkEthscription(data) {
    const hash = CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex)
    const url = `https://api.ethscriptions.com/api/ethscriptions/exists/${hash}`

    const response = await fetch(url)
    const resp = await response.json()

    return resp
}

function hex2a(hex) {
    var str = '';
    for (var i = 0; i < hex.length; i += 2) str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}

async function get_ethscription(ethscription_id) {
    return provider.getTransaction(ethscription_id)
}

const handle_click = async e => {
    e.preventDefault()

    let value = document.querySelector('#ethsid').value

    if(value !== '') {
        try {
            let eths = await get_ethscription(value)
            let data = JSON.parse(JSON.stringify(hex2a(eths.data)).replace(/\\u0000/g,''))
            let duplicate_data = await checkEthscription(data)

            let { transaction_hash, ethscription_number } = duplicate_data.ethscription

            if(value !== transaction_hash) {
                // this is a duplicate, already existed

                result.innerHTML = `Unfortunately there's an earlier ethscription (with number ${ethscription_number}) that matches this one. You can view it here: <a href="https://ordex.ai/ethscription/${transaction_hash}" target="_blank" rel="noopener noreferrer">https://ordex.ai/ethscription/${transaction_hash}</a>`
            } else {
                // this is the first occurence of this ethscription

                result.innerHTML = `Hoorah!!! this is the first occurence of this ethscription! 🎉`
            }
        } catch(e) {
            result.innerHTML = `Something went wrong, try again or with another ethscription id..`
        }
    } else {
        result.innerHTML = `Please fill in an ethscription id`
    }
}

document.querySelector('#btn-check').addEventListener('touchend', handle_click)
document.querySelector('#btn-check').addEventListener('click', handle_click)