import { useRouter } from "next/router";
import classes from "../styles/dashboard.module.css";
import { FaWpforms } from "react-icons/fa";
import { RxDashboard } from "react-icons/rx";

export default function Dashboard(): JSX.Element {
  const router = useRouter();

  return (
    <div className={classes.container}>
      <h1>Dashboard</h1>
      <div className={classes.options}>
        <div
          className={classes.subContainer}
          onClick={() => {
            router.push("https://cns-form-builder.netlify.app/create-new-form");
          }}
        >
          <FaWpforms />
          <p>Create new Form</p>
        </div>
        <div
          className={classes.subContainer}
          onClick={() => {
            router.push("https://cns-form-builder.netlify.app/");
          }}
        >
          <RxDashboard /> <p>Form Responses</p>
        </div>
      </div>
    </div>
  );
}
