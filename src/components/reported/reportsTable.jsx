import React, { useMemo } from "react";
import Collapse from "@mui/material/Collapse";
import moment from "moment";
import { useState } from "react";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { timeSince } from "@/utils/service";

const ReportsTable = ({ row }) => {

  const props = { data: row?.original };
  const [open, setOpen] = useState(false);

  //console.log(props);
  const handleClick = () => {
    setOpen(!open);

  };
  console.log(props)
  return (
    <div className="mt-2">
      {/* border-2 border-custom-blue p-10 rounded */}
      <p className="text-[#07A404] text-base	font-bold">{timeSince(props?.data?.createdAt)}</p>
      {props.data && <div className={`${props.data.userType === 'USER' ? 'bg-red-200' : 'bg-yellow-200'} md:px-3 p-2 rounded-xl border-t-8 border-2 border-custom-blue`}>
        <div onClick={handleClick} className=" w-full">
          {/* flex justify-between */}
          <div className="rounded-[30px]  relative w-full">
            <div className="flex flex-row	items-center w-full">
              {/* <div className="flex justify-center  bg-custom-orange h-12 w-12 rounded-full mr-3">
                <button className="text-white  font-bold md:text-sm font-nunito  text-md text-center ">
                  {moment(props?.data?.createdAt).format("DD")}
                  <br />
                  {moment(props?.data?.createdAt).format("MMM")}
                </button>
              </div> */}

              <div className="grid md:grid-cols-5 grid-cols-1 w-full">
                <div className="col-span-3 flex items-center">
                  <p className="text-custom-darkBlack text-[19px] font-normal">
                    {props.data.issue}
                  </p>
                </div>
                <div className=" items-center">
                  <p className=" text-green-700 text-sm font-normal">
                    Reported By: #{props?.data?.user?.userID}
                  </p>
                  <p className="text-green-700 text-sm font-normal">
                    {props?.data?.user?.fullName}
                  </p>
                  <p className="text-green-700 text-sm font-normal">
                    {props?.data?.user?.phone}
                  </p>
                </div>
                <div className="  items-center">
                  <p className="text-red-700 text-sm font-normal">
                    Reported User: #{props?.data?.userType === 'USER' ? props?.data?.connection?.travellerid?.userID : props?.data?.connection?.packagerid?.userID}
                  </p>
                  <p className="text-red-700 text-sm font-normal">
                    {props?.data?.userType === 'USER' ? props?.data?.connection?.travellerid?.fullName : props?.data?.connection?.packagerid?.fullName}
                  </p>
                  <p className="text-red-700 text-sm font-normal">
                    {props?.data?.userType === 'USER' ? props?.data?.connection?.travellerid?.phone : props?.data?.connection?.packagerid?.phone}
                  </p>
                </div>
                {/* <div className="flex items-end justify-end">
                  <p className="text-custom-darkBlack text-base font-normal rounded border-2 border-custom-blue p-2 w-32">users ID:- {(props.data.user._id).toString().slice(props.data.user._id.length - 5, props.data.user._id.length - 1)}</p>
                </div> */}


                {/* <p className="text-black text-xs	font-normal	font-nunito leading-[16px]">
                  {props?.data?.details}
                </p>
                <p className="text-black text-xs	font-normal	font-nunito leading-[16px]">
                  {props?.data?.posted_by?.fullName},
                </p>
                <p className="text-black text-xs	font-normal	font-nunito leading-[16px]">
                  {props?.data?.posted_by?.email},
                </p> */}
              </div>
              <div className="ml-5">
                {/* <TiArrowSortedUp className="text-custom-blue text-xl " />
                <TiArrowSortedDown className="text-custom-blue text-xl " /> */}
                {open ? (
                  <TiArrowSortedUp className="text-custom-blue text-xl" />
                ) : (
                  <TiArrowSortedDown className="text-custom-blue text-xl" />
                )}
              </div>
            </div>

            {/* <div className="">
              <p className="text-sm  pt-2 text-custom-blue	font-normal	font-nunito leading-[24px]">
                My Issue -
                <span className="text-xs font-medium text-black">
                  ({props?.data?.slot?.time})
                </span>
              </p>
            </div> */}
          </div>
          {/* {open ? (
            <TiArrowSortedUp className="text-custom-orange text-xl" />
          ) : (
            <TiArrowSortedDown className="text-custom-orange text-xl" />
          )} */}
        </div>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <div className="flex justify-start items-center">
            <img className="bg-custom-blue h-10 w-10 rounded-full" src={props?.data?.connection?.packagePlan?.item_image} />
            <p className="text-custom-darkBlack text-base font-normal pl-5">{props?.data?.connection?.packagePlan?.name}</p>
          </div>



          {/* <div className="p-4">
            <h2 className="text-custom-orange text-xl"> {props.data?.job?.name}</h2>
            <div className="grid grid-cols-3 w-full p-2">
              <div>
                <p className="text-custom-orange text-md	font-nunito font-medium		leading-[19px] mt-2">
                  Date & Time
                </p>
                <div className="flex flex-row	items-center">
                  <div className="flex flex-col">
                    <p className="text-black text-xs	font-normal	font-nunito leading-[16px]">
                      {props.data?.job?.slot?.time}
                    </p>
                    <p className="text-black text-xs	font-normal	font-nunito leading-[16px]">
                      {moment(props.data?.job?.slot?.date).format(
                        "dddd, MMM DD, YYYY"
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-custom-orange text-md	font-nunito font-medium		leading-[19px] mt-2">
                  Job Location
                </p>
                <div className="flex flex-row	items-center">
                  <div className="flex flex-col">
                    <p className="text-black text-xs	font-normal	font-nunito leading-[16px]">
                      {props.data?.job?.location}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-custom-orange text-md	font-nunito font-medium		leading-[19px] mt-2">
                  Job & Details
                </p>
                {props.data?.job?.services?.map((ser, i) => (
                  <div className="flex flex-row items-center " key={i}>
                    <p className="text-black md:text-sm text-sm	 font-semibold	font-nunito leading-sm ml-2">
                      {ser?.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div> */}

          {/* <p className="text-custom-gray md:text-sm text-sm	 font-semibold	font-nunito leading-sm ml-2">
            {props?.data?.description}
          </p> */}
        </Collapse>
      </div>}
    </div>
  );
};

export default ReportsTable;
