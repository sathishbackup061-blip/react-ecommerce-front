import axios from "axios";

// get all Sub categories
export const getSubs = async () => {
    return await axios.get(`${process.env.REACT_APP_API}/subs`);
}
// get single Sub category
export const getSub = async (slug) => {
    return await axios.get(`${process.env.REACT_APP_API}/sub/${slug}`);
}

// remove Sub category
export const removeSub = async (slug, authtoken) => {
    return await axios.delete(`${process.env.REACT_APP_API}/sub/${slug}`, {
        headers: {
            authtoken
        }
    });
}
// update Sub category
export const updateSub = async (slug, sub, authtoken) => {
    return await axios.put(`${process.env.REACT_APP_API}/sub/${slug}`, sub, {
        headers: {
            authtoken
        }
    });
}
// create Sub category
export const createSub = async (sub, authtoken) => {
    return await axios.post(`${process.env.REACT_APP_API}/sub`, sub, {
        headers: {
            authtoken
        }
    });
}

