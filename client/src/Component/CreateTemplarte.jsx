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
        parameter_format: 'POSITIONAL',
    });


    const [sampleValues, setSampleValues] = useState({
        header_text: [],
        body_text: []
    });


    const [buttons, setButtons] = useState([]);
    const [isDropupOpen, setIsDropupOpen] = useState(false);
    const dropupRef = useRef(null);
    const buttonRef = useRef(null);




    const extractVariableList = (text, format) => {
        if (format === 'POSITIONAL') {
            const regex = /\{\{(\d+)\}\}/g;
            const matches = Array.from(text.matchAll(regex)).map(match => match[1]);
            return [...new Set(matches)].sort((a, b) => Number(a) - Number(b));
        } else {
            const regex = /\{\{([a-zA-Z0-9_]+)\}\}/g;
            const matches = Array.from(text.matchAll(regex)).map(match => match[1]);
            return [...new Set(matches)];
        }
    };




    const insertAtCursor = (name, insertText) => {
        const textarea = document.querySelector(`textarea[name="${name}"]`);
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const value = textarea.value;

        const newText = value.slice(0, start) + insertText + value.slice(end);
        setFormInput(prev => ({
            ...prev,
            [name]: newText
        }));
    };


    const getNextVariableNumber = (text) => {
        const regex = /\{\{(\d+)\}\}/g;
        const matches = Array.from(text.matchAll(regex)).map(match => parseInt(match[1]));
        let next = 1;
        while (matches.includes(next)) next++;
        return next;
    };

    const getNextVariableName = (text, section = 'body') => {
        const regex = /\{\{([a-zA-Z0-9_]+)\}\}/g;
        const matches = Array.from(text.matchAll(regex)).map(match => match[1]);
        let i = 1;
        let name = `${section}_var${i}`;
        while (matches.includes(name)) {
            i++;
            name = `${section}_var${i}`;
        }
        return name;
    };




    const handleHeaderVariable = () => {
        const currentText = formInput.headerText || '';
        if (formInput.parameter_format === 'POSITIONAL') {
            const nextVar = getNextVariableNumber(currentText);
            insertAtCursor('headerText', `{{${nextVar}}}`);
        } else {
            const nextVar = getNextVariableName(currentText, 'header');
            insertAtCursor('headerText', `{{${nextVar}}}`);
        }
    };

    const handleBodyVariable = () => {
        const currentText = formInput.messageContent || '';
        if (formInput.parameter_format === 'POSITIONAL') {
            const nextVar = getNextVariableNumber(currentText);
            insertAtCursor('messageContent', `{{${nextVar}}}`);
        } else {
            const nextVar = getNextVariableName(currentText, 'body');
            insertAtCursor('messageContent', `{{${nextVar}}}`);
        }
    };



    useEffect(() => {
        const { headerText, messageContent, parameter_format } = formInput;

        const headerVars = extractVariableList(headerText, parameter_format);
        const bodyVars = extractVariableList(messageContent, parameter_format);

        setSampleValues(prev => ({
            header_text: headerVars.map((v, i) => prev.header_text?.[i] ?? ''),
            body_text: bodyVars.map((v, i) => prev.body_text?.[i] ?? '')
        }));
    }, [formInput.headerText, formInput.messageContent, formInput.parameter_format]);




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
                messageContent,
                parameter_format,
            } = formInput;

            const liveComponents = [];

            // Handle HEADER (TEXT or IMAGE)
            if (headerOption === 'TEXT' && headerText.trim()) {
                liveComponents.push({
                    type: 'HEADER',
                    format: 'TEXT',
                    text: headerText,
                    example: {
                        header_text: sampleValues.header_text // Ensure sample values for header text
                    }
                });
            } else if (headerOption === 'IMAGE' && headerImage) {
                let imagePreview = '';

                if (typeof headerImage === 'string') {
                    imagePreview = headerImage;
                } else {
                    imagePreview = URL.createObjectURL(headerImage);
                }

                liveComponents.push({
                    type: 'HEADER',
                    format: 'IMAGE',
                    imagePreview,
                });
            }

            // Handle BODY
            liveComponents.push({
                type: 'BODY',
                text: messageContent,
                example: {
                    body_text: sampleValues.body_text // Ensure sample values for body text
                }
            });

            // Handle FOOTER (if exists)
            if (footerText?.trim()) {
                liveComponents.push({
                    type: 'FOOTER',
                    text: footerText
                });
            }

            // Handle BUTTONS (if any)
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
                parameter_format,
                components: liveComponents
            };

            onTemplateChange(livePreviewData); // Update the live preview with the new data
        }
    }, [formInput, buttons, sampleValues]); // Ensure to watch for sampleValues changes as well


    useEffect(() => {
        if (templateData) {
            const headerComponent = templateData.components?.find(c => c.type === 'HEADER');
            const bodyComponent = templateData.components?.find(c => c.type === 'BODY');

            setFormInput({
                templateName: templateData?.name || '',
                category: templateData?.category || '',
                language: templateData?.language || '',
                headerOption: headerComponent?.format || '',
                headerText: headerComponent?.text || '',
                headerImage: headerComponent?.example?.header_handle?.[0] || '',
                footerText: templateData?.components?.find(c => c.type === 'FOOTER')?.text || '',
                messageContent: bodyComponent?.text || '',
                parameter_format: templateData?.parameter_format || 'POSITIONAL',
            });

            // 💡 NEW: Restore sample values
            setSampleValues({
                header_text: headerComponent?.example?.header_text || [],
                body_text: bodyComponent?.example?.body_text || []
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
            messageContent,
            parameter_format
        } = formInput;

        const components = [];

        // Handle HEADER (TEXT)
        if (headerOption === "TEXT" && headerText.trim()) {
            const headerComponent = {
                type: "HEADER",
                format: "TEXT",
                text: headerText
            };

            if (sampleValues.header_text.length > 0) {
                headerComponent.example = {
                    header_text: sampleValues.header_text
                };
            }

            components.push(headerComponent);
        }

        // Handle HEADER (IMAGE)
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
                toast.error("Image upload failed. Please try again.");
                return;
            }
        }

        // Handle BODY
        if (messageContent.trim()) {
            const bodyComponent = {
                type: "BODY",
                text: messageContent
            };

            // Ensure sample values for body text, similar to header example check
            if (sampleValues.body_text.length > 0) {
                bodyComponent.example = {
                    body_text: sampleValues.body_text
                };
            }

            components.push(bodyComponent);
        }


        // Handle FOOTER (if exists)
        if (footerText?.trim()) {
            components.push({
                type: "FOOTER",
                text: footerText
            });
        }

        // Handle BUTTONS (if any)
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
            parameter_format,
            components
        };

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

            const existingTemplates = JSON.parse(localStorage.getItem('whatsappTemplates')) || [];
            const newTemplate = {
                id: response.data.id || Date.now(),
                name: payload.name,
                category: payload.category,
                language: payload.language,
                parameter_format: payload.parameter_format,
                components: payload.components,
                createdAt: new Date().toISOString()
            };
            localStorage.setItem('whatsappTemplates', JSON.stringify([...existingTemplates, newTemplate]));

            toast.success("Template created successfully!");
            onSuccess();
        } catch (error) {
            console.log(error.response);
            toast.error(error.response?.data?.error?.error_user_msg || "Error creating template. Please try again.");
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
            parameter_format: 'POSITIONAL',
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




            <div className='mt-6'>
                <FormControl fullWidth size="small">
                    <InputLabel id="variable-type-label">Variable</InputLabel>
                    <Select
                        labelId="variable-type-label"
                        id="parameter_format"
                        name="parameter_format"
                        value={formInput.parameter_format}
                        label=" Variable"
                        onChange={handleChange}
                        variant='outlined'
                    >
                        <MenuItem value="POSITIONAL">Number</MenuItem>
                        <MenuItem value="NAMED">Name</MenuItem>
                    </Select>
                </FormControl>
            </div>



            <div className='flex lg:flex-nowrap flex-wrap gap-[20px] mt-[30px] text-md'>
                <FormControl fullWidth size="small">
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

                <div className='w-[49%]'>
                    <TextField
                        fullWidth
                        name="headerText"
                        label="Header Text"
                        value={formInput.headerText}
                        onChange={handleChange}
                        multiline
                        rows={1}
                        size="small"
                        placeholder="Header Text (60 Characters)"
                        variant="outlined"
                        sx={{ width: 'calc(100%)', mt: 2 }}
                        inputProps={{ maxLength: 60 }}
                    />


                    <Button
                        type="button"
                        onClick={handleHeaderVariable}

                        variant="outlined"
                        color="primary"
                        sx={{
                            fontWeight: 600,
                            fontSize: '14px',
                            py: '2px',
                            float: 'right',
                            px: '10px',
                            borderRadius: '4px',
                            textTransform: 'none',

                        }}
                    >
                        + Add variable
                    </Button>
                </div>


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
                    backgroundColor: '#f9fafb',
                    borderRadius: '4px',
                }}
                inputProps={{ maxLength: 1024 }}
            />

            <Button
                type="button"
                onClick={handleBodyVariable}

                variant="outlined"
                color="primary"
                sx={{
                    fontWeight: 600,
                    fontSize: '14px',
                    py: '2px',
                    float: 'right',
                    px: '10px',
                    borderRadius: '4px',
                    textTransform: 'none',

                }}
            >
                + Add variable
            </Button>

            {sampleValues.body_text.length > 0 && (
                <div className='mt-6'>
                    <h4 className='font-semibold'>Body Variable Examples</h4>
                    {sampleValues.body_text.map((val, i) => (
                        <TextField
                            key={`body_var_${i}`}
                            size="small"
                            required
                            label={`Body {{${formInput.parameter_format === 'POSITIONAL' ? i + 1 : extractVariableList(formInput.messageContent, formInput.parameter_format)[i]}}}`}
                            value={val}
                            onChange={(e) => {
                                const updated = [...sampleValues.body_text];
                                updated[i] = e.target.value;
                                setSampleValues(prev => ({ ...prev, body_text: updated }));
                            }}
                            fullWidth
                            margin="normal"
                        />
                    ))}
                </div>
            )}



            {sampleValues.header_text.length > 0 && (
                <div className='mt-6'>
                    <h4 className='font-semibold'>Header Variable Examples</h4>
                    {sampleValues.header_text.map((val, i) => (
                        <TextField
                            key={`header_var_${i}`}
                            size="small"
                            required
                            label={`Header {{${formInput.parameter_format === 'POSITIONAL' ? i + 1 : extractVariableList(formInput.headerText, formInput.parameter_format)[i]}}}`}
                            value={val}
                            onChange={(e) => {
                                const updated = [...sampleValues.header_text];
                                updated[i] = e.target.value;
                                setSampleValues(prev => ({ ...prev, header_text: updated }));
                            }}
                            fullWidth
                            margin="normal"
                        />
                    ))}
                </div>
            )}


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
