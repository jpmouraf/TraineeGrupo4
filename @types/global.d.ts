import { User } from "@prisma/client";

declare global{
    namespace Express{
        interface Request{
            user: User;
        }
    }
}

namespace NodeJD{
    interface ProcessEnv{
    APP_URL: string;
    PORT: string;
    DATABASE_URL: string;
    SECRET_KEY: string;
    JWT_EXPIRATION: string;
    NODE_ENV: string;
    }
}