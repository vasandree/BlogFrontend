import { ApiService } from "./ApiService.js";
import { formValidation } from "./validation.js";

$(document).ready(function () {

    formValidation();
    
    if($("#register-form").length){
        var element = $('#phoneNumber');
        var maskOptions = {
            mask: '+7(000)000-00-00',
            lazy: false
        };
        var mask = new IMask(element[0], maskOptions);
    }

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
                    objectData.gender = ($("#gender").val());
                    result = apiService.register(objectData);
                    break;
            }

            result.then((data) => {
                if (data.body) {
                    localStorage.setItem("token", data.body.token);
                } else {
                    let errorMessage = {
                        "login-form": "Неверный логин или пароль",
                        "register-form": "Пользователь с таким логином уже существует"
                    };
                    
                    $("form").append(`
                        <p class="notification error mt-3 text-center">${errorMessage[event.target.id]}</p>
                    `);
                }
            });
        }
    });
});

function getObjectFromInputs() {
    let inputs = $(".form-control");
    let objectData = {};

    for (let input of inputs) {
        if ($(input).hasClass("error")) {
            return null;
        }
        let key = $(input).attr("id");
        let value = $(input).val()
        objectData[key] = value;
        console.log(objectData);
    }
    return objectData;
}