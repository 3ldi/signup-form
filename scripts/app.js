"use strict"

window.addEventListener("load", function () {
    // function calls when page loads
    getUserName();
    getEmail();
    getPassword();
    getPhoneNumber();
    getAddress();
    addCreditCard();
    formSubmit();

}); // end window onload

/* 
    Function to get the username
*/
function getUserName() {
    const userName = document.getElementById("fname");
    const userNameHint = document.getElementById("fnameHint");

    userName.addEventListener("input", function () {
        if (userName.value.length < 1) {
            $(userName).addClass("failed").removeClass("success");
            userNameHint.style.display = "inline-block";
        } else {
            $(userName).addClass("success").removeClass("failed");
            userNameHint.style.display = "none";
        }
    });
} // end getUserName

/* 
    This function will validate the email entered by user.
*/
function getEmail() {
    const email = document.getElementById("email");
    const emailHint = document.getElementById("emailHint");

    email.addEventListener("input", function () {
        let emailPattern = /.+@.+\..{2,}/g;

        if (emailPattern.test(email.value)) {
            $(emailHint).css("display", "none");
            $(email).addClass("success").removeClass("failed");
        } else {
            $(emailHint).css(
                {
                    "padding-left": "5px",
                    "display": "inline-block"
                });
            $(email).addClass("failed").removeClass("success");
        }
    });
} // end getEmail

/*
    This function will validate the phone number entered bu the user and will
    format it as: nnn-nnnn-nnnn.
*/
function getPhoneNumber() {
    const phone = document.getElementById("phone");
    const phoneHint = document.getElementById("phoneHint");

    // Add listener to input area
    phone.addEventListener("input", function () {
        /* Create regex to validate user input and assign it the phone element pattern attribute.
           The following format will be accepted as valid entry:
            xxxxxxxxxx
            xxx-xxx-xxxx
            (xxx)xxx-xxxx
            xxx xxx xxxx
           Also, any combination of " "(space), "-", "(" and ")" in the beggining, after the first 3 digits and after the second group of three digits will be accepted. 
           All accepted formats are then reformatted to: xxx-xxx-xxxx.
        */
        let validFormats = /^\(?\d{3}\)?(\s?|-?)\d{3}(\s?|-?)\d{4}$/g;

        //match will return an array of 1 element or null
        let phoneNumber = phone.value.match(validFormats);
        if (phoneNumber != null) {
            let formatNumber = phoneNumber[0];
            let tempNumber = "";
            // The following loop creates a string composed of 10 digits characters from the user input.
            for (let i = 0; i < formatNumber.length; i++) {
                let temp = parseInt(formatNumber[i]);
                if (!isNaN(temp)) {
                    tempNumber += String(formatNumber[i]);
                }
            }

            // create variable with the required format xxx-xxx-xxxx
            let formattedNumber = tempNumber.slice(0, 3) + "-" + tempNumber.slice(3, 6) + "-" + tempNumber.slice(6);
            // Update phone number on page
            phoneHint.style.display = "none";
            phone.value = formattedNumber;
            $(phone).addClass("success").removeClass("failed");
        } else {
            phoneHint.style.display = "inline-block";
            $(phone).addClass("failed").removeClass("success");
        }
    });
}  // end getPhoneNumber

/* 
    This function will use AJAX to populate the city and state fileds
    based on the zip code entered by the user.
 */
function getAddress() {
    const street = document.getElementById("street1");
    const streetHint = document.getElementById("streetHint");
    const zipCode = document.getElementById("zip");
    const city = document.getElementById("city");
    const state = document.getElementById("state");
    const zipHint = document.getElementById("zipHint");

    // add listner and handler for zip code
    zipCode.addEventListener("change", function () {
        var params = {
            myKey: "AryOTRwEH8aUjyik7eSaC2eyDJFzdUzXWk3tqKsdboxw5C_YlhTVmtN64TlgT6DB",
            query: this.value
        }
        // make and send XmlHttpRequest
        var req = new XMLHttpRequest();
        req.open("GET", `http://dev.virtualearth.net/REST/v1/Locations/${params.query}?key=${params.myKey}`, true);
        req.send();

        // set up a listener for the response and get the city and the state 
        req.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                state.value = JSON.parse(this.response).resourceSets[0].resources[0].address.adminDistrict;

                city.value = JSON.parse(this.response).resourceSets[0].resources[0].address.locality;

                zipHint.style.display = "none";
                $("zipCode").addClass("success").removeClass("failed");
            } else {
                zipHint.style.display = "block";
                $("zipCode").addClass("failed").removeClass("success");
            }
        }  // end anonymous function onreadystatechange
    }); // end anonymous function on change event

    // Add event listener and handler for the street 
    street.addEventListener("input", function () {
        if (street.value.length > 0) {
            streetHint.style.display = "none";
            $(street).addClass("success").removeClass("failed");
        } else {
            streetHint.style.display = "inline-block";
            $(street).addClass("failed").removeClass("success");
        }

    }); // end anonymous function on input for the street
} // end getAddress

/* 
    This function will add DOM elements to the page for the user to add a credit card
    to their account if they wish so, by checking the  approriate checkbox.
*/
function addCreditCard() {
    const checkInput = document.getElementById("addCard");
    const creditCardInfo = document.getElementById("creditCardInfo");
    const creditCardMonth = document.getElementById("cc-exp-month");
    const creditCardYear = document.getElementById("cc-exp-year");

    checkInput.addEventListener("change", function () {
        if (checkInput.checked === true) {
            // First display the div
            creditCardInfo.style.display = "block";

            // Then create the necessary fields for the credit card
            let label1 = document.createElement("label");
            $(label1).attr(
                {
                    "for": "nameOnCard",
                    "class": "creditCard",
                    "required": "required"
                });
            $(label1).html("Name on Card");

            let cardNameHint = document.createElement("span");
            $(cardNameHint).html(" this field is required");
            $(cardNameHint).attr(
                {
                    "id": "cardNameHint",
                    "class": "hint"
                }
            );

            let name = document.createElement("input");
            $(name).attr(
                {
                    "id": "nameOnCard",
                    "type": "text",
                    "class": "creditCard",
                    "required": "required"
                }
            );

            let cardContainer = document.createElement("div");
            $(cardContainer).attr(
                {
                    "class": "cc-container"
                }
            );

            let numberContainer = document.createElement("div");
            $(numberContainer).attr(
                {
                    "class": "cc-number-container"
                }
            );

            let label2 = document.createElement("label");
            $(label2).attr(
                {
                    "for": "cardNumber",
                    "class": "creditCard",
                    "required": "required"
                });
            $(label2).html("Card Number");

            let cardNumHint = document.createElement("span");
            $(cardNumHint).html(" Can only be 16 digits");
            $(cardNumHint).attr(
                {
                    "id": "cardNumHint",
                    "class": "hint"
                }
            );

            let cardNumber = document.createElement("input");
            $(cardNumber).attr(
                {
                    "id": "cardNumber",
                    "type": "text",
                    "class": "creditCard",
                    "maxlength": "16",
                    "required": "required"
                });

            let securityCodeContainer = document.createElement("div");
            $(securityCodeContainer).attr(
                {
                    "class": "cc-code-container"
                }
            );

            let label3 = document.createElement("label");
            $(label3).attr(
                {
                    "for": "securityCode",
                    "class": "creditCard"
                });
            $(label3).html("Sec Code/CVV");

            let secCodeHint = document.createElement("span");
            $(secCodeHint).html("3 or 4 digits only");
            $(secCodeHint).attr(
                {
                    "id": "secCodeHint",
                    "class": "hint"
                }
            );

            let securityCode = document.createElement("input");
            $(securityCode).attr(
                {
                    "type": "text",
                    "id": "securityCode",
                    "class": "creditCard",
                    "maxlength": "4",
                    "required": "required"
                }
            );

            // Dispaly the exipration month and year and set the required attribute
            creditCardYear.style.display = "inline-block";
            $("exp-year").attr("required", "required");
            creditCardMonth.style.display = "inline-block";
            $("exp-month").attr("required", "required");


            //Append all elements to the selected div on the page
            $(numberContainer).append(label2, cardNumber, cardNumHint);
            $(securityCodeContainer).append(label3, securityCode, secCodeHint);
            $(cardContainer).append(numberContainer, securityCodeContainer);
            $(creditCardInfo).append(label1, cardNameHint, name,
                cardContainer,
                creditCardMonth, creditCardYear);

            // Here we validate the input on the name, number and sec code fields 

            // Add an input listener and handler for the card name
            nameOnCard.addEventListener("input", function () {
                if (nameOnCard.value.length < 1) {
                    cardNameHint.style.display = "inline-block";
                    $(nameOnCard).addClass("failed").removeClass("success");
                } else {
                    $(nameOnCard).addClass("success").removeClass("failed");
                    cardNameHint.style.display = "none";
                }
            }); // end nameOnCard handler
            // Add an input listener and handler for the card number
            cardNumber.addEventListener("input", function () {
                let validNumPattern = /^\d{16}$/g;

                /* Here we update the input in case user comes back and wants to change the number.
                   This will be the case when the number has been already entered, and then formatted 
                   with spaces in groups of four.  
                */
                let newNumArr = this.value.split(" ");
                let newNum = "";
                for (let i = 0; i < newNumArr.length; i++) {
                    newNum += newNumArr[i];
                }
                cardNumber.value = newNum;
                // Conditional to check the proper number pattern
                if (this.value.length == 16 && validNumPattern.test(this.value)) {
                    // Hide hint
                    $(cardNumHint).css("display", "none");
                    $(cardNumber).addClass("success").removeClass("failed");
                } else {
                    // Display hint
                    $(cardNumHint).css("display", "block");
                    $(cardNumber).addClass("failed").removeClass("success");
                }
            }); // end cardNumber on input

            // Then, add event listener and handler to format the number on blur
            cardNumber.addEventListener("blur", function () {
                let validNumPattern = /^\d{16}$/g;
                if (this.value.length == 16 && validNumPattern.test(this.value)) {
                    // Format output in groups of four
                    let ccFormatted = this.value.slice(0, 4) + " " + this.value.slice(4, 8) + " " + this.value.slice(8, 12) + " " + this.value.slice(12);
                    cardNumber.value = ccFormatted;
                }
            }); // end cardNumber on blur

            // Add event listener and handler for the security code
            securityCode.addEventListener("input", function () {
                let cvvValidPattern = /^\d{3,4}$/g;
                if ((this.value.length >= 3 && this.value.length <= 4) &&
                    cvvValidPattern.test(this.value)) {
                    // Hide hint
                    $(secCodeHint).css("display", "none");
                    $(securityCode).addClass("success").removeClass("failed");
                } else {
                    // Display hint
                    $(secCodeHint).css("display", "block");
                    $(securityCode).addClass("failed").removeClass("success");
                }

            }); // end security code on input

        } else {
            // hide the div with the credit card fields
            creditCardInfo.style.display = "none";
            /* 
                Remove all added elements to avoid duplicates if user checks and 
                unchecks multiple times.
            */
            $(".creditCard").remove();
        }
    });
} // end addCreditCard 

/*
    This function will validate the password.
*/
function getPassword() {
    const password = document.getElementById("password");
    const passHint = document.getElementById("passHint");
    const passReqList = document.getElementById("passReq");
    const showPswdBtn = document.getElementById("show-hide-pass");
    const validPassPattern = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

    password.addEventListener("input", function () {
        if (!validPassPattern.test(password.value)) {
            passHint.style.display = "block";
            passReqList.style.display = "block";
            $(password).addClass("failed").removeClass("success");

        } else {
            passHint.style.display = "none";
            passReqList.style.display = "none";
            $(password).addClass("success").removeClass("failed");
        }
    });

    // This event handler gives user the option to hide and show the password on button click
    showPswdBtn.addEventListener("click", function () {
        if (showPswdBtn.value === "Show") {
            showPswdBtn.value = "Hide";
            showPswdBtn.innerText = "Hide"
            password.setAttribute("type", "text");
        } else {
            showPswdBtn.value = "Show";
            showPswdBtn.innerText = "Show";
            password.setAttribute("type", "password");
        }
    });

} // end getPassword

/*
    Function to prevent form submission if required fields are not valid/missing
*/

function formSubmit() {
    const form = document.getElementById("myForm");
    const allValid = document.getElementsByClassName("success");
    console.log(allValid.length)
    const invaldInputs = document.getElementsByClassName("failed");
    console.log(invaldInputs.length);

    form.addEventListener("submit", function (evt) {
        if (allValid.length == 0 || invaldInputs.length > 0) {
            evt.preventDefault();
            alert("Please fill out all the fields");

        }
    });
} // end formsubmit