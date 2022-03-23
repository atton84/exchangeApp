import express from 'express';
import axios from 'axios';
const router = express.Router();

router.get('/', async (req, res) => {

    try {
        const { 
            config: { exchangeUrl, apikey },
            query: {
                from_currency_code,
                amount ,
                to_currency_code,
            }
        } = req;

        const { data: { data: rates, base }, status } =  await axios
            .get(exchangeUrl, { 
                params: { 
                    apikey,
                    base_currency: from_currency_code,
                } 
            });

        const toCurrency = rates[to_currency_code];
        const expectedAmount = (amount * toCurrency);

        res.json({
            exchange_rate: toCurrency.toFixed(3),
            currency_code: to_currency_code,
            amount: expectedAmount.toFixed(3),
        });

    } catch (error){
        res.status(500).json({ message: `Error on server: "${error}"` });
    }    
        
});

module.exports = router;