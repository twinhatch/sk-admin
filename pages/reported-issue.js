import React, { useEffect, useState, useMemo } from 'react'
// import { Api } from "../src/services/service";
import { useRouter } from "next/router";
import ReportsTable from "../src/components/reported/reportsTable";
import Table from "../src/components/reported/customTableAct";
import { Api, timeSince } from '@/utils/service';

function Reportedissue(props) {
  const router = useRouter();
  const [GetInTouchData, setGetInTouchData] = useState([]);
  const [mainList, setmainList] = useState([]);
  const [activitytype, setActiVityType] = useState("All");

  useEffect(() => {
    getReports();
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: "Activity",
        Cell: ReportsTable,
      },
    ],
    []
  );

  useEffect(() => {
    if (activitytype === "All") {
      setGetInTouchData(mainList);
    } else {
      let d = [];
      if (activitytype === "Hour") {
        d = mainList.filter(
          (f) =>
            timeSince(f.createdAt).includes("Min") ||
            timeSince(f.createdAt).includes("Hour") ||
            timeSince(f.createdAt).includes("1 Day")
        );
      }
      if (activitytype === "Day") {
        d = mainList.filter(
          (f) =>
            timeSince(f.createdAt).includes("Min") ||
            timeSince(f.createdAt).includes("Hour") ||
            timeSince(f.createdAt).includes("Day") ||
            timeSince(f.createdAt).includes("1 Week")
        );
      }
      if (activitytype === "Week") {
        d = mainList.filter(
          (f) =>
            timeSince(f.createdAt).includes("Min") ||
            timeSince(f.createdAt).includes("Hour") ||
            timeSince(f.createdAt).includes("Day") ||
            timeSince(f.createdAt).includes("Week") ||
            timeSince(f.createdAt).includes("1 Month")
        );
      }

      setGetInTouchData(d);
    }
  }, [activitytype]);

  const getReports = () => {
    props.loader(true);
    Api("get", "/api/getAllReports", '', router).then(
      (res) => {
        console.log("res================>", res.data.incident);
        props.loader(false);

        if (res?.status) {
          console.log(res.data)
          setGetInTouchData(res.data)
          setmainList(res.data)
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

  const filterData = (event) => {
    console.log(event)
    if (event?.target?.value.length > 0) {
      const newdata = mainList.filter(f => f?.connection?.travellerid?.userID?.includes(event.target.value) || f?.connection?.packagerid?.userID?.includes(event.target.value))
      setGetInTouchData(newdata)
    } else {
      setGetInTouchData(mainList)
    }
  }


  return (
    <div className="w-full mx-auto p-5">
      <div className="md:grid grid-cols-2 bg-[#E9E9E9] md:px-5 p-4 rounded-xl border-t-8 border-custom-blue">
        <div className='md:mb-0 mb-3'>
          <p className="text-custom-darkBlac font-bold md:text-3xl text-lg">
            Report Issue
          </p>
        </div>
        <div className="flex justify-center flex-col items-end">
          <div>
            <h6 className=' text-black mb-2'>
              Search: <input placeholder='Search By UserID' className='border border-black text-sm rounded-md px-5  py-1' onChange={filterData} />
            </h6>
          </div>
          <div className="flex rounded-lg w-60 bg-black">
            <button
              className={`text-white ${activitytype === "Hour" && "bg-custom-blue"
                } rounded-lg text-sm font-bold h-8  w-20 `}
              onClick={() => setActiVityType("Hour")}
            >
              Today
            </button>
            <button
              className={`text-white ${activitytype === "Day" && "bg-custom-blue"
                } rounded-lg text-sm font-bold h-8  w-20 `}
              onClick={() => setActiVityType("Day")}
            >
              Week
            </button>
            <button
              className={`text-white ${activitytype === "Week" && "bg-custom-blue"
                } rounded-lg text-sm font-bold h-8  w-20 `}
              onClick={() => setActiVityType("Week")}
            >
              Month
            </button>

            <button
              className={`text-white ${activitytype === "All" && "bg-custom-blue"
                } rounded-lg text-xs h-8  w-20 `}
              onClick={() => setActiVityType("All")}
            >
              All
            </button>
          </div>
          {/* <img className='ml-3' src='/search.svg' /> */}
          {/* <div className="h-8 w-8 bg-red-700 rounded-md ml-3 flex justify-center items-center">
              <IoSearch className="text-white" />
            </div> */}
        </div>


      </div>
      <div className="rounded border-[3px] border-custom-blue md:px-5 px-3">
        <Table columns={columns} data={GetInTouchData} />
      </div>
    </div>
  );
}

export default Reportedissue