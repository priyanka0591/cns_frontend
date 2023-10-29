import Link from "next/link";
import classes from "../styles/navbar.module.css";

export default function Navbar(): JSX.Element {
  return (
    <div className={classes.container}>
      <h1>CNS - KVP</h1>
      <ul>
        <li><Link href={"/dashboard"}>Dashboard</Link></li>
        <li>
          <Link href={"/signup"}>Add new User</Link>
        </li>
        <li><Link href={"/"}>Login</Link></li>
      </ul>
    </div>
  );
}
