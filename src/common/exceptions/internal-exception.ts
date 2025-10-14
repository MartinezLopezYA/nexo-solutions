import { HttpException, HttpStatus } from "@nestjs/common";

export class InternalException extends HttpException {
    constructor(message: string) {
        super(
            {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                errorCode: 'INTERNAL_SERVER_ERROR',
                message,
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
}