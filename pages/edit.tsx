import Image from "next/image";
import styles from "../styles/index.module.css";
import homeImage from "../public/home.png";
import { BiSolidUserCircle } from "react-icons/bi";
import { useEffect, useRef, useState } from "react";
import { RiLockPasswordFill } from "react-icons/ri";
import backgroundImg from "../public/background.png";
import Head from "next/head";
import { NextRouter, useRouter } from "next/router";
import { notification } from "antd";
import { serverUrl } from "@/data/server";

export default function EditPage() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPassRef = useRef<HTMLInputElement>(null);
  const router: NextRouter = useRouter();
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const dtoken = localStorage.getItem("token");
      const demail = localStorage.getItem("email");
      const dId = localStorage.getItem("userId");
      if (dtoken != null) {
        setToken(dtoken);
      }
      demail != null && setEmail(demail);
      dId != null && setUserId(dId);
      if (usernameRef.current) {
        usernameRef.current.value = email;
      }
    }
  }, [router, email]);

  const formSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const email = usernameRef.current?.value;
    const password = passwordRef.current?.value;
    const confirmPassword = confirmPassRef.current?.value;

    if (email == null || password == null || confirmPassword == null) {
      return;
    }

    try {
      const res = await fetch(`${serverUrl}/user/update/${userId}`, {
        method: "POST",
        body: JSON.stringify({
          email: email,
          password: password,
          confirmPassword: confirmPassword,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.error) {
        api["error"]({
          message: data.error,
          duration: 10,
        });
      }

      if (data.result) {
        api["success"]({
          message: "User data updated Successfully",
          duration: 5,
        });
        router.replace("/dashboard");
      }
    } catch (error) {
      api["info"]({
        message: "Something went wrong, Please try again later.",
        duration: 10,
      });
    }
    if (usernameRef.current) {
      usernameRef.current.value = "";
    }
    if (passwordRef.current) {
      passwordRef.current.value = "";
    }
    if (confirmPassRef.current) {
      confirmPassRef.current.value = "";
    }
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Form Builder</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {contextHolder}
      <div className={styles.container}>
        <div className={styles.imgContainer}>
          <Image src={homeImage} alt="home page image" />
        </div>
        <div className={styles.formContainer}>
          <div className={styles.background}>
            <Image src={backgroundImg} alt="background image" />
          </div>
          <h1>Update User Data</h1>
          <form className={styles.form} onSubmit={formSubmitHandler}>
            <div className={styles.formDiv}>
              <label className={styles.title}>
                <BiSolidUserCircle /> <p>Email</p>
              </label>
              <input type="email" ref={usernameRef} required />
            </div>
            <div className={styles.formDiv}>
              <label className={styles.title}>
                <RiLockPasswordFill /> <p>Password</p>
              </label>
              <input type="password" ref={passwordRef} required />
            </div>
            <div className={styles.formDiv}>
              <label className={styles.title}>
                <RiLockPasswordFill /> <p>Confirm Password</p>
              </label>
              <input type="password" ref={confirmPassRef} required />
            </div>
            {loading && <span className={styles.loader}></span>}
            {!loading && <button type="submit">Update User</button>}

            {/* <div className={styles.shift}>
              <p
                onClick={() => {
                  router.replace("/");
                }}
              >
                Already have an account ?
              </p>
            </div> */}
          </form>
        </div>
      </div>
    </>
  );
}
