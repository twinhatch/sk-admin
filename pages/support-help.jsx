import moment from 'moment'
import React, { useMemo, useState, useEffect, useContext } from 'react'
import { BiMessage, BiRupee, BiSolidMessageCheck } from 'react-icons/bi'
import { HiOutlineGif } from 'react-icons/hi2'
import { products } from '@/utils/data'
import Table from '@/src/components/Table/table'
import { RxCross2 } from 'react-icons/rx'
import { GrAttachment } from 'react-icons/gr'
import { BsChevronDown, BsChevronLeft, BsEmojiSmile, BsSearch } from 'react-icons/bs'
import { AiOutlineSend, AiTwotoneMessage } from 'react-icons/ai'
import { MdAttachFile } from 'react-icons/md'
import Faq from '@/src/components/Faq'
import { socket } from '@/utils/socket'
import { userContext } from './_app'
import { useRouter } from 'next/router'

const SupportHelp = (props) => {
    const router = useRouter();
    const { cuser } = router.query
    const [chatBox, setChatBox] = useState(false)
    const [text, setText] = useState('');
    const [tab, setTab] = useState('HELPSUPPORT')
    const [charArray, setChatArray] = useState([])
    const [charUserList, setChatUserList] = useState([])
    const [maincharUserList, setMainChatUserList] = useState([])
    const [selectUser, setSelectUser] = useState({})
    const [user, setUser] = useContext(userContext)
    const [fiterValue, setFiltervalue] = useState('')

    const statusHandler = ({ value }) => {
        return (
            <div className=' p-4  flex items-center  justify-center'>
                <p className='py-1 px-5 border-2 border-custom-blue rounded-md'>{600}</p>
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

    const onoffline = ({ value }) => {
        return (
            <div className=' p-4  flex items-center  justify-center'>
                <p className={`font-semibold text-md ${value === 'online' ? 'text-green-700' : 'text-red-700'}`}>{value}</p>
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

    const actionHandler = ({ value, row }) => {
        return (
            <div className=' p-4  flex items-center  justify-center'>
                <button onClick={() => {
                    socket.emit('join', row.original.support_id);
                    setSelectUser(row.original);
                    setChatBox(true)
                    getChat(row.original)
                    localStorage.setItem('selectedUser', row.original.support_id)
                }} className='py-2  px-5 flex items-center justify-center mx-auto text-black text-lg text-center bg-green-400 rounded-md'>
                    Chat
                </button>
            </div>
        )
    }

    const Refund = ({ value }) => {
        return (
            <div className=' p-4  flex items-center  justify-center'>
                <p className={`py-3 px-5   rounded-md text-white ${value ? 'bg-green-700' : 'bg-red-700'}`}>{value ? 'Satisfied' : 'Pending'}</p>
            </div>
        )
    }

    useEffect(() => {
        socket.emit('joinadmin')

        return () => {
            socket.off('allmessages');
            socket.off('messages');
            socket.off('joinRoom');
            socket.off('joinadmin');
            socket.off('join');
        };
    }, [])

    const columns = useMemo(
        () => [
            {
                Header: "UserId",
                accessor: "userId.userID",
                Cell: idHandler
            },
            {
                Header: "UserName",
                accessor: "userId.fullName",
                Cell: nameHandler
            },
            {
                Header: "On/Offline",
                accessor: "userId.online",
                Cell: onoffline
            },
            {
                Header: "Query",
                accessor: "query",
                Cell: nameHandler
            },
            {
                Header: "Sub Query",
                accessor: "sub_query",
                Cell: nameHandler
            },
            {
                Header: "Status",
                accessor: "satisfied",
                Cell: Refund
            },
            {
                Header: "Action",
                accessor: "more",
                Cell: actionHandler
            },
        ],
        [charUserList]
    );

    useEffect(() => {

        // if (!!user) {
        // getChat()
        // }
        getChatUserList()
        // socket.on('allmessages', message => {
        //     console.log('mymessage==========>', message[0]);
        //     console.log('mymessage========>', `6544ccf960fe2c0d7fe3d23a${selectUser._id}`)
        //     if (message.length > 0) {
        //         if (message[0].support_user === `6544ccf960fe2c0d7fe3d23a${selectUser._id}`) {
        //             setMessages(message);
        //         }
        //     }

        // });
        return () => {
            // socket.off('joinRoom');
            // socket.off('messages');
            // socket.off('updateConnection');
            // socket.off('allmessages');
            // socket.off('connect', () => { });
            // socket.on('disconnect', () => {
            //     console.log('Disconnected from server');
            // });
        };
    }, [user])



    useEffect(() => {
        // socket.on('connect', () => {
        //   console.log('Connected to Socket.io Server');
        // });

        socket.on('error', error => {
            console.error('Socket.io Error:', error);
        });


        socket.on('userlist', list => {
            console.log('list =>', list)
            const newarray = []
            const newarray2 = []
            list.forEach(element => {
                if (element.satisfied) {
                    newarray2.push(element)
                } else {
                    newarray.push(element)
                }
            });
            const nnn = newarray.sort((a, b) => b.userId.completedDelivery - a.userId.completedDelivery)
            setChatUserList([...nnn, ...newarray2])
            setMainChatUserList([...nnn, ...newarray2])
            if (cuser) {
                const newuser = list.find(f => f.support_user === cuser)
                setSelectUser(newuser)
                setChatBox(true)
                getChat(newuser)
            }
            const sU = localStorage.getItem('selectedUser')
            if (sU) {
                const newuser = list.find(f => f.support_id === sU)
                setSelectUser(newuser)
            }
            // if (message.length > 0) {
            //     setChatArray(message);
            // }
        });

        socket.on('messages', message => {
            console.log(message)
            if (message.length > 0) {
                setChatArray(message);
            }
        });
        socket.on('updateConnection', message => {
            console.log(message)
            // setChatArray(message);
            getChatUserList()
            // getSupport(false);
        });

        socket.on('allmessages', message => {
            // if (message[0].support_id === selectUser.support_id) {
            setChatArray(message);
            // }
            // getChatUserList()
            console.log('mymessage1==========>', message);

            // if (message.length > 0) {
            //     const newuser = localStorage.getItem('selectedUser')
            //     if (newuser) {
            //         const users = JSON.parse(newuser)
            //         console.log('mymessage2========>', users)
            //         setSelectUser(users)
            //         if (message[0].support_id === users.support_id) {
            //             setChatArray(message);
            //         }
            //     } else {
            //         if (message[0].support_id === selectUser.support_id) {
            //             setChatArray(message);
            //         }
            //     }

            // }
        });

    }, [socket]);

    const filterData = (type) => {
        let pending = []
        let resolved = []
        maincharUserList.forEach(element => {
            if (element.satisfied) {
                resolved.push(element)
            } else {
                pending.push(element)
            }
        });
        if (type === '') {
            setChatUserList([...pending, ...resolved])
        }
        if (type === 'true') {
            setChatUserList([...resolved])
        }
        if (type === 'false') {
            setChatUserList([...pending])
        }

    }

    const getChat = (item) => {
        // if (item.sender) {

        const payloads = {
            support_id: item.support_id
        };
        socket.emit('getsupportMessages', payloads);
        // }
    };

    const getChatUserList = () => {
        socket.emit('chatuser', {});
    };


    const createChat = message => {
        const payloads = {
            message: message,
            receiver: selectUser.userId._id,
            sender: '6544ccf960fe2c0d7fe3d23a',
            support_id: selectUser.support_id,
            connection: selectUser.connection,
            key: 'userSocket',
        };

        socket.emit('createSupportMessage', payloads);
        // setNewMessage('');
    };

    const satisfied = (message, type) => {
        const payloads = {
            type: type || false,
            message: message,
            receiver: selectUser.userId._id,
            sender: '6544ccf960fe2c0d7fe3d23a',
            support_id: selectUser.support_id,
            connection: selectUser.connection,
            key: 'userSocket',
        };
        console.log(payloads);
        socket.emit('satisfied', payloads);
        // setNewMessage('');
    };
    const satisfiedDirect = (message, type, item) => {
        const payloads = {
            type: type || false,
            message: message,
            receiver: item.userId._id,
            sender: '6544ccf960fe2c0d7fe3d23a',
            support_id: item.support_id,
            connection: item.connection,
            key: 'userSocket',
        };
        console.log(payloads);
        socket.emit('satisfied', payloads);
        // setNewMessage('');
    };

    return (
        <section className=' p-4'>
            <div className=' w-full space-y-4'>

                {
                    chatBox &&
                    <div className={` z-50 fixed right-10 bottom-20 shadow-2xl w-[300px] md:w-[450px]  bg-white rounded-xl overflow-hidden`}>
                        <div className='relative'>

                            <div className='p-4 bg-custom-blue flex items-center gap-3'>
                                <div className='text-white max-w-[320px]' onClick={() => {
                                    setSelectUser({});
                                    setChatArray([])
                                    setChatBox(false);
                                    socket.off('join');
                                    localStorage.removeItem('selectedUser')
                                }}>
                                    <BsChevronLeft className='text-2xl font-bold' />
                                </div>
                                <div className=' flex items-center gap-3'>
                                    <div>
                                        <div className='w-12 h-12 rounded-full overflow-hidden'>
                                            <img src={selectUser?.userId?.profile} alt="" className='w-full h-full object-cover' onError={() => {
                                                selectUser.userId.profile = 'https://paulbarber-bucket.s3.eu-north-1.amazonaws.com/defaultProfile.png'
                                                setSelectUser({ ...selectUser })
                                            }} />
                                        </div>
                                        <p className={`font-semibold text-sm text-center bg-white mt-2 rounded-md ${selectUser.userId.online === 'online' ? 'text-green-700' : 'text-red-700'}`}>{selectUser.userId.online}</p>
                                    </div>


                                    <div className='text-white'>
                                        <p className='text-md font-medium'>{selectUser?.userId?.fullName} / UserId #{selectUser?.userId?.userID}</p>
                                        <div className='flex'>
                                            <p className=' text-[12px] flex-wrap whitespace-normal'>Packages:{' '}
                                                {selectUser?.package?.map((item, i) => (<span key={i} className=' text-[12px]'>#{item?.track_id},{' '} </span>))}</p>
                                        </div>
                                        <div className='flex'>
                                            <p className=' text-[12px] flex-wrap whitespace-normal'>Travel Plans:{' '}  {selectUser?.travelplan?.map((item, i) => (<span key={i} className=' text-[12px]'>#{item?.track_id},{' '} </span>))}</p>

                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className=' h-[400px] w-full p-2 overflow-scroll space-y-3 chatbox'>
                                {

                                    charArray.map((msg, idx) => (
                                        msg?.sender?._id !== selectUser?.userId?._id ?
                                            <div key={idx}>
                                                <div className='pl-4 grid grid-cols-12 gap-2  w-full  '>
                                                    <div className='text-white  col-span-10 flex flex-col items-end'>
                                                        <p className='text-md max-w-20 bg-custom-blue rounded-md p-2  text-right font-medium max-w-max'>{msg.message}</p>
                                                        <p className='text-[10px] text-black max-w-20 rounded-md   text-right font-medium max-w-max'>{moment(msg.msgtime).format('DD-MM-YYYY, hh:mm A')}</p>
                                                        {msg.message === ' Are you satisfied with the resolution ?' && !selectUser.satisfied && <button className='text-white bg-green-700 px-2 rounded-l-lg rounded-b-lg' onClick={() => { satisfied('Thank you.', true) }}>Yes</button>}
                                                    </div>
                                                    <div className='w-10 h-10 rounded-full overflow-hidden col-span-2 '>
                                                        <img src={msg?.receiver?.profile} alt="" className='w-full h-full object-cover' onError={() => {
                                                            msg.receiver.profile = 'https://paulbarber-bucket.s3.eu-north-1.amazonaws.com/defaultProfile.png'
                                                            setChatArray([...charArray])
                                                        }} />
                                                    </div>
                                                </div>

                                            </div>
                                            :
                                            <div key={idx}>
                                                <div className='pr-4 gap-1 grid grid-cols-12  w-full '>
                                                    <div className='w-10 h-10 rounded-full overflow-hidden col-span-2'>
                                                        <img src={msg.sender.profile} alt="" className='w-full h-full object-cover' onError={() => {
                                                            msg.sender.profile = 'https://paulbarber-bucket.s3.eu-north-1.amazonaws.com/defaultProfile.png'
                                                            setChatArray([...charArray])
                                                        }} />
                                                    </div>
                                                    <div className='text-black col-span-10'>
                                                        <p className='text-md font-medium bg-gray-300 p-2 text-left rounded-md max-w-max'>{msg.message}</p>
                                                        <p className='text-[10px] text-black max-w-20 rounded-md   text-left font-medium max-w-max'>{moment(msg.msgtime).format('DD-MM-YYYY, hh:mm A')}</p>
                                                    </div>
                                                </div>
                                            </div>
                                    ))
                                }
                            </div>

                            <div className='bg-white h-[50px]  z-50 w-full bottom-0 right-0 border-t-2 border-gray-300 '>
                                <div className='w-full h-full flex gap-2 items-center justify-between text-gray-400 p-2'>
                                    <input type="text" value={text} className='text-md font-medium outline-none w-full h-full' placeholder='type message' onChange={(e) => setText(e.target.value)} />
                                    {
                                        text &&
                                        <div className=' flex justify-end items-center'>
                                            <div className=' w-10 h-10 p-3 cursor-pointer flex gap-3 rounded-full  text-white bg-custom-blue '
                                                onClick={() => {
                                                    createChat(text)
                                                    setText('')
                                                }}>
                                                <AiOutlineSend className=' w-full h-full' />
                                            </div>
                                        </div>

                                    }
                                    <div
                                        className=' cursor-pointer  bottom-16 right-5  bg-green-700 text-white text-2xl px-2 rounded-md'
                                    >
                                        <p className='text-lg py-1' onClick={() => { createChat(' Are you satisfied with the resolution ?') }}>Resolved?</p>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                }
                <div className='md:p-6 p-3 border-2 border-custom-blue rounded-2xl flex flex-col md:flex-row  items-center justify-between gap-2 md:gap-0'>
                    <div className='w-full text-center md:text-left'>
                        <p className='text-md md:text-lg font-medium'>{`${moment(new Date()).format('DD-MMM-YYYY')} , ${moment(new Date()).format('dddd')}`}</p>
                        <h2 className='text-2xl md:text-3xl font-medium'>Hello <span className='text-custom-blue'>{user?.fullName}</span></h2>
                    </div>
                    {/* <div className='flex flex-col md:flex-row md:gap-4 gap-2 text-center'>
                        <div className={` py-2 px-6 rounded-md  w-40 cursor-pointer ${tab === 'FAQ' ? 'bg-custom-blue text-white' : 'bg-white border-2 text-custom-blue border-custom-blue'}`}
                            onClick={() => {
                                setTab('FAQ'); setSelectUser({});
                                setChatArray([])
                                setChatBox(false);
                                socket.off('join');
                                // socket.off('joinRoom');
                                localStorage.removeItem('selectedUser')
                            }}>
                            <p> FAQ</p>
                        </div>
                        <div className={` py-2 px-6 rounded-md  w-40 cursor-pointer ${tab === 'HELPSUPPORT' ? 'bg-custom-blue text-white' : 'bg-white border-2 text-custom-blue border-custom-blue'}`}
                            onClick={() => setTab('HELPSUPPORT')}>
                            <p>Support</p>
                        </div>
                    </div> */}
                </div>

                <div className=' flex flex-col md:flex-row gap-2 md:gap-0 items-center justify-between border-t-8 border-custom-blue rounded-md bg-gray-200 p-4'>
                    <div className='text-black'>
                        <p className='text-2xl font-semibold'>{tab === 'HELPSUPPORT' ? 'Help and support' : 'FAQ'}</p>
                    </div>
                    {tab === 'HELPSUPPORT' && <div className='bg-custom-blue flex justify-center'>
                        <select className='border-2  p-2  bg-custom-blue text-white' value={fiterValue} onChange={(text) => { setFiltervalue(text.target.value); filterData(text.target.value) }}>
                            <option value={false}>Pending</option>
                            <option value={true}>Resolved</option>
                            <option value="">All</option>
                        </select>
                    </div>}

                </div>
                {
                    tab === 'HELPSUPPORT' &&
                    <Table columns={columns} data={charUserList} />
                    // <div className='border-2 border-black rounded-md p-4 space-y-2 md:space-y-4 overflow-x-auto'>
                    //     {
                    //         charUserList.map((item, idx) => (
                    //             <div key={idx} className={` w-full p-2 ${item.satisfied ? 'bg-custom-blue' : 'bg-red-700'}  grid grid-cols-3 rounded-md min-w-[500px] gap-3`}>
                    //                 <div className='p-2  text-white text-lg text-center flex items-center justify-center'>
                    //                     #{item.userId.userID}
                    //                 </div>
                    //                 <div className='p-2 text-white text-lg text-center flex items-center justify-center'>
                    //                     {item.userId.fullName}
                    //                 </div>
                    //                 <div className='flex gap-5 justify-end w-full'>
                    //                     <button onClick={() => {
                    //                         socket.emit('join', item.support_id);
                    //                         setSelectUser(item);
                    //                         setChatBox(true)
                    //                         getChat(item)
                    //                         localStorage.setItem('selectedUser', JSON.stringify(item))
                    //                     }} className='py-2 col-span-2 w-full flex items-center justify-center md:w-32 mx-auto text-white text-lg text-center bg-green-400 rounded-md'>
                    //                         Chat
                    //                     </button>
                    //                     {!item.satisfied && <button onClick={() => {
                    //                         satisfiedDirect('Thank you.', true, item)
                    //                     }} className='py-2 col-span-2 w-full flex items-center justify-center md:w-32 mx-auto text-white text-lg text-center border-2 border-white rounded-md'>
                    //                         Resolved
                    //                     </button>}
                    //                     {item.satisfied && <button onClick={() => {
                    //                         satisfiedDirect('May I help you?', false, item)
                    //                     }} className='py-2 col-span-2 w-full flex items-center justify-center md:w-32 mx-auto text-white text-lg text-center border-2 border-white rounded-md'>
                    //                         Pending
                    //                     </button>}
                    //                 </div>
                    //             </div>
                    //         ))
                    //     }
                    // </div>
                }



            </div>

        </section >
    )
}

export default SupportHelp