import moment from 'moment'
import React, { useMemo, useEffect, useState } from 'react'
import { BiRupee, BiStar } from 'react-icons/bi'
import { FaUser } from 'react-icons/fa'
import { products } from '@/utils/data'
import Table, { indexID } from '@/src/components/Table/table'
import { RxCross2 } from 'react-icons/rx'
import { FaSackDollar } from 'react-icons/fa6'
import { BsSearch, BsStarFill } from 'react-icons/bs'
import { Api } from '@/utils/service'
import { useRouter } from 'next/router';
import { Rating } from '@mui/material'

const SupportHelp = (props) => {
    const router = useRouter();
    const [ratingsData, setRatingsData] = useState([])

    // const statusHandler = ({ value }) => {
    //     return (
    //         <div className=' p-4  flex items-center  justify-center'>
    //             <p className='py-1 px-5 border-2 border-custom-blue rounded-md'>{600}</p>
    //         </div>
    //     )
    // }

    // const nameHandler = ({ value }) => {
    //     return (
    //         <div className=' p-4  flex items-center  justify-center'>
    //             <p className='font-semibold text-md '>{value}</p>
    //         </div>
    //     )
    // }

    // const idHandler = ({ value }) => {
    //     return (
    //         <div className=' p-4  flex items-center  justify-center gap-4'>
    //             <input type="checkbox" className='border-2 border-custom-blue text-custom-blue w-5 h-5' />
    //             <p className='font-semibold text-md text-blue-400'>#00{value}</p>
    //         </div>
    //     )
    // }

    // const actionHandler = ({ value }) => {
    //     return (
    //         <div className=' p-4  flex items-center  justify-center'>
    //             <button className='font-semibold text-md text-white py-2 px-4 rounded-md bg-green-500'>Complete</button>
    //         </div>
    //     )
    // }

    // const Refund = ({ value }) => {
    //     return (
    //         <div className=' p-4  flex items-center  justify-center'>
    //             <p className='py-1 px-5 border-2 border-custom-blue rounded-md'>{600}</p>
    //         </div>
    //     )
    // }

    // const columns = useMemo(
    //     () => [
    //         {
    //             Header: "UserId",
    //             accessor: "id",
    //             Cell: idHandler
    //         },
    //         {
    //             Header: "Customer",
    //             accessor: "name",
    //             Cell: nameHandler
    //         },
    //         {
    //             Header: "Refund",
    //             accessor: "number",
    //             Cell: Refund
    //         },
    //         {
    //             Header: "Wallet",
    //             accessor: "status",
    //             Cell: statusHandler
    //         },
    //         {
    //             Header: "Refund Status",
    //             accessor: "more",
    //             Cell: actionHandler
    //         },
    //     ],
    //     []
    // );

    const profile = ({ value, row }) => {
        console.log(row.original)
        return (
            <div className=' p-4  flex items-center  justify-center'>
                {/* <p className='h-10 w-10 bg-custom-blue rounded-full text-white text-base font-normal flex justify-center items-center'>{row?.original?.user?.fullName?.charAt(0).toUpperCase()}</p> */}
                <img className='h-10 w-10 bg-custom-blue rounded-full' src={row?.original?.user?.profile} />
            </div>
        )
    }

    const name = ({ value, row }) => {
        return (
            <div className=' p-4  flex items-center  justify-center'>
                <p className='text-black font-semibold text-md'>{row?.original?.user?.fullName}</p>
            </div>
        )
    }

    const email = ({ value, row }) => {
        return (
            <div className=' p-4  flex items-center  justify-center'>
                <p className='text-black font-semibold text-md'>{row?.original?.user?.email}</p>
            </div>
        )
    }

    const rating = ({ value, row }) => {
        return (
            <div className='p-4 flex items-center justify-center gap-4'>
                {/* <p className='text-black font-semibold text-md'>{row?.original?.rating}</p> */}
                <Rating
                    // disabled={true}
                    readOnly={true}
                    name='hover-feedback'
                    value={row?.original?.rating}
                    precision={0.5} />
            </div>
        )
    }


    const idHandler = ({ value }) => {
        return (
            <div className=' p-4  flex items-center  justify-center gap-4'>
                <p className='font-semibold text-md text-blue-400'>#{value}</p>
            </div>
        )
    }
    const columns = [
        {
            Header: "UserID",
            accessor: "user.userID",
            Cell: idHandler
        },
        {
            Header: "Profile",
            // accessor: "email",
            Cell: profile
        },
        {
            Header: "UserName",
            accessor: "user.fullName",
            Cell: name
        },
        {
            Header: "Email",
            accessor: "user.email",
            Cell: email
        },
        {
            Header: "Rating",
            // accessor: "email",
            Cell: rating
        },
        // {
        //     Header: "Worth",
        //     accessor: "status",
        //     // Cell: statusHandler
        // },
        // {
        //     Header: "Package Detail",
        //     accessor: "user.idproof",
        //     // Cell: viewBtn
        // },
        // {
        //     Header: "Status",
        //     accessor: "statuss",
        //     // Cell: statussHandler
        // },
        // {
        //     Header: "Action",
        //     accessor: "more",
        //     // Cell: actionHandler
        // },
    ]

    useEffect(() => {
        getReview()
    }, [])

    const getReview = () => {
        props.loader(true);
        Api("get", "/api/getreview", '', router).then(
            (res) => {
                console.log("res================>", res.data);
                props.loader(false);

                if (res?.success) {
                    setRatingsData(res.data)
                }
                // else {
                //   console.log(res?.data?.message);
                //   props.toaster({ type: "error", message: res?.data?.message });
                // }
            },
            (err) => {
                props.loader(false);
                console.log(err);
                props.toaster({ type: "error", message: err?.data?.message });
                props.toaster({ type: "error", message: err?.message });
            }
        );
    };




    return (
        <section className=' p-4'>
            <div className='  w-full space-y-4'>
                {/* <div className='p-6 border-2 border-custom-blue rounded-2xl flex items-center justify-between'>
                    <div className='w-full'>
                        <p className='text-lg font-medium'>{`${moment(new Date()).format('DD-MMM-YYYY')} , ${moment(new Date()).format('dddd')}`}</p>
                        <h2 className='text-3xl font-medium'>Hello <span className='text-custom-blue'>Demomail</span></h2>
                    </div>
                    <div>
                        <div className=' py-2 px-6 bg-custom-blue rounded-md text-white w-40'>
                            <p>Create FAQ</p>
                        </div>
                    </div>
                </div> */}

                <div className=' flex flex-col md:flex-row items-center justify-between border-t-8 border-custom-blue rounded-md bg-gray-200 p-4'>
                    <div className='text-black'>
                        <p className='text-2xl font-semibold'>Reviews</p>
                    </div>
                    {/* <div className='flex items-center gap-2'>
                        <div className=' items-center md:w-[400px] w-full grid md:grid-cols-2 rounded-md overflow-hidden gap-2'>
                            <div className='w-full flex items-center justify-center text-center bg-custom-blue p-2 text-white rounded-md '>
                                <p>Replay on Playstore</p>
                            </div>
                            <div className='w-full flex items-center justify-center text-center  text-black rounded-md overflow-hidden'>
                                <select name="" id="" className='h-full w-full  p-2 outline-none border-2 border-black rounded-md'>
                                    <option value="">USer id</option>
                                </select>
                            </div>
                        </div>
                    </div> */}

                </div>

                <div className='border-2 border-black rounded-md'>
                    <Table columns={columns} data={ratingsData} from='feed' />
                </div>

                {/* <div className='border-2 border-black rounded-md p-4 space-y-2'>
                    {
                        [1, 2, 3, 4, 5, 6, 78,].map((item, idx) => (
                            <div key={idx} className='w-full  rounded-md space-y-2'>
                                <div className='w-full flex justify-between items-center '>
                                    <p className='text-green-600 font-semibold'>4 hours ago</p>
                                    <div className='text-xl flex gap-2 text-gray-400'>
                                        <BsStarFill />
                                        <BsStarFill />
                                        <BsStarFill />
                                        <BsStarFill />
                                        <BsStarFill />
                                    </div>
                                </div>
                                <div className='w-full p-2 md:p-4 border-2 border-t-8 border-custom-blue rounded-md'>
                                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione, eos.</p>
                                </div>
                            </div>
                        ))
                    }

                </div> */}

            </div>
        </section>
    )
}

export default SupportHelp