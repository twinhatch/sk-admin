//import { Api } from '@/utils/service';

import { Api } from '@/utils/service';
import { validateEmailAddress, validateMobileNumber } from '@/utils/validator';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react'
import { userContext } from './_app';
import { eslint } from '@/next.config';

//import { validateMobileNumber } from '@/utils/validator';

const Login = (props) => {
    const [data, setData] = useState({
        email: '',
        password: '',
    })
    const [user, setUser] = useContext(userContext);

    const router = useRouter()

    const submit = async () => {
        console.log(data)
        if (data.email && data.password) {
            if (!validateEmailAddress(data.email, props.toaster)) {
                return
            }
            props.loader(true);
            Api("post", '/api/login', { ...data }, router).then(
                (res) => {
                    props.loader(false);
                    console.log("res================>", res);
                    if (res.data.type === 'ADMIN') {
                        localStorage.setItem('TravelUser', JSON.stringify(res.data))
                        setUser(res.data)
                        localStorage.setItem('token', res.data.token)
                        props.toaster({ type: "success", message: "Login Successful" });
                        if (res.data.roll === 'SUPERADMIN') {
                            router.push('/')
                        } else {
                            router.push('/user-management')
                        }
                    } else {
                        props.toaster({ type: "error", message: 'Not valid account' });
                    }

                },
                (err) => {
                    props.loader(false);
                    console.log(err);
                    props.toaster({ type: "error", message: err?.message });
                }
            );
        }
        else {
            props.toaster({ type: "error", message: "Missing credentials" });
        }
    }

    return (
        // <div className='w-full h-full flex flex-col gap-3 justify-center items-center bg-blue-300 pt-[30vh]'>
        //     <p>number</p>
        //     <input type="text" onChange={((e) => setData({ ...data, email: e.target.value }))} />
        //     <p>Password</p>
        //     <input type="text" onChange={((e) => setData({ ...data, password: e.target.value }))} />
        //     <button className=' bg-white p-2 ' onClick={submit}>Submit</button>
        // </div>
        <section className='xl:pr-[300px] md:pr-[250px] sm:pr-[200px] max-h-screen h-screen relative '>
            <div className='h-full w-full flex items-center justify-center '>
                <div className='xl:w-[600px] md:w-[500px] w-[95%] bg-custom-blue text-white h-auto p-4 md:p-10 shadow-xl rounded-3xl flex flex-col gap-4 items-center justify-center'>
                    <div className='md:w-28 w-28'>
                        <img src="/Logo.png" alt="" className='w-full object-cover' />
                    </div>
                    <div className=' space-y-2 text-center '>
                        <h2 className='text-3xl font-semibold'>Welcome back!</h2>
                        <p className='text-md md:text-xl font-semibold'>Enter your Credentials to access your account</p>
                    </div>
                    <div>
                        <div >
                            <p>Email</p>
                            <input type="email" className='w-[300px] text-black mt-1 md:w-[400px] outline-none h-full p-2 border-2 border-blak rounded-xl'
                                placeholder='Email'
                                value={data.email}
                                onChange={((e) => {
                                    setData({ ...data, email: e.target.value })
                                })} />
                        </div>
                    </div>
                    <div>
                        <div >
                            <p>Password</p>
                            <input type="password" className='w-[300px] text-black mt-1 md:w-[400px] outline-none h-full p-2 border-2 border-blak rounded-xl'
                                placeholder='Password'
                                value={data.password}
                                onChange={((e) => setData({ ...data, password: e.target.value }))} />
                        </div>
                    </div>
                    <div className=' flex flex-col items-center justify-center space-y-2'>
                        <button className="text-lg text-black font-semibold  bg-custom-yellow rounded-lg md:py-2 py-1 px-4 md:px-8"
                            onClick={submit}
                        >
                            Login</button>
                        {/* <p>Don't have an Account ? <Link href={'/signup'} className='text-custom-yellow'>Signup</Link> </p> */}
                    </div>
                    <div className='text-sm md:text-md flex gap-4 items-center'>
                        <Link href={'/privacy-policy'} className='text-white cursor-pointer'>Privacy policy</Link>
                        <Link href={'/terms-condition'} className='text-white cursor-pointer'>Terms and conditions</Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Login