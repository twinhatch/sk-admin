import React, { useContext, useEffect, useMemo, useState } from 'react'
import { columns, columnsData } from '@/utils/Table/columns';
import { products } from '@/utils/data';
import { Api } from '@/utils/service';
import { useRouter } from 'next/router';
import moment from 'moment';
import { AiOutlineCheck } from 'react-icons/ai';
import { userContext } from './_app';
import Table from '@/src/components/Table/table';
const userList = [
    {
        email: 'stephinvarghese1997@gmail.com ',
        ID: '66419e52d9e2dab8d87c26f8'
    },
    {
        email: 'stephinvarghese97@gmail.com',
        ID: '6641fd4fbdadd4bc8c34be0c'
    },
    {
        email: 'sonu@yopmail.com ',
        ID: '66446bede3d73baebea8fe56'
    },
    {
        email: 'monu@yopmail.com',
        ID: '66448ffb0b96d03d16c52ab7'
    },
    {
        email: 'rohit@yopmail.com ',
        ID: '6644a3d0246c2d3d0c7c5e9b'
    },
    {
        email: 'akshay@yopmail.com',
        ID: '6644a217246c2d3d0c7c5d6c'
    },
]
const Notifications = (props) => {

    const router = useRouter()
    const [bookings, setBookings] = useState([])
    const [notification, setNotification] = useState('')
    const [SortedBookings, setSortedBookings] = useState([])
    const [donationNames, setDonationNames] = useState([])
    const [selected, setSelected] = useState([])
    const [allSelected, setAllSelected] = useState(false)
    const [mainList, setmainList] = useState([]);
    const [selectedUser, setSelectedUser] = useState([])
    const [showSendNotification, setShowSendNotification] = useState(false)
    const [notiList, setNotiList] = useState([])
    const [selectedUserNoti, setSelectedUserNoti] = useState('66419e52d9e2dab8d87c26f8')



    const [user, setUser] = useContext(userContext);


    const nameHandler = ({ value }) => {
        return (
            <div className=' p-4  flex items-center  justify-center'>
                <p className='font-semibold text-lg'>{value}</p>
            </div>
        )
    }
    const statusHandler = ({ value }) => {
        return (
            <div className=' p-4 flex items-center  justify-center'>
                <p className={`font-semibold text-lg `}>{value}</p>
            </div>
        )
    }

    useEffect(() => {
        if (allSelected) {
            setSelectedUser(SortedBookings.map(f => f._id))
        } else {
            setSelectedUser([])
        }
    }, [allSelected])

    const checkBoxHandler = ({ value, row }) => {
        return (
            <div className=' p-4 flex items-center  justify-center'>

                <div className={`w-5 h-5 ${selected.includes(value) && 'bg-[#FFCD03]'} ${(row.original.checked) && 'bg-[#FFCD03]'} border border-[#FFCD03] flex items-center justify-center cursor-pointer`}
                    onClick={() => {
                        if (selectedUser.includes(value)) {
                            setSelectedUser(selectedUser.filter(f => f !== value))
                        } else {
                            setSelectedUser([...selectedUser, value])
                        }
                        console.log(selectedUser)
                    }}
                >
                    <AiOutlineCheck className={`font-semibold  ${(selectedUser.includes(value)) ? 'text-black' : 'text-white'}`} />
                </div>
                {' '}#{row.original.userID}
            </div>
        )
    }


    const columns = useMemo(() => [
        {
            Header: "UserID",
            accessor: "_id",
            Cell: checkBoxHandler
        },
        {
            Header: "UserName",
            accessor: "fullName",
            Cell: nameHandler
        },
        {
            Header: "Phone Number",
            accessor: "phone",
            Cell: nameHandler
        },
        {
            Header: "Email",
            accessor: "email",
            Cell: statusHandler
        },
        {
            Header: "Status",
            accessor: "status",
            Cell: nameHandler
        },

    ], [SortedBookings, allSelected, selectedUser])
    // 66419e52d9e2dab8d87c26f8

    const packagePlanHandler = ({ value, row }) => {
        return (
            <div className=' p-4  flex flex-col items-center  justify-center'>
                <p className='font-semibold text-md '>{value?.name}</p>
                <p className='font-semibold text-md '>PostID <span className='font-semibold text-md text-blue-400'>#{value?.track_id}</span></p>
            </div >
        )
    }

    const travellerPlanHandler = ({ value, row }) => {
        return (
            <div className=' p-4  flex flex-col items-center  justify-center'>
                <p className='font-semibold text-md '>{value?.name}</p>
                <p className='font-semibold text-md '>PostID <span className='font-semibold text-md text-blue-400'>#{value?.track_id}</span></p>
                <p className='font-semibold text-md '>UserID <span className='font-semibold text-md text-blue-400'>#{row?.original?.senderId?.userID}</span></p>
            </div >
        )
    }

    const notificationHandler = ({ value, row }) => {
        return (
            <div className=' p-4 w-full flex-wrap whitespace-break-spaces	flex flex-col self-center '>
                <p className='font-semibold text-md '>{value}</p>
            </div>
        )
    }

    const Noticolumns = [
        {
            Header: "PackagePlan",
            accessor: "packagePlan",
            Cell: packagePlanHandler
        },

        {
            Header: "TravelPlan",
            accessor: "travelPlan",
            Cell: travellerPlanHandler
        },

        {
            Header: "Notification",
            accessor: "notification",
            Cell: notificationHandler
        },


    ]


    const getBookings = () => {
        props.loader(true);
        Api("get", '/api/getUsers', '', router).then(
            (res) => {
                console.log("res================>", res);
                props.loader(false);
                // res.data.forEach((i) => {
                //     i.checked = false
                // })
                setBookings(res.data)
                setSortedBookings(res.data)
                setmainList(res.data)
                let tickets = new Set(res.data.map((book) => book.ticket?.title))
                setDonationNames(Array.from(tickets))
            },
            (err) => {
                props.loader(false);
                console.log(err);
                props.toaster({ type: "error", message: err?.message });
            }
        );
    }

    const getNotiList = (id) => {
        props.loader(true);
        Api("get", `/api/getnotification?id=${id}`, '', router).then(
            (res) => {
                console.log("res================>", res);
                props.loader(false);
                setNotiList(res.notificationList)
            },
            (err) => {
                props.loader(false);
                console.log(err);
                props.toaster({ type: "error", message: err?.message });
            }
        );
    }

    const sendNotification = () => {
        if (!notification) {
            props.toaster({ type: "error", message: "Notification Required" })
            return
        }
        if (selectedUser.length === 0) {
            props.toaster({ type: "error", message: "Select Bookings" })
            return
        }
        props.loader(true);
        Api("post", '/api/sendnotificationbyadmin', { notification, users: selectedUser }, router).then(
            (res) => {
                props.loader(false);
                console.log("res================>", res);
                setNotification('')
                setAllSelected(false)
                getBookings()
                props.toaster({ type: 'success', message: res.message });
            },
            (err) => {
                props.loader(false);
                console.log(err);
                props.toaster({ type: "error", message: err?.message });
            }
        );
    }
    useEffect(() => {
        if (showSendNotification) {
            getBookings()
        } else {
            getNotiList(selectedUserNoti)
        }
    }, [showSendNotification])




    const filterData = (event) => {
        console.log(event)
        if (event?.target?.value.length > 0) {
            const newdata = mainList.filter(f => f.userID.includes(event.target.value))
            setSortedBookings(newdata)
        } else {
            setSortedBookings(mainList)
        }
    }

    return (
        <>
            <section className='md:px-6 px-2 md:py-4 pb-4 bg-white relative'>
                <div className='flex justify-between mb-5'>
                    <h2 className='upercase text-2xl md:text-3xl font-semibold mb-3'>Notification List</h2>
                    <div className='flex flex-col md:flex-row md:gap-4 gap-2 text-center'>
                        <div className={` py-2 px-6 rounded-md  w-60 cursor-pointer ${!showSendNotification ? 'bg-custom-blue text-white' : 'bg-white border-2 text-custom-blue border-custom-blue'}`}
                            onClick={() => {
                                setShowSendNotification(false)
                            }}>
                            <p>Notification List</p>
                        </div>
                        <div className={` py-2 px-6 rounded-md  w-60 cursor-pointer ${showSendNotification ? 'bg-custom-blue text-white' : 'bg-white border-2 text-custom-blue border-custom-blue'}`}
                            onClick={() => setShowSendNotification(true)}>
                            <p>Send Notification</p>
                        </div>
                    </div>
                </div>
                {!showSendNotification && <div className='w-[99%] mx-auto md:w-full bg-white h-full border-2 border-black rounded-[30px] p-3 md:p-6 flex flex-col overflow-auto space-y-4'>
                    <select className='border-2  p-2  bg-custom-blue text-white' value={selectedUserNoti} onChange={(text) => { setSelectedUserNoti(text.target.value); getNotiList(text.target.value) }}>
                        {userList?.map((f) => (<option key={f.ID} value={f.ID}>{f.email}</option>))}
                    </select>
                    <div className='h-full w-full'>
                        <Table columns={Noticolumns} data={notiList} />
                    </div>
                </div>}
            </section>
            {showSendNotification && <section className='md:px-6 px-2 md:py-4 pb-4 bg-white relative'>
                <h2 className='upercase text-2xl md:text-3xl font-semibold mb-3'>Notification Broadcasting</h2>
                <div className='w-[99%] mx-auto md:w-full bg-white h-full border-2 border-black rounded-[30px] p-3 md:p-6 flex flex-col overflow-auto space-y-4'>
                    <h2 className='upercase text-2xl md:text-3xl font-semiboldtext-center md:text-left'>Notification:</h2>
                    <div className='p-3 md:p-4 bg-white text-sm  md:text-lg rounded-3xl font-semibold border border-custom-blue'>
                        <textarea type="text" className='w-full bg-transparent outline-none text-black' rows={5} value={notification}
                            placeholder='Write Something'
                            onChange={(e) => setNotification(e.target.value)} />
                    </div>
                    <div className='flex items-center  gap-10 justify-center md:justify-start'>
                        <button className='md:px-10 md:py-3 px-3 py-1 text-white font-semibold text-md md:text-2xl bg-custom-blue rounded-lg'
                            onClick={sendNotification}
                        >Send Notification</button>
                        <div className='flex items-center gap-2'>
                            <p className='text-lg font-medium'>Search:</p>
                            <input placeholder='Search By UserID' className='border border-black text-sm rounded-md px-5  py-1' onChange={filterData} />
                        </div>
                        <button className=' px-3 py-1 text-white  text-md bg-custom-blue rounded-lg' onClick={() => setAllSelected(!allSelected)}>{allSelected ? "Unselect all" : "Select All"}</button>
                    </div>
                    <div className='h-full w-full'>
                        <Table columns={columns} data={SortedBookings} />
                    </div>
                </div>
            </section>}
        </>
    )
}

export default Notifications