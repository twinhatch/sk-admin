import moment from 'moment'
import React, { useEffect, useMemo, useState } from 'react'
import { BsGraphUp } from 'react-icons/bs'
import { FaUser } from 'react-icons/fa'
import { products } from '@/utils/data'
import Table from '@/src/components/Table/table'
import { RxCross2 } from 'react-icons/rx'
import { AiFillEye } from 'react-icons/ai'
import { Api } from '@/utils/service'
import { useRouter } from 'next/router'


const Database = (props) => {

    const [popup, setPopUp] = useState(false)
    const [packagesData, setPackagesData] = useState([])
    const [productPopup, setProductPopup] = useState(false)
    const [popUpData, setPopUpData] = useState({});
    const [popupPackage, setPopupPackage] = useState({})
    const router = useRouter()

    const statusHandler = ({ value }) => {
        return (
            <div className=' p-4  flex items-center  justify-center'>
                <p className='font-semibold text-md text-green-400'>{value}</p>
            </div>
        )
    }

    const nameHandler = ({ value }) => {
        return (
            <div className=' p-4  flex items-center  justify-center'>
                <p className='font-semibold text-md '>{value}</p>
            </div>
        )
    }

    const idHandler = ({ value, row }) => {
        console.log(row)
        return (
            <div className=' p-4  flex items-center  justify-center gap-4'>
                <p className='font-semibold text-md text-blue-400'>{row?.original?.packagePlan?.track_id}</p>
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
                    const data = { ...row.original.packagePlan, user: row.original.packagerid }
                    setPopupPackage(data)
                }} >
                    <AiFillEye />
                </button>
            </div>
        )
    }

    const statussHandler = ({ value, row }) => {
        return (
            <div className='p-4  flex items-center  justify-center'>
                <p className='font-semibold text-md text-black'>{value}</p>
            </div>
        )
    }


    const columns = [
        {
            Header: "Post ID",
            accessor: "packagePlan.track_id",
            Cell: idHandler
        },
        {
            Header: "Customer",
            accessor: "packagerid.fullName",
            Cell: nameHandler
        },
        {
            Header: "Worth",
            accessor: "packagePlan.value",
            Cell: statusHandler
        },
        {
            Header: "Status",
            accessor: "packagePlan.jobStatus",
            Cell: statussHandler
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
        Api("get", '/api/getconnectionbyuser', '', router).then(
            (res) => {
                props.loader(false);
                console.log("res================>", res);
                setPackagesData(res.data)
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
                    <div className=' relative w-[300px] md:w-[450px] h-[400px] bg-white border-2 border-custom-blue rounded-md m-auto'>
                        <div className=' absolute top-2 right-2 p-1 rounded-full bg-custom-blue text-white w-12 h-12 cursor-pointer' onClick={() => setProductPopup(!productPopup)}>
                            <RxCross2 className='h-full w-full font-semibold' />
                        </div>
                        <h2 className='text-2xl font-semibold text-center mt-8'>{popupPackage?.name}</h2>
                        <div className='w-[200px] md:w-[250px] p-3 h-[200px] mx-auto flex items-center text-center'>
                            <img src={popupPackage?.item_image} alt="" className=' w-full h-full object-contain' />
                        </div>

                        <div className=' w-full  p-3 text-xl font-medium text-center '>
                            <p>{`Client Name : ${popupPackage?.user?.fullName}`}</p>
                            <p>{`Traveller Name : ${popupPackage?.user?.fullName}`}</p>
                            <p>{`Recepient : ${popupPackage?.phone}`}</p>
                        </div>

                    </div>
                </div>
            }
            <div className=' w-full space-y-4'>
                <div className='p-6 border-2 border-custom-blue rounded-2xl flex items-center justify-between'>
                    <div className='w-full'>
                        <p className='text-lg font-medium'>{`${moment(new Date()).format('DD-MMM-YYYY')} , ${moment(new Date()).format('dddd')}`}</p>
                        <h2 className='text-3xl font-medium'>Hello <span className='text-custom-blue'>Demomail</span></h2>
                    </div>
                    {/* <div>
                        <select className='border-2 !border-custom-blue p-2 rounded-md'>
                            <option value="">Package</option>
                            <option value="">Package</option>
                            <option value="">Package</option>
                        </select>
                    </div> */}
                </div>

                <div className='border-2 border-black rounded-md'>
                    <Table columns={columns} data={packagesData} />
                </div>
            </div>
        </section>
    )
}

export default Database