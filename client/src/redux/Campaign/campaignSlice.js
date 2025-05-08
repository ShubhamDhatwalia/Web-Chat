import { createSlice } from '@reduxjs/toolkit';

const storedCampaigns = JSON.parse(localStorage.getItem('Campaign'));

const initialState = {
    campaign: Array.isArray(storedCampaigns) ? storedCampaigns : [],
};


console.log(initialState.campaign)

const campaignSlice = createSlice({
    name: 'campaign',
    initialState,
    reducers: {
        addCampaign: (state, action) => {
            const index = state.campaign.findIndex(c => c.campaignName === action.payload.campaignName);

            if (index !== -1) {
                const existingCampaign = state.campaign[index];

                const hasChanges = Object.keys(action.payload).some(
                    key => key !== 'campaignName' && existingCampaign[key] !== action.payload[key]
                );

                if (hasChanges) {
                    state.campaign[index] = action.payload;
                    localStorage.setItem('Campaign', JSON.stringify(state.campaign));
                }
            } else {
                state.campaign.push(action.payload);
                localStorage.setItem('Campaign', JSON.stringify(state.campaign));
            }
        },



        removeCampaign: (state, action) => {
            state.campaign.splice(action.payload, 1);
            localStorage.setItem('Campaign', JSON.stringify(state.campaign));
        },

    }

})

export const { addCampaign, removeCampaign } = campaignSlice.actions;
export default campaignSlice.reducer;