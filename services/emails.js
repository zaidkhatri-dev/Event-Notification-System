const nodemailer = require('nodemailer')
const {google} = require('googleapis')
require('dotenv').config()

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URI = process.env.REDIRECT_URI
const REFRESH_TOKEN = process.env.REFRESH_TOKEN

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID,CLIENT_SECRET,REDIRECT_URI)

oAuth2Client.setCredentials({
    refresh_token: REFRESH_TOKEN
})

async function broadcastMail(event,isUpdated = null) {
    try{
        const accessToken = await oAuth2Client.getAccessToken()

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'zaid.khatri.1055@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            }
        })

        const attendes = event.attendes;
        

        attendes.forEach(async (attende) => {
            let title = `Invitation to ${event.title}`
            let body = `Dear Student\nWe are excited to inform you about an upcoming event organized by ${event.department} department at your college\n\nEvent Details:\nStart Date and Time - ${event.startAt.toLocaleString()}\nEnd Date and Time - ${event.endAt.toLocaleString()}\nMode - ${event.mode}\n`
            
            if(event.mode == 'offline'){
                body += `Address - ${event.address}\n`
            }

            body += `\n${event.description}\n\nWe would love to have your participation in this event. Please mark your calendar and join us for an enriching experience.\n\nBest Regards,\n${event.department} depatment.`


            if(isUpdated == "U"){
                title =`Update Notification: ${event.title}`
            }

            if(isUpdated == "C"){
                title = `Notice of Cancellation: ${event.title}`
                body = `Dear Student, we regret to inform you that the event ${event.title}, organized by the ${event.department} department and scheduled from ${event.startAt.toLocaleString()} to ${event.endAt.toLocaleString()}, has been cancelled.`
            }
            
            const mailOptions = {
            from: `${event.department} Department<zaid.khatri.1055@gmail.com>`,
            to: `${attende}`,
            subject: title,
            text: body
            }
            
            await transport.sendMail(mailOptions)
            
        });

        
    }catch(err){
        console.log("Error",err)
    }
}

module.exports = broadcastMail