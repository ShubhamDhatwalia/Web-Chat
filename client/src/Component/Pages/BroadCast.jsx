import React, { useState } from 'react';




const accessToken = import.meta.env.VITE_WHATSAPP_ACCESS_TOKEN;
const businessId = import.meta.env.VITE_WHATSAPP_BUSINESS_ID;







function BroadCast() {
  const [fileName, setFileName] = useState('No file chosen');
  const [formInput, setFormInput] = useState({
    campaignName: '',
    whatsappNumber: '',
    message: '',
    template: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted:', formInput);
    // You can add API logic here to send data
  };

  const handleReset = (e) => {
    e.preventDefault();
    setFormInput({
      campaignName: '',
      whatsappNumber: '',
      message: '',
      template: '',
    });
    setFileName('No file chosen');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileName(file ? file.name : 'No file chosen');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className='bg-gray-100 px-[15px] py-[10px] '>
      <div className='flex justify-between gap-[20px] items-stretch'>
        <div className='bg-white p-[15px] rounded-md flex-[66%]'>
          <h2 className='font-bold text-xl'>Campaign/Broadcasting</h2>
          <p className='font-semibold text-md mt-[5px] text-gray-600'>
            Run a Campaign to broadcast your message
          </p>

          <form onSubmit={handleSubmit} className='mt-[50px]'>
            <div className='flex lg:flex-nowrap flex-wrap gap-[20px]'>
              <input
                type='text'
                name='campaignName'
                value={formInput.campaignName}
                onChange={handleChange}
                placeholder='Campaign Name *'
                required
                className='border-b p-[5px] w-full placeholder-gray-700 placeholder:font-semibold focus:outline-none'
              />

              <select
                name='whatsappNumber'
                value={formInput.whatsappNumber}
                onChange={handleChange}
                className='border-b p-[5px] w-full text-gray-700 font-semibold bg-transparent outline-none'
              >
                <option value='' disabled>
                  Send Message From Whatsapp Number *
                </option>
                <option value='7876054918'>7876054918</option>
                <option value='9876543210'>9876543210</option>
              </select>
            </div>

            <textarea
              name='message'
              value={formInput.message}
              onChange={handleChange}
              placeholder='Enter your message :'
              className='border-b p-[5px] w-full mt-[80px] placeholder-gray-700 placeholder:font-semibold resize-none outline-none'
              rows='1'
            />

            <div className='flex flex-wrap lg:flex-nowrap gap-[20px] mt-[80px] items-center'>
              <div className='w-full lg:order-1 order-2 flex justify-center gap-[10px] items-center'>
                <label
                  htmlFor='fileUpload'
                  className='cursor-pointer text-nowrap bg-blue-600 hover:bg-blue-700 text-white font-semibold py-[5px] px-[12px] rounded flex items-center gap-2'
                >
                  <i className='fa-solid fa-upload'></i>
                  Upload File
                </label>
                <input
                  type='file'
                  id='fileUpload'
                  onChange={handleFileChange}
                  className='hidden'
                />
                <span className='text-sm text-nowrap text-gray-600 mt-1'>{fileName}</span>
              </div>

              <select
                name='template'
                value={formInput.template}
                onChange={handleChange}
                className='lg:order-2 order-1 border-b p-[5px] w-full text-gray-700 font-semibold bg-transparent outline-none'
              >
                <option value='' disabled>
                  Choose Template
                </option>
                <option value='template1'>Template 1</option>
                <option value='template2'>Template 2</option>
              </select>
            </div>

            <div className='mt-[50px] flex gap-[20px] items-center'>
              <button
                type='submit'
                className='text-nowrap font-semibold bg-green-600 hover:bg-green-700 text-white cursor-pointer px-[12px] py-[5px] rounded-md'
              >
                Broadcast Now
              </button>

              <button
                type='button'
                className='font-semibold text-nowrap bg-red-500 hover:bg-red-600 text-white cursor-pointer px-[12px] py-[5px] rounded-md'
                onClick={handleReset}
              >
                Cancel
              </button>

              <button
                type='button'
                className='font-semibold text-nowrap bg-blue-600 hover:bg-blue-700 text-white cursor-pointer px-[12px] py-[5px] rounded-md'
              >
                Whatsapp Chat Report
              </button>
            </div>
          </form>
        </div>

        <div className='flex-[33%] bg-white p-[15px] rounded-md'>
          <h2 className='font-bold text-xl'>Template Content</h2>
          <p className='font-semibold text-md mt-[5px] text-gray-600'>
            Here you can see the selected template content body
          </p>
        </div>
      </div>

      <div className='mt-[20px] rounded-md p-[15px] bg-white'>
        <table className='table-auto w-full'>
          <thead>
            <tr className='bg-blue-600 text-white'>
              <th className='px-4 py-4'>Campaign Name</th>
              <th className='px-4 py-4'>Operator Name</th>
              <th className='px-4 py-4'>Creation Date</th>
              <th className='px-4 py-4'>Total Number Count</th>
              <th className='px-4 py-4'>Sent Count</th>
              <th className='px-4 py-4'>Delivered Count</th>
              <th className='px-4 py-4'>Read Count</th>
              <th className='px-4 py-4'>Failed Count</th>
              <th className='px-4 py-4'>Action</th>
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
    </div>
  );
}

export default BroadCast;
