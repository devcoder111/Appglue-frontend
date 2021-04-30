const API_URL = 'http://localhost:3000'

const apiRequest = async ({ path, params, method}) => {
    const fetchOptions = {
        method: method || 'GET',
        headers: {
            'Content-Type' : 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    }

    if(fetchOptions.method !== 'GET') {
        fetchOptions.body = JSON.stringify(params || {})
    }

    return new Promise((resolve) => {
        try {
            fetch(`${API_URL}/${path}`, fetchOptions)
                .then(response => response.json())
                .then((data) => {
                    console.log('SERVER RESPONSE >>> ', data)
                    resolve(data)
                })
        }
        catch(error) {
            console.error(error)
            throw error
        }
    })
}

export default apiRequest