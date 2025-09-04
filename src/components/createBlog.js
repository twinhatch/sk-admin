import React, { useEffect, useRef, useState } from "react";
import { checkForEmptyKeys } from "../services/InputsNullChecker";
// import { Api } from "../services/service";
import { useRouter } from "next/router";
//import JoditEditor from "jodit-react";
import dynamic from "next/dynamic";
import { Api, ApiFormData } from "@/utils/service";
const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });
function CreateBlog(props) {
  console.log(props.singleBlog);
  const router = useRouter();
  const editor = useRef(null);
  const [submitted, setSubmitted] = useState(false);
  const cvRef = useRef()
  const [imageKey, setImageKey] = useState('');
  const [blog, setBlog] = useState({
    blog_title: "",
    blog_image: "",
    blog_content: "",
    metatitle: "",
    canonical: "",
    metadescription: "",
    subBlog: [
      {
        title: "",
        image: "",
        content: "",
        services: "",
      },
    ],
  });

  useEffect(() => {
    if (props?.singleBlog?._id) {
      setBlog({
        blog_title: props?.singleBlog?.blog_title,
        blog_image: props?.singleBlog?.blog_image,
        blog_content: props?.singleBlog?.blog_content,
        metatitle: props?.singleBlog?.metatitle,
        metadescription: props?.singleBlog?.metadescription,
        subBlog: props?.singleBlog?.blog,
        canonical: props?.singleBlog?.canonical,
      });
    }
  }, [props.singleBlog]);

  const update = () => {
    console.log(blog);
    // let { anyEmptyInputs } = checkForEmptyKeys(blog);
    // if (anyEmptyInputs.length > 0) {
    //   setSubmitted(true);
    //   return;
    // }
    props.loader(true);
    const data = {
      id: props?.singleBlog?._id,
      blog_title: blog?.blog_title,
      blog_image: blog?.blog_image,
      blog_content: blog?.blog_content,
      metatitle: blog?.metatitle,
      metadescription: blog?.metadescription,
      blog: blog?.subBlog,
      canonical:blog?.canonical,
    };
    console.log(data);
    props.loader(true);
    Api("post", "/api/update-blog", data, router).then(
      (res) => {
        console.log("res================>", res);
        props.loader(false);

        if (res?.status) {
          setBlog({
            blog_title: "",
            blog_image: "",
            blog_content: "",
            metatitle: "",
             canonical: "",
            metadescription: "",
            subBlog: [
              {
                title: "",
                image: "",
                content: "",
                services: "",
              },
            ],
          });
          setSubmitted(false);
          props.setSingleBlog({})
          props.setInitialBlog();
          props.setShowBlog(false);
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
  };

  const handleImageChange = (event, type) => {
    const file = event.target.files[0];
    const data = new FormData()
    data.append('file', file)
    props.loader(true);
    ApiFormData("post", "/api/user/fileupload", data, router).then(
      (res) => {
        props.loader(false);
        // setIsRequired(false)
        console.log("res================>", res);
        if (res.status) {
          setBlog({ ...blog, [imageKey]: res.data.file })
          cvRef.current.value = '';
          setImageKey('')

          props.toaster({ type: "success", message: res.data?.message });
        }
        // setOfferData(res.data);
      },
      (err) => {
        // setIsRequired(false)
        props.loader(false);
        console.log(err);
        props.toaster({ type: "error", message: err?.message });
      }
    );


  };

  const submit = () => {
    console.log(blog);
    // let { anyEmptyInputs } = checkForEmptyKeys(blog);
    // if (anyEmptyInputs.length > 0) {
    //   setSubmitted(true);
    //   return;
    // }
    props.loader(true);
    const data = {
      blog_title: blog?.blog_title,
      blog_image: blog?.blog_image,
      blog_content: blog?.blog_content,
      metatitle: blog?.metatitle,
      metadescription: blog?.metadescription,
      category: blog?.category,
      blog: blog?.subBlog,
      website: blog?.website,
      canonical:blog?.canonical,
    };
    console.log(data);
    props.loader(true);
    Api("post", "/api/create-blog", data, router).then(
      (res) => {
        console.log("res================>", res);
        props.loader(false);

        if (res?.status) {
          setBlog({
            blog_title: "",
            blog_image: "",
            blog_content: "",
            metatitle: "",
            metadescription: "",
 canonical: "",
            subBlog: [
              {
                title: "",
                image: "",
                content: "",
                services: "",
              },
            ],
          });
          setSubmitted(false);
          props.setInitialBlog();
          props.setShowBlog(false);
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
  };

  return (
    <div>
          <input ref={cvRef} placeholder='Amount' type='file' className=" w-full border-b hidden  border-gray-400 outline-none bg-white text-black"
        onChange={(e) => { handleImageChange(e) }} />
      <div className="grid grid-cols-2 bg-custom-lightBlue md:px-5 p-3 rounded-sm  border-t-4 border-custom-blue">
        <div>
          <p className="text-black font-bold md:text-3xl text-lg">
            {props?.singleBlog?._id ? "Update" : "Create"} Blog
          </p>
        </div>
      </div>
      <div className=" border-2 border-custom-blue rounded-sm p-5">
        <div className="grid md:grid-cols-2 gap-3 grid-cols-1 items-start">
          <div className="grid grid-cols-1 ">
            <p className="text-custom-gray text-lg font-semibold">Blog Title</p>
            <input
              className="outline-none border rounded-lg p-2 w-full"
              type="text"
              placeholder="Blog Title"
              value={blog.blog_title}
              onChange={(text) => {
                setBlog({
                  ...blog,
                  blog_title: text.target.value,
                });
              }}
            />
            {submitted && blog.blog_title === "" && (
              <p className="text-red-700 mt-1"> Blog Title is required</p>
            )}
          </div>

          <div className="grid grid-cols-1">
            <p className="text-custom-gray text-lg font-semibold">Blog Image</p>
            <div className="w-full flex">
            <input
              className="outline-none border rounded-lg p-2 w-full"
              type="text"
              placeholder="Blog Image"
              value={blog.blog_image}
              onChange={(text) => {
                setBlog({
                  ...blog,
                  blog_image: text.target.value,
                });
              }}
            />
            <p className=" bg-custom-blue text-white cursor-pointer px-2 rounded-md flex items-center" onClick={() => { cvRef.current.click(); setImageKey('blog_image') }}>Upload</p>
            </div>
            {submitted && blog.blog_image === "" && (
              <p className="text-red-700 mt-1"> Blog Image is required</p>
            )}
          </div>

          {/* <div className="grid grid-cols-1">
            <p className="text-custom-gray text-lg font-semibold">Blog Image</p>
            <input
              className="outline-none border rounded-lg p-2 w-full"
              type="text"
              placeholder="Blog Image"
              value={blog.blog_image}
              onChange={(text) => {
                setBlog({
                  ...blog,
                  blog_image: text.target.value,
                });
              }}
            />
            {submitted && blog.blog_image === "" && (
              <p className="text-red-700 mt-1"> Blog Image is required</p>
            )}
          </div> */}

          <div className="grid grid-cols-1 ">
            <p className="text-custom-gray text-lg font-semibold">Meta Title</p>
            <input
              className="outline-none border rounded-lg p-2 w-full"
              type="text"
              placeholder="Meta Title"
              value={blog.metatitle}
              onChange={(text) => {
                setBlog({
                  ...blog,
                  metatitle: text.target.value,
                });
              }}
            />
            {submitted && blog.metatitle === "" && (
              <p className="text-red-700 mt-1">Meta Title is required</p>
            )}
          </div>

          <div className="grid grid-cols-1">
            <p className="text-custom-gray text-lg font-semibold">Meta Description</p>
            <input
              className="outline-none border rounded-lg p-2 w-full"
              type="text"
              placeholder="Meta Description"
              value={blog.metadescription}
              onChange={(text) => {
                setBlog({
                  ...blog,
                  metadescription: text.target.value,
                });
              }}
            />
            {submitted && blog.metadescription === "" && (
              <p className="text-red-700 mt-1">Meta Description is required</p>
            )}
          </div>
          
          <div className="grid grid-cols-1">
            <p className="text-custom-gray text-lg font-semibold">Canonical</p>
            <input
              className="outline-none border rounded-lg p-2 w-full"
              type="text"
              placeholder="Meta Description"
              value={blog.canonical}
              onChange={(text) => {
                setBlog({
                  ...blog,
                  canonical: text.target.value,
                });
              }}
            />
            {submitted && blog.canonical === "" && (
              <p className="text-red-700 mt-1">Canonical is required</p>
            )}
          </div>

          <div className="grid grid-cols-1  col-span-2">
            <p className="text-custom-gray text-lg font-semibold">
              Blog Content
            </p>

            {/* <textarea
              rows={5}
              className="outline-none border rounded-lg p-2 w-full"
              type="text"
              placeholder="Blog Content"
              value={blog.blog_content}
              onChange={(text) => {
                setBlog({
                  ...blog,
                  blog_content: text.target.value,
                });
              }}
            /> */}

            <JoditEditor
              className="editor max-h-screen overflow-auto"
              ref={editor}
              rows={5}
              value={blog.blog_content}
              onChange={(text) => {
                setBlog({
                  ...blog,
                  blog_content: text,
                });
              }}
            />

            {submitted && blog.blog_content === "" && (
              <p className="text-red-700 mt-1"> Blog Content is required</p>
            )}
          </div>

          {/* <div className="grid grid-cols-1 ">
            <p className="text-custom-gray text-lg font-semibold">Category</p>
            <select
              className="outline-none border rounded-lg p-2 w-full"
              placeholder="title"
              value={blog.category}
              onChange={(text) => {
                setBlog({
                  ...blog,
                  category: text.target.value,
                });

              }}
            >
              {props?.blogCategoryData.map((item, i) => (
                <option value={item?.id} key={i}>
                  {item?.label}
                </option>
              ))}
            </select>
            {submitted && blog.category === "" && (
              <p className="text-red-700 mt-1"> Category is required</p>
            )}
          </div> */}

          {/* <div className="grid grid-cols-1 ">
            <p className="text-custom-gray text-lg font-semibold">Website</p>
            <select
              className="outline-none border rounded-lg p-2 w-full"
              placeholder="title"
              value={blog.website}
              onChange={(text) => {
                setBlog({
                  ...blog,
                  website: text.target.value,
                });

              }}
            >
              <option value={'ADN'} >
                ADN
              </option>
              <option value={'OVEN'}>
                OVEN
              </option>
              <option value={'COMMERCIAL'}>
                COMMERCIAL
              </option>
            </select>
            {submitted && blog.website === "" && (
              <p className="text-red-700 mt-1"> website is required</p>
            )}
          </div> */}
        </div>

        <div>
          <p className="text-custom-blue py-5 md:text-3xl text-lg font-bold">
            Sub Blog
          </p>
          <div className=" border-2 border-custom-blue rounded-sm p-5">
            {blog.subBlog.map((item, i) => (
              <div key={i}>
                <p className="text-custom-orange py-1 md:text-lg text-sm font-bold">
                  Blog - {i + 1}
                </p>
                <div className="grid md:grid-cols-2 gap-3 grid-cols-1 items-start rounded-[30px] border border-[#007CFA33] p-5">
                  <div className="grid grid-cols-1 ">
                    <p className="text-custom-gray text-lg font-semibold">
                      Sub Title
                    </p>
                    <input
                      className="outline-none border rounded-lg p-2 w-full"
                      type="text"
                      placeholder="Sub Title"
                      value={item.title}
                      onChange={(text) => {
                        item.title = text.target.value;
                        setBlog({
                          ...blog,
                          subBlog: [...blog.subBlog],
                        });
                      }}
                    />
                    {/* {submitted && blog.title === "" && (
                    <p className="text-red-700 mt-1"> Sub Title is required</p>
                  )} */}
                  </div>
                  <div className="grid grid-cols-1 ">
                    <p className="text-custom-gray text-lg font-semibold">
                      Sub Image
                    </p>
                    <input
                      className="outline-none border rounded-lg p-2 w-full"
                      type="text"
                      placeholder="Sub Image"
                      value={item.image}
                      onChange={(text) => {
                        item.image = text.target.value;
                        setBlog({
                          ...blog,
                          subBlog: [...blog.subBlog],
                        });
                      }}
                    />
                    {/* {submitted && blog.image === "" && (
                    <p className="text-red-700 mt-1"> Sub Image is required</p>
                  )} */}
                  </div>
                  <div className="grid grid-cols-1 col-span-2">
                    <p className="text-custom-gray text-lg font-semibold">
                      Sub Content
                    </p>
                    {/* <textarea
                      rows={5}
                      className="outline-none border rounded-lg p-2 w-full"
                      type="text"
                      placeholder="title"
                      value={item.content}
                      onChange={(text) => {
                        item.content = text.target.value;
                        setBlog({
                          ...blog,
                          subBlog: [...blog.subBlog],
                        });
                      }}
                    /> */}
                    <JoditEditor
                      className="editor max-h-screen overflow-auto"
                      ref={editor}
                      rows={5}
                      value={item.content}
                      onChange={newContent => {
                        item.content = newContent;
                        setBlog({
                          ...blog,
                          subBlog: [...blog.subBlog],
                        });
                        console.log(blog);
                      }}
                    />

                    {/* {submitted && blog.content === "" && (
                    <p className="text-red-700 mt-1">
                      {" "}
                      Sub Content is required
                    </p>
                  )} */}
                  </div>
                  {/* <div className="grid grid-cols-1 ">
                    <p className="text-custom-gray text-lg font-semibold">
                      Services
                    </p>
                    <input
                      className="outline-none border rounded-lg p-2 w-full"
                      type="text"
                      placeholder="title"
                      value={item.services}
                      onChange={(text) => {
                        item.services = text.target.value;
                        setBlog({
                          ...blog,
                          subBlog: [...blog.subBlog],
                        });
                      }}
                    />
                  
                  </div> */}
                </div>
              </div>
            ))}
            <div className="flex justify-end mt-5">
              <button
                onClick={() => {
                  setBlog({
                    ...blog,
                    subBlog: [
                      ...blog.subBlog,
                      { title: "", image: "", content: "", services: "" },
                    ],
                  });
                }}
                className="text-white bg-custom-blue rounded-sm  text-md py-21 w-36 h-10"
              >
                Add Sub Blog
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-4">
          {!props?.singleBlog?._id && (
            <button
              onClick={submit}
              className="text-white bg-custom-blue rounded-sm  text-md py-21 w-36 h-10"
            >
              Create
            </button>
          )}

          {props?.singleBlog?._id && (
            <button
              onClick={update}
              className="text-white bg-custom-blue rounded-sm  text-md py-21 w-36 h-10"
            >
              Update
            </button>
          )}
          <button
            onClick={() => props.setShowBlog(false)}
            className="text-white bg-custom-blue rounded-sm  text-md py-21 w-36 h-10"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateBlog;
