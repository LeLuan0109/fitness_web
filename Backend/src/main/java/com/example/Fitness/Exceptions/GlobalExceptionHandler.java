package com.example.Fitness.Exceptions;

import com.example.Fitness.DTO.response.errors.ErrorDetail;
import com.example.Fitness.DTO.response.errors.ErrorResponse;
import com.example.Fitness.DTO.response.errors.TError;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.io.IOException;
import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
        List<ErrorDetail> details = ex.getBindingResult().getAllErrors().stream()
                .filter(error -> error instanceof FieldError)
                .map(error -> new ErrorDetail(((FieldError) error).getField(), error.getDefaultMessage()))
                .toList();

        return buildErrorResponse("VALIDATION_ERROR", "Dữ liệu gửi lên không hợp lệ.", details, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(DataNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleDataNotFoundException(DataNotFoundException ex) {
        return buildErrorResponse("DATA_NOT_FOUND", ex.getMessage(), null, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDeniedException(AccessDeniedException ex) {
        return buildErrorResponse("ACCESS_DENIED", "Bạn không có quyền thực hiện thao tác này.", null, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ErrorResponse> handleMaxUploadSizeExceededException(MaxUploadSizeExceededException ex) {
        return buildErrorResponse("FILE_TOO_LARGE", "File tải lên quá lớn! Vui lòng kiểm tra lại.", null, HttpStatus.PAYLOAD_TOO_LARGE);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntimeExceptions(RuntimeException ex) {
        return buildErrorResponse("RUNTIME_ERROR", ex.getMessage(), null, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(IOException.class)
    public ResponseEntity<ErrorResponse> handleRuntimeExceptions(IOException ex) {
        return buildErrorResponse("IOE_ERROR", ex.getMessage(), null, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneralExceptions(Exception ex) {
        ex.printStackTrace();
        return buildErrorResponse("INTERNAL_SERVER_ERROR", "Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.", null, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private ResponseEntity<ErrorResponse> buildErrorResponse(String errorCode, String message, List<ErrorDetail> details, HttpStatus status) {
        TError tError = new TError(errorCode, message, details);
        ErrorResponse response = ErrorResponse.builder().error(tError).build();
        return new ResponseEntity<>(response, status);
    }
}
