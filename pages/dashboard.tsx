import { useCallback, useEffect, useState } from "react";
import classes from "../styles/dashboard.module.css";
import { MdEdit, MdDelete } from "react-icons/md";
import { serverUrl } from "@/data/server";
import { useRouter } from "next/router";
import { notification } from "antd";
import LoadingSpinner from "@/component/LoadingSpinner";
import { userType } from "@/model/userModel";
import EditPage from "./edit";

export default function Dashboard(): JSX.Element {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [data, setData] = useState<Array<userType>>([]);
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);

  const deleteHandler = async (event: any) => {
    const userId = event.currentTarget.id;

    const url = `${serverUrl}/user/delete/${userId}`;
    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Something went wrong!!!");
      }
      const result = await response.json();
      const message = result.error;
      if (message) {
        throw new Error(message);
      }
      const successMsg = `User deleted Successfully with email ${result.data.email}`;
      api["success"]({
        message: successMsg,
        duration: 10,
      });
      let latestData: Array<userType> = [];
      data.forEach((d) => {
        if (d.email !== result.data.email) {
          latestData.push(d);
        }
      });
      setData(latestData);
    } catch (error: any) {
      api["error"]({
        message: error.message,
        duration: 20,
      });
    }
    // dataFetchHandler();
  };

  const updateHandler = (event: any) => {
    const userId = event.currentTarget.id;
    const foundUser = data.find((user) => user._id === userId);
    // console.log(foundUser);
    // return <EditPage />
    router.push({
      pathname: "/edit",
      query: {
        userId: foundUser?._id,
        email: foundUser?.email,
      },
    });
  };

  const dataFetchHandler = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${serverUrl}/user/get-data`, {
        method: "GET",
        headers: {
          Authorization: `bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
      const result = await response.json();
      const message = result.error;
      if (message) {
        api["error"]({
          message: message,
          duration: 20,
        });
      }
      // console.log(result.data);
      let optimisedData: Array<{
        _id: string;
        email: string;
        password: string;
      }> = [];
      for (const i of result.data) {
        optimisedData.push({
          _id: i._id,
          email: i.email,
          password: i.password,
        });
      }
      setData(optimisedData);
      // console.log(data);
    } catch (error: any) {
      // api["error"]({
      //   message: error.message,
      //   duration: 20,
      // });
    }
    setLoading(false);
  }, [api, token]);

  useEffect(() => {
    // console.log("Running");

    if (typeof window !== "undefined" && window.localStorage) {
      const dtoken = localStorage.getItem("token");
      if (dtoken != null) {
        setToken(dtoken);
      } else {
        router.replace("/");
      }
    }
    dataFetchHandler();
  }, [dataFetchHandler, router]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className={classes.container}>
      <h1>Dashboard</h1>
      {contextHolder}
      <table>
        <tbody>
          <tr>
            <th>Sr no.</th>
            <th>Email</th>
            <th>Hashed Password</th>
            {/* <th>Actions</th> */}
          </tr>
          {data.map((result, index) => {
            return (
              <tr key={result._id}>
                <td>{index + 1}</td>
                <td>{result.email}</td>
                <td>{result.password}</td>
                {/* <td> */}
                  {/* <div className={classes.actions}> */}
                    {/* <button
                      onClick={deleteHandler}
                      id={result._id}
                      className={classes.delete}
                    >
                      <MdDelete />
                    </button> */}
                    {/* <button
                      onClick={updateHandler}
                      id={result._id}
                      className={classes.edit}
                    >
                      <MdEdit />
                    </button> */}
                  {/* </div> */}
                {/* </td> */}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
