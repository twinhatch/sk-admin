import React, { useContext, useEffect, useState } from 'react'
import dynamic from 'next/dynamic';
import { Api } from '@/utils/service';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import moment from 'moment';
import { userContext } from './_app';
import FAQ from '@/src/components/Faq';

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });
function ContentManagement(props) {
  const [terms, setTerms] = useState({
    termsAndConditions: ''
  })
  const [user, setUser] = useContext(userContext)
  const [privacyPolicy, setPrivacyPolicy] = useState({
    privacy: ''
  })
  const [tab, setTab] = useState('CONTENT')
  const router = useRouter();

  useEffect(() => {
    getContent()
    getPrivacyPolicy()
  }, [])

  const getPrivacyPolicy = () => {
    props.loader(true);
    Api("get", "/api/privacy", router).then(
      (res) => {
        console.log("res================>", res.data);
        props.loader(false);

        if (res?.status && res?.data.length > 0) {
          setPrivacyPolicy(res?.data[0])
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

  }

  const privacyPolicyUpdate = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't to update privacy policy!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!"
    }).then((result) => {
      if (result.isConfirmed) {
        props.loader(true);
        Api("post", "/api/privacy", { privacy: privacyPolicy.privacy, id: privacyPolicy._id }, router).then(
          (res) => {
            console.log("res================>", res.data);
            // incident
            console.log(res.data.content)
            props.loader(false);
            if (res?.status) {
              // console.log(res.data)
              props.toaster({ type: "success", message: res?.data?.message })
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
      }
    });
  }



  const getContent = () => {
    props.loader(true);
    Api("get", "/api/content", router).then(
      (res) => {
        console.log("res================>", res.data.incident);
        props.loader(false);

        if (res?.status) {
          setTerms({ termsAndConditions: res?.data[0]?.termsAndConditions, id: res?.data[0]?._id })
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
  };
  console.log(terms)

  const termsSubmit = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't to update terms and condition!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!"
    }).then((result) => {
      if (result.isConfirmed) {
        props.loader(true);
        Api("post", "/api/content", { termsAndConditions: terms.termsAndConditions, id: terms.id }, router).then(
          (res) => {
            console.log("res================>", res.data.incident);
            props.loader(false);
            if (res?.status) {
              // console.log(res.data)
              props.toaster({ type: "success", message: res?.data?.message })

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
      }
    });
  }

  return (
    <div className="w-full mx-auto p-5">
      <div className='md:p-6 p-3 border-2 border-custom-blue rounded-2xl flex flex-col md:flex-row  items-center justify-between gap-2 md:gap-0'>
        <div className='w-full text-center md:text-left'>
          <p className='text-md md:text-lg font-medium'>{`${moment(new Date()).format('DD-MMM-YYYY')} , ${moment(new Date()).format('dddd')}`}</p>
          <h2 className='text-2xl md:text-3xl font-medium'>Hello <span className='text-custom-blue'>{user?.fullName}</span></h2>
        </div>
        <div className='flex flex-col md:flex-row md:gap-4 gap-2 text-center'>
          <div className={` py-2 px-6 rounded-md  w-40 cursor-pointer ${tab === 'FAQ' ? 'bg-custom-blue text-white' : 'bg-white border-2 text-custom-blue border-custom-blue'}`}
            onClick={() => {
              setTab('FAQ');
            }}>
            <p> FAQ</p>
          </div>
          <div className={` py-2 px-6 rounded-md  w-60 cursor-pointer ${tab === 'CONTENT' ? 'bg-custom-blue text-white' : 'bg-white border-2 text-custom-blue border-custom-blue'}`}
            onClick={() => setTab('CONTENT')}>
            <p>Content Management</p>
          </div>
        </div>
      </div>
      {tab === 'CONTENT' && <div>
        <div className="md:grid grid-cols-2 bg-[#E9E9E9] md:px-5 p-4 rounded-xl border-t-8 mt-5 border-custom-blue">
          <div className='md:mb-0 mb-3'>
            <p className="text-custom-darkBlac font-bold md:text-3xl text-lg">
              Terms and Condition
            </p>
          </div>
        </div>

        <section className='pb-4 relative'>
          <div className='w-[99%] mx-auto md:w-full bg-white h-full border-[3px] border-custom-blue rounded-lg p-3 md:p-8 flex flex-col overflow-auto space-y-4'>

            <div className='w-full  text-sm md:text-md rounded-2xl  space-y-4 border-t-[10px] border-custom-blue'>
              <JoditEditor
                className="editor max-h-screen overflow-auto"
                rows={8}
                value={terms?.termsAndConditions}
                onChange={newContent => {
                  setTerms({
                    ...terms,
                    termsAndConditions: newContent,
                  });
                }}
              />
              {/* <textarea name="" id="" rows="15" className="w-full h-full bg-transparent outline-none"></textarea> */}
            </div>
            <div className="flex gap-10 items-center justify-center md:justify-start">
              <button className="text-lg text-white font-semibold  bg-custom-blue rounded-lg md:py-2 py-1 px-2 md:px-8" onClick={termsSubmit}>Update</button>
            </div>
          </div>
        </section>

        <div>
          <div className="md:grid grid-cols-2 bg-[#E9E9E9] md:px-5 p-4 rounded-xl border-t-8 border-custom-blue">
            <div className='md:mb-0 mb-3'>
              <p className="text-custom-darkBlac font-bold md:text-3xl text-lg">
                Privacy Policy
              </p>
            </div>
          </div>

          <section className='pb-4 relative'>
            <div className='w-[99%] mx-auto md:w-full bg-white h-full border-[3px] border-custom-blue rounded-lg p-3 md:p-8 flex flex-col overflow-auto space-y-4'>
              <div className='w-full  text-sm md:text-md rounded-2xl  space-y-4 border-t-[10px] border-custom-blue'>
                <JoditEditor
                  className="editor max-h-screen overflow-auto"
                  rows={8}
                  value={privacyPolicy.privacy}
                  onChange={newContent => {
                    setPrivacyPolicy({
                      ...privacyPolicy,
                      privacy: newContent
                    });
                  }}
                />
              </div>
              <div className="flex gap-10 items-center justify-center md:justify-start">
                <button className="text-lg text-white font-semibold  bg-custom-blue rounded-lg md:py-2 py-1 px-2 md:px-8" onClick={privacyPolicyUpdate}>Update</button>
              </div>
            </div>
          </section>
        </div>
      </div>}

      {
        tab === 'FAQ' &&
        <div>
          <div className="md:grid grid-cols-2 bg-[#E9E9E9] md:px-5 p-4 rounded-xl border-t-8 mt-5 border-custom-blue">
            <div className='md:mb-0 mb-3'>
              <p className="text-custom-darkBlac font-bold md:text-3xl text-lg">
                FAQ
              </p>
            </div>
          </div>
          <FAQ props={props} />
        </div>
      }


    </div>
  );
}

export default ContentManagement