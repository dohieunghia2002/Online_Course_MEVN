
function Validator(options) {
    const selectorRules = {};

    function validate(inputElement, rule) {
        const errorElement = inputElement.parentElement.querySelector('.form__msg');
        let errMsg;
        const rules = selectorRules[rule.selector];

        for (let i = 0; i < rules.length; i++) {
            errMsg = rules[i](inputElement.value);
            if (errMsg) break;
        }

        if (errMsg) {
            errorElement.innerText = errMsg;
            inputElement.parentElement.classList.add('invalid');
        }
        else {
            errorElement.innerText = '';
            inputElement.parentElement.classList.remove('invalid');
        }
    }

    const formElement = document.querySelector(options.form);
    if (formElement) {
        formElement.onsubmit = function (e) {
            // loop through each rule and validate
            options.rules.forEach((rule) => {
                const inputElement = formElement.querySelector(rule.selector);
                validate(inputElement, rule)
            });
        }


        options.rules.forEach((rule) => {

            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            } else {
                selectorRules[rule.selector] = [rule.test];
            }

            const inputElement = formElement.querySelector(rule.selector);

            if (inputElement) {
                inputElement.onblur = function () {
                    validate(inputElement, rule)
                }

                inputElement.oninput = function () {
                    const errorElement = inputElement.parentElement.querySelector(options.errorSelector);
                    errorElement.innerText = '';
                    inputElement.parentElement.classList.remove('invalid');
                }
            }
        })
    }
}

Validator.isRequired = function (selector, message) {
    return {
        selector,
        test: function (value) {
            return value.trim() ? undefined : message || 'Vui lòng nhập trường này';
        }
    }
}

Validator.isEmail = function (selector) {
    return {
        selector,
        test: function (value) {
            const regEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regEx.test(value) ? undefined : 'Trường này phải là email';
        }
    }
}

Validator.isFullName = function (selector) {
    return {
        selector,
        test: function (value) {
            const regEx = /^[\p{L} ]+$/u
            return regEx.test(value) ? undefined : 'Họ tên không hợp lệ';
        }
    }
}

Validator.minLength = function (selector, min) {
    return {
        selector,
        test: function (value) {
            return value.length >= min ? undefined : `Vui lòng nhập tối thiểu ${min} ký tự`;
        }
    }
}

Validator.isConfirmed = function (selector, getConfirmValue, message) {
    return {
        selector,
        test: function (value) {
            return value === getConfirmValue() ? undefined : message || 'Giá trị nhập vào không chính xác';
        }
    }
}