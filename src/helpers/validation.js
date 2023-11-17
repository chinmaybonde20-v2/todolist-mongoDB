export function validateEmail(email) {
  const emailPattern =
    /^((?:[^<>()[\]\\.,;:\s@"]+(?:\.[^<>()[\]\\.,;:\s@"]+)*)|(?:".+"))@(?:(?:\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|((?:[a-zA-Z\-0-9]+\.)+([a-zA-Z]{2,})))$/;
  return emailPattern.test(email);
}

export function validatePassword(password) {
  const passwordLength = password.length;
  return passwordLength >= 8 && passwordLength <= 15;
}

export function validateName(name) {
  const namePattern = /^[A-Za-z]+$/;
  return name.trim() && namePattern.test(name);
}

export function validateVerificationCode(code) {
  const codePattern = /^\d{6}$/;
  return codePattern.test(code);
}

export function validateTaskName(value) {
  return value.trim() !== "" && value.length <= 25;
}

export function validateTaskDescription(value) {
  return value.length <= 100;
}
