import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const accessToken = import.meta.env.VITE_WHATSAPP_ACCESS_TOKEN;
const businessId = import.meta.env.VITE_WHATSAPP_BUSINESS_ID;



export const fetchTemplates = createAsyncThunk(
  'templates/fetchTemplates',
  async (_, { rejectWithValue }) => {
    try {
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
      return visibleTemplates;
    } catch (error) {
      console.error('Error fetching templates:', error);
      return rejectWithValue(error.message);
    }
  }
);



export const deleteTemplate = createAsyncThunk(
  'templates/deleteTemplate',
  async (template, { rejectWithValue }) => {
    try {
      const deleteUrl = `https://graph.facebook.com/v22.0/${businessId}/message_templates`;
      const params = new URLSearchParams({
        hsm_id: template.id,
        name: template.name,
        access_token: accessToken,
      });

      const response = await axios.delete(`${deleteUrl}?${params.toString()}`);
      if (response.data.success) {
        toast.success('Template deleted successfully!');
        const existing = JSON.parse(localStorage.getItem('whatsappTemplates') || '[]');
        const updated = existing.filter((e) => e.id !== template.id);
        localStorage.setItem('whatsappTemplates', JSON.stringify(updated));
        return template.id;
      } else {
        throw new Error('Delete failed');
      }
    } catch (error) {
      toast.error('Failed to delete template.');
      return rejectWithValue(error.message);
    }
  }
);
