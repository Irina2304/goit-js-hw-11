import axios from 'axios';

async function serviceImg(currentPage, perPage, searchQuery) {
    
    axios.defaults.baseURL = 'https://pixabay.com/api/';

    const params = new URLSearchParams({
        page : currentPage,
        per_page: perPage,
        key: "39093226-ac0b10f11dd0e76f215b060f9",
        q: searchQuery.value,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: true,
    });

    const response = await axios.get(`?${params}`);
    return response.data;  
};

export { serviceImg };