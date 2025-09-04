import moment from 'moment'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { BiRupee } from 'react-icons/bi'
import { FaUser } from 'react-icons/fa'
import { products } from '@/utils/data'
import Table from '@/src/components/Table/table'
import { RxCross2 } from 'react-icons/rx'
import { FaSackDollar } from 'react-icons/fa6'
import { Api } from '@/utils/service'
import { useRouter } from 'next/router'
import Swal from 'sweetalert2'

const PaymentCommission = (props) => {
    const [usersList, setUsersList] = useState([]);
    const [mainList, setmainList] = useState([]);
    const [popup, setPopUp] = useState(false)
    const router = useRouter()
    const [filtervalue, setFilterValue] = useState('')
    const [reset, setRset] = useState(false)
    const [popUpUser, setPopUpUser] = useState({});
    const [userPaymentData, setUserPaymentData] = useState({});

    const walletHandler = ({ value, row }) => {
        return (
            <div className=' p-4  flex items-center  justify-center'>
                <p className='font-semibold text-md text-black'>{value?.toFixed(2)}</p>
            </div>
        )
    }

    const vaultHandler = ({ value, row }) => {
        return (
            <div className=' p-4  flex items-center  justify-center'>
                <p className='font-semibold text-md text-black'>{value?.toFixed(2)}</p>
            </div>
        )
    }

    const Refund = ({ value, row }) => {
        return (
            <div className=' p-4  flex items-center  justify-center'>
                <p className='font-semibold text-md text-black'>{value?.toFixed(2)}</p>
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

    const idHandler = ({ value }) => {
        return (
            <div className=' p-4  flex items-center  justify-center gap-4'>

                {/* <input type="checkbox" className='border-2 border-custom-blue text-custom-blue w-5 h-5' /> */}
                <p className='font-semibold text-md text-blue-400'>#{value}</p>
            </div>
        )
    }

    const actionHandler = ({ value }) => {
        return (
            <div className=' p-4  flex items-center  justify-center'>
                <button className={`font-semibold text-md text-white py-2 px-4 rounded-md ${value && (value === 'Pending' || value === 'Payment Pending') ? 'bg-red-500' : "bg-green-500"} `}>{value || 'Completed'}</button>
            </div>
        )
    }

    const action = ({ value, row }) => {
        return (
            <div className=' p-4  flex items-center  justify-center'>
                <button className='font-semibold text-md text-white py-2 px-4 rounded-md bg-green-500' onClick={() => {
                    // updateUser(row.original) 
                    setPopUp(true);
                    setPopUpUser(row.original);
                    let newDate = moment().format('DDMMYYYY')
                    const userwaletData = localStorage.getItem(row.original._id)

                    if (userwaletData) {
                        const paymentData = JSON.parse(userwaletData)
                        if (newDate !== paymentData.date) {
                            const data = {
                                wallet: row.original.wallet,
                                vault: row.original.vault,
                                refund: row.original.refund,
                                date: newDate,
                            }
                            setUserPaymentData(data)
                            localStorage.setItem(row.original._id, JSON.stringify(data))
                        } else {
                            setUserPaymentData(paymentData)
                        }
                    } else {
                        const data = {
                            wallet: row.original.wallet,
                            vault: row.original.vault,
                            refund: row.original.refund,
                            date: newDate,
                        }
                        setUserPaymentData(data)
                        localStorage.setItem(row.original._id, JSON.stringify(data))
                    }
                }}>Update</button>
            </div>
        )
    }



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
                Header: "UPI ID",
                accessor: "bank_details.upi",
                Cell: nameHandler
            },

            {
                Header: "Refund",
                accessor: "refund",
                Cell: Refund
            },
            {
                Header: "Wallet",
                accessor: "wallet",
                Cell: walletHandler
            },
            {
                Header: "Vault",
                accessor: "vault",
                Cell: vaultHandler
            },
            {
                Header: "Payment Status",
                accessor: "paymetStatus",
                Cell: actionHandler
            },
            {
                Header: "Action",
                Cell: action
            },

        ],
        [usersList]
    );
    useEffect(() => {
        getAllUsers()
    }, [])

    const getAllUsers = async () => {
        props.loader(true);
        Api("get", '/api/getUsers?from=payment', '', router).then(
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

    const updateUser = async (popUpUser) => {

        Swal.fire({
            title: "Are you sure?",
            text: "You won't to update this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, update it!"
        }).then((result) => {
            if (result.isConfirmed) {
                props.loader(true);
                const data = {
                    vault: popUpUser?.vault,
                    wallet: popUpUser?.wallet,
                    refund: popUpUser?.refund,
                    userId: popUpUser._id,
                    paymetStatus: 'Completed'
                }
                Api("post", '/api/updateProfile', data, router).then(
                    (res) => {
                        props.loader(false);
                        console.log("res================>", res);
                        getAllUsers()
                        setPopUpUser({})
                        setPopUp(false)
                        setUserPaymentData({})
                    },
                    (err) => {
                        props.loader(false);
                        console.log(err);
                        props.toaster({ type: "error", message: err?.message });
                    }
                );
            }
        });


    }

    const filterStatus = (text) => {
        setRset(true)
        setFilterValue(text)
        if (text) {
            if (text === 'Completed') {
                setUsersList(mainList.filter(f => (f.paymetStatus && f.paymetStatus === text) || !f.paymetStatus))
                return
            }
            setUsersList(mainList.filter(f => f.paymetStatus === text))
        } else {
            setUsersList(mainList)
            return
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
                                <div className='rounded-full  bg-white text-black w-12 h-12'>
                                    <img src={popUpUser?.profile} alt="" className='rounded-full w-12 h-12 border-2 border-black' />
                                </div>

                                <div className='text-lg flex flex-col'>
                                    <p>{popUpUser?.fullName}</p>
                                    <p>{popUpUser?.email}</p>
                                </div>
                            </div>
                            <div className='p-1 rounded-full bg-custom-blue text-white w-12 h-12 cursor-pointer' onClick={() => {
                                setPopUp(!popup); setUserPaymentData({})
                            }}>
                                <RxCross2 className='h-full w-full font-semibold' />
                            </div>
                        </div>


                        <div className='flex flex-col  justify-center gap-4 p-5'>
                            <div className='flex items-center gap-2'>
                                <p className='text-black w-20'>ReFund</p>
                                <input type='number' max={3000} className='py-1 px-5 text-black border-2 border-custom-blue rounded-md w-28' value={popUpUser?.refund?.toFixed(2)}
                                    onChange={(text) => {
                                        const maxValue = Number(userPaymentData.refund) + 3000
                                        if (text.target.value > maxValue) {
                                            props.toaster({ type: "error", message: 'Value is not allow more than 3000' });
                                            return
                                        } else {
                                            setPopUpUser({
                                                ...popUpUser,
                                                refund: Number(text.target.value)
                                            })
                                            console.log(text.target.value)
                                        }

                                    }}

                                />

                            </div>
                            <div className='flex items-center gap-2'>
                                <p className='text-black w-20'>Wallet</p>
                                <input type='number' className='py-1 px-5 text-black border-2 border-custom-blue rounded-md w-28' value={popUpUser?.wallet?.toFixed(2)}
                                    onChange={async (text) => {
                                        setRset(true)
                                        const maxValue = Number(userPaymentData.wallet) + 3000

                                        if (text.target.value > maxValue) {
                                            setRset(true)
                                            props.toaster({ type: "error", message: 'Value is not allow more than 3000' });
                                            return
                                        } else {
                                            setPopUpUser({
                                                ...popUpUser,
                                                wallet: Number(text.target.value)
                                            })
                                        }
                                    }}
                                />
                            </div>
                            <div className='flex items-center gap-2'>
                                <p className='text-black w-20'>Vault</p>
                                <input type='number' className='py-1 px-5 text-black border-2 border-custom-blue rounded-md w-28' value={popUpUser?.vault?.toFixed(2)}
                                    onChange={(text) => {
                                        setRset(false)
                                        const maxValue = Number(userPaymentData.vault) + 3000
                                        if (text.target.value > maxValue) {
                                            setRset(true)
                                            props.toaster({ type: "error", message: 'Value is not allow more than 3000' });
                                            return
                                        } else {
                                            setPopUpUser({
                                                ...popUpUser,
                                                vault: Number(text.target.value)
                                            })
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        <div className='w-[250px] md:w-[300px] p-3 mx-auto flex justify-between items-center '>
                            <button className='text-white text-lg bg-green-500 py-2 px-6 w-[100px] rounded-md' onClick={() => { updateUser(popUpUser) }}>Update</button>
                            <button className='text-white text-lg bg-red-500 py-2  w-[100px] rounded-md'>Cancel</button>
                        </div>

                    </div>
                </div>
            }
            <div className='  w-full space-y-4'>
                <div className='p-6 border-2 border-custom-blue rounded-2xl flex items-center justify-between'>
                    <div className='w-full'>
                        <p className='text-lg font-medium'>{`${moment(new Date()).format('DD-MMM-YYYY')} , ${moment(new Date()).format('dddd')}`}</p>
                        <h2 className='text-3xl font-medium'>Hello <span className='text-custom-blue'>Demomail</span></h2>
                    </div>
                    <div>
                        <select className='border-2 !border-custom-blue p-2 rounded-md' value={filtervalue} onChange={(text) => { filterStatus(text.target.value) }}>
                            <option value="">All</option>
                            <option value="Pending">Pending</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                </div>

                {/* <div className=' grid grid-cols-3 md:grid-cols-6 md:gap-4 gap-1 '>
                    <div className='w-full flex items-center'>
                        <select className='border-2 !border-custom-blue p-2 rounded-md w-full'>
                            <option value="">Package</option>
                            <option value="">Package</option>
                            <option value="">Package</option>
                        </select>
                    </div>
                    <div className=' bg-custom-blue md:p-2 p-1 flex rounded-md text-white'>
                        <div className=' text-md  w-full'>
                            <p>Commission Rate</p>
                        </div>
                        <div className='w-8 h-full  items-center hidden md:flex'>
                            <FaSackDollar className='text-xl' />
                        </div>
                    </div>

                    <div className=' border-2 border-custom-blue p-2 flex items-center gap-2 rounded-md text-black'>
                        <input type="text" value={6000} className='w-full' />
                        <BiRupee className='text-black text-xl' />
                    </div>

                    <div className=' bg-custom-blue p-2 flex rounded-md text-white'>
                        <div className=' text-md  w-full'>
                            <p>Bonus</p>
                        </div>
                    </div>
                    <div className='w-full flex items-center'>
                        <select className='border-2 !border-custom-blue p-2 rounded-md w-full'>
                            <option value="">District</option>
                            <option value="">Package</option>
                            <option value="">Package</option>
                        </select>
                    </div>

                    <div className=' border-2 border-custom-blue p-2 flex items-center gap-2 rounded-md text-black'>
                        <input type="text" value={1000} className='w-full' />
                        <BiRupee className='text-black text-xl' />
                    </div>

                </div> */}
                <div className='border-2 border-black rounded-md'>
                    <Table columns={columns} data={usersList} />
                </div>
                {/* {!reset && <div className='border-2 border-black rounded-md'>
                    <Table columns={columns} data={usersList} reset={false} />
                </div>} */}
            </div>
        </section>
    )
}

export default PaymentCommission