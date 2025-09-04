import { useRouter } from "next/router"

const imgHandler = ({ value }) => {
    return (
        <div className='w-12 h-12 rounded-full overflow-hidden'>
            <img src={value} alt="" className='w-12 h-12 rounded-full object-cover' />
        </div>
    )
}
const nameHandler = ({ value }) => {
    return (
        <div className=' p-4  flex items-center'>
            <p className='font-semibold text-lg'>{value}</p>
        </div>
    )
}
const numberHandler = ({ value }) => {
    return (
        <div className=' p-4 flex items-center'>
            <p className='font-semibold text-lg'>{value}</p>
        </div>
    )
}
const statusHandler = ({ value }) => {
    return (
        <div className=' p-4 flex items-center'>
            <p className='font-semibold text-lg text-green-400'>{value}</p>
        </div>
    )
}
const detailsHandler = ({ value }) => {
    return (
        <div className=' p-4 flex items-center'>
            <p className='font-semibold text-lg text-neutral-400'>{value}</p>
        </div>
    )
}

export const columnsData = [
    {
        accessor: "img",
        Cell: imgHandler
    },
    {
        accessor: "name",
        Cell: nameHandler
    },
    {
        accessor: "number",
        Cell: numberHandler
    },
    {
        accessor: "status",
        Cell: statusHandler
    },
    {
        accessor: "more",
        Cell: detailsHandler
    },
]
const manageHandler = ({ value }) => {
    const router = useRouter()
    return (
        <div className="flex justify-between items-center gap-3">
            <button className="text-lg text-black font-semibold border-2 border-[#FFCD03] rounded-lg py-1 md:px-8 px-3" onClick={() => {
                router.push(`/donation-management/create`)
            }}>
                Review
            </button>
            <button className="text-lg text-black font-semibold  bg-[#FFCD03] rounded-lg py-1 md:px-8 px-3" onClick={() => {
                router.push(`/donation-management/create`)
            }}>
                Manage Ticket
            </button>
        </div>
    )
}

export const DonationManagementColumn = [
    {
        accessor: "img",
        Cell: imgHandler
    },
    {
        accessor: "name",
        Cell: nameHandler
    },
    {
        accessor: "number",
        Cell: numberHandler
    },
    {
        accessor: "id",
        Cell: manageHandler
    },

]
