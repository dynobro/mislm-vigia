const fetch = require("node-fetch");
const fs = require('fs');
const sql = require('mssql')

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

try{
    const connec = sql.connect('mssql://usr_motor:usr_motor@localhost/modelos_test');

    connec.then(async x => {
        console.log('coneccted')
        const result = await sql.query`select * from dbo.input_lm`
        
        result.recordset.forEach(async input =>{
            console.log(`Obteniendo Infomacion de codigo: ${input.compuesto_folio_rut}`);
            fetch(`https://59ncssc767.execute-api.us-east-2.amazonaws.com/prod/getestado?lmid=${input.compuesto_folio_rut}`, {
                headers: {
                    'X-Api-Key': 'yVHYn9aIUpaztiFvNenpX4EYyP7PMHfw2jLE0XIC'
                }
            }).then(resultadoEjecucion =>{
        
                console.log(`Informacion capturada`);
        
                return resultadoEjecucion.json();
            }).then(intf => {
                const i = intf.Item;
                const sqlInsert = `insert into dbo.output_lm  values (
                    ${i.CodPrevisional},
                    '${i.proceso_tipo}',
                    '${i.sexo}',
                    '${i.rut_empl}',
                    '${i.folio}',
                    '${i.tipo_emision}',
                    '${i.LMCM}',
                    '${i.Diagnostico}',
                    '${i.NumServicioSalud}',
                    '${i.lm_id}',
                    '${i.Nombre_Caja}',
                    '${i.instancias[0].fechas_estado[0]}',
                    '${i.instancias[0].fechas_estado[1]}',
                    '${i.instancias[0].fechas_estado[2]}',
                    '${i.instancias[0].fechas_estado[3]}',
                    '${i.instancias[0].estado_actual}',
                    '${i.Cod_Pri_Continua}',
                    '${i.dias_m}',
                    '${i.fin}',
                    '${i.rut_trab}',
                    '${i.dias_o}',
                    '${i.der_sub}',
                    '${i.fin_modif}',
                    '${i.Rut_medico_contralor}',
                    '${i.tipo}',
                    '${i.inicio}',
                    '${i.nom_trab}',
                    '${i.entidad_pagadora}',
                    '${i.rut_pres}',
                    '${i.nom_empl}',
                    '${i.CodRechazo}',
                    '${i.inicio_modif}',
                    '${i.RN}',
                    '${i.edad}',
                    '${i.last_time}')`
                
                sql.query(sqlInsert, (err, result) => {
                    
                    console.log(err)
                    console.dir(result)

                })
            })    
        
            //await sleep(5000)
        })
    })

    
    return false;
} catch (err) {
    console.log({ err })
}

