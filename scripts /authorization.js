import { ApiService } from "./ApiService.js";
import { formValidation } from "./validation.js";
import { addPhoneMask, getObjectFromInputs } from "./main.js";

$(document).ready(function () {

    formValidation();
    addPhoneMask(("#register-form"))
	submitOnClick();
    
});

function submitOnClick(){
    $("form").submit(function (event) {
        event.preventDefault();
        $(".notification").remove();

        const apiService = new ApiService();

        let objectData = getObjectFromInputs();
        if (objectData) {
            let result;

            switch (event.target.id) {
                case ("login-form"):
                    result = apiService.login(objectData);
                    break;
                case ("register-form"):
                    delete objectData.confirm_password;
                    result = apiService.register(objectData);
                    break;
            }

            result.then((data) => {
                if (data.body) {
                    localStorage.setItem("token", data.body.token);
                } else {
                    showError(event);
                }
            });
        }
    });
 }

function showError(event){
    let errorMessage = {
        "login-form": "Неверный логин или пароль",
        "register-form": "Пользователь с таким логином уже существует"
    };
   
    $("form").append(`<p class="notification error mt-3 text-center">${errorMessage[event.target.id]}</p>`);//разобраться
}