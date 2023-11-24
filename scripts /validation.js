export function formValidation() {
    const phoneMask = "+7(___)___-__-__";

    $.validator.addMethod('checkDate', function(date) {
        return date === "" || (date !== "" && new Date(date) < new Date());
    }, 'Введите корректную дату');

    $.validator.addMethod('checkPassword', function(password) {
        return /\d/.test(password);
    }, 'Пароль должен содержать хотя бы одну цифру');

    $.validator.addMethod('checkPhoneNumber', function(phone) {
        
        return phone === phoneMask || (phone !== phoneMask&& /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(value));
    }, 'Введите корректный номер телефона');
    
    $("form").validate({
        rules:{
            fullName:"required",
            email:{
                required: true,
                email: true
            },
            password:{
                required: true,
                minlength: 6,
                checkPassword: true
            },
            confirmPassword: {
                required: true,
                equalTo: "#password",
                minlength: 6,
            },
            birthDate:{
                checkDate: true,
            },
            phoneNumber:{
                checkPhoneNumber: true
            }
        },
        messages:{
            fullName: "Введите ФИО",
            email: {
                required: "Введите email",
                email: "Введите корректный email"
            },
            password: {
                required: "Введите пароль",
                minlength: "Пароль должен содержать не менее 6 символов"
            },
            confirmPassword:{
                required: "Подтвердите пароль",
                equalTo: "Пароли не совпадают",
                minlength: "Пароль должен содержать не менее 6 символов"
            },
            birthDate:{
                checkDate: "Введите корректную дату"
            },
            phoneNumber:{
                checkPhoneNumber: "Введите корректный номер телефона"
            }
        }
    });
}