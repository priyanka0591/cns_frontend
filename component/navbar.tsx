import Link from "next/link";
import classes from "../styles/navbar.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Navbar(): JSX.Element {
  const [token, setToken] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const dtoken = localStorage.getItem("token");
      // console.log(dtoken);
      if (dtoken != null) {
        setToken(dtoken);
      }
    }
  }, [router]);

  const logoutHandler = () => {
    if (typeof window !== "undefined" && window.localStorage) {
      const dtoken = localStorage.removeItem("token");
      setToken("");
      router.replace("/");
    }
  };

  console.log(token);
  return (
    <div className={classes.container}>
      <h1>Form Builder</h1>
      <ul>
        {token !== "" ? (
          <li>
            <Link href={"/dashboard"}>Dashboard</Link>
          </li>
        ) : null}

        {token !== "" ? (
          <li>
            <Link href={"/admin"}>Admins</Link>
          </li>
        ) : null}
        {token !== "" && (
          <li>
            <Link href={"/edit"}>Update Profile</Link>
          </li>
        )}
        {/* {token !== "" ? (
          <li>
            <Link href={"/signup"}>Add new User</Link>
          </li>
        ) : null} */}
        {/* <li>
          <Link href={"http://localhost:3001/create-new-form"}>Create new Form</Link>
        </li> */}

        {token === "" ? (
          <li>
            <Link href={"/"}>Login</Link>
          </li>
        ) : null}
        {token !== "" ? <li onClick={logoutHandler}>Logout</li> : null}
      </ul>
    </div>
  );
}
