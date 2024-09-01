package com.github.alexwith.gates.exception

import jakarta.servlet.http.HttpServletRequest
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import java.time.LocalDateTime

class APIError(val path: String, val message: String, val status: HttpStatus, val time: LocalDateTime) {

    fun toResponse(): ResponseEntity<APIError> {
        return ResponseEntity(this, this.status)
    }

    companion object {

        fun from(exception: Exception, request: HttpServletRequest, status: HttpStatus): APIError {
            return APIError(
                request.requestURI, exception.message ?: "Unknown cause", status, LocalDateTime.now()
            )
        }
    }
}