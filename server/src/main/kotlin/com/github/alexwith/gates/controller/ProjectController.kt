package com.github.alexwith.gates.controller

import com.github.alexwith.gates.domain.project.ProjectDTO
import com.github.alexwith.gates.domain.project.ProjectEntity
import com.github.alexwith.gates.dto.project.CreateProjectDTO
import com.github.alexwith.gates.enums.ProjectVisibility
import com.github.alexwith.gates.middleware.getUser
import com.github.alexwith.gates.service.ProjectService
import jakarta.servlet.http.HttpServletRequest
import org.jetbrains.exposed.sql.update
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/v1/projects")
class ProjectController @Autowired constructor(val projectService: ProjectService) {

    @GetMapping("/test/{id}")
    fun test(@PathVariable id: String) {
        val data = ubyteArrayOf(
            4u,
            24u,1u,
            0u,
            4u,
            3u,65u,78u,68u,2u,1u,0u,2u,0u,7u,3u,78u,79u,84u,1u,1u,0u,4u,0u,2u,2u,79u,82u,2u,1u,0u,5u,0u,245u,0u,1u,3u,88u,79u,82u,2u,1u,0u,
            2u,0u,53u,0u,2u,0u,0u,0u,0u,
            1u,160u,
            1u,102u,0u,1u,0u,1u,2u,176u,1u,104u,0u,3u,0u,0u,1u,1u,63u,1u,145u,0u,1u,0u,1u,63u,1u,131u,0u,2u,0u,1u,63u,1u,227u,0u,4u,1u,
            0u,0u,0u,1u,1u,0u,1u,0u,0u,0u,0u,0u,0u,0u,0u,0u,1u,0u,1u,0u,1u,0u,0u,0u,0u,2u,0u,1u,1u,0u,0u,1u,0u,0u,0u,1u,0u,0u,0u,0u,0u,
            0u,1u,0u,1u,0u,0u
        ).toByteArray()

        ProjectEntity.update({ ProjectEntity.id eq id.toLong() }) {
            it[ProjectEntity.data] = data
            it[ProjectEntity.visibility] = ProjectVisibility.PRIVATE
        }
        println("sent update with: " + data)
    }

    @GetMapping("/{id}")
    fun get(request: HttpServletRequest, @PathVariable id: String): ResponseEntity<ProjectDTO> {
        val project = this@ProjectController.projectService.findById(id.toLong())
        
        return ResponseEntity(project.toDTO(), HttpStatus.OK)
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