package com.github.alexwith.gates.domain.project

import com.github.alexwith.gates.domain.user.User
import com.github.alexwith.gates.enums.ProjectVisibility
import org.jetbrains.exposed.dao.LongEntity
import org.jetbrains.exposed.dao.LongEntityClass
import org.jetbrains.exposed.dao.id.EntityID

class Project(id: EntityID<Long>) : LongEntity(id) {
    companion object : LongEntityClass<Project>(ProjectEntity)

    var name by ProjectEntity.name
    var shortDescription by ProjectEntity.shortDescription
    var description by ProjectEntity.description
    var visibility by ProjectEntity.visibility
    var data by ProjectEntity.data
    var creator by User referencedOn ProjectEntity.creator
    var likes by User via ProjectLikeEntity

    fun toDTO(): ProjectDTO {
        return ProjectDTO(id.value, name, shortDescription, description, visibility, data.toUByteArray().map { it.toInt() })
    }
}

class ProjectDTO(
    val id: Long,
    val name: String,
    val shortDescription: String,
    val description: String,
    val visibility: ProjectVisibility,
    val data: List<Int>
)