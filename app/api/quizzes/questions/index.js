const { Router } = require('express')

const { Question } = require('../../../models')
const { Answer } = require('../../../models')
const AnswerRouter = require('./answers')

const router = new Router({ mergeParams: true })

function findQuestionsByQuizId(quizId) {
  const q = Question.get()
  return q.filter((question) => question.quizId === quizId)
}

router.get('/', (req, res) => {
  try {
    let questions = Question.get()
    for(let question of questions) {
      question.answers = Answer.get().filter((answer) => answer.questionId === question.id)
    }
    res.status(200).json(questions.filter((question) => question.quizId === parseInt(req.params.quizId, 10)))

  } catch (err) {
    res.status(500).json(err)
  }
})

router.get('/:questionId', (req, res) => {
  try {
    res.status(200).json(Question.getById(req.params.questionId))
  } catch (err) {
    res.status(500).json(err)
  }
})

router.delete('/:questionId', (req, res) => {
  try {
    res.status(200).json(Question.delete(req.params.questionId))
  } catch (err) {
    res.status(500).json(err)
  }
})

router.put('/:questionId', (req, res) => {
  try {
    res.status(200).json(Question.update(req.params.questionId, req.body))
  } catch (err) {
    res.status(500).json(err)
  }
})

router.post('/', (req, res) => {
  try {
    req.body.quizId = parseInt(req.params.quizId, 10)
    const question = Question.create({ ...req.body })
    res.status(201).json(question)
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).json(err.extra)
    } else {
      res.status(500).json(err)
    }
  }
})

router.use('/:questionId/answers', AnswerRouter)

module.exports = router
