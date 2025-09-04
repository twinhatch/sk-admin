"use client";
import { Api } from '@/utils/service';
import axios from 'axios';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react'

function blogsView(props) {
    const router = useRouter()
    console.log(router)
    console.log(props)
    const [blogsViewData, setblogsViewData] = useState({})

    useEffect(() => {
        getBlogsview()
    }, [props])

    const getBlogsview = async () => {
        props.loader(true);
        Api("post", "/api/getBlogById", { id: router?.query?.id }, router).then(
            (res) => {
                console.log("res================>", res);
                props.loader(false);

                if (res?.status) {
                    setblogsViewData(res.data)
                } else {
                    props.loader(false);
                    console.log(res?.data?.message);
                    props.toaster({ type: "error", message: res?.data?.message });
                }
            },
            (err) => {
                props.loader(false);
                console.log(err);
                props.toaster({ type: "error", message: err?.data?.message });
                props.toaster({ type: "error", message: err?.message });
            }
        );

        // const data = (await axios.post(`https://api.adncleaningservices.com/v1/api/getBlogById`, { id: router?.query?.id })).data
        // console.log(data)
        // setblogsViewData(data.data)
    }

    return (
        <div>
            {/* <Head>
          <title>Frequently Asked Questions (FAQ) - SK App | Earn Money While Traveling | India</title>
          <meta
            name="description"
            content="Explore answers to commonly asked questions about SK App, the platform that enables travelers in India to earn money while journeying. Discover how SK App works, how to get started, and more!"
          />
        </Head> */}

            <section className="md:min-h-screen h-96 w-full flex justify-center items-center relative" style={{
                backgroundImage: `url(${blogsViewData?.blog_image})`,
                backgroundSize: '100% 100%'
            }}>
                <div className='absolute top-0 left-0 bg-black/20 w-full h-full'>

                </div>
                <div className="relative px-2 md:px-0 max-w-7xl mx-auto flex flex-col justify-center items-center md:items-start text-white text-center md:text-left">
                    <h1 className='text-3xl md:text-[40px] font-bold text-white'>{blogsViewData?.blog_title}</h1>
                    <p className='text-sm md:text-base font-normal text-center w-full'>{moment(blogsViewData?.createdAt).format('DD-MMM-YYYY')}</p>
                </div>
            </section>

            <div className='max-w-7xl mx-auto py-10 px-3 md:px-0'>

                <p className='text-black md:text-lg text-base font-semibold font-nunito leading-[25px] mb-5 capitalize' dangerouslySetInnerHTML={{ __html: blogsViewData?.blog_content }}></p>

                {blogsViewData?.blog?.map((item, i) => (
                    <div key={i}>
                        <div className="py-5">
                            <p className="text-black text-3xl	font-bold	capitalize">
                                {item?.title}
                            </p>
                        </div>
                        <div
                            className={`grid ${item?.image === undefined || item?.services?.length === 0
                                ? "md:grid-cols-1 grid-cols-1 md:gap-0 gap-0"
                                : "md:grid-cols-2 grid-cols-1 md:gap-10 gap-0"
                                }   md:pb-10 pb-5`}
                        >
                            <div>
                                <img className="w-full rounded-[30px]" src={item?.image} />
                            </div>
                        </div>
                        <div className="md:pb-5">
                            <div className="text-black md:text-base text-sm font-semibold font-nunito leading-[25px] capitalize bg-white" dangerouslySetInnerHTML={{ __html: item?.content }}>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    )
}

export default blogsView
