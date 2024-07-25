package com.github.alexwith.gates.service

import com.github.alexwith.gates.domain.project.Project
import com.github.alexwith.gates.domain.project.ProjectEntity
import com.github.alexwith.gates.domain.user.UserEntity
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.sql.selectAll
import org.springframework.stereotype.Service

@Service
class ProjectService {

    fun findByUserId(userId: Long): List<Project> {
        return ProjectEntity
            .selectAll()
            .where { ProjectEntity.creator eq EntityID(userId, UserEntity) }
            .map(Project::wrapRow)
    }

    fun create(init: Project.() -> Unit): Project {
        return Project.new(init)
    }
}