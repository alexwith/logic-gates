package com.github.alexwith.gates.controller

import com.github.alexwith.gates.domain.Project
import com.github.alexwith.gates.domain.ProjectDTO
import com.github.alexwith.gates.dto.project.CreateProjectDTO
import com.github.alexwith.gates.middleware.getUser
import com.github.alexwith.gates.service.ProjectService
import jakarta.servlet.http.HttpServletRequest
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/v1/project")
class ProjectController @Autowired constructor(val projectService: ProjectService) {

    @PostMapping("/create")
    fun create(request: HttpServletRequest, @RequestBody body: CreateProjectDTO): ResponseEntity<Void> {
        val user = request.getUser()

        if (!PROJECT_VALID_NAME_REGEX.matches(body.name)) {
            return ResponseEntity(HttpStatus.BAD_REQUEST)
        }

        this.projectService.create {
            name = body.name
            shortDescription = body.shortDescription
            description = body.description
            visibility = body.visibility
            data = byteArrayOf()
            creator = user
        }

        return ResponseEntity(HttpStatus.OK)
    }

    @GetMapping("/get")
    fun get(request: HttpServletRequest): ResponseEntity<List<ProjectDTO>> {
        val user = request.getUser()

        return ResponseEntity(this.projectService.findByUserId(user.id.value).map(Project::toDTO), HttpStatus.OK)
    }

    companion object {
        val PROJECT_VALID_NAME_REGEX = Regex("^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*\$")
    }
}