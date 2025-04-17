import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const accessToken = import.meta.env.VITE_WHATSAPP_ACCESS_TOKEN;
const businessId = import.meta.env.VITE_WHATSAPP_BUSINESS_ID;

function MessageTemplateList({ onSuccess, onSelectTemplateId, selectedTemplateId }) {
  const [templateList, setTemplateList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const languageMap = {
    en: 'English',
    hi: 'Hindi'
  };

  const handleDeleteTemplate = async (template) => {
    const deleteUrl = `https://graph.facebook.com/v22.0/${businessId}/message_templates`;
    const params = new URLSearchParams({
      hsm_id: template.id,
      name: template.name,
      access_token: accessToken,
    });

    try {
      const response = await axios.delete(`${deleteUrl}?${params.toString()}`);
      if (response.data.success) {
        toast.success('Template deleted successfully!');
        const existing = JSON.parse(localStorage.getItem('whatsappTemplates') || '[]');
        const updated = existing.filter((e) => e.id !== template.id);
        localStorage.setItem('whatsappTemplates', JSON.stringify(updated));
        setTemplateList(updated.filter((t) => !t.deleted));
      }
    } catch (error) {
      console.error('Failed to delete template:', error?.response?.data || error.message);
      toast.error('Failed to delete template. Check console for details.');
    }
  };

  const handleEditTemplate = (template) => {
    onSuccess(template);
    console.log(template);
  };

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        access_token: accessToken,
        limit: '1000',
      });

      const response = await axios.get(
        `https://graph.facebook.com/v22.0/${businessId}/message_templates?${queryParams}`
      );

      const apiTemplates = response.data.data;
      const existing = JSON.parse(localStorage.getItem('whatsappTemplates') || '[]');

      const updated = existing.map((e) => {
        const latest = apiTemplates.find((t) => t.id === e.id);
        return latest ? { ...e, ...latest } : e;
      });

      const onlyNew = apiTemplates.filter((t) => !existing.some((e) => e.id === t.id));
      const finalTemplates = [...onlyNew, ...updated];
      const visibleTemplates = finalTemplates.filter((t) => !t.deleted);

      localStorage.setItem('whatsappTemplates', JSON.stringify(finalTemplates));
      setTemplateList(visibleTemplates);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [limit, searchTerm]);

  const reversedTemplates = [...templateList].reverse();

  const filteredTemplates = reversedTemplates.filter((template) => {
    const search = searchTerm.toLowerCase();
    return (
      template.name?.toLowerCase().includes(search) ||
      template.category?.toLowerCase().includes(search) ||
      template.status?.toLowerCase().includes(search) ||
      languageMap[template.language]?.toLowerCase().includes(search) ||
      template.id?.toLowerCase().includes(search)
    );
  });

  const totalPages = Math.ceil(filteredTemplates.length / limit);
  const currentData = filteredTemplates.slice((currentPage - 1) * limit, currentPage * limit);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="mt-[20px] rounded-md bg-white min-h-[calc(100vh-180px)] flex flex-col justify-between">


      {loading ? (
        <div className="py-10 text-center text-gray-500 text-lg">Loading templates...</div>
      ) : (
        <>

          <div>
            <div className="pb-2">
              <input
                type="text"
                placeholder="Search by name, category, status, ID, or language..."
                className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <table className="table-auto w-full ">


              <thead>
                <tr className="bg-blue-600 text-white text-center ">
                  <th className="px-4 py-4 text-left">Template Id</th>
                  <th className="px-4 py-4">Template Name</th>
                  <th className="px-4 py-4">Category</th>
                  <th className="px-4 py-4">Language</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4 text-right">Last Edited</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((template, index) => (
                  <tr
                    key={template.id || index}
                    className={`group border-b border-gray-200 hover:bg-blue-100 text-md font-semibold cursor-pointer text-sm text-center
        ${selectedTemplateId === template.id ? 'bg-blue-100' : ''}`}
                    onClick={() => onSelectTemplateId?.(template.id)}
                  >
                    <td className="px-4 py-3 text-left">{template.id}</td>
                    <td className="px-4 py-3">{template.name}</td>
                    <td className="px-4 py-3">{template.category}</td>
                    <td className="px-4 py-3">{languageMap[template.language] || template.language}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-2xl px-2 py-1 text-white text-center  
            ${template.status.toLowerCase() === 'approved'
                            ? 'bg-green-100 !text-green-700'
                            : template.status.toLowerCase() === 'pending'
                              ? 'bg-orange-100 !text-orange-500'
                              : template.status.toLowerCase() === 'rejected'
                                ? 'bg-red-100 !text-red-700'
                                : 'bg-gray-300'
                          }`}
                      >
                        {template.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 italic relative">
                      <span className={`group-hover:hidden ${selectedTemplateId === template.id ? 'hidden' : 'text-nowrap'}`}>
                        {template.createdAt
                          ? new Intl.DateTimeFormat('en-US', {
                            dateStyle: 'medium',
                          }).format(new Date(template.createdAt))
                          : 'N/A'}
                      </span>
                      <div
                        className={`gap-6 justify-center items-center absolute top-1/2 transform -translate-y-1/2 left-0 right-0
            ${selectedTemplateId === template.id ? 'flex' : 'hidden group-hover:flex'}`}
                      >
                        <i
                          className="fa-solid text-blue-500 fa-pen-to-square hover:text-blue-600 cursor-pointer text-lg bg-white p-2 rounded-full"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent row click event
                            handleEditTemplate(template);
                          }}
                        ></i>
                        <i
                          className="fa-solid text-red-400 fa-trash hover:text-red-500 cursor-pointer text-lg bg-white p-2 rounded-full"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent row click event
                            handleDeleteTemplate(template);
                          }}
                        ></i>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>



            </table>
          </div>


          {/* Pagination Footer */}
          <div className="flex items-center justify-between mt-4 px-4 py-2 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <span>Items per page:</span>
              <select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="border border-gray-300 rounded px-2 py-1 focus:outline-none"
              >
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-500">
                Page {currentPage} of {totalPages}
              </span>
              <button onClick={handlePrev} disabled={currentPage === 1} className="p-1">
                <i
                  className={`fas text-xl fa-angle-left ${currentPage === 1 ? 'text-gray-400' : 'text-gray-600'
                    }`}
                />
              </button>
              <button onClick={handleNext} disabled={currentPage === totalPages} className="p-1">
                <i
                  className={`fas text-xl fa-angle-right ${currentPage === totalPages ? 'text-gray-400' : 'text-gray-600'
                    }`}
                />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default MessageTemplateList;
