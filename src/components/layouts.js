/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useRef, createRef, useEffect, useContext } from "react";
import { IoList, IoChevronBack, IoCloseCircleOutline } from "react-icons/io5";
import dynamic from "next/dynamic";
import { Context, userContext } from "../../pages/_app";


import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Paper, { PaperProps } from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { RiOrganizationChart } from "react-icons/ri";

import * as rdd from "react-device-detect";
import Footer from "./Footer";
import SidePannel from "./SidePannel";
import Navbar from "./Navbar";



const Layout = ({ children, loader, toaster }) => {
  // const [toggleDrawer, setToggleDrawer] = useState(false);
  // const [mobile, setMobile] = useState(false);
  // const [pageShow, setPageShow] = useState(false);
  // const [orgList, setOrgList] = useState([]);
  // const [userDetail, setUserDetail] = useState({});
  // const [initial, setInitial] = useContext(Context);
  // const [user, setUser] = useContext(userContext);
  // const [userName, setUserName] = useState("ADMIN");
  const router = useRouter();
  const [openTab, setOpenTab] = useState(false)

  // const [open, setOpen] = useState(false);
  // const [organizationOpen, setOrganizationOpen] = useState(false);

  // const handleClickOpen = () => {
  //   setOpen(true);
  // };

  // const handleClose = () => {
  //   setOpen(false);
  //   setOrganizationOpen(false);
  // };

  // useEffect(() => {
  //   setMobile(rdd.isMobile);
  //   if (rdd.isBrowser) {
  //     setToggleDrawer(true);
  //   }
  //   getUserDetail();
  // }, [mobile]);

  // const getUserDetail = () => {
  //   const user = localStorage.getItem("userDetail");
  //   if (!!user) {
  //     setUserDetail(JSON.parse(user));
  //     setUser(JSON.parse(user));
  //   } else {
  //     if (router.route !== "/" && router.route !== "/signup") {
  //       router.push("/");
  //     }
  //   }
  // };

  // useEffect(() => {
  //   getusername();
  //   router.events.on("routeChangeComplete", () => { });
  // }, [user, initial]);

  // const getOrg = () => {
  //   loader(true);
  //   Api("get", "organizations", "", router).then(
  //     async (res) => {
  //       loader(false);
  //       // ;
  //       if (res?.status) {
  //         setOrgList(res.data.users);
  //       } else {
  //         toaster({ type: "success", message: res?.message });
  //       }
  //     },
  //     (err) => {
  //       loader(false);
  //       toaster({ type: "error", message: err.message });
  //       console.log(err);
  //     }
  //   );
  // };

  // const getusername = () => {
  //   console.log(user);
  //   setUserName(user.username);
  //   // if (user.type !== "ADMIN") {

  //   // } else if (user.type === "ADMIN") {
  //   //   if (!!initial) {
  //   //     setUserName(initial.username);
  //   //   }
  //   // }
  //   // if (user.type === "ADMIN" && initial.username === undefined) {
  //   //   setUserName("ADMIN");
  //   // }

  //   // console.log(userName, initial);
  // };

  return (
    <div className="md:min-h-screen max-w-screen ">
      <div className="max-w-screen flex  relative ">
        {
          !(router.pathname.includes('/login') || router.pathname.includes('/signup') ||
            router.pathname.includes('/privacy-policy') ||
            router.pathname.includes('/terms-condition')) &&
          <SidePannel setOpenTab={setOpenTab} openTab={openTab} />
        }
        <div className="w-full xl:pl-[300px] md:pl-[250px] sm:pl-[200px]">
          <main className={"w-full max-h-screen overflow-auto  relative ]"}>
            {
              !(router.pathname.includes('/login') || router.pathname.includes('/signup') ||
                router.pathname.includes('/privacy-policy') ||
                router.pathname.includes('/terms-condition')) &&
              <Navbar setOpenTab={setOpenTab} openTab={openTab} />
            }
            {children}
          </main>
        </div>
      </div>

    </div>
  );
};

export default Layout;
