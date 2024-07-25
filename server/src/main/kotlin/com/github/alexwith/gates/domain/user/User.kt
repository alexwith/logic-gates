package com.github.alexwith.gates.domain.user

import com.github.alexwith.gates.domain.project.Project
import com.github.alexwith.gates.domain.project.ProjectEntity
import com.github.alexwith.gates.domain.project.ProjectLikeEntity
import org.jetbrains.exposed.dao.LongEntity
import org.jetbrains.exposed.dao.LongEntityClass
import org.jetbrains.exposed.dao.id.EntityID

class User(id: EntityID<Long>) : LongEntity(id) {
    companion object : LongEntityClass<User>(UserEntity)

    var githubId by UserEntity.githubId
    var username by UserEntity.username
    val projects by Project referrersOn ProjectEntity.creator
    val projectLikes by Project via ProjectLikeEntity

    fun toDTO(): UserDTO {
        return UserDTO(id.value, githubId, username)
    }
}

class UserDTO(val id: Long, val githubId: Long, val username: String)