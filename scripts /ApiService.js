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
    async delete(url) {
        try {
            const response = await fetch(`${this._baseUrl}${url}`, {
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
    getCommunityInfo(id ){
        return this.get(`/community/${id}`)
    }
    getCommunityPosts(id, tags, sorting, page, size){
        let url = `/community/${id}/post?`;
        if(tags){
            for(let tag of tags){
                url += `tags=${tag[1]}&`;
            }
        }
        if(sorting){
            url += `sorting=${sorting}&`
        }
        url += `page=${page}&size=${size}`
        return this.get(url);
    }
    getGroupRole(id) {
        return this.get(`/community/${id}/role`);
    }
    subscribeToGroup(id){
        return this.post(`/community/${id}/subscribe`)
    }
    unsubscribeToGroup(id){
        return this.delete(`/community/${id}/unsubscribe`)
    }
    getTags(){
        return this.get("/tag");
    }
    likePost(postId){
        return this.post(`/post/${postId}/like`);
    }
    dislikePost(postId){
        return this.delete(`/post/${postId}/like`)
    }

    logout(){
        return this.post("/account/logout")
    }
    
}