const express = require("express")
const {TopClients} = require("../../models");

const router = express.Router()


router.get("/:dia", async (req, res) => {
    try{

        const diaParam = req.params.dia
        
        const dia = new Date(diaParam);
        const diaMaisUm = new Date(dia);
        diaMaisUm.setDate(diaMaisUm.getDate() + 1);

        const topClients = await TopClients.findOne({dia: 
                {
                    $gte: dia,
                    $lte: diaMaisUm
                },
            });
    
        if (!topClients) {
            return res.json({
                sucesso: false,
                error: "Nenhum dado para a data informada.",
            });
        }

        res.json({
            sucesso: true,
            topClients: topClients
        })
    
    } catch (e) {

        res.json({
            sucesso: false,
            error: e.message,
        })
    }


})



module.exports = router
