import { ApiService } from "./ApiService.js";

export function getObjectFromInputs() {
    let inputs = $(".form-control");
    let objectData = {};

    for (let input of inputs) {
        if ($(input).hasClass("error")) {
            return null;
        }
        let key = $(input).attr("id");
        let value = $(input).val()
        if (key === "birthDate" && value === "") {
            objectData[key] = null;
        }
        else if(key === "phoneNumber" && value === "+7(___)___-__-__"){
            objectData[key] = null;
        }
        else if(key === "image" && value === ""){
            objectData[key] = null;
        }
        else{
            objectData[key] = value;
        }
    }
    
    let selects = $(".form-select");
    for (let select of selects) {
        let key = $(select).attr("id");
        let value = $(select).val();
        if(value === ""){
            objectData[key] = null;
        }
        objectData[key] = value;
    }
    return objectData;
}

export function addPhoneMask(form){
    if(form.length){
        var element = $('#phoneNumber');
        var maskOptions = {
            mask: '+7(000)000-00-00',
            lazy: false
        };
        var mask = new IMask(element[0], maskOptions);
        mask.updateValue()
    }
}

export function setOnHeartClick(postCard, postId){
    const apiService = new ApiService();
    postCard.find("#heartIcon").on("click", function(){
        if($(this).hasClass('fa-solid')){
            $(this).removeClass('fa-solid');
            apiService.dislikePost(postId);
            let newLikes = parseInt(postCard.find("#likesCount").text(), 10) - 1;
            postCard.find("#likesCount").text(newLikes); 
        }
        else{
          let result = apiService.likePost(postId);
          result.then((data)=>{
              if(data.error){   
                $('#popUp').find("#modalText").text("Для выполнения этого дейcтвия необходимо войти в свой профиль");
                $('#popUp').modal('show');
              }
              else{
                $(this).addClass('fa-solid');
                let newLikes = parseInt(postCard.find("#likesCount").text(), 10) + 1;
                postCard.find("#likesCount").text(newLikes); 
              }
          })
        }
    });
}

export function createPostCard(post, card){
    let postCard = card.clone();
    postCard.attr("id",`${post.id}` ).removeClass("d-none");
    if (post.title){
        postCard.find("#title").text(post.title);
        postCard.find("#title").attr('href',`/post/${post.id}`);
    }
    if(post.image){
        postCard.find("#photo").attr("src", post.image);
    }else{
        postCard.find("#photo").addClass("d-none")
    }
    if(post.author){
        postCard.find("#authorsName").text(post.author);
    }
    if (post.createTime) {
        postCard.find("#createTime").text(` - ${formatDateTime(post.createTime)}`);
    }
    if(post.description){
        postCard.find('#postDescription').attr('id', `description-${post.id}`);
        postCard.find("#readMoreLink").attr('id', `readMoreLink-${post.id}`)
        setDescription(postCard, post.id, post.description);
    }
    if(post.tags){
        for(let tag of post.tags){
            let newTag = postCard.find("#tag").clone().removeAttr("id").text(`#${tag.name} `);
            postCard.find("#tags").append(newTag);
        }
    }
    if(post.readingTime){
        postCard.find("#readingTime").text(`Время чтения: ${post.readingTime} мин.`)
    }
    if(post.communityName){
        postCard.find("#community").text(`в сообществе "${post.communityName}"`);
    }
    if(post.hasLike){
        postCard.find("#heartIcon").addClass("fa-solid")
    }
    setOnHeartClick(postCard, post.id);
    postCard.find("#likesCount").text(post.likes);
    postCard.find("#commentsCount").text(post.commentsCount);
    return postCard;
}

function setDescription(postCard, postId, postDescription){
    postCard.find(`#description-${postId}`).text(postDescription.substring(0, 200));
  
    if (postDescription.length > 200) {
        postCard.find(`#readMoreLink-${postId}`).removeClass('d-none');
    }
    postCard.find(`#readMoreLink-${postId}`).on('click', function() {
        postCard.find(`#description-${postId}`).text(postDescription); 
        postCard.find(`#readMoreLink-${postId}`).addClass('d-none'); 
    });
}

export function formatDateTime(dateString) {

    const originalDate = new Date(dateString);
  
    const formattedDateTime = originalDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }) + ' ' + originalDate.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  
    return formattedDateTime;
}
  
export function getPageNumbers(total, max, current) {
    const half = Math.floor(max / 2);
    let to = max;
  
    if (current + half >= total) {
        to = total;
    } else if (current > half) {
        to = current + half;
    }
  
    let from = Math.max(to - max, 0);
  
    return Array.from({ length: Math.min(total, max) }, (_, i) => i + 1 + from);
}
  
export function addDropdownTags(){
    $('#tags').select2({
        width: '100%', 
        placeholder: 'Выберете тэги', 
    });
}

export function getTags(){
    let tags = {};
    let key = $("#tags").attr("id");
    let value = $("#tags").val();
    if(value === ""){
        objectData[key] = null;
    }
    tags[key] = value;
    return tags.tags;
}

export function changePage(to) {
    history.pushState(null, null, to);
    location.reload();
}