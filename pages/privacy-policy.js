import React, { useState, useEffect } from 'react'
import { Api } from '@/utils/service';
import { useRouter } from 'next/router';

function PrivacyPolicy(props) {
    const router = useRouter();
    const [privacyPolicy, setPrivacyPolicy] = useState({
        privacy: ''
    })

    useEffect(() => {
        getPrivacyPolicy()
    }, [])

    const getPrivacyPolicy = () => {
        props.loader(true);
        Api("get", "/api/privacy", '', router).then(
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

    return (
        <div className='text-black p-5 w-full' dangerouslySetInnerHTML={{ __html: privacyPolicy?.privacy }}></div>
    )
}

export default PrivacyPolicy