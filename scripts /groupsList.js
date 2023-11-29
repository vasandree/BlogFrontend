import { ApiService } from "./ApiService.js";

const apiService = new ApiService();
const token = 
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIwZWRkZjU4MC0yYTBkLTQ2ZDAtMDk0NS0wOGRiZWIwMTdkMTkiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9hdXRoZW50aWNhdGlvbiI6IjE1OTNmNzVhLTU4MTAtNDZkNy04ODQ2LTExNDIxOTg5ZjUyOSIsIm5iZiI6MTcwMTI2NzE1MCwiZXhwIjoxNzAxMjcwNzUwLCJpYXQiOjE3MDEyNjcxNTAsImlzcyI6IkJsb2cuQVBJIiwiYXVkIjoiQmxvZy5BUEkifQ.gZIWfqKmNx4lrCBF3R2s_vtCsi3GWQ3w7zXsCZ2AOC0";
localStorage.setItem("token", token);
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
                card.find("#subscribeBtn").addClass("d-none");
                break;
            case null:
                card.find("#unsubscribeBtn").addClass("d-none");
                break;
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

function addButtonClick(groupCard, id) {
    groupCard.find("#subscribeBtn").click(function (event) {
        apiService.subscribeToGroup(id);
        loadGroupList();
    });

    groupCard.find("#unsubscribeBtn").click(function (event) {
        apiService.unsubscribeToGroup(id);
        loadGroupList();
    });
}