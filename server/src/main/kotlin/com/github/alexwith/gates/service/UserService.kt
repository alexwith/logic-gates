package com.github.alexwith.gates.service

import com.github.alexwith.gates.domain.user.User
import com.github.alexwith.gates.domain.user.UserEntity
import com.github.alexwith.gates.exception.ResourceNotFoundException
import org.jetbrains.exposed.sql.lowerCase
import org.jetbrains.exposed.sql.selectAll
import org.springframework.stereotype.Service

@Service
class UserService {

    fun findById(id: Long): User {
        return UserEntity
            .selectAll()
            .where { UserEntity.id eq id }
            .map(User::wrapRow)
            .firstOrNull() ?: throw ResourceNotFoundException("User not found")
    }

    fun findByGithubId(githubId: Long): User {
        return UserEntity
            .selectAll()
            .where { UserEntity.githubId eq githubId }
            .map(User::wrapRow)
            .firstOrNull() ?: throw ResourceNotFoundException("User not found")
    }

    fun create(init: User.() -> Unit): User {
        return User.new(init)
    }

    fun searchByUsername(username: String): List<User> {
        return UserEntity
            .selectAll()
            .where {
                UserEntity.username.lowerCase() like ("%${username.lowercase()}%")
            }
            .limit(6)
            .map(User::wrapRow)
    }
}