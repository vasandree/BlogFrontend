import { ApiService } from "./ApiService.js";



export async function loadGroupList() {
    try {
        const apiService = new ApiService();
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
    groupCard.attr("href", `/community/${group.id}`)
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
        const apiService = new ApiService();
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
        const apiService = new ApiService();
        let result = apiService.subscribeToGroup(id);
        result.then((data)=>{
            if(data.body){
                loadGroupList();
            }
            else{
                 $('#popUp').find("#modalText").text("Для выполнения этого дейcтвия необходимо войти в свой профиль");
                 $('#popUp').modal('show');
            }
        });
        
    });

    groupCard.find("#unsubscribeBtn").click(function (event) {
        const apiService = new ApiService();
        apiService.unsubscribeToGroup(id);
        loadGroupList();
    });
}