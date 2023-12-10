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
    
    getAuthors(){
        return this.get("/author/list");
    }
    

    getPost(postId){
        return this.get(`/post/${postId}`);
    }
    getAddress(id){
        return this.get(`/address/chain?objectGuid=${id}`);
    }
    likePost(postId){
        return this.post(`/post/${postId}/like`);
    }
    dislikePost(postId){
        return this.delete(`/post/${postId}/like`)
    }
    postComment(postId, parentId, text){
        return this.post(`/post/${postId}/comment`, {
            content: text,
            parentId: parentId
          });
    }
    getSubcomments(commentId){
        return this.get(`/comment/${commentId}/tree`);
    }
    getProfileInfo(){
        return this.get("/account/profile");
    }
    deleteComment(commentId){
        return this.delete(`/comment/${commentId}`);
    }
    editComment(commentId, text){
        return this.put(`/comment/${commentId}`, {content: text});
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