import moment from 'moment'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { BsGraphUp } from 'react-icons/bs'
import { FaUser } from 'react-icons/fa'
import { products } from '@/utils/data'
import Table from '@/src/components/Table/table'
import { RxCross2 } from 'react-icons/rx'
import { Api } from '@/utils/service'
import { useRouter } from 'next/router'
// import {  AiOutlineStar } from 'react-icons/ai'
import { Rating } from '@mui/material'
import { userContext } from './_app'
import ImageViewer from 'react-simple-image-viewer';
import { MdOutlineNavigateNext, MdClose } from "react-icons/md";




const Usermanagement = (props) => {

  const [popup, setPopUp] = useState(false)
  const [usersList, setUsersList] = useState([]);
  const [mainList, setmainList] = useState([]);
  const [popUpUser, setPopUpUser] = useState({});
  const [user, setUser] = useContext(userContext)
  const [activeTab, setActiveTab] = useState('userVerification');
  const [currentImage, setCurrentImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [images, setImages] = useState([]);


  const router = useRouter()

  const openImageViewer = useCallback((index) => {
    setCurrentImage(index);
    setIsViewerOpen(true);
  }, []);

  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  };

  const statusHandler = ({ value }) => {
    let statusClass = '';
    let statusText = value;

    if (value === 'Verified') {
      statusClass = 'text-green-500 ';
    } else if (value === 'Blocked') {
      statusClass = 'text-red-500 ';
    } else {
      statusClass = 'text-black';
    }

    return (
      <div className={`p-2 rounded-md flex items-center justify-center ${statusClass}`}>
        <p className='font-semibold text-md'>{statusText}</p>
      </div>
    );
  }


  const nameHandler = ({ value }) => {
    return (
      <div className=' p-4  flex items-center  justify-center'>
        <p className='font-semibold text-md '>{value}</p>
      </div>
    )
  }

  const idHandler = ({ value }) => {
    return (
      <div className=' p-4  flex items-center  justify-center gap-4'>
        {/* <input type="checkbox" className='border-2 border-custom-blue text-custom-blue w-5 h-5' /> */}
        <p className='font-semibold text-md text-blue-400'>#{value}</p>
      </div>
    )
  }

  const ratingHandler = ({ value, row }) => {
    return (
      <div className=' p-4  flex flex-col items-center  justify-center gap-4'>
        <Rating
          name='hover-feedback'
          value={value}
          precision={0.5}
          readOnly
        // onChangeActive={(event, newHover) => {
        //   setHoverValue(newHover);
        // }}
        />
        {/* <span className='font-semibold text-md text-gray-500'>
        {hoverValue !== -1 ? hoverValue : value}
      </span> */}
        <p>Completed Delivery : {row?.original?.completedDelivery || 0}</p>
      </div>
    )
  }

  const actionHandler = ({ value, row }) => {
    //console.log(row.original._id)
    return (
      <div className=' p-4  flex items-center  justify-center'>
        <button className='font-semibold text-md text-white py-2 px-4 rounded-md bg-custom-blue' onClick={() => {
          popUpHandler(row.original._id)
        }}>View</button>
      </div>
    )
  }

  // const checkBox = ({ value }) => {
  //   return (
  //     <div className=' p-4  flex items-center  justify-center'>
  //       <input type="checkbox" className='border-2 border-custom-blue text-custom-blue w-5 h-5' />
  //     </div>
  //   )
  // }

  const popUpHandler = (id) => {
    console.log(id)
    setPopUp(!popup)
    const data = usersList.filter((user) => id === user._id)[0]
    console.log(usersList.filter((user) => id === user._id)[0])
    setPopUpUser(data)
    console.log(data)
    // console.log(popup)
  }
  console.log(popUpUser)

  // const columns = [
  //   {
  //     Header: "UserId",
  //     accessor: "userID",
  //     Cell: idHandler
  //   },
  //   {
  //     Header: "Customer",
  //     accessor: "fullName",
  //     Cell: nameHandler
  //   },
  //   {
  //     Header: "Contact No.",
  //     accessor: "phone",
  //     Cell: nameHandler
  //   },
  //   {
  //     Header: "Email ID",
  //     accessor: "email",
  //     Cell: nameHandler
  //   },
  //   // {
  //   //   Header: "ID Proof",
  //   //   accessor: "verified",
  //   //   Cell: checkBox
  //   // },
  //   {
  //     Header: "Status",
  //     accessor: "status",
  //     Cell: statusHandler
  //   },
  //   {
  //     Header: "Action",
  //     accessor: "more",
  //     Cell: actionHandler
  //   },
  // ]

  const columns = useMemo(
    () => [

      {
        Header: "UserId",
        accessor: "userID",
        Cell: idHandler
      },
      {
        Header: "UserName",
        accessor: "fullName",
        Cell: nameHandler
      },
      {
        Header: "Contact No.",
        accessor: "phone",
        Cell: nameHandler
      },
      {
        Header: "Email ID",
        accessor: "email",
        Cell: nameHandler
      },
      // {
      //   Header: "ID Proof",
      //   accessor: "verified",
      //   Cell: checkBox
      // },
      {
        Header: "Status",
        accessor: "status",
        Cell: statusHandler
      },
      {
        Header: "Action",
        accessor: "more",
        Cell: actionHandler
      },
    ],
    [usersList]
  );


  const columnsAllUsers = [
    {
      Header: "UserId",
      accessor: "userID",
      Cell: idHandler
    },
    {
      Header: "UserName",
      accessor: "fullName",
      Cell: nameHandler
    },
    {
      Header: "Contact No.",
      accessor: "phone",
      Cell: nameHandler
    },
    {
      Header: "Email ID",
      accessor: "email",
      Cell: nameHandler
    },
    {
      Header: "Rating",
      accessor: "rate",
      Cell: ratingHandler
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: statusHandler
    },
    {
      Header: "Action",
      accessor: "more",
      Cell: actionHandler
    },
  ];


  const getAllUsers = async () => {
    props.loader(true);
    Api("get", '/api/getUsers', '', router).then(
      (res) => {
        props.loader(false);
        console.log("res================>", res);
        setUsersList(res.data)
        setmainList(res.data)
      },
      (err) => {
        props.loader(false);
        console.log(err);
        props.toaster({ type: "error", message: err?.message });
      }
    );
  }



  const verifyUser = (status) => {
    props.loader(true);
    Api("post", '/api/verifyUser', { status, user_id: popUpUser._id }, router).then(
      (res) => {
        props.loader(false);
        console.log("res================>", res);
        setPopUp(false);
        getAllUsers();
      },
      (err) => {
        props.loader(false);
        console.log(err);
        props.toaster({ type: "error", message: err?.message });
      }
    );
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };


  useEffect(() => {
    getAllUsers()
  }, [])

  const filterData = (event) => {
    console.log(event)
    if (event?.target?.value.length > 0) {
      const newdata = mainList.filter(f => f.userID.includes(event.target.value))
      console.log(newdata)
      setUsersList(newdata)
    } else {
      setUsersList(mainList)
    }
  }

  return (
    <section className=' p-4'>

      {
        popup &&
        <div className='fixed top-0 left-0 w-screen h-screen bg-black/30 flex justify-center items-center z-40'>
          {/* {isViewerOpen && (
            <div className='z-50'>
              <ImageViewer
                backgroundStyle={{ background: 'rgb(0 0 0 / 0.3)', }}
                src={images}
                currentIndex={currentImage}
                disableScroll={false}
                closeOnClickOutside={true}
                onClose={closeImageViewer}
                closeComponent={<MdClose className='text-white' />}
                rightArrowComponent={<MdOutlineNavigateNext className='text-white' />}
              />
            </div>
          )} */}
          <div className='w-[300px] md:w-[450px] p-5 pb-10   bg-white border-2 border-custom-blue rounded-md m-auto'>
            <div className='p-3 flex justify-between items-center'>
              <div className='flex gap-2 items-center'>
                <div className='rounded-full  bg-white text-black w-12 h-12'
                  onClick={() => {
                    setImages([popUpUser?.profile, popUpUser?.idproof]);
                    openImageViewer()
                  }}
                >
                  <img src={popUpUser?.profile} alt="" className='rounded-full w-12 h-12 border-2 border-black' />
                </div>
                <div className='text-lg flex flex-col'>
                  <p>{popUpUser?.fullName}</p>
                  <p className='text-sm -mt-2'>{popUpUser?.email}</p>
                </div>
              </div>


              <div className='p-1 rounded-full bg-custom-blue text-white w-12 h-12 cursor-pointer' onClick={() => setPopUp(!popup)}>
                <RxCross2 className='h-full w-full font-semibold' />
              </div>
            </div>
            {/* <div className='w-[250px] md:w-[300px] p-3 h-[200px] mx-auto' onClick={() => {
              setImages([popUpUser?.idproof, popUpUser?.profile]);
              openImageViewer()
            }}>
              <img src={popUpUser?.idproof} alt="" className='w-full h-full object-cover border-2' />
            </div> */}

            {/* <div className='flex items-center justify-center gap-4'>
              <div className='flex items-center gap-2'>
                <input type="checkbox" name="" id="" className='w-4 h-4' />
                <p>ID Proof</p>
              </div>
              <div className='flex items-center gap-2'>
                <input type="checkbox" name="" id="" className='w-4 h-4' />
                <p>Photograph</p>
              </div>
            </div> */}
            {popUpUser.verified && <div className='flex flex-col items-center justify-center'>
              <p>ID Type : {popUpUser.idproofType}</p>
              <p>ID No : {popUpUser.idproof}</p>
              {popUpUser.dob && <p>DOB : {moment(popUpUser.dob).format('DD/MM/YYYY')}</p>}
            </div>}
            {!popUpUser.verified && <div className='flex flex-col items-center justify-center'>
              <p className='text-red-700'>ID not Verified</p>
            </div>}
            <div className='w-[250px] md:w-[300px] p-3 mx-auto flex justify-between items-center '>
              <button className='text-white text-lg bg-green-500 py-2 px-6 w-[100px] rounded-md' onClick={() => verifyUser('Verified')}>Verify</button>
              <button className='text-white text-lg bg-red-500 py-2  w-[100px] rounded-md' onClick={() => verifyUser('Blocked')}>Suspend</button>
            </div>

          </div>
        </div>
      }



      <div className='w-full space-y-4'>
        <div className='p-6 border-2 border-custom-blue rounded-2xl md:flex justify-between'>
          <div>
            <p className='text-lg font-medium'>
              {`${moment(new Date()).format('DD-MMM-YYYY')} , ${moment(new Date()).format('dddd')}`}
            </p>
            <h2 className='text-3xl font-medium'>
              Hello <span className='text-custom-blue'>{user.fullName}</span>
            </h2>
          </div>

          <h6 className=' text-black'>
            Search: <input placeholder='Search By UserID' className='border border-black text-sm rounded-md px-5  py-1' onChange={filterData} />
          </h6>
        </div>
        <div className='grid md:grid-cols-3 gap-4'>
          <div
            className={`${activeTab === 'userVerification' ? 'bg-custom-blue' : 'border-2 border-custom-blue'
              } p-4 flex rounded-xl text-white cursor-pointer`}
            onClick={() => handleTabChange('userVerification')}
          >
            <div className={`text-xl w-full ${activeTab === 'userVerification' ? 'text-white' : 'text-black'}`}>
              <p>User Verification</p>
            </div>
            <div className={`w-14 h-full flex items-center${activeTab === 'userVerification' ? 'text-white' : 'text-black'}`}>
              <BsGraphUp className='text-3xl' />
            </div>
          </div>
          <div
            className={`${activeTab === 'allUsers' ? 'bg-custom-blue' : 'border-2 border-custom-blue'
              } p-4 flex rounded-xl text-white cursor-pointer`}
            onClick={() => handleTabChange('allUsers')}
          >
            <div className={`text-xl w-full ${activeTab === 'allUsers' ? 'text-white' : 'text-black'}`}>
              <p>All Users</p>
            </div>
            <div className='w-14 h-full flex items-center'>
              <FaUser className='text-3xl' />
            </div>
          </div>
        </div>
        {activeTab === 'userVerification' ? (
          <div className='border-2 border-black rounded-md'>
            <Table columns={columns} data={usersList} />
          </div>
        ) : (
          <div className='border-2 border-black rounded-md'>
            <Table columns={columnsAllUsers} data={usersList} />
          </div>
        )}
      </div>
    </section>

  )
}

export default Usermanagement