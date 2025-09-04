import React, { useContext, useEffect, useMemo, useState } from 'react'
import { columns, columnsData } from '@/utils/Table/columns';
import { products } from '@/utils/data';
import { Api } from '@/utils/service';
import { useRouter } from 'next/router';
import moment from 'moment';
import { AiOutlineCheck } from 'react-icons/ai';
import { userContext } from './_app';
import Table from '@/src/components/Table/table';
import Swal from 'sweetalert2';

const Notifications = (props) => {

    const router = useRouter()
    const [bookings, setBookings] = useState([])
    const [notification, setNotification] = useState({
        userId: "",
        packagePostId: "",
        travellerPostId: "",
    })
    const [SortedBookings, setSortedBookings] = useState([])
    const [donationNames, setDonationNames] = useState([])
    const [selected, setSelected] = useState([])
    const [allSelected, setAllSelected] = useState(false)
    const [mainList, setmainList] = useState([]);
    const [selectedUser, setSelectedUser] = useState([])



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
        // let updated = SortedBookings.map((book) => {
        //     if (allSelected) {
        //         book.checked = true
        //         return book
        //     }
        //     else {
        //         book.checked = false
        //         return book
        //     }
        // })
        // setSortedBookings(updated)
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
                        // let updated = SortedBookings.map((book) => {
                        //     //console.log(book)
                        //     if (book._id === value) {
                        //         book.checked = !book.checked
                        //         return book
                        //     }
                        //     return book
                        // })
                        // setSortedBookings(updated)
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
            Header: "NAME",
            accessor: "fullName",
            Cell: nameHandler
        },
        {
            Header: "NUMBER",
            accessor: "phone",
            Cell: nameHandler
        },
        {
            Header: "EMAIL",
            accessor: "email",
            Cell: statusHandler
        },
        {
            Header: "Status",
            accessor: "status",
            Cell: nameHandler
        },

    ], [SortedBookings, allSelected, selectedUser])

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

    const sendNotification = (event) => {
        event.preventDefault();

        // if (!notification) {
        //     props.toaster({ type: "error", message: "Notification Required" })
        //     return
        // }
        // if (selectedUser.length === 0) {
        //     props.toaster({ type: "error", message: "Select Bookings" })
        //     return
        // }
        props.loader(true);
        Api("post", '/api/sendinvitefromadmin', notification, router).then(
            (res) => {
                props.loader(false);
                console.log("res================>", res);
                setNotification({
                    userId: "",
                    packagePostId: "",
                    travellerPostId: "",
                })
                // setAllSelected(false)
                // getBookings()
                if (res.success) {
                    props.toaster({ type: 'success', message: res.message });
                } else {
                    Swal.fire({
                        title: "Oops!",
                        text: res.message,
                        icon: "warning"
                    });
                }


            },
            (err) => {
                props.loader(false);
                console.log(err);
                props.toaster({ type: "error", message: err?.message });
            }
        );
    }
    // useEffect(() => {
    //     getBookings()
    // }, [])




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
        <section className='md:px-6 px-2 md:py-4 pb-4 bg-white relative   '>
            <h2 className='upercase text-2xl md:text-3xl font-semibold mb-3'>Notification Broadcasting</h2>
            <form onSubmit={sendNotification}
                className='w-[99%] mx-auto md:w-full bg-white h-full border-2 border-black rounded-[30px] p-3 md:p-6 flex flex-col overflow-auto space-y-4'>
                <h2 className='upercase text-2xl md:text-3xl font-semiboldtext-center md:text-left'>Notification:</h2>
                {/* <div className='p-3  md:p-4 bg-white text-sm  md:text-lg rounded-3xl font-semibold border flex border-custom-blue'>
                    <p className='w-44 text-black'>Packager User ID</p>
                    <input type="text" className='bg-transparent outline-none text-black ' rows={5} value={notification.userId}
                        placeholder='Packager User ID'
                        required
                        onChange={(e) => setNotification({ ...notification, userId: e.target.value })} />
                </div> */}
                <div className='p-3  md:p-4 bg-white text-sm  md:text-lg rounded-3xl font-semibold border flex border-custom-blue'>
                    <p className='w-44 text-black'>Package Post ID</p>
                    <input type="text" className='bg-transparent outline-none text-black ' rows={5} value={notification.packagePostId}
                        placeholder='Package Post ID'
                        required
                        onChange={(e) => setNotification({ ...notification, packagePostId: e.target.value })} />
                </div>
                <div className='p-3  md:p-4 bg-white text-sm  md:text-lg rounded-3xl font-semibold border flex border-custom-blue'>
                    <p className='w-44 text-black'>Travel Plan Post ID</p>
                    <input type="text" className='bg-transparent outline-none text-black ' rows={5} value={notification.travellerPostId}
                        placeholder='Travel Plan Post ID'
                        required
                        onChange={(e) => setNotification({ ...notification, travellerPostId: e.target.value })} />
                </div>

                <div className='flex items-center  gap-10 justify-center md:justify-start'>
                    <button className='md:px-10 md:py-3 px-3 py-1 text-white font-semibold text-md md:text-2xl bg-custom-blue rounded-lg'
                        type='submit'

                    >Send Invitation</button>
                    {/* <div className='flex items-center gap-2'>
                        <p className='text-lg font-medium'>Search:</p>
                        <input placeholder='Search By UserID' className='border border-black text-sm rounded-md px-5  py-1' onChange={filterData} />
                    </div>
                    <button className=' px-3 py-1 text-white  text-md bg-custom-blue rounded-lg' onClick={() => setAllSelected(!allSelected)}>{allSelected ? "Unselect all" : "Select All"}</button> */}
                </div>
                {/* <div className='h-full w-full'>
                    <Table columns={columns} data={SortedBookings} />
                </div> */}
            </form>
        </section>
    )
}

export default Notifications