const DRAWERS = ([
    {
        name: "cajon 4 drivers",
        price: "28.000",
        base_price: "18.000",
    },
    {
        name: "cajon 2 drivers 2 tweeters",
        price: "28.000",
        base_price: "18.000",
    },
    {
        name: "cajon 4 drivers y 2 tweeters",
        price: "32.000",
        base_price: "22.000",
    },
    {
        name: "cajon 6 drivers",
        price: "32.000",
        base_price: "22.000",
    },
    {
        name: "cajon 2 drivers, 2 medios de 8 y 2 tweeters",
        price: "38.000",
        base_price: "28.000",
    },
    {
        name: "cajon curva 2 medios de 8, y 2 tweeters chicos",
        price: "45.000",
        base_price: "35.000",
    },
    {
        name: "2 6x9 y 2 tweeters",
        price: "30.000",
        base_price: "20.000",
    },
    {
        name: "2 6x9 y 2 drivers",
        price: "32.000",
        base_price: "22.000",
    },
    {
        name: "2 cajas de 6 pulgadas individuales",
        price: "30.000",
        base_price: "19.000",
    },
    {
        name: "2 cajas de 6x9 individuales",
        price: "25.000",
        base_price: "15.000",
    },
    {
        name: "cajon 2 medios de 8 y 2 drivers",
        price: "33.000",
        base_price: "23.000",
    },
    {
        name: "cajon de sub de 10 slot mdf simple",
        price: "35.000",
        base_price: "25.000",
    },
    {
        name: "cajon de sub de 12 slot mdf simple",
        price: "38.000",
        base_price: "28.000",
    },
    {
        name: "cajon de sub de 12 slot chato simple",
        price: "55.000",
        base_price: "45.000",
    },
    {
        name: "cajon de 12 chato GNC",
        price: "50.000",
        base_price: "40.000",
    },
    {
        name: "cajon de 12 sellado",
        price: "55.000",
        base_price: "45.000",
    },
    {
        name: "cajon de 15 slot simple",
        price: "42.000",
        base_price: "32.000",
    },
    {
        name: "cajon de 15 trio, 1 driver y 1 tweeter",
        price: "55.000",
        base_price: "45.000",
    },
    {
        name: "cajon de 12 slot simple 80 lts",
        price: "60.000",
        base_price: "50.000",
    },
    {
        name: "cajon de 15 chato GNC slot",
        price: "60.000",
        base_price: "50.000",
    },
    {
        name: "cajon doble de 10 slot",
        price: "60.000",
        base_price: "50.000",
    },
    {
        name: "cajon doble de 12 slot",
        price: "65.000",
        base_price: "55.000",
    },
    {
        name: "cajon doble de 15 slot",
        price: "70.000",
        base_price: "60.000",
    },
    {
        name: "cajon doble de 12 slot chato",
        price: "60.000",
        base_price: "50.000",
    }
]).map((drawer, index) => ({ ...drawer, id: index + 1 }))

export default DRAWERS