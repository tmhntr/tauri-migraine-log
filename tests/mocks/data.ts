const mockData = {
    Entry: [
        {
            id: 1,
            start_time: '2023-01-01T08:00:00Z',
            end_time: '2023-01-01T10:00:00Z',
            notes: 'Mild headache in the morning',
            recent_duration_of_sleep: '7 hours',
            headache_severity: 'Mild',
            hydration_oz: 16,
            weather_id: 1,
            warning_other: null,
            created_at: '2023-01-01T08:00:00Z',
            updated_at: '2023-01-01T08:00:00Z',
        },
        {
            id: 2,
            start_time: '2023-01-02T14:00:00Z',
            end_time: '2023-01-02T16:00:00Z',
            notes: 'Severe headache in the afternoon',
            recent_duration_of_sleep: '6 hours',
            headache_severity: 'Severe',
            hydration_oz: 8,
            weather_id: 2,
            warning_other: 'Felt dizzy',
            created_at: '2023-01-02T14:00:00Z',
            updated_at: '2023-01-02T14:00:00Z',
        },
    ],
    PainSite: [
        { id: 1, name: 'Front' },
        { id: 2, name: 'Back' },
        { id: 3, name: 'Left' },
        { id: 4, name: 'Right' },
        { id: 5, name: 'Top' },
    ],
    PainSiteEntry: [
        { id: 1, entry_id: 1, pain_site_id: 1 },
        { id: 2, entry_id: 2, pain_site_id: 3 },
    ],
    Symptom: [
        { id: 1, name: 'Throbbing' },
        { id: 2, name: 'Burning' },
        { id: 3, name: 'Dull Ache' },
        { id: 4, name: 'Knife-like' },
        { id: 5, name: 'Nausea' },
        { id: 6, name: 'Light Sensitivity' },
        { id: 7, name: 'Pressure' },
        { id: 8, name: 'Aura' },
        { id: 9, name: 'Tight Band' },
        { id: 10, name: 'Neck Ache' },
    ],
    SymptomEntry: [
        { id: 1, entry_id: 1, symptom_id: 1 },
        { id: 2, entry_id: 2, symptom_id: 5 },
    ],
    Weather: [
        {
            id: 1,
            type: 'Sunny',
            temperature_high: 75,
            temperature_low: 55,
            date: '2023-01-01',
            surface_pressure: 1015.2,
            precipitation: 0,
            wind_speed: 5,
            user_location_id: 1,
        },
        {
            id: 2,
            type: 'Rainy',
            temperature_high: 65,
            temperature_low: 50,
            date: '2023-01-02',
            surface_pressure: 1008.4,
            precipitation: 10,
            wind_speed: 15,
            user_location_id: 1,
        },
    ],
    Warning: [
        { id: 1, name: 'Vision Changes' },
        { id: 2, name: 'Numbness' },
        { id: 3, name: 'Aching Neck' },
    ],
    WarningEntry: [
        { id: 1, entry_id: 1, warning_id: 1 },
        { id: 2, entry_id: 2, warning_id: 3 },
    ],
    ManagementStep: [
        { id: 1, name: 'Take Ibuprofen', time: '08:30', amount: 200, amount_unit: 'mg', notes: 'Felt better after 30 minutes' },
        { id: 2, name: 'Drink Water', time: '14:30', amount: 500, amount_unit: 'ml', notes: 'Hydrated' },
    ],
    ManagementStepEntry: [
        { id: 1, entry_id: 1, management_step_id: 1 },
        { id: 2, entry_id: 2, management_step_id: 2 },
    ],
    User: [
        { id: 1, name: 'John Doe', created_at: '2023-01-01T08:00:00Z', updated_at: '2023-01-01T08:00:00Z' },
    ],
    UserLocation: [
        { id: 1, user_id: 1, latitude: 37.7749, longitude: -122.4194, timezone: 'PST', created_at: '2023-01-01T08:00:00Z', updated_at: '2023-01-01T08:00:00Z' },
    ],
};

export default mockData;