const { Router } = require('express') // 
const Aluno = require('../models/Aluno')
const Curso = require('../models/Curso')
const Professor = require('../models/Professor')  

const routes = new Router()

// GET - Lista alguma coisa
// POST - Criar/adicionar algo
// PUT - Atualizar algo
// DELETE - Deleta algo
// PATCH - depois

// criar uma rota
 // tipo
 // path
 // implementacao

routes.get('/bem_vindo', (req, res) => { // EXIBE MENSAGEM DE BOAS VINDAS
    res.json({name: 'Bem vindo'})
})

routes.post('/alunos', async (req, res) => { // Cadastra um novo aluno

    try {

    const nome = req.body.nome
    const data_nascimento = req.body.data_nascimento
    const celular = req.body.celular 

    if(!nome){// Se não veio o nome
        return res.status(400).json({mensagem: 'O nome é obrigatório'})
    }

    //momentjs - biblioteca para manipular datas
    //date-fs

    nome.match()

    if(!data_nascimento){// Se não veio a data de nascimento
        return res.status(400).json({mensagem: 'A data de nascimento é obrigatória'})
    }

    if(!data_nascimento.match(/\d{4}-\d{2}-\d{2}/gm)) { // Verifica se o formato da data esta correta
        return res.status(400).json({mensagem: 'A data de nascimento não esta no formato correto'})
    }
   
    const aluno = await Aluno.create({
        nome: nome,
        data_nascimento: data_nascimento,
        celular: celular
    })

    res.status(201).json(aluno)
        
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error: 'Não foi possível cadastrar o aluno'})
    }
  
    })

routes.get('/alunos', async (req, res) => { // Lista todos os alunos
    const alunos = await Aluno.findAll()
    res.json(alunos)

})

routes.post('/cursos', async (req, res) => { //Cadastra um novo curso

    try {
    const nome = req.body.nome
    const duracao_horas = req.body.duracao_horas

    if(!nome){// Se não veio o nome
        return res.status(400).json({mensagem: 'O nome é obrigatório'})
    }

    if(!(duracao_horas >= 40 && duracao_horas <= 200)) { 
    return res.status(400).json({mensagem: 'A duração do curso deve ser entre 40 e 200 horas'
    })

    }

    const curso = await Curso.create({
        nome: nome,
        duracao_horas: duracao_horas

    })

 res.status(201).json(curso)

} catch (error) {
    console.log(error.message)
    res.status(500).json({ error: 'Não foi possível cadastrar o curso'})
}

})

routes.get('/cursos', async (req, res) => { // Lista todos os cursos
    
    let params = {}

    if(req.query.nome) {
       params = {...params, nome: req.query.nome}
    }

    const cursos = await Curso.findAll({
        where: params
       
    })
    res.json(cursos)

})


routes.put('/cursos/:id', async (req, res) => {
    const { id } = req.params
    const { nome, duracao_horas } = req.body

    try {

        const curso = await Curso.findByPk(id)
        if (curso) {

            curso.nome = nome
            curso.duracao_horas = duracao_horas
            await curso.save()
            res.status(200).json(curso)

        } else {

            res.status(404).json({ mensagem: 'Curso não encontrado' })
        
        }

    } catch (error) {

        res.status(500).json({ mensagem: 'Erro ao atualizar o curso: ' + error.message })
    }
})

//QUERY PARAMS -get
//BODY PARAMS - post/put
//ROUTE PARAMS - para rota de deleção

routes.delete('/cursos/:id', (req,res) =>{
    const id = req.params.id
   
    Curso.destroy({
        where:{
            id: id
        }
    }) // Deleta cursos da tabela por id

    res.status(204).json ({ })
  

})

routes.get('/professores', async (req, res) => { // Lista todos os professores
    const professor = await Professor.findAll()
    res.json(professor)

})

routes.post('/professores', async (req, res) => {
    try {
        const { nome, curso } = req.body;  // Assumindo que o corpo da requisição contém 'nome' e 'curso'

        // Verificação se o nome foi fornecido
        if (!nome) {
            return res.status(400).json({ mensagem: 'O nome do professor é obrigatório' });
        }

        // Criação do professor no banco de dados
        const professor = await Professor.create({
            nome: nome,
            curso: curso
        });

        // Resposta com o professor criado
        res.status(201).json(professor);

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Não foi possível cadastrar o professor' });
    }
})

routes.put('/professores/:id', async (req, res) => {
    const { id } = req.params
    const { nome, curso } = req.body

    try {

        const professor = await Professor.findByPk(id)
        if (professor) {

            professor.nome = nome
            professor.curso = curso
            await professor.save()
            res.status(200).json(professor)

        } else {

            res.status(404).json({ mensagem: 'Professor não encontrado' })
        
        }

    } catch (error) {

        res.status(500).json({ mensagem: 'Erro ao atualizar o professor ' + error.message })
    }
})

routes.delete('/professores/:id', (req,res) =>{
    const id = req.params.id
   
    Professor.destroy({
        where:{
            id: id
        }
    }) // Deleta professores da tabela por id

    res.status(204).json ({ })
  

})

module.exports = routes

