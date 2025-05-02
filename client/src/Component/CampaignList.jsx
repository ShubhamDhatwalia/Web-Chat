import React from 'react'

function CampaignList() {
    return (
        <>


            <div className='mt-[20px] rounded-md p-[0px] bg-white text-gray-600 flex flex-col justify-between min-h-[45vh]'>
                <table className='table-auto w-full'>
                    <thead>
                        <tr className='bg-white border-b border-gray-300 text-nowrap text-center '>
                            <th className=' py-4 text-left'>Campaign Name</th>


                            <th className=' py-4'>Total Number Count</th>
                            <th className=' py-4'>Sent Count</th>

                            <th className=' py-4'>Read Count</th>
                            <th className=' py-4'>Failed Count</th>
                            <th className=' py-4 text-right'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* You can map campaign data here */}
                    </tbody>
                </table>

                <div className='flex items-center justify-between mt-4 px-4 py-2 text-sm text-gray-700'>
                    <div className='flex items-center gap-2'>
                        <span>Items per page:</span>
                        <select className='border border-gray-300 rounded px-2 py-1'>
                            <option>10</option>
                            <option selected>15</option>
                            <option>20</option>
                            <option>50</option>
                        </select>
                    </div>

                    <div className='flex items-center gap-2'>
                        <span>0 of 0</span>
                        <button className='p-1' disabled>
                            <i className='fas fa-angle-double-left text-gray-400' />
                        </button>
                        <button className='p-1' disabled>
                            <i className='fas fa-angle-left text-gray-400' />
                        </button>
                        <button className='p-1'>
                            <i className='fas fa-angle-right text-gray-600' />
                        </button>
                        <button className='p-1'>
                            <i className='fas fa-angle-double-right text-gray-600' />
                        </button>
                    </div>
                </div>
            </div>

        </>
    )
}

export default CampaignList