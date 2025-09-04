import { userContext } from '@/pages/_app'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useContext } from 'react'
import { AiOutlineBell } from 'react-icons/ai'
import { GiHamburgerMenu } from 'react-icons/gi'
import { PiSignOutFill } from 'react-icons/pi'

const Navbar = ({ setOpenTab, openTab }) => {

    const [user, setUser] = useContext(userContext);

    const router = useRouter()

    const logOut = () => {
        setUser({});
        localStorage.removeItem('TravelUser');
        localStorage.removeItem('token');
        router.push('/login')
    }

    return (
        <nav className='w-full  z-20  bg-custom-blue text-white rounded-b-[30px] sticky top-0 max-w-screen'>
            <div className='w-full py-1 px-6 flex items-center justify-between shadow-2xl  bg-custom-blue'>
                <div className='w-14 md:hidden'>
                    <img src="/Logo.png" alt="" />
                </div>
                {
                    user?.token &&
                    <div className=' w-full md:flex items-center gap-3 hidden  justify-between  cursor-pointer'>
                        <div className='flex items-center gap-3  cursor-pointer'>
                            <div className='w-12 h-12 rounded-full overflow-hidden'>
                                <img src={user?.profile} alt="" className='w-full h-full object-cover' />
                            </div>
                            <div className='flex flex-col text-left justify-center p-0'>
                                <p className='text-lg font-semibold'>
                                    {user?.fullName}
                                </p>
                            </div>
                        </div>
                        {
                            user?.token ?
                                <div className='p-3 flex gap-2 items-center cursor-pointer' onClick={logOut}>
                                    <p>SignOut</p>
                                    <div className='p-2 bg-white rounded-full'>
                                        <PiSignOutFill className='text-3xl text-black' />
                                    </div>
                                </div>
                                :
                                <Link href={'/login'}>
                                    <div className='p-3 items-center'>
                                        <p>LogIn</p>
                                    </div>
                                </Link>
                        }
                    </div>
                }
                <div className='md:hidden'>
                    <GiHamburgerMenu className='text-2xl ' onClick={() => setOpenTab(!openTab)} />
                </div>
            </div>
        </nav>
    )
}

export default Navbar