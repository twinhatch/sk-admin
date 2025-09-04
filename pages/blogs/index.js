"use client";
import axios from 'axios';
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import moment from 'moment/moment'
import { FaArrowRight } from "react-icons/fa6";
import CreateBlog from '@/src/components/createBlog';
import { MdDelete } from "react-icons/md";
import { BiEdit } from "react-icons/bi";
import { Api } from '@/utils/service';
import { useRouter } from 'next/router';
import Swal from "sweetalert2";

function index(props) {
    const router = useRouter()
    const [blogsData, setblogsData] = useState([])
    const [showBlog, setShowBlog] = useState(false);
    const [singleBlog, setSingleBlog] = useState({});
    const [blogCategoryData, setblogCategoryData] = useState([]);
    const [BlogData, setBlogData] = useState([]);
    const [blogId, setBlogId] = useState("");

    useEffect(() => {
        getBlogs()
    }, [])

    const getBlogs = async () => {
        props.loader(true);
        Api("get", "/api/get-blog", "", router).then(
            (res) => {
                console.log("res================>", res);
                props.loader(false);

                if (res?.status) {
                    setblogsData(res.data)
                } else {
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

        // const data = (await axios.get(`/get-blog`)).data.data
        // setblogsData(data)
    }

    // const setInitialBlog = () => {
    //     setSelectedCategory({ id: 0, label: "All Blogs" });
    //     getBlogbyCategory(0);
    // };

    const DeleteBlog = (_id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You want to proceed with the deletion?",
            icon: "warning",
            showCancelButton: true,
            cancelButtonColor: "#d33",
            confirmButtonText: "Delete"
        })
            .then(function (result) {
                if (result.isConfirmed) {

                    const data = {
                        _id,
                    };

                    props.loader(true);
                    Api("delete", "/api/delete-blog", data, router).then(
                        (res) => {
                            console.log("res================>", res);
                            props.loader(false);

                            if (res?.status) {
                                getBlogs()
                                // setInitialBlog();
                            } else {
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

                } else if (result.isDenied) {
                    // setFullUserDetail({})
                }
            });
    };

    // const forUpdate = (id) => {
    //     console.log(id);
    //     setBlogId(id);
    //     const d = BlogData.find((f) => f._id === id);
    //     console.log(d)
    //     setSingleBlog(d);
    //     setShowBlog(true);
    // };

    return (
        <>
            {/* <Head>
          <title>Frequently Asked Questions (FAQ) - SK App | Earn Money While Traveling | India</title>
          <meta
            name="description"
            content="Explore answers to commonly asked questions about SK App, the platform that enables travelers in India to earn money while journeying. Discover how SK App works, how to get started, and more!"
          />
        </Head> */}
            <section className=" w-full h-full bg-white p-4 md:p-5 ">
                {/* <div className="border-b-8 border-[red] mb-[20px]">
                    <img src="/headimg.png" className="w-full  " />
                    <p className="md:text-[48px] text-[24px] text-white font-medium font-[Yeseva One] absolute md:mt-[-180px] md:ml-[100px] mt-[-50px] ml-[40px]">
                        Blogs
                    </p>
                </div> */}
                <h1 className="text-2xl md:text-3xl font-semibold text-custom-orange uppercase text-center mt-2 mb-10 text-black">
                    SK App Blogs{" "}
                </h1>


                {showBlog && (
                    <div className="p-5">
                        <CreateBlog
                            singleBlog={singleBlog}
                            setSingleBlog={setSingleBlog}
                            setShowBlog={setShowBlog}
                            blogCategoryData={blogCategoryData}
                            {...props}
                            setInitialBlog={getBlogs}
                        />
                    </div>
                )}

                <div className="h-full w-full">
                    <div className="p-5 flex justify-end items-end">
                        {!showBlog && (
                            <button
                                onClick={() => setShowBlog(true)}
                                className="bg-custom-blue text-white p-2 rounded-sm w-40 "
                            >
                                Create Blog
                            </button>
                        )}
                    </div>

                    <div className='w-full grid md:grid-cols-4 grid-cols-1 md:gap-6 gap-4 my-6'>
                        {
                            blogsData &&
                            blogsData?.map((blog, idx) => (
                                <div key={idx} className='w-full rounded-md overflow-hidden bg-white border border-custom-blue'>
                                    {/* href={`blogs/${blog._id}`} */}
                                    <div className='w-full relative'>
                                        <img src={blog.blog_image} alt="" className='w-full md:h-[300px] h-[150px] object-cover' onClick={() => router.push(`blogs/${blog._id}`)} />
                                        <img className='absolute right-5 bottom-[-30px]' src='/location.png' />
                                        <div className="absolute right-2 top-2 bg-custom-blue rounded-full p-1 cursor-pointer	">
                                            <MdDelete className="text-white" onClick={() => DeleteBlog(blog?._id)} />
                                        </div>
                                        <div className="absolute right-10 top-2 bg-custom-blue rounded-full p-1 cursor-pointer	">
                                            <BiEdit className="text-white" onClick={() => {
                                                // forUpdate(blog?._id)
                                                setSingleBlog(blog);
                                                setShowBlog(true);
                                            }} />
                                        </div>
                                    </div>
                                    <div className='text-start space-y-3 p-4 text-black pt-16'>
                                        <h3 className='text-xl font-semibold line-clamp-1 text-[15px] md:text-xl text-custom-blue'>{blog?.blog_title}</h3>
                                        {/* <p className='text-black'>{moment(blog.createdAt).format('DD-MMM-YYYY')}</p> */}
                                        <p className='line-clamp-4 text-sm md:text-base text-black' dangerouslySetInnerHTML={{ __html: blog.blog_content }}></p>
                                        <div className='flex justify-start items-center'>
                                            <p className='text-sm md:text-base text-black'>Learn More</p>
                                            <FaArrowRight className='text-custom-blue ml-2' />
                                        </div>
                                    </div>
                                </div>

                            ))
                        }
                    </div>

                </div>
            </section>
        </>
    )
}

export default index
