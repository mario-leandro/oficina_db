const express = require("express");
const ejs = require("ejs");
const app = express();
const bodyParser = require("body-parser");
const mysql = require("mysql");

// Conexão ao bando de dados
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "oficina",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Conectado ao mysql");
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("src"));
app.set("view engine", "ejs");
app.set("views", "src/views");

// Página inicial
app.get("/", async (req, res) => {
  const query = "SELECT * FROM carro";

  connection.query(query, (err, rows) => {
    if (err) throw err;
    res.render("home", { rows });
  });
});

// Adicionar
app.get("/adicionar", async (req, res) => {
  res.render("adicionar");
});

app.post("/adicionar", async (req, res) => {
  const { marca_carro, modelo_carro, cor_carro, placa_carro } = req.body;
  const { nome_cliente, cidade_cliente, estado_cliente } = req.body;

  // Primeira consulta SQL para inserir na tabela "carro"
  const queryCarro = "INSERT INTO carro(marca_carro, modelo_carro, cor_carro, placa_carro) VALUES (?, ?, ?, ?)";

  // Segunda consulta SQL para inserir na tabela "cliente"
  const queryCliente = "INSERT INTO cliente(nome_cliente, cidade_cliente, estado_cliente) VALUES (?, ?, ?)";

  connection.beginTransaction((err) => {
    if (err) throw err;

    // Executar a primeira consulta para inserir na tabela "carro"
    connection.query(queryCarro, [marca_carro, modelo_carro, cor_carro, placa_carro], (err) => {
      if (err) {
        connection.rollback(() => {
          throw err;
        });
      }

      // Executar a segunda consulta para inserir na tabela "cliente"
      connection.query(queryCliente, [nome_cliente, cidade_cliente, estado_cliente], (err) => {
        if (err) {
          connection.rollback(() => {
            throw err;
          });
        }

        connection.commit((err) => {
          if (err) {
            connection.rollback(() => {
              throw err;
            });
          }

          res.redirect("/");
        });
      });
    });
  });
});


// Editar
app.get("/editar/:marca_carro", (req, res) => {
  const { marca_carro } = req.params;
  const query = "SELECT * FROM carro WHERE marca_carro = ?";
  connection.query(query, [marca_carro], (err, rows) => {
    if (err) throw err;
    res.render("editar", { row: rows[0] });
  });
});

app.post("/editar/:m_c", (req, res) => {
  const { m_c } = req.params;
  const { marca_carro, modelo_carro, cor_carro, placa_carro } = req.body;
  const query =
    "UPDATE carro SET marca_carro = ?, modelo_carro = ?, cor_carro = ?, placa_carro = ? WHERE marca_carro = ?";
  connection.query(
    query,
    [marca_carro, modelo_carro, cor_carro, placa_carro, m_c],
    (err, result) => {
      if (err) throw err;
      res.redirect("/");
    }
  );
});

// Deletar
app.get("/deletar/:marca_carro", (req, res) => {
  const { marca_carro } = req.params;
  const query = "DELETE FROM carro WHERE marca_carro = ? limit 1";

  connection.query(query, [marca_carro], (err) => {
    if (err) throw err;
    res.redirect("/");
  });
});

//Relatório
app.get("/relatorio", (req, res) => {
  const { marca_carro, modelo_carro, cor_carro, placa_carro } = req.body;
  const { nome_cliente, cidade_cliente, estado_cliente } = req.body;
  const { nome_produto, preco_produto, qtd_produto, data_produto } = req.body;
  const query = "SELECT * FROM carro";
  const query2 = "SELECT * FROM cliente";
  const query3 = "SELECT * FROM produtos";

  connection.query(query, (err, rows) => {
    if (err) throw err;
    res.render("relatorio", { rows });

    connection.query(query2, (err, rows) => {
      if (err) throw err;
      res.render("relatorio", { rows });

      connection.query(query3, (err, rows) => {
        if (err) throw err;
        res.render("relatorio", { rows });
      });
    });
  });
});

// Iniciar página
app.listen(3000, () => {
  console.log("Página Iniciada!");
});
