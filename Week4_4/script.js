const fullNameRegex =
    /^[A-ZÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬĐÉÈẺẼẸÊẾỀỂỄỆÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰ][a-záàảãạăắằẳẵặâấầẩẫậđéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữự]+(?: [A-ZÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬĐÉÈẺẼẸÊẾỀỂỄỆÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰ][a-záàảãạăắằẳẵặâấầẩẫậđéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữự]+)*$/;
const usernameRegex = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^0\d{9}$/;

$(document).ready(function () {
    $("#registrationForm").on("submit", function (e) {
        e.preventDefault();
        if (validateForm()) {
            alert("Đăng ký thành công!");
        }
    });

    function validateForm() {
        let isValid = true;

        // Validate Full Name
        const fullName = $("#fullName").val();
        if (fullName === "") {
            $(".fullName .error").text("Họ tên không được để trống");
            isValid = false;
        } else if (!fullNameRegex.test(fullName)) {
            $(".fullName .error").text(
                "Họ tên phải viết hoa chữ cái đầu, chỉ chứa chữ cái tiếng Việt và dấu cách"
            );
            isValid = false;
        } else {
            $(".fullName .error").text("");
        }

        // Validate Username
        const username = $("#username").val();
        if (username === "") {
            $(".username .error").text("Username không được để trống");
            isValid = false;
        } else if (!usernameRegex.test(username)) {
            $(".username .error").text("Username không hợp lệ");
            isValid = false;
        } else {
            $(".username .error").text("");
        }

        // Validate Email
        const email = $("#email").val();
        if (email === "") {
            $(".email .error").text("Email không được để trống");
            isValid = false;
        } else if (!emailRegex.test(email)) {
            $(".email .error").text("Email không hợp lệ");
            isValid = false;
        } else {
            $(".email .error").text("");
        }

        // Validate Phone
        const phone = $("#phone").val();
        if (phone === "") {
            $(".phone .error").text("Số điện thoại không được để trống");
            isValid = false;
        } else if (!phoneRegex.test(phone)) {
            $(".phone .error").text(
                "Số điện thoại phải có 10 chữ số và bắt đầu bằng 0"
            );
            isValid = false;
        } else {
            $(".phone .error").text("");
        }

        // Validate Date of Birth
        const dob = new Date($("#dob").val());
        const today = new Date();
        const age = today.getFullYear() - dob.getFullYear();
        if (dob == "Invalid Date") {
            $(".dob .error").text("Ngày sinh không hợp lệ");
            isValid = false;
        } else if (age < 15 || age > 55) {
            $(".dob .error").text("Tuổi phải từ 15 đến 55");
            isValid = false;
        } else {
            $(".dob .error").text("");
        }

        return isValid;
    }
});
