var mysql = require('mysql');
var con;
app.post('/setserver', (req, res) => {
    //res.end;
    con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "cmp",
        port: 3306
    });
    con.connect(function (err) {
        if (err) throw err;
        console.log("Connected!");
        res.end();

    });
});

app.post('/gettablenames', (req, res) => {
    var product = [];
    con.query("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE table_schema ='cmp'", function (err, result) {
        if (err) throw err;  
        result.forEach(element => {       
            product.push([element.TABLE_NAME])
        });
        res.send(product);
        console.log("data send!");

    });
});
