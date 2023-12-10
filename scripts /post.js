import { ApiService } from "./ApiService.js";
import { setOnHeartClick, formatDateTime } from "./main.js";

export async function loadPostPage(postId){
    let user = await getUser();
    loadPost(postId, user ? user: null);
    submintOnClick(postId, user ? user : null);
}

async function loadPost(postId, user) {
    const apiService = new ApiService();
    let result = await apiService.getPost(postId);
    if (result.body) {
        fillInInfo(result.body, user);
    }
}

async function fillInInfo(post, user){
    $("#authorsName").text(`${post.author} `);
    $("#createTime").text(formatDateTime(post.createTime));
    $("#title").text(post.title);
    $("#postDescription").text(post.description);
    if(post.image){
        $("#photo").attr("src", post.image);
    }else{
        $("#photo").addClass("d-none")
    }
    if(post.tags){
        for(let tag of post.tags){
            let newTag = $("#tag").clone().removeAttr("id").text(`#${tag.name} `);
            $("#tags").append(newTag);
        }
    }
    if(post.communityName){
        $("#community").text(`в сообществе "${post.communityName}"`);
    }
    $("#readingTime").text(`Время чтения: ${post.readingTime} мин.`)
    if(post.hasLike){
        $("#heartIcon").addClass("fa-solid")
    }
    if (post.addressId) {
        $("#addressIcon").removeClass("d-none");
        const address = await getAddress(post.addressId); 
        $("#address").text(address);
    }    
    $("#likesCount").text(post.likes);
    $("#commentsCount").text(post.commentsCount);
    loadComments(post.comments, user);
    setOnHeartClick($("#post"), post.id);


}

async function getAddress(adressId) {
    const apiService = new ApiService();
    let result = await apiService.getAddress(adressId); 
    if (result.body) {
        let address = " ";
        for (let i = 0; i < result.body.length - 1; i++) {
            address += result.body[i].text + ", ";
        }
        address += result.body[result.body.length - 1].text;
        console.log(address);
        return address;
    }
}

async function loadComments(comments, user) {
    for (let comment of comments){
        let newComment = $("#comment").clone().attr("id", `${comment.id}`).removeClass("d-none");
        fillInComment(newComment.find("#subcomment"), comment, user);
        setOnShowSubcommentsClick(newComment, comment.id, user);
        $("#comments").append(newComment);
    }
}

function fillInComment(commentCard, comment, user){
    commentCard.find("#content").text(comment.content);
    commentCard.find("#authorName").text(comment.author);
    if(comment.deleteDate){
        commentCard.find("#timeCreated").text(`Удалено ${formatDateTime(comment.deleteDate)}`);
        commentCard.find("#content").text("[Комментарий удален]");
        commentCard.find("#authorName").text("[Комментарий удален]");
    }
    else if(comment.editDate){
        commentCard.find("#timeCreated").text(`Изменено ${formatDateTime(comment.editDate)}`);
    }
    else{
        commentCard.find("#timeCreated").text(formatDateTime(comment.createTime));
    }
    if(comment.subComments === 0){
        commentCard.find("#showSubComments").addClass("d-none");
    }
    setOnAnswerClick(commentCard, comment.id, user);
    checkMyComment(commentCard, comment, user);
}

function setOnAnswerClick(comment, commentId, user){
    comment.find("#answerText").attr("id", `answerText-${commentId}`);
    comment.find(`#answer`).on("click", function(){
        comment.find(`#answerInput`).removeClass("d-none");
        $(this).addClass("d-none");
    });

    comment.find(`#cancelBtn`).on("click", function(){
        comment.find(`#answerInput`).addClass("d-none");
        comment.find(`#answer`).removeClass("d-none");
    });

    comment.find(`#answerBtn`).on("click", function(){
        //todo: validate
        const apiService = new ApiService();
        let result = apiService.postComment(postId, commentId, comment.find(`#answerText-${commentId}`).val());
        result.then((data) =>{
            if(data.error){
                $('#popUp').find("#modalText").text("Для выполнения этого дейcтвия необходимо войти в свой профиль");
                $('#popUp').modal('show');
            }
            else{
                let answeredComment = $(`#${commentId}`);
                answeredComment.find(`#answerInput`).addClass("d-none");
                answeredComment.find(`#answerInput`).val("");
                answeredComment.find(`#answer`).removeClass("d-none");
                let newSubComment = $("#subcomment").clone().attr("id", `${data.body.id}`).removeClass("d-none");
                fillInNewComment(newSubComment,comment.find(`#answerText-${commentId}`).val() , user);
                if (answeredComment.find("#subComments").length > 0){
                    answeredComment.find("#subComments").append(newSubComment);
                    answeredComment.find("#closeSubComments").removeClass("d-none");
                }
                else{
                    answeredComment.after(newSubComment);
                }
            }
        });
    });
}

function loadSubComments(commentCard, subComments, user){
    for(let subComment of subComments){
        let newSubComment = $("#subcomment").clone().attr("id", `${subComment.id}`).removeClass("d-none");
        fillInComment(newSubComment, subComment,user);
        newSubComment.find("#showSubComments").remove();
        commentCard.find("#subComments").append(newSubComment);
    }
}

function setOnShowSubcommentsClick(commentCard, commentId, user){

    commentCard.find("#showSubComments").on("click", function(){
        $(this).addClass("d-none");
        commentCard.find("#closeSubComments").removeClass("d-none");
        const apiService = new ApiService();
        let result =  apiService.getSubcomments(commentId);
        result.then((data)=>{
            if(data.body){
                loadSubComments(commentCard, data.body, user);
            }
        });
    });

    commentCard.find("#closeSubComments").on("click", function(){
        $(this).addClass("d-none");
        commentCard.find("#showSubComments").removeClass("d-none");
        commentCard.find("#subComments").empty();
    });
}

function submintOnClick(postId, user){
    $("#commentSection").find("#submitBtn").on("click", function(){
        //todo: validate
        const apiService = new ApiService();
        let result = apiService.postComment(postId, null, $("#commentText").val());
        result.then((data) =>{
            if(data.error){
                $('#popUp').find("#modalText").text("Для выполнения этого дейcтвия необходимо войти в свой профиль");
                $('#popUp').modal('show');
            }
            else{
                location.reload(true);
            }
        });
    });
}

function checkMyComment(commentCard, comment, user){
    commentCard.find("#editInput").find("#editText").attr("id", `editText-${comment.id}`);
    if (user){
        if(user.id === comment.authorId){
            commentCard.find("#myComment").removeClass("d-none");
            setIconsClick(commentCard, comment);
        }
    }
}

function setIconsClick(commentCard, comment){

    commentCard.find("#editComment").on("click", function(){
        $(this).addClass("d-none");
        commentCard.find("#editInput").removeClass("d-none");
        commentCard.find(`#editText-${comment.id}`).val(commentCard.find("#content").text());
        commentCard.find("#content").addClass("d-none");
        
        setOnEditClick(commentCard, comment.id); 
        
    });
    commentCard.find("#deleteComment").on("click", function(){
        const apiService = new ApiService();
        let result = apiService.deleteComment(comment.id);
        result.then((data) =>{
            if(data.body){
                if(comment.subComments !== 0){
                    commentCard.find("#timeCreated").text(`Удалено ${formatDateTime(new Date())}`);
                    commentCard.find("#content").text("[Комментарий удален]");
                    commentCard.find("#authorName").text("[Комментарий удален]");
                    commentCard.find("#myComment").addClass("d-none");  
                }
                else{
                    commentCard.remove();
                }
                
            }
        });
    });
    
}
function setOnEditClick(commentCard, commentId){

    let editInput = commentCard.find("#editInput");
    commentCard.find("#editInput").find("#editText").attr("id", `editText-${commentId}`);
    editInput.find("#cancelBtn").on("click", function(){
        commentCard.find("#editInput").addClass("d-none");
        commentCard.find("#content").removeClass("d-none");
        commentCard.find("#editComment").removeClass("d-none");
    });
    editInput.find("#editBtn").on("click", function(){
        const apiService = new ApiService();
        let result = apiService.editComment(commentId, editInput.find(`#editText-${commentId}`).val());
        result.then((data) =>{
            if(data.body){
                commentCard.find("#timeCreated").text(`Изменено ${formatDateTime(new Date())}`);
                commentCard.find("#content").text(editInput.find(`#editText-${commentId}`).val())
                commentCard.find("#editInput").addClass("d-none");
                commentCard.find("#content").removeClass("d-none");
                commentCard.find("#editComment").removeClass("d-none");
            }
        });
    });
}
function fillInNewComment(commentCard, text, user){
    commentCard.find("#content").text(text);
    commentCard.find("#authorName").text(user.fullName);
    commentCard.find("#timeCreated").text(formatDateTime(new Date()));
    commentCard.find("#showSubComments").addClass("d-none");
    commentCard.find("#myComment").removeClass("d-none");
    setIconsClick(commentCard, commentCard);
}

async function getUser(){
    const apiService = new ApiService();
    let result = await apiService.getProfileInfo();

    if(result.body){
        return result.body;
    }
    else{
        return null;
    }
}