import { ApiService } from "./ApiService.js";
import { getObjectFromInputs, addPhoneMask } from "./main.js";
import { formValidation } from "./validation.js";

let currentInfo;

export   function loadProfile(){
    loadInfo($("#profile"));
    addPhoneMask($("#profile"));
    
}

    function fillInInfo(data){
        let profileInfo = $("#profile");
        profileInfo.attr("data-id", data.id);
        profileInfo.find("#fullName").val(data.fullName);
        profileInfo.find("#email").val(data.email);
        profileInfo.find("#phoneNumber").val(data.phoneNumber);
        profileInfo.find("#gender").val(data.gender);
        profileInfo.find("#birthDate").val(new Date(data.birthDate).toLocaleDateString().split('.').reverse().join('-'));
    }
    
    function disableForm(form){

        form.find("#fullName").attr("readonly", "readonly");
        form.find("#email").attr("readonly", "readonly");
        form.find("#phoneNumber").attr("readonly", "readonly");
        form.find("#gender").attr("disabled", "readonly");
        form.find("#birthDate").attr("readonly", "readonly");
    }
    
    function enableForm(form){
        form.find("#fullName").removeAttr("readonly");
        form.find("#email").removeAttr("readonly");
        form.find("#phoneNumber").removeAttr("readonly");
        form.find("#gender").removeAttr("disabled");
        form.find("#birthDate").removeAttr("readonly");
    }

    function loadInfo(form){
        const apiService = new ApiService();
        let result = apiService.getProfileInfo();
        result.then((data) => {
            if (data.body) {
                fillInInfo(data.body)
                disableForm(form);
                currentInfo = data.body;
            } else {
                console.log(data, error);
            }
        });
        setOnButtonsClick();
    }
function setOnButtonsClick(){
    $("#editBtn").click(function(event){
        $("#editBtn").addClass("d-none");
        $("#submitBtn").removeClass("d-none");
        $("#cancelBtn").removeClass("d-none");
        enableForm($("#profile"));
   });

   $("#cancelBtn").click(function(event){   
        $("#cancelBtn").addClass("d-none");
        $("#submitBtn").addClass("d-none");
        $("#editBtn").removeClass("d-none");
        fillInInfo(currentInfo);
        disableForm($("#profile"));    
   });

   $("form").submit(function(event){
        event.preventDefault();
        formValidation();

        let objectData = getObjectFromInputs();
        if(objectData){
            objectData.id = $(this).data("id");
            objectData.gender = ($("#gender").val());
            const apiService = new ApiService();
            let result = apiService.editProfile(objectData);
            result.then((data) => {
                if(data.body){
                    loadInfo($("#profile"));
                    $("#cancelBtn").addClass("d-none");
                    $("#submitBtn").addClass("d-none");
                    $("#editBtn").removeClass("d-none");
                }
                else{
                    console.log(data.error);
                }
            })
        }
   });
}

