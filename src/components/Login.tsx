import { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import { useLocation } from "react-router-dom";

const Login = () => {
  const [loginUrl, setLoginUrl] = useState("");
  const location = useLocation();
  async function getUserInfo() {
      if (!sessionStorage.getItem("auth")) {
        const response = await fetch('/.auth/me');
        const payload = await response.json();
        const { clientPrincipal } = payload;
        if (clientPrincipal) {
          sessionStorage.setItem("auth", JSON.stringify(clientPrincipal));
          window.location.reload();
        }
      } else {
        window.location.assign("/");
      }
  }

  useEffect(() => {
      getUserInfo();
      setLoginUrl(`/.auth/login/github?post_login_redirect_uri=${location.pathname}`);
  }, [location]);



  return (
      <Container fluid className="page-loader">
        <Button href={loginUrl}>
          Login
        </Button>
      </Container>
  )
}

export default Login