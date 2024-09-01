package com.github.alexwith.gates.exception

import jakarta.servlet.http.HttpServletRequest
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler

@ControllerAdvice
class ExceptionHandler {

    @ExceptionHandler
    fun handleException(exception: Exception, request: HttpServletRequest): ResponseEntity<APIError> {
        return APIError.from(exception, request, HttpStatus.INTERNAL_SERVER_ERROR).toResponse()
    }

    @ExceptionHandler
    fun handleResourceNotFoundException(exception: ResourceNotFoundException, request: HttpServletRequest): ResponseEntity<APIError> {
        return APIError.from(exception, request, HttpStatus.NOT_FOUND).toResponse()
    }
}