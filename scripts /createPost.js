import { ApiService } from "./ApiService.js";
import { getObjectFromInputs, addDropdownTags, changePage } from "./main.js";

let addressGuid;
export function loadCreatePost(){
    addAddress($("#adressForm"), null, null, "");
    fillInDropowns();  
    submitOnClick();
}

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
        if($(this).val() === ""){

            selection.find('option').not(':first-child').remove();
            addAdressElements(addressElement, objectId, null); 
        }
        
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
            addressGuid = $(this).find(':selected').attr('value');
            if($(this).find(':selected').attr('objectLevel') !== "Building"){
               addAddress(addressElement.find("#childElement"), objectId, null);  
            }
            
        }
    });
    
        
}

function submitOnClick(){
    $("#submitBtn").on('click', function(){
        //todo:validate
        let body = getObjectFromInputs();
            delete body.groups;
            if(body.addressId === "" && addressGuid !==""){
                body.addressId = addressGuid;
            }
        if($("#groups").val() === ""){
            
            
            const apiService = new ApiService();
            let result = apiService.createPost(body);
            result.then((data)=> {
                if(data.body){
                    changePage('/')
                }
            })
        }
        else{
            const apiService = new ApiService();
            let result = apiService.createPostInGroup(body, $("#groups").val());
            result.then((data)=> {
                if(data.body){
                    changePage(`/community/${$("#groups").val()}`);
                }
            })
        }
    });
}
