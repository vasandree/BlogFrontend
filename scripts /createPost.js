import { ApiService } from "./ApiService.js";
import { getObjectFromInputs, addDropdownTags } from "./main.js";

const token =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiI1NDVjYmI2MS1lYzdlLTQ1MjAtNDIwZC0wOGRiZWE1MjFhNWYiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9hdXRoZW50aWNhdGlvbiI6IjJkY2Y5ODM0LTViMDgtNGM1Ni1iZGU4LTc1NWE3ZWEyYWI4MCIsIm5iZiI6MTcwMjEzODkwNiwiZXhwIjoxNzAyMTQyNTA2LCJpYXQiOjE3MDIxMzg5MDYsImlzcyI6IkJsb2cuQVBJIiwiYXVkIjoiQmxvZy5BUEkifQ.fX5tpgPp5VGzF-ch3_whaRH4_ciVi7aeRk5Pa9y7XNI";
localStorage.setItem("token", token);


$(document).ready(function() {
    addAddress($("#adressForm"), null, null, "");
    fillInDropowns();  
    submitOnClick();
});

function fillInDropowns(){
    
    setTags();
    setGroups();
}

function setGroups(){
    const apiService = new ApiService();
    let result = apiService.getMyGroups();
    result.then((data)=>{
        if(data.body){
            if (data.body) {
                let myGroups = data.body;
                
                let allGroups =  apiService.getGroups();
                allGroups.then((data)=>{
                    if(data.body){
                        let groups = data.body;
                        const communityIdRole = myGroups.map(item1 => {
                            const correspondingItem = groups.find(item2 => item2 && item2.id === item1.communityId);
                            return { ...item1, ...correspondingItem };
                        }); 
                        for(let community of communityIdRole){
                            if(community.role === "Administrator"){
                                $("#groups").append($("<option>", {
                                    value: community.id,
                                    text: community.name
                                }));
                            }
                        }
                    }
                });
            }
        }
    });
}

function setTags(){
    const apiService = new ApiService();
    let result = apiService.getTags();
    result.then((data)=>{
        if(data.body){
            for(let tag of data.body){
                $("#tags").append($("<option>", {
                    value: tag.id,
                    text: tag.name
                }));
            }
        }
    });
    addDropdownTags();
}



function addAddress(container, objectId, query){

    let newAddressElement = $("#addressTemplate").clone().removeClass("d-none");
    newAddressElement.find('#addressId').select2({
        width: '100%' 
    });
    addAdressElements(newAddressElement, objectId, query, container);
    setOnChange(newAddressElement, objectId);
    container.append(newAddressElement)
}

function addAdressElements(addressElement, objectId, query){
    const apiService = new ApiService();
    let result = apiService.searchAddress(objectId, query);
    result.then((data)=>{
        if(data.body.length > 0){
            
            for(let address of data.body){
                addressElement.find("#addressId");
                addressElement.find("#addressId").append($("<option>", {
                    value: address.objectGuid,
                    objId: address.objectId,
                    text: address.text,
                    objectLevelText: address.objectLevelText,
                    objectLevel: address.objectLevel
                }));
            }
            
        }
    });
}

function setOnChange(addressElement, objectId){
    let selection = addressElement.find('#addressId');

    selection.on('select2:open', function (e) {
        e.preventDefault();
        $('.select2-search__field').on('input', function (e) {
            console.log('Input Text:', e.target.value);
    
            selection.find('option').not(':first-child').remove();
    
            addAdressElements(addressElement, objectId, e.target.value);
        });
    });
    
    selection.on('select2:close', function (e) {
        selection.find('option').not(':first-child').remove();
        addAdressElements(addressElement, objectId, null);
    });
    
    selection.on('change', function (e) {
        var selectedValue = $(this).val();
    
        if (selectedValue === "") {
            addressElement.find("#childElement").empty();
        } else {

            addressElement.find("#childElement").empty();
            var objectId = $(this).find(':selected').attr('objid');
            var objectLevelText = $(this).find(':selected').attr('objectLevelText');
            addressElement.find("#objectLevelText").text(objectLevelText);
            if($(this).find(':selected').attr('objectLevel') !== "Building"){
               addAddress(addressElement.find("#childElement"), objectId, null);  
            }
            
        }
    });
    
        
}

function submitOnClick(){
    $("#submitBtn").on('click', function(){
        //todo:validate
        if($("#groups").val() === ""){
            
            let body = getObjectFromInputs();
            delete body.groups;

            const apiService = new ApiService();
            let result = apiService.createPost(body);
            result.then((data)=> {
                if(data.body){
                    //на главную 
                }
            })
        }
        else{
            let body = getObjectFromInputs();
            delete body.groups;

            const apiService = new ApiService();
            let result = apiService.createPostInGroup(body, $("#groups").val());
            result.then((data)=> {
                if(data.body){
                    //в сообщество
                }
            })
        }
    });
}
