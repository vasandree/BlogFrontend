export class ApiService{
    _baseUrl = "https://blog.kreosoft.space/api"

    async get(url) {
        try {
            const response = await fetch(`${this._baseUrl}${url}`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            });
    
            let data = {};
    
            if (!response.ok) {
                data.error = response.statusText;
            } else {
                data.body = await response.json();
            }
            console.log(data.body);
            return (data);
        } 
        catch(error) {
            console.log(error);
        } 
    }

    async post(url, body) {
        try {

            if(body === null ){
                const response = await fetch(`${this._baseUrl}${url}`, {
                    method: 'POST',
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    },
                });
            }
            else{
                const response = await fetch(`${this._baseUrl}${url}`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify(body)
                });
            }
            let data = {};
    
            if (!response.ok) {
                data.error = response;
            } else {
                data.body = response;
            }
            
            return (data);
        } 
        catch(error) {
            console.log(error);
        } 
    }

    async put(url, body) {
        try {
            const response = await fetch(`${this._baseUrl}${url}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(body)
            });
            
            let data = {};
    
            if (!response.ok) {
                data.error = response;
            } else {
                data.body = response;
            }
            
            return (data);
        } 
        catch(error) {
            console.log(error);
        } 
    }
    getAuthors(){
        return this.get("/author/list");
    }
}