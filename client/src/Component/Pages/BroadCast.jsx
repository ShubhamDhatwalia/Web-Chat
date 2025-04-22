import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, FormControl, Select, InputLabel, MenuItem, Checkbox, ListItemText, FormControlLabel, Autocomplete, Button } from '@mui/material';
import TemplatePreview from '../TemplatePreview';
import CampaignList from '../CampaignList';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTemplates } from '../../redux/templateThunks';
import { fetchPhoneNumbers } from '../../redux/phoneNumberThunks';





function BroadCast() {
  const [fileName, setFileName] = useState('No file chosen');
  
  

  const dispatch = useDispatch();
  
  const navigate = useNavigate();


  const [formInput, setFormInput] = useState({
    campaignName: '',
    whatsappNumber: '',
    template: '',
    contactList: [],
  });


  const { phoneNumbers, loading: numbersLoading, error: numbersError } = useSelector(state => state.phoneNumbers);

  useEffect(() => {
    dispatch(fetchPhoneNumbers());
  }, [dispatch]);




  const { templates, loading, error } = useSelector((state) => state.templates);

  useEffect(() => {
    dispatch(fetchTemplates());
  }, [dispatch]);



  const [contacts, setContacts] = useState([
    { id: '1', name: 'John Doe', number: '+917876054918' },
    { id: '2', name: 'Jane Smith', number: '+919876543210' },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted:', formInput);

  };


  const handleReset = (e) => {
    e.preventDefault();
    setFormInput({
      campaignName: '',
      whatsappNumber: '',
      template: '',
      contactList: [],
    });
    setFileName('No file chosen');
  };




  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileName(file ? file.name : 'No file chosen');
  };



  const handleChange = (e) => {
    const { name, value } = e.target;


    if (name === 'template') {
      console.log(value);
      setFormInput((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else if (name === 'contactList') {
      setFormInput((prev) => ({
        ...prev,
        [name]: Array.isArray(value) ? value : value.split(','),
      }));
    } else {
      setFormInput((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle "Select All" checkbox
  const handleSelectAll = () => {
    if (formInput.contactList.length === contacts.length) {
      setFormInput((prev) => ({
        ...prev,
        contactList: [],
      }));
    } else {
      setFormInput((prev) => ({
        ...prev,
        contactList: contacts.map((contact) => contact.number),
      }));
    }
  };



  return (
    <div className='bg-gray-100 px-[15px] py-[10px]'>
      <div className='flex justify-between gap-[20px] items-stretch'>
        <div className='bg-white p-[15px] rounded-md flex-[66%]'>
          <h2 className='font-bold text-xl'>Campaign/Broadcasting</h2>
          <p className='font-semibold text-md mt-[5px] text-gray-600'>
            Run a Campaign to broadcast your message
          </p>

          <form onSubmit={handleSubmit} className='mt-[50px]'>
            <div className='flex lg:flex-nowrap flex-wrap gap-[20px]'>
              <TextField
                label="Campaign Name"
                name="campaignName"
                value={formInput.campaignName}
                onChange={handleChange}
                placeholder="Campaign Name"
                required
                fullWidth
                size='small'
                variant="outlined"
              />

              <FormControl fullWidth required size='small'>
                <InputLabel id="whatsapp-number-label">Whatsapp Number</InputLabel>
                <Select
                  name="whatsappNumber"
                  labelId='whatsapp-number-label'
                  value={formInput.whatsappNumber}
                  onChange={handleChange}
                  label="Whatsapp Number"
                  variant="outlined"
                  placeholder="Send Message From Whatsapp Number"
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxWidth: 220,
                      },
                    },
                  }}
                >

                  {phoneNumbers.map((num) => (
                    <MenuItem key={num.id} value={num.id}>
                      {num.display_phone_number}
                    </MenuItem>
                  ))}

                </Select>
              </FormControl>
            </div>


            <div className='mt-6 flex lg:flex-nowrap flex-wrap gap-[20px]'>

              <div className='flex-1/2'>

                <Autocomplete
                  size="small"
                  fullWidth
                  options={templates}
                  getOptionLabel={(option) => option.name}
                  value={templates.find(t => t.id === formInput.template) || null}
                  onChange={(event, newValue) => {
                    handleChange({
                      target: {
                        name: 'template',
                        value: newValue?.id || '',
                      },
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Template"
                      required
                    />
                  )}
                  ListboxProps={{
                    style: {
                      maxHeight: 220,
                    },
                  }}
                />


                <Button
                  variant="outlined"
                  size="small"
                  className="mt-2 float-end !font-semibold "
                  onClick={() => {
                    navigate("/manageTemplates", { state: { openForm: true } });
                  }}
                >

                  + Add New Template
                </Button>
              </div>


              <div className='flex-1/2'>
                <FormControl fullWidth required size="small">
                  <InputLabel id="contact-list-label">Select Contacts</InputLabel>
                  <Select
                    labelId="contact-list-label"
                    id="contact-list"
                    name="contactList"
                    multiple
                    value={formInput.contactList}
                    onChange={handleChange}
                    label="Select Contacts"
                    renderValue={(selected) =>
                      contacts
                        .filter((c) => selected.includes(c.number))
                        .map((c) => c.name)
                        .join(', ')
                    }
                  >
                    <MenuItem>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formInput.contactList.length === contacts.length}
                            onChange={handleSelectAll}
                          />
                        }
                        label="Select All"
                      />
                    </MenuItem>

                    {contacts.map((contact) => (
                      <MenuItem key={contact.id} value={contact.number}>
                        <Checkbox checked={formInput.contactList.includes(contact.number)} />
                        <ListItemText primary={contact.name} secondary={contact.number} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>


            </div>

            <div className='flex flex-wrap lg:flex-nowrap gap-[20px] mt-16 items-center'>

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


            <div className='mt-18 flex gap-[20px] items-center'>
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


          <div>
            <TemplatePreview templateId={formInput.template} />
          </div>
        </div>
      </div>




      <CampaignList />



    </div>
  );
}

export default BroadCast;
