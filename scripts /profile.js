import { ApiService } from "./ApiService.js";
import { getObjectFromInputs, addPhoneMask } from "./main.js";
import { formValidation } from "./validation.js";
const token = 
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIwZWRkZjU4MC0yYTBkLTQ2ZDAtMDk0NS0wOGRiZWIwMTdkMTkiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9hdXRoZW50aWNhdGlvbiI6IjJjMzcyNDhlLTJhYWQtNDhjYy1hZmI1LThkNzg3NjdjZjhiYiIsIm5iZiI6MTcwMjIwODgxMSwiZXhwIjoxNzAyMjEyNDExLCJpYXQiOjE3MDIyMDg4MTEsImlzcyI6IkJsb2cuQVBJIiwiYXVkIjoiQmxvZy5BUEkifQ.vvv__o7DjaQqnAiFqY9JURa8Ytax3jFerFRlAbMZ2B4";
localStorage.setItem("token", token);
let currentInfo;
const apiService = new ApiService();
$(document).ready(function(){
    addPhoneMask($("#profile"));
    loadInfo($("#profile"));
    setOnButtonsClick();
})

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

