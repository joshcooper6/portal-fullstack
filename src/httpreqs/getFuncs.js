import axios from "axios";

export const getFood = async (setState) => {
    const foodConfig = {
        method: 'get',
        url: 'http://localhost:5000/getFood'
    };

    axios(foodConfig)
        .then((res) => {
            setState(res.data.target);

            if (res.data.message === 'food-loaded') {
                console.log(`Numbers for ${res.data.day} ${res.data.time} have loaded successfully.`)
            };
        })
        .catch((err) => {
            console.log(err)
    })
};  