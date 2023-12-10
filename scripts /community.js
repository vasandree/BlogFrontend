import { ApiService } from "./ApiService.js";
import { createPostCard, getPageNumbers, addDropdownTags, getTags } from "./main.js";
const communityId ="c5639aab-3a25-4efc-17e1-08dbea521a96";
const maleAvatar = "/images /male_avatar.jpg";
const femaleAvatar ="/images /female_avatar.jpg";

$(document).ready(function() {

  loadCommunityInfo(communityId);
  setFilters();
  loadPosts(1, 5, null, null);

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
          setTags(data.body, $("#tags"));
      }
  });
  addPostsPerPageChange();
  addDropdownTags();
  submitOnClick($("#filters"), );
}
function setTags(tags, dropdown){
  for(let tag of tags){
      dropdown.append($("<option>", {
          value: tag.id,
          text: tag.name
      }));
  }
}
function submitOnClick(filters){
  filters.find("#submitBtn").click(function(event){
      loadPosts(1, $("#postsPerPage").val(),getTags(), $("#sortingDropdown").val());
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

export function addPagination(currentPage, pageCount) {
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
      loadPosts(pageNumber, $("#postsPerPage").val(), getTags(), $("#sortingDropdown").val() );

      $('html, body').animate({ scrollTop: 0 }, 'slow');
  });

  pagination.find('.direction-item:first-child a').on('click', function () {
      const prevPage = Math.max(currentPage - 1, 1);
      loadPosts(prevPage, $("#postsPerPage").val(), getTags(), $("#sortingDropdown").val());

      $('html, body').animate({ scrollTop: 0 }, 'slow');
  });

  pagination.find('.direction-item:last-child a').on('click', function () {
      const nextPage = Math.min(currentPage + 1, pageCount);
      loadPosts(nextPage, $("#postsPerPage").val(), getTags(), $("#sortingDropdown").val());

      $('html, body').animate({ scrollTop: 0 }, 'slow');
  });
}


function addPostsPerPageChange(){
  $("#postsPerPage").on("change", function() {
      loadPosts(1, $("#postsPerPage").val(), getTags(), $("#sortingDropdown").val());
  });
}


function fillIinCimmunityInfo(community){
  $('#communityName').text(community.name);
  $('#communityDescription').text(community.description);
  $("#subscribers").text(community.subscribersCount);
  $("#communityDescription").text(community.description);
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