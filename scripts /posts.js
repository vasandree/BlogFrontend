import { ApiService } from "./ApiService.js";
import { createPostCard, getPageNumbers,addDropdownTags, getTags, changePage} from "./main.js";


export  function loadMainPage(params){
    console.log(params);
    setAddPostButton();
    setFilters();
    loadPosts(params.page ? params.page:1, params.size ? params.size : 5, params.tags, 
        params.sorting, params.min, params.max, params.name, params.onlyMyCommunities);
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
    submitOnClick($("#filters") );
}



function submitOnClick(filters, ){
    filters.find("#submitBtn").click(function(event){
        loadMainPage({
            page:1,
            size: $("#postsPerPage").val(),
            tags: getTags(),
            sorting: $("#sortingDropdown").val(),
            min:  $("#readingTimeFrom").val(),
            max: $("#readingTimeTo").val(),
            name: $("#name").val(),
            onlyMyCommunities: $('#onlyMyCommunities').prop('checked'),
        })
    });
} 
function setTags(tags, dropdown){
    for(let tag of tags){
        dropdown.append($("<option>", {
            value: tag.id,
            text: tag.name
        }));
    }
}

function loadPosts(currentPage, postsPerPage, tags, sorting, minTime, maxTime, author, onlyMyCommunities){
    try{
        const apiService = new ApiService();
        let result = apiService.getPosts(tags, author, minTime, maxTime, sorting, onlyMyCommunities, currentPage, postsPerPage);
        result.then((data) =>{
            if (data.body){
                $("#posts").empty();
                console.log(data.body);
                addPosts($("#posts"), data.body.posts, $("#post"));
                addPagination(currentPage, data.body.pagination.count);
            }
        })
    }
    catch(error){
        console.log(error);
    }

}

function addPosts(container, posts, card){
    for(let post of posts){
        let postCard = createPostCard(post, card);
        container.append(postCard);
    }
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
        loadPosts(pageNumber, $("#postsPerPage").val(), getTags(), $("#sortingDropdown").val(), $("#readingTimeFrom").val(),
            $("#readingTimeTo").val(), $("#name").val(), $('#onlyMyCommunities').prop('checked'));

        $('html, body').animate({ scrollTop: 0 }, 'slow');
    });

    pagination.find('.direction-item:first-child a').on('click', function () {
        const prevPage = Math.max(currentPage - 1, 1);
        loadPosts(prevPage, $("#postsPerPage").val(), getTags(), $("#sortingDropdown").val(), $("#readingTimeFrom").val(),
            $("#readingTimeTo").val(), $("#name").val(), $('#onlyMyCommunities').prop('checked'));

        $('html, body').animate({ scrollTop: 0 }, 'slow');
    });

    pagination.find('.direction-item:last-child a').on('click', function () {
        const nextPage = Math.min(currentPage + 1, pageCount);
        loadPosts(nextPage, $("#postsPerPage").val(), getTags(), $("#sortingDropdown").val(), $("#readingTimeFrom").val(),
            $("#readingTimeTo").val(), $("#name").val(), $('#onlyMyCommunities').prop('checked'));

        $('html, body').animate({ scrollTop: 0 }, 'slow');
    });
}


function addPostsPerPageChange(){
    $("#postsPerPage").on("change", function() {
        loadPosts(1, $("#postsPerPage").val(), getTags(), $("#sortingDropdown").val(), $("#readingTimeFrom").val(),
            $("#readingTimeTo").val(), $("#name").val(), $('#onlyMyCommunities').prop('checked'));
    });
}

function setAddPostButton(){
    const apiService = new ApiService();
    let result = apiService.getProfileInfo();
    result.then((data)=>{
        if(data.body){
            $("#addPostButton").removeClass("d-none");
        }
    });
}
