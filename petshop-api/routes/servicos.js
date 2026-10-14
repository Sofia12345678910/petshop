// Rotas do cadastro de serviços.
//
// Esse arquivo só cuida da tabela "serviço". Ele é "montado" em um
// endereço base (/api/clientes) lá em server.js, por isso as rotas aqui
// dentro começam em "/" (a lista) e "/:id" (um serviço específico), e não
// em "/api/clientes".
 
import { Router } from 'express';
import db from '../database.js';
 
const router = Router();
 
// Campos que toda requisição de criação/atualização de cliente precisa ter.
const CAMPOS_OBRIGATORIOS = ['nome', 'preco', 'descricao' ];
 
// Confere se o corpo da requisição tem os campos obrigatórios preenchidos.
function validarServico(dados) {
  for (const campo of CAMPOS_OBRIGATORIOS) {
    if (!dados[campo] || String(dados[campo]).trim() === '') {
      return `O campo "${campo}" é obrigatório.`;
    }
  }
  return null;
}
 
// GET /api/clientes -> lista todos os clientes, do mais recente para o mais antigo
router.get('/', (req, res) => {
  const servicos = db
    .prepare('SELECT * FROM servicos ORDER BY id_servicos DESC')
    .all();
  res.json(servicos);
});
 
// GET /api/clientes/:id -> busca um único cliente
router.get('/:id', (req, res) => {
  const servicos = db
    .prepare('SELECT * FROM servicos WHERE id_servico = ?')
    .get(req.params.id);
 
  if (!servicos) {
    return res.status(404).json({ erro: 'Servico não encontrado.' });
  }
  res.json(servicos);
});
 
// POST /api/clientes -> cria um novo cliente
router.post('/', (req, res) => {
  const erro = validarServico(req.body);
  if (erro) {
    return res.status(400).json({ erro });
  }
 
  // Os campos opcionais recebem "null" quando não vierem na requisição:
  // o SQLite aceita null (campo vazio), mas não aceita undefined.
  const {
    nome,
    preco,
    descricao,
  } = req.body;
 
  const resultado = db
    .prepare(
      `INSERT INTO servicos
        (nome, preco, descricao)
       VALUES (?, ?, ?)`
    )
    .run(nome, preco, descricao);
 
  const novoServico = db
    .prepare('SELECT * FROM servicos WHERE id_servico = ?')
    .get(resultado.lastInsertRowid);
 
  res.status(201).json(novoServico);
});
 
// PUT /api/servicos/:id -> atualiza um cliente existente
router.put('/:id', (req, res) => {
  const erro = validarServico(req.body);
  if (erro) {
    return res.status(400).json({ erro });
  }
 
  const servicoExistente = db
    .prepare('SELECT * FROM servicos WHERE id_servico = ?')
    .get(req.params.id);
 
  if (!servicoExistenteExistente) {
    return res.status(404).json({ erro: 'Servico não encontrado.' });
  }
 
  const {
    nome,
    preco,
    descricao,
  } = req.body;
 
  db.prepare(
    `UPDATE servicos SET
       nome = ?, preco = ?, descricao = ?
     WHERE id_servico = ?`
  ).run(nome, telefone, tipo_pet, nome_pet, data_nascimento_pet, raca, cor, req.params.id);
 
  const servicoAtualizado = db
    .prepare('SELECT * FROM servicos WHERE id_servico = ?')
    .get(req.params.id);
 
  res.json(servicoAtualizado);
});
 
// DELETE /api/servicos/:id -> remove um cliente
router.delete('/:id', (req, res) => {
  const resultado = db
    .prepare('DELETE FROM servicos WHERE id_servico = ?')
    .run(req.params.id);
 
  if (resultado.changes === 0) {
    return res.status(404).json({ erro: 'Servico não encontrado.' });
  }
 
  res.status(204).send();
});
 
export default router;
 