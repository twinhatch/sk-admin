import moment from 'moment/moment'
import React from 'react'
import { AiOutlineDollarCircle, AiOutlineStar } from 'react-icons/ai'
import { BsGraphUp } from 'react-icons/bs'
import { FaUser } from 'react-icons/fa'
import { IoNewspaperOutline } from 'react-icons/io5'
import { GoCodeReview } from 'react-icons/go'
import { MdOutlineRateReview } from 'react-icons/md'
import { Line } from 'react-chartjs-2'
import { Chart } from 'chart.js/auto'

function Index() {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [

      {
        label: "Second dataset",
        data: [33, 25, 35, 51, 54, 76],
        fill: false,
        borderColor: "#742774"
      }
    ],
  };
  const options = {
    scales: {
      x: {
        grid: {
          display: false, // Remove x-axis grid lines
        },
      },
      y: {
        grid: {
          display: false, // Remove y-axis grid lines
        },
      },
    },
  };

  return (
    <section className=' p-4'>
      <div className=' w-full space-y-4'>
        <div className='p-6 border-2 border-custom-blue rounded-2xl'>
          <p className='text-lg font-medium'>{`${moment(new Date()).format('DD-MMM-YYYY')} , ${moment(new Date()).format('dddd')}`}</p>
          <h2 className='text-3xl font-medium'>Hello <span className='text-custom-blue'>Demomail</span></h2>
        </div>
        <div className=' grid md:grid-cols-3 gap-4 '>
          <div className='bg-custom-blue p-4 flex rounded-xl text-white'>
            <div className=' text-xl w-full'>
              <p>Platform Performance</p>
              <p>(Number of new user)</p>
            </div>
            <div className='w-14 h-full flex items-center'>
              <BsGraphUp className='text-3xl' />
            </div>
          </div>
          <div className='bg-custom-blue p-4 flex rounded-xl text-white'>
            <div className=' text-xl w-full'>
              <p>Active users</p>
              <p>60 Users</p>
            </div>
            <div className='w-14 h-full flex items-center'>
              <FaUser className='text-3xl' />
            </div>
          </div>
          <div className='bg-custom-blue p-4 flex rounded-xl text-white'>
            <div className=' text-xl w-full'>
              <p>Ongoing Transactions</p>
              <p>60 Transactions</p>
            </div>
            <div className='w-14 h-full flex items-center'>
              <IoNewspaperOutline className='text-3xl' />
            </div>
          </div>
          <div className='bg-custom-blue p-4 flex rounded-xl text-white'>
            <div className=' text-xl w-full'>
              <p>Earnings</p>
              <p>60000 ₹ </p>
            </div>
            <div className='w-14 h-full flex items-center'>
              <AiOutlineDollarCircle className='text-3xl' />
            </div>
          </div>
          <div className='bg-custom-blue p-4 flex rounded-xl text-white'>
            <div className=' text-xl w-full'>
              <p> Ratings</p>
              <p className='flex gap-1 mt-1'>
                <AiOutlineStar />
                <AiOutlineStar />
                <AiOutlineStar />
                <AiOutlineStar />
                <AiOutlineStar />
              </p>
            </div>
            <div className='w-14 h-full flex items-center'>
              <GoCodeReview className='text-3xl' />
            </div>
          </div>
          <div className='bg-custom-blue p-4 flex rounded-xl text-white'>
            <div className=' text-xl w-full'>
              <p>Reviews</p>
              <p>20 Reviews</p>
            </div>
            <div className='w-14 h-full flex items-center'>
              <MdOutlineRateReview className='text-3xl' />
            </div>
          </div>
        </div>
        <div>
          <div className='p-3 w-full bg-black rounded-md text-white text-2xl font-semibold'>
            <p>Graph</p>
          </div>
          <Line data={data} options={options} />
        </div>
      </div>
    </section>
  )
}

export default Index