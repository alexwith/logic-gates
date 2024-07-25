package com.github.alexwith.gates.service

import com.github.alexwith.gates.domain.project.Project
import com.github.alexwith.gates.domain.project.ProjectEntity
import com.github.alexwith.gates.domain.project.ProjectLikeEntity
import com.github.alexwith.gates.domain.user.UserEntity
import com.github.alexwith.gates.exception.ResourceNotFoundException
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.deleteWhere
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.selectAll
import org.springframework.stereotype.Service
import javax.swing.text.html.parser.Entity

@Service
class ProjectService {

    fun findById(id: Long): Project {
        return ProjectEntity
            .selectAll()
            .where { ProjectEntity.id eq id }
            .map(Project::wrapRow)
            .firstOrNull() ?: throw ResourceNotFoundException("Not found")
    }

    fun findByUserId(userId: Long): List<Project> {
        return ProjectEntity
            .selectAll()
            .where { ProjectEntity.creator eq EntityID(userId, UserEntity) }
            .map(Project::wrapRow)
    }

    fun create(init: Project.() -> Unit): Project {
        return Project.new(init)
    }

    fun createLike(userId: EntityID<Long>, projectId: EntityID<Long>) {
        ProjectLikeEntity.insert {
            it[user] = userId
            it[project] = projectId
        }
    }

    fun deleteLike(userId: EntityID<Long>, projectId: EntityID<Long>) {
        ProjectLikeEntity.deleteWhere {
            user eq userId
            project eq projectId
        }
    }
}