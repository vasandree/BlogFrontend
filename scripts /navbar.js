import { ApiService } from "./ApiService.js";
const apiService = new ApiService();
const token = 
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIwZWRkZjU4MC0yYTBkLTQ2ZDAtMDk0NS0wOGRiZWIwMTdkMTkiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9hdXRoZW50aWNhdGlvbiI6ImMzMDU5ZDY4LTA5OWYtNGViOC1hNWM2LTI4YTViMjNhN2E1ZCIsIm5iZiI6MTcwMTI3ODE0MywiZXhwIjoxNzAxMjgxNzQzLCJpYXQiOjE3MDEyNzgxNDMsImlzcyI6IkJsb2cuQVBJIiwiYXVkIjoiQmxvZy5BUEkifQ.Xc0f9dBobkh9nvzJpl2o8qUA8JvHaz4i2-HzAaivRNQ";
localStorage.setItem("token", token);
$(document).ready(function(){

    loadNavbar();

});

function loadNavbar(){
    $("#navbar").find("#profile-name").text("");
    let result = apiService.getProfileInfo();
    result.then((data) =>{
        if(data.body){
            setAuthorizedNavbar(data.body.email);
        }
        else if(data.error){
            setUnauthorizedNavBar();
        }
    });

}

function setAuthorizedNavbar(email){
    $("#navbar").find("#profile-name").text(email);
    $("#navbar").find("#login").addClass("d-none");
    registerLogout();
}

function setUnauthorizedNavBar(){
    $("#navbar").find("#groups").addClass("d-none");
    $("#navbar").find("#authors").addClass("d-none");
    $("#navbar").find("#profile").addClass("d-none");
    $("#navbar").find("#login").removeClass("d-none");
}

function registerLogout(){
    $("#logout").click(function(){
        apiService.logout();
        loadNavbar();
    });
}