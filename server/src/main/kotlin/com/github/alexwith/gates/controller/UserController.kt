package com.github.alexwith.gates.controller

import com.github.alexwith.gates.domain.UserDTO
import com.github.alexwith.gates.exception.ResourceNotFoundException
import com.github.alexwith.gates.service.UserService
import jakarta.servlet.http.HttpServletRequest
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/user")
class UserController @Autowired constructor(val userService: UserService) {

    @GetMapping("/me")
    fun me(request: HttpServletRequest): ResponseEntity<UserDTO> {
        return try {
            ResponseEntity(this.userService.getFromRequest(request).toDTO(), HttpStatus.OK)
        } catch (e: ResourceNotFoundException) {
            ResponseEntity(null, HttpStatus.NOT_FOUND)
        }
    }
}