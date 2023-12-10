import { ApiService } from "./ApiService.js";

const apiService = new ApiService();

$(document).ready(function(){

    loadGroupList();

});

async function loadGroupList() {
    try {
        let data = await apiService.getGroups();

        if (data.body) {
            $("#list").empty();
            addGroupItem($("#list"), data.body, $("#list-group-item"));
        }
    } catch (error) {
        console.error(error);
    }
}


async function addGroupItem(container, groups, listItem) {

    const groupItems = await Promise.all(groups.map(async (group) => {
        const groupItem = await createGroupCard(group, listItem);
        return groupItem;
    }));

    container.append(groupItems);
}

async function createGroupCard(group, listItem) {

    let groupCard = listItem.clone();
    
    groupCard.removeAttr("id").removeClass("d-none");
    groupCard.find("#groupName").text(group.name);
    try {
        await checkRole(group.id, groupCard);
    } catch (error) {
        console.error(error);
    }
    addButtonClick(groupCard, group.id);
    return groupCard;
}


async function checkRole(id, card) {
    try {
        const data = await apiService.getGroupRole(id);

        switch (data.body) {
            case "Administrator":
                break;
            case "Subscriber":
                card.find("#unsubscribeBtn").removeClass("d-none");
                break;
            default:
                card.find("#subscribeBtn").removeClass("d-none");
                break;
        }
        
    } catch (error) {
        console.error(error);
        throw error;
    }
}

function addButtonClick(groupCard, id) {
    groupCard.find("#subscribeBtn").click(function (event) {
        let result = apiService.subscribeToGroup(id);
        result.then((data)=>{
            if(data.body){
                loadGroupList();
            }
            else{
                // $('#popUp').find("#modalText").text("Для выполнения этого дейcтвия необходимо войти в свой профиль");
                // $('#popUp').modal('show');
            }
        });
        
    });

    groupCard.find("#unsubscribeBtn").click(function (event) {
        apiService.unsubscribeToGroup(id);
        loadGroupList();
    });
}