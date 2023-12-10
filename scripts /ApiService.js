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
    getTags(){
        return this.get("/tag");
    }
    getGroups(){
        return this.get("/community");
    }
    getMyGroups(){
        return this.get("/community/my");
    }
    createPost(body){
        return this.post("/post", body);
    }
    createPostInGroup(body, id){
        return this.post(`/community/${id}/post`, body);
    }
    searchAddress(objectId, query){
        if(objectId != null && query != null){
            return this.get(`/address/search?parentObjectId=${objectId}&query=${query}`);
        }
        else if(objectId != null || query != null){
            return this.get(`/address/search?${objectId ? `parentObjectId=${objectId}` : ""}${query ? `query=${query}` : ""}`);
        }
        return this.get("/address/search");
    }
}

