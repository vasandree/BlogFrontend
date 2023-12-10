import { ApiService } from "./ApiService.js";
import { changePage } from "./main.js";

export function loadNavbar(){
    $("#navbar").find("#profile-name").text("");
    const apiService = new ApiService();
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
        const apiService = new ApiService();
        let result = apiService.logout();
        result.then((data) =>{
            if(data.body){
                changePage("/login/");
            }
        });    
    });
}