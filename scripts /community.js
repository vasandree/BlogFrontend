import { ApiService } from "./ApiService.js";

const communityId = "21db62c6-a964-45c1-17e0-08dbea521a96";
let chosenTags = new Map();
const maleAvatar = "/images /male_avatar.jpg";
const femaleAvatar ="/images /female_avatar.jpg";
let isClosed;
const token = 
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIwZWRkZjU4MC0yYTBkLTQ2ZDAtMDk0NS0wOGRiZWIwMTdkMTkiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9hdXRoZW50aWNhdGlvbiI6IjhjMGUzNmJkLTQ0NTgtNDJiMC1hZDlhLWQ1MGM0MGE4OWI1NiIsIm5iZiI6MTcwMTg3NDk4MiwiZXhwIjoxNzAxODc4NTgyLCJpYXQiOjE3MDE4NzQ5ODIsImlzcyI6IkJsb2cuQVBJIiwiYXVkIjoiQmxvZy5BUEkifQ.l1y58f6YDiYre1vFuEBW00yXzSt_F_SjIkaVbxldC0M";
localStorage.setItem("token", token);

$(document).ready(function() {

  loadCommunityInfo(communityId);
  setFilters();
  loadPosts(1, 5, chosenTags, null);

});
function loadCommunityInfo(communityId){
    const apiService = new ApiService();
    let result = apiService.getCommunityInfo(communityId);
    result.then((data) => {
      if(data.body){
        fillIinCimmunityInfo(data.body);
      }
    });
}

function setFilters(){
  const apiService = new ApiService();
  let result = apiService.getTags();
  result.then((data)=>{
      if(data.body){
          setTags(data.body, $("#tagDropdown"));
      }
  });
  addPostsPerPageChange();
  addDropdownTags(chosenTags);
  submitOnClick($("#filters"), chosenTags);
}
function setTags(tags, dropdown){
  for(let tag of tags){
      dropdown.append($("<option>", {
          value: tag.id,
          text: tag.name
      }));
  }
}
function submitOnClick(filters, chosenTags){
  filters.find("#submitBtn").click(function(event){
      loadPosts(1, $("#postsPerPage").val(),chosenTags, $("#sortingDropdown").val());
  });
} 

function loadPosts(currentPage, postsPerPage, tags, sorting){

  const apiService = new ApiService();
  let result = apiService.getCommunityPosts(communityId, tags, sorting, currentPage, postsPerPage);
  result.then((data) =>{
  if (data.body){
    $("#posts").empty();
    console.log(data.body);
    addPosts($("#posts"), data.body.posts, $("#post"));
    addPagination(currentPage, data.body.pagination.count);
  }
  else{
    $('#popUp').find("#modalText").text("Вы не можете видеть посты закрытого сообщества");
    $('#popUp').modal('show');
  }})
  
}

function addPosts(container, posts, card){
  for(let post of posts){
      let postCard = createPostCard(post, card);
      container.append(postCard);
  }
}

function createPostCard(post, card){
  let postCard = card.clone();
  postCard.attr("id",`${post.id}` ).removeClass("d-none");
  if (post.title){
      postCard.find("#title").text(post.title);
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

function addDropdownTags(chosenTags){
  $('#tagDropdown').select2({
      width: '100%', 
      placeholder: 'Выберете тэги', 
    });

    $('#tagDropdown').on('select2:select', function (e) {
      var selectedTag = e.params.data;
      chosenTags.set(selectedTag.text, selectedTag.id);
    });

    $('#tagDropdown').on('select2:unselect', function (e) {
      var deselectedTag = e.params.data;
      chosenTags.delete(deselectedTag.text);
  });
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

function formatDateTime(dateString) {

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

function getPageNumbers(total, max, current) {
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

function addPagination(currentPage, pageCount) {
  let pagination = $(".pagination").empty();
  let pageNumbers = getPageNumbers(pageCount, 5, currentPage);

  pagination.append(`
      <li class="page-item direction-item">
          <a class="page-link" tabindex="-1" aria-disabled="true" data-link><i class="fa-solid fa-angle-left"></i></a>
      </li>
  `);

  for (let number of pageNumbers) {
      pagination.append(`
          <li class="page-item num-item"><a class="page-link ${number === currentPage ? "active" : ""}" data-link>${number}</a></li>
      `);
  }

  pagination.append(`
      <li class="page-item direction-item">
          <a class="page-link" data-link><i class="fa-solid fa-angle-right"></i></a>
      </li>
  `);
  setOnPaginationClick(pagination, currentPage);
}

function setOnPaginationClick(pagination, currentPage) {
  pagination.find('.num-item a').on('click', function () {
      const pageNumber = parseInt($(this).text());
      loadPosts(pageNumber, $("#postsPerPage").val(), chosenTags, $("#sortingDropdown").val() );

      $('html, body').animate({ scrollTop: 0 }, 'slow');
  });

  pagination.find('.direction-item:first-child a').on('click', function () {
      const prevPage = Math.max(currentPage - 1, 1);
      loadPosts(prevPage, $("#postsPerPage").val(), chosenTags, $("#sortingDropdown").val());

      $('html, body').animate({ scrollTop: 0 }, 'slow');
  });

  pagination.find('.direction-item:last-child a').on('click', function () {
      const nextPage = Math.min(currentPage + 1, pageCount);
      loadPosts(nextPage, $("#postsPerPage").val(), chosenTags, $("#sortingDropdown").val());

      $('html, body').animate({ scrollTop: 0 }, 'slow');
  });
}


function addPostsPerPageChange(){
  $("#postsPerPage").on("change", function() {
      loadPosts(1, $("#postsPerPage").val(), chosenTags, $("#sortingDropdown").val());
  });
}

function setOnHeartClick(postCard, postId){
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


function fillIinCimmunityInfo(community){
  $('#communityName').text(community.name);
  $('#communityDescription').text(community.description);
  $("#subscribers").text(community.subscribersCount);
  $("#communityDescription").text(community.description);
  isClosed = community.isClosed;
  if(community.isClosed){
    $("#communityType").text("Тип сообщества: закрытое");
  }
  else{
    $("#communityType").text("Тип сообщества: открытое");
  }
  setAdmins(community.administrators);
  setButtons();
}
function setAdmins(admins){
  for(let admin of admins){
    let newAdmin = $("#adminListItem").clone().removeClass("d-none").removeAttr("id");
    newAdmin.find("#adminName").text(admin.fullName);
    newAdmin.find("#avatar").attr("src", admin.gender === "Male" ? maleAvatar : femaleAvatar);
    $("#adminsList").append(newAdmin);
  }
}
function setButtons(){
  const apiService = new ApiService();
  let result = apiService.getGroupRole(communityId);
  result.then((data)=>{
    if(data.body){
      switch(data.body){
        case "Administrator":
          $("#communityNewPostBtn").removeClass("d-none");
          break;
        case "Subscriber":
          $("#unsubscribeBtn").removeClass("d-none");
          break;
        case "":
          $("#subscribeBtn").removeClass("d-none");
          break;
      }
    }
    else{
      $("#subscribeBtn").removeClass("d-none");
    }
  })
  setButtonsClick();
}

function setButtonsClick(){
  $("#subscribeBtn").on("click", function(){
    const apiService = new ApiService();
    let result = apiService.subscribeToGroup(communityId);
    result.then((data)=>{
      if(data.body){
        if(isClosed){
          location.reload();
        }
        else{
          $("#subscribeBtn").addClass("d-none");
          $("#unsubscribeBtn").removeClass("d-none");
          let newSubscribers = parseInt($("#subscribers").text(), 10) + 1;
          console.log(newSubscribers);
          $("#subscribers").text(newSubscribers); 
        }
      }
      else{
        $('#popUp').find("#modalText").text("Для выполнения этого дейcтвия необходимо войти в свой профиль");
        $('#popUp').modal('show');
      }
    })
  });
  $("#unsubscribeBtn").on("click", function(){
    const apiService = new ApiService();
    let result = apiService.unsubscribeToGroup(communityId);
    result.then((data)=>{
      if(data.body){
        if(isClosed){
          location.reload();
        }
        else{
          $("#unsubscribeBtn").addClass("d-none");
          $("#subscribeBtn").removeClass("d-none");
          let newSubscribers = parseInt($("#subscribers").text(), 10) - 1;
          console.log(newSubscribers);
          $("#subscribers").text(newSubscribers); 
        }
      }
    })
  });
}