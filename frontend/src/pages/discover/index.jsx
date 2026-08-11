import { getAllUsers } from "@/config/redux/action/authAction";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/userLayout";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./index.module.css";
import { BASE_URL } from "@/config";
import { useRouter } from "next/router";

export default function Discover() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const [searchInput,setSearchInput]=useState("");
   const [searchResults, setSearchResults] = useState([]);


  useEffect(() => {
    if (!authState.all_profile_fetched) {
      dispatch(getAllUsers());
    }
    console.log("all_users=", authState.all_user);
  }, []);

  useEffect(() => {
    if (searchInput == "") {
      setSearchResults([]);
    } else {
      const filterRepo = authState.all_user.filter((user) =>
        user.userId.username.toLowerCase().includes(searchInput.toLowerCase()),
      );
      setSearchResults(filterRepo);
    }
  }, [searchInput, authState.all_user]);

  const router=useRouter();
  if(searchInput.length===0){
     return (
    <>
      <UserLayout>
        <DashboardLayout>
          <div className={styles.page}>
            <h1 className={styles.title}>Discover</h1>
<input onChange={(e) => setSearchInput(e.target.value)}
                value={searchInput}
                    className={styles.inputField}
                    type="text"
                    placeholder="username"/>
            

            <div className={styles.allUserProfile}>
              {authState.all_profile_fetched &&
                authState.all_user.map((user) => {
                  return (
                    <div onClick={()=>{
                      router.push(`/view_profile/${user.userId.username}`)
                    }} key={user._id} className={styles.userProfil}>
                      <img
                        className={styles.userProfile}
                        src={`${BASE_URL}/${user.userId.profilePicture}`}
                        alt="profile"
                      />
                      <div>
                        
                        <h1>{user.userId.name}</h1>
                        <p>{user.userId.username}</p>
                        <p>{user.userId.email}</p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </DashboardLayout>
      </UserLayout>
    </>
  );

  }
  else{
    return (
    <>
      <UserLayout>
        <DashboardLayout>
          <div className={styles.page}>
            <h1 className={styles.title}>Discover</h1>

            <input onChange={(e) => setSearchInput(e.target.value)}
                value={searchInput}
                    className={styles.inputField}
                    type="text"
                    placeholder="username"/>
            

            <div className={styles.allUserProfile}>
              {authState.all_profile_fetched &&
                searchResults.map((user) => {
                  return (
                    <div onClick={()=>{
                      router.push(`/view_profile/${user.userId.username}`)
                    }} key={user._id} className={styles.userProfil}>
                      <img
                        className={styles.userProfile}
                        src={`${BASE_URL}/${user.userId.profilePicture}`}
                        alt="profile"
                      />
                      <div>
                        
                        <h1>{user.userId.name}</h1>
                        <p>{user.userId.username}</p>
                        <p>{user.userId.email}</p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </DashboardLayout>
      </UserLayout>
    </>
  );

  }
 }
