// src/components/Profile.js
import React, { useEffect, useState } from 'react';
import { fetchProfile } from '../utils/api';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getProfile = async () => {
            try {
                const data = await fetchProfile();
                setProfile(data);
            } catch (error) {
                setError('Error fetching profile');
            }
        };

        getProfile();
    }, []); // Empty dependency array ensures this runs once on mount

    return (
        <div>
            {error && <p>{error}</p>}
            {profile ? (
                <div>
                    <h1>Welcome, {profile.email}!</h1>
                    {/* Display other profile information */}
                </div>
            ) : (
                <p>Loading profile...</p>
            )}
        </div>
    );
};

export default Profile;
