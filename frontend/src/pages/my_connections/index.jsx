  import {
    AcceptConnection,
    getMyConnectionRequest,
  } from "@/config/redux/action/authAction";
  import DashboardLayout from "@/layout/DashboardLayout";
  import UserLayout from "@/layout/userLayout";
  import React, { useEffect } from "react";
  import styles from "./index.module.css";
  import { useDispatch, useSelector } from "react-redux";
  import { BASE_URL } from "@/config";
  import { useRouter } from "next/router";

  export default function MyConnection() {
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);
    const router = useRouter();
    useEffect(() => {
      dispatch(getMyConnectionRequest({ token: localStorage.getItem("token") }));
    }, []);

    useEffect(() => {
      if (authState.connectionRequest.length != 0) {
        console.log(authState.connectionRequest);
      }
    }, [authState.connectionRequest]);
    console.log("authState",authState.connectionRequest);

    return (
      <>
        <UserLayout>
          <DashboardLayout>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}
            >
              <h4>My Connections</h4>
              {authState.connectionRequest.length === 0 && (
                <h2>No Connection Request Pending</h2>
              )}
              {authState.connectionRequest.length != 0 &&
                authState.connectionRequest
                  .filter((connection) => connection.status_accepted === null)
                  .map((user) => {
                    return (
                      <div
                        key={user._id}
                        onClick={() => {
                          router.push(`/view_profile/${user.userId.username}`);
                        }}
                        className={styles.userCard}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "1.2rem",
                          }}
                        >
                          <div className={styles.profilePicture}>
                            <img
                              style={{ width: "5rem" }}
                              src={`${BASE_URL}/${user.userId.profilePicture}`}
                              alt="profile picture"
                            ></img>
                          </div>
                          <div className={styles.userInfo}>
                            <h3>{user.userId.name}</h3>
                            <p>{user.userId.username}</p>
                          </div>
                          <button
                            onClick={(e) => {
                              console.log("token", localStorage.getItem("token"));
                              e.stopPropagation();
                              console.log("users", user._id);
                              dispatch(
                                AcceptConnection({
                                  connection_id: user._id,
                                  token: localStorage.getItem("token"),
                                  action: "accept",
                                }),
                              );
                            }}
                            className={styles.connectedButton}
                          >
                            Accept
                          </button>
                        </div>
                      </div>
                    );
                  })}
              <h4>My Network</h4>
              {authState.connectionRequest
                .filter((connection) => connection.status_accepted!=null)
                .map((user, index) => {
                  const currentUserId = authState.user?.userId?._id;

      const otherUser =
        user.userId._id === currentUserId
          ? user.connectionId
          : user.userId;

                  return (
                    <div
                      key={user._id}
                      onClick={() => {
                        router.push(`/view_profile/${otherUser.username}`);
                      }}
                      className={styles.userCard}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "1.2rem",
                        }}
                      >
                        <div className={styles.profilePicture}>
                          <img
                            style={{ width: "5rem" }}
                            src={`${BASE_URL}/${otherUser.profilePicture}`}
                            alt="profile picture"
                          ></img>
                        </div>
                        <div className={styles.userInfo}>
                          <h3>{otherUser.name}</h3>
                          <p>{otherUser.username}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </DashboardLayout>
        </UserLayout>
      </>
    );
  }
