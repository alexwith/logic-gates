package com.github.alexwith.gates.service

import com.github.alexwith.gates.domain.project.Project
import com.github.alexwith.gates.domain.project.ProjectEntity
import com.github.alexwith.gates.domain.project.ProjectLikeEntity
import com.github.alexwith.gates.domain.user.UserEntity
import com.github.alexwith.gates.enums.ProjectVisibility
import com.github.alexwith.gates.exception.ResourceNotFoundException
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.statements.UpdateStatement
import org.springframework.stereotype.Service

@Service
class ProjectService {

    fun findById(id: Long): Project {
        return ProjectEntity
            .selectAll()
            .where { ProjectEntity.id eq id }
            .map(Project::wrapRow)
            .firstOrNull() ?: throw ResourceNotFoundException("Project not found")
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

    fun update(id: Long, body: ProjectEntity.(UpdateStatement) -> Unit) {
        ProjectEntity.update({ ProjectEntity.id eq id }, body = body)
    }

    fun deleteById(id: Long) {
        ProjectLikeEntity.deleteWhere { project eq id }
        ProjectEntity.deleteWhere { ProjectEntity.id eq id }
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

    fun findTop12Liked(): List<Project> {
        return ProjectEntity
            .join(ProjectLikeEntity, JoinType.LEFT, ProjectEntity.id, ProjectLikeEntity.project)
            .select(ProjectEntity.columns)
            .where { ProjectEntity.visibility eq ProjectVisibility.PUBLIC }
            .groupBy(ProjectEntity.id)
            .orderBy(ProjectLikeEntity.project.count(), SortOrder.DESC)
            .limit(12)
            .map(Project::wrapRow)
    }

    fun searchByName(name: String): List<Project> {
        return ProjectEntity
            .selectAll()
            .where {
                ProjectEntity.visibility eq ProjectVisibility.PUBLIC and(ProjectEntity.name.lowerCase() like ("%${name.lowercase()}%"))
            }
            .limit(6)
            .map(Project::wrapRow)
    }
}