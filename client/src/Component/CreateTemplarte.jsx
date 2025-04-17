
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TextField, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';



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

        console.log(payload);

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

            console.log(payload);

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
            console.log(error.response);
            toast.error(error.response?.data?.error?.error_user_msg
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

    const canAddPhoneButton = buttons.filter(button => button.type === 'PHONE_NUMBER').length < 1;
    const canAddUrlButton = buttons.filter(button => button.type === 'URL').length < 2;

    return (
        <form onSubmit={handleSubmit}>
            <div className='flex lg:flex-nowrap flex-wrap gap-[20px] mt-[50px] text-md'>
                <div className="flex-1">
                    <TextField
                        required
                        id="outlined-required"
                        name="templateName"
                        label="Template Name"
                        size="small"
                        fullWidth
                        placeholder='Template Name'
                        value={formInput.templateName}
                        onChange={handleChange}
                    />
                </div>

                <div className="flex-1">



                    <FormControl fullWidth required size="small">
                        <InputLabel id="category-label">Category</InputLabel>
                        <Select
                            labelId="category-label"
                            id="category"
                            name="category"
                            value={formInput.category}
                            label="Category"
                            onChange={handleChange}
                        >

                            <MenuItem value="UTILITY">Utility</MenuItem>
                            <MenuItem value="MARKETING">Marketing</MenuItem>
                            <MenuItem value="AUTHENTICATION">Authentication</MenuItem>
                        </Select>
                    </FormControl>

                </div>

                <div className="flex-1">




                    <FormControl fullWidth required size='small'>
                        <InputLabel id="language-label">Language</InputLabel>
                        <Select
                            labelId='language-label'
                            id='language'
                            name="language"
                            label="Language"
                            value={formInput.language}
                            onChange={handleChange}
                        >

                            <MenuItem value="en">English</MenuItem>
                            <MenuItem value="hi">Hindi</MenuItem>

                        </Select>

                    </FormControl>




                </div>
            </div>


            {/* Header/Footer */}
            <h3 className="font-semibold mt-[20px] pt-[20px]">Header/Footer (Optional)</h3>
            <p className="text-sm font-semibold text-gray-700">Add a title or select media type for the header</p>

            <div className='flex lg:flex-nowrap flex-wrap gap-[20px] mt-[30px] text-md'>
                <FormControl fullWidth required size="small">
                    <InputLabel id="header-option-label">Header Option</InputLabel>
                    <Select
                        labelId="header-option-label"
                        id="headerOption"
                        name="headerOption"
                        value={formInput.headerOption}
                        label="Header Option"
                        onChange={handleChange}
                    >
                        <MenuItem value="None">None</MenuItem>

                        <MenuItem value="TEXT">Text</MenuItem>
                        <MenuItem value="IMAGE">Image</MenuItem>
                    </Select>
                </FormControl>

                <TextField
                    name="footerText"
                    value={formInput.footerText}
                    onChange={handleChange}
                    placeholder="Footer Text (60 Characters)"
                    label="Footer Text"
                    multiline
                    rows={1}
                    fullWidth
                    size="small"
                    inputProps={{ maxLength: 60 }}
                />

            </div>

            {formInput.headerOption === 'TEXT' && (
                <TextField
                    fullWidth
                    name="headerText"
                    label="Header Text"
                    value={formInput.headerText}
                    onChange={handleChange}
                    size="small"
                    placeholder="Header Text (60 Characters)"
                    variant="outlined"
                    sx={{ width: 'calc(50% - 10px)', mt: 2 }}
                    inputProps={{ maxLength: 60 }}
                />

            )}

            {formInput.headerOption === 'IMAGE' && (
                <div className='w-full flex gap-4 mt-[20px]'>
                    <Button
                        variant="outlined"
                        component="label"
                        // sx={{ width: 'calc(50% - 10px)' }}
                        size="small"
                    >
                        Upload Header Image
                        <input
                            type="file"
                            name="headerImage"
                            accept="image/*"
                            hidden
                            onChange={handleImageChange}
                        />
                    </Button>

                    {formInput.headerImage && (
                        <p className="text-md font-semibold text-gray-600 mt-1">
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
            <TextField
                required
                name="messageContent"
                label="Message Content"
                placeholder="Message Content (1024 Characters)"
                value={formInput.messageContent}
                onChange={handleChange}
                multiline
                rows={7}
                fullWidth
                size="small"
                variant="outlined"
                sx={{
                    mt: 2,
                    backgroundColor: '#f9fafb', // equivalent to bg-gray-50
                    borderRadius: '4px',
                }}
                inputProps={{ maxLength: 1024 }}
            />


            {/* Buttons */}
            <h3 className="font-semibold mt-[40px] pt-[10px]">Buttons (Optional)</h3>
            <p className="text-sm font-semibold text-gray-600 mb-6">Add Quick Reply or Call To Action buttons</p>

            {buttons.map((btn, i) => (
                <div key={i} className="flex gap-2 items-center text-gray-700 text-sm my-2">
                    <FormControl size="small" sx={{ width: '150px', mr: 2 }}>
                        <InputLabel id={`button-type-label-${i}`}>Button Type</InputLabel>
                        <Select
                            labelId={`button-type-label-${i}`}
                            id={`button-type-${i}`}
                            value={btn.type}
                            label="Button Type"
                            onChange={(e) => handleButtonChange(i, 'type', e.target.value)}
                        >
                            <MenuItem value="QUICK_REPLY">Quick Reply</MenuItem>
                            <MenuItem value="PHONE_NUMBER" disabled={!canAddPhoneButton}>
                                Call Phone
                            </MenuItem>
                            <MenuItem value="URL" disabled={!canAddUrlButton}>
                                Visit URL
                            </MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        label="Button Text"
                        placeholder="Button Text"
                        variant="outlined"
                        size="small"
                        value={btn.text}
                        onChange={(e) => handleButtonChange(i, 'text', e.target.value)}
                        sx={{ width: 200 }}
                    />

                    {btn.type === 'PHONE_NUMBER' && (
                        <TextField
                            label="Phone Number"
                            placeholder="Phone Number with country code"
                            variant="outlined"
                            size="small"
                            value={btn.phone_number || ''}
                            onChange={(e) => handleButtonChange(i, 'phone_number', e.target.value)}
                            sx={{ width: 280 }} // Adjust width as needed
                        />
                    )}

                    {btn.type === 'URL' && (
                        <TextField
                            label="URL"
                            placeholder="URL"
                            variant="outlined"
                            size="small"
                            value={btn.url || ''}
                            onChange={(e) => handleButtonChange(i, 'url', e.target.value)}
                            sx={{ width: 200 }}
                        />
                    )}

                    <i className="fa-solid fa-xmark text-2xl text-red-400 cursor-pointer hover:text-red-500 hover:scale-110 " onClick={() => handleRemoveButton(i)}></i>
                </div>
            ))}

            <Button
                type="button"
                onClick={handleAddButton}
                variant="contained"
                color="primary"
                size="small"
                sx={{
                    mt: 2,
                    py: '5px',
                    px: '12px',
                    borderRadius: '4px',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '16px',
                    backgroundColor: '#2563eb', 
                    '&:hover': {
                        backgroundColor: '#1d4ed8', 
                    },
                }}
            >
                + Add Button
            </Button>



            {/* Submit/Reset buttons */}
            <div className='mt-[30px] flex gap-[20px]'>
                <Button
                    type="submit"
                    variant="contained"
                    color="success"
                    sx={{
                        fontWeight: 600,
                        fontSize: '16px',
                        py: '5px',
                        px: '12px',
                        borderRadius: '4px',
                        textTransform: 'none',
                        '&:hover': {
                            backgroundColor: '#2e7d32', // darker green
                        },
                    }}
                >
                    Save Template
                </Button>

                <Button
                    type="button"
                    onClick={handleReset}
                    variant="contained"
                    color="error"
                    sx={{
                        fontWeight: 600,
                        fontSize: '16px',
                        py: '5px',
                        px: '20px',
                        borderRadius: '4px',
                        textTransform: 'none',
                        '&:hover': {
                            backgroundColor: '#c62828', // darker red on hover
                        },
                    }}
                >
                    Reset
                </Button>
            </div>
        </form>
    );
}

export default CreateTemplate;
