package com.github.alexwith.gates.controller

import com.github.alexwith.gates.domain.project.ProjectDTO
import com.github.alexwith.gates.dto.project.CreateProjectDTO
import com.github.alexwith.gates.middleware.getUser
import com.github.alexwith.gates.service.ProjectService
import jakarta.servlet.http.HttpServletRequest
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/v1/projects")
class ProjectController @Autowired constructor(val projectService: ProjectService) {

    @GetMapping("/{id}")
    fun get(request: HttpServletRequest, @PathVariable id: String): ResponseEntity<ProjectDTO> {
        val project = this@ProjectController.projectService.findById(id.toLong())

        return ResponseEntity(project.toDTO(), HttpStatus.OK)
    }

    @DeleteMapping("/{id}")
    fun delete(request: HttpServletRequest, @PathVariable id: String): ResponseEntity<Void> {
        val user = request.getUser()
        val project = this@ProjectController.projectService.findById(id.toLong())
        if (project.creator.id != user.id) {
            return ResponseEntity(HttpStatus.UNAUTHORIZED)
        }

        this.projectService.deleteById(id.toLong())
        return ResponseEntity(HttpStatus.OK)
    }

    @GetMapping("/likes/{id}")
    fun getLikes(request: HttpServletRequest, @PathVariable id: String): ResponseEntity<List<Long>> {
        val project = this@ProjectController.projectService.findById(id.toLong())
        return ResponseEntity(project.likes.map { it.id.value }, HttpStatus.OK)
    }

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

    @PostMapping("/like/{id}")
    fun createLike(request: HttpServletRequest, @PathVariable id: String): ResponseEntity<Void> {
        val user = request.getUser()
        val project = this.projectService.findById(id.toLong())

        this.projectService.createLike(user.id, project.id)

        return ResponseEntity(HttpStatus.OK)
    }

    @DeleteMapping("/like/{id}")
    fun deleteLike(request: HttpServletRequest, @PathVariable id: String): ResponseEntity<Void> {
        val user = request.getUser()
        val project = this.projectService.findById(id.toLong())

        this.projectService.deleteLike(user.id, project.id)

        return ResponseEntity(HttpStatus.OK)
    }

    @PostMapping("/like/{id}/toggle")
    fun toggleLike(request: HttpServletRequest, @PathVariable id: String): ResponseEntity<Void> {
        val user = request.getUser()

        val project = this.projectService.findById(id.toLong())

        if (project.likes.map { it.id.value }.contains(user.id.value)) {
            this.projectService.deleteLike(user.id, project.id)
        } else {
            this.projectService.createLike(user.id, project.id)
        }

        return ResponseEntity(HttpStatus.OK)
    }

    companion object {
        val PROJECT_VALID_NAME_REGEX = Regex("^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*\$")
    }
}