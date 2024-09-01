package com.github.alexwith.gates.controller

import com.github.alexwith.gates.domain.project.Project
import com.github.alexwith.gates.domain.project.ProjectDTO
import com.github.alexwith.gates.domain.user.UserDTO
import com.github.alexwith.gates.enums.ProjectVisibility
import com.github.alexwith.gates.middleware.getUser
import com.github.alexwith.gates.service.ProjectService
import com.github.alexwith.gates.service.UserService
import jakarta.servlet.http.HttpServletRequest
import org.jetbrains.exposed.sql.transactions.transaction
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/users")
class UserController @Autowired constructor(val userService: UserService, val projectService: ProjectService) {

    @GetMapping("/me")
    fun me(request: HttpServletRequest): ResponseEntity<UserDTO> {
        return ResponseEntity(request.getUser().toDTO(), HttpStatus.OK)
    }

    @GetMapping("/{id}")
    fun get(@PathVariable id: String): ResponseEntity<UserDTO> {
        return transaction {
            ResponseEntity(this@UserController.userService.findById(id.toLong()).toDTO(), HttpStatus.OK)
        }
    }

    @GetMapping("/{id}/projects/public")
    fun getPublicProjects(request: HttpServletRequest, @PathVariable id: String): ResponseEntity<List<ProjectDTO>> {
        return ResponseEntity(this.projectService
            .findByUserId(id.toLong())
            .filter { it.visibility == ProjectVisibility.PUBLIC }
            .map(Project::toDTO), HttpStatus.OK
        )
    }

    @GetMapping("/{id}/projects/all")
    fun getAllProjects(request: HttpServletRequest, @PathVariable id: String): ResponseEntity<List<ProjectDTO>> {
        val user = request.getUser()
        if (user.id.value != id.toLong()) {
            return ResponseEntity(HttpStatus.UNAUTHORIZED)
        }

        return ResponseEntity(this.projectService.findByUserId(id.toLong()).map(Project::toDTO), HttpStatus.OK)
    }

    @GetMapping("/search/username/{query}")
    fun searchUsername(request: HttpServletRequest, @PathVariable query: String): ResponseEntity<List<UserDTO>> {
        val users = this@UserController.userService.searchByUsername(query).map { it.toDTO() }
        return ResponseEntity(users, HttpStatus.OK)
    }
}