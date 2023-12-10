import { ApiService } from "./ApiService.js";

const apiService = new ApiService();

const maleAvatar = "/images /male_avatar.jpg";
const femaleAvatar ="/images /female_avatar.jpg";



export async function loadAuthors(){
    try{
        let data = await apiService.getAuthors();

        if (data.body){
            $("#list").empty();
            addAuhthors($("#list"), data.body, $("#list-item"));
        }
    }
    catch (error) {
        console.error(error);
    }
}



function addAuhthors(container, authors, listItem){
    const authorsCopy = authors.slice(); 
    const topAuthors = getTopAuthors(authorsCopy);
    console.log(topAuthors);
    for(let author in authors){
        let authorCard = createAuthorCard(authors[author], listItem);
        if (topAuthors.includes(authors[author])) {    
           addCrown(authors[author], authorCard, topAuthors);
        }
        container.append(authorCard);
    }
}

function createAuthorCard(author, listItem){
    let authorCard = listItem.clone();
    authorCard.removeAttr("id").removeClass("d-none");
    authorCard.find("#name").text(author.fullName);
    authorCard.find("#created").text(`Cоздан ${new Date(author.created).toLocaleDateString()}`);
    authorCard.find("#birthDate").text(`Дата рождения ${new Date(author.birthDate).toLocaleDateString()}`);
    authorCard.find("#posts").text(`Постов: ${author.posts}`);
    authorCard.find("#likes").text(`Лайков: ${author.likes}`);
    authorCard.find("#avatar").attr("src", author.gender === "Male" ? maleAvatar : femaleAvatar);
    return authorCard;
}
function getTopAuthors(topAuthors) {

    return topAuthors.sort((a, b) => {
        if (a.posts !== b.posts) {
            return b.posts - a.posts;
        } else {
            return b.likes - a.likes;
        }
    }).slice(0, 3);
}

function addCrown(author, authorCard, topAuthors){
    authorCard.find("#crown").removeClass("d-none");
    const position = topAuthors.findIndex(topAuthor => topAuthor === author);
    console.log(position);
    switch(position){
        case 0:
            authorCard.find("#crown").addClass("first-place");
            break
        case 1:
            authorCard.find("#crown").addClass("second-place");
            break
        case 2:
            authorCard.find("#crown").addClass("third-place");
            break
    }
}