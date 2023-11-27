import { ApiService } from "./ApiService.js";

const token = 
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiJkMDczZmEzOS04MThkLTQwZmEtMDk0Yi0wOGRiZWIwMTdkMTkiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9hdXRoZW50aWNhdGlvbiI6IjcyMjM3YzBmLTI0MGMtNDgxNi04NTEzLTY1ZTM0MDE3NGViYSIsIm5iZiI6MTcwMTEwODQyOSwiZXhwIjoxNzAxMTEyMDI5LCJpYXQiOjE3MDExMDg0MjksImlzcyI6IkJsb2cuQVBJIiwiYXVkIjoiQmxvZy5BUEkifQ.i6gf6ePDypBfnWOhhlTLz8YwDumwDSiLYHxh9Bt3xok";
localStorage.setItem("token", token);
let currentInfo;
const apiService = new ApiService();
$(document).ready(function(){

    addPhoneMask($("#profile"));
    loadInfo($("#profile"));

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
        //TODO: validate form 

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

    function addPhoneMask(form){
        if(form.length){
            var element = $('#phoneNumber');
            var maskOptions = {
                mask: '+7(000)000-00-00',
                lazy: false
            };
            var mask = new IMask(element[0], maskOptions);
        }
    }

function getObjectFromInputs() {
    let inputs = $(".form-control");
    let objectData = {};

    for (let input of inputs) {
        if ($(input).hasClass("error")) {
            return null;
        }
        let key = $(input).attr("id");
        let value = $(input).val()
        if (key === "birthDate" && value === "") {
            objectData[key] = null;
        }
        else if(key === "phoneNumber" && value === "+7(___)___-__-__"){
            objectData[key] = null;
        }
        else{
            objectData[key] = value;
        }
    }
    console.log(objectData);
    return objectData;
}

