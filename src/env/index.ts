import { config } from 'dotenv'
import { z } from 'zod'

// node_env: development, test, production

if(process.env.NODE_ENV === 'test') {
    config({ path: '.env.test' })
} else {
    config()
}

//definimos nosso schema de variaveis de ambiente, as quais também queremos validar
const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
    DATABASE_URL: z.string(),
    PORT: z.number().default(3333) //como tem um valor default, nao precisa estar no .env, pq ja define valor aqui msm
})

//joi, yup - outras ferramentas
//zod é mais integrado ao typescript

// quando chamamos o parse, ele pega os valores do process.env e passa pro schema
// ao fazer isso, ele faz uma validação, do tipo do dado e se não é nulo
// se der erro joga um novo erro, é possivel trocar o erro depois
//--export const env = envSchema.parse(process.env)

//safeParse nao joga erro em execução
//retorna um tipo de resposta (SafeParseReturnType) e dentro dele conseguimos pegar:
// success (true or false) | data (objeto com as variaveis em caso de sucesso) | error (em caso de false)
const _env = envSchema.safeParse(process.env)

if(!_env.success) {
    console.error('Invalid enviroment variables', _env.error.format())

    throw new Error('Invalid enviroment variables')
}

export const env = _env.data