import '@/styles/globals.css'
// import 'styles/tailwind.css'
import { useEffect, useState, createContext } from "react";
import Loader from "../src/components/loader";
import Toaster from "../src/components/toaster";
import Layout from '@/src/components/layouts';
import { useRouter } from 'next/router';
import OneSignal from 'react-onesignal';
import { socket } from '@/utils/socket';

export const userContext = createContext();

export default function App({ Component, pageProps }) {
  // return <Component {...pageProps} />
  const [user, setUser] = useState({});
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState({
    type: "",
    message: "",
  });



  useEffect(() => {
    setToast(toast);
    if (!!toast.message) {
      setTimeout(() => {
        setToast({ type: "", message: "" });
      }, 5000);
    }
  }, [toast]);

  // useEffect(() => {
  //   //console.log(localStorage.getItem('TravelUser'))
  //   let data = (localStorage.getItem('TravelUser'))

  //   if (data) {
  //     if(!(router.pathname.includes('refund-policy') ||
  //     router.pathname.includes('terms-conditions') ||
  //     router.pathname.includes('privacy-policy') ||
  //     router.pathname.includes('ship-delivery') ||
  //     router.pathname.includes('order-checkout'))){

  //     }
  //     setUser(JSON.parse(data))
  //     // console.log(JSON.parse(data))
  //   } else {
  //     router.push('/login')
  //   }
  // }, [])

  const setUserToken = () => {
    let data = JSON.parse(localStorage.getItem("TravelUser")) || {};

    if (!data.token) {
      if (!(router.pathname.includes('refund-policy') ||
        router.pathname.includes('terms-condition') ||
        router.pathname.includes('privacy-policy') ||
        router.pathname.includes('ship-delivery') ||
        router.pathname.includes('order-checkout'))) {
        router.push('/login')
      }
    } else {
      setUser(data);
      if (!data.roll === 'SUPERADMIN') {
        router.push('/')
      } else {
        router.push('/user-management')
      }
    }
  };
  useEffect(() => {
    setUserToken();
    loadOneSignal()
    socket.on('connect', () => {
      console.log('hguguug', socket.id);
    });

    // window.OneSignalDeferred = window.OneSignalDeferred || [];
    // OneSignalDeferred.push(function () {
    //   OneSignal.init({
    //     appId: "c61d8ac3-8c4a-4160-b6c5-6241136b4f54",
    //     // notifyButton: {
    //     //   enable: true,
    //     // },

    //     // allowLocalhostAsSecureOrigin: true,
    //   });
    // });

    return () => {
      socket.off('allmessages');
      socket.off('messages');
      socket.off('joinRoom');
      socket.off('join');
      socket.on('disconnect', () => {
        console.log('Disconnected from server');
      });
    };
  }, [])

  const loadOneSignal = async () => {
    await OneSignal.init({ appId: 'c61d8ac3-8c4a-4160-b6c5-6241136b4f54' });

  }




  return (
    <>

      <userContext.Provider value={[user, setUser]}>

        <Loader open={open} />
        {/* <Html lang="en">
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Nunito:wght@200;300;400;500;600;700;800;900;1000&display=swap"
            rel="stylesheet"
          ></link> */}
        <div className="fixed right-5 top-20 min-w-max z-50">
          {!!toast.message && (
            <Toaster type={toast.type} message={toast.message} />
          )}
        </div>
        <Layout loader={setOpen} toaster={setToast}>
          <Loader open={open} />
          <div className="fixed right-5 top-20 min-w-max">
            {!!toast.message && (
              <Toaster type={toast.type} message={toast.message} />
            )}
          </div>
          {user && <Component
            {...pageProps}
            loader={setOpen}
            toaster={setToast}
            user={user}
          />}
        </Layout>
      </userContext.Provider>
    </>
  );
}
