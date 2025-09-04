import React, { useState, useEffect } from 'react'
import { Api } from '@/utils/service';
import { useRouter } from 'next/router';

function TermsCondition(props) {
    const router = useRouter();
    const [terms, setTerms] = useState({
        termsAndConditions: ''
    })

    useEffect(() => {
        getContent()
    }, [])

    const getContent = () => {
        props.loader(true);
        Api("get", "/api/content", '', router).then(
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

    return (
        <div className='text-black p-5 w-full' dangerouslySetInnerHTML={{ __html: terms?.termsAndConditions }}></div>
    )
}

export default TermsCondition