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


const Database = (props) => {

    const [popup, setPopUp] = useState(false)
    const [packagesData, setPackagesData] = useState([])
    const [productPopup, setProductPopup] = useState(false)
    const [popUpData, setPopUpData] = useState({});
    const [popupPackage, setPopupPackage] = useState({})
    const [user, setUser] = useContext(userContext)
    const [mainList, setmainList] = useState([]);
    const router = useRouter()

    const statusHandler = ({ value, row }) => {
        return (
            <div className=' p-4  flex items-center  justify-center'>

                <p className='font-semibold text-md text-green-400'>{value}</p>
            </div>
        )
    }

    const nameHandler = ({ value, row }) => {
        return (
            <div className=' p-4  flex flex-col items-center  justify-center'>
                <p className='font-semibold text-md '>{value}</p>
                <p className='font-semibold text-md '>UserID #{row?.original?.user?.userID}</p>
                <p className='font-semibold text-md '>Completed Deliveries :{row?.original?.user?.completedDelivery}</p>
            </div>
        )
    }

    const destination = ({ value, row }) => {
        return (
            <div className=' p-4 w-[500px] flex-wrap whitespace-break-spaces	flex flex-col self-center '>
                <p className='font-semibold text-md  text-center'>{value}</p>
            </div>
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

        return (
            <div className='p-4 flex items-center justify-center'>
                <button className={buttonClass} onClick={() => popUpHandler(row.original._id)}>
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
    const packagesPophandler = (plan) => {
        // console.log(id)
        // setPopUp(false)
        // setProductPopup(!productPopup)
        // const data = packagesData.filter((pack) => id === pack.packagePlan._id)
        // // console.log(usersList.filter((user) => id === user._id)[0])
        // setPopupPackage(data[0])
        // console.log(data)
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
                    // packagesPophandler(row.original.packagePlan);
                    setPopUp(false)
                    setProductPopup(!productPopup)
                    const data = { ...row.original }
                    setPopupPackage(data)
                }} >
                    <AiFillEye />
                </button>
            </div>
        )
    }

    const statussHandler = ({ value, row }) => {
        return (
            <div className='p-4 flex flex-col items-center  justify-center'>
                <img src='/google-maps.png' className='h-10 w-10' onClick={() => {
                    console.log(row.original.user)
                    window.open(`http://maps.google.com/maps?q=${row.original.user.track.coordinates[1]},${row.original.user.track.coordinates[0]}`)
                }} />
                <p className='font-semibold max-w-xs whitespace-break-spaces text-md text-black mt-2'>{value ? status(row.original) : 'Cancelled'}</p>
            </div>
        )
    }

    const assignedPackages = ({ row }) => {
        return (
            <div className='p-4 flex flex-col items-center  justify-center'>
                {row.original?.connection?.length > 0 && <p className='font-semibold  whitespace-break-spaces text-md text-black mt-2 max-w-xs'>Post ID: {row.original?.connection.map((item, i) => (<span className='text-blue-400' key={i}>#{item?.packagePlan?.track_id},{' '}</span>))}</p>}
            </div>
        )
    }

    const status = (data) => {
        if (new Date(data.jurney_date) > new Date()) {
            return 'Pending'
        }

        if (new Date(data.jurney_date) < new Date() && new Date(data.estimate_time) > new Date()) {
            return 'Departed'
        }

        if (new Date(data.estimate_time) < new Date()) {
            return 'Arrived'
        }
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
            Header: "MOT",
            accessor: "mot",
            Cell: statusHandler
        },
        {
            Header: "Status",
            accessor: "active",
            Cell: statussHandler
        },
        {
            Header: "Packages",
            // accessor: "active",
            Cell: assignedPackages
        },
        {
            Header: "Location",
            accessor: "fromaddress",
            Cell: destination
        },
        {
            Header: "Destination",
            accessor: "toaddress",
            Cell: destination
        },
        {
            // Header: "ID Proof",
            Header: "Action",
            accessor: "packagerid.idproof",
            Cell: viewBtn
        },

        // {
        //     Header: "Action",
        //     accessor: "more",
        //     Cell: actionHandler
        // },
    ]


    const getPackages = async () => {
        props.loader(true);
        Api("get", '/api/gettravelplan', '', router).then(
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
            const newdata = mainList.filter(f => f?.user?.userID?.includes(event.target.value))
            setPackagesData(newdata)
        } else {
            setPackagesData(mainList)
        }
    }

    const filterDatafromto = (event, type) => {
        console.log(event)

        if (event?.target?.value.length > 0) {
            let newdatas;
            // if(type)
            newdatas = packagesData.filter(f => f[type]?.toLowerCase()?.includes(event.target.value.toLowerCase()))
            setPackagesData(newdatas)
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
                            <p className='text-3xl font-semibold'>Do you want to Reject the Product ?</p>
                        </div>

                        <div className='w-[250px] md:w-[300px] p-3 mx-auto flex justify-between items-center '>
                            <button className='text-white text-lg bg-green-500 py-2 px-6 w-[100px] rounded-md' onClick={() => verifyPackage('Rejected')}>Reject</button>
                            <button className='text-white text-lg bg-red-500 py-2  w-[100px] rounded-md' onClick={() => setPopUp(!popup)}>Close</button>
                        </div>

                    </div>
                </div>
            }
            {
                productPopup &&
                <div className='fixed top-0 left-0 w-screen h-screen bg-black/30 flex justify-center items-center z-50'>
                    <div className=' relative w-[300px] md:w-[450px] min-h-[400px] bg-white border-2 border-custom-blue rounded-md m-auto'>
                        <div className=' absolute top-2 right-2 p-1 rounded-full bg-custom-blue text-white w-12 h-12 cursor-pointer' onClick={() => setProductPopup(!productPopup)}>
                            <RxCross2 className='h-full w-full font-semibold' />
                        </div>
                        <h2 className='text-2xl font-semibold text-center mt-8'>{popupPackage?.name}</h2>
                        <div className='w-[300px] md:w-[450px]  flex items-center justify-center'>
                            <img src={popupPackage?.user?.profile} alt="" className=' w-[100px] h-[100px] rounded-full object-cover' />
                        </div>

                        <div className=' w-full  p-5 text-xl font-medium text-start'>
                            <p className='pb-1 text-base'><span className='font-bold'>Traveller Name</span>{`: ${popupPackage?.user?.fullName}`}</p>
                            <p className='pb-1 text-base'><span className='font-bold'>Phone Number</span>{`: ${popupPackage?.user?.phone}`}</p>
                            <p className='pb-1 text-base'><span className='font-bold'>From Address</span>{`: ${popupPackage?.fromaddress}`}</p>
                            <p className='pb-1 text-base'><span className='font-bold'>To Address</span>{`: ${popupPackage?.toaddress}`}</p>
                            <p className='pb-1 text-base'><span className='font-bold'>Departure Date & Time</span>{`: ${moment(popupPackage?.jurney_date).format('DD/MM/YYYY, hh:mm A')}`}</p>
                            <p className='pb-1 text-base'><span className='font-bold'>Arrival Date & Times</span>{`: ${moment(popupPackage?.estimate_time).format('DD/MM/YYYY, hh:mm A')}`}</p>
                            {popupPackage?.track_address && < p className='pb-1 text-base'><span className='font-bold'>Last Track</span>{`: ${popupPackage?.track_address}`}</p>}
                            <p className='pb-1 text-base'><span className='font-bold'>Active</span>{`: ${popupPackage?.active?.toString()}`}</p>
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
                    <div className=''>
                        <h6 className=' text-black'>
                            Search: <input placeholder='Search By UserID' className='border border-black text-sm rounded-md px-5  py-1' onChange={filterData} />
                        </h6>
                        <div className='flex mt-5 gap-5'>
                            <h6 className=' text-black'>
                                From: <input placeholder='From Location' className='border border-black text-sm rounded-md px-5  py-1' onChange={(text) => filterDatafromto(text, 'fromaddress')} />
                            </h6>
                            <h6 className=' text-black'>
                                To: <input placeholder='To Location' className='border border-black text-sm rounded-md px-5  py-1' onChange={(text) => filterDatafromto(text, 'toaddress')} />
                            </h6>
                        </div>

                    </div>

                </div>

                <div className='border-2 border-black rounded-md'>
                    <Table columns={columns} data={packagesData} from='travel' />
                </div>
            </div>
        </section >
    )
}

export default Database