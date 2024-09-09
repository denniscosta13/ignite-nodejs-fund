// para nao ter que validar em toda requisicao que precisa da sessionId se ela existe,
// utilizamos um middleware para interceptar a request, validar se existe ou nao sessionId no cookie
// assim podemos reaproveitar o mesmo codigo em varias requisicoes da nossa api

// import para definir o tipo request e response na funcao middleware
// reply = response
import { FastifyReply, FastifyRequest } from "fastify"

export async function checkSessionIdExists(request: FastifyRequest, response: FastifyReply) {
    const sessionId = request.cookies.sessionId

    if(!sessionId) {
        return response.status(401).send({
            error: 'Unauthorized.'
        })
    }
    
}