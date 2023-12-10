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
            return (data);
        } 
        catch(error) {
            console.log(error);
        } 
    }

    async post(url, body) {
        try {
            let response;
            if(body === null ){
                response = await fetch(`${this._baseUrl}${url}`, {
                    method: 'POST',
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    },
                });
            }
            else{
                response = await fetch(`${this._baseUrl}${url}`, {
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
                console.log(data.error);
            } else {
                data.body = response;
                console.log(data.body);
            }
            
            return (data);
        } 
        catch(error) {
            console.log(error);
        } 
    }

    async put(url, body) {
        try {
            const response = await fetch("https://blog.kreosoft.space/api/account/register", {
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

    async delete(url){
        try {
            const response = await fetch(`${this._urlBase}${url}`, {
                method: 'DELETE',
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
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


    async register(body){
        let response = await this.post('/account/register', body);
        if (response.body){
            response.body = await response.body.json();
        }
        else if(response.error){
            response.error = await response.error.json();
        }
        return response;
    }

    async login (body){
        let response = await this.post('/account/login', body);
        if (response.body){
            response.body = await response.body.json();
        }
        else if(response.error){
            response.error = await response.error.json();
        }
        return response;
    }


    getGroups(){
        return this.get("/community");
    }
    async getGroupRole(id) {
        try {
            const response = await this.get(`/community/${id}/role`);
    
            if (response.error) {
                return { error: response.error };
            } else {
                return { body: response.body };
            }
        } catch (error) {
            console.error(error);
            throw error;  // Re-throw the error to propagate it
        }
    }
    subscribeToGroup(id){
        return this.post(`/community/${id}/subscribe`)
    }
    unsubscribeToGroup(id){
        return this.delete(`/community/${id}/unsubscribe`)
    }

    
    getProfileInfo(){
        return this.get("/account/profile");
    }

    editProfile(body){
        return this.put("/account/profile", body);
    }
}


