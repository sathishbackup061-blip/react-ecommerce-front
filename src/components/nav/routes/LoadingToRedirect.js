import React, {useState, useEffect} from "react";

// This component is used to show a loading spinner during counter 5 seconds while checking if the user is an admin
// It is used in the AdminRoute component to prevent flashing of the login page for admins
// after 5 seconds, it will redirect to the login page if the user is not an admin
import { Spin } from "antd";

const LoadingToRedirect = () => {
    const [count, setCount] = useState(5);

    useEffect(() => {
        const interval = setInterval(() => {
            setCount((prevCount) => prevCount - 1);
        }, 1000);

        // Clear the interval when count reaches 0
        if (count === 0) {
            clearInterval(interval);
            window.location.href = "/login"; // Redirect to login page
        }
        return () => clearInterval(interval); // Cleanup on unmount
    }, [count]);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',   
            alignItems: 'center',
            minHeight: '100vh',
            background: '#f5f5f5'
        }}>
            <Spin size="large" tip={`Redirecting in ${count} seconds...`} />
        </div>
    );
}

export default LoadingToRedirect;
