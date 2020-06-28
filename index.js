const express = require('express')
const config = require('config')
const path = require('path')
const mongoose = require('mongoose')


const app = express()

app.use(express.json({ extended: true }))

app.use('/api/method', require('./routes/method.routes'))
app.use('/api/order', require('./routes/order.routes'))
app.use('/api/yanotification', require('./routes/yanotification.routes'))
app.use('/api/smsstatus', require('./routes/smsstatus.routes'))
app.use('/api/smsnotification', require('./routes/smsnotification.routes'))
app.use('/api/status', require('./routes/status.routes'))



if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, 'front', 'build')))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'front', 'build', 'index.html'))
  })
}

const PORT = config.get('port') || 5000

async function start() {
  try {
    await mongoose.connect(config.get('mongoUri'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
 app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`))

  } catch (e) {
    console.log('Server Error', e.message)
    process.exit(1)
  }
}

start()
