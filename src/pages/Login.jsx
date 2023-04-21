import React, { useEffect } from 'react';
import '../Style/Login.css';
import { useToken } from '../hooks/MemoryJwtToken';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { setToken } = useToken();
  const { token } = useToken();
  const navigate = useNavigate();
  useEffect(() => {
    if (token) {
      navigate('/Panel');
    }
  }, [token, navigate]);

  return (
    <div className="wrapper fadeInDown">
      <div id="formContent">
        <h2 className="active"> Sign In </h2>
        <div className="fadeIn first">
          <img src="http://danielzawadzki.com/codepen/01/icon.svg" id="icon" alt="User Icon" />
        </div>
        <form onSubmit={(event) => handleSubmit(event, setToken, navigate)}>
          <input type="text" id="login" className="fadeIn second loginField" name="login" placeholder="login" />
          <input type="password" id="password" className="fadeIn third loginField" name="password" placeholder="password" />
          <input type="submit" className="fadeIn fourth submitField" />
        </form>
        <div id="formFooter">
          <a className="underlineHover" href="#">Forgot Password?</a>
        </div>
      </div>
    </div>
  );
}

const handleSubmit = (event, setToken, navigate) => {
  event.preventDefault();
  const login = event.target[0].value;
  const password = event.target[1].value;

  const formData = new FormData();
  formData.append("login", login);
  formData.append("password", password);

  const options = {
    method: "POST",
    body: formData,
  };
  fetch('http://localhost:8080/login', options)
    .then((response) => {
    console.log(response)
    response.json()
    })
    .then((response) => {
      if (response.message === "Welcome") {
        console.log(response);
        document.cookie = `refreshToken=${response.refresh_token}; Secure; SameSite=Strict; Max-Age=${30 * 24 * 60 * 60}`;
        setToken(response.token);
      } else if (response.message === "Denied") {
        window.alert('Verify your Information');
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
