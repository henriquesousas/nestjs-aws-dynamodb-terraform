interface BaseResponse {
  status: number;
  success: boolean;
  message: string;
  content?: any; // Optional content for success responses
  errors?: any; // Optional error field for failure responses
}

export interface SuccessResponse extends BaseResponse {
  success: true;
  content: any;
}

export interface ErrorResponse extends BaseResponse {
  success: false;
  errors: any;
}

export class HttpResponse {
  static create(content: any): SuccessResponse {
    return {
      status: 201,
      success: true,
      message: 'Recurso criado com sucesso',
      content,
    };
  }

  static ok(content: any): SuccessResponse {
    return {
      status: 200,
      success: true,
      message: 'Operação bem sucedida',
      content,
    };
  }

  static failure(
    statusCode: number,
    error: any,
    message: string,
  ): ErrorResponse {
    return {
      status: statusCode,
      success: false,
      message,
      errors: error,
    };
  }
}
