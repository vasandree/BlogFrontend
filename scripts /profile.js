import { ApiService } from "./ApiService.js";

const token = 
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiJkMDczZmEzOS04MThkLTQwZmEtMDk0Yi0wOGRiZWIwMTdkMTkiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9hdXRoZW50aWNhdGlvbiI6ImM2ZTZiNTNmLTY5ZWItNDZiZC04NjNmLWQyYmZkZTcxNzk2NSIsIm5iZiI6MTcwMTA2NjM0OCwiZXhwIjoxNzAxMDY5OTQ4LCJpYXQiOjE3MDEwNjYzNDgsImlzcyI6IkJsb2cuQVBJIiwiYXVkIjoiQmxvZy5BUEkifQ.htqtGJSnnoIb2h4SFaE0t4_J7rp2Ejfg4k0qD2NE3wI";
localStorage.setItem("token", token);

$(document).ready(function(){

    const apiService = new ApiService();

    let result = apiService.getProfileInfo();
    result.then((data) => {
        if(data.body){
            let profileInfo = $("#profile")
            profileInfo.attr("data-id", data.body.id);
            profileInfo.find("#fullName").val(data.body.fullName);
            profileInfo.find("#email").val(data.body.email);
            profileInfo.find("#phonNumber").text(data.body.phoneNumber);
            profileInfo.find("#gender").val(data.body.gender);
            profileInfo.find("#birthDate").val(new Date(data.body.birthDate).toLocaleDateString().split('.').reverse().join('-'));

            $(this).find("#fullName").attr("readonly", "readonly");
            $(this).find("#email").attr("readonly", "readonly");
            $(this).find("#phoneNumber").attr("readonly", "readonly");
            $(this).find("#gender").attr("disabled", "readonly");
            $(this).find("#birthDate").attr("readonly", "readonly");
        }
        else{
            console.log(data,error)
        }
    });

})