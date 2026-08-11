import UserLayout from "@/layout/userLayout";
import styles from "./style.module.css";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { getAboutUser, loginUser, registerUser } from "@/config/redux/action/authAction";
import { emptyMessage } from "@/config/redux/reducer/authReducer";

export default function LoginComponent() {
  const [isLogin, setIsLogin] = useState(true);
  const authState = useSelector((state) => state.auth);
  const dispath = useDispatch();
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //to send page on the dashboar if user login
  useEffect(() => {
    if (authState.loggedIn) {
      router.push("/dashboard");
    }
    console.log(authState.message);
  }, [authState.loggedIn]);

  //to referesh the error coloumn which shown on the login and register page 
  useEffect(() => {
    dispath(emptyMessage());
    
  }, [isLogin]);

  //switching the page from register to the sign up page after gathing register
  useEffect(() => {
    if (authState.isSuccess && !isLogin) {
      setIsLogin(true);
    }
  }, [authState.isSuccess]);

  
  // useEffect(() => {
  //   console.log(authState);
  //   console.log("MESSAGE:", authState.message);
  // }, [authState]);

  useEffect(()=>{
    if(localStorage.getItem("token")){
      router.push("/dashboard");
    }
  },[]);

  const handleRegister = () => {
    console.log("Registering...");
    dispath(
      registerUser({
        username,
        password,
        name,
        email,
      }),
    );
  };
  const handleLogin = () => {
    console.log("Login...");
    dispath(
      loginUser({
        password,

        email,
      }),
    );
  };
  return (
    <>
      <div className={styles.page}>
        <div className={styles.container}>
          {/* Left Side */}
          <div className={styles.left}>
            <div className={styles.logo}>
              <img src="/images/brand_logo.png" alt="Brand Logo" />
            </div>
          </div>

          {/* Right Side */}
          {isLogin ? (
            <div className={styles.right}>
              <button
                onClick={() => {
                  router.push("/");
                }}
                className={styles.backBtn}
              >
                ← Back to home
              </button>

              <div className={styles.tabs}>
                <button className={isLogin ? styles.activeTab : ""}>
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setIsLogin(false);
                  }}
                >
                  Create new Account
                </button>
              </div>
              <p
                className={styles.state}
                style={{
                  color: authState.isError ? "red" : "green",
                  borderBottom: authState.isError
                    ? "2px solid rgb(223, 28, 28)"
                    : "rgb(37, 184, 49)",
                }}
              >
                {authState.message?.message || authState.message}
              </p>

              <p className={styles.description}>
                Connect with professionals, showcase your skills, and grow your
                network. Our platform helps you discover opportunities,
                collaborate on projects, and build a strong professional
                presence.
              </p>

              <div className={styles.form}>
                <input
                  type="email"
                  placeholder="Email Address"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />

                <div className={styles.passwordWrapper}>
                  <input
                    type="password"
                    placeholder="Password"
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />

                  {/* <button type="button" className={styles.forgot}>
                    Forgot Password?
                  </button> */}
                </div>

                <button
                  type="submit"
                  onClick={() => {
                    handleLogin();
                  }}
                  className={styles.loginBtn}
                >
                  Login to Dashboard
                </button>
              </div>

              <div className={styles.divider}>
                <span />
                <p>OR</p>
                <span />
              </div>

              <button
                onClick={() => {
                  setIsLogin(false);
                }}
                className={styles.githubBtn}
              >
                Create new Account
              </button>

              <p className={styles.footer}>
                By signing in you agree to our Terms of Service and Privacy
                Policy
              </p>
            </div>
          ) : (
            <>
              <div className={styles.right}>
                <button
                  onClick={() => {
                    router.push("/");
                  }}
                  className={styles.backBtn}
                >
                  ← Back to home
                </button>

                <div className={styles.tabs}>
                  <button
                    onClick={() => {
                      setIsLogin(true);
                    }}
                  >
                    Sign In
                  </button>
                  <button className={isLogin ? "" : styles.activeTab}>
                    Create new Account
                  </button>
                </div>

                <p
                  className={styles.state}
                  style={{
                    color: authState.isError ? "red" : "green",
                    borderBottom: authState.isError
                      ? "2px solid rgb(223, 28, 28)"
                      : "rgb(37, 184, 49)",
                  }}
                >
                  {authState.message.message || authState.message}
                </p>

                <p className={styles.description}>
                  Grow your professional network, share your expertise, and
                  connect with like-minded professionals. Build your digital
                  presence and unlock new career opportunities.
                </p>

                <div className={styles.form}>
                  <input
                    onChange={(e) => {
                      setUsername(e.target.value);
                    }}
                    type="text"
                    placeholder="Username"
                  />

                  <input
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                    type="text"
                    placeholder="Name"
                  />

                  <input
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    type="email"
                    placeholder="Email Address"
                  />

                  <div className={styles.passwordWrapper}>
                    <input
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                      type="password"
                      placeholder="Password"
                    />

                    {/* <button
                type="button"
                className={styles.forgot}
               
              >
                Forgot Password?
              </button> */}
                  </div>

                  <button
                    type="submit"
                    className={styles.loginBtn}
                    onClick={() => {
                      handleRegister();
                    }}
                  >
                    Login to Dashboard
                  </button>
                </div>

                <div className={styles.divider}>
                  <span />
                  <p>OR</p>
                  <span />
                </div>

                <button
                  onClick={() => {
                    setIsLogin(true);
                  }}
                  className={styles.githubBtn}
                >
                  Already! Have an Account?
                </button>

                <p className={styles.footer}>
                  By signing in you agree to our Terms of Service and Privacy
                  Policy
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
