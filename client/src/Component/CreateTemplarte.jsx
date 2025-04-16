import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const accessToken = import.meta.env.VITE_WHATSAPP_ACCESS_TOKEN;
const businessId = import.meta.env.VITE_WHATSAPP_BUSINESS_ID;

function CreateTemplate({ onSuccess, templateData, onTemplateChange }) {
    const [formInput, setFormInput] = useState({
        templateName: '',
        category: '',
        language: '',
        headerOption: '',
        headerText: '',
        headerImage: null,
        footerText: '',
        messageContent: '',
    });

    const [buttons, setButtons] = useState([]);
    const [isDropupOpen, setIsDropupOpen] = useState(false);
    const dropupRef = useRef(null);
    const buttonRef = useRef(null);






    useEffect(() => {
        if (onTemplateChange) {
            const {
                templateName,
                category,
                language,
                headerOption,
                headerText,
                headerImage,
                footerText,
                messageContent
            } = formInput;

            const liveComponents = [];

            if (headerOption === 'TEXT' && headerText.trim()) {
                liveComponents.push({
                    type: 'HEADER',
                    format: 'TEXT',
                    text: headerText
                });
            } else if (headerOption === 'IMAGE' && headerImage) {
                let imagePreview = '';

                if (typeof headerImage === 'string') {
                    // Already a URL (from existing data)
                    imagePreview = headerImage;
                } else {
                    // New file selected
                    imagePreview = URL.createObjectURL(headerImage);
                }

                liveComponents.push({
                    type: 'HEADER',
                    format: 'IMAGE',
                    imagePreview,
                });
            }


            liveComponents.push({
                type: 'BODY',
                text: messageContent
            });

            if (footerText?.trim()) {
                liveComponents.push({
                    type: 'FOOTER',
                    text: footerText
                });
            }

            if (buttons.length > 0) {
                liveComponents.push({
                    type: 'BUTTONS',
                    buttons: buttons
                });
            }

            const livePreviewData = {
                name: templateName,
                category,
                language,
                components: liveComponents
            };

            onTemplateChange(livePreviewData);
        }
    }, [formInput, buttons]);




    useEffect(() => {
        if (templateData) {



            setFormInput({
                templateName: templateData?.name || '',
                category: templateData?.category || '',
                language: templateData?.language || '',
                headerOption: templateData?.components?.find(c => c.type === 'HEADER')?.format || '',
                headerText: templateData?.components?.find(c => c.type === 'HEADER')?.text || '',
                headerImage: templateData?.components?.find(c => c.type === 'HEADER')?.example?.header_handle?.[0] || '',
                footerText: templateData?.components?.find(c => c.type === 'FOOTER')?.text || '',
                messageContent: templateData?.components?.find(c => c.type === 'BODY')?.text || '',
            });

            const buttonComp = templateData?.components?.find(c => c.type === 'BUTTONS');
            if (buttonComp?.buttons) {
                setButtons(buttonComp.buttons);
            }
        }
    }, [templateData]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropupRef.current &&
                !dropupRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)
            ) {
                setIsDropupOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormInput((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        setFormInput((prev) => ({
            ...prev,
            headerImage: e.target.files[0],
        }));
    };

    const handleAddButton = () => {
        setButtons([...buttons, { type: 'QUICK_REPLY', text: '' }]);
    };



    const handleButtonChange = (index, key, value) => {
        const updated = [...buttons];
        updated[index][key] = value;

        if (key === 'type') {
            if (value === 'QUICK_REPLY') {
                updated[index] = { type: 'QUICK_REPLY', text: '' };
            } else if (value === 'PHONE_NUMBER') {
                updated[index] = { type: 'PHONE_NUMBER', text: '', phone_number: '' };
            } else if (value === 'URL') {
                updated[index] = { type: 'URL', text: '', url: '' };
            }
        }

        setButtons(updated);
    };

    const handleRemoveButton = (index) => {
        const updated = [...buttons];
        updated.splice(index, 1);
        setButtons(updated);
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        const {
            templateName,
            category,
            language,
            headerOption,
            headerText,
            headerImage,
            footerText,
            messageContent
        } = formInput;

        const components = [];

        if (headerOption === "TEXT" && headerText.trim()) {
            components.push({
                type: "HEADER",
                format: "TEXT",
                text: headerText
            });
        }


        const phone_id = 637230059476897;

        if (headerOption === "IMAGE" && headerImage) {
            try {
                const formData = new FormData();
                formData.append('file', headerImage);
                formData.append('type', headerImage.type);
                formData.append('messaging_product', 'whatsapp');

                const uploadResponse = await axios.post(
                    `https://graph.facebook.com/v22.0/${phone_id}/media`,
                    formData,
                    {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'multipart/form-data',
                        }
                    }
                );

                const mediaId = uploadResponse.data.id;

                if (!mediaId) {
                    console.log("Image upload failed. Media ID not received.");
                    toast.error("Image upload failed. Media ID not received.");
                    return;
                }

                components.push({
                    type: "HEADER",
                    format: "IMAGE",
                    example: {
                        header_handle: [mediaId]
                    }
                });

            } catch (error) {
                console.log(error.response);
                toast.error("Image upload failed. Please try again.");
                return;
            }
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

        if (buttons.length > 0) {
            components.push({
                type: "BUTTONS",
                buttons: buttons
            });
        }

        const payload = {
            name: templateName.toLowerCase().replace(/\s+/g, '_'),
            language,
            category,
            messaging_product: "whatsapp",
            components
        };


        console.log(payload)



        try {
            const response = await axios.post(
                `https://graph.facebook.com/v22.0/${businessId}/message_templates`,
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    }
                }
            );

            console.log(payload)

            const existingTemplates = JSON.parse(localStorage.getItem('whatsappTemplates')) || [];
            const newTemplate = {
                id: response.data.id || Date.now(),
                name: payload.name,
                category: payload.category,
                language: payload.language,
                components: payload.components,
                createdAt: new Date().toISOString()
            };
            console.log(newTemplate);
            localStorage.setItem('whatsappTemplates', JSON.stringify([...existingTemplates, newTemplate]));

            toast.success("Template created successfully!");
            onSuccess();
        } catch (error) {

            console.log(error.response)
            toast.error(error.response?.data?.error?.error_user_title
                || "Error creating template. Please try again.");
        }
    };

    const handleReset = () => {
        setFormInput({
            templateName: '',
            category: '',
            language: '',
            headerOption: '',
            headerText: '',
            headerImage: null,
            footerText: '',
            messageContent: '',
        });
        setButtons([]);
        onTemplateChange();
    };





    return (
        <form onSubmit={handleSubmit}>

            <div className='flex lg:flex-nowrap flex-wrap gap-[20px] mt-[50px] text-md'>
                <input type="text" name="templateName" value={formInput.templateName} onChange={handleChange}
                    placeholder='Template Name *' required
                    className='border-b py-[5px] w-full placeholder-gray-500 placeholder:font-semibold focus:outline-none' />

                <select name="category" value={formInput.category} required onChange={handleChange}
                    className='border-b py-[5px] w-full text-gray-500 bg-transparent outline-none'>
                    <option value="" disabled>Category</option>
                    <option value="UTILITY">Utility</option>
                    <option value="MARKETING">Marketing</option>
                    <option value="AUTHENTICATION">Authentication</option>
                </select>

                <select name="language" required value={formInput.language} onChange={handleChange}
                    className='border-b py-[5px] w-full text-gray-500 bg-transparent outline-none'>
                    <option value="" disabled>Language</option>
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                </select>
            </div>

            {/* Header/Footer */}
            <h3 className="font-semibold mt-[40px] pt-[30px]">Header/Footer (Optional)</h3>
            <p className="text-sm font-semibold text-gray-700">Add a title or select media type for the header</p>

            <div className='flex lg:flex-nowrap flex-wrap gap-[20px] mt-[20px] text-md'>
                <select name="headerOption" value={formInput.headerOption} onChange={handleChange}
                    className='border-b py-[5px] w-full text-gray-500 bg-transparent outline-none'>
                    <option value="">Choose Header Option</option>
                    <option value="TEXT">Text</option>
                    <option value="IMAGE">Image</option>
                </select>

                <textarea name="footerText" value={formInput.footerText} onChange={handleChange}
                    placeholder="Footer Text (60 Characters)"
                    className='border-b py-[5px] w-full placeholder-gray-500 placeholder:font-semibold resize-none outline-none'
                    rows="1" />
            </div>

            {formInput.headerOption === 'TEXT' && (
                <input type="text" name="headerText" value={formInput.headerText} onChange={handleChange}
                    placeholder='Header Text'
                    className='border-b py-[5px] w-full mt-[20px] placeholder-gray-500 placeholder:font-semibold focus:outline-none' />
            )}

            {formInput.headerOption === 'IMAGE' && (
                <div className='w-full mt-[20px]'>
                    <input type="file" name="headerImage" onChange={handleImageChange} accept="image/*"
                        className='border-b py-[5px] w-full' />
                   
                    {formInput.headerImage && (
                        <p className="text-sm text-gray-600 mt-1">
                            {formInput.headerImage instanceof File
                                ? formInput.headerImage.name
                                : 'Existing Image'}
                        </p>
                    )}


                </div>
            )}


            {/* Body */}
            <h3 className="font-semibold mt-[40px] pt-[10px]">Body</h3>
            <p className="text-sm font-semibold text-gray-600">Enter the text for your message</p>
            <textarea name="messageContent" required value={formInput.messageContent} onChange={handleChange}
                placeholder="Message Content (1024 Characters)"
                className="border-b bg-gray-50 py-[5px] px-3 w-full placeholder-gray-500 rounded-sm resize-none outline-none mt-4"
                rows="8" />






            {/* Buttons */}
            <h3 className="font-semibold mt-[40px] pt-[10px]">Buttons (Optional)</h3>
            <p className="text-sm font-semibold text-gray-600 mb-6">Add Quick Reply or Call To Action buttons</p>

            {buttons.map((btn, i) => (
                <div key={i} className="flex gap-2 items-center text-gray-700 text-sm my-2">
                    <select value={btn.type} onChange={(e) => handleButtonChange(i, 'type', e.target.value)}
                        className="border p-2 rounded-md focus:outline-none">
                        <option value="QUICK_REPLY">Quick Reply</option>
                        <option value="PHONE_NUMBER">Call Phone</option>
                        <option value="URL">Visit URL</option>
                    </select>

                    <input type="text" placeholder="Button Text" value={btn.text}
                        onChange={(e) => handleButtonChange(i, 'text', e.target.value)} className="border  focus:outline-none rounded-md p-2 w-50" />

                    {btn.type === 'PHONE_NUMBER' && (
                        <input type="text" placeholder="Phone Number with country code" value={btn.phone_number || ''}
                            onChange={(e) => handleButtonChange(i, 'phone_number', e.target.value)}
                            className="border focus:outline-none rounded-md p-2 w-70" />
                    )}

                    {btn.type === 'URL' && (
                        <input type="text" placeholder="URL" value={btn.url || ''}
                            onChange={(e) => handleButtonChange(i, 'url', e.target.value)}
                            className="border focus:outline-none rounded-md p-2 w-50" />
                    )}



                    <i className="fa-solid fa-xmark text-2xl text-red-400 cursor-pointer hover:text-red-500 hover:scale-110 " onClick={() => handleRemoveButton(i)}></i>
                </div>
            ))}

            <button type="button" onClick={handleAddButton}
                className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                + Add Button
            </button>




            {/* Submit/Reset */}
            <div className='mt-[30px] flex gap-[20px]'>
                <button type='submit'
                    className='bg-green-600 hover:bg-green-700 text-white font-semibold py-[5px] px-[12px] rounded'>
                    Save Template
                </button>

                <button type='button' onClick={handleReset}
                    className='bg-red-500 hover:bg-red-600 text-white font-semibold py-[5px] px-[12px] rounded'>
                    Cancel
                </button>
            </div>
        </form>
    );
}

export default CreateTemplate;
