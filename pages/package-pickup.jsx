import moment from 'moment'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { BsGraphUp } from 'react-icons/bs'
import { FaUser } from 'react-icons/fa'
import { products } from '@/utils/data'
import Table from '@/src/components/Table/table'
import { RxCross2 } from 'react-icons/rx'
import { AiFillEye } from 'react-icons/ai'
import { Api } from '@/utils/service'
import { useRouter } from 'next/router'
import { userContext } from './_app'

const PackagePickup = (props) => {

  const [popup, setPopUp] = useState(false)
  const [packagesData, setPackagesData] = useState([])
  const [productPopup, setProductPopup] = useState(false)
  const [popUpData, setPopUpData] = useState({});
  const [popupPackage, setPopupPackage] = useState({})
  const [user, setUser] = useContext(userContext)
  const [mainList, setmainList] = useState([]);
  const router = useRouter()

  const statusHandler = ({ value }) => {
    return (
      <div className=' p-4  flex items-center  justify-center'>
        <p className='font-semibold text-md text-blue-400'>{value?.toString()}</p>
      </div>
    )
  }


  const packageNameHandler = ({ value }) => {
    return (
      <div className=' p-4  flex items-center  justify-center'>
        <p className='font-semibold text-md text-black'>{value}</p>
      </div>
    )
  }

  const nameHandler = ({ value, row }) => {
    return (
      <div className=' p-4  flex flex-col items-center  justify-center'>
        <p className='font-semibold text-md '>{value}</p>
        <p className='font-semibold text-md '>UserID #{row?.original?.user?.userID}</p>
      </div>
    )
  }

  const nameHandler2 = ({ value, row }) => {
    return (
      <div className=' p-4  flex flex-col items-center  justify-center'>
        <p className='font-semibold text-md '>{value?.travellerid?.fullName}</p>
        {value?.travellerid?.userID && <p className='font-semibold text-md '>UserID <span className='font-semibold text-md text-blue-400'>#{value?.travellerid?.userID}</span></p>}
        {row?.original?.connection?.travelPlan?.track_id && < p className='font-semibold text-md '>PostID <span className='font-semibold text-md text-blue-400'>#{row?.original?.connection?.travelPlan?.track_id}</span></p>}
      </div >
    )
  }

  const idHandler = ({ value, row }) => {
    return (
      <div className=' p-4  flex items-center  justify-center gap-4'>
        <p className='font-semibold text-md text-blue-400'>#{value}</p>
      </div>
    )
  }

  const actionHandler = ({ value, row }) => {
    const isRejected = row.original.status === 'Rejected';

    const buttonClass = isRejected
      ? 'font-semibold text-md text-white py-2 px-4 rounded-md bg-red-500'
      : 'font-semibold text-md text-white py-2 px-4 rounded-md bg-green-500';
    const statuses = ["PENDING", "REJECTED"]
    return (
      <div className='p-4 flex items-center justify-center'>
        <button disabled={!statuses.includes(row?.original?.jobStatus)}
          className={buttonClass} onClick={() => popUpHandler(row.original._id)}>
          {isRejected ? 'Rejected' : 'Approved'}
        </button>
      </div>
    );

  }

  const popUpHandler = (id) => {
    console.log(id)
    setPopUp(!popup)
    setProductPopup(false)
    const data = packagesData.filter((pack) => id === pack._id)
    // console.log(usersList.filter((user) => id === user._id)[0])
    setPopUpData(data[0])
    console.log(data)
    // console.log(popup)
  }
  const packagesPophandler = (id) => {
    console.log(id)
    setPopUp(false)
    setProductPopup(!productPopup)
    const data = packagesData.filter((pack) => id === pack._id)
    // console.log(usersList.filter((user) => id === user._id)[0])
    setPopupPackage(data[0])
    console.log(data)
    // console.log(popup)

  }

  const verifyPackage = (status) => {
    props.loader(true);

    const requestBody = {
      status: status,
      package_id: popUpData._id,
    };

    Api("post", '/api/verifyPackage', requestBody, router).then(
      (res) => {
        props.loader(false);
        console.log("Verify Package Response:", res);

        if (status === 'Rejected') {
          console.log("Package rejected");
          const updatedPackagesData = packagesData.map(packageItem => {
            if (packageItem._id === popUpData._id) {
              return { ...packageItem, status: 'Rejected' };
            }
            return packageItem;
          });
          setPackagesData(updatedPackagesData);
        }

        setPopUp(false);
        getPackages()
      },
      (err) => {
        props.loader(false);
        console.log(err);
        props.toaster({ type: "error", message: err?.message });
      });
  }





  console.log(popupPackage)

  const viewBtn = ({ value, row }) => {
    return (
      <div className=' p-4  flex items-center  justify-center'>
        <button className='font-semibold text-lg text-black py-1 px-4 rounded-md bg-custom-yellow flex gap-1 items-center' onClick={() => {
          packagesPophandler(row.original._id)
        }} >
          <AiFillEye /> View
        </button>
      </div>
    )
  }

  const status = (data) => {
    if (new Date(data.accepted_delivery_date) > new Date()) {
      return false
    }

    if (new Date(data.accepted_delivery_date) < new Date()) {
      return true
    }

    return false
  }

  const timeup = (data) => {
    const newdate = new Date().setDate(new Date().getDate() - 5)
    if (new Date(data.createdAt) > new Date(newdate)) {
      return false
    }

    if (new Date(data.createdAt) < new Date(newdate)) {
      return true
    }

    return false
  }

  const finalDateUp = (data) => {
    if (data.finaldeliveryDate) {
      const newdate = new Date().setDate(new Date().getDate() - 2)
      if (new Date(data.finaldeliveryDate) > new Date(newdate)) {
        return false
      }

      if (new Date(data.finaldeliveryDate) < new Date(newdate)) {
        return true
      }
    }
    return false
  }

  const updatedStatus = (expression) => {
    switch (expression) {
      case 'PICUPED': return 'PICKEDUP'
      case 'PENDING': return 'Waiting for Traveller'
      case 'REJECTED': return 'Waiting for Traveller'
      case 'REVOKE': return 'Waiting for Traveller'
      case 'PICKUP': return 'Pickup Confirmation Pending'
      case 'PENDING': return 'Delivery Confirmation Pending'
      default: return expression
    }
  }


  const statussHandler = ({ value, row }) => {
    return (
      <div className='p-4  flex items-center flex-col  justify-center'>
        <p className='font-semibold text-md text-black  capitalize'>{row?.original?.active ? updatedStatus(row?.original?.jobStatus) : "CANCELLED"}</p>
        {(row?.original?.jobStatus === 'PICUPED' || row?.original?.jobStatus === 'ACCEPT') && status(row?.original) && <p className='font-semibold text-md text-red-700'>Undelivered</p>}
        {(row?.original?.jobStatus === 'PENDING' || row?.original?.jobStatus === 'REJECTED') && timeup(row?.original) && row?.original?.active && <p className='font-semibold text-md text-red-700'>Time Up</p>}
        {(row?.original?.jobStatus === 'DELIVER') && finalDateUp(row?.original) && row?.original?.active && <p className='font-semibold text-md text-red-700'> Delivery Confirmation Pending</p>}
      </div>
    )
  }


  const columns = [
    {
      Header: "Post ID",
      accessor: "track_id",
      Cell: idHandler
    },
    {
      Header: "UserName",
      accessor: "user.fullName",
      Cell: nameHandler
    },
    {
      Header: "Package Name",
      accessor: "name",
      Cell: packageNameHandler
    },
    {
      Header: "Worth",
      accessor: "value",
      Cell: statusHandler
    },

    {
      // Header: "ID Proof",
      Header: "Assigned",
      accessor: "connection",
      Cell: nameHandler2
    },
    {
      Header: "Status",
      accessor: "jobStatus",
      Cell: statussHandler
    },
    {
      // Header: "ID Proof",
      Header: "Package Detail",
      accessor: "user.idproof",
      Cell: viewBtn
    },
    {
      Header: "Action",
      accessor: "more",
      Cell: actionHandler
    },
  ]


  const getPackages = async () => {
    props.loader(true);
    Api("get", '/api/getpackages', '', router).then(
      (res) => {
        props.loader(false);
        console.log("res================>", res);
        setPackagesData(res.data)
        setmainList(res.data)
      },
      (err) => {
        props.loader(false);
        console.log(err);
        props.toaster({ type: "error", message: err?.message });
      }
    );
  }

  //console.log(packagesData)

  useEffect(() => {
    getPackages()
  }, [])


  const filterData = (event) => {
    console.log(event)
    if (event?.target?.value.length > 0) {
      const newdata = mainList.filter(f => f?.user?.userID?.includes(event.target.value) || f?.track_id?.toString()?.includes(event.target.value))
      // const newdata = mainList.filter(f => { console.log(f.track_id) })
      setPackagesData(newdata)
    } else {
      setPackagesData(mainList)
    }
  }

  return (
    <section className=' p-4'>
      {
        popup &&
        <div className='fixed top-0 left-0 w-screen h-screen bg-black/30 flex justify-center items-center z-50'>
          <div className='w-[300px] md:w-[450px] h-[400px] bg-white border-2 border-custom-blue rounded-md m-auto'>
            <div className='p-3 flex justify-between items-center'>
              <div className='flex gap-2 items-center'>
                <div className='rounded-full w-12 h-12'>
                  <img src={popUpData?.user?.profile} className=' w-12 h-12 rounded-full object-center object-cover  border-2 border-black bg-white text-black' alt="" />
                </div>
                <div className='text-lg flex flex-col'>
                  <div className='text-lg flex flex-col'>
                    <p>{popUpData?.user?.fullName}</p>
                    <p className='text-sm -mt-2'>{popUpData?.user?.email}</p>
                  </div>
                </div>
              </div>
              <div className='p-1 rounded-full bg-custom-blue text-white w-12 h-12 cursor-pointer' >
                <RxCross2 onClick={() => setPopUp(!popup)} className='h-full w-full font-semibold' />
              </div>
            </div>
            {/*  */}
            {/* <div className='w-[300px] md:w-[450px] h-[400px] flex items-center text-center'>
              <img src={popUpData?.item_image} alt="" className=' w-[100px] h-[100px] object-contain self-center' />
            </div> */}
            <div className='w-[250px] md:w-[300px] p-3 h-[200px] mx-auto flex items-center text-center'>
              <p className='text-3xl font-semibold'>{`Do you want to ${popUpData.status === 'Rejected' ? 'Approve' : 'Reject'} the Product ?`}</p>
            </div>

            <div className='w-[250px] md:w-[300px] p-3 mx-auto flex justify-between items-center '>
              <button className='text-white text-lg bg-green-500 py-2  w-[100px] text-center rounded-md' onClick={() => verifyPackage(popUpData.status === 'Rejected' ? 'Approved' : 'Rejected')}>{popUpData.status === 'Rejected' ? 'Approve' : 'Reject'}</button>
              <button className='text-white text-lg bg-red-500 py-2  w-[100px] rounded-md' onClick={() => setPopUp(!popup)}>Close</button>
            </div>

          </div>
        </div>
      }
      {
        productPopup &&
        <div className='fixed top-0 left-0 w-screen h-screen bg-black/30 flex justify-center items-center z-50'>
          <div className=' relative w-[300px] md:w-[550px] h-auto  bg-white border-2 border-custom-blue rounded-md m-auto'>
            <div className=' absolute top-2 right-2 p-1 rounded-full bg-custom-blue text-white w-12 h-12 cursor-pointer' onClick={() => setProductPopup(!productPopup)}>
              <RxCross2 className='h-full w-full font-semibold' />
            </div>
            <h2 className='text-2xl font-semibold text-center mt-8'>{popupPackage?.name}</h2>
            <div className='w-[200px] md:w-[250px] p-3 h-[200px] mx-auto flex items-center text-center'>
              <img src={popupPackage?.item_image} alt="" className=' w-full h-full object-contain' />
            </div>

            <div className=' w-full p-5 text-xl font-medium text-start '>
              <p className='pb-1'><span className='font-bold'>Client Name</span>{`: ${popupPackage?.user?.fullName}`}</p>
              <p className='pb-1'><span className='font-bold'>Phone Number </span>{`: ${popupPackage?.phone}`}</p>
              <p className='pb-1'><span className='font-bold'>Address</span>{`: ${popupPackage?.pickupaddress}`}</p>
              <p className='pb-1'><span className='font-bold'>Delivery Address</span>{`: ${popupPackage?.fulldelivery_address}`}</p>
              <p className='pb-1'><span className='font-bold'>Worth</span>{`: ${popupPackage?.value}`}</p>
              <p className='pb-1'><span className='font-bold'>Weight</span>{`: ${popupPackage?.weight}`}</p>
              {popupPackage?.track_address && <p className='pb-1'><span className='font-bold'>Last Track</span>{`: ${popupPackage?.track_address}`}</p>}
            </div>

          </div>
        </div>
      }
      <div className=' w-full space-y-4'>
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
            Search: <input placeholder=' UserID or PostID' className='border border-black text-sm rounded-md px-5  py-1' onChange={filterData} />
          </h6>
        </div>

        <div className='border-2 border-black rounded-md'>
          <Table columns={columns} data={packagesData} from='travel' />
        </div>
      </div>
    </section>
  )
}

export default PackagePickup