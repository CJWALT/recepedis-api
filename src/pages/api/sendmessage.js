import Cors from 'cors'
import FormData from 'form-data'
import Mailgun from 'mailgun.js'

  const cors = Cors({
    methods: ['POST', 'GET', 'HEAD','OPTIONS'],
    origin:'*'
  })


  const API_KEY = process.env.MAILGUN_API_KEY || ''
  const DOMAIN = process.env.MAILGUN_DOMAIN || ''

  function runMiddleware(req, res, fn){
    return new Promise((resolve, reject)=>{ 
      fn(req, res, (result)=>{ 
        if(result instanceof Error){ 
          return reject(result)
        }
        return resolve(result)
      })
    })
  }

  

export default async function handler(req, res) {

  await runMiddleware(req, res, cors)

  const mailgun = new Mailgun(FormData);
  const mg = mailgun.client({username: 'api', key: API_KEY});

  const {name, email, message} = req.body;
   

  const messageData = { 
    from: "Contact Form <mailgun@sandbox0aaf52a76f65416d88df30a59858c9ee.mailgun.org>",
    to: 'oyedelee22@gmail.com',
    subject: 'New Contact Form',
    text:`Hello, 
      You have a new message from ${name} ${email}, 
      ${message}`      
  }

       try{ 
        const emailRes = await mg.messages.create(DOMAIN, messageData)
        
      }

      catch(err){ 
        console.error('Error sending email', err)
      }

    res.status(200).json({ submitted: true })
  }