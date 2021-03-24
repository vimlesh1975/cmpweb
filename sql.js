var mysql = require('mysql');
var con;
app.post('/setserver', (req, res) => {
    //res.end;
    con = mysql.createConnection({
        host:req.body.host,// "localhost",
        user: req.body.username,
        password: req.body.password,
        port: req.body.port
    });
    con.connect(function (err) {
        if (err) throw err;
        console.log("myysql server Connected!");
        res.end();

    });
});

app.post('/gettablenames', (req, res) => {
    var product = [];
    con.query("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE table_schema  ='" + req.body.mysqdatabasename + "'" , function (err, result) {
        if (err) throw err;  
        result.forEach(element => {       
            product.push([element.TABLE_NAME])
        });
        res.send(product);
        console.log("table names  send!");

    });
});
app.post('/gettabledata', (req, res) => {
    var product = [];
    con.query("SELECT * from " + req.body.mysqdatabasename + "." + req.body.sqltablesnames , function (err, result) {
        if (err) throw err;  
        res.send(result);
        console.log("table data send!");
    });
   
});