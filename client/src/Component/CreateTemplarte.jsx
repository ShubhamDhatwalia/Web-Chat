import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const accessToken = import.meta.env.VITE_WHATSAPP_ACCESS_TOKEN;
const businessId = import.meta.env.VITE_WHATSAPP_BUSINESS_ID;

function CreateTemplarte({ onSuccess, templateData }) {
    const [formInput, setFormInput] = useState({
        templateName: '',
        category: '',
        language: '',
        headerOption: '',
        whatsappNumber: '',
        footerText: '',
        messageContent: '',
    });

    useEffect(() => {
        if (templateData) {
            setFormInput({
                templateName: templateData?.name || '',
                category: templateData?.category || '',
                language: templateData?.language || '',
                headerOption: templateData?.components?.find(c => c.type === 'HEADER')?.format || '',
                whatsappNumber: '',
                footerText: templateData?.components?.find(c => c.type === 'FOOTER')?.text || '',
                messageContent: templateData?.components?.find(c => c.type === 'BODY')?.text || '',
            });
        }
    }, [templateData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormInput((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submitted Data:', formInput);

        const {
            templateName,
            category,
            language,
            headerOption,
            footerText,
            messageContent
        } = formInput;

        const components = [];

        if (headerOption === "TEXT") {
            components.push({
                type: "HEADER",
                format: "TEXT",
                text: templateName
            });
        }

        components.push({
            type: "BODY",
            text: messageContent
        });

        if (footerText?.trim()) {
            components.push({
                type: "FOOTER",
                text: footerText
            });
        }

        const payload = {
            name: templateName.toLowerCase().replace(/\s+/g, '_'),
            language,
            category,
            components
        };

        const createTemplate = async (payload) => {
            try {
                const response = await axios.post(
                    `https://graph.facebook.com/v19.0/${businessId}/message_templates`,
                    payload,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`,
                        }
                    }
                );

                const existingTemplates = JSON.parse(localStorage.getItem('whatsappTemplates')) || [];
                const newTemplate = {
                    id: response.data.id || Date.now(), // fallback id
                    name: payload.name,
                    category: payload.category,
                    language: payload.language,
                    components: payload.components,
                    createdAt: new Date().toISOString()
                };
                localStorage.setItem('whatsappTemplates', JSON.stringify([...existingTemplates, newTemplate]));

                toast.success("Template created successfully!");
                console.log("Template created successfully:", response.data);
                onSuccess();
            } catch (error) {
                console.error("Error creating template:", error.response?.data || error.message);
                toast.error(error.response?.data?.error?.error_user_msg
                    || "Error creating template. Please try again.");
            }
        };

        createTemplate(payload);
    };

    const handleReset = () => {
        setFormInput({
            templateName: '',
            category: '',
            language: '',
            headerOption: '',
            whatsappNumber: '',
            footerText: '',
            messageContent: '',
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className='flex lg:flex-nowrap flex-wrap gap-[20px] mt-[50px]'>
                <input
                    type="text"
                    name="templateName"
                    value={formInput.templateName}
                    onChange={handleChange}
                    placeholder='Template Name *'
                    required
                    className='border-b py-[5px] w-full placeholder-gray-700 placeholder:font-semibold focus:outline-none'
                />

                <select
                    name="category"
                    value={formInput.category}
                    onChange={handleChange}
                    className='border-b py-[5px] w-full text-gray-700 font-semibold bg-transparent outline-none'
                >
                    <option value="" disabled>Category</option>
                    <option value="UTILITY">Utility</option>
                    <option value="MARKETING">Marketing</option>
                    <option value="AUTHENTICATION">Authentication</option>
                </select>

                <select
                    name="language"
                    value={formInput.language}
                    onChange={handleChange}
                    className='border-b py-[5px] w-full text-gray-700 font-semibold bg-transparent outline-none'
                >
                    <option value="" disabled>Language</option>
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                </select>
            </div>

            <h3 className="font-semibold mt-[40px] border-t border-gray-200 pt-[10px]">Header/Footer (Optional)</h3>
            <p className="text-sm font-semibold text-gray-700">
                Add a title or which type of media you'll use for this header
            </p>

            <div className='flex lg:flex-nowrap flex-wrap gap-[20px] mt-[50px]'>
                <select
                    name="headerOption"
                    value={formInput.headerOption}
                    onChange={handleChange}
                    className='border-b py-[5px] w-full text-gray-700 font-semibold bg-transparent outline-none'
                >
                    <option value="" disabled>Choose Header Options</option>
                    <option value="TEXT">text</option>
                    <option value="IMAGE">image</option>
                </select>

                <select
                    name="whatsappNumber"
                    value={formInput.whatsappNumber}
                    onChange={handleChange}
                    className='border-b py-[5px] w-full text-gray-700 font-semibold bg-transparent outline-none'
                >
                    <option value="" disabled>Choose Your Whatsapp Number</option>
                    <option value="7876054918">7876054918</option>
                    <option value="9999999999">9999999999</option>
                </select>
            </div>

            <div className='flex gap-[20px] mr-[20px]'>
                <textarea
                    name="footerText"
                    value={formInput.footerText}
                    onChange={handleChange}
                    placeholder="Footer Text (60 Characters)"
                    className='w-1/2 border-b py-[5px] mt-[80px] placeholder-gray-700 placeholder:font-semibold resize-none outline-none'
                    rows="1"
                />
            </div>

            <h3 className="font-semibold mt-[40px] border-t border-gray-200 pt-[10px]">Body</h3>
            <p className="text-sm font-semibold text-gray-700">
                Enter the text for your message in the language that you've selected
            </p>

            <div className="m-[10px]">
                <div className="mt-[20px]">
                    <textarea
                        name="messageContent"
                        required
                        value={formInput.messageContent}
                        onChange={handleChange}
                        placeholder="Message Content (1024 Characters)"
                        className="border-b bg-gray-100 py-[5px] w-full placeholder-gray-700 placeholder:font-semibold resize-none outline-none"
                        rows="10"
                    />
                </div>
            </div>

            <div className='mt-[30px] flex gap-[20px]'>
                <button
                    type='submit'
                    className='bg-green-600 hover:bg-green-700 cursor-pointer text-white font-semibold py-[5px] px-[12px] rounded'
                >
                    Save Template
                </button>

                <button
                    type='button'
                    onClick={handleReset}
                    className='bg-red-500 hover:bg-red-600 cursor-pointer text-white font-semibold py-[5px] px-[12px] rounded'
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}

export default CreateTemplarte;
